# ASCII-only: rename ALL.md -> 0-ALL.md; generate 0-ALL.-重点.md and 0-ALL.-AI.md
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$DOCS = Join-Path $Root "docs"
$CFG = Join-Path $Root "_gen_0all_cfg.json"
$utf8 = New-Object System.Text.UTF8Encoding $false

$cfgText = [IO.File]::ReadAllText($CFG, [Text.Encoding]::UTF8)
$cfg = $cfgText | ConvertFrom-Json
$includeKw = @($cfg.include_keywords)
$excludeKw = @($cfg.exclude_keywords)
$checklist = @($cfg.checklist)

function Test-Important([string]$source, [string]$title, [string]$body) {
  $s = ($source + " " + $title)
  foreach ($e in $excludeKw) {
    if ($s.IndexOf([string]$e, [StringComparison]::OrdinalIgnoreCase) -ge 0) { return $false }
  }
  foreach ($i in $includeKw) {
    if ($s.IndexOf([string]$i, [StringComparison]::OrdinalIgnoreCase) -ge 0) { return $true }
  }
  if ($body.Length -gt 1200 -and $source -match '\.md$' -and $source -notmatch 'README') { return $true }
  return $false
}

function Get-Sections([string]$allPath) {
  $text = [IO.File]::ReadAllText($allPath, [Text.Encoding]::UTF8)
  $list = New-Object System.Collections.Generic.List[object]
  $rx = [regex]::new('(?s)<!--\s*source:\s*(?<src>.+?)\s*-->(?<body>.*?)(?=<!--\s*source:|\z)')
  foreach ($m in $rx.Matches($text)) {
    $source = $m.Groups['src'].Value.Trim()
    $body = $m.Groups['body'].Value.Trim()
    if (-not $body) { continue }
    $title = ''
    if ($body -match '(?m)^title:\s*(.+)$') { $title = $Matches[1].Trim().Trim('"').Trim("'") }
    elseif ($body -match '(?m)^#\s+(.+)$') { $title = $Matches[1].Trim() }
    else { $title = [IO.Path]::GetFileNameWithoutExtension(($source -replace '/','\')) }
    [void]$list.Add([pscustomobject]@{ Source = $source; Title = $title; Body = $body })
  }
  # Emit items one-by-one; caller must wrap with @() / List — never return a nested Object[].
  foreach ($item in $list) { $item }
}

function Normalize-Sections($sections) {
  $out = New-Object System.Collections.Generic.List[object]
  foreach ($s in @($sections)) {
    if ($null -eq $s) { continue }
    # Flatten accidental nested Object[] from PowerShell array wrapping
    if ($s -is [System.Array] -and -not ($s -is [string])) {
      foreach ($x in $s) {
        if ($null -ne $x -and $null -ne $x.PSObject.Properties['Source']) { [void]$out.Add($x) }
      }
      continue
    }
    if ($null -ne $s.PSObject.Properties['Source']) { [void]$out.Add($s) }
  }
  return $out
}

function Get-SupplementKey([string]$rel) {
  $d = $rel.Replace('\','/')
  if ($d -eq 'ai' -or $d.StartsWith('ai/')) { return 'ai' }
  if ($d -eq 'java' -or $d.StartsWith('java/')) { return 'java' }
  $top = ($d -split '/')[0]
  if ($cfg.path_aliases -and $cfg.path_aliases.PSObject.Properties[$top]) {
    return [string]$cfg.path_aliases.PSObject.Properties[$top].Value
  }
  $keys = @($cfg.supplements.PSObject.Properties.Name)
  foreach ($k in $keys) {
    if ($k -eq 'default') { continue }
    if ($top -eq $k -or $d.StartsWith($k + '/')) { return $k }
  }
  foreach ($k in $keys) {
    if ($top.StartsWith('AI') -and $k.StartsWith('AI')) { return $k }
  }
  return 'default'
}

function Get-AiExtra([string]$rel) {
  $key = Get-SupplementKey $rel
  $lines = New-Object System.Collections.Generic.List[string]
  foreach ($line in @($cfg.ai_extra_header)) { $lines.Add([string]$line) | Out-Null }
  $prop = $cfg.supplements.PSObject.Properties[$key]
  if (-not $prop) { $prop = $cfg.supplements.PSObject.Properties['default'] }
  foreach ($line in @($prop.Value)) { $lines.Add([string]$line) | Out-Null }
  $lines.Add('') | Out-Null
  foreach ($line in $checklist) { $lines.Add([string]$line) | Out-Null }
  $lines.Add('') | Out-Null
  return ($lines -join "`n")
}

function Write-Agg([string]$outPath, [string]$title, [string]$intro, $sections, [string]$extra) {
  $secs = Normalize-Sections $sections
  $sb = New-Object System.Text.StringBuilder
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine(('title: {0}' -f $title))
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine(('# {0}' -f $title))
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine($intro)
  [void]$sb.AppendLine('')
  if ($extra) {
    [void]$sb.AppendLine($extra)
    [void]$sb.AppendLine('')
  }
  if ($secs.Count -eq 0) {
    [void]$sb.AppendLine('_No matched articles. See 0-ALL.md._')
    [void]$sb.AppendLine('')
  } else {
    [void]$sb.AppendLine('## TOC')
    [void]$sb.AppendLine('')
    $n = 1
    foreach ($s in $secs) {
      [void]$sb.AppendLine(('{0}. {1} (`{2}`)' -f $n, [string]$s.Title, [string]$s.Source))
      $n++
    }
    [void]$sb.AppendLine('')
    $n = 1
    foreach ($s in $secs) {
      [void]$sb.AppendLine('---')
      [void]$sb.AppendLine('')
      [void]$sb.AppendLine(('<!-- source: {0} -->' -f [string]$s.Source))
      [void]$sb.AppendLine('')
      [void]$sb.AppendLine(('## [{0}] {1}' -f $n, [string]$s.Title))
      [void]$sb.AppendLine('')
      [void]$sb.AppendLine([string]$s.Body)
      [void]$sb.AppendLine('')
      $n++
    }
  }
  [IO.File]::WriteAllText($outPath, $sb.ToString(), $utf8)
}

Write-Host '=== rename ALL.md -> 0-ALL.md (if any) ==='
Get-ChildItem $DOCS -Recurse -Filter 'ALL.md' -File | Where-Object {
  $_.FullName -notmatch '\\.vuepress\\' -and $_.FullName -notmatch '\\_zh_dup'
} | ForEach-Object {
  $dest = Join-Path $_.DirectoryName '0-ALL.md'
  if (Test-Path -LiteralPath $dest) { Remove-Item -LiteralPath $dest -Force }
  Rename-Item -LiteralPath $_.FullName -NewName '0-ALL.md'
  Write-Host ('REN {0}' -f $_.DirectoryName.Substring($DOCS.Length+1))
}

Write-Host '=== generate focus/AI files ==='
Get-ChildItem $DOCS -Recurse -Filter '0-ALL.md' -File | Where-Object {
  $_.FullName -notmatch '\\.vuepress\\' -and $_.FullName -notmatch '\\_zh_dup'
} | ForEach-Object {
  $dir = $_.DirectoryName
  $rel = $dir.Substring($DOCS.Length).TrimStart('\','/')
  $dirName = Split-Path $dir -Leaf
  $sections = Normalize-Sections (Get-Sections $_.FullName)
  $important = Normalize-Sections ($sections | Where-Object { Test-Important $_.Source $_.Title $_.Body })
  if ($important.Count -eq 0 -and $sections.Count -gt 0) {
    $take = [Math]::Min(8, $sections.Count)
    $important = Normalize-Sections ($sections | Sort-Object { $_.Body.Length } -Descending | Select-Object -First $take)
  }

  $focusIntro = [string]$cfg.focus_intro
  Write-Agg (Join-Path $dir ([string]$cfg.focus_filename)) ($dirName + [string]$cfg.focus_title_suffix) $focusIntro $important $null

  $useAll = ($_.Length -lt 180KB)
  $aiSections = if ($useAll) { $sections } else { $important }
  $aiIntro = if ($useAll) { [string]$cfg.ai_intro_full } else { [string]$cfg.ai_intro_large }
  Write-Agg (Join-Path $dir ([string]$cfg.ai_filename)) ($dirName + [string]$cfg.ai_title_suffix) $aiIntro $aiSections (Get-AiExtra $rel)

  Write-Host ('OK {0} total={1} focus={2} ai={3}' -f $rel, $sections.Count, $important.Count, $aiSections.Count)
}

Write-Host 'DONE'

---
title: git ALL
---

# git

> Aggregate of markdown under this directory (excludes README.md, TODO.md).


---

<!-- source: Git 核心概念总结.md -->

---
title: Git 核心概念总结
description: 总结 Git 的核心概念与工作流，涵盖分支与合并、提交管理与冲突解决，助力团队协作与代码质量提升。
category: 开发工具
tag:
  - Git
head:
  - - meta
    - name: keywords
      content: Git,版本控制,分布式,分支,提交,合并,冲突解决,工作流
---

## 版本控制

### 什么是版本控制

版本控制是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统。 除了项目源代码，你可以对任何类型的文件进行版本控制。

### 为什么要版本控制

有了它你就可以将某个文件回溯到之前的状态，甚至将整个项目都回退到过去某个时间点的状态，你可以比较文件的变化细节，查出最后是谁修改了哪个地方，从而找出导致怪异问题出现的原因，又是谁在何时报告了某个功能缺陷等等。

### 本地版本控制系统

许多人习惯用复制整个项目目录的方式来保存不同的版本，或许还会改名加上备份时间以示区别。 这么做唯一的好处就是简单，但是特别容易犯错。 有时候会混淆所在的工作目录，一不小心会写错文件或者覆盖意想外的文件。

为了解决这个问题，人们很久以前就开发了许多种本地版本控制系统，大多都是采用某种简单的数据库来记录文件的历次更新差异。

![本地版本控制系统](https://oss.javaguide.cn/github/javaguide/开发工具/git/%E6%9C%AC%E5%9C%B0%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

### 集中化的版本控制系统

接下来人们又遇到一个问题，如何让在不同系统上的开发者协同工作？ 于是，集中化的版本控制系统（Centralized Version Control Systems，简称 CVCS）应运而生。

集中化的版本控制系统都有一个单一的集中管理的服务器，保存所有文件的修订版本，而协同工作的人们都通过客户端连到这台服务器，取出最新的文件或者提交更新。

![集中化的版本控制系统](https://oss.javaguide.cn/github/javaguide/开发工具/git/%E9%9B%86%E4%B8%AD%E5%8C%96%E7%9A%84%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

这么做虽然解决了本地版本控制系统无法让在不同系统上的开发者协同工作的诟病，但也还是存在下面的问题：

- **单点故障：** 中央服务器宕机，则其他人无法使用；如果中心数据库磁盘损坏又没有进行备份，你将丢失所有数据。本地版本控制系统也存在类似问题，只要整个项目的历史记录被保存在单一位置，就有丢失所有历史更新记录的风险。
- **必须联网才能工作：** 受网络状况、带宽影响。

### 分布式版本控制系统

于是分布式版本控制系统（Distributed Version Control System，简称 DVCS）面世了。 Git 就是一个典型的分布式版本控制系统。

这类系统，客户端并不只提取最新版本的文件快照，而是把代码仓库完整地镜像下来。 这么一来，任何一处协同工作用的服务器发生故障，事后都可以用任何一个镜像出来的本地仓库恢复。 因为每一次的克隆操作，实际上都是一次对代码仓库的完整备份。

![分布式版本控制系统](https://oss.javaguide.cn/github/javaguide/开发工具/git/%E5%88%86%E5%B8%83%E5%BC%8F%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6%E7%B3%BB%E7%BB%9F.png)

分布式版本控制系统可以不用联网就可以工作，因为每个人的电脑上都是完整的版本库，当你修改了某个文件后，你只需要将自己的修改推送给别人就可以了。但是，在实际使用分布式版本控制系统的时候，很少会直接进行推送修改，而是使用一台充当“中央服务器”的东西。这个服务器的作用仅仅是用来方便“交换”大家的修改，没有它大家也一样干活，只是交换修改不方便而已。

分布式版本控制系统的优势不单是不必联网这么简单，后面我们还会看到 Git 极其强大的分支管理等功能。

## 认识 Git

### Git 简史

Linux 内核项目组当时使用分布式版本控制系统 BitKeeper 来管理和维护代码。但是，后来开发 BitKeeper 的商业公司同 Linux 内核开源社区的合作关系结束，他们收回了 Linux 内核社区免费使用 BitKeeper 的权力。 Linux 开源社区（特别是 Linux 的缔造者 Linus Torvalds）基于使用 BitKeeper 时的经验教训，开发出自己的版本系统，而且对新的版本控制系统做了很多改进。

### Git 与其他版本管理系统的主要区别

Git 在保存和对待各种信息的时候与其它版本控制系统有很大差异，尽管操作起来的命令形式非常相近，理解这些差异将有助于防止你使用中的困惑。

下面我们主要说一个关于 Git 与其他版本管理系统的主要差别：**对待数据的方式**。

**Git 采用的是直接记录快照的方式，而非差异比较。我后面会详细介绍这两种方式的差别。**

大部分版本控制系统（CVS、Subversion、Perforce、Bazaar 等等）都是以文件变更列表的方式存储信息，这类系统**将它们保存的信息看作是一组基本文件和每个文件随时间逐步累积的差异。**

具体原理如下图所示，理解起来其实很简单，每当我们提交更新一个文件之后，系统都会记录这个文件做了哪些更新，以增量符号 Δ(Delta)表示。

![](https://oss.javaguide.cn/github/javaguide/开发工具/git/2019-3deltas.png)

**我们怎样才能得到一个文件的最终版本呢？**

很简单，高中数学的基本知识，我们只需要将这些原文件和这些增加进行相加就行了。

**这种方式有什么问题呢？**

比如我们的增量特别特别多的话，如果我们要得到最终的文件是不是会耗费时间和性能。

Git 不按照以上方式对待或保存数据。 反之，Git 更像是把数据看作是对小型文件系统的一组快照。 每次你提交更新，或在 Git 中保存项目状态时，它主要对当时的全部文件制作一个快照并保存这个快照的索引。 为了高效，如果文件没有修改，Git 不再重新存储该文件，而是只保留一个链接指向之前存储的文件。 Git 对待数据更像是一个 **快照流**。

![](https://oss.javaguide.cn/github/javaguide/开发工具/git/2019-3snapshots.png)

### Git 的三种状态

Git 有三种状态，你的文件可能处于其中之一：

1. **已提交（committed）**：数据已经安全的保存在本地数据库中。
2. **已修改（modified）**：已修改表示修改了文件，但还没保存到数据库中。
3. **已暂存（staged）**：表示对一个已修改文件的当前版本做了标记，使之包含在下次提交的快照中。

由此引入 Git 项目的三个工作区域的概念：**Git 仓库(.git directory)**、**工作目录(Working Directory)** 以及 **暂存区域(Staging Area)** 。

![](https://oss.javaguide.cn/github/javaguide/开发工具/git/2019-3areas.png)

**基本的 Git 工作流程如下：**

1. 在工作目录中修改文件。
2. 暂存文件，将文件的快照放入暂存区域。
3. 提交更新，找到暂存区域的文件，将快照永久性存储到 Git 仓库目录。

## Git 使用快速入门

### 获取 Git 仓库

有两种取得 Git 项目仓库的方法。

1. 在现有目录中初始化仓库：进入项目目录运行 `git init` 命令，该命令会创建一个名为 `.git` 的子目录。
2. 从一个服务器克隆一个现有的 Git 仓库：`git clone [url]`。如果想自定义本地目录名，可以使用 `git clone [url] directoryname`。

### 记录每次更新到仓库

1. **检测当前文件状态** : `git status`
2. **提出更改（把它们添加到暂存区）**：`git add filename`（针对特定文件）、`git add .`（当前目录下所有改动）、`git add *.txt`（支持通配符，所有 `.txt` 文件）。
3. **忽略文件**：`.gitignore` 文件
4. **提交更新**：`git commit -m "代码提交信息"`。每次准备提交前，先用 `git status` 看一下是否都已暂存。
5. **跳过使用暂存区域更新的方式**：`git commit -a -m "代码提交信息"`。`git commit` 加上 `-a` 选项，Git 会自动把所有已经跟踪过的文件暂存起来一并提交，从而跳过 `git add` 步骤。
6. **移除文件**：`git rm filename` （从暂存区域移除，然后提交。）
7. **对文件重命名**：`git mv README.md README`(这个命令相当于`mv README.md README`、`git rm README.md`、`git add README` 这三条命令的集合)

### 一个好的 Git 提交消息

一个好的 Git 提交消息如下：

```plain
标题行：用这一行来描述和解释你的这次提交

主体部分可以是很少的几行，来加入更多的细节来解释提交，最好是能给出一些相关的背景或者解释这个提交能修复和解决什么问题。

主体部分当然也可以有几段，但是一定要注意换行和句子不要太长。因为这样在使用 "git log" 的时候会有缩进比较好看。
```

提交的标题行描述应该尽量的清晰和尽量的一句话概括。这样就方便相关的 Git 日志查看工具显示和其他人的阅读。

### 推送改动到远程仓库

- 如果你还没有克隆现有仓库，并想将你的仓库连接到某个远程服务器，可以使用如下命令添加：`git remote add origin <server>`。比如要让本地仓库和 GitHub 上创建的仓库关联，可以这样写：`git remote add origin https://github.com/Snailclimb/test.git`。
- 将这些改动提交到远端仓库：`git push origin main`。这里的 `main` 可以换成你想要推送的任何分支。很多老项目的默认分支仍然叫 `master`，以实际仓库为准。

  如此你就能够将你的改动推送到所添加的服务器上去了。

### 远程仓库的移除与重命名

- 将 test 重命名为 test1：`git remote rename test test1`
- 移除远程仓库 test1:`git remote rm test1`

### 查看提交历史

在提交了若干更新，又或者克隆了某个项目之后，你也许想回顾下提交历史。 完成这个任务最简单而又有效的工具是 `git log` 命令。`git log` 会按提交时间列出所有的更新，最近的更新排在最上面。

**可以添加一些参数来查看自己希望看到的内容：**

只看某个人的提交记录：

```shell
git log --author=bob
```

### 撤销操作

有时候我们提交完了才发现漏掉了几个文件没有添加，或者提交信息写错了。 此时，可以运行带有 `--amend` 选项的提交命令尝试重新提交：

```shell
git commit --amend
```

取消暂存的文件：

```shell
git restore --staged filename
```

老版本 Git 也常见下面这种写法：

```shell
git reset filename
```

撤消对文件的修改：

```shell
git restore filename
```

老版本 Git 也常见下面这种写法：

```shell
git checkout -- filename
```

假如你想丢弃你在本地的所有改动与提交，可以到服务器上获取最新的版本历史，并将你本地主分支指向它：

```shell
git fetch origin
git reset --hard origin/main
```

注意：`git reset --hard` 会丢弃本地未提交改动，执行前一定要确认没有需要保留的内容。老项目如果默认分支是 `master`，对应命令改成 `git reset --hard origin/master`。

### 分支

分支是用来隔离不同开发任务的。在其他分支上开发功能或修复问题，完成后再合并回主分支。现在很多仓库默认分支叫 `main`，老项目中也经常能看到 `master`。

我们通常在开发新功能、修复一个紧急 bug 等等时候会选择创建分支。单分支开发好还是多分支开发好，还是要看具体场景来说。

创建一个名字叫做 test 的分支

```shell
git branch test
```

切换当前分支到 `test`（当你切换分支的时候，Git 会重置你的工作目录，使其看起来像回到了你在那个分支上最后一次提交的样子。Git 会自动添加、删除、修改文件，以确保此时你的工作目录和这个分支最后一次提交时的样子一致）。

```shell
git switch test
```

老版本 Git 也常见 `git checkout test` 这种写法。

![](https://oss.javaguide.cn/github/javaguide/开发工具/git/2019-3%E5%88%87%E6%8D%A2%E5%88%86%E6%94%AF.png)

你也可以直接这样创建分支并切换过去：

```shell
git switch -c feature_x
```

老版本 Git 也常见 `git checkout -b feature_x` 这种写法。

切换到主分支

```shell
git switch main
```

合并分支(可能会有冲突)

```shell
git merge test
```

把新建的分支删掉

```shell
git branch -d feature_x
```

将分支推送到远端仓库（推送成功后其他人可见）：

```shell
git push origin feature_x
```

## 学习资料推荐

**在线演示学习工具：**

「补充，来自[issue729](https://github.com/Snailclimb/JavaGuide/issues/729)」Learn Git Branching <https://oschina.gitee.io/learn-git-branching/> 。该网站可以方便的演示基本的 git 操作，讲解得明明白白。每一个基本命令的作用和结果。

**推荐阅读：**

- [Git 入门图文教程(1.5W 字 40 图)](https://www.cnblogs.com/anding/p/16987769.html)：超用心的一篇文章，内容全面且附带详细的图解，强烈推荐！
- [Git - 简明指南](https://rogerdudler.github.io/git-guide/index.zh.html)：涵盖 Git 常见操作，非常清晰。
- [图解 Git](https://marklodato.github.io/visual-git-guide/index-zh-cn.html)：图解 Git 中的最常用命令。如果你稍微理解 git 的工作原理，这篇文章能够让你理解的更透彻。
- [猴子都能懂得 Git 入门](https://backlog.com/git-tutorial/cn/项目介绍/intro1_1.html)：有趣的讲解。
- [Pro Git book](https://git-scm.com/book/zh/v2)：国外的一本 Git 书籍，被翻译成多国语言，质量很高。

<!-- @include: @article-footer.snippet.md -->


---

<!-- source: GitHub 实用小技巧总结.md -->

---
title: GitHub 实用小技巧总结
description: 汇总 GitHub 的高效使用技巧，包括个人主页、项目徽章、代码阅读、GitHub Actions、Explore/Trending 和开源协作提效方法。
category: 开发工具
tag:
  - Git
head:
  - - meta
    - name: keywords
      content: GitHub 技巧,个人主页,README,统计信息,开源贡献,GitHub Actions,代码阅读
---

GitHub 不只是代码托管平台。对开发者来说，它同时承担了项目展示、代码阅读、开源协作、自动化构建和个人主页的作用。这篇文章整理一些比较实用的 GitHub 使用技巧。

## 一键生成 GitHub 简历与 GitHub 年报

通过 [https://resume.github.io/](https://resume.github.io/) 这个网站你可以一键生成一个在线的 GitHub 简历。

不过，简历里是否放 GitHub 链接要看账号内容质量。如果账号里有完整项目、持续维护记录、清晰 README 和比较规范的提交历史，GitHub 链接会加分；如果只有空仓库或者临时练习代码，就没必要强行放。生成后的效果如下图所示。

![GitHub简历](https://oss.javaguide.cn/2020-11/image-20201108192205620.png)

通过 <https://www.githubtrends.io/wrapped> 这个网站，你可以生成一份 GitHub 个人年报，这个年报会列举出你在这一年的项目贡献情况、最常使用的编程语言、详细的贡献信息。

![](https://oss.javaguide.cn/github/dootask/image-20211226144607457.png)

## 个性化 GitHub 首页

GitHub 目前支持在个人主页自定义展示一些内容。展示效果如下图所示。

![个性化首页展示效果](https://oss.javaguide.cn/java-guide-blog/image-20210616221212259.png)

想要做到这样非常简单，你只需要创建一个和你的 GitHub 账户同名的仓库，然后自定义`README.md`的内容即可。

展示在你主页的自定义内容就是`README.md`的内容（_不会 Markdown 语法的小伙伴自行面壁 5 分钟_）。

![创建一个和你的GitHub账户同名的仓库](https://oss.javaguide.cn/java-guide-blog/image-20201107110309341.png)

这个也是可以玩出花来的！比如说：通过 [github-readme-stats](https://hellogithub.com/periodical/statistics/click/?target=https://github.com/anuraghazra/github-readme-stats) 这个开源项目，你可以在 README 中展示动态生成的 GitHub 统计信息。展示效果如下图所示。

![通过github-readme-stats动态生成GitHub统计信息 ](https://oss.javaguide.cn/java-guide-blog/image-20210616221312426.png)

关于个性化首页这个就不多提了，感兴趣的小伙伴自行研究一下。

## 自定义项目徽章

你在 GitHub 上看到的项目徽章都是通过 [https://shields.io/](https://shields.io/) 这个网站生成的。我的 JavaGuide 这个项目的徽章如下图所示。

![项目徽章](https://oss.javaguide.cn/2020-11/image-20201107143136559.png)

并且，你不光可以生成静态徽章，shield.io 还可以动态读取你项目的状态并生成对应的徽章。

![自定义项目徽章](https://oss.javaguide.cn/2020-11/image-20201107143502356.png)

生成的描述项目状态的徽章效果如下图所示。

![描述项目状态的徽章](https://oss.javaguide.cn/2020-11/image-20201107143752642.png)

## 自动为项目添加贡献情况图标

通过 repobeats 这个工具可以为 GitHub 项目添加如下图所示的项目贡献基本情况图表。

![](https://oss.javaguide.cn/github/dootask/repobeats.png)

地址：<https://repobeats.axiom.co/> 。

## GitHub 表情

![GitHub表情](https://oss.javaguide.cn/2020-11/image-20201107162254582.png)

如果你想要在 GitHub 使用表情的话，可以在这里找找：[www.webfx.com/开发工具/emoji-cheat-sheet/](https://www.webfx.com/开发工具/emoji-cheat-sheet/)。

![在线GitHub表情](https://oss.javaguide.cn/2020-11/image-20201107162432941.png)

## 高效阅读 GitHub 项目的源代码

GitHub Codespaces 可以提供类似 VS Code 的在线开发环境，适合临时阅读、调试或快速参与开源项目。对于大型项目或需要本地服务依赖的项目，还是建议 clone 到本地，用自己熟悉的 IDE 阅读和调试。

简单介绍几种常用的 GitHub 项目源码阅读方式。

### Chrome 插件 Octotree

这个已经老生常谈了，是我最喜欢的一种方式。使用了 Octotree 之后网页侧边栏会按照树形结构展示项目，为我们带来 IDE 般的阅读源代码的感受。

![Chrome插件Octotree](https://oss.javaguide.cn/2020-11/image-20201107144944798.png)

### Sourcegraph

不想将项目 clone 到本地时，也可以使用 Sourcegraph 这类代码搜索和阅读工具。Sourcegraph 支持跨仓库代码搜索、引用跳转等功能，阅读大型项目时比较有帮助。

当你下载了这个插件之后，你的项目主页会多出一个小图标如下图所示。点击这个小图标即可在线阅读项目源代码。

![](https://oss.javaguide.cn/2020-11/image-20201107145749659.png)

使用 Sourcegraph 阅读代码的效果类似下面这样，同样是树形结构展示代码，还支持类之间的跳转。

![](https://oss.javaguide.cn/2020-11/image-20201107150307314.png)

### 克隆项目到本地

先把项目克隆到本地，然后使用自己喜欢的 IDE 来阅读。想深入理解一个项目，首选这种方式。

```bash
git clone https://github.com/Snailclimb/JavaGuide.git
```

## 扩展 GitHub 的功能

**Enhanced GitHub** 可以让你的 GitHub 更好用。这个浏览器插件可以展示仓库大小、文件大小，并支持快速下载单个文件。

![](https://oss.javaguide.cn/2020-11/image-20201107160817672.png)

## 自动为 Markdown 文件生成目录

如果你想为 Markdown 文件生成目录，通过 VS Code 的 **Markdown Preview Enhanced** 这类插件就可以了。

生成的目录效果如下图所示。你直接点击目录中的链接即可跳转到文章对应的位置，可以优化阅读体验。

![](<https://oss.javaguide.cn/2020-11/iShot2020-11-07%2016.14.14%20(1).png>)

不过，目前 GitHub 已经会为 Markdown 文件自动生成目录，只是需要通过页面上的目录按钮展开。

![](https://oss.javaguide.cn/github/cosy/image-20211227093215005.png)

## 善用 GitHub Explore

GitHub 自带的 Explore 是一个非常强大且好用的功能，适合用来发现项目、主题和技术趋势。

简单来说，GitHub Explore 可以提供下面这些服务：

1. 可以根据你的个人兴趣为你推荐项目；
2. GitHub Topics 按照类别/话题将一些项目进行了分类汇总。比如 [Data visualization](https://github.com/topics/data-visualization) 汇总了数据可视化相关的一些开源项目，[Awesome Lists](https://github.com/topics/awesome) 汇总了 Awesome 系列的仓库；
3. 通过 GitHub Trending 我们可以看到最近比较热门的一些开源项目，我们可以按照语言类型以及时间维度对项目进行筛选；
4. GitHub Collections 类似一个收藏夹集合。比如 [Teaching materials for computational social science](https://github.com/collections/teaching-computational-social-science) 这个收藏夹就汇总了计算机课程相关的开源资源，[Learn to Code](https://github.com/collections/learn-to-code) 这个收藏夹就汇总了对你学习编程有帮助的一些仓库；
5. ……

![](https://oss.javaguide.cn/github/javaguide/github-explore.png)

## GitHub Actions 很强大

你可以简单地将 GitHub Actions 理解为 GitHub 自带的自动化平台。通过 GitHub Actions，你可以直接在 GitHub 上完成构建、测试、部署、依赖扫描、定时任务等工作。

关于 GitHub Actions 的详细介绍，推荐看一下阮一峰老师写的 [GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html) 。

GitHub Actions 有一个官方市场，上面有很多别人提交的 Actions，可以直接复用。

![](https://oss.javaguide.cn/github/javaguide/image-20211227100147433.png)

## 后记

GitHub 技巧不需要一次性全部记住。个人主页、项目徽章、代码阅读、Explore/Trending、GitHub Actions 这几块先用起来，就已经能覆盖大部分日常场景。

另外，这篇文章没有展开讲 GitHub 搜索语法。实际使用中，关键词搜索、语言筛选、Star 数排序、更新时间筛选，往往比死记复杂语法更常用。

<!-- @include: @article-footer.snippet.md -->


---
category:
  - Java企业级开发
tag:
  - 辅助工具
title: Homebrew，GitHub 星标 32.5k+的 macOS 命令行软件管理神器，功能真心强大！
shortTitle: Homebrew：macOS软件管理器
description: Homebrew，GitHub 星标 32.5k+的 macOS 命令行软件管理神器，功能真心强大！
head:
  - - meta
    - name: keywords
      content: 辅助工具,GitHub,macos Homebrew,Homebrew教程,Homebrew镜像,Homebrew国内安装
---

## 前言（废话）

本来打算在公司偷偷摸摸给星球的用户写一篇编程喵整合 MongoDB 的文章，结果在通过 brew 安装 MongoDB 的时候竟然报错了。原因很简单，公司这台 Mac 上的 homebrew 环境没有配置好。刚好 Java程序员进阶之路上缺少这样一篇内容。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-c6756a26-8767-4135-be4c-b31d42de2a89.png)

所以我就想，不如趁机水一篇吧，啊，不不不，趁机给小伙伴们普及一下 Homebrew 吧！瞧我这该死的大公无私的心（手动狗头）。

不会吧？不会还有人用 macOS 没有安装/配置 Homebrew 吧？


## Homebrew 能干什么

>Homebrew 的 Slogan ：The missing package manager for macOS (or Linux)

Homebrew 这款命令行软件管理神器在 GitHub 上已经有 32.5k+ 的 star 了，功能也真心强大，几乎 macOS 上的软件包它都包了。Homebrew 本身没有问题，问题在于。。。。。不说了，你懂的。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-726f97d9-4de2-4d23-9973-d1a39951a0f7.png)

Homebrew 除了是 macOS 的包管理器也可以装在 Linux 上成为 Linux 的包管理器，仅需要执行相应的命令，就能下载安装需要的软件包，省去了下载、解压、拖拽等繁琐的步骤。

用 Homebrew 官方的话来总结就是：安装 Apple（或 Linux 系统）没有预装但你需要的软件。比如说安装 MongoDB，只需要执行以下命令就可以安装，前提条件是环境一定要配置好。

```
brew install mongodb
```

简单一条命令，就可以实现包管理，还不用担心依赖/文件路径等问题。

Homebrew 主要由四个部分组成: brew、homebrew-core 、homebrew-cask、homebrew-bottles。

- brew：Homebrew 的源代码仓库
- homebrew-core：Homebrew 的核心源
- homebrew-cask：提供 macOS 应用和大型二进制文件的安装
- homebrew-bottles：预编译二进制软件包

再来了解一下 Homebrew 的接个核心概念，后续会经常用到。

- formula（e），安装包的描述文件，带 e 为复数
- cellar，包安装好后所在的目录
- bottle，预先编译好的包，不需要再下载源码编译，速度会快很多，官方库中的包大多数是通过 bottle 方式安装的
- tap，下载源
- cask（s），安装 macOS native 应用的扩展，可以理解为有图形化界面的应用，带 s 为复数
- bundle，描述 Homebrew 依赖的扩展

## 安装配置 Homebrew

>世上无难事，只要找到 Homebrew 的正确安装方式。

按理说，Homebrew 的安装方式非常简单，只需要执行官方的一句命令就可以完成安装了。

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

但国内开发者命苦就苦在，经常会因为网络的原因安装失败。原因我只能说这是 `https://raw.githubusercontent.com` 网站的锅，谁让它访问不稳定呢？

怎么办呢？

必须换一种高效且科学的安装方式，那就是使用镜像安装。 Gitee 上有开源作者提供了一键安装包，只需要执行以下命令就可以了。

```
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

安装脚本里提供了中科大、清华大学、北京外国语大学、腾讯、阿里巴巴等下载源。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-e7eaf096-7477-4ed0-814a-07ef8d62884f.png)

但过来人告诉你，别选其他镜像源，就选中科大，速度杠杠的，40-50M/s，这速度比其他镜像源快多了，对比起来，其他就是蜗牛🐌。




![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-f0c3c481-f474-47b2-8b5e-17f8fc2b9a80.png)



这个安装脚本非常的智能，几乎可以一件帮我们搞定所有问题。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-7c539545-d26e-45e8-9f81-bb5b439342eb.png)

再次感谢 Gitee 上这位大牛，已经 3k star 了，我把地址贴出来：

>[https://gitee.com/cunkai/HomebrewCN](https://gitee.com/cunkai/HomebrewCN)



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-aebf4ced-58f4-4d31-892c-4a8382cf3677.png)

brew 本体安装成功后，会提示我们配置国内镜像源。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-6866eb09-75fb-4f19-9ff4-b80fd02816e9.png)

nice，安装完成了。执行下面这几个命令体验下。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-33bcd6a1-d843-4a6c-a8ac-0d908095da79.png)

- `brew ls` 查看本地命令；
- `brew search mongodb` 查找软件；
- `brew -v` 查看版本；
- `brew update` 更新版本；
- `brew install --cask firefox` 安装图形化界面软件
- `brew config` 查看配置。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-ac0e141f-301c-46f1-bd80-5375eb50dc4d.png)



## brew 和 brew cask 的区别

这里顺带说一下 brew 和 brew cask 的区别，这也是一开始我使用 brew 时困惑的一个点。

以前的版本中，是可以直接 `brew cask list` 这样执行命令的，现在改成了 `brew list --cask`。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-c5403959-01fd-4610-b08c-4ca4e4cb0a66.png)

brew 是从下载源码开始，然后编译（不一定，有些有现成的 bottle）解压，通过 `./configure && make install` 进行安装，同时会包含相关的依赖库。环境变量也是自动配置的。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-d27ec07e-cf3c-4504-9174-60881d2710fb.png)


brew cask 是下载解压已经编译好了的软件包（.dmg/.pkg），放在统一的目录中，省去了手动去下载、解压、拖拽等蛋疼步骤。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-566f4437-62de-49e5-89a7-7c666a2ad9c1.png)

通过 `brew search google` 我们也可以看得出两者之间的区别。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-441127b1-f7ae-484e-801b-5b808f8e283c.png)

- 「Formulae」一般是那些命令行工具、开发库、字体、插件等不含 GUI 界面的软件。
- 「Cask」就会包含一些 GUI 图形化界面的软件，如 Google Chrome、FireFox 、Atom 等


## 使用 Homebrew

Homebrew安装配置完成后，我们来实操体验两把。

这里是 homebrew 常用命令的一个清单，可供参考。

命令| 描述
---|---
brew update|  更新 Homebrew
brew search package|  搜索软件包
brew install package| 安装软件包
brew uninstall package| 卸载软件包
brew upgrade| 升级所有软件包
brew upgrade package| 升级指定软件包
brew list|  列出已安装的软件包列表
brew services command package|  管理 brew 安装软件包
brew services list| 列出 brew 管理运行的服务
brew info package|  查看软件包信息
brew deps package|  列出软件包的依赖关系
brew help|  查看帮助
brew cleanup| 清除过时软件包
brew link package|  创建软件包符号链接
brew unlink package|  取消软件包符号链接
brew doctor|  检查系统是否存在问题
brew tap [user/repo] | 将开源仓库添加到源

### 第一把，使用 Homebrew 安装 JDK

作为一名 Java 后端程序员，JDK 是必须要安装的，对吧？

1）执行 `brew search jdk` 查找有哪些可供安装的 JDK

2）执行 `brew install openjdk@17` 安装 JDK。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-b4d7684b-2db8-4286-bf2e-389c2aed5968.png)

3）但我们在 macOS 上安装了多个版本的 JDK 后，怎么管理它们呢？可以安装一下 jEnv，一个帮助我们管理 JAVA_HOME 的命令行工具，在 GitHub 上已经收获 4.3k 的 star。

>GitHub 地址：[https://github.com/jenv/jenv](https://github.com/jenv/jenv)


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-1034fcfd-22a7-4968-8b6f-fb2e67d22855.png)

官方文档也非常的简洁大方：

>[https://www.jenv.be/](https://www.jenv.be/)



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-2e10e772-1944-474a-bbfa-b3ef3e0ec9d4.png)

安装：

```
brew install jenv
```

配置：

```
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc
```

添加：

```
jenv add /usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home/
```



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-b126c35d-edab-48a9-9543-831cfd0a51c6.png)


JDK 的安装路径可以通过下图的位置查找。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-a32accec-4044-480c-a8c8-3781bc5048b5.png)

管理：

```
jenv versions
jenv global 17.0.3
```



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-cc01fad8-53e9-4474-8923-08e97ac7090a.png)

是不是贼方便？再也不用整这 `echo 'export PATH="/usr/local/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc` 玩意了！爽，实在是爽！

### 第二把，使用 Homebrew 安装 MongoDB

先看 MongoDB 的官方文档（当前 release 版本是 5.0，我这里就先用上一个稳定版 4.4）：

>[https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-os-x/](https://www.mongodb.com/docs/v4.4/tutorial/install-mongodb-on-os-x/)

1）拉取 MongoDB 的源

```
brew tap mongodb/brew
```



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-4819ca75-01e3-4dea-8859-7c9ddd570142.png)


2）更新 brew

```
brew update
```

3）安装 MongoDB

```
brew install mongodb-community@4.4
```

 OK，安装成功。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-e934f3f3-c7de-4537-8c30-73c0e9fb41b4.png)

## 小结

通过 Homebrew 下载的软件基本上来自于官网，所以大可以放心。而且而且它尽可能地利用了系统自带的各种库，使得软件包的编译时间大大缩短，基本上不会造成冗余。

这里顺带给大家提一则小故事，教别人学算法的大佬可以拿走了：homebrew 的作者去面 Google，被考算法题: 反转二叉树，结果没通过被拒了，😆


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/工具/brew-8fb73388-ffaf-4241-8584-03e7aa00578b.png)

好了好了，今天这篇文章就先水到这吧，我们下期见~




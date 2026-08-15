---
title: 开发工具 重点汇总
---

# 开发工具 重点汇总

> 从 0-ALL.md 筛选：面试常问与企业开发常用内容。

## TOC

1. Docker 核心概念总结 (`docker/Docker 核心概念总结.md`)
2. Docker 实战 (`docker/Docker 实战.md`)
3. Git 核心概念总结 (`git/Git 核心概念总结.md`)
4. GitHub 实用小技巧总结 (`git/GitHub 实用小技巧总结.md`)
5. Gradle 核心概念总结 (`gradle/Gradle 核心概念总结.md`)
6. Maven 核心概念总结 (`maven/Maven 核心概念总结.md`)
7. Maven 最佳实践 (`maven/Maven 最佳实践.md`)

---

<!-- source: docker/Docker 核心概念总结.md -->

## [1] Docker 核心概念总结

---
title: Docker 核心概念总结
description: 梳理 Docker 的核心概念与容器/虚拟机差异，掌握镜像、容器与仓库的关系及在交付部署中的实际价值。
category: 开发工具
tag:
  - Docker
head:
  - - meta
    - name: keywords
      content: Docker,容器,镜像,仓库,引擎,隔离,虚拟机对比,部署
---

本文主要讲 Docker 的核心概念、运行模型和常见使用场景，不展开安装过程。安装、命令练习和本地服务启动可以看后面的 [Docker 实战](./Docker 实战.md)。

## 容器介绍

Docker 是常见的软件容器平台。想要搞懂 Docker，先要理解容器解决的到底是什么问题。

### 什么是容器？

#### 先来看看容器较为官方的解释

**一句话概括容器：容器就是将软件打包成标准化单元，以用于开发、交付和部署。**

- **容器镜像是轻量的、可执行的独立软件包** ，包含软件运行所需的所有内容：代码、运行时环境、系统工具、系统库和设置。
- **容器化软件适用于基于 Linux 和 Windows 的应用，在任何环境中都能够始终如一地运行。**
- **容器赋予了软件独立性**，使其免受外在环境差异（例如，开发和预演环境的差异）的影响，从而有助于减少团队间在相同基础设施上运行不同软件时的冲突。

#### 再来看看容器较为通俗的解释

如果需要通俗地描述容器的话，我觉得容器就是一个存放东西的地方，就像书包可以装各种文具、衣柜可以放各种衣服、鞋架可以放各种鞋子一样。我们现在所说的容器存放的东西可能更偏向于应用比如网站、程序甚至是系统环境。

![认识容器](https://oss.javaguide.cn/github/javaguide/开发工具/docker/container.png)

### 图解物理机、虚拟机与容器

关于虚拟机与容器的对比在后面会详细介绍到，这里只是通过网上的图片加深大家对于物理机、虚拟机与容器这三者的理解(下面的图片来源于网络)。

**物理机：**

![物理机](https://oss.javaguide.cn/github/javaguide/开发工具/docker/%E7%89%A9%E7%90%86%E6%9C%BA%E5%9B%BE%E8%A7%A3.jpeg)

**虚拟机：**

![虚拟机](https://oss.javaguide.cn/github/javaguide/开发工具/docker/%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%9B%BE%E8%A7%A3.jpeg)

**容器：**

![](https://oss.javaguide.cn/javaguide/image-20211110104003678.png)

通过上面这三张抽象图，我们可以大概通过类比概括出：**容器虚拟化的是操作系统而不是硬件，容器之间是共享同一套操作系统资源的。虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统。因此容器的隔离级别会稍低一些。**

### 容器 VS 虚拟机

每当说起容器，我们不得不将其与虚拟机做一个比较。就我而言，对于两者无所谓谁会取代谁，而是两者可以和谐共存。

简单来说：**容器和虚拟机具有相似的资源隔离和分配优势，但功能有所不同，因为容器虚拟化的是操作系统，而不是硬件，因此容器更容易移植，效率也更高。**

传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。

![](https://oss.javaguide.cn/javaguide/2e2b95eebf60b6d03f6c1476f4d7c697.png)

**容器和虚拟机的对比**：

![](https://oss.javaguide.cn/javaguide/4ef8691d67eb1eb53217099d0a691eb5.png)

- 容器是一个应用层抽象，用于将代码和依赖资源打包在一起。 多个容器可以在同一台机器上运行，共享操作系统内核，但各自作为独立的进程在用户空间中运行 。与虚拟机相比， **容器占用的空间较少**（容器镜像大小通常只有几十兆），**瞬间就能完成启动** 。

- 虚拟机 (VM) 是一个物理硬件层抽象，用于将一台服务器变成多台服务器。管理程序允许多个 VM 在一台机器上运行。每个 VM 都包含一整套操作系统、一个或多个应用、必要的二进制文件和库资源，因此 **占用大量空间** 。而且 VM **启动也十分缓慢** 。

通过 Docker 官网，我们知道了这么多 Docker 的优势，但是大家也没有必要完全否定虚拟机技术，因为两者有不同的使用场景。**虚拟机更擅长于彻底隔离整个运行环境**。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。而 **Docker 通常用于隔离不同的应用** ，例如前端，后端以及数据库。

就我而言，对于两者无所谓谁会取代谁，而是两者可以和谐共存。

![](https://oss.javaguide.cn/javaguide/056c87751b9dd7b56f4264240fe96d00.png)

## Docker 介绍

### 什么是 Docker？

可以从下面几个角度理解 Docker：

- **Docker 是一个软件容器平台。**
- **Docker** 使用 Go 语言开发，基于 Linux 内核提供的 cgroups、namespaces，以及 UnionFS 等能力对进程进行封装隔离，属于操作系统层面的虚拟化技术。
- Docker 能够把应用和运行依赖打包到镜像中，减少开发、测试、部署环境不一致带来的问题。
- 用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

**Docker 思想**：

- **集装箱**：就像海运中的集装箱一样，Docker 容器包含了应用程序及其所有依赖项，确保在任何环境中都能以相同的方式运行。
- **标准化**：运输方式、存储方式、API 接口。
- **隔离**：每个 Docker 容器都在自己的隔离环境中运行，与宿主机和其他容器隔离。

### Docker 容器的特点

- **轻量** : 在一台机器上运行的多个 Docker 容器可以共享这台机器的操作系统内核；它们能够迅速启动，只需占用很少的计算和内存资源。镜像是通过文件系统层进行构造的，并共享一些公共文件。这样就能尽量降低磁盘用量，并能更快地下载镜像。
- **标准** : Docker 容器基于开放式标准，能够在所有主流 Linux 版本、Microsoft Windows 以及包括 VM、裸机服务器和云在内的任何基础设施上运行。
- **安全** : Docker 赋予应用的隔离性不仅限于彼此隔离，还独立于底层的基础设施。Docker 默认提供最强的隔离，因此应用出现问题，也只是单个容器的问题，而不会波及到整台机器。

### 为什么要用 Docker ?

- Docker 的镜像提供了除内核外完整的运行时环境，确保了应用运行环境一致性，从而不会再出现 “这段代码在我机器上没问题啊” 这类问题；——一致的运行环境
- 可以做到秒级、甚至毫秒级的启动时间。大大的节约了开发、测试、部署的时间。——更快速的启动时间
- 避免公用的服务器，资源会容易受到其他用户的影响。——隔离性
- 善于处理集中爆发的服务器使用压力；——弹性伸缩，快速扩展
- 可以很轻易的将在一个平台上运行的应用，迁移到另一个平台上，而不用担心运行环境的变化导致应用无法正常运行的情况。——迁移方便
- 使用 Docker 可以通过定制应用镜像来实现持续集成、持续交付、部署。——持续交付和部署

---

## Docker 基本概念

Docker 中有非常重要的三个基本概念：镜像（Image）、容器（Container）和仓库（Repository）。

理解了这三个概念，就理解了 Docker 的整个生命周期。

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-build-run.jpeg)

### 镜像（Image）：一个特殊的文件系统

**操作系统分为内核和用户空间**。对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。而 Docker 镜像（Image），就相当于是一个 root 文件系统。

**Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。** 镜像不包含任何动态数据，其内容在构建之后也不会被改变。

Docker 设计时，就充分利用 **Union FS** 的技术，将其设计为**分层存储的架构** 。镜像实际是由多层文件系统联合组成。

**镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。** 比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像。因此，在构建镜像的时候，需要额外小心，每一层尽量只包含该层需要添加的东西，任何额外的东西应该在该层构建结束前清理掉。

分层存储的特征还使得镜像的复用、定制变的更为容易。甚至可以用之前构建好的镜像作为基础层，然后进一步添加新的层，以定制自己所需的内容，构建新的镜像。

### 容器（Container）：镜像运行时的实体

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，**容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等** 。

**容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。前面讲过镜像使用的是分层存储，容器也是如此。**

**容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。**

按照 Docker 最佳实践的要求，**容器不应该向其存储层内写入业务数据**，容器存储层要尽量保持无状态。**需要持久化的文件写入，应该使用数据卷（Volume）或者绑定宿主目录**，这类读写会绕过容器存储层，直接落到宿主机或网络存储上，性能和稳定性更好。数据卷的生命周期独立于容器，容器删除后，数据卷不会自动删除。

### 仓库（Repository）：集中存放镜像文件的地方

镜像构建完成后，可以很容易的在当前宿主上运行，但是， **如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。**

一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像。所以说：**镜像仓库是 Docker 用来集中存放镜像文件的地方类似于我们之前常用的代码仓库。**

通常，**一个仓库会包含同一个软件不同版本的镜像**，而**标签就常用于对应这个软件的各个版本**。我们可以通过 `<仓库名>:<标签>` 的格式指定具体镜像。如果不给出标签，将以 `latest` 作为默认标签。不过在生产环境中不建议依赖 `latest`，最好明确指定版本标签，便于回滚和排查问题。

**这里补充一下 Docker Registry 公开服务和私有 Docker Registry 的概念：**

**Docker Registry 公开服务** 是开放给用户使用、允许用户管理镜像的 Registry 服务。一般这类公开服务允许用户免费上传、下载公开的镜像，并可能提供收费服务供用户管理私有镜像。

最常使用的 Registry 公开服务是官方的 **Docker Hub** ，这也是默认的 Registry，并拥有大量的高质量的官方镜像，网址为：[https://hub.docker.com/](https://hub.docker.com/ "https://hub.docker.com/") 。官方是这样介绍 Docker Hub 的：

> Docker Hub 是 Docker 官方提供的一项服务，用于与您的团队查找和共享容器镜像。

比如我们想要搜索自己想要的镜像：

![利用 Docker Hub 搜索镜像](https://oss.javaguide.cn/github/javaguide/开发工具/docker/Screen%20Shot%202019-11-04%20at%208.21.39%20PM.png)

在 Docker Hub 的搜索结果中，有几项关键的信息有助于我们选择合适的镜像：

- **OFFICIAL Image**：代表镜像为 Docker 官方提供和维护，相对来说稳定性和安全性较高。
- **Stars**：和点赞差不多的意思，类似 GitHub 的 Star。
- **Downloads**：代表镜像被拉取的次数，基本上能够表示镜像被使用的频度。

当然，除了直接通过 Docker Hub 网站搜索镜像这种方式外，我们还可以通过 `docker search` 这个命令搜索 Docker Hub 中的镜像，搜索的结果是一致的。

```bash
➜  ~ docker search mysql
NAME                              DESCRIPTION                                     STARS               OFFICIAL            AUTOMATED
mysql                             MySQL is a widely used, open-source relation…   8763                [OK]
mariadb                           MariaDB is a community-developed fork of MyS…   3073                [OK]
mysql/mysql-server                Optimized MySQL Server Docker images. Create…   650                                     [OK]
```

在国内访问 **Docker Hub** 可能会比较慢，企业项目通常会结合公司内部镜像仓库或云厂商镜像仓库来做镜像缓存和分发。

除了使用公开服务外，用户还可以在 **本地搭建私有 Docker Registry** 。Docker 官方提供了 Docker Registry 镜像，可以直接使用做为私有 Registry 服务。开源的 Docker Registry 镜像只提供了 Docker Registry API 的服务端实现，足以支持 Docker 命令，不影响使用。但不包含图形界面，以及镜像维护、用户管理、访问控制等高级功能。

### Image、Container 和 Repository 的关系

下面这一张图很形象地展示了 Image、Container、Repository 和 Registry/Hub 这四者的关系：

![Docker 架构](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-regitstry.png)

- Dockerfile 是一个文本文件，包含了一系列的指令和参数，用于定义如何构建一个 Docker 镜像。运行 `docker build`命令并指定一个 Dockerfile 时，Docker 会读取 Dockerfile 中的指令，逐步构建一个新的镜像，并将其保存在本地。
- `docker pull` 命令可以从指定的 Registry/Hub 下载一个镜像到本地，默认使用 Docker Hub。
- `docker run` 命令可以从本地镜像创建一个新的容器并启动它。如果本地没有镜像，Docker 会先尝试从 Registry/Hub 拉取镜像。
- `docker push` 命令可以将本地的 Docker 镜像上传到指定的 Registry/Hub。

上面涉及到了一些 Docker 基本命令，后面的实战文章会详细介绍。

### Build Ship and Run

Docker 的概念基本上已经讲完，我们再来谈谈：Build, Ship, and Run。

如果你搜索 Docker 官网，会发现如下的字样：**“Docker - Build, Ship, and Run Any App, Anywhere”**。那么 Build, Ship, and Run 到底是在干什么呢？

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-build-ship-run.jpg)

- **Build（构建镜像）**：镜像就像是集装箱包括文件以及运行环境等等资源。
- **Ship（运输镜像）**：主机和仓库间运输，这里的仓库就像是超级码头一样。
- **Run （运行镜像）**：运行的镜像就是一个容器，容器就是运行程序的地方。

Docker 运行过程也就是去仓库把镜像拉到本地，然后用一条命令把镜像运行起来变成容器。所以，我们也常常将 Docker 称为码头工人或码头装卸工，这和 Docker 的中文翻译搬运工人如出一辙。

## Docker 常见命令

### 基本命令

```bash
docker version # 查看 Docker 版本
docker images # 查看所有已下载镜像，等价于：docker image ls 命令
docker container ls # 查看所有容器
docker ps # 查看正在运行的容器
docker image prune # 清理没有被使用的镜像文件。-a/--all 会删除所有未被容器使用的镜像
```

### 拉取镜像

`docker pull` 命令默认使用的 Registry 是 Docker Hub。当你执行 `docker pull` 命令而没有指定任何 Registry 地址时，Docker 会从 Docker Hub 拉取镜像。

```bash
docker search mysql # 查看 MySQL 相关镜像
docker pull mysql:8.4 # 拉取 MySQL 镜像
docker image ls # 查看所有已下载镜像
```

### 构建镜像

运行 `docker build`命令并指定一个 Dockerfile 时，Docker 会读取 Dockerfile 中的指令，逐步构建一个新的镜像，并将其保存在本地。

```bash
# image-name 是镜像名称，1.0.0 是镜像版本号或标签
docker build -t image-name:1.0.0 .
```

需要注意：Dockerfile 的文件名不必须为 Dockerfile，也不一定要放在构建上下文的根目录中。使用 `-f` 或 `--file` 选项，可以指定任何位置的任何文件作为 Dockerfile。当然，一般大家习惯性的会使用默认的文件名 `Dockerfile`，以及会将其置于镜像构建上下文目录中。

### 删除镜像

比如我们要删除已经下载的 MySQL 镜像。

通过 `docker rmi [image]`（等价于 `docker image rm [image]`）删除镜像之前，首先要确保这个镜像没有被容器引用。可以通过标签名称或者镜像 ID 删除，也可以通过前面讲的 `docker ps` 命令查看是否有容器正在使用它。

```shell
➜  ~ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
c4cd691d9f80        mysql:5.7           "docker-entrypoint.s…"   7 weeks ago         Up 12 days          0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
```

可以看到 `mysql:5.7` 正在被 ID 为 `c4cd691d9f80` 的容器引用，需要先通过 `docker stop c4cd691d9f80` 或者 `docker stop mysql` 暂停这个容器。

然后查看 MySQL 镜像的 ID：

```shell
➜  ~ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
mysql                   5.7                 f6509bac4980        3 months ago        373MB
```

通过 `IMAGE ID` 或者 `REPOSITORY:TAG` 即可删除：

```shell
docker rmi f6509bac4980 # 或者 docker rmi mysql:5.7
```

### 镜像推送

`docker push` 命令用于将本地的 Docker 镜像上传到指定的 Registry/Hub。

```bash
# 将镜像推送到私有镜像仓库 Harbor
# harbor.example.com 是私有镜像仓库的地址，ubuntu 是镜像名称，18.04 是镜像版本标签
docker push harbor.example.com/ubuntu:18.04
```

镜像推送之前，要确保本地已经构建好需要推送的 Docker 镜像。另外，务必先登录到对应的镜像仓库。

## Docker 数据管理

在容器中管理数据主要有两种方式：

1. 数据卷（Volumes）
2. 挂载主机目录 (Bind mounts)

![Docker 数据管理](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-data-management.png)

数据卷是由 Docker 管理的数据存储区域，有如下这些特点：

- 可以在容器之间共享和重用。
- 即使容器被删除，数据卷中的数据也不会被自动删除，从而确保数据的持久性。
- 对数据卷的修改会立马生效。
- 对数据卷的更新，不会影响镜像。

```bash
# 创建一个数据卷
docker volume create my-vol
# 查看所有的数据卷
docker volume ls
# 查看数据卷的具体信息
docker volume inspect my-vol
# 删除指定的数据卷
docker volume rm my-vol
```

在用 `docker run` 命令的时候，使用 `--mount` 标记来将一个或多个数据卷挂载到容器里。

还可以通过 `--mount` 标记将宿主机上的文件或目录挂载到容器中，这使得容器可以直接访问宿主机的文件系统。Docker 挂载主机目录的默认权限是读写，用户也可以通过增加 `readonly` 指定为只读。

## Docker Compose

### 什么是 Docker Compose？有什么用？

Docker Compose 是 Docker 官方提供的多容器应用定义和运行工具。通过 Compose，开发者可以使用一个 YAML 文件描述应用依赖的多个服务、网络、端口和数据卷，然后用一条命令启动或停止整组服务。

Docker Compose 是开源项目，地址：<https://github.com/docker/compose>。

Docker Compose 的核心功能：

- **多容器管理**：允许用户在一个 YAML 文件中定义和管理多个容器。
- **服务编排**：配置容器间的网络和依赖关系。
- **一键启动与停止**：通过 `docker compose up` 和 `docker compose down` 等命令，可以轻松启动和停止整个应用。

Docker Compose 简化了多容器应用程序的开发、测试和部署过程，提高了开发团队的生产力，同时降低了应用程序的部署复杂度和管理成本。

### Docker Compose 文件基本结构

Docker Compose 文件是 Docker Compose 工具的核心，用于定义和配置多容器 Docker 应用。这个文件通常命名为 `compose.yaml` 或 `docker-compose.yml`，采用 YAML（YAML Ain't Markup Language）格式编写。

Docker Compose 文件基本结构如下：

- **服务（services）：** 定义了应用中的每个容器（服务）。每个服务可以使用不同的镜像、环境设置和依赖关系。
  - **镜像（image）：** 从指定的镜像中启动容器，可以是存储仓库、标签以及镜像 ID。
  - **命令（command）：** 可选，覆盖容器启动后默认执行的命令。在启动服务时运行特定的命令或脚本，常用于启动应用程序、执行初始化脚本等。
  - **端口（ports）：** 可选，映射容器和宿主机的端口。
  - **依赖（depends_on）：** 配置服务之间的启动依赖关系。例如后端服务依赖数据库服务时，可以先启动数据库，再启动后端服务。
  - **环境变量（environment）：** 可选，设置服务运行所需的环境变量。
  - **重启（restart）:** 可选，控制容器的重启策略。在容器退出时，根据指定的策略自动重启容器。
  - **服务卷（volumes）:** 可选，定义服务使用的卷，用于数据持久化或在容器之间共享数据。
  - **构建（build）：** 指定构建镜像的 Dockerfile 上下文路径，或者使用详细配置对象。
- **网络（networks）：** 定义了容器间的网络连接。
- **卷（volumes）：** 用于数据持久化和共享的数据卷定义。常用于数据库存储、配置文件、日志等数据的持久化。

```yaml
services:
  service-name-1:
    image: nginx:stable
    command: ["nginx", "-g", "daemon off;"]
    environment:
      TZ: Asia/Shanghai
    volumes:
      - web_data:/usr/share/nginx/html
    networks:
      - app_net
    ports:
      - "8080:80"
    restart: unless-stopped
    depends_on:
      - service-name-2
  service-name-2:
    image: redis:7
    networks:
      - app_net

volumes:
  web_data:

networks:
  app_net:
```

### Docker Compose 常见命令

#### 启动

`docker compose up` 会根据 Compose 文件中定义的服务创建并启动容器，并将它们连接到 Compose 创建的网络中。如果文件没有声明自定义网络，Compose 会自动创建默认网络。

```bash
# 在当前目录下寻找 compose.yaml 或 docker-compose.yml 文件，并根据其中定义的服务启动应用
docker compose up
# 后台启动
docker compose up -d
# 强制重新创建所有容器，即使它们已经存在
docker compose up --force-recreate
# 重新构建镜像
docker compose up --build
# 指定要启动的服务名称，而不是启动所有服务
# 可以同时指定多个服务，用空格分隔。
docker compose up service-name
```

另外，如果 Compose 文件名称不是 `compose.yaml` 或 `docker-compose.yml`，可以通过 `-f` 参数指定。

```bash
docker compose -f compose.prod.yaml up
```

#### 暂停

`docker compose down` 用于停止并移除通过 `docker compose up` 启动的容器和网络。

```bash
# 在当前目录下寻找 Compose 文件
# 根据其中定义移除启动的容器和网络
docker compose down
# 停止容器但不移除
docker compose stop
# 停止指定服务
docker compose stop service-name
```

同样地，如果 Compose 文件名称不是 `compose.yaml` 或 `docker-compose.yml`，可以通过 `-f` 参数指定。

```bash
docker compose -f compose.prod.yaml down
```

#### 查看

`docker compose ps` 用于查看通过 `docker compose up` 启动的所有容器的状态信息。

```bash
# 查看所有容器的状态信息
docker compose ps
# 只显示服务名称
docker compose ps --services
# 查看指定服务的容器
docker compose ps service-name
```

#### 其他

| 命令                     | 介绍                   |
| ------------------------ | ---------------------- |
| `docker compose version` | 查看版本               |
| `docker compose images`  | 列出所有容器使用的镜像 |
| `docker compose kill`    | 强制停止服务的容器     |
| `docker compose exec`    | 在容器中执行命令       |
| `docker compose logs`    | 查看日志               |
| `docker compose pause`   | 暂停服务               |
| `docker compose unpause` | 恢复服务               |
| `docker compose push`    | 推送服务镜像           |
| `docker compose start`   | 启动当前停止的服务     |
| `docker compose stop`    | 停止当前运行的服务     |
| `docker compose rm`      | 删除已停止的服务容器   |
| `docker compose top`     | 查看进程               |

## Docker 底层原理

首先，Docker 是基于轻量级虚拟化技术的软件，那什么是虚拟化技术呢？

简单点来说，虚拟化技术可以这样定义：

> 虚拟化技术是一种资源管理技术，是将计算机的各种[实体资源](https://zh.wikipedia.org/wiki/計算機科學)（[CPU](https://zh.wikipedia.org/wiki/CPU)、[内存](https://zh.wikipedia.org/wiki/内存)、[磁盘空间](https://zh.wikipedia.org/wiki/磁盘空间)、[网络适配器](https://zh.wikipedia.org/wiki/網路適配器)等），予以抽象、转换后呈现出来并可供分割、组合为一个或多个电脑配置环境。由此，打破实体结构间的不可切割的障碍，使用户可以比原本的配置更好的方式来应用这些电脑硬件资源。这些资源的新虚拟部分是不受现有资源的架设方式，地域或物理配置所限制。一般所指的虚拟化资源包括计算能力和数据存储。

Docker 技术是基于 LXC（Linux container- Linux 容器）虚拟容器技术的。

> LXC，其名称来自 Linux 软件容器（Linux Containers）的缩写，一种操作系统层虚拟化（Operating system–level virtualization）技术，为 Linux 内核容器功能的一个用户空间接口。它将应用软件系统打包成一个软件容器（Container），内含应用软件本身的代码，以及所需要的操作系统核心和库。通过统一的名字空间和共用 API 来分配不同软件容器的可用硬件资源，创造出应用程序的独立沙箱运行环境，使得 Linux 用户可以容易的创建和管理系统或应用容器。

LXC 技术主要是借助 Linux 内核中提供的 CGroup 功能和 namespace 来实现的，通过 LXC 可以为软件提供一个独立的操作系统运行环境。

**cgroup 和 namespace 介绍：**

- **namespace 是 Linux 内核用来隔离内核资源的方式。** 通过 namespace 可以让一些进程只能看到与自己相关的一部分资源，而另外一些进程也只能看到与它们自己相关的资源，这两拨进程根本就感觉不到对方的存在。具体的实现方式是把一个或多个进程的相关资源指定在同一个 namespace 中。Linux namespaces 是对全局系统资源的一种封装隔离，使得处于不同 namespace 的进程拥有独立的全局系统资源，改变一个 namespace 中的系统资源只会影响当前 namespace 里的进程，对其他 namespace 中的进程没有影响。

  （以上关于 namespace 介绍内容来自<https://www.cnblogs.com/sparkdev/p/9365405.html> ，更多关于 namespace 的内容可以查看这篇文章 ）。

- **CGroup 是 Control Groups 的缩写，是 Linux 内核提供的一种可以限制、记录、隔离进程组 (process groups) 所使用的物理资源 (如 cpu memory i/o 等等) 的机制。**

  （以上关于 CGroup 介绍内容来自 <https://www.ibm.com/developerworks/cn/linux/1506_cgroup/index.html> ，更多关于 CGroup 的内容可以查看这篇文章 ）。

**cgroup 和 namespace 两者对比：**

两者都是将进程进行分组，但是两者的作用还是有本质区别。namespace 是为了隔离进程组之间的资源，而 cgroup 是为了对一组进程进行统一的资源监控和限制。

## 总结

本文主要把 Docker 中的一些常见概念和命令做了详细的阐述。从零到上手实战可以看[Docker 从入门到上手干事](https://javaguide.cn/开发工具/docker/docker-in-action.html)这篇文章，内容非常详细！

另外，再给大家推荐一本质量非常高的开源书籍[《Docker 从入门到实践》](https://yeasy.gitbook.io/docker_practice/introduction/why) ，这本书的内容非常新，毕竟书籍的内容是开源的，可以随时改进。

![《Docker 从入门到实践》网站首页](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-getting-started-practice-website-homepage.png)

## 参考

- [Docker Compose：从零基础到实战应用的全面指南](https://juejin.cn/post/7306756690727747610)
- [Linux Namespace 和 Cgroup](https://segmentfault.com/a/1190000009732550)
- [LXC vs Docker: Why Docker is Better](https://www.upguard.com/articles/docker-vs-lxc "LXC vs Docker: Why Docker is Better")
- [CGroup 介绍、应用实例及原理描述](https://www.ibm.com/developerworks/cn/linux/1506_cgroup/index.html)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: docker/Docker 实战.md -->

## [2] Docker 实战

---
title: Docker 实战
description: 通过实战理解 Docker 的镜像与容器管理，解决环境一致性与交付效率问题，提升开发测试部署的协同效率。
category: 开发工具
tag:
  - Docker
head:
  - - meta
    - name: keywords
      content: Docker 实战,镜像构建,容器管理,环境一致性,部署,性能
---

## Docker 介绍

开始之前，先简单回顾一下 Docker。更完整的概念介绍可以看前一篇文章：[Docker 核心概念总结](./Docker 核心概念总结.md)。

### 什么是 Docker？

可以从下面几个角度理解 Docker：

- Docker 是常见的软件容器平台，基于 Go 语言开发实现。
- Docker 可以把应用和运行依赖打包到镜像中，减少开发、测试、部署环境不一致带来的问题。
- 用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。
- Docker 可以**对进程进行封装隔离，属于操作系统层面的虚拟化技术。** 由于隔离的进程独立于宿主和其他隔离进程，因此也称其为容器。

官网地址：<https://www.docker.com/> 。

![认识容器](https://oss.javaguide.cn/github/javaguide/开发工具/docker/container.png)

### 为什么要用 Docker?

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app），更重要的是容器性能开销极低。

传统的开发流程中，我们的项目通常需要使用 MySQL、Redis、Kafka 等依赖服务。这些环境如果都手动安装和配置，不同系统下的操作差异很大，也容易出现“我本地可以，你本地不行”的问题。

Docker 的出现完美地解决了这一问题，我们可以在容器中安装 MySQL、Redis 等软件环境，使得应用和环境架构分开，它的优势在于：

1. 一致的运行环境，能够更轻松地迁移
2. 对进程进行封装隔离，容器与容器之间互不影响，更高效地利用系统资源
3. 可以通过镜像复制多个一致的容器

另外，[《Docker 从入门到实践》](https://yeasy.gitbook.io/docker_practice/introduction/why) 这本开源书籍中也已经给出了使用 Docker 的原因。

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/20210412220015698.png)

## Docker 的安装

### Windows

Windows 推荐安装 Docker Desktop。访问 Docker 官网下载安装包：

![安装 Docker](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-install-windows.png)

然后点击 `Get Started`：

![安装 Docker](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-install-windows-download.png)

在此处点击 `Download for Windows` 即可下载。

目前 Docker Desktop for Windows 推荐使用 WSL 2 后端。安装前建议确认系统满足 Docker Desktop 的版本要求，并已经启用 WSL 2。部分场景也可以使用 Hyper-V 后端，开启方式如下。打开控制面板，选择程序：

![开启 Hyper-V](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-windows-hyperv.png)

点击 `启用或关闭 Windows 功能`：

![开启 Hyper-V](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-windows-hyperv-enable.png)

勾选 `Hyper-V`，点击确定即可：

![开启 Hyper-V](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-windows-hyperv-check.png)

完成更改后需要重启一下计算机。

开启 `Hyper-V` 后，就可以安装 Docker Desktop 了。打开安装程序后，等待片刻点击 `Ok` 即可：

![安装 Docker](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-windows-hyperv-install.png)

安装完成后，我们仍然需要重启计算机，重启后，若提示如下内容：

![安装 Docker](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-windows-hyperv-wsl2.png)

如果安装过程中提示使用 WSL 2，一般建议优先选择 WSL 2 后端。它是 Windows 上运行 Linux 容器更常用的方式；如果你的环境必须使用 Hyper-V，再切换到 Hyper-V 后端。

因为是图形界面的操作，这里就不介绍 Docker Desktop 的具体用法了。

### macOS

直接使用 Homebrew 安装即可

```shell
brew install --cask docker
```

### Linux

下面来看看 Linux 中如何安装 Docker。不同发行版的安装命令略有差异，生产环境建议优先参考 Docker 官方文档。这里用官方安装脚本演示测试或开发环境的快速安装方式。

在测试或开发环境中，Docker 官方为了简化安装流程，提供了一套便捷的安装脚本，执行这个脚本后就会自动地将一切准备工作做好，并且把 Docker 的稳定版本安装在系统中。

```shell
curl -fsSL get.docker.com -o get-docker.sh
```

```shell
sh get-docker.sh --mirror Aliyun
```

安装完成后直接启动服务：

```shell
systemctl start docker
```

推荐设置开机自启，执行指令：

```shell
systemctl enable docker
```

## Docker 中的几个概念

在正式学习 Docker 之前，我们需要了解 Docker 中的几个核心概念：

### 镜像

镜像就是一个只读的模板，镜像可以用来创建 Docker 容器，一个镜像可以创建多个容器

### 容器

容器是用镜像创建的运行实例，Docker 利用容器独立运行一个或一组应用。它可以被启动、开始、停止、删除，每个容器都是相互隔离的、保证安全的平台。 可以把容器看作是一个简易的 Linux 环境和运行在其中的应用程序。容器的定义和镜像几乎一模一样，也是一堆层的统一视角，唯一区别在于容器的最上面那一层是可读可写的

### 仓库

仓库是集中存放镜像文件的场所。仓库和仓库注册服务器是有区别的，仓库注册服务器上往往存放着多个仓库，每个仓库中又包含了多个镜像，每个镜像有不同的标签。仓库分为公开仓库和私有仓库两种形式，最常见的公开仓库是 Docker Hub，存放了大量可直接下载的镜像。

### 总结

通俗点说，一个镜像就代表一个软件；而基于某个镜像运行就是生成一个程序实例，这个程序实例就是容器；而仓库是用来存储 Docker 中所有镜像的。

其中仓库又分为远程仓库和本地仓库，和 Maven 类似，倘若每次都从远程下载依赖，则会大大降低效率，为此，Maven 的策略是第一次访问依赖时，将其下载到本地仓库，第二次、第三次使用时直接用本地仓库的依赖即可，Docker 的远程仓库和本地仓库的作用也是类似的。

## Docker 初体验

下面我们来对 Docker 进行一个初步的使用，这里以下载一个 MySQL 镜像为例。

和 GitHub 一样，Docker 也提供了 Docker Hub 用于查询各种镜像的地址和使用说明。我们先访问 Docker Hub：[https://hub.docker.com/](https://hub.docker.com/)

![Docker Hub](https://oss.javaguide.cn/github/javaguide/开发工具/docker/dockerhub-com.png)

在左上角的搜索框中输入 `mysql` 并回车：

![Docker Hub 搜索 MySQL](https://oss.javaguide.cn/github/javaguide/开发工具/docker/dockerhub-mysql.png)

可以看到相关 MySQL 的镜像非常多，若右上角有 `OFFICIAL IMAGE` 标识，则说明是官方镜像，所以我们点击第一个 MySQL 镜像：

![MySQL 官方镜像](https://oss.javaguide.cn/github/javaguide/开发工具/docker/dockerhub-mysql-official-image.png)

右边提供了下载 MySQL 镜像的指令为 `docker pull mysql`，但该指令会拉取默认标签对应的版本。实际项目中更建议显式指定版本标签，避免环境不可控。

若是想下载指定版本的镜像，则点击下面的`View Available Tags`：

![查看其他版本的 MySQL](https://oss.javaguide.cn/github/javaguide/开发工具/docker/dockerhub-mysql-view-available-tags.png)

这里就可以看到各种版本的镜像，右边有下载指令。比如想下载 8.4 版本的 MySQL 镜像，可以执行：

```shell
docker pull mysql:8.4
```

在部分网络环境中，从 Docker Hub 拉取镜像可能较慢或失败。不过，不建议直接复制网上的第三方镜像加速地址：这类服务的适用范围、同步策略和可用性可能随时调整。

以阿里云容器镜像服务 ACR 为例，其镜像加速器自 2024 年 7 月 2 日起仅限阿里云用户在支持公网访问的阿里云产品上使用，并且只支持拉取限定范围内的容器镜像。当前官方文档还提示，该服务已停止同步最新镜像，非阿里云机器访问加速地址会返回 HTTP 403。具体限制请以[阿里云 ACR 镜像加速器功能调整公告](https://help.aliyun.com/zh/acr/product-overview/product-change-acr-mirror-accelerator-function-adjustment-announcement)和[官方镜像加速文档](https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images)为准。

如果使用的是阿里云 ECS，可以按照阿里云控制台提供的专属地址和官方文档进行配置。非阿里云环境不要照搬上述配置；生产环境建议减少对外部公共镜像服务的强依赖，将所需镜像同步到自建或云厂商提供的私有镜像仓库，并固定镜像版本或摘要。

## Docker 镜像指令

Docker 需要频繁地操作相关的镜像，所以我们先来了解一下 Docker 中的镜像指令。

若想查看 Docker 中当前拥有哪些镜像，则可以使用 `docker images` 命令。

```shell
[root@izrcf5u3j3q8xaz ~]# docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
mysql         8.4       f07dfa83b528   11 days ago     448MB
tomcat        latest    feba8d001e3f   2 weeks ago     649MB
nginx         latest    ae2feff98a0c   2 weeks ago     133MB
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB
```

其中`REPOSITORY`为镜像名，`TAG`为版本标志，`IMAGE ID`为镜像 id(唯一的)，`CREATED`为创建时间，注意这个时间并不是我们将镜像下载到 Docker 中的时间，而是镜像创建者创建的时间，`SIZE`为镜像大小。

该指令能够查询指定镜像名：

```shell
docker images mysql
```

若如此做，则会查询出 Docker 中的所有 MySQL 镜像：

```shell
[root@izrcf5u3j3q8xaz ~]# docker images mysql
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
mysql        8.4       0ebb5600241d   11 days ago     589MB
mysql        8.0       f07dfa83b528   11 days ago     596MB
```

该指令还能够携带`-q`参数：`docker images -q` ， `-q`表示仅显示镜像的 id：

```shell
[root@izrcf5u3j3q8xaz ~]# docker images -q
0ebb5600241d
f07dfa83b528
feba8d001e3f
d404d78aa797
```

若是要下载镜像，则使用：

```shell
docker pull mysql:8.4
```

`docker pull` 是固定命令，后面写上需要下载的镜像名及版本标签；若是不写版本标签，而是直接执行 `docker pull mysql`，Docker 会拉取默认标签对应的版本。

一般在下载镜像前我们需要搜索一下镜像有哪些版本才能对指定版本进行下载，使用指令：

```shell
docker search mysql
```

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-search-mysql-terminal.png)

不过，`docker search` 只能搜索镜像仓库，不能列出某个镜像的全部标签。想查看 MySQL 支持哪些版本，建议直接去 Docker Hub 的 Tags 页面查看。

```shell
docker pull mysql:8.4
```

如果标签不存在，执行 `docker pull` 时会返回类似 `manifest unknown` 的错误：

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-search-mysql-404-terminal.png)

删除镜像使用指令：

```shell
docker image rm mysql:8.4
```

若是不指定版本，则默认删除的也是最新版本。

还可以通过指定镜像 id 进行删除：

```shell
docker image rm bf756fb1ae65
```

然而此时报错了：

```shell
[root@izrcf5u3j3q8xaz ~]# docker image rm bf756fb1ae65
Error response from daemon: conflict: unable to delete bf756fb1ae65 (must be forced) - image is being used by stopped container d5b6c177c151
```

这是因为要删除的`hello-world`镜像正在运行中，所以无法删除镜像，此时需要强制执行删除：

```shell
docker image rm -f bf756fb1ae65
```

该指令会将镜像和通过该镜像执行的容器全部删除，谨慎使用。

Docker 还提供了删除镜像的简化版本：`docker rmi 镜像名:版本标志` 。

此时我们即可借助 `rmi` 和 `-q` 进行一些联合操作。比如现在想删除所有的 MySQL 镜像，需要查询出 MySQL 镜像的 ID，并根据这些 ID 一个一个地执行 `docker rmi` 删除。也可以这样：

```shell
docker rmi -f $(docker images mysql -q)
```

首先通过 `docker images mysql -q` 查询出 MySQL 的所有镜像 ID，`-q` 表示仅查询 ID，并将这些 ID 作为参数传递给 `docker rmi -f` 指令，这样所有的 MySQL 镜像就都被删除了。

## Docker 容器指令

掌握了镜像的相关指令之后，我们需要了解一下容器的指令，容器是基于镜像的。

若需要通过镜像运行一个容器，则使用：

```shell
docker run tomcat:8.0-jre8
```

当然了，运行的前提是你拥有这个镜像，所以先下载镜像：

```shell
docker pull tomcat:8.0-jre8
```

下载完成后就可以运行了，运行后查看一下当前运行的容器：`docker ps` 。

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-ps-terminal.png)

其中`CONTAINER_ID`为容器的 id，`IMAGE`为镜像名，`COMMAND`为容器内执行的命令，`CREATED`为容器的创建时间，`STATUS`为容器的状态，`PORTS`为容器内服务监听的端口，`NAMES`为容器的名称。

通过该方式运行的 tomcat 是不能直接被外部访问的，因为容器具有隔离性，若是想直接通过 8080 端口访问容器内部的 tomcat，则需要对宿主机端口与容器内的端口进行映射：

```shell
docker run -p 8080:8080 tomcat:8.0-jre8
```

解释一下这两个端口的作用(`8080:8080`)，第一个 8080 为宿主机端口，第二个 8080 为容器内的端口，外部访问 8080 端口就会通过映射访问容器内的 8080 端口。

此时外部就可以访问 Tomcat 了：

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-run-tomact-8080.png)

若是这样进行映射：

```shell
docker run -p 8088:8080 tomcat:8.0-jre8
```

则外部需访问 8088 端口才能访问 tomcat，需要注意的是，每次运行的容器都是相互独立的，所以同时运行多个 tomcat 容器并不会产生端口的冲突。

容器还能够以后台的方式运行，这样就不会占用终端：

```shell
docker run -d -p 8080:8080 tomcat:8.0-jre8
```

启动容器时默认会给容器一个名称，但这个名称其实是可以设置的，使用指令：

```shell
docker run -d -p 8080:8080 --name tomcat01 tomcat:8.0-jre8
```

此时的容器名称即为 tomcat01，容器名称必须是唯一的。

再来引申一下`docker ps`中的几个指令参数，比如`-a`：

```shell
docker ps -a
```

该参数会将运行和非运行的容器全部列举出来。

`-q`参数将只查询正在运行的容器 id：`docker ps -q` 。

```shell
[root@izrcf5u3j3q8xaz ~]# docker ps -q
f3aac8ee94a3
074bf575249b
1d557472a708
4421848ba294
```

若是组合使用，则查询运行和非运行的所有容器 id：`docker ps -qa` 。

```shell
[root@izrcf5u3j3q8xaz ~]# docker ps -aq
f3aac8ee94a3
7f7b0e80c841
074bf575249b
a1e830bddc4c
1d557472a708
4421848ba294
b0440c0a219a
c2f5d78c5d1a
5831d1bab2a6
d5b6c177c151
```

接下来是容器的停止、重启指令，因为非常简单，就不过多介绍了。

```shell
docker start c2f5d78c5d1a
```

通过该指令能够将已经停止运行的容器运行起来，可以通过容器的 id 启动，也可以通过容器的名称启动。

```shell
docker restart c2f5d78c5d1a
```

该指令能够重启指定的容器。

```shell
docker stop c2f5d78c5d1a
```

该指令能够停止指定的容器。

```shell
docker kill c2f5d78c5d1a
```

该指令能够直接杀死指定的容器。

以上指令都能够通过容器的 id 和容器名称两种方式配合使用。

---

当容器被停止之后，容器虽然不再运行了，但仍然是存在的，若是想删除它，则使用指令：

```shell
docker rm d5b6c177c151
```

需要注意的是容器的 id 无需全部写出来，只需唯一标识即可。

若是想删除正在运行的容器，则需要添加`-f`参数强制删除：

```shell
docker rm -f d5b6c177c151
```

若是想删除所有容器，则可以使用组合指令：

```shell
docker rm -f $(docker ps -qa)
```

先通过`docker ps -qa`查询出所有容器的 id，然后通过`docker rm -f`进行删除。

---

当容器以后台的方式运行时，我们无法知晓容器的运行状态，若此时需要查看容器的运行日志，则使用指令：

```shell
docker logs 289cc00dc5ed
```

这样的方式显示的日志并不是实时的，若是想实时显示，需要使用`-f`参数：

```shell
docker logs -f 289cc00dc5ed
```

通过`-t`参数还能够显示日志的时间戳，通常与`-f`参数联合使用：

```shell
docker logs -ft 289cc00dc5ed
```

---

查看容器内运行了哪些进程，可以使用指令：

```shell
docker top 289cc00dc5ed
```

若是想与容器进行交互，则使用指令：

```shell
docker exec -it 289cc00dc5ed bash
```

此时终端将会进入容器内部，执行的指令都将在容器中生效，在容器内只能执行一些比较简单的指令，如：ls、cd 等，若是想退出容器终端，重新回到 CentOS 中，则执行`exit`即可。

现在我们已经能够进入容器终端执行相关操作了，那么该如何向 tomcat 容器中部署一个项目呢？

```shell
docker cp ./test.html 289cc00dc5ed:/usr/local/tomcat/webapps
```

通过`docker cp`指令能够将文件从 CentOS 复制到容器中，`./test.html`为 CentOS 中的资源路径，`289cc00dc5ed`为容器 id，`/usr/local/tomcat/webapps`为容器的资源路径，此时`test.html`文件将会被复制到该路径下。

```shell
[root@izrcf5u3j3q8xaz ~]# docker exec -it 289cc00dc5ed bash
root@289cc00dc5ed:/usr/local/tomcat# cd webapps
root@289cc00dc5ed:/usr/local/tomcat/webapps# ls
test.html
root@289cc00dc5ed:/usr/local/tomcat/webapps#
```

若是想将容器内的文件复制到 CentOS 中，则反过来写即可：

```shell
docker cp 289cc00dc5ed:/usr/local/tomcat/webapps/test.html ./
```

所以现在若是想要部署项目，则先将项目上传到 CentOS，然后将项目从 CentOS 复制到容器内，此时启动容器即可。

---

虽然使用 Docker 启动软件环境非常简单，但同时也面临着一个问题，我们无法知晓容器内部具体的细节，比如监听的端口、绑定的 ip 地址等等，好在这些 Docker 都帮我们想到了，只需使用指令：

```shell
docker inspect 923c969b0d91
```

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-inspect-terminal.png)

## Docker 数据卷

学习了容器的相关指令之后，我们来了解一下 Docker 中的数据卷，它能够实现宿主机与容器之间的文件共享，它的好处在于我们对宿主机的文件进行修改将直接影响容器，而无需再将宿主机的文件再复制到容器中。

现在若是想将宿主机中`/opt/apps`目录与容器中`webapps`目录做一个数据卷，则应该这样编写指令：

```shell
docker run -d -p 8080:8080 --name tomcat01 -v /opt/apps:/usr/local/tomcat/webapps tomcat:8.0-jre8
```

然而此时访问 tomcat 会发现无法访问：

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-data-volume-webapp-8080.png)

这就说明我们的数据卷设置成功了，Docker 会将容器内的`webapps`目录与`/opt/apps`目录进行同步，而此时`/opt/apps`目录是空的，导致`webapps`目录也会变成空目录，所以就访问不到了。

此时我们只需向`/opt/apps`目录下添加文件，就会使得`webapps`目录也会拥有相同的文件，达到文件共享，测试一下：

```shell
[root@centos-7 opt]# cd apps/
[root@centos-7 apps]# vim test.html
[root@centos-7 apps]# ls
test.html
[root@centos-7 apps]# cat test.html
<h1>This is a test html!</h1>
```

在`/opt/apps`目录下创建了一个 `test.html` 文件，那么容器内的`webapps`目录是否会有该文件呢？进入容器的终端：

```shell
[root@centos-7 apps]# docker exec -it tomcat01 bash
root@115155c08687:/usr/local/tomcat# cd webapps/
root@115155c08687:/usr/local/tomcat/webapps# ls
test.html
```

容器内确实已经有了该文件，那接下来我们编写一个简单的 Web 应用：

```java
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("Hello World!");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req,resp);
    }
}
```

这是一个非常简单的 Servlet，我们将其打包上传到`/opt/apps`中，那么容器内肯定就会同步到该文件，此时进行访问：

![](https://oss.javaguide.cn/github/javaguide/开发工具/docker/docker-data-volume-webapp-8080-hello-world.png)

这种方式通常称为绑定挂载（bind mount），因为宿主机目录由我们自己指定。Docker 还提供了另一种更常见的数据卷方式：命名卷（named volume）。

```shell
docker run -d -p 8080:8080 --name tomcat01 -v aa:/usr/local/tomcat/webapps tomcat:8.0-jre8
```

此时的 `aa` 并不是宿主机目录，而是数据卷名称。Docker 会自动创建一个名为 `aa` 的数据卷，并且会将容器内 `webapps` 目录下的已有内容复制到数据卷中。默认情况下，Docker 管理的数据卷位于 `/var/lib/docker/volumes` 目录下：

```shell
[root@centos-7 volumes]# pwd
/var/lib/docker/volumes
[root@centos-7 volumes]# cd aa/
[root@centos-7 aa]# ls
_data
[root@centos-7 aa]# cd _data/
[root@centos-7 _data]# ls
docs  examples  host-manager  manager  ROOT
```

此时我们只需修改该目录的内容，就能影响到容器。不过，实际项目中不建议直接修改 `/var/lib/docker/volumes` 下的文件，优先通过容器、应用程序或者明确的绑定挂载目录来管理数据。

---

最后再介绍几个容器和镜像相关的指令：

```shell
docker commit -m "描述信息" -a "镜像作者" tomcat01 my_tomcat:1.0
```

该指令能够将容器打包成一个镜像，此时查询镜像：

```shell
[root@centos-7 _data]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my_tomcat           1.0                 79ab047fade5        2 seconds ago       463MB
tomcat              8                   a041be4a5ba5        2 weeks ago         533MB
mysql               8.4                 db2b37ec6181        2 months ago        589MB
```

若是想将镜像备份出来，则可以使用指令：

```shell
docker save my_tomcat:1.0 -o my-tomcat-1.0.tar
```

```shell
[root@centos-7 ~]# docker save my_tomcat:1.0 -o my-tomcat-1.0.tar
[root@centos-7 ~]# ls
anaconda-ks.cfg  initial-setup-ks.cfg  公共  视频  文档  音乐
get-docker.sh    my-tomcat-1.0.tar     模板  图片  下载  桌面
```

若是拥有`.tar`格式的镜像，该如何将其加载到 Docker 中呢？执行指令：

```shell
docker load -i my-tomcat-1.0.tar
```

```shell
root@centos-7 ~]# docker load -i my-tomcat-1.0.tar
b28ef0b6fef8: Loading layer [==================================================>]  105.5MB/105.5MB
0b703c74a09c: Loading layer [==================================================>]  23.99MB/23.99MB
......
Loaded image: my_tomcat:1.0
[root@centos-7 ~]# docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
my_tomcat           1.0                 79ab047fade5        7 minutes ago       463MB
```

## 常见排查命令

Docker 上手之后，真正经常用到的是排查命令。下面这些命令建议熟悉：

```shell
# 查看容器启动参数、网络、挂载目录和环境变量
docker inspect tomcat01

# 查看最近的容器日志
docker logs --tail=100 tomcat01

# 持续查看容器日志
docker logs -f tomcat01

# 查看容器资源占用
docker stats

# 查看 Docker 占用的磁盘空间
docker system df
```

清理资源时要小心，尤其是带 `-f` 的命令。`docker system prune` 会删除未使用的容器、网络、镜像和构建缓存，如果加上 `--volumes`，还会清理未使用的数据卷，数据库、本地测试数据都可能被删掉。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: git/Git 核心概念总结.md -->

## [3] Git 核心概念总结

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

---

<!-- source: git/GitHub 实用小技巧总结.md -->

## [4] GitHub 实用小技巧总结

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


---

---

<!-- source: gradle/Gradle 核心概念总结.md -->

## [5] Gradle 核心概念总结

---
title: Gradle 核心概念总结
description: Gradle 是一个运行在 JVM 上的自动化构建工具，支持灵活的任务编排、依赖管理、插件扩展和多项目构建。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Gradle,Groovy,Gradle Wrapper,Gradle 包装器,Gradle 插件
---

> 这部分内容主要根据 Gradle 官方文档整理，做了对应的删减，主要保留比较重要的部分，不涉及实战，主要是一些重要概念的介绍。

Gradle 这部分内容属于可选内容，可以根据自身需求决定是否学习。国内 Java 后端项目里 Maven 仍然更常见，但 Android、部分 Spring Boot 项目以及需要高度定制构建流程的项目中，Gradle 使用得也很多。

## Gradle 介绍

Gradle 官方文档是这样介绍的 Gradle 的：

> Gradle is an open-source [build automation](https://en.wikipedia.org/wiki/Build_automation) tool flexible enough to build almost any type of software. Gradle makes few assumptions about what you’re trying to build or how to build it. This makes Gradle particularly flexible.
>
> Gradle 是一个开源的构建自动化工具，它足够灵活，可以构建几乎任何类型的软件。Gradle 对你要构建什么或者如何构建它做了很少的假设。这使得 Gradle 特别灵活。

简单来说，Gradle 就是一个运行在 JVM 上的自动化项目构建工具，用来帮助我们完成编译、测试、打包、发布等构建任务。

对于开发者来说，Gradle 的主要作用主要有 3 个：

1. **项目构建**：提供标准的、跨平台的自动化项目构建方式。
2. **依赖管理**：方便快捷的管理项目依赖的资源（jar 包），避免资源间的版本冲突问题。
3. **统一开发结构**：提供标准的、统一的项目结构。

Gradle 构建脚本可以使用 Groovy DSL 或 Kotlin DSL 编写。现在新项目里 Kotlin DSL 也很常见，它的类型提示和 IDE 支持通常更好。

## Groovy 介绍

Gradle 是运行在 JVM 上的一个程序，构建脚本可以使用 Groovy 或 Kotlin 编写。历史上很多 Gradle 示例使用 Groovy DSL，因此先了解一点 Groovy 语法对阅读老项目很有帮助。

Groovy 是运行在 JVM 上的脚本语言，是基于 Java 扩展的动态语言，它的语法和 Java 非常的相似，可以使用 Java 的类库。Groovy 可以用于面向对象编程，也可以用作纯粹的脚本语言。在语言的设计上它吸纳了 Java、Python、Ruby 和 Smalltalk 语言的优秀特性，比如动态类型转换、闭包和元编程支持。

我们可以用学习 Java 的方式去学习 Groovy ，学习成本相对来说还是比较低的，即使开发过程中忘记 Groovy 语法，也可以用 Java 语法继续编码。

基于 JVM 的语言有很多种，比如 Groovy、Kotlin、Java、Scala，它们最终都会编译生成 Java 字节码文件并在 JVM 上运行。

## Gradle 优势

Gradle 是新一代的构建系统，具有高效和灵活等诸多优势，广泛用于 Java 开发。不仅 Android 将其作为官方构建系统, 越来越多的 Java 项目比如 Spring Boot 也慢慢迁移到 Gradle。

- 在灵活性上，Gradle 支持基于 Groovy 语言编写脚本，侧重于构建过程的灵活性，适合于构建复杂度较高的项目，可以完成非常复杂的构建。
- 在粒度性上，Gradle 构建的粒度细化到了每一个 task 之中。并且它所有的 Task 源码都是开源的，在我们掌握了这一整套打包流程后，我们就可以通过去修改它的 Task 去动态改变其执行流程。
- 在扩展性上，Gradle 支持插件机制，所以我们可以复用这些插件，就如同复用库一样简单方便。

## Gradle Wrapper 介绍

Gradle 官方文档是这样介绍的 Gradle Wrapper 的：

> The recommended way to execute any Gradle build is with the help of the Gradle Wrapper (in short just “Wrapper”). The Wrapper is a script that invokes a declared version of Gradle, downloading it beforehand if necessary. As a result, developers can get up and running with a Gradle project quickly without having to follow manual installation processes saving your company time and money.
>
> 执行 Gradle 构建的推荐方法是借助 Gradle Wrapper(简而言之就是“Wrapper”)。Wrapper 它是一个脚本，调用了已经声明的 Gradle 版本，如果需要的话，可以预先下载它。因此，开发人员可以快速启动并运行 Gradle 项目，而不必遵循手动安装过程，从而为公司节省时间和金钱。

我们可以称 Gradle Wrapper 为 Gradle 包装器，它将 Gradle 再次包装，让所有的 Gradle 构建方法在 Gradle 包装器的帮助下运行。

Gradle Wrapper 的工作流程图如下（图源[Gradle Wrapper 官方文档介绍](https://docs.gradle.org/current/userguide/gradle_wrapper.html)）：

![包装器工作流程](https://oss.javaguide.cn/github/javaguide/csdn/efa7a0006b04051e2b84cd116c6ccdfc.png)

整个流程主要分为下面 3 步：

1. 首先当我们刚创建的时候，如果指定的版本没有被下载，就先会去 Gradle 的服务器中下载对应版本的压缩包；
2. 下载完成后需要先进行解压缩并且执行批处理文件；
3. 后续项目每次构建都会重用这个解压过的 Gradle 版本。

Gradle Wrapper 会给我们带来下面这些好处：

1. 在给定的 Gradle 版本上标准化项目，从而实现更可靠和健壮的构建。
2. 可以让我们的电脑中不安装 Gradle 环境也可以运行 Gradle 项目。
3. 为不同的用户和执行环境（例如 IDE 或持续集成服务器）提供新的 Gradle 版本就像更改 Wrapper 定义一样简单。

### 生成 Gradle Wrapper

如果想要首次生成 Gradle Wrapper，需要本地先有可用的 Gradle。Gradle 中已经内置了 Wrapper Task，在项目根目录执行 `gradle wrapper` 命令即可生成 Gradle Wrapper。

执行命令 `gradle wrapper` 命令时可以指定一些参数来控制 wrapper 的生成。具体有如下两个配置参数：

- `--gradle-version`：用于指定使用的 Gradle 版本。
- `--gradle-distribution-url`：用于指定下载 Gradle 发行版的 URL，该值通常类似于 `https://services.gradle.org/distributions/gradle-${gradleVersion}-bin.zip`。
- `--gradle-distribution-sha256-sum`：用于指定发行版压缩包的 SHA-256 校验值，可以降低下载文件被篡改的风险。

执行`gradle wrapper`命令之后，Gradle Wrapper 就生成完成了，项目根目录中生成如下文件：

```plain
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
└── gradlew.bat
```

每个文件的含义如下：

- `gradle-wrapper.jar`：包含了 Gradle 运行时的逻辑代码。
- `gradle-wrapper.properties`：定义了 Gradle 的版本号和 Gradle 运行时的行为属性。
- `gradlew`：Linux/macOS 平台下，用于执行 Gradle 命令的包装器脚本。
- `gradlew.bat`：Windows 平台下，用于执行 Gradle 命令的包装器脚本。

`gradle-wrapper.properties` 文件的内容如下：

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-6.0.1-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

- `distributionBase`：Gradle 解包后存储的父目录。
- `distributionPath`：`distributionBase`指定目录的子目录。`distributionBase+distributionPath`就是 Gradle 解包后的存放的具体目录。
- `distributionUrl`：Gradle 指定版本的压缩包下载地址。
- `zipStoreBase`：Gradle 压缩包下载后存储父目录。
- `zipStorePath`：`zipStoreBase`指定目录的子目录。`zipStoreBase+zipStorePath`就是 Gradle 压缩包的存放位置。

### 更新 Gradle Wrapper

更新 Gradle Wrapper 有 2 种方式：

1. 直接修改 `distributionUrl` 字段，然后执行 Gradle 命令。
2. 执行 `./gradlew wrapper --gradle-version [version]`。

下面的命令会将 Gradle 版本升级为 9.5.1。

```shell
./gradlew wrapper --gradle-version 9.5.1
```

`gradle-wrapper.properties` 文件中的 `distributionUrl` 属性也发生了改变。

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-9.5.1-bin.zip
```

项目已经生成 Wrapper 后，日常构建优先使用 `./gradlew build`，而不是直接使用本机安装的 `gradle build`。这样可以确保团队成员和 CI 使用同一个 Gradle 版本。

### 自定义 Gradle Wrapper

Gradle 已经内置了 Wrapper Task，因此构建 Gradle Wrapper 会生成 Gradle Wrapper 的属性文件，这个属性文件可以通过自定义 Wrapper Task 来设置。比如我们想要修改要下载的 Gradle 版本为 9.5.1，可以这么设置：

```groovy
tasks.wrapper {
    gradleVersion = '9.5.1'
}
```

也可以设置 Gradle 发行版压缩包的下载地址和 Gradle 解包后的本地存储路径等配置。

```groovy
tasks.wrapper {
    gradleVersion = '9.5.1'
    distributionUrl = '../../gradle-9.5.1-bin.zip'
    distributionPath = 'wrapper/dists'
}
```

`distributionUrl` 属性可以设置为本地的项目目录，你也可以设置为网络地址。

## Gradle 任务

在 Gradle 中，任务(Task)是构建执行的单个工作单元。

Gradle 的构建是基于 Task 进行的，当你运行项目的时候，实际就是在执行了一系列的 Task 比如编译 Java 源码的 Task、生成 jar 文件的 Task。

Task 的声明方式如下（还有其他几种声明方式）：

```groovy
// 声明一个名字为 helloTask 的 Task
task helloTask{
     doLast{
       println "Hello"
     }
}
```

创建一个 Task 后，可以根据需要给 Task 添加不同的 Action，上面的“doLast”就是给队列尾增加一个 Action。

```groovy
 //在Action 队列头部添加Action
 Task doFirst(Action<? super Task> action);
 Task doFirst(Closure action);

 //在Action 队列尾部添加Action
 Task doLast(Action<? super Task> action);
 Task doLast(Closure action);

 //删除所有的Action
 Task deleteAllActions();
```

一个 Task 中可以有多个 Acton，从队列头部开始向队列尾部执行 Acton。

Action 代表的是一个个函数、方法，每个 Task 都是一堆 Action 按序组成的执行图。

Task 声明依赖的关键字是`dependsOn`，支持声明一个或多个依赖：

```groovy
task first {
 doLast {
        println "+++++first+++++"
    }
}
task second {
 doLast {
        println "+++++second+++++"
    }
}

// 指定多个 task 依赖
task print(dependsOn :[second,first]) {
 doLast {
      logger.quiet "指定多个task依赖"
    }
}

// 指定一个 task 依赖
task third(dependsOn : print) {
 doLast {
      println '+++++third+++++'
    }
}
```

执行 Task 之前，会先执行它的依赖 Task。

我们还可以设置默认 Task，脚本中我们不调用默认 Task ，也会执行。

```groovy
defaultTasks 'clean', 'run'

task clean {
    doLast {
        println 'Default Cleaning!'
    }
}

task run {
    doLast {
        println 'Default Running!'
    }
}
```

Gradle 本身也内置了很多 Task 比如 copy（复制文件）、delete（删除文件）。

```groovy
task deleteFile(type: Delete) {
    delete "C:\\Users\\guide\\Desktop\\test"
}
```

## Gradle 插件

Gradle 提供的是一套核心的构建机制，而 Gradle 插件则是运行在这套机制上的一些具体构建逻辑，其本质上和 `.gradle` 文件是相同。你可以将 Gradle 插件看作是封装了一系列 Task 并执行的工具。

Gradle 插件主要分为两类：

- 脚本插件：脚本插件就是一个普通的脚本文件，它可以被导入都其他构建脚本中。
- 二进制插件 / 对象插件：在一个单独的插件模块中定义，其他模块通过 Plugin ID 应用插件。因为这种方式发布和复用更加友好，我们一般接触到的 Gradle 插件都是指二进制插件的形式。

虽然 Gradle 插件与 .gradle 文件本质上没有区别，`.gradle` 文件也能实现 Gradle 插件类似的功能。但是，Gradle 插件使用了独立模块封装构建逻辑，无论是从开发开始使用来看，Gradle 插件的整体体验都更友好。

- **逻辑复用：** 将相同的逻辑提供给多个相似项目复用，减少重复维护类似逻辑开销。当然 .gradle 文件也能做到逻辑复用，但 Gradle 插件的封装性更好；
- **组件发布：** 可以将插件发布到 Maven 仓库进行管理，其他项目可以使用插件 ID 依赖。当然 .gradle 文件也可以放到一个远程路径被其他项目引用；
- **构建配置：** Gradle 插件可以声明插件扩展来暴露可配置的属性，提供定制化能力。当然 .gradle 文件也可以做到，但实现会麻烦些。

## Gradle 构建生命周期

Gradle 构建的生命周期有三个阶段：**初始化阶段，配置阶段**和**运行阶段**。

![](https://oss.javaguide.cn/github/javaguide/csdn/dadbdf59fccd9a2ebf60a2d018541e52.png)

在初始化阶段与配置阶段之间、配置阶段结束之后、执行阶段结束之后，我们都可以加一些定制化的 Hook。

![](https://oss.javaguide.cn/github/javaguide/csdn/5c297ccc4dac83229ff3e19caee9d1d2.png)

### 初始化阶段

Gradle 支持单项目和多项目构建。在初始化阶段，Gradle 确定哪些项目将参与构建，并为每个项目创建一个 [Project 实例](https://docs.gradle.org/current/dsl/org.gradle.api.Project.html) 。本质上也就是执行 `settings.gradle` 脚本，从而读取整个项目中有多少个 Project 实例。

### 配置阶段

在配置阶段，Gradle 会解析每个工程的 `build.gradle` 文件，创建要执行的任务子集和确定各种任务之间的关系，以供执行阶段按照顺序执行，并对任务的做一些初始化配置。

每个 `build.gradle` 对应一个 Project 对象，配置阶段执行的代码包括 `build.gradle` 中的各种语句、闭包以及 Task 中的配置语句。

在配置阶段结束后，Gradle 会根据 Task 的依赖关系会创建一个 **有向无环图** 。

### 运行阶段

在运行阶段，Gradle 根据配置阶段创建和配置的要执行的任务子集，执行任务。

## 参考

- Gradle 官方文档：<https://docs.gradle.org/current/userguide/userguide.html>
- Gradle 入门教程：<https://www.imooc.com/wiki/gradlebase>
- Groovy 快速入门看这篇就够了：<https://cloud.tencent.com/developer/article/1358357>
- 【Gradle】Gradle 的生命周期详解：<https://juejin.cn/post/7067719629874921508>
- 手把手带你自定义 Gradle 插件 —— Gradle 系列(2)：<https://www.cnblogs.com/pengxurui/p/16281537.html>
- Gradle 爬坑指南 -- 理解 Plugin、Task、构建流程：<https://juejin.cn/post/6889090530593112077>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: maven/Maven 核心概念总结.md -->

## [6] Maven 核心概念总结

---
title: Maven 核心概念总结
description: Apache Maven 的本质是一个软件项目管理和理解工具。基于项目对象模型 (Project Object Model，POM) 的概念，Maven 可以从一条中心信息管理项目的构建、报告和文档。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Maven坐标,Maven仓库,Maven生命周期,Maven多模块管理
---

> 这部分内容主要根据 Maven 官方文档整理，做了对应的删减，主要保留比较重要的部分，不涉及实战，主要是一些重要概念的介绍。

## Maven 介绍

[Maven](https://github.com/apache/maven) 官方文档是这样介绍的 Maven 的：

> Apache Maven is a software project management and comprehension tool. Based on the concept of a project object model (POM), Maven can manage a project's build, reporting and documentation from a central piece of information.
>
> Apache Maven 的本质是一个软件项目管理和理解工具。基于项目对象模型 (Project Object Model，POM) 的概念，Maven 可以从一条中心信息管理项目的构建、报告和文档。

**什么是 POM？** 每一个 Maven 工程都有一个 `pom.xml` 文件，位于根目录中，包含项目构建生命周期的详细信息。通过 `pom.xml` 文件，我们可以定义项目的坐标、项目依赖、项目信息、插件信息等等配置。

对于开发者来说，Maven 的主要作用主要有 3 个：

1. **项目构建**：提供标准的、跨平台的自动化项目构建方式。
2. **依赖管理**：方便快捷的管理项目依赖的资源（jar 包），避免资源间的版本冲突问题。
3. **统一开发结构**：提供标准的、统一的项目结构。

关于 Maven 的基本使用这里就不介绍了，建议看看官网的 5 分钟上手 Maven 的教程：[Maven in 5 Minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) 。

## Maven 坐标

项目中依赖的第三方库以及插件可统称为构件。每一个构件都可以使用 Maven 坐标唯一标识，坐标元素包括：

- **groupId**(必须): 定义了当前 Maven 项目隶属的组织或公司。groupId 一般分为多段，通常情况下，第一段为域，第二段为公司名称。域又分为 org、com、cn 等，其中 org 为非营利组织，com 为商业组织，cn 表示中国。以 apache 开源社区的 tomcat 项目为例，这个项目的 groupId 是 org.apache，它的域是 org（因为 tomcat 是非营利项目），公司名称是 apache，artifactId 是 tomcat。
- **artifactId**(必须)：定义了当前 Maven 项目的名称，项目的唯一的标识符，对应项目根目录的名称。
- **version**(必须)：定义了 Maven 项目当前所处版本。
- **packaging**（可选）：定义了 Maven 项目的打包方式（比如 jar，war...），默认使用 jar。
- **classifier**(可选)：常用于区分从同一 POM 构建的具有不同内容的构件，可以是任意的字符串，附加在版本号之后。

只要你提供正确的坐标，就能从 Maven 仓库中找到相应的构件供我们使用。

举个例子（引入阿里巴巴开源的 EasyExcel）：

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.1.1</version>
</dependency>
```

你可以在 <https://mvnrepository.com/> 这个网站上找到几乎所有可用的构件，如果你的项目使用的是 Maven 作为构建工具，那这个网站你一定会经常接触。

![Maven 仓库](https://oss.javaguide.cn/github/javaguide/开发工具/maven/mvnrepository.com.png)

## Maven 依赖

如果使用 Maven 构建产生的构件（例如 Jar 文件）被其他的项目引用，那么该构件就是其他项目的依赖。

### 依赖配置

**配置信息示例**：

```xml
<project>
    <dependencies>
        <dependency>
            <groupId></groupId>
            <artifactId></artifactId>
            <version></version>
            <type>...</type>
            <scope>...</scope>
            <optional>...</optional>
            <exclusions>
                <exclusion>
                  <groupId>...</groupId>
                  <artifactId>...</artifactId>
                </exclusion>
          </exclusions>
        </dependency>
      </dependencies>
</project>
```

**配置说明**：

- dependencies：一个 pom.xml 文件中只能存在一个这样的标签，是用来管理依赖的总标签。
- dependency：包含在 dependencies 标签中，可以有多个，每一个表示项目的一个依赖。
- groupId,artifactId,version(必要)：依赖的基本坐标，对于任何一个依赖来说，基本坐标是最重要的，Maven 根据坐标才能找到需要的依赖。我们在上面解释过这些元素的具体意思，这里就不重复提了。
- type(可选)：依赖的类型，对应于项目坐标定义的 packaging。大部分情况下，该元素不必声明，其默认值是 jar。
- scope(可选)：依赖的范围，默认值是 compile。
- optional(可选)：标记依赖是否可选
- exclusions(可选)：用来排除传递性依赖,例如 jar 包冲突

### 依赖范围

**classpath** 用于指定 `.class` 文件存放的位置，类加载器会从该路径中加载所需的 `.class` 文件到内存中。

Maven 在编译、执行测试、实际运行有着三套不同的 classpath：

- **编译 classpath**：编译主代码有效
- **测试 classpath**：编译、运行测试代码有效
- **运行 classpath**：项目运行时有效

Maven 的依赖范围如下：

- **compile**：编译依赖范围（默认），使用此依赖范围对于编译、测试、运行三种都有效，即在编译、测试和运行的时候都要使用该依赖 Jar 包。
- **test**：测试依赖范围，从字面意思就可以知道此依赖范围只能用于测试，而在编译和运行项目时无法使用此类依赖，典型的是 JUnit，它只用于编译测试代码和运行测试代码的时候才需要。
- **provided**：此依赖范围，对于编译和测试有效，而对运行时无效。比如 `servlet-api.jar` 在 Tomcat 中已经提供了，我们只需要的是编译期提供而已。
- **runtime**：运行时依赖范围，对于测试和运行有效，但是在编译主代码时无效，典型的就是 JDBC 驱动实现。
- **system**：系统依赖范围，使用 system 范围的依赖时必须通过 systemPath 元素显示地指定依赖文件的路径，不依赖 Maven 仓库解析，所以可能会造成建构的不可移植。

### 传递依赖性

### 依赖冲突

**1、对于 Maven 而言，同一个 groupId 同一个 artifactId 下，只能使用一个 version。**

```xml
<dependency>
    <groupId>in.hocg.boot</groupId>
    <artifactId>mybatis-plus-spring-boot-starter</artifactId>
    <version>1.0.48</version>
</dependency>
<!-- 只会使用 1.0.49 这个版本的依赖 -->
<dependency>
    <groupId>in.hocg.boot</groupId>
    <artifactId>mybatis-plus-spring-boot-starter</artifactId>
    <version>1.0.49</version>
</dependency>
```

若相同类型但版本不同的依赖存在于同一个 pom 文件，只会引入后一个声明的依赖。

**2、项目的两个依赖同时引入了某个依赖。**

举个例子，项目存在下面这样的依赖关系：

```plain
依赖链路一：A -> B -> C -> X(1.0)
依赖链路二：A -> D -> X(2.0)
```

这两条依赖路径上有两个版本的 X，为了避免依赖重复，Maven 只会选择其中的一个进行解析。

**哪个版本的 X 会被 Maven 解析使用呢?**

Maven 在遇到这种问题的时候，会遵循 **路径最短优先** 和 **声明顺序优先** 两大原则。解决这个问题的过程也被称为 **Maven 依赖调解** 。

**路径最短优先**

```plain
依赖链路一：A -> B -> C -> X(1.0) // dist = 3
依赖链路二：A -> D -> X(2.0) // dist = 2
```

依赖链路二的路径最短，因此，X(2.0)会被解析使用。

不过，你也可以发现。路径最短优先原则并不是通用的，像下面这种路径长度相等的情况就不能单单通过其解决了：

```plain
依赖链路一：A -> B -> X(1.0) // dist = 2
依赖链路二：A -> D -> X(2.0) // dist = 2
```

因此，Maven 又定义了声明顺序优先原则。

依赖调解第一原则不能解决所有问题，比如这样的依赖关系：A->B->Y(1.0)、A-> C->Y(2.0)，Y(1.0)和 Y(2.0)的依赖路径长度是一样的，都为 2。Maven 定义了依赖调解的第二原则：

**声明顺序优先**

在依赖路径长度相等的前提下，在 `pom.xml` 中依赖声明的顺序决定了谁会被解析使用，顺序最前的那个依赖优胜。该例中，如果 B 的依赖声明在 D 之前，那么 X (1.0)就会被解析使用。

```xml
<!-- A pom.xml -->
<dependencies>
    ...
    dependency B
    ...
    dependency D
</dependencies>
```

### 排除依赖

单纯依赖 Maven 来进行依赖调解，在很多情况下是不适用的，需要我们手动排除依赖。

举个例子，当前项目存在下面这样的依赖关系：

```plain
依赖链路一：A -> B -> C -> X(1.5) // dist = 3
依赖链路二：A -> D -> X(1.0) // dist = 2
```

根据路径最短优先原则，X(1.0) 会被解析使用，也就是说实际用的是 1.0 版本的 X。

但是！！！这会一些问题：如果 C 依赖用到了 1.5 版本的 X 中才有的一个类，运行项目就会报`NoClassDefFoundError`错误。如果 C 依赖用到了 1.5 版本的 X 中才有的一个方法，运行项目就会报`NoSuchMethodError`错误。

现在知道为什么你的 Maven 项目总是会报`NoClassDefFoundError`和`NoSuchMethodError`错误了吧？

**如何解决呢？** 我们可以通过`exclusion`标签手动将 X(1.0) 给排除。

```xml
<dependency>
    ......
    <exclusions>
      <exclusion>
        <artifactId>x</artifactId>
        <groupId>org.apache.x</groupId>
      </exclusion>
    </exclusions>
</dependency>
```

一般我们在解决依赖冲突的时候，都会优先保留版本较高的。这是因为大部分 jar 在升级的时候都会做到向下兼容。

如果高版本修改了低版本的一些类或者方法的话，这个时候就不能直接保留高版本了，而是应该考虑优化上层依赖，比如升级上层依赖的版本。

还是上面的例子：

```plain
依赖链路一：A -> B -> C -> X(1.5) // dist = 3
依赖链路二：A -> D -> X(1.0) // dist = 2
```

我们保留了 1.5 版本的 X，但是这个版本的 X 删除了 1.0 版本中的某些类。这个时候，我们可以考虑升级 D 的版本到一个 X 兼容的版本。

## Maven 仓库

在 Maven 世界中，任何一个依赖、插件或者项目构建的输出，都可以称为 **构件** 。

坐标和依赖是构件在 Maven 世界中的逻辑表示方式，构件的物理表示方式是文件，Maven 通过仓库来统一管理这些文件。 任何一个构件都有一组坐标唯一标识。有了仓库之后，无需手动引入构件，我们直接给定构件的坐标即可在 Maven 仓库中找到该构件。

Maven 仓库分为：

- **本地仓库**：运行 Maven 的计算机上的一个目录，它缓存远程下载的构件并包含尚未发布的临时构件。`settings.xml` 文件中可以看到 Maven 的本地仓库路径配置，默认本地仓库路径是在 `${user.home}/.m2/repository`。
- **远程仓库**：官方或者其他组织维护的 Maven 仓库。

Maven 远程仓库可以分为：

- **中央仓库**：这个仓库是由 Maven 社区来维护的，里面存放了绝大多数开源软件的包，并且是作为 Maven 的默认配置，不需要开发者额外配置。另外为了方便查询，还提供了一个[查询地址](https://search.maven.org/)，开发者可以通过这个地址更快的搜索需要构件的坐标。
- **私服**：私服是一种特殊的远程 Maven 仓库，它是架设在局域网内的仓库服务，私服一般被配置为互联网远程仓库的镜像，供局域网内的 Maven 用户使用。
- **其他的公共仓库**：有一些公共仓库是为了加速访问（比如阿里云 Maven 镜像仓库）或者部分构件不存在于中央仓库中。

Maven 依赖包寻找顺序：

1. 先去本地仓库找寻，有的话，直接使用。
2. 本地仓库没有找到的话，会去远程仓库找寻，下载包到本地仓库。
3. 远程仓库没有找到的话，会报错。

## Maven 生命周期

Maven 的生命周期就是为了对所有的构建过程进行抽象和统一，包含了项目的清理、初始化、编译、测试、打包、集成测试、验证、部署和站点生成等几乎所有构建步骤。

Maven 定义了 3 个生命周期`META-INF/plexus/components.xml`：

- `default` 生命周期
- `clean`生命周期
- `site`生命周期

这些生命周期是相互独立的，每个生命周期包含多个阶段(phase)。并且，这些阶段是有序的，也就是说，后面的阶段依赖于前面的阶段。当执行某个阶段的时候，会先执行它前面的阶段。

执行 Maven 生命周期的命令格式如下：

```bash
mvn 阶段 [阶段2] ...[阶段n]
```

### default 生命周期

`default`生命周期是在没有任何关联插件的情况下定义的，是 Maven 的主要生命周期，用于构建应用程序，共包含 23 个阶段。

```xml
<phases>
  <!-- 验证项目是否正确，并且所有必要的信息可用于完成构建过程 -->
  <phase>validate</phase>
  <!-- 建立初始化状态，例如设置属性 -->
  <phase>initialize</phase>
  <!-- 生成要包含在编译阶段的源代码 -->
  <phase>generate-sources</phase>
  <!-- 处理源代码 -->
  <phase>process-sources</phase>
  <!-- 生成要包含在包中的资源 -->
  <phase>generate-resources</phase>
  <!-- 将资源复制并处理到目标目录中，为打包阶段做好准备。 -->
  <phase>process-resources</phase>
  <!-- 编译项目的源代码  -->
  <phase>compile</phase>
  <!-- 对编译生成的文件进行后处理，例如对 Java 类进行字节码增强/优化 -->
  <phase>process-classes</phase>
  <!-- 生成要包含在编译阶段的任何测试源代码 -->
  <phase>generate-test-sources</phase>
  <!-- 处理测试源代码 -->
  <phase>process-test-sources</phase>
  <!-- 生成要包含在编译阶段的测试源代码 -->
  <phase>generate-test-resources</phase>
  <!-- 处理从测试代码文件编译生成的文件 -->
  <phase>process-test-resources</phase>
  <!-- 编译测试源代码 -->
  <phase>test-compile</phase>
  <!-- 处理从测试代码文件编译生成的文件 -->
  <phase>process-test-classes</phase>
  <!-- 使用合适的单元测试框架（JUnit 就是其中之一）运行测试 -->
  <phase>test</phase>
  <!-- 在实际打包之前，执行任何的必要的操作为打包做准备 -->
  <phase>prepare-package</phase>
  <!-- 获取已编译的代码并将其打包成可分发的格式，例如 JAR、WAR 或 EAR 文件 -->
  <phase>package</phase>
  <!-- 在执行集成测试之前执行所需的操作。 例如，设置所需的环境 -->
  <phase>pre-integration-test</phase>
  <!-- 处理并在必要时部署软件包到集成测试可以运行的环境 -->
  <phase>integration-test</phase>
  <!-- 执行集成测试后执行所需的操作。 例如，清理环境  -->
  <phase>post-integration-test</phase>
  <!-- 运行任何检查以验证打的包是否有效并符合质量标准。 -->
  <phase>verify</phase>
  <!-- 	将包安装到本地仓库中，可以作为本地其他项目的依赖 -->
  <phase>install</phase>
  <!-- 将最终的项目包复制到远程仓库中与其他开发者和项目共享 -->
  <phase>deploy</phase>
</phases>
```

根据前面提到的阶段间依赖关系理论，当我们执行 `mvn test`命令的时候，会执行从 validate 到 test 的所有阶段，这也就解释了为什么执行测试的时候，项目的代码能够自动编译。

### clean 生命周期

clean 生命周期的目的是清理项目，共包含 3 个阶段：

1. pre-clean
2. clean
3. post-clean

```xml
<phases>
  <!--  执行一些需要在clean之前完成的工作 -->
  <phase>pre-clean</phase>
  <!--  移除所有上一次构建生成的文件 -->
  <phase>clean</phase>
  <!--  执行一些需要在clean之后立刻完成的工作 -->
  <phase>post-clean</phase>
</phases>
<default-phases>
  <clean>
    org.apache.maven.plugins:maven-clean-plugin:2.5:clean
  </clean>
</default-phases>
```

根据前面提到的阶段间依赖关系理论，当我们执行 `mvn clean` 的时候，会执行 clean 生命周期中的 pre-clean 和 clean 阶段。

### site 生命周期

site 生命周期的目的是建立和发布项目站点，共包含 4 个阶段：

1. pre-site
2. site
3. post-site
4. site-deploy

```xml
<phases>
  <!--  执行一些需要在生成站点文档之前完成的工作 -->
  <phase>pre-site</phase>
  <!--  生成项目的站点文档作 -->
  <phase>site</phase>
  <!--  执行一些需要在生成站点文档之后完成的工作，并且为部署做准备 -->
  <phase>post-site</phase>
  <!--  将生成的站点文档部署到特定的服务器上 -->
  <phase>site-deploy</phase>
</phases>
<default-phases>
  <site>
    org.apache.maven.plugins:maven-site-plugin:3.3:site
  </site>
  <site-deploy>
    org.apache.maven.plugins:maven-site-plugin:3.3:deploy
  </site-deploy>
</default-phases>
```

Maven 能够基于 `pom.xml` 所包含的信息，自动生成一个友好的站点，方便团队交流和发布项目信息。

## Maven 插件

Maven 本质上是一个插件执行框架，所有的执行过程，都是由一个一个插件独立完成的。像咱们日常使用到的 install、clean、deploy 等命令，其实底层都是一个一个的 Maven 插件。关于 Maven 的核心插件可以参考官方的这篇文档：<https://maven.apache.org/plugins/index.html> 。

本地默认插件路径: `${user.home}/.m2/repository/org/apache/maven/plugins`

![](https://oss.javaguide.cn/github/javaguide/开发工具/maven/maven-plugins.png)

除了 Maven 自带的插件之外，还有一些三方提供的插件比如单测覆盖率插件 jacoco-maven-plugin、帮助开发检测代码中不合规范的地方的插件 maven-checkstyle-plugin、分析代码质量的 sonar-maven-plugin。并且，我们还可以自定义插件来满足自己的需求。

jacoco-maven-plugin 使用示例：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.8</version>
      <executions>
        <execution>
          <goals>
            <goal>prepare-agent</goal>
          </goals>
        </execution>
        <execution>
          <id>generate-code-coverage-report</id>
          <phase>test</phase>
          <goals>
            <goal>report</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

你可以将 Maven 插件理解为一组任务的集合，用户可以通过命令行直接运行指定插件的任务，也可以将插件任务挂载到构建生命周期，随着生命周期运行。

Maven 插件被分为下面两种类型：

- **Build plugins**：在构建时执行。
- **Reporting plugins**：在网站生成过程中执行。

## Maven 多模块管理

多模块管理简单地来说就是将一个项目分为多个模块，每个模块只负责单一的功能实现。直观的表现就是一个 Maven 项目中不止有一个 `pom.xml` 文件，会在不同的目录中有多个 `pom.xml` 文件，进而实现多模块管理。

多模块管理除了可以更加便于项目开发和管理，还有如下好处：

1. 降低代码之间的耦合性（从类级别的耦合提升到 jar 包级别的耦合）；
2. 减少重复，提升复用性；
3. 每个模块都可以是自解释的（通过模块名或者模块文档）；
4. 模块还规范了代码边界的划分，开发者很容易通过模块确定自己所负责的内容。

多模块管理下，会有一个父模块，其他的都是子模块。父模块通常只有一个 `pom.xml`，没有其他内容。父模块的 `pom.xml` 一般只定义了各个依赖的版本号、包含哪些子模块以及插件有哪些。不过，要注意的是，如果依赖只在某个子项目中使用，则可以在子项目的 pom.xml 中直接引入，防止父 pom 的过于臃肿。

如下图所示，Dubbo 项目就被分成了多个子模块比如 dubbo-common（公共逻辑模块）、dubbo-remoting（远程通讯模块）、dubbo-rpc（远程调用模块）。

![](https://oss.javaguide.cn/github/javaguide/开发工具/maven/dubbo-maven-multi-module.png)

## 文章推荐

- [安全同学讲 Maven 间接依赖场景的仲裁机制 - 阿里开发者 - 2022](https://mp.weixin.qq.com/s/flniMiP-eu3JSBnswfd_Ew)
- [高效使用 Java 构建工具｜ Maven 篇 - 阿里开发者 - 2022](https://mp.weixin.qq.com/s/Wvq7t2FC58jaCh4UFJ6GGQ)
- [安全同学讲 Maven 重打包的故事 - 阿里开发者 - 2022](https://mp.weixin.qq.com/s/xsJkB0onUkakrVH0wejcIg)

## 参考

- 《Maven 实战》
- Introduction to Repositories - Maven 官方文档：<https://maven.apache.org/guides/introduction/introduction-to-repositories.html>
- Introduction to the Build Lifecycle - Maven 官方文档：<https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html#Lifecycle_Reference>
- Maven 依赖范围：<https://www.mvnbook.com/maven-dependency.html>
- 解决 maven 依赖冲突，这篇就够了！：<https://www.cnblogs.com/qdhxhz/p/16363532.html>
- Multi-Module Project with Maven：<https://www.baeldung.com/maven-multi-module>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: maven/Maven 最佳实践.md -->

## [7] Maven 最佳实践

---
title: Maven 最佳实践
description: 总结 Maven 在 Java 项目中的常见最佳实践，涵盖标准目录结构、编译版本、依赖管理、Profile、Maven Wrapper、CI 构建和插件使用。
category: 开发工具
head:
  - - meta
    - name: keywords
      content: Maven坐标,Maven仓库,Maven生命周期,Maven多模块管理,Maven Wrapper,依赖管理
---

> 本文由 JavaGuide 翻译并完善，原文地址：<https://medium.com/@AlexanderObregon/maven-best-practices-tips-and-tricks-for-java-developers-438eca03f72b> 。

Maven 是一种广泛使用的 Java 项目构建自动化工具。它简化了构建过程，并帮助我们管理依赖关系。Maven 详细介绍可以参考这篇文章：[Maven 核心概念总结](./Maven 核心概念总结.md)。

这篇文章不展开 Maven 基础概念，主要讨论项目中更容易踩坑的实践问题：目录结构、编译版本、依赖版本、环境配置、Wrapper、CI 和插件管理。

## Maven 标准目录结构

Maven 遵循标准目录结构来保持项目之间的一致性。遵循这种结构可以让其他开发人员更轻松地理解我们的项目。

Maven 项目的标准目录结构如下：

```groovy
src/
  main/
    java/
    resources/
  test/
    java/
    resources/
pom.xml
```

- `src/main/java`：源代码目录
- `src/main/resources`：资源文件目录
- `src/test/java`：测试代码目录
- `src/test/resources`：测试资源文件目录

这只是一个最简单的 Maven 项目目录示例。实际项目中，我们还会根据项目规范去做进一步的细分。

## 明确指定 Java 编译版本

不要依赖 Maven 或插件的默认编译版本，项目应该在 `pom.xml` 中明确声明目标 Java 版本。对于现代 Java 项目，优先使用 `maven.compiler.release`，它对应 `javac --release`，比单独配置 `source` 和 `target` 更稳妥。

需要注意的是，`javac --release` 从 JDK 9 开始提供；Maven Compiler Plugin 3.13.0 及之后版本在 JDK 8 上也支持 `maven.compiler.release`，会自动转换为 `source` 和 `target`。如果项目仍使用更旧的插件或构建环境，再显式配置 `source`、`target`。

例如，项目需要按 Java 17 编译，可以这样写：

```xml
<properties>
  <maven.compiler.release>17</maven.compiler.release>
</properties>
```

如果需要直接配置 Maven Compiler Plugin，也可以这样写：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.15.0</version>
      <configuration>
        <release>17</release>
      </configuration>
    </plugin>
  </plugins>
</build>
```

`release` 的值不要再写成 `1.8` 这种旧格式。比如 Java 8 写 `8`，Java 17 写 `17`，Java 21 写 `21`。

## 有效管理依赖关系

Maven 的依赖管理系统是其最强大的功能之一。在父 POM 中，通过 `dependencyManagement` 定义公共依赖版本，可以避免多个模块各写一份版本号，降低依赖冲突概率。

例如，假设我们有一个父模块和两个子模块 A 和 B，想要在所有模块中使用 JUnit 5，可以在父模块的 `pom.xml` 文件中通过 `<dependencyManagement>` 定义 JUnit 的版本：

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

在子模块 A 和 B 的 `pom.xml` 文件中，只需要引用 JUnit 的 `groupId` 和 `artifactId` 即可：

```xml
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
  </dependency>
</dependencies>
```

对于 Spring Boot、Spring Cloud 这类已经提供 BOM 的生态，优先导入官方 BOM，再在业务模块里省略具体依赖版本。这样能减少“手工拼版本”带来的兼容性问题。

## 针对不同环境使用配置文件

Maven 配置文件允许我们配置不同环境的构建设置，例如开发、测试和生产。在 `pom.xml` 文件中定义配置文件并使用命令行参数激活它们：

```xml
<profiles>
  <profile>
    <id>development</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
      <environment>dev</environment>
    </properties>
  </profile>
  <profile>
    <id>production</id>
    <properties>
      <environment>prod</environment>
    </properties>
  </profile>
</profiles>
```

使用命令行激活配置文件：

```bash
mvn clean install -P production
```

## 保持 pom.xml 干净且井然有序

组织良好的 `pom.xml` 文件更易于维护和理解。以下是维护干净的 `pom.xml` 的一些技巧：

- 将相似的依赖项和插件组合在一起。
- 使用注释来描述特定依赖项或插件的用途。
- 将公共版本号放在 `<properties>` 标签内，或者统一放到父 POM 的 `dependencyManagement` / `pluginManagement` 中管理。

```xml
<properties>
  <junit.version>5.10.2</junit.version>
  <mockito.version>5.12.0</mockito.version>
</properties>
```

插件版本也建议显式声明。不要依赖 Maven 的默认插件版本，否则不同 Maven 版本或不同构建环境下可能出现行为差异。

## 使用 Maven Wrapper

Maven Wrapper 是一个用于管理和使用 Maven 的工具，它允许在没有预先安装 Maven 的情况下运行和构建 Maven 项目。

Maven 官方文档是这样介绍 Maven Wrapper 的：

> The Maven Wrapper is an easy way to ensure a user of your Maven build has everything necessary to run your Maven build.
>
> Maven Wrapper 是一种简单的方法，可以确保 Maven 构建的用户拥有运行 Maven 构建所需的一切。

Maven Wrapper 可以确保构建过程使用正确的 Maven 版本，非常方便。要使用 Maven Wrapper，请在项目目录中运行以下命令：

```bash
mvn wrapper:wrapper
```

此命令会在我们的项目中生成 Maven Wrapper 文件。现在我们可以使用 `./mvnw` （或 Windows 上的 `./mvnw.cmd`）而不是 `mvn` 来执行 Maven 命令。

团队项目建议提交 `mvnw`、`mvnw.cmd` 和 `.mvn/wrapper/` 目录。这样新成员或 CI 环境不需要预先安装指定版本的 Maven，也能用项目声明的 Maven 版本完成构建。

## 通过持续集成实现构建自动化

将 Maven 项目与持续集成 (CI) 系统（例如 Jenkins 或 GitHub Actions）集成，可确保自动构建、测试和部署我们的代码。CI 有助于及早发现问题并在整个团队中提供一致的构建流程。以下是 Maven 项目的简单 GitHub Actions 工作流程示例：

```yaml
name: Java CI with Maven

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: "temurin"
          cache: "maven"

      - name: Build with Maven
        run: ./mvnw -B clean verify
```

CI 中建议使用 `clean verify`，它会执行测试和必要的校验流程。`install` 会把构建产物安装到本地仓库，只有后续步骤确实依赖本地安装结果时才需要使用。

## 利用 Maven 插件获得附加功能

有许多 Maven 插件可用于扩展 Maven 的功能。一些流行的插件包括（前三个是 Maven 自带的插件，后三个是第三方提供的插件）：

- maven-surefire-plugin：配置并执行单元测试。
- maven-failsafe-plugin：配置并执行集成测试。
- maven-javadoc-plugin：生成 Javadoc 格式的项目文档。
- maven-checkstyle-plugin：强制执行编码标准和最佳实践。
- jacoco-maven-plugin：单测覆盖率。
- sonar-maven-plugin：分析代码质量。
- ……

jacoco-maven-plugin 使用示例：

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.jacoco</groupId>
      <artifactId>jacoco-maven-plugin</artifactId>
      <version>0.8.12</version>
      <executions>
        <execution>
          <goals>
            <goal>prepare-agent</goal>
          </goals>
        </execution>
        <execution>
          <id>generate-code-coverage-report</id>
          <phase>test</phase>
          <goals>
            <goal>report</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

如果这些已有的插件无法满足我们的需求，我们还可以自定义插件。

探索可用的插件并在 `pom.xml` 文件中配置它们以增强我们的开发过程。

## 总结

Maven 最重要的不是“能不能把项目跑起来”，而是让团队在本地、CI 和部署环境中使用一致的构建方式。实际项目里，建议优先做好这几件事：使用标准目录结构，显式声明 Java 和插件版本，通过父 POM、BOM、`dependencyManagement` 管理依赖版本，提交 Maven Wrapper，并在 CI 中固定 JDK 和 Maven 构建命令。


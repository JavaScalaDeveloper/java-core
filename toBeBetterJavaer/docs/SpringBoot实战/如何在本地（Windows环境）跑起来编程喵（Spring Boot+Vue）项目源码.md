---
category:
  - Java企业级开发
tag:
  - Spring Boot
  - Vue
title: 如何在本地（Windows环境）跑起来编程喵（Spring Boot+Vue）项目源码？
shortTitle: Windows下如何运行编程喵源码
---

## 前置环境的准备

- 一台可以开机的电脑
- JDK 8
- Maven
- Intellij IDEA（非必须，可用 Eclipse）
- Visual Studio Code（非必须，可用 hbuilderx）
- MySQL
- Redis（非必须，会报错，但不影响跑）
- OSS（非必须，上传图片时报错，但不影响跑）

对，编程喵 🐱（Spring Boot+Vue 的前后端分离项目）要想在本地跑起来，需要这 8 个前置环境。

第一个条件，一台可以开机的电脑，显然我相信大家都是有的。不然怎么学编程是吧？瞧我这废话真多。

这篇先以 Windows 为例，[macOS系统](https://tobebetterjavaer.com/springboot/macos-codingmore-run.html)戳这个链接。下图是我的备用机小米笔记本的配置。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-de0cd3fc-6120-46b3-bf3d-0d67af8f7065.png)


第二个条件，JDK 8，可以通过 [Chocolatey](https://tobebetterjavaer.com/工具/choco.html)（Windows 软件包管理器）安装，非常方便（前提条件是你得科学上网，否则速度会非常慢，如果不能科学上网我也会提供另外一种常规的方式）。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-c6463fd3-ad81-46e9-9517-95591d506f32.png)


执行 `choco -v` 可以查看 Chocolatey 版本。记得一定要以**管理员身份运行**，否则可以拿不到安装权限。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-64a79f60-3faa-40d2-82d8-2aa2f3cab465.png)



执行 `choco install jdk8` 可以安装 JDK 8 了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-32b4a0f0-e5bb-40ff-b38f-c170a74a3f32.png)

执行 `java -version` 可以查看当前 JDK 版本


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-ec911794-8d5f-41a8-accb-c61852a04960.png)

使用 Chocolatey 安装 JDK 的好处就是不需要再配置环境变量。

如果没有安装 chocolatey 的话（或者没有外网权限的话），可以戳 [Downloads - Java SE 8 (oracle.com)](https://www.oracle.com/👏下载→Java程序员常读书单📚/technologies/面渣逆袭（Java基础篇面试题八股文）必看👍/javase8-archive-downloads.html) 下载 JDK 8。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-904d9d6f-6451-45e5-a723-f84c5ee53268.png)

之后一步步安装完成后，再配置一下环境变量就OK了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-aa883b95-0be0-4d11-8a16-66fddaf28cce.png)



第三个条件，Maven，可以直接通过 `choco install maven` 来完成安装。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-c1e2000e-3312-4ae5-b5dc-a182ed69ff90.png)

也可以戳 [Maven – Download Apache Maven](https://maven.apache.org/download.cgi) 下载免安装版。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-16a4e3ca-ef8b-4261-8082-1804361277c4.png)

之后配置到环境变量中。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-fcfcdb9f-bb03-4fa9-a936-0b7c3fad9163.png)


通过 `mvn -v` 来查看版本。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-ce54cde6-6e29-4534-bc8b-e98f8f4c5f68.png)

为了加快项目依赖包的下载速度，我们需要配置 Maven 的国内镜像源。

找到 Maven Home（`D:\下载\apache-maven-3.8.5-bin\apache-maven-3.8.5`），复制一份 settings.xml。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-ef585110-3879-463f-989a-2da6d3b37a85.png)


到 `C:\Users\yours\.m2` 路径下。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-94b52707-c692-43fc-a97f-04782b4428f4.png)


打开 settings.xml 文件在 mirrors 节点下添加阿里云镜像地址，并保存。

```
<mirror>
  <id>alimaven</id>
  <name>aliyun maven</name>
<url>http://maven.aliyun.com/nexus/content/groups/public/</url>
  <mirrorOf>central</mirrorOf>
</mirror>
```

第四个条件，Intellij IDEA，Java 后端开发必备神器，可以安装社区版，也可以安装旗舰版。

>[https://www.jetbrains.com/zh-cn/idea/下载/#section=mac](https://www.jetbrains.com/zh-cn/idea/下载/#section=mac)


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-91ef4d6f-2274-4276-85ea-467e163d9632.png)


第五个条件，Visual Studio Code，在编写前端代码（vue、JavaScript、css 等）时，比 Intellij IDEA 更值得信赖。

>[https://code.visualstudio.com/](https://code.visualstudio.com/)



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-d3a51721-55b4-4f3e-8f64-f447ea78f5eb.png)




第六个条件，MySQL，可以通过执行 `choco install mysql.installer` 在本机上安装 MySql 的工具箱。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-506b6fb6-b987-429e-bacc-109d75e397a5.png)

也可以戳 [MySQL :: Download MySQL Installer](https://dev.mysql.com/downloads/installer/) 直接下载 MySql的工具箱。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-270a832d-1e72-4d0b-9eb1-22a6d00070c3.png)

之后通过 MySql工具箱来安装 MySQL。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-9fe18b13-23a3-4f93-a198-630147fc5271.png)

如果觉得这个过程比较麻烦的话，也可以直接执行 `choco install mysql` 来安装MySQL。

也可以戳 [MySQL :: Download MySQL Community Server](https://dev.mysql.com/downloads/面渣逆袭（MySQL面试题八股文）必看 👍/) 下载MySQL安装包。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-b04bab72-02f4-480a-8d56-fa18e723c489.png)




安装（记住MySQL的用户名和密码）完成后，可以在计算机管理面板里找到 MySQL 服务。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-25333d10-c440-43cd-a0c8-1b993e6124a5.png)


第七个条件，Redis，可以直接通过 `choco install redis` 来完成安装。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-193ab37e-cf9d-42c4-9040-5e63291f16fc.png)

也可以戳 [Releases · microsoftarchive/redis · GitHub](https://github.com/microsoftarchive/面渣逆袭（Redis面试题八股文）必看👍/releases) 下载 Redis。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-c8537814-8106-4922-8b69-8fe6f529124f.png)

下载完直接安装。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-9584146f-53ea-4c70-b642-790be87c6fc6.png)

安装完成后，可以在计算机管理面板里找到Redis服务。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-5532c69b-d3f5-4661-941e-4aa6586465f6.png)

如果下载的是绿色版免安装版，只需要把 zip 包解压就可以了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-56d7f66e-bcf2-4f2a-aaf7-45753560ccf9.png)


在解压目录下，你会发现一份叫 Windows Service Documentation.docx 的文件，里面详细地说明了 Redis 服务的注册/卸载方式，以及启动/停止方式。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-b87239ff-626a-476a-bf5b-fb88a43c82ea.png)

复制对应命令在 CMD 命令行下执行就OK了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-a5d8eae8-2119-432d-becc-bb8d12de9990.png)



第八个条件，OSS，主要用来保存图片，可以通过阿里云官方去购买服务，并且创建 Bucket。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-cb006c06-dea5-4a6d-b628-2234a6ae4544.png)

然后配置 AccessKey。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-5eb6385b-2098-4d99-b53d-ff0aff188dcc.png)

针对[星球用户](https://tobebetterjavaer.com/zhishixingqiu/)，我会开放自己的 accessKeyId 和 accessKeySecret，请勿外泄，免得被恶意攻击。

## 下载编程喵（codingmore）源码

编程喵一共有三个仓库，分别是：

> - coding-more：编程喵 admin 后端 + Web 前后端，GitHub 地址：[https://github.com/itwanger/coding-more](https://github.com/itwanger/coding-more) 
> - codingmore-admin-web：编程喵 admin 前端，地址：[https://github.com/itwanger/codingmore-admin-web](https://github.com/itwanger/codingmore-admin-web)
> - codingmore-learning：编程喵学习教程（手把手），地址：[https://github.com/itwanger/codingmore-learning](https://github.com/itwanger/codingmore-learning)


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-cec75240-143b-48c5-b4b6-73127bf3f3d5.png)

编程喵 🐱 是一个非常纯粹的前后端分离项目，后端用到的技术包括：

- Spring Boot 容器+MVC 框架
- SpringSecurity 认证和授权框架
- MyBatis ORM 框架
- MyBatis-Plus MyBatis 增强工具
- Nginx 静态资源服务器
- Druid 数据库连接池
- OSS 对象存储
- Redis 缓存中间件
- MySQL 关系型数据库
- Swagger-UI 文档生成工具
- Knife4j Swagger 美化增强工具
- Hibernator-Validator 验证框架
- Logback 日志框架
- Lombok 简化对象封装工具
- Hutool Java 工具类库

前端用到的技术包括：

- Vue 前端框架
- Vue-router 路由框架
- Vuex 全局状态管理框架
- Element 前端 UI 框架
- Axios 前端 HTTP 框架
- Js-cookie cookie 管理工具
- nprogress 进度条控件

**第一步，下载 coding-more 源码**，戳[链接 🔗](https://github.com/itwanger/coding-more)进入到该页面。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-6e566f22-0d5e-4cd4-a13c-b933afd60c94.png)


第二步，如果安装有 GitHub 桌面版的话，可以点击「open with GitHub desktop」，也可以在这一步下载安装GitHub 桌面版。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-8e4680eb-e382-469a-afd2-be0c39cedacf.png)

也可以点击「download zip」。

第三步，通过 Intellij IDEA 导入新项目就可以了，第一次导入的话，需要等待Maven下载依赖包。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-e8918efd-d419-44f2-a118-f2d2d01143ae.png)


第四步，下载 codingmore-admin-web 源码，戳[链接 🔗](https://github.com/itwanger/codingmore-admin-web)进入到该页面。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-9fa980b0-ce8d-4815-86fb-df7684bc7656.png)


源码下载完毕后，建议通过 VS Code 导入项目，VS Code 对前端项目比 Intellij IDEA 更加友好。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-60efa629-f28a-4538-8c9a-0e329f0e7fbb.png)



## 部署编程喵（codingmore）源码



### 01、MySQL

第一步，安装 Navicat，这是一个图形化界面的数据库管理工具。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-6ec673cd-6fa8-42e5-b8a0-1c1db8d4d910.png)


安装完毕后，输入 MySQL 数据库的用户名和密码，建立本地连接。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-da4607d1-2cc9-4a31-8229-aec365c82b5e.png)


第二步，打开链接，新建数据库 codingmore，导入编程喵的 DB 文件。DB 文件放在 coding-more/doc 目录下。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-c4af52b2-593a-470e-8e68-1024462bd5db.png)

导入成功后，可以看到目前 codingmore 所用到的 27 个数据库文件，其中 qrtz 开头的是定时任务的持久化表，剩余是编程喵的数据库表文件。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-e16bebba-a33e-4a5c-a21a-23b25672397e.png)


然后，修改 `codingmore-admin/src/main/resources/application-dev.yml` 文件中的 spring.datasource.username、password、url 等，该为你本地的用户名、密码和数据库链接地址（Web 管理端）。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-51f61012-ca37-4042-ab74-52c986ba9e79.png)


修改 `codingmore-web/src/main/resources/application-dev.yml` 文件中的 spring.datasource.username、password、url 等，该为你本地的用户名、密码和数据库链接地址（Web 前端）。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-0bbf97db-a413-4812-bc75-0246c60dc448.png)



### 02、Redis

在计算机管理面板里启动Redis服务。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-f8573f28-4f60-486b-9266-11d1c18a6f0c.png)

然后，修改 `codingmore-admin/src/main/resources/application-dev.yml` 文件中的 spring.redis.host、database、port、password、timeout 等，该为你本地的 Redis 链接信息，一般默认就好（Web 管理端）。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-c6ea7923-9f6a-49a8-88bc-3d32d84386ab.png)


修改 `codingmore-web/src/main/resources/application-dev.yml` 文件中的 spring.redis.host、database、port、password、timeout 等，该为你本地的 Redis 链接信息，一般默认就好（Web 前端）。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-e12a52ca-f961-401a-9429-1c7b63987c53.png)



### 04、OSS

非[星球用户](https://tobebetterjavaer.com/zhishixingqiu/)需要自己购买阿里云的 OSS 服务和 CDN 服务。[星球用户](https://tobebetterjavaer.com/zhishixingqiu/)可以直接私信我获取 accessKeyId 和 accessKeySecret。

然后修改 `codingmore-admin/src/main/resources/application-dev.yml` 文件中的 aliyun.cdn、oss 等。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-9d511d46-5865-43b4-8d54-02217b534d98.png)



### 05、codingmore-admin

在 Intellij IDEA 中运行 CodingmoreAdminBootstrap 主类，启动管理端后台服务。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-0fcdf421-9e30-4b1d-8da0-23e33db21070.png)


如果编译失败，注意调整 JDK 版本为 Java 8。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-eb63259f-80ae-4f33-b3fb-e634c05b8835.png)

### 06、codingmore-web

在 Intellij IDEA 中运行 CodingmoreAdminBootstrap 主类，启动管理端后台服务。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-e95c9654-3ed4-4fc1-9847-47ea534cf553.png)


启动后，可以直接在浏览器地址栏输入 `http://localhost:8081` 访问 Web 前端。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-9249fe0d-4529-4825-96ef-7d79e551907e.png)



### 07、codingmore-admin-web


在 vscode 中打开终端，执行 `yarn install` 添加项目依赖（yarn 是 Facebook 为 node.js 运行时环境开发软件打包工具，是 npm 软件包管理器的替代品）。

如果没有安装 yarn 的话，会出现以下错误。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-8a24c4c1-d5c4-475e-9445-13194a5c7ade.png)

可以直接以管理员模式执行 `choco install yarn` 来安装 yarn 包。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-3d7609c2-bcd0-40e0-a0fb-3ebf1e38a8e1.png)

如果没有安装 chocolatey 的话，需要戳 [Download | Node.js (nodejs.org)](https://nodejs.org/en/下载/) 先安装node.js：


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-076618e3-6632-44f4-ba9c-88c400c8cdc1.png)

强烈推荐大家安装 chocolatey，安装 node.js 的时候也会出现 chocolatey的影子。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-2660c700-f4de-46b8-86bd-b12b6e5a81eb.png)

再执行 `npm install -g yarn` 来安装 yarn。安装成功后，重新打开 vscode，执行 `yarn -v` 就可以查看 yarn 的版本了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-78a73357-72f9-4d25-88d2-0e723547514f.png)

再次执行 `yarn install` 安装前端环境。之后执行 `yarn run dev` 编译 admin 前端。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-39e0219b-273f-4a5d-89d1-4dc74d606cd7.png)


在浏览器地址栏输入 `http://localhost:8080` 就可以访问到了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-331f1cc4-f52a-4bcd-8e7b-692a7b822e9a.png)


可以点击「获取体验账号」的方式获取登录用户名和密码。当然了，你也可以直接在 users 表上暴力破解密码。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-fd88b4eb-ed76-4e23-83eb-c5e830d354eb.png)


[星球用户](https://tobebetterjavaer.com/zhishixingqiu/)可以直接私信我获取超级管理员的密码。登录后就可以看到文章列表啦。



![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-91ce8f87-dd9a-458a-b6c4-02880c34b7c7.png)

这是文章编辑页，是不是非常清爽？


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/windows-codingmore-run-4094a45f-7aa9-4b9a-a39e-29a8a17d95ba.png)


好了，[MacOS 版](https://tobebetterjavaer.com/springboot/macos-codingmore-run.html)和Windows版如何下载编程喵源码，如何在本地跑起来的整个演示过程就告一段落辣，我们回头见！


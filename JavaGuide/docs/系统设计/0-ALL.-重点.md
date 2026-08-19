---
title: 系统设计 重点汇总
---

# 系统设计 重点汇总

> 从 0-ALL.md 筛选：面试常问与企业开发常用内容。

## TOC

1. J2EE 基础知识 (`J2EE基础知识.md`)
2. Java 定时任务详解 (`Java 定时任务详解.md`)
3. Web 实时消息推送详解 (`Web 实时消息推送详解.md`)
4. JWT 基础概念详解 (`安全/JWT 基础概念详解.md`)
5. JWT 身份认证优缺点分析 (`安全/JWT 身份认证优缺点分析.md`)
6. SSO 单点登录详解 (`安全/SSO 单点登录详解.md`)
7. 常见加密算法总结 (`安全/常见加密算法总结.md`)
8. 敏感词过滤方案总结 (`安全/敏感词过滤方案总结.md`)
9. 权限系统设计详解 (`安全/权限系统设计详解.md`)
10. 认证授权基础概念详解 (`安全/认证授权基础概念详解.md`)
11. 数据脱敏方案总结 (`安全/数据脱敏方案总结.md`)
12. 为什么前后端都要做数据校验？ (`安全/为什么前后端都要做数据校验？.md`)
13. 为什么忘记密码时只能重置，不能告诉你原密码？ (`安全/为什么忘记密码时只能重置，不能告诉你原密码？.md`)
14. RestFul API 简明教程 (`基础/RestFul API 简明教程.md`)
15. 代码命名指南 (`基础/代码命名指南.md`)
16. 代码重构指南 (`基础/代码重构指南.md`)
17. 单元测试到底是什么？应该怎么做？ (`基础/单元测试到底是什么？应该怎么做？.md`)
18. 软件工程简明教程 (`基础/软件工程简明教程.md`)
19. MyBatis常见面试题总结 (`框架/mybatis/MyBatis常见面试题总结.md`)
20. Async 注解原理分析 (`框架/spring/Async 注解原理分析.md`)
21. IoC & AOP详解（快速搞懂） (`框架/spring/IoC & AOP详解（快速搞懂）.md`)
22. Spring 事务详解 (`框架/spring/Spring 事务详解.md`)
23. Spring 中的设计模式详解 (`框架/spring/Spring 中的设计模式详解.md`)
24. Spring&SpringMVC&SpringBoot常用注解总结 (`框架/spring/Spring&SpringMVC&SpringBoot常用注解总结.md`)
25. SpringBoot 自动装配原理详解 (`框架/spring/SpringBoot 自动装配原理详解.md`)
26. Spring常见面试题总结 (`框架/spring/Spring常见面试题总结.md`)
27. 设计模式常见面试题总结 (`设计模式常见面试题总结.md`)

---

<!-- source: J2EE基础知识.md -->

## [1] J2EE 基础知识

---
title: J2EE 基础知识
description: J2EE基础知识详解，涵盖Servlet生命周期、请求转发与重定向、Session与Cookie机制等Java Web核心概念。
category: 系统设计
head:
  - - meta
    - name: keywords
      content: J2EE,Java Web,Servlet,JSP,HTTP请求响应,Servlet生命周期,Session,Cookie
---

## Servlet 总结

> 说明：J2EE 是历史名称，后续更名为 Java EE，当前规范名称为 Jakarta EE。本文主要介绍传统 Servlet/JSP 编程模型。

在 Java Web 程序中，**Servlet** 主要负责接收用户请求 `HttpServletRequest`，在 `doGet()`、`doPost()` 等方法中进行处理，并通过 `HttpServletResponse` 返回响应。Servlet 可以设置初始化参数，供 Servlet 内部使用。在非分布式环境中，Servlet 容器通常为**每个 Servlet 声明**使用一个实例；同一个 Servlet 类如果有多个声明，仍可能有多个实例。容器在初始化时调用 `init()`，在实例退出服务时调用 `destroy()`。Servlet 可以通过 `@WebServlet`、`web.xml` 或程序化 API 声明，一个 Servlet 声明也可映射多个 URL。容器可能让多个线程并发执行同一实例的 `service()` 方法，因此不要在实例字段中保存每次请求的可变状态。

## 阐述 Servlet 和 CGI 的区别?

### CGI 的不足之处

1，需要为每个请求启动一个操作 CGI 程序的系统进程。如果请求频繁，这将会带来很大的开销。

2，需要为每个请求加载和运行一个 CGI 程序，这将带来很大的开销

3，需要重复编写处理网络协议的代码以及编码，这些工作都是非常耗时的。

### Servlet 的优点

1，只需要启动一个操作系统进程以及加载一个 JVM，大大降低了系统的开销

2，如果多个请求需要做同样处理的时候，这时候只需要加载一个类，这也大大降低了开销

3，所有动态加载的类可以实现对网络协议以及请求解码的共享，大大降低了工作量。

4，Servlet 能直接和 Web 服务器交互，而普通的 CGI 程序不能。Servlet 还能在各个程序之间共享数据，使数据库连接池之类的功能很容易实现。

补充：Sun Microsystems 公司在 1996 年发布 Servlet 技术就是为了和 CGI 进行竞争，Servlet 是一个特殊的 Java 程序，一个基于 Java 的 Web 应用通常包含一个或多个 Servlet 类。Servlet 不能够自行创建并执行，它是在 Servlet 容器中运行的，容器将用户的请求传递给 Servlet 程序，并将 Servlet 的响应回传给用户。通常一个 Servlet 会关联一个或多个 JSP 页面。以前 CGI 经常因为性能开销上的问题被诟病，然而 Fast CGI 早就已经解决了 CGI 效率上的问题，所以面试的时候大可不必信口开河的诟病 CGI，事实上有很多你熟悉的网站都使用了 CGI 技术。

参考：《javaweb 整合开发王者归来》P7

## Servlet 接口中有哪些方法及 Servlet 生命周期探秘

Servlet 接口定义了 5 个方法，其中**前三个方法与 Servlet 生命周期相关**：

- `void init(ServletConfig config) throws ServletException`
- `void service(ServletRequest req, ServletResponse resp) throws ServletException, java.io.IOException`
- `void destroy()`
- `java.lang.String getServletInfo()`
- `ServletConfig getServletConfig()`

**生命周期：** **Web 容器加载 Servlet 并将其实例化后，Servlet 生命周期开始**，容器运行其**init()方法**进行 Servlet 的初始化；请求到达时调用 Servlet 的**service()方法**，service()方法会根据需要调用与请求对应的**doGet 或 doPost**等方法；当服务器关闭或项目被卸载时服务器会将 Servlet 实例销毁，此时会调用 Servlet 的**destroy()方法**。**init 方法和 destroy 方法只会执行一次，service 方法客户端每次请求 Servlet 都会执行**。Servlet 中有时会用到一些需要初始化与销毁的资源，因此可以把初始化资源的代码放入 init 方法中，销毁资源的代码放入 destroy 方法中，这样就不需要每次处理客户端的请求都要初始化与销毁资源。

参考：《javaweb 整合开发王者归来》P81

## GET 和 POST 的区别

这个问题在知乎上被讨论的挺火热的，地址：<https://www.zhihu.com/question/28586791> 。

![](https://static001.geekbang.org/infoq/04/0454a5fff1437c32754f1dfcc3881148.png)

GET 和 POST 是 HTTP 协议中两种常用的请求方法，它们在不同的场景和目的下有不同的特点和用法。一般来说，可以从以下几个方面来区分它们：

- 语义上的区别：GET 用于获取目标资源的表现，是安全且幂等的方法。POST 用于请求目标资源按其自身语义处理请求内容，常用于创建资源、提交数据或触发操作，默认不具有幂等语义。
- 格式上的区别：GET 请求的查询条件通常放在 URL 的查询字符串（query string）中，POST 则通常通过请求内容传递数据，可以使用 `application/x-www-form-urlencoded`、`multipart/form-data`、`application/json` 等媒体类型。HTTP 规范没有为 URL 或 POST 请求内容规定一个通用的固定上限，实际限制由浏览器、服务器、网关等组件决定。
- 缓存上的区别：GET 响应默认可缓存，但仍会受 `Cache-Control` 等响应头约束。POST 响应也不是绝对不能缓存，只是需要服务端显式给出可缓存信息，实践中较少这样使用。
- 安全性上的区别：GET 请求和 POST 请求都不是绝对安全的，因为 HTTP 协议本身是明文传输的，无论是 URL、header 还是 body 都可能被窃取或篡改。为了保证安全性，必须使用 HTTPS 协议来加密传输数据。不过，在一些场景下，GET 请求相比 POST 请求更容易泄露敏感数据，因为 GET 请求的参数会出现在 URL 中，而 URL 可能会被记录在浏览器历史、服务器日志、代理日志等地方。因此，一般情况下，私密数据传输应该使用 POST + body。

重点是根据 HTTP 方法的标准语义选择 GET 或 POST。将所有请求都设计为 POST 虽然在技术上可行，但会失去 GET 在缓存、安全重试和中间组件语义上的优势，不应只以“团队达成共识”作为设计依据。

## 什么情况下调用 doGet()和 doPost()

Form 标签里的 method 的属性为 get 时调用 doGet()，为 post 时调用 doPost()。

## 转发(Forward)和重定向(Redirect)的区别

**转发是服务器行为，重定向是客户端行为。**

**转发（Forward）**
通过 RequestDispatcher 对象的 forward（HttpServletRequest request,HttpServletResponse response）方法实现的。RequestDispatcher 可以通过 HttpServletRequest 的 getRequestDispatcher()方法获得。例如下面的代码就是跳转到 login_success.jsp 页面。

```java
     request.getRequestDispatcher("login_success.jsp").forward(request, response);
```

**重定向（Redirect）** 由服务端返回 3xx 状态码和 `Location` 响应头，客户端再向新地址发起请求。Servlet 中通常使用 `HttpServletResponse#sendRedirect()`，也可以手动设置状态码和 `Location`。301、302、303在历史实现中可能将 POST 后续请求改为 GET；需要明确保留原请求方法时，应根据场景使用 307 或 308。

1. **从地址栏显示来说**

   forward 是服务器请求资源,服务器直接访问目标地址的 URL,把那个 URL 的响应内容读取过来,然后把这些内容再发给浏览器.浏览器根本不知道服务器发送的内容从哪里来的,所以它的地址栏还是原来的地址.
   redirect 是服务端根据逻辑,发送一个状态码,告诉浏览器重新去请求那个地址.所以地址栏显示的是新的 URL.

2. **从数据共享来说**

   forward:转发页面和转发到的页面可以共享 request 里面的数据.
   redirect:不能共享数据.

3. **从运用地方来说**

   forward:一般用于用户登陆的时候,根据角色转发到相应的模块.
   redirect:一般用于用户注销登陆时返回主页面和跳转到其它的网站等

4. 从效率来说

   forward:高.
   redirect:低.

## 自动刷新(Refresh)

部分浏览器支持非标准的 `Refresh` 响应头，可以实现延时刷新或跳转。Servlet 中可以通过 `HttpServletResponse` 设置：

```java
response.setHeader("Refresh", "5; url=http://localhost:8080/servlet/example.htm");
```

其中 5 的单位为秒。由于 `Refresh` 不是标准 HTTP 响应头，不应用它替代标准 3xx 重定向；页面刷新也可以根据需求在前端实现。

## Servlet 与线程安全

**Servlet 不是线程安全的，多线程并发的读写会导致数据不同步的问题。** 解决的办法是尽量不要定义 name 属性，而是要把 name 变量分别定义在 doGet()和 doPost()方法内。虽然使用 synchronized(name){}语句块可以解决问题，但是会造成线程的等待，不是很科学的办法。
注意：多线程的并发的读写 Servlet 类属性会导致数据不同步。但是如果只是并发地读取属性而不写入，则不存在数据不同步的问题。因此 Servlet 里的只读属性最好定义为 final 类型的。

参考：《javaweb 整合开发王者归来》P92

## JSP 和 Servlet 是什么关系

其实这个问题在上面已经阐述过了，Servlet 是一个特殊的 Java 程序，它运行于服务器的 JVM 中，能够依靠服务器的支持向浏览器提供显示内容。JSP 本质上是 Servlet 的一种简易形式，JSP 会被服务器处理成一个类似于 Servlet 的 Java 程序，可以简化页面内容的生成。Servlet 和 JSP 最主要的不同点在于，Servlet 的应用逻辑是在 Java 文件中，并且完全从表示层中的 HTML 分离开来。而 JSP 的情况是 Java 和 HTML 可以组合成一个扩展名为.jsp 的文件。有人说，Servlet 就是在 Java 中写 HTML，而 JSP 就是在 HTML 中写 Java 代码，当然这个说法是很片面且不够准确的。JSP 侧重于视图，Servlet 更侧重于控制逻辑，在 MVC 架构模式中，JSP 适合充当视图（view）而 Servlet 适合充当控制器（controller）。

## JSP 工作原理

JSP 页面会由 JSP 容器转换为 Servlet 实现类并编译。对于 HTTP，生成的实现类需要实现 `HttpJspPage` 接口，而 `HttpJspPage` 继承自 `JspPage`。在常见的按需编译配置中，转换和编译发生在第一次请求时；容器也可以预编译 JSP，因此这不是固定发生在首次请求的步骤。生成的 Java 源码和 class 文件通常保存在容器的工作目录中。下面通过实例介绍按需编译的情况。
工程 JspLoginDemo 下有一个名为 login.jsp 的 Jsp 文件，把工程第一次部署到服务器上后访问这个 Jsp 文件，我们发现这个目录下多了下图这两个东东。
.class 文件便是 JSP 对应的 Servlet。编译完毕后再运行 class 文件来响应客户端请求。以后客户端访问 login.jsp 的时候，Tomcat 将不再重新编译 JSP 文件，而是直接调用 class 文件来响应客户端请求。

![JSP工作原理](https://oss.javaguide.cn/github/javaguide/1.jpeg)

在按需编译模式下，首次请求需要完成转换和编译，通常会比后续请求慢。如果删除容器生成的 class 文件，容器在需要该页面时会重新编译 JSP。

开发 Web 程序时经常需要修改 JSP。Tomcat 能够自动检测到 JSP 程序的改动。如果检测到 JSP 源代码发生了改动。Tomcat 会在下次客户端请求 JSP 时重新编译 JSP，而不需要重启 Tomcat。这种自动检测功能是默认开启的，检测改动会消耗少量的时间，在部署 Web 应用的时候可以在 web.xml 中将它关掉。

参考：《javaweb 整合开发王者归来》P97

## JSP 有哪些内置对象、作用分别是什么

[JSP 内置对象 - CSDN 博客](http://blog.csdn.net/qq_34337272/article/details/64310849)

JSP 有 9 个内置对象：

- request：封装客户端的请求，其中包含来自 GET 或 POST 请求的参数；
- response：封装服务器对客户端的响应；
- pageContext：通过该对象可以获取其他对象；
- session：封装用户会话的对象；
- application：封装服务器运行环境的对象；
- out：输出服务器响应的输出流对象；
- config：Web 应用的配置对象；
- page：JSP 页面本身（相当于 Java 程序中的 this）；
- exception：封装页面抛出异常的对象。

## Request 对象的主要方法有哪些

- `setAttribute(String name,Object)`：设置名字为 name 的 request 的参数值
- `getAttribute(String name)`：返回由 name 指定的属性值
- `getAttributeNames()`：返回 request 对象所有属性的名字集合，结果是一个枚举的实例
- `getCookies()`：返回客户端的所有 Cookie 对象，结果是一个 Cookie 数组
- `getCharacterEncoding()`：返回请求使用的字符编码
- `getContentLength()`：返回请求体的字节数，长度未知或超过 `int` 范围时返回 -1；大请求可使用 `getContentLengthLong()`
- `getHeader(String name)`：获得 HTTP 协议定义的文件头信息
- `getHeaders(String name)`：返回指定名字的 request Header 的所有值，结果是一个枚举的实例
- `getHeaderNames()`：返回所以 request Header 的名字，结果是一个枚举的实例
- `getInputStream()`：返回请求的输入流，用于获得请求中的数据
- `getMethod()`：获得客户端向服务器端传送数据的方法
- `getParameter(String name)`：获得客户端传送给服务器端的有 name 指定的参数值
- `getParameterNames()`：获得客户端传送给服务器端的所有参数的名字，结果是一个枚举的实例
- `getParameterValues(String name)`：获得有 name 指定的参数的所有值
- `getProtocol()`：获取客户端向服务器端传送数据所依据的协议名称
- `getQueryString()`：获得查询字符串
- `getRequestURI()`：获取请求行中从协议名到查询字符串之间的 URI 路径部分
- `getRemoteAddr()`：获取客户端的 IP 地址
- `getRemoteHost()`：获取客户端的名字
- `getSession()`：返回与请求关联的 Session，不存在时创建
- `getSession(boolean create)`：返回与请求关联的 Session；当 `create` 为 `false` 且 Session 不存在时返回 `null`
- `getServerName()`：获取服务器的名字
- `getServletPath()`：获取客户端所请求的脚本文件的路径
- `getServerPort()`：获取服务器的端口号
- `removeAttribute(String name)`：删除请求中的一个属性

## request.getAttribute()和 request.getParameter()有何区别

`getParameter()` 读取客户端随请求提交的参数，例如 URL 查询字符串或已解析的表单字段。它返回 `String`，同名参数有多个值时可使用 `getParameterValues()`。

`getAttribute()` 读取服务端代码通过 `setAttribute()` 绑定到当前请求的对象，返回类型为 `Object`。在 `forward` 等服务端请求转发过程中，各组件处理的仍是同一个请求对象，因此可以共享 request attribute；客户端重定向会创建新请求，不会保留原请求的 attribute。这个过程不是容器在页面之间拷贝一块内存。

## include 指令 include 的行为的区别

**include 指令：** JSP 可以通过 include 指令来包含其他文件。被包含的文件可以是 JSP 文件、HTML 文件或文本文件。包含的文件就好像是该 JSP 文件的一部分，会被同时编译执行。 语法格式如下：
<%@ include file="文件相对 url 地址" %>

i**nclude 动作：** `<jsp:include>`动作元素用来包含静态和动态的文件。该动作把指定文件插入正在生成的页面。语法格式如下：
<jsp:include page="相对 URL 地址" flush="true" />

## JSP 九大内置对象，七大动作，三大指令

[JSP 九大内置对象，七大动作，三大指令总结](http://blog.csdn.net/qq_34337272/article/details/64310849)

## 讲解 JSP 中的四种作用域

JSP 中的四种作用域包括 page、request、session 和 application，具体来说：

- **page**代表与一个页面相关的对象和属性。
- **request**代表与 Web 客户机发出的一个请求相关的对象和属性。一个请求可能跨越多个页面，涉及多个 Web 组件；需要在页面显示的临时数据可以置于此作用域。
- **session**代表与某个用户与服务器建立的一次会话相关的对象和属性。跟某个用户相关的数据应该放在用户自己的 session 中。
- **application**代表与整个 Web 应用程序相关的对象和属性，它实质上是跨越整个 Web 应用程序，包括多个页面、请求和会话的一个全局作用域。

## Servlet 并发请求应该如何处理

历史上，JSP 提供过 `<%@ page isThreadSafe="false" %>`，Servlet 也提供过 `SingleThreadModel` 标记接口。`SingleThreadModel` 从 Servlet 2.4 起已废弃，并在 Jakarta Servlet 6.0 中删除；它也不能保证 Session 和静态状态的线程安全，不应作为当前解决方案。

正确做法是尽量让 Servlet 保持无状态，把每次请求的可变数据放在方法局部变量中，不在 Servlet 实例字段中保存。必须共享状态时，应使用适当的并发控制或线程安全数据结构，并尽量缩小临界区。

## 实现会话跟踪的技术有哪些

1. **使用 Cookie**

   向客户端发送 Cookie

   ```java
   Cookie c =new Cookie("name","value"); //创建Cookie
   c.setMaxAge(60*60*24); //设置最大时效，此处设置的最大时效为一天
   response.addCookie(c); //把Cookie放入到HTTP响应中
   ```

   从客户端读取 Cookie

   ```java
   String name ="name";
   Cookie[]cookies =request.getCookies();
   if(cookies !=null){
      for(int i= 0;i<cookies.length;i++){
       Cookie cookie =cookies[i];
       if(name.equals(cookie.getName())) {
         // something is here.
         // you can get the value
         cookie.getValue();
       }

      }
    }

   ```

   **优点:** 数据可以持久保存，不需要服务器资源，简单，基于文本的 Key-Value

   **缺点:** 大小受到限制，用户可以禁用 Cookie 功能，由于保存在本地，有一定的安全风险。

2. URL 重写

   在 URL 中添加用户会话的信息作为请求的参数，或者将唯一的会话 ID 添加到 URL 结尾以标识一个会话。

   **优点：** 在 Cookie 被禁用的时候依然可以使用

   **缺点：** 必须对网站的 URL 进行编码，所有页面必须动态生成，不能用预先记录下来的 URL 进行访问。

3. 隐藏的表单域

   ```html
   <input type="hidden" name="session" value="..." />
   ```

   **优点：** Cookie 被禁时可以使用

   **缺点：** 所有页面必须是表单提交之后的结果。

4. HttpSession

   HttpSession 不会仅因为用户第一次访问网站就必然自动创建。当代码调用 `HttpServletRequest#getSession()`，或某个框架/JSP 功能为当前请求要求 Session 时，容器才会在不存在时创建它。可以通过 `setAttribute()` 和 `getAttribute()` 保存、读取会话属性。HttpSession 数据由服务端管理，具体可保存在内存、分布式存储或持久化介质中，因此不要放入过大对象。在分布式部署或需要会话持久化时，属性通常还需要可序列化，具体要求由容器和会话存储方案决定。

## Cookie 和 Session 的区别

Cookie 和 Session 都是用来跟踪浏览器用户身份的会话方式，但是两者的应用场景不太一样。

**Cookie 一般用来保存用户信息** 比如 ① 我们在 Cookie 中保存已经登录过得用户信息，下次访问网站的时候页面可以自动帮你登录的一些基本信息给填了；② 一般的网站都会有保持登录也就是说下次你再访问网站的时候就不需要重新登录了，这是因为用户登录的时候我们可以存放了一个 Token 在 Cookie 中，下次登录的时候只需要根据 Token 值来查找用户即可(为了安全考虑，重新登录一般要将 Token 重写)；③ 登录一次网站后访问网站其他页面不需要重新登录。**Session 的主要作用就是通过服务端记录用户的状态。** 典型的场景是购物车，当你要添加商品到购物车的时候，系统不知道是哪个用户操作的，因为 HTTP 协议是无状态的。服务端给特定的用户创建特定的 Session 之后就可以标识这个用户并且跟踪这个用户了。

Cookie 数据保存在客户端(浏览器端)，Session 数据保存在服务器端。

Cookie 保存在客户端，Session 状态通常由服务端管理，但这不意味着只要使用 Session 就天然更安全。常见的 Session 仍依赖 Cookie 传递会话标识，该标识一旦被窃取就可能被重放。会话 Cookie 应使用高强度、无业务含义的随机标识，通过 HTTPS 传输，并根据场景设置 `Secure`、`HttpOnly`、`SameSite`、`Path` 和 `Domain` 等属性。不应把密码、银行卡号等敏感业务数据直接写入 Cookie；加密也不能替代完整性保护、过期、撤销和服务端授权校验。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: Java 定时任务详解.md -->

## [2] Java 定时任务详解

---
title: Java 定时任务详解
category: 系统设计
icon: "mdi:clock-outline"
description: 系统讲解 Java 定时任务与延时任务：Timer、ScheduledThreadPoolExecutor、DelayQueue、时间轮、Spring @Scheduled（Cron 表达式），以及 Quartz、XXL-JOB、ElasticJob、PowerJob 等分布式任务调度框架的选型对比与适用场景（订单超时取消/定时备份/定时抓取）。
head:
  - - meta
    - name: keywords
      content: 定时任务,Quartz,Elastic-Job,XXL-JOB,PowerJob
---

## 为什么需要定时任务？

我们来看一下几个非常常见的业务场景：

1. 某系统凌晨 1 点要进行数据备份。
2. 某电商平台，用户下单半个小时未支付的情况下需要自动取消订单。
3. 某媒体聚合平台，每 10 分钟动态抓取某某网站的数据为自己所用。
4. 某博客平台，支持定时发送文章。
5. 某基金平台，每晚定时计算用户当日收益情况并推送给用户最新的数据。
6. ……

这些场景往往都要求我们在某个特定的时间去做某个事情，也就是定时或者延时去做某个事情。

- 定时任务：在指定时间点执行特定的任务，例如每天早上 8 点，每周一下午 3 点等。定时任务可以用来做一些周期性的工作，如数据备份，日志清理，报表生成等。
- 延时任务：一定的延迟时间后执行特定的任务，例如 10 分钟后，3 小时后等。延时任务可以用来做一些异步的工作，如订单取消，推送通知，红包撤回等。

尽管二者的适用场景有所区别，但它们的核心思想都是将任务的执行时间安排在未来的某个点上，以达到预期的调度效果。

## 单机定时任务

### Timer

`java.util.Timer`是 JDK 1.3 开始就已经支持的一种定时任务的实现方式。

`Timer` 内部使用一个叫做 `TaskQueue` 的类存放定时任务，它是一个基于最小堆实现的优先级队列。`TaskQueue` 会按照任务距离下一次执行时间的大小将任务排序，保证在堆顶的任务最先执行。这样在需要执行任务时，每次只需要取出堆顶的任务运行即可！

`Timer` 使用起来比较简单，通过下面的方式我们就能创建一个 1s 之后执行的定时任务。

```java
// 示例代码：
TimerTask task = new TimerTask() {
    public void run() {
        System.out.println("当前时间: " + new Date() + "\n" +
                "线程名称: " + Thread.currentThread().getName());
    }
};
System.out.println("当前时间: " + new Date() + "\n" +
        "线程名称: " + Thread.currentThread().getName());
Timer timer = new Timer("Timer");
long delay = 1000L;
timer.schedule(task, delay);


//输出：
当前时间: Fri May 28 15:18:47 CST 2021
线程名称: main
当前时间: Fri May 28 15:18:48 CST 2021
线程名称: Timer
```

不过其缺陷较多。每个 `Timer` 只使用一个后台线程串行执行所有任务，某个任务执行过久会推迟其他任务。如果 `TimerTask#run()` 抛出未捕获的运行时异常或错误，该 `Timer` 的唯一执行线程会终止，后续任务也无法继续调度。这不是“`Timer` 只捕获 `InterruptedException`”可以准确概括的行为。

`Timer` 类上的有一段注释是这样写的：

```JAVA
 * This class does not offer real-time guarantees: it schedules
 * tasks using the <tt>Object.wait(long)</tt> method.
 *Java 5.0 introduced the {@code java.util.concurrent} package and
 * one of the concurrency utilities therein is the {@link
 * java.util.concurrent.ScheduledThreadPoolExecutor
 * ScheduledThreadPoolExecutor} which is a thread pool for repeatedly
 * executing tasks at a given rate or delay.  It is effectively a more
 * versatile replacement for the {@code Timer}/{@code TimerTask}
 * combination, as it allows multiple service threads, accepts various
 * time units, and doesn't require subclassing {@code TimerTask} (just
 * implement {@code Runnable}).  Configuring {@code
 * ScheduledThreadPoolExecutor} with one thread makes it equivalent to
 * {@code Timer}.
```

大概的意思就是：`ScheduledThreadPoolExecutor` 支持多线程执行定时任务并且功能更强大，是 `Timer` 的替代品。

### ScheduledExecutorService

`ScheduledExecutorService` 是一个接口，有多个实现类，比较常用的是 `ScheduledThreadPoolExecutor` 。

![](https://oss.javaguide.cn/javaguide/20210607154324712.png)

`ScheduledThreadPoolExecutor` 本身就是一个线程池，支持任务并发执行。并且，其内部使用 `DelayedWorkQueue` 作为任务队列。

```java
// 示例代码：
TimerTask repeatedTask = new TimerTask() {
    @SneakyThrows
    public void run() {
        System.out.println("当前时间: " + new Date() + "\n" +
                "线程名称: " + Thread.currentThread().getName());
    }
};
System.out.println("当前时间: " + new Date() + "\n" +
        "线程名称: " + Thread.currentThread().getName());
ScheduledExecutorService executor = Executors.newScheduledThreadPool(3);
long delay  = 1000L;
long period = 1000L;
executor.scheduleAtFixedRate(repeatedTask, delay, period, TimeUnit.MILLISECONDS);
Thread.sleep(delay + period * 5);
executor.shutdown();
//输出：
当前时间: Fri May 28 15:40:46 CST 2021
线程名称: main
当前时间: Fri May 28 15:40:47 CST 2021
线程名称: pool-1-thread-1
当前时间: Fri May 28 15:40:48 CST 2021
线程名称: pool-1-thread-1
当前时间: Fri May 28 15:40:49 CST 2021
线程名称: pool-1-thread-2
当前时间: Fri May 28 15:40:50 CST 2021
线程名称: pool-1-thread-2
当前时间: Fri May 28 15:40:51 CST 2021
线程名称: pool-1-thread-2
当前时间: Fri May 28 15:40:52 CST 2021
线程名称: pool-1-thread-2
```

不论是使用 `Timer` 还是 `ScheduledExecutorService` 都无法使用 Cron 表达式指定任务执行的具体时间。

### DelayQueue

`DelayQueue` 是 JUC 包(`java.util.concurrent)`为我们提供的延迟队列，用于实现延时任务比如订单下单 15 分钟未支付直接取消。它是 `BlockingQueue` 的一种，底层是一个基于 `PriorityQueue` 实现的一个无界队列，是线程安全的。关于`PriorityQueue`可以参考笔者编写的这篇文章：[PriorityQueue 源码分析](https://javaguide.cn/java/集合/priorityqueue-source-code.html) 。

![BlockingQueue 的实现类](https://oss.javaguide.cn/github/javaguide/java/集合/blocking-queue-hierarchy.png)

`DelayQueue` 和 `Timer/TimerTask` 都可以作为延时调度的基础。`DelayQueue` 使用优先级队列管理实现了 `Delayed` 接口的元素，只有延迟到期的元素才能被取出，但它本身不负责创建线程执行任务；通常还需要编写消费循环并选择合适的执行器。`Timer` 则自带一个执行线程。两者都可以在创建后继续添加任务，也都支持取消或移除任务，“`Timer` 只能在创建时指定任务”并不成立。

关于 `DelayQueue` 的详细介绍，请参考我写的这篇文章：[`DelayQueue` 源码分析](https://javaguide.cn/java/集合/delayqueue-source-code.html)。

### Spring Task

我们直接通过 Spring 提供的 `@Scheduled` 注解即可定义定时任务，非常方便！

```java
/**
 * cron：使用Cron表达式。　每分钟的1，2秒运行
 */
@Scheduled(cron = "1-2 * * * * ? ")
public void reportCurrentTimeWithCronExpression() {
  log.info("Cron Expression: The time is now {}", dateFormat.format(new Date()));
}

```

我在大学那会做的一个 SSM 的企业级项目，就是用的 Spring Task 来做的定时任务。

并且，Spring Task 还是支持 **Cron 表达式** 的。Cron 表达式主要用于定时作业(定时任务)系统定义执行时间或执行频率的表达式，非常厉害，你可以通过 Cron 表达式进行设置定时任务每天或者每个月什么时候执行等等操作。咱们要学习定时任务的话，Cron 表达式是一定是要重点关注的。推荐一个在线 Cron 表达式生成器：[http://cron.qqe2.com/](http://cron.qqe2.com/) 。

但是，Spring 自带的定时调度只支持单机，并且提供的功能比较单一。之前写过一篇文章:[《5 分钟搞懂如何在 Spring Boot 中 Schedule Tasks》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485563&idx=1&sn=7419341f04036a10b141b74624a3f8c9&chksm=cea247b0f9d5cea6440759e6d49b4e77d06f4c99470243a10c1463834e873ca90266413fbc92&token=2133161636&lang=zh_CN#rd) ，不了解的小伙伴可以参考一下。

Spring 通过 `TaskScheduler` 提供调度抽象，并不固定只有一种底层实现。常用的 `ThreadPoolTaskScheduler` 内部委托给 `ScheduledExecutorService`；在 Jakarta EE 等环境中也可以使用容器管理的调度器。`@Scheduled` 本身不提供集群协调，同一应用部署多个实例时，每个实例都可能触发任务。

**优缺点总结：**

- 优点：简单，轻量，支持 Cron 表达式
- 缺点：功能单一

### 时间轮

Kafka、Dubbo、ZooKeeper、Netty、Caffeine、Akka 中都有对时间轮的实现。

时间轮简单来说就是一个环形的队列（底层一般基于数组实现），队列中的每一个元素（时间格）都可以存放一个定时任务列表。

时间轮中的每个时间格代表了时间轮的基本时间跨度或者说时间精度，假如时间一秒走一个时间格的话，那么这个时间轮的最高精度就是 1 秒（也就是说 3 s 和 3.9s 会在同一个时间格中）。

下图是一个有 12 个时间格的时间轮，转完一圈需要 12 s。当我们需要新建一个 3s 后执行的定时任务，只需要将定时任务放在下标为 3 的时间格中即可。当我们需要新建一个 9s 后执行的定时任务，只需要将定时任务放在下标为 9 的时间格中即可。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/one-layers-of-time-wheel.png)

那当我们需要创建一个 13s 后执行的定时任务怎么办呢？这个时候可以引入 **圈数/轮数** 的概念。任务仍位于下标为 1 的时间格，同时记录它需要等待的剩余轮数，完整走过一轮再经过 1s 后才执行。不同实现对“当前格是否计入轮数”的约定可能不同，不应脱离具体实现固定写成 2 圈。

除了增加圈数这种方法之外，还有一种 **多层次时间轮** （类似手表），Kafka 采用的就是这种方案。

针对下图的时间轮，我来举一个例子便于大家理解。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/three-layers-of-time-wheel.png)

上图的时间轮(ms -> s)，第 1 层的时间精度为 1 ，第 2 层的时间精度为 20 ，第 3 层的时间精度为 400。假如我们需要添加一个 350s 后执行的任务 A 的话（当前时间是 0s），这个任务会被放在第 2 层（因为第二层的时间跨度为 20\*20=400>350）的第 350/20=17 个时间格子。

当第一层转了 17 圈之后，时间过去了 340s ，第 2 层的指针此时来到第 17 个时间格子。此时，第 2 层第 17 个格子的任务会被移动到第 1 层。

任务 A 当前是 10s 之后执行，因此它会被移动到第 1 层的第 10 个时间格子。

这里在层与层之间的移动也叫做时间轮的升降级。参考手表来理解就好！

**时间轮比较适合管理大量定时器的场景。在时间轮层数和每层槽数有界的典型实现中，定位槽位、插入和推进指针的开销通常可以做到接近 O(1)；但某个刻度的实际执行开销仍取决于到期任务数、级联迁移和具体实现。**

## 分布式定时任务

### Redis

Redis 是可以用来做延时任务的，基于 Redis 实现延时任务的功能无非就下面两种方案：

1. Redis 过期事件监听
2. Redisson 内置的延时队列

这部分内容的详细介绍我放在了[《后端面试高频系统设计&场景题》](https://javaguide.cn/专栏/back-end-interview-high-frequency-system-design-and-scenario-questions.html)中，有需要的同学可以进入星球后阅读学习。篇幅太多，这里就不重复分享了。

![《后端面试高频系统设计&场景题》](https://oss.javaguide.cn/xingqiu/back-end-interview-high-frequency-system-design-and-scenario-questions-fengmian.png)

### MQ

大部分消息队列，例如 RocketMQ、RabbitMQ，都支持定时/延时消息。定时消息和延时消息本质其实是相同的，都是服务端根据消息设置的定时时间在某一固定时刻将消息投递给消费者消费。

不过，在使用 MQ 定时消息之前一定要看清具体产品和版本的限制。例如，RocketMQ 4.x 的官方实现提供 18 个固定延时级别，最长为 2 小时；RocketMQ 5.x 改为按毫秒级 Unix 时间戳设置投递时间，默认允许的最大定时范围为 24 小时。不能把这两套版本机制合并为同一条限制。

**优缺点总结：**

- **优点**：可以与 Spring 集成、支持分布式、支持集群、性能不错
- **缺点**：功能性较差、不灵活、需要保障消息可靠性

## 分布式任务调度框架

如果我们需要一些高级特性比如支持任务在分布式场景下的分片和高可用的话，我们就需要用到分布式任务调度框架了。

通常情况下，一个分布式定时任务的执行往往涉及到下面这些角色：

- **任务**：首先肯定是要执行的任务，这个任务就是具体的业务逻辑比如定时发送文章。
- **调度器**：其次是调度中心，调度中心主要负责任务管理，会分配任务给执行器。
- **执行器**：最后就是执行器，执行器接收调度器分派的任务并执行。

### Quartz

一个很火的开源任务调度框架，完全由 Java 写成。Quartz 可以说是 Java 定时任务领域的老大哥或者说参考标准，其他的任务调度框架基本都是基于 Quartz 开发的，比如当当网的`elastic-job`就是基于 Quartz 二次开发之后的分布式调度解决方案。

使用 Quartz 可以很方便地与 Spring 集成，并且支持动态添加任务和集群。但是，Quartz 使用起来也比较麻烦，API 繁琐。

并且，Quartz 并没有内置 UI 管理控制台，不过你可以使用 [quartzui](https://github.com/zhaopeiym/quartzui) 这个开源项目来解决这个问题。

另外，Quartz 虽然也支持分布式任务。但是，它是在数据库层面，通过数据库的锁机制做的，有非常多的弊端比如系统侵入性严重、节点负载不均衡。有点伪分布式的味道。

**优缺点总结：**

- 优点：可以与 Spring 集成，并且支持动态添加任务和集群。
- 缺点：分布式支持不友好，不支持任务可视化管理、使用麻烦（相比于其他同类型框架来说）

### Elastic-Job

ElasticJob 最初由当当网开源，历史上曾分为 ElasticJob-Lite 和 ElasticJob-Cloud 两个子项目。这种分类以及 ElasticJob-Cloud 对 Mesos 的依赖属于早期版本语境，不应作为当前选型表。当前官方将 ElasticJob 描述为提供分布式任务分片的轻量级、去中心化解决方案，注册中心支持 ZooKeeper 和 etcd。

`ElasticJob` 支持任务在分布式场景下的分片和高可用、任务可视化管理等功能。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/elasticjob-feature-list.png)

下面是早期 ElasticJob-Lite 以 ZooKeeper 为注册中心的架构图，用于理解其去中心化调度思路；当前版本还支持 etcd，不能把图中的组件当成唯一部署方式。

![ElasticJob-Lite 的架构设计](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/elasticjob-lite-architecture-design.png)

在这种部署中，ElasticJob 不设置中心化调度服务，而是使用 ZooKeeper 协调各节点的任务分片。当前版本也可以选择 etcd 作为注册中心。

Elastic-Job 中的定时调度都是由执行器自行触发，这种设计也被称为去中心化设计（调度和处理都是执行器单独完成）。

当前官方 Spring Boot Starter 通过 Spring Bean 和配置文件注册任务，不提供 `@ElasticJobConf` 注解。下面以 ZooKeeper 注册中心为例：

```java
@Component
public class TestJob implements SimpleJob {
    @Override
    public void execute(ShardingContext context) {
        System.out.printf("任务名：%s，分片总数：%d，当前分片参数：%s%n",
                context.getJobName(),
                context.getShardingTotalCount(),
                context.getShardingParameter());
    }
}
```

```yaml
elasticjob:
  regCenter:
    serverLists: localhost:2181
    namespace: elasticjob-demo
  jobs:
    dayJob:
      elasticJobClass: com.example.job.TestJob
      cron: 0/10 * * * * ?
      shardingTotalCount: 2
      shardingItemParameters: 0=AAAA,1=BBBB
```

配置属性和注册中心类型会随版本演进，接入时应以所用版本的 [Spring Boot Starter 文档](https://shardingsphere.apache.org/elasticjob/current/en/user-manual/usage/job-api/spring-boot-starter/)和[注册中心文档](https://shardingsphere.apache.org/elasticjob/current/en/user-manual/configuration/registry-center/)为准。

**相关地址：**

- GitHub 地址：<https://github.com/apache/shardingsphere-elasticjob>。
- 官方网站：<https://shardingsphere.apache.org/elasticjob/index_zh.html> 。

**优缺点总结：**

- 优点：可以与 Spring 集成、支持分布式、支持集群、性能不错、支持任务可视化管理
- 缺点：需要额外部署 ZooKeeper 或 etcd 等注册中心，会增加系统复杂度和维护成本

### XXL-JOB

`XXL-JOB` 于 2015 年开源，是一款优秀的轻量级分布式任务调度框架，支持任务可视化管理、弹性扩容缩容、任务失败重试和告警、任务分片等功能，

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/xxljob-feature-list.png)

根据 `XXL-JOB` 官网介绍，其解决了很多 Quartz 的不足。

> Quartz 作为开源作业调度中的佼佼者，是作业调度的首选。但是集群环境中 Quartz 采用 API 的方式对任务进行管理，从而可以避免上述问题，但是同样存在以下问题：
>
> - 问题一：调用 API 的方式操作任务，不人性化；
> - 问题二：需要持久化业务 QuartzJobBean 到底层数据表中，系统侵入性相当严重。
> - 问题三：调度逻辑和 QuartzJobBean 耦合在同一个项目中，这将导致一个问题，在调度任务数量逐渐增多，同时调度任务逻辑逐渐加重的情况下，此时调度系统的性能将大大受限于业务；
> - 问题四：quartz 底层以“抢占式”获取 DB 锁并由抢占成功节点负责运行任务，会导致节点负载悬殊非常大；而 XXL-JOB 通过执行器实现“协同分配式”运行任务，充分发挥集群优势，负载各节点均衡。
>
> XXL-JOB 弥补了 quartz 的上述不足之处。

`XXL-JOB` 的架构设计如下图所示：

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/xxljob-architecture-design-v2.1.0.png)

从上图可以看出，`XXL-JOB` 由 **调度中心** 和 **执行器** 两大部分组成。调度中心主要负责任务管理、执行器管理以及日志管理。执行器主要是接收调度信号并处理。另外，调度中心进行任务调度时，是通过自研 RPC 来实现的。

不同于 Elastic-Job 的去中心化设计， `XXL-JOB` 的这种设计也被称为中心化设计（调度中心调度多个执行器执行任务）。

和 `Quzrtz` 类似 `XXL-JOB` 也是基于数据库锁调度任务，存在性能瓶颈。不过，一般在任务量不是特别大的情况下，没有什么影响的，可以满足绝大部分公司的要求。

当前版本推荐在 Spring Bean 的无参 `void` 方法上使用 `@XxlJob`。任务参数、日志和执行结果通过 `XxlJobHelper` 处理；`@JobHandler`、带 `String` 入参并返回 `ReturnT` 的写法属于旧版 API。

```java
@Component
public class MyApiJobHandler {

    @XxlJob("myApiJobHandler")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("任务参数：{}", param);
        // 执行业务逻辑；默认执行结果为成功，失败时可调用 XxlJobHelper.handleFail(...)
    }
}
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/xxljob-admin-task-management.png)

**相关地址：**

- GitHub 地址：<https://github.com/xuxueli/xxl-job/>。
- 官方介绍：<https://www.xuxueli.com/xxl-job/> 。

**优缺点总结：**

- 优点：开箱即用（学习成本比较低）、与 Spring 集成、支持分布式、支持集群、支持任务可视化管理。
- 缺点：不支持动态添加任务（如果一定想要动态创建任务也是支持的，参见：[xxl-job issue277](https://github.com/xuxueli/xxl-job/issues/277)）。

### PowerJob

非常值得关注的一个分布式任务调度框架，分布式任务调度领域的新星。目前，已经有很多公司接入比如 OPPO、京东、中通、思科。

这个框架的诞生也挺有意思的，PowerJob 的作者当时在阿里巴巴实习过，阿里巴巴那会使用的是内部自研的 SchedulerX（阿里云付费产品）。实习期满之后，PowerJob 的作者离开了阿里巴巴。想着说自研一个 SchedulerX，防止哪天 SchedulerX 满足不了需求，于是 PowerJob 就诞生了。

更多关于 PowerJob 的故事，小伙伴们可以去看看 PowerJob 作者的视频 [《我和我的任务调度中间件》](https://www.bilibili.com/video/BV1SK411A7F3/)。简单点概括就是：“游戏没啥意思了，我要扛起了新一代分布式任务调度与计算框架的大旗！”。

由于 SchedulerX 属于人民币产品，我这里就不过多介绍。PowerJob 官方也对比过其和 QuartZ、XXL-JOB 以及 SchedulerX。下表是项目方的功能对比，不是独立基准测试；性能和容量仍需结合版本、数据库、部署规模与业务负载验证。

|                | QuartZ                                      | xxl-job                                    | SchedulerX 2.0                                       | PowerJob                                                        |
| -------------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------- |
| 定时类型       | CRON                                        | CRON                                       | CRON、固定频率、固定延迟、OpenAPI                    | **CRON、固定频率、固定延迟、OpenAPI**                           |
| 任务类型       | 内置 Java                                   | 内置 Java、GLUE Java、Shell、Python 等脚本 | 内置 Java、外置 Java（FatJar）、Shell、Python 等脚本 | **内置 Java、外置 Java（容器）、Shell、Python 等脚本**          |
| 分布式计算     | 无                                          | 静态分片                                   | MapReduce 动态分片                                   | **MapReduce 动态分片**                                          |
| 在线任务治理   | 不支持                                      | 支持                                       | 支持                                                 | **支持**                                                        |
| 日志白屏化     | 不支持                                      | 支持                                       | 不支持                                               | **支持**                                                        |
| 调度方式及性能 | 基于数据库锁，有性能瓶颈                    | 基于数据库锁，有性能瓶颈                   | 不详                                                 | **项目方称采用无锁化设计，实际容量需压测**                      |
| 报警监控       | 无                                          | 邮件                                       | 短信                                                 | **WebHook、邮件、钉钉与自定义扩展**                             |
| 系统依赖       | JDBC 支持的关系型数据库（MySQL、Oracle...） | MySQL                                      | 人民币                                               | **任意 Spring Data Jpa 支持的关系型数据库（MySQL、Oracle...）** |
| DAG 工作流     | 不支持                                      | 不支持                                     | 支持                                                 | **支持**                                                        |

## 定时任务方案总结

单机定时任务的常见解决方案有 `Timer`、`ScheduledExecutorService`、`DelayQueue`、Spring Task 和时间轮。对普通 Java 周期或延时任务，通常优先使用 `ScheduledExecutorService` 或 Spring Task；时间轮更适合大量定时器、允许一定时间精度换取调度性能的场景，并不是所有单机任务的默认最佳方案。

Redis 和 MQ 虽然可以实现分布式延时触发，但它们通常不提供完整的任务编排、分片、失败补偿和可视化管理。可靠 MQ 的常见交付语义是“至少一次”，在超时、重试或故障切换时可能出现重复投递，因此消费端必须做幂等处理。周期任务需要调度器持续产生新的触发事件，与一条消息能否被“消费多次”没有直接关系。MQ 仍然很适合订单超时取消等一次性延时触发，也能用于解耦调度与执行。

无论选择哪种方案，上生产前都应明确以下语义：

- 任务是否幂等，如何处理重复执行；
- 应用停机或错过执行时间后，是补执行、跳过还是合并执行；
- 超时、重试、退避、最大尝试次数和死信/人工补偿策略；
- 时区、夏令时、时钟回拨以及集群时钟偏差的处理方式；
- 集群中如何避免非预期的重复调度，并对延迟、成功率、重试和积压建立监控告警。

Quartz、Elastic-Job、XXL-JOB 和 PowerJob 这几个是专门用来做分布式调度的框架，提供的分布式定时任务的功能更为完善和强大，更加适合执行周期性的定时任务。除了 Quartz 之外，另外三者都是支持任务可视化管理的。

XXL-JOB 2015 年推出，使用门槛相对较低，采用中心化调度；ElasticJob 采用去中心化调度，并通过 ZooKeeper 或 etcd 协调任务分片。两者的架构和运维依赖不同，不能据此直接断言某一个框架“性能更好”。选型时应针对实际版本、任务数量、触发频率、分片规模、故障恢复要求和数据库或注册中心负载进行压测。PowerJob 等其他框架也应按相同维度验证，不宜只依据项目方的功能对比表下结论。

这篇文章并没有介绍到实际使用，但是，并不代表实际使用不重要。我在写这篇文章之前，已经动手写过相应的 Demo。像 Quartz，我在大学那会就用过。不过，当时用的是 Spring 。为了能够更好地体验，我自己又在 Spring Boot 上实际体验了一下。如果你并没有实际使用某个框架，就直接说它并不好用的话，是站不住脚的。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: Web 实时消息推送详解.md -->

## [3] Web 实时消息推送详解

---
title: Web 实时消息推送详解
description: 消息推送通常是指网站的运营工作等人员，通过某种工具对用户当前网页或移动设备 APP 进行的主动消息推送。
category: 系统设计
icon: "mdi:message-text-outline"
head:
  - - meta
    - name: keywords
      content: Web消息推送,实时消息,WebSocket,SSE,长轮询,短轮询,MQTT,实时通信方案
---

> 原文地址：<https://juejin.cn/post/7122014462181113887，JavaGuide> 对本文进行了完善总结。

我有一个朋友做了一个小破站，现在要实现一个站内信 Web 消息推送的功能，对，就是下图这个小红点，一个很常用的功能。

![站内信 Web 消息推送](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192380.png)

不过他还没想好用什么方式做，这里我帮他整理了一下几种方案，并简单做了实现。

## 什么是消息推送？

推送的场景比较多，比如有人关注我的公众号，这时我就会收到一条推送消息，以此来吸引我点击打开应用。

消息推送通常是指网站的运营工作等人员，通过某种工具对用户当前网页或移动设备 APP 进行的主动消息推送。

消息推送一般又分为 Web 端消息推送和移动端消息推送。

移动端消息推送示例：

![移动端消息推送示例](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/IKleJ9auR1Ojdicyr0bH.png)

Web 端消息推送示例：

![Web 端消息推送示例](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/image-20220819100512941.png)

在具体实现之前，咱们再来分析一下前边的需求，其实功能很简单，只要触发某个事件（主动分享了资源或者后台主动推送消息），Web 页面的通知小红点就会实时的 `+1` 就可以了。

通常在服务端会有若干张消息推送表，用来记录用户触发不同事件所推送不同类型的消息，前端主动查询（拉）或者被动接收（推）用户所有未读的消息数。

![消息推送表](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192384.png)

消息推送无非是推（push）和拉（pull）两种形式，下边我们逐个了解下。

## 消息推送常见方案

![Web 实时消息推送方案总览](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/web-real-time-message-push-overview.webp)

### 短轮询

**轮询(polling)** 应该是实现消息推送方案中最简单的一种，这里我们暂且将轮询分为短轮询和长轮询。

短轮询很好理解，指定的时间间隔，由浏览器向服务器发出 HTTP 请求，服务器实时返回未读消息数据给客户端，浏览器再做渲染显示。

一个简单的 JS 定时器就可以搞定，每秒钟请求一次未读消息数接口，返回的数据展示即可。

```typescript
setInterval(() => {
  // 方法请求
  messageCount().then((res) => {
    if (res.code === 200) {
      this.messageCount = res.data;
    }
  });
}, 1000);
```

效果还是可以的，短轮询实现固然简单，缺点也是显而易见，由于推送数据并不会频繁变更，无论后端此时是否有新的消息产生，客户端都会进行请求，势必会对服务端造成很大压力，浪费带宽和服务器资源。

### 长轮询

长轮询是对上边短轮询的一种改进版本，在尽可能减少对服务器资源浪费的同时，保证消息的相对实时性。长轮询在中间件中应用的很广泛，比如 Nacos 和 Apollo 配置中心，消息队列 Kafka、RocketMQ 中都有用到长轮询。

[Nacos 配置中心交互模型是 push 还是 pull？](https://mp.weixin.qq.com/s/94ftESkDoZI9gAGflLiGwg)一文中我详细介绍过 Nacos 长轮询的实现原理，感兴趣的小伙伴可以瞅瞅。

长轮询其实原理跟轮询差不多，都是采用轮询的方式。不过，如果服务端的数据没有发生变更，会 一直 hold 住请求，直到服务端的数据发生变化，或者等待一定时间超时才会返回。返回后，客户端又会立即再次发起下一次长轮询。

这次我使用 Apollo 配置中心实现长轮询的方式，应用了一个类`DeferredResult`，它是在 Servlet3.0 后经过 Spring 封装提供的一种异步请求机制，直意就是延迟结果。

![长轮询示意图](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192386.png)

`DeferredResult` 可以让容器先释放处理当前请求的 Servlet 线程，稍后再由应用选择的任意线程、消息回调或其他事件源调用 `setResult()` 恢复响应处理。`DeferredResult` 本身不会自动启动一个工作线程，实际业务在哪个线程上执行由应用决定。

下边我们用长轮询来实现消息推送。

因为一个 ID 可能会被多个长轮询请求监听，所以我采用了 Guava 包提供的 `Multimap` 结构存放长轮询，一个 key 可以对应多个 value。一旦监听到 key 发生变化，对应的所有长轮询都会响应。前端收到新的版本号后，主动查询未读消息数接口并更新页面数据。

```java
@Controller
@RequestMapping("/polling")
public class PollingController {

    // 存放监听某个Id的长轮询集合
    // 线程同步结构
    private static final Multimap<String, DeferredResult<String>> watchRequests =
            Multimaps.synchronizedMultimap(HashMultimap.create());
    // 演示用的内存版本号；生产环境通常应使用业务数据自身的持久化版本
    private static final Map<String, Long> versions = new HashMap<>();

    /**
     * 设置监听
     */
    @GetMapping(path = "watch/{id}")
    @ResponseBody
    public DeferredResult<String> watch(@PathVariable String id,
                                        @RequestParam(defaultValue = "0") long version) {
        // 延迟对象设置超时时间
        DeferredResult<String> deferredResult = new DeferredResult<>(TIME_OUT, "timeout");
        // 异步请求完成时移除 key，防止内存溢出
        deferredResult.onCompletion(() -> {
            watchRequests.remove(id, deferredResult);
        });
        // 版本比较和监听注册必须处于同一临界区，避免发布发生在二者之间而丢通知
        synchronized (watchRequests) {
            long currentVersion = versions.getOrDefault(id, 0L);
            if (currentVersion != version) {
                deferredResult.setResult(Long.toString(currentVersion));
            } else {
                watchRequests.put(id, deferredResult);
            }
        }
        return deferredResult;
    }

    /**
     * 变更数据
     */
    @PostMapping(path = "publish/{id}")
    @ResponseBody
    public String publish(@PathVariable String id) {
        // 在同一同步块内先更新版本，再移除并复制监听快照
        Collection<DeferredResult<String>> deferredResults;
        long currentVersion;
        synchronized (watchRequests) {
            currentVersion = versions.merge(id, 1L, Long::sum);
            deferredResults = new ArrayList<>(watchRequests.removeAll(id));
        }
        for (DeferredResult<String> deferredResult : deferredResults) {
            deferredResult.setResult(Long.toString(currentVersion));
        }
        return "success";
    }
}
```

这里通过 `DeferredResult` 的超时结果返回约定好的 `"timeout"`，前端收到后携带原版本号立即发起下一次长轮询。收到新版本号时，前端先查询最新业务数据，再把该版本号用于下一次监听。版本比较、监听注册和发布递增版本都在同一个临界区内完成，因此即使更新恰好发生在两次请求交接期间，下一次监听也会立即发现版本变化。示例中的内存版本会随进程重启丢失，生产环境应优先使用数据库版本、消息位点等持久化标识，并设计清理策略。

不要把 HTTP 304 用作普通的“请求超时”状态：304 专用于条件请求中表示已缓存的表现仍未修改，且不能包含响应内容。生产项目也可以约定 204 等无内容响应，关键是让服务端和客户端对超时语义保持一致。

我们来测试一下，首先页面携带已知版本发起长轮询请求 `/polling/watch/10086?version=0` 监听消息变更，请求被挂起；紧接着手动变更数据 `/polling/publish/10086`，长轮询返回新版本。前端查询最新数据后，再携带新版本发起下一次请求，如此循环往复。

长轮询相比于短轮询在性能上提升了很多，但依然会产生较多的请求，这是它的一点不完美的地方。

### iframe 流

iframe 流就是在页面中插入一个隐藏的`<iframe>`标签，通过在`src`中请求消息数量 API 接口，由此在服务端和客户端之间创建一条长连接，服务端持续向`iframe`传输数据。

传输的数据通常是 HTML、或是内嵌的 JavaScript 脚本，来达到实时更新页面的效果。

![iframe 流示意图](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192388.png)

这种方式实现简单，前端只要一个`<iframe>`标签搞定了

```html
<iframe src="/iframe/message" style="display:none"></iframe>
```

服务端需要保持响应并在有新数据时写入、及时刷新缓冲区。不能在 Servlet 请求线程中使用不带等待、中断和异常处理的 `while (true)` 循环持续写响应：这会空转消耗 CPU、长时间占用容器线程，还无法在客户端断开时正常收敛。如果必须维护旧式 iframe 流，应使用容器异步 I/O 和事件驱动的写入模型；新系统通常直接选择 SSE 或 WebSocket。

iframe 流的服务器开销很大，而且 IE、Chrome 等浏览器一直会处于 loading 状态，图标会不停旋转，简直是强迫症杀手。

![iframe 流效果](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192389.png)

iframe 流非常不友好，强烈不推荐。

### SSE (推荐)

很多人可能不知道，服务端向客户端推送消息，其实除了可以用`WebSocket`这种耳熟能详的机制外，还有一种服务器发送事件(Server-Sent Events)，简称 SSE。这是一种服务器端到客户端(浏览器)的单向消息推送。

流式对话是 SSE 的一个典型应用场景。服务端可以把已经生成的部分内容持续写入事件流，用户无需等到全部计算完成才看到结果。

![ChatGPT 使用 SSE 实现对话](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/chatgpt-sse.png)

SSE 基于 HTTP，它不是让服务端在没有请求的情况下凭空建立连接，而是让客户端先发起请求，服务端保持该 HTTP 响应并持续写入事件。

![SSE 图解](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192390.png)

SSE 在服务器和客户端之间打开一个单向通道，服务端响应的不再是一次性的数据包而是`text/event-stream`类型的数据流信息，在有数据变更时从服务器流式传输到客户端。

整体的实现思路有点类似于在线视频播放，视频流会连续不断的推送到浏览器，你也可以理解成，客户端在完成一次用时很长（网络不畅）的下载。

![SSE 示意图](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192391.png)

SSE 与 WebSocket 作用相似，都可以建立服务端与浏览器之间的通信，实现服务端向客户端推送消息，但还是有些许不同：

- SSE 使用 HTTP 和 `text/event-stream`，通常更容易接入现有 Web 服务；WebSocket 需要服务器或容器支持协议升级和 WebSocket 帧。它不要求必须单独部署一台服务器。
- SSE 单向通信，只能由服务端向客户端单向通信；WebSocket 全双工通信，即通信的双方可以同时发送和接受信息。
- SSE 实现简单开发成本低，无需引入其他组件；WebSocket 传输数据需做二次解析，开发门槛高一些。
- SSE 默认支持断线重连；WebSocket 则需要自己实现。
- SSE 只能传送文本消息，二进制数据需要经过编码后传送；WebSocket 默认支持传送二进制数据。

![SSE 和 WebSocket 对比](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/sse-vs-websocket-comparison.webp)

**SSE 与 WebSocket 该如何选择？**

> 技术并没有好坏之分，只有哪个更合适。

SSE 好像一直不被大家所熟知，一部分原因是出现了 WebSocket，这个提供了更丰富的协议来执行双向、全双工通信。对于游戏、即时通信以及需要双向近乎实时更新的场景，拥有双向通道更具吸引力。

但是，在某些情况下，不需要从客户端发送数据。而你只需要一些服务器操作的更新。比如：站内信、未读消息数、状态更新、股票行情、监控数量等场景，SSE 不管是从实现的难易和成本上都更加有优势。此外，SSE 具有 WebSocket 在设计上缺乏的多种功能，例如：自动重新连接、事件 ID 和发送任意事件的能力。

前端只需进行一次 HTTP 请求，带上唯一 ID，打开事件流，监听服务端推送的事件就可以了

```javascript
<script>
    let source = null;
    let userId = 7777
    if (window.EventSource) {
        // 建立连接
        source = new EventSource('http://localhost:7777/sse/sub/'+userId);
        setMessageInnerHTML("连接用户=" + userId);
        /**
         * 连接一旦建立，就会触发open事件
         * 另一种写法：source.onopen = function (event) {}
         */
        source.addEventListener('open', function (e) {
            setMessageInnerHTML("建立连接。。。");
        }, false);
        /**
         * 客户端收到服务器发来的数据
         * 另一种写法：source.onmessage = function (event) {}
         */
        source.addEventListener('message', function (e) {
            setMessageInnerHTML(e.data);
        });
    } else {
        setMessageInnerHTML("你的浏览器不支持SSE");
    }
</script>
```

服务端的实现更简单，创建一个`SseEmitter`对象放入`sseEmitterMap`进行管理

```java
private static Map<String, SseEmitter> sseEmitterMap = new ConcurrentHashMap<>();

/**
 * 创建连接
 */
public static SseEmitter connect(String userId) {
    try {
        // 0 表示不设置应用层超时，并非“默认 30 秒”
        SseEmitter sseEmitter = new SseEmitter(0L);
        // 注册回调
        sseEmitter.onCompletion(completionCallBack(userId));
        sseEmitter.onError(errorCallBack(userId));
        sseEmitter.onTimeout(timeoutCallBack(userId));
        sseEmitterMap.put(userId, sseEmitter);
        count.getAndIncrement();
        return sseEmitter;
    } catch (Exception e) {
        log.info("创建新的sse连接异常，当前用户：{}", userId);
    }
    return null;
}

/**
 * 给指定用户发送消息
 */
public static void sendMessage(String userId, String message) {

    if (sseEmitterMap.containsKey(userId)) {
        try {
            sseEmitterMap.get(userId).send(message);
        } catch (IOException e) {
            log.error("用户[{}]推送异常:{}", userId, e.getMessage());
            removeUser(userId);
        }
    }
}
```

上面的 `Map<String, SseEmitter>` 示例每个用户只保留一个连接，新连接会覆盖旧连接。如果要支持多标签页或多设备，应为每个用户维护一组 `SseEmitter`，并在完成、超时和错误回调中移除对应连接。`0L` 也不代表代理、网关和容器永不会断开连接，生产环境需要配置心跳、超时和客户端重连策略。

**注意：** SSE 不支持 IE 浏览器，对其他主流浏览器兼容性做的还不错。

![SSE 兼容性](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192393.png)

### Websocket

Websocket 应该是大家都比较熟悉的一种实现消息推送的方式，上边我们在讲 SSE 的时候也和 Websocket 进行过比较。

这是一种在 TCP 连接上进行全双工通信的协议，建立客户端和服务器之间的通信渠道。浏览器和服务器仅需一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

![Websocket 示意图](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192394.png)

WebSocket 的工作过程可以分为以下几个步骤：

1. 客户端向服务器发送一个 HTTP 请求，请求头中包含 `Upgrade: websocket` 和 `Sec-WebSocket-Key` 等字段，表示要求升级协议为 WebSocket；
2. 服务器收到这个请求后，会进行升级协议的操作，如果支持 WebSocket，它将回复一个 HTTP 101 状态码，响应头中包含 ，`Connection: Upgrade`和 `Sec-WebSocket-Accept: xxx` 等字段、表示成功升级到 WebSocket 协议。
3. 客户端和服务器之间建立了一个 WebSocket 连接，可以进行双向的数据传输。数据以帧（frames）的形式进行传送，而不是传统的 HTTP 请求和响应。WebSocket 的每条消息可能会被切分成多个数据帧（最小单位）。发送端会将消息切割成多个帧发送给接收端，接收端接收消息帧，并将关联的帧重新组装成完整的消息。
4. 客户端或服务器可以主动发送一个关闭帧，表示要断开连接。另一方收到后，也会回复一个关闭帧，然后双方关闭 TCP 连接。

另外，建立 WebSocket 连接之后，通过心跳机制来保持 WebSocket 连接的稳定性和活跃性。

SpringBoot 整合 WebSocket，先引入 WebSocket 相关的工具包，和 SSE 相比有额外的开发成本。

```xml
<!-- 引入websocket -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

服务端使用 `@ServerEndpoint` 注解标注当前类为一个 WebSocket 端点，客户端可以通过 `ws://localhost:7777/websocket/10086` 连接到服务端。路径中的 `userId` 只适合用于演示路由；生产环境必须在握手时验证用户身份，并把连接绑定到已认证的主体，不能相信客户端自行填写的 `userId`。

```java
@Component
@Slf4j
@ServerEndpoint("/websocket/{userId}")
public class WebSocketServer {
    //与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;
    private String userId;
    private static final CopyOnWriteArraySet<WebSocketServer> webSockets = new CopyOnWriteArraySet<>();
    // 用来存在线连接数
    private static final Map<String, Session> sessionPool = new ConcurrentHashMap<>();
    /**
     * 链接成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session, @PathParam(value = "userId") String userId) {
        try {
            this.session = session;
            this.userId = userId;
            webSockets.add(this);
            sessionPool.put(userId, session);
            log.info("websocket消息: 有新的连接，总数为:" + webSockets.size());
        } catch (Exception e) {
            log.error("WebSocket 连接初始化失败，userId={}", userId, e);
        }
    }
    /**
     * 连接关闭时清理当前会话
     */
    @OnClose
    public void onClose() {
        webSockets.remove(this);
        if (userId != null && session != null) {
            sessionPool.remove(userId, session);
        }
    }
    @OnError
    public void onError(Throwable error) {
        log.error("WebSocket 连接异常，userId={}", userId, error);
    }
    /**
     * 收到客户端消息后调用的方法
     */
    @OnMessage
    public void onMessage(String message) {
        log.info("websocket消息: 收到客户端消息:" + message);
    }
    /**
     * 此为单点消息
     */
    public static boolean sendOneMessage(String userId, String message) {
        Session session = sessionPool.get(userId);
        if (session != null && session.isOpen()) {
            try {
                log.info("websocket消: 单点消息:" + message);
                session.getAsyncRemote().sendText(message);
                return true;
            } catch (Exception e) {
                log.error("WebSocket 消息发送失败，userId={}", userId, e);
            }
        }
        return false;
    }
}
```

该示例的 `sessionPool` 同样只保留每个 `userId` 的一个连接。支持多标签页或多设备时，应将值改为会话集合，并为每个连接独立执行发送、心跳、背压和清理逻辑。

如果希望通过 HTTP 接口触发一次服务端推送，可以增加一个与前端参数保持一致的控制器：

```java
@RestController
@RequestMapping("/socket")
public class SocketController {

    @PostMapping("/publish")
    public ResponseEntity<Void> publish(@RequestParam String userId,
                                        @RequestParam String message) {
        return WebSocketServer.sendOneMessage(userId, message)
                ? ResponseEntity.accepted().build()
                : ResponseEntity.notFound().build();
    }
}
```

这个控制器只用于演示请求契约。生产环境还必须对发布接口进行身份认证和授权，不能允许调用方通过任意 `userId` 向其他用户推送消息；同时应限制消息大小和请求频率。

在使用内嵌 Servlet 容器的 Spring Boot 应用中，通常还需要注入 `ServerEndpointExporter`，由它注册使用了 `@ServerEndpoint` 注解的 WebSocket 端点。

```java
@Configuration
public class WebSocketConfiguration {

    /**
     * 用于注册使用了 @ServerEndpoint 注解的 WebSocket 服务器
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
```

前端初始化打开 WebSocket 连接，并监听连接状态，接收服务端数据或向服务端发送数据。

```javascript
<script>
    var ws = new WebSocket('ws://localhost:7777/websocket/10086');
    // 获取连接状态
    console.log('ws连接状态：' + ws.readyState);
    //监听是否连接成功
    ws.onopen = function () {
        console.log('ws连接状态：' + ws.readyState);
        //连接成功则发送一个数据
        ws.send('test1');
    }
    // 接听服务器发回的信息并处理展示
    ws.onmessage = function (data) {
        console.log('接收到来自服务器的消息：');
        console.log(data);
        //完成通信后关闭WebSocket连接
        ws.close();
    }
    // 监听连接关闭事件
    ws.onclose = function () {
        // 监听整个过程中websocket的状态
        console.log('ws连接状态：' + ws.readyState);
    }
    // 监听并处理error事件
    ws.onerror = function (error) {
        console.log(error);
    }
    function sendMessage() {
        var content = $("#message").val();
        $.ajax({
            url: '/socket/publish',
            type: 'POST',
            data: { "userId": "10086", "message": content },
            success: function (data) {
                console.log(data)
            }
        })
    }
</script>
```

页面初始化建立 WebSocket 连接，之后就可以进行双向通信了，效果还不错。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000042192395.png)

### MQTT

**什么是 MQTT 协议？**

MQTT 是一种基于发布/订阅（publish/subscribe）模式的轻量级消息协议，通过订阅主题来获取消息，广泛应用于物联网场景。当前 OASIS 规范直接使用“MQTT”这一名称，不再将其展开为“Message Queue Telemetry Transport”。

该协议将消息的发布者（publisher）与订阅者（subscriber）进行分离，因此可以在不可靠的网络环境中，为远程连接的设备提供可靠的消息服务，使用方式与传统的 MQ 有点类似。

![MQTT 协议示例](https://oss.javaguide.cn/github/javaguide/系统设计/Web 实时消息推送详解/1460000022986325.png)

MQTT 位于应用层，需要运行在有序、无损、双向的字节流传输上。最常见的承载方式是 TCP（生产环境通常配合 TLS），也可以通过 WebSocket 等能提供这种字节流语义的传输承载，因此不应简化为“只要有 TCP/IP 就一定能直接使用”。

**为什么要用 MQTT 协议？**

MQTT 协议为什么在物联网（IOT）中如此受偏爱？而不是其它协议，比如我们更为熟悉的 HTTP 协议呢？

- 经典的短连接 HTTP 请求-响应模式需要设备定期请求或保持长连接才能获取服务端更新；MQTT 则直接提供长连接上的异步发布/订阅模型。HTTP 本身不能笼统定义为“同步协议”，HTTP/2、HTTP/3、SSE 和 WebSocket 升级等机制的行为并不等同于经典的短轮询。
- HTTP 请求由客户端发起，但不意味着服务端永远无法流式返回数据，也不意味着设备不能接收命令。MQTT 的优势是把长连接、主题路由、订阅、QoS 和会话状态等能力标准化了。
- 需要向多个设备发送命令时，MQTT broker 可以按主题将消息分发给所有订阅者；HTTP 也能实现类似功能，但往往需要应用自行管理连接、设备组和重试语义。

具体的 MQTT 协议介绍和实践，这里我就不再赘述了，大家可以参考我之前的两篇文章，里边写的也都很详细了。

- MQTT 协议的介绍：[我也没想到 SpringBoot + RabbitMQ 做智能家居，会这么简单](https://mp.weixin.qq.com/s/udFE6k9pPetIWsa6KeErrA)
- MQTT 实现消息推送：[未读消息（小红点），前端 与 RabbitMQ 实时消息推送实践，贼简单~](https://mp.weixin.qq.com/s/U-fUGr9i1MVa4PoVyiDFCg)

## 总结

> 以下内容为 JavaGuide 补充

|           | 介绍                                                                                                          | 优点                   | 缺点                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------- |
| 短轮询    | 客户端定时向服务端发送请求，服务端直接返回响应数据（即使没有数据更新）                                        | 简单、易理解、易实现   | 实时性太差，无效请求太多，频繁建立连接太耗费资源     |
| 长轮询    | 与短轮询不同是，长轮询接收到客户端请求之后等到有数据更新才返回请求                                            | 减少了无效请求         | 挂起请求会导致资源浪费                               |
| iframe 流 | 服务端和客户端之间创建一条长连接，服务端持续向`iframe`传输数据。                                              | 简单、易理解、易实现   | 维护一个长连接会增加开销，效果太差（图标会不停旋转） |
| SSE       | 一种服务器端到客户端(浏览器)的单向消息推送。                                                                  | 简单、易实现，功能丰富 | 不支持双向通信                                       |
| WebSocket | 除了最初建立连接时用 HTTP 协议，其他时候都是直接基于 TCP 协议进行通信的，可以实现客户端和服务端的全双工通信。 | 性能高、开销小         | 对开发人员要求更高，实现相对复杂一些                 |
| MQTT      | 基于发布/订阅（publish/subscribe）模式的轻量级通讯协议，通过订阅相应的主题来获取消息。                        | 成熟稳定，轻量级       | 对开发人员要求更高，实现相对复杂一些                 |

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/JWT 基础概念详解.md -->

## [4] JWT 基础概念详解

---
title: JWT 基础概念详解
description: JWT基础概念详解，涵盖JSON Web Token的组成结构、签名算法、工作原理及在登录鉴权中的应用。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: JWT,JSON Web Token,Token认证,无状态,Header Payload Signature,签名算法,登录鉴权,CSRF
---

<!-- @include: @article-header.snippet.md -->

## 什么是 JWT?

JWT （JSON Web Token） 是目前最流行的跨域认证解决方案，是一种基于 Token 的认证授权机制。 从 JWT 的全称可以看出，JWT 本身也是 Token，一种规范化之后的 JSON 结构的 Token。

JWT 自身包含了身份验证所需要的所有信息，因此，我们的服务器不需要存储 Session 信息。这显然增加了系统的可用性和伸缩性，大大减轻了服务端的压力。

可以看出，**JWT 更符合设计 RESTful API 时的「Stateless（无状态）」原则** 。

如果客户端把 JWT 作为 Bearer Token 显式放入 `Authorization` Header，浏览器不会像 Cookie 那样自动附带它，因此可以降低传统 CSRF 风险。不过，这取决于凭据的传输和存储方式，而不是 JWT 格式本身；如果把 JWT 放在 Cookie 中，仍然需要 CSRF 防护。

我在 [JWT 优缺点分析](./JWT 身份认证优缺点分析.md)这篇文章中有详细介绍到使用 JWT 做身份认证的优势和劣势。

下面是 [RFC 7519](https://tools.ietf.org/html/rfc7519) 对 JWT 做的较为正式的定义。

> JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. The claims in a JWT are encoded as a JSON object that is used as the payload of a JSON Web Signature (JWS) structure or as the plaintext of a JSON Web Encryption (JWE) structure, enabling the claims to be digitally signed or integrity protected with a Message Authentication Code (MAC) and/or encrypted. ——[JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)

## JWT 由哪些部分组成？

![JWT 组成](https://oss.javaguide.cn/javaguide/系统设计/jwt/jwt-composition.png)

JWT 本质上就是一组字串，通过（`.`）切分成三个为 Base64 编码的部分：

- **Header（头部）** : 描述 JWT 的元数据，定义了生成签名的算法以及 `Token` 的类型。Header 被 Base64Url 编码后成为 JWT 的第一部分。
- **Payload（载荷）** : 用来存放实际需要传递的数据，包含声明（Claims），如`sub`（subject，主题）、`jti`（JWT ID）。Payload 被 Base64Url 编码后成为 JWT 的第二部分。
- **Signature（签名）**：服务器通过 Payload、Header 和一个密钥(Secret)使用 Header 里面指定的签名算法（默认是 HMAC SHA256）生成。生成的签名会成为 JWT 的第三部分。

JWT 通常是这样的：`xxxxx.yyyyy.zzzzz`。

示例：

```plain
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

你可以在 [jwt.io](https://jwt.io/) 这个网站上对其 JWT 进行解码，解码之后得到的就是 Header、Payload、Signature 这三部分。

Header 和 Payload 都是 JSON 格式的数据，Signature 由 Payload、Header 和 Secret(密钥)通过特定的计算公式和加密算法得到。

![](https://oss.javaguide.cn/javaguide/系统设计/jwt/jwt.io.png)

### Header

Header 通常由两部分组成：

- `typ`（Type）：令牌类型，也就是 JWT。
- `alg`（Algorithm）：签名算法，比如 HS256。

示例：

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

JSON 形式的 Header 被转换成 Base64 编码，成为 JWT 的第一部分。

### Payload

Payload 也是 JSON 格式数据，其中包含了 Claims(声明，包含 JWT 的相关信息)。

Claims 分为三种类型：

- **Registered Claims（注册声明）**：预定义的一些声明，建议使用，但不是强制性的。
- **Public Claims（公有声明）**：JWT 签发方可以自定义的声明，但是为了避免冲突，应该在 [IANA JSON Web Token Registry](https://www.iana.org/assignments/jwt/jwt.xhtml) 中定义它们。
- **Private Claims（私有声明）**：JWT 签发方因为项目需要而自定义的声明，更符合实际项目场景使用。

下面是一些常见的注册声明：

- `iss`（issuer）：JWT 签发方。
- `iat`（issued at time）：JWT 签发时间。
- `sub`（subject）：JWT 主题。
- `aud`（audience）：JWT 接收方。
- `exp`（expiration time）：JWT 的过期时间。
- `nbf`（not before time）：JWT 生效时间，早于该定义的时间的 JWT 不能被接受处理。
- `jti`（JWT ID）：JWT 唯一标识。

示例：

```json
{
  "uid": "ff1212f5-d8d1-4496-bf41-d2dda73de19a",
  "sub": "1234567890",
  "name": "John Doe",
  "exp": 15323232,
  "iat": 1516239022,
  "scope": ["admin", "user"]
}
```

Payload 部分默认是不加密的，**一定不要将隐私信息存放在 Payload 当中！！！**

JSON 形式的 Payload 被转换成 Base64 编码，成为 JWT 的第二部分。

### Signature

Signature 部分是对前两部分的签名，作用是防止 JWT（主要是 payload） 被篡改。

这个签名的生成需要用到：

- Header + Payload。
- 存放在服务端的密钥(一定不要泄露出去)。
- 签名算法。

签名的计算公式如下：

```plain
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

算出签名以后，把 Header、Payload、Signature 三个部分拼成一个字符串，每个部分之间用"点"（`.`）分隔，这个字符串就是 JWT 。

## 如何基于 JWT 进行身份验证？

在基于 JWT 进行身份验证的应用程序中，服务器通过 Payload、Header 和密钥创建 JWT 并将 JWT 发送给客户端。客户端需要根据应用形态和威胁模型安全地保存令牌，以后发出的请求会携带这个令牌。

![ JWT 身份验证示意图](https://oss.javaguide.cn/github/javaguide/系统设计/jwt/jwt-authentication%20process.png)

简化后的步骤如下：

1. 用户向服务器发送用户名、密码以及验证码用于登陆系统；
2. 如果用户用户名、密码以及验证码校验正确的话，服务端会返回已经签名的 Token，也就是 JWT；
3. 客户端收到 Token 后安全保存；浏览器应用可以使用 BFF 把令牌保留在服务端，或者根据场景使用受保护的 Cookie；
4. 用户以后每次向后端发请求都在 Header 中带上这个 JWT ；
5. 服务端检查 JWT 并从中获取用户相关信息。

两点建议：

1. 不要默认把 JWT 存放在 `localStorage` 或 `sessionStorage` 中。同源页面中的任意恶意脚本都能读取 Web Storage，一处 XSS 漏洞就可能泄露令牌。使用 Cookie 时，应设置 `HttpOnly`、`Secure` 和合适的 `SameSite` 属性，并同时做好 CSRF 防护。
2. 非 Cookie 方案携带 JWT 的常见做法是将其放在 HTTP Header 的 `Authorization` 字段中（`Authorization: Bearer Token`）。

**[spring-security-jwt-guide](https://github.com/Snailclimb/spring-security-jwt-guide)** 就是一个基于 JWT 来做身份认证的简单案例，感兴趣的可以看看。

## 如何防止 JWT 被篡改？

有了正确校验的签名之后，即使 JWT 被泄露或者截获，攻击者也无法在不知道签名密钥的情况下修改 Header 或 Payload 并生成有效签名。但签名不提供保密性，也不能阻止攻击者直接重放被盗的有效 JWT。

这是为什么呢？因为服务端拿到 JWT 之后，会解析出其中包含的 Header、Payload 以及 Signature 。服务端会根据 Header、Payload、密钥再次生成一个 Signature。拿新生成的 Signature 和 JWT 中的 Signature 作对比，如果一样就说明 Header 和 Payload 没有被修改。

不过，如果服务端的秘钥也被泄露的话，黑客就可以同时篡改 Signature、Header、Payload 了。黑客直接修改了 Header 和 Payload 之后，再重新生成一个 Signature 就可以了。

**密钥一定保管好，一定不要泄露出去。JWT 安全的核心在于签名，签名安全的核心在密钥。**

## 如何加强 JWT 的安全性？

1. 使用成熟的开源库，不要自己实现 JWT 加解密和校验逻辑。
2. 服务端固定允许的算法集合，不能直接信任 JWT Header 中的 `alg` 选择验证算法；HMAC 密钥要有足够的随机性和长度。
3. 验证所有与当前应用有关的声明，包括 `iss`、`aud`、`exp` 和 `nbf`，并为允许的时钟偏差设置明确上限。
4. 对 ID Token、Access Token 等不同用途的 JWT 使用显式 `typ` 和互斥的校验规则，防止一种令牌被替换到另一种场景。
5. 一定不要将隐私信息存放在未加密的 Payload 当中，也不能把收到但尚未验证的 Claim 当作可信输入。
6. 根据客户端类型选择安全的令牌存储方式，限制令牌有效期、权限范围和接收方；高风险场景还要考虑撤销、重放检测或发送者约束。
7. 密钥必须妥善保管并支持轮换。更完整的安全要求可以参考 [RFC 8725：JSON Web Token Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html)。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/JWT 身份认证优缺点分析.md -->

## [5] JWT 身份认证优缺点分析

---
title: JWT 身份认证优缺点分析
description: JWT身份认证优缺点深度分析，讲解JWT无法主动失效、Token续期等问题及对应的解决方案。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: JWT,Token认证,无状态认证,JWT缺点,刷新令牌,注销失效,安全风险,替代方案
---

校招面试中，遇到大部分的候选者认证登录这块用的都是 JWT。提问 JWT 的概念性问题以及使用 JWT 的原因，基本都能回答一些，但当问到 JWT 存在的一些问题和解决方案时，只有一小部分候选者回答的还可以。

JWT 不是银弹，也有很多缺陷，很多时候并不是最优的选择。这篇文章，我们一起探讨一下 JWT 身份认证的优缺点以及常见问题的解决办法，来看看为什么很多人不再推荐使用 JWT 了。

关于 JWT 的基本概念介绍请看我写的这篇文章： [JWT 基本概念详解](https://javaguide.cn/系统设计/安全/jwt-intro.html)。

## JWT 的优势

相比于 Session 认证的方式来说，使用 JWT 进行身份认证主要有下面 4 个优势。

### 无状态

JWT 自身包含了身份验证所需要的所有信息，因此，我们的服务器不需要存储 JWT 信息。这显然增加了系统的可用性和伸缩性，大大减轻了服务端的压力。

不过，也正是由于 JWT 的无状态，也导致了它最大的缺点：**不可控！**

就比如说，我们想要在 JWT 有效期内废弃一个 JWT 或者更改它的权限的话，并不会立即生效，通常需要等到有效期过后才可以。再比如说，当用户 Logout 的话，JWT 也还有效。除非，我们在后端增加额外的处理逻辑比如将失效的 JWT 存储起来，后端先验证 JWT 是否有效再进行处理。具体的解决办法，我们会在后面的内容中详细介绍到，这里只是简单提一下。

### 使用 Authorization Header 可降低传统 CSRF 风险

**CSRF（Cross Site Request Forgery）** 一般被翻译为 **跨站请求伪造**，属于网络攻击领域范围。相比于 SQL 脚本注入、XSS 等安全攻击方式，CSRF 的知名度并没有它们高。但是，它的确是我们开发系统时必须要考虑的安全隐患。就连业内技术标杆 Google 的产品 Gmail 也曾在 2007 年的时候爆出过 CSRF 漏洞，这给 Gmail 的用户造成了很大的损失。

**那么究竟什么是跨站请求伪造呢？** 简单来说就是用你的身份去做一些不好的事情（发送一些对你不友好的请求比如恶意转账）。

举个简单的例子：小壮登录了某网上银行，他来到了网上银行的帖子区，看到一个帖子下面有一个链接写着“科学理财，年盈利率过万”，小壮好奇的点开了这个链接，结果发现自己的账户少了 10000 元。这是这么回事呢？原来黑客在链接中藏了一个请求，这个请求直接利用小壮的身份给银行发送了一个转账请求，也就是通过你的 Cookie 向银行发出请求。

```html
<a href="http://www.mybank.com/Transfer?bankId=11&money=10000"
  >科学理财，年盈利率过万</a
>
```

传统 CSRF 攻击利用的是浏览器会自动附带身份凭据这一特性，最常见的凭据就是 Cookie 中的 `SessionID`。即使攻击者无法读取 `SessionID`，也可能诱导浏览器携带它向目标站点发出请求。

另外，并不是必须点击链接才可以达到攻击效果，很多时候，只要你打开了某个页面，CSRF 攻击就会发生。

```html
<img src="http://www.mybank.com/Transfer?bankId=11&money=10000" />
```

**那为什么使用 JWT 时经常说 CSRF 风险更低呢？**

如果客户端将 JWT 作为 Bearer Token，显式放入 HTTP `Authorization` Header，浏览器不会像 Cookie 那样自动把它附带到跨站请求中，因此可以降低这类传统 CSRF 风险。这里起作用的是凭据的传输方式，而不是 JWT 这种数据格式本身。

不过，不能因此默认把 JWT 存进 `localStorage`。同源页面中的任意恶意脚本都可以读取 Web Storage，一处 XSS 漏洞就可能导致 access token 或 refresh token 被直接窃取。浏览器应用需要结合威胁模型选择方案，例如使用 `HttpOnly`、`Secure`、合适 `SameSite` 属性的 Cookie，或者使用 Backend For Frontend（BFF）把令牌保留在服务端。

如果使用 Cookie 保存登录凭据，就要同时做好 CSRF 防护，例如 CSRF Token、`Origin`/`Referer` 校验和 `SameSite` Cookie。`SameSite` 通常应作为纵深防御，不能在所有部署中单独替代 CSRF Token。

防范 XSS 不能依赖一个通用的“可疑字符串过滤器”。更可靠的做法是在数据输出到 HTML、属性、JavaScript、CSS、URL 等不同上下文时分别进行正确编码；确实允许用户提交 HTML 时，使用持续更新的成熟 HTML 净化库；再通过 CSP 等机制提供纵深防御。

### 适合移动端应用

使用 Session 进行身份认证的话，需要保存一份信息在服务器端，而且这种方式会依赖到 Cookie（需要 Cookie 保存 `SessionId`），所以不适合移动端。

但是，使用 JWT 进行身份认证就不会存在这种问题，因为只要 JWT 可以被客户端存储就能够使用，而且 JWT 还可以跨语言使用。

> 为什么使用 Session 进行身份认证的话不适合移动端 ？
>
> 1. 状态管理: Session 基于服务器端的状态管理，而移动端应用通常是无状态的。移动设备的连接可能不稳定或中断，因此难以维护长期的会话状态。如果使用 Session 进行身份认证，移动应用需要频繁地与服务器进行会话维护，增加了网络开销和复杂性;
> 2. 兼容性: 移动端应用通常会面向多个平台，如 iOS、Android 和 Web。每个平台对于 Session 的管理和存储方式可能不同，可能导致跨平台兼容性的问题;
> 3. 安全性: 移动设备通常处于不受信任的网络环境，存在数据泄露和攻击的风险。将敏感的会话信息存储在移动设备上增加了被攻击的潜在风险。

### 单点登录友好

使用 Session 进行身份认证的话，实现单点登录，需要我们把用户的 Session 信息保存在一台电脑上，并且还会遇到常见的 Cookie 跨域的问题。但是，使用 JWT 进行认证的话， JWT 被保存在客户端，不会存在这些问题。

## JWT 身份认证常见问题及解决办法

### 注销登录等场景下 JWT 还有效

与之类似的具体相关场景有：

- 退出登录;
- 修改密码;
- 服务端修改了某个用户具有的权限或者角色；
- 用户的帐户被封禁/删除；
- 用户被服务端强制注销；
- 用户被踢下线；
- ……

这个问题不存在于 Session 认证方式中，因为在 Session 认证方式中，遇到这种情况的话服务端删除对应的 Session 记录即可。但是，使用 JWT 认证的方式就不好解决了。我们也说过了，JWT 一旦派发出去，如果后端不增加其他逻辑的话，它在失效之前都是有效的。

那我们如何解决这个问题呢？查阅了很多资料，我简单总结了下面 4 种方案：

**1、将 JWT 存入数据库**

将有效的 JWT 存入数据库中，更建议使用内存数据库比如 Redis。如果需要让某个 JWT 失效就直接从 Redis 中删除这个 JWT 即可。但是，这样会导致每次使用 JWT 都要先从 Redis 中查询 JWT 是否存在的步骤，而且违背了 JWT 的无状态原则。

**2、黑名单机制**

和上面的方式类似，使用内存数据库比如 Redis 维护一个黑名单，如果想让某个 JWT 失效的话就直接将这个 JWT 加入到 **黑名单** 即可。然后，每次使用 JWT 进行请求的话都会先判断这个 JWT 是否存在于黑名单中。

前两种方案的核心在于将有效的 JWT 存储起来或者将指定的 JWT 拉入黑名单。

虽然这两种方案都违背了 JWT 的无状态原则，但是一般实际项目中我们通常还是会使用这两种方案。

**3、修改密钥 (Secret)** :

我们为每个用户都创建一个专属密钥，如果我们想让某个 JWT 失效，我们直接修改对应用户的密钥即可。但是，这样相比于前两种引入内存数据库带来了危害更大：

- 如果服务是分布式的，则每次发出新的 JWT 时都必须在多台机器同步密钥。为此，你需要将密钥存储在数据库或其他外部服务中，这样和 Session 认证就没太大区别了。
- 如果用户同时在两个浏览器打开系统，或者在手机端也打开了系统，如果它从一个地方将账号退出，那么其他地方都要重新进行登录，这是不可取的。

**4、保持令牌的有效期限短并经常轮换**

很简单的一种方式。但是，会导致用户登录状态不会被持久记录，而且需要用户经常登录。

另外，对于修改密码后 JWT 还有效问题的解决还是比较容易的。说一种我觉得比较好的方式：**使用用户的密码的哈希值对 JWT 进行签名。因此，如果密码更改，则任何先前的令牌将自动无法验证。**

### JWT 的续签问题

JWT 有效期一般都建议设置的不太长，那么 JWT 过期后如何认证，如何实现动态刷新 JWT，避免用户经常需要重新登录？

我们先来看看在 Session 认证中一般的做法：**假如 Session 的有效期 30 分钟，如果 30 分钟内用户有访问，就把 Session 有效期延长 30 分钟。**

JWT 认证的话，我们应该如何解决续签问题呢？查阅了很多资料，我简单总结了下面 4 种方案：

**1、类似于 Session 认证中的做法（不推荐）**

这种方案满足于大部分场景。假设服务端给的 JWT 有效期设置为 30 分钟，服务端每次进行校验时，如果发现 JWT 的有效期马上快过期了，服务端就重新生成 JWT 给客户端。客户端每次请求都检查新旧 JWT，如果不一致，则更新本地的 JWT。这种做法的问题是仅仅在快过期的时候请求才会更新 JWT ，对客户端不是很友好。

**2、每次请求都返回新 JWT（不推荐）**

这种方案的思路很简单，但是，开销会比较大，尤其是在服务端要存储维护 JWT 的情况下。

**3、JWT 有效期设置到半夜（不推荐）**

这种方案是一种折衷的方案，保证了大部分用户白天可以正常登录，适用于对安全性要求不高的系统。

**4、使用短期访问令牌和长期刷新令牌（推荐）**

第一个是短期的 access token，例如半个小时后过期；另一个是生命周期更长的 refresh token，只用于获取新的 access token。两者不一定都要使用 JWT 格式。refresh token 权限高、存活时间长，是攻击者重点窃取的凭据，不能因为它使用频率低就认为“不容易泄露”。

客户端登录后，每次访问携带 access token。access token 过期后，客户端通过受保护的 refresh token 换取新的 access token。浏览器应用不应默认把 refresh token 放进 `localStorage`，可以通过 BFF 或受保护的 Cookie 降低令牌被脚本直接读取的风险。

这种方案的不足是：

- 需要客户端来配合；
- 用户注销、修改密码或发生其他安全事件时，需要撤销相应的刷新授权；
- 重新请求获取 JWT 的过程中会有短暂 JWT 不可用的情况（可以通过在客户端设置定时器，当 accessJWT 快过期的时候，提前去通过 refreshJWT 获取新的 accessJWT）;
- 对公共客户端，授权服务器需要使用刷新令牌轮换并检测旧令牌重放，或者使用发送者约束的刷新令牌。刷新令牌还应绑定客户端、授权范围和资源服务器，并设置闲置过期时间。

### JWT 体积太大

JWT 结构复杂（Header、Payload 和 Signature），包含了更多额外的信息，还需要进行 Base64Url 编码，这会使得 JWT 体积较大，增加了网络传输的开销。

JWT 组成:

![JWT 组成](https://oss.javaguide.cn/javaguide/系统设计/jwt/jwt-composition.png)

JWT 示例：

```plain
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

解决办法：

- 尽量减少 JWT Payload（载荷）中的信息，只保留必要的用户和权限信息。
- 在传输 JWT 之前，使用压缩算法（如 GZIP）对 JWT 进行压缩以减少体积。
- 在某些情况下，使用传统的 Token 可能更合适。传统的 Token 通常只是一个唯一标识符，对应的信息（例如用户 ID、Token 过期时间、权限信息）存储在服务端，通常会通过 Redis 保存。

## 总结

JWT 其中一个很重要的优势是无状态，但实际上，我们想要在实际项目中合理使用 JWT 做认证登录的话，也还是需要保存 JWT 信息。

JWT 也不是银弹，也有很多缺陷，具体是选择 JWT 还是 Session 方案还是要看项目的具体需求。万万不可尬吹 JWT，而看不起其他身份认证方案。

另外，不用 JWT 直接使用普通的 Token(随机生成的 ID，不包含具体的信息) 结合 Redis 来做身份认证也是可以的。

## 参考

- RFC 9700 - Best Current Practice for OAuth 2.0 Security：<https://www.rfc-editor.org/rfc/rfc9700.html>
- OWASP Session Management Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html>
- OWASP Cross Site Scripting Prevention Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html>
- JWT 超详细分析：<https://learnku.com/articles/17883>
- How to log out when using JWT：<https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6>
- CSRF protection with JSON Web JWTs：<https://medium.com/@agungsantoso/csrf-protection-with-json-web-JWTs-83e0f2fcbcc>
- Invalidating JSON Web JWTs：<https://stackoverflow.com/questions/21978658/invalidating-json-web-JWTs>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/SSO 单点登录详解.md -->

## [6] SSO 单点登录详解

---
title: SSO 单点登录详解
description: SSO单点登录原理详解，涵盖统一认证中心设计、CAS协议、跨域登录实现及登录态同步机制。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: SSO,单点登录,统一认证,登录态,票据,TGT,ST,CAS协议,跨域登录
---

> 本文授权转载自：<https://ken.io/note/sso-design-implement> 作者：ken.io

## SSO 介绍

### 什么是 SSO？

SSO 英文全称 Single Sign On，单点登录。SSO 是在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统。

例如你登录网易账号中心（<https://reg.163.com/> ）之后访问以下站点都是登录状态。

- 网易直播 [https://v.163.com](https://v.163.com/)
- 网易博客 [https://blog.163.com](https://blog.163.com/)
- 网易花田 [https://love.163.com](https://love.163.com/)
- 网易考拉 [https://www.kaola.com](https://www.kaola.com/)
- 网易 Lofter [http://www.lofter.com](http://www.lofter.com/)

### SSO 有什么好处？

1. **用户角度** :用户能够做到一次登录多次使用，无需记录多套用户名和密码，省心。
2. **系统管理员角度** : 管理员只需维护好一个统一的账号中心就可以了，方便。
3. **新系统开发角度:** 新系统开发时只需直接对接统一的账号中心即可，简化开发流程，省时。

## SSO 设计与实现

本篇文章也主要是为了探讨如何设计&实现一个 SSO 系统

以下为需要实现的核心功能：

- 单点登录
- 单点登出
- 支持跨域单点登录
- 支持跨域单点登出

### 核心应用与依赖

![单点登录（SSO）设计](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-system.png-kblb.png)

| 应用/模块/对象    | 说明                                |
| ----------------- | ----------------------------------- |
| 前台站点          | 需要登录的站点                      |
| SSO 站点-登录     | 提供登录的页面                      |
| SSO 站点-登出     | 提供注销登录的入口                  |
| SSO 服务-登录     | 提供登录服务                        |
| SSO 服务-登录状态 | 提供登录状态校验/登录信息查询的服务 |
| SSO 服务-登出     | 提供用户注销登录的服务              |
| 数据库            | 存储用户账户信息                    |
| 缓存              | 存储用户的登录信息，通常使用 Redis  |

### 用户登录状态的存储与校验

常见的 Web 框架对于 Session 的实现都是生成一个 SessionId 存储在浏览器 Cookie 中。然后将 Session 内容存储在服务器端内存中，这个 [ken.io](https://ken.io/) 在之前[Session 工作原理](https://ken.io/note/session-principle-skill)中也提到过。整体也是借鉴这个思路。

用户登录成功后，SSO 站点建立自己的登录会话。浏览器中的会话标识应保存在设置了 `Secure`、`HttpOnly` 和合适 `SameSite` 属性的 Cookie 中；Cookie 尽量只作用于当前主机，不要为了共享登录态而直接扩大到整个父域。手机 App 则应使用系统浏览器完成标准授权流程，并把必要凭据保存在 Keychain、Keystore 等安全存储中。本篇主要探讨基于 Web 站点的 SSO。

用户在浏览需要登录的页面时，客户端将 AuthToken 提交给 SSO 服务校验登录状态/获取用户登录信息

对于登录信息的存储，建议采用 Redis，使用 Redis 集群来存储登录信息，既可以保证高可用，又可以线性扩充。同时也可以让 SSO 服务满足负载均衡/可伸缩的需求。

| 对象      | 说明                                                                                                                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| AuthToken | 使用密码学安全随机数生成的高熵、不可预测标识，并设置过期、轮换和撤销机制。不要使用可预测的 UUID 版本，也不要自行把 UserName+时间戳加密后当作会话令牌 |
| 登录信息  | 通常是将 UserId，UserName 缓存起来                                                                                                                   |

### 用户登录/登录校验

**登录时序图**

![SSO系统设计-登录时序图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-login-sequence.png-kbrb.png)

上图展示的是通过父域 Cookie 在多个子域间共享 AuthToken 的做法。新系统不建议把认证 Cookie 的 `Domain` 设置为 `.test.com`：这样会把同一凭据发送给所有匹配的子域，任一薄弱、废弃或被接管的子域都可能扩大攻击面。

更稳妥的做法是让 SSO 站点和各业务站点分别维护 host-only 会话。业务站点需要登录时跳转到 SSO 站点，SSO 站点利用自己的 Cookie 判断用户是否已登录，再通过一次性、短时有效的授权码把认证结果返回业务站点，由业务站点后端换取用户信息并建立本地会话。

**登录信息获取/登录状态校验**

![SSO系统设计-登录信息获取/登录状态校验](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-logincheck-sequence.png-kbrb.png)

### 用户登出

SSO 登出不只是删除一个 Cookie：

1. SSO 服务端撤销中央登录会话和相关刷新授权。
2. SSO 站点清除自己的会话 Cookie。
3. 根据协议和业务风险，通过前通道或后通道通知各业务站点清理本地会话，并处理通知失败、站点离线等情况。

**登出时序图**

![SSO系统设计-用户登出](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-logout-sequence.png-kbrb.png)

### 跨域登录、登出

跨域 SSO 不应尝试解决 Cookie 的跨域读写问题，而应通过标准的浏览器重定向和后端令牌交换建立各站点自己的会话。常见选择是 OpenID Connect Authorization Code Flow。

解决跨域的核心思路就是：

- 登录完成后，SSO 服务只向预先登记并严格匹配的回调地址返回一次性、短时有效的授权码。业务站点后端使用该授权码换取认证结果，并建立自己的会话，不在多个域之间复制同一个长期 Bearer Token。
- 授权请求需要校验 `state`；使用 OpenID Connect 时还要校验 Issuer、Audience 和签名，并在使用 `nonce` 时核对其值。公共客户端使用 Authorization Code Flow 时还应使用 PKCE。
- 跨站登出使用协议定义的前通道或后通道通知，并允许业务站点在通知失败时通过会话过期、令牌撤销和重新校验收敛状态。

**跨域登录（主域名已登录）**

![SSO系统设计-跨域登录（主域名已登录）](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-crossdomain-login-loggedin-sequence.png-kbrb.png)

**跨域登录（主域名未登录）**

![SSO系统设计-跨域登录（主域名未登录）](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-crossdomain-login-unlogin-sequence.png-kbrb.png)

**跨域登出**

![SSO系统设计-跨域登出](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso/sso-crossdomain-logout-sequence.png-kbrb.png)

上面的时序图来自原转载方案，主要用于帮助理解登录跳转和通知关系，其中直接传递 AuthToken、共享父域 Cookie 等细节不应作为新系统的实现依据。新系统应以所选 OpenID Connect/OAuth 协议的当前安全规范为准。

## 说明

- 关于方案：这次设计方案更多是提供实现思路。APP 用户登录不应只增加一个自定义“APP 签名”就作为安全方案，推荐使用系统浏览器完成 OpenID Connect/OAuth Authorization Code Flow，并使用 PKCE；APP 不能被当作能够永久保守客户端密钥的可信环境。
- 关于时序图：时序图中并没有包含所有场景，只列举了核心/主要场景，另外对于一些不影响理解思路的消息能省就省了。

## 参考

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0-18.html)
- [RFC 9700：Best Current Practice for OAuth 2.0 Security](https://www.rfc-editor.org/rfc/rfc9700.html)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/常见加密算法总结.md -->

## [7] 常见加密算法总结

---
title: 常见加密算法总结
description: 常见加密算法详解，涵盖AES、RSA等对称与非对称加密算法及MD5、SHA等哈希算法的原理与应用场景。
category: 系统设计
tag:
  - 安全
  - 哈希算法
head:
  - - meta
    - name: keywords
      content: 加密算法,AES,RSA,哈希算法,摘要算法,HTTPS,对称加密,非对称加密,BCrypt
---

加密算法是一种用数学方法对数据进行变换的技术，目的是保护数据的安全，防止被未经授权的人读取或修改。加密算法可以分为三大类：对称加密算法、非对称加密算法和哈希算法（也叫摘要算法）。

日常开发中常见的需要用到加密算法的场景：

1. 保存在数据库中的密码需要加盐之后使用哈希算法（比如 BCrypt）进行加密。
2. 保存在数据库中的银行卡号、身份号这类敏感数据需要使用对称加密算法（比如 AES）保存。
3. 网络传输的敏感数据比如银行卡号、身份号需要用 HTTPS + 非对称加密算法（如 RSA）来保证传输数据的安全性。
4. ……

ps: 严格上来说，哈希算法其实不属于加密算法，只是可以用到某些加密场景中（例如密码加密），两者可以看作是并列关系。加密算法通常指的是可以将明文转换为密文，并且能够通过某种方式（如密钥）再将密文还原为明文的算法。而哈希算法是一种单向过程，它将输入信息转换成一个固定长度的、看似随机的哈希值，但这个过程是不可逆的，也就是说，不能从哈希值还原出原始信息。

## 哈希算法

哈希算法也叫散列函数或摘要算法，它的作用是对任意长度的数据生成一个固定长度的唯一标识，也叫哈希值、散列值或消息摘要（后文统称为哈希值）。

![哈希算法效果演示](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/hash-function-effect-demonstration.png)

哈希算法的是不可逆的，你无法通过哈希之后的值再得到原值。

哈希值的作用是可以用来验证数据的完整性和一致性。

举两个实际的例子：

- 保存密码到数据库时使用哈希算法进行加密，可以通过比较用户输入密码的哈希值和数据库保存的哈希值是否一致，来判断密码是否正确。
- 我们下载一个文件时，可以通过比较文件的哈希值和官方提供的哈希值是否一致，来判断文件是否被篡改或损坏；

这种算法的特点是不可逆：

- 不能从哈希值还原出原始数据。
- 原始数据的任何改变都会导致哈希值的巨大变化。

哈希算法可以简单分为两类：

1. **加密哈希算法**：安全性较高的哈希算法，它可以提供一定的数据完整性保护和数据防篡改能力，能够抵御一定的攻击手段，安全性相对较高，但性能较差，适用于对安全性要求较高的场景。例如 SHA2、SHA3、SM3、RIPEMD-160、BLAKE2 等等。
2. **非加密哈希算法**：安全性相对较低的哈希算法，易受到暴力破解、冲突攻击等攻击手段的影响，但性能较高，适用于对安全性没有要求的业务场景。例如 CRC32、MurMurHash3 等等。

除了这两种之外，还有一些特殊的哈希算法，例如安全性更高的**慢哈希算法**。

常见的哈希算法有：

- MD（Message Digest，消息摘要算法）：MD2、MD4、MD5 等，已经不被推荐使用。
- SHA（Secure Hash Algorithm，安全哈希算法）：SHA-1 系列安全性低，SHA2，SHA3 系列安全性较高。
- 国密算法：例如 SM2、SM3、SM4，其中 SM2 为非对称加密算法，SM4 为对称加密算法，SM3 为哈希算法（安全性及效率和 SHA-256 相当，但更适合国内的应用环境）。
- Bcrypt（密码哈希算法）：基于 Blowfish 加密算法的密码哈希算法，专门为密码加密而设计，安全性高，属于慢哈希算法。
- MAC（Message Authentication Code，消息认证码算法）：HMAC 是一种基于哈希的 MAC，可以与任何安全的哈希算法结合使用，例如 SHA-256。
- CRC：（Cyclic Redundancy Check，循环冗余校验）：CRC32 是一种 CRC 算法，它的特点是生成 32 位的校验值，通常用于数据完整性校验、文件校验等场景。
- SipHash：它不是传统的无密钥加密哈希函数（如 SHA-256），而是带密钥的 PRF（Pseudo-Random Function）。必须配合一个随机密钥使用，才能真正具备抗碰撞攻击的能力。它的设计目的是在速度和安全性之间达到一个平衡，用于防御[哈希泛洪 DoS 攻击](https://aumasson.jp/siphash/siphashdos_29c3_slides.pdf)。Rust 默认使用 SipHash 作为哈希算法（目前是 SipHash-1-3 ），从 Redis 4.0 版本开始，字典（dict）的哈希算法从原来的 MurmurHash2 切换为 SipHash（目前是 SipHash-1-2）。
- MurMurHash：经典快速的非加密哈希算法，目前最新的版本是 MurMurHash3，可以生成 32 位或者 128 位哈希值；
- ……

哈希算法一般是不需要密钥的，但也存在部分特殊哈希算法需要密钥。例如，MAC 和 SipHash 就是一种基于密钥的哈希算法，它在哈希算法的基础上增加了一个密钥，使得只有知道密钥的人才能验证数据的完整性和来源。

### MD

MD 算法有多个版本，包括 MD2、MD4、MD5 等，其中 MD5 是最常用的版本，它可以生成一个 128 位（16 字节）的哈希值。从安全性上说：MD5 > MD4 > MD2。除了这些版本，还有一些基于 MD4 或 MD5 改进的算法，如 RIPEMD、HAVAL 等。

即使是最安全 MD 算法 MD5 也存在被破解的风险，攻击者可以通过暴力破解或彩虹表攻击等方式，找到与原始数据相同的哈希值，从而破解数据。

为了增加破解难度，通常可以选择加盐。盐（Salt）在密码学中，是指通过在密码任意固定位置插入特定的字符串，让哈希后的结果和使用原始密码的哈希结果不相符，这种过程称之为“加盐”。

加盐之后就安全了吗？并不一定，这只是增加了破解难度，不代表无法破解。而且，MD5 算法本身就存在弱碰撞（Collision）问题，即多个不同的输入产生相同的 MD5 值。

因此，MD 算法已经不被推荐使用，建议使用更安全的哈希算法比如 SHA-2、Bcrypt。

Java 提供了对 MD 算法系列的支持，包括 MD2、MD5。

MD5 代码示例（未加盐）：

```java
String originalString = "Java学习 + 面试指南：javaguide.cn";
// 创建MD5摘要对象
MessageDigest messageDigest = MessageDigest.getInstance("MD5");
messageDigest.update(originalString.getBytes(StandardCharsets.UTF_8));
// 计算哈希值
byte[] result = messageDigest.digest();
// 将哈希值转换为十六进制字符串
String hexString = new HexBinaryAdapter().marshal(result);
System.out.println("Original String: " + originalString);
System.out.println("MD5 Hash: " + hexString.toLowerCase());
```

输出：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
MD5 Hash: fb246796f5b1b60d4d0268c817c608fa
```

### SHA

SHA（Secure Hash Algorithm）系列算法是一组密码哈希算法，用于将任意长度的数据映射为固定长度的哈希值。SHA 系列算法由美国国家安全局（NSA）于 1993 年设计，目前共有 SHA-1、SHA-2、SHA-3 三种版本。

SHA-1 算法将任意长度的数据映射为 160 位的哈希值。然而，SHA-1 算法存在一些严重的缺陷，比如安全性低，容易受到碰撞攻击和长度扩展攻击。因此，SHA-1 算法已经不再被推荐使用。 SHA-2 家族（如 SHA-256、SHA-384、SHA-512 等）和 SHA-3 系列是 SHA-1 算法的替代方案，它们都提供了更高的安全性和更长的哈希值长度。

SHA-2 家族是在 SHA-1 算法的基础上改进而来的，它们采用了更复杂的运算过程和更多的轮次，使得攻击者更难以通过预计算或巧合找到碰撞。

为了寻找一种更安全和更先进的密码哈希算法，美国国家标准与技术研究院（National Institute of Standards and Technology，简称 NIST）在 2007 年公开征集 SHA-3 的候选算法。NIST 一共收到了 64 个算法方案，经过多轮的评估和筛选，最终在 2012 年宣布 Keccak 算法胜出，成为 SHA-3 的标准算法（SHA-3 与 SHA-2 算法没有直接的关系）。 Keccak 算法具有与 MD 和 SHA-1/2 完全不同的设计思路，即海绵结构（Sponge Construction），使得传统攻击方法无法直接应用于 SHA-3 的攻击中（能够抵抗目前已知的所有攻击方式包括碰撞攻击、长度扩展攻击、差分攻击等）。

由于 SHA-2 算法还没有出现重大的安全漏洞，而且在软件中的效率更高，所以大多数人还是倾向于使用 SHA-2 算法。

相比 MD5 算法，SHA-2 算法之所以更强，主要有两个原因：

- 哈希值长度更长：例如 SHA-256 算法的哈希值长度为 256 位，而 MD5 算法的哈希值长度为 128 位，这就提高了攻击者暴力破解或者彩虹表攻击的难度。
- 更强的碰撞抗性：SHA 算法采用了更复杂的运算过程和更多的轮次，使得攻击者更难以通过预计算或巧合找到碰撞。目前还没有找到任何两个不同的数据，它们的 SHA-256 哈希值相同。

当然，SHA-2 也不是绝对安全的，也有被暴力破解或者彩虹表攻击的风险，所以，在实际的应用中，加盐还是必不可少的。

Java 提供了对 SHA 算法系列的支持，包括 SHA-1、SHA-256、SHA-384 和 SHA-512。

SHA-256 代码示例（未加盐）：

```java
String originalString = "Java学习 + 面试指南：javaguide.cn";
// 创建SHA-256摘要对象
MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
messageDigest.update(originalString.getBytes());
// 计算哈希值
byte[] result = messageDigest.digest();
// 将哈希值转换为十六进制字符串
String hexString = new HexBinaryAdapter().marshal(result);
System.out.println("Original String: " + originalString);
System.out.println("SHA-256 Hash: " + hexString.toLowerCase());
```

输出：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
SHA-256 Hash: 184eb7e1d7fb002444098c9bde3403c6f6722c93ecfac242c0e35cd9ed3b41cd
```

### Bcrypt

Bcrypt 算法是一种基于 Blowfish 加密算法的密码哈希算法，专门为密码加密而设计，安全性高。

由于 Bcrypt 采用了 salt（盐） 和 cost（成本） 两种机制，它可以有效地防止彩虹表攻击和暴力破解攻击，从而保证密码的安全性。salt 是一个随机生成的字符串，用于和密码混合，增加密码的复杂度和唯一性。cost 是一个数值参数，用于控制 Bcrypt 算法的迭代次数，增加密码哈希的计算时间和资源消耗。

Bcrypt 算法可以根据实际情况进行调整加密的复杂度，可以设置不同的 cost 值和 salt 值，从而满足不同的安全需求，灵活性很高。

Java 应用程序的安全框架 Spring Security 支持多种密码编码器，其中 `BCryptPasswordEncoder` 是官方推荐的一种，它使用 BCrypt 算法对用户的密码进行加密存储。

```java
@Bean
public PasswordEncoder passwordEncoder(){
    return new BCryptPasswordEncoder();
}
```

## 对称加密

对称加密算法是指加密和解密使用同一个密钥的算法，也叫共享密钥加密算法。

![对称加密](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/symmetric-encryption.png)

常见的对称加密算法有 DES、3DES、AES 等。

### DES 和 3DES

DES（Data Encryption Standard）使用 64 位的密钥(有效秘钥长度为 56 位,8 位奇偶校验位)和 64 位的明文进行加密。

虽然 DES 一次只能加密 64 位，但我们只需要把明文划分成 64 位一组的块，就可以实现任意长度明文的加密。如果明文长度不是 64 位的倍数，必须进行填充，常用的模式有 PKCS5Padding, PKCS7Padding, NOPADDING。

DES 加密算法的基本思想是将 64 位的明文分成两半，然后对每一半进行多轮的变换，最后再合并成 64 位的密文。这些变换包括置换、异或、选择、移位等操作，每一轮都使用了一个子密钥，而这些子密钥都是由同一个 56 位的主密钥生成的。DES 加密算法总共进行了 16 轮变换，最后再进行一次逆置换，得到最终的密文。

![DES（Data Encryption Standard）](https://oss.javaguide.cn/github/javaguide/系统设计/安全/des-steps.jpg)

这是一个经典的对称加密算法，但也有明显的缺陷，即 56 位的密钥安全性不足，已被证实可以在短时间内破解。

为了提高 DES 算法的安全性，人们提出了一些变种或者替代方案，例如 3DES（Triple DES）。

3DES（Triple DES）是 DES 向 AES 过渡的加密算法，它使用 2 个或者 3 个 56 位的密钥对数据进行三次加密。3DES 相当于是对每个数据块应用三次 DES 的对称加密算法。

为了兼容普通的 DES，3DES 并没有直接使用 加密->加密->加密 的方式，而是采用了加密->解密->加密 的方式。当三种密钥均相同时，前两步相互抵消，相当于仅实现了一次加密，因此可实现对普通 DES 加密算法的兼容。3DES 比 DES 更为安全，但其处理速度不高。

### AES

AES（Advanced Encryption Standard）算法是一种更先进的对称密钥加密算法，它使用 128 位、192 位或 256 位的密钥对数据进行加密或解密，密钥越长，安全性越高。

AES 也是一种分组(或者叫块)密码，分组长度只能是 128 位，也就是说，每个分组为 16 个字节。AES 加密算法有多种工作模式（mode of operation），如：ECB、CBC、OFB、CFB、CTR、XTS、OCB、GCM（目前使用最广泛的模式）。不同的模式参数和加密流程不同，但是核心仍然是 AES 算法。

和 DES 类似，一些 AES 工作模式需要对不是 128 位倍数的明文进行填充。不过，GCM 是基于分组密码构造的认证加密（AEAD）模式，可以处理任意长度的明文，因此在 Java 中通常使用 `AES/GCM/NoPadding`。GCM 在提供机密性的同时还会校验密文完整性，但要求同一密钥下的 IV（Nonce）不得重复。

AES 的速度比 3DES 快，而且更安全。

![AES（Advanced Encryption Standard）](https://oss.javaguide.cn/github/javaguide/系统设计/安全/aes-steps.jpg)

DES 算法和 AES 算法简单对比（图片来自于：[RSA vs. AES Encryption: Key Differences Explained](https://cheapsslweb.com/blog/rsa-vs-aes-encryption)）：

![DES 和 AES 对比](https://oss.javaguide.cn/github/javaguide/系统设计/安全/des-vs-aes.png)

基于 Java 实现 AES-GCM 的代码示例。示例把每次加密随机生成的 IV 与密文一起编码；生产环境中的 AES 密钥应由 KMS、HSM 或 KeyStore 生成和保管，不要硬编码在源码中：

```java
private static final String AES_TRANSFORMATION = "AES/GCM/NoPadding";
private static final int GCM_IV_LENGTH = 12;
private static final int GCM_TAG_LENGTH = 128;
private static final SecureRandom SECURE_RANDOM = new SecureRandom();

/**
 * 加密
 */
public static String encrypt(String data, SecretKey secretKey) throws GeneralSecurityException {
    byte[] iv = new byte[GCM_IV_LENGTH];
    SECURE_RANDOM.nextBytes(iv);

    Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
    byte[] encryptedBytes = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));

    // IV 不需要保密，但解密时必须使用同一个 IV，因此将其与密文一起保存。
    ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedBytes.length);
    byteBuffer.put(iv);
    byteBuffer.put(encryptedBytes);
    return Base64.getEncoder().encodeToString(byteBuffer.array());
}

/**
 * 解密
 */
public static String decrypt(String encryptedData, SecretKey secretKey) throws GeneralSecurityException {
    byte[] input = Base64.getDecoder().decode(encryptedData);
    int tagLengthInBytes = GCM_TAG_LENGTH / Byte.SIZE;
    if (input.length < GCM_IV_LENGTH + tagLengthInBytes) {
        throw new IllegalArgumentException("Invalid encrypted data");
    }

    ByteBuffer byteBuffer = ByteBuffer.wrap(input);
    byte[] iv = new byte[GCM_IV_LENGTH];
    byteBuffer.get(iv);
    byte[] encryptedBytes = new byte[byteBuffer.remaining()];
    byteBuffer.get(encryptedBytes);

    Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));
    byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
    return new String(decryptedBytes, StandardCharsets.UTF_8);
}

public static void main(String[] args) throws Exception {
    // 仅用于演示。生产环境应从 KMS、HSM 或 KeyStore 获取密钥。
    KeyGenerator keyGenerator = KeyGenerator.getInstance("AES");
    keyGenerator.init(256);
    SecretKey secretKey = keyGenerator.generateKey();

    String originalString = "Java学习 + 面试指南：javaguide.cn";
    String encryptedData = encrypt(originalString, secretKey);
    String decryptedData = decrypt(encryptedData, secretKey);
    System.out.println("Original String: " + originalString);
    System.out.println("AES Encrypted Data : " + encryptedData);
    System.out.println("AES Decrypted Data : " + decryptedData);
}
```

输出：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
AES Encrypted Data : <每次运行不同的 Base64 字符串>
AES Decrypted Data : Java学习 + 面试指南：javaguide.cn
```

## 非对称加密

非对称加密算法是指加密和解密使用不同的密钥的算法，也叫公开密钥加密算法。这两个密钥互不相同，一个称为公钥，另一个称为私钥。公钥可以公开给任何人使用，私钥则要保密。

如果用公钥加密数据，只能用对应的私钥解密。数字签名则是另一类操作：发送方使用私钥生成签名，接收方使用公钥验证签名。不要把数字签名简单理解为“用私钥加密、公钥解密”，实际项目应分别使用加密 API 和签名 API。

![非对称加密](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/asymmetric-encryption.png)

常见的公钥密码算法包括 RSA 和基于椭圆曲线的算法。它们的具体能力不同：RSA 可以用于加密和签名；DSA 只能用于签名；ECC 则是一类算法的统称，包含用于签名或密钥协商的不同方案。

### RSA

RSA（Rivest–Shamir–Adleman algorithm）算法是一种基于大数分解的困难性的非对称加密算法，它需要选择两个大素数作为私钥的一部分，然后计算出它们的乘积作为公钥的一部分（寻求两个大素数比较简单，而将它们的乘积进行因式分解却极其困难）。RSA 算法原理的详细介绍，可以参考这篇文章：[你真的了解 RSA 加密算法吗？ - 小傅哥](https://www.cnblogs.com/xiaofuge/p/16954187.html)。

RSA 算法的安全性依赖于大数分解的难度，目前已经有 512 位和 768 位的 RSA 公钥被成功分解，因此建议使用 2048 位或以上的密钥长度。

RSA 算法的优点是简单易用，可以用于数据加密和数字签名；缺点是运算速度慢，不适合大量数据的加密。

RSA 算法是是目前应用最广泛的非对称加密算法，像 SSL/TLS、SSH 等协议中就用到了 RSA 算法。

![HTTPS 证书签名算法中带RSA 加密的SHA-256 ](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/https-rsa-sha-256.png)

RSA 运算速度慢、可直接处理的数据长度有限，实际项目通常使用混合加密：随机生成对称密钥，通过 AES-GCM 加密业务数据，再通过 RSA-OAEP 加密对称密钥。下面的示例只演示如何用 RSA-OAEP 加密较短的数据：

```java
private static final String RSA_ALGORITHM = "RSA";
private static final String RSA_TRANSFORMATION = "RSA/ECB/OAEPPadding";
private static final OAEPParameterSpec OAEP_SHA_256 = new OAEPParameterSpec(
        "SHA-256",
        "MGF1",
        MGF1ParameterSpec.SHA256,
        PSource.PSpecified.DEFAULT
);

/**
 * 生成RSA密钥对
 */
public static KeyPair generateKeyPair() throws NoSuchAlgorithmException {
    KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(RSA_ALGORITHM);
    // 密钥大小为2048位
    keyPairGenerator.initialize(2048);
    return keyPairGenerator.generateKeyPair();
}

/**
 * 使用公钥加密数据
 */
public static String encrypt(String data, PublicKey publicKey) throws Exception {
    Cipher cipher = Cipher.getInstance(RSA_TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, publicKey, OAEP_SHA_256);
    byte[] encryptedData = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
    return Base64.getEncoder().encodeToString(encryptedData);
}

/**
 * 使用私钥解密数据
 */
public static String decrypt(String encryptedData, PrivateKey privateKey) throws Exception {
    byte[] decodedData = Base64.getDecoder().decode(encryptedData);
    Cipher cipher = Cipher.getInstance(RSA_TRANSFORMATION);
    cipher.init(Cipher.DECRYPT_MODE, privateKey, OAEP_SHA_256);
    byte[] decryptedData = cipher.doFinal(decodedData);
    return new String(decryptedData, StandardCharsets.UTF_8);
}

public static void main(String[] args) throws Exception {
    KeyPair keyPair = generateKeyPair();
    PublicKey publicKey = keyPair.getPublic();
    PrivateKey privateKey = keyPair.getPrivate();
    String originalString = "Java学习 + 面试指南：javaguide.cn";
    String encryptedData = encrypt(originalString, publicKey);
    String decryptedData = decrypt(encryptedData, privateKey);
    System.out.println("Original String: " + originalString);
    System.out.println("RSA Encrypted Data : " + encryptedData);
    System.out.println("RSA Decrypted Data : " + decryptedData);
}
```

输出：

```bash
Original String: Java学习 + 面试指南：javaguide.cn
RSA Encrypted Data : <每次运行不同的 Base64 字符串>
RSA Decrypted Data : Java学习 + 面试指南：javaguide.cn
```

### DSA

DSA（Digital Signature Algorithm）是一种数字签名算法，安全性基于离散对数问题。它只能用于生成和验证数字签名，不能用于数据加密。签名也不是“私钥加密摘要、公钥解密摘要”：发送方使用私钥和签名算法生成签名，接收方使用公钥和验证算法判断签名是否有效。

DSA 主要用于兼容遗留系统。NIST FIPS 186-5 已不再批准使用 DSA 生成新的数字签名，仅允许验证标准实施前生成的遗留签名。新系统通常应根据协议和兼容性要求选择 RSA-PSS、ECDSA 或 EdDSA，并使用成熟密码库提供的 `Signature` API。

## 总结

这篇文章介绍了三种加密算法：哈希算法、对称加密算法和非对称加密算法。

- 哈希算法是一种用数学方法对数据生成一个固定长度的唯一标识的技术，可以用来验证数据的完整性和一致性，常见的哈希算法有 MD、SHA、MAC 等。
- 对称加密算法是一种加密和解密使用同一个密钥的算法，可以用来保护数据的安全性和保密性，常见的对称加密算法有 DES、3DES、AES 等。
- 公钥密码使用成对的公钥和私钥，可以支持加密、数字签名或密钥协商，但具体能力取决于算法。例如 RSA 可以用于加密和签名，DSA 只能用于签名。

## 参考

- NIST SP 800-38D - Recommendation for Block Cipher Modes of Operation: GCM and GMAC：<https://csrc.nist.gov/pubs/sp/800/38/d/final>
- NIST FIPS 186-5 - Digital Signature Standard：<https://csrc.nist.gov/pubs/fips/186-5/final>
- Java `Cipher` API：<https://docs.oracle.com/en/java/javase/11/docs/api/java.base/javax/crypto/Cipher.html>
- 深入理解完美哈希 - 腾讯技术工程：<https://mp.weixin.qq.com/s/M8Wcj8sZ7UF1CMr887Puog>
- 写给开发人员的实用密码学（二）—— 哈希函数：<https://thiscute.world/posts/practical-cryptography-basics-2-hash/>
- 奇妙的安全旅行之 DSA 算法：<https://zhuanlan.zhihu.com/p/347025157>
- AES-GCM 加密简介：<https://juejin.cn/post/6844904122676690951>
- Java AES 256 GCM Encryption and Decryption Example | JCE Unlimited Strength：<https://www.javainterviewpoint.com/java-aes-256-gcm-encryption-and-decryption/>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/敏感词过滤方案总结.md -->

## [8] 敏感词过滤方案总结

---
title: 敏感词过滤方案总结
description: 敏感词过滤方案详解，从暴力匹配到 Trie 树、AC 自动机的算法演进，涵盖复杂度分析、工程实践与高并发优化策略。
category: 系统设计
tag:
  - 安全
  - 数据结构
head:
  - - meta
    - name: keywords
      content: 敏感词过滤,Trie树,DFA算法,AC自动机,双数组Trie,字符串匹配,KMP算法,内容安全,原子热替换
---

敏感词过滤是内容安全的核心环节。无论是社交媒体、电商平台、在线游戏，还是如今的 AI 应用，都需要对输入和生成的内容进行实时过滤，防止色情、暴力、仇恨言论等违规信息传播。

从技术角度看，敏感词过滤本质上是**多模式字符串匹配问题**：在一段文本中同时查找多个关键词。

这篇文章接近 2 万字，我会从算法演进开始讲起，还会分享一些生产经验例如对抗变形词、高并发优化、词库管理。

**核心结论**：

| 算法                   | 适用场景               | 特点                         |
| ---------------------- | ---------------------- | ---------------------------- |
| **Trie 树**            | 词库规模较小（< 1 万） | 实现简单，易于理解           |
| **AC 自动机**          | 高吞吐量场景           | 单次扫描匹配所有词，性能最优 |
| **双数组 Trie（DAT）** | 大规模词库（> 1 万）   | 内存占用低，构建成本高       |

## 算法演进

下面按**从简单到复杂**的顺序，逐步介绍各类敏感词过滤算法，看看每一步优化的动机和效果。

### 暴力匹配（BF 算法）

**暴力匹配（Brute Force）** 是最直观的方案：遍历文本的每个位置，尝试用每个敏感词进行匹配。

假设敏感词库有 `n` 个词，平均长度为 `m`，待匹配文本长度为 `L`：

```java
public List<String> bruteForceMatch(String text, List<String> words) {
    List<String> result = new ArrayList<>();
    for (String word : words) {              // O(n)：遍历每个敏感词
        if (text.contains(word)) {           // O(L × m)：朴素子串匹配
            result.add(word);
        }
    }
    return result;
}
```

**时间复杂度**：O(n × L × m)

| 场景   | 敏感词数 | 文本长度 | 平均词长 | 操作次数 |
| ------ | -------- | -------- | -------- | -------- |
| 小规模 | 100      | 1000     | 5        | 50 万    |
| 中规模 | 1000     | 5000     | 5        | 2500 万  |
| 大规模 | 10000    | 10000    | 5        | 5 亿     |

**问题分析**：

1. **重复扫描**：每个敏感词都要遍历整段文本，大量字符被重复比较。
2. **无状态复用**：敏感词之间没有关联，无法利用已匹配的信息。
3. **扩展性差**：词库增长时性能线性下降。

当词库达到万级别时，暴力匹配的延迟会达到秒级，完全无法满足线上服务的性能要求。

### Trie 树：利用前缀减少比较

**Trie 树**（发音为 /ˈtraɪ/）也称为字典树、前缀树，通过**空间换时间**的策略优化暴力匹配。核心思想是：利用字符串的**公共前缀**来减少存储空间和查询时间的开销。

浏览器搜索框的关键词提示功能就可以基于 Trie 树实现：

![浏览器 Trie 树效果展示](https://oss.javaguide.cn/github/javaguide/系统设计/安全/brower-trie.png)

#### 基本性质

Trie 树具有以下 3 个基本性质：

1. **根节点不包含字符**，除根节点外每一个节点只包含一个字符。
2. **从根节点到某一节点**，路径上经过的字符连接起来，就是该节点对应的字符串。
3. **每个节点的所有子节点包含的字符都不相同**。

#### 结构示例

假设敏感词库中有以下词汇：

- 高清视频
- 高清 CV
- 东京冷
- 东京热

构造的 Trie 树结构如下（红色节点表示字符串终止）：

![敏感词 Trie 树](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sensitive-word-trie.png)

当查找字符串“东京热”时，将其拆分为单个字符“东”、“京”、“热”，然后从根节点逐层匹配。

#### 与暴力匹配的对比

假设词库为 `["she", "he", "his", "hers"]`，在文本 `"ushers"` 中查找：

| 算法     | 匹配过程                 | 字符比较次数 |
| -------- | ------------------------ | ------------ |
| 暴力匹配 | 分别用 4 个词扫描文本    | 约 24 次¹    |
| Trie 树  | 从每个位置开始，沿树匹配 | 约 10 次     |

> ¹ 此处为简化估算（词数 × 文本长度），实际最坏比较次数取决于每个词的长度与文本位置，会更高。

Trie 树的优势在于：**所有敏感词共享同一棵树**，一次遍历就能尝试匹配所有词。

#### 复杂度分析

| 指标       | HashMap 实现 | 数组实现     |
| ---------- | ------------ | ------------ |
| 预处理     | O(n × m)     | O(n × m × σ) |
| 查询时间   | O(L × m)     | O(L × m)     |
| 空间复杂度 | O(n × m)     | O(n × m × σ) |

> σ 为字符集大小（汉字约 2 万，ASCII 仅 128）。本文代码示例采用 `HashMap` 实现，适合中文等大字符集；数组实现适合小字符集（如纯英文）。

#### Trie 代码示例

```java
public class SimpleTrie {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        boolean isEnd;
    }

    private final Node root = new Node();

    // 添加敏感词
    public void addWord(String word) {
        Node node = root;
        for (char c : word.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new Node());
        }
        node.isEnd = true;
    }

    // 检测文本中是否包含敏感词
    public boolean contains(String text) {
        for (int i = 0; i < text.length(); i++) {
            Node node = root;
            for (int j = i; j < text.length(); j++) {
                node = node.children.get(text.charAt(j));
                if (node == null) break;
                if (node.isEnd) return true;
            }
        }
        return false;
    }

    // 获取文本中所有匹配的敏感词
    public List<String> matchAll(String text) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < text.length(); i++) {
            Node node = root;
            for (int j = i; j < text.length(); j++) {
                node = node.children.get(text.charAt(j));
                if (node == null) break;
                if (node.isEnd) {
                    result.add(text.substring(i, j + 1));
                }
            }
        }
        return result;
    }
}
```

#### Trie 树的局限性

虽然 Trie 树相比暴力匹配有显著提升，但仍存在**回溯问题**：

在文本 `"ushers"` 中查找词库 `["she", "he", "his"]`：

1. 从位置 1 开始，匹配 `"s" → "h" → "e"`，找到 `"she"`
2. 匹配完成后，**回到位置 2**，重新匹配 `"h" → "e"`，找到 `"he"`

这种“匹配失败后回退到下一位置重新开始”的策略，在最坏情况下（如文本 `"aaaaaaaa"` 匹配词 `"aaaaab"`）会退化到 O(L × m)。

能否做到**完全不回溯**？这就引出了 AC 自动机。

**注意**：[Apache Commons Collections](https://mvnrepository.com/artifact/org.apache.commons/commons-collections4) 提供的 `PatriciaTrie` 是基于**位操作**的压缩二进制 Trie（PATRICIA = Practical Algorithm To Retrieve Information Coded In Alphanumeric），与本文描述的**字符级 Trie** 原理不同，不适合直接用于中文敏感词过滤场景。

### AC 自动机：单次扫描匹配所有词

**AC 自动机（Aho-Corasick Automaton）** 是一种建立在 Trie 树之上的多模式匹配算法，由贝尔实验室的 Alfred V. Aho 和 Margaret J. Corasick 于 1975 年提出。

其核心思想与 KMP 算法一脉相承：**利用已匹配的信息，在失配时跳转到合适位置继续匹配，避免回溯**。区别在于 KMP 处理单模式串，而 AC 自动机处理多模式串。

#### 核心组件

AC 自动机的运行依赖于三个核心函数：

| 函数             | 作用                                                 |
| ---------------- | ---------------------------------------------------- |
| **goto 函数**    | 状态转移：从当前状态读入字符后跳转到哪个状态         |
| **failure 函数** | 失配跳转：失配时跳转到「最长相同后缀」状态，避免回溯 |
| **output 函数**  | 输出匹配：记录每个状态对应的匹配词集合               |

#### 构建步骤

AC 自动机的构建分为三步：

![AC 自动机构建与匹配流程](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sensitive-word-ac-automaton-flow.png)

**第一步：构建 Trie 树**

将所有模式串插入 Trie 树，形成自动机的基础骨架。每个模式串的末尾节点打上终止标记。

**第二步：构建 fail 指针（核心）**

fail 指针是 AC 自动机的核心机制。它的作用是：**当当前字符无法继续匹配时，跳转到哪个状态继续尝试，而不是回到起点**。

构建过程使用 BFS（广度优先搜索）逐层遍历，对于当前节点 `temp`：

1. 找到 `temp` 父节点的 fail 节点
2. 在该 fail 节点的子节点中寻找与 `temp` 字符相同的节点
3. 若存在，则 `temp.fail` 指向该子节点
4. 若不存在，继续找 fail 节点的 fail 节点，直到找到或到达 root

**fail 指针的本质**：指向当前状态对应字符串的**最长后缀**所在的状态。

::: tip 与 KMP 的关系
fail 指针就是 KMP 算法中 next 数组在 Trie 树上的泛化。例如：`"she"` 的后缀 `"he"` 与 `"he"` 的前缀相同，因此 `"she"` 结尾的 `'e'` 的 fail 指针指向 `"he"` 中的 `'e'`。
:::

**第三步：模式匹配**

从文本串头部开始扫描，指针 `p` 初始指向 root：

1. **状态转移**：若当前字符在 `p` 的子节点中，`p` 下移；否则沿 fail 链回退，直到能匹配或回到 root
2. **收集输出**：【关键】每次转移后，**必须沿 fail 链遍历一次**，收集所有终止状态的匹配词

为什么要沿 fail 链遍历？因为一个长词的后缀可能是另一个短词。例如 `"she"` 匹配成功时，沿 fail 链可以找到 `"he"`，否则会漏掉嵌套词。

#### AC 自动机代码示例

```java
public class AhoCorasickAutomaton {
    private static class Node {
        Map<Character, Node> children = new HashMap<>();
        Node fail;                    // 失配指针
        List<String> outputs = new ArrayList<>(); // 该状态对应的匹配词
    }

    private final Node root = new Node();

    // 第一步：构建 Trie 树
    public void addWord(String word) {
        Node node = root;
        for (char c : word.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new Node());
        }
        node.outputs.add(word); // 末尾节点记录匹配词
    }

    // 第二步：构建 fail 指针（BFS）
    public void buildFailPointer() {
        Queue<Node> queue = new LinkedList<>();
        root.fail = root;

        // 根节点的直接子节点，fail 指向根
        for (Node child : root.children.values()) {
            child.fail = root;
            queue.offer(child);
        }

        while (!queue.isEmpty()) {
            Node current = queue.poll();
            for (Map.Entry<Character, Node> entry : current.children.entrySet()) {
                char c = entry.getKey();
                Node child = entry.getValue();

                // 沿父节点的 fail 链查找是否有字符 c 的转移
                Node fail = current.fail;
                while (fail != root && !fail.children.containsKey(c)) {
                    fail = fail.fail;
                }
                child.fail = fail.children.getOrDefault(c, root);
                // 避免自环：如果 fail 指向了自己，改为指向根
                if (child.fail == child) {
                    child.fail = root;
                }
                // 合并 fail 节点的输出（关键！）
                child.outputs.addAll(child.fail.outputs);
                queue.offer(child);
            }
        }
    }

    // 第三步：模式匹配（单次扫描）
    public List<String> match(String text) {
        List<String> result = new ArrayList<>();
        Node state = root;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            // 沿 fail 链找到能处理字符 c 的状态
            while (state != root && !state.children.containsKey(c)) {
                state = state.fail;
            }
            state = state.children.getOrDefault(c, root);
            // 收集当前状态的所有匹配词（已通过 fail 链合并）
            result.addAll(state.outputs);
        }
        return result;
    }
}
```

使用示例：

```java
AhoCorasickAutomaton ac = new AhoCorasickAutomaton();
ac.addWord("she");
ac.addWord("he");
ac.addWord("her");
ac.addWord("hers");
ac.buildFailPointer(); // 插入完所有词后，构建一次 fail 指针

List<String> matches = ac.match("ushers");
// 输出: [she, he, her, hers]
```

#### 性能对比

| 算法      | 预处理    | 匹配时间     | 特点                                              |
| --------- | --------- | ------------ | ------------------------------------------------- |
| 暴力匹配  | O(1)      | O(L × n × m) | 每个词单独扫描                                    |
| Trie 树   | O(n × m)  | O(L × m)     | 可能回溯                                          |
| AC 自动机 | O(n × m)¹ | O(L + z)     | 单次扫描，z 为所有匹配命中的总次数（含重叠匹配）² |

> 1. 使用 HashMap 存储子节点时为 O(n × m)；若使用数组存储（需预分配字符集大小 σ），则为 O(n × m × σ)。
> 2. 极端场景下，若词库中存在大量嵌套词（如 "a", "ab", "abc", ..., "abc...z"），z 可能远大于 L，此时耗时由 z 主导。实际工程中敏感词库通常不会出现这种极端嵌套。

AC 自动机实现了**线性时间匹配**，与敏感词数量无关，只与文本长度和匹配结果数量相关。

将 AC 自动机与 DAT 结合（[AhoCorasickDoubleArrayTrie](https://github.com/hankcs/AhoCorasickDoubleArrayTrie)），可以兼顾匹配效率和内存占用。

### 双数组 Trie（DAT）：压缩内存占用

标准 Trie 树内存占用较大（每个节点需要一个 Map），实际工程中通常使用改进版——**双数组 Trie（Double-Array Trie，DAT）**。

DAT 由日本的 Aoe Jun-ichi 等人在 1989 年的论文[《An Efficient Implementation of Trie Structures》](https://www.co-ding.com/assets/pdf/dat.pdf)中提出。它通过两个整型数组（base[] 和 check[]）压缩 Trie 结构：

| 特性       | 标准 Trie（数组实现） | 双数组 Trie                  |
| ---------- | --------------------- | ---------------------------- |
| 空间复杂度 | O(n × m × σ)          | O(n × m)                     |
| 内存占用   | 较大                  | 通常可降至数组实现的 20%~30% |
| 实现复杂度 | 简单                  | 较复杂（需处理冲突）         |

**注意**：DAT 的压缩效率与词库的公共前缀比例强相关。极端情况下（无公共前缀），压缩效果有限。

参考实现：<https://github.com/komiya-atsushi/darts-java>

### DFA 实现：工程化封装

**DFA（Deterministic Finite Automaton，确定性有限自动机）** 是自动机理论中的概念。从实现角度看，Trie 从根出发的一次匹配过程本身就是一个 DFA 运行——每个节点代表一个状态，每条边代表一个字符转移。不过，普通 Trie 匹配需要从文本的每个位置重新启动 DFA，而 AC 自动机通过 fail 指针补全了所有状态转移，才是真正的**单次扫描多模式 DFA**。

[Hutool 5.8.x](https://hutool.cn/docs/#/dfa/%E6%A6%82%E8%BF%B0) 提供了基于 DFA 的敏感词过滤实现（底层为 Trie）：

![Hutool 的 DFA 算法](https://oss.javaguide.cn/github/javaguide/系统设计/安全/hutool-dfa.png)

```java
WordTree wordTree = new WordTree();
wordTree.addWord("大");
wordTree.addWord("大憨憨");
wordTree.addWord("憨憨");

String text = "那人真是个大憨憨！";

// 获得第一个匹配的关键字
String matchStr = wordTree.match(text);
System.out.println(matchStr); // 输出: 大

// matchAll(text, limit, isDensityMatch, isGreedy)
// - limit: 匹配数量上限，-1 表示不限制
// - isDensityMatch: 是否密度匹配（在已匹配词内部继续寻找重叠词）
// - isGreedy: 是否贪婪匹配（true 匹配最长关键词，false 匹配最短关键词）
List<String> matchStrList = wordTree.matchAll(text, -1, false, false);
System.out.println(matchStrList); // 输出: [大, 憨憨]

List<String> matchStrList2 = wordTree.matchAll(text, -1, false, true);
System.out.println(matchStrList2); // 输出: [大, 大憨憨]
```

**输出解释**：

- `matchAll(text, -1, false, false)`：非贪婪 + 非密度匹配

  - 从位置 0 开始，`"大"` 匹配成功（最短匹配）
  - 跳过已匹配字符后，`"憨憨"` 从位置 2 开始匹配成功
  - 结果：`[大, 憨憨]`

- `matchAll(text, -1, false, true)`：贪婪 + 非密度匹配
  - 从位置 0 开始，`"大憨憨"` 匹配成功（最长匹配）
  - 同时 `"大"` 也匹配成功（作为前缀）
  - 结果：`[大, 大憨憨]`

## 对抗变形词

实际场景中，用户常通过以下方式绕过敏感词过滤：

| 变形方式 | 示例                  | 应对策略               |
| -------- | --------------------- | ---------------------- |
| 谐音字   | “赌博” → “读博”       | 维护谐音词库           |
| 插入符号 | "fuck" → "f\*u\*c\*k" | 预处理去除特殊字符     |
| 繁简混用 | “台灣” → “台湾”       | 统一转换为简体后再匹配 |
| 全角字符 | "abc" → "ａｂｃ"      | 全角转半角             |

**前置清洗**是处理变形词的常用策略：在匹配前对用于检测的文本副本进行标准化处理。下面的代码覆盖兼容等价字符、大小写、Unicode Code Point 和格式控制字符等基础情况，但仍然只是示例；生产系统需要结合支持的语言、误报容忍度和实际对抗样本持续补充规则。

```java
import java.text.Normalizer;
import java.util.Locale;

public String preprocess(String text) {
    // NFKC 会统一全角/半角等兼容等价字符。只处理检测副本，不覆盖用户原文。
    String normalized = Normalizer.normalize(text, Normalizer.Form.NFKC)
            .toLowerCase(Locale.ROOT);
    StringBuilder sb = new StringBuilder();
    normalized.codePoints()
            // 去掉零宽连接符等格式控制字符，防止插入不可见字符绕过匹配。
            .filter(codePoint -> Character.getType(codePoint) != Character.FORMAT)
            .filter(this::isChineseOrAlphanumeric)
            .forEach(sb::appendCodePoint);
    return toSimplifiedChinese(sb.toString()); // 繁转简
}

private boolean isChineseOrAlphanumeric(int codePoint) {
    return Character.isLetterOrDigit(codePoint)
            || Character.UnicodeScript.of(codePoint) == Character.UnicodeScript.HAN;
}
```

[ToolGood.Words](https://github.com/toolgood/ToolGood.Words) 等成熟库已内置繁简互换、全角半角转换等功能，可直接使用。

::: warning 注意

- **位置映射**：`preprocess` 方法会去除特殊字符，导致清洗后的文本与原文位置不再一一对应。如果业务需要返回敏感词在原文中的精确位置（如高亮标注、部分替换），需要维护一张从清洗后位置到原文位置的映射表。
- **规范化边界**：NFKC 会消除部分具有业务语义的兼容字符差异，所以应只用于检测副本，保留原文用于展示和审计。删除字符还可能把原本分隔的内容拼接成新词，需要通过真实语料评估误报率。
- **同形异码**：Unicode confusables 可以辅助发现跨脚本形似字符，但不适合直接作为通用文本的“归一化结果”。高风险命中应结合上下文模型或人工审核，不能只靠字符替换作最终判断。
  :::

## 高并发优化

### 原子热替换：支持词库热更新

生产环境中，敏感词库需要频繁更新，但不能影响正在进行的匹配请求。通过 `AtomicReference` 实现原子热替换（Atomic Hot-Swap）：先在后台构建新 Trie，构建完成后原子替换旧实例，确保读线程不受影响。

```java
public class SensitiveWordFilter {
    private final AtomicReference<SimpleTrie> trieRef;

    public SensitiveWordFilter(List<String> initialWords) {
        this.trieRef = new AtomicReference<>(buildTrie(initialWords));
    }

    // 匹配时获取当前 Trie
    public List<String> match(String text) {
        SimpleTrie trie = trieRef.get();
        return trie != null ? trie.matchAll(text) : Collections.emptyList();
    }

    // 更新词库：先构建新 Trie，再原子发布
    public void refreshWords(List<String> newWords) {
        SimpleTrie newTrie = buildTrie(newWords);
        trieRef.set(newTrie);  // 原子发布，对读线程立即可见
    }

    private SimpleTrie buildTrie(List<String> words) {
        SimpleTrie trie = new SimpleTrie();
        for (String word : words) {
            trie.addWord(word);
        }
        return trie;
    }
}
```

**关键点**：

- 使用 `AtomicReference` 确保切换操作是原子的。
- 旧 Trie 可能仍有线程在使用，依赖 GC 自动回收。
- 可在后台异步构建新 Trie，不影响服务响应。

### 并行处理：超长文本分段

对于超长文本（如文章、评论），可以分段后并行处理。

**注意**：分段时必须加入重叠区域，否则会遗漏跨边界的敏感词。

```java
// 使用独立线程池，避免占用 ForkJoinPool.commonPool()
private final ExecutorService filterExecutor =
    new ThreadPoolExecutor(
        4, 8, 60L, TimeUnit.SECONDS,
        LinkedBlockingQueue<>(1000),
        new ThreadPoolExecutor.CallerRunsPolicy() // 队列满时由调用线程执行，实现背压
    );

public List<String> parallelMatch(String text, int chunkSize, int maxWordLength) {
    // 重叠区域 = 最长敏感词长度 - 1，防止跨边界漏词
    int overlap = maxWordLength - 1;
    List<CompletableFuture<List<String>>> futures = new ArrayList<>();

    for (int i = 0; i < text.length(); i += chunkSize) {
        int start = i;
        int end = Math.min(i + chunkSize + overlap, text.length());
        String chunk = text.substring(start, end);

        // 显式传入自定义线程池
        futures.add(CompletableFuture.supplyAsync(() ->
            trieRef.get().matchAll(chunk), filterExecutor
        ));
    }

    return futures.stream()
        .flatMap(f -> f.join().stream())
        .distinct()
        .collect(Collectors.toList());
}
```

**为什么需要重叠区域？**

假设敏感词 `"赌博网站"` 长度为 4，分块大小为 100。若文本恰好从位置 99 开始出现该词，会被切分到两个 chunk：

- chunk1: `...文本结束于位置99赌`
- chunk2: `博网站继续...`

两个 chunk 都无法匹配完整的 `"赌博网站"`，导致漏报。重叠区域确保每个敏感词都能在至少一个 chunk 中完整出现。

### 快速排除：布隆过滤器

使用**布隆过滤器（Bloom Filter）** 做初筛，可以快速排除不含敏感词的文本。

**适用前提**：该方案仅在绝大多数文本不含敏感词且布隆过滤器假阳性率极低时有收益。因为 `quickCheck` 本身的复杂度为 O(L × maxWordLen)，与 Trie 匹配同阶，如果文本频繁命中布隆过滤器（假阳性），反而会增加额外开销。

**注意**：布隆过滤器检测的是单个元素的集合成员关系，需要对文本的子串进行检测，而非整段文本。

```java
public List<String> matchWithBloomFilter(String text, int maxWordLength) {
    // 快速检测：扫描所有可能的子串
    if (!quickCheck(text, maxWordLength)) {
        return Collections.emptyList();  // 确定不包含敏感词
    }
    // 可能包含敏感词，进行精确匹配
    return trieRef.get().matchAll(text);
}

private boolean quickCheck(String text, int maxWordLen) {
    BloomFilter<String> filter = getBloomFilter();  // 包含所有敏感词的布隆过滤器
    for (int i = 0; i < text.length(); i++) {
        for (int len = 1; len <= maxWordLen && i + len <= text.length(); len++) {
            if (filter.mightContain(text.substring(i, i + len))) {
                return true;  // 可能包含，需精确匹配
            }
        }
    }
    return false;  // 确定不包含
}
```

**适用场景**：敏感词覆盖率较低时，布隆过滤器可以快速排除大量不含敏感词的文本，减少 Trie 匹配次数。但布隆过滤器的扫描本身也有开销（O(L × maxWordLen)），需根据实际数据特征评估是否启用。

## 开源项目

| 项目                                                                               | 语言                 | 最低 JDK | 特点                                                                        | 适用场景             |
| ---------------------------------------------------------------------------------- | -------------------- | -------- | --------------------------------------------------------------------------- | -------------------- |
| [ToolGood.Words](https://github.com/toolgood/ToolGood.Words)                       | C#/Java/Python/Go/JS | Java 8+  | 多语言支持，内置繁简互换、全角半角、拼音转换；C# 版本过滤速度超 3 亿字符/秒 | 多语言项目           |
| [Hutool DFA](https://hutool.cn/docs/#/dfa/%E6%A6%82%E8%BF%B0)                      | Java                 | Java 8+  | 轻量级，API 简洁，基于 Trie 实现                                            | 中小规模词库         |
| [AhoCorasickDoubleArrayTrie](https://github.com/hankcs/AhoCorasickDoubleArrayTrie) | Java                 | Java 7+  | AC 自动机 + 双数组 Trie，性能优异                                           | 大规模词库、高吞吐量 |

## 生产建议

### 词库管理

- **定期更新**：敏感词库需要持续维护，支持热加载避免重启服务。
- **分级管理**：按业务场景分为高/中/低敏感度，采用不同的处理策略（直接拦截、人工审核、记录日志）。
- **白名单机制**：维护白名单防止误杀。典型场景如敏感词 "XXX" 误杀正常词汇 "XXY"（子串误匹配）、"公安" 误杀 "办公安排" 等。常见应对策略包括白名单词组排除、要求最小匹配长度（如仅匹配完整词而非子串）、上下文窗口判定等。
- **匹配日志**：记录匹配结果用于词库优化和误报分析。

### 异常处理

- **词库加载失败**：构建新 Trie 失败时（如 OOM、文件损坏），应保留旧 Trie 不变，记录错误日志并告警。
- **空词库处理**：词库为空时应记录 WARN 日志，而非静默放行所有文本。
- **匹配超时**：超长文本 + 大词库场景可设置超时熔断。高风险内容超时后应拒绝、隔离或转人工审核，不能默认放行；只有明确的低风险场景经过业务审批后才可以采用 fail-open，并且要限制输入长度、记录指标和及时告警。

### 监控指标

| 指标            | 建议阈值 | 说明                             |
| --------------- | -------- | -------------------------------- |
| 匹配延迟（p99） | < 10ms   | 单次过滤耗时                     |
| 误报率          | < 1%     | 正常内容被误判为敏感词           |
| 漏报率          | 持续监控 | 敏感内容未被识别                 |
| 词库命中率      | 按需分析 | 各敏感词的触发频率，用于词库优化 |

### 架构建议

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sensitive-word-filter-arch.png)

## 参考资料

### 学术论文

- Unicode Standard Annex #15 - Unicode Normalization Forms：<https://www.unicode.org/reports/tr15/>
- Unicode Technical Standard #39 - Unicode Security Mechanisms：<https://www.unicode.org/reports/tr39/>
- Aho, A.V. and Corasick, M.J. (1975). "[Efficient string matching: An aid to bibliographic search](https://dl.acm.org/doi/10.1145/360825.360855)." _Communications of the ACM_, 18(6), 333-340.（AC 自动机原始论文）
- Aoe, J., Morimoto, K., and Sato, T. (1989). "[An Efficient Implementation of Trie Structures](https://www.co-ding.com/assets/pdf/dat.pdf)." _Software: Practice and Experience_.

### 相关专利

- [一种敏感词自动过滤管理系统](https://patents.google.com/patent/CN101964000B)
- [一种网络游戏中敏感词过滤方法及系统](https://patents.google.com/patent/CN103714160A/zh)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/权限系统设计详解.md -->

## [9] 权限系统设计详解

---
title: 权限系统设计详解
description: 基于角色的访问控制（Role-Based Access Control，简称 RBAC）指的是通过用户的角色（Role）授权其相关权限，实现了灵活的访问控制，相比直接授予用户权限，要更加简单、高效、可扩展。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 权限系统设计,RBAC,ABAC,用户角色权限,资源权限,权限模型,权限校验,授权系统
---

<!-- @include: @article-header.snippet.md -->

> 作者：转转技术团队
>
> 原文：<https://mp.weixin.qq.com/s/ONMuELjdHYa0yQceTj01Iw>

## 老权限系统的问题与现状

转转公司在过去并没有一个统一的权限管理系统，权限管理由各业务自行研发或是使用其他业务的权限系统，权限管理的不统一带来了不少问题：

1. 各业务重复造轮子，维护成本高
2. 各系统只解决部分场景问题，方案不够通用，新项目选型时没有可靠的权限管理方案
3. 缺乏统一的日志管理与审批流程，在授权信息追溯上十分困难

基于上述问题，去年底公司启动建设转转统一权限系统，目标是开发一套灵活、易用、安全的权限管理系统，供各业务使用。

## 业界权限系统的设计方式

目前业界主流的权限模型有两种，下面分别介绍下：

- **基于角色的访问控制（RBAC）**
- **基于属性的访问控制（ABAC）**

### RBAC 模型

**基于角色的访问控制（Role-Based Access Control，简称 RBAC）** 指的是通过用户的角色（Role）授权其相关权限，实现了灵活的访问控制，相比直接授予用户权限，要更加简单、高效、可扩展。

一个用户可以拥有若干角色，每一个角色又可以被分配若干权限这样，就构造成“用户-角色-权限” 的授权模型。在这种模型中，用户与角色、角色与权限之间构成了多对多的关系。

用一个图来描述如下：

![RBAC 权限模型示意图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/rbac.png)

当使用 `RBAC模型` 时，通过分析用户的实际情况，基于共同的职责和需求，授予他们不同角色。这种 `用户 -> 角色 -> 权限` 间的关系，让我们可以不用再单独管理单个用户权限，用户从授予的角色里面获取所需的权限。

以一个简单的场景（Gitlab 的权限系统）为例，用户系统中有 `Admin`、`Maintainer`、`Operator` 三种角色，这三种角色分别具备不同的权限，比如只有 `Admin` 具备创建代码仓库、删除代码仓库的权限，其他的角色都不具备。我们授予某个用户 `Admin` 这个角色，他就具备了 **创建代码仓库** 和 **删除代码仓库** 这两个权限。

通过 `RBAC模型` ，当存在多个用户拥有相同权限时，我们只需要创建好拥有该权限的角色，然后给不同的用户分配不同的角色，后续只需要修改角色的权限，就能自动修改角色内所有用户的权限。

### ABAC 模型

**基于属性的访问控制（Attribute-Based Access Control，简称 ABAC）** 是一种比 `RBAC模型` 更加灵活的授权模型，它的原理是通过各种属性来动态判断一个操作是否可以被允许。这个模型在云系统中使用的比较多，比如 AWS，阿里云等。

考虑下面这些场景的权限控制：

1. 授权某个人具体某本书的编辑权限
2. 当一个文档的所属部门跟用户的部门相同时，用户可以访问这个文档
3. 当用户是一个文档的拥有者并且文档的状态是草稿，用户可以编辑这个文档
4. 早上九点前禁止 A 部门的人访问 B 系统
5. 在除了上海以外的地方禁止以管理员身份访问 A 系统
6. 用户对 2022-06-07 之前创建的订单有操作权限

可以发现上述的场景通过 `RBAC模型` 很难去实现，因为 `RBAC模型` 仅仅描述了用户可以做什么操作，但是操作的条件，以及操作的数据，`RBAC模型` 本身是没有这些限制的。但这恰恰是 `ABAC模型` 的长处，`ABAC模型` 的思想是基于用户、访问的数据的属性、以及各种环境因素去动态计算用户是否有权限进行操作。

#### ABAC 模型的原理

在 `ABAC模型` 中，一个操作是否被允许是基于对象、资源、操作和环境信息共同动态计算决定的。

- **对象**：对象是当前请求访问资源的用户。用户的属性包括 ID，个人资源，角色，部门和组织成员身份等
- **资源**：资源是当前用户要访问的资产或对象，例如文件，数据，服务器，甚至 API
- **操作**：操作是用户试图对资源进行的操作。常见的操作包括“读取”，“写入”，“编辑”，“复制”和“删除”
- **环境**：环境是每个访问请求的上下文。环境属性包含访问的时间和位置，对象的设备，通信协议和加密强度等

在 `ABAC模型` 的决策语句的执行过程中，决策引擎会根据定义好的决策语句，结合对象、资源、操作、环境等因素动态计算出决策结果。每当发生访问请求时，`ABAC模型` 决策系统都会分析属性值是否与已建立的策略匹配。如果有匹配的策略，访问请求就会被通过。

## 新权限系统的设计思想

结合转转的业务现状，`RBAC模型` 满足了转转绝大部分业务场景，并且开发成本远低于 `ABAC模型` 的权限系统，所以新权限系统选择了基于 `RBAC模型` 来实现。对于实在无法满足的业务系统，我们选择了暂时性不支持，这样可以保障新权限系统的快速落地，更快的让业务使用起来。

标准的 `RBAC模型` 是完全遵守 `用户 -> 角色 -> 权限` 这个链路的，也就是用户的权限完全由他所拥有的角色来控制，但是这样会有一个缺点，就是给用户加权限必须新增一个角色，导致实际操作起来效率比较低。所以我们在 `RBAC模型` 的基础上，新增了给用户直接增加权限的能力，也就是说既可以给用户添加角色，也可以给用户直接添加权限。最终用户的权限是由拥有的角色和权限点组合而成。

**新权限系统的权限模型**：用户最终权限 = 用户拥有的角色带来的权限 + 用户独立配置的权限，两者取并集。

新权限系统方案如下图：

![新权限系统方案](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/new-authority-system-design.png)

- 首先，将集团所有的用户（包括外部用户），通过 **统一登录与注册** 功能实现了统一管理，同时与公司的组织架构信息模块打通，实现了同一个人员在所有系统中信息的一致，这也为后续基于组织架构进行权限管理提供了可行性。
- 其次，因为新权限系统需要服务集团所有业务，所以需要支持多系统权限管理。用户进行权限管理前，需要先选择相应的系统，然后配置该系统的 **菜单权限** 和 **数据权限** 信息，建立好系统的各个权限点。_PS：菜单权限和数据权限的具体说明，下文会详细介绍。_
- 最后，创建该系统下的不同角色，给不同角色配置好权限点。比如店长角色，拥有店员操作权限、本店数据查看权限等，配置好这个角色后，后续只需要给店长增加这个角色，就可以让他拥有对应的权限。

完成上述配置后，就可以进行用户的权限管理了。有两种方式可以给用户加权限：

1. 先选用户，然后添加权限。该方式可以给用户添加任意角色或是菜单/数据权限点。
2. 先选择角色，然后关联用户。该方式只可给用户添加角色，不能单独添加菜单/数据权限点。

这两种方式的具体设计方案，后文会详细说明。

### 权限系统自身的权限管理

对于权限系统来说，首先需要设计好系统自身的权限管理，也就是需要管理好 ”谁可以进入权限系统，谁可以管理其他系统的权限“，对于权限系统自身的用户，会分为三类：

1. **超级管理员**：拥有权限系统的全部操作权限，可以进行系统自身的任何操作，也可以管理接入权限的应用系统的管理操作。
2. **权限操作用户**：拥有至少一个已接入的应用系统的超级管理员角色的用户。该用户能进行的操作限定在所拥有的应用系统权限范围内。权限操作用户是一种身份，无需分配，而是根据规则自动获得的。
3. **普通用户**：普通用户也可以认为是一种身份，除去上述 2 类人，其余的都为普通用户。他们只能申请接入系统以及访问权限申请页面。

### 权限类型的定义

新权限系统中，我们把权限分为两大类，分别是：

- **菜单功能权限**：包括系统的目录导航、菜单的访问权限，以及按钮和 API 操作的权限
- **数据权限**：包括定义数据的查询范围权限，在不同系统中，通常叫做 “组织”、”站点“等，在新权限系统中，统一称作 ”组织“ 来管理数据权限

### 默认角色的分类

每个系统中设计了三个默认角色，用来满足基本的权限管理需求，分别如下：

- **超级管理员**：该角色拥有该系统的全部权限，可以修改系统的角色权限等配置，可以给其他用户授权。
- **系统管理员**：该角色拥有给其他用户授权以及修改系统的角色权限等配置能力，但角色本身不具有任何权限。
- **授权管理员**：该角色拥有给其他用户授权的能力。但是授权的范围不超出自己所拥有的权限。

> 举个栗子：授权管理员 A 可以给 B 用户添加权限，但添加的范围 小于等于 A 用户已拥有的权限。

经过这么区分，把 **拥有权限** 和 **拥有授权能力** ，这两部分给分隔开来，可以满足所有的权限控制的场景。

## 新权限系统的核心模块设计

上面介绍了新权限系统的整体设计思想，接下来分别介绍下核心模块的设计

### 系统/菜单/数据权限管理

把一个新系统接入权限系统有下列步骤：

1. 创建系统
2. 配置菜单功能权限
3. 配置数据权限（可选）
4. 创建系统的角色

其中，1、2、3 的步骤，都是在系统管理模块完成，具体流程如下图:

![系统接入流程图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/new-authority-system-design-access-flow-chart.png)

用户可以对系统的基本信息进行增删改查的操作，不同系统之间通过 `系统编码` 作为唯一区分。同时 `系统编码` 也会用作于菜单和数据权限编码的前缀，通过这样的设计保证权限编码全局唯一性。

例如系统的编码为 `test_online`，那么该系统的菜单编码格式便为 `test_online:m_xxx`。

系统管理界面设计如下：

![系统管理界面设计](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/new-authority-system-management-interface.png)

#### 菜单管理

新权限系统首先对菜单进行了分类，分别是 `目录`、`菜单` 和 `操作`，示意如下图

![菜单管理界面](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/new-authority-system-menu.png)

它们分别代表的含义是：

- **目录**：指的是应用系统中最顶部的一级目录，通常在系统 Logo 的右边
- **菜单**：指的是应用系统左侧的多层级菜单，通常在系统 Logo 的下面，也是最常用的菜单结构
- **操作**：指页面中的按钮、接口等一系列可以定义为操作或页面元素的部分。

菜单管理界面设计如下：

![菜单管理界面设计](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/new-authority-system-menu-management-interface.png)

菜单权限数据的使用，也提供两种方式：

- **动态菜单模式**：这种模式下，菜单的增删完全由权限系统接管。也就是说在权限系统增加菜单，应用系统会同步增加。这种模式好处是修改菜单无需项目上线。
- **静态菜单模式**：菜单的增删由应用系统的前端控制，权限系统只控制访问权限。这种模式下，权限系统只能标识出用户是否拥有当前菜单的权限，而具体的显示控制是由前端根据权限数据来决定。

需要特别注意：前端隐藏目录、菜单或按钮只是在改善用户体验，不能作为真正的安全边界。无论采用动态还是静态菜单模式，后端都必须默认拒绝未明确授权的访问，并在每次请求中校验当前用户是否有权执行对应操作。涉及具体数据时，还要继续校验资源归属、租户、组织和数据范围，不能只判断用户是否拥有某个菜单，也不能信任客户端传入的用户 ID、组织 ID 或资源 ID。

### 角色与用户管理

角色与用户管理都是可以直接改变用户权限的核心模块，整个设计思路如下图：

![角色与用户管理模块设计](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/role-and-user-management.png)

这个模块设计重点是需要考虑到批量操作。无论是通过角色关联用户，还是给用户批量增加/删除/重置权限，批量操作的场景都是系统需要设计好的。

### 权限申请

除了给其他用户添加权限外，新权限系统同时支持了用户自主申请权限。这个模块除了常规的审批流（申请、审批、查看）等，有一个比较特别的功能，就是如何让用户能选对自己要的权限。所以在该模块的设计上，除了直接选择角色外，还支持通过菜单/数据权限点，反向选择角色，如下图：

![权限申请界面](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/permission-application.png)

### 操作日志

系统操作日志会分为两大类：

1. **操作流水日志**：用户可看、可查的关键操作日志
2. **服务 Log 日志**：系统服务运行过程中产生的 Log 日志,其中，服务 Log 日志信息量大于操作流水日志，但是不方便搜索查看。所以权限系统需要提供操作流水日志功能。

在新权限系统中，用户所有的操作可以分为三类，分别为新增、更新、删除。所有的模块也可枚举，例如用户管理、角色管理、菜单管理等。明确这些信息后，那么一条日志就可以抽象为：什么人(Who)在什么时间(When)对哪些人(Target)的哪些模块做了哪些操作。
这样把所有的记录都入库，就可以方便的进行日志的查看和筛选了。

## 总结与展望

至此，新权限系统的核心设计思路与模块都已介绍完成，新系统在转转内部有大量的业务接入使用，权限管理相比以前方便了许多。权限系统作为每家公司的一个基础系统，灵活且完备的设计可以助力日后业务的发展更加高效。

后续两篇：

- [转转统一权限系统的设计与实现（后端实现篇）](https://mp.weixin.qq.com/s/hFTDckfxhSnoM_McP18Vkg)
- [转转统一权限系统的设计与实现（前端实现篇）](https://mp.weixin.qq.com/s/a_P4JAwxgunhfmJvpBnWYA)

## 参考

- OWASP Authorization Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- 选择合适的权限模型：<https://docs.authing.cn/v2/guides/access-control/choose-the-right-access-control-model.html>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/认证授权基础概念详解.md -->

## [10] 认证授权基础概念详解

---
title: 认证授权基础概念详解
description: 认证与授权基础概念详解，讲解Authentication和Authorization的区别、Session、Token、OAuth2等核心知识。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 认证,授权,Authentication,Authorization,Session,Token,OAuth2,权限控制,安全基础
---

## 认证 (Authentication) 和授权 (Authorization)的区别是什么？

这是一个绝大多数人都会混淆的问题。首先先从读音上来认识这两个名词，很多人都会把它俩的读音搞混，所以我建议你先先去查一查这两个单词到底该怎么读，他们的具体含义是什么。

说简单点就是：

- **认证 (Authentication)：** 你是谁。
- **授权 (Authorization)：** 你有权限干什么。

稍微正式点（啰嗦点）的说法就是：

- **Authentication（认证）** 是验证您的身份的凭据（例如用户名/用户 ID 和密码），通过这个凭据，系统得以知道你就是你，也就是说系统存在你这个用户。所以，Authentication 被称为身份/用户验证。
- **Authorization（授权）** 发生在 **Authentication（认证）** 之后。授权嘛，光看意思大家应该就明白，它主要掌管我们访问系统的权限。比如有些特定资源只能具有特定权限的人才能访问比如 admin，有些对系统资源操作比如删除、添加、更新只能特定人才具有。

认证：

![认证登录](https://oss.javaguide.cn/github/javaguide/系统设计/安全/authentication-login.png)

授权：

![没有权限](https://oss.javaguide.cn/github/javaguide/系统设计/安全/20210604161032412.png)

这两个一般在我们的系统中被结合在一起使用，目的就是为了保护我们系统的安全性。

## RBAC 模型了解吗？

系统权限控制最常采用的访问控制模型就是 **RBAC 模型** 。

**什么是 RBAC 呢？** RBAC 即基于角色的权限访问控制（Role-Based Access Control）。这是一种通过角色关联权限，角色同时又关联用户的授权的方式。

简单地说：一个用户可以拥有若干角色，每一个角色又可以被分配若干权限，这样就构造成“用户-角色-权限” 的授权模型。在这种模型中，用户与角色、角色与权限之间构成了多对多的关系。

![RBAC 权限模型示意图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/rbac.png)

在 RBAC 权限模型中，权限与角色相关联，用户通过成为包含特定角色的成员而得到这些角色的权限，这就极大地简化了权限的管理。

为了实现 RBAC 权限模型，数据库表的常见设计如下（一共 5 张表，2 张用户建立表之间的联系）：

![](https://oss.javaguide.cn/2020-11/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%AE%BE%E8%AE%A1-%E6%9D%83%E9%99%90.png)

通过这个权限模型，我们可以创建不同的角色并为不同的角色分配不同的权限范围（菜单）。

![](https://oss.javaguide.cn/github/javaguide/books%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86%E6%A8%A1%E5%9D%97.png)

通常来说，如果系统对于权限控制要求比较严格的话，一般都会选择使用 RBAC 模型来做权限控制。

## 什么是 Cookie ? Cookie 的作用是什么?

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/cookie-sessionId.png)

`Cookie` 和 `Session` 都是用来跟踪浏览器用户身份的会话方式，但是两者的应用场景不太一样。

维基百科是这样定义 `Cookie` 的：

> `Cookies` 是某些网站为了辨别用户身份而储存在用户本地终端上的数据（通常经过加密）。

简单来说：**`Cookie` 存放在客户端，一般用来保存用户信息**。

下面是 `Cookie` 的一些应用案例：

1. 我们在 `Cookie` 中保存已经登录过的用户信息，下次访问网站的时候页面可以自动帮你登录的一些基本信息给填了。除此之外，`Cookie` 还能保存用户首选项，主题和其他设置信息。
2. 使用 `Cookie` 保存 `SessionId` 或者 `Token` ，向后端发送请求的时候带上 `Cookie`，这样后端就能取到 `Session` 或者 `Token` 了。这样就能记录用户当前的状态了，因为 HTTP 协议是无状态的。
3. `Cookie` 还可以用来记录和分析用户行为。举个简单的例子你在网上购物的时候，因为 HTTP 协议是没有状态的，如果服务器想要获取你在某个页面的停留状态或者看了哪些商品，一种常用的实现方式就是将这些信息存放在 `Cookie`
4. ……

## 如何在项目中使用 Cookie 呢？

我这里以 Spring Boot 项目为例。

**1)设置 `Cookie` 返回给客户端**

```java
@GetMapping("/change-username")
public String setCookie(HttpServletResponse response) {
    // 创建一个 cookie
    Cookie cookie = new Cookie("username", "Jovan");
    //设置 cookie过期时间
    cookie.setMaxAge(7 * 24 * 60 * 60); // expires in 7 days
    //添加到 response 中
    response.addCookie(cookie);

    return "Username is changed!";
}
```

**2) 使用 Spring 框架提供的 `@CookieValue` 注解获取特定的 cookie 的值**

```java
@GetMapping("/")
public String readCookie(@CookieValue(value = "username", defaultValue = "Atta") String username) {
    return "Hey! My username is " + username;
}
```

**3) 读取所有的 `Cookie` 值**

```java
@GetMapping("/all-cookies")
public String readAllCookies(HttpServletRequest request) {

    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        return Arrays.stream(cookies)
                .map(c -> c.getName() + "=" + c.getValue()).collect(Collectors.joining(", "));
    }

    return "No cookies";
}
```

更多关于如何在 Spring Boot 中使用 `Cookie` 的内容可以查看这篇文章：[How to use cookies in Spring Boot](https://attacomsian.com/blog/cookies-spring-boot) 。

## Cookie 和 Session 有什么区别？

**`Session` 的主要作用就是通过服务端记录用户的状态。** 典型的场景是购物车，当你要添加商品到购物车的时候，系统不知道是哪个用户操作的，因为 HTTP 协议是无状态的。服务端给特定的用户创建特定的 `Session` 之后就可以标识这个用户并且跟踪这个用户了。

`Cookie` 数据保存在客户端(浏览器端)，`Session` 数据保存在服务器端。相对来说 `Session` 安全性更高。如果使用 `Cookie` 的一些敏感信息不要写入 `Cookie` 中，最好能将 `Cookie` 信息加密然后使用到的时候再去服务器端解密。

**那么，如何使用 `Session` 进行身份验证？**

## 如何使用 Session-Cookie 方案进行身份验证？

很多时候我们都是通过 `SessionID` 来实现特定的用户，`SessionID` 一般会选择存放在 Redis 中。举个例子：

1. 用户成功登陆系统，然后返回给客户端具有 `SessionID` 的 `Cookie` 。
2. 当用户向后端发起请求的时候会把 `SessionID` 带上，这样后端就知道你的身份状态了。

关于这种认证方式更详细的过程如下：

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/session-cookie-authentication-process.png)

1. 用户向服务器发送用户名、密码、验证码用于登陆系统。
2. 服务器验证通过后，会为这个用户创建一个专属的 Session 对象（可以理解为服务器上的一块内存，存放该用户的状态数据，如购物车、登录信息等）存储起来，并给这个 Session 分配一个唯一的 `SessionID`。
3. 服务器通过 HTTP 响应头中的 `Set-Cookie` 指令，把这个 `SessionID` 发送给用户的浏览器。
4. 浏览器接收到 `SessionID` 后，会将其以 Cookie 的形式保存在本地。当用户保持登录状态时，每次向该服务器发请求，浏览器都会自动带上这个存有 `SessionID` 的 Cookie。
5. 服务器收到请求后，从 Cookie 中拿出 `SessionID`，就能找到之前保存的那个 Session 对象，从而知道这是哪个用户以及他之前的状态了。

使用 Session 的时候需要注意下面几个点：

- **客户端 Cookie 支持**：依赖 Session 的核心功能要确保用户浏览器开启了 Cookie。
- **Session 过期管理**：合理设置 Session 的过期时间，平衡安全性和用户体验。
- **Session ID 安全**：为包含 `SessionID` 的 Cookie 设置 `HttpOnly` 标志可以防止客户端脚本（如 JavaScript）窃取，设置 Secure 标志可以保证 `SessionID` 只在 HTTPS 连接下传输，增加安全性。

另外，Spring Session 提供了一种跨多个应用程序或实例管理用户会话信息的机制。如果想详细了解可以查看下面几篇很不错的文章：

- [Getting Started with Spring Session](https://codeboje.de/spring-Session-tutorial/)
- [Guide to Spring Session](https://www.baeldung.com/spring-Session)
- [Sticky Sessions with Spring Session & Redis](https://medium.com/@gvnix/sticky-Sessions-with-spring-Session-redis-bdc6f7438cc3)

## 多服务器节点下 Session-Cookie 方案如何做？

Session-Cookie 方案在单体环境是一个非常好的身份认证方案。但是，当服务器水平拓展成多节点时，Session-Cookie 方案就要面临挑战了。

举个例子：假如我们部署了两份相同的服务 A，B，用户第一次登陆的时候 ，Nginx 通过负载均衡机制将用户请求转发到 A 服务器，此时用户的 Session 信息保存在 A 服务器。结果，用户第二次访问的时候 Nginx 将请求路由到 B 服务器，由于 B 服务器没有保存 用户的 Session 信息，导致用户需要重新进行登陆。

**我们应该如何避免上面这种情况的出现呢？**

有几个方案可供大家参考：

1. 某个用户的所有请求都通过特性的哈希策略分配给同一个服务器处理。这样的话，每个服务器都保存了一部分用户的 Session 信息。服务器宕机，其保存的所有 Session 信息就完全丢失了。
2. 每一个服务器保存的 Session 信息都是互相同步的，也就是说每一个服务器都保存了全量的 Session 信息。每当一个服务器的 Session 信息发生变化，我们就将其同步到其他服务器。这种方案成本太大，并且，节点越多时，同步成本也越高。
3. 单独使用一个所有服务器都能访问到的数据节点（比如缓存）来存放 Session 信息。为了保证高可用，数据节点尽量要避免是单点。
4. Spring Session 是一个用于在多个服务器之间管理会话的项目。它可以与多种后端存储（如 Redis、MongoDB 等）集成，从而实现分布式会话管理。通过 Spring Session，可以将会话数据存储在共享的外部存储中，以实现跨服务器的会话同步和共享。

## 如果没有 Cookie 的话 Session 还能用吗？

这是一道经典的面试题！

一般是通过 `Cookie` 来保存 `SessionID` ，假如你使用了 `Cookie` 保存 `SessionID` 的方案的话， 如果客户端禁用了 `Cookie`，那么 `Session` 就无法正常工作。

但是，服务端 Session 并不等于必须使用 Cookie。非浏览器客户端可以通过明确约定的请求头携带会话凭据。不过，不要把 `SessionID` 放进 URL：即使对它进行加密，它仍然是可以直接使用的身份凭据，并可能泄露到浏览器历史、访问日志、监控系统和 Referer 中。URL 重写只适合不得不兼容的遗留场景，不应作为新系统的登录方案。

## 为什么基于 Cookie 的认证更需要关注 CSRF？

**CSRF(Cross Site Request Forgery)** 一般被翻译为 **跨站请求伪造** 。那么什么是 **跨站请求伪造** 呢？说简单点，就是用你的身份去发送一些对你不友好的请求。举个简单的例子：

小壮登录了某网上银行，他来到了网上银行的帖子区，看到一个帖子下面有一个链接写着“科学理财，年盈利率过万”，小壮好奇的点开了这个链接，结果发现自己的账户少了 10000 元。这是这么回事呢？原来黑客在链接中藏了一个请求，这个请求直接利用小壮的身份给银行发送了一个转账请求,也就是通过你的 Cookie 向银行发出请求。

```html
<a href="http://www.mybank.com/Transfer?bankId=11&money=10000"
  >科学理财，年盈利率过万</a
>
```

上面也提到过，进行 `Session` 认证的时候，我们一般使用 `Cookie` 来存储 `SessionId`。浏览器登录以后会自动在符合 Cookie 作用域的请求中带上它，服务端通过 `SessionId` 识别用户。攻击者如果直接窃取了 `SessionId`，造成的是会话劫持；而 CSRF 通常不要求攻击者读取 Cookie，它利用的是浏览器会自动携带 Cookie 的特性。

`Session` 认证中 `Cookie` 中的 `SessionId` 是由浏览器发送到服务端的，借助这个特性，攻击者就可以通过让用户误点攻击链接，达到攻击效果。

如果客户端把 Token 作为 Bearer Token，显式放入 `Authorization` Header，浏览器不会像 Cookie 那样自动把它附带到跨站请求中，因此可以降低传统 CSRF 风险。这里起作用的是凭据的携带方式，而不是 Token 或 JWT 这种格式本身。

不要因此默认把 Token 存入 `localStorage` 或 `sessionStorage`。同源页面中的恶意脚本可以读取 Web Storage，一处 XSS 漏洞就可能直接泄露 Token。浏览器应用可以根据场景选择 Backend For Frontend（BFF），或者使用设置了 `HttpOnly`、`Secure` 和合适 `SameSite` 属性的 Cookie；使用 Cookie 时还应结合 CSRF Token、`Origin`/`Referer` 校验等机制。

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/20210615161108272.png)

需要注意的是：不论是 `Cookie` 还是 `Token`，认证机制本身都无法避免 **跨站脚本攻击（Cross Site Scripting）XSS**。`HttpOnly` 可以降低脚本直接读取 Cookie 的风险，但 XSS 仍可能以用户身份发起请求，因此还需要正确的输出编码、必要时的 HTML 净化以及 CSP 等纵深防御。

> 跨站脚本攻击（Cross Site Scripting）缩写为 CSS 但这会与层叠样式表（Cascading Style Sheets，CSS）的缩写混淆。因此，有人将跨站脚本攻击缩写为 XSS。

XSS 中攻击者会用各种方式将恶意代码注入到其他用户的页面中。就可以通过脚本盗用信息比如 `Cookie` 。

推荐阅读：[如何防止 CSRF 攻击？—美团技术团队](https://tech.meituan.com/2018/10/11/fe-security-csrf.html)

安全实践还可以参考：

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## 什么是 JWT?JWT 由哪些部分组成？

[JWT 基础概念详解](./JWT 基础概念详解.md)

## 如何基于 JWT 进行身份验证？ 如何防止 JWT 被篡改？

[JWT 基础概念详解](./JWT 基础概念详解.md)

## 什么是 SSO?

SSO(Single Sign On)即单点登录说的是用户登陆多个子系统的其中一个就有权访问与其相关的其他系统。举个例子我们在登陆了京东金融之后，我们同时也成功登陆京东的京东超市、京东国际、京东生鲜等子系统。

![SSO 示意图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/sso.png)

## SSO 有什么好处？

- **用户角度** :用户能够做到一次登录多次使用，无需记录多套用户名和密码，省心。
- **系统管理员角度** : 管理员只需维护好一个统一的账号中心就可以了，方便。
- **新系统开发角度:** 新系统开发时只需直接对接统一的账号中心即可，简化开发流程，省时。

## 如何设计实现一个 SSO 系统?

[SSO 单点登录详解](./SSO 单点登录详解.md)

## 什么是 OAuth 2.0？

OAuth 是一个行业的标准授权协议，主要用来授权第三方应用获取有限的权限。而 OAuth 2.0 是对 OAuth 1.0 的完全重新设计，OAuth 2.0 更快，更容易实现，OAuth 1.0 已经被废弃。详情请见：[rfc6749](https://tools.ietf.org/html/rfc6749)。

实际上它就是一种授权机制，它的最终目的是为第三方应用颁发一个有时效性的令牌 Token，使得第三方应用能够通过该令牌获取相关的资源。

OAuth 2.0 比较常用的场景就是第三方登录，当你的网站接入了第三方登录的时候一般就是使用的 OAuth 2.0 协议。

另外，现在 OAuth 2.0 也常见于支付场景（微信支付、支付宝支付）和开发平台（微信开放平台、阿里开放平台等等）。

下图是 [Slack OAuth 2.0 第三方登录](https://api.slack.com/legacy/oauth)的示意图：

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/20210615151716340.png)

**推荐阅读：**

- [OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
- [10 分钟理解什么是 OAuth 2.0 协议](https://deepzz.com/post/what-is-oauth2-protocol.html)
- [OAuth 2.0 的四种方式](http://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html)
- [GitHub OAuth 第三方登录示例教程](http://www.ruanyifeng.com/blog/2019/04/github-oauth.html)

## 参考

- 不要用 JWT 替代 session 管理（上）：全面了解 Token,JWT,OAuth,SAML,SSO：<https://zhuanlan.zhihu.com/p/38942172>
- Introduction to JSON Web Tokens：<https://jwt.io/introduction>
- JSON Web Token Claims：<https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/数据脱敏方案总结.md -->

## [11] 数据脱敏方案总结

---
title: 数据脱敏方案总结
description: 数据脱敏方案详解，涵盖手机号、身份证、银行卡等敏感数据的脱敏规则及Hutool工具实现方法。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 数据脱敏,隐私保护,手机号脱敏,身份证脱敏,掩码规则,敏感数据,测试数据,合规
---

<!-- @include: @article-header.snippet.md -->

> 本文转载完善自[Hutool：一行代码搞定数据脱敏 - 京东云开发者](https://mp.weixin.qq.com/s/1qFWczesU50ndPPLtABHFg)。

## 什么是数据脱敏

### 数据脱敏的定义

数据脱敏百度百科中是这样定义的：

> 数据脱敏，指对某些敏感信息通过脱敏规则进行数据的变形，实现敏感隐私数据的可靠保护。这样就可以在开发、测试和其它非生产环境以及外包环境中安全地使用脱敏后的真实数据集。在涉及客户安全数据或者一些商业性敏感数据的情况下，在不违反系统规则条件下，对真实数据进行改造并提供测试使用，如身份证号、手机号、卡号、客户号等个人信息都需要进行数据脱敏。是数据库安全技术之一。

总的来说，数据脱敏是指对某些敏感信息通过脱敏规则进行数据的变形，实现敏感隐私数据的可靠保护。

在数据脱敏过程中，通常会采用不同的算法和技术，以根据不同的需求和场景对数据进行处理。例如，对于身份证号码，可以使用掩码算法（masking）将前几位数字保留，其他位用 “X” 或 "\*" 代替；对于姓名，可以使用伪造（pseudonymization）算法，将真实姓名替换成随机生成的假名。

### 常用脱敏规则

常用脱敏规则是为了保护敏感数据的安全性，在处理和存储敏感数据时对其进行变换或修改。

下面是几种常见的脱敏规则：

- 替换(常用)：将敏感数据中的特定字符或字符序列替换为其他字符。例如，将信用卡号中的中间几位数字替换为星号（\*）或其他字符。
- 删除：将敏感数据中的部分内容随机删除。比如，将电话号码的随机 3 位数字进行删除。
- 重排：将原始数据中的某些字符或字段的顺序打乱。例如，将身份证号码的随机位交错互换。
- 加噪：在数据中注入一些误差或者噪音，达到对数据脱敏的效果。例如，在敏感数据中添加一些随机生成的字符。
- 加密或令牌化（常用）：需要恢复原文时，可以使用带完整性保护的加密算法；不需要恢复原文时，可以根据用途选择截断、令牌化或带独立密钥的 HMAC。MD5、SHA-256 等哈希函数不是加密算法，直接对银行卡号这类结构化数据做无密钥哈希还可能被枚举。常见加密算法总结可以参考这篇文章：<https://javaguide.cn/系统设计/安全/encryption-algorithms.html> 。
- ……

## 常用脱敏工具

### Hutool

Hutool 一个 Java 基础工具类，对文件、流、加密解密、转码、正则、线程、XML 等 JDK 方法进行封装，组成各种 Util 工具类，同时提供以下组件：

|        模块        |                                     介绍                                      |
| :----------------: | :---------------------------------------------------------------------------: |
|     hutool-aop     |                   JDK 动态代理封装，提供非 IOC 下的切面支持                   |
| hutool-bloomFilter |                    布隆过滤，提供一些 Hash 算法的布隆过滤                     |
|    hutool-cache    |                                 简单缓存实现                                  |
|    hutool-core     |                   核心，包括 Bean 操作、日期、各种 Util 等                    |
|    hutool-cron     |                 定时任务模块，提供类 Crontab 表达式的定时任务                 |
|   hutool-crypto    |                 加密解密模块，提供对称、非对称和摘要算法封装                  |
|     hutool-db      |                 JDBC 封装后的数据操作，基于 ActiveRecord 思想                 |
|     hutool-dfa     |                          基于 DFA 模型的多关键字查找                          |
|    hutool-extra    | 扩展模块，对第三方封装（模板引擎、邮件、Servlet、二维码、Emoji、FTP、分词等） |
|    hutool-http     |                   基于 HttpUrlConnection 的 Http 客户端封装                   |
|     hutool-log     |                          自动识别日志实现的日志门面                           |
|   hutool-script    |                         脚本执行封装，例如 Javascript                         |
|   hutool-setting   |                功能更强大的 Setting 配置文件和 Properties 封装                |
|   hutool-system    |                        系统参数调用封装（JVM 信息等）                         |
|    hutool-json     |                                   JSON 实现                                   |
|   hutool-captcha   |                                图片验证码实现                                 |
|     hutool-poi     |                       针对 POI 中 Excel 和 Word 的封装                        |
|   hutool-socket    |                    基于 Java 的 NIO 和 AIO 的 Socket 封装                     |
|     hutool-jwt     |                         JSON Web Token (JWT) 封装实现                         |

可以根据需求对每个模块单独引入，也可以通过引入`hutool-all`方式引入所有模块，本文所使用的数据脱敏工具就是在 `hutool.core` 模块。

现阶段最新版本的 Hutool 支持的脱敏数据类型如下，基本覆盖了常见的敏感信息。

1. 用户 id
2. 中文姓名
3. 身份证号
4. 座机号
5. 手机号
6. 地址
7. 电子邮件
8. 密码
9. 中国大陆车牌，包含普通车辆、新能源车辆
10. 银行卡

#### 一行代码实现脱敏

Hutool 提供的脱敏方法如下图所示：

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/2023-08-01-10-2119fnVCIDozqHgRGx.png)

注意：Hutool 脱敏是通过 \* 来代替敏感信息的，具体实现是在 StrUtil.hide 方法中，如果我们想要自定义隐藏符号，则可以把 Hutool 的源码拷出来，重新实现即可。

这里以手机号、银行卡号、身份证号、密码信息的脱敏为例，下面是对应的测试代码。

```java
import cn.hutool.core.util.DesensitizedUtil;
import org.junit.Test;
import org.springframework.boot.test.context.Spring BootTest;

/**
 *
 * @description: Hutool实现数据脱敏
 */
@Spring BootTest
public class HuToolDesensitizationTest {

    @Test
    public void testPhoneDesensitization(){
        String phone="13723231234";
        System.out.println(DesensitizedUtil.mobilePhone(phone)); //输出：137****1234
    }
    @Test
    public void testBankCardDesensitization(){
        String bankCard="6217000130008255666";
        System.out.println(DesensitizedUtil.bankCard(bankCard)); //输出：6217 **** **** *** 5666
    }

    @Test
    public void testIdCardNumDesensitization(){
        String idCardNum="411021199901102321";
        //只显示前4位和后2位
        System.out.println(DesensitizedUtil.idCardNum(idCardNum,4,2)); //输出：4110************21
    }
    @Test
    public void testPasswordDesensitization(){
        String password="www.jd.com_35711";
        System.out.println(DesensitizedUtil.password(password)); //输出：****************
    }
}
```

以上就是使用 Hutool 封装好的工具类实现数据脱敏。

需要特别注意：密码不属于“脱敏后还可以继续展示或存储”的普通字段。密码应在服务端入口尽快使用专门的密码哈希算法处理，不能明文存储、返回或记录到日志中。这里的 `password()` 只表示把字符串全部替换为 `*`，不能替代密码哈希。

#### 配合 JackSon 通过注解方式实现脱敏

现在有了数据脱敏工具类，如果前端需要显示数据数据的地方比较多，我们不可能在每个地方都调用一个工具类，这样就显得代码太冗余了，那我们如何通过注解的方式优雅的完成数据脱敏呢？

如果项目是基于 Spring Boot 的 web 项目，则可以利用 Spring Boot 自带的 jackson 自定义序列化实现。它的实现原理其实就是在 json 进行序列化渲染给前端时，进行脱敏。

**第一步：脱敏策略的枚举。**

```java
/**
 * @author
 * @description:脱敏策略枚举
 */
public enum DesensitizationTypeEnum {
    //自定义
    MY_RULE,
    //用户id
    USER_ID,
    //中文名
    CHINESE_NAME,
    //身份证号
    ID_CARD,
    //座机号
    FIXED_PHONE,
    //手机号
    MOBILE_PHONE,
    //地址
    ADDRESS,
    //电子邮件
    EMAIL,
    //密码
    PASSWORD,
    //中国大陆车牌，包含普通车辆、新能源车辆
    CAR_LICENSE,
    //银行卡
    BANK_CARD
}
```

上面表示支持的脱敏类型。

**第二步：定义一个用于脱敏的 Desensitization 注解。**

- `@Retention (RetentionPolicy.RUNTIME)`：运行时生效。
- `@Target (ElementType.FIELD)`：可用在字段上。
- `@JacksonAnnotationsInside`：此注解可以点进去看一下是一个元注解，主要是用户打包其他注解一起使用。
- `@JsonSerialize`：上面说到过，该注解的作用就是可自定义序列化，可以用在注解上，方法上，字段上，类上，运行时生效等等，根据提供的序列化类里面的重写方法实现自定义序列化。

```java
/**
 * @author
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@JacksonAnnotationsInside
@JsonSerialize(using = DesensitizationSerialize.class)
public @interface Desensitization {
    /**
     * 脱敏数据类型，在MY_RULE的时候，startInclude和endExclude生效
     */
    DesensitizationTypeEnum type() default DesensitizationTypeEnum.MY_RULE;

    /**
     * 脱敏开始位置（包含）
     */
    int startInclude() default 0;

    /**
     * 脱敏结束位置（不包含）
     */
    int endExclude() default 0;
}
```

注：只有使用了自定义的脱敏枚举 `MY_RULE` 的时候，开始位置和结束位置才生效。

**第三步：创建自定的序列化类**

这一步是我们实现数据脱敏的关键。自定义序列化类继承 `JsonSerializer`，实现 `ContextualSerializer` 接口，并重写两个方法。

```java
/**
 * @author
 * @description: 自定义序列化类
 */
@AllArgsConstructor
@NoArgsConstructor
public class DesensitizationSerialize extends JsonSerializer<String> implements ContextualSerializer {
    private DesensitizationTypeEnum type;

    private Integer startInclude;

    private Integer endExclude;

    @Override
    public void serialize(String str, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        switch (type) {
            // 自定义类型脱敏
            case MY_RULE:
                jsonGenerator.writeString(CharSequenceUtil.hide(str, startInclude, endExclude));
                break;
            // userId脱敏
            case USER_ID:
                jsonGenerator.writeString(String.valueOf(DesensitizedUtil.userId()));
                break;
            // 中文姓名脱敏
            case CHINESE_NAME:
                jsonGenerator.writeString(DesensitizedUtil.chineseName(String.valueOf(str)));
                break;
            // 身份证脱敏
            case ID_CARD:
                jsonGenerator.writeString(DesensitizedUtil.idCardNum(String.valueOf(str), 1, 2));
                break;
            // 固定电话脱敏
            case FIXED_PHONE:
                jsonGenerator.writeString(DesensitizedUtil.fixedPhone(String.valueOf(str)));
                break;
            // 手机号脱敏
            case MOBILE_PHONE:
                jsonGenerator.writeString(DesensitizedUtil.mobilePhone(String.valueOf(str)));
                break;
            // 地址脱敏
            case ADDRESS:
                jsonGenerator.writeString(DesensitizedUtil.address(String.valueOf(str), 8));
                break;
            // 邮箱脱敏
            case EMAIL:
                jsonGenerator.writeString(DesensitizedUtil.email(String.valueOf(str)));
                break;
            // 密码脱敏
            case PASSWORD:
                jsonGenerator.writeString(DesensitizedUtil.password(String.valueOf(str)));
                break;
            // 中国车牌脱敏
            case CAR_LICENSE:
                jsonGenerator.writeString(DesensitizedUtil.carLicense(String.valueOf(str)));
                break;
            // 银行卡脱敏
            case BANK_CARD:
                jsonGenerator.writeString(DesensitizedUtil.bankCard(String.valueOf(str)));
                break;
            default:
        }

    }

    @Override
    public JsonSerializer<?> createContextual(SerializerProvider serializerProvider, BeanProperty beanProperty) throws JsonMappingException {
        if (beanProperty != null) {
            // 判断数据类型是否为String类型
            if (Objects.equals(beanProperty.getType().getRawClass(), String.class)) {
                // 获取定义的注解
                Desensitization desensitization = beanProperty.getAnnotation(Desensitization.class);
                // 为null
                if (desensitization == null) {
                    desensitization = beanProperty.getContextAnnotation(Desensitization.class);
                }
                // 不为null
                if (desensitization != null) {
                    // 创建定义的序列化类的实例并且返回，入参为注解定义的type,开始位置，结束位置。
                    return new DesensitizationSerialize(desensitization.type(), desensitization.startInclude(),
                            desensitization.endExclude());
                }
            }

            return serializerProvider.findValueSerializer(beanProperty.getType(), beanProperty);
        }
        return serializerProvider.findNullValueSerializer(null);
    }
}
```

经过上述三步，已经完成了通过注解实现数据脱敏了，下面我们来测试一下。

首先定义一个要测试的 pojo，对应的字段加入要脱敏的策略。

```java
/**
 *
 * @description:
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestPojo {

    private String userName;

    @Desensitization(type = DesensitizationTypeEnum.MOBILE_PHONE)
    private String phone;

    @Desensitization(type = DesensitizationTypeEnum.MY_RULE, startInclude = 0, endExclude = 2)
    private String address;
}
```

接下来写一个测试的 controller

```java
@RestController
public class TestController {

    @RequestMapping("/test")
    public TestPojo testDesensitization(){
        TestPojo testPojo = new TestPojo();
        testPojo.setUserName("我是用户名");
        testPojo.setAddress("地球中国-北京市通州区京东总部2号楼");
        testPojo.setPhone("13782946666");
        return testPojo;
    }

}
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/2023-08-02-16-497DdCBy8vbf2D69g.png)

可以看到我们成功实现了数据脱敏。

### Apache ShardingSphere

ShardingSphere 是一套开源的分布式数据库中间件解决方案组成的生态圈，它由 Sharding-JDBC、Sharding-Proxy 和 Sharding-Sidecar（计划中）这 3 款相互独立的产品组成。 他们均提供标准化的数据分片、分布式事务和数据库治理功能 。

Apache ShardingSphere 下面存在一个数据脱敏模块，此模块集成的常用的数据脱敏的功能。其基本原理是对用户输入的 SQL 进行解析拦截，并依靠用户的脱敏配置进行 SQL 的改写，从而实现对原文字段的加密及加密字段的解密。最终实现对用户无感的加解密存储、查询。

通过 Apache ShardingSphere 可以自动化&透明化数据脱敏过程，用户无需关注脱敏中间实现细节。并且，提供了多种内置、第三方(AKS)的脱敏策略，用户仅需简单配置即可使用。

官方文档地址：<https://shardingsphere.apache.org/document/4.1.1/cn/features/orchestration/encrypt/> 。

### FastJSON

平时开发 Web 项目的时候，除了默认的 Spring 自带的序列化工具，FastJson 也是一个很常用的 Spring Web Restful 接口序列化的工具。

FastJSON 实现数据脱敏的方式主要有两种：

- 基于注解 `@JSONField` 实现：需要自定义一个用于脱敏的序列化的类，然后在需要脱敏的字段上通过 `@JSONField` 中的 `serializeUsing` 指定为我们自定义的序列化类型即可。
- 基于序列化过滤器：需要实现 `ValueFilter` 接口，重写 `process` 方法完成自定义脱敏，然后在 JSON 转换时使用自定义的转换策略。具体实现可参考这篇文章： <https://juejin.cn/post/7067916686141161479>。

### Mybatis-Mate

先介绍一下 MyBatis、MyBatis-Plus 和 Mybatis-Mate 这三者的关系：

- MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。
- MyBatis-Plus 是一个 MyBatis 的增强工具，能够极大地简化持久层的开发工作。
- Mybatis-Mate 是为 MyBatis-Plus 提供的企业级模块，旨在更敏捷优雅处理数据。不过，使用之前需要配置授权码（付费）。

Mybatis-Mate 支持敏感词脱敏，内置手机号、邮箱、银行卡号等 9 种常用脱敏规则。

```java
@FieldSensitive("testStrategy")
private String username;

@Configuration
public class SensitiveStrategyConfig {

    /**
     * 注入脱敏策略
     */
    @Bean
    public ISensitiveStrategy sensitiveStrategy() {
        // 自定义 testStrategy 类型脱敏处理
        return new SensitiveStrategy().addStrategy("testStrategy", t -> t + "***test***");
    }
}

// 跳过脱密处理，用于编辑场景
RequestDataTransfer.skipSensitive();
```

### MyBatis-Flex

类似于 MybatisPlus，MyBatis-Flex 也是一个 MyBatis 增强框架。MyBatis-Flex 同样提供了数据脱敏功能，并且是可以免费使用的。

MyBatis-Flex 提供了 `@ColumnMask()` 注解，以及内置的 9 种脱敏规则，开箱即用：

```java
/**
 * 内置的数据脱敏方式
 */
public class Masks {
    /**
     * 手机号脱敏
     */
    public static final String MOBILE = "mobile";
    /**
     * 固定电话脱敏
     */
    public static final String FIXED_PHONE = "fixed_phone";
    /**
     * 身份证号脱敏
     */
    public static final String ID_CARD_NUMBER = "id_card_number";
    /**
     * 中文名脱敏
     */
    public static final String CHINESE_NAME = "chinese_name";
    /**
     * 地址脱敏
     */
    public static final String ADDRESS = "address";
    /**
     * 邮件脱敏
     */
    public static final String EMAIL = "email";
    /**
     * 密码脱敏
     */
    public static final String PASSWORD = "password";
    /**
     * 车牌号脱敏
     */
    public static final String CAR_LICENSE = "car_license";
    /**
     * 银行卡号脱敏
     */
    public static final String BANK_CARD_NUMBER = "bank_card_number";
    //...
}
```

使用示例：

```java
@Table("tb_account")
public class Account {

    @Id(keyType = KeyType.Auto)
    private Long id;

    @ColumnMask(Masks.CHINESE_NAME)
    private String userName;

    @ColumnMask(Masks.EMAIL)
    private String email;

}
```

如果这些内置的脱敏规则不满足你的要求的话，你还可以自定义脱敏规则。

1、通过 `MaskManager` 注册新的脱敏规则：

```java
MaskManager.registerMaskProcessor("自定义规则名称"
        , data -> {
            return data;
        })
```

2、使用自定义的脱敏规则

```java
@Table("tb_account")
public class Account {

    @Id(keyType = KeyType.Auto)
    private Long id;

    @ColumnMask("自定义规则名称")
    private String userName;
}
```

并且，对于需要跳过脱密处理的场景，例如进入编辑页面编辑用户数据，MyBatis-Flex 也提供了对应的支持：

1. **`MaskManager#execWithoutMask`**（推荐）：该方法使用了模版方法设计模式，保障跳过脱敏处理并执行相关逻辑后自动恢复脱敏处理。
2. **`MaskManager#skipMask`**：跳过脱敏处理。
3. **`MaskManager#restoreMask`**：恢复脱敏处理，确保后续的操作继续使用脱敏逻辑。

`MaskManager#execWithoutMask`方法实现如下：

```java
public static <T> T execWithoutMask(Supplier<T> supplier) {
    try {
        skipMask();
        return supplier.get();
    } finally {
        restoreMask();
    }
}
```

`MaskManager` 的`skipMask`和`restoreMask`方法一般配套使用，推荐`try{...}finally{...}`模式。

## 总结

这篇文章主要介绍了：

- 数据脱敏的定义：数据脱敏是指对某些敏感信息通过脱敏规则进行数据的变形，实现敏感隐私数据的可靠保护。
- 常用的脱敏规则：替换、删除、重排、加噪和加密。
- 常用的脱敏工具：Hutool、Apache ShardingSphere、FastJSON、Mybatis-Mate 和 MyBatis-Flex。

## 参考

- OWASP Cryptographic Storage Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html>
- PCI SSC FAQ 1492 - PAN masking：<https://www.pcisecuritystandards.org/faqs/1492/>
- Hutool 工具官网： <https://hutool.cn/docs/#/>
- 聊聊如何自定义数据脱敏：<https://juejin.cn/post/7046567603971719204>
- FastJSON 实现数据脱敏：<https://juejin.cn/post/7067916686141161479>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 安全/为什么前后端都要做数据校验？.md -->

## [12] 为什么前后端都要做数据校验？

---
title: 为什么前后端都要做数据校验？
description: 前后端数据校验必要性详解，讲解参数校验、权限校验的重要性及防止绕过前端校验的安全防护措施。
category: 系统设计
tag:
  - 安全
head:
  - - meta
    - name: keywords
      content: 数据校验,前端校验,后端校验,参数校验,权限校验,输入验证,安全防护,防注入
---

> 相关面试题：
>
> - 前端做了校验，后端还还需要做校验吗？
> - 前端已经做了数据校验，为什么后端还需要再做一遍同样（甚至更严格）的校验呢？
> - 前端/后端需要对哪些内容进行校验？

咱们平时做 Web 开发，不管是写前端页面还是后端接口，都离不开跟数据打交道。那怎么保证这些传来传去的数据是靠谱的、安全的呢？这就得靠**数据校验**了。而且，这活儿，前端得干，后端**更得干**，还得加上**权限校验**这道重要的“锁”，缺一不可！

为啥这么说？你想啊，前端校验主要是为了用户体验和挡掉一些明显的“瞎填”数据，但懂点技术的人绕过前端校验简直不要太轻松（比如直接用 Postman 之类的工具发请求）。所以，**后端校验才是咱们系统安全和数据准确性的最后一道，也是最硬核的防线**。它得确保进到系统里的数据不仅格式对，还得符合业务规矩，最重要的是，执行这个操作的人得有**权限**！

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/user-input-validation.png)

## 前端校验

前端校验就像个贴心的门卫，主要目的是在用户填数据的时候，就赶紧告诉他哪儿不对，让他改，省得提交了半天，结果后端说不行，还得重来。这样做的好处显而易见：

1. **用户体验好：** 输入时就有提示，错了马上知道，改起来方便，用户感觉流畅不闹心。
2. **减轻后端压力：** 把一些明显格式错误、必填项没填的数据在前端就拦下来，减少了发往后端的无效请求，省了服务器资源和网络流量。需要注意的是，后端同样还是要校验，只是加上前端校验可以减少很多无效请求。

那前端一般都得校验点啥呢？

- **必填项校验:** 最基本的，该填的地儿可不能空着。
- **格式校验:** 比如邮箱得像个邮箱样儿（如 `xxx@xx.com`），手机号得是 11 位数字等。正则表达式这时候就派上用场了。
- **重复输入校验：** 确保两次输入的内容一致，例如注册时的“确认密码”字段。
- **范围/长度校验:** 年龄不能是负数吧？密码长度得在 6 到 20 位之间吧？这种都得看着。
- **合法性/业务校验:** 比如用户名是不是已经被注册了？选的商品还有没有库存？这得根据具体业务来，需要配合后端来做。
- **文件上传校验：**限制文件类型（如仅支持 `.jpg`、`.png` 格式）和文件大小。
- **安全性校验:** 防范像 XSS（跨站脚本攻击）这种坏心思，对用户输入的东西做点处理，别让人家写的脚本在咱们页面上跑起来。
- ...等等，根据业务需求来。

总之，前端校验的核心是 **引导用户正确输入** 和 **提升交互体验**。

## 后端校验

前端校验只是第一道防线，虽然提升了用户体验，但毕竟可以被绕过，真正起决定性作用的是后端校验。后端需要对所有前端传来的数据都抱着“可能有问题”的态度，进行全面审查。后端校验不仅要覆盖前端的基本检查（如格式、范围、长度等），还需要更严格、更深入的验证，确保系统的安全性和数据的一致性。以下是后端校验的重点内容：

1. **完整性校验:** 接口文档中明确要求的字段必须存在，例如 `userId` 和 `orderId`。如果缺失任何必需字段，后端应立即返回错误，拒绝处理请求。
2. **合法性/存在性校验:** 验证传入的数据是否真实有效。例如，传过来的 `productId` 是否存在于数据库中？`couponId` 是否已经过期或被使用？这通常需要通过查库或调用其他服务来确认。
3. **一致性校验:** 针对涉及多个数据对象的操作，验证它们是否符合业务逻辑。例如，更新订单状态前，需要确保订单的当前状态允许修改，不能直接从“未支付”跳到“已完成”。一致性校验是保证数据流转正确性的关键。
4. **安全性校验:** 后端必须防范各种恶意攻击，包括但不限于 XSS、SQL 注入等。所有外部输入都应进行严格的过滤和验证，例如使用参数化查询防止 SQL 注入，或对返回的 HTML 数据进行转义，避免跨站脚本攻击。
5. ...基本上，前端能做的校验，后端为了安全都得再来一遍。

在 Java 后端，每次都手写 if-else 来做这些基础校验太累了。好在 Java 社区给我们提供了 **Bean Validation** 这套标准规范。它允许我们用**注解**的方式，直接在 JavaBean（比如我们的 DTO 对象）的属性上声明校验规则，非常方便。

- **JSR 303 (1.0):** 打下了基础，引入了 `@NotNull`, `@Size`, `@Min`, `@Max` 这些老朋友。
- **JSR 349 (1.1):** 增加了对方法参数和返回值的校验，还有分组校验等增强。
- **JSR 380 (2.0):** 拥抱 Java 8，支持了新的日期时间 API，还加了 `@NotEmpty`, `@NotBlank`, `@Email` 等更实用的注解。

早期的 Spring Boot (大概 2.3.x 之前): spring-boot-starter-web 里自带了 `hibernate-validator`，你啥都不用加。

Spring Boot 2.3.x 及之后: 为了更灵活，校验相关的依赖被单独拎出来了。你需要手动添加 `spring-boot-starter-validation` 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Bean Validation 规范及其实现（如 Hibernate Validator）提供了丰富的注解，用于声明式地定义校验规则。以下是一些常用的注解及其说明：

- `@NotNull`: 检查被注解的元素（任意类型）不能为 `null`。
- `@NotEmpty`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）不能为 `null` 且其大小/长度不能为 0。注意：对于字符串，`@NotEmpty` 允许包含空白字符的字符串，如 `" "`。
- `@NotBlank`: 检查被注解的 `CharSequence`（如 `String`）不能为 `null`，并且去除首尾空格后的长度必须大于 0。（即，不能为空白字符串）。
- `@Null`: 检查被注解的元素必须为 `null`。
- `@AssertTrue` / `@AssertFalse`: 检查被注解的 `boolean` 或 `Boolean` 类型元素必须为 `true` / `false`。
- `@Min(value)` / `@Max(value)`: 检查被注解的数字类型（或其字符串表示）的值必须大于等于 / 小于等于指定的 `value`。适用于整数类型（`byte`、`short`、`int`、`long`、`BigInteger` 等）。
- `@DecimalMin(value)` / `@DecimalMax(value)`: 功能类似 `@Min` / `@Max`，但适用于包含小数的数字类型（`BigDecimal`、`BigInteger`、`CharSequence`、`byte`、`short`、`int`、`long`及其包装类）。 `value` 必须是数字的字符串表示。
- `@Size(min=, max=)`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）的大小/长度必须在指定的 `min` 和 `max` 范围之内（包含边界）。
- `@Digits(integer=, fraction=)`: 检查被注解的数字类型（或其字符串表示）的值，其整数部分的位数必须 ≤ `integer`，小数部分的位数必须 ≤ `fraction`。
- `@Pattern(regexp=, flags=)`: 检查被注解的 `CharSequence`（如 `String`）是否匹配指定的正则表达式 (`regexp`)。`flags` 可以指定匹配模式（如不区分大小写）。
- `@Email`: 检查被注解的 `CharSequence`（如 `String`）是否符合 Email 格式（内置了一个相对宽松的正则表达式）。
- `@Past` / `@Future`: 检查被注解的日期或时间类型（`java.util.Date`、`java.util.Calendar`、JSR 310 `java.time` 包下的类型）是否在当前时间之前 / 之后。
- `@PastOrPresent` / `@FutureOrPresent`: 类似 `@Past` / `@Future`，但允许等于当前时间。
- ……

当 Controller 方法使用 `@RequestBody` 注解来接收请求体并将其绑定到一个对象时，可以在该参数前添加 `@Valid` 注解来触发对该对象的校验。如果验证失败，它将抛出`MethodArgumentNotValidException`。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @NotNull(message = "classId 不能为空")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name 不能为空")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "sex 值不在可选范围")
    @NotNull(message = "sex 不能为空")
    private String sex;

    @Email(message = "email 格式不正确")
    @NotNull(message = "email 不能为空")
    private String email;
}


@RestController
@RequestMapping("/api")
public class PersonController {
    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

对于直接映射到方法参数的简单类型数据（如路径变量 `@PathVariable` 或请求参数 `@RequestParam`），校验方式略有不同：

1. **在 Controller 类上添加 `@Validated` 注解**：这个注解是 Spring 提供的（非 JSR 标准），它使得 Spring 能够处理方法级别的参数校验注解。**这是必需步骤。**
2. **将校验注解直接放在方法参数上**：将 `@Min`, `@Max`, `@Size`, `@Pattern` 等校验注解直接应用于对应的 `@PathVariable` 或 `@RequestParam` 参数。

一定一定不要忘记在类上加上 `@Validated` 注解了，这个参数可以告诉 Spring 去校验方法参数。

```java
@RestController
@RequestMapping("/api")
@Validated // 关键步骤 1: 必须在类上添加 @Validated
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(
            @PathVariable("id")
            @Max(value = 5, message = "ID 不能超过 5") // 关键步骤 2: 校验注解直接放在参数上
            Integer id
    ) {
        // 如果传入的 id > 5，Spring 会在进入方法体前抛出 ConstraintViolationException 异常。
        // 全局异常处理器同样需要处理此异常。
        return ResponseEntity.ok().body(id);
    }

    @GetMapping("/person")
    public ResponseEntity<String> findPersonByName(
            @RequestParam("name")
            @NotBlank(message = "姓名不能为空") // 同样适用于 @RequestParam
            @Size(max = 10, message = "姓名长度不能超过 10")
            String name
    ) {
        return ResponseEntity.ok().body("Found person: " + name);
    }
}
```

Bean Validation 主要解决的是**数据格式、语法层面**的校验。但光有这个还不够。

## 权限校验

数据格式都验过了，没问题。但是，**这个操作，当前登录的这个用户，他有权做吗？** 这就是**权限校验**要解决的问题。比如：

- 普通用户能修改别人的订单吗？（不行）
- 游客能访问管理员后台接口吗？（不行）
- 游客能管理其他用户的信息吗？（不行）
- VIP 用户能使用专属的优惠券吗？（可以）
- ……

数据校验和权限校验不是在所有接口中都严格遵循同一个先后顺序。通常应先完成请求解析、长度限制和基础格式校验，并尽早确认用户身份；在向调用方暴露资源是否存在或返回查询结果之前，必须完成粗粒度和对象级权限校验。授权依赖资源属性时，可以把授权条件直接纳入查询，或者读取后立即校验，但未经授权不能对外泄露资源信息。随后，再把业务一致性校验和更细粒度的授权放到 Service 或数据访问层中按事务语义执行。

权限校验关心的是“**谁 (Who)** 能对 **什么资源 (What)** 执行 **什么操作 (Action)**”。无论流程如何分层，都不能在未授权的情况下返回资源内容，也不能仅依赖 Controller 或前端的一次检查。

**为啥权限校验这么重要？**

- **安全基石：** 防止未经授权的访问和操作，保护用户数据和系统安全。
- **业务隔离：** 确保不同角色（管理员、普通用户、VIP 用户等）只能访问和操作其权限范围内的功能。
- **合规要求：** 很多行业法规对数据访问权限有严格要求。

目前 Java 后端主流的方式是使用成熟的安全框架来实现权限校验，而不是自己手写（容易出错且难以维护）。

1. **Spring Security (业界标准，推荐):** 基于过滤器链（Filter Chain）拦截请求，进行认证（Authentication - 你是谁？）和授权（Authorization - 你能干啥？）。Spring Security 功能强大、社区活跃、与 Spring 生态无缝集成。不过，配置相对复杂，学习曲线较陡峭。
2. **Apache Shiro:** 另一个流行的安全框架，相对 Spring Security 更轻量级，API 更直观易懂。同样提供认证、授权、会话管理、加密等功能。对于不熟悉 Spring 或觉得 Spring Security 太重的项目，是一个不错的选择。
3. **Sa-Token:** 国产的轻量级 Java 权限认证框架。支持认证授权、单点登录、踢人下线、自动续签等功能。相比于 Spring Security 和 Shiro 来说，Sa-Token 内置的开箱即用的功能更多，使用也更简单。
4. **手动检查 (不推荐用于复杂场景):** 在 Service 层或 Controller 层代码里，手动获取当前用户信息（例如从 SecurityContextHolder 或 Session 中），然后 if-else 判断用户角色或权限。权限逻辑与业务逻辑耦合、代码重复、难以维护、容易遗漏。只适用于非常简单的权限场景。

**权限模型简介:**

- **RBAC (Role-Based Access Control):** 基于角色的访问控制。给用户分配角色，给角色分配权限。用户拥有其所有角色的权限总和。这是最常见的模型。
- **ABAC (Attribute-Based Access Control):** 基于属性的访问控制。决策基于用户属性、资源属性、操作属性和环境属性。更灵活但也更复杂。

一般情况下，绝大部分系统都使用的是 RBAC 权限模型或者其简化版本。用一个图来描述如下：

![RBAC 权限模型示意图](https://oss.javaguide.cn/github/javaguide/系统设计/安全/权限系统设计详解/rbac.png)

关于权限系统设计的详细介绍，可以看这篇文章：[权限系统设计详解](https://javaguide.cn/系统设计/安全/design-of-authority-system.html)。

## 总结

总而言之，要想构建一个安全、稳定、用户体验好的 Web 应用，前后端数据校验和后端权限校验这三道关卡，都得设好，而且各有侧重：

- **前端数据校验：** 提升用户体验，减少无效请求，是第一道“友好”的防线。
- **后端数据校验：** 保证数据格式正确、符合业务规则，是防止“脏数据”入库的“技术”防线。 Bean Validation 允许我们用注解的方式，直接在 JavaBean（比如我们的 DTO 对象）的属性上声明校验规则，非常方便。
- **后端权限校验：** 确保“对的人”做“对的事”，是防止越权操作的“安全”防线。Spring Security、Shiro、Sa-Token 等框架可以帮助我们实现权限校验。

## 参考

- OWASP Authorization Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- 为什么前后端都需要进行数据校验？: <https://juejin.cn/post/7306045519099658240>
- 权限系统设计详解：<https://javaguide.cn/系统设计/安全/design-of-authority-system.html>


---

---

<!-- source: 安全/为什么忘记密码时只能重置，不能告诉你原密码？.md -->

## [13] 为什么忘记密码时只能重置，不能告诉你原密码？

---
title: 为什么忘记密码时只能重置，不能告诉你原密码？
description: 详细解答为什么忘记密码时网站只能让你重置密码，而不能告诉你原密码。核心原因是服务端使用哈希算法存储密码，哈希算法不可逆，无法从哈希值还原出原始密码。本文还介绍了密码存储安全、加盐机制、Bcrypt 加密、密码传输安全等知识。
category:
  - 系统设计
tag:
  - 数据安全
  - 密码安全
  - 哈希算法
  - 面试题
head:
  - - meta
    - name: keywords
      content: 密码重置,密码找回,哈希算法,密码存储,Bcrypt,加盐,密码安全,面试题
---

这是一个挺有意思的问题，很多公司也在面试中问过。挺简单的，不知道大家平时在重置密码的时候有没有想过这个问题。

![重置帐号密码](https://oss.javaguide.cn/github/javaguide/系统设计/安全/reset-password-page.png)

回答这个问题其实就一句话：**因为服务端也不知道你的原密码是什么**。存原密码的程序员已经被开了 🤣。

如果服务端知道你的原密码，那就是严重的安全风险问题了。

我们这里来简单分析一下。

这篇文章不会谈论太多加密算法相关的内容，感兴趣的朋友可以看这篇文章：[常见加密算法总结](https://javaguide.cn/系统设计/安全/encryption-algorithms.html)。

![](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/javaguide-security-encryption-algorithms.png)

## 为什么服务端不知道你的原密码？

做过开发的应该都知道，服务端在保存密码到数据库的时候，**绝对不能直接明文存储**。

如果明文存储的话，风险太大：

1. 数据库数据有被盗的风险
2. 有数据库权限的内部人员可能恶意利用
3. 黑客入侵后可以直接获取所有用户密码

因此，密码必须经过处理后才能存储。这个处理方式就是使用**哈希算法**。

## 哈希算法简介

哈希算法也叫散列函数或摘要算法，它的作用是对任意长度的数据生成一个固定长度的唯一标识，也叫哈希值、散列值或消息摘要（后文统称为哈希值）。

![哈希算法效果演示](https://oss.javaguide.cn/github/javaguide/系统设计/安全/常见加密算法总结/hash-function-effect-demonstration.png)

哈希算法有两个关键特点：

1. **不可逆性**：你无法通过哈希之后的值再得到原值。这是核心！
2. **确定性**：相同的输入永远产生相同的输出。

有个很形象的比喻：**你存的密码就像切过的土豆丝，不能被复原成土豆。但网站判断密码是否正确的方式，就是把你输入的新密码当成土豆再切一次，看看这两盘土豆丝是不是一样的。**

这两个特点决定了哈希算法非常适合用于密码存储：服务端只存储密码的哈希值，验证时只需比较哈希值是否一致。

### 哈希算法的分类

哈希算法可以简单分为两类：

1. **加密哈希算法**：安全性较高的哈希算法，它可以提供一定的数据完整性保护和数据防篡改能力，能够抵御一定的攻击手段，安全性相对较高，但性能较差，适用于对安全性要求较高的场景。例如 SHA2、SHA3、SM3、RIPEMD-160、BLAKE2等等。
2. **非加密哈希算法**：安全性相对较低的哈希算法，易受到暴力破解、冲突攻击等攻击手段的影响，但性能较高，适用于对安全性没有要求的业务场景。例如 CRC32、MurMurHash3等等。

除了这两种之外，还有一些特殊的哈希算法，例如安全性更高的**慢哈希算法**。

### 为什么不推荐 MD5？

早期常用 MD5 来加密密码，但现在已经**不被推荐**，原因如下：

1. **抗碰撞性差**：存在弱碰撞问题，即多个不同的输入可能产生相同的 MD5 值。
2. **哈希值较短**：128 位的哈希值容易被彩虹表攻击。
3. **计算速度太快**：反而容易被暴力破解。

详细介绍可以阅读这篇文章：[简历别再写 MD5 加密密码了！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247542780&idx=1&sn=fb2fe3fb53fe596cc5b22e30766e0098&scene=21#wechat_redirect)

### 为什么需要加盐？

单纯使用哈希算法存储密码，仍然存在被**彩虹表攻击**的风险。彩虹表是一种预先计算好的哈希值对照表，攻击者可以通过查表的方式快速破解密码。

盐（Salt）是为每个密码独立生成的随机值，密码哈希算法会把盐和密码一起参与计算。盐不需要保密，但必须随机且不能在所有用户之间复用。

**加盐的作用**：

1. 增加密码的复杂度和唯一性。
2. 使得彩虹表攻击失效（每个用户的盐都不同）。
3. 即使两个用户使用相同密码，哈希值也不同。

## 密码存储方案推荐

密码应使用专门为密码存储设计、可调节计算成本的算法，而不是直接使用 MD5、SHA-256、SHA-3 这类高速哈希算法。即使给高速哈希加盐，攻击者拿到数据库后仍然可以高速尝试大量候选密码。

新系统优先考虑 **Argon2id**。如果不可用，可以根据运行环境选择 scrypt；兼容遗留系统时可以使用合理配置的 Bcrypt；有 FIPS 合规要求时可以使用 PBKDF2。具体参数需要结合服务器性能定期评估和升级。

### Bcrypt 示例

**Bcrypt** 是专门为密码存储设计的哈希算法，属于慢哈希算法。它内置了 salt 机制和 cost（成本）参数：

- **salt**：随机生成的字符串，用于和密码混合，增加密码的唯一性
- **cost**：控制迭代次数，增加计算时间和资源消耗

Bcrypt 的随机盐可以防止预计算和彩虹表攻击，cost 参数可以提高离线猜测成本，但无法让弱密码变得不可破解。还要注意，多数 Bcrypt 实现只处理密码的前 72 个字节，系统不能在没有提示的情况下静默截断密码。

Spring Security 提供了 `BCryptPasswordEncoder`。下面以它演示如何显式设置 cost；新系统选型仍应优先评估 Argon2id：

```java
@Bean
public PasswordEncoder passwordEncoder(){
    // cost 应通过性能测试确定，并随着硬件能力提升定期调整。
    return new BCryptPasswordEncoder(12);
}
```

## 登录验证流程

当你输入密码登录时，验证流程如下：

1. 服务端根据用户名从数据库取出该用户保存的密码哈希编码。这个编码通常已经包含算法标识、参数和随机盐。
2. 服务端调用密码哈希库提供的验证方法，例如 Spring Security 的 `PasswordEncoder#matches`。不要自己拼接盐值，也不要直接比较字符串。
3. 密码库读取编码中的盐值和参数，对用户输入进行同样的计算，并以安全方式比较结果。
4. 如果验证通过，说明密码正确；否则密码错误。验证成功后还可以在参数过旧时重新计算并升级密码哈希。

## 重置密码时如何判断新密码与旧密码相同？

细心的同学可能发现，有些网站在重置密码时会提示"新密码不可与旧密码相同"。那网站是怎么知道新密码和旧密码相同的呢？

其实原理和验证密码正确性一样：

1. 用户输入新密码。
2. 服务端调用密码哈希库的验证方法，用新密码验证数据库中的旧密码哈希，例如 `passwordEncoder.matches(newPassword, oldPasswordHash)`。
3. 如果验证通过，说明新密码和旧密码一样，拒绝修改。
4. 如果不相同，则为新密码重新生成随机盐和密码哈希，不能复用旧哈希或自行固定盐值。

所以网站并不知道你的旧密码是什么，只是比较了两盘"土豆丝"是否一样。

## 密码传输安全

前面讲的都是密码在服务端的存储安全，那密码在传输过程中安全吗？

有个常见的面试问题：**如果某个员工知道加密方式，那岂不是他可以在私下或者离职后拦截包然后模拟加密从而获取密码？**

答案是：**存储与传输本身就是分开处理的**。

完整的密码安全方案需要同时保障存储安全和传输安全。

### 使用 HTTPS

HTTPS 协议是保障传输安全的基础。HTTP 协议运行在 TCP 之上，所有传输的内容都是明文，客户端和服务器端都无法验证对方的身份。HTTPS 则是运行在 SSL/TLS 之上的 HTTP 协议，所有传输的内容都经过加密。

关于 HTTP 和 HTTPS 的详细对比可以看这篇文章：[HTTP vs HTTPS（应用层）](https://javaguide.cn/计算机基础/计算机网络/http-vs-https.html)。

对于普通 Web 应用，正确配置的 HTTPS 是密码传输安全的基础方案。服务端应默认使用 TLS 1.3，并按兼容性需要支持 TLS 1.2；全站强制 HTTPS，启用 HSTS，正确校验证书并禁用过时协议和弱密码套件。

浏览器再使用一层自定义 RSA 加密，通常不能解决恶意客户端、被攻陷的前端脚本或服务端解密点泄露密码的问题，反而会增加密钥分发、填充选择和密文重放等风险。因此，不要把“客户端 RSA + HTTPS”当作所有系统都必须采用的通用方案。

某些具有明确合规要求或特殊威胁模型的系统可能会在 TLS 之上增加应用层保护，但应使用经过评审的成熟协议，并同时包含随机挑战、时效校验和防重放机制，不能只做一次简单的公钥加密。

除了传输加密，还应限制登录尝试、避免记录密码、使用多因素认证，并防范凭据填充和撞库攻击。

## 忘记密码流程还要注意什么？

本文重点解释为什么服务端不能找回原密码。实际实现忘记密码功能时，还需要注意下面这些安全要求：

- 无论账号是否存在，都返回一致的提示，并尽量保持接近的响应时间，避免用户枚举。
- 重置令牌使用密码学安全随机数生成，具备足够熵，只能使用一次，并在较短时间后过期。
- 对重置请求和令牌校验进行限流；重置链接只使用可信域名和 HTTPS，避免令牌通过 Referer 泄露。
- 密码修改成功后发送安全通知，并根据风险使已有会话失效，或至少让用户能够一键注销其他会话。

## 总结

回到最初的问题：为什么忘记密码时只能重置，不能告诉你原密码？

因为服务端存储的是密码经过哈希算法处理后的值，**哈希算法是不可逆的**，无法从哈希值还原出原始密码。这是密码安全的基本原则。

如果一个网站能够直接告诉你原密码，说明服务端以**明文或可逆形式**保存了可恢复的密码，而不是只保存专用密码哈希。这是严重的安全隐患，建议立即修改密码，并检查其他网站是否复用了同一密码。

**更重要的是**：如果你在所有网站都用了相同的密码，一个不靠谱的网站泄漏了你的密码，就相当于你所有的账户都面临风险。所以，**不要在所有网站使用相同密码**！

## 参考

- OWASP Password Storage Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- OWASP Forgot Password Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html>
- OWASP Transport Layer Security Cheat Sheet：<https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html>


---

---

<!-- source: 基础/RestFul API 简明教程.md -->

## [14] RestFul API 简明教程

---
title: RestFul API 简明教程
description: RESTful API设计规范详解，涵盖REST架构原则、资源路径设计、HTTP方法使用及状态码规范等内容。
category: 代码质量
head:
  - - meta
    - name: keywords
      content: RESTful API,REST,API设计,资源路径,HTTP方法,状态码,幂等性,接口规范
---

这篇文章简单聊聊后端程序员必备的 RESTful API 相关的知识。

开始正式介绍 RESTful API 之前，我们需要首先搞清：**API 到底是什么？**

## 何为 API？

**API（Application Programming Interface）** 翻译过来是应用程序编程接口的意思。

我们在进行后端开发的时候，主要的工作就是为前端或者其他后端服务提供 API 比如查询用户数据的 API 。

![](https://oss.javaguide.cn/github/javaguide/系统设计/基础/20210507130629538.png)

但是， API 不仅仅代表后端系统暴露的接口，像框架中提供的方法也属于 API 的范畴。

为了方便大家理解，我再列举几个例子 🌰：

1. 你通过某电商网站搜索某某商品，电商网站的前端就调用了后端提供了搜索商品相关的 API。
2. 你使用 JDK 开发 Java 程序，想要读取用户的输入的话，你就需要使用 JDK 提供的 IO 相关的 API。
3. ……

你可以把 API 理解为程序与程序之间通信的桥梁，其本质就是一个函数而已。另外，API 的使用也不是没有章法的，它的规则由（比如数据输入和输出的格式）API 提供方制定。

## 何为 RESTful API？

**RESTful API** 经常也被叫做 **REST API**，它是基于 REST 构建的 API。这个 REST 到底是什么，我们后文在讲，涉及到的概念比较多。

如果你看 RESTful API 相关的文章的话一般都比较晦涩难懂，主要是因为 REST 涉及到的一些概念比较难以理解。但是，实际上，我们平时开发用到的 RESTful API 的知识非常简单也很容易概括！

举个例子，如果我给你下面两个 API 你是不是立马能知道它们是干什么用的！这就是 RESTful API 的强大之处！

```plain
GET    /classes：列出所有班级
POST   /classes：新建一个班级
```

**RESTful API 可以让你看到 URL+Http Method 就知道这个 URL 是干什么的，让你看到了 HTTP 状态码（status code）就知道请求结果如何。**

像咱们在开发过程中设计 API 的时候也应该至少要满足 RESTful API 的最基本的要求（比如接口中尽量使用名词，使用 `POST` 请求创建资源，`DELETE` 请求删除资源等等，示例：`GET /notes/{id}`：获取某个指定 id 的笔记的信息）。

## 解读 REST

**REST** 是 `REpresentational State Transfer` 的缩写。这个词组的翻译过来就是“**表现层状态转化**”。

这样理解起来甚是晦涩，直白地说，REST 描述的是客户端通过资源的“表现形式”，从一个应用状态转移到另一个应用状态。如果还是不能继续理解，请继续往下看，相信下面的讲解一定能让你理解到底啥是 REST 。

我们分别对上面涉及到的概念进行解读，以便加深理解，实际上你不需要搞懂下面这些概念，也能看懂我下一部分要介绍到的内容。不过，为了更好地能跟别人扯扯 “RESTful API”我建议你还是要好好理解一下！

- **资源（Resource）**：我们可以把真实的对象数据称为资源。一个资源既可以是一个集合，也可以是单个个体。比如我们的班级 classes 是代表一个集合形式的资源，而特定的 class 代表单个个体资源。每一种资源都有特定的 URI（统一资源标识符）与之对应，如果我们需要获取这个资源，访问这个 URI 就可以了，比如获取特定的班级：`/classes/12`。另外，资源也可以包含子资源，比如 `/classes/{classId}/teachers`：列出某个指定班级的所有老师的信息
- **表现形式（Representational）**："资源"是一种信息实体，它可以有多种外在表现形式。我们把"资源"具体呈现出来的形式比如 `json`，`xml`，`image`,`txt` 等等叫做它的"表现层/表现形式"。
- **状态转移（State Transfer）**：大家第一眼看到这个词语一定会很懵逼？内心 BB：这尼玛是啥啊？ 大白话来说，客户端通过资源的表现形式以及其中的链接等控制信息，从一个应用状态转移到另一个应用状态。通过 HTTP 方法进行增删改查，也可能引起服务器端资源状态的改变。ps:HTTP 是一个无状态协议，服务器不需要在两次请求之间保存客户端的会话状态。

综合上面的解释，我们总结一下什么是 RESTful 架构：

1. 每一个 URI 代表一种资源；
2. 客户端和服务器之间，传递这种资源的某种表现形式比如 `json`，`xml`，`image`,`txt` 等等；
3. 客户端通过特定的 HTTP 动词，对服务器端资源进行操作，实现"表现层状态转化"。

## RESTful API 规范

![](https://oss.javaguide.cn/github/javaguide/系统设计/基础/20210507154007779.png)

### 动作

- `GET`：请求从服务器获取特定资源。举个例子：`GET /classes`（获取所有班级）
- `POST`：让目标资源按照自身语义处理请求内容，常用于创建资源。举个例子：`POST /classes`（创建班级）
- `PUT`：创建或替换目标资源的当前状态（客户端通常提供更新后的完整资源）。举个例子：`PUT /classes/12`（更新编号为 12 的班级）
- `DELETE`：移除目标 URI 与当前资源功能之间的关联。举个例子：`DELETE /classes/12`（删除编号为 12 的班级）
- `PATCH`：更新服务器上的资源（客户端提供更改的属性，可以看作是部分更新），使用的比较少，这里就不举例子了。

其中，`GET` 是安全且幂等的，`PUT` 和 `DELETE` 是幂等的，`PATCH` 默认不保证幂等。

### 路径（接口命名）

路径又称"终点"（endpoint），表示 API 的具体网址。实际开发中常见的规范如下：

1. **资源型 HTTP API 的网址通常使用名词，名词常用复数形式。** 这是一种常见的 URI 命名约定，并非 REST 强制约束。如果 API 调用不便抽象为资源（如计算、翻译等操作）的话，也可以用动词。比如：`GET /calculate?param1=11&param2=33` 。
2. **不用大写字母，建议用中杠 - 不用下杠 \_** 。比如邀请码写成 `invitation-code`而不是 ~~invitation_code~~ 。
3. **善用版本化 API**。当我们的 API 发生了重大改变而不兼容前期版本的时候，我们可以通过 URL 来实现版本化，比如 `http://api.example.com/v1`、`http://apiv1.example.com` 。版本不必非要是数字，只是数字用的最多，日期、季节都可以作为版本标识符，项目团队达成共识就可。
4. **接口尽量使用名词，避免使用动词。** RESTful API 操作（HTTP Method）的是资源（名词）而不是动作（动词）。

Talk is cheap！来举个实际的例子来说明一下吧！现在有这样一个 API 提供班级（class）的信息，还包括班级中的学生和教师的信息，则它的路径应该设计成下面这样。

```plain
GET    /classes：列出所有班级
POST   /classes：新建一个班级
GET    /classes/{classId}：获取某个指定班级的信息
PUT    /classes/{classId}：更新某个指定班级的信息（一般倾向整体更新）
PATCH  /classes/{classId}：更新某个指定班级的信息（一般倾向部分更新）
DELETE /classes/{classId}：删除某个班级
GET    /classes/{classId}/teachers：列出某个指定班级的所有老师的信息
GET    /classes/{classId}/students：列出某个指定班级的所有学生的信息
DELETE /classes/{classId}/teachers/{ID}：删除某个指定班级下的指定的老师的信息
```

反例：

```plain
/getAllclasses
/createNewclass
/deleteAllActiveclasses
```

理清资源的层次结构，比如业务针对的范围是学校，那么学校会是一级资源:`/schools`，老师: `/schools/{schoolId}/teachers`，学生: `/schools/{schoolId}/students` 就是二级资源。

### 过滤信息（Filtering）

如果我们在查询的时候需要添加特定条件的话，建议使用 url 参数的形式。比如我们要查询 state 状态为 active 并且 name 为 guidegege 的班级：

```plain
GET    /classes?state=active&name=guidegege
```

比如我们要实现分页查询：

```plain
GET    /classes?page=1&size=10 //指定第1页，每页10个数据
```

### 状态码（Status Codes）

**状态码范围：**

| 2xx：成功 | 3xx：重定向    | 4xx：客户端错误  | 5xx：服务器错误 |
| --------- | -------------- | ---------------- | --------------- |
| 200 成功  | 301 永久重定向 | 400 错误请求     | 500 服务器错误  |
| 201 创建  | 304 资源未修改 | 401 未授权       | 502 网关错误    |
|           |                | 403 禁止访问     | 504 网关超时    |
|           |                | 404 未找到       |                 |
|           |                | 405 请求方法不对 |                 |

## REST 中的 HATEOAS

> **在 Fielding 对 REST 的原始定义中，HATEOAS 是统一接口约束的一部分。不过，工程中很多被称为 REST API 的 HTTP/JSON API 并没有实现它。**

上面是 RESTful API 最基本的东西，也是我们平时开发过程中最容易实践到的。HATEOAS 要求通过 Hypermedia 驱动应用状态，即返回结果中提供链接等控制信息，使得用户不查文档，也知道下一步应该做什么。

比如，当用户向 `api.example.com` 的根目录发出请求，会得到这样一个返回结果

```javascript
{"link": {
  "rel":   "collection",
  "href":  "https://api.example.com/classes",
  "title": "List of classes",
  "type":  "application/vnd.yourformat+json"
}}
```

上面代码表示，文档中有一个 `link` 属性，用户读取这个属性就知道下一步该调用什么 API 了。`rel` 表示目标资源与当前上下文的关系，`href` 表示目标资源的路径，`title` 表示链接的标题，`type` 是目标资源表现形式的媒体类型提示。这样的 `Hypermedia API` 设计被称为[HATEOAS](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)。

在 Spring 中有一个叫做 HATEOAS 的 API 库，通过它我们可以更轻松的创建出符合 HATEOAS 设计的 API。相关文章：

- [在 Spring Boot 中使用 HATEOAS](https://blog.aisensiy.me/2017/06/04/spring-boot-and-hateoas/)
- [Building REST services with Spring](https://spring.io/guides/tutorials/rest/) (Spring 官网 )
- [An Intro to Spring HATEOAS](https://www.baeldung.com/spring-hateoas-tutorial)
- [spring-hateoas-examples](https://github.com/spring-projects/spring-hateoas-examples/tree/master/hypermedia)
- [Spring HATEOAS](https://spring.io/projects/spring-hateoas#learn) (Spring 官网 )

## 参考

- [Fielding 论文：Representational State Transfer](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)

- [RFC 9110：HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

- [RFC 5789：PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789.html)

- [RFC 8288：Web Linking](https://www.rfc-editor.org/rfc/rfc8288.html)

- <https://RESTfulapi.net/>

- <https://www.ruanyifeng.com/blog/2014/05/restful_api.html>

- <https://juejin.im/entry/59e460c951882542f578f2f0>

- <https://phauer.com/2016/testing-RESTful-services-java-best-practices/>

- <https://www.seobility.net/en/wiki/REST_API>

- <https://dev.to/duomly/rest-api-vs-graphql-comparison-3j6g>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 基础/代码命名指南.md -->

## [15] 代码命名指南

---
title: 代码命名指南
description: 代码命名规范指南，涵盖变量、方法、类的命名原则与技巧，提升代码可读性和可维护性。
category: 代码质量
head:
  - - meta
    - name: keywords
      content: 代码命名,命名规范,变量命名,函数命名,类命名,可读性,代码质量,Code Review
---

我还记得我刚工作那一段时间， 项目 Code Review 的时候，我经常因为变量命名不规范而被 “diss”!

究其原因还是自己那会经验不足，而且，大学那会写项目的时候不太注意这些问题，想着只要把功能实现出来就行了。

但是，工作中就不一样，为了代码的可读性、可维护性，项目组对于代码质量的要求还是很高的！

前段时间，项目组新来的一个实习生也经常在 Code Review 因为变量命名不规范而被 “diss”，这让我想到自己刚到公司写代码那会的日子。

于是，我就简单写了这篇关于变量命名规范的文章，希望能对同样有此困扰的小伙伴提供一些帮助。

确实，编程过程中，有太多太多让我们头疼的事情了，比如命名、维护其他人的代码、写测试、与其他人沟通交流等等。

据说之前在 Quora 网站，由接近 5000 名程序员票选出来的最难的事情就是“命名”。

大名鼎鼎的《重构》的作者老马（Martin Fowler）曾经在[TwoHardThings](https://martinfowler.com/bliki/TwoHardThings.html)这篇文章中提到过 CS 领域有两大最难的事情：一是 **缓存失效** ，一是 **程序命名** 。

![](https://oss.javaguide.cn/java-guide-blog/marting-naming.png)

这个句话实际上也是老马引用别人的，类似的表达还有很多。比如分布式系统领域有两大最难的事情：一是 **保证消息顺序** ，一是 **严格一次传递** 。

![](https://oss.javaguide.cn/java-guide-blog/20210629104844645.png)

今天咱们就单独拎出 “**命名**” 来聊聊！

这篇文章配合我之前发的 [《编码 5 分钟，命名 2 小时？史上最全的 Java 命名规范参考！》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486449&idx=1&sn=c3b502529ff991c7180281bcc22877af&chksm=cea2443af9d5cd2c1c87049ed15ccf6f88275419c7dbe542406166a703b27d0f3ecf2af901f8&token=999884676&lang=zh_CN#rd) 这篇文章阅读效果更佳哦！

## 为什么需要重视命名？

咱们需要先搞懂为什么要重视编程中的命名这一行为，它对于我们的编码工作有着什么意义。

**为什么命名很重要呢？** 这是因为 **好的命名即是注释，别人一看到你的命名就知道你的变量、方法或者类是做什么的！**

简单来说就是 **别人根据你的命名就能知道你的代码要表达的意思** （不过，前提这个人也要有基本的英语知识，对于一些编程中常见的单词比较熟悉）。

简单举个例子说明一下命名的重要性。

《Clean Code》这本书明确指出：

> **好的代码本身就是注释，我们要尽量规范和美化自己的代码来减少不必要的注释。**
>
> **若编程语言足够有表达力，就不需要注释，尽量通过代码来阐述。**
>
> 举个例子：
>
> 去掉下面复杂的注释，只需要创建一个与注释所言同一事物的函数即可
>
> ```java
> // check to see if the employee is eligible for full benefits
> if ((employee.flags & HOURLY_FLAG) && (employee.age > 65))
> ```
>
> 应替换为
>
> ```java
> if (employee.isEligibleForFullBenefits())
> ```

## 常见命名规则以及适用场景

这里只介绍 3 种最常见的命名规范。

### 驼峰命名法（CamelCase）

驼峰命名法应该我们最常见的一个，这种命名方式使用大小写混合的格式来区别各个单词，并且单词之间不使用空格隔开或者连接字符连接的命名方式

#### 大驼峰命名法（UpperCamelCase）

**类名需要使用大驼峰命名法（UpperCamelCase）**

正例：

```java
ServiceDiscovery、ServiceInstance、LruCacheFactory
```

反例：

```java
serviceDiscovery、Serviceinstance、LRUCacheFactory
```

#### 小驼峰命名法（lowerCamelCase）

**方法名、参数名、成员变量、局部变量需要使用小驼峰命名法（lowerCamelCase）。**

正例：

```java
getUserInfo()
createCustomThreadPool()
setNameFormat(String nameFormat)
UserService userService;
```

反例：

```java
GetUserInfo()、CreateCustomThreadPool()、setNameFormat(String NameFormat)
UserService user_service;
```

### 蛇形命名法（snake_case）

**测试方法名可以按团队约定使用蛇形命名法（snake_case），常量和枚举常量通常使用大写蛇形命名法。**

在蛇形命名法中，各个单词之间通过下划线“\_”连接，比如`should_get_200_status_code_when_request_is_valid`、`CLIENT_CONNECT_SERVER_FAILURE`。

蛇形命名法的优势是命名所需要的单词比较多的时候，比如我把上面的命名通过小驼峰命名法给大家看一下：“shouldGet200StatusCodeWhenRequestIsValid”。

感觉如何？ 相比于使用蛇形命名法（snake_case）来说是不是不那么易读？

正例：

```java
@Test
void should_get_200_status_code_when_request_is_valid() {
  ......
}
```

另一种常见写法：

```java
@Test
void shouldGet200StatusCodeWhenRequestIsValid() {
  ......
}
```

### 串式命名法（kebab-case）

在串式命名法中，各个单词之间通过连接符“-”连接，比如`dubbo-registry`。

建议项目文件夹名称使用串式命名法（kebab-case），比如 dubbo 项目的各个模块的命名是下面这样的。

![](https://oss.javaguide.cn/java-guide-blog/dubbo-naming.png)

## 常见命名规范

### Java 语言基本命名规范

**1、类名需要使用大驼峰命名法（UpperCamelCase）风格。方法名、参数名、成员变量、局部变量需要使用小驼峰命名法（lowerCamelCase）。**

**2、测试方法没有唯一正确的命名方式，可以根据团队约定使用蛇形命名法（snake_case）**，比如`should_get_200_status_code_when_request_is_valid`。常量和枚举常量通常使用大写蛇形命名法，比如`CLIENT_CONNECT_SERVER_FAILURE`；枚举类型仍然使用大驼峰命名法。

**3、项目文件夹名称使用串式命名法（kebab-case），比如`dubbo-registry`。**

**4、包名统一使用小写，尽量使用单个名词作为包名，各个单词通过 "." 分隔符连接，并且各个单词必须为单数。**

正例：`org.apache.dubbo.common.threadlocal`

反例：~~`org.apache_dubbo.Common.threadLocals`~~

**5、抽象类命名使用 Abstract 开头**。

```java
//为远程传输部分抽象出来的一个抽象类（出处：Dubbo源码）
public abstract class AbstractClient extends AbstractEndpoint implements Client {

}
```

**6、异常类命名使用 Exception 结尾。**

```java
//自定义的 NoSuchMethodException（出处：Dubbo源码）
public class NoSuchMethodException extends RuntimeException {
    private static final long serialVersionUID = -2725364246023268766L;

    public NoSuchMethodException() {
        super();
    }

    public NoSuchMethodException(String msg) {
        super(msg);
    }
}
```

**7、测试类命名以它要测试的类的名称开始，以 Test 结尾。**

```java
//为 AnnotationUtils 类写的测试类（出处：Dubbo源码）
public class AnnotationUtilsTest {
  ......
}
```

POJO 类中布尔类型字段是否使用 `is` 前缀，需要结合访问器生成规则和序列化框架判断。通常可以将基本类型字段命名为 `active` 并提供 `isActive()`，将包装类型 `Boolean` 字段命名为 `active` 并提供 `getActive()`；如果框架推断结果不符合预期，可以通过显式访问器或序列化注解固定属性名。

如果模块、接口、类、方法使用了设计模式，在命名时需体现出具体模式。

### 命名易读性规范

**1、为了能让命名更加易懂和易读，尽量不要缩写/简写单词，除非这些单词已经被公认可以被这样缩写/简写。比如 `CustomThreadFactory` 不可以被写成 ~~`CustomTF` 。**

**2、命名不像函数一样要尽量追求短，可读性强的名字优先于简短的名字，虽然可读性强的名字会比较长一点。** 这个对应我们上面说的第 1 点。

**3、避免无意义的命名，你起的每一个名字都要能表明意思。**

正例：`UserService userService;` `int userCount`;

反例: ~~`UserService service`~~ ~~`int count`~~

**4、避免命名过长（50 个字符以内最好），过长的命名难以阅读并且丑陋。**

**5、不要使用拼音，更不要使用中文。** 不过像 alibaba、wuhan、taobao 这种国际通用名词可以当做英文来看待。

正例：discount

反例：~~dazhe~~

## Codelf:变量命名神器?

这是一个由国人开发的网站，网上有很多人称其为变量命名神器， 我在实际使用了几天之后感觉没那么好用。小伙伴们可以自行体验一下，然后再给出自己的判断。

Codelf 提供了在线网站版本，网址：[https://unbug.github.io/codelf/](https://unbug.github.io/codelf/)，具体使用情况如下：

我选择了 Java 编程语言，然后搜索了“序列化”这个关键词，然后它就返回了很多关于序列化的命名。

![](./pictures/Codelf.png)

并且，Codelf 还提供了 VS code 插件，看这个评价，看来大家还是很喜欢这款命名工具的。

![](./pictures/vscode-codelf.png)

## 相关阅读推荐

1. 《阿里巴巴 Java 开发手册》
2. 《Clean Code》
3. Google Java 代码指南：<https://google.github.io/styleguide/javaguide.html>
4. 告别编码 5 分钟，命名 2 小时！史上最全的 Java 命名规范参考：<https://www.cnblogs.com/liqiangchn/p/12000361.html>

## 总结

作为一个合格的程序员，小伙伴们应该都知道代码表义的重要性。想要写出高质量代码，好的命名就是第一步！

好的命名对于其他人（包括你自己）理解你的代码有着很大的帮助！你的代码越容易被理解，可维护性就越强，侧面也就说明你的代码设计的也就越好！

在日常编码过程中，我们需要谨记常见命名规范比如类名需要使用大驼峰命名法、不要使用拼音，更不要使用中文……。

另外，国人开发的一个叫做 Codelf 的网站被很多人称为“变量命名神器”，当你为命名而头疼的时候，你可以去参考一下上面提供的一些命名示例。

最后，祝愿大家都不用再为命名而困扰!

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 基础/代码重构指南.md -->

## [16] 代码重构指南

---
title: 代码重构指南
description: 代码重构实践指南，涵盖重构定义、重构原则、代码坏味道识别及常用重构技巧与最佳实践。
category: 代码质量
head:
  - - meta
    - name: keywords
      content: 代码重构,重构技巧,重构原则,设计模式,SOLID,代码坏味道,可维护性,单元测试
---

前段时间重读了[《重构：改善代码既有设计》](https://book.douban.com/subject/30468597/)，收货颇多。于是，简单写了一篇文章来聊聊我对重构的看法。

![](https://oss.javaguide.cn/github/javaguide/image-20220311155746549.png)

## 何谓重构？

学习重构必看的一本神书《重构：改善代码既有设计》从两个角度给出了重构的定义：

> - 重构（名词）：对软件内部结构的一种调整，目的是在不改变软件可观察行为的前提下，提高其可理解性，降低其修改成本。
> - 重构（动词）：使用一系列重构手法，在不改变软件可观察行为的前提下，调整其结构。

用更贴近工程师的语言来说：**重构就是在不改变软件可观察行为的前提下，通过一系列小步的结构调整，让代码更容易理解，更易于修改。** 设计模式和软件设计原则可以为重构提供方向，自动化测试则是重构的重要保障。

软件设计原则指导着我们组织和规范代码，同时，重构也是为了能够尽量设计出尽量满足软件设计原则的软件。

正确重构的核心在于 **步子一定要小，每一步的重构都不会影响软件的正常运行，可以随时停止重构。**

**常见的设计模式如下**：

![常见的设计模式](https://oss.javaguide.cn/github/javaguide/系统设计/基础/common-design-patterns.png)

更全面的设计模式总结，可以看 **[java-design-patterns](https://github.com/iluwatar/java-design-patterns)** 这个开源项目。

**常见的软件设计原则如下**：

![常见的软件设计原则](https://oss.javaguide.cn/github/javaguide/系统设计/基础/programming-principles.png)

更全面的设计原则总结，可以看 **[java-design-patterns](https://github.com/iluwatar/java-design-patterns)** 和 **[hacker-laws-zh](https://github.com/nusr/hacker-laws-zh)** 这两个开源项目。

## 为什么要重构？

在上面介绍重构定义的时候，我从比较抽象的角度介绍了重构的好处：重构的主要目的是让代码更容易理解，降低后续修改的成本。

如果对应到一个真实的项目，重构具体能为我们带来什么好处呢？

1. **让代码更容易理解**：通过添加注释、命名规范、逻辑优化等手段可以让我们的代码更容易被理解；
2. **避免代码腐化**：通过重构干掉坏味道代码；
3. **加深对代码的理解**：重构代码的过程会加深你对某部分代码的理解；
4. **发现潜在 bug**：是这样的，很多潜在的 bug ，都是我们在重构的过程中发现的；
5. ……

看了上面介绍的关于重构带来的好处之后，你会发现重构的最终目标是 **提高软件开发速度和质量** 。

重构并不会减慢软件开发速度，相反，如果代码质量和软件设计较差，当我们想要添加新功能的话，开发速度会越来越慢。到了最后，甚至都有想要重写整个系统的冲动。

![](https://oss.javaguide.cn/github/javaguide/bad&good-design.png)

《重构：改善代码既有设计》这本书中这样说：

> 重构的唯一目的就是让我们开发更快，用更少的工作量创造更大的价值。

## 性能优化就是重构吗？

重构的目的是提高代码的可读性、可维护性和灵活性，它关注的是代码的内部结构——如何让开发者更容易理解代码，如何让后续的功能开发和维护更加高效。而性能优化则是为了让代码运行得更快、占用更少的资源，它关注的是程序的外部表现——如何减少响应时间、降低资源消耗、提升系统吞吐量。这两者看似对立，但实际上它们的目标是统一的，都是为了提高软件的整体质量。

在实际开发中，理想的做法是首先**确保代码的可读性和可维护性**，然后根据实际需求选择合适的性能优化手段。优秀的软件设计不是一味追求性能最大化，而是要在可维护性和性能之间找到平衡。通过这种方式，我们可以打造既**易于管理**又具有**良好性能**的软件系统。

## 何时进行重构？

重构在是开发过程中随时可以进行的，见机行事即可，并不需要单独分配一两天的时间专门用来重构。

### 提交代码之前

《重构：改善代码既有设计》这本书介绍了一个 **营地法则** 的概念:

> 编程时，需要遵循营地法则：保证你离开时的代码库一定比来时更健康。

这个概念表达的核心思想其实很简单：在你提交代码的之前，花一会时间想一想，我这次的提交是让项目代码变得更健康了，还是更腐化了，或者说没什么变化？

项目团队的每一个人只有保证自己的提交没有让项目代码变得更腐化，项目代码才会朝着健康的方向发展。

**当我们离开营地（项目代码）的时候，请不要留下垃圾（代码坏味道）！尽量确保营地变得更干净了！**

### 开发一个新功能之后&之前

在开发一个新功能之后，我们应该回过头看看是不是有可以改进的地方。在添加一个新功能之前，我们可以思考一下自己是否可以重构代码以让新功能的开发更容易。

一个新功能的开发不应该仅仅只有功能验证通过那么简单，我们还应该尽量保证代码质量。

有一个两顶帽子的比喻：在我开发新功能之前，我发现重构可以让新功能的开发更容易，于是我戴上了重构的帽子。重构之后，我换回原来的帽子，继续开发新能功能。新功能开发完成之后，我又发现自己的代码难以理解，于是我又戴上了重构帽子。比较好的开发状态就是就是这样在重构和开发新功能之间来回切换。

![refractor-two-hats](https://oss.javaguide.cn/github/javaguide/refractor-two-hats.png)

### Code Review 之后

Code Review 可以非常有效提高代码的整体质量，它会帮助我们发现代码中的坏味道以及可能存在问题的地方。并且， Code Review 可以帮助项目团队其他程序员理解你负责的业务模块，有效避免人员方面的单点风险。

经历一次 Code Review ，你的代码可能会收到很多改进建议。

### 捡垃圾式重构

当我们发现坏味道代码（垃圾）的时候，如果我们不想停下手头自己正在做的工作，但又不想放着垃圾不管，我们可以这样做：

- 如果这个垃圾很容易重构的话，我们可以立即重构它。
- 如果这个垃圾不太容易重构的话，我们可以先记录下来，当完成当下的任务再回来重构它。

### 阅读理解代码的时候

搞开发的小伙伴应该非常有体会：我们经常需要阅读项目团队中其他人写的代码，也经常需要阅读自己过去写的代码。阅读代码的时候，通常要比我们写代码的时间还要多很多。

我们在阅读理解代码的时候，如果发现一些坏味道的话，我们就可以对其进行重构。

就比如说你在阅读张三写的某段代码的时候，你发现这段代码逻辑过于复杂难以理解，你有更好的写法，那你就可以对张三的这段代码逻辑进行重构。

## 重构有哪些注意事项？

### 自动化测试是重构的保护网

**自动化测试可以为重构提供信心，降低重构的成本。单元测试通常是反馈最快的一层，集成测试、验收测试等也可以共同组成保护网。我们要像重视生产代码那样，重视测试代码。**

另外，多提一句：持续集成也要依赖快速、可靠的自动化测试，当持续集成服务自动构建新代码之后，会自动运行测试来发现代码错误。

**怎样才能算单元测试呢？** 网上的定义很多，很抽象，很容易把人给看迷糊了。我觉得对于单元测试的定义主要取决于你的项目，一个函数甚至是一个类都可以看作是一个单元。就比如说我们写了一个计算个人股票收益率的方法，我们为了验证它的正确性专门为它写了一个单元测试。再比如说我们代码有一个类专门负责数据脱敏，我们为了验证脱敏是否符合预期专门为这个类写了一个单元测试。

**单元测试也是需要重构或者修改的。** [《代码整洁之道:敏捷软件开发手册》](https://book.douban.com/subject/4199741/)这本书这样写到：

> 测试代码需要随着生产代码的演进而修改，如果测试不能保持整洁，只会越来越难修改。

### 不要为了重构而重构

**重构一定是要为项目带来价值的！** 某些情况下我们不应该进行重构：

- 学习了某个设计模式/工程实践之后，不顾项目实际情况，刻意使用在项目上（避免货物崇拜编程）；
- 项目进展比较急的时候，重构项目调用的某个 API 的底层代码（重构之后对项目调用这个 API 并没有带来什么价值）；
- 重写比重构更容易更省事；
- ……

### 遵循方法

《重构：改善代码既有设计》这本书中列举除了代码常见的一些坏味道（比如重复代码、过长函数）和重构手段（如提炼函数、提炼变量、提炼类）。我们应该花时间去学习这些重构相关的理论知识，并在代码中去实践这些重构理论。

## 如何练习重构？

除了可以在重构项目代码的过程中练习精进重构之外，你还可以有下面这些手段：

- [当我重构时，我在想些什么](https://mp.weixin.qq.com/s/pFaFKMXzNCOuW2SD9Co40g)：转转技术的这篇文章总结了常见的重构场景和重构方式。
- [重构实战练习](https://linesh.gitbook.io/代码重构指南/)：通过几个小案例一步一步带你学习重构！
- [设计模式+重构学习网站](https://refactoringguru.cn/)：免费在线学习代码重构、 设计模式、 SOLID 原则 （单一职责、 开闭原则、 里氏替换、 接口隔离以及依赖反转） 。
- [IDEA 官方文档的代码重构教程](https://www.jetbrains.com/help/idea/refactoring-source-code.html#popular-refactorings)：教你如何使用 IDEA 进行重构。

## 参考

- [再读《重构》- ThoughtWorks 洞见 - 2020](https://insights.thoughtworks.cn/reread-refactoring/)：详细介绍了重构的要点比如小步重构、捡垃圾式的重构，主要是重构概念相关的介绍。
- [常见代码重构技巧 - VectorJin - 2021](https://juejin.cn/post/6954378167947624484)：从软件设计原则、设计模式、代码分层、命名规范等角度介绍了如何进行重构，比较偏实战。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 基础/单元测试到底是什么？应该怎么做？.md -->

## [17] 单元测试到底是什么？应该怎么做？

---
title: 单元测试到底是什么？应该怎么做？
description: 单元测试入门指南，涵盖单元测试概念、Mock与Stub技术、测试金字塔及JUnit测试框架使用方法。
category: 代码质量
head:
  - - meta
    - name: keywords
      content: 单元测试,Unit Testing,Mock,Stub,Fake,测试金字塔,可测试性,TDD,JUnit
---

> 本文重构完善自[谈谈为什么写单元测试 - 键盘男 - 2016](https://www.jianshu.com/p/fa41fb80d2b8)这篇文章。

## 何谓单元测试？

维基百科是这样介绍单元测试的：

> 在计算机编程中，单元测试（Unit Testing）是针对程序模块（软件设计的最小单位）进行的正确性检验测试工作。
>
> 程序单元是应用的 **最小可测试部件** 。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

由于每个单元有独立的逻辑，在做单元测试时，为了隔离外部依赖，确保这些依赖不影响验证逻辑，我们经常会用到 Fake、Stub 与 Mock 。

关于 Fake、Mock 与 Stub 这几个概念的解读，可以看看这篇文章：[测试中 Fakes、Mocks 以及 Stubs 概念明晰 - 王下邀月熊 - 2018](https://zhuanlan.zhihu.com/p/26942686) 。

## 为什么需要单元测试？

### 为重构保驾护航

我在[重构](./代码重构指南.md)这篇文章中这样写到：

> 单元测试可以为重构提供信心，降低重构的成本。我们要像重视生产代码那样，重视单元测试。

每个开发者都会经历重构，重构后把代码改坏了的情况并不少见，很可能你只是修改了一个很简单的方法就导致系统出现了一个比较严重的错误。

单元测试可以及时发现一部分逻辑错误，降低重构引入回归问题的风险。写完一个类，为它补充单元测试；写第二个类，继续补充单元测试……不过，每个类单独通过测试，并不代表它们组合起来一定没有问题，接口契约、配置、数据库、网络和事务等问题还需要通过集成测试、端到端测试等方式发现。

### 提高代码质量

由于每个单元有独立的逻辑，做单元测试时需要隔离外部依赖，确保这些依赖不影响验证逻辑。因为要把各种依赖分离，单元测试会促进工程进行组件拆分，整理工程依赖关系，更大程度减少代码耦合。这样写出来的代码，更好维护，更好扩展，从而提高代码质量。

### 减少 bug

一个机器，由各种细小的零件组成，如果其中某件零件坏了，机器运行故障。必须保证每个零件都按设计图要求的规格，机器才能正常运行。

一个可单元测试的工程，会把业务、功能分割成规模更小、有独立的逻辑部件，称为单元。单元测试的目标，就是验证各个单元是否按预期工作，从而降低局部逻辑错误和回归问题出现的概率。整个项目能否正确运行，还需要其他层次的测试共同验证。

### 快速定位 bug

如果程序有 bug，我们运行一次全部单元测试，找到不通过的测试，可以很快地定位对应的执行代码。修复代码后，运行对应的单元测试；如还不通过，继续修改，运行测试……直到**测试通过**。

### 持续集成依赖自动化测试

持续集成需要依赖快速、可靠的自动化测试。当持续集成服务自动构建新代码之后，会自动运行单元测试、集成测试等来发现代码错误，单元测试通常是其中反馈最快的一层。

## 谁逼你写单元测试？

### 领导要求

有些经验丰富的领导，或多或少都会要求团队写单元测试。对于有一定工作经验的队友，这要求挺合理；对于经验尚浅的、毕业生，恐怕要死要活了，连代码都写不好，还要写单元测试，are you kidding me？

培训新人单元测试用法，是一项艰巨的任务。新人代码风格未形成，也不知道单元测试多重要，强制单元测试会让他们感到困惑，没办法按自己思路写代码。

### 大牛都写单元测试

国外很多家喻户晓的开源项目，都有大量单元测试。例如，[retrofit](https://link.jianshu.com?t=https://github.com/square/retrofit/tree/master/retrofit/src/test/java/retrofit2)、[okhttp](https://link.jianshu.com?t=https://github.com/square/okhttp/tree/master/okhttp-tests/src/test/java/okhttp3)、[butterknife](https://link.jianshu.com?t=https://github.com/JakeWharton/butterknife/tree/master/butterknife-compiler/src/test/java/butterknife)…… 国外大牛都写单元测试，我们也写吧！

很多读者都有这种想法，一开始满腔热血。当真要对自己项目单元测试时，便困难重重，很大原因是项目对单元测试不友好。最后只能对一些不痛不痒的工具类做单元测试，久而久之，当初美好愿望也不了了之。

### 保住面子

都是有些许年经验的老鸟，还天天被测试同学追 bug，好意思么？花多一点时间写单元测试，确保没低级 bug，还能彰显大牛风范，何乐而不为？

### 心虚

笔者也是个不太相信自己代码的人，总觉得哪里会突然冒出莫名其妙的 bug，也怕别人不小心改了自己的代码（被害妄想症），新版本上线提心吊胆……花点时间写单元测试，有事没事跑一下测试，确保原逻辑没问题，至少能睡安稳一点。

## TDD 测试驱动开发

### 何谓 TDD？

TDD 即 Test-Driven Development（ 测试驱动开发），这是敏捷开发的一项核心实践和技术，也是一种设计方法论。

TDD 原理是开发功能代码之前，先编写测试用例代码，然后针对测试用例编写功能代码，使其能够通过。

TDD 的节奏：“红 - 绿 - 重构”。

![](https://static001.geekbang.org/resource/image/09/7f/090e1fc6aff08b4aa66376f776c2337f.png)

由于 TDD 对开发人员要求非常高，跟传统开发思维不一样，因此实施起来相当困难。

TDD 在很多人眼中是不实用的，一来他们并不理解测试“驱动”开发的含义，但更重要的是，他们很少会做任务分解。而任务分解是做好 TDD 的关键点。只有把任务分解到可以测试的地步，才能够有针对性地写测试。

### TDD 优缺点分析

测试驱动开发有好处也有坏处。因为每个测试用例都是根据需求来的，或者说把一个大需求分解成若干小需求编写测试用例，所以测试用例写出来后，开发者写的执行代码，必须满足测试用例。如果测试不通过，则修改执行代码，直到测试用例通过。

**优点**：

1. 帮你整理需求，梳理思路；
2. 帮你设计出更合理的接口（空想的话很容易设计出屎）；
3. 减小代码出现 bug 的概率；
4. 提高开发效率（前提是正确且熟练使用 TDD）。

**缺点**：

1. 能用好 TDD 的人非常少，看似简单，实则门槛很高；
2. 投入开发资源（时间和精力）通常会更多；
3. 由于测试用例在未进行代码设计前写；很有可能限制开发者对代码整体设计；
4. 可能引起开发人员不满情绪，我觉得这点很严重，毕竟不是人人都喜欢单元测试，尽管单元测试会带给我们相当多的好处。

相关阅读：[如何用正确的姿势打开 TDD？ - 陈天 - 2017](https://zhuanlan.zhihu.com/p/24997923) 。

## 单测框架和 Mock 工具如何选择？

对于单测来说，JUnit、Spock 属于测试框架，Mockito、PowerMock、JMockit、TestableMock 等则主要用于创建 Mock 等测试替身。

JUnit 几乎是默认选择，但是其不提供 Mock 能力，因此通常还需要搭配 Mockito 等 Mock 工具。Spock 则同时提供测试规范和 Mock 能力。

究竟是选择 JUnit 搭配 Mockito，还是选择 Spock 呢？我这里做了一些简单的对比分析：

- Spock 2.4 可以通过 `SpyStatic()` 配合支持静态方法的 Mock Maker 模拟 Java 和 Groovy 的静态方法；Mockito 3.4.0 以后也支持静态方法的 Mock。具体可以看 [Spock 2.4 发布说明](https://spockframework.org/spock/docs/2.4/release_notes.html)和 [Mockito 官方文档](https://javadoc.io/doc/org.mockito/mockito-core/latest/org.mockito/org/mockito/Mockito.html)。
- Spock 基于 Groovy，写出来的测试代码更清晰易读，比较规范(自带 given-when-then 的常用测试结构规范)。Mockito 没有具体的结构规范，需要项目组自己约定一个或者遵守比较好的测试代码实践。通常来说，同样的测试用例，Spock 的代码要更简洁。
- Mockito 使用的人群更广泛，稳定可靠。并且，Mockito 是 SpringBoot Test 默认集成的 Mock 工具。

JUnit 搭配 Mockito 和 Spock 都是非常不错的选择，相对来说，JUnit 搭配 Mockito 的适用性更强一些。

## 总结

单元测试确实会带给你相当多的好处，但不是立刻体验出来。正如买重疾保险，交了很多保费，没病没痛，十几年甚至几十年都用不上，最好就是一辈子用不上理赔，身体健康最重要。单元测试也一样，写了可以买个放心，对代码的一种保障，有 bug 尽快测出来，没 bug 就最好，总不能说“写那么多单元测试，结果测不出 bug，浪费时间”吧？

以下是个人对单元测试一些建议：

> - 越重要的代码，越要写单元测试；
> - 代码做不到单元测试，多思考如何改进，而不是放弃；
> - 边写业务代码，边写单元测试，而不是完成整个新功能后再写；
> - 多思考如何改进、简化测试代码。
> - 测试代码需要随着生产代码的演进而重构或者修改，如果测试不能保持整洁，只会越来越难修改。

作为一名经验丰富的程序员，写单元测试更多的是**对自己的代码负责**。有测试用例的代码，别人更容易看懂，以后别人接手你的代码时，也可能放心做改动。

**多敲代码实践，多跟有单元测试经验的工程师交流**，你会发现写单元测试获得的收益会更多。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 基础/软件工程简明教程.md -->

## [18] 软件工程简明教程

---
title: 软件工程简明教程
description: 软件工程基础知识详解，涵盖软件危机、软件开发过程模型、瀑布模型、敏捷开发等软件工程核心概念。
category: 系统设计
head:
  - - meta
    - name: keywords
      content: 软件工程,软件危机,软件开发过程,瀑布模型,敏捷开发,需求分析,软件生命周期,工程化方法
---

大部分软件开发从业者，都会忽略软件开发中的一些最基础、最底层的一些概念。但是，这些软件开发的概念对于软件开发来说非常重要，就像是软件开发的基石一样。这也是我写这篇文章的原因。

## 何为软件工程？

1968 年 NATO（北大西洋公约组织）提出了**软件危机**（**Software crisis**）一词。同年，为了解决软件危机问题，“**软件工程**”的概念诞生了。一门叫做软件工程的学科也就应运而生。

随着时间的推移，软件工程这门学科也经历了一轮又一轮的完善，其中的一些核心内容比如软件开发模型越来越丰富实用！

**什么是软件危机呢？**

简单来说，软件危机描述了当时软件开发的一个痛点：我们很难高效地开发出质量高的软件。

Dijkstra（Dijkstra 算法的作者） 在 1972 年图灵奖获奖感言中也提到过软件危机，他是这样说的：“导致软件危机的主要原因是机器变得功能强大了几个数量级！坦率地说：只要没有机器，编程就完全没有问题。当我们有一些弱小的计算机时，编程成为一个温和的问题，而现在我们有了庞大的计算机，编程也同样成为一个巨大的问题”。

**说了这么多，到底什么是软件工程呢？**

工程是为了解决实际的问题将理论应用于实践。软件工程指的就是将工程思想应用于软件开发。

上面是我对软件工程的定义，我们再来看看比较权威的定义。IEEE Std 610.12-1990《软件工程术语标准词汇表》给出的定义是这样的：　(1)将系统化的、规范的、可量化的方法应用到软件的开发、运行及维护中，即将工程化方法应用于软件。　(2)在(1)中所述方法的研究。

总之，软件工程的终极目标就是：**在更少资源消耗的情况下，创造出更好、更容易维护的软件。**

## 软件开发过程

[维基百科是这样定义软件开发过程](https://zh.wikipedia.org/wiki/%E8%BD%AF%E4%BB%B6%E5%BC%80%E5%8F%91%E8%BF%87%E7%A8%8B)的：

> 软件开发过程（英语：software development process），或软件过程（英语：software process），是软件开发的开发生命周期（software development life cycle），其各个阶段实现了软件的需求定义与分析、设计、实现、测试、交付和维护。软件过程是在开发与构建系统时应遵循的步骤，是软件开发的路线图。

- 需求分析：分析用户的需求，建立逻辑模型。
- 软件设计：根据需求分析的结果对软件架构进行设计。
- 编码：编写程序运行的源代码。
- 测试 : 确定测试用例，编写测试报告。
- 交付：将做好的软件交付给客户。
- 维护：对软件进行维护比如解决 bug，完善功能。

软件开发过程只是比较笼统的层面上，定义了一个软件开发可能涉及到的一些流程。

软件开发模型更具体地定义了软件开发过程，对开发过程提供了强有力的理论支持。

## 软件开发模型

软件开发模型和方法有很多种，比如瀑布模型（Waterfall Model）、快速原型模型（Rapid Prototype Model）、V 模型（V-model）、W 模型（W-model）、敏捷开发方法。其中最具有代表性的还是 **瀑布模型** 和 **敏捷开发** 。

**瀑布模型** 定义了一套完整的软件开发周期，完整地展示了一个软件的生命周期。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/up-264f2750a3d30366e36c375ec3a30ec2775.png)

**敏捷开发** 并不是单一的软件开发模型，而是一组价值观和原则，常见的具体方法有 Scrum、极限编程（XP）和看板（Kanban）等。敏捷开发强调个体和互动、工作的软件、客户合作和响应变化，并通过迭代和频繁交付持续获取反馈。

**持续集成**、**重构**、**小版本发布**、**结对编程**、**测试驱动开发** 是极限编程中常见的技术实践，**站会** 常见于 Scrum，它们并不是每一种敏捷方法都强制要求的实践。敏捷开发也不等于低文档，而是更重视工作的软件，同时保留必要且有价值的文档。

## 软件开发的基本策略

### 软件复用

我们在构建一个新的软件的时候，不需要从零开始，通过复用已有的一些轮子（框架、第三方库等）、设计模式、设计原则等等现成的物料，我们可以更快地构建出一个满足要求的软件。

像我们平时接触的开源项目就是最好的例子。我想，如果不是开源，我们构建出一个满足要求的软件，耗费的精力和时间要比现在多的多！

### 分而治之

构建软件的过程中，我们会遇到很多问题。我们可以将一些比较复杂的问题拆解为一些小问题，然后，一一攻克。

我结合现在比较火的软件设计方法—领域驱动设计（Domain Driven Design，简称 DDD）来说说。

在领域驱动设计中，很重要的一个概念就是**领域（Domain）**，它就是我们要解决的问题。在领域驱动设计中，我们要做的就是把比较大的领域（问题）拆解为若干的小领域（子域）。

除此之外，分而治之也是一个比较常用的算法思想，对应的就是分治算法。如果你想了解分治算法的话，推荐你看一下北大的[《算法设计与分析 Design and Analysis of Algorithms》](https://www.coursera.org/learn/algorithms)。

### 逐步演进

软件开发是一个逐步演进的过程，我们需要不断进行迭代式增量开发，最终交付符合客户价值的产品。

这里补充一个在软件开发领域，非常重要的概念：**MVP（Minimum Viable Product，最小可行产品）**。

最小可行产品是以最少投入获取最多经验证的客户认知的产品版本，目的是尽快验证关键假设，不一定是一个能够完整满足客户需求的产品。下面这张图片把这个思想展示的非常精髓。

![](https://oss.javaguide.cn/github/javaguide/系统设计/Java 定时任务详解/up-a99961ff7725106c0592abca845d555568a.png)

利用最小可行产品，我们可以也可以提早进行市场分析，这对于我们在探索产品不确定性的道路上非常有帮助。可以非常有效地指导我们下一步该往哪里走。

### 优化折中

软件开发是一个不断优化改进的过程。任何软件都有很多可以优化的点，不可能完美。我们需要不断改进和提升软件的质量。

但是，也不要陷入这个怪圈。要学会折中，在有限的投入内，以最有效的方式提高现有软件的质量。

## 参考

- [IEEE Std 610.12-1990：IEEE Standard Glossary of Software Engineering Terminology](https://standards.ieee.org/ieee/610.12/855/)
- [Manifesto for Agile Software Development](https://agilemanifesto.org/)
- [Minimum Viable Product: a guide - Eric Ries](https://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html)
- 软件工程的基本概念-清华大学软件学院 刘强：<https://www.xuetangx.com/course/THU08091000367>
- 软件开发过程-维基百科：[https://zh.wikipedia.org/wiki/软件开发过程](https://zh.wikipedia.org/wiki/软件开发过程)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 框架/mybatis/MyBatis常见面试题总结.md -->

## [19] MyBatis常见面试题总结

---
title: MyBatis常见面试题总结
description: MyBatis常见面试题详解，涵盖#{}与${}区别、动态SQL、一级二级缓存、分页插件及Mapper映射原理。
category: 框架
icon: "mdi:database-outline"
tag:
  - MyBatis
head:
  - - meta
    - name: keywords
      content: MyBatis,MyBatis面试题,#{}与${},动态SQL,一级缓存,二级缓存,分页插件,Mapper映射
---

> 本篇文章由 JavaGuide 收集自网络，原出处不明。
>
> 比起这些枯燥的面试题，我更建议你看看文末推荐的 MyBatis 优质好文。

### #{} 和 \${} 的区别是什么？

注：这道题是面试官面试我同事的。

答：

- `${}`是 Properties 文件中的变量占位符，它可以用于标签属性值和 sql 内部，属于原样文本替换，可以替换任意内容，比如\${driver}会被原样替换为`com.mysql.jdbc. Driver`。

一个示例：根据参数按任意字段排序：

```sql
select * from users order by ${orderCols}
```

`orderCols`可以是 `name`、`name desc`、`name,sex asc`等固定片段，实现灵活的排序。但 `${}` 不会使用预编译参数，也不会自动转义内容，因此 `orderCols` 不能直接来自用户输入。实际项目应把前端传入的排序字段和方向映射为服务端预定义的枚举或白名单 SQL 片段，并拒绝白名单以外的值，否则会产生 SQL 注入风险。

- `#{}`是 sql 的参数占位符，MyBatis 会将 sql 中的`#{}`替换为? 号，在 sql 执行前会使用 PreparedStatement 的参数设置方法，按序给 sql 的? 号占位符设置参数值，比如 ps.setInt(1, parameterValue)（JDBC 参数下标从 1 开始），`#{item.name}` 的取值方式为使用反射从参数对象中获取 item 对象的 name 属性值，相当于 `param.getItem().getName()`。

### xml 映射文件中，除了常见的 select、insert、update、delete 标签之外，还有哪些标签？

注：这道题是京东面试官面试我时问的。

答：还有很多其他的标签， `<resultMap>`、 `<parameterMap>`、 `<sql>`、 `<include>`、 `<selectKey>` ，加上动态 sql 的 9 个标签， `trim|where|set|foreach|if|choose|when|otherwise|bind` 等，其中 `<sql>` 为 sql 片段标签，通过 `<include>` 标签引入 sql 片段， `<selectKey>` 为不支持自增的主键生成策略标签。

### Dao 接口的工作原理是什么？Dao 接口里的方法，参数不同时，方法能重载吗？

注：这道题也是京东面试官面试我被问的。

答：最佳实践中，通常一个 xml 映射文件，都会写一个 Dao 接口与之对应。Dao 接口就是人们常说的 `Mapper` 接口，接口的全限名，就是映射文件中的 namespace 的值，接口的方法名，就是映射文件中 `MappedStatement` 的 id 值，接口方法内的参数，就是传递给 sql 的参数。 `Mapper` 接口是没有实现类的，当调用接口方法时，接口全限名+方法名拼接字符串作为 key 值，可唯一定位一个 `MappedStatement` ，举例：`com.mybatis3.mappers. StudentDao.findStudentById` ，可以唯一找到 namespace 为 `com.mybatis3.mappers. StudentDao` 下面 `id = findStudentById` 的 `MappedStatement` 。在 MyBatis 中，每一个 `<select>`、 `<insert>`、 `<update>`、 `<delete>` 标签，都会被解析为一个 `MappedStatement` 对象。

~~Dao 接口里的方法，是不能重载的，因为是全限名+方法名的保存和寻找策略。~~

Java 接口允许声明重载方法，但 MyBatis 根据“接口全限定名 + 方法名”查找 `MappedStatement`，不会使用参数签名区分重载方法。因此，多个重载方法只能共享同一个映射，XML 中的 ID 也不能重复。只有当这个映射能够兼容各重载方法的参数和返回类型时，调用才可能正常执行，实际开发中不建议在 Mapper 接口中使用重载。

Mybatis 版本 3.3.0，亲测如下：

```java
/**
 * Mapper接口里面方法重载
 */
public interface StuMapper {

 List<Student> getAllStu();

 List<Student> getAllStu(@Param("id") Integer id);
}
```

然后在 `StuMapper.xml` 中利用 Mybatis 的动态 sql 就可以实现。

```xml
<select id="getAllStu" resultType="com.pojo.Student">
  select * from student
  <where>
    <if test="id != null">
      id = #{id}
    </if>
  </where>
</select>
```

这个特定示例能够正常运行，是因为两个重载方法最终调用的是同一个动态 SQL 映射，并不是 MyBatis 能够按方法签名选择不同的 SQL。

**MyBatis 的 Mapper XML 无法按重载签名分派 SQL。即使某些共享映射的重载示例可以运行，也应优先使用不同的方法名表达不同查询。**

相关 issue：[更正：Dao 接口里的方法可以重载，但是 Mybatis 的 xml 里面的 ID 不允许重复！](https://github.com/Snailclimb/JavaGuide/issues/1122)。

Dao 接口的工作原理是 JDK 动态代理，MyBatis 运行时会使用 JDK 动态代理为 Dao 接口生成代理 proxy 对象，代理对象 proxy 会拦截接口方法，转而执行 `MappedStatement` 所代表的 sql，然后将 sql 执行结果返回。

**补充**：

下面的测试用于展示共享映射时不同参数组合的行为，不是 MyBatis 对方法重载定义的通用规则。

**测试如下**：

`PersonDao.java`

```java
Person queryById();

Person queryById(@Param("id") Long id);

Person queryById(@Param("id") Long id, @Param("name") String name);
```

`PersonMapper.xml`

```xml
<select id="queryById" resultMap="PersonMap">
    select
      id, name, age, address
    from person
    <where>
        <if test="id != null">
            id = #{id}
        </if>
        <if test="name != null and name != ''">
            name = #{name}
        </if>
    </where>
    limit 1
</select>
```

`org.apache.ibatis.scripting.xmltags. DynamicContext. ContextAccessor#getProperty` 方法用于获取 `<if>` 标签中的条件值

```java
public Object getProperty(Map context, Object target, Object name) {
  Map map = (Map) target;

  Object result = map.get(name);
  if (map.containsKey(name) || result != null) {
    return result;
  }

  Object parameterObject = map.get(PARAMETER_OBJECT_KEY);
  if (parameterObject instanceof Map) {
    return ((Map)parameterObject).get(name);
  }

  return null;
}
```

`parameterObject` 为 map，存放的是 Dao 接口中参数相关信息。

`((Map)parameterObject).get(name)` 方法如下

```java
public V get(Object key) {
  if (!super.containsKey(key)) {
    throw new BindingException("Parameter '" + key + "' not found. Available parameters are " + keySet());
  }
  return super.get(key);
}
```

1. `queryById()`方法执行时，`parameterObject`为 null，`getProperty`方法返回 null 值，`<if>`标签获取的所有条件值都为 null，所有条件不成立，动态 sql 可以正常执行。
2. `queryById(1L)`方法执行时，`parameterObject`为 map，包含了`id`和`param1`两个 key 值。当获取`<if>`标签中`name`的属性值时，进入`((Map)parameterObject).get(name)`方法中，map 中 key 不包含`name`，所以抛出异常。
3. `queryById(1L,"1")`方法执行时，`parameterObject`中包含`id`,`param1`,`name`,`param2`四个 key 值，`id`和`name`属性都可以获取到，动态 sql 正常执行。

### MyBatis 是如何进行分页的？分页插件的原理是什么？

注：我出的。

答：**(1)** MyBatis 使用 RowBounds 对象进行分页，它不会改写 SQL，而是在 JDBC ResultSet 上跳过 offset 行并限制返回数量，属于客户端结果集分页而非物理分页，效率取决于 JDBC 驱动和结果集类型；**(2)** 可以在 sql 内直接书写带有物理分页的参数来完成物理分页功能，**(3)** 也可以使用分页插件来完成物理分页。对于大数据量和较大的 offset，通常应优先使用物理分页。

分页插件的基本原理是使用 MyBatis 提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql，根据 dialect 方言，添加对应的物理分页语句和物理分页参数。

举例：`select _ from student` ，拦截 sql 后重写为：`select t._ from （select \* from student）t limit 0，10`

### 简述 MyBatis 的插件运行原理，以及如何编写一个插件

注：我出的。

答：MyBatis 仅可以编写针对 `ParameterHandler`、 `ResultSetHandler`、 `StatementHandler`、 `Executor` 这 4 种接口的插件，MyBatis 使用 JDK 的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行这 4 种接口对象的方法时，就会进入拦截方法，具体就是 `InvocationHandler` 的 `invoke()` 方法，当然，只会拦截那些你指定需要拦截的方法。

实现 MyBatis 的 `Interceptor` 接口并复写 `intercept()` 方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法即可，记住，别忘了在配置文件中配置你编写的插件。

### MyBatis 执行批量插入，能返回数据库主键列表吗？

注：我出的。

答：能，JDBC 都能，MyBatis 当然也能。

### MyBatis 动态 sql 是做什么的？都有哪些动态 sql？能简述一下动态 sql 的执行原理不？

注：我出的。

答：MyBatis 动态 sql 可以让我们在 xml 映射文件内，以标签的形式编写动态 sql，完成逻辑判断和动态拼接 sql 的功能。其执行原理为，使用 OGNL 从 sql 参数对象中计算表达式的值，根据表达式的值动态拼接 sql，以此来完成动态 sql 的功能。

MyBatis 提供了 9 种动态 sql 标签:

- `<if></if>`
- `<where></where>(trim,set)`
- `<choose></choose>（when, otherwise）`
- `<foreach></foreach>`
- `<bind/>`

关于 MyBatis 动态 SQL 的详细介绍，请看这篇文章：[Mybatis 系列全解（八）：Mybatis 的 9 大动态 SQL 标签你知道几个？](https://segmentfault.com/a/1190000039335704) 。

关于这些动态 SQL 的具体使用方法，请看这篇文章：[Mybatis【13】-- Mybatis 动态 sql 标签怎么使用？](https://cloud.tencent.com/developer/article/1943349)

### MyBatis 是如何将 sql 执行结果封装为目标对象并返回的？都有哪些映射形式？

注：我出的。

答：第一种是使用 `<resultMap>` 标签，逐一定义列名和对象属性名之间的映射关系。第二种是使用 sql 列的别名功能，将列别名书写为对象属性名，比如 T_NAME AS NAME，对象属性名一般是 name，小写，但是列名不区分大小写，MyBatis 会忽略列名大小写，智能找到与之对应对象属性名，你甚至可以写成 T_NAME AS NaMe，MyBatis 一样可以正常工作。

有了列名与属性名的映射关系后，MyBatis 通过反射创建对象，同时使用反射给对象的属性逐一赋值并返回，那些找不到映射关系的属性，是无法完成赋值的。

### MyBatis 能执行一对一、一对多的关联查询吗？都有哪些实现方式，以及它们之间的区别

注：我出的。

答：能。MyBatis 通常使用 `<association>` 映射“有一个”关系（如一对一、多对一），使用 `<collection>` 映射“有多个”关系（如一对多、多对多）。关系的基数由对象属性和映射结构决定，并不是简单地把 `selectOne()` 修改为 `selectList()`。

关联对象查询主要有两种实现方式：一种是 Nested Select，即执行另一个 mapped statement 查询关联对象，使用不当可能产生 N+1 查询；另一种是 Nested Results，即通过 join 得到包含重复数据的结果集，再使用嵌套结果映射组装对象图。后者只需执行一次 SQL，但需要正确配置主对象和关联对象的 `<id>` 映射。

那么问题来了，join 查询出来 100 条记录，如何确定主对象是 5 个，而不是 100 个？其去重复的原理是 `<resultMap>` 标签内的 `<id>` 子标签，指定了唯一确定一条记录的 id 列，MyBatis 根据 `<id>` 列值来完成 100 条记录的去重复功能， `<id>` 可以有多个，代表了联合主键的语意。

同样主对象的关联对象，也是根据这个原理去重复的，尽管一般情况下，只有主对象会有重复记录，关联对象一般不会重复。

举例：下面 join 查询出来 6 条记录，一、二列是 Teacher 对象列，第三列为 Student 对象列，MyBatis 去重复处理后，结果为 1 个老师 6 个学生，而不是 6 个老师 6 个学生。

| t_id | t_name  | s_id |
| ---- | ------- | ---- |
| 1    | teacher | 38   |
| 1    | teacher | 39   |
| 1    | teacher | 40   |
| 1    | teacher | 41   |
| 1    | teacher | 42   |
| 1    | teacher | 43   |

### MyBatis 是否支持延迟加载？如果支持，它的实现原理是什么？

注：我出的。

答：MyBatis 仅支持 association 关联对象和 collection 关联集合对象的延迟加载，association 指的就是一对一，collection 指的就是一对多查询。在 MyBatis 配置文件中，可以配置是否启用延迟加载 `lazyLoadingEnabled=true|false。`

它的原理是，为结果对象创建代理，在访问尚未加载的属性时由代理触发预先登记的关联查询，再将查询结果写入目标属性。MyBatis 3.3 及以上版本默认使用 Javassist 创建延迟加载代理；CGLIB 是旧版本可选方案，并已从 MyBatis 3.5.10 起被弃用。具体关联还可以通过 `fetchType` 覆盖全局 `lazyLoadingEnabled` 配置。

当然了，不光是 MyBatis，几乎所有的包括 Hibernate，支持延迟加载的原理都是一样的。

### MyBatis 的 xml 映射文件中，不同的 xml 映射文件，id 是否可以重复？

注：我出的。

答：不同的 xml 映射文件，id 可以重复。

原因就是 namespace+id 是作为 `Map<String, MappedStatement>` 的 key 使用的，如果 namespace 不同，即使 id 重复，key (namespace+id) 也是不同的。

### MyBatis 中如何执行批处理？

注：我出的。

答：使用 `BatchExecutor` 完成批处理。

### MyBatis 都有哪些 Executor 执行器？它们之间的区别是什么？

注：我出的

答：MyBatis 有三种基本的 `Executor` 执行器：

- **`SimpleExecutor`：** 每执行一次 update 或 select，就开启一个 Statement 对象，用完立刻关闭 Statement 对象。
- **`ReuseExecutor`：** 执行 update 或 select，以 sql 作为 key 查找 Statement 对象，存在就使用，不存在就创建，用完后，不关闭 Statement 对象，而是放置于 Map<String, Statement>内，供下一次使用。简言之，就是重复使用 Statement 对象。
- **`BatchExecutor`**：执行 update（没有 select，JDBC 批处理不支持 select），将所有 sql 都添加到批处理中（addBatch()），等待统一执行（executeBatch()），它缓存了多个 Statement 对象，每个 Statement 对象都是 addBatch()完毕后，等待逐一执行 executeBatch()批处理。与 JDBC 批处理相同。

作用范围：`Executor` 的这些特点，都严格限制在 SqlSession 生命周期范围内。

### MyBatis 中如何指定使用哪一种 Executor 执行器？

注：我出的

答：在 MyBatis 配置文件中，可以指定默认的 `ExecutorType` 执行器类型，也可以手动给 `DefaultSqlSessionFactory` 的创建 SqlSession 的方法传递 `ExecutorType` 类型参数。

### MyBatis 是否可以映射 Enum 枚举类？

注：我出的

答：MyBatis 可以映射枚举类，不单可以映射枚举类，MyBatis 可以映射任何对象到表的一列上。映射方式为自定义一个 `TypeHandler` ，实现 `TypeHandler` 的 `setParameter()` 和 `getResult()` 接口方法。 `TypeHandler` 有两个作用：

- 一是完成从 javaType 至 jdbcType 的转换；
- 二是完成 jdbcType 至 javaType 的转换，体现为 `setParameter()` 和 `getResult()` 两个方法，分别代表设置 sql 问号占位符参数和获取列查询结果。

### MyBatis 映射文件中，如果 A 标签通过 include 引用了 B 标签的内容，请问，B 标签能否定义在 A 标签的后面，还是说必须定义在 A 标签的前面？

注：我出的

答：虽然 MyBatis 解析 xml 映射文件是按照顺序解析的，但是，被引用的 B 标签依然可以定义在任何地方，MyBatis 都可以正确识别。

原理是，MyBatis 解析 A 标签，发现 A 标签引用了 B 标签，但是 B 标签尚未解析到，尚不存在，此时，MyBatis 会将 A 标签标记为未解析状态，然后继续解析余下的标签，包含 B 标签，待所有标签解析完毕，MyBatis 会重新解析那些被标记为未解析的标签，此时再解析 A 标签时，B 标签已经存在，A 标签也就可以正常解析完成了。

### 简述 MyBatis 的 xml 映射文件和 MyBatis 内部数据结构之间的映射关系？

注：我出的

答：MyBatis 将 xml 配置信息解析并保存到 `Configuration` 中。在 xml 映射文件中， `<parameterMap>` 标签会被解析为 `ParameterMap` 对象，其每个子元素会被解析为 `ParameterMapping` 对象。 `<resultMap>` 标签会被解析为 `ResultMap` 对象，其每个子元素会被解析为 `ResultMapping` 对象。每一个 `<select>、<insert>、<update>、<delete>` 标签均会被解析为 `MappedStatement` 对象，标签内的 SQL 会被解析为 `SqlSource`；执行时，`SqlSource` 再根据实际参数生成 `BoundSql`。

### 为什么说 MyBatis 是半自动 ORM 映射工具？它与全自动的区别在哪里？

注：我出的

答：Hibernate 属于全自动 ORM 映射工具，使用 Hibernate 查询关联对象或者关联集合对象时，可以根据对象关系模型直接获取，所以它是全自动的。而 MyBatis 在查询关联对象或关联集合对象时，需要手动编写 sql 来完成，所以，称之为半自动 ORM 映射工具。

面试题看似都很简单，但是想要能正确回答上来，必定是研究过源码且深入的人，而不是仅会使用的人或者用的很熟的人，以上所有面试题及其答案所涉及的内容，在我的 MyBatis 系列博客中都有详细讲解和原理分析。

<!-- @include: @article-footer.snippet.md -->

### 文章推荐

- [2W 字全面剖析 Mybatis 中的 9 种设计模式](https://juejin.cn/post/7273516671574687759)
- [从零开始实现一个 MyBatis 加解密插件](https://mp.weixin.qq.com/s/WUEAdFDwZsZ4EKO8ix0ijg)
- [MyBatis 最全使用指南](https://juejin.cn/post/7051910683264286750)
- [脑洞打开！第一次看到这样使用 MyBatis 的，看得我一愣一愣的。](https://juejin.cn/post/7269390456530190376)
- [MyBatis 居然也有并发问题](https://juejin.cn/post/7264921613551730722)


---

---

<!-- source: 框架/spring/Async 注解原理分析.md -->

## [20] Async 注解原理分析

---
title: Async 注解原理分析
description: Spring @Async异步注解原理详解，涵盖异步任务配置、线程池设置、@EnableAsync机制及常见使用问题。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring异步,@Async,EnableAsync,线程池,TaskExecutor,异步任务,Spring注解,方法异步
---

`@Async` 注解由 Spring 框架提供，被该注解标注的类或方法会在 **异步线程** 中执行。这意味着当方法被调用时，调用者将不会等待该方法执行完成，而是可以继续执行后续的代码。

`@Async` 注解的使用非常简单，需要两个步骤：

1. 在启动类上添加注解 `@EnableAsync` ，开启异步任务。
2. 在需要异步执行的方法或类上添加注解 `@Async` 。

```java
@SpringBootApplication
// 开启异步任务
@EnableAsync
public class YourApplication {

    public static void main(String[] args) {
        SpringApplication.run(YourApplication.class, args);
    }
}

// 异步服务类
@Service
public class MyService {

    // 推荐使用自定义线程池，这里只是演示基本用法
    @Async
    public CompletableFuture<String> doSomethingAsync() {

        // 这里会有一些业务耗时操作
        // ...
        // 使用 CompletableFuture 可以更方便地处理异步任务的结果，避免阻塞主线程
        return CompletableFuture.completedFuture("Async Task Completed");
    }

}
```

接下来，我们一起来看看 `@Async` 的底层原理。

## @Async 原理分析

`@Async` 可以异步执行任务，本质上是使用 **动态代理** 来实现的。通过 Spring 中的后置处理器 `BeanPostProcessor` 为使用 `@Async` 注解的类创建动态代理，之后 `@Async` 注解方法的调用会被动态代理拦截，在拦截器中将方法的执行封装为异步任务提交给线程池处理。

接下来，我们来详细分析一下。

### 开启异步

使用 `@Async` 之前，需要在启动类上添加 `@EnableAsync` 来开启异步，`@EnableAsync` 注解如下：

```JAVA
// 省略其他注解 ...
@Import(AsyncConfigurationSelector.class)
public @interface EnableAsync { /* ... */ }
```

在 `@EnableAsync` 注解上通过 `@Import` 注解引入了 `AsyncConfigurationSelector` ，因此 Spring 会去加载通过 `@Import` 注解引入的类。

`AsyncConfigurationSelector` 类实现了 `ImportSelector` 接口，因此在该类中会重写 `selectImports()` 方法来自定义加载 Bean 的逻辑，如下：

```JAVA
public class AsyncConfigurationSelector extends AdviceModeImportSelector<EnableAsync> {
	@Override
	@Nullable
	public String[] selectImports(AdviceMode adviceMode) {
		switch (adviceMode) {
	   // 基于 Spring AOP 代理织入的通知，具体可能使用 JDK 动态代理或 CGLIB
			case PROXY:
				return new String[] {ProxyAsyncConfiguration.class.getName()};
   // 基于 AspectJ 织入的通知
			case ASPECTJ:
				return new String[] {ASYNC_EXECUTION_ASPECT_CONFIGURATION_CLASS_NAME};
			default:
				return null;
		}
	}
}
```

在 `selectImports()` 方法中，会根据通知的不同类型来选择加载不同的类，其中 `adviceMode` 默认值为 `PROXY` 。

这里以基于 Spring AOP 代理的通知为例，此时会加载 `ProxyAsyncConfiguration` 类，如下：

```JAVA
@Configuration
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public class ProxyAsyncConfiguration extends AbstractAsyncConfiguration {
	@Bean(name = TaskManagementConfigUtils.ASYNC_ANNOTATION_PROCESSOR_BEAN_NAME)
	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
	public AsyncAnnotationBeanPostProcessor asyncAdvisor() {
		 // ...
  // 加载后置处理器
		AsyncAnnotationBeanPostProcessor bpp = new AsyncAnnotationBeanPostProcessor();

  // ...
		return bpp;
	}
}
```

### 后置处理器

在 `ProxyAsyncConfiguration` 类中，会通过 `@Bean` 注解加载一个后置处理器 `AsyncAnnotationBeanPostProcessor` ，这个后置处理器是使 `@Async` 注解起作用的关键。

如果某一个类或者方法上使用了 `@Async` 注解，`AsyncAnnotationBeanPostProcessor` 处理器就会为该类创建一个动态代理。

该类的方法在执行时，会被代理对象的拦截器所拦截，其中被 `@Async` 注解标记的方法会异步执行。

`AsyncAnnotationBeanPostProcessor` 代码如下：

```JAVA
public class AsyncAnnotationBeanPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessor {
	@Override
	public void setBeanFactory(BeanFactory beanFactory) {
		super.setBeanFactory(beanFactory);
  // 创建 AsyncAnnotationAdvisor，它是一个 Advisor
  // 用于拦截带有 @Async 注解的方法并将这些方法异步执行。
		AsyncAnnotationAdvisor advisor = new AsyncAnnotationAdvisor(this.executor, this.exceptionHandler);
  // 如果设置了自定义的 asyncAnnotationType，则将其设置到 advisor 中。
  // asyncAnnotationType 用于指定自定义的异步注解，例如 @MyAsync。
		if (this.asyncAnnotationType != null) {
			advisor.setAsyncAnnotationType(this.asyncAnnotationType);
		}
		advisor.setBeanFactory(beanFactory);
		this.advisor = advisor;
	}
}
```

`AsyncAnnotationBeanPostProcessor` 的父类实现了 `BeanFactoryAware` 接口，因此在该类中重写了 `setBeanFactory()` 方法作为扩展点，来加载 `AsyncAnnotationAdvisor` 。

#### 创建 Advisor

`Advisor` 是 `Spring AOP` 对 `Advice` 和 `Pointcut` 的抽象。`Advice` 为执行的通知逻辑，`Pointcut` 为通知执行的切入点。

在后置处理器 `AsyncAnnotationBeanPostProcessor` 中会去创建 `AsyncAnnotationAdvisor` ， 在它的构造方法中，会构建对应的 `Advice` 和 `Pointcut` ，如下：

```JAVA
public class AsyncAnnotationAdvisor extends AbstractPointcutAdvisor implements BeanFactoryAware {

    private Advice advice; // 异步执行的 Advice
    private Pointcut pointcut; // 匹配 @Async 注解方法的切点

    // 构造函数
    public AsyncAnnotationAdvisor(/* 参数省略 */) {
        // 1. 创建 Advice，负责异步执行逻辑
        this.advice = buildAdvice(executor, exceptionHandler);
        // 2. 创建 Pointcut，选择要被增强的目标方法
        this.pointcut = buildPointcut(asyncAnnotationTypes);
    }

    // 创建 Advice
    protected Advice buildAdvice(/* 参数省略 */) {
        // 创建处理异步执行的拦截器
        AnnotationAsyncExecutionInterceptor interceptor = new AnnotationAsyncExecutionInterceptor(null);
        // 使用执行器和异常处理器配置拦截器
        interceptor.configure(executor, exceptionHandler);
        return interceptor;
    }

    // 创建 Pointcut
    protected Pointcut buildPointcut(Set<Class<? extends Annotation>> asyncAnnotationTypes) {
        ComposablePointcut result = null;
        for (Class<? extends Annotation> asyncAnnotationType : asyncAnnotationTypes) {
            // 1. 类级别切点：如果类上有注解则匹配
            Pointcut cpc = new AnnotationMatchingPointcut(asyncAnnotationType, true);
            // 2. 方法级别切点：如果方法上有注解则匹配
            Pointcut mpc = new AnnotationMatchingPointcut(null, asyncAnnotationType, true);

            if (result == null) {
                result = new ComposablePointcut(cpc);
            } else {
                // 使用 union 合并之前的切点
                result.union(cpc);
            }
            // 将方法级别切点添加到组合切点
            result = result.union(mpc);
        }
        // 返回组合切点，如果没有提供注解类型则返回 Pointcut.TRUE
        return (result != null ? result : Pointcut.TRUE);
    }
}
```

`AsyncAnnotationAdvisor` 的核心在于构建 `Advice` 和 `Pointcut` ：

- 构建 `Advice` ：会创建 `AnnotationAsyncExecutionInterceptor` 拦截器，在拦截器的 `invoke()` 方法中会执行通知的逻辑。
- 构建 `Pointcut` ：由 `ClassFilter` 和 `MethodMatcher` 组成，用于匹配哪些方法需要执行通知（ `Advice` ）的逻辑。

#### 后置处理逻辑

`AsyncAnnotationBeanPostProcessor` 后置处理器中实现的 `postProcessAfterInitialization()` 方法在其父类 `AbstractAdvisingBeanPostProcessor` 中，在 `Bean` 初始化之后，会进入到 `postProcessAfterInitialization()` 方法进行后置处理。

在后置处理方法中，会判断 `Bean` 是否符合后置处理器中 `Advisor` 通知的条件，如果符合，则创建代理对象。如下：

```JAVA
// AbstractAdvisingBeanPostProcessor
public Object postProcessAfterInitialization(Object bean, String beanName) {
	if (this.advisor == null || bean instanceof AopInfrastructureBean) {
		return bean;
	}
	if (bean instanceof Advised) {
		Advised advised = (Advised) bean;
		if (!advised.isFrozen() && isEligible(AopUtils.getTargetClass(bean))) {
			if (this.beforeExistingAdvisors) {
				advised.addAdvisor(0, this.advisor);
			}
			else {
				advised.addAdvisor(this.advisor);
			}
			return bean;
		}
	}
 // 判断给定的 Bean 是否符合后置处理器中 Advisor 通知的条件，符合的话，就创建代理对象。
	if (isEligible(bean, beanName)) {
		ProxyFactory proxyFactory = prepareProxyFactory(bean, beanName);
		if (!proxyFactory.isProxyTargetClass()) {
			evaluateProxyInterfaces(bean.getClass(), proxyFactory);
		}
  // 添加 Advisor。
		proxyFactory.addAdvisor(this.advisor);
		customizeProxyFactory(proxyFactory);
  // 返回代理对象。
		return proxyFactory.getProxy(getProxyClassLoader());
	}
	return bean;
}
```

### @Async 注解方法的拦截

`@Async` 注解方法的执行会在 `AnnotationAsyncExecutionInterceptor` 中被拦截，在 `invoke()` 方法中执行拦截器的逻辑。此时会将 `@Async` 注解标注的方法封装为异步任务，交给执行器来执行。

`invoke()` 方法在 `AnnotationAsyncExecutionInterceptor` 的父类 `AsyncExecutionInterceptor` 中定义，如下：

```JAVA
public class AsyncExecutionInterceptor extends AsyncExecutionAspectSupport implements MethodInterceptor, Ordered {
	@Override
	@Nullable
	public Object invoke(final MethodInvocation invocation) throws Throwable {
		Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);
		Method specificMethod = ClassUtils.getMostSpecificMethod(invocation.getMethod(), targetClass);
		final Method userDeclaredMethod = BridgeMethodResolver.findBridgedMethod(specificMethod);

  // 1、确定异步任务执行器
		AsyncTaskExecutor executor = determineAsyncExecutor(userDeclaredMethod);

  // 2、将要执行的方法封装为 Callable 异步任务
		Callable<Object> task = () -> {
			try {
    // 2.1、执行方法
				Object result = invocation.proceed();
    // 2.2、如果方法返回值是 Future 类型，阻塞等待结果
				if (result instanceof Future) {
					return ((Future<?>) result).get();
				}
			}
			catch (ExecutionException ex) {
				handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments());
			}
			catch (Throwable ex) {
				handleError(ex, userDeclaredMethod, invocation.getArguments());
			}
			return null;
		};
		// 3、提交任务
		return doSubmit(task, executor, invocation.getMethod().getReturnType());
	}
}
```

在 `invoke()` 方法中，主要有 3 个步骤：

1. 确定执行异步任务的执行器。
2. 将 `@Async` 注解标注的方法封装为 `Callable` 异步任务。
3. 将任务提交给执行器执行。

#### 1、获取异步任务执行器

在 `determineAsyncExecutor()` 方法中，会获取异步任务的执行器（即执行异步任务的 **线程池** ）。代码如下：

```JAVA
// 确定异步任务的执行器
protected AsyncTaskExecutor determineAsyncExecutor(Method method) {
 // 1、先从缓存中获取。
	AsyncTaskExecutor executor = this.executors.get(method);
	if (executor == null) {
		Executor targetExecutor;
  // 2、获取执行器的限定符。
		String qualifier = getExecutorQualifier(method);
		if (StringUtils.hasLength(qualifier)) {
   // 3、根据限定符获取对应的执行器。
			targetExecutor = findQualifiedExecutor(this.beanFactory, qualifier);
		}
		else {
   // 4、如果没有限定符，则使用默认的执行器。即 Spring 提供的默认线程池：SimpleAsyncTaskExecutor。
			targetExecutor = this.defaultExecutor.get();
		}
		if (targetExecutor == null) {
			return null;
		}
  // 5、将执行器包装为 TaskExecutorAdapter 适配器。
  // TaskExecutorAdapter 是 Spring 对于 JDK 线程池做的一层抽象，还是继承自 JDK 的线程池 Executor。这里可以不用管太多，只要知道它是线程池就可以了。
		executor = (targetExecutor instanceof AsyncListenableTaskExecutor ?
				(AsyncListenableTaskExecutor) targetExecutor : new TaskExecutorAdapter(targetExecutor));
		this.executors.put(method, executor);
	}
	return executor;
}
```

在 `determineAsyncExecutor()` 方法中确定了异步任务的执行器（线程池），主要是通过 `@Async` 注解的 `value` 值来获取执行器的限定符，根据限定符再去 `BeanFactory` 中查找对应的执行器就可以了。

如果在 `@Async` 注解中没有指定线程池，则会通过 `this.defaultExecutor.get()` 来获取默认的线程池，其中 `defaultExecutor` 在下边方法中进行赋值：

```JAVA
// AsyncExecutionInterceptor
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
 // 1、尝试从 beanFactory 中获取线程池。
	Executor defaultExecutor = super.getDefaultExecutor(beanFactory);
 // 2、如果 beanFactory 中没有，则创建 SimpleAsyncTaskExecutor 线程池。
	return (defaultExecutor != null ? defaultExecutor : new SimpleAsyncTaskExecutor());
}
```

其中 `super.getDefaultExecutor()` 会在 `beanFactory` 中尝试获取 `Executor` 类型的线程池。代码如下：

```JAVA
protected Executor getDefaultExecutor(@Nullable BeanFactory beanFactory) {
	if (beanFactory != null) {
		try {
   // 1、从 beanFactory 中获取 TaskExecutor 类型的线程池。
			return beanFactory.getBean(TaskExecutor.class);
		}
		catch (NoUniqueBeanDefinitionException ex) {
			try {
				// 2、如果有多个，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				if (logger.isInfoEnabled()) {
					// ...
				}
			}
		}
		catch (NoSuchBeanDefinitionException ex) {
			try {
    // 3、如果没有，则尝试从 beanFactory 中获取执行名称的 Executor 线程池。
				return beanFactory.getBean(DEFAULT_TASK_EXECUTOR_BEAN_NAME, Executor.class);
			}
			catch (NoSuchBeanDefinitionException ex2) {
				// ...
			}
		}
	}
	return null;
}
```

在 `getDefaultExecutor()` 中，如果从 `beanFactory` 获取线程池失败的话，则会创建 `SimpleAsyncTaskExecutor` 线程池。

该线程池的在每次执行异步任务时，都会创建一个新的线程去执行任务，并不会对线程进行复用，从而导致异步任务执行的开销很大。一旦在 `@Async` 注解标注的方法某一瞬间并发量剧增，应用就会大量创建线程，从而影响服务质量甚至出现服务不可用。

同一时刻如果向 `SimpleAsyncTaskExecutor` 线程池提交 10000 个任务，那么该线程池就会创建 10000 个线程，其的 `execute()` 方法如下：

```JAVA
// SimpleAsyncTaskExecutor：execute() 内部会调用 doExecute()
protected void doExecute(Runnable task) {
    // 创建新线程
    Thread thread = (this.threadFactory != null ? this.threadFactory.newThread(task) : createThread(task));
    thread.start();
}
```

**建议：在使用 `@Async` 时需要自己指定线程池，避免 Spring 默认线程池带来的风险。**

在 `@Async` 注解中的 `value` 指定了线程池的限定符，根据限定符可以获取 **自定义的线程池** 。获取限定符的代码如下：

```JAVA
// AnnotationAsyncExecutionInterceptor
protected String getExecutorQualifier(Method method) {
	// 1.从方法上获取 Async 注解。
	Async async = AnnotatedElementUtils.findMergedAnnotation(method, Async.class);
 // 2. 如果方法上没有找到 @Async 注解，则尝试从方法所在的类上获取 @Async 注解。
	if (async == null) {
		async = AnnotatedElementUtils.findMergedAnnotation(method.getDeclaringClass(), Async.class);
	}
 // 3. 如果找到了 @Async 注解，则获取注解的 value 值并返回，作为线程池的限定符。
 //    如果 "value" 属性值为空字符串，则使用默认的线程池。
 //    如果没有找到 @Async 注解，则返回 null，同样使用默认的线程池。
	return (async != null ? async.value() : null);
}
```

#### 2、将方法封装为异步任务

在 `invoke()` 方法获取执行器之后，会将方法封装为异步任务，代码如下：

```JAVA
// 将要执行的方法封装为 Callable 异步任务
Callable<Object> task = () -> {
    try {
        // 2.1、执行被拦截的方法 (proceed() 方法是 AOP 中的核心方法，用于执行目标方法)
        Object result = invocation.proceed();

        // 2.2、代理返回给调用方的是实际的异步 Future，而目标方法受方法签名约束，
        //     会先返回一个临时 Future，因此这里需要在工作线程中解包临时 Future 的结果。
        if (result instanceof Future) {
            return ((Future<?>) result).get(); // 阻塞等待 Future 的结果
        }
    }
    catch (ExecutionException ex) {
        // 2.3、处理 ExecutionException 异常。 ExecutionException 是 Future.get() 方法抛出的异常，
        handleError(ex.getCause(), userDeclaredMethod, invocation.getArguments()); // 处理原始异常
    }
    catch (Throwable ex) {
        // 2.4、处理其他类型的异常。 将异常、被拦截的方法和方法参数作为参数调用 handleError() 方法进行处理。
        handleError(ex, userDeclaredMethod, invocation.getArguments());
    }
    // 2.5、如果方法返回值不是 Future 类型，或者发生异常，则返回 null。
    return null;
};
```

相比于 `Runnable` ，`Callable` 可以返回结果，并且抛出异常。

将 `invocation.proceed()` 的执行（原方法的执行）封装为 `Callable` 异步任务。这里仅仅当 `result` （方法返回值）类型为 `Future` 才返回，如果是其他类型则直接返回 `null` 。

因此使用 `@Async` 注解标注的方法如果使用 `Future` 类型之外的返回值，则无法获取方法的执行结果。

#### 3、提交异步任务

在 `AsyncExecutionInterceptor#invoke()` 中将要执行的方法封装为 Callable 任务之后，就会将任务交给执行器来执行。下面是 Spring Framework 5.3.x 的 `doSubmit()` 源码节选，其中包含后来被弃用并移除的 `ListenableFuture` 相关 API：

```JAVA
protected Object doSubmit(Callable<Object> task, AsyncTaskExecutor executor, Class<?> returnType) {
    // 根据方法的返回值类型，选择不同的异步执行方式并返回结果。
    // 1. 如果方法返回值是 CompletableFuture 类型
    if (CompletableFuture.class.isAssignableFrom(returnType)) {
        // 使用 CompletableFuture.supplyAsync() 方法异步执行任务。
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            }
            catch (Throwable ex) {
                throw new CompletionException(ex); // 将异常包装为 CompletionException，以便在 future.get() 时抛出
            }
        }, executor);
    }
    // 2. 如果方法返回值是 ListenableFuture 类型
    else if (ListenableFuture.class.isAssignableFrom(returnType)) {
        // 将 AsyncTaskExecutor 强制转换为 AsyncListenableTaskExecutor，
        // 并调用 submitListenable() 方法提交任务。
        // AsyncListenableTaskExecutor 是 ListenableFuture 的专用异步执行器，
        // 它可以返回一个 ListenableFuture 对象，允许添加回调函数来监听任务的完成。
        return ((AsyncListenableTaskExecutor) executor).submitListenable(task);
    }
    // 3. 如果方法返回值是 Future 类型
    else if (Future.class.isAssignableFrom(returnType)) {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务，并返回一个 Future 对象。
        return executor.submit(task);
    }
    // 4. 如果方法返回值是 void 或其他类型
    else {
        // 直接调用 AsyncTaskExecutor 的 submit() 方法提交任务。
        // 由于方法返回值是 void，因此不需要返回任何结果，直接返回 null。
        executor.submit(task);
        return null;
    }
}
```

在 `doSubmit()` 方法中，会根据 `@Async` 注解标注方法的返回值不同，来选择不同的任务提交方式，最后任务会由执行器（线程池）执行。

### 总结

![Async原理总结](./images/Async 注解原理分析/async.png)

理解 `@Async` 原理的核心在于理解 `@EnableAsync` 注解，该注解开启了异步任务的功能。

主要流程如上图，会通过后置处理器来创建代理对象，之后代理对象中 `@Async` 方法的执行会走到 `Advice` 内部的拦截器中，之后将方法封装为异步任务，并提交线程池进行处理。

## @Async 使用建议

### 自定义线程池

如果没有显式地配置线程池，在 `@Async` 底层会先在 `BeanFactory` 中尝试获取线程池，如果获取不到，则会创建一个 `SimpleAsyncTaskExecutor` 实现。`SimpleAsyncTaskExecutor` 本质上不算是一个真正的线程池，因为它对于每个请求都会启动一个新线程而不重用现有线程，这会带来一些潜在的问题，例如资源消耗过大。

具体线程池获取可以参考这篇文章：[浅析 Spring 中 Async 注解底层异步线程池原理｜得物技术](https://mp.weixin.qq.com/s/FySv5L0bCdrlb5MoSfQtAA)。

一定要显式配置一个线程池，推荐`ThreadPoolTaskExecutor`。并且，还可以根据任务的性质和需求，为不同的异步方法指定不同的线程池。

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "executor1")
    public Executor executor1() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(3);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("AsyncExecutor1-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "executor2")
    public Executor executor2() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("AsyncExecutor2-");
        executor.initialize();
        return executor;
    }
}
```

`@Async` 注解中指定线程池的 Bean 名称：

```java
@Service
public class AsyncService {

    @Async("executor1")
    public void performTask1() {
        // 任务1的逻辑
        System.out.println("Executing Task1 with Executor1");
    }

    @Async("executor2")
    public void performTask2() {
        // 任务2的逻辑
        System.out.println("Executing Task2 with Executor2");
    }
}
```

### 避免 @Async 注解失效

`@Async` 注解会在以下几个场景失效，需要注意：

**1、同一类中调用异步方法**

如果你在同一个类内部调用一个`@Async`注解的方法，那这个方法将不会异步执行。

```java
@Service
public class MyService {

    public void myMethod() {
        // 直接通过 this 引用调用，绕过了 Spring 的代理机制，异步执行失效
        asyncMethod();
    }

    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}
```

这是因为 Spring 的异步机制是通过 **代理** 实现的，而在同一个类内部的方法调用会绕过 Spring 的代理机制，也就是绕过了代理对象，直接通过 this 引用调用的。由于没有经过代理，所有的代理相关的处理（即将任务提交线程池异步执行）都不会发生。

为了避免这个问题，比较推荐的做法是将异步方法移至另一个 Spring Bean 中。

```java
@Service
public class AsyncService {
    @Async
    public void asyncMethod() {
        // 异步执行的逻辑
    }
}

@Service
public class MyService {
    @Autowired
    private AsyncService asyncService;

    public void myMethod() {
        asyncService.asyncMethod();
    }
}
```

**2、使用 static 关键字修饰异步方法**

如果`@Async`注解的方法被 `static` 关键字修饰，那这个方法将不会异步执行。

这是因为 Spring 的异步机制是通过代理实现的，由于静态方法不属于实例而是属于类且不参与继承，Spring 的代理机制（无论是基于 JDK 还是 CGLIB）无法拦截静态方法来提供如异步执行这样的增强功能。

篇幅问题，这里没有进一步详细介绍，不了解的代理机制的朋友，可以看看我写的 [Java 代理模式详解](https://javaguide.cn/java/基础/proxy.html)这篇文章。

如果你需要异步执行一个静态方法的逻辑，可以考虑设计一个非静态的包装方法，这个包装方法使用 `@Async` 注解，并在其内部调用静态方法

```java
@Service
public class AsyncService {

    @Async
    public void asyncWrapper() {
        // 调用静态方法
        SClass.staticMethod();
    }
}

public class SClass {
    public static void staticMethod() {
        // 执行一些操作
    }
}
```

**3、忘记开启异步支持**

Spring Boot 默认情况下不启用异步支持，确保在主配置类 `Application` 上添加`@EnableAsync`注解以启用异步功能。

```java
@SpringBootApplication
@EnableAsync
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**4、`@Async` 注解的方法所在的类必须是 Spring Bean**

`@Async` 注解的方法必须位于 Spring 管理的 Bean 中，只有这样，Spring 才能在创建 Bean 时应用代理，代理能够拦截方法调用并实现异步执行的逻辑。如果该方法不在 Spring 管理的 bean 中，Spring 就无法创建必要的代理，`@Async` 注解就不会产生任何效果。

### 返回值类型

建议将 `@Async` 注解方法的返回值类型定义为 `void` 和 `Future` 。

- 如果不需要获取异步方法返回的结果，将返回值类型定义为 `void` 。
- 如果需要获取异步方法返回的结果，将返回值类型定义为 `Future`（通常使用 `CompletableFuture`）。`ListenableFuture` 属于旧版 Spring API，不应在 Spring 6.1 及以上版本中继续使用。

如果将 `@Async` 注解方法的返回值定义为其他类型（如 `Object` 、 `String` 等等），则无法获取方法返回值。

这种设计符合异步编程的基本原则，即调用者不应立即期待一个结果，而是应该能够在未来某个时间点获取结果。如果返回类型是 `Future`，调用者可以使用这个返回的 `Future` 对象来查询任务的状态，取消任务，或者在任务完成时获取结果。

### 处理异步方法中的异常

异步方法中抛出的异常不会直接由调用线程捕获。返回 `Future` 或 `CompletableFuture` 的异步方法会通过 Future 暴露异常，可以使用 `get()`、`join()` 或 `CompletableFuture` 的异常处理方法处理；返回 `void` 的异步方法无法把异常传给调用者，可以配置全局的 `AsyncUncaughtExceptionHandler`。

```java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer{

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new CustomAsyncExceptionHandler();
    }

}

// 自定义异常处理器
class CustomAsyncExceptionHandler implements AsyncUncaughtExceptionHandler {

    @Override
    public void handleUncaughtException(Throwable ex, Method method, Object... params) {
        // 日志记录或其他处理逻辑
    }
}
```

### 未考虑事务管理

`@Async`注解的方法需要事务支持时，务必在该异步方法上独立使用。

```java
@Service
public class AsyncTransactionalService {

    @Async
    // Propagation.REQUIRES_NEW 表示 Spring 在执行异步方法时开启一个新的、与当前事务无关的事务
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void asyncTransactionalMethod() {
        // 这里的操作会在新的事务中执行
        // 执行一些数据库操作
    }
}
```

### 未指定异步方法执行顺序

`@Async`注解的方法执行是非阻塞的，它们可能以任意顺序完成。如果需要按照特定的顺序处理结果，你可以将方法的返回值设定为 `Future` 或 `CompletableFuture` ，通过返回值对象来实现一个方法在另一个方法完成后再执行。

```java
@Async
public CompletableFuture<String> fetchDataAsync() {
    return CompletableFuture.completedFuture("Data");
}

@Async
public CompletableFuture<String> processDataAsync(String data) {
    // 方法本身已经由 @Async 调度到受 Spring 管理的执行器，不要再提交到 commonPool。
    return CompletableFuture.completedFuture("Processed " + data);
}
```

`processDataAsync` 方法在 `fetchDataAsync`后执行：

```java
CompletableFuture<String> dataFuture = asyncService.fetchDataAsync();
dataFuture.thenCompose(data -> asyncService.processDataAsync(data))
          .thenAccept(result -> System.out.println(result));
```

##


---

---

<!-- source: 框架/spring/IoC & AOP详解（快速搞懂）.md -->

## [21] IoC & AOP详解（快速搞懂）

---
title: IoC & AOP详解（快速搞懂）
description: Spring IoC与AOP核心原理详解，深入讲解控制反转、依赖注入、切面编程及动态代理的实现机制。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: IoC,DI,AOP,Spring IoC容器,依赖注入,切面编程,动态代理,Spring原理
---

这篇文章会从下面从以下几个问题展开对 IoC & AOP 的解释

- 什么是 IoC？
- IoC 解决了什么问题？
- IoC 和 DI 的区别？
- 什么是 AOP？
- AOP 解决了什么问题？
- AOP 的应用场景有哪些？
- AOP 为什么叫做切面编程？
- AOP 实现方式有哪些？

首先声明：IoC & AOP 不是 Spring 提出来的，它们在 Spring 之前其实已经存在了，只不过当时更加偏向于理论。Spring 在技术层次将这两个思想进行了很好的实现。

## IoC （Inversion of control ）

### 什么是 IoC?

IoC （Inversion of Control ）即控制反转/反转控制。它是一种思想不是一个技术实现。描述的是：Java 开发领域对象的创建以及管理的问题。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面去取即可。

从以上两种开发方式的对比来看：我们 “丧失了一个权力” (创建、管理对象的权力)，从而也得到了一个好处（不用再考虑对象的创建、管理等一系列的事情）

**为什么叫控制反转?**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（IoC 容器）

![IoC 图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration.png)

### IoC 解决了什么问题?

IoC 的思想就是两方之间不互相依赖，由第三方容器来管理相关资源。这样有什么好处呢？

1. 对象之间的耦合度或者说依赖程度降低；
2. 资源变的容易管理；比如你用 Spring 容器提供的话很容易就可以实现一个单例。

例如：现有一个针对 User 的操作，利用 Service 和 Dao 两层结构进行开发

在没有使用 IoC 思想的情况下，Service 层想要使用 Dao 层的具体实现的话，需要通过 new 关键字在`UserServiceImpl` 中手动 new 出 `IUserDao` 的具体实现类 `UserDaoImpl`（不能直接 new 接口类）。

很完美，这种方式也是可以实现的，但是我们想象一下如下场景：

开发过程中突然接到一个新的需求，针对`IUserDao` 接口开发出另一个具体实现类。因为 Server 层依赖了`IUserDao`的具体实现，所以我们需要修改`UserServiceImpl`中 new 的对象。如果只有一个类引用了`IUserDao`的具体实现，可能觉得还好，修改起来也不是很费力气，但是如果有许许多多的地方都引用了`IUserDao`的具体实现的话，一旦需要更换`IUserDao` 的实现方式，那修改起来将会非常的头疼。

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao-service.png)

使用 IoC 的思想，我们将对象的控制权（创建、管理）交由 IoC 容器去管理，我们在使用的时候直接向 IoC 容器 “要” 就可以了

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao.png)

### IoC 和 DI 有区别吗？

IoC（Inverse of Control:控制反转）是一种设计思想或者说是某种模式。这个设计思想就是 **将原本在程序中手动创建对象的控制权交给第三方比如 IoC 容器。** 对于我们常用的 Spring 框架来说， IoC 容器实际上就是个 Map（key，value）,Map 中存放的是各种对象。不过，IoC 在其他语言中也有应用，并非 Spring 特有。

IoC 最常见以及最合理的实现方式叫做依赖注入（Dependency Injection，简称 DI）。

老马（Martin Fowler）在一篇文章中提到将 IoC 改名为 DI，原文如下，原文地址：<https://martinfowler.com/articles/injection.html> 。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/martin-fowler-injection.png)

老马的大概意思是 IoC 太普遍并且不表意，很多人会因此而迷惑，所以，使用 DI 来精确指名这个模式比较好。

## AOP（Aspect oriented programming）

这里不会涉及太多专业的术语，核心目的是将 AOP 的思想说清楚。

### 什么是 AOP？

AOP（Aspect Oriented Programming）即面向切面编程，AOP 是 OOP（面向对象编程）的一种延续，二者互补，并不对立。

AOP 的目的是将横切关注点（如日志记录、事务管理、权限控制、接口限流、接口幂等等）从核心业务逻辑中分离出来，通过动态代理、字节码操作等技术，实现代码的复用和解耦，提高代码的可维护性和可扩展性。OOP 的目的是将业务逻辑按照对象的属性和行为进行封装，通过类、对象、继承、多态等概念，实现代码的模块化和层次化（也能实现代码的复用），提高代码的可读性和可维护性。

### AOP 为什么叫面向切面编程？

AOP 之所以叫面向切面编程，是因为它的核心思想就是将横切关注点从核心业务逻辑中分离出来，形成一个个的**切面（Aspect）**。

![面向切面编程图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aop-program-execution.jpg)

这里顺带总结一下 AOP 关键术语（不理解也没关系，可以继续往下看）：

- **横切关注点（cross-cutting concerns）** ：多个类或对象中的公共行为（如日志记录、事务管理、权限控制、接口限流、接口幂等等）。
- **切面（Aspect）**：对横切关注点进行封装的类，一个切面是一个类。切面可以定义多个通知，用来实现具体的功能。
- **连接点（JoinPoint）**：连接点是方法调用或者方法执行时的某个特定时刻（如方法调用、异常抛出等）。
- **通知（Advice）**：通知就是切面在某个连接点要执行的操作。通知有五种类型，分别是前置通知（Before）、后置通知（After）、返回通知（AfterReturning）、异常通知（AfterThrowing）和环绕通知（Around）。前四种通知都是在目标方法的前后执行，而环绕通知可以控制目标方法的执行过程。
- **切点（Pointcut）**：一个切点是一个表达式，它用来匹配哪些连接点需要被切面所增强。切点可以通过注解、正则表达式、逻辑运算等方式来定义。比如 `execution(* com.xyz.service..*(..))`匹配 `com.xyz.service` 包及其子包下的类或接口。
- **织入（Weaving）**：织入是将切面和目标对象连接起来的过程，也就是将通知应用到切点匹配的连接点上。常见的织入时机有两种，分别是编译期织入（Compile-Time Weaving 如：AspectJ）和运行期织入（Runtime Weaving 如：AspectJ、Spring AOP）。

### AOP 常见的通知类型有哪些？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aspectj-advice-types.jpg)

- **Before**（前置通知）：目标对象的方法调用之前触发
- **After** （后置通知）：目标对象的方法调用之后触发
- **AfterReturning**（返回通知）：目标对象的方法调用完成，在返回结果值之后触发
- **AfterThrowing**（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- **Around** （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### AOP 解决了什么问题？

OOP 不能很好地处理一些分散在多个类或对象中的公共行为（如日志记录、事务管理、权限控制、接口限流、接口幂等等），这些行为通常被称为 **横切关注点（cross-cutting concerns）** 。如果我们在每个类或对象中都重复实现这些行为，那么会导致代码的冗余、复杂和难以维护。

AOP 可以将横切关注点（如日志记录、事务管理、权限控制、接口限流、接口幂等等）从 **核心业务逻辑（core concerns，核心关注点）** 中分离出来，实现关注点的分离。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/crosscut-logic-and-businesslogic-separation%20%20%20%20%20%20.png)

以日志记录为例进行介绍，假如我们需要对某些方法进行统一格式的日志记录，没有使用 AOP 技术之前，我们需要挨个写日志记录的逻辑代码，全是重复的逻辑。

```java
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

public CommonResponse<Object> method2() {
      // 业务逻辑
      xxService.method2();
      // 省略具体的业务处理逻辑
      // 日志记录
      ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
      HttpServletRequest request = attributes.getRequest();
      // 省略记录日志的具体逻辑 如：获取各种信息，写入数据库等操作...
      return CommonResponse.success();
}

// ...
```

使用 AOP 技术之后，我们可以将日志记录的逻辑封装成一个切面，然后通过切入点和通知来指定在哪些方法需要执行日志记录的操作。

```java

// 日志注解
@Target({ElementType.PARAMETER,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 描述
     */
    String description() default "";

    /**
     * 方法类型 INSERT DELETE UPDATE OTHER
     */
    MethodType methodType() default MethodType.OTHER;
}

// 日志切面
@Component
@Aspect
public class LogAspect {
  // 切入点，所有被 Log 注解标注的方法
  @Pointcut("@annotation(cn.javaguide.annotation.Log)")
  public void webLog() {
  }

   /**
   * 环绕通知
   */
  @Around("webLog()")
  public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
    // 省略具体的处理逻辑
  }

  // 省略其他代码
}
```

这样的话，我们一行注解即可实现日志记录：

```java
@Log(description = "method1",methodType = MethodType.INSERT)
public CommonResponse<Object> method1() {
      // 业务逻辑
      xxService.method1();
      // 省略具体的业务处理逻辑
      return CommonResponse.success();
}
```

### AOP 的应用场景有哪些？

- 日志记录：自定义日志记录注解，利用 AOP，一行代码即可实现日志记录。
- 性能统计：利用 AOP 在目标方法的执行前后统计方法的执行时间，方便优化和分析。
- 事务管理：`@Transactional` 注解可以让 Spring 为我们进行事务管理比如回滚异常操作，免去了重复的事务管理逻辑。`@Transactional`注解就是基于 AOP 实现的。
- 权限控制：利用 AOP 在目标方法执行前判断用户是否具备所需要的权限，如果具备，就执行目标方法，否则就不执行。例如，SpringSecurity 利用`@PreAuthorize` 注解一行代码即可自定义权限校验。
- 接口限流：利用 AOP 在目标方法执行前通过具体的限流算法和实现对请求进行限流处理。
- 缓存管理：利用 AOP 在目标方法执行前后进行缓存的读取和更新。
- ……

### AOP 实现方式有哪些？

AOP 的常见实现方式有动态代理、字节码操作等方式。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 CGLIB 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/230ae587a322d6e4d09510161987d346.jpeg)

**Spring Boot 和 Spring 的动态代理的策略是不是也是一样的呢？**其实不一样，很多人都理解错了。

Spring Boot 2.0 之前，`spring.aop.proxy-target-class` 默认值为 `false`，有用户接口时通常使用 **JDK 动态代理**；如果目标类没有可用接口，Spring AOP 仍会回退到 **CGLIB 动态代理**，并不会仅仅因为目标类没有实现接口就抛出异常。Spring Boot 1.5.x 自动配置 AOP 代码如下：

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 JDK 动态代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = true)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 时才会生效。
 // 即开发者通过属性配置明确指定使用 CGLIB 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = false)
	public static class CglibAutoProxyConfiguration {

	}

}
```

Spring Boot 2.0 开始，如果用户什么都不配置的话，默认使用 **CGLIB 动态代理**。如果需要强制使用 JDK 动态代理，可以在配置文件中添加：`spring.aop.proxy-target-class=false`。Spring Boot 2.0 自动配置 AOP 代码如下：

```java
@Configuration
@ConditionalOnClass({ EnableAspectJAutoProxy.class, Aspect.class, Advice.class,
		AnnotatedElement.class })
@ConditionalOnProperty(prefix = "spring.aop", name = "auto", havingValue = "true", matchIfMissing = true)
public class AopAutoConfiguration {

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = false)
 // 该配置类只有在 spring.aop.proxy-target-class=false 时才会生效。
 // 即开发者通过属性配置明确指定使用 JDK 动态代理时，Spring 会加载这个配置类。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "false", matchIfMissing = false)
	public static class JdkDynamicAutoProxyConfiguration {

	}

	@Configuration
	@EnableAspectJAutoProxy(proxyTargetClass = true)
 // 该配置类只有在 spring.aop.proxy-target-class=true 或未显式配置时才会生效。
 // 也就是说，如果开发者未明确选择代理方式，Spring 会默认加载 CGLIB 代理。
	@ConditionalOnProperty(prefix = "spring.aop", name = "proxy-target-class", havingValue = "true", matchIfMissing = true)
	public static class CglibAutoProxyConfiguration {

	}

}
```

当然你也可以使用 **AspectJ** ！Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

**Spring AOP 属于运行时增强，AspectJ 支持编译时、后编译以及类加载时织入。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单。

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

## 参考

- AOP in Spring Boot, is it a JDK dynamic proxy or a Cglib dynamic proxy?：<https://www.springcloud.io/post/2022-01/springboot-aop/>
- Spring Proxying Mechanisms：<https://docs.spring.io/spring-framework/reference/core/aop/proxying.html>


---

---

<!-- source: 框架/spring/Spring 事务详解.md -->

## [22] Spring 事务详解

---
title: Spring 事务详解
description: Spring事务管理详解，涵盖@Transactional注解、事务传播行为、隔离级别、事务失效场景及回滚规则。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring事务,@Transactional,事务传播,隔离级别,事务失效,回滚规则,声明式事务,AOP事务
---

前段时间答应读者的 **Spring 事务** 分析总结终于来了。这部分内容比较重要，不论是对于工作还是面试，但是网上比较好的参考资料比较少。

## 什么是事务？

**事务是逻辑上的一组操作，要么都执行，要么都不执行。**

相信大家应该都能背上面这句话了，下面我结合我们日常的真实开发来谈一谈。

我们系统的每个业务方法可能包括了多个原子性的数据库操作，比如下面的 `savePerson()` 方法中就有两个原子性的数据库操作。这些原子性的数据库操作是有依赖的，它们要么都执行，要不就都不执行。

```java
  public void savePerson() {
    personDao.save(person);
    personDetailDao.save(personDetail);
  }
```

另外，需要格外注意的是：**事务能否生效数据库引擎是否支持事务是关键。比如常用的 MySQL 数据库默认使用支持事务的 `innodb`引擎。但是，如果把数据库引擎变为 `myisam`，那么程序也就不再支持事务了！**

事务最经典也经常被拿出来说例子就是转账了。假如小明要给小红转账 1000 元，这个转账会涉及到两个关键操作就是：

> 1. 将小明的余额减少 1000 元。
> 2. 将小红的余额增加 1000 元。

万一在这两个操作之间突然出现错误比如银行系统崩溃或者网络故障，导致小明余额减少而小红的余额没有增加，这样就不对了。事务就是保证这两个关键操作要么都成功，要么都要失败。

![事务示意图](https://oss.javaguide.cn/github/javaguide/mysql/%E4%BA%8B%E5%8A%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

```java
public class OrdersService {
  private AccountDao accountDao;

  public void setOrdersDao(AccountDao accountDao) {
    this.accountDao = accountDao;
  }

  @Transactional(propagation = Propagation.REQUIRED,
                isolation = Isolation.DEFAULT, readOnly = false, timeout = -1)
  public void accountMoney() {
    //小红账户多1000
    accountDao.addMoney(1000,xiaohong);
    //模拟突然出现的异常，比如银行中可能为突然停电等等
    //如果没有配置事务管理的话会造成，小红账户多了1000而小明账户没有少钱
    int i = 10 / 0;
    //小王账户少1000
    accountDao.reduceMoney(1000,xiaoming);
  }
}
```

另外，数据库事务的 ACID 四大特性是事务的基础，下面简单来了解一下。

## 事务的特性（ACID）了解么?

1. **原子性**（`Atomicity`）：事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；
2. **一致性**（`Consistency`）：执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
3. **隔离性**（`Isolation`）：并发访问数据库时，一个用户的事务不被其他事务所干扰，各并发事务之间数据库是独立的；
4. **持久性**（`Durability`）：一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

🌈 这里要额外补充一点：**只有保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。也就是说 A、I、D 是手段，C 是目的！** 想必大家也和我一样，被 ACID 这个概念被误导了很久! 我也是看周志明老师的公开课[《周志明的软件架构课》](https://time.geekbang.org/opencourse/项目介绍/100064201)才搞清楚的（多看好书！！！）。

![AID->C](https://oss.javaguide.cn/github/javaguide/mysql/AID->C.png)

另外，DDIA 也就是 [《Designing Data-Intensive Application（数据密集型应用系统设计）》](https://book.douban.com/subject/30329536/) 的作者在他的这本书中如是说：

> Atomicity, isolation, and durability are properties of the database, whereas consis‐ tency (in the ACID sense) is a property of the application. The application may rely on the database’s atomicity and isolation properties in order to achieve consistency, but it’s not up to the database alone.
>
> 翻译过来的意思是：原子性，隔离性和持久性是数据库的属性，而一致性（在 ACID 意义上）是应用程序的属性。应用可能依赖数据库的原子性和隔离属性来实现一致性，但这并不仅取决于数据库。因此，字母 C 不属于 ACID 。

《Designing Data-Intensive Application（数据密集型应用系统设计）》这本书强推一波，值得读很多遍！豆瓣有接近 90% 的人看了这本书之后给了五星好评。另外，中文翻译版本已经在 GitHub 开源，地址：[https://github.com/Vonng/ddia](https://github.com/Vonng/ddia) 。

## 详谈 Spring 对事务的支持

> ⚠️ 再提醒一次：你的程序是否支持事务首先取决于数据库 ，比如使用 MySQL 的话，如果你选择的是 innodb 引擎，那么恭喜你，是可以支持事务的。但是，如果你的 MySQL 数据库使用的是 myisam 引擎的话，那不好意思，从根上就是不支持事务的。

这里再多提一下一个非常重要的知识点：**MySQL 怎么保证原子性的？**

我们知道如果想要保证事务的原子性，就需要在异常发生时，对已经执行的操作进行**回滚**，在 MySQL 中，恢复机制是通过 **回滚日志（undo log）** 实现的，所有事务进行的修改都会先记录到这个回滚日志中，然后再执行相关的操作。如果执行过程中遇到异常的话，我们直接利用 **回滚日志** 中的信息将数据回滚到修改之前的样子即可！并且，回滚日志会先于数据持久化到磁盘上。这样就保证了即使遇到数据库突然宕机等情况，当用户再次启动数据库的时候，数据库还能够通过查询回滚日志来回滚之前未完成的事务。

### Spring 支持两种方式的事务管理

#### 编程式事务管理

通过 `TransactionTemplate`或者`TransactionManager`手动管理事务，实际应用中很少使用，但是对于你理解 Spring 事务管理原理有帮助。

使用`TransactionTemplate` 进行编程式事务管理的示例代码如下：

```java
@Autowired
private TransactionTemplate transactionTemplate;
public void testTransaction() {

        transactionTemplate.execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus transactionStatus) {

                try {

                    // ....  业务代码
                } catch (Exception e){
                    //回滚
                    transactionStatus.setRollbackOnly();
                }

            }
        });
}
```

使用 `TransactionManager` 进行编程式事务管理的示例代码如下：

```java
@Autowired
private PlatformTransactionManager transactionManager;

public void testTransaction() {

  TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());
          try {
               // ....  业务代码
              transactionManager.commit(status);
          } catch (Exception e) {
              transactionManager.rollback(status);
          }
}
```

#### 声明式事务管理

推荐使用（代码侵入性最小），实际是通过 AOP 实现（基于`@Transactional` 的全注解方式使用最多）。

使用 `@Transactional`注解进行事务管理的示例代码如下：

```java
@Transactional(propagation = Propagation.REQUIRED)
public void aMethod() {
  //do something
  B b = new B();
  C c = new C();
  b.bMethod();
  c.cMethod();
}
```

### Spring 事务管理接口介绍

Spring 框架中，事务管理相关最重要的 3 个接口如下：

- **`PlatformTransactionManager`**：（平台）事务管理器，Spring 事务策略的核心。
- **`TransactionDefinition`**：事务定义信息（事务隔离级别、传播行为、超时、只读等）。
- **`TransactionStatus`**：事务运行状态。

我们可以把 **`PlatformTransactionManager`** 接口可以被看作是事务上层的管理者，而 **`TransactionDefinition`** 和 **`TransactionStatus`** 这两个接口可以看作是事务的描述。

**`PlatformTransactionManager`** 会根据 **`TransactionDefinition`** 的定义比如事务超时时间、隔离级别、传播行为等来进行事务管理 ，而 **`TransactionStatus`** 接口则提供了一些方法来获取事务相应的状态比如是否新事务、是否可以回滚等等。

#### PlatformTransactionManager:事务管理接口

**Spring 并不直接管理事务，而是提供了多种事务管理器** 。Spring 事务管理器的接口是：**`PlatformTransactionManager`** 。

通过这个接口，Spring 为各个平台如：JDBC(`DataSourceTransactionManager`)、Hibernate(`HibernateTransactionManager`)、JPA(`JpaTransactionManager`)等都提供了对应的事务管理器，但是具体的实现就是各个平台自己的事情了。

**`PlatformTransactionManager` 接口的具体实现如下:**

![](./images/Spring 事务详解/PlatformTransactionManager.png)

`PlatformTransactionManager`接口中定义了三个方法：

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface PlatformTransactionManager {
    //获得事务
    TransactionStatus getTransaction(@Nullable TransactionDefinition var1) throws TransactionException;
    //提交事务
    void commit(TransactionStatus var1) throws TransactionException;
    //回滚事务
    void rollback(TransactionStatus var1) throws TransactionException;
}

```

**这里多插一嘴。为什么要定义或者说抽象出来`PlatformTransactionManager`这个接口呢？**

主要是因为要将事务管理行为抽象出来，然后不同的平台去实现它，这样我们可以保证提供给外部的行为不变，方便我们扩展。

我前段时间在我的[知识星球](https://javaguide.cn/关于作者/zhishixingqiu-two-years.html)分享过：**“为什么我们要用接口？”** 。

> 《设计模式》（GOF 那本）这本书在很多年前都提到过说要基于接口而非实现编程，你真的知道为什么要基于接口编程么？
>
> 纵观开源框架和项目的源码，接口是它们不可或缺的重要组成部分。要理解为什么要用接口，首先要搞懂接口提供了什么功能。我们可以把接口理解为提供了一系列功能列表的约定，接口本身不提供功能，它只定义行为。但是谁要用，就要先实现我，遵守我的约定，然后再自己去实现我定义的要实现的功能。
>
> 举个例子，我上个项目有发送短信的需求，为此，我们定了一个接口，接口只有两个方法:
>
> 1.发送短信 2.处理发送结果的方法。
>
> 刚开始我们用的是阿里云短信服务，然后我们实现这个接口完成了一个阿里云短信的服务。后来，我们突然又换到了别的短信服务平台，我们这个时候只需要再实现这个接口即可。这样保证了我们提供给外部的行为不变。几乎不需要改变什么代码，我们就轻松完成了需求的转变，提高了代码的灵活性和可扩展性。
>
> 什么时候用接口？当你要实现的功能模块设计抽象行为的时候，比如发送短信的服务，图床的存储服务等等。

#### TransactionDefinition:事务属性

事务管理器接口 **`PlatformTransactionManager`** 通过 **`getTransaction(TransactionDefinition definition)`** 方法来得到一个事务，这个方法里面的参数是 **`TransactionDefinition`** 类 ，这个类就定义了一些基本的事务属性。

**什么是事务属性呢？** 事务属性可以理解成事务的一些基本配置，描述了事务策略如何应用到方法上。

`TransactionDefinition` 主要包含以下 4 个事务配置方面：

- 隔离级别
- 传播行为
- 是否只读
- 事务超时

此外，`getName()` 方法可以返回事务名称。回滚规则不属于 `TransactionDefinition` 本身；Spring 声明式事务使用的 `TransactionAttribute` 继承了 `TransactionDefinition`，并在其上增加回滚规则等能力。

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    int TIMEOUT_DEFAULT = -1;
    // 返回事务的传播行为，默认值为 REQUIRED。
    int getPropagationBehavior();
    //返回事务的隔离级别，默认值是 DEFAULT
    int getIsolationLevel();
    // 返回事务的超时时间，默认值为-1。如果超过该时间限制但事务还没有完成，则自动回滚事务。
    int getTimeout();
    // 返回是否为只读事务，默认值为 false
    boolean isReadOnly();

    @Nullable
    String getName();
}
```

#### TransactionStatus:事务状态

`TransactionStatus`接口用来记录事务的状态 该接口定义了一组方法,用来获取或判断事务的相应状态信息。

`PlatformTransactionManager.getTransaction(…)`方法返回一个 `TransactionStatus` 对象。

**TransactionStatus 接口内容如下：**

```java
public interface TransactionStatus{
    boolean isNewTransaction(); // 是否是新的事务
    boolean hasSavepoint(); // 是否有恢复点
    void setRollbackOnly();  // 设置为只回滚
    boolean isRollbackOnly(); // 是否为只回滚
    boolean isCompleted(); // 是否已完成
}
```

### 事务属性详解

实际业务开发中，大家一般都是使用 `@Transactional` 注解来开启事务，很多人并不清楚这个注解里面的参数是什么意思，有什么用。为了更好的在项目中使用事务管理，强烈推荐好好阅读一下下面的内容。

#### 事务传播行为

**事务传播行为是为了解决业务层方法之间互相调用的事务问题**。

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。

举个例子：我们在 A 类的`aMethod()`方法中调用了 B 类的 `bMethod()` 方法。这个时候就涉及到业务层方法之间互相调用的事务问题。如果我们的 `bMethod()`如果发生异常需要回滚，如何配置事务传播行为才能让 `aMethod()`也跟着回滚呢？这个时候就需要事务传播行为的知识了，如果你不知道的话一定要好好看一下。

下面的传播行为代码均为省略 import 和部分实现细节的示意片段，其中 `Propagation.xxx` 是待替换的占位符，不是可直接编译的完整类。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.xxx)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.xxx)
    public void bMethod() {
       //do something
    }
}
```

在`TransactionDefinition`定义中包括了如下几个表示传播行为的常量：

```java
public interface TransactionDefinition {
    int PROPAGATION_REQUIRED = 0;
    int PROPAGATION_SUPPORTS = 1;
    int PROPAGATION_MANDATORY = 2;
    int PROPAGATION_REQUIRES_NEW = 3;
    int PROPAGATION_NOT_SUPPORTED = 4;
    int PROPAGATION_NEVER = 5;
    int PROPAGATION_NESTED = 6;
    ......
}
```

不过，为了方便使用，Spring 相应地定义了一个枚举类：`Propagation`

```java
package org.springframework.transaction.annotation;

import org.springframework.transaction.TransactionDefinition;

public enum Propagation {

    REQUIRED(TransactionDefinition.PROPAGATION_REQUIRED),

    SUPPORTS(TransactionDefinition.PROPAGATION_SUPPORTS),

    MANDATORY(TransactionDefinition.PROPAGATION_MANDATORY),

    REQUIRES_NEW(TransactionDefinition.PROPAGATION_REQUIRES_NEW),

    NOT_SUPPORTED(TransactionDefinition.PROPAGATION_NOT_SUPPORTED),

    NEVER(TransactionDefinition.PROPAGATION_NEVER),

    NESTED(TransactionDefinition.PROPAGATION_NESTED);

    private final int value;

    Propagation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}

```

**正确的事务传播行为可能的值如下**：

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

使用的最多的一个事务传播行为，我们平时经常使用的`@Transactional`注解默认使用就是这个事务传播行为。如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。也就是说：

- 如果外部方法没有开启事务的话，`Propagation.REQUIRED`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。
- 如果外部方法开启事务并且被`Propagation.REQUIRED`的话，所有`Propagation.REQUIRED`修饰的内部方法和外部方法均属于同一事务 ，只要一个方法回滚，整个事务均回滚。

举个例子：如果我们上面的`aMethod()`和`bMethod()`使用的都是`PROPAGATION_REQUIRED`传播行为的话，两者使用的就是同一个事务，只要其中一个方法回滚，整个事务均回滚。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}
@Service
class B {
    @Transactional(propagation = Propagation.REQUIRED)
    public void bMethod() {
       //do something
    }
}
```

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

创建一个新的事务，如果当前存在事务，则把当前事务挂起。也就是说不管外部方法是否开启事务，`Propagation.REQUIRES_NEW`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。

举个例子：如果我们上面的`bMethod()`使用`PROPAGATION_REQUIRES_NEW`事务传播行为修饰，`aMethod`还是用`PROPAGATION_REQUIRED`修饰的话。如果`aMethod()`发生异常回滚，`bMethod()`不会跟着回滚，因为 `bMethod()`开启了独立的事务。但是，如果 `bMethod()`抛出了未被捕获的异常并且这个异常满足事务回滚规则的话,`aMethod()`同样也会回滚，因为这个异常被 `aMethod()`的事务管理机制检测到了。

```java
@Service
class A {
    @Autowired
    B b;
    @Transactional(propagation = Propagation.REQUIRED)
    public void aMethod() {
        //do something
        b.bMethod();
    }
}

@Service
class B {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void bMethod() {
       //do something
    }
}
```

**3.`TransactionDefinition.PROPAGATION_NESTED`**:

如果当前存在事务，则创建一个事务作为当前事务的嵌套事务执行； 如果当前没有事务，就执行与`TransactionDefinition.PROPAGATION_REQUIRED`类似的操作。也就是说：

- 在外部方法开启事务的情况下，在内部开启一个新的事务，作为嵌套事务存在。
- 如果外部方法无事务，则单独开启一个事务，与 `PROPAGATION_REQUIRED` 类似。

`TransactionDefinition.PROPAGATION_NESTED`代表的嵌套事务以父子关系呈现，其核心理念是子事务不会独立提交，依赖于父事务，在父事务中运行；当父事务提交时，子事务也会随着提交，理所当然的，当父事务回滚时，子事务也会回滚；

> 与`TransactionDefinition.PROPAGATION_REQUIRES_NEW`区别于：`PROPAGATION_REQUIRES_NEW`是独立事务，不依赖于外部事务，以平级关系呈现，执行完就会立即提交，与外部事务无关；

子事务也有自己的特性，可以独立进行回滚，不会引发父事务的回滚，但是前提是需要处理子事务的异常，避免异常被父事务感知导致外部事务回滚；

举个例子：

- 如果 `aMethod()` 回滚的话，作为嵌套事务的`bMethod()`会回滚。
- 如果 `bMethod()` 回滚的话，`aMethod()`是否回滚，要看`bMethod()`的异常是否被处理：

  - `bMethod()`的异常没有被处理，即`bMethod()`内部没有处理异常，且`aMethod()`也没有处理异常，那么`aMethod()`将感知异常致使整体回滚。

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            b.bMethod();
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod (){
           //do something and throw an exception
        }
    }
    ```

  - `bMethod()`处理异常或`aMethod()`处理异常，`aMethod()`不会回滚。

    ```java
    @Service
    class A {
        @Autowired
        B b;
        @Transactional(propagation = Propagation.REQUIRED)
        public void aMethod (){
            //do something
            try {
                b.bMethod();
            } catch (Exception e) {
                System.out.println("方法回滚");
            }
        }
    }

    @Service
    class B {
        @Transactional(propagation = Propagation.NESTED)
        public void bMethod() {
           //do something and throw an exception
        }
    }
    ```

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）

这个使用的很少，就不举例子来说了。

**以下 3 种传播行为对现有事务的处理方式不同，不能按同一种回滚规则理解。**

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**：如果当前存在事务，则加入该事务，其中的操作会参与该事务的提交或回滚；如果当前没有事务，则以非事务方式运行。
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**：始终以非事务方式运行；如果当前存在事务，则先把它挂起。因此，在该传播边界内执行的操作不受被挂起外层事务的回滚控制。
- **`TransactionDefinition.PROPAGATION_NEVER`**：仅允许以非事务方式运行；如果检测到当前存在事务，则直接抛出异常。

更多关于事务传播行为的内容请看这篇文章：[《太难了~面试官让我结合案例讲讲自己对 Spring 事务传播行为的理解。》](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486668&idx=2&sn=0381e8c836442f46bdc5367170234abb&chksm=cea24307f9d5ca11c96943b3ccfa1fc70dc97dd87d9c540388581f8fe6d805ff548dff5f6b5b&token=1776990505&lang=zh_CN#rd)

#### 事务隔离级别

`TransactionDefinition` 接口中定义了五个表示隔离级别的常量：

```java
public interface TransactionDefinition {
    ......
    int ISOLATION_DEFAULT = -1;
    int ISOLATION_READ_UNCOMMITTED = 1;
    int ISOLATION_READ_COMMITTED = 2;
    int ISOLATION_REPEATABLE_READ = 4;
    int ISOLATION_SERIALIZABLE = 8;
    ......
}
```

和事务传播行为那块一样，为了方便使用，Spring 也相应地定义了一个枚举类：`Isolation`

```java
public enum Isolation {

  DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

  READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

  READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

  REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

  SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

  private final int value;

  Isolation(int value) {
    this.value = value;
  }

  public int value() {
    return this.value;
  }

}
```

下面我依次对每一种事务隔离级别进行介绍：

- **`TransactionDefinition.ISOLATION_DEFAULT`** :使用后端数据库默认的隔离级别，MySQL 默认采用的 `REPEATABLE_READ` 隔离级别 Oracle 默认采用的 `READ_COMMITTED` 隔离级别.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** :最低的隔离级别，使用这个隔离级别很少，因为它允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生。**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : 最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

相关阅读：[MySQL 事务隔离级别详解](https://javaguide.cn/数据库/mysql/transaction-isolation-level.html)。

#### 事务超时属性

所谓事务超时，就是指一个事务所允许执行的最长时间，如果超过该时间限制但事务还没有完成，则自动回滚事务。在 `TransactionDefinition` 中以 int 的值来表示超时时间，其单位是秒，默认值为-1，这表示事务的超时时间取决于底层事务系统或者没有超时时间。

#### 事务只读属性

```java
package org.springframework.transaction;

import org.springframework.lang.Nullable;

public interface TransactionDefinition {
    ......
    // 返回是否为只读事务，默认值为 false
    boolean isReadOnly();

}
```

对于只有读取数据查询的事务，可以指定事务类型为 readonly，即只读事务。只读事务不涉及数据的修改，数据库会提供一些优化手段，适合用在有多条数据库查询操作的方法中。

很多人就会疑问了，为什么我一个数据查询操作还要启用事务支持呢？

拿 MySQL 的 innodb 举例子，根据官网 [https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html](https://dev.mysql.com/doc/refman/5.7/en/innodb-autocommit-commit-rollback.html) 描述：

> MySQL 默认对每一个新建立的连接都启用了`autocommit`模式。在该模式下，每一个发送到 MySQL 服务器的`sql`语句都会在一个单独的事务中进行处理，执行结束后会自动提交事务，并开启一个新的事务。

但是，如果你给方法加上了 `@Transactional` 注解，这个方法执行的所有 SQL 会被放在一个事务中。声明只读事务后，Spring 会把只读提示传递给底层事务系统；是否以及如何优化取决于数据库、驱动和事务管理器，它也不保证写操作一定失败。

如果不加`Transactional`，每条`sql`会开启一个单独的事务，中间被其它事务改了数据，都会实时读取到最新值。

分享一下关于事务只读属性，其他人的解答：

- 如果你一次执行单条查询语句，则没有必要启用事务支持，数据库默认支持 SQL 执行期间的读一致性；
- 如果你一次执行多条查询语句，例如统计查询，报表查询，在这种场景下，多条查询 SQL 必须保证整体的读一致性，否则，在前条 SQL 查询之后，后条 SQL 查询之前，数据被其他用户改变，则该次整体的统计查询将会出现读数据不一致的状态，此时，应该启用事务支持

#### 事务回滚规则

这些规则定义了哪些异常会导致事务回滚而哪些不会。默认情况下，事务只有遇到运行期异常（`RuntimeException` 的子类）时才会回滚，`Error` 也会导致事务回滚，但是，在遇到检查型（Checked）异常时不会回滚。

![](./images/Spring 事务详解/roollbackFor.png)

如果你想要回滚你定义的特定的异常类型的话，可以这样：

```java
@Transactional(rollbackFor= MyException.class)
```

### @Transactional 注解使用详解

#### `@Transactional` 的作用范围

1. **方法**：推荐将注解使用于方法上。Spring 6 的类代理默认还支持 `protected` 和包可见方法；接口代理要求方法是接口中定义的 `public` 方法。较早版本的代理模式通常只支持 `public` 方法。
2. **类**：如果这个注解使用在类上，表明该类中符合上述代理可见性规则的方法都应用相同的事务语义。
3. **接口**：不推荐在接口上使用。

#### `@Transactional` 的常用配置参数

`@Transactional`注解源码如下，里面包含了基本事务属性的配置：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Transactional {

  @AliasFor("transactionManager")
  String value() default "";

  @AliasFor("value")
  String transactionManager() default "";

  Propagation propagation() default Propagation.REQUIRED;

  Isolation isolation() default Isolation.DEFAULT;

  int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;

  boolean readOnly() default false;

  Class<? extends Throwable>[] rollbackFor() default {};

  String[] rollbackForClassName() default {};

  Class<? extends Throwable>[] noRollbackFor() default {};

  String[] noRollbackForClassName() default {};

}
```

**`@Transactional` 的常用配置参数总结（只列出了 5 个我平时比较常用的）：**

| 属性名      | 说明                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------- |
| propagation | 事务的传播行为，默认值为 REQUIRED，可选的值在上面介绍过                                      |
| isolation   | 事务的隔离级别，默认值采用 DEFAULT，可选的值在上面介绍过                                     |
| timeout     | 事务的超时时间，默认值为-1（不会超时）。如果超过该时间限制但事务还没有完成，则自动回滚事务。 |
| readOnly    | 指定事务是否为只读事务，默认值为 false。                                                     |
| rollbackFor | 用于指定能够触发事务回滚的异常类型，并且可以指定多个异常类型。                               |

#### `@Transactional` 事务注解原理

面试中在问 AOP 的时候可能会被问到的一个问题。简单说下吧！

我们知道，**`@Transactional` 的工作机制是基于 AOP 实现的，AOP 又是使用动态代理实现的。如果目标对象实现了接口，默认情况下会采用 JDK 的动态代理，如果目标对象没有实现了接口,会使用 CGLIB 动态代理。**

🤐 多提一嘴：`createAopProxy()` 方法 决定了是使用 JDK 还是 Cglib 来做动态代理，源码如下：

```java
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

  @Override
  public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
      Class<?> targetClass = config.getTargetClass();
      if (targetClass == null) {
        throw new AopConfigException("TargetSource cannot determine target class: " +
            "Either an interface or a target is required for proxy creation.");
      }
      if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
        return new JdkDynamicAopProxy(config);
      }
      return new ObjenesisCglibAopProxy(config);
    }
    else {
      return new JdkDynamicAopProxy(config);
    }
  }
  .......
}
```

如果一个类或者一个类中的 public 方法上被标注`@Transactional` 注解的话，Spring 容器就会在启动的时候为其创建一个代理类，在调用被`@Transactional` 注解的 public 方法的时候，实际调用的是，`TransactionInterceptor` 类中的 `invoke()`方法。这个方法的作用就是在目标方法之前开启事务，方法执行过程中如果遇到异常的时候回滚事务，方法调用完成之后提交事务。

> `TransactionInterceptor` 类中的 `invoke()`方法内部实际调用的是 `TransactionAspectSupport` 类的 `invokeWithinTransaction()`方法。由于新版本的 Spring 对这部分重写很大，而且用到了很多响应式编程的知识，这里就不列源码了。

#### Spring AOP 自调用问题

当一个方法被标记了`@Transactional` 注解的时候，Spring 事务管理器只会在被其他类方法调用的时候生效，而不会在一个类中方法调用生效。

这是因为 Spring AOP 工作原理决定的。因为 Spring AOP 使用动态代理来实现事务的管理，它会在运行的时候为带有 `@Transactional` 注解的方法生成代理对象，并在方法调用的前后应用事物逻辑。如果该方法被其他类调用我们的代理对象就会拦截方法调用并处理事务。但是在一个类中的其他方法内部调用的时候，我们代理对象就无法拦截到这个内部调用，因此事务也就失效了。

`MyService` 类中的`method1()`调用`method2()`就会导致`method2()`的事务失效。

```java
@Service
public class MyService {

private void method1() {
     method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

解决办法就是避免同一类中自调用或者使用 AspectJ 取代 Spring AOP 代理。

[issue #2091](https://github.com/Snailclimb/JavaGuide/issues/2091)补充了一个例子：

```java
@Service
public class MyService {

private void method1() {
     // 需要先配置 @EnableAspectJAutoProxy(exposeProxy = true)
     ((MyService) AopContext.currentProxy()).method2();
     //......
}
@Transactional
 public void method2() {
     //......
  }
}
```

上面的代码只有在启用 `exposeProxy`（例如配置 `@EnableAspectJAutoProxy(exposeProxy = true)`）后才能通过 `AopContext.currentProxy()` 获取当前代理对象。这样调用 `method2()` 会经过代理，事务注解才会生效。由于这种写法会让业务代码依赖 AOP 上下文，通常更推荐拆分类职责来避免自调用。

#### `@Transactional` 的使用注意事项总结

- `@Transactional` 的方法可见性限制取决于代理类型和 Spring 版本：Spring 6 的类代理默认支持 `public`、`protected` 和包可见方法，接口代理要求方法是接口中定义的 `public` 方法；较早版本的代理模式通常只支持 `public` 方法；
- 避免同一个类中调用 `@Transactional` 注解的方法，这样会导致事务失效；
- 正确的设置 `@Transactional` 的 `rollbackFor` 和 `propagation` 属性，否则事务可能会回滚失败;
- 被 `@Transactional` 注解的方法所在的类必须被 Spring 管理，否则不生效；
- 底层使用的数据库必须支持事务机制，否则不生效；
- ……

## 参考

- [总结]Spring 事务管理中@Transactional 的参数:[http://www.mobabel.net/spring 事务管理中 transactional 的参数/](http://www.mobabel.net/spring事务管理中transactional的参数/)
- Spring 官方文档：[https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html](https://docs.spring.io/spring/docs/4.2.x/spring-framework-reference/html/transaction.html)
- 《Spring5 高级编程》
- 透彻的掌握 Spring 中@transactional 的使用: [https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html](https://www.ibm.com/developerworks/cn/java/j-master-spring-transactional-use/index.html)
- Spring 事务的传播特性：[https://github.com/love-somnus/Spring/wiki/Spring 事务的传播特性](https://github.com/love-somnus/Spring/wiki/Spring事务的传播特性)
- [Spring 事务传播行为详解](https://segmentfault.com/a/1190000013341344)：[https://segmentfault.com/a/1190000013341344](https://segmentfault.com/a/1190000013341344)
- 全面分析 Spring 的编程式事务管理及声明式事务管理：[https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html](https://www.ibm.com/developerworks/cn/education/opensource/os-cn-spring-trans/index.html)

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 框架/spring/Spring 中的设计模式详解.md -->

## [23] Spring 中的设计模式详解

---
title: Spring 中的设计模式详解
description: Spring框架设计模式详解，涵盖工厂模式、代理模式、单例模式、模板方法等在Spring源码中的应用实践。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring设计模式,工厂模式,代理模式,模板方法,单例,策略模式,适配器模式,Spring源码
---

“JDK 中用到了哪些设计模式? Spring 中用到了哪些设计模式? ”这两个问题，在面试中比较常见。

我在网上搜索了一下关于 Spring 中设计模式的讲解几乎都是千篇一律，而且大部分都年代久远。所以，花了几天时间自己总结了一下。

由于我的个人能力有限，文中如有任何错误各位都可以指出。另外，文章篇幅有限，对于设计模式以及一些源码的解读我只是一笔带过，这篇文章的主要目的是回顾一下 Spring 中的设计模式。

## 控制反转(IoC)和依赖注入(DI)

**IoC(Inversion of Control,控制反转)** 是 Spring 中一个非常非常重要的概念，它不是什么技术，而是一种解耦的设计思想。IoC 的主要目的是借助于“第三方”(Spring 中的 IoC 容器) 实现具有依赖关系的对象之间的解耦(IOC 容器管理对象，你只管使用即可)，从而降低代码之间的耦合度。

**IoC 是一个原则，而不是一个模式，以下模式（但不限于）实现了 IoC 原则。**

![ioc-patterns](https://oss.javaguide.cn/github/javaguide/ioc-patterns.png)

**Spring IoC 容器就像是一个工厂一样，当我们需要创建一个对象的时候，只需要配置好配置文件/注解即可，完全不用考虑对象是如何被创建出来的。** IoC 容器负责创建对象，将对象连接在一起，配置这些对象，并从创建中处理这些对象的整个生命周期，直到它们被完全销毁。

在实际项目中一个 Service 类如果有几百甚至上千个类作为它的底层，我们需要实例化这个 Service，你可能要每次都要搞清这个 Service 所有底层类的构造函数，这可能会把人逼疯。如果利用 IOC 的话，你只需要配置好，然后在需要的地方引用就行了，这大大增加了项目的可维护性且降低了开发难度。

> 关于 Spring IOC 的理解，推荐看这一下知乎的一个回答：<https://www.zhihu.com/question/23277575/answer/169698662> ，非常不错。

**控制反转怎么理解呢?** 举个例子："对象 a 依赖了对象 b，当对象 a 需要使用 对象 b 的时候必须自己去创建。但是当系统引入了 IOC 容器后， 对象 a 和对象 b 之间就失去了直接的联系。这个时候，当对象 a 需要使用 对象 b 的时候， 我们可以指定 IOC 容器去创建一个对象 b 注入到对象 a 中"。 对象 a 获得依赖对象 b 的过程,由主动行为变为了被动行为，控制权反转，这就是控制反转名字的由来。

**DI(Dependency Inject,依赖注入)是实现控制反转的一种设计模式，依赖注入就是将实例变量传入到一个对象中去。**

## 工厂设计模式

Spring 使用工厂模式可以通过 `BeanFactory` 或 `ApplicationContext` 创建 bean 对象。

**两者对比：**

- `BeanFactory`：提供 Spring IoC 容器的基础能力。直接使用基础 `BeanFactory` 时，容器通常不会主动预实例化所有单例 Bean，而是在第一次请求 Bean 时创建。
- `ApplicationContext`：扩展了 `BeanFactory`，增加了事件发布、国际化、资源加载等能力，并默认在容器启动阶段预实例化非懒加载的单例 Bean；`prototype` Bean 和标记为 lazy 的 Bean 不会因此被一次性全部创建。

`ApplicationContext` 的三个常见实现类：

1. `ClassPathXmlApplicationContext`：把上下文文件当成类路径资源。
2. `FileSystemXmlApplicationContext`：从文件系统中的 XML 文件载入上下文定义信息。
3. `XmlWebApplicationContext`：从 Web 系统中的 XML 文件载入上下文定义信息。

Example:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

public class App {
  public static void main(String[] args) {
    ApplicationContext context = new FileSystemXmlApplicationContext(
        "C:/工作/IOC Containers/springframework.applicationcontext/src/main/resources/bean-factory-config.xml");

    HelloApplicationContext obj = (HelloApplicationContext) context.getBean("helloApplicationContext");
    obj.getMsg();
  }
}
```

## 单例设计模式

在我们的系统中，有一些对象其实我们只需要一个，比如说：线程池、缓存、对话框、注册表、日志对象、充当打印机、显卡等设备驱动程序的对象。事实上，这一类对象只能有一个实例，如果制造出多个实例就可能会导致一些问题的产生，比如：程序的行为异常、资源使用过量、或者不一致性的结果。

**使用单例模式的好处** :

- 对于频繁使用的对象，可以省略创建对象所花费的时间，这对于那些重量级对象而言，是非常可观的一笔系统开销；
- 由于 new 操作的次数减少，因而对系统内存的使用频率也会降低，这将减轻 GC 压力，缩短 GC 停顿时间。

**Spring 中 bean 的默认作用域就是 singleton(单例)的。** 除了 singleton 作用域，Spring 中 bean 还有下面几种作用域：

- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application** （仅 Web 应用可用）：每个 `ServletContext` 对应一个 Bean 实例，该 bean 仅在当前 Web 应用生命周期内有效。旧版 Spring 还为 Portlet 应用提供过独立的 `globalSession` 作用域，它不属于当前标准作用域列表。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

Spring 通过 `ConcurrentHashMap` 实现单例注册表的特殊方式实现单例模式。

Spring 实现单例的核心代码如下：

```java
// 通过 ConcurrentHashMap（线程安全） 实现单例注册表
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<String, Object>(64);

public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
        Assert.notNull(beanName, "'beanName' must not be null");
        synchronized (this.singletonObjects) {
            // 检查缓存中是否存在实例
            Object singletonObject = this.singletonObjects.get(beanName);
            if (singletonObject == null) {
                //...省略了很多代码
                try {
                    singletonObject = singletonFactory.getObject();
                }
                //...省略了很多代码
                // 如果实例对象在不存在，我们注册到单例注册表中。
                addSingleton(beanName, singletonObject);
            }
            return (singletonObject != NULL_OBJECT ? singletonObject : null);
        }
    }
    //将对象添加到单例注册表
    protected void addSingleton(String beanName, Object singletonObject) {
            synchronized (this.singletonObjects) {
                this.singletonObjects.put(beanName, (singletonObject != null ? singletonObject : NULL_OBJECT));

            }
        }
}
```

**单例 Bean 存在线程安全问题吗？**

大部分时候我们并没有在项目中使用多线程，所以很少有人会关注这个问题。单例 Bean 存在线程问题，主要是因为当多个线程操作同一个对象的时候是存在资源竞争的。

常见的有两种解决办法：

1. 在 Bean 中尽量避免定义可变的成员变量。
2. 在类中定义一个 `ThreadLocal` 成员变量，将需要的可变成员变量保存在 `ThreadLocal` 中（推荐的一种方式）。

不过，大部分 Bean 实际都是无状态（没有实例变量）的（比如 Dao、Service），这种情况下， Bean 是线程安全的。

## 代理设计模式

### 代理模式在 AOP 中的应用

**AOP(Aspect-Oriented Programming，面向切面编程)** 能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/SpringAOPProcess.jpg)

当然，你也可以使用 AspectJ ,Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

使用 AOP 之后我们可以把一些通用功能抽象出来，在需要用到的地方直接使用即可，这样大大简化了代码量。我们需要增加新功能时也方便，这样也提高了系统扩展性。日志功能、事务管理等等场景都用到了 AOP 。

### Spring AOP 和 AspectJ AOP 有什么区别?

**Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单。

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

## 模板方法

模板方法模式是一种行为设计模式，它定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。 模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤的实现方式。

```java
public abstract class Template {
    //这是我们的模板方法
    public final void TemplateMethod(){
        PrimitiveOperation1();
        PrimitiveOperation2();
        PrimitiveOperation3();
    }

    protected void  PrimitiveOperation1(){
        //当前类实现
    }

    //被子类实现的方法
    protected abstract void PrimitiveOperation2();
    protected abstract void PrimitiveOperation3();

}
public class TemplateImpl extends Template {

    @Override
    public void PrimitiveOperation2() {
        //当前类实现
    }

    @Override
    public void PrimitiveOperation3() {
        //当前类实现
    }
}

```

Spring 中 `JdbcTemplate`、`HibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。一般情况下，我们都是使用继承的方式来实现模板模式，但是 Spring 并没有使用这种方式，而是使用 Callback 模式与模板方法模式配合，既达到了代码复用的效果，同时增加了灵活性。

## 观察者模式

观察者模式是一种对象行为型模式。它表示的是一种对象与对象之间具有依赖关系，当一个对象发生改变的时候，依赖这个对象的所有对象也会做出反应。Spring 事件驱动模型就是观察者模式很经典的一个应用。Spring 事件驱动模型非常有用，在很多场景都可以解耦我们的代码。比如我们每次添加商品的时候都需要重新更新商品索引，这个时候就可以利用观察者模式来解决这个问题。

### Spring 事件驱动模型中的三种角色

#### 事件角色

`ApplicationEvent` (`org.springframework.context`包下)充当事件的角色,这是一个抽象类，它继承了`java.util.EventObject`并实现了 `java.io.Serializable`接口。

Spring 中默认存在以下事件，他们都是对 `ApplicationContextEvent` 的实现(继承自`ApplicationContextEvent`)：

- `ContextStartedEvent`：`ApplicationContext` 启动后触发的事件;
- `ContextStoppedEvent`：`ApplicationContext` 停止后触发的事件;
- `ContextRefreshedEvent`：`ApplicationContext` 初始化或刷新完成后触发的事件;
- `ContextClosedEvent`：`ApplicationContext` 关闭后触发的事件。

![ApplicationEvent-Subclass](https://oss.javaguide.cn/github/javaguide/ApplicationEvent-Subclass.png)

#### 事件监听者角色

`ApplicationListener` 充当了事件监听者角色，它是一个接口，里面只定义了一个 `onApplicationEvent()`方法来处理`ApplicationEvent`。`ApplicationListener`接口类源码如下，可以看出接口定义看出接口中的事件只要实现了 `ApplicationEvent`就可以了。所以，在 Spring 中我们只要实现 `ApplicationListener` 接口的 `onApplicationEvent()` 方法即可完成监听事件

```java
package org.springframework.context;
import java.util.EventListener;
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E var1);
}
```

#### 事件发布者角色

`ApplicationEventPublisher` 充当了事件的发布者，它也是一个接口。

```java
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        this.publishEvent((Object)event);
    }

    void publishEvent(Object var1);
}

```

`ApplicationEventPublisher` 接口的`publishEvent()`这个方法在`AbstractApplicationContext`类中被实现，阅读这个方法的实现，你会发现实际上事件真正是通过`ApplicationEventMulticaster`来广播出去的。具体内容过多，就不在这里分析了，后面可能会单独写一篇文章提到。

### Spring 的事件流程总结

1. 定义一个事件: 实现一个继承自 `ApplicationEvent`，并且写相应的构造函数；
2. 定义一个事件监听者：实现 `ApplicationListener` 接口，重写 `onApplicationEvent()` 方法；
3. 使用事件发布者发布消息: 可以通过 `ApplicationEventPublisher` 的 `publishEvent()` 方法发布消息。

Example:

```java
// 定义一个事件,继承自ApplicationEvent并且写相应的构造函数
public class DemoEvent extends ApplicationEvent{
    private static final long serialVersionUID = 1L;

    private String message;

    public DemoEvent(Object source,String message){
        super(source);
        this.message = message;
    }

    public String getMessage() {
         return message;
          }


// 定义一个事件监听者,实现ApplicationListener接口，重写 onApplicationEvent() 方法；
@Component
public class DemoListener implements ApplicationListener<DemoEvent>{

    //使用onApplicationEvent接收消息
    @Override
    public void onApplicationEvent(DemoEvent event) {
        String msg = event.getMessage();
        System.out.println("接收到的信息是："+msg);
    }

}
// 发布事件，可以通过ApplicationEventPublisher  的 publishEvent() 方法发布消息。
@Component
public class DemoPublisher {

    @Autowired
    ApplicationContext applicationContext;

    public void publish(String message){
        //发布事件
        applicationContext.publishEvent(new DemoEvent(this, message));
    }
}

```

当调用 `DemoPublisher` 的 `publish()` 方法的时候，比如 `demoPublisher.publish("你好")` ，控制台就会打印出:`接收到的信息是：你好` 。

## 适配器模式

适配器模式(Adapter Pattern) 将一个接口转换成客户希望的另一个接口，适配器模式使接口不兼容的那些类可以一起工作。

### Spring AOP 中的适配器模式

我们知道 Spring AOP 的实现是基于代理模式，但是 Spring AOP 的增强或通知(Advice)使用到了适配器模式，与之相关的接口是`AdvisorAdapter` 。

Advice 常用的类型有：`BeforeAdvice`（目标方法调用前,前置通知）、`AfterAdvice`（目标方法调用后,后置通知）、`AfterReturningAdvice`(目标方法执行结束后，return 之前)等等。每个类型 Advice（通知）都有对应的拦截器:`MethodBeforeAdviceInterceptor`、`AfterReturningAdviceInterceptor`、`ThrowsAdviceInterceptor` 等等。

Spring 预定义的通知要通过对应的适配器，适配成 `MethodInterceptor` 接口(方法拦截器)类型的对象（如：`MethodBeforeAdviceAdapter` 通过调用 `getInterceptor` 方法，将 `MethodBeforeAdvice` 适配成 `MethodBeforeAdviceInterceptor` ）。

### Spring MVC 中的适配器模式

在 Spring MVC 中，`DispatcherServlet` 根据请求信息调用 `HandlerMapping`，解析请求对应的 `Handler`。解析到对应的 `Handler`（也就是我们平常说的 `Controller` 控制器）后，开始由`HandlerAdapter` 适配器处理。`HandlerAdapter` 作为期望接口，具体的适配器实现类用于对目标类进行适配，`Controller` 作为需要适配的类。

**为什么要在 Spring MVC 中使用适配器模式？**

Spring MVC 中的 `Controller` 种类众多，不同类型的 `Controller` 通过不同的方法来对请求进行处理。如果不利用适配器模式的话，`DispatcherServlet` 直接获取对应类型的 `Controller`，需要的自行来判断，像下面这段代码一样：

```java
if(mappedHandler.getHandler() instanceof MultiActionController){
   ((MultiActionController)mappedHandler.getHandler()).xxx
}else if(mappedHandler.getHandler() instanceof XXX){
    ...
}else if(...){
   ...
}
```

假如我们再增加一个 `Controller`类型就要在上面代码中再加入一行 判断语句，这种形式就使得程序难以维护，也违反了设计模式中的开闭原则 – 对扩展开放，对修改关闭。

## 装饰者模式

装饰者模式可以动态地给对象添加一些额外的属性或行为。相比于使用继承，装饰者模式更加灵活。简单点儿说就是当我们需要修改原有的功能，但我们又不愿直接去修改原有的代码时，设计一个 Decorator 套在原有代码外面。其实在 JDK 中就有很多地方用到了装饰者模式，比如 `InputStream`家族，`InputStream` 类下有 `FileInputStream` (读取文件)、`BufferedInputStream` (增加缓存,使读取文件速度大大提升)等子类都在不修改`InputStream` 代码的情况下扩展了它的功能。

![装饰者模式示意图](https://oss.javaguide.cn/github/javaguide/Decorator.jpg)

## 总结

Spring 框架中用到了哪些设计模式？

- **工厂设计模式** : Spring 使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。
- ……

## 参考

- 《Spring 技术内幕》
- <https://blog.eduonix.com/java-programming-2/learn-design-patterns-used-spring-framework/>
- <https://www.tutorialsteacher.com/ioc/inversion-of-control>
- <https://design-patterns.readthedocs.io/zh_CN/latest/behavioral_patterns/observer.html>
- <https://juejin.im/post/5a8eb261f265da4e9e307230>
- <https://juejin.im/post/5ba28986f265da0abc2b6084>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 框架/spring/Spring&SpringMVC&SpringBoot常用注解总结.md -->

## [24] Spring&SpringMVC&SpringBoot常用注解总结

---
title: Spring&SpringMVC&SpringBoot常用注解总结
description: Spring和SpringBoot常用注解大全，涵盖@Autowired、@Component、@RequestMapping等核心注解的用法详解。
category: 框架
tag:
  - SpringBoot
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring注解,Spring Boot注解,@SpringBootApplication,@Autowired,@RequestMapping,@Configuration,@Component,常用注解
---

可以毫不夸张地说，这篇文章介绍的 Spring/SpringBoot 常用注解基本已经涵盖你工作中遇到的大部分常用的场景。对于每一个注解本文都提供了具体用法，掌握这些内容后，使用 Spring Boot 来开发项目基本没啥大问题了！

**为什么要写这篇文章？**

最近看到网上有一篇关于 Spring Boot 常用注解的文章被广泛转载，但文章内容存在一些误导性，可能对没有太多实际使用经验的开发者不太友好。于是我花了几天时间总结了这篇文章，希望能够帮助大家更好地理解和使用 Spring 注解。

**因为个人能力和精力有限，如果有任何错误或遗漏，欢迎指正！非常感激！**

## Spring Boot 基础注解

`@SpringBootApplication` 是 Spring Boot 应用的核心注解，通常用于标注主启动类。

示例：

```java
@SpringBootApplication
public class SpringSecurityJwtGuideApplication {
      public static void main(java.lang.String[] args) {
        SpringApplication.run(SpringSecurityJwtGuideApplication.class, args);
    }
}
```

我们可以把 `@SpringBootApplication`看作是下面三个注解的组合：

- **`@EnableAutoConfiguration`**：启用 Spring Boot 的自动配置机制。
- **`@ComponentScan`**：扫描 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解的类。
- **`@Configuration`**：允许注册额外的 Spring Bean 或导入其他配置类。

源码如下：

```java
package org.springframework.boot.autoconfigure;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
    @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
    @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
   ......
}

package org.springframework.boot;
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {

}
```

## Spring Bean

### 依赖注入（Dependency Injection, DI）

`@Autowired` 用于自动注入依赖项（即其他 Spring Bean）。它可以标注在构造器、字段、Setter 方法或配置方法上，Spring 容器会自动查找匹配类型的 Bean 并将其注入。

```java
@Service
public class UserServiceImpl implements UserService {
    // ...
}

@RestController
public class UserController {
    // 字段注入
    @Autowired
    private UserService userService;
    // ...
}
```

当存在多个相同类型的 Bean 时，`@Autowired` 默认按类型注入可能产生歧义。此时，可以与 `@Qualifier` 结合使用，通过指定 Bean 的名称来精确选择需要注入的实例。

```java
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired
    @Qualifier("userRepositoryA") // 指定注入名为 "userRepositoryA" 的 Bean
    private UserRepository userRepository;
    // ...
}
```

`@Primary`同样是为了解决同一类型存在多个 Bean 实例的注入问题。在 Bean 定义时（例如使用 `@Bean` 或类注解）添加 `@Primary` 注解，表示该 Bean 是**首选**的注入对象。当进行 `@Autowired` 注入时，如果没有使用 `@Qualifier` 指定名称，Spring 将优先选择带有 `@Primary` 的 Bean。

```java
@Primary // 将 UserRepositoryA 设为首选注入对象
@Repository("userRepositoryA")
public class UserRepositoryA implements UserRepository { /* ... */ }

@Repository("userRepositoryB")
public class UserRepositoryB implements UserRepository { /* ... */ }

@Service
public class UserService {
    @Autowired // 会自动注入 UserRepositoryA，因为它是 @Primary
    private UserRepository userRepository;
    // ...
}
```

`@Resource(name="beanName")`是 JSR-250 规范定义的注解，也用于依赖注入。它默认按**名称 (by Name)** 查找 Bean 进行注入，而 `@Autowired`默认按**类型 (by Type)** 。如果未指定 `name` 属性，它会尝试根据字段名或方法名查找，如果找不到，则回退到按类型查找（类似 `@Autowired`）。

`@Resource`只能标注在字段 和 Setter 方法上，不支持构造器注入。

```java
@Service
public class UserService {
    @Resource(name = "userRepositoryA")
    private UserRepository userRepository;
    // ...
}
```

### Bean 作用域

`@Scope("scopeName")` 定义 Spring Bean 的作用域，即 Bean 实例的生命周期和可见范围。常用的作用域包括：

- **singleton** : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application/global-session** （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

```java
@Component
// 每次获取都会创建新的 PrototypeBean 实例
@Scope("prototype")
public class PrototypeBean {
    // ...
}
```

### Bean 注册

Spring 容器需要知道哪些类需要被管理为 Bean。除了使用 `@Bean` 方法显式声明（通常在 `@Configuration` 类中），更常见的方式是使用 Stereotype（构造型） 注解标记类，并配合组件扫描（Component Scanning）机制，让 Spring 自动发现并注册这些类作为 Bean。这些 Bean 后续可以通过 `@Autowired` 等方式注入到其他组件中。

下面是常见的一些注册 Bean 的注解：

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 Service 层返回数据给前端页面。
- `@RestController`：一个组合注解，等效于 `@Controller` + `@ResponseBody`。它专门用于构建 RESTful Web 服务的控制器。标注了 `@RestController` 的类，其所有处理器方法（handler methods）的返回值都会被自动序列化（通常为 JSON）并写入 HTTP 响应体，而不是被解析为视图名称。

`@Controller` vs `@RestController`：

- `@Controller`：主要用于传统的 Spring MVC 应用，方法返回值通常是逻辑视图名，需要视图解析器配合渲染页面。如果需要返回数据（如 JSON），则需要在方法上额外添加 `@ResponseBody` 注解。
- `@RestController`：专为构建返回数据的 RESTful API 设计。类上使用此注解后，所有方法的返回值都会默认被视为响应体内容（相当于每个方法都隐式添加了 `@ResponseBody`），通常用于返回 JSON 或 XML 数据。在现代前后端分离的应用中，`@RestController` 是更常用的选择。

关于`@RestController` 和 `@Controller`的对比，请看这篇文章：[@RestController vs @Controller](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485544&idx=1&sn=3cc95b88979e28fe3bfe539eb421c6d8&chksm=cea247a3f9d5ceb5e324ff4b8697adc3e828ecf71a3468445e70221cce768d1e722085359907&token=1725092312&lang=zh_CN#rd)。

## 配置

### 声明配置类

`@Configuration` 主要用于声明一个类是 Spring 的配置类。虽然也可以用 `@Component` 注解替代，但 `@Configuration` 能够更明确地表达该类的用途（定义 Bean），语义更清晰，也便于 Spring 进行特定的处理（例如，通过 CGLIB 代理确保 `@Bean` 方法的单例行为）。

```java
@Configuration
public class AppConfig {

    // @Bean 注解用于在配置类中声明一个 Bean
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

    // 配置类中可以包含一个或多个 @Bean 方法。
}
```

### 读取配置信息

在应用程序开发中，我们经常需要管理一些配置信息，例如数据库连接细节、第三方服务（如阿里云 OSS、短信服务、微信认证）的密钥或地址等。通常，这些信息会**集中存放在配置文件**（如 `application.yml` 或 `application.properties`）中，方便管理和修改。

Spring 提供了多种便捷的方式来读取这些配置信息。假设我们有如下 `application.yml` 文件：

```yaml
wuhan2020: 2020年初武汉爆发了新型冠状病毒，疫情严重，但是，我相信一切都会过去！武汉加油！中国加油！

my-profile:
  name: Guide哥
  email: koushuangbwcx@163.com

library:
  location: 湖北武汉加油中国加油
  books:
    - name: 天才基本法
      description: 二十二岁的林朝夕在父亲确诊阿尔茨海默病这天，得知自己暗恋多年的校园男神裴之即将出国深造的消息——对方考取的学校，恰是父亲当年为她放弃的那所。
    - name: 时间的秩序
      description: 为什么我们记得过去，而非未来？时间“流逝”意味着什么？是我们存在于时间之内，还是时间存在于我们之中？卡洛·罗韦利用诗意的文字，邀请我们思考这一亘古难题——时间的本质。
    - name: 了不起的我
      description: 如何养成一个新习惯？如何让心智变得更成熟？如何拥有高质量的关系？ 如何走出人生的艰难时刻？
```

下面介绍几种常用的读取配置的方式：

1、`@Value("${property.key}")` 注入配置文件（如 `application.properties` 或 `application.yml`）中的单个属性值。它还支持 Spring 表达式语言 (SpEL)，可以实现更复杂的注入逻辑。

```java
@Value("${wuhan2020}")
String wuhan2020;
```

2、`@ConfigurationProperties`可以读取配置信息并与 Bean 绑定，用的更多一些。

```java
@Component
@ConfigurationProperties(prefix = "library")
class LibraryProperties {
    @NotEmpty
    private String location;
    private List<Book> books;

    @Setter
    @Getter
    @ToString
    static class Book {
        String name;
        String description;
    }
  省略getter/setter
  ......
}
```

你可以像使用普通的 Spring Bean 一样，将其注入到类中使用。

```java
@Service
public class LibraryService {

    private final LibraryProperties libraryProperties;

    @Autowired
    public LibraryService(LibraryProperties libraryProperties) {
        this.libraryProperties = libraryProperties;
    }

    public void printLibraryInfo() {
        System.out.println(libraryProperties);
    }
}
```

### 加载指定的配置文件

`@PropertySource` 注解允许加载自定义的配置文件。适用于需要将部分配置信息独立存储的场景。

```java
@Component
@PropertySource("classpath:website.properties")

class WebSite {
    @Value("${url}")
    private String url;

  省略getter/setter
  ......
}
```

**注意**：当使用 `@PropertySource` 时，确保外部文件路径正确，且文件在类路径（classpath）中。

更多内容请查看我的这篇文章：[10 分钟搞定 SpringBoot 如何优雅读取配置文件？](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486181&idx=2&sn=10db0ae64ef501f96a5b0dbc4bd78786&chksm=cea2452ef9d5cc384678e456427328600971180a77e40c13936b19369672ca3e342c26e92b50&token=816772476&lang=zh_CN#rd) 。

## MVC

### HTTP 请求

**5 种常见的请求类型:**

- **GET**：请求从服务器获取特定资源。举个例子：`GET /users`（获取所有学生）
- **POST**：在服务器上创建一个新的资源。举个例子：`POST /users`（创建学生）
- **PUT**：更新服务器上的资源（客户端提供更新后的整个资源）。举个例子：`PUT /users/12`（更新编号为 12 的学生）
- **DELETE**：从服务器删除特定的资源。举个例子：`DELETE /users/12`（删除编号为 12 的学生）
- **PATCH**：更新服务器上的资源（客户端提供更改的属性，可以看做作是部分更新），使用的比较少，这里就不举例子了。

#### GET 请求

`@GetMapping("users")` 等价于`@RequestMapping(value="/users",method=RequestMethod.GET)`。

```java
@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
  return ResponseEntity.ok(userRepository.findAll());
}
```

#### POST 请求

`@PostMapping("users")` 等价于`@RequestMapping(value="/users",method=RequestMethod.POST)`。

`@PostMapping` 通常与 `@RequestBody` 配合，用于接收 JSON 数据并映射为 Java 对象。

```java
@PostMapping("/users")
public ResponseEntity<User> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
  User user = userService.create(userCreateRequest);
  return ResponseEntity.status(HttpStatus.CREATED).body(user);
}
```

#### PUT 请求

`@PutMapping("/users/{userId}")` 等价于`@RequestMapping(value="/users/{userId}",method=RequestMethod.PUT)`。

```java
@PutMapping("/users/{userId}")
public ResponseEntity<User> updateUser(@PathVariable(value = "userId") Long userId,
  @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
  ......
}
```

#### DELETE 请求

`@DeleteMapping("/users/{userId}")`等价于`@RequestMapping(value="/users/{userId}",method=RequestMethod.DELETE)`

```java
@DeleteMapping("/users/{userId}")
public ResponseEntity deleteUser(@PathVariable(value = "userId") Long userId){
  ......
}
```

#### PATCH 请求

一般实际项目中，我们都是 PUT 不够用了之后才用 PATCH 请求去更新数据。

```java
  @PatchMapping("/profile")
  public ResponseEntity updateStudent(@RequestBody StudentUpdateRequest studentUpdateRequest) {
        studentRepository.updateDetail(studentUpdateRequest);
        return ResponseEntity.ok().build();
    }
```

### 参数绑定

在处理 HTTP 请求时，Spring MVC 提供了多种注解用于绑定请求参数到方法参数中。以下是常见的参数绑定方式：

#### 从 URL 路径中提取参数

`@PathVariable` 用于从 URL 路径中提取参数。例如：

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable("klassId") Long klassId) {
    return teacherService.findTeachersByClass(klassId);
}
```

若请求 URL 为 `/klasses/123/teachers`，则 `klassId = 123`。

#### 绑定查询参数

`@RequestParam` 用于绑定查询参数。例如：

```java
@GetMapping("/klasses/{klassId}/teachers")
public List<Teacher> getTeachersByClass(@PathVariable Long klassId,
                                        @RequestParam(value = "type", required = false) String type) {
    return teacherService.findTeachersByClassAndType(klassId, type);
}
```

若请求 URL 为 `/klasses/123/teachers?type=web`，则 `klassId = 123`，`type = web`。

#### 绑定请求体中的 JSON 数据

`@RequestBody` 用于读取 Request 请求（可能是 POST,PUT,DELETE,GET 请求）的 body 部分并且**Content-Type 为 application/json** 格式的数据，接收到数据之后会自动将数据绑定到 Java 对象上去。系统会使用`HttpMessageConverter`或者自定义的`HttpMessageConverter`将请求的 body 中的 json 字符串转换为 java 对象。

我用一个简单的例子来给演示一下基本使用！

我们有一个注册的接口：

```java
@PostMapping("/sign-up")
public ResponseEntity signUp(@RequestBody @Valid UserRegisterRequest userRegisterRequest) {
  userService.save(userRegisterRequest);
  return ResponseEntity.ok().build();
}
```

`UserRegisterRequest`对象：

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegisterRequest {
    @NotBlank
    private String userName;
    @NotBlank
    private String password;
    @NotBlank
    private String fullName;
}
```

我们发送 post 请求到这个接口，并且 body 携带 JSON 数据：

```json
{ "userName": "coder", "fullName": "shuangkou", "password": "123456" }
```

这样我们的后端就可以直接把 json 格式的数据映射到我们的 `UserRegisterRequest` 类上。

![](./images/spring-annotations/@RequestBody.png)

**注意**：

- 一个方法只能有一个 `@RequestBody` 参数，但可以有多个 `@PathVariable` 和 `@RequestParam`。
- 如果需要接收多个复杂对象，建议合并成一个单一对象。

## 数据校验

数据校验是保障系统稳定性和安全性的关键环节。即使在用户界面（前端）已经实施了数据校验，**后端服务仍必须对接收到的数据进行再次校验**。这是因为前端校验可以被轻易绕过（例如，通过开发者工具修改请求或使用 Postman、curl 等 HTTP 工具直接调用 API），恶意或错误的数据可能直接发送到后端。因此，后端校验是防止非法数据、维护数据一致性、确保业务逻辑正确执行的最后一道，也是最重要的一道防线。

Bean Validation 是一套定义 JavaBean 参数校验标准的规范 (JSR 303, 349, 380)，它提供了一系列注解，可以直接用于 JavaBean 的属性上，从而实现便捷的参数校验。

- **JSR 303 (Bean Validation 1.0):** 奠定了基础，引入了核心校验注解（如 `@NotNull`、`@Size`、`@Min`、`@Max` 等），定义了如何通过注解的方式对 JavaBean 的属性进行校验，并支持嵌套对象校验和自定义校验器。
- **JSR 349 (Bean Validation 1.1):** 在 1.0 基础上进行扩展，例如引入了对方法参数和返回值校验的支持、增强了对分组校验（Group Validation）的处理。
- **JSR 380 (Bean Validation 2.0):** 拥抱 Java 8 的新特性，并进行了一些改进，例如支持 `java.time` 包中的日期和时间类型、引入了一些新的校验注解（如 `@NotEmpty`, `@NotBlank`等）。

Bean Validation 本身只是一套**规范（接口和注解）**，我们需要一个实现了这套规范的**具体框架**来执行校验逻辑。目前，**Hibernate Validator** 是 Bean Validation 规范最权威、使用最广泛的参考实现。

- Hibernate Validator 4.x 实现了 Bean Validation 1.0 (JSR 303)。
- Hibernate Validator 5.x 实现了 Bean Validation 1.1 (JSR 349)。
- Hibernate Validator 6.x 实现了 Bean Validation 2.0（JSR 380），使用 `javax.validation` 包名。
- Hibernate Validator 7.x 和 8.x 实现了 Jakarta Bean Validation 3.0，使用 `jakarta.validation` 包名；Hibernate Validator 9.x 实现了 Jakarta Validation 3.1。

在 Spring Boot 项目中使用 Bean Validation 非常方便，这得益于 Spring Boot 的自动配置能力。关于依赖引入，需要注意：

- 在较早版本的 Spring Boot（通常指 2.3.x 之前）中，`spring-boot-starter-web` 依赖默认包含了 hibernate-validator。因此，只要引入了 Web Starter，就无需额外添加校验相关的依赖。
- 从 Spring Boot 2.3.x 版本开始，为了更精细化的依赖管理，校验相关的依赖被移出了 spring-boot-starter-web。如果你的项目使用了这些或更新的版本，并且需要 Bean Validation 功能，那么你需要显式地添加 `spring-boot-starter-validation` 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

![](https://oss.javaguide.cn/2021/03/c7bacd12-1c1a-4e41-aaaf-4cad840fc073.png)

非 SpringBoot 项目需要自行引入相关依赖包，这里不多做讲解，具体可以查看我的这篇文章：[如何在 Spring/Spring Boot 中做参数校验？你需要了解的都在这里！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485783&idx=1&sn=a407f3b75efa17c643407daa7fb2acd6&chksm=cea2469cf9d5cf8afbcd0a8a1c9cc4294d6805b8e01bee6f76bb2884c5bc15478e91459def49&token=292197051&lang=zh_CN#rd)。

👉 需要注意的是：优先使用 Bean Validation/Jakarta Validation 规范提供的约束注解，而不是 Hibernate Validator 私有约束。Spring Boot 2.x 通常使用 `javax.validation.constraints`，Spring Boot 3.x 及以上版本使用 `jakarta.validation.constraints`。

### 一些常用的字段验证的注解

Bean Validation 规范及其实现（如 Hibernate Validator）提供了丰富的注解，用于声明式地定义校验规则。以下是一些常用的注解及其说明：

- `@NotNull`: 检查被注解的元素（任意类型）不能为 `null`。
- `@NotEmpty`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）不能为 `null` 且其大小/长度不能为 0。注意：对于字符串，`@NotEmpty` 允许包含空白字符的字符串，如 `" "`。
- `@NotBlank`: 检查被注解的 `CharSequence`（如 `String`）不能为 `null`，并且去除首尾空格后的长度必须大于 0。（即，不能为空白字符串）。
- `@Null`: 检查被注解的元素必须为 `null`。
- `@AssertTrue` / `@AssertFalse`: 检查被注解的 `boolean` 或 `Boolean` 类型元素必须为 `true` / `false`。
- `@Min(value)` / `@Max(value)`: 检查被注解的数字类型（或其字符串表示）的值必须大于等于 / 小于等于指定的 `value`。适用于整数类型（`byte`、`short`、`int`、`long`、`BigInteger` 等）。
- `@DecimalMin(value)` / `@DecimalMax(value)`: 功能类似 `@Min` / `@Max`，但适用于包含小数的数字类型（`BigDecimal`、`BigInteger`、`CharSequence`、`byte`、`short`、`int`、`long`及其包装类）。 `value` 必须是数字的字符串表示。
- `@Size(min=, max=)`: 检查被注解的元素（如 `CharSequence`、`Collection`、`Map`、`Array`）的大小/长度必须在指定的 `min` 和 `max` 范围之内（包含边界）。
- `@Digits(integer=, fraction=)`: 检查被注解的数字类型（或其字符串表示）的值，其整数部分的位数必须 ≤ `integer`，小数部分的位数必须 ≤ `fraction`。
- `@Pattern(regexp=, flags=)`: 检查被注解的 `CharSequence`（如 `String`）是否匹配指定的正则表达式 (`regexp`)。`flags` 可以指定匹配模式（如不区分大小写）。
- `@Email`: 检查被注解的 `CharSequence`（如 `String`）是否符合 Email 格式（内置了一个相对宽松的正则表达式）。
- `@Past` / `@Future`: 检查被注解的日期或时间类型（`java.util.Date`、`java.util.Calendar`、JSR 310 `java.time` 包下的类型）是否在当前时间之前 / 之后。
- `@PastOrPresent` / `@FutureOrPresent`: 类似 `@Past` / `@Future`，但允许等于当前时间。
- ……

### 验证请求体(RequestBody)

当 Controller 方法使用 `@RequestBody` 注解来接收请求体并将其绑定到一个对象时，可以在该参数前添加 `@Valid` 注解来触发对该对象的校验。如果验证失败，它将抛出`MethodArgumentNotValidException`。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Person {
    @NotNull(message = "classId 不能为空")
    private String classId;

    @Size(max = 33)
    @NotNull(message = "name 不能为空")
    private String name;

    @Pattern(regexp = "((^Man$|^Woman$|^UGM$))", message = "sex 值不在可选范围")
    @NotNull(message = "sex 不能为空")
    private String sex;

    @Email(message = "email 格式不正确")
    @NotNull(message = "email 不能为空")
    private String email;
}


@RestController
@RequestMapping("/api")
public class PersonController {
    @PostMapping("/person")
    public ResponseEntity<Person> getPerson(@RequestBody @Valid Person person) {
        return ResponseEntity.ok().body(person);
    }
}
```

### 验证请求参数(Path Variables 和 Request Parameters)

对于直接映射到方法参数的简单类型数据（如路径变量 `@PathVariable` 或请求参数 `@RequestParam`），校验方式会因 Spring Framework 版本而异：

1. **Spring Framework 6.1 及以上版本**：Spring MVC 内置支持 Handler Method Validation。将 `@Min`、`@Max`、`@Size`、`@Pattern` 等约束注解直接放在方法参数上即可，不要在 Controller 类上添加 `@Validated`，否则会改用基于 AOP 的方法校验。
2. **Spring Framework 6.0 及更早版本**：通常需要在 Controller 类上添加 Spring 提供的 `@Validated`，通过方法校验基础设施处理参数约束。

下面以 Spring Framework 6.1 及以上版本的内置校验方式为例：

```java
@RestController
@RequestMapping("/api")
public class PersonController {

    @GetMapping("/person/{id}")
    public ResponseEntity<Integer> getPersonByID(
            @PathVariable("id")
            @Max(value = 5, message = "ID 不能超过 5")
            Integer id
    ) {
        // Spring MVC 6.1+ 会在进入方法体前抛出 HandlerMethodValidationException。
        return ResponseEntity.ok().body(id);
    }

    @GetMapping("/person")
    public ResponseEntity<String> findPersonByName(
            @RequestParam("name")
            @NotBlank(message = "姓名不能为空") // 同样适用于 @RequestParam
            @Size(max = 10, message = "姓名长度不能超过 10")
            String name
    ) {
        return ResponseEntity.ok().body("Found person: " + name);
    }
}
```

## 全局异常处理

介绍一下我们 Spring 项目必备的全局处理 Controller 层异常。

**相关注解：**

1. `@ControllerAdvice` :注解定义全局异常处理类
2. `@ExceptionHandler` :注解声明异常处理方法

如何使用呢？拿我们在第 5 节参数校验这块来举例子。如果方法参数不对的话就会抛出`MethodArgumentNotValidException`，我们来处理这个异常。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    /**
     * 请求参数异常处理
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
       ......
    }
}
```

更多关于 Spring Boot 异常处理的内容，请看我的这两篇文章：

1. [SpringBoot 处理异常的几种常见姿势](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=2133161636&lang=zh_CN#rd)
2. [使用枚举简单封装一个优雅的 Spring Boot 全局异常处理！](https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247486379&idx=2&sn=48c29ae65b3ed874749f0803f0e4d90e&chksm=cea24460f9d5cd769ed53ad7e17c97a7963a89f5350e370be633db0ae8d783c3a3dbd58c70f8&token=1054498516&lang=zh_CN#rd)

## 事务

在要开启事务的方法上使用`@Transactional`注解即可!

```java
@Transactional(rollbackFor = Exception.class)
public void save() {
  ......
}

```

我们知道 Exception 分为运行时异常 RuntimeException 和非运行时异常。在`@Transactional`注解中如果不配置`rollbackFor`属性,那么事务只会在遇到`RuntimeException`的时候才会回滚,加上`rollbackFor=Exception.class`,可以让事务在遇到非运行时异常时也回滚。

`@Transactional` 注解一般可以作用在`类`或者`方法`上。

- **作用于类**：当把`@Transactional` 注解放在类上时，表示所有该类的 public 方法都配置相同的事务属性信息。
- **作用于方法**：当类配置了`@Transactional`，方法也配置了`@Transactional`，方法的事务会覆盖类的事务配置信息。

更多关于 Spring 事务的内容请查看我的这篇文章：[可能是最漂亮的 Spring 事务管理详解](./Spring 事务详解.md) 。

## JPA

Spring Data JPA 提供了一系列注解和功能，帮助开发者轻松实现 ORM（对象关系映射）。

### 创建表

`@Entity` 用于声明一个类为 JPA 实体类，与数据库中的表映射。`@Table` 指定实体对应的表名。

```java
@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // 省略 getter/setter
}
```

### 主键生成策略

`@Id`声明字段为主键。`@GeneratedValue` 指定主键的生成策略。

Jakarta Persistence 3.1 提供了 5 种主键生成策略：

- **`GenerationType.TABLE`**：通过数据库表生成主键。
- **`GenerationType.SEQUENCE`**：通过数据库序列生成主键（适用于 Oracle 等数据库）。
- **`GenerationType.IDENTITY`**：主键自增长（适用于 MySQL 等数据库）。
- **`GenerationType.UUID`**：生成 RFC 4122 UUID，适用于 `UUID` 或 `String` 类型主键。
- **`GenerationType.AUTO`**：由 JPA 自动选择合适的生成策略（默认策略）。

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

通过 `@GenericGenerator` 声明自定义主键生成策略：

```java
@Id
@GeneratedValue(generator = "IdentityIdGenerator")
@GenericGenerator(name = "IdentityIdGenerator", strategy = "identity")
private Long id;
```

等价于：

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```

下面是旧版 Hibernate 内部实现的源码节选，展示了当时 Hibernate 支持的字符串生成器策略。它不属于 JPA/Jakarta Persistence 标准 API，也不能替代上面的标准 `GenerationType` 枚举；新项目应以所使用 Hibernate 版本的官方文档为准。

```java
public class DefaultIdentifierGeneratorFactory
    implements MutableIdentifierGeneratorFactory, Serializable, ServiceRegistryAwareService {

  @SuppressWarnings("deprecation")
  public DefaultIdentifierGeneratorFactory() {
    register( "uuid2", UUIDGenerator.class );
    register( "guid", GUIDGenerator.class );      // can be done with UUIDGenerator + strategy
    register( "uuid", UUIDHexGenerator.class );      // "deprecated" for new use
    register( "uuid.hex", UUIDHexGenerator.class );   // uuid.hex is deprecated
    register( "assigned", Assigned.class );
    register( "identity", IdentityGenerator.class );
    register( "select", SelectGenerator.class );
    register( "sequence", SequenceStyleGenerator.class );
    register( "seqhilo", SequenceHiLoGenerator.class );
    register( "increment", IncrementGenerator.class );
    register( "foreign", ForeignGenerator.class );
    register( "sequence-identity", SequenceIdentityGenerator.class );
    register( "enhanced-sequence", SequenceStyleGenerator.class );
    register( "enhanced-table", TableGenerator.class );
  }

  public void register(String strategy, Class generatorClass) {
    LOG.debugf( "Registering IdentifierGenerator strategy [%s] -> [%s]", strategy, generatorClass.getName() );
    final Class previous = generatorStrategyToClassNameMap.put( strategy, generatorClass );
    if ( previous != null ) {
      LOG.debugf( "    - overriding [%s]", previous.getName() );
    }
  }

}
```

### 字段映射

`@Column` 用于指定实体字段与数据库列的映射关系。

- **`name`**：指定数据库列名。
- **`nullable`**：指定是否允许为 `null`。
- **`length`**：设置字段的长度（仅适用于 `String` 类型）。
- **`columnDefinition`**：指定字段的数据库类型和默认值。

```java
@Column(name = "user_name", nullable = false, length = 32)
private String userName;

@Column(columnDefinition = "tinyint(1) default 1")
private Boolean enabled;
```

### 忽略字段

`@Transient` 用于声明不需要持久化的字段。

```java
@Entity
public class User {

    @Transient
    private String temporaryField; // 不会映射到数据库表中
}
```

其他不被持久化的字段方式：

- **`static`**：静态字段不会被持久化。
- **`final`**：最终字段不会被持久化。
- **`transient`**：使用 Java 的 `transient` 关键字声明的字段不会被序列化或持久化。

### 大字段存储

`@Lob` 用于声明大字段（如 `CLOB` 或 `BLOB`）。

```java
@Lob
@Column(name = "content", columnDefinition = "LONGTEXT NOT NULL")
private String content;
```

### 枚举类型映射

`@Enumerated` 用于将枚举类型映射为数据库字段。

- **`EnumType.ORDINAL`**：存储枚举的序号（默认）。
- **`EnumType.STRING`**：存储枚举的名称（推荐）。

```java
public enum Gender {
    MALE,
    FEMALE
}

@Entity
public class User {

    @Enumerated(EnumType.STRING)
    private Gender gender;
}
```

数据库中存储的值为 `MALE` 或 `FEMALE`。

### 审计功能

通过 JPA 的审计功能，可以在实体中自动记录创建时间、更新时间、创建人和更新人等信息。

审计基类:

```java
@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}
```

配置审计功能:

```java
@Configuration
@EnableJpaAuditing
public class AuditConfig {

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getName);
    }
}
```

简单介绍一下上面涉及到的一些注解：

1. `@CreatedDate`: 表示该字段为创建时间字段，在这个实体被 insert 的时候，会设置值
2. `@CreatedBy` :表示该字段为创建人，在这个实体被 insert 的时候，会设置值 `@LastModifiedDate`、`@LastModifiedBy`同理。
3. `@EnableJpaAuditing`：开启 JPA 审计功能。

### 修改和删除操作

`@Modifying` 用于把 `@Query` 声明的语句标识为 INSERT、UPDATE、DELETE 或 DDL 等修改操作。派生删除方法（例如 `deleteByUserName`）不需要 `@Modifying`。事务边界既可以声明在 Repository 方法上，也可以由上层 Service 的工作单元统一管理。

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Modifying
    @Transactional
    @Query("delete from User user where user.userName = :userName")
    int deleteByUserName(@Param("userName") String userName);
}
```

### 关联关系

JPA 提供了 4 种关联关系的注解：

- **`@OneToOne`**：一对一关系。
- **`@OneToMany`**：一对多关系。
- **`@ManyToOne`**：多对一关系。
- **`@ManyToMany`**：多对多关系。

```java
@Entity
public class User {

    @OneToOne
    private Profile profile;

    @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
```

## JSON 数据处理

在 Web 开发中，经常需要处理 Java 对象与 JSON 格式之间的转换。Spring 通常集成 Jackson 库来完成此任务，以下是一些常用的 Jackson 注解，可以帮助我们定制化 JSON 的序列化（Java 对象转 JSON）和反序列化（JSON 转 Java 对象）过程。

### 过滤 JSON 字段

有时我们不希望 Java 对象的某些字段被包含在最终生成的 JSON 中，或者在将 JSON 转换为 Java 对象时不处理某些 JSON 属性。

`@JsonIgnoreProperties` 作用在类上用于过滤掉特定字段不返回或者不解析。

```java
// 在生成 JSON 时忽略 userRoles 属性
// 如果允许未知属性（即 JSON 中有而类中没有的属性），可以添加 ignoreUnknown = true
@JsonIgnoreProperties({"userRoles"})
public class User {
    private String userName;
    private String fullName;
    private String password;
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnore`作用于字段或`getter/setter` 方法级别，用于指定在序列化或反序列化时忽略该特定属性。

```java
public class User {
    private String userName;
    private String fullName;
    private String password;

    // 在生成 JSON 时忽略 userRoles 属性
    @JsonIgnore
    private List<UserRole> userRoles = new ArrayList<>();
    // getters and setters...
}
```

`@JsonIgnoreProperties` 更适用于在类定义时明确排除多个字段，或继承场景下的字段排除；`@JsonIgnore` 则更直接地用于标记单个具体字段。

### 格式化 JSON 数据

`@JsonFormat` 用于指定属性在序列化和反序列化时的格式。常用于日期时间类型的格式化。

比如：

```java
// 指定 Date 类型序列化为 ISO 8601 格式字符串，并设置时区为 GMT
@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "GMT")
private Date date;
```

### 扁平化 JSON 对象

`@JsonUnwrapped` 注解作用于字段上，用于在序列化时将其嵌套对象的属性“提升”到当前对象的层级，反序列化时执行相反操作。这可以使 JSON 结构更扁平。

假设有 `Account` 类，包含 `Location` 和 `PersonInfo` 两个嵌套对象。

```java
@Getter
@Setter
@ToString
public class Account {
    private Location location;
    private PersonInfo personInfo;

  @Getter
  @Setter
  @ToString
  public static class Location {
     private String provinceName;
     private String countyName;
  }
  @Getter
  @Setter
  @ToString
  public static class PersonInfo {
    private String userName;
    private String fullName;
  }
}

```

未扁平化之前的 JSON 结构：

```json
{
  "location": {
    "provinceName": "湖北",
    "countyName": "武汉"
  },
  "personInfo": {
    "userName": "coder1234",
    "fullName": "shaungkou"
  }
}
```

使用`@JsonUnwrapped` 扁平对象：

```java
@Getter
@Setter
@ToString
public class Account {
    @JsonUnwrapped
    private Location location;
    @JsonUnwrapped
    private PersonInfo personInfo;
    ......
}
```

扁平化后的 JSON 结构：

```json
{
  "provinceName": "湖北",
  "countyName": "武汉",
  "userName": "coder1234",
  "fullName": "shaungkou"
}
```

## 测试

`@ActiveProfiles`一般作用于测试类上， 用于声明生效的 Spring 配置文件。

```java
// 指定在 RANDOM_PORT 上启动应用上下文，并激活 "test" profile
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Slf4j
public abstract class TestBase {
    // Common test setup or abstract methods...
}
```

`@Test` 是 JUnit 框架（通常是 JUnit 5 Jupiter）提供的注解，用于标记一个方法为测试方法。虽然不是 Spring 自身的注解，但它是执行单元测试和集成测试的基础。

由 Spring TestContext 在测试线程中管理的 `@Transactional` 测试方法默认会在测试结束后回滚，避免污染测试数据。需要注意，如果使用 `RANDOM_PORT` 发起真实 HTTP 请求，服务端处理运行在另一个线程和事务中，不会随测试线程的事务自动回滚，此时需要使用隔离数据库或显式清理数据。

`@WithMockUser` 是 Spring Security Test 模块提供的注解，用于在测试期间模拟一个已认证的用户。可以方便地指定用户名、密码、角色（authorities）等信息，从而测试受安全保护的端点或方法。

```java
public class MyServiceTest extends TestBase { // Assuming TestBase provides Spring context

    @Test
    @Transactional // 测试数据将回滚
    @WithMockUser(username = "test-user", authorities = { "ROLE_TEACHER", "read" }) // 模拟一个名为 "test-user"，拥有 TEACHER 角色和 read 权限的用户
    void should_perform_action_requiring_teacher_role() throws Exception {
        // ... 测试逻辑 ...
        // 这里可以调用需要 "ROLE_TEACHER" 权限的服务方法
    }
}
```

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 框架/spring/SpringBoot 自动装配原理详解.md -->

## [25] SpringBoot 自动装配原理详解

---
title: SpringBoot 自动装配原理详解
description: SpringBoot自动装配原理深度解析，详解@EnableAutoConfiguration、SpringFactories加载机制及条件注解工作原理。
category: 框架
tag:
  - SpringBoot
head:
  - - meta
    - name: keywords
      content: Spring Boot自动装配,AutoConfiguration,EnableAutoConfiguration,SpringFactories,条件注解,Starter,Spring Boot原理
---

> 作者：[Miki-byte-1024](https://github.com/Miki-byte-1024) & [Snailclimb](https://github.com/Snailclimb)

每次问到 Spring Boot， 面试官非常喜欢问这个问题：“讲述一下 SpringBoot 自动装配原理？”。

我觉得我们可以从以下几个方面回答：

1. 什么是 SpringBoot 自动装配？
2. SpringBoot 是如何实现自动装配的？如何实现按需加载？
3. 如何实现一个 Starter？

篇幅问题，这篇文章并没有深入，小伙伴们也可以直接使用 debug 的方式去看看 SpringBoot 自动装配部分的源代码。

## 前言

使用过 Spring 的小伙伴，一定有被 XML 配置统治的恐惧。即使 Spring 后面引入了基于注解的配置，我们在开启某些 Spring 特性或者引入第三方依赖的时候，还是需要用 XML 或 Java 进行显式配置。

举个例子。没有 Spring Boot 的时候，我们写一个 RestFul Web 服务，还首先需要进行如下配置。

```java
@Configuration
public class RESTConfiguration
{
    @Bean
    public View jsonTemplate() {
        MappingJackson2JsonView view = new MappingJackson2JsonView();
        view.setPrettyPrint(true);
        return view;
    }

    @Bean
    public ViewResolver viewResolver() {
        return new BeanNameViewResolver();
    }
}
```

`spring-servlet.xml`

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context/ http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/mvc/ http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <context:component-scan base-package="com.howtodoinjava.demo" />
    <mvc:annotation-driven />

    <!-- JSON Support -->
    <bean name="viewResolver" class="org.springframework.web.servlet.view.BeanNameViewResolver"/>
    <bean name="jsonTemplate" class="org.springframework.web.servlet.view.json.MappingJackson2JsonView"/>

</beans>
```

但是，Spring Boot 项目，我们只需要添加相关依赖，无需配置，通过启动下面的 `main` 方法即可。

```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

并且，我们通过 Spring Boot 的全局配置文件 `application.properties`或`application.yml`即可对项目进行设置比如更换端口号，配置 JPA 属性等等。

**为什么 Spring Boot 使用起来这么酸爽呢？** 这得益于其自动装配。**自动装配可以说是 Spring Boot 的核心，那究竟什么是自动装配呢？**

## 什么是 SpringBoot 自动装配？

我们现在提到自动装配的时候，一般会和 Spring Boot 联系在一起。但是，实际上 Spring Framework 早就实现了这个功能。Spring Boot 只是在其基础上，通过 SPI 的方式，做了进一步优化。

> 在 Spring Boot 2.6 及更早版本中，自动配置类主要通过外部 jar 包中的 `META-INF/spring.factories` 注册。Spring Boot 2.7 引入了 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，同时兼容旧的注册方式；Spring Boot 3.0 移除了通过 `spring.factories` 中 `EnableAutoConfiguration` key 注册自动配置类的支持，但 `spring.factories` 的其他用途不受影响。

没有 Spring Boot 的情况下，如果我们需要引入第三方依赖，需要手动配置，非常麻烦。但是，Spring Boot 中，我们直接引入一个 starter 即可。比如你想要在项目中使用 redis 的话，直接在项目中引入对应的 starter 即可。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

引入 starter 之后，我们通过少量注解和一些简单的配置就能使用第三方组件提供的功能了。

在我看来，自动装配可以简单理解为：**通过注解或者一些简单的配置就能在 Spring Boot 的帮助下实现某块功能。**

## SpringBoot 是如何实现自动装配的？

我们先看一下 SpringBoot 的核心注解 `SpringBootApplication` 。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
<1.>@SpringBootConfiguration
<2.>@ComponentScan
<3.>@EnableAutoConfiguration
public @interface SpringBootApplication {

}

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration //实际上它也是一个配置类
public @interface SpringBootConfiguration {
}
```

大概可以把 `@SpringBootApplication`看作是 `@Configuration`、`@EnableAutoConfiguration`、`@ComponentScan` 注解的集合。根据 SpringBoot 官网，这三个注解的作用分别是：

- `@EnableAutoConfiguration`：启用 SpringBoot 的自动配置机制
- `@Configuration`：允许在上下文中注册额外的 bean 或导入其他配置类
- `@ComponentScan`：扫描被`@Component` (`@Service`,`@Controller`)注解的 bean，注解默认会扫描启动类所在的包下所有的类 ，可以自定义不扫描某些 bean。如下图所示，容器中将排除`TypeExcludeFilter`和`AutoConfigurationExcludeFilter`。

![](https://oss.javaguide.cn/p3-juejin/bcc73490afbe4c6ba62acde6a94ffdfd~tplv-k3u1fbpfcp-watermark.png)

`@EnableAutoConfiguration` 是实现自动装配的重要注解，我们以这个注解入手。

### @EnableAutoConfiguration:实现自动装配的核心注解

`EnableAutoConfiguration` 只是一个简单地注解，自动装配核心功能的实现实际是通过 `AutoConfigurationImportSelector`类。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage //作用：将main包下的所有组件注册到容器中
@Import({AutoConfigurationImportSelector.class}) //加载自动装配类 xxxAutoconfiguration
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

我们现在重点分析下`AutoConfigurationImportSelector` 类到底做了什么？

### AutoConfigurationImportSelector:加载自动装配类

下面以 Spring Boot 2.1.x 的源码节选为例分析 `AutoConfigurationImportSelector`。这些代码省略了部分不影响流程的实现，不能作为独立类直接编译。Spring Boot 2.7 及以上版本的候选自动配置类主要从 `AutoConfiguration.imports` 文件读取，具体源码结构与下面的旧版本代码有所不同。

`AutoConfigurationImportSelector`类的继承体系如下：

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

}

public interface DeferredImportSelector extends ImportSelector {

}

public interface ImportSelector {
    String[] selectImports(AnnotationMetadata var1);
}
```

可以看出，`AutoConfigurationImportSelector` 类实现了 `ImportSelector`接口，也就实现了这个接口中的 `selectImports`方法，该方法主要用于**获取所有符合条件的类的全限定类名，这些类需要被加载到 IoC 容器中**。

```java
private static final String[] NO_IMPORTS = new String[0];

public String[] selectImports(AnnotationMetadata annotationMetadata) {
        // <1>.判断自动装配开关是否打开
        if (!this.isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        } else {
          //<2>.获取所有需要装配的bean
            AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader.loadMetadata(this.beanClassLoader);
            AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(autoConfigurationMetadata, annotationMetadata);
            return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
        }
    }
```

这里我们需要重点关注一下`getAutoConfigurationEntry()`方法，这个方法主要负责加载自动配置类的。

该方法调用链如下：

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/3c1200712655443ca4b38500d615bb70~tplv-k3u1fbpfcp-watermark.png)

现在我们结合`getAutoConfigurationEntry()`的源码来详细分析一下：

```java
private static final AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationEntry();

AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
        //<1>.
        if (!this.isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        } else {
            //<2>.
            AnnotationAttributes attributes = this.getAttributes(annotationMetadata);
            //<3>.
            List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
            //<4>.
            configurations = this.removeDuplicates(configurations);
            Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);
            this.checkExcludedClasses(configurations, exclusions);
            configurations.removeAll(exclusions);
            configurations = this.filter(configurations, autoConfigurationMetadata);
            this.fireAutoConfigurationImportEvents(configurations, exclusions);
            return new AutoConfigurationImportSelector.AutoConfigurationEntry(configurations, exclusions);
        }
    }
```

**第 1 步**:

判断自动装配开关是否打开。默认`spring.boot.enableautoconfiguration=true`，可在 `application.properties` 或 `application.yml` 中设置

![](https://oss.javaguide.cn/p3-juejin/77aa6a3727ea4392870f5cccd09844ab~tplv-k3u1fbpfcp-watermark.png)

**第 2 步**：

用于获取`EnableAutoConfiguration`注解中的 `exclude` 和 `excludeName`。

![](https://oss.javaguide.cn/p3-juejin/3d6ec93bbda1453aa08c52b49516c05a~tplv-k3u1fbpfcp-zoom-1.png)

**第 3 步**

在本文采用的 Spring Boot 2.1.x 源码中，获取需要自动装配的所有配置类时会读取 `META-INF/spring.factories`：

```plain
spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/58c51920efea4757aa1ec29c6d5f9e36~tplv-k3u1fbpfcp-watermark.png)

从下图可以看到这个文件的配置内容都被我们读取到了。`XXXAutoConfiguration`的作用就是按需加载组件。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/94d6e1a060ac41db97043e1758789026~tplv-k3u1fbpfcp-watermark.png)

不光是这个依赖下的 `META-INF/spring.factories` 会被读取，类路径中其他 jar 包的同名资源也会被 `SpringFactoriesLoader` 合并读取。需要注意，Starter 通常只是用于聚合依赖的 jar，自动配置代码和注册文件可以放在独立的 autoconfigure 模块中，也可以和 Starter 合并，并不是每个 Starter 都必须包含 `spring.factories`。

所以，你可以清楚滴看到， druid 数据库连接池的 Spring Boot Starter 就创建了`META-INF/spring.factories`文件。

如果要为 Spring Boot 2.6 及更早版本编写自动配置，需要使用这种注册方式；面向 Spring Boot 3.x 的自动配置应改用 `AutoConfiguration.imports`。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/68fa66aeee474b0385f94d23bcfe1745~tplv-k3u1fbpfcp-watermark.png)

**第 4 步**：

到这里可能面试官会问你:“`spring.factories`中这么多配置，每次启动都要全部加载么？”。

很明显，这是不现实的。我们 debug 到后面你会发现，`configurations` 的值变小了。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/267f8231ae2e48d982154140af6437b0~tplv-k3u1fbpfcp-watermark.png)

因为，这一步有经历了一遍筛选，`@ConditionalOnXXX` 中的所有条件都满足，该类才会生效。

```java
@Configuration
// 检查相关的类：RabbitTemplate 和 Channel是否存在
// 存在才会加载
@ConditionalOnClass({ RabbitTemplate.class, Channel.class })
@EnableConfigurationProperties(RabbitProperties.class)
@Import(RabbitAnnotationDrivenConfiguration.class)
public class RabbitAutoConfiguration {
}
```

有兴趣的童鞋可以详细了解下 Spring Boot 提供的条件注解

- `@ConditionalOnBean`：当容器里有指定 Bean 的条件下
- `@ConditionalOnMissingBean`：当容器里没有指定 Bean 的情况下
- `@ConditionalOnSingleCandidate`：当指定 Bean 在容器中只有一个，或者虽然有多个但是指定首选 Bean
- `@ConditionalOnClass`：当类路径下有指定类的条件下
- `@ConditionalOnMissingClass`：当类路径下没有指定类的条件下
- `@ConditionalOnProperty`：指定的属性是否有指定的值
- `@ConditionalOnResource`：类路径是否有指定的值
- `@ConditionalOnExpression`：基于 SpEL 表达式作为判断条件
- `@ConditionalOnJava`：基于 Java 版本作为判断条件
- `@ConditionalOnJndi`：在 JNDI 存在的条件下差在指定的位置
- `@ConditionalOnNotWebApplication`：当前项目不是 Web 项目的条件下
- `@ConditionalOnWebApplication`：当前项目是 Web 项 目的条件下

## 如何实现一个 Starter

光说不练假把式，现在就来撸一个 starter，实现自定义线程池

第一步，创建`threadpool-spring-boot-starter`工程

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/1ff0ebe7844f40289eb60213af72c5a6~tplv-k3u1fbpfcp-watermark.png)

第二步，引入 Spring Boot 相关依赖

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/5e14254276604f87b261e5a80a354cc0~tplv-k3u1fbpfcp-watermark.png)

第三步，创建`ThreadPoolAutoConfiguration`

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/1843f1d12c5649fba85fd7b4e4a59e39~tplv-k3u1fbpfcp-watermark.png)

第四步，注册自动配置类。对于 Spring Boot 2.6 及更早版本，在`threadpool-spring-boot-starter`工程的 resources 包下创建`META-INF/spring.factories`文件；Spring Boot 2.7 及以上版本应使用 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，面向 Spring Boot 3.x 时自动配置类通常使用 `@AutoConfiguration` 标注。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/97b738321f1542ea8140484d6aaf0728~tplv-k3u1fbpfcp-watermark.png)

最后新建工程引入`threadpool-spring-boot-starter`

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/edcdd8595a024aba85b6bb20d0e3fed4~tplv-k3u1fbpfcp-watermark.png)

测试通过！！！

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/9a265eea4de742a6bbdbbaa75f437307~tplv-k3u1fbpfcp-watermark.png)

## 总结

Spring Boot 通过`@EnableAutoConfiguration`开启自动装配，并加载类路径中注册的候选自动配置类。Spring Boot 2.6 及更早版本主要通过 `spring.factories` 注册，Spring Boot 2.7 及以上版本使用 `AutoConfiguration.imports`。自动配置类会结合 `@Conditional` 系列注解按需生效；Starter 的主要作用是聚合常用依赖，并不是自动配置生效所要求的固定包名。

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 框架/spring/Spring常见面试题总结.md -->

## [26] Spring常见面试题总结

---
title: Spring常见面试题总结
description: Spring框架核心面试题详解，涵盖IoC容器、AOP原理、Bean生命周期、依赖注入等Spring核心知识点。
category: 框架
tag:
  - Spring
head:
  - - meta
    - name: keywords
      content: Spring面试题,Spring框架,Bean生命周期,IoC,AOP,依赖注入,事务,Spring常见问题
---

这篇文章主要是想通过一些问题，加深大家对于 Spring 的理解，所以不会涉及太多的代码！

下面的很多问题我自己在使用 Spring 的过程中也并没有注意，自己也是临时查阅了很多资料和书籍补上的。网上也有一些很多关于 Spring 常见问题/面试题整理的文章，我感觉大部分都是互相 copy，而且很多问题也不是很好，有些回答也存在问题。所以，自己花了一周的业余时间整理了一下，希望对大家有帮助。

## Spring 基础

### 什么是 Spring 框架?

Spring 是一款开源的轻量级 Java 开发框架，旨在提高开发人员的开发效率以及系统的可维护性。

我们一般说 Spring 框架指的都是 Spring Framework，它是很多模块的集合，使用这些模块可以很方便地协助我们进行开发，比如说 Spring 支持 IoC（Inversion of Control:控制反转） 和 AOP(Aspect-Oriented Programming:面向切面编程)、可以很方便地对数据库进行访问、可以很方便地集成第三方组件（电子邮件，任务，调度，缓存等等）、对单元测试支持比较好、支持 RESTful Java 应用程序的开发。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/38ef122122de4375abcd27c3de8f60b4.png)

Spring 最核心的思想就是不重新造轮子，开箱即用，提高开发效率。

Spring 翻译过来就是春天的意思，可见其目标和使命就是为 Java 程序员带来春天啊！感动！

🤐 多提一嘴：**语言的流行通常需要一个杀手级的应用，Spring 就是 Java 生态的一个杀手级的应用框架。**

Spring 提供的核心功能主要是 IoC 和 AOP。学习 Spring ，一定要把 IoC 和 AOP 的核心思想搞懂！

- Spring 官网：<https://spring.io/>
- GitHub 地址： <https://github.com/spring-projects/spring-framework>

### Spring 包含的模块有哪些？

**Spring4.x 版本**：

![Spring4.x主要模块](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/jvme0c60b4606711fc4a0b6faf03230247a.png)

**Spring5.x 版本**：

![Spring5.x主要模块](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/20200831175708.png)

Spring5.x 版本中 Web 模块的 Portlet 组件已经被废弃掉，同时增加了用于异步响应式处理的 WebFlux 组件。

Spring 各个模块的依赖关系如下：

![Spring 各个模块的依赖关系](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/20200902100038.png)

#### Core Container

Spring 框架的核心模块，也可以说是基础模块，主要提供 IoC 依赖注入功能的支持。Spring 其他所有的功能基本都需要依赖于该模块，我们从上面那张 Spring 各个模块的依赖关系图就可以看出来。

- **spring-core**：Spring 框架基本的核心工具类。
- **spring-beans**：提供对 bean 的创建、配置和管理等功能的支持。
- **spring-context**：提供对国际化、事件传播、资源加载等功能的支持。
- **spring-expression**：提供对表达式语言（Spring Expression Language） SpEL 的支持，只依赖于 core 模块，不依赖于其他模块，可以单独使用。

#### AOP

- **spring-aspects**：该模块为与 AspectJ 的集成提供支持。
- **spring-aop**：提供了面向切面的编程实现。
- **spring-instrument**：提供了为 JVM 添加代理（agent）的功能。 具体来讲，它为 Tomcat 提供了一个织入代理，能够为 Tomcat 传递类文 件，就像这些文件是被类加载器加载的一样。没有理解也没关系，这个模块的使用场景非常有限。

#### Data Access/Integration

下面的模块列表主要基于 Spring Framework 5.x。现代 Spring Framework 已经移除了一些旧技术的集成，实际使用时应以目标 Spring 版本的官方模块清单为准。

- **spring-jdbc**：提供了对数据库访问的抽象 JDBC。不同的数据库都有自己独立的 API 用于操作数据库，而 Java 程序只需要和 JDBC API 交互，这样就屏蔽了数据库的影响。
- **spring-tx**：提供对事务的支持。
- **spring-orm**：在 Spring Framework 5.x 中提供对 Hibernate、JPA 等 ORM 技术的支持；更早的 Spring 版本还提供过 iBATIS 集成。
- **spring-oxm**：提供 OXM（Object-to-XML Mapping）抽象。不同 Spring 版本支持的具体实现不同，例如 JAXB；Castor、XMLBeans、JiBX 等属于旧版本集成。
- **spring-jms** : 消息服务。自 Spring Framework 4.1 以后，它还提供了对 spring-messaging 模块的继承。

#### Spring Web

- **spring-web**：对 Web 功能的实现提供一些最基础的支持。
- **spring-webmvc**：提供对 Spring MVC 的实现。
- **spring-websocket**：提供了对 WebSocket 的支持，WebSocket 可以让客户端和服务端进行双向通信。
- **spring-webflux**：提供对 WebFlux 的支持。WebFlux 是 Spring Framework 5.0 中引入的响应式、非阻塞 Web 框架，可以运行在 Netty 上，也可以运行在支持非阻塞 I/O 的 Servlet 容器上。应用是否端到端非阻塞，还取决于数据访问和其他下游调用是否包含阻塞操作。

#### Messaging

**spring-messaging** 是从 Spring4.0 开始新加入的一个模块，主要职责是为 Spring 框架集成一些基础的报文传送应用。

#### Spring Test

Spring 团队提倡测试驱动开发（TDD）。有了控制反转 (IoC)的帮助，单元测试和集成测试变得更简单。

Spring 的测试模块对 JUnit（单元测试框架）、TestNG（类似 JUnit）、Mockito（主要用来 Mock 对象）、PowerMock（解决 Mockito 的问题比如无法模拟 final, static， private 方法）等等常用的测试框架支持的都比较好。

### ⭐️Spring,Spring MVC,Spring Boot 之间什么关系?

很多人对 Spring,Spring MVC,Spring Boot 这三者傻傻分不清楚！这里简单介绍一下这三者，其实很简单，没有什么高深的东西。

Spring 包含了多个功能模块（上面刚刚提到过），其中最重要的是 Spring-Core（主要提供 IoC 依赖注入功能的支持） 模块， Spring 中的其他模块（比如 Spring MVC）的功能实现基本都需要依赖于该模块。

下图对应的是 Spring 4.x 版本。Spring 5.0 引入了用于响应式处理的 WebFlux，并逐步淘汰了 Portlet 相关支持；现代 Spring 版本的模块组成请以官方文档为准。

![Spring主要模块](https://oss.javaguide.cn/github/javaguide/jvme0c60b4606711fc4a0b6faf03230247a.png)

Spring MVC 是 Spring 中的一个很重要的模块，主要赋予 Spring 快速构建 MVC 架构的 Web 程序的能力。MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

使用 Spring 进行开发各种配置过于麻烦比如开启某些 Spring 特性时，需要用 XML 或 Java 进行显式配置。于是，Spring Boot 诞生了！

Spring 旨在简化 J2EE 企业应用程序开发。Spring Boot 旨在简化 Spring 开发（减少配置文件，开箱即用！）。

Spring Boot 只是简化了配置，如果你需要构建 MVC 架构的 Web 程序，你还是需要使用 Spring MVC 作为 MVC 框架，只是说 Spring Boot 帮你简化了 Spring MVC 的很多配置，真正做到开箱即用！

## Spring IoC

### ⭐️什么是 IoC?

IoC （Inversion of Control ）即控制反转/反转控制。它是一种思想不是一个技术实现。描述的是：Java 开发领域对象的创建以及管理的问题。

例如：现有类 A 依赖于类 B

- **传统的开发方式** ：往往是在类 A 中手动通过 new 关键字来 new 一个 B 的对象出来
- **使用 IoC 思想的开发方式** ：不通过 new 关键字来创建对象，而是通过 IoC 容器(Spring 框架) 来帮助我们实例化对象。我们需要哪个对象，直接从 IoC 容器里面去取即可。

从以上两种开发方式的对比来看：我们 “丧失了一个权力” (创建、管理对象的权力)，从而也得到了一个好处（不用再考虑对象的创建、管理等一系列的事情）

**为什么叫控制反转?**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（IoC 容器）

![IoC 图解](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration.png)

### ⭐️IoC 解决了什么问题?

IoC 的思想就是两方之间不互相依赖，由第三方容器来管理相关资源。这样有什么好处呢？

1. 对象之间的耦合度或者说依赖程度降低；
2. 资源变的容易管理；比如你用 Spring 容器提供的话很容易就可以实现一个单例。

例如：现有一个针对 User 的操作，利用 Service 和 Dao 两层结构进行开发

在没有使用 IoC 思想的情况下，Service 层想要使用 Dao 层的具体实现的话，需要通过 new 关键字在`UserServiceImpl` 中手动 new 出 `IUserDao` 的具体实现类 `UserDaoImpl`（不能直接 new 接口类）。

很完美，这种方式也是可以实现的，但是我们想象一下如下场景：

开发过程中突然接到一个新的需求，针对`IUserDao` 接口开发出另一个具体实现类。因为 Server 层依赖了`IUserDao`的具体实现，所以我们需要修改`UserServiceImpl`中 new 的对象。如果只有一个类引用了`IUserDao`的具体实现，可能觉得还好，修改起来也不是很费力气，但是如果有许许多多的地方都引用了`IUserDao`的具体实现的话，一旦需要更换`IUserDao` 的实现方式，那修改起来将会非常的头疼。

![IoC&Aop-ioc-illustration-dao-service](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao-service.png)

使用 IoC 的思想，我们将对象的控制权（创建、管理）交由 IoC 容器去管理，我们在使用的时候直接向 IoC 容器 “要” 就可以了

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/IoC&Aop-ioc-illustration-dao.png)

### 什么是 Spring Bean？

简单来说，Bean 代指的就是那些被 IoC 容器所管理的对象。

我们需要告诉 IoC 容器帮助我们管理哪些对象，这个是通过配置元数据来定义的。配置元数据可以是 XML 文件、注解或者 Java 配置类。

```xml
<!-- Constructor-arg with 'value' attribute -->
<bean id="..." class="...">
   <constructor-arg value="..."/>
</bean>
```

下图简单地展示了 IoC 容器如何使用配置元数据来管理对象。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/062b422bd7ac4d53afd28fb74b2bc94d.png)

`org.springframework.beans`和 `org.springframework.context` 这两个包是 IoC 实现的基础，如果想要研究 IoC 相关的源码的话，可以去看看

### 将一个类声明为 Bean 的注解有哪些?

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 `Service` 层返回数据给前端页面。

### @Component 和 @Bean 的区别是什么？

- `@Component` 注解作用于类，而`@Bean`注解作用于方法。
- `@Component`通常是通过类路径扫描来自动侦测以及自动装配到 Spring 容器中（我们可以使用 `@ComponentScan` 注解定义要扫描的路径从中找出标识了需要装配的类自动装配到 Spring 的 bean 容器中）。`@Bean` 注解通常是我们在标有该注解的方法中定义产生这个 bean,`@Bean`告诉了 Spring 这是某个类的实例，当我需要用它的时候还给我。
- `@Bean` 注解比 `@Component` 注解的自定义性更强，而且很多地方我们只能通过 `@Bean` 注解来注册 bean。比如当我们引用第三方库中的类需要装配到 `Spring`容器时，则只能通过 `@Bean`来实现。

`@Bean`注解使用示例：

```java
@Configuration
public class AppConfig {
    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }

}
```

上面的代码相当于下面的 xml 配置

```xml
<beans>
    <bean id="transferService" class="com.acme.TransferServiceImpl"/>
</beans>
```

下面这个例子是通过 `@Component` 无法实现的。

```java
@Bean
public OneService getService(status) {
    case (status)  {
        when 1:
                return new serviceImpl1();
        when 2:
                return new serviceImpl2();
        when 3:
                return new serviceImpl3();
    }
}
```

### 注入 Bean 的注解有哪些？

Spring 提供的 `@Autowired`，以及 Jakarta 规范提供的 `@Resource` 和 `@Inject`，都可以用于注入 Bean。

| Annotation   | Package                                        | Source                                 |
| ------------ | ---------------------------------------------- | -------------------------------------- |
| `@Autowired` | `org.springframework.beans.factory.annotation` | Spring 2.5+                            |
| `@Resource`  | `jakarta.annotation`（Spring 6+）              | Jakarta Annotations / JSR-250          |
| `@Inject`    | `jakarta.inject`（Spring 6+）                  | Jakarta Dependency Injection / JSR-330 |

`@Autowired` 和`@Resource`使用的比较多一些。

### ⭐️@Autowired 和 @Resource 的区别是什么？

`@Autowired` 是 Spring 内置的注解，默认注入逻辑为**先按类型（byType）匹配，若存在多个同类型 Bean，则再尝试按名称（byName）筛选**。

具体来说：

1. 优先根据接口 / 类的类型在 Spring 容器中查找匹配的 Bean。若只找到一个符合类型的 Bean，直接注入，无需考虑名称；
2. 若找到多个同类型的 Bean（例如一个接口有多个实现类），则会尝试通过**属性名或参数名**与 Bean 的名称进行匹配（默认 Bean 名称为类名首字母小写，除非通过 `@Bean(name = "...")` 或 `@Component("...")` 显式指定）。

当一个接口存在多个实现类时：

- 若属性名与某个 Bean 的名称一致，则注入该 Bean；
- 若属性名与所有 Bean 名称都不匹配，会抛出 `NoUniqueBeanDefinitionException`，此时需要通过 `@Qualifier` 显式指定要注入的 Bean 名称。

举例说明：

```java
// SmsService 接口有两个实现类：SmsServiceImpl1、SmsServiceImpl2（均被 Spring 管理）

// 报错：byType 匹配到多个 Bean，且属性名 "smsService" 与两个实现类的默认名称（smsServiceImpl1、smsServiceImpl2）都不匹配
@Autowired
private SmsService smsService;

// 正确：属性名 "smsServiceImpl1" 与实现类 SmsServiceImpl1 的默认名称匹配
@Autowired
private SmsService smsServiceImpl1;

// 正确：通过 @Qualifier 显式指定 Bean 名称 "smsServiceImpl1"
@Autowired
@Qualifier(value = "smsServiceImpl1")
private SmsService smsService;
```

实际开发实践中，我们还是建议通过 `@Qualifier` 注解来显式指定名称而不是依赖变量的名称。

`@Resource` 源自 **JSR-250** 规范。在 JDK 6 到 JDK 10 中，`javax.annotation.Resource` 曾随 JDK 提供；从 JDK 11 开始需要单独引入 API 依赖。Spring 5/Java EE 8 项目通常使用 `javax.annotation-api`，Spring 6/Jakarta EE 9 及以上项目使用 `jakarta.annotation-api`。

Spring 对 `@Resource`（无参数情况）的处理逻辑如下：

1. **按名称（byName）匹配：** 默认取字段名（Field Name）作为 bean 的名称去容器中查找。如果找到了该名称的 Bean，则直接注入。
2. **回退到按类型（byType）匹配：** 如果**没有**找到同名的 Bean，Spring 会退而求其次，尝试根据字段的**类型**去查找。**按类型匹配的结果判定**
   - **找到 1 个 Bean**：注入成功。
   - **找到 0 个 Bean**：抛出异常 (`NoSuchBeanDefinitionException`)。
   - **找到 >1 个 Bean**：抛出异常 (`NoUniqueBeanDefinitionException`)。

`@Resource` 有两个比较重要且日常开发常用的属性：`name`（名称）、`type`（类型）。

```java
public @interface Resource {
    String name() default "";
    Class<?> type() default Object.class;
}
```

如果仅指定 `name` 属性则注入方式为`byName`，如果仅指定`type`属性则注入方式为`byType`，如果同时指定`name` 和`type`属性（不建议这么做）则注入方式为`byType`+`byName`。

```java
// 报错，byName 和 byType 都无法匹配到 bean
@Resource
private SmsService smsService;
// 正确注入 SmsServiceImpl1 对象对应的 bean
@Resource
private SmsService smsServiceImpl1;
// 正确注入 SmsServiceImpl1 对象对应的 bean（比较推荐这种方式）
@Resource(name = "smsServiceImpl1")
private SmsService smsService;
```

**简单总结一下**：

- `@Autowired` 是 Spring 提供的注解，`@Resource` 是 Jakarta Annotations/JSR-250 规范提供的注解。
- `Autowired` 默认的注入方式为`byType`（根据类型进行匹配），`@Resource`默认注入方式为 `byName`（根据名称进行匹配）。
- 当一个接口存在多个实现类的情况下，`@Autowired` 和`@Resource`都需要通过名称才能正确匹配到对应的 Bean。`Autowired` 可以通过 `@Qualifier` 注解来显式指定名称，`@Resource`可以通过 `name` 属性来显式指定名称。
- `@Autowired` 支持在构造函数、方法、字段和参数上使用。`@Resource` 主要用于字段和方法上的注入，不支持在构造函数或参数上使用。

考虑到 `@Resource` 的语义更清晰（名称优先），并且是 Java 标准，能减少对 Spring 框架的强耦合，我们通常**更推荐使用 `@Resource`**，尤其是在需要按名称注入的场景下。而 `@Autowired` 配合构造器注入，在实现依赖注入的不可变性和强制性方面有优势，也是一种非常好的实践。

### 注入 Bean 的方式有哪些？

依赖注入 (Dependency Injection, DI) 的常见方式：

1. 构造函数注入：通过类的构造函数来注入依赖项。
1. Setter 注入：通过类的 Setter 方法来注入依赖项。
1. Field（字段） 注入：直接在类的字段上使用注解（如 `@Autowired` 或 `@Resource`）来注入依赖项。

构造函数注入示例：

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Setter 注入示例：

```java
@Service
public class UserService {

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```

Field 注入示例：

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //...
}
```

### ⭐️构造函数注入还是 Setter 注入？

Spring 官方有对这个问题的回答：<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html#beans-setter-injection>。

我这里主要提取总结完善一下 Spring 官方的建议。

**Spring 官方推荐构造函数注入**，这种注入方式的优势如下：

1. 依赖完整性：确保所有必需依赖在对象创建时就被注入，避免了空指针异常的风险。
2. 不可变性：有助于创建不可变对象，提高了线程安全性。
3. 初始化保证：组件在使用前已完全初始化，减少了潜在的错误。
4. 测试便利性：在单元测试中，可以直接通过构造函数传入模拟的依赖项，而不必依赖 Spring 容器进行注入。

构造函数注入适合处理**必需的依赖项**，而 **Setter 注入** 则更适合**可选的依赖项**，这些依赖项可以有默认值或在对象生命周期中动态设置。虽然 `@Autowired` 可以用于 Setter 方法来处理必需的依赖项，但构造函数注入仍然是更好的选择。

在某些情况下（例如第三方类不提供 Setter 方法），构造函数注入可能是**唯一的选择**。

### ⭐️Bean 的作用域有哪些?

Spring 中 Bean 的作用域通常有下面几种：

- **singleton** : IoC 容器中只有唯一的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
- **prototype** : 每次获取都会创建一个新的 bean 实例。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
- **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
- **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
- **application/global-session** （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
- **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

**如何配置 bean 的作用域呢？**

xml 方式：

```xml
<bean id="..." class="..." scope="singleton"></bean>
```

注解方式：

```java
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```

### ⭐️Bean 是线程安全的吗？

Spring 框架中的 Bean 是否线程安全，取决于其作用域和状态。

我们这里以最常用的两种作用域 prototype 和 singleton 为例介绍。几乎所有场景的 Bean 作用域都是使用默认的 singleton ，重点关注 singleton 作用域即可。

prototype 作用域下，每次向容器获取都会创建一个新的 bean 实例，可以降低容器层面的共享概率，但作用域本身不提供线程安全保证：如果调用方把同一个 prototype 实例共享给多个线程，仍然可能发生资源竞争。singleton 作用域下，IoC 容器中只有唯一的 bean 实例，更容易出现共享状态竞争问题（取决于 Bean 是否有状态）。

有状态 Bean 示例：

```java
// 定义了一个购物车类，其中包含一个保存用户的购物车里商品的 List
@Component
public class ShoppingCart {
    private List<String> items = new ArrayList<>();

    public void addItem(String item) {
        items.add(item);
    }

    public List<String> getItems() {
        return items;
    }
}
```

不过，大部分 Bean 实际都是无状态（没有定义可变的成员变量）的（比如 Dao、Service），这种情况下， Bean 是线程安全的。

无状态 Bean 示例：

```java
// 定义了一个用户服务，它仅包含业务逻辑而不保存任何状态。
@Component
public class UserService {

    public User findUserById(Long id) {
        //...
    }
    //...
}
```

对于有状态单例 Bean 的线程安全问题，常见的三种解决办法是：

1. **避免可变成员变量**: 尽量设计 Bean 为无状态。
2. **使用`ThreadLocal`**: 将可变成员变量保存在 `ThreadLocal` 中，确保线程独立。
3. **使用同步机制**: 利用 `synchronized` 或 `ReentrantLock` 来进行同步控制，确保线程安全。

这里以 `ThreadLocal`为例，演示一下`ThreadLocal` 保存用户登录信息的场景：

```java
public class UserThreadLocal {

    private UserThreadLocal() {}

    private static final ThreadLocal<SysUser> LOCAL = ThreadLocal.withInitial(() -> null);

    public static void put(SysUser sysUser) {
        LOCAL.set(sysUser);
    }

    public static SysUser get() {
        return LOCAL.get();
    }

    public static void remove() {
        LOCAL.remove();
    }
}
```

### ⭐️Bean 的生命周期了解么?

1. **创建 Bean 的实例**：Bean 容器首先会找到配置文件中的 Bean 定义，然后选用适当的实例化策略（工厂方法、构造函数自动装配或者简单实例化）通过 Java 反射 API 来创建 Bean 的实例。
2. **Bean 属性赋值/填充**：为 Bean 设置相关属性和依赖，例如处理标记在字段或 Setter 方法上的 `@Autowired`、`@Value`、`@Resource` 等注解。
3. **Bean 初始化**：
   - 如果 Bean 实现了 `BeanNameAware` 接口，调用 `setBeanName()`方法，传入 Bean 的名字。
   - 如果 Bean 实现了 `BeanClassLoaderAware` 接口，调用 `setBeanClassLoader()`方法，传入 `ClassLoader`对象的实例。
   - 如果 Bean 实现了 `BeanFactoryAware` 接口，调用 `setBeanFactory()`方法，传入 `BeanFactory`对象的实例。
   - 与上面的类似，如果实现了其他 `*.Aware`接口，就调用相应的方法。
   - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessBeforeInitialization()` 方法
   - 如果 Bean 实现了`InitializingBean`接口，执行`afterPropertiesSet()`方法。
   - 如果 Bean 在配置文件中的定义包含 `init-method` 属性，执行指定的方法。
   - 如果有和加载这个 Bean 的 Spring 容器相关的 `BeanPostProcessor` 对象，执行`postProcessAfterInitialization()` 方法。
4. **销毁 Bean**：销毁并不是说要立马把 Bean 给销毁掉，而是把 Bean 的销毁方法先记录下来，将来需要销毁 Bean 或者销毁容器的时候，就调用这些方法去释放 Bean 所持有的资源。
   - 如果 Bean 实现了 `DisposableBean` 接口，执行 `destroy()` 方法。
   - 如果 Bean 在配置文件中的定义包含 `destroy-method` 属性，执行指定的 Bean 销毁方法。或者，也可以直接通过`@PreDestroy` 注解标记 Bean 销毁之前执行的方法。

`AbstractAutowireCapableBeanFactory` 的 `doCreateBean()` 方法中能看到依次执行了这 4 个阶段：

```java
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)
    throws BeanCreationException {

    // 1. 创建 Bean 的实例
    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }

    Object exposedObject = bean;
    try {
        // 2. Bean 属性赋值/填充
        populateBean(beanName, mbd, instanceWrapper);
        // 3. Bean 初始化
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // 4. 销毁 Bean-注册回调接口
    try {
        registerDisposableBeanIfNecessary(beanName, bean, mbd);
    }

    return exposedObject;
}
```

`Aware` 接口能让 Bean 能拿到 Spring 容器资源。

Spring 中提供的 `Aware` 接口主要有：

1. `BeanNameAware`：注入当前 bean 对应 beanName；
2. `BeanClassLoaderAware`：注入加载当前 bean 的 ClassLoader；
3. `BeanFactoryAware`：注入当前 `BeanFactory` 容器的引用。

`BeanPostProcessor` 接口是 Spring 为修改 Bean 提供的强大扩展点。

```java
public interface BeanPostProcessor {

	// 初始化前置处理
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	// 初始化后置处理
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

}
```

- `postProcessBeforeInitialization`：Bean 实例化、属性注入完成后，`InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之前执行；
- `postProcessAfterInitialization`：类似于上面，不过是在 `InitializingBean#afterPropertiesSet`方法以及自定义的 `init-method` 方法之后执行。

`InitializingBean` 和 `init-method` 是 Spring 为 Bean 初始化提供的扩展点。

```java
public interface InitializingBean {
 // 初始化逻辑
	void afterPropertiesSet() throws Exception;
}
```

指定 `init-method` 方法，指定初始化方法：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="demo" class="com.chaycao.Demo" init-method="init"/>

</beans>
```

**如何记忆呢？**

1. 整体上可以简单分为四步：实例化 —> 属性赋值 —> 初始化 —> 销毁。
2. 初始化这一步涉及到的步骤比较多，包含 `Aware` 接口的依赖注入、`BeanPostProcessor` 在初始化前后的处理以及 `InitializingBean` 和 `init-method` 的初始化操作。
3. 销毁这一步会注册相关销毁回调接口，最后通过`DisposableBean` 和 `destory-method` 进行销毁。

最后，再分享一张清晰的图解（图源：[如何记忆 Spring Bean 的生命周期](https://chaycao.github.io/2020/02/15/如何记忆Spring-Bean的生命周期.html)）。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/spring-bean-lifestyle.png)

## Spring AOP

### ⭐️谈谈自己对于 AOP 的了解

AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理，如下图所示：

![SpringAOPProcess](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/230ae587a322d6e4d09510161987d346.jpeg)

当然你也可以使用 **AspectJ** ！Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。

AOP 切面编程涉及到的一些专业术语：

| 术语              |                                 含义                                  |
| :---------------- | :-------------------------------------------------------------------: |
| 目标(Target)      |                             被通知的对象                              |
| 代理(Proxy)       |                 向目标对象应用通知之后创建的代理对象                  |
| 连接点(JoinPoint) |             目标对象的所属类中，定义的所有方法均为连接点              |
| 切入点(Pointcut)  | 被切面拦截 / 增强的连接点（切入点一定是连接点，连接点不一定是切入点） |
| 通知(Advice)      |      增强的逻辑 / 代码，也即拦截到目标对象的连接点之后要做的事情      |
| 切面(Aspect)      |                     切入点(Pointcut)+通知(Advice)                     |
| Weaving(织入)     |           将通知应用到目标对象，进而生成代理对象的过程动作            |

### ⭐️Spring AOP 和 AspectJ AOP 有什么区别？

| 特性           | Spring AOP                                               | AspectJ                                    |
| -------------- | -------------------------------------------------------- | ------------------------------------------ |
| **增强方式**   | 运行时增强（基于动态代理）                               | 编译时增强、类加载时增强（直接操作字节码） |
| **切入点支持** | 方法级（Spring Bean 范围内，不支持 final 和 staic 方法） | 方法级、字段、构造器、静态方法等           |
| **性能**       | 运行时依赖代理，有一定开销，切面多时性能较低             | 运行时无代理开销，性能更高                 |
| **复杂性**     | 简单，易用，适合大多数场景                               | 功能强大，但相对复杂                       |
| **使用场景**   | Spring 应用下比较简单的 AOP 需求                         | 高性能、高复杂度的 AOP 需求                |

**如何选择？**

- **功能考量**：AspectJ 支持更复杂的 AOP 场景，Spring AOP 更简单易用。如果你需要增强 `final` 方法、静态方法、字段访问、构造器调用等，或者需要在非 Spring 管理的对象上应用增强逻辑，AspectJ 是唯一的选择。
- **性能考量**：切面数量较少时两者性能差异不大，但切面较多时 AspectJ 性能更优。

**一句话总结**：简单场景优先使用 Spring AOP；复杂场景或高性能需求时，选择 AspectJ。

### ⭐️AOP 常见的通知类型有哪些？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/aspectj-advice-types.jpg)

- **Before**（前置通知）：目标对象的方法调用之前触发
- **After** （后置通知）：目标对象的方法调用之后触发
- **AfterReturning**（返回通知）：目标对象的方法调用完成，在返回结果值之后触发
- **AfterThrowing**（异常通知）：目标对象的方法运行中抛出 / 触发异常后触发。AfterReturning 和 AfterThrowing 两者互斥。如果方法调用成功无异常，则会有返回值；如果方法抛出了异常，则不会有返回值。
- **Around** （环绕通知）：编程式控制目标对象的方法调用。环绕通知是所有通知类型中可操作范围最大的一种，因为它可以直接拿到目标对象，以及要执行的方法，所以环绕通知可以任意的在目标对象的方法调用前后搞事，甚至不调用目标对象的方法

### 多个切面的执行顺序如何控制？

1、通常使用`@Order` 注解直接定义切面顺序

```java
// 值越小优先级越高
@Order(3)
@Component
@Aspect
public class LoggingAspect implements Ordered {
```

**2、实现`Ordered` 接口重写 `getOrder` 方法。**

```java
@Component
@Aspect
public class LoggingAspect implements Ordered {

    // ....

    @Override
    public int getOrder() {
        // 返回值越小优先级越高
        return 1;
    }
}
```

## Spring MVC

### 说说自己对于 Spring MVC 了解?

MVC 是模型(Model)、视图(View)、控制器(Controller)的简写，其核心思想是通过将业务逻辑、数据、显示分离来组织代码。

![](https://oss.javaguide.cn/java-guide-blog/image-20210809181452421.png)

网上有很多人说 MVC 不是设计模式，只是软件设计规范，我个人更倾向于 MVC 同样是众多设计模式中的一种。**[java-design-patterns](https://github.com/iluwatar/java-design-patterns)** 项目中就有关于 MVC 的相关介绍。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/159b3d3e70dd45e6afa81bf06d09264e.png)

想要真正理解 Spring MVC，我们先来看看 Model 1 和 Model 2 这两个没有 Spring MVC 的时代。

**Model 1 时代**

很多学 Java 后端比较晚的朋友可能并没有接触过 Model 1 时代下的 JavaWeb 应用开发。在 Model1 模式下，整个 Web 应用几乎全部用 JSP 页面组成，只用少量的 JavaBean 来处理数据库连接、访问等操作。

这个模式下 JSP 即是控制层（Controller）又是表现层（View）。显而易见，这种模式存在很多问题。比如控制逻辑和表现逻辑混杂在一起，导致代码重用率极低；再比如前端和后端相互依赖，难以进行测试维护并且开发效率极低。

![mvc-mode1](https://oss.javaguide.cn/java-guide-blog/mvc-mode1.png)

**Model 2 时代**

学过 Servlet 并做过相关 Demo 的朋友应该了解“Java Bean(Model)+ JSP（View）+Servlet（Controller） ”这种开发模式，这就是早期的 JavaWeb MVC 开发模式。

- Model:系统涉及的数据，也就是 dao 和 bean。
- View：展示模型中的数据，只是用来展示。
- Controller：接受用户请求，并将请求发送至 Model，最后返回数据给 JSP 并展示给用户

![](https://oss.javaguide.cn/java-guide-blog/mvc-model2.png)

Model2 模式下还存在很多问题，Model2 的抽象和封装程度还远远不够，使用 Model2 进行开发时不可避免地会重复造轮子，这就大大降低了程序的可维护性和复用性。

于是，很多 JavaWeb 开发相关的 MVC 框架应运而生比如 Struts2，但是 Struts2 比较笨重。

**Spring MVC 时代**

随着 Spring 轻量级开发框架的流行，Spring 生态圈出现了 Spring MVC 框架， Spring MVC 是当前最优秀的 MVC 框架。相比于 Struts2 ， Spring MVC 使用更加简单和方便，开发效率更高，并且 Spring MVC 运行速度更快。

MVC 是一种设计模式，Spring MVC 是一款很优秀的 MVC 框架。Spring MVC 可以帮助我们进行更简洁的 Web 层的开发，并且它天生与 Spring 框架集成。Spring MVC 下我们一般把后端项目分为 Service 层（处理业务）、Dao 层（数据库操作）、Entity 层（实体类）、Controller 层(控制层，返回数据给前台页面)。

### Spring MVC 的核心组件有哪些？

记住了下面这些组件，也就记住了 SpringMVC 的工作原理。

- **`DispatcherServlet`**：**核心的中央处理器**，负责接收请求、分发，并给予客户端响应。
- **`HandlerMapping`**：**处理器映射器**，根据 URL 去匹配查找能处理的 `Handler` ，并会将请求涉及到的拦截器和 `Handler` 一起封装。
- **`HandlerAdapter`**：**处理器适配器**，根据 `HandlerMapping` 找到的 `Handler` ，适配执行对应的 `Handler`；
- **`Handler`**：**请求处理器**，处理实际请求的处理器。
- **`ViewResolver`**：**视图解析器**，根据 `Handler` 返回的逻辑视图 / 视图，解析并渲染真正的视图，并传递给 `DispatcherServlet` 响应客户端

### ⭐️SpringMVC 工作原理了解吗?

**Spring MVC 原理如下图所示：**

> SpringMVC 工作原理的图解我没有自己画，直接图省事在网上找了一个非常清晰直观的，原出处不明。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/de6d2b213f112297298f3e223bf08f28.png)

**流程说明（重要）：**

1. 客户端（浏览器）发送请求， `DispatcherServlet`拦截请求。
2. `DispatcherServlet` 根据请求信息调用 `HandlerMapping` 。`HandlerMapping` 根据 URL 去匹配查找能处理的 `Handler`（也就是我们平常说的 `Controller` 控制器） ，并会将请求涉及到的拦截器和 `Handler` 一起封装。
3. `DispatcherServlet` 调用 `HandlerAdapter`适配器执行 `Handler` 。
4. `Handler` 完成对用户请求的处理后，会返回一个 `ModelAndView` 对象给`DispatcherServlet`，`ModelAndView` 顾名思义，包含了数据模型以及相应的视图的信息。`Model` 是返回的数据对象，`View` 是个逻辑上的 `View`。
5. `ViewResolver` 会根据逻辑 `View` 查找实际的 `View`。
6. `DispaterServlet` 把返回的 `Model` 传给 `View`（视图渲染）。
7. 把 `View` 返回给请求者（浏览器）

上述流程是传统开发模式（JSP，Thymeleaf 等）的工作原理。然而现在主流的开发方式是前后端分离，这种情况下 Spring MVC 的 `View` 概念发生了一些变化。由于 `View` 通常由前端框架（Vue, React 等）来处理，后端不再负责渲染页面，而是只负责提供数据，因此：

- 前后端分离时，后端通常不再返回具体的视图，而是返回**纯数据**（通常是 JSON 格式），由前端负责渲染和展示。
- `View` 的部分在前后端分离的场景下往往不需要设置，Spring MVC 的控制器方法只需要返回数据，不再返回 `ModelAndView`，而是直接返回数据，Spring 会自动将其转换为 JSON 格式。相应的，`ViewResolver` 也将不再被使用。

怎么做到呢？

- 使用 `@RestController` 注解代替传统的 `@Controller` 注解，这样所有方法默认会返回 JSON 格式的数据，而不是试图解析视图。
- 如果你使用的是 `@Controller`，可以结合 `@ResponseBody` 注解来返回 JSON。

### 统一异常处理怎么做？

推荐使用注解的方式统一异常处理，具体会使用到 `@ControllerAdvice` + `@ExceptionHandler` 这两个注解 。

```java
@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<?> handleAppException(BaseException ex, HttpServletRequest request) {
      //......
    }

    @ExceptionHandler(value = ResourceNotFoundException.class)
    public ResponseEntity<ErrorReponse> handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
      //......
    }
}
```

这种异常处理方式并不是给 `Controller` 创建 AOP 代理。`Controller` 方法抛出异常后，Spring MVC 会通过 `HandlerExceptionResolver` 处理链查找能够处理该异常的 `@ExceptionHandler` 方法。

`ExceptionHandlerMethodResolver` 中 `getMappedMethod` 方法决定了异常具体被哪个被 `@ExceptionHandler` 注解修饰的方法处理异常。

```java
@Nullable
  private Method getMappedMethod(Class<? extends Throwable> exceptionType) {
    List<Class<? extends Throwable>> matches = new ArrayList<>();
    //找到可以处理的所有异常信息。mappedMethods 中存放了异常和处理异常的方法的对应关系
    for (Class<? extends Throwable> mappedException : this.mappedMethods.keySet()) {
      if (mappedException.isAssignableFrom(exceptionType)) {
        matches.add(mappedException);
      }
    }
    // 不为空说明有方法处理异常
    if (!matches.isEmpty()) {
      // 按照匹配程度从小到大排序
      matches.sort(new ExceptionDepthComparator(exceptionType));
      // 返回处理异常的方法
      return this.mappedMethods.get(matches.get(0));
    }
    else {
      return null;
    }
  }
```

从源代码看出：**`getMappedMethod()`会首先找到可以匹配处理异常的所有方法信息，然后对其进行从小到大的排序，最后取最小的那一个匹配的方法(即匹配度最高的那个)。**

## Spring 框架中用到了哪些设计模式？

> 关于下面这些设计模式的详细介绍，可以看我写的 [Spring 中的设计模式详解](https://javaguide.cn/系统设计/框架/spring/spring-design-patterns-summary.html) 这篇文章。

- **工厂设计模式** : Spring 使用工厂模式通过 `BeanFactory`、`ApplicationContext` 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **模板方法模式** : Spring 中 `jdbcTemplate`、`hibernateTemplate` 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** : Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配`Controller`。
- ……

## ⭐️Spring 的循环依赖

### Spring 循环依赖了解吗，怎么解决？

循环依赖是指 Bean 对象循环引用，是两个或多个 Bean 之间相互持有对方的引用，例如 CircularDependencyA → CircularDependencyB → CircularDependencyA。

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyB circB;
}

@Component
public class CircularDependencyB {
    @Autowired
    private CircularDependencyA circA;
}
```

单个对象的自我依赖也会出现循环依赖，但这种概率极低，属于是代码编写错误。

```java
@Component
public class CircularDependencyA {
    @Autowired
    private CircularDependencyA circA;
}
```

Spring 框架可以通过三级缓存解决部分单例 Bean 的 Setter/字段注入循环依赖。构造器循环依赖、原型 Bean 循环依赖等场景不能依靠该机制解决。

Spring 中的三级缓存其实就是三个 Map，如下：

```java
// 一级缓存
/** Cache of singleton objects: bean name to bean instance. */
private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

// 二级缓存
/** Cache of early singleton objects: bean name to bean instance. */
private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);

// 三级缓存
/** Cache of singleton factories: bean name to ObjectFactory. */
private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
```

简单来说，Spring 的三级缓存包括：

1. **一级缓存（singletonObjects）**：存放最终形态的 Bean（已经实例化、属性填充、初始化），单例池，为“Spring 的单例属性”⽽⽣。一般情况我们获取 Bean 都是从这里获取的，但是并不是所有的 Bean 都在单例池里面，例如原型 Bean 就不在里面。
2. **二级缓存（earlySingletonObjects）**：存放过渡 Bean（半成品，尚未属性填充），也就是三级缓存中`ObjectFactory`产生的对象，与三级缓存配合使用的，可以防止 AOP 的情况下，每次调用`ObjectFactory#getObject()`都是会产生新的代理对象的。
3. **三级缓存（singletonFactories）**：存放`ObjectFactory`，`ObjectFactory`的`getObject()`方法（最终调用的是`getEarlyBeanReference()`方法）可以生成原始 Bean 对象或者代理对象（如果 Bean 被 AOP 切面代理）。三级缓存只会对单例 Bean 生效。

接下来说一下 Spring 创建 Bean 的流程：

1. 先去 **一级缓存 `singletonObjects`** 中获取，存在就返回；
2. 如果不存在或者对象正在创建中，于是去 **二级缓存 `earlySingletonObjects`** 中获取；
3. 如果还没有获取到，就去 **三级缓存 `singletonFactories`** 中获取，通过执行 `ObjectFacotry` 的 `getObject()` 就可以获取该对象，获取成功之后，从三级缓存移除，并将该对象加入到二级缓存中。

在三级缓存中存储的是 `ObjectFacoty` ：

```java
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}
```

Spring 在创建 Bean 的时候，如果允许循环依赖的话，Spring 就会将刚刚实例化完成，但是属性还没有初始化完的 Bean 对象给提前暴露出去，这里通过 `addSingletonFactory` 方法，向三级缓存中添加一个 `ObjectFactory` 对象：

```java
// AbstractAutowireCapableBeanFactory # doCreateBean #
public abstract class AbstractAutowireCapableBeanFactory ... {
	protected Object doCreateBean(...) {
        //...

        // 支撑循环依赖：将 ()->getEarlyBeanReference 作为一个 ObjectFactory 对象的 getObject() 方法加入到三级缓存中
		addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }
}
```

那么上边在说 Spring 创建 Bean 的流程时说了，如果一级缓存、二级缓存都取不到对象时，会去三级缓存中通过 `ObjectFactory` 的 `getObject` 方法获取对象。

```java
class A {
    // 使用了 B
    private B b;
}
class B {
    // 使用了 A
    private A a;
}
```

以上面的循环依赖代码为例，整个解决循环依赖的流程如下：

- 当 Spring 创建 A 之后，发现 A 依赖了 B ，又去创建 B，B 依赖了 A ，又去创建 A；
- 在 B 创建 A 的时候，那么此时 A 就发生了循环依赖，由于 A 此时还没有初始化完成，因此在 **一二级缓存** 中肯定没有 A；
- 那么此时就去三级缓存中调用 `getObject()` 方法去获取 A 的 **前期暴露的对象** ，也就是调用上边加入的 `getEarlyBeanReference()` 方法，生成一个 A 的 **前期暴露对象**；
- 然后就将这个 `ObjectFactory` 从三级缓存中移除，并且将前期暴露对象放入到二级缓存中，那么 B 就将这个前期暴露对象注入到依赖，来支持循环依赖。

**只用两级缓存够吗？** 在没有 AOP 的情况下，确实可以只使用一级和二级缓存来解决循环依赖问题。但是，当涉及到 AOP 时，三级缓存就显得非常重要了，因为它确保了即使在 Bean 的创建过程中有多次对早期引用的请求，也始终只返回同一个代理对象，从而避免了同一个 Bean 有多个代理对象的问题。

**最后总结一下 Spring 如何解决三级缓存**：

在三级缓存这一块，主要记一下 Spring 是如何支持循环依赖的即可，也就是如果发生循环依赖的话，就去 **三级缓存 `singletonFactories`** 中拿到三级缓存中存储的 `ObjectFactory` 并调用它的 `getObject()` 方法来获取这个循环依赖对象的前期暴露对象（虽然还没初始化完成，但是可以拿到该对象在堆中的存储地址了），并且将这个前期暴露对象放到二级缓存中，这样在循环依赖时，就不会重复初始化了！

不过，这种机制也有一些缺点，比如增加了内存开销（需要维护三级缓存，也就是三个 Map），降低了性能（需要进行多次检查和转换）。它只适用于部分单例 Bean 的 Setter/字段注入循环依赖，非单例 Bean、构造器循环依赖等场景仍然无法通过三级缓存解决。

### @Lazy 能解决循环依赖吗？

`@Lazy` 用来标识类是否需要懒加载/延迟加载，可以作用在类上、方法上、构造器上、方法参数上、成员变量中。

Spring Boot 2.2 新增了**全局懒加载属性**，开启后全局 bean 被设置为懒加载，需要时再去创建。

配置文件配置全局懒加载：

```properties
#默认false
spring.main.lazy-initialization=true
```

编码的方式设置全局懒加载：

```java
SpringApplication springApplication=new SpringApplication(Start.class);
springApplication.setLazyInitialization(true);
springApplication.run(args);
```

如非必要，尽量不要用全局懒加载。全局懒加载会让 Bean 第一次使用的时候加载会变慢，并且它会延迟应用程序问题的发现（当 Bean 被初始化时，问题才会出现）。

如果一个 Bean 没有被标记为懒加载，那么它会在 Spring IoC 容器启动的过程中被创建和初始化。如果一个 Bean 被标记为懒加载，那么它不会在 Spring IoC 容器启动时立即实例化，而是在第一次被请求时才创建。这可以帮助减少应用启动时的初始化时间，也可以用来解决循环依赖问题。

循环依赖问题是如何通过`@Lazy` 解决的呢？这里举一个例子，比如说有两个 Bean，A 和 B，他们之间发生了循环依赖，可以在 A 对 B 的注入点上添加 `@Lazy`，例如构造参数 `A(@Lazy B b)`。此时延迟解析的是依赖 B，而不是简单地把 `@Lazy` 标在 A 的构造器或类型上。

- 首先 Spring 会去创建 A 的 Bean，创建时需要注入 B 的属性；
- 由于在 A 对 B 的注入点上标注了 `@Lazy`，因此 Spring 会创建一个 B 的延迟解析代理对象，并将代理对象注入 A；
- 之后开始执行 B 的实例化、初始化，在注入 B 中的 A 属性时，此时 A 已经创建完毕了，就可以将 A 给注入进去。

从上面的加载流程可以看出： `@Lazy` 解决循环依赖的关键点在于代理对象的使用。

- **没有 `@Lazy` 的情况下**：在 Spring 容器初始化 `A` 时会立即尝试创建 `B`，而在创建 `B` 的过程中又会尝试创建 `A`，最终导致循环依赖（即无限递归，最终抛出异常）。
- **使用 `@Lazy` 的情况下**：Spring 不会立即创建 `B`，而是会注入一个 `B` 的代理对象。由于此时 `B` 仍未被真正初始化，`A` 的初始化可以顺利完成。等到 `A` 实例实际调用 `B` 的方法时，代理对象才会触发 `B` 的真正初始化。

`@Lazy` 注入点代理能够在一定程度上打破循环依赖链，包括某些构造器注入场景。但这并不是从设计上消除循环依赖，复杂依赖关系下也可能产生更隐蔽的初始化问题，因此最佳实践仍然是尽量避免设计上的循环依赖。

### SpringBoot 允许循环依赖发生么？

SpringBoot 2.6.x 以前是默认允许循环依赖的，也就是说你的代码出现了循环依赖问题，一般情况下也不会报错。SpringBoot 2.6.x 以后官方不再推荐编写存在循环依赖的代码，建议开发者自己写代码的时候去减少不必要的互相依赖。这其实也是我们最应该去做的，循环依赖本身就是一种设计缺陷，我们不应该过度依赖 Spring 而忽视了编码的规范和质量，说不定未来某个 SpringBoot 版本就彻底禁止循环依赖的代码了。

SpringBoot 2.6.x 以后，如果你不想重构循环依赖的代码的话，也可以采用下面这些方法：

- 在全局配置文件中设置允许循环依赖存在：`spring.main.allow-circular-references=true`。最简单粗暴的方式，不太推荐。
- 在导致循环依赖的 Bean 上添加 `@Lazy` 注解，这是一种比较推荐的方式。`@Lazy` 用来标识类是否需要懒加载/延迟加载，可以作用在类上、方法上、构造器上、方法参数上、成员变量中。
- ……

## ⭐️Spring 事务

关于 Spring 事务的详细介绍，可以看我写的 [Spring 事务详解](https://javaguide.cn/系统设计/框架/spring/spring-transaction.html) 这篇文章。

### Spring 管理事务的方式有几种？

- **编程式事务**：在代码中硬编码(在分布式系统中推荐使用) : 通过 `TransactionTemplate`或者 `TransactionManager` 手动管理事务，事务范围过大会出现事务未提交导致超时，因此事务要比锁的粒度更小。
- **声明式事务**：在 XML 配置文件中配置或者直接基于注解（单体应用或者简单业务系统推荐使用） : 实际是通过 AOP 实现（基于`@Transactional` 的全注解方式使用最多）

### Spring 事务中哪几种事务传播行为?

**事务传播行为是为了解决业务层方法之间互相调用的事务问题**。

当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。

正确的事务传播行为可能的值如下:

**1.`TransactionDefinition.PROPAGATION_REQUIRED`**

使用的最多的一个事务传播行为，我们平时经常使用的`@Transactional`注解默认使用就是这个事务传播行为。如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务。

**`2.TransactionDefinition.PROPAGATION_REQUIRES_NEW`**

创建一个新的事务，如果当前存在事务，则把当前事务挂起。也就是说不管外部方法是否开启事务，`Propagation.REQUIRES_NEW`修饰的内部方法会新开启自己的事务，且开启的事务相互独立，互不干扰。

**3.`TransactionDefinition.PROPAGATION_NESTED`**

如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于`TransactionDefinition.PROPAGATION_REQUIRED`。

**4.`TransactionDefinition.PROPAGATION_MANDATORY`**

如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。（mandatory：强制性）

这个使用的很少。

另外 3 种事务传播行为也是合法配置，需要根据是否存在外部事务来理解：

- **`TransactionDefinition.PROPAGATION_SUPPORTS`**: 如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
- **`TransactionDefinition.PROPAGATION_NOT_SUPPORTED`**: 以非事务方式运行，如果当前存在事务，则把当前事务挂起。
- **`TransactionDefinition.PROPAGATION_NEVER`**: 以非事务方式运行，如果当前存在事务，则抛出异常。

### Spring 事务中的隔离级别有哪几种?

和事务传播行为这块一样，为了方便使用，Spring 也相应地定义了一个枚举类：`Isolation`

```java
public enum Isolation {

    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

    private final int value;

    Isolation(int value) {
        this.value = value;
    }

    public int value() {
        return this.value;
    }

}
```

下面我依次对每一种事务隔离级别进行介绍：

- **`TransactionDefinition.ISOLATION_DEFAULT`** :使用后端数据库默认的隔离级别，MySQL 默认采用的 `REPEATABLE_READ` 隔离级别 Oracle 默认采用的 `READ_COMMITTED` 隔离级别.
- **`TransactionDefinition.ISOLATION_READ_UNCOMMITTED`** :最低的隔离级别，使用这个隔离级别很少，因为它允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**
- **`TransactionDefinition.ISOLATION_READ_COMMITTED`** : 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**
- **`TransactionDefinition.ISOLATION_REPEATABLE_READ`** : 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生。**
- **`TransactionDefinition.ISOLATION_SERIALIZABLE`** : 最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。但是这将严重影响程序的性能。通常情况下也不会用到该级别。

### @Transactional(rollbackFor = Exception.class)注解了解吗？

`Exception` 分为运行时异常 `RuntimeException` 和非运行时异常。事务管理对于企业应用来说是至关重要的，即使出现异常情况，它也可以保证数据的一致性。

当 `@Transactional` 注解作用于类上时，该类的所有 public 方法将都具有该类型的事务属性，同时，我们也可以在方法级别使用该标注来覆盖类级别的定义。

`@Transactional` 注解默认回滚策略是只有在遇到`RuntimeException`(运行时异常) 或者 `Error` 时才会回滚事务，而不会回滚 `Checked Exception`（受检查异常）。这是因为 Spring 认为`RuntimeException`和 Error 是不可预期的错误，而受检异常是可预期的错误，可以通过业务逻辑来处理。

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/spring-transactional-rollbackfor.png)

如果想要修改默认的回滚策略，可以使用 `@Transactional` 注解的 `rollbackFor` 和 `noRollbackFor` 属性来指定哪些异常需要回滚，哪些异常不需要回滚。例如，如果想要让所有的异常都回滚事务，可以使用如下的注解：

```java
@Transactional(rollbackFor = Exception.class)
public void someMethod() {
// some business logic
}
```

如果想要让某些特定的异常不回滚事务，可以使用如下的注解：

```java
@Transactional(noRollbackFor = CustomException.class)
public void someMethod() {
// some business logic
}
```

## Spring Data JPA

JPA 重要的是实战，这里仅对小部分知识点进行总结。

### 如何使用 JPA 在数据库中非持久化一个字段？

假如我们有下面一个类：

```java
@Entity(name="USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Column(name="USER_NAME")
    private String userName;

    @Column(name="PASSWORD")
    private String password;

    private String secrect;

}
```

如果我们想让`secrect` 这个字段不被持久化，也就是不被数据库存储怎么办？我们可以采用下面几种方法：

```java
static String transient1; // not persistent because of static
final String transient2 = "Satish"; // not persistent because of final
transient String transient3; // not persistent because of transient
@Transient
String transient4; // not persistent because of @Transient
```

一般使用后面两种方式比较多，我个人使用注解的方式比较多。

### JPA 的审计功能是做什么的？有什么用？

审计功能主要是帮助我们记录数据库操作的具体行为比如某条记录是谁创建的、什么时间创建的、最后修改人是谁、最后修改时间是什么时候。

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
@EntityListeners(value = AuditingEntityListener.class)
public abstract class AbstractAuditBase {

    @CreatedDate
    @Column(updatable = false)
    @JsonIgnore
    private Instant createdAt;

    @LastModifiedDate
    @JsonIgnore
    private Instant updatedAt;

    @CreatedBy
    @Column(updatable = false)
    @JsonIgnore
    private String createdBy;

    @LastModifiedBy
    @JsonIgnore
    private String updatedBy;
}
```

- `@CreatedDate`: 表示该字段为创建时间字段，在这个实体被 insert 的时候，会设置值

- `@CreatedBy` :表示该字段为创建人，在这个实体被 insert 的时候，会设置值

  `@LastModifiedDate`、`@LastModifiedBy`同理。

### 实体之间的关联关系注解有哪些？

- `@OneToOne` : 一对一。
- `@ManyToMany`：多对多。
- `@OneToMany` : 一对多。
- `@ManyToOne`：多对一。

利用 `@ManyToOne` 和 `@OneToMany` 也可以表达多对多的关联关系。

## Spring Security

Spring Security 重要的是实战，这里仅对小部分知识点进行总结。

### 有哪些控制请求访问权限的方法？

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/image-20220728201854641.png)

- `permitAll()`：无条件允许任何形式访问，不管你登录还是没有登录。
- `anonymous()`：允许匿名访问，也就是没有登录才可以访问。
- `denyAll()`：无条件决绝任何形式的访问。
- `authenticated()`：只允许已认证的用户访问。
- `fullyAuthenticated()`：只允许完整认证的用户访问，不接受匿名认证或 remember-me 认证。
- `hasRole(String)` : 只允许指定的角色访问。
- `hasAnyRole(String)` : 指定一个或者多个角色，满足其一的用户即可访问。
- `hasAuthority(String)`：只允许具有指定权限的用户访问
- `hasAnyAuthority(String)`：指定一个或者多个权限，满足其一的用户即可访问。
- `hasIpAddress(String)` : 只允许指定 ip 的用户访问。

### hasRole 和 hasAuthority 有区别吗？

可以看看松哥的这篇文章：[Spring Security 中的 hasRole 和 hasAuthority 有区别吗？](https://mp.weixin.qq.com/s/GTNOa2k9_n_H0w24upClRw)，介绍的比较详细。

### ⭐️如何对密码进行加密？

如果我们需要保存密码这类敏感数据到数据库，需要先通过自适应单向哈希函数编码再保存，而不是使用可逆加密。

Spring Security 提供了多种密码编码算法的实现，开箱即用。这些实现类的接口是 `PasswordEncoder`；如果需要自定义密码编码方案，也需要实现 `PasswordEncoder` 接口。

`PasswordEncoder` 接口有 `encode()` 和 `matches()` 两个必须实现的抽象方法，以及一个可以按需覆盖的默认方法 `upgradeEncoding()`。

```java
public interface PasswordEncoder {
    // 对原始密码进行单向编码
    String encode(CharSequence var1);
    // 比对原始密码和数据库中保存的密码
    boolean matches(CharSequence var1, String var2);
    // 判断已编码密码是否需要升级编码，默认返回 false
    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

![](https://oss.javaguide.cn/github/javaguide/系统设计/框架/spring/image-20220728183540954.png)

官方推荐使用可调节工作因子的自适应单向函数，并根据系统性能调优验证耗时，例如 bcrypt、PBKDF2、scrypt 或 Argon2。

### 如何优雅更换系统使用的加密算法？

如果我们在开发过程中，突然发现现有的加密算法无法满足我们的需求，需要更换成另外一个加密算法，这个时候应该怎么办呢？

推荐的做法是通过 `DelegatingPasswordEncoder` 兼容多种不同的密码加密方案，以适应不同的业务需求。

从名字也能看出来，`DelegatingPasswordEncoder` 其实就是一个代理类，并非是一种全新的加密算法，它做的事情就是代理上面提到的加密算法实现类。在 Spring Security 5.0 之后，默认就是基于 `DelegatingPasswordEncoder` 进行密码加密的。

## 参考

- 《Spring 技术内幕》
- 《从零开始深入学习 Spring》：<https://juejin.cn/book/6857911863016390663>
- <http://www.cnblogs.com/wmyskxz/p/8820371.html>
- <https://www.journaldev.com/2696/spring-interview-questions-and-answers>
- <https://www.edureka.co/blog/面试题/spring-interview-questions/>
- <https://www.cnblogs.com/clwydjgs/p/9317849.html>
- <https://howtodoinjava.com/面试题/top-spring-interview-questions-with-answers/>
- <http://www.tomaszezula.com/2014/02/09/spring-series-part-5-component-vs-bean/>
- <https://stackoverflow.com/questions/34172888/difference-between-bean-and-autowired>

<!-- @include: @article-footer.snippet.md -->


---

---

<!-- source: 设计模式常见面试题总结.md -->

## [27] 设计模式常见面试题总结

---
title: 设计模式常见面试题总结
description: 设计模式(Design pattern)代表了最佳的实践，通常被有经验的面向对象 的软件开发人员所采用。设计模式是软件开发人员在软件开发过程中面临 的一般问题的解决方案。这些解决方案是众多软件开发人员经过相当⻓的 一段时间的试验和错误总结出来的。
category: 系统设计
icon: "mdi:tools"
head:
  - - meta
    - name: keywords
      content: 设计模式,单例模式,工厂模式,代理模式,责任链模式,策略模式,观察者模式,面试题
---

**设计模式** 相关的面试题已经整理到了 PDF 手册中，你可以在我的公众号“**JavaGuide**”后台回复“**PDF**” 获取。

![JavaGuide 官方公众号](https://oss.javaguide.cn/github/javaguide/gongzhonghaoxuanchuan.png)

**《设计模式》PDF 电子书内容概览**：

![《设计模式》PDF文档概览](https://oss.javaguide.cn/github/javaguide/系统设计/design-pattern-pdf.png)

<!-- @include: @article-footer.snippet.md -->


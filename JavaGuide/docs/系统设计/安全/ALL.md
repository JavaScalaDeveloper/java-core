---
title: 安全 ALL
---

# 安全

> Aggregate of markdown under this directory (excludes README.md, TODO.md).


---

<!-- source: JWT 基础概念详解.md -->

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

<!-- source: JWT 身份认证优缺点分析.md -->

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

<!-- source: SSO 单点登录详解.md -->

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

<!-- source: 常见加密算法总结.md -->

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

<!-- source: 敏感词过滤方案总结.md -->

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

<!-- source: 权限系统设计详解.md -->

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

<!-- source: 认证授权基础概念详解.md -->

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

<!-- source: 数据脱敏方案总结.md -->

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

<!-- source: 为什么前后端都要做数据校验？.md -->

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

<!-- source: 为什么忘记密码时只能重置，不能告诉你原密码？.md -->

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


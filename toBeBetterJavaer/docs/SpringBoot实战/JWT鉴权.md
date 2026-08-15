## 干掉Session？这个跨域认证解决方案真的优雅！

用户登录认证是 Web 应用中非常常见的一个业务，一般的流程是这样的：

- 客户端向服务器端发送用户名和密码
- 服务器端验证通过后，在当前会话（session）中保存相关数据，比如说登录时间、登录 IP 等。
- 服务器端向客户端返回一个 session_id，客户端将其保存在 Cookie 中。
- 客户端再向服务器端发起请求时，将 session_id 传回给服务器端。
- 服务器端拿到 session_id 后，对用户的身份进行鉴定。

单机情况下，这种模式是没有任何问题的，但对于前后端分离的 Web 应用来说，就非常痛苦了。于是就有了另外一种解决方案，服务器端不再保存 session 数据，而是将其保存在客户端，客户端每次发起请求时再把这个数据发送给服务器端进行验证。**JWT**（JSON Web Token）就是这种方案的典型代表。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-1.png)


### 一、关于 JWT 

JWT，是目前最流行的一个[跨域](https://mp.weixin.qq.com/s/HTMDZaukCb7pyfHefVcfyg)认证解决方案：客户端发起用户登录请求，服务器端接收并认证成功后，生成一个 JSON 对象（如下所示），然后将其返回给客户端。

```
{
  "sub": "wanger",
  "created": 1645700436900,
  "exp": 1646305236
}
```

客户端再次与服务器端通信的时候，把这个 JSON 对象捎带上，作为前后端互相信任的一个凭证。服务器端接收到请求后，通过 JSON 对象对用户身份进行鉴定，这样就不再需要保存任何 session 数据了。

假如我现在使用用户名 wanger 和密码 123456 进行访问编程喵（Codingmore）的 login 接口，那么实际的 JWT 是一串看起来像是加过密的字符串。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-2.png)

为了让大家看的更清楚一点，我将其复制到了 [jwt 的官网](https://jwt.io/)。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-3.png)



左侧 Encoded 部分就是 JWT 密文，中间用「`.`」分割成了三部分（右侧 Decoded 部分）：

- Header（头部），描述 JWT 的元数据，其中 `alg` 属性表示签名的算法（当前为 HS512）；
- Payload（负载），用来存放实际需要传递的数据，其中 `sub` 属性表示主题（实际值为用户名），`created` 属性表示 JWT 产生的时间，`exp` 属性表示过期时间
- Signature（签名），对前两部分的签名，防止数据篡改；这里需要服务器端指定一个密钥（只有服务器端才知道），不能泄露给客户端，然后使用 Header 中指定的签名算法，按照下面的公式产生签名：

```
HMACSHA512(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)
```

算出签名后，再把 Header、Payload、Signature 拼接成一个字符串，中间用「`.`」分割，就可以返回给客户端了。

客户端拿到 JWT 后，可以放在 localStorage，也可以放在 Cookie 里面。

```
const TokenKey = '1D596CD8-8A20-4CEC-98DD-CDC12282D65C' // createUuid()

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}
```

以后客户端再与服务器端通信的时候，就带上这个 JWT，一般放在 HTTP 的请求的头信息 Authorization 字段里。

```
Authorization: Bearer <token>
```


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-4.png)

服务器端接收到请求后，再对 JWT 进行验证，如果验证通过就返回相应的资源。

### 二、实战 JWT

第一步，在 pom.xml 文件中添加 JWT 的依赖。

```
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.0</version>
</dependency>
```

第二步，在 application.yml 中添加 JWT 的配置项。

```
jwt:
  tokenHeader: Authorization #JWT存储的请求头
  secret: codingmore-admin-secret #JWT加解密使用的密钥
  expiration: 604800 #JWT的超期限时间(60*60*24*7)
  tokenHead: 'Bearer '  #JWT负载中拿到开头
```

第三步，新建 JwtTokenUtil.java 工具类，主要有三个方法：

- `generateToken(UserDetails userDetails)`：根据登录用户生成 token
- `getUserNameFromToken(String token)`：从 token 中获取登录用户
- `validateToken(String token, UserDetails userDetails)`：判断 token 是否仍然有效

```java
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.expiration}")
    private Long expiration;
    @Value("${jwt.tokenHead}")
    private String tokenHead;

    /**
     * 根据用户信息生成token
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_KEY_USERNAME, userDetails.getUsername());
        claims.put(CLAIM_KEY_CREATED, new Date());
        return generateToken(claims);
    }

    /**
     * 根据用户名、创建时间生成JWT的token
     */
    private String generateToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(generateExpirationDate())
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    /**
     * 从token中获取登录用户名
     */
    public String getUserNameFromToken(String token) {
        String username = null;
        Claims claims = getClaimsFromToken(token);
        if (claims != null) {
            username = claims.getSubject();
        }

        return username;
    }

    /**
     * 从token中获取JWT中的负载
     */
    private Claims getClaimsFromToken(String token) {
        Claims claims = null;
        try {
            claims = Jwts.parser()
                    .setSigningKey(secret)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            LOGGER.info("JWT格式验证失败:{}", token);
        }
        return claims;
    }

    /**
     * 验证token是否还有效
     *
     * @param token       客户端传入的token
     * @param userDetails 从数据库中查询出来的用户信息
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUserNameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    /**
     * 判断token是否已经失效
     */
    private boolean isTokenExpired(String token) {
        Date expiredDate = getExpiredDateFromToken(token);
        return expiredDate.before(new Date());
    }

    /**
     * 从token中获取过期时间
     */
    private Date getExpiredDateFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getExpiration();
    }
}
```

第四步， 在 UsersController.java 中新增 login 登录接口，接收用户名和密码，并将 JWT 返回给客户端。

```java
@Controller
@Api(tags="用户")
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private IUsersService usersService;
    @Value("${jwt.tokenHeader}")
    private String tokenHeader;
    @Value("${jwt.tokenHead}")
    private String tokenHead;

    @ApiOperation(value = "登录以后返回token")
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject login(@Validated UsersLoginParam users, BindingResult result) {
        String token = usersService.login(users.getUserLogin(), users.getUserPass());

        if (token == null) {
            return ResultObject.validateFailed("用户名或密码错误");
        }

        // 将 JWT 传递回客户端
        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("token", token);
        tokenMap.put("tokenHead", tokenHead);
        return ResultObject.success(tokenMap);
    }

}
```

第五步，在 UsersServiceImpl.java 中新增 login 方法，根据用户名从数据库中查询用户，密码验证通过后生成 JWT。

```java
@Service
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements IUsersService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public String login(String username, String password) {
        String token = null;
        //密码需要客户端加密后传递
        try {
            // 查询用户+用户资源
            UserDetails userDetails = loadUserByUsername(username);

            // 验证密码
            if (!passwordEncoder.matches(password, userDetails.getPassword())) {
                Asserts.fail("密码不正确");
            }

            // 返回 JWT
            token = jwtTokenUtil.generateToken(userDetails);
        } catch (AuthenticationException e) {
            LOGGER.warn("登录异常:{}", e.getMessage());
        }
        return token;
    }
}
```

第六步，新增 JwtAuthenticationTokenFilter.java，每次客户端发起请求时对 JWT 进行验证。

```java
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationTokenFilter.class);
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Value("${jwt.tokenHeader}")
    private String tokenHeader;
    @Value("${jwt.tokenHead}")
    private String tokenHead;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        // 从客户端请求中获取 JWT
        String authHeader = request.getHeader(this.tokenHeader);
        // 该 JWT 是我们规定的格式，以 tokenHead 开头
        if (authHeader != null && authHeader.startsWith(this.tokenHead)) {
            // The part after "Bearer "
            String authToken = authHeader.substring(this.tokenHead.length());
            // 从 JWT 中获取用户名
            String username = jwtTokenUtil.getUserNameFromToken(authToken);
            LOGGER.info("checking username:{}", username);

            // SecurityContextHolder 是 SpringSecurity 的一个工具类
            // 保存应用程序中当前使用人的安全上下文
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 根据用户名获取登录用户信息
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                // 验证 token 是否过期
                if (jwtTokenUtil.validateToken(authToken, userDetails)) {
                    // 将登录用户保存到安全上下文中
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    LOGGER.info("authenticated user:{}", username);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
```

JwtAuthenticationTokenFilter  继承了 OncePerRequestFilter，该过滤器能确保一次请求只通过一次 filter，而不需要重复执行。也就是说，客户端每发起一次请求，该过滤器就会执行一次。

这个过滤器非常关键啊，基本上每行代码我都添加了注释，当然了，为了确保大家都能搞清楚这个类到底做了什么，我再来画一幅流程图，这样就一清二楚了。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-5.png)

SpringSecurity 是一个安全管理框架，可以和 Spring Boot 应用无缝衔接，SecurityContextHolder 是其中非常关键的一个工具类，持有安全上下文信息，里面保存有当前操作的用户是谁，用户是否已经被认证，用户拥有的权限等关键信息。

SecurityContextHolder 默认使用了 ThreadLocal 策略来存储认证信息，ThreadLocal 的特点是存在它里边的数据，哪个线程存的，哪个线程才能访问到。这就意味着不同的请求进入到服务器端后，会由不同的 Thread 去处理，例如线程 A 将请求 1 的用户信息存入了 ThreadLocal，线程 B 在处理请求 2 的时候是无法获取到用户信息的。

所以说 JwtAuthenticationTokenFilter 过滤器会在每次请求过来的时候进行一遍 JWT 的验证，确保客户端过来的请求是安全的。然后 SpringSecurity 才会对接下来的请求接口放行。这也是 JWT 和 Session 的根本区别：

- JWT 需要每次请求的时候验证一次，并且只要 JWT 没有过期，哪怕服务器端重启了，认证仍然有效。
- Session 在没有过期的情况下是不需要重新对用户信息进行验证的，当服务器端重启后，用户需要重新登录获取新的 Session。

也就是说，**在 JWT 的方案下，服务器端保存的密钥（secret）一定不能泄露，否则客户端就可以根据签名算法伪造用户的认证信息了**。

### 三、Swagger 中添加 JWT 验证

对于后端开发人员来说，如何在 [Swagger（整合了 Knife4j 进行美化）](https://mp.weixin.qq.com/s/gWPCg6TP3G_-I-eqA6EJmA) 中添加 JWT 验证呢？

第一步，访问 login 接口，输入用户名和密码进行登录，获取服务器端返回的 JWT。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-6.png)


第二步，收集服务器端返回的 tokenHead 和 token，将其填入 Authorize（注意 tokenHead 和 token 之间有一个空格）完成登录认证。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-7.png)

第三步，再次请求其他接口时，Swagger 会自动将 Authorization 作为请求头信息发送到服务器端。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-8.png)

第四步，服务器端接收到该请求后，会通过 JwtAuthenticationTokenFilter 过滤器对 JWT 进行校验。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-9.png)

到此为止，整个流程全部打通了，完美！

### 四、总结

综上来看，用 JWT 来解决前后端分离项目中的跨域认证还是非常丝滑的，这主要得益于 JSON 的通用性，可以跨语言，JavaScript 和 Java 都支持；另外，JWT 的组成非常简单，非常便于传输；还有 JWT 不需要在服务器端保存会话信息（Session），非常易于扩展。

当然了，为了保证 JWT 的安全性，不要在 JWT 中保存敏感信息，因为一旦私钥泄露，JWT 是很容易在客户端被解密的；如果可以，请使用 HTTPS 协议。

参考链接：

>阮一峰：https://www.ruanyifeng.com/博客/2018/07/json_web_token-tutorial.html<br>
>春夏秋冬过：https://segmentfault.com/a/1190000012557493<br>
>江南一点雨：https://cloud.tencent.com/developer/article/1612175<br>
>Dearmadman：https://www.jianshu.com/p/576dbf44b2ae<br>
>mcarozheng：http://www.macrozheng.com/

源码路径：

>https://github.com/itwanger/coding-more


----

**本篇已收录至 GitHub 上星标 1.6k+ star 的开源专栏《Java程序员进阶之路》，据说每一个优秀的 Java 程序员都喜欢她，风趣幽默、通俗易懂。内容包括 Java 基础、Java 并发编程、Java 虚拟机、Java 企业级开发、Java 面试等核心知识点。学 Java，就认准 Java程序员进阶之路**😄。

[https://github.com/itwanger/toBeBetterJavaer](https://github.com/itwanger/toBeBetterJavaer)

star 了这个仓库就等于你拥有了成为了一名优秀 Java 工程师的潜力。也可以戳下面的链接跳转到《Java程序员进阶之路》的官网网址，开始愉快的学习之旅吧。

[https://tobebetterjavaer.com/](https://tobebetterjavaer.com/)


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/springboot/jwt-10.png)


*没有什么使我停留——除了目的，纵然岸旁有玫瑰、有绿荫、有宁静的港湾，我是不系之舟*。

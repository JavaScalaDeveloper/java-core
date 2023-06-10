
## ��������Դ

### Spring ��������Դ

Spring ��������Դ�ж��ַ�ʽ������һһ�о٣�

#### [#](https://dunwu.github.io/spring-tutorial/pages/1b774c/#%E4%BD%BF%E7%94%A8-jndi-%E6%95%B0%E6%8D%AE%E6%BA%90)ʹ�� JNDI ����Դ

��� Spring Ӧ�ò�����֧�� JNDI �� WEB �������ϣ��� WebSphere��JBoss��Tomcat �ȣ����Ϳ���ʹ�� JNDI ��ȡ����Դ��



```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
http://www.springframework.org/schema/jee
http://www.springframework.org/schema/jee/spring-jee-3.2.xsd">

  <!-- 1.ʹ��bean����jndi����Դ -->
  <bean id="dataSource" class="org.springframework.jndi.JndiObjectFactoryBean">
    <property name="jndiName" value="java:comp/env/jdbc/orclight" />
  </bean>

  <!-- 2.ʹ��jee��ǩ����jndi����Դ����1�ȼۣ�������Ҫ���������ռ� -->
  <jee:jndi-lookup id="dataSource" jndi-name=" java:comp/env/jdbc/orclight" />
</beans>

```



#### [#](https://dunwu.github.io/spring-tutorial/pages/1b774c/#%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5%E6%B1%A0)ʹ�����ݿ����ӳ�

Spring ����û���ṩ���ݿ����ӳص�ʵ�֣���Ҫ����ѡ����ʵ����ݿ����ӳء�������һ��ʹ�� [Druid (opens new window)](https://github.com/alibaba/druid)��Ϊ���ݿ����ӳص�ʾ����



```
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
        init-method="init" destroy-method="close">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>

    <!-- ���ó�ʼ����С����С����� -->
    <property name="initialSize" value="1"/>
    <property name="minIdle" value="1"/>
    <property name="maxActive" value="10"/>

    <!-- ���û�ȡ���ӵȴ���ʱ��ʱ�� -->
    <property name="maxWait" value="10000"/>

    <!-- ���ü����òŽ���һ�μ�⣬�����Ҫ�رյĿ������ӣ���λ�Ǻ��� -->
    <property name="timeBetweenEvictionRunsMillis" value="60000"/>

    <!-- ����һ�������ڳ�����С�����ʱ�䣬��λ�Ǻ��� -->
    <property name="minEvictableIdleTimeMillis" value="300000"/>

    <property name="testWhileIdle" value="true"/>

    <!-- ���ｨ������ΪTRUE����ֹȡ�������Ӳ����� -->
    <property name="testOnBorrow" value="true"/>
    <property name="testOnReturn" value="false"/>

    <!-- ��PSCache������ָ��ÿ��������PSCache�Ĵ�С -->
    <property name="poolPreparedStatements" value="true"/>
    <property name="maxPoolPreparedStatementPerConnectionSize"
              value="20"/>

    <!-- ���������ύ��ʽ��Ĭ�Ͼ���TRUE�����Բ������� -->

    <property name="defaultAutoCommit" value="true"/>

    <!-- ��֤������Ч����SQL����ͬ���������ò�ͬ -->
    <property name="validationQuery" value="select 1 "/>
    <property name="filters" value="stat"/>
  </bean>

```



#### [#](https://dunwu.github.io/spring-tutorial/pages/1b774c/#%E5%9F%BA%E4%BA%8E-jdbc-%E9%A9%B1%E5%8A%A8%E7%9A%84%E6%95%B0%E6%8D%AE%E6%BA%90)���� JDBC ����������Դ



```
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
  <property name="driverClassName" value="${jdbc.driver}"/>
  <property name="url" value="${jdbc.url}"/>
  <property name="username" value="${jdbc.username}"/>
  <property name="password" value="${jdbc.password}"/>
</bean>
```


#### ʹ��JDBC

������: 2022/11/16 20:10 / �Ķ�: 946668

* * *



������ǰ�����[JDBC���](https://www.liaoxuefeng.com/wiki/1252599548343744/1255943820274272)ʱ�Ѿ�������Java����ʹ��JDBC�ӿڷ��ʹ�ϵ���ݿ��ʱ����Ҫ���¼�����

*   ����ȫ��`DataSource`ʵ������ʾ���ݿ����ӳأ�
*   ����Ҫ��д���ݿ�ķ����ڲ��������²���������ݿ⣺
    *   ��ȫ��`DataSource`ʵ����ȡ`Connection`ʵ����
    *   ͨ��`Connection`ʵ������`PreparedStatement`ʵ����
    *   ִ��SQL��䣬����ǲ�ѯ����ͨ��`ResultSet`��ȡ�������������޸ģ�����`int`�����

��ȷ��дJDBC����Ĺؼ���ʹ��`try ... finally`�ͷ���Դ���漰������Ĵ�����Ҫ��ȷ�ύ��ع�����

��Springʹ��JDBC����������ͨ��IoC��������������һ��`DataSource`ʵ����Ȼ��Spring�ṩ��һ��`JdbcTemplate`�����Է���������ǲ���JDBC����ˣ�ͨ������£����ǻ�ʵ����һ��`JdbcTemplate`������˼�壬�������Ҫʹ����[Templateģʽ](https://www.liaoxuefeng.com/wiki/1252599548343744/1281319636041762)��

��дʾ��������߲��Դ���ʱ������ǿ���Ƽ�ʹ��[HSQLDB](http://hsqldb.org/)������ݿ⣬����һ����Java��д�Ĺ�ϵ���ݿ⣬�������ڴ�ģʽ�����ļ�ģʽ���У�����ֻ��һ��jar�����ǳ��ʺ���ʾ������߲��Դ��롣

������ʵ�ʹ���Ϊ�����ȴ���Maven����`spring-data-jdbc`��Ȼ����������������

*   org.springframework:spring-context:6.0.0
*   org.springframework:spring-jdbc:6.0.0
*   jakarta.annotation:jakarta.annotation-api:2.1.1
*   com.zaxxer:HikariCP:5.0.1
*   org.hsqldb:hsqldb:2.7.1

��`AppConfig`�У�������Ҫ�������¼��������Bean��

```
@Configuration
@ComponentScan
@PropertySource("jdbc.properties")
public class AppConfig {

    @Value("${jdbc.url}")
    String jdbcUrl;

    @Value("${jdbc.username}")
    String jdbcUsername;

    @Value("${jdbc.password}")
    String jdbcPassword;

    @Bean
    DataSource createDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(jdbcUsername);
        config.setPassword(jdbcPassword);
        config.addDataSourceProperty("autoCommit", "true");
        config.addDataSourceProperty("connectionTimeout", "5");
        config.addDataSourceProperty("idleTimeout", "60");
        return new HikariDataSource(config);
    }

    @Bean
    JdbcTemplate createJdbcTemplate(@Autowired DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}

```

�����������У�

1.  ͨ��`@PropertySource("jdbc.properties")`��ȡ���ݿ������ļ���
2.  ͨ��`@Value("${jdbc.url}")`ע�������ļ���������ã�
3.  ����һ��DataSourceʵ��������ʵ��������`HikariDataSource`������ʱ��Ҫ�õ�ע������ã�
4.  ����һ��JdbcTemplateʵ��������Ҫע��`DataSource`������ͨ�������������ע��ġ�

������HSQLDBдһ�������ļ�`jdbc.properties`��

```
# ���ݿ��ļ���Ϊtestdb:
jdbc.url=jdbc:hsqldb:file:testdb

# HsqldbĬ�ϵ��û�����sa�������ǿ��ַ���:
jdbc.username=sa
jdbc.password=

```

����ͨ��HSQLDB�Դ��Ĺ�������ʼ�����ݿ����������дһ��Bean����Spring��������ʱ�Զ�����һ��`users`��

```
@Component
public class DatabaseInitializer {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        jdbcTemplate.update("CREATE TABLE IF NOT EXISTS users (" //
                + "id BIGINT IDENTITY NOT NULL PRIMARY KEY, " //
                + "email VARCHAR(100) NOT NULL, " //
                + "password VARCHAR(100) NOT NULL, " //
                + "name VARCHAR(100) NOT NULL, " //
                + "UNIQUE (email))");
    }
}

```

���ڣ�����׼������������ϡ�����ֻ��Ҫ����Ҫ�������ݿ��Bean�У�ע��`JdbcTemplate`���ɣ�

```
@Component
public class UserService {
    @Autowired
    JdbcTemplate jdbcTemplate;
    ...
}

```

### JdbcTemplate�÷�

Spring�ṩ��`JdbcTemplate`����Templateģʽ���ṩ��һϵ���Իص�Ϊ�ص�Ĺ��߷�����Ŀ���Ǳ��ⷱ����`try...catch`��䡣

�����Ծ����ʾ����˵��JdbcTemplate���÷���

�������ǿ�`T execute(ConnectionCallback<T> action)`���������ṩ��Jdbc��`Connection`������ʹ�ã�

```
public User getUserById(long id) {
    // ע�⴫�����ConnectionCallback:
    return jdbcTemplate.execute((Connection conn) -> {
        // ����ֱ��ʹ��connʵ������Ҫ�ͷ������ص�������JdbcTemplate�Զ��ͷ�:
        // ���ڲ��ֶ�������PreparedStatement��ResultSet������try(...)�ͷ�:
        try (var ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?")) {
            ps.setObject(1, id);
            try (var rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new User( // new User object:
                            rs.getLong("id"), // id
                            rs.getString("email"), // email
                            rs.getString("password"), // password
                            rs.getString("name")); // name
                }
                throw new RuntimeException("user not found by id.");
            }
        }
    });
}

```

Ҳ����˵�������ص����������ȡConnection��Ȼ�����κλ���Connection�Ĳ�����

�����ٿ�`T execute(String sql, PreparedStatementCallback<T> action)`���÷���

```
public User getUserByName(String name) {
    // ��Ҫ����SQL��䣬�Լ�PreparedStatementCallback:
    return jdbcTemplate.execute("SELECT * FROM users WHERE name = ?", (PreparedStatement ps) -> {
        // PreparedStatementʵ���Ѿ���JdbcTemplate���������ڻص����Զ��ͷ�:
        ps.setObject(1, name);
        try (var rs = ps.executeQuery()) {
            if (rs.next()) {
                return new User( // new User object:
                        rs.getLong("id"), // id
                        rs.getString("email"), // email
                        rs.getString("password"), // password
                        rs.getString("name")); // name
            }
            throw new RuntimeException("user not found by id.");
        }
    });
}

```

������ǿ�`T queryForObject(String sql, RowMapper<T> rowMapper, Object... args)`������

```
public User getUserByEmail(String email) {
    // ����SQL��������RowMapperʵ��:
    return jdbcTemplate.queryForObject("SELECT * FROM users WHERE email = ?",
            (ResultSet rs, int rowNum) -> {
                // ��ResultSet�ĵ�ǰ��ӳ��Ϊһ��JavaBean:
                return new User( // new User object:
                        rs.getLong("id"), // id
                        rs.getString("email"), // email
                        rs.getString("password"), // password
                        rs.getString("name")); // name
            },
            email);
}

```

��`queryForObject()`�����У�����SQL�Լ�SQL������`JdbcTemplate`���Զ�����`PreparedStatement`���Զ�ִ�в�ѯ������`ResultSet`�������ṩ��`RowMapper`��Ҫ����������ǰ�`ResultSet`�ĵ�ǰ��ӳ���һ��JavaBean�����ء����������У�ʹ��`Connection`��`PreparedStatement`��`ResultSet`������Ҫ�����ֶ�����

`RowMapper`��һ������JavaBean��ʵ���������Է����κ�Java�������磬ʹ��`SELECT COUNT(*)`��ѯʱ�����Է���`Long`��

```
public long getUsers() {
    return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users", (ResultSet rs, int rowNum) -> {
        // SELECT COUNT(*)��ѯֻ��һ�У�ȡ��һ������:
        return rs.getLong(1);
    });
}

```

��������������ض��м�¼��������һ�У�������`query()`������

```
public List<User> getUsers(int pageIndex) {
    int limit = 100;
    int offset = limit * (pageIndex - 1);
    return jdbcTemplate.query("SELECT * FROM users LIMIT ? OFFSET ?",
            new BeanPropertyRowMapper<>(User.class),
            limit, offset);
}

```

����`query()`��������Ĳ�����Ȼ��SQL��SQL�����Լ�`RowMapper`ʵ������������ֱ��ʹ��Spring�ṩ��`BeanPropertyRowMapper`��������ݿ��Ľṹǡ�ú�JavaBean����������һ�£���ô`BeanPropertyRowMapper`�Ϳ���ֱ�Ӱ�һ�м�¼������ת��ΪJavaBean��

�������ִ�еĲ��ǲ�ѯ�����ǲ��롢���º�ɾ����������ô��Ҫʹ��`update()`������

```
public void updateUser(User user) {
    // ����SQL��SQL���������ظ��µ�����:
    if (1 != jdbcTemplate.update("UPDATE users SET name = ? WHERE id = ?", user.getName(), user.getId())) {
        throw new RuntimeException("User not found by id");
    }
}

```

ֻ��һ��`INSERT`�����Ƚ����⣬�Ǿ������ĳһ���������У�����������������ͨ����������Ҫ��ȡ����������ֵ��`JdbcTemplate`�ṩ��һ��`KeyHolder`������һ������

```
public User register(String email, String password, String name) {
    // ����һ��KeyHolder:
    KeyHolder holder = new GeneratedKeyHolder();
    if (1 != jdbcTemplate.update(
        // ����1:PreparedStatementCreator
        (conn) -> {
            // ����PreparedStatementʱ������ָ��RETURN_GENERATED_KEYS:
            var ps = conn.prepareStatement("INSERT INTO users(email, password, name) VALUES(?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            ps.setObject(1, email);
            ps.setObject(2, password);
            ps.setObject(3, name);
            return ps;
        },
        // ����2:KeyHolder
        holder)
    ) {
        throw new RuntimeException("Insert failed.");
    }
    // ��KeyHolder�л�ȡ���ص�����ֵ:
    return new User(holder.getKey().longValue(), email, password, name);
}

```

`JdbcTemplate`����������ط������������ǲ�һһ���ܡ���Ҫǿ�����ǣ�`JdbcTemplate`ֻ�Ƕ�JDBC������һ���򵥷�װ������Ŀ���Ǿ��������ֶ���д`try(resource) {...}`�Ĵ��룬���ڲ�ѯ����Ҫͨ��`RowMapper`ʵ����JDBC�������Java�����ת����

�����ܽ�һ��`JdbcTemplate`���÷����Ǿ��ǣ�

*   ��Լ򵥲�ѯ����ѡ`query()`��`queryForObject()`����Ϊֻ���ṩSQL��䡢������`RowMapper`��
*   ��Ը��²�������ѡ`update()`����Ϊֻ���ṩSQL���Ͳ�����
*   �κθ��ӵĲ���������Ҳ����ͨ��`execute(ConnectionCallback)`ʵ�֣���Ϊ�õ�`Connection`�Ϳ������κ�JDBC������

ʵ��������ʹ��������Ȼ�Ǹ��ֲ�ѯ���������Ʊ�ṹ��ʱ���ܹ���JavaBean������һһ��Ӧ����ôֱ��ʹ��`BeanPropertyRowMapper`�ͺܷ��㡣�����ṹ��JavaBean��һ����ô�죿�Ǿ���Ҫ��΢��дһ�²�ѯ��ʹ������Ľṹ��JavaBean����һ�¡�

���磬���������`office_address`����JavaBean������`workAddress`������Ҫָ����������д��ѯ���£�

```
SELECT id, email, office_address AS workAddress, name FROM users WHERE email = ?
```

ʹ��`JdbcTemplate`��ʱ�������õ����ķ�������`List<T> query(String, RowMapper, Object...)`�����`RowMapper`�����þ��ǰ�`ResultSet`��һ�м�¼ӳ��ΪJava Bean��

���ְѹ�ϵ���ݿ�ı��¼ӳ��ΪJava����Ĺ��̾���ORM��Object-Relational Mapping��ORM�ȿ��԰Ѽ�¼ת����Java����Ҳ���԰�Java����ת��Ϊ�м�¼��

ʹ��`JdbcTemplate`���`RowMapper`���Կ�������ԭʼ��ORM�����Ҫʵ�ָ��Զ�����ORM������ѡ������ORM��ܣ�����[Hibernate](https://hibernate.org/)��

���������������Spring�м���Hibernate��

Hibernate��ΪORM��ܣ����������`JdbcTemplate`����Hibernate��Ȼ��ҪJDBC���������ԣ�������Ҫ����JDBC���������ӳأ��Լ�Hibernate������Maven�У����Ǽ������������

*   org.springframework:spring-context:6.0.0
*   org.springframework:spring-orm:6.0.0
*   jakarta.annotation:jakarta.annotation-api:2.1.1
*   jakarta.persistence:jakarta.persistence-api:3.1.0
*   org.hibernate:hibernate-core:6.1.4.Final
*   com.zaxxer:HikariCP:5.0.1
*   org.hsqldb:hsqldb:2.7.1

��`AppConfig`�У�������Ȼ��Ҫ����`DataSource`������JDBC�����ļ����Լ���������ʽ����

```
@Configuration
@ComponentScan
@EnableTransactionManagement
@PropertySource("jdbc.properties")
public class AppConfig {
    @Bean
    DataSource createDataSource() {
        ...
    }
}

```

Ϊ������Hibernate��������Ҫ����һ��`LocalSessionFactoryBean`��

```
public class AppConfig {
    @Bean
    LocalSessionFactoryBean createSessionFactory(@Autowired DataSource dataSource) {
        var props = new Properties();
        props.setProperty("hibernate.hbm2ddl.auto", "update"); // ����������Ҫʹ��
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
        props.setProperty("hibernate.show_sql", "true");
        var sessionFactoryBean = new LocalSessionFactoryBean();
        sessionFactoryBean.setDataSource(dataSource);
        // ɨ��ָ����package��ȡ����entity class:
        sessionFactoryBean.setPackagesToScan("com.itranswarp.learnjava.entity");
        sessionFactoryBean.setHibernateProperties(props);
        return sessionFactoryBean;
    }
}

```

ע��������[����Bean](https://www.liaoxuefeng.com/wiki/1252599548343744/1308043627200545)�н�����`FactoryBean`��`LocalSessionFactoryBean`��һ��`FactoryBean`���������Զ�����һ��`SessionFactory`����Hibernate�У�`Session`�Ƿ�װ��һ��JDBC `Connection`��ʵ������`SessionFactory`�Ƿ�װ��JDBC `DataSource`��ʵ������`SessionFactory`�������ӳأ�ÿ����Ҫ�������ݿ��ʱ��`SessionFactory`����һ���µ�`Session`���൱�ڴ����ӳػ�ȡ��һ���µ�`Connection`��`SessionFactory`����Hibernate�ṩ������ĵ�һ�����󣬵�`LocalSessionFactoryBean`��Spring�ṩ��Ϊ�������Ƿ��㴴��`SessionFactory`���ࡣ

ע�⵽���洴��`LocalSessionFactoryBean`�Ĵ��룬������`Properties`����Hibernate��ʼ��`SessionFactory`ʱ�õ����������ã����õ�������ο�[Hibernate�ĵ�](https://docs.jboss.org/hibernate/orm/5.4/userguide/html_single/Hibernate_User_Guide.html#configurations)����������ֻ������3�����ã�

*   `hibernate.hbm2ddl.auto=update`����ʾ�Զ��������ݿ�ı�ṹ��ע�ⲻҪ���������������ã�
*   `hibernate.dialect=org.hibernate.dialect.HSQLDialect`��ָʾHibernateʹ�õ����ݿ���HSQLDB��Hibernateʹ��һ��HQL�Ĳ�ѯ��䣬����SQL���ƣ��������ڡ����롱��SQLʱ��������趨�����ݿ⡰���ԡ�������������ݿ��Ż���SQL��
*   `hibernate.show_sql=true`����Hibernate��ӡִ�е�SQL������ڵ��Էǳ����ã����ǿ��Է���ؿ���Hibernate���ɵ�SQL����Ƿ�������ǵ�Ԥ�ڡ�

��������`DataSource`��`Properties`֮�⣬ע�⵽`setPackagesToScan()`���Ǵ�����һ��`package`���ƣ���ָʾHibernateɨ����������������Java�࣬�Զ��ҳ���ӳ��Ϊ���ݿ���¼��JavaBean���������ǻ���ϸ������α�д����HibernateҪ���JavaBean��

�����ţ����ǻ���Ҫ����`HibernateTransactionManager`��

```
public class AppConfig {
    @Bean
    PlatformTransactionManager createTxManager(@Autowired SessionFactory sessionFactory) {
        return new HibernateTransactionManager(sessionFactory);
    }
}

```

`HibernateTransactionManager`�����Hibernateʹ������ʽ����������ġ�����Ϊֹ�����е����ö�������ϣ�������������ν����ݿ��ṹӳ��ΪJava����

�������µ����ݿ��

```
CREATE TABLE user
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    createdAt BIGINT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
);

```

���У�`id`������������`email`��`password`��`name`��`VARCHAR`���ͣ�`email`��Ψһ������ȷ��Ψһ�ԣ�`createdAt`�洢�������͵�ʱ�������JavaBean��ʾ���£�

```
public class User {
    private Long id;
    private String email;
    private String password;
    private String name;
    private Long createdAt;

    // getters and setters
    ...
}

```

����ӳ���ϵʮ���׶�����������Ҫ���һЩע��������Hibernate��ΰ�`User`��ӳ�䵽���¼��

```
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    public Long getId() { ... }

    @Column(nullable = false, unique = true, length = 100)
    public String getEmail() { ... }

    @Column(nullable = false, length = 100)
    public String getPassword() { ... }

    @Column(nullable = false, length = 100)
    public String getName() { ... }

    @Column(nullable = false, updatable = false)
    public Long getCreatedAt() { ... }
}

```

���һ��JavaBean������ӳ�䣬���Ǿͱ��һ��`@Entity`��Ĭ������£�ӳ��ı�����`user`�����ʵ�ʵı�����ͬ������ʵ�ʱ�����`users`������׷��һ��`@Table(name="users")`��ʾ��

```
@Entity
@Table(name="users)
public class User {
    ...
}

```

ÿ�����Ե����ݿ��е�ӳ����`@Column()`��ʶ��`nullable`ָʾ���Ƿ�����Ϊ`NULL`��`updatable`ָʾ�����Ƿ���������`UPDATE`��䣬`length`ָʾ`String`���͵��еĳ��ȣ����û��ָ����Ĭ����`255`����

��������������Ҫ��`@Id`��ʶ������������׷��һ��`@GeneratedValue`���Ա�Hibernate�ܶ�ȡ������������ֵ��

ϸ�ĵ�ͯЬ���ܻ�ע�⵽������`id`��������Ͳ���`long`������`Long`��������ΪHibernate�����⵽����Ϊ`null`���Ͳ�����`INSERT`�����ָ��������ֵ�����Ƿ��������ݿ����ɵ�����ֵ������Hibernate��Ϊ���ǵĳ���ָ����������ֵ������`INSERT`�����ֱ���г���`long`���ֶ����Ǿ���Ĭ��ֵ`0`����ˣ�ÿ�β��������ֵ����0�����³���һ����������붼��ʧ�ܡ�

`createdAt`��Ȼ�����ͣ������ǲ�û��ʹ��`long`������`Long`��������Ϊʹ�û������ͻᵼ��findByExample��ѯ��������������������ֻ���μǣ���Ϊӳ��ʹ�õ�JavaBean���������Զ�ʹ�ð�װ���Ͷ����ǻ������͡�

ʹ��Hibernateʱ����Ҫʹ�û������͵����ԣ�����ʹ�ð�װ���ͣ���Long��Integer��

���Ƶģ������ٶ���һ��`Book`�ࣺ

```
@Entity
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    public Long getId() { ... }

    @Column(nullable = false, length = 100)
    public String getTitle() { ... }

    @Column(nullable = false, updatable = false)
    public Long getCreatedAt() { ... }
}

```

�����ϸ�۲�`User`��`Book`���ᷢ�����Ƕ����`id`��`createdAt`������һ���ģ��������ݿ��ṹ������кܳ���������ÿ����ͨ�����ǻ�ͳһʹ��һ���������ɻ��ƣ������`createdAt`��ʾ����ʱ�䣬`updatedAt`��ʾ�޸�ʱ���ͨ���ֶΡ�

������`User`��`Book`���ظ�������Щͨ���ֶΣ����ǿ��԰������ᵽһ���������У�

```
@MappedSuperclass
public abstract class AbstractEntity {

    private Long id;
    private Long createdAt;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    public Long getId() { ... }

    @Column(nullable = false, updatable = false)
    public Long getCreatedAt() { ... }

    @Transient
    public ZonedDateTime getCreatedDateTime() {
        return Instant.ofEpochMilli(this.createdAt).atZone(ZoneId.systemDefault());
    }

    @PrePersist
    public void preInsert() {
        setCreatedAt(System.currentTimeMillis());
    }
}

```

����`AbstractEntity`��˵������Ҫ��עһ��`@MappedSuperclass`��ʾ�����ڼ̳С����⣬ע�⵽���Ƕ�����һ��`@Transient`������������һ�������⡱�����ԡ���Ϊ`getCreatedDateTime()`�Ǽ���ó������ԣ������Ǵ����ݿ�������ֵ����˱���Ҫ��ע`@Transient`������Hibernate�᳢�Դ����ݿ��ȡ��Ϊ`createdDateTime`��������ڵ��ֶδӶ�����

��ע�⵽`@PrePersist`��ʶ�ķ���������ʾ�����ǽ�һ��JavaBean�־û������ݿ�֮ǰ����ִ��INSERT��䣩��Hibernate����ִ�и÷������������ǾͿ����Զ����ú�`createdAt`���ԡ�

����`AbstractEntity`�����ǾͿ��Դ����`User`��`Book`��

```
@Entity
public class User extends AbstractEntity {

    @Column(nullable = false, unique = true, length = 100)
    public String getEmail() { ... }

    @Column(nullable = false, length = 100)
    public String getPassword() { ... }

    @Column(nullable = false, length = 100)
    public String getName() { ... }
}

```

ע�⵽ʹ�õ�����ע�������`jakarta.persistence`������JPA�淶��һ���֡���������ֻ����ʹ��ע��ķ�ʽ����Hibernateӳ���ϵ�����ٽ��ܴ�ͳ�ıȽϷ�����XML���á�ͨ��Spring����Hibernateʱ��Ҳ������Ҫ`hibernate.cfg.xml`�����ļ�����һ�仰�ܽ᣺

ʹ��Spring����Hibernate�����JPAע�⣬�����κζ����XML���á�

����`User`��`Book`����������ORM��Java Bean������ͨ����֮ΪEntity Bean��

������������������`user`�������ɾ�Ĳ顣��Ϊʹ����Hibernate����ˣ�����Ҫ���ģ�ʵ�����Ƕ�`User`���JavaBean���С���ɾ�Ĳ顱�����Ǳ�дһ��`UserService`��ע��`SessionFactory`��

```
@Component
@Transactional
public class UserService {
    @Autowired
    SessionFactory sessionFactory;
}

```

### Insert����

Ҫ�־û�һ��`User`ʵ��������ֻ�����`persist()`��������`register()`����Ϊ�����������£�

```
public User register(String email, String password, String name) {
    // ����һ��User����:
    User user = new User();
    // ���úø�������:
    user.setEmail(email);
    user.setPassword(password);
    user.setName(name);
    // ��Ҫ����id����Ϊʹ������������
    // ���浽���ݿ�:
    sessionFactory.getCurrentSession().persist(user);
    // �����Ѿ��Զ������id:
    System.out.println(user.getId());
    return user;
}

```

### Delete����

ɾ��һ��`User`�൱�ڴӱ���ɾ����Ӧ�ļ�¼��ע��Hibernate������`id`��ɾ����¼����ˣ�Ҫ��ȷ����`User`��`id`���Բ�������ɾ����¼��

```
public boolean deleteUser(Long id) {
    User user = sessionFactory.getCurrentSession().byId(User.class).load(id);
    if (user != null) {
        sessionFactory.getCurrentSession().remove(user);
        return true;
    }
    return false;
}

```

ͨ������ɾ����¼ʱ��һ���������÷����ȸ����������ظü�¼����ɾ����ע�⵽����¼������ʱ��`load()`����`null`��

### Update����

���¼�¼�൱���ȸ���`User`��ָ�����ԣ�Ȼ�����`merge()`������

```
public void updateUser(Long id, String name) {
    User user = sessionFactory.getCurrentSession().byId(User.class).load(id);
    user.setName(name);
    sessionFactory.getCurrentSession().merge(user);
}

```

ǰ�������ڶ���`User`ʱ�����е����Ա�ע��`@Column(updatable=false)`��Hibernate�ڸ��¼�¼ʱ����ֻ���`@Column(updatable=true)`�����Լ��뵽`UPDATE`����У����������ṩһ�����İ�ȫ�ԣ��������С���޸���`User`��`email`��`createdAt`�����ԣ�ִ��`update()`ʱ��������¶�Ӧ�����ݿ��С���Ҳ�����μǣ����������Hibernate�ṩ�ģ�����ƹ�Hibernateֱ��ͨ��JDBCִ��`UPDATE`�����Ȼ���Ը������ݿ�������е�ֵ��

������Ǳ�д�Ĵ󲿷ַ������Ǹ��ָ����Ĳ�ѯ������`id`��ѯ���ǿ���ֱ�ӵ���`load()`�����Ҫʹ��������ѯ�����磬����������ִ�����²�ѯ��

```
SELECT * FROM user WHERE email = ? AND password = ?

```

��������������ʹ��ʲô��ѯ��

### ʹ��HQL��ѯ

һ�ֳ��õĲ�ѯ��ֱ�ӱ�дHibernate���õ�HQL��ѯ��

```
List<User> list = sessionFactory.getCurrentSession()
        .createQuery("from User u where u.email = ?1 and u.password = ?2", User.class)
        .setParameter(1, email).setParameter(2, password)
        .list();

```

��SQL��ȣ�HQLʹ������������������Hibernate�Զ�ת��Ϊʵ�ʵı�������������ϸ��HQL�﷨���Բο�[Hibernate�ĵ�](https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html#query-language)��

���˿���ֱ�Ӵ���HQL�ַ����⣬Hibernate������ʹ��һ��`NamedQuery`��������ѯ������֣�Ȼ�󱣴���ע���С�ʹ��`NamedQuery`ʱ������Ҫ����`User`���ע��

```
@NamedQueries(
    @NamedQuery(
        // ��ѯ����:
        name = "login",
        // ��ѯ���:
        query = "SELECT u FROM User u WHERE u.email = :e AND u.password = :pwd"
    )
)
@Entity
public class User extends AbstractEntity {
    ...
}

```

ע�⵽�����`NamedQuery`��`jakarta.persistence.NamedQuery`������ֱ�Ӵ���HQL�е㲻ͬ���ǣ�ռλ��ʹ��`:e`��`:pwd`��

ʹ��`NamedQuery`ֻ��Ҫ�����ѯ���Ͳ�����

```
public User login(String email, String password) {
    List<User> list = sessionFactory.getCurrentSession()
        .createNamedQuery("login", User.class) // ����NamedQuery
        .setParameter("e", email) // ��e����
        .setParameter("pwd", password) // ��pwd����
        .list();
    return list.isEmpty() ? null : list.get(0);
}

```

ֱ��дHQL��ʹ��`NamedQuery`�������ӡ�ǰ�߿����ڴ�����ֱ�۵ؿ�����ѯ��䣬���߿�����`User`��ͳһ����������ز�ѯ��

��һ�����ǽ�����Spring�м���Hibernate��Hibernate�ǵ�һ�����㷺ʹ�õ�ORM��ܣ����Ǻܶ�С��黹��˵��JPA��Java Persistence API��������ɶ��

������JPA֮ǰ������Ҫע�⵽JavaEE����1999��ͷ����ˣ�������Servlet��JMS������׼��������ƽ̨��ͬ��Java�������ڷǳ������ڱ�׼���У����Ҹ�����������������ѽӿڶ��ˣ�Ȼ�󣬸��ԻؼҸɻ�ȥʵ�ֽӿڣ��������û��Ϳ����ڲ�ͬ�ĳ����ṩ�Ĳ�Ʒ����ѡ�񣬻����������л�����Ϊ�û���д�����ʱ��ֻ��Ҫ���ýӿڣ�������Ҫ���þ���ĵײ�ʵ�֣�����JDBC����

JPA����JavaEE��һ��ORM��׼������ʵ����ʵ��Hibernateûɶ�������𣬵����û����ʹ��JPA����ô���õľ���`jakarta.persistence`�������׼������������`org.hibernate`�����ĵ�����������ΪJPAֻ�ǽӿڣ����ԣ�����Ҫѡ��һ��ʵ�ֲ�Ʒ����JDBC�ӿں�MySQL����һ������

����ʹ��JPAʱҲ��ȫ����ѡ��Hibernate��Ϊ�ײ�ʵ�֣���Ҳ����ѡ��������JPA�ṩ��������[EclipseLink](https://www.eclipse.org/eclipselink/)��Spring������JPA�ļ��ɣ���֧��ѡ��Hibernate��EclipseLink��Ϊʵ�֡�����������Ȼ��������Hibernate��ΪJPAʵ��Ϊ���ӣ���ʾJPA�Ļ����÷���

��ʹ��Hibernateһ��������ֻ��Ҫ��������������

*   org.springframework:spring-context:6.0.0
*   org.springframework:spring-orm:6.0.0
*   jakarta.annotation:jakarta.annotation-api:2.1.1
*   jakarta.persistence:jakarta.persistence-api:3.1.0
*   org.hibernate:hibernate-core:6.1.4.Final
*   com.zaxxer:HikariCP:5.0.1
*   org.hsqldb:hsqldb:2.7.1

ʵ�������������������������һ�ڼ���Hibernate�����������ȫһ������ΪHibernate���ṩ�����Լ��Ľӿڣ�Ҳ�ṩ��JPA�ӿڣ�������JPA�ӿھ��൱��ͨ��JPA����Hibernate��

Ȼ����`AppConfig`����������ʽ�����������`DataSource`��

```
@Configuration
@ComponentScan
@EnableTransactionManagement
@PropertySource("jdbc.properties")
public class AppConfig {
    @Bean
    DataSource createDataSource() { ... }
}

```

ʹ��Hibernateʱ��������Ҫ����һ��`LocalSessionFactoryBean`�����������Զ�����һ��`SessionFactory`��ʹ��JPAҲ�����Ƶģ�����Ҳ����һ��`LocalContainerEntityManagerFactoryBean`�����������Զ�����һ��`EntityManagerFactory`��

```
@Bean
public LocalContainerEntityManagerFactoryBean createEntityManagerFactory(@Autowired DataSource dataSource) {
    var emFactory = new LocalContainerEntityManagerFactoryBean();
    // ע��DataSource:
    emFactory.setDataSource(dataSource);
    // ɨ��ָ����package��ȡ����entity class:
    emFactory.setPackagesToScan(AbstractEntity.class.getPackageName());
    // ʹ��Hibernate��ΪJPAʵ��:
    emFactory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
    // ����������:
    var props = new Properties();
    props.setProperty("hibernate.hbm2ddl.auto", "update"); // ����������Ҫʹ��
    props.setProperty("hibernate.dialect", "org.hibernate.dialect.HSQLDialect");
    props.setProperty("hibernate.show_sql", "true");
    emFactory.setJpaProperties(props);
    return emFactory;
}

```

�۲��������룬������Ҫע��`DataSource`���趨�Զ�ɨ���`package`�⣬����Ҫָ��JPA���ṩ�̣�����ʹ��Spring�ṩ��һ��`HibernateJpaVendorAdapter`��������Hibernate�Լ���Ҫ�����ã���`Properties`����ʽע�롣

������ǻ���Ҫʵ����һ��`JpaTransactionManager`����ʵ������ʽ����

```
@Bean
PlatformTransactionManager createTxManager(@Autowired EntityManagerFactory entityManagerFactory) {
    return new JpaTransactionManager(entityManagerFactory);
}

```

���������Ǿ������JPA��ȫ����ʼ����������ЩͯЬ���ܴ�����������֪JPA��Ҫ`persistence.xml`�����ļ����Լ����ӵ�`orm.xml`�ļ����������Ǹ���ظ��ߴ�ң�ʹ��Spring+Hibernate��ΪJPAʵ�֣������κ������ļ���

����Entity Bean�����ú���һ����ȫ��ͬ��ȫ������Annotation��ע����������ֻ����ľ����ҵ�������ͨ��JPA�ӿڲ������ݿ⡣

������`UserService`Ϊ�������˱�ע`@Component`��`@Transactional`�⣬������Ҫע��һ��`EntityManager`�����ǲ�Ҫʹ��`Autowired`������`@PersistenceContext`��

```
@Component
@Transactional
public class UserService {
    @PersistenceContext
    EntityManager em;
}

```

���ǻع�һ��JDBC��Hibernate��JPA�ṩ�Ľӿڣ�ʵ���ϣ����ǵĹ�ϵ���£�

| JDBC | Hibernate | JPA |
| --- | --- | --- |
| DataSource | SessionFactory | EntityManagerFactory |
| Connection | Session | EntityManager |

`SessionFactory`��`EntityManagerFactory`�൱��`DataSource`��`Session`��`EntityManager`�൱��`Connection`��ÿ����Ҫ�������ݿ��ʱ����Ҫ��ȡ�µ�`Session`��`EntityManager`��������ٹرա�

���ǣ�ע�⵽`UserService`ע��Ĳ���`EntityManagerFactory`������`EntityManager`�����ұ�ע��`@PersistenceContext`���ѵ�ʹ��JPA����������̲߳���ͬһ��`EntityManager`��

ʵ��������ע��Ĳ�����������`EntityManager`������һ��`EntityManager`�Ĵ����࣬�൱�ڣ�

```
public class EntityManagerProxy implements EntityManager {
    private EntityManagerFactory emf;
}

```

Spring������ע��`@PersistenceContext`��`EntityManager`���Զ�ע������ô�����ڱ�Ҫ��ʱ���Զ���`EntityManager`�����仰˵�����߳����õ�`EntityManager`��Ȼ��ͬһ�������࣬���ô������ڲ���Բ�ͬ�̻߳ᴴ����ͬ��`EntityManager`ʵ����

���ܽ�һ�£���ע��`@PersistenceContext`��`EntityManager`���Ա����̰߳�ȫ�ع���

��ˣ���`UserService`��ÿ��ҵ�񷽷��ֱ��ʹ��`EntityManager`�ͺܷ��㡣��������ѯΪ����

```
public User getUserById(long id) {
    User user = this.em.find(User.class, id);
    if (user == null) {
        throw new RuntimeException("User not found by id: " + id);
    }
    return user;
}

```

��HQL��ѯ���ƣ�JPAʹ��JPQL��ѯ�������﷨��HQL������ࣺ

```
public User fetchUserByEmail(String email) {
    // JPQL��ѯ:
    TypedQuery<User> query = em.createQuery("SELECT u FROM User u WHERE u.email = :e", User.class);
    query.setParameter("e", email);
    List<User> list = query.getResultList();
    if (list.isEmpty()) {
        return null;
    }
    return list.get(0);
}

```

ͬ���ģ�JPAҲ֧��`NamedQuery`�����ȸ���ѯ������֣��ٰ����ִ�����ѯ��

```
public User login(String email, String password) {
    TypedQuery<User> query = em.createNamedQuery("login", User.class);
    query.setParameter("e", email);
    query.setParameter("pwd", password);
    List<User> list = query.getResultList();
    return list.isEmpty() ? null : list.get(0);
}

```

`NamedQuery`ͨ��ע���ע��`User`���ϣ����Ķ������һ�ڵ�`User`��һ����

```
@NamedQueries(
    @NamedQuery(
        name = "login",
        query = "SELECT u FROM User u WHERE u.email=:e AND u.password=:pwd"
    )
)
@Entity
public class User {
    ...
}

```

�����ݿ������ɾ�ĵĲ��������Էֱ�ʹ��`persist()`��`remove()`��`merge()`������������ΪEntity Bean����ʹ�÷ǳ��򵥣����ﲻ�ٶ�����

#### ����MyBatis

������: 2022/11/16 21:07 / �Ķ�: 601258

* * *



ʹ��Hibernate��JPA�������ݿ�ʱ������ORM�ɵ���Ҫ�������ǰ�ResultSet��ÿһ�б��Java Bean�����߰�Java Bean�Զ�ת����INSERT��UPDATE���Ĳ����У��Ӷ�ʵ��ORM��

��ORM���֮����֪����ΰ�������ӳ�䵽Java Bean������Ϊ������Java Bean�������ϸ����㹻��ע����ΪԪ���ݣ�ORM��ܻ�ȡJava Bean��ע��󣬾�֪����ν���˫��ӳ�䡣

��ô��ORM�������θ���Java Bean���޸ģ��Ա���`update()`�����и��±�Ҫ�����ԣ�

����ʹ��[Proxyģʽ](https://www.liaoxuefeng.com/wiki/1252599548343744/1281319432618017)����ORM��ܶ�ȡ��Userʵ��ʵ���ϲ�����User�࣬���Ǵ����࣬������̳���User�࣬�����ÿ��setter�������˸�д��

```
public class UserProxy extends User {
    boolean _isNameChanged;

    public void setName(String name) {
        super.setName(name);
        _isNameChanged = true;
    }
}

```

��������������Ը��ٵ�ÿ�����Եı仯��

���һ�Զ����һ��ϵʱ�����������ֱ��ͨ��getter������ѯ���ݿ⣺

```
public class UserProxy extends User {
    Session _session;
    boolean _isNameChanged;

    public void setName(String name) {
        super.setName(name);
        _isNameChanged = true;
    }

    /**
     * ��ȡUser���������Address����:
     */
    public Address getAddress() {
        Query q = _session.createQuery("from Address where userId = :userId");
        q.setParameter("userId", this.getId());
        List<Address> list = query.list();
        return list.isEmpty() ? null : list(0);
    }
}

```

Ϊ��ʵ�������Ĳ�ѯ��UserProxy���뱣��Hibernate�ĵ�ǰSession�����ǣ��������ύ��Session�Զ��رգ���ʱ�ٻ�ȡ`getAddress()`���޷��������ݿ⣬���߻�ȡ�Ĳ�������һ�µ����ݡ���ˣ�ORM�������������Attached/Detached״̬����ʾ��ǰ��Java Bean��������Session�ķ�Χ�ڣ�����������Session�����һ�������롱���󡣺ܶ��ѧ���޷���ȷ���״̬�仯������߽磬�ͻ���ɴ�����`PersistentObjectException`�쳣��������ʽ״̬ʹ����ͨJava Bean���������ڱ�ø��ӡ�

���⣬Hibernate��JPAΪ��ʵ�ּ��ݶ������ݿ⣬��ʹ��HQL��JPQL��ѯ������һ��ת��������ض����ݿ��SQL���������������������޷��л����ݿ⣬����һ���Զ�ת��������������ܿ����⣬��SQL������Ż��������鷳��

���ORM���ͨ���ṩ�˻��棬���һ���Ϊһ������Ͷ������档һ��������ָ��һ��Session��Χ�ڵĻ��棬�������龰�Ǹ���������ѯʱ�����β�ѯ���Է���ͬһʵ����

```
User user1 = session.load(User.class, 123);
User user2 = session.load(User.class, 123);

```

����������ָ��Session�Ļ��棬һ��Ĭ�Ϲرգ���Ҫ�ֶ����á��������漫������������ݵĲ�һ���ԣ�ԭ������SQL�ǳ��������ᵼ������ĸ��¡����磺

```
// �߳�1��ȡ:
User user1 = session1.load(User.class, 123);
...
// һ��ʱ����߳�2��ȡ:
User user2 = session2.load(User.class, 123);

```

������������Ч��ʱ�������̶߳�ȡ��Userʵ����һ���ģ����ǣ����ݿ��Ӧ���м�¼��ȫ���ܱ��޸ģ����磺

```
-- �����û�����100����:
UPDATE users SET bonus = bonus + 100 WHERE createdAt <= ?

```

ORM�޷��ж�`id=123`���û��Ƿ��ܸ�`UPDATE`���Ӱ�졣���ǵ����ݿ�ͨ����֧�ֶ��Ӧ�ó��򣬴�UPDATE����������������ִ�У�ORM��ܾ͸���֪���ˡ�

���ǰ�����ORM��ܳ�֮Ϊȫ�Զ�ORM��ܡ�

�Ա�Spring�ṩ��JdbcTemplate������ORM�����ȣ���Ҫ�м�����

1.  ��ѯ����Ҫ�ֶ��ṩMapperʵ���Ա��ResultSet��ÿһ�б�ΪJava����
2.  ��ɾ�Ĳ�������Ĳ����б���Ҫ�ֶ����룬����Userʵ����Ϊ[user.id, user.name, user.email]�������б��Ƚ��鷳��

����JdbcTemplate��������������ȷ���ԣ���ÿ�ζ�ȡ����һ�������ݿ���������ǻ��棬��ִ�е�SQL����ȫȷ���ģ�ȱ����Ǵ���ȽϷ���������`INSERT INTO users VALUES (?,?,?)`���Ǹ��ӡ�

���ԣ�����ȫ�Զ�ORM��Hibernate����дȫ����JdbcTemplate֮�䣬����һ�ְ��Զ���ORM����ֻ�����ResultSet�Զ�ӳ�䵽Java Bean�������Զ����Java Bean�������������Լ�д��SQL��[MyBatis](https://mybatis.org/)��������һ�ְ��Զ���ORM��ܡ�

���������������Spring�м���MyBatis��

���ȣ�����Ҫ����MyBatis������Σ�����Spring��û����Hibernate�������ö�MyBatis�ļ��ɣ����ԣ�������Ҫ������MyBatis�ٷ��Լ�������һ����Spring���ɵĿ⣺

*   org.mybatis:mybatis:3.5.11
*   org.mybatis:mybatis-spring:3.0.0

��ǰ��һ�����ȴ���`DataSource`�Ǳز����ٵģ�

```
@Configuration
@ComponentScan
@EnableTransactionManagement
@PropertySource("jdbc.properties")
public class AppConfig {
    @Bean
    DataSource createDataSource() { ... }
}

```

�ٻع�һ��Hibernate��JPA��`SessionFactory`��`EntityManagerFactory`��MyBatis��֮��Ӧ����`SqlSessionFactory`��`SqlSession`��

| JDBC | Hibernate | JPA | MyBatis |
| --- | --- | --- | --- |
| DataSource | SessionFactory | EntityManagerFactory | SqlSessionFactory |
| Connection | Session | EntityManager | SqlSession |

�ɼ���ORM�������·�������Ƶġ�ʹ��MyBatis�ĺ��ľ��Ǵ���`SqlSessionFactory`������������Ҫ��������`SqlSessionFactoryBean`��

```
@Bean
SqlSessionFactoryBean createSqlSessionFactoryBean(@Autowired DataSource dataSource) {
    var sqlSessionFactoryBean = new SqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    return sqlSessionFactoryBean;
}

```

��ΪMyBatis����ֱ��ʹ��Spring���������ʽ������ˣ����������������ʹ��JDBC��һ���ģ�

```
@Bean
PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}

```

��Hibernate��ͬ���ǣ�MyBatisʹ��Mapper��ʵ��ӳ�䣬����Mapper�����ǽӿڡ�������`User`��Ϊ������`User`���`users`��֮��ӳ���`UserMapper`��д���£�

```
public interface UserMapper {
	@Select("SELECT * FROM users WHERE id = #{id}")
	User getById(@Param("id") long id);
}

```

ע�⣺�����Mapper����`JdbcTemplate`��`RowMapper`�ĸ�����Ƕ������`users`��Ľӿڷ������������Ƕ�����һ��`User getById(long)`��������ѯ����������Ҫ����ӿڷ���������Ҫ��ȷд����ѯ��SQL��������ע��`@Select`��ǡ�SQL�����κβ��������뷽�����������ƶ�Ӧ�����磬��������id������ͨ��ע��`@Param()`���Ϊ`id`����SQL����ｫ���滻��ռλ������`#{id}`��

����ж����������ôÿ������������ֱ����SQL��д����Ӧ��ռλ�����ɣ�

```
@Select("SELECT * FROM users LIMIT #{offset}, #{maxResults}")
List<User> getAll(@Param("offset") int offset, @Param("maxResults") int maxResults);

```

ע�⣺MyBatisִ�в�ѯ�󣬽����ݷ����ķ��������Զ���ResultSet��ÿһ��ת��ΪUserʵ����ת������Ȼ�ǰ���������������Ӧ�������������������ͬ����򵥵ķ�ʽ�Ǳ�дSELECT���ı�����

```
-- ������created_time����������createdAt:
SELECT id, name, email, created_time AS createdAt FROM users

```

ִ��INSERT������΢�鷳�㣬��Ϊ����ϣ������Userʵ������ˣ�����ķ����ӿ���`@Insert`ע�����£�

```
@Insert("INSERT INTO users (email, password, name, createdAt) VALUES (#{user.email}, #{user.password}, #{user.name}, #{user.createdAt})")
void insert(@Param("user") User user);

```

������������Ĳ���������`user`������������User�࣬��SQL�����õ�ʱ����`#{obj.property}`�ķ�ʽдռλ������Hibernate������ȫ�Զ���ORM��ȣ�MyBatis����д��������INSERT��䡣

���`users`���`id`��������������ô��������SQL�в�����`id`����ϣ����ȡ��������������Ҫ�ټ�һ��`@Options`ע�⣺

```
@Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
@Insert("INSERT INTO users (email, password, name, createdAt) VALUES (#{user.email}, #{user.password}, #{user.name}, #{user.createdAt})")
void insert(@Param("user") User user);

```

`keyProperty`��`keyColumn`�ֱ�ָ��JavaBean�����Ժ����ݿ������������

ִ��`UPDATE`��`DELETE`�����ԱȽϼ򵥣����Ƕ��巽�����£�

```
@Update("UPDATE users SET name = #{user.name}, createdAt = #{user.createdAt} WHERE id = #{user.id}")
void update(@Param("user") User user);

@Delete("DELETE FROM users WHERE id = #{id}")
void deleteById(@Param("id") long id);

```

����`UserMapper`�ӿڣ�����Ҫ��Ӧ��ʵ�����������ִ����Щ���ݿ�����ķ�������Ȼ�����Լ�дʵ���࣬�����ǳ��˱�д`UserMapper`�ӿ��⣬����`BookMapper`��`BonusMapper`����һ��һ��д̫�鷳����ˣ�MyBatis�ṩ��һ��`MapperFactoryBean`���Զ���������Mapper��ʵ���ࡣ������һ���򵥵�ע������������

```
@MapperScan("com.itranswarp.learnjava.mapper")
...����ע��...
public class AppConfig {
    ...
}

```

����`@MapperScan`���Ϳ�����MyBatis�Զ�ɨ��ָ����������Mapper������ʵ���ࡣ��������ҵ���߼��У����ǿ���ֱ��ע�룺

```
@Component
@Transactional
public class UserService {
    // ע��UserMapper:
    @Autowired
    UserMapper userMapper;

    public User getUserById(long id) {
        // ����Mapper����:
        User user = userMapper.getById(id);
        if (user == null) {
            throw new RuntimeException("User not found by id.");
        }
        return user;
    }
}

```

�ɼ���ҵ���߼���Ҫ����ͨ��`XxxMapper`��������ݿⷽ�����������ݿ⡣

### XML����

������Spring�м���MyBatis�ķ�ʽ������ֻ��Ҫ�õ�ע�⣬��û���κ�XML�����ļ���MyBatisҲ����ʹ��XML����ӳ���ϵ��SQL��䣬���磬����`User`ʱ��������ֵ���춯̬SQL��

```
<update id="updateUser">
  UPDATE users SET
  <set>
    <if test="user.name != null"> name = #{user.name} </if>
    <if test="user.hobby != null"> hobby = #{user.hobby} </if>
    <if test="user.summary != null"> summary = #{user.summary} </if>
  </set>
  WHERE id = #{user.id}
</update>

```

��дXML���õ��ŵ��ǿ�����װ����̬SQL�����Ұ�����SQL����������һ��ȱ������������̫���������÷���ʱ�����鿴SQL����Ҫ��λ��XML�����С��������ǲ�����XML�����÷�ʽ����Ҫ�˽��ͯЬ�������Ķ�[�ٷ��ĵ�](https://mybatis.org/mybatis-3/zh/configuration.html)��

ʹ��MyBatis��������������SQL����Ҫȫ����д���ŵ���ִ�е�SQL���������Լ�д��SQL����SQL�����Ż��ǳ��򵥣�Ҳ���Ա�д���⸴�ӵ�SQL������ʹ�����ݿ���ض��﷨�����л����ݿ���ܾͲ�̫���ס�����Ϣ�Ǵ󲿷���Ŀ��û���л����ݿ��������ȫ�������ĳ�����ݿ��д�������Ż���SQL��

# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html
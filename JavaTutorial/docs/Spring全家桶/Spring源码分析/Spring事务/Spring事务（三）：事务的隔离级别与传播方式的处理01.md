����һƪ���µ���������ᵽ�����ִ���� `TransactionAspectSupport#invokeWithinTransaction` �����У����Ľ����������������̽�� spring ��������ơ�

ע��������̽�ֵ����ݿ��� `mysql`���������ݿ���ܻ��������졣

### 1. ������ظ���

����ʽ��������Դ��ǰ��һЩǰ��֪ʶ����Ҫ�˽�һ�µģ�������Ҫ������ spring ��ص�������

#### 1.1 ����ĸ��뼶��

�������Ĵ����� `ACID`���о����£�

- ԭ���ԣ�`Atomicity`��
- һ���ԣ�`Consistency`��
- �����ԣ�`Isolation`��
- �־��ԣ�`Durability`��

������ĸ��뼶�����ǶԸ����ԣ�`Isolation`���Ľ�һ�����֣���Щ���뼶�����£�

- `��δ�ύ`
- `���ύ`
- `���ظ���`
- `���л�`

������Щ����Ĳ������������������ص㻹�ǹ�ע spring ��ص����ݣ�spring ��������뼶��Ķ����� `org.springframework.transaction.annotation.Isolation` �У��������£�

```
public enum Isolation {

    /**
    * Ĭ��ֵ�������ø��뼶������ʹ�õ������ݿ����õĸ��뼶��
    */
    DEFAULT(TransactionDefinition.ISOLATION_DEFAULT),

    /**
    * ��δ�ύ
    */
    READ_UNCOMMITTED(TransactionDefinition.ISOLATION_READ_UNCOMMITTED),

    /**
    * ���ύ
    */
    READ_COMMITTED(TransactionDefinition.ISOLATION_READ_COMMITTED),

    /**
    * ���ظ���
    */
    REPEATABLE_READ(TransactionDefinition.ISOLATION_REPEATABLE_READ),

    /**
    * ���л�
    */
    SERIALIZABLE(TransactionDefinition.ISOLATION_SERIALIZABLE);

    ...
}
```

���ǿ���ʹ�� `@Transactional` ע��� `isolation` �����ø��뼶��

#### 1.2 ����ĳ�ʱʱ��

- ���Ը�����ָ��һ��ִ��ʱ�䣬���ִ�����ĵ�ʱ�䳬����ָ��ʱ�䣬����ͻ��׳��쳣�Ӷ��ع�
- ������ `@Transactional` ע��� `timeout` �����ó�ʱʱ��

#### 1.3 ֻ������

- ���Խ���������Ϊ`ֻ��ģʽ`�������ƽʱ�û���û�õ����鵽һЩ����˵������������Ϊ`ֻ��ģʽ`�����������еĸ���ֻ�����񿴲�������ֻ�������в�����д��������ʵ���д���֤
- ���ǿ���ʹ�� `@Transactional` ע��� `readOnly` ������ֻ��ģʽ

#### 1.4 ����Ĵ�������

��������һ�������`����A` ��`��ʽB` ��������������`����B` �е���`����A`�������`����A` ִ����ɺ�`����B` �����ˣ�����ʾ�����£�

```
class A {
    // ����������
    @Transactional
    public void methdA() {
        // ����һЩ����
        ...
    }
}

class B {
    // ����������
    @Transactional
    public void methodB() {
        // 1. ����һЩ����
        ...
        // 2. ���� methodA()
        a.methodA();
        // 3. ���ﱨ����
        throw new RuntimeException();
    }
}
```

���ڿ���������`����B` ��һ����ع��ģ���ô`����A` Ҫ��Ҫ�ع��أ�

- ������ǰ�`����A` ��`����B` �����񿴳���ͬһ������`����A` Ӧ��Ҳ��Ҫ�ع���
- ������ǰ�`����A` ��`����B` ������������������������ִ�У�`����A` ��ִ����`����B` �ı����޹أ�`����A` �Ͳ�Ӧ�ûع�

Ϊ�˴������־��ף�spring ������`����Ĵ�������`�ĸ�����ǿ���ʹ�� `@Transactional` ע��� `propagation` ������ֻ��ģʽ��

```
public @interface Transactional {
    ...

    // Ĭ�ϵļ���Ϊ Propagation.REQUIRED
    Propagation propagation() default Propagation.REQUIRED;

}
```

spring һ�������� 7 ������Ĵ������ͣ��о����£�

| ���񴫲���Ϊ                | ����                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `PROPAGATION_REQUIRED`      | ��Ĭ��ֵ�����衿��ǰ�������������������У������ǰ�߳���û����������һ���µ����������ǰ�߳����Ѿ����������򷽷������ڸ����������С� |
| `PROPAGATION_MANDATORY`     | ��ǿ�ơ���ǰ�������������������У������ǰ�߳��в�����������**�׳��쳣** |
| `PROPAGATION_SUPPORTS`      | ��֧�֡���ǰ������������ʱ����Ҫ���񣬵������ǰ�߳��д�������ʱ�������������������� |
| `PROPAGATION_REQUIRES_NEW`  | �������񡿵�ǰ���������ڶ��������������У������ǰ�߳����Ѿ����������򽫸�����������¿���һ������ֱ���������н����ٻָ�֮ǰ������ |
| `PROPAGATION_NESTED`        | ��Ƕ�ס���ǰ�������������������У������ǰ�߳��д��������򽫸������ע**�����**���γ�Ƕ������Ƕ�������е�����������쳣����Ӱ�쵽�����񱣴��֮ǰ�Ĳ����� |
| `PROPAGATION_NOT_SUPPORTED` | ����֧�֡���ǰ�������������������У������ǰ�߳��д����������������ֱ���������н��� |
| `PROPAGATION_NEVER`         | ����������ǰ���������������������У������ǰ�߳��д���������**�׳��쳣** |

ע������������͵�����

1. `PROPAGATION_REQUIRED` �� `PROPAGATION_MANDATORY`
    - `PROPAGATION_REQUIRED`������Ҫ�����������У�û�������**����������**
    - `PROPAGATION_MANDATORY`������Ҫ�����������У�û�������**���쳣**
2. `PROPAGATION_NOT_SUPPORTED` �� `PROPAGATION_NEVER`
    - `PROPAGATION_NOT_SUPPORTED`�����������������У��������**��������**
    - `PROPAGATION_NEVER`�����������������У��������**���쳣**
3. `PROPAGATION_REQUIRES_NEW` �� `PROPAGATION_NESTED`
    - `PROPAGATION_REQUIRES_NEW`��������ִ����ɺ󣬾����񱨴�ֻ�ع������������񲻻ع���������ִ�б����¾�����һ��ع�
    - `PROPAGATION_NESTED`��������ִ����ɺ󣬸����񱨴��ع�������㣻������ִ�б���Ҳ�ǻع��������

### 2. demo ׼��

��ȷ�����ϸ���󣬽������Ϳ�ʼ�����ˣ�������׼�����򵥵� demo��

����׼��һЩ���ã�

```
@Configuration
@ComponentScan("org.springframework.learn.tx.demo03")
@EnableTransactionManagement(proxyTargetClass = true)
public class TxDemo03Config {

    /**
     * ��������Դ
     */
    @Bean
    public DataSource dataSource() throws Exception {
        Driver driver = new com.mysql.jdbc.Driver();
        String url = "jdbc:mysql://localhost:3306/test";
        String username = "root";
        String password = "123";
        return new SimpleDriverDataSource(driver, url, username, password);
    }

    /**
     * ����jdbcTemplate�������������������������ݿ�Ĳ���
     */
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }

    /**
     * ���������
     */
    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

}
```

�����ϴ���˵�����£�

- ����Դ��ʹ�õ��� spring �ṩ�� `SimpleDriverDataSource`���������Դ���ܲ��࣬�ʺ�����򵥵� demo
- ���� jdbc ��ز�����Ҳ��ʹ�� spring �ṩ�� `jdbcTemplate`����Ϊһ���򵥵� demo���������� `mybatis`��`jpa` ��
- �����������ʹ�õ�Ҳ�� spring �ṩ�� `DataSourceTransactionManager` ���Ե�����Դ��˵�������ȫ������

׼��һ�� mysql �Ĳ�����Ҫ��������

```
@Service
public class UserService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * ���ݿ���������ʹ�� @Transactional ��������
     */
    @Transactional(rollbackFor = Exception.class)
    public int insert() {
        String sql = "insert into `user`(`login_name`, `nick`, `create_time`, `update_time`)" 
                + "values (?, ?, ?, ?)";
        int result = jdbcTemplate.update(sql, "test", "test", new Date(), new Date());
        if(true) {
            //throw new RuntimeException("�׳����쳣");
        }
        System.out.println(result);
        return result;
    }

}
```

��������ࣺ

```
public class TxDemo03Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext
                = new AnnotationConfigApplicationContext(TxDemo03Config.class);
        UserService userService = applicationContext.getBean(UserService.class);
        userService.insert();

    }
}
```

��� demo ʮ�ּ򵥣��Ͳ����������ˣ����ǽ�������ͨ����� demo ����һЩ���Ȳ�����̽���� spring ������ĸ��뼶�𡢴�����ʽ�Ĵ���

### 3. `TransactionAspectSupport#invokeWithinTransaction`

����һ��ƪ���Ǿ�˵��������Ĵ����� `TransactionAspectSupport#invokeWithinTransaction` ���������������ǽ��ص�������������

�ϴ��룺

```
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
        final InvocationCallback invocation) throws Throwable {
    TransactionAttributeSource tas = getTransactionAttributeSource();

    // 1. ��ȡ @Transactional ����������
    final TransactionAttribute txAttr = (tas != null 
            ? tas.getTransactionAttribute(method, targetClass) : null);

    // 2. ��ȡ�����������IOC�����л�ȡ��
    final TransactionManager tm = determineTransactionManager(txAttr);

    // �ⲿ�ֵĴ�������� TransactionManager �� ReactiveTransactionManager ���������������
    ...

    // 3. �� TransactionManager ת��Ϊ PlatformTransactionManager
    PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
    // 4. ��ȡ������ȫ�޶�������ʽΪ��"����.����.������"
    final String joinpointIdentification 
            = methodIdentification(method, targetClass, txAttr);
    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
        // 5. ��ȡ������Ϣ���������￪������
        TransactionInfo txInfo = createTransactionIfNecessary(
                ptm, txAttr, joinpointIdentification);
        Object retVal;
        try {
            // 6. ִ�о����ҵ��
            retVal = invocation.proceedWithInvocation();
        }
        catch (Throwable ex) {
            // 7. �쳣�ع�
            completeTransactionAfterThrowing(txInfo, ex);
            throw ex;
        }
        finally {
            // 8. ����������Ϣ�����ǽ�������Ϣ����Ϊ�ɵ�
            cleanupTransactionInfo(txInfo);
        }

        if (vavrPresent && VavrDelegate.isVavrTry(retVal)) {
            TransactionStatus status = txInfo.getTransactionStatus();
            if (status != null && txAttr != null) {
                retVal = VavrDelegate.evaluateTryFailure(retVal, txAttr, status);
            }
        }
        // 9. �ύ����
        commitTransactionAfterReturning(txInfo);
        return retVal;
    }
    else {
        // ���� CallbackPreferringPlatformTransactionManager ���͵� TransactionManager����������
        ...
    }
}
```

�� `TransactionAspectSupport#invokeWithinTransaction` ���������ݣ�ע��������ϸ˵����������Ϊ������������Щִ�й��̡�

#### 3.1 ��ȡ `@Transactional` ����������

������ǻ�ȡ `UserService#insert` �����ϱ�ǵ� `@Transactional` ���������ã��õ��Ľ�����£�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-aefbe56da2db53982f73092a191e587fcc8.png)

#### 3.2 ��ȡ���������

��ȡ����������ķ���Ϊ `TransactionAspectSupport#determineTransactionManager`��ֱ�ӿ����룺

```
protected TransactionManager determineTransactionManager(@Nullable TransactionAttribute txAttr) {
    if (txAttr == null || this.beanFactory == null) {
        return getTransactionManager();
    }

    // ����� @Transaction ע����ָ����������������ʹ�spring�����л�ȡ������������
    String qualifier = txAttr.getQualifier();
    if (StringUtils.hasText(qualifier)) {
        return determineQualifiedTransactionManager(this.beanFactory, qualifier);
    }
    // ָ��������������ƣ�����Ҳ�Ǵ�spring�����л�ȡ
    else if (StringUtils.hasText(this.transactionManagerBeanName)) {
        return determineQualifiedTransactionManager(
            this.beanFactory, this.transactionManagerBeanName);
    }
    else {
        // ָ���������������ֱ�ӷ���
        TransactionManager defaultTransactionManager = getTransactionManager();
        if (defaultTransactionManager == null) {
            // �ӻ����л�ȡĬ�ϵ�
            defaultTransactionManager = this.transactionManagerCache
                    .get(DEFAULT_TRANSACTION_MANAGER_KEY);
            if (defaultTransactionManager == null) {
                // �������ʹ� spring �����л�ȡһ�����������
                defaultTransactionManager = this.beanFactory.getBean(TransactionManager.class);
                this.transactionManagerCache.putIfAbsent(
                        DEFAULT_TRANSACTION_MANAGER_KEY, defaultTransactionManager);
            }
        }
        return defaultTransactionManager;
    }
}
```

������Ȼ�е㳤�����߼��ǳ�����������Ը÷����������ܽ����£�

1. ����� `@Transaction` ע����ָ����������������ʹ� spring �����л�ȡ�����������
2. ���ָ��������������ƣ��ʹ� spring �����л�ȡ�����������
3. ���ָ���������������ֱ�ӷ���
4. ���϶������㣬ֱ�Ӵ� spring �����л�ȡ����Ϊ `TransactionManager` �� bean

�� `TxDemo03Config` �У������������������Ϊ `DataSourceTransactionManager`��

```
public DataSourceTransactionManager transactionManager(DataSource dataSource) {
    return new DataSourceTransactionManager(dataSource);
}
```

����õ���Ҳ�� `DataSourceTransactionManager`��

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-34ac74501b184c44f95432b31b21a041619.png)

#### 3.3 �� `TransactionManager` ת��Ϊ `PlatformTransactionManager`

���ûɶ��˵�ģ�`DataSourceTransactionManager` ���� `PlatformTransactionManager` �����࣬����������һ������ת����

```
private PlatformTransactionManager asPlatformTransactionManager(
        @Nullable Object transactionManager) {
    if (transactionManager == null || transactionManager instanceof PlatformTransactionManager) {
        return (PlatformTransactionManager) transactionManager;
    } else {
        // �׸��쳣
        ...
    }
}
```

#### 3.4 ��ȡ������ȫ�޶���

��һ�����õ�������ȫ�޶�������ʽΪ��"���������͡�������"����Ҳûɶ��˵�ģ���һ���õ��Ľ�����£�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-656a73b9eb1cd3120d3586fe4f1302de373.png)

����ƪ�������ľ��ȷ����������ˣ���ƪ���Ǽ�����

------

*����ԭ�����ӣ�https://my.oschina.net/funcy/blog/4773459 ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������*
�����ǡ�����ĸ��뼶���봫����ʽ�Ĵ��������ĵ� 2 ƪ�������ģ����Ǽ�����

#### 3.5 ��ȡ������Ϣ

�������Ϣ���� `TransactionAspectSupport#createTransactionIfNecessary` �����л�ȡ����������ǳ���Ҫ��ǰ����ܸ��뼶�𡢴�����ʽ��������������ﴦ���÷����������£�

```
protected TransactionInfo createTransactionIfNecessary(@Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, final String joinpointIdentification) {
    // ���δָ�����ƣ��򽫷�����������������
    if (txAttr != null && txAttr.getName() == null) {
        txAttr = new DelegatingTransactionAttribute(txAttr) {
            @Override
            public String getName() {
                return joinpointIdentification;
            }
        };
    }

    TransactionStatus status = null;
    if (txAttr != null) {
        if (tm != null) {
            // ��ȡ����״̬�������ǰû�����񣬿��ܻᴴ������
            status = tm.getTransaction(txAttr);
        }
    }
    // ׼��������Ϣ�����ǽ�ǰ��õ�����Ϣ��װ�� TransactionInfo
    return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
}

```

���������Ҫ������������

1.  ��ȡ����״̬
2.  ׼��������Ϣ

�������»�ȡ����״̬�����̣�����Ϊ `AbstractPlatformTransactionManager#getTransaction`��

```
public final TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
        throws TransactionException {

    TransactionDefinition def = (definition != null ? 
            definition : TransactionDefinition.withDefaults());

    // ��ȡ�������
    Object transaction = doGetTransaction();
    boolean debugEnabled = logger.isDebugEnabled();

    // �Ƿ�������񣬴����򷵻�
    if (isExistingTransaction(transaction)) {
        return handleExistingTransaction(def, transaction, debugEnabled);
    }
    // ���е������������ǰû������

    // ��鳬ʱʱ��������Ƿ����
    if (def.getTimeout() < TransactionDefinition.TIMEOUT_DEFAULT) {
        throw new InvalidTimeoutException("Invalid transaction timeout", def.getTimeout());
    }

    // PROPAGATION_MANDATORY�����������������У�����û������ֱ�����쳣
    // No existing transaction found -> check propagation behavior to find out how to proceed.
    if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {
        throw new IllegalTransactionStateException(...);
    }
    // ����ǰ���񣬴���������
    else if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRED ||
            def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW ||
            def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
        // suspend(...) ����null�������ͬ�����������ͬ�����񣬷���ʲôҲ����
        SuspendedResourcesHolder suspendedResources = suspend(null);
        try {
            boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
            // �����������
            DefaultTransactionStatus status = newTransactionStatus(
                    def, transaction, true, newSynchronization, debugEnabled, suspendedResources);
            // ��������
            doBegin(transaction, def);
            // ���� TransactionSynchronizationManager ������
            prepareSynchronization(status, def);
            return status;
        }
        catch (RuntimeException | Error ex) {
            resume(null, suspendedResources);
            throw ex;
        }
    }
    else {
        boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
        return prepareTransactionStatus(def, null, true, newSynchronization, debugEnabled, null);
    }
}

```

��������е㳤����������������

##### 1. `doGetTransaction(...)`����ȡ�������

��ȡ�������ķ���Ϊ `DataSourceTransactionManager#doGetTransaction`��

```
protected Object doGetTransaction() {
    DataSourceTransactionObject txObject = new DataSourceTransactionObject();
    txObject.setSavepointAllowed(isNestedTransactionAllowed());
    // ��ȡ������Ϣ��obtainDataSource()����ȡ����Դ
    ConnectionHolder conHolder = 
            (ConnectionHolder) TransactionSynchronizationManager.getResource(obtainDataSource());
    txObject.setConnectionHolder(conHolder, false);
    return txObject;
}

```

����������������

1.  ��ȡ����Դ
2.  ��ȡ `ConnectionHolder`

����������������Դ����λ�ȡ�ģ�

```
public class DataSourceTransactionManager extends AbstractPlatformTransactionManager
        implements ResourceTransactionManager, InitializingBean {

    @Nullable
    private DataSource dataSource;

    /**
     * ���췽������������Դ
     */
    public DataSourceTransactionManager(DataSource dataSource) {
        this();
        setDataSource(dataSource);
        afterPropertiesSet();
    }

    /**
     * ��������Դ
     */
    public void setDataSource(@Nullable DataSource dataSource) {
        if (dataSource instanceof TransactionAwareDataSourceProxy) {
            this.dataSource = ((TransactionAwareDataSourceProxy) dataSource)
                    .getTargetDataSource();
        }
        else {
            this.dataSource = dataSource;
        }
    }

    @Nullable
    public DataSource getDataSource() {
        return this.dataSource;
    }

    /**
     * ��ȡ����Դ
     */
    protected DataSource obtainDataSource() {
        DataSource dataSource = getDataSource();
        Assert.state(dataSource != null, "No DataSource set");
        return dataSource;
    }

    ...
}

```

`obtainDataSource()` ʵ�����ǵ����� `getDataSource()` ���������ص��� `dataSource` ��Ա�������� `dataSource` ������ `DataSourceTransactionManager` �Ĺ��췽���ﴫ��ģ���ˣ��õ��Ľ����ǣ������ȡ������Դ�������������� `DataSourceTransactionManager` ʱ����ģ�

```
@Configuration
public class TxDemo03Config {

    /**
     * ��������Դ
     * @return
     * @throws Exception
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
     * ���������
     * @param dataSource
     * @return
     */
    @Bean
    public DataSourceTransactionManager transactionManager(DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    ...

}

```

���������Դ������ `SimpleDriverDataSource`.

������������ `ConnectionHolder` �Ļ�ȡ���÷���Ϊ `TransactionSynchronizationManager#getResource` ���������£�

```
// �� ThreadLocal �����  ConnectionHolder ��Ϣ
private static final ThreadLocal<Map<Object, Object>> resources =
        new NamedThreadLocal<>("Transactional resources");

/**
 * ��ȡ ConnectionHolder
 */
public static Object getResource(Object key) {
    // ��װ�´���� key
    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);
    // �������ȡ������Ϣ
    Object value = doGetResource(actualKey);
    return value;
}

/**
 * ����Ļ�ȡ����
 */
private static Object doGetResource(Object actualKey) {
    // ��ThreadLocal�л�ȡ
    Map<Object, Object> map = resources.get();
    if (map == null) {
        return null;
    }
    Object value = map.get(actualKey);
    if (value instanceof ResourceHolder && ((ResourceHolder) value).isVoid()) {
        map.remove(actualKey);
        if (map.isEmpty()) {
            resources.remove();
        }
        value = null;
    }
    return value;
}

```

�Ӵ���������`TransactionSynchronizationManager` ����һ�� `ThreadLocal` ��ʵ�������д����һ�� `Map`���� `Map` �� `key` Ϊ `datasource`��`value` Ϊ `ConnectionHolder`.

��ô��� `ConnectionHolder` ��ʲô�أ����Լ򵥵ؽ������Ϊ `Connection`(���ݿ�����) �İ�װ�࣬��������Ҫ�����Ծ��� `Connection` �ˣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d8c4ae3884177f485fbb95d1828fdb39ae2.png)

���ˣ�������Ͱ� `doGetTransaction(xxx)` �����������ˣ�������������������صĽ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0944429e31a6c0b67e121674202dd5ec0fd.png)

##### 2. `isExistingTransaction(...)`���Ƿ��������

��ȡ��������� `DataSourceTransactionObject` �󣬽����������ж��Ƿ���������ˣ��жϷ����� `DataSourceTransactionManager#isExistingTransaction`���������£�

```
protected boolean isExistingTransaction(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    return (txObject.hasConnectionHolder() 
            && txObject.getConnectionHolder().isTransactionActive());
}

```

`ConnectionHolder` ����һ����Ա���� `transactionActive`����������ǰ `ConnectionHolder` �������Ƿ��ڼ���״̬��`isExistingTransaction(...)` ������Ҫ�Ǹ��������жϵ�ǰ��������Ƿ��������ġ�

##### 3\. �����Ѵ��ڵ�����`handleExistingTransaction(...)`

�������������������ǰ��������spring ����ô����ģ������Ѵ�������ķ���Ϊ `AbstractPlatformTransactionManager#handleExistingTransaction`���������£�

```
private TransactionStatus handleExistingTransaction(TransactionDefinition definition, 
        Object transaction, boolean debugEnabled) throws TransactionException {
    // ��������ʽΪ����ʹ������ʱ���׳��쳣
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NEVER) {
        throw new IllegalTransactionStateException(
                "Existing transaction found for transaction marked with propagation 'never'");
    }
    // ��������ʽΪ����֧������ʱ������ǰ����Ȼ�����������״̬������
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NOT_SUPPORTED) {
        // 1\. suspend()�������������
        Object suspendedResources = suspend(transaction);
        boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
        return prepareTransactionStatus(
                definition, null, false, newSynchronization, debugEnabled, suspendedResources);
    }

    // ��������ʽΪ�����µ����������С�ʱ������ǰ����Ȼ�������µ�����
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW) {
        // �����������
        SuspendedResourcesHolder suspendedResources = suspend(transaction);
        try {
            boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
            DefaultTransactionStatus status = newTransactionStatus(definition, transaction, true,
                    newSynchronization, debugEnabled, suspendedResources);
            // 2\. doBegin()�������µ�����
            doBegin(transaction, definition);
            prepareSynchronization(status, definition);
            return status;
        }
        catch (RuntimeException | Error beginEx) {
            resumeAfterBeginException(transaction, suspendedResources, beginEx);
            throw beginEx;
        }
    }

    // ��������ʽΪ��Ƕ��ִ�С�ʱ�� ��������ı����
    // �������񣬽��������ע����㣬�γ�Ƕ������
    // Ƕ�������е�����������쳣����Ӱ�쵽�����񱣴��֮ǰ�Ĳ�����
    if (definition.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
        if (!isNestedTransactionAllowed()) {
            throw new NestedTransactionNotSupportedException(...);
        }
        // 3\. createAndHoldSavepoint(...)����������㣬�ع�ʱֻ�ع����ñ����
        if (useSavepointForNestedTransaction()) {
            DefaultTransactionStatus status = prepareTransactionStatus(definition, transaction,
                    false, false, debugEnabled, null);
            status.createAndHoldSavepoint();
            return status;
        }
        else {
            boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
            DefaultTransactionStatus status = newTransactionStatus(
                    definition, transaction, true, newSynchronization, debugEnabled, null);
            // �����֧�ֱ���㣬�������µ�����
            doBegin(transaction, definition);
            prepareSynchronization(status, definition);
            return status;
        }
    }
    if (isValidateExistingTransaction()) {
        // ������֤��������������
        ...
    }
    boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
    return prepareTransactionStatus(definition, transaction, false, 
            newSynchronization, debugEnabled, null);
}

```

���Կ��������������ʹ���������ĸ��뼶����߼�����صĴ����Ѿ�����ע�ͣ�����Ͳ���˵�ˣ����������м���������Ҫ�ر������

1.  `suspend()`�������������
2.  `doBegin()`�������µ�����
3.  `createAndHoldSavepoint(...)`����������㣬�ع�ʱֻ�ع����ñ����

�⼸���������������������������������ͳһ������

##### 4\. ���� `AbstractPlatformTransactionManager#getTransaction`

�������ٻص� `AbstractPlatformTransactionManager#getTransaction` ����������ʣ�µ����̣�

```
public final TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
        throws TransactionException {

    // ǰ���Ѿ��������ˣ�ʡ��
    ...

    // ���е������������ǰû������

    // ��鳬ʱʱ��������Ƿ����
    if (def.getTimeout() < TransactionDefinition.TIMEOUT_DEFAULT) {
        throw new InvalidTimeoutException("Invalid transaction timeout", def.getTimeout());
    }

    // PROPAGATION_MANDATORY�����������������У�����û������ֱ�����쳣
    if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_MANDATORY) {
        throw new IllegalTransactionStateException(...);
    }
    // ����ǰ���񣬴���������
    else if (def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRED ||
            def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_REQUIRES_NEW ||
            def.getPropagationBehavior() == TransactionDefinition.PROPAGATION_NESTED) {
        // suspend(...) ����null�������ͬ�����������ͬ�����񣬷���ʲôҲ����
        SuspendedResourcesHolder suspendedResources = suspend(null);
        try {
            boolean newSynchronization = (getTransactionSynchronization() != SYNCHRONIZATION_NEVER);
            // �����������
            DefaultTransactionStatus status = newTransactionStatus(
                    def, transaction, true, newSynchronization, debugEnabled, suspendedResources);
            // ��������
            doBegin(transaction, def);
            // ���� TransactionSynchronizationManager ������
            prepareSynchronization(status, def);
            return status;
        }
        catch (RuntimeException | Error ex) {
            resume(null, suspendedResources);
            throw ex;
        }
    }
    else {
        boolean newSynchronization = (getTransactionSynchronization() == SYNCHRONIZATION_ALWAYS);
        return prepareTransactionStatus(def, null, true, newSynchronization, debugEnabled, null);
    }
}

```

`handleExistingTransaction(...)` �����Ĺ�����**���������ʱ����Щ����������Ҫ��ô����**��`getTransaction(...)` �������²��ֵĹ����ǣ�**���������ʱ����Щ������������Ҫ��ô����**�����Կ�������������Ȼ������ `suspend(...)`��`doBegin(...)` �ȷ�������Щ����������һ��Ҳͳһ������

##### 5\. ׼�����ؽ����`prepareTransactionStatus(...)`

`handleExistingTransaction(...)` ������ `getTransaction(...)` �����ڴ����ؽ��ʱ����ʹ���� `prepareTransactionStatus(...)` ������

```
// `handleExistingTransaction(...)`����
return prepareTransactionStatus(definition, transaction, false, 
            newSynchronization, debugEnabled, null);

// `getTransaction(...)`����
return prepareTransactionStatus(def, null, true, newSynchronization, debugEnabled, null);

```

�������������������������ɶ������ `AbstractPlatformTransactionManager#prepareTransactionStatus`��

```
protected final DefaultTransactionStatus prepareTransactionStatus(
        TransactionDefinition definition, @Nullable Object transaction, boolean newTransaction,
        boolean newSynchronization, boolean debug, @Nullable Object suspendedResources) {

    // ������һ�� DefaultTransactionStatus ����
    DefaultTransactionStatus status = newTransactionStatus(
            definition, transaction, newTransaction, newSynchronization, debug, suspendedResources);
    // ׼�� Synchronization
    prepareSynchronization(status, definition);
    return status;
}

/**
 *����һ�� TransactionStatus ʵ��
 */
protected DefaultTransactionStatus newTransactionStatus(
        TransactionDefinition definition, @Nullable Object transaction, boolean newTransaction,
        boolean newSynchronization, boolean debug, @Nullable Object suspendedResources) {

    boolean actualNewSynchronization = newSynchronization &&
            !TransactionSynchronizationManager.isSynchronizationActive();
    // ���� DefaultTransactionStatus �Ĺ��췽��
    return new DefaultTransactionStatus(
            transaction, newTransaction, actualNewSynchronization,
            definition.isReadOnly(), debug, suspendedResources);
}

```

�������������Ҫ����Ϊ�˴��� `DefaultTransactionStatus` ����������������һ�������н����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a491ee7ca22238b2d9c698c55ae9dd6d005.png)

##### 6\. ׼��������Ϣ��`TransactionAspectSupport#prepareTransactionInfo`

�ص� `TransactionAspectSupport#createTransactionIfNecessary` ������

```
protected TransactionInfo createTransactionIfNecessary(@Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, final String joinpointIdentification) {
    ...
    TransactionStatus status = null;
    if (txAttr != null) {
        if (tm != null) {
            // ��ȡ����״̬�������ǰû�����񣬿��ܻᴴ������
            status = tm.getTransaction(txAttr);
        }
    }
    // ׼��������Ϣ�����ǽ�ǰ��õ�����Ϣ��װ�� TransactionInfo
    return prepareTransactionInfo(tm, txAttr, joinpointIdentification, status);
}

```

ǰ���������ô�ֻ࣬�ǵõ��� `TransactionStatus`�������ٽ���������������׼��������Ϣ�ķ��� `prepareTransactionInfo(...)`��

```
protected TransactionInfo prepareTransactionInfo(@Nullable PlatformTransactionManager tm,
        @Nullable TransactionAttribute txAttr, String joinpointIdentification,
        @Nullable TransactionStatus status) {
    TransactionInfo txInfo = new TransactionInfo(tm, txAttr, joinpointIdentification);

    if (txAttr != null) {
        txInfo.newTransactionStatus(status);
    }

    // ʡ��log�Ĵ�ӡ
    ...

    // ���̰߳�
    txInfo.bindToThread();
    return txInfo;
}

```

�ţ�ͬ `prepareTransactionStatus(...)` ���ƣ��������Ҳ�Ǵ�����һ�� `TransactionInfo` ���󣬲��ҽ� `TransactionInfo` �뵱ǰ�̰߳󶨣��󶨵Ĵ������£�

```
public abstract class TransactionAspectSupport implements BeanFactoryAware, InitializingBean {

    // ��ŵ�ǰʹ�õ�������Ϣ
    private static final ThreadLocal<TransactionInfo> transactionInfoHolder =
            new NamedThreadLocal<>("Current aspect-driven transaction");

    // ����Ϊ�ɵ�������Ϣ
    protected void cleanupTransactionInfo(@Nullable TransactionInfo txInfo) {
        if (txInfo != null) {
            txInfo.restoreThreadLocalStatus();
        }
    }

    /**
     * TransactionInfo: ����������Ϣ
     */
    protected static final class TransactionInfo {

        // ��ǰ������״̬����
        @Nullable
        private TransactionStatus transactionStatus;

        // �ɵ�������Ϣ��Ҳ���ǹ����������Ϣ��
        @Nullable
        private TransactionInfo oldTransactionInfo;

        /**
         * ��������Ϣ�󶨵���ǰ�߳�
         */
        private void bindToThread() {
            // �õ��ɵ�������Ϣ
            this.oldTransactionInfo = transactionInfoHolder.get();
            // ���ó����µ�������Ϣ
            transactionInfoHolder.set(this);
        }

        /**
         * ������ɺ󣬻Ὣ�ɵ�������Ϣ�󶨵���ǰ�߳�
         */
        private void restoreThreadLocalStatus() {
            // ����Ϊ�ɵ�������Ϣ
            transactionInfoHolder.set(this.oldTransactionInfo);
        }

        ...
    }

}

```

`TransactionAspectSupport` ����һ�� `ThreadLocal`��������ŵ�ǰ�� `TransactionInfo` ���󣬽����̰߳�ʱ�������õ��ɵ�������Ϣ�������� `TransactionInfo` �ĳ�Ա���� `oldTransactionInfo` �У�Ȼ���µ� `TransactionInfo` ���� `ThreadLocal` �У�������ִ����ɺ󣬻�� `TransactionInfo` �ĳ�Ա���� `oldTransactionInfo` ���õ��ɵ�������Ϣ���ٽ��ɵ�������Ϣ���� `ThreadLocal` �У������������� "�� - �� - ��" ���л�.

��һ���õ��� `TransactionInfo` ���£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ab882613ce67ba3bf7afcbd2eab01c6cf27.png)

���� `TransactionInfo` �Ľṹ��������һЩ˵����

*   ������ `TransactionAspectSupport.TransactionInfo`���� `TransactionAspectSupport` ��һ���ڲ��࣬��װ�������һЩ��Ϣ
*   `transactionManager`: ����������������������õ� `DataSourceTransactionManager`
*   `transactionAttribute`: ��������ֵ���������� `@Transactional` ע�������ֵ
*   `joinpointIdentification`: ������ȫ�޶�������ʽΪ��"���������͡�������"��
*   `transactionStatus`: �������Ͽ����Ǽ�¼�����״̬��ʵ��������󲻽���¼�������״̬���������ش������£�
    *   `complete`: ��������״̬
    *   `connectionHolder`: ��ǰ���е����ݿ�����
    *   `suspendedResources`: ��������ݿ����ӣ�����Ҫ�ָ����������ʱ�������ܹ��ö����õ���������ݿ�����
*   `oldTransactionInfo`: ��һ������Ҳ���ǹ�������񣩵���Ϣ��ִ���굱ǰ����󣬻�ָ�����һ�������ִ��

һ��С����д����ô���ˣ����ľ��ȷ����������ˣ�`suspend(...)`��`doBegin(...)` �ȷ�����ƪ�ٷ����ɡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4947799](https://my.oschina.net/funcy/blog/4947799) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
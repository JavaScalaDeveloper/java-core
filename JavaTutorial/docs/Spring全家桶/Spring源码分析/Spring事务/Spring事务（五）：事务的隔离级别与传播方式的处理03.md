�����ǡ�����ĸ��뼶���봫����ʽ�Ĵ��������ĵ� 3 ƪ�������ģ����Ǽ�����

�����������ᵽ������Ŀ�����`doBegin(...)`��������`suspend(...)`���봴������㣨`createAndHoldSavepoint(...)`���Ĳ��������Ľ���������Щ������ʵ�֡�

### 1. `doBegin(...)`�������µ�����

����������ķ���Ϊ `DataSourceTransactionManager#doBegin`���������£�

```
protected void doBegin(Object transaction, TransactionDefinition definition) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    Connection con = null;

    try {
        // 1\. ��ȡ���ݿ�����
        if (!txObject.hasConnectionHolder() ||
                txObject.getConnectionHolder().isSynchronizedWithTransaction()) {
            // getConnection(): ��ȡ���ݿ����ӣ�obtainDataSource()����ȡ����Դ
            Connection newCon = obtainDataSource().getConnection();
            txObject.setConnectionHolder(new ConnectionHolder(newCon), true);
        }
        // ���ｫ synchronizedWithTransaction ����Ϊtrue
        txObject.getConnectionHolder().setSynchronizedWithTransaction(true);
        con = txObject.getConnectionHolder().getConnection();

        // 2\. ��������ĸ��뼶��

        Integer previousIsolationLevel 
                = DataSourceUtils.prepareConnectionForTransaction(con, definition);
        txObject.setPreviousIsolationLevel(previousIsolationLevel);
        // ����ֻ������
        txObject.setReadOnly(definition.isReadOnly());

        // 3\. ��������
        if (con.getAutoCommit()) {
            txObject.setMustRestoreAutoCommit(true);
            // �ر�������Զ��ύ��Ҳ���ǿ�������
            con.setAutoCommit(false);
        }
        // 4\. �����ֻ����������������
        prepareTransactionalConnection(con, definition);
        // ��������ļ�����
        txObject.getConnectionHolder().setTransactionActive(true);
        // 5\. ��������ĳ�ʱʱ��
        int timeout = determineTimeout(definition);
        if (timeout != TransactionDefinition.TIMEOUT_DEFAULT) {
            txObject.getConnectionHolder().setTimeoutInSeconds(timeout);
        }

        // 6\. ������Դ�����ӵ���ǰ�߳�
        if (txObject.isNewConnectionHolder()) {
            TransactionSynchronizationManager.bindResource(
                    obtainDataSource(), txObject.getConnectionHolder());
            }
        }
    } catch (Throwable ex) {
        // �����쳣�������������������رո�����
        if (txObject.isNewConnectionHolder()) {
            DataSourceUtils.releaseConnection(con, obtainDataSource());
            txObject.setConnectionHolder(null, false);
        }
        throw new CannotCreateTransactionException(...);
    }
}

```

���ϴ��뻹��ͦ�����ģ�ע��Ҳ����ȷ�ˣ�����Թؼ���������һ��������

#### 1.1 ��ȡ���ݿ�����

���ݿ����ӵĻ�ȡ���Ǻܼ򵥵ģ��������£�

```
Connection newCon = obtainDataSource().getConnection();

```

��ʵ���ǵ��� `javax.sql.DataSource#getConnection()` ������

#### 1.2 ��������ĸ��뼶��

�� `@Transactional` �У����ǿ���ʹ�� `isolation` ָ������ĸ��뼶��

```
public @interface Transactional {
    /**
     * ָ������ĸ��뼶��
     */
    Isolation isolation() default Isolation.DEFAULT;
    ...
}

```

�����ָ������ʹ��Ĭ�ϵĸ��뼶��Ҳ����ʹ�����ݿ����õġ�

spring ����������뼶��ķ���Ϊ `DataSourceUtils#prepareConnectionForTransaction`���������£�

```
public static Integer prepareConnectionForTransaction(Connection con, 
        @Nullable TransactionDefinition definition) throws SQLException {
    Assert.notNull(con, "No Connection specified");
    if (definition != null && definition.isReadOnly()) {
        try {
            // ����Ϊֻ��ģʽ
            con.setReadOnly(true);
        }
        catch (SQLException | RuntimeException ex) {
            ...
        }
    }

    Integer previousIsolationLevel = null;
    if (definition != null && definition.getIsolationLevel() 
            != TransactionDefinition.ISOLATION_DEFAULT) {
        int currentIsolation = con.getTransactionIsolation();
        if (currentIsolation != definition.getIsolationLevel()) {
            // �õ�֮ǰ�ĸ��뼶����������£���Ҫ����Ϊԭ���ĸ��뼶��
            previousIsolationLevel = currentIsolation;
            // �������������ݿ�ĸ��뼶�𣬵��õ��ǣ�
            // java.sql.Connection.setTransactionIsolation
            con.setTransactionIsolation(definition.getIsolationLevel());
        }
    }
    return previousIsolationLevel;
}

```

�� �������������������ã�

1.  ����Ϊֻ��ģʽ�����õ��� `java.sql.Connection#setReadOnly` ����
2.  ���ø��뼶�𣺵��õ��� `java.sql.Connection.setTransactionIsolation` ����

����ֻ��ģʽ��Ҳ�ǿ����� `@Transactional` �����õģ�

```
public @interface Transactional {
    /**
     * ����ֻ������
     */
    boolean readOnly() default false;
    ...
}

```

#### 1.3 ��������

�������ĵ�ʱ���������ˣ�ǰ���̵�����ô�࣬����Ϊ����һ���Ĳ������������񡣿�������Ĵ������£�

```
if (con.getAutoCommit()) {
    txObject.setMustRestoreAutoCommit(true);
    // �ر�������Զ��ύ��Ҳ���ǿ�������
    con.setAutoCommit(false);
}

```

��������Ϊ�����ж��Զ��ύ�Ƿ���������������ˣ��ͽ�������Ϊ false�����õ�Ҳ�� `java.sql` �ķ�����

*   ��ȡ�Զ��ύ״̬��`java.sql.Connection#getAutoCommit`
*   �����Զ��ύ״̬��`java.sql.Connection#setAutoCommit`

#### 1.4 �����ֻ����������������

��ǰ����� `1.2 ��������ĸ��뼶��`�У�ͨ������ `java.sql.Connection#setReadOnly` ����������Ϊֻ���ˣ����ﻹ����һ�����ã�����Ϊ `DataSourceTransactionManager#prepareTransactionalConnection`��

```
protected void prepareTransactionalConnection(Connection con, TransactionDefinition definition)
        throws SQLException {
    if (isEnforceReadOnly() && definition.isReadOnly()) {
        try (Statement stmt = con.createStatement()) {
            // ����ֻ������Ҫ����sql
            stmt.executeUpdate("SET TRANSACTION READ ONLY");
        }
    }
}

```

��һ����ͨ��ִ�� sql ��� `SET TRANSACTION READ ONLY` ����������Ϊֻ����

#### 1.5 ��������ĳ�ʱʱ��

�� `@Transactional` ע���У����ǿ���ʹ�� `timeout` ��ָ������ĳ�ʱʱ�䣺

```
public @interface Transactional {
    /**
     * ���ó�ʱʱ��
     */
    int timeout() default TransactionDefinition.TIMEOUT_DEFAULT;
    ...
}

```

�������õĳ�ʱʱ����������õ������ǽ��� `ResourceHolderSupport#setTimeoutInSeconds`��

```
public abstract class ResourceHolderSupport implements ResourceHolder {
    /**
     * ��ֹʱ��
     */
    private Date deadline;

    /**
     * ����ʱ�䣬��λ����
     */
    public void setTimeoutInSeconds(int seconds) {
        setTimeoutInMillis(seconds * 1000L);
    }

    /**
     * ����ʱ�䣬��λ������
     * ����ת��Ϊ ��ֹʱ��
     */
    public void setTimeoutInMillis(long millis) {
        this.deadline = new Date(System.currentTimeMillis() + millis);
    }

    /**
     * ��ȡ��ֹʱ��
     */
    @Nullable
    public Date getDeadline() {
        return this.deadline;
    }

    /**
     * ��ȡʣ��ʱ�䣬��λ����
     */
    public int getTimeToLiveInSeconds() {
        double diff = ((double) getTimeToLiveInMillis()) / 1000;
        int secs = (int) Math.ceil(diff);
        checkTransactionTimeout(secs <= 0);
        return secs;
    }

    /**
     * ��ȡʣ��ʱ�䣬��λ������
     */
    public long getTimeToLiveInMillis() throws TransactionTimedOutException{
        if (this.deadline == null) {
            throw new IllegalStateException("No timeout specified for this resource holder");
        }
        long timeToLive = this.deadline.getTime() - System.currentTimeMillis();
        checkTransactionTimeout(timeToLive <= 0);
        return timeToLive;
    }

    ...
}

```

�� `ResourceHolderSupport` ��ά����һ����Ա���� `deadline`����ֹʱ�䣩������ĳ�ʱʱ�����ն���ת��Ϊ `deadline`��

��ȡʣ��ʱ��ʱ��Ҳ���� `deadline` ����õ������ص�ʣ��ʱ��������������֡�

�������`txObject.getConnectionHolder().setTimeoutInSeconds(timeout)` ֻ�ǽ���ʱʱ�����õ� `ConnectionHolder` �ĳ�Ա�����У�`ConnectionHolder` �� `ResourceHolderSupport` �����ࣩ���ƺ������ݿ�ûɶ��ϵ�����ݿ�����ô��������ʱ���أ�

���ò�˵�������ʱ�Ŀ������е����ң�������ͨ�������ҵ��ģ���ʱʱ����������� `DataSourceUtils#applyTimeout` �����У������п�ν�Ǿ�����ǧɽ��ˮ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9fc1a75dc7b0644269b6dba16dfd5d0e676.png)

��л���Թ��ܣ�û��������֪��Ҫ��ò����ҵ����ʱ������ã�������ʹ�õ��� `jdbcTemplate`�������� `orm` ����£����ó�ʱʱ��Ӧ�û�������ͬ ��

���ǿ��� `DataSourceUtils#applyTimeout` ����ô���ó�ʱʱ��ģ�

```
public static void applyTimeout(Statement stmt, @Nullable DataSource dataSource, int timeout) 
        throws SQLException {
    Assert.notNull(stmt, "No Statement specified");
    ConnectionHolder holder = null;
    if (dataSource != null) {
        holder = (ConnectionHolder) TransactionSynchronizationManager.getResource(dataSource);
    }
    if (holder != null && holder.hasTimeout()) {
        // ������ǻ�ȡʣ��ĳ�ʱʱ�䣬�� ConnectionHolder.dateline ����õ���
        stmt.setQueryTimeout(holder.getTimeToLiveInSeconds());
    }
    else if (timeout >= 0) {
        // jdbcTemplate ����Ҳ�������ò�ѯ��ʱʱ��
        stmt.setQueryTimeout(timeout);
    }
}

```

���յ��õ��� `java.sql.Statement#setQueryTimeout` �����ó�ʱʱ��ġ�

#### 1.6 ������Դ�����ӵ���ǰ�߳�

�������鴦����ɺ󣬽��������ǰ�����Դ�������ˣ�������Ϊ `TransactionSynchronizationManager#bindResource`:

```
/**
 * resources ��ŵ�ǰ�߳��е�����Դ������
 * ���д�ŵ�����Ϊһ�� Map��Map �� key Ϊ����Դ��value Ϊ����Դ��Ӧ������
 */
private static final ThreadLocal<Map<Object, Object>> resources =
        new NamedThreadLocal<>("Transactional resources");

/**
 * �󶨲���
 */
public static void bindResource(Object key, Object value) throws IllegalStateException {
    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);
    Assert.notNull(value, "Value must not be null");
    Map<Object, Object> map = resources.get();
    if (map == null) {
        map = new HashMap<>();
        resources.set(map);
    }
    // ������Դ�����Ӵ�ŵ�map��
    Object oldValue = map.put(actualKey, value);
    if (oldValue instanceof ResourceHolder && ((ResourceHolder) oldValue).isVoid()) {
        oldValue = null;
    }
    if (oldValue != null) {
        throw new IllegalStateException("Already value [" + oldValue + "] for key [" +
                actualKey + "] bound to thread [" + Thread.currentThread().getName() + "]");
    }

```

�� һ���Ĳ������ǱȽϼ򵥵ģ����ǽ�����Դ�����ӷŽ� `resources` �У��Ӷ�����뵱ǰ�̵߳İ󶨲�����

### 2. `suspend(...)`����������

��������Ĳ���Ϊ `AbstractPlatformTransactionManager#suspend`���������£�

```
protected final SuspendedResourcesHolder suspend(@Nullable Object transaction) 
        throws TransactionException {
    // �����ͬ�������������ȹ���ͬ��������
    if (TransactionSynchronizationManager.isSynchronizationActive()) {
        List<TransactionSynchronization> suspendedSynchronizations = doSuspendSynchronization();
        try {
            Object suspendedResources = null;
            if (transaction != null) {
                // �������
                suspendedResources = doSuspend(transaction);
            }
            // ������������
            String name = TransactionSynchronizationManager.getCurrentTransactionName();
            TransactionSynchronizationManager.setCurrentTransactionName(null);
            // ����ֻ��״̬
            boolean readOnly = TransactionSynchronizationManager.isCurrentTransactionReadOnly();
            TransactionSynchronizationManager.setCurrentTransactionReadOnly(false);
            // ���ø��뼶��
            Integer isolationLevel = TransactionSynchronizationManager
                    .getCurrentTransactionIsolationLevel();
            TransactionSynchronizationManager.setCurrentTransactionIsolationLevel(null);
            // �������񼤻�״̬
            boolean wasActive = TransactionSynchronizationManager.isActualTransactionActive();
            TransactionSynchronizationManager.setActualTransactionActive(false);
            // ���ع��������
            return new SuspendedResourcesHolder(
                    suspendedResources, suspendedSynchronizations, name, readOnly, 
                    isolationLevel, wasActive);
        }
        catch (RuntimeException | Error ex) {
            doResumeSynchronization(suspendedSynchronizations);
            throw ex;
        }
    }
    else if (transaction != null) {
        Object suspendedResources = doSuspend(transaction);
        return new SuspendedResourcesHolder(suspendedResources);
    }
    else {
        return null;
    }
}

```

`suspend(...)` ����������Ҫ�ľ��ǹ�������Ĳ����ˣ�Ҳ���� `doSuspend(transaction)`���÷��� λ�� `` �У�ֱ�ӿ����룺

```
protected Object doSuspend(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;
    txObject.setConnectionHolder(null);
    // �����
    return TransactionSynchronizationManager.unbindResource(obtainDataSource());
}

```

�������� `TransactionSynchronizationManager.unbindResource` ������

```
/**
 * ����󶨲���
 */
public static Object unbindResource(Object key) throws IllegalStateException {
    Object actualKey = TransactionSynchronizationUtils.unwrapResourceIfNecessary(key);
    // ��������
    Object value = doUnbindResource(actualKey);
    if (value == null) {
        throw new IllegalStateException(...);
    }
    return value;
}

/**
 * ����󶨲���
 */
private static Object doUnbindResource(Object actualKey) {
    Map<Object, Object> map = resources.get();
    if (map == null) {
        return null;
    }
    // �Ƴ���Դ
    Object value = map.remove(actualKey);
    if (map.isEmpty()) {
        resources.remove();
    }
    if (value instanceof ResourceHolder && ((ResourceHolder) value).isVoid()) {
        value = null;
    }
    return value;
}

```

�ڿ�������ʱ���ǽ�����Դ�����Ӱ󶨵���ǰ�̣߳�����ʱ ���ǽ�����Դ�����ӽ���뵱ǰ�̵߳İ󶨹�ϵ��

### 3. `createAndHoldSavepoint(...)`�����������

�����Ĵ����� `AbstractTransactionStatus#createAndHoldSavepoint` �����д����������£�

```
    // �����
    private Object savepoint;

    // ���������
    public void createAndHoldSavepoint() throws TransactionException {
        setSavepoint(getSavepointManager().createSavepoint());
    }

    protected void setSavepoint(@Nullable Object savepoint) {
        this.savepoint = savepoint;
    }

```

�ţ��������������ֻ������`�����`�ı��棨Ҳ���Ǹ�ֵ�� `AbstractTransactionStatus` �ĳ�Ա��������Ҫ�����˽Ᵽ���Ĵ��������ÿ� `getSavepointManager().createSavepoint()`�����뵽 `JdbcTransactionObjectSupport#createSavepoint`��

```
public Object createSavepoint() throws TransactionException {
    ConnectionHolder conHolder = getConnectionHolderForSavepoint();
    try {
        if (!conHolder.supportsSavepoints()) {
            throw new NestedTransactionNotSupportedException(...);
        }
        if (conHolder.isRollbackOnly()) {
            throw new CannotCreateTransactionException(...);
        }
        // ���������
        return conHolder.createSavepoint();
    }
    catch (SQLException ex) {
        throw new CannotCreateTransactionException("Could not create JDBC savepoint", ex);
    }
}

```

���������õ��� `ConnectionHolder#createSavepoint` ������ԭ����������� `ConnectionHolder` �д����İ���������

```
// ���������ǰ׺
public static final String SAVEPOINT_NAME_PREFIX = "SAVEPOINT_";

// ���������
private int savepointCounter = 0;

public Savepoint createSavepoint() throws SQLException {
    this.savepointCounter++;
    // ���ﴴ������㣬���õ��� java.sql.Connection#setSavepoint(java.lang.String) ����
    return getConnection().setSavepoint(SAVEPOINT_NAME_PREFIX + this.savepointCounter);
}

```

���������ǰ׺Ϊ `SAVEPOINT_`��ÿ����һ������㣬`savepointCounter` �ļ������ͼ� 1�����ձ���������Ϊ `SAVEPOINT_1`��`SAVEPOINT_2`��...

������������յ��õķ����� `java.sql.Connection#setSavepoint(java.lang.String)`����Ȼ�� jdk �ṩ�ķ�����������������ǻᷢ������Ĵ󲿷ֲ������� spring �� jdk �����ķ�װ��

���ˣ����ĵķ������ȵ��ˣ�����������ύ���ع����ع�������㡢�ָ����������ȣ���ƪ���¼���������

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4947826](https://my.oschina.net/funcy/blog/4947826) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
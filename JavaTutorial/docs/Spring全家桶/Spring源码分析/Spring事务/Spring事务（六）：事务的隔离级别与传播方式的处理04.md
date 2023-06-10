�����ǡ�����ĸ��뼶���봫����ʽ�Ĵ��������ĵ� 4 ƪ�������ģ����Ǽ�����

#### 3.6 ִ�о����ҵ��

���������£�

```
retVal = invocation.proceedWithInvocation();

```

�������ջ���õ�ҵ�񷽷� `UserService#insert`�����Ĳ�����̽�������������һ�������ù�ȥ�ģ�Ҫ�˽���ù��̵�С�����Բο� aop ��ز�����

*   [spring aop ֮ jdk ��̬����](https://my.oschina.net/funcy/blog/4696654)
*   [spring aop ֮ cglib ����](https://my.oschina.net/funcy/blog/4696655)

#### 3.7 �쳣�ع�

�����쳣�ķ���Ϊ `TransactionAspectSupport#completeTransactionAfterThrowing`���������£�

```
protected void completeTransactionAfterThrowing(@Nullable TransactionInfo txInfo, Throwable ex) {
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        // �쳣���ϲŻع�
        if (txInfo.transactionAttribute != null && txInfo.transactionAttribute.rollbackOn(ex)) {
            try {
                txInfo.getTransactionManager().rollback(txInfo.getTransactionStatus());
            }
            catch (...) {
                ...
            }
        }
        else {
            try {
                // �쳣�����ϣ���ʹִ�г���Ҳ���ύ
                txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
            }
            catch (...) {
                ...
            }
        }
    }
}

```

����������������������쳣������ֱ�ӽ��лع��ģ�������Ҫ�ж��쳣���ͣ�������Ҫ�ع����쳣�Żع���

##### �жϵ�ǰ�쳣�Ƿ�Ҫ�ع�

�ж��쳣�Ƿ���ϵķ���Ϊ `RuleBasedTransactionAttribute#rollbackOn`��

```
public boolean rollbackOn(Throwable ex) {
    RollbackRuleAttribute winner = null;
    int deepest = Integer.MAX_VALUE;
    if (this.rollbackRules != null) {
        for (RollbackRuleAttribute rule : this.rollbackRules) {
            // ��ȡ�쳣�����
            int depth = rule.getDepth(ex);
            // ���������������ʾ��ǰ�쳣��Ҫ�ع�
            if (depth >= 0 && depth < deepest) {
                deepest = depth;
                winner = rule;
            }
        }
    }
    if (winner == null) {
        return super.rollbackOn(ex);
    }
    return !(winner instanceof NoRollbackRuleAttribute);
}

```

��ȡ����ķ���Ϊ `RollbackRuleAttribute#getDepth(Throwable)`���������£�

```
public int getDepth(Throwable ex) {
    return getDepth(ex.getClass(), 0);
}

private int getDepth(Class<?> exceptionClass, int depth) {
    if (exceptionClass.getName().contains(this.exceptionName)) {
        // Found it!
        return depth;
    }
    // If we've gone as far as we can go and haven't found it...
    if (exceptionClass == Throwable.class) {
        return -1;
    }
    // �ݹ��ȡ
    return getDepth(exceptionClass.getSuperclass(), depth + 1);
}

```

���ʵ�ֺܼ򵥣����ǵݹ��ȡ `exception` �ĸ��࣬�ҵ��˾ͷ��صݹ�Ĵ�������������ҵ����� `Throwable`���ͷ��� - 1.

֮����ʹ���������ж��Ƿ���Ҫ�ع���ԭ�������ûع����쳣ʱ�����������쳣���ƣ�

```
public @interface Transactional {
    ...

    // ע������������ַ���
    String[] rollbackForClassName() default {};
}

```

��˲���ʹ�� `ex instanceof Exception` �ķ�ʽ���ж��ܷ�ع���

`RuleBasedTransactionAttribute#rollbackOn` �е� `RollbackRuleAttribute` �� `NoRollbackRuleAttribute` ����ɶ�أ����� `rollbackFor` �� `noRollbackFor` �İ�װ�࣬�� `SpringTransactionAnnotationParser#parseTransactionAnnotation(AnnotationAttributes)` ���������ã��������£�

```
protected TransactionAttribute parseTransactionAnnotation(AnnotationAttributes attributes) {
    RuleBasedTransactionAttribute rbta = new RuleBasedTransactionAttribute();
    ...
    // ����ع��쳣
    List<RollbackRuleAttribute> rollbackRules = new ArrayList<>();
    for (Class<?> rbRule : attributes.getClassArray("rollbackFor")) {
        rollbackRules.add(new RollbackRuleAttribute(rbRule));
    }
    for (String rbRule : attributes.getStringArray("rollbackForClassName")) {
        rollbackRules.add(new RollbackRuleAttribute(rbRule));
    }
    // �����ع��쳣
    for (Class<?> rbRule : attributes.getClassArray("noRollbackFor")) {
        rollbackRules.add(new NoRollbackRuleAttribute(rbRule));
    }
    for (String rbRule : attributes.getStringArray("noRollbackForClassName")) {
        rollbackRules.add(new NoRollbackRuleAttribute(rbRule));
    }
    // �������
    rbta.setRollbackRules(rollbackRules);
    return rbta;
}

```

##### �ع�����

�ع������� `AbstractPlatformTransactionManager#rollback` �����д����������ݿ�Ļع������⣬���������������һЩ�ص������������ǾͲ������ˣ�ֱ�ӿ��ؼ��Ļع����롣��ǰ��ķ�������Ĵ�������ʱ����ഫ�������ǻع����񣬲��� `PROPAGATION_NESTED` ���⣬���ǻع�������㣬�������Ƿֱ��������ؼ����룺

1. ����ع�

   ��������ع��ķ���Ϊ `DataSourceTransactionManager#doRollback`�����յ��õ��� `java.sql.Connection` �ķ�����

   ```
   protected void doRollback(DefaultTransactionStatus status) {
       DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
       // ��ȡ���ӣ�Connection Ϊ java.sql.Connection
       Connection con = txObject.getConnectionHolder().getConnection();
       try {
           con.rollback();
       }
       catch (SQLException ex) {
           throw new TransactionSystemException("Could not roll back JDBC transaction", ex);
       }
   }
   
   ```

2. �ع�������� ����ع��������Ĳ����� `AbstractTransactionStatus#rollbackToHeldSavepoint` �����У�

   ```
   public void rollbackToHeldSavepoint() throws TransactionException {
       Object savepoint = getSavepoint();
       if (savepoint == null) {
           throw new TransactionUsageException(...);
       }
       // �ع��������
       getSavepointManager().rollbackToSavepoint(savepoint);
       // �ͷű����
       getSavepointManager().releaseSavepoint(savepoint);
       // ���������Ϊnull
       setSavepoint(null);
   }
   
   ```

   ���������Ҫ�������������ع�����������ͷű���㡣

   �ع��������Ĳ����� `JdbcTransactionObjectSupport#rollbackToSavepoint` ������

   ```
   public void rollbackToSavepoint(Object savepoint) throws TransactionException {
       ConnectionHolder conHolder = getConnectionHolderForSavepoint();
       try {
           conHolder.getConnection().rollback((Savepoint) savepoint);
           conHolder.resetRollbackOnly();
       }
       catch (Throwable ex) {
           throw new TransactionSystemException("Could not roll back to JDBC savepoint", ex);
       }
   }
   
   ```

   �ͷű����Ĳ����� `JdbcTransactionObjectSupport#releaseSavepoint` ������

   ```
   public void releaseSavepoint(Object savepoint) throws TransactionException {
       ConnectionHolder conHolder = getConnectionHolderForSavepoint();
       try {
           conHolder.getConnection().releaseSavepoint((Savepoint) savepoint);
       }
       catch (Throwable ex) {
           logger.debug("Could not explicitly release JDBC savepoint", ex);
       }
   }
   
   ```

   ���ն��ǵ��� `java.sql.Connection` �ṩ�ķ�������ɲ�����

##### �ύ����

���������ύ�����������ύ�����Ĵ���Ϊ

```
txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());

```

���Ǹ������������һֱ���� `AbstractPlatformTransactionManager#processCommit`��

```
private void processCommit(DefaultTransactionStatus status) throws TransactionException {
    try {
        ...

        try {
            if (status.hasSavepoint()) {
                ...
                unexpectedRollback = status.isGlobalRollbackOnly();
                // 1\. �ͷű����
                status.releaseHeldSavepoint();
            }
            else if (status.isNewTransaction()) {
                ...
                unexpectedRollback = status.isGlobalRollbackOnly();
                // 2\. �����ύ����
                doCommit(status);
            }
            else if (isFailEarlyOnGlobalRollbackOnly()) {
                ...
            }

            ...
        }
        catch (...) {
            ...
        }
    }
    finally {
        // 3\. ������ɲ������������ָ����������(�ָ����ݿ�����)
        cleanupAfterCompletion(status);
    }
}

```

���Ϸ���ʡ���˴������룬������� `TransactionSynchronization` �ص���صģ����Ǿۼ���Ҫ������

1.  �ͷű���㣺��������������Ѿ��������ˣ�����Ͳ��ٷ�����
2.  �����ύ�������ύ��������У�һ�������������ǻᷢ�����ǵ����� `java.sql.Connection` �ṩ�ķ���
3.  ������ɲ�������������Ƚ���Ҫ���������ӵ���Ϣ���ָ������������Ӿ�����������е�

�����������ύ������ֱ�ӽ������մ��룺`DataSourceTransactionManager#doCommit`

```
protected void doCommit(DefaultTransactionStatus status) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) status.getTransaction();
    // ��ȡ���ӣ�Connection Ϊ java.sql.Connection
    Connection con = txObject.getConnectionHolder().getConnection();
    try {
        // �ύ����
        con.commit();
    }
    catch (SQLException ex) {
        throw new TransactionSystemException("Could not commit JDBC transaction", ex);
    }
}

```

����Ҳ�ǵ��� `java.sql.Connection` �ṩ�ķ�����

����������ɲ����Ĵ������� `AbstractPlatformTransactionManager#cleanupAfterCompletion` ������

```
private void cleanupAfterCompletion(DefaultTransactionStatus status) {
    status.setCompleted();
    if (status.isNewSynchronization()) {
        TransactionSynchronizationManager.clear();
    }
    if (status.isNewTransaction()) {
        // ������������ӣ�����������ӣ��������ر�����
        doCleanupAfterCompletion(status.getTransaction());
    }
    // ����й����������������лָ�
    if (status.getSuspendedResources() != null) {
        Object transaction = (status.hasTransaction() ? status.getTransaction() : null);
        // �ָ����������
        resume(transaction, (SuspendedResourcesHolder) status.getSuspendedResources());
    }
}

```

���������� `DataSourceTransactionManager#doCleanupAfterCompletion` ����:

```
protected void doCleanupAfterCompletion(Object transaction) {
    DataSourceTransactionObject txObject = (DataSourceTransactionObject) transaction;

    // �Ƴ�����Դ�����ӵİ󶨹�ϵ
    if (txObject.isNewConnectionHolder()) {
        TransactionSynchronizationManager.unbindResource(obtainDataSource());
    }

    // �������ӣ����ǽ�������Ϣ�ָ���ִ������ǰ��״̬
    Connection con = txObject.getConnectionHolder().getConnection();
    try {
        if (txObject.isMustRestoreAutoCommit()) {
            con.setAutoCommit(true);
        }
        DataSourceUtils.resetConnectionAfterTransaction(
                con, txObject.getPreviousIsolationLevel(), txObject.isReadOnly());
    }
    catch (Throwable ex) {
        logger.debug("Could not reset JDBC Connection after transaction", ex);
    }
    // ����������ӣ������������ر�����
    if (txObject.isNewConnectionHolder()) {
        // ���յ��õ��� java.sql.Connection#close
        DataSourceUtils.releaseConnection(con, this.dataSource);
    }

    txObject.getConnectionHolder().clear();
}

```

������������Ļָ�������Ҳ���� `resume(...)` ������������������󣬷������յ��õ��� `DataSourceTransactionManager#doResume` �������������£�

```
@Override
protected void doResume(@Nullable Object transaction, Object suspendedResources) {
    // ������Դ����������ݿ������뵱ǰ�̰߳�
    TransactionSynchronizationManager.bindResource(obtainDataSource(), suspendedResources);
}

```

��������һ���󣬴�ʱ������Դ����֮ǰ���������Դ�ˡ�

#### 3.8 ����������Ϣ

��ĳЩ������ʽ�£����� `PROPAGATION_REQUIRES_NEW`��������Ҫ����ǰ����Ȼ�󴴽��µ�������������ִ����ɺ���Ҫ�ָ�ԭ�����������������������Ϣ���ǽ���ǰ������Ϣ�ָ�Ϊ������������Ϣ��ֻ�ǻָ���������Ϣ����������ݿ����Ӳ���������ָ�����

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

        ...

        private void restoreThreadLocalStatus() {
            // ����Ϊ�ɵ�������Ϣ
            transactionInfoHolder.set(this.oldTransactionInfo);
        }

        ...
    }

}

```

���Կ�����`TransactionInfo` �Ի�������һ���������Ϣ��`oldTransactionInfo` �ĳ�Ա�����������û���һ��������Ϣʱ��ֻ�Ǽ򵥵ؽ� `oldTransactionInfo` ���õ���Ϊ `transactionInfoHolder` �� `ThreadLocal` �

#### 3.9 �ύ����

���������ύ�Ĵ���Ϊ `TransactionAspectSupport#commitTransactionAfterReturning`���������£�

```
protected void commitTransactionAfterReturning(@Nullable TransactionInfo txInfo) {
    // �ж��������״̬
    if (txInfo != null && txInfo.getTransactionStatus() != null) {
        // �����ύ��������ǰ���Ѿ���������
        txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());
    }
}

```

�ڸ÷����У������ֿ��������д��룺

```
txInfo.getTransactionManager().commit(txInfo.getTransactionStatus());

```

����Ѿ�����**�쳣����������ύ**�з������ˣ��Ͳ��ٷ����ˡ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4947800](https://my.oschina.net/funcy/blog/4947800) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
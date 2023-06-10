![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1f1ac8f3d8241fad9693d9684048ab7f3ae.png)

�����ģ����ļ������� spring ������ ���̡�

### 11\. ��ʼ������ bean: `finishBeanFactoryInitialization(beanFactory)`

���Ľ�����һ��**�ǳ���Ҫ**�ķ��� `AbstractApplicationContext#finishBeanFactoryInitialization` �ˡ�

�����ĵ������£�

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-DefaultListableBeanFactory#preInstantiateSingletons

```

����ֱ�ӽ��� `DefaultListableBeanFactory#preInstantiateSingletons`:

```
public void preInstantiateSingletons() throws BeansException {
    // this.beanDefinitionNames ���������е� beanNames
    List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

    for (String beanName : beanNames) {
        // �ϲ��� Bean �е����ã�ע��<bean id=""  parent="" /> �е� parent����
        RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
        // ���ǳ����ࡢ�ǵ������Ҳ��������ص�
        if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
            // ���� FactoryBean
            if (isFactoryBean(beanName)) {
                //�� beanName ǰ����ϡ�&�� ����
                Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
                if (bean instanceof FactoryBean) {
                     final FactoryBean<?> factory = (FactoryBean<?>) bean;
                     // �жϵ�ǰ FactoryBean �Ƿ��� SmartFactoryBean ��ʵ��
                     boolean isEagerInit;
                     if (System.getSecurityManager() != null 
                            && factory instanceof SmartFactoryBean) {
                        isEagerInit = AccessController.doPrivileged((PrivilegedAction<Boolean>)
                                ((SmartFactoryBean<?>) factory)::isEagerInit,
                                getAccessControlContext());
                     }
                     else {
                          isEagerInit = (factory instanceof SmartFactoryBean &&
                             ((SmartFactoryBean<?>) factory).isEagerInit());
                     }
                     if (isEagerInit) {
                           // ����FactoryBean��ֱ��ʹ�ô˷������г�ʼ��
                           getBean(beanName);
                     }
                }
            }
            else {
                getBean(beanName);
            }
        }
    }

    // Trigger post-initialization callback for all applicable beans...
    // ���beanʵ���� SmartInitializingSingleton �ӿڵģ���ô������õ��ص�
    for (String beanName : beanNames) {
        Object singletonInstance = getSingleton(beanName);
        if (singletonInstance instanceof SmartInitializingSingleton) {
            final SmartInitializingSingleton smartSingleton = 
                    (SmartInitializingSingleton) singletonInstance;
            if (System.getSecurityManager() != null) {
                AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
                    smartSingleton.afterSingletonsInstantiated();
                    return null;
                }, getAccessControlContext());
            }
            else {
                smartSingleton.afterSingletonsInstantiated();
            }
        }
    }
}

```

���ϴ��룬���ƺܶ࣬���ؼ�����ɼ����£�

```
List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);
for (String beanName : beanNames) {
    RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
    if(... && bd.isSingleton() && ...) {
        getBean(beanName);
    }
}

```

> ���ϴ���ļ��У�ʡ�������ϸ�ڣ������ж��Ƿ����ʵ����ʱ����Ҫ�ж��Ƿ�Ϊ�����࣬�Ƿ�Ϊ�������Ƿ�Ϊ�����صȣ�ͬʱ�� bean Ҳ�ж����Ƿ�Ϊ��ͨ bean ���� `FactoryBean`�����ʵ���� `SmartInitializingSingleton` �ӿڵ� bean����Ҫ���⴦��ȡ��������ǳ����Ķ�������˵���Ѿ����ۼ���Ҫ���̾����ˣ�����һЩ������ϸ�ڣ������Ȳ����ᣬ���˽����ϸ�ڣ������ڰ�����Ҫ���̵�����£������ٿ������ھ���������ϸ�ڣ��������Լ�ץ��ס�ص㣬��ʧ��Դ���С�

����һ�򻯣��Ϳ������������÷����Ĺ��ܣ�

1.  ��ȡ `beanFactory` �е� `beanNames` ��������
2.  ͨ�� `beanName` ��ȡ `BeanDefinition`�����������жϣ����Ƿ�Ϊ������
3.  �������� `getBean(beanName)` ���� bean ��������ӵ� spring �С�

�Ӽ򻯺�Ĵ�����Կ���������ƽƽ����� `getBean(beanName)`������ spring ʵ���� bean �Ĺؼ��������������ǻ��Ǻ����������룬ֻ��ע��Ҫ���̣�����������ȥ��

```
|-AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#finishBeanFactoryInitialization
   |-DefaultListableBeanFactory#preInstantiateSingletons
    |-AbstractBeanFactory#getBean(java.lang.String)
     |-AbstractBeanFactory#doGetBean

```

> AbstractBeanFactory#doGetBean

```
protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
         @Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {

    // ��Ҫ�߼����������FactoryBean�Ͱ�&ȥ��,����Ǳ����ͰѸ��ݱ�����ȡ��ʵ����
    final String beanName = transformedBeanName(name);
    //���ķ���ֵ
    Object bean;

    // ����Ƿ��ѳ�ʼ��
    Object sharedInstance = getSingleton(beanName);
    // ����Ѿ���ʼ�����ˣ���û�д�args�����ʹ�����get��ֱ��ȡ������
    if (sharedInstance != null && args == null) {
        // �����������ͨBean �Ļ���ֱ�ӷ��أ������ FactoryBean �Ļ����������������Ǹ�ʵ������
        bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
    }
    else {
        // �������prototype���͵����bean
        if (isPrototypeCurrentlyInCreation(beanName)) {
            throw new BeanCurrentlyInCreationException(beanName);
        }

        // �����ǰBeanDefinition���������bean�Ҿ��и�BeanFactory
        BeanFactory parentBeanFactory = getParentBeanFactory();
        if (parentBeanFactory != null && !containsBeanDefinition(beanName)) {
            String nameToLookup = originalBeanName(name);
            if (parentBeanFactory instanceof AbstractBeanFactory) {
                return ((AbstractBeanFactory) parentBeanFactory).doGetBean(
                   nameToLookup, requiredType, args, typeCheckOnly);
            }
            else if (args != null) {.
                 // ���ظ������Ĳ�ѯ���
                 return (T) parentBeanFactory.getBean(nameToLookup, args);
            }
            else if (requiredType != null) {
                return parentBeanFactory.getBean(nameToLookup, requiredType);
            }
            else {
                return (T) parentBeanFactory.getBean(nameToLookup);
            }
        }

        if (!typeCheckOnly) {
            // typeCheckOnly Ϊ false������ǰ beanName ����һ�� alreadyCreated �� Set �����С�
            markBeanAsCreated(beanName);
        }

        // �����Ҫ����bean��
        try {
            final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
            checkMergedBeanDefinition(mbd, beanName, args);    
            // �ȳ�ʼ������������ Bean�� depends-on �ж��������
            String[] dependsOn = mbd.getDependsOn();
            if (dependsOn != null) {
                for (String dep : dependsOn) {
                    // ����ǲ�����ѭ������
                    if (isDependent(beanName, dep)) {
                        throw new BeanCreationException(...);
                    }
                    // ע��һ��������ϵ
                    registerDependentBean(dep, beanName);
                    try {
                        // �ȳ�ʼ����������
                        getBean(dep);
                    }
                    catch (NoSuchBeanDefinitionException ex) {
                        throw new BeanCreationException(...);
                    }
                }
            }

            // ����ǵ�����
            if (mbd.isSingleton()) {
                sharedInstance = getSingleton(beanName, () -> {
                    try {
                        // ִ�д��� Bean
                        return createBean(beanName, mbd, args);
                    }
                    catch (BeansException ex) {
                        destroySingleton(beanName);
                        throw ex;
                    }
                });
                bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
            }
            // �����prototype
            else if (mbd.isPrototype()) {
                Object prototypeInstance = null;
                try {
                    beforePrototypeCreation(beanName);
                    // ִ�д��� Bean
                    prototypeInstance = createBean(beanName, mbd, args);
                }
                finally {
                    afterPrototypeCreation(beanName);
                }
                bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
            }
            // ������� singleton �� prototype, ��ô�����Զ����scope(����Web��Ŀ�е�session������)��
            // ����ͽ����Զ���scope��Ӧ�÷�ȥʵ��
            else {
                String scopeName = mbd.getScope();
                final Scope scope = this.scopes.get(scopeName);
                if (scope == null) {
                  throw new IllegalStateException(...);
                }
                try {
                    Object scopedInstance = scope.get(beanName, () -> {
                        beforePrototypeCreation(beanName);
                        try {
                            // ִ�д��� Bean
                            return createBean(beanName, mbd, args);
                        }
                        finally {
                            afterPrototypeCreation(beanName);
                        }
                    });
                    bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
                }
                catch (IllegalStateException ex) {
                  throw new BeanCreationException(...);
                }
            }
        }
        catch (BeansException ex) {
            cleanupAfterBeanCreationFailure(beanName);
            throw ex;
        }
    }

    //���bean������
    if (requiredType != null && !requiredType.isInstance(bean)) {
        try {
            T convertedBean = getTypeConverter().convertIfNecessary(bean, requiredType);
            if (convertedBean == null) {
                throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
            }
            return convertedBean;
        }
        catch (TypeMismatchException ex) {
            throw new BeanNotOfRequiredTypeException(name, requiredType, bean.getClass());
        }
    }
    return (T) bean;
}

```

����Ĵ�������ϸ�����ע�ͣ� ����Ͳ����� �����ˡ�spring ���ܱȽϸ��ӣ����ǵĶ���Ҳ�Ƚ϶࣬��������������������жϣ�Ӧ�Զ��������������ǽ����� demo01 ����� (`singleton` ���)�����ϴ���ؼ����£�

```
//���ķ���ֵ
Object bean;

// ������������������
// 1\. ��ȡ��������ͬʱҲ�ṩ��һ��lambda���ʽ����������bean�Ĵ���
sharedInstance = getSingleton(beanName, () -> {
    try {
        // ִ�д��� Bean
        return createBean(beanName, mbd, args);
    }
    catch (BeansException ex) {
        destroySingleton(beanName);
        throw ex;
    }
});

// 2\. ��һ������sharedInstance��Ȼ�󷵻�bean����ʵ�ϣ����������Ҫ������ǣ�
// �����FactoryBean���ͷ��ط������������Ǹ�ʵ�����󣬷����ֱ�ӷ���
bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);

return (T) bean;

```

�����Ĵ��룬���� spring ���� bean �����̡��������Ǿͷֱ𿴿����������������ݣ�����ɾ����һЩ����Ҫ�Ĵ��룺

> `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`

```
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
    synchronized (this.singletonObjects) {
        boolean newSingleton = false;
        try {
            // ���������������д�����
            singletonObject = singletonFactory.getObject();
            newSingleton = true;
        }
        catch (... ex) {
            ...
        }
        finally {
            // ������ɺ���һЩ�жϲ������봴�����̹�ϵ����
            afterSingletonCreation(beanName);
        }
        if (newSingleton) {
            // ��ӵ�  beanFactory ����
            addSingleton(beanName, singletonObject);
        }
        return singletonObject;
    }
}

```

�����ϴ�����Կ�����bean �Ĵ��������� `singletonFactory.getObject()`�������������ִ����ʲô�����ǻ�Ӧ�ý�� `AbstractBeanFactory#doGetBean`.

���ȣ����ǽ��� `ObjectFactory#getObject`�����ִ������£�

```
@FunctionalInterface
public interface ObjectFactory<T> {
    T getObject() throws BeansException;
}

```

����һ������ʽ��̽ӿڣ�jdk8 �ṩ�����﷨���ٿ��� `AbstractBeanFactory#doGetBean` ��������Ķ���

```
sharedInstance = getSingleton(beanName, () -> {
    try {
        // ִ�д��� Bean
        return createBean(beanName, mbd, args);
    }
    catch (BeansException ex) {
        destroySingleton(beanName);
        throw ex;
    }
});

```

���ﴫ�����һ�� lambda ���ʽ��������ִ�� `singletonFactory.getObject()` ʱ��ʵ����ִ�е���

```
try {
    // ִ�д��� Bean
    return createBean(beanName, mbd, args);
}
catch (BeansException ex) {
    destroySingleton(beanName);
    throw ex;
}

```

�� `AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])`��ǰ��������������ô�࣬spring ����Ҫ���� bean �Ĵ����ˣ�

���� spring ����Ĵ��������ǻ��ں�������¼�����������������ֻ��ע `AbstractBeanFactory#getBean` �� `DefaultSingletonBeanRegistry#getSingleton`��������Ϸ��������Ƕ�������������һ���ܽ᣺

*   `AbstractBeanFactory#getBean`������ scope Ϊ `PropertyType` �� bean ��˵���÷�����ֱ�Ӵ��� bean������ scope Ϊ `singleton` �� bean ��˵���÷��������ж� `beanFactory` �Ƿ���ڸ� bean����������ֱ�ӷ��أ�������ȴ����ٷ��ء�

*   `DefaultSingletonBeanRegistry#getSingleton`������������Ǵ� `beanFactory` ��ȡ singleton bean �ķ�������������ֱ�ӷ��أ�������ȴ����ٷ��ء�

���ľ��ȷ����������ˣ���ƪ���������ٷ��� spring bean �������̡�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4658230](https://my.oschina.net/funcy/blog/4658230) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
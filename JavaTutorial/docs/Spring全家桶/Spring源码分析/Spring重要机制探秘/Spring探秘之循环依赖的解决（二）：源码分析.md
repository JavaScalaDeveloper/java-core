�� [spring ̽��֮ѭ��������һ�������ۻ�ʯ](https://my.oschina.net/funcy/blog/4659555 "spring̽��֮ѭ��������һ�������ۻ�ʯ")һ���� �������ᵽ spring ���ѭ����������������:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-dc325a87b321e4c246a1b2f14169821a75a.png)

Ϊ����������������˳�����У�spring �����ṩ�� 5 �����ݽṹ�����������в����Ĺؼ���Ϣ���� 5 �����ݽṹ���£����Ľ��� 5 �����ݽṹ��Ϊ **5 ��ṹ**����

| �ṹ                            | ˵��                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `singletonObjects`              | **һ������**������Ϊ `ConcurrentHashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �������� `spring bean`�����������ע�롢��ʼ���� bean����� bean ��Ҫ aop���洢�ľ��Ǵ������ |
| `earlySingletonObjects`         | **��������**������Ϊ `HashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` ��ʵ������ɣ���δ��������ע��� `bean`��**��� `bean` ��Ҫ `aop`������洢�ľ��Ǵ������ֻ����������������е�ԭʼ����δ��������ע��** |
| `singletonFactories`            | **��������**������Ϊ `HashMap<String, ObjectFactory>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �洢����һ�� `lambda` ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`��`getEarlyBeanReference(xxx)` �е� `bean` �Ǹմ�����ɵ� `java bean`��û�н��� spring ����ע�룬Ҳû���� aop |
| `singletonsCurrentlyInCreation` | ����Ϊ `SetFromMap<String>`��λ�� `DefaultSingletonBeanRegistry`��������ʽΪ `Collections.newSetFromMap(new ConcurrentHashMap<>(16))`���������Ǹ��� `ConcurrentHashMap` ʵ�ֵ� set���洢�������ڴ����еĶ��󣬿���**�����жϵ�ǰ�����Ƿ��ڴ�����** |
| `earlyProxyReferences`          | ����Ϊ `ConcurrentHashMap<Object, Object>`��λ�� `AbstractAutoProxyCreator`���洢������ǰ���� aop �Ķ��󣬿���**�����ж� bean �Ƿ���й� aop����֤ÿ������ֻ����һ�� aop** |

�˽�����Щ֮�󣬽��������Ǿ���ʽ��ʼ����Դ������ˡ�

### 1\. ׼�� demo

�����е�ʾ�� demo λ�� [gitee.com/funcy](https://gitee.com/funcy/spring-framework/tree/v5.2.2.RELEASE_learn/spring-learn/src/main/java/org/springframework/learn/explore/demo03 "gitee.com/funcy")������������ؼ����롣

׼������ service��service1��service2�������� service �ﶼ��һ����������

```
@Service
public class Service1 {

    @Autowired
    private Service2 service2;

    public Service1() {
        System.out.println("����service1�Ĺ��췽��");
    }

    /**
     * ��ע @AopAnnotation �ˣ������������Ҫ������
     */
    @AopAnnotation
    public void printAutowired() {
        System.out.println("Service1 Autowired:" + service2.getClass());
    }

    @Override
    public String toString() {
        return "Service1:" + getClass();
    }
}

@Component
public class Service2 {

    @Autowired
    private Service1 service1;

    public Service2() {
        System.out.println("����service2�Ĺ��췽��");
    }

    /**
     * ��ע @AopAnnotation �ˣ������������Ҫ������
     */
    @AopAnnotation
    public void printAutowired() {
        System.out.println("Service2 Autowired:" + service1.getClass());
    }

    @Override
    public String toString() {
        return "Service2:" + this.getClass();
    }
}

```

���������ࣺ

```
public class Demo03Main {

    public static void main(String[] args) {
        ApplicationContext context = 
                new AnnotationConfigApplicationContext(AopAnnotationConfig.class);
        Object obj1 = context.getBean("service1");
        Object obj2 = context.getBean("service2");
        ((Service1)obj1).printAutowired();
        ((Service2)obj2).printAutowired();
    }
}

```

�� `Service1` �У���Ҫע������ `service2`������ `Service2` �У���Ҫע������ `service1`���� `Service1`��`Service2` ����Ҫ���д������� `main()` ����ִ�н�����£�

```
����service1�Ĺ��췽��
����service2�Ĺ��췽��
Disconnected from the target VM, address: 'localhost:55518', transport: 'socket'
Connected to the target VM, address: '127.0.0.1:55507', transport: 'socket'
@Around: before execute...
Service1 Autowired:class org.springframework.learn.explore.demo03.Service2$$EnhancerBySpringCGLIB$$e7e367ab
@Around: after execute...
@Around: before execute...
Service2 Autowired:class org.springframework.learn.explore.demo03.Service1$$EnhancerBySpringCGLIB$$d447df08
@Around: after execute...

```

�õ��� obj1��obj2 �ֱ�Ϊ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-201844d13a7b489d1a18a8218d6440d6068.png)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-3781280ce3f4da91504b0665ebfd3aed05b.png)

�������ݣ����ѵó����½��ۣ�

*   `service1` �� `service2` �� `printAutowired()` ��������������淽�������ݣ��������߶�����ɹ��ˣ�
*   �������л�ȡ�ĵ� `service1` �� `service2` ���Ǵ������
*   `service1` �Ĵ��������� `service1` ��ԭʼ����`service2` �Ĵ��������� `service2` ��ԭʼ����
*   `service1` ��ԭʼ������ע��� `service2` Ϊ�������`service2` ��ԭʼ������ע��� `service1` Ϊ�������

�����������Ǿʹ�Դ��������� spring �����һ�������У����յõ��������ġ�

> `service1` �� `service2` �Ĵ���������� `cglib` ��������ģ��ⲿ�������뱾���޹أ��Ͳ������ˡ�

### 2\. ��һ�ε��� `AbstractBeanFactory#getBean(String)`����ȡ `service1`

spring bean �Ĵ���������ע�������Ǵ� `AbstractBeanFactory#getBean(String)` ������ʼ����һ��ɲο� [spring ��������֮��� BeanFactory �ĳ�ʼ��](https://my.oschina.net/funcy/blog/4658230)�����ǵ�Դ�����Ҳ������������֡�

����һ��ʼ�����ᵽ�� spring Ϊ���ѭ�������� 5 ��ṹ������չʾ���£�

| �ṹ                            | ���� |
| ------------------------------- | ---- |
| `singletonObjects`              |      |
| `earlySingletonObjects`         |      |
| `singletonFactories`            |      |
| `singletonsCurrentlyInCreation` |      |
| `earlyProxyReferences`          |      |

һ��ʼ��5 ��ṹ�й��� `service1` �� `service2` ��ʲô���ݶ�û�� ��������������һ�߷������룬һ�߹�ע�⼸���ṹ�е����ݡ�

> ��ʵ�ϣ�5 ��ṹ�������ݵģ����� spring �ڲ��ṩ��һЩ bean������������ֻ��ע `service1` �� `service2` ��ص����ݣ�������ﲻչʾ��

### 2.1 `AbstractBeanFactory#doGetBean`

��ȡ `service1` �Ĵ����� `AbstractBeanFactory#getBean(String)`���������Ļ�ȡ����ȴ���� `AbstractBeanFactory#doGetBean` �У����������£�

```
|-AbstractBeanFactory#getBean(String)
 |-AbstractBeanFactory#doGetBean

```

�������£�

```
    protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
            @Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {

        ...
        // 1\. ����Ƿ��ѳ�ʼ����������beanName����singletonsCurrentlyInCreation��
        Object sharedInstance = getSingleton(beanName);
        ...
        // ����ǵ�����
        if (mbd.isSingleton()) {
            // 2\. getSingleton(): ��������ɾ��������������
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
            // �����������ͨBean �Ļ���ֱ�ӷ��أ������ FactoryBean �Ļ���
            // �������������Ǹ�ʵ������
            bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
        }
        ...
    }

```

���ϴ��뾭���˾�������ֻ��������Ҫ���̣����������У�Ҳ�ᾫ����룬ֻ������Ҫ���̣�ʡ���޹ش��룩����������������ط���Ҫ������

1.  `getSingleton(beanName)`����ȡ����ֻ�����������л�ȡ��
2.  `getSingleton(beanName, () -> { ... })`����ȡ���󣬴����������ﴴ����

#### 2.2 `DefaultSingletonBeanRegistry#getSingleton(String, boolean)`

������������ `getSingleton(beanName)`�����������£�

```
|-AbstractBeanFactory#getBean(String)
 |-AbstractBeanFactory#doGetBean
  |-DefaultSingletonBeanRegistry#getSingleton(String)
   |-DefaultSingletonBeanRegistry#getSingleton(String, boolean)

```

ֱ�ӿ����룺

```
/*
 * beanName: �����ֵΪ service1
 * allowEarlyReference�������ֵΪ true
 */
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 1\. ��һ�������л�ȡ�������ǻ�ȡ����
    Object singletonObject = this.singletonObjects.get(beanName);
    // 2\. isSingletonCurrentlyInCreation(...) �ж�service1�Ƿ��ڴ����У����� false
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        // ʡ������Ĵ���
        ...
    }
    return singletonObject;
}

```

����������������£�

1. �����������л�ȡ����ʱ `singletonObjects` �ﲢû�� `service1`����ȡ������

2. �������ж� `service1` �Ƿ��ڴ����У��жϷ�ʽ���£�

   ```
   public boolean isSingletonCurrentlyInCreation(String beanName) {
       return this.singletonsCurrentlyInCreation.contains(beanName);
   }
   
   ```

   ��Ȼ��`singletonsCurrentlyInCreation` ��û�� `service1` �ģ�����Ҳ���� false.

`DefaultSingletonBeanRegistry#getSingleton(String, boolean)` ���е�����ͷ����ˣ��������������ķ������Ǿ��Ȳ������ˡ�

#### 2.3 `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`

�����ǻص� `AbstractBeanFactory#doGetBean`�����ŷ��� `getSingleton(beanName, () -> { ... })`���������£�

```
    /**
     * beanName���������service1
     * singletonFactory���������lambda���ʽ��ֵΪ
     *           () -> {
     *               try {
     *                   // ������Ǵ���bean������
     *                   return createBean(beanName, mbd, args);
     *               }
     *               catch (BeansException ex) {
     *                   destroySingleton(beanName);
     *                   throw ex;
     *               }
     *           }
     */
    public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
        Assert.notNull(beanName, "Bean name must not be null");
        synchronized (this.singletonObjects) {
            // �ٴ��ж�bean�Ƿ��Ѵ���
            Object singletonObject = this.singletonObjects.get(beanName);
            if (singletonObject == null) {
                // 1\. �жϵ�ǰ����ʵ������bean�Ƿ�������ڴ�����
                // ���������beanName��ӵ� singletonsCurrentlyInCreation ��
                beforeSingletonCreation(beanName);
                try {
                    // 2\. ���������bean�Ĵ���
                    singletonObject = singletonFactory.getObject();
                }
                catch (...) {
                    ...
                }
                ...
            }
            return singletonObject;
        }
    }

```

���մ����е�ע�����ݣ����Ƿ�����Ҫ���裺

1. �жϵ�ǰ����ʵ������ bean �Ƿ�������ڴ����У������жϵ�ǰ�����Ƿ��� `singletonsCurrentlyInCreation` �У�����������׳��쳣������������ӵ� `singletonsCurrentlyInCreation` �У�

   ������֮����һ�д����5 ��ṹ�е��������£�

   | �ṹ                            | ����     |
      | ------------------------------- | -------- |
   | `singletonObjects`              |          |
   | `earlySingletonObjects`         |          |
   | `singletonFactories`            |          |
   | `singletonsCurrentlyInCreation` | service1 |
   | `earlyProxyReferences`          |          |

2. ���� bean �Ĵ������̣�`singletonFactory.getObject()` ���е�ʵ�����Ǵ���� lambda ���ʽ��

   ```
   () -> {
       try {
           // ִ�д��� Bean
           return createBean(beanName, mbd, args);
       }
       catch (BeansException ex) {
           destroySingleton(beanName);
           throw ex;
       }
   }
   
   ```

   Ҳ���� `AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])`���� �������ǽ������������ص㣻

#### 2.4 `AbstractAutowireCapableBeanFactory#doCreateBean`

�Ӵ�����������`AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])` ��û����ʲôʵ�������ݣ����Ǿ�ֱ������ `AbstractAutowireCapableBeanFactory#doCreateBean` �ˣ������о�����ǧɽ��ˮ���£�

```
|-AbstractBeanFactory#getBean(String)
 |-AbstractBeanFactory#doGetBean
  |-DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)
   |-AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])
    |-AbstractAutowireCapableBeanFactory#doCreateBean

```

`AbstractAutowireCapableBeanFactory#doCreateBean` �������£�

```
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, 
        final @Nullable Object[] args) throws BeanCreationException {

    BeanWrapper instanceWrapper = null;
    if (instanceWrapper == null) {
        // 1\. ʵ���� Bean������java�������ʵ����
        instanceWrapper = createBeanInstance(beanName, mbd, args);
    }
    //beanʵ��
    final Object bean = instanceWrapper.getWrappedInstance();
    //bean����
    Class<?> beanType = instanceWrapper.getWrappedClass();
    if (beanType != NullBean.class) {
        mbd.resolvedTargetType = beanType;
    }

    synchronized (mbd.postProcessingLock) {
        if (!mbd.postProcessed) {
            try {
                // ���� AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition ����
                // 2\. ��ȡ��Ҫע��������뷽������ע @Autowired ע�⣩
                applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);
            }
            catch (Throwable ex) {
                throw new BeanCreationException(mbd.getResourceDescription(), beanName,
                        "Post-processing of merged bean definition failed", ex);
            }
            mbd.postProcessed = true;
        }
    }
    // ���ѭ����������, �Ƿ�����ѭ������, allowCircularReferencesĬ��Ϊtrue�����Թر�
    boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
            isSingletonCurrentlyInCreation(beanName));
    if (earlySingletonExposure) {
        // 3\. �� bean ��ӵ� singletonFactories
        addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
    }

    Object exposedObject = bean;
    try {
        // 4\. ����ע�룬������Ҫע�� service2��Ȼ���ٵ��� getBean("service2")
        populateBean(beanName, mbd, instanceWrapper);
        ...
    }
    catch (Throwable ex) {
        ...
    }
}

```

����������еĲ������£�

1. ʵ���� Bean������ java �������ʵ����������Ͳ���˵�ˣ�ʵ������� `service1` ���£����Կ��� `service2` ���� `null`������δ��������ע�룩��

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8b2f5fdf0efd6beb7f62d4f35f5c5562b83.png)

2. ��ȡ��Ҫע��������뷽����**������ԭʼ�����в��ܻ�ȡ������������ǻ�ȡ������**������ `@Autowired` �� `beanPostProcessor` �� `AutowiredAnnotationBeanPostProcessor`��

3. �� bean ��ӵ� `singletonFactories` �У���ӹ������£�

   ```
   protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
       Assert.notNull(singletonFactory, "Singleton factory must not be null");
       synchronized (this.singletonObjects) {
           // ��������ص��в����ڲŻ�add
           if (!this.singletonObjects.containsKey(beanName)) {
               // �ѹ�������put��singletonFactories
               this.singletonFactories.put(beanName, singletonFactory);
               // ɾ�����������еĶ���
               this.earlySingletonObjects.remove(beanName);
               this.registeredSingletons.add(beanName);
           }
       }
   }
   
   ```

   ����Ķ���Ϊ

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-3d9a56a0d655fe1e95d8857095fb46aa71a.png)

   ��ʱ�� 5 ���ṹ�е��������£�

   | �ṹ                            | ����             |
      | ------------------------------- | ---------------- |
   | `singletonObjects`              |                  |
   | `earlySingletonObjects`         |                  |
   | `singletonFactories`            | lambda(service1) |
   | `singletonsCurrentlyInCreation` | service1         |
   | `earlyProxyReferences`          |                  |

   `lambda(service1)` ʵ������Ϊ `() -> getEarlyBeanReference(beanName, mbd, bean)`����� `lambda` ���ʽ�����ľ��ǽ��� aop �������������ݵ����е�ʱ�������ٷ�����

4. ����ע�룬�ڵ� 2 ���У�spring �ҵ� `service1` ��Ҫע������� `service2`��������ٵ��� `beanFactory.getBean("service2")` ���� `service2` ���������ڣ����ֻص��� `AbstractBeanFactory#getBean(String)` ������

   �� `populateBean(xxx)` �� `getBean(xxx)` �Ĳ����൱�࣬���������£�

   ```
   |-AbstractBeanFactory#getBean(String)
    |-AbstractBeanFactory#doGetBean
     |-DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)
      |-AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])
       |-AbstractAutowireCapableBeanFactory#doCreateBean
        // �����������ע��
        |-AbstractAutowireCapableBeanFactory#populateBean
         |-AutowiredAnnotationBeanPostProcessor#postProcessProperties
          |-InjectionMetadata#inject
           |-AutowiredAnnotationBeanPostProcessor.AutowiredFieldElement#inject
            |-DefaultListableBeanFactory#resolveDependency
             |-DefaultListableBeanFactory#doResolveDependency
              |-DependencyDescriptor#resolveCandidate
               |-AbstractBeanFactory#getBean(String)
   
   ```

   ��һ�� `DependencyDescriptor#resolveCandidate`�����õ����� `beanFactory.getBean(String)` ������

   ```
   public Object resolveCandidate(String beanName, Class<?> requiredType, BeanFactory beanFactory)
           throws BeansException {
       return beanFactory.getBean(beanName);
   }
   
   ```

�������`service1` �Ļ�ȡ���̾���ͣһ�£���Ϊ `service1` Ҫע�� `service2`���������Ϳ�ʼ��ȡ `service2` �����̡�

��С�ڽ���ʱ��5 ��ṹ�е��������£�

| �ṹ                            | ����             |
| ------------------------------- | ---------------- |
| `singletonObjects`              |                  |
| `earlySingletonObjects`         |                  |
| `singletonFactories`            | lambda(service1) |
| `singletonsCurrentlyInCreation` | service1         |
| `earlyProxyReferences`          |                  |

### 3\. �ڶ��ε��� `AbstractBeanFactory#getBean(String)`����ȡ `service2`

#### 3.1 `AbstractBeanFactory#doGetBean`

��һ������ȡ `service1` �����̻���һ�£���ͬ���� `beanName` �� `service2`�����ٷ�����

#### 3.2 `DefaultSingletonBeanRegistry#getSingleton(String, boolean)`

��һ������ȡ `service1` �����̻���һ�£���ͬ���� `beanName` �� `service2`�����ٷ�����

#### 3.3 `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`

��һ������ȡ `service1` �����̻���һ�£���ͬ���� `beanName` �� `service2`���������ݲ��ٷ�����

`service2` ������һ������ �� `singletonsCurrentlyInCreation` �ṹ�У���һ��֮��5 ��ṹ�е��������£�

| �ṹ                            | ����               |
| ------------------------------- | ------------------ |
| `singletonObjects`              |                    |
| `earlySingletonObjects`         |                    |
| `singletonFactories`            | lambda(service1)   |
| `singletonsCurrentlyInCreation` | service1, service2 |
| `earlyProxyReferences`          |                    |

#### 3.4 `AbstractAutowireCapableBeanFactory#doCreateBean`

��һ������ȡ `service1` �����̻���һ�£�˵�����£�

1. ���󴴽�������ᴴ�� `service2`��������ɺ�Ķ������£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-393811afa91cc1ff696b02ce6d683c97640.png)

   ͬ���ģ�`service2` �е����� `service1` ҲΪ `null`��

2. ��ȡ��Ҫע��������뷽����`service2` ������ `service1` �ᱻ�ҵ�����Ϊ�����Ա�ע�� `@Autowired` ע�⣻

3. �� bean ��ӵ� `singletonFactories` �У���һ��֮��5 ���ṹ�е��������£�

   | �ṹ                            | ����                               |
      | ------------------------------- | ---------------------------------- |
   | `singletonObjects`              |                                    |
   | `earlySingletonObjects`         |                                    |
   | `singletonFactories`            | lambda(service1), lambda(service2) |
   | `singletonsCurrentlyInCreation` | service1, service2                 |
   | `earlyProxyReferences`          |                                    |

   ��һ���Ĺؼ����ڣ�`service2` ��ӵ������������ˣ�

4. ����ע�룬�ڵ� 2 ���У�spring �ҵ� `service2` ��Ҫע������� `service1`��������ٵ��� `getBean("service2")` �������ֻص��� `AbstractBeanFactory#getBean(String)` �����ˡ�

�������`service2` �Ļ�ȡ����ҲҪ��ͣһ���ˣ���Ϊ `service2` Ҫע�� `service1`����������Ҫ��ʼ��ȡ `service1` �����̡�

��С�ڽ���ʱ��5 ���ṹ�е��������£�

| �ṹ                            | ����                               |
| ------------------------------- | ---------------------------------- |
| `singletonObjects`              |                                    |
| `earlySingletonObjects`         |                                    |
| `singletonFactories`            | lambda(service1), lambda(service2) |
| `singletonsCurrentlyInCreation` | service1, service2                 |
| `earlyProxyReferences`          |                                    |

### 4\. �����ε��� `AbstractBeanFactory#getBean(String)`���ٴλ�ȡ `service1`

#### 4.1 `AbstractBeanFactory#doGetBean`

`AbstractBeanFactory#doGetBean` �������£�

```
    protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
            @Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {

        ...
        // 1\. ����Ƿ��ѳ�ʼ����������beanName����singletonsCurrentlyInCreation��
        Object sharedInstance = getSingleton(beanName);
        ...
}

```

�����е� `Object sharedInstance = getSingleton(beanName)` ǰ��`AbstractBeanFactory#doGetBean` ������������ǰ����С���������� `Object sharedInstance = getSingleton(beanName)` ������˱仯������������������ `getSingleton(beanName)` ��ִ�С�

#### 4.2 `DefaultSingletonBeanRegistry#getSingleton(String, boolean)`

```
/*
 * beanName: �����ֵΪ service1
 * allowEarlyReference�������ֵΪ true
 */
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 1\. ��һ�������л�ȡ�������ǻ�ȡ����
    Object singletonObject = this.singletonObjects.get(beanName);
    // 2\. isSingletonCurrentlyInCreation(...) �ж�service1�Ƿ��ڴ����У����� true
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
            synchronized (this.singletonObjects) {
                // 3\. �Ӷ��������л�ȡ������Ҳ��ȡ����
                singletonObject = this.earlySingletonObjects.get(beanName);
                // 4\. �����allowEarlyReference��true������ִ�����������
                if (singletonObject == null && allowEarlyReference) {
                    // 5\. �����������л�ȡ���ܻ�ȡ��
                    ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                    if (singletonFactory != null) {
                        // 6\. ���� singletonFactory.getObject()
                        // ���յ��õ��� AbstractAutowireCapableBeanFactory.getEarlyBeanReference ����
                        singletonObject = singletonFactory.getObject();
                        // 7\. ������
                        // �ŵ�����������
                        this.earlySingletonObjects.put(beanName, singletonObject);
                        // ���������������
                        this.singletonFactories.remove(beanName);
                    }
                }
            }
    }
    return singletonObject;
}

```

�ڷ�������ǰ������������ʱ 5 ��ṹ�е����ݣ�

| �ṹ                            | ����                               |
| ------------------------------- | ---------------------------------- |
| `singletonObjects`              |                                    |
| `earlySingletonObjects`         |                                    |
| `singletonFactories`            | lambda(service1), lambda(service2) |
| `singletonsCurrentlyInCreation` | service1, service2                 |
| `earlyProxyReferences`          |                                    |

��������������ݣ��������£�

1. ��һ�������л�ȡ�������� 5 ���ṹ�е����ݣ���ȡ���������� `null`;

2. `isSingletonCurrentlyInCreation(...)` �ж� `service1` �Ƿ��ڴ����У������� 5 ���ṹ�е����ݣ�`service1` �� `singletonsCurrentlyInCreation` �У����� true��������������̣�**�������һ�λ�ȡ `service1` �Ĳ�֮ͬ��**��

3. �����Ӷ��������л�ȡ�������� 5 ���ṹ�е����ݣ�`service1` ���� `earlySingletonObjects`����Ȼ���� `null`��

4. `allowEarlyReference` �Ǵ���Ĳ�����Ϊ `true`������ִ�� ����Ĵ��룻

5. �����Ӵ����������л�ȡ�������� 5 ���ṹ�е����ݣ�`service1` �� `singletonFactories` �У������ܻ�ȡ�������صĽ�����£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-57677e20855580e5bc2f5163d87ecfda7d2.png)

6. ���� `singletonFactory.getObject()` �������������Ǵ��� `singletonFactories` �Ļ��Ǹ� lambda ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`������ `singletonFactory.getObject()` ���յ��õľ��� `AbstractAutowireCapableBeanFactory#getEarlyBeanReference`��

   ```
   protected Object getEarlyBeanReference(String beanName, RootBeanDefinition mbd, Object bean) {
       Object exposedObject = bean;
       if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
           for (BeanPostProcessor bp : getBeanPostProcessors()) {
               if (bp instanceof SmartInstantiationAwareBeanPostProcessor) {
                   // ���ú��ô����������������aop����
                   SmartInstantiationAwareBeanPostProcessor ibp = 
                         (SmartInstantiationAwareBeanPostProcessor) bp;
                   // ���� `AbstractAutoProxyCreator#getEarlyBeanReference`����ǰ���� aop
                   exposedObject = ibp.getEarlyBeanReference(exposedObject, beanName);
               }
           }
       }
       return exposedObject;
   }
   
   ```

   ���Ǹ��� `AbstractAutoProxyCreator#getEarlyBeanReference` ������

   ```
   public Object getEarlyBeanReference(Object bean, String beanName) {
       Object cacheKey = getCacheKey(bean.getClass(), beanName);
       this.earlyProxyReferences.put(cacheKey, bean);
       // �������ɴ������
       return wrapIfNecessary(bean, beanName, cacheKey);
   }
   
   ```

   ���� aop �����̣��ɲο� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)������Ͳ��ٷ����ˡ�ִ���� `AbstractAutoProxyCreator#getEarlyBeanReference` ֮��5 ���ṹ�е��������£�

   | �ṹ                            | ����                               |
      | ------------------------------- | ---------------------------------- |
   | `singletonObjects`              |                                    |
   | `earlySingletonObjects`         |                                    |
   | `singletonFactories`            | lambda(service1), lambda(service2) |
   | `singletonsCurrentlyInCreation` | service1, service2                 |
   | `earlyProxyReferences`          | service1                           |

   �������ٻص� `getSingleton` ������ִ���� `singletonFactory.getObject()` �󣬵õ��� `singletonObject` Ϊ

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-cf72a8ff3d91c3d2a4e300741ba7f0268e6.png)

   ����һ��������󣬲��� `service2` Ϊ `null`��

7. ���������Ǵ������ˣ�һЩ map �� put �� remove �������Ͳ���˵�ˡ�

`DefaultSingletonBeanRegistry#getSingleton(String, boolean)` ����ִ����ɺ�5 ���ṹ�е��������£�

| �ṹ                            | ����               |
| ------------------------------- | ------------------ |
| `singletonObjects`              |                    |
| `earlySingletonObjects`         | service1           |
| `singletonFactories`            | lambda(service2)   |
| `singletonsCurrentlyInCreation` | service1, service2 |
| `earlyProxyReferences`          | service1           |

#### 4.3 �ٴλص� `AbstractBeanFactory#doGetBean`

ִ���� `DefaultSingletonBeanRegistry#getSingleton(String, boolean)` �������ٻص� `AbstractBeanFactory#doGetBean`��

```
protected <T> T doGetBean(final String name, @Nullable final Class<T> requiredType,
        @Nullable final Object[] args, boolean typeCheckOnly) throws BeansException {
    ...

    // ����Ƿ��ѳ�ʼ��
    Object sharedInstance = getSingleton(beanName);

    // 1\. ����ܻ�ȡ������if ����Ĵ����ִ��
    if (sharedInstance != null && args == null) {
        // 2\. �����������ͨBean �Ļ���ֱ�ӷ��أ������ FactoryBean �Ļ����������������Ǹ�ʵ������
        // �����bean��service1�Ĵ������
        bean = getObjectForBeanInstance(sharedInstance, name, beanName, null);
    } else {
        // ����Ĵ��벻��ִ�е����Ͳ�������
        ...
    }

    // ����bean��ת�����������ﷵ��false������ִ�е�
    if (requiredType != null && !requiredType.isInstance(bean)) {
    ...
    }

    // 3\. ���ش�`getSingleton(beanName)`�õ��Ķ���
    return bean;

}

```

1. ����ܻ�ȡ������if ����Ĵ����ִ�У�

2. `service1` ���� `FactoryBean`���� `getSingleton(beanName)` �õ��Ķ�����ͬһ�������������£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0cd9c129bf2387d85a7bee4f4e135143f63.png)

3. ���ش� `getSingleton(beanName)` �õ��Ķ����� `getSingleton(beanName)` �з��صĶ���Ϊ�պ󣬾Ͳ���ִ�� bean �Ĵ��������ˣ����շ��ص��ǵ� 2 ���еõ��� bean �ˡ�

��������������ڻ�ȡ���� `service1` �Ĵ�����󣬾��ܴ�������Ӧ��ԭʼ����û���������ע�룬��������Ȼ���Խ��к��������̣�����ȡ�� `service1` �Ĵ�������`service2` �Ϳ��Խ�������ע�룬�����������������ˡ�

�������������������ִ����֮��5 ��ṹ�е����ݣ�

| �ṹ                            | ����                            |
| ------------------------------- | ------------------------------- |
| `singletonObjects`              |                                 |
| `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
| `singletonFactories`            | lambda(service2)                |
| `singletonsCurrentlyInCreation` | service1, service2              |
| `earlyProxyReferences`          | service1                        |

��ȡ�� `service1` �󣬽������ͼ��� `service2` �Ļ�ȡ�����ˡ�

### 5 ���� `service2` �Ļ�ȡ����

�ڵ� 3 ���У���Ϊ `service2` ��Ҫע�� `service1`�������˵� 4 ���ֵ��ٴλ�ȡ `service1` �����̣�����Ҳ�ɹ��ػ�ȡ���� `service1` �Ĵ������ `service1$$EnhancerBySpringCGLIB`������� `service2` �����������ע�롣

������������������ �� 3 �� �����̣��ص� `AbstractAutowireCapableBeanFactory#doCreateBean`������ `service2` �����̡�

#### 5.1 �ص� `AbstractAutowireCapableBeanFactory#doCreateBean`

�������£�

```
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, 
            final @Nullable Object[] args) throws BeanCreationException {

        // ����Ĵ����� 3.2 ���Ѿ��������ˣ��Ͳ��ٷ�����
        ...

        Object exposedObject = bean;
        try {
            // 1\. ��������װ��, Ҳ�������ǳ���˵������ע��
            populateBean(beanName, mbd, instanceWrapper);
            // 2\. ��ʼ����������ᴦ�� aop ����
            exposedObject = initializeBean(beanName, exposedObject, mbd);
        }
        catch (Throwable ex) {
            ...
        }

        //ͬ���ģ��������ѭ������
        if (earlySingletonExposure) {
            // 3\. �ӻ����л�ȡ beanName ��Ӧ��bean
            Object earlySingletonReference = getSingleton(beanName, false);
            // 4\. earlySingletonReference Ϊ null��if ��������ݲ���ִ��
            if (earlySingletonReference != null) {
                ...
            }
        }

        // ʡ�Բ���Ҫ�Ĵ���
        ...

        return exposedObject;
    }

```

����˵�����£�

1. ��������ע�룬�������ﴥ���˵� 4 ���ֵ����̣�ִ����õ��� `service2` ���£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b294a02be5431c0aa66e5f126a6c6abbb92.png)

   ���Կ�������ʱע�뵽 `service2` �е� `service1` ���Ǵ�������ˣ�

2. ��ʼ����������ᴦ�� aop ������ִ�� aop �ķ���Ϊ `AbstractAutoProxyCreator#postProcessAfterInitialization`���������£�

   ```
   // �����beanΪservice2��beanNameΪ��service2��
   public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
       if (bean != null) {
           Object cacheKey = getCacheKey(bean.getClass(), beanName);
           // 1\. earlyProxyReferences �в�û�� service2��if��Ĵ����ִ�е�
           if (this.earlyProxyReferences.remove(cacheKey) != bean) {
               // 2\. �����ﴦ��aop����
               return wrapIfNecessary(bean, beanName, cacheKey);
           }
       }
       return bean;
   }
   
   ```

   ���ϴ����ȴ� `earlyProxyReferences` �Ƴ� `service2`��Ȼ�����봫��� bean ���Ƚϣ������� 5 ��ṹ�е����ݣ����Ƿ��� `service2` ������ `earlyProxyReferences` �У�

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              |                                 |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            | lambda(service2)                |
   | `singletonsCurrentlyInCreation` | service1, service2              |
   | `earlyProxyReferences`          | service1                        |

   ��ˣ����ﷵ�� `null`����Ȼ�����ڴ���� bean����� if �еĴ����ִ�У�`service2` ���� aop��ִ������һ���󣬵õ��� `exposedObject` Ϊ��

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d62ebdbb71b76ada963a01c9b8c84b88b00.png)

   `service2` Ҳ����˴�������������������ע�롣

3. �ӻ����л�ȡ beanName ��Ӧ�� bean��ִ�е��� `DefaultSingletonBeanRegistry#getSingleton(String, boolean)`���������£�

   ```
   /**
    * beanName: service2
    * allowEarlyReference��false
    */
   protected Object getSingleton(String beanName, boolean allowEarlyReference) {
       // 1\. ��һ�������л�ȡ service2����ȡ����������null
       Object singletonObject = this.singletonObjects.get(beanName);
       // 2\. �ж� service2 �Ƿ��ڴ����У�����true��ִ��if�еĴ���
       if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
           synchronized (this.singletonObjects) {
               // 3\. �Ӷ��������л�ȡ service2����ȡ����������null
               singletonObject = this.earlySingletonObjects.get(beanName);
               // 4\. ��ʱ����� allowEarlyReference Ϊfalse��if��Ĵ��벻��ִ��
               if (singletonObject == null && allowEarlyReference) {
                   ...
               }
           }
       }
       return singletonObject;
   }
   
   ```

   ���ǻ������� һ�� 5 ��ṹ�е����ݣ������������ִ�о�һĿ��Ȼ�ˣ�

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              |                                 |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            | lambda(service2)                |
   | `singletonsCurrentlyInCreation` | service1, service2              |
   | `earlyProxyReferences`          | service1                        |

   ������ִ�У��ڴ������Ѿ�ע�͵ú������ˣ��Ͷ�˵�ˣ�

4. �� 3 �����ص� `earlySingletonReference` Ϊ null��if ��������ݲ���ִ�С�

������õ��� `service2` �ͷ����ˡ�

#### 5.2 �ص� `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`

�õ� `service2` �� bean �����ǻص� `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`������ `service2` �����̣��������£�

```
public Object getSingleton(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(beanName, "Bean name must not be null");
    synchronized (this.singletonObjects) {
        ...
            try {
                // 1\. ���������bean�Ĵ���
                singletonObject = singletonFactory.getObject();
                newSingleton = true;
            }
            catch (...) {
                ...
            }
            finally {
                ...
                // 2\. ������ɺ���һЩ������
                // ������ service2 �� singletonsCurrentlyInCreation �Ƴ�
                afterSingletonCreation(beanName);
            }
            if (newSingleton) {
                // 3\. ���ö�����ӵ� beanFactory �У����������ɾ������������
                addSingleton(beanName, singletonObject);
            }
        ...
        return singletonObject;
    }
}

```

˵�����£�

1. ����ǧ�����գ�`singletonFactory.getObject()` ����ִ�����ˣ����������֮�����ջ��ǵõ��� `service2` �Ĵ������

2. `service2` ������ɺ󣬾ͻὫ��� `singletonsCurrentlyInCreation` �Ƴ��������Ƚϼ򵥣��Ͳ���˵�ˣ���һ���õ��� 5 ��ṹ���£�

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              |                                 |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            | lambda(service2)                |
   | `singletonsCurrentlyInCreation` | service1                        |
   | `earlyProxyReferences`          | service1                        |

3. ���ţ����ǻ���Ĵ�������Ϊ `DefaultSingletonBeanRegistry#addSingleton`��

   ```
   /*
    * beanName��service2
    * singletonObject��service2$$EnhancerBySpringCGLIB(service2�Ĵ������)
    */ 
   protected void addSingleton(String beanName, Object singletonObject) {
       synchronized (this.singletonObjects) {
           // �������������put��remove����������ֻ��һ���������иö���
           this.singletonObjects.put(beanName, singletonObject);
           this.singletonFactories.remove(beanName);
           this.earlySingletonObjects.remove(beanName);
           this.registeredSingletons.add(beanName);
       }
   }
   
   ```

   �����Ƚϼ򵥣��Ͳ���˵�ˣ����� 5 ��ṹΪ��

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              | service2$$EnhancerBySpringCGLIB |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            |                                 |
   | `singletonsCurrentlyInCreation` | service1                        |
   | `earlyProxyReferences`          | service1                        |

���ˣ�`service2` ��ȡ��ɣ����ձ��浽 `singletonObjects` �е� bean Ϊ��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-763dad35376ed1d88086c45f01ee9c4cedd.png)

���ڵ��������Ҳ������ 5 ���ṹ�е����ݣ�

| �ṹ                            | ����                            |
| ------------------------------- | ------------------------------- |
| `singletonObjects`              | service2$$EnhancerBySpringCGLIB |
| `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
| `singletonFactories`            |                                 |
| `singletonsCurrentlyInCreation` | service1                        |
| `earlyProxyReferences`          | service1                        |

���ˣ�`service2` ��ȡ��ɣ����������Ǽ��� `service1` �Ļ�ȡ���̡�

### 6 ���� `service1` �Ļ�ȡ����

�ڵ� 2 ���У���Ϊ `servic1` ��Ҫע�� `service2`�������˵� 3 �ڻ�ȡ `service2` �����̣�Ȼ���־���һϵ�еĲ����������ڵ� 5 �ڳɹ��ػ�ȡ���� `service2` �Ĵ������ `service2$$EnhancerBySpringCGLIB`������� `service2` �����������ע�롣

�������������������� 2 �ڣ��ص� `AbstractAutowireCapableBeanFactory#doCreateBean` ���������� `service1` �����̡�

#### 6.1 �ص� `AbstractAutowireCapableBeanFactory#doCreateBean`

�������£�

```
protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, 
            final @Nullable Object[] args) throws BeanCreationException {

        // ����Ĵ����� 3.1 ���Ѿ��������ˣ��Ͳ��ٷ�����
        ...

        Object exposedObject = bean;
        try {
            // 1\. ��������װ��, Ҳ�������ǳ���˵������ע��
            populateBean(beanName, mbd, instanceWrapper);
            // 2\. ��ʼ����������ᴦ�� aop ����
            exposedObject = initializeBean(beanName, exposedObject, mbd);
        }
        catch (Throwable ex) {
            ...
        }

        //ͬ���ģ��������ѭ������
        if (earlySingletonExposure) {
            // 3\. �ӻ����л�ȡ beanName ��Ӧ��bean
            Object earlySingletonReference = getSingleton(beanName, false);
            // 4\. earlySingletonReference ��Ϊ null��if ��������ݻ�ִ��
            if (earlySingletonReference != null) {
                if (exposedObject == bean) {
                    // 5\. �����صĶ���ֵ�� exposedObject�����ض���Ϊ�������
                    exposedObject = earlySingletonReference;
                }
            }
        }

        // ʡ�Բ���Ҫ�Ĵ���
        ...

        return exposedObject;
    }

```

����˵�����£�

1. ��������ע�룬�������ﴥ���˵� 3 �ڵ����̣�ִ����õ��� `service1` ���£�

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-3883285be5904e056bc517d35bfd44c47a0.png)

   ���Կ�����`service1` �Ѿ����������ע�룬�Ҵ�ʱע�뵽 `service1` �е� `service2` �Ѿ��Ǵ�������ˣ����� `service1` ��ʱ����ԭʼ�������Ǽ������¿���

2. ��ʼ����������ᴦ�� aop ������ִ�� aop �ķ���Ϊ `AbstractAutoProxyCreator#postProcessAfterInitialization`���������£�

   ```
   // �����beanΪservice1��beanNameΪ��service1��
   public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
       if (bean != null) {
           Object cacheKey = getCacheKey(bean.getClass(), beanName);
           // 1\. earlyProxyReferences ���� service1��if��Ĵ��벻��ִ�е�
           if (this.earlyProxyReferences.remove(cacheKey) != bean) {
               // 2\. �����ﴦ��aop������service1 �Ѿ�ִ�й�aop��
               return wrapIfNecessary(bean, beanName, cacheKey);
           }
       }
       return bean;
   }
   
   ```

   ���ϴ����ȴ� `earlyProxyReferences` �Ƴ� `service1`��Ȼ�����봫��� bean ���Ƚϣ������� 5 ��ṹ�е����ݣ����Ƿ��� `service1` ��ʱ���� `earlyProxyReferences` �У�

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              | service2$$EnhancerBySpringCGLIB |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            |                                 |
   | `singletonsCurrentlyInCreation` | service1                        |
   | `earlyProxyReferences`          | service1                        |

   ��ˣ�����᷵�� `service1`��if �еĴ��벻��ִ�С�ִ������һ����5 ���ṹ�е�����Ϊ��

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              | service2$$EnhancerBySpringCGLIB |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            |                                 |
   | `singletonsCurrentlyInCreation` | service1                        |
   | `earlyProxyReferences`          |                                 |

3. �ӻ����л�ȡ beanName ��Ӧ�� bean��ִ�е��� `DefaultSingletonBeanRegistry#getSingleton(String, boolean)`���������£�

   ```
   /**
    * beanName: service1
    * allowEarlyReference��false
    */
   protected Object getSingleton(String beanName, boolean allowEarlyReference) {
       // 1\. ��һ�������л�ȡ service1����ȡ����������null
       Object singletonObject = this.singletonObjects.get(beanName);
       // 2\. �ж� service1 �Ƿ��ڴ����У�����true��ִ��if�еĴ���
       if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
           synchronized (this.singletonObjects) {
               // 3\. �Ӷ��������л�ȡ service1���ܻ�ȡ��
               singletonObject = this.earlySingletonObjects.get(beanName);
               // 4\. singletonObject ��Ϊnull��if��Ĵ��벻��ִ��
               if (singletonObject == null && allowEarlyReference) {
                   ...
               }
           }
       }
       return singletonObject;
   }
   
   ```

   ���ǿ� һ�� 5 ��ṹ�е����ݣ������������ִ�о�һĿ��Ȼ�ˣ�

   | �ṹ                            | ����                            |
      | ------------------------------- | ------------------------------- |
   | `singletonObjects`              | service2$$EnhancerBySpringCGLIB |
   | `earlySingletonObjects`         | service1$$EnhancerBySpringCGLIB |
   | `singletonFactories`            |                                 |
   | `singletonsCurrentlyInCreation` | service1                        |
   | `earlyProxyReferences`          |                                 |

   ������ִ�У��ڴ������Ѿ�ע�͵ú������ˣ��Ͷ�˵�ˣ���һ����� `service1` �Ĵ�����󷵻أ�

4. ��һ���õ��� `earlySingletonReference` Ϊ

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-425636328820897c75890f01614d94fe9dd.png)

   ��������Ѿ��������ˣ����Լ���ִ�� if ��Ĵ����ˣ�

5. ���һ���Ǹ�ֵ�����������صĶ���ֵ�� `exposedObject`��Ȼ�󷵻� `exposedObject`�����շ��صĶ���Ϊ `service1` �Ĵ������

������һ����`service1` �Ĵ������Ҳ��ȡ����ˡ�

#### 6.2 �ص� `DefaultSingletonBeanRegistry#getSingleton(String, ObjectFactory<?>)`

��һ���Ĳ���������һЩ���棬�Ͳ��ٷ����ˣ����� 5 ���ṹ�е��������£�

| �ṹ                            | ����                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `singletonObjects`              | service2<nobr aria-hidden="true">EnhancerBySpringCGLIB,service1</nobr><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mo>,</mo><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mi>?</mi><mn>1</mn></math><mi>E</mi><mi>n</mi><mi>h</mi><mi>a</mi><mi>n</mi><mi>c</mi><mi>e</mi><mi>r</mi><mi>B</mi><mi>y</mi><mi>S</mi><mi>p</mi><mi>r</mi><mi>i</mi><mi>n</mi><mi>g</mi><mi>C</mi><mi>G</mi><mi>L</mi><mi>I</mi><mi>B</mi><mo>,</mo><mi>s</mi><mi>e</mi><mi>r</mi><mi>v</mi><mi>i</mi><mi>c</mi><mi>e</mi><mn>1</mn></math>" role="presentation">EnhancerBySpringCGLIB |
| `earlySingletonObjects`         |                                                              |
| `singletonFactories`            |                                                              |
| `singletonsCurrentlyInCreation` |                                                              |
| `earlyProxyReferences`          |                                                              |

ͨ�����ԣ��鿴�õ� `singletonObjects` �ж������£�

1. service1

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b6ba35a7a701056ae55a8f9b2ef9345cac5.png)

2. service2

   ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-563d6e323ef8fc5e9fd02f7a938ddbac655.png)

���Կ�����`singletonObjects` �����߶��Ǵ�����󣬱˴�ע��ģ�Ҳ�Ǵ������ѭ�������õ��˽����

### 4\. �ܽ�

spring ѭ�������ķ���������ͽ����ˣ�ѭ�������н�ĺ�������**���������ǰ���� aop**��spring ����������һ�㣬����� 5 ��ṹ�洢��Ҫ����Ϣ��һ�������ѭ���������⡣

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4815992](https://my.oschina.net/funcy/blog/4815992) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
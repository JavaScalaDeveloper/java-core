������ `ConfigurationClassPostProcessor` �����ĵڶ�ƪ����Ҫ�Ƿ��� spring �� `@Bean` ע��Ĵ������̡�

## 3\. spring ����δ��� `@Bean` ע��ģ�

�н����ģ����Ǽ������� spring �� `@Bean` ע��Ĵ������̡�

### 3.1 demo ׼��

Ϊ��˵�����⣬����ֱ���ϴ��룺

����׼������ Bean:

```
public class BeanObj1 {
    public BeanObj1() {
        System.out.println("����beanObj1�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj1{}";
    }
}

public class BeanObj2 {
    public BeanObj2() {
        System.out.println("����beanObj2�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj2{}";
    }
}

```

ע�⣺���������඼û�� `Component`��`@Service` ��ע�⡣

��׼��һ�������࣬ͨ�� `@Bean` ע��ķ����������� bean��

```
@Component
public class BeanConfigs {

    @Bean
    public BeanObj1 beanObj1() {
        return new BeanObj1();
    }

    @Bean
    public BeanObj2 beanObj2() {
        // ��������� beanObj1() ����
        beanObj1();
        return new BeanObj2();
    }

}

```

����������ࣺ

```
@ComponentScan
public class Demo02Main {

    public static void main(String[] args) {
        ApplicationContext context 
                = new AnnotationConfigApplicationContext(Demo02Main.class);
        Object obj1 = context.getBean("beanObj1");
        Object obj2 = context.getBean("beanObj2");
        System.out.println("obj1:" + obj1);
        System.out.println("obj2:" + obj2);
        System.out.println(context.getBean("beanConfigs"));
    }
}

```

������ ���룬�����¼�����Ҫ˵����

*   `BeanConfigs` ��ʹ�õ�ע����� `@Component`������[��һƪ����](https://my.oschina.net/funcy/blog/4836178)�ķ�����`@Component` Ҳ���������࣬��������ͬ `@Configuration` ע�⣻
*   �� `Demo02Main` �У����� `AnnotationConfigApplicationContext` ��Ϊ `Demo02Main`��������һ��ע�� `@ComponentScan`�����ע��ûָ����ɨ��·��������[��һƪ����](https://my.oschina.net/funcy/blog/4836178)�ķ�������ָ����ɨ��·����spring ��Ĭ��ɨ�����������ڰ���
*   ���ǲ�û��ֱ�Ӱ� `BeanConfigs` ע�ᵽ�����У��� `new AnnotationConfigApplicationContext(BeanConfigs.class)` ����������[��һƪ����](https://my.oschina.net/funcy/blog/4836178)�ķ�����֪��spring ���Ƚ��� `Demo02Main` �࣬�������ϵ� `@Component` ע�⣬�Ӷ�ɨ�赽 `BeanConfigs` �࣬Ȼ������ `BeanConfigs`�������ڲ��� `@Bean` ����������������ǽ�����Ҳ��ͨ�����Եķ�ʽ������֤��

�������ϴ��룬������£�

```
����beanObj1�Ĺ��췽��
����beanObj1�Ĺ��췽��
����beanObj2�Ĺ��췽��
obj1:BeanObj1{}
obj2:BeanObj2{}
org.springframework.learn.explore.demo05.BeanConfigs@2b71e916

```

��������������� demo ���з�����

**ע��**�������� `ConfigurationClassPostProcessor` �����ĵڶ�ƪ������[��һƪ](https://my.oschina.net/funcy/blog/4836178)��ͬ�Ĵ��룬����ֻһ�ʴ����������ٽ�����ϸ������

### 3.2 ���������ࣺConfigurationClassPostProcessor#processConfigBeanDefinitions

����ֱ�ӽ��� `ConfigurationClassPostProcessor#processConfigBeanDefinitions` ���������������£�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(Class)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
      #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)
    |-PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors
     |-ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
      |-ConfigurationClassPostProcessor#processConfigBeanDefinitions

```

��ʱ�� `candidates` ֻ��һ�� Ԫ�أ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0d50f32d5ea1d2b79b8e17612d30693f753.png)

### 3.2 ���� `demo02Main`��ConfigurationClassParser#doProcessConfigurationClass

��һ����ǽ��� `@ComponentScan` ע��Ĺ��̣�[��һƪ](https://my.oschina.net/funcy/blog/4836178)����ϸ������������ֻ��������ջ��

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(Class)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
      #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)
    |-PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors
     |-ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
      |-ConfigurationClassPostProcessor#processConfigBeanDefinitions
       |-ConfigurationClassParser#parse(Set<BeanDefinitionHolder>)
        |-ConfigurationClassParser#parse(AnnotationMetadata, String)
          |-ConfigurationClassParser#processConfigurationClass
           |-ConfigurationClassParser#doProcessConfigurationClass

```

���� `Demo02Main` �� `@ComponentScan` ֮�󣬿��Կ��� `beanConfigs` �Ѿ�ɨ�赽�ˣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-7fef6007424562f63dda7f2a0b25e9c293b.png)

���� `beanConfigs` �������࣬��˻������н�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fba3821df9cf2926b16bd064cf164e83471.png)

���ջ��ǻ�ص� `ConfigurationClassParser#doProcessConfigurationClass`�����еĵ��������£�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(Class)
 |-AbstractApplicationContext#refresh
  |-AbstractApplicationContext#invokeBeanFactoryPostProcessors
   |-PostProcessorRegistrationDelegate
      #invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory, List)
    |-PostProcessorRegistrationDelegate#invokeBeanDefinitionRegistryPostProcessors
     |-ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
      |-ConfigurationClassPostProcessor#processConfigBeanDefinitions
       |-ConfigurationClassParser#parse(Set<BeanDefinitionHolder>)
        |-ConfigurationClassParser#parse(AnnotationMetadata, String)
          |-ConfigurationClassParser#processConfigurationClass
           |-ConfigurationClassParser#doProcessConfigurationClass
            |-ConfigurationClassParser#parse(String, String)
             |-ConfigurationClassParser#processConfigurationClass
              |-ConfigurationClassParser#doProcessConfigurationClass

```

��ʱ�� `ConfigurationClassParser#doProcessConfigurationClass`�����ǾͲ����� `demo02Main`������ `beanConfigs` �ˡ�

### 3.3 ���� `beanConfigs`��ConfigurationClassParser#doProcessConfigurationClass

���������������� `ConfigurationClassParser#doProcessConfigurationClass` �� `@Bean` ע��Ĵ����������£�

```
/**
 * �����������������������ķ���
 */
protected final SourceClass doProcessConfigurationClass(ConfigurationClass configClass, 
        SourceClass sourceClass) throws IOException {
    // 1\. ����� @Component ע�⣬�ݹ鴦���ڲ��࣬���Ĳ���ע
    ...

    // 2\. ����@PropertySourceע�⣬���Ĳ���ע
    ...

    // 3\. ���� @ComponentScan/@ComponentScans ע�⣬���Ĳ���ע
    ...

    // 4\. ����@Importע�⣬���Ĳ���ע
    ...

    // 5\. ����@ImportResourceע�⣬���Ĳ���ע
    ...

    // 6\. ����@Bean��ע��
    // ����Ľ�������
    Set<MethodMetadata> beanMethods = retrieveBeanMethodMetadata(sourceClass);
    for (MethodMetadata methodMetadata : beanMethods) {
        // ��ӵ� configClass �У������ٴ���
        configClass.addBeanMethod(new BeanMethod(methodMetadata, configClass));
    }

    // 7\. ����������ĸ��࣬���� processConfigurationClass(...) ��������һ��ѭ��ʱ����
    ...
    return null;
}

```

��ȡ `@Bean` �ķ������õ��� `retrieveBeanMethodMetadata(...)`�����Ǹ���ȥ��

```
private Set<MethodMetadata> retrieveBeanMethodMetadata(SourceClass sourceClass) {
    AnnotationMetadata original = sourceClass.getMetadata();
    // ��ȡ���� @Bean ע��ķ���
    Set<MethodMetadata> beanMethods = original.getAnnotatedMethods(Bean.class.getName());
    ...
    return beanMethods;
}

```

�ٸ���ȥ�����յ��õ��� `StandardAnnotationMetadata#getAnnotatedMethods`:

```
public Set<MethodMetadata> getAnnotatedMethods(String annotationName) {
    Set<MethodMetadata> annotatedMethods = null;
    if (AnnotationUtils.isCandidateClass(getIntrospectedClass(), annotationName)) {
        try {
            // 1\. ͨ��������Ļ�ȡ���еķ���
            Method[] methods = ReflectionUtils.getDeclaredMethods(getIntrospectedClass());
            for (Method method : methods) {
                // 2\. �ж��Ƿ��� @Bean ע��
                if (isAnnotatedMethod(method, annotationName)) {
                    if (annotatedMethods == null) {
                        annotatedMethods = new LinkedHashSet<>(4);
                    }
                    annotatedMethods.add(new StandardMethodMetadata(
                        method, this.nestedAnnotationsAsMap));
                }
            }
        }
        catch (Throwable ex) {
            throw new IllegalStateException(������);
        }
    }
    return annotatedMethods != null ? annotatedMethods : Collections.emptySet();
}

```

��������ܺ���⣬�ؼ���������

1.  ͨ�������ȡ�������з�����
2.  �����õ��ķ�������һ�жϸ÷����Ƿ��� `@Bean` ע�⣻

�������`beanConfigs` �е������������ڻ�ȡ���ˣ������� `ConfigurationClass` ����� `beanMethods` ���ԣ���

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-121f4d518fa57c8932e6b7fd3e7def8704b.png)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a4d91c1f52703b8c911bdb9d9afaf697d92.png)

### 3.4 ���� `@Bean` ��ǵķ������ص� `BeanDefinitionMap`

�����ȡ���� `beanMethod` ��ʱ��ֻ���� `ConfigurationClass` ����� `beanMethods` �����У���û�м��ص� `beanFactory` �� `BeanDefinitionMap` �У���С����̽���������Ǻ�ʱ���뵽 `BeanDefinitionMap` �С�

���ǵ� `ConfigurationClassPostProcessor#processConfigBeanDefinition` ����������ôһ�д��룺

```
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    ...
    // �����ν�������
    // �� @Import ������ࡢ�������д�@Bean�ķ�����@ImportResource �������Դ��ת����BeanDefinition
    this.reader.loadBeanDefinitions(configClasses);
    ...
}

```

����Ǽ�������� `BeanDefinition` �ĵط������� `@Import` ������ࡢ�������д� `@Bean` �ķ�����`@ImportResource` �������Դ��ת���� `BeanDefinition`�������ص��ע `@Bean` �����Ĵ����������£�

> ConfigurationClassBeanDefinitionReader

```
    public void loadBeanDefinitions(Set<ConfigurationClass> configurationModel) {
        TrackedConditionEvaluator trackedConditionEvaluator = new TrackedConditionEvaluator();
        // ����������� configurationModel
        for (ConfigurationClass configClass : configurationModel) {
            loadBeanDefinitionsForConfigurationClass(configClass, trackedConditionEvaluator);
        }
    }

    /**
     * �����������ظ��� ConfigurationClass ����� BeanDefinition
     * 1\. @Import �������
     * 2\. �������е� @Bean ����
     * 3\. @ImportResource �������Դ
     * 4\. @Import ����� ImportBeanDefinitionRegistrar
     */
    private void loadBeanDefinitionsForConfigurationClass(
            ConfigurationClass configClass, TrackedConditionEvaluator trackedConditionEvaluator) {

        if (trackedConditionEvaluator.shouldSkip(configClass)) {
            ...
        }

        // ���� @Import �����������
        if (configClass.isImported()) {
            registerBeanDefinitionForImportedConfigurationClass(configClass);
        }
        // ���� @Bean ����
        for (BeanMethod beanMethod : configClass.getBeanMethods()) {
            loadBeanDefinitionsForBeanMethod(beanMethod);
        }
        // ���� @ImportResource �������Դ
        loadBeanDefinitionsFromImportedResources(configClass.getImportedResources());
        // ���� @Import ����� ImportBeanDefinitionRegistrar
        loadBeanDefinitionsFromRegistrars(configClass.getImportBeanDefinitionRegistrars());
    }

    /**
     * ���� @Bean ����
     * 1\. ����BeanDefinition��beanMethod ʹ�õ��� ConfigurationClassBeanDefinition
     * 2\. ���� @Bean �ĸ������ԣ����õ� BeanDefinition ��
     * 3\. �� BeanDefinition ע�ᵽ beanFactory ��
     */
    private void loadBeanDefinitionsForBeanMethod(BeanMethod beanMethod) {
        ConfigurationClass configClass = beanMethod.getConfigurationClass();
        MethodMetadata metadata = beanMethod.getMetadata();
        String methodName = metadata.getMethodName();

        ...

        // 1\. beanMethodʹ�õ���ConfigurationClassBeanDefinition
        ConfigurationClassBeanDefinition beanDef = 
                new ConfigurationClassBeanDefinition(configClass, metadata);
        beanDef.setResource(configClass.getResource());
        beanDef.setSource(this.sourceExtractor.extractSource(metadata, configClass.getResource()));

        // 2\. ���� @Bean �ĸ�������
        if (metadata.isStatic()) {
            // ��̬ @Bean ����
            if (configClass.getMetadata() instanceof StandardAnnotationMetadata) {
                beanDef.setBeanClass(
                    ((StandardAnnotationMetadata) configClass.getMetadata()).getIntrospectedClass());
            }
            else {
                beanDef.setBeanClassName(configClass.getMetadata().getClassName());
            }
            beanDef.setUniqueFactoryMethodName(methodName);
        }
        else {
            // ��ͨ�� @Bean ����
            beanDef.setFactoryBeanName(configClass.getBeanName());
            beanDef.setUniqueFactoryMethodName(methodName);
        }

        if (metadata instanceof StandardMethodMetadata) {
            beanDef.setResolvedFactoryMethod(
                ((StandardMethodMetadata) metadata).getIntrospectedMethod());
        }

        beanDef.setAutowireMode(AbstractBeanDefinition.AUTOWIRE_CONSTRUCTOR);
        beanDef.setAttribute(
                org.springframework.beans.factory.annotation.RequiredAnnotationBeanPostProcessor.
                SKIP_REQUIRED_CHECK_ATTRIBUTE, Boolean.TRUE);

        AnnotationConfigUtils.processCommonDefinitionAnnotations(beanDef, metadata);

        Autowire autowire = bean.getEnum("autowire");
        if (autowire.isAutowire()) {
            beanDef.setAutowireMode(autowire.value());
        }

        boolean autowireCandidate = bean.getBoolean("autowireCandidate");
        if (!autowireCandidate) {
            beanDef.setAutowireCandidate(false);
        }

        String initMethodName = bean.getString("initMethod");
        if (StringUtils.hasText(initMethodName)) {
            beanDef.setInitMethodName(initMethodName);
        }

        String destroyMethodName = bean.getString("destroyMethod");
        beanDef.setDestroyMethodName(destroyMethodName);

        ...

        // 3\. ��BeanDefinitionע�ᵽbeanFactory��
        this.registry.registerBeanDefinition(beanName, beanDefToRegister);
    }

```

`ConfigurationClassBeanDefinitionReader#loadBeanDefinitions` �ֵ������������������մ������� `ConfigurationClassBeanDefinitionReader#loadBeanDefinitionsForBeanMethod`���ⲿ���߼����£�

1.  ��������� `configClass` ���ϣ���ÿ�� `configClass` ���� `Definitions` ���ش���
2.  �� `configClass` ���� `Definitions` ���ش���ʱ������һ���� `@Import`/`@Bean`/`@ImportResource` ��ע�⣬��С�����ǽ���ע `@Bean` �Ĵ���
3.  ���� `@Bean` ����ʱ���ȴ��� `BeanDefinition`(`@Bean` ������Ӧ�� `BeanDefinition` �� `ConfigurationClassBeanDefinition`)��Ȼ����� `@Bean` �����ԣ����õ� `BeanDefinition` �У������ǰ� `BeanDefinition` ע�ᵽ `beanFactory` ��.

�� �ˣ�ִ���� `ConfigurationClassBeanDefinitionReader#loadBeanDefinitions` ��`BeanDefinition` �ͼ��ص� `beanFactory` �ˣ���Ӧ�� `BeanDefinition` ������ `ConfigurationClassBeanDefinition`.

### 3.5 `@Bean` ����ʵ��

ʵ���Ĵ�������ͬ��ͨ�� `@Component` ��һ�£���ͬ������ͨ�� `@Component` ����õ��ǹ��췽������ `@Bean` ʹ�õ��� `factoryMethod`���������£�

> AbstractAutowireCapableBeanFactory#createBeanInstance

```
/**
 * ʵ���Ĵ�����ʽ
 * 1\. ʹ�� instanceSupplier��Supplier��java8�ṩ���࣬���Դ���һ��lambda���ʽ
 * 2\. ʹ�ù����������� @Bean ע���Ӧ�ķ���
 * 3\. ʹ�õ��ǹ��췽��ע�룬�����췽������ @Autowired ע��
 * 4\. ���췽��ע�룬�������޲ι��죬Ҳ�������вι���
 *
 */
protected BeanWrapper createBeanInstance(String beanName, 
        RootBeanDefinition mbd, @Nullable Object[] args) {
    // ȷ���Ѿ������˴� class
    Class<?> beanClass = resolveBeanClass(mbd, beanName);
    ...

    // �Ƿ�������bean������Supplier��Supplier��java8�ṩ���࣬���Դ���һ��lambda���ʽ
    // ���� AbstractBeanDefinition#setInstanceSupplier ָ��
    Supplier<?> instanceSupplier = mbd.getInstanceSupplier();
    if (instanceSupplier != null) {
        return obtainFromSupplier(instanceSupplier, beanName);
    }
    if (mbd.getFactoryMethodName() != null) {
        // ���ù�������ʵ����
        return instantiateUsingFactoryMethod(beanName, mbd, args);
    }
    // �Ƿ��һ��
    boolean resolved = false;
    // �Ƿ���ù��캯��ע��
    boolean autowireNecessary = false;
    ...
    if (resolved) {
        if (autowireNecessary) {
            return autowireConstructor(beanName, mbd, null, null);
        }
        else {
            // �޲ι��캯��
            return instantiateBean(beanName, mbd);
        }
    }
    // Candidate constructors for autowiring?
    // �ж��Ƿ�����вι��캯��
    Constructor<?>[] ctors = determineConstructorsFromBeanPostProcessors(
            beanClass, beanName);
    if (ctors != null || mbd.getResolvedAutowireMode() == AUTOWIRE_CONSTRUCTOR ||
            mbd.hasConstructorArgumentValues() || !ObjectUtils.isEmpty(args)) {
        return autowireConstructor(beanName, mbd, ctors, args);
    }
    ctors = mbd.getPreferredConstructors();
    if (ctors != null) {
        // ���캯������ע��
        return autowireConstructor(beanName, mbd, ctors, null);
    }
    // �����޲ι��캯��
    return instantiateBean(beanName, mbd);
}

```

�Ӵ�����������spring ʵ������ķ�ʽ�� 4 �֣�

1.  ʹ�� `instanceSupplier`��`Supplier` �� `java8` �ṩ���࣬���Դ���һ�� `lambda` ���ʽ
2.  ʹ�ù����������� `@Bean` ע���Ӧ�ķ���
3.  ʹ�õ��ǹ��췽��ע�룬�����췽������ `@Autowired` ע��
4.  ���췽��ע�룬�������޲ι��죬Ҳ�������вι���

����������Ҫ��ע `@Bean` ��ʵ����ʽ��Ҳ���ǹ�������ʵ������ʽ�����ǽ�ȥ���£�

```
public BeanWrapper instantiateUsingFactoryMethod(String beanName, 
             RootBeanDefinition mbd, @Nullable Object[] explicitArgs) {
    BeanWrapperImpl bw = new BeanWrapperImpl();
    this.beanFactory.initBeanWrapper(bw);
    Object factoryBean;
    Class<?> factoryClass;
    boolean isStatic;
    String factoryBeanName = mbd.getFactoryBeanName();
    if (factoryBeanName != null) {
        factoryBean = this.beanFactory.getBean(factoryBeanName);
        factoryClass = factoryBean.getClass();
        isStatic = false;
    }
    ...

    Method factoryMethodToUse = null;
    ArgumentsHolder argsHolderToUse = null;
    Object[] argsToUse = null;
    // ���� factoryMethod �Ĳ���
    if (explicitArgs != null) {
        argsToUse = explicitArgs;
    }
    else {
        ...
    }

    if (factoryMethodToUse == null || argsToUse == null) {
        factoryClass = ClassUtils.getUserClass(factoryClass);
        List<Method> candidates = null;
        if (mbd.isFactoryMethodUnique) {
            if (factoryMethodToUse == null) {
                factoryMethodToUse = mbd.getResolvedFactoryMethod();
            }
            if (factoryMethodToUse != null) {
                candidates = Collections.singletonList(factoryMethodToUse);
            }
        }
        // ʡ���˺ö����
        ...
    }
    bw.setBeanInstance(instantiate(beanName, mbd, 
            factoryBean, factoryMethodToUse, argsToUse));
    return bw;
}

```

���Ϸ����Ǿ������Ĵ��룬ԭ����������Ƚ϶࣬�󲿷ִ��������ڴ��� `argsToUse` �� `factoryMethodToUse` ������ϸ�ڷǳ��࣬�Ͳ�չ�������ˣ�����������Ҫ��ע���¼���������

1.  `factoryBean`�� `@Bean` �����������ʵ���������� `beanConfig`;
2.  `factoryMethodToUse`: ʵ�������õķ�����Ҳ���Ǳ� `@Bean` ע��ķ����������� `BeanConfigs#beanObj1`;
3.  `argsToUse`���� `@Bean` ע��ķ���Ҫ�õĲ��������� `BeanConfigs#beanObj1` û��ָ�������������� null;

��������������������ʵ�����ı�����ʵ������ʽ����Ҳ���뵽�ˣ�ʵ�����������������������ˣ����������ǵ��÷������ʵ�����ˣ�

> ConstructorResolver#instantiate(...)

```
private Object instantiate(String beanName, RootBeanDefinition mbd,
        @Nullable Object factoryBean, Method factoryMethod, Object[] args) {
    try {

        return this.beanFactory.getInstantiationStrategy().instantiate(
                mbd, beanName, this.beanFactory, factoryBean, factoryMethod, args);
    }
    catch (Throwable ex) {
        ...
    }
}

```

> SimpleInstantiationStrategy#instantiate(...)

```
@Override
public Object instantiate(RootBeanDefinition bd, @Nullable String beanName, BeanFactory owner,
        @Nullable Object factoryBean, final Method factoryMethod, Object... args) {
    try {
        ...
        try {
            currentlyInvokedFactoryMethod.set(factoryMethod);
            // ������൱�ڵ��� beanConfigs.beanObj1()
            Object result = factoryMethod.invoke(factoryBean, args);
            if (result == null) {
                result = new NullBean();
            }
            return result;
        }
        finally {
            ...
        }
    }
    catch (...) {
        ...
    }
}

```

�������� `SimpleInstantiationStrategy#instantiate(...)` �����н��з���ʵ�����ˣ�

ʵ������ɺ󣬺�������ע�롢��ʼ���ȶ�����ͨ�� spring bean һ�£�����Ͳ��ٷ����ˡ�

### 3.6 `@Configuration` �� `@Bean` ���ʹ��

��������� `@Component` �� `@Bean` ʹ��ʱ�Ĵ����������

```
@Component
public class BeanConfigs {
    @Bean
    public Xxx xxx() {
        ...
    }
}

```

ʵ���ϣ���������������ʹ�õ��� `@Configuration` �� `@Bean` ����ϣ�

```
@Configuration
public class BeanConfigs {
    @Bean
    public Xxx xxx() {
        ...
    }
}

```

��������ǰ��ʹ�õ� `@Component` �кβ���أ��������Ǿ��������¡�

#### 1\. demo ׼��

demo ׼����

```
//@Component
@Configuration
public class BeanConfigs {

    @Bean
    public BeanObj1 beanObj1() {
        return new BeanObj1();
    }

    @Bean
    public BeanObj2 beanObj2() {
        // ��������� beanObj1() ����
        beanObj1();
        return new BeanObj2();
    }

}

```

��� demo ����ֻ�ǽ� `@Component` �滻Ϊ `@Configuration`��ִ���£�������£�

```
����beanObj1�Ĺ��췽��
����beanObj2�Ĺ��췽��
obj1:BeanObj1{}
obj2:BeanObj2{}
org.springframework.learn.explore.demo02.BeanConfigs$$EnhancerBySpringCGLIB$$dca1c55b@75c072cb

```

���������������ǽ�֮ǰ��ִ��Ҳ�������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-88e5047479e4f30e70d09397d2631c0c6a5.png)

�����Ƚϣ�������������ͬ��

1.  `beanObj1` �Ĺ��췽����������һ�Σ�
2.  `beanConfigs` ��Ӧ������ `BeanConfigs$$EnhancerBySpringCGLIB$$dca1c55b@75c072cb`��˵������һ���������ʹ���� cglib ����

ʵ���ϣ�����������ͬ�㶼���Թ��Ϊһ��ԭ��spring �� `beanConfigs` �����˴������� `BeanConfigs#beanObj1` ʵ�ʵ��õ��Ǵ��������� **spring ��Ա� `@Configuration` ��ǵ������ cglib ����**��

��ô��������ô���������е��أ����Ǽ���̽����

#### 2\. ������Ĵ�����`ConfigurationClassPostProcessor#enhanceConfigurationClasses`

��[��һƪ����](https://my.oschina.net/funcy/blog/4836178)�Ŀ�ƪ�����Ǿ��ᵽ�� `ConfigurationClassPostProcessor` ��ִ��ʱ����õ�����������`processConfigBeanDefinitions(...)` �� `enhanceConfigurationClasses(...)`��`processConfigBeanDefinitions(...)` ������ spring �� `@Import`��`@Configuration` ��ע��Ľ�����ǰ���Ѿ��������ˣ��� `enhanceConfigurationClasses(...)` ���Ǳ� `@Configuration` ��ǵ����������Ĺؼ����ڣ�

`enhanceConfigurationClasses(...)` �����������£�

> ConfigurationClassPostProcessor#enhanceConfigurationClasses

```
public void enhanceConfigurationClasses(ConfigurableListableBeanFactory beanFactory) {
    Map<String, AbstractBeanDefinition> configBeanDefs = new LinkedHashMap<>();
    for (String beanName : beanFactory.getBeanDefinitionNames()) {
        BeanDefinition beanDef = beanFactory.getBeanDefinition(beanName);
        Object configClassAttr = beanDef.getAttribute(
            ConfigurationClassUtils.CONFIGURATION_CLASS_ATTRIBUTE);
        ...
        // 1\. �ж��Ƿ�Ϊһ��ȫ������
        if (ConfigurationClassUtils.CONFIGURATION_CLASS_FULL.equals(configClassAttr)) {
            ...
            configBeanDefs.put(beanName, (AbstractBeanDefinition) beanDef);
        }
    }
    // ȫ�����ࣺ�������
    ConfigurationClassEnhancer enhancer = new ConfigurationClassEnhancer();
    for (Map.Entry<String, AbstractBeanDefinition> entry : configBeanDefs.entrySet()) {
        AbstractBeanDefinition beanDef = entry.getValue();
        beanDef.setAttribute(AutoProxyUtils.PRESERVE_TARGET_CLASS_ATTRIBUTE, Boolean.TRUE);
        // ���� BeanClass
        Class<?> configClass = beanDef.getBeanClass();
        // 2\. ���� enhancedClass
        Class<?> enhancedClass = enhancer.enhance(configClass, this.beanClassLoader);
        if (configClass != enhancedClass) {
            // 3\. ���� BeanClass��ֵΪenhancedClass
            beanDef.setBeanClass(enhancedClass);
        }
    }
}

```

��������Ƚϼ򵥣��������£�

1.  �ж��������Ƿ�Ϊȫ�����࣬����[��һƪ����](https://my.oschina.net/funcy/blog/4836178)�����У������ᵽ spring ��Ѵ��� `@Configuration` ע���� `proxyBeanMethods != false` ������Ϊ `Full` �����࣬�������Ǹ���ǰ��ı�����жϷ�Ϊȫ�����࣬�����ԣ���ʱ�� `beanConfigs` ����һ��ȫ�����ࣻ
2.  ��ȫ�����࣬������� `configClass` ���ɶ�Ӧ�� `enhancedClass`��
3.  �����ɵ� `enhancedClass` ���õ� `beanDefinition` �� `beanClass` �С�

ִ����˷�����`beanConfigs` ��Ӧ�� `beanDefinition` �� `beanClass` ���Ǵ������ˣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f617fc93f72b13b8f785ccf5a12624dec0b.png)

���洴���� `beanConfigs` ��������������ʵ���ˡ�

#### 3\. ִ�д������ķ���

���ɴ������󣬴����������ִ�е��أ��� spring �����ִ�� `beanConfigs.beanObj1()` ���أ�˵�����������Ҫ̸�� cglib �������ķ���ִ���ˡ�����ֱ��������������ɣ����� `enhancer.enhance(configClass, this.beanClassLoader)`��

```
public Class<?> enhance(Class<?> configClass, @Nullable ClassLoader classLoader) {
    if (EnhancedConfiguration.class.isAssignableFrom(configClass)) {
        return configClass;
    }
    // newEnhancer(...) �������ǹؼ�
    Class<?> enhancedClass = createClass(newEnhancer(configClass, classLoader));
    return enhancedClass;
}

```

�������룺

```
private static final Callback[] CALLBACKS = new Callback[] {
        // �����������֤ @Bean �����ĵ���
        new BeanMethodInterceptor(),
        new BeanFactoryAwareMethodInterceptor(),
        NoOp.INSTANCE
};

// ���� CallbackFilter������Ķ���ΪCallback
private static final ConditionalCallbackFilter CALLBACK_FILTER 
        = new ConditionalCallbackFilter(CALLBACKS);

// ����cglib��ǿ
private Enhancer newEnhancer(Class<?> configSuperClass, @Nullable ClassLoader classLoader) {
    Enhancer enhancer = new Enhancer();
    enhancer.setSuperclass(configSuperClass);
    enhancer.setInterfaces(new Class<?>[] {EnhancedConfiguration.class});
    enhancer.setUseFactory(false);
    enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
    enhancer.setStrategy(new BeanFactoryAwareGeneratorStrategy(classLoader));
    // ��������callbackFilter
    enhancer.setCallbackFilter(CALLBACK_FILTER);
    enhancer.setCallbackTypes(CALLBACK_FILTER.getCallbackTypes());
    return enhancer;
}

```

���� cglib ��������ݣ��� [spring aop ֮ cglib ����](https://my.oschina.net/funcy/blog/4696655)һ��������ϸ�������ˣ��ⲻ�ٷ���������ֱ��˵���ۣ�cglib ִ�д�����ʱ��ִ�е��� `Enhancer` �� `callbackFilter` ���Ե� `MethodInterceptor#intercept` �������� `CALLBACKS` �����е� `BeanMethodInterceptor`���������Ǿ��������������ݣ�

> ConfigurationClassEnhancer.BeanMethodInterceptor

```
private static class BeanMethodInterceptor implements MethodInterceptor, ConditionalCallback {
    @Override
    @Nullable
    public Object intercept(Object enhancedConfigInstance, Method beanMethod, Object[] beanMethodArgs,
                MethodProxy cglibMethodProxy) throws Throwable {
        ConfigurableBeanFactory beanFactory = getBeanFactory(enhancedConfigInstance);
        String beanName = BeanAnnotationHelper.determineBeanNameFor(beanMethod);
        ...
        // ����ǵ��õ�ǰ�� factoryMethod ������ֱ�ӵ��ø���ķ���
        if (isCurrentlyInvokedFactoryMethod(beanMethod)) {
            // ���ø���ķ�����Ҳ����Ŀ�귽��
            return cglibMethodProxy.invokeSuper(enhancedConfigInstance, beanMethodArgs);
        }
        // ����ֱ�ӻ�ȡ beanFactory�����еĶ���
        return resolveBeanReference(beanMethod, beanMethodArgs, beanFactory, beanName);
    }

    private Object resolveBeanReference(Method beanMethod, Object[] beanMethodArgs,
            ConfigurableBeanFactory beanFactory, String beanName) {
        try {
            ...
            // ���õĵ��� beanFactory.getBean(...) ������������������Ѿ��ǳ���Ϥ��
            Object beanInstance = (useArgs ? beanFactory.getBean(beanName, beanMethodArgs) :
                    beanFactory.getBean(beanName));
            ...
            return beanInstance;
        }
        finally {
            ...
        }
    }

    /**
     * �ж��ܷ�ִ�е�ǰ MethodInterceptor
     */
    @Override
    public boolean isMatch(Method candidateMethod) {
        return (candidateMethod.getDeclaringClass() != Object.class &&
                !BeanFactoryAwareMethodInterceptor.isSetBeanFactory(candidateMethod) &&
                BeanAnnotationHelper.isBeanAnnotated(candidateMethod));
    }
}

```

`BeanMethodInterceptor` ʵ���� `MethodInterceptor` �� `ConditionalCallback`��`ConditionalCallback#isMatch` �����жϵ�ǰ `MethodInterceptor` �ܷ�ִ�У�`MethodInterceptor#intercept` ����ִ�еķ������ݣ�ִ���߼�Ϊ��

1.  �����ֱ�ӵ��õ�ǰ�� `factoryMethod` ������ֱ�ӵ��ø���ķ�����Ҳ���� `beanConfigs.beanObj1()`��������̻�ʵ���� `beanObj1` ʱ�����ã�
2.  �������ֱ�ӵ��õ�ǰ�� `factoryMethod` �����������ڱ�ķ����е��ã�������� `beanFactory.getBean(...)` ��ȡ bean��������̻���ʵ���� `beanObj1` ʱ�� �����á�

���Ͼ���Ϊʲô `beanObj1` �Ĺ��췽��ֻ������һ�Σ��Լ�Ϊʲô `beanConfigs` �Ǵ������ԭ�������ˡ�

�������һ�䣬`@Configuration` �ṩ�� `proxyBeanMethods()` ������������ѡ���Ƿ���������Ĵ���Ĭ��ֵ�� true��������������ã�

```
@Configuration(proxyBeanMethods=false)
public class BeanConfigs {
    ...
}

```

`BeanConfigs` �Ͳ�����д����ˣ����н��ͬ `@Component` ע��һ��������Ͳ�չʾ�ˡ�

#### 4\. ����С����

##### 1\. �ڲ���������Ҳ�ܱ�������

��ʾ���У��������������õģ�

```
    @Bean
    public BeanObj2 beanObj2() {
        // ��������� beanObj1() ����
        beanObj1();
        return new BeanObj2();
    }

```

���� `beanObj2()` �е����� `beanObj1()`�����������ڲ��������ã�`beanObj1()` Ҳ�ܱ�������

**�ش�**��cglib ����ĵ��÷��������֣�

```
@Override
public Object intercept(Object proxyObj, Method method, Object[] objects, 
            MethodProxy proxy) throws Throwable {
    // ����1�� ʹ��Ŀ�����ֱ�ӵ���Ŀ�����ķ���
    // return proxy.invoke(target, objects);
    // ����2�� ʹ�ô�����󣬵����丸��ķ���
    return proxy.invokeSuper(proxyObj, objects);
}

```

`beanObj2()` �ĵ���ʹ����`����2`��Ҳ����ʹ�ô��������� `beanObj2()`��`beanObj2()` �� `this` Ϊ�������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-7ef891450ace815d22a5bf5c8e78e65c2db.png)

����� `beanObj2()` ��ֱ�ӵ��� `beanObj1()`�����൱��ʹ�ô��������� `beanObj1()`����Ȼ�ܱ������ˡ�

������ӡ���У��������ڲ����ò��ܱ�����������Ϊ spring �ڴ��� Aop ʱ��ʹ�õ��Ƿ��� 1 �ĵ��÷�ʽ����ʱ�� `this` Ϊԭʼ���󣬵�Ȼ���ܱ������ˡ�

##### 2\. ˽���������ע�룿

���磬����������һ�� `BeanObj3`:

```
@Component
public class BeanObj3 {

    public BeanObj3() {
        System.out.println("����beanObj3�Ĺ��췽��");
    }

    @Override
    public String toString() {
        return "BeanObj3{}";
    }
}

```

Ȼ���� `BeanConfigs` ��ע�룺

```
@Configuration
public class BeanConfigs {

    @Autowired
    private BeanObj3 beanObj3;

    @Bean
    public BeanObj1 beanObj1() {
        return new BeanObj1();
    }

    @Bean
    public BeanObj2 beanObj2() {
        // ��������� beanObj1() ����
        beanObj1();
        System.out.println("beanObj3��" + this.beanObj3);
        return new BeanObj2();
    }

}

```

�� `BeanConfigs` ���Զ�ע���� `beanObj3` ���ԣ�Ȼ���� `beanObj2()` ���ִ�ӡ�� `beanObj3` ���ԡ����У�������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e21bf76da41fcf12e674fa155de4b636253.png)

���Կ�����ע��� `beanObj3` Ҳ�ܻ�ȡ���ˡ�������и������ˣ�`beanObj3` ������Ŀ�����ģ��� `this` �Ǵ�������Ѳ��ɴ���������õ�Ŀ������˽�����ԣ�

���ȣ���ӵ� `beanFactory` �� `beanDefinitionMap` �е����� `BeanConfigs$$EnhancerBySpringCGLIB$$Xxx` �ࣨ�����ࣩ�������� `BeanConfigs`��spring �ڽ�������ע��ʱ������ҵ�ǰ�༰�丸������е�ע�����Խ���ע�룬��ˣ���Ȼ��ӵ� spring �����е� �� `BeanConfigs$$EnhancerBySpringCGLIB$$Xxx` �࣬�� `BeanConfigs` �е� `beanObj3` һ���ᱻע�룬����ԭ������� cglib �Ĵ����ϵ��`BeanConfigs` �� `BeanConfigs$$EnhancerBySpringCGLIB$$Xxx` �ĸ��ࡣ

�� `BeanConfigs$$EnhancerBySpringCGLIB$$Xxx` ��̳� `beanObj3` ����������ֱ�ӿ����н���ɣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-27ebdebfd8c958f1de362ca1b30f2d0fc7c.png)

�������յõ��� `beanConfigs` ���󣬿��Կ��������������һ�� `beanObj3` ���ԣ����һ���ֵ��

### 3.7 �ܽ�

������Ҫ������ `ConfigurationClassPostProcessor` ���� `@Bean` ע��Ĺ��̣��ܽ����£�

1.  ���������࣬ͨ�������ȡ�����������б� `@Bean` ��ǵķ�����
2.  ������Щ�����������װ��һ���� `BeanDefinition` ע�ᵽ `beanFactory` �У���Ӧ `BeanDefinition` ��������Ϊ `ConfigurationClassBeanDefinition`��
3.  �����������ȫ�����࣬������������ cglib ����
4.  ʵ����ʱ��ʹ�÷�����ö�Ӧ�ķ�������ʵ�����õ�ʵ����spring ���ٶ����������ע�롢��ʼ���ȣ���
5.  �ڱ�� `@Bean` �����е��õ�ǰ `@Bean` ����ʱ�������ǰ `@Bean` �������ڵ�����ȫ�����࣬���ȥ `beanFactory` �в��Ҷ�Ӧ�� `bean`(���ҵĹ����ǣ��ҵ��򷵻أ��Ҳ����򴴽��ٷ��أ�**���ص� bean �������� spring bean ����������**)������������� cglib ������ɣ������ǰ `@Bean` �������ڵ��಻��ȫ�����࣬��ᰴ����ͨ�ķ������ã����� bean ��ʵ�����أ�**���ص� bean û�������� spring bean ����������**����

���ĵķ����͵������ˣ����������Ǽ������� `ConfigurationClassPostProcessor` ��������ע������̡�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4492878](https://my.oschina.net/funcy/blog/4492878) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
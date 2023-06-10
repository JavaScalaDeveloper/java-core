![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-07194ddebd25cb2b71ee5e422bf84e8a397.png)

��ǰ��һƪ�����У����Ƿ����� spring �������������̣�����ƪ��ʼ �����ǽ������������е�һЩ�ؼ�������з�����

���������ǻ��ڵ� `demo01`������ֱ�ӽ��� `ApplicationContext context = new AnnotationConfigApplicationContext("org.springframework.learn.demo01");` ��ִ���У�

> AnnotationConfigApplicationContext

```
public AnnotationConfigApplicationContext(String... basePackages) {
    this();
    scan(basePackages);
    refresh();
}

```

�������ֻ�����У�ÿ�д���������� [spring �������̸���](https://my.oschina.net/funcy/blog/4597493 "spring�������̸���")������˵�����������ǽ�����Щ����չ������ϸ������������ݡ�

### 1. `beanFacotry` �Ĵ���

����ֱ�ӽ��� `this()` �������������£�

> AnnotationConfigApplicationContext

```
public AnnotationConfigApplicationContext() {
    // AnnotatedBeanDefinitionReader ���� @Configuration
    this.reader = new AnnotatedBeanDefinitionReader(this);
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}

```

�����Ͽ�������ֻ�����У��������������󡣵���Ϥ java �����﷨�Ķ�֪���������ڵ��ù��췽��ʱ�����ȵ��ø���Ĺ��췽����ִ�����๹�췽���Ĵ��룬��Щ���ǻ���Ҫ��������ĸ��๹�췽��������ʲô��

> GenericApplicationContext

```
public GenericApplicationContext() {
    this.beanFactory = new DefaultListableBeanFactory();
}

```

���Կ���������Ĺ��췽���������һ���£����� `beanFactory`���Դˣ����ǿ���֪����**`AnnotationConfigApplicationContext` ʹ�õ� `BeanFacotry` Ϊ `DefaultListableBeanFactory`**��

�����ٻص� `AnnotationConfigApplicationContext` �Ĺ��췽����

> AnnotationConfigApplicationContext

```
public AnnotationConfigApplicationContext() {
    // AnnotatedBeanDefinitionReader ���� @Configuration
    this.reader = new AnnotatedBeanDefinitionReader(this);
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}

```

���������Ȼֻ�����У�����ȴ��С���������� `new AnnotatedBeanDefinitionReader(this);` ���£��������еķ������ò�����Ҫ��������ṩ��������

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext()
 |-AnnotatedBeanDefinitionReader#AnnotatedBeanDefinitionReader(BeanDefinitionRegistry)
  |-AnnotatedBeanDefinitionReader#AnnotatedBeanDefinitionReader(BeanDefinitionRegistry, Environment)
   |-AnnotationConfigUtils#registerAnnotationConfigProcessors(BeanDefinitionRegistry)
    |-AnnotationConfigUtils#registerAnnotationConfigProcessors(BeanDefinitionRegistry, Object)

```

���Կ����������ǵ����� `AnnotationConfigUtils#registerAnnotationConfigProcessors(BeanDefinitionRegistry, Object)`�����ǲ鿴�¸÷�����Ϊ��ֱ�۲鿴������ʡ���˲���Ҫ�Ĵ��룬���ǽ���ע��Ҫ�����̼��ɣ�

```
public static Set<BeanDefinitionHolder> registerAnnotationConfigProcessors(
        BeanDefinitionRegistry registry, @Nullable Object source) {
    // ���beanFactory
    DefaultListableBeanFactory beanFactory = unwrapDefaultListableBeanFactory(registry);

    // -------- ��beanFactory����Ӵ�����
    if (beanFactory != null) {
        if (!(beanFactory.getDependencyComparator() instanceof AnnotationAwareOrderComparator)) {
        beanFactory.setDependencyComparator(AnnotationAwareOrderComparator.INSTANCE);
        }
        if (!(beanFactory.getAutowireCandidateResolver() 
                instanceof ContextAnnotationAutowireCandidateResolver)) {
            beanFactory.setAutowireCandidateResolver(new ContextAnnotationAutowireCandidateResolver());
        }
    }

    Set<BeanDefinitionHolder> beanDefs = new LinkedHashSet<>(8);

    // ------------  ��beanFactory�����beanDefinition
    if (!registry.containsBeanDefinition(CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(ConfigurationClassPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, CONFIGURATION_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(AutowiredAnnotationBeanPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, AUTOWIRED_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    // Check for JSR-250 support, and if present add the CommonAnnotationBeanPostProcessor.
    if (jsr250Present && !registry.containsBeanDefinition(COMMON_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(CommonAnnotationBeanPostProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, COMMON_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    // Check for JPA support, and if present add the PersistenceAnnotationBeanPostProcessor.
    if (jpaPresent && !registry.containsBeanDefinition(PERSISTENCE_ANNOTATION_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition();
        try {
            def.setBeanClass(ClassUtils.forName(PERSISTENCE_ANNOTATION_PROCESSOR_CLASS_NAME,
                AnnotationConfigUtils.class.getClassLoader()));
        }
        catch (ClassNotFoundException ex) {
            throw new IllegalStateException(...);
        }
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, PERSISTENCE_ANNOTATION_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(EVENT_LISTENER_PROCESSOR_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(EventListenerMethodProcessor.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, EVENT_LISTENER_PROCESSOR_BEAN_NAME));
    }

    if (!registry.containsBeanDefinition(EVENT_LISTENER_FACTORY_BEAN_NAME)) {
        RootBeanDefinition def = new RootBeanDefinition(DefaultEventListenerFactory.class);
        def.setSource(source);
        beanDefs.add(registerPostProcessor(registry, def, EVENT_LISTENER_FACTORY_BEAN_NAME));
    }
    return beanDefs;
}

```

�������������Ȼ�е㳤��������ȴ�൱ֱ�ף������� `beanFactory` ��� `annotation` ��صĴ�������ʵ���ϣ��� [spring �������̸���](https://my.oschina.net/funcy/blog/4597493 "spring�������̸���")�ᵽ�� beanDefinitionMap �� 4 ��Ĭ�ϵ� beanDefinition ������������ӵģ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a490052bdc1379ef24a7754c65584214c1c.png)

���������ٹ�ע `this.scanner = new ClassPathBeanDefinitionScanner(this)`�����ǳ�ʼ�� `scanner` ��������Ϊ `ClassPathBeanDefinitionScanner`������������Ͽ��Կ����������� `classPath` ��صģ�`beanDefinition` ɨ������ͨ�׵�˵������**ɨ�� classPath ·������ java class �ļ���װ�� `beanDefinition` ����**��

### 2\. �ܽ�

`AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)` �� `this()` ��ִ�оͷ����������ˣ���һ �д�����Ҫ�����⼸���£�

1.  ����������Ϊ `DefaultListableBeanFactory` �� `beanFactory`
2.  ����������Ϊ `AnnotatedBeanDefinitionReader` �� reader�����䴴���Ĺ����У����� `beanFactory` ��� annotation ��صĴ�����
3.  ����������Ϊ `ClassPathBeanDefinitionScanner` �� `scanner`

��������ͼʾ���£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b7a7a01b4d38769419a0e25e8f60037cbb5.png)

���ľ��ȵ������ˣ����������������Ǽ������������Ĵ��롣
![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-be7f7797a27a2dc5ab1ad8d11327b140c90.png)

�����ģ����Ǽ���������

### 6\. ע�� `BeanPostProcessor`: `registerBeanPostProcessors(beanFactory)`

����ʽ����ǰ����Ҫ��ȷ�������

*   `BeanFactoryPostProcessor`������Ϊ `BeanFactory` �ĺ��ô����������Զ� `BeanFactory` ����һЩ������
*   `BeanPostProcessor`������Ϊ `Bean` �ĺ��ô����������Զ� `Bean` ����һЩ������

��Ҫ�����ĵ� `BeanPostProcessor` ��ǰ��� `BeanFactoryPostProcessor` Ū���ˡ�

������Ҫ�Ƕ� `BeanPostProcessor` �� `register` ���� (`registerBeanPostProcessors(beanFactory)`)������ `BeanPostProcessor` ע�ᵽ `BeanFactory` �У���ô��������ʲôʱ���أ���Ȼ�Ƕ� `Bean` �Ĳ�������Ȼ������ bean ֮���������ˡ�

> `BeanPostProcessor` Ҳ�� spring ��һ����Ҫ��������ڸ��������ϸ���������Բο� [spring ���֮ BeanPostProcessors](https://my.oschina.net/funcy/blog/4597551)

�ϻ�����˵��ֱ���ϴ��룬ͬ���أ��Բ���Ҫ�ķ�������ֻ������������

```
|-AbstractApplicationContext#refresh
 |-AbstractApplicationContext#registerBeanPostProcessors
  |-PostProcessorRegistrationDelegate
    #registerBeanPostProcessors(ConfigurableListableBeanFactory, AbstractApplicationContext)

```

���յ��õ��� `PostProcessorRegistrationDelegate#registerBeanPostProcessors`���������£�

```
public static void registerBeanPostProcessors(
        ConfigurableListableBeanFactory beanFactory, AbstractApplicationContext applicationContext) {

    // ��ȡspring�����е� BeanPostProcessor���������һ��bean: 
    // org.springframework.context.annotation.internalAutowiredAnnotationProcessor��
    // �� AutowiredAnnotationBeanPostProcessor
    String[] postProcessorNames = beanFactory
            .getBeanNamesForType(BeanPostProcessor.class, true, false);

    int beanProcessorTargetCount = beanFactory.getBeanPostProcessorCount() 
            + 1 + postProcessorNames.length;
    beanFactory.addBeanPostProcessor(
            new BeanPostProcessorChecker(beanFactory, beanProcessorTargetCount));

    List<BeanPostProcessor> priorityOrderedPostProcessors = new ArrayList<>();
    List<BeanPostProcessor> internalPostProcessors = new ArrayList<>();
    List<String> orderedPostProcessorNames = new ArrayList<>();
    List<String> nonOrderedPostProcessorNames = new ArrayList<>();

    // �Ȼ�ȡʵ����PriorityOrdered��BeanPostProcessor
    // �ٻ�ȡʵ����Ordered��BeanPostProcessor
    // ����ٻ�ȡ����������������BeanPostProcessor
    for (String ppName : postProcessorNames) {
        if (beanFactory.isTypeMatch(ppName, PriorityOrdered.class)) {
            BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
            priorityOrderedPostProcessors.add(pp);
            if (pp instanceof MergedBeanDefinitionPostProcessor) {
                internalPostProcessors.add(pp);
            }
        }
        else if (beanFactory.isTypeMatch(ppName, Ordered.class)) {
            orderedPostProcessorNames.add(ppName);
        }
        else {
            nonOrderedPostProcessorNames.add(ppName);
        }
    }

    // ����priorityOrderedPostProcessor������Ȼ����ӵ�beanFactory��
    sortPostProcessors(priorityOrderedPostProcessors, beanFactory);
    registerBeanPostProcessors(beanFactory, priorityOrderedPostProcessors);

    List<BeanPostProcessor> orderedPostProcessors 
            = new ArrayList<>(orderedPostProcessorNames.size());
    for (String ppName : orderedPostProcessorNames) {
        BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
        orderedPostProcessors.add(pp);
        if (pp instanceof MergedBeanDefinitionPostProcessor) {
            internalPostProcessors.add(pp);
        }
    }
    // ����orderedPostProcessor������Ȼ����ӵ�beanFactory��
    sortPostProcessors(orderedPostProcessors, beanFactory);
    registerBeanPostProcessors(beanFactory, orderedPostProcessors);

    List<BeanPostProcessor> nonOrderedPostProcessors 
            = new ArrayList<>(nonOrderedPostProcessorNames.size());
    for (String ppName : nonOrderedPostProcessorNames) {
        BeanPostProcessor pp = beanFactory.getBean(ppName, BeanPostProcessor.class);
        nonOrderedPostProcessors.add(pp);
        if (pp instanceof MergedBeanDefinitionPostProcessor) {
            internalPostProcessors.add(pp);
        }
    }
    // �������µ�BeanPostProcessor������Ȼ����ӵ�beanFactory��
    registerBeanPostProcessors(beanFactory, nonOrderedPostProcessors);    
    // ����internalPostProcessor������Ȼ����ӵ�beanFactory��
    // AutowiredAnnotationBeanPostProcessorʵ����MergedBeanDefinitionPostProcessor��
    // ���������ٴ�ע��
    sortPostProcessors(internalPostProcessors, beanFactory);
    registerBeanPostProcessors(beanFactory, internalPostProcessors);

    beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(applicationContext));
}

```

��������Ҫ�Ƕ� `BeanFactoryPostProcessor` ����ע��������������£�

*   ��ʵ���� `PriorityOrdered` �� `BeanPostProcessor` ע�ᵽ `beanFactory` �У�
*   ��ʵ���� `Ordered` �� `BeanPostProcessor` ע�ᵽ `beanFactory` �У�
*   ���������������������� `BeanPostProcessor` ע�ᵽ `beanFactory` �У�
*   ������ʵ���� `MergedBeanDefinitionPostProcessor` �� `BeanPostProcessor` �ٴ�ע�ᵽ `beanFactory` �С�

��ʵ�ϣ��� demo01 ���ԣ�����ע��� bean ֻ��һ����`AutowiredAnnotationBeanPostProcessor`����ͬʱʵ���� `MergedBeanDefinitionPostProcessor` �� `PriorityOrdered`����˻�ע�����Ρ�

����ע���˶�� `AutowiredAnnotationBeanPostProcessor`��������ֻ�����һ���������ǽ��� `registerBeanPostProcessors` ���� spring �����ע��ģ�һ·����ȥ�����뵽�� `AbstractBeanFactory#addBeanPostProcessor`:

> AbstractBeanFactory#addBeanPostProcessor

```
private final List<BeanPostProcessor> beanPostProcessors = new CopyOnWriteArrayList<>();

@Override
public void addBeanPostProcessor(BeanPostProcessor beanPostProcessor) {
    Assert.notNull(beanPostProcessor, "BeanPostProcessor must not be null");
    // �Ƚ����Ƴ�����˶��ע��beanPostProcessorsҲֻ����һ��
    this.beanPostProcessors.remove(beanPostProcessor);
    if (beanPostProcessor instanceof InstantiationAwareBeanPostProcessor) {
        this.hasInstantiationAwareBeanPostProcessors = true;
    }
    if (beanPostProcessor instanceof DestructionAwareBeanPostProcessor) {
        this.hasDestructionAwareBeanPostProcessors = true;
    }
    this.beanPostProcessors.add(beanPostProcessor);
}

```

���Կ�������ν��ע�ᵽ `BeanFactory`����ʵ���ǰ� `beanPostProcessor` ���뵽 `BeanFactory` �� `beanPostProcessors` �С�

���Ľ����� `beanPostProcessor` ��ע�ᣬ���� `beanPostProcessor` �ĵ��ã������ķ������ᵽ�����ĵķ������ȵ�����ɣ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4657181](https://my.oschina.net/funcy/blog/4657181) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
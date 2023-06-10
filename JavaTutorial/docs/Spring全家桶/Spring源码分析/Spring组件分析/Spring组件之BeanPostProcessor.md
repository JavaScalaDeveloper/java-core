`BeanPostProcessor` ������Ϊ spring bean �ĺ��ô������������� `BeanFactoryPostProcessor`��`BeanPostProcessor` ���Զ� bean ���в�����

spring `BeanPostProcessor` �� bean �Ĵ���������ִ�У�ִ��ʱ������:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b7a4d4bc1bfbd76537e40cf843b0d18df93.png)

�� bean �Ĵ��������У�`BeanPostProcessor` һ��ִ�й� 8 �Σ�

1.  �������ɴ������
2.  �ƶϹ��췽��
3.  ��ȡע�������
4.  �����������
5.  �Ƿ���Ҫע������
6.  �������
7.  ��ʼ��ǰ
8.  ��ʼ����

����������һ������Щ������ִ�е� `BeanPostProcessor`��

### 1\. ʲô�� `BeanPostProcessor`

���� `BeanPostProcessor` ǰ��������������ʲô�� `BeanPostProcessor`���������£�

```
public interface BeanPostProcessor {

    /**
     * ��ʼ��ǰִ��
     */
    @Nullable
    default Object postProcessBeforeInitialization(Object bean, String beanName) 
            throws BeansException {
        return bean;
    }

    /**
     * ��ʼ����ִ��
     */
    @Nullable
    default Object postProcessAfterInitialization(Object bean, String beanName) 
            throws BeansException {
        return bean;
    }

}

```

`BeanPostProcessor` ��һ���ӿڣ������� bean ��ʼǰ���һЩ���������ǿ���ʵ������ӿڣ���д���������������Ϳ����� bean ��ʼ��ǰ����һЩ��������ˡ�

`BeanPostProcessor` �� `AbstractApplicationContext#registerBeanPostProcessors` ��ע�ᡣ

ʵ���ϣ�`BeanPostProcessor` �����ڶ���ӽӿڣ���Щ���Ƕ�ͳ��Ϊ `BeanPostProcessor`�����ĵ���ҪĿ�ľ���������Щ `BeanPostProcessor`��

### 2. `BeanPostProcessor` ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-102ca0d1e4db82a28871661241b05bc3956.png)

#### 2.1 �������ɴ������

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#resolveBeforeInstantiation`
*   ִ�з�����`InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation`
*   `AbstractAutoProxyCreator#postProcessBeforeInstantiation`�����ɴ������

#### 2.2 �ƶϹ��췽��

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#determineConstructorsFromBeanPostProcessors`
*   ִ�з�����`SmartInstantiationAwareBeanPostProcessor#determineCandidateConstructors`
*   `AutowiredAnnotationBeanPostProcessor#determineCandidateConstructors`���ƶϹ��췽��

#### 2.3 ��ȡע�������

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#applyMergedBeanDefinitionPostProcessors`
*   ִ�з�����`MergedBeanDefinitionPostProcessor#postProcessMergedBeanDefinition`
*   `ApplicationListenerDetector#postProcessMergedBeanDefinition`���ռ������� `ApplicationListener`
*   `AutowiredAnnotationBeanPostProcessor#postProcessMergedBeanDefinition`�����ұ� `@Autowired`��`@Value`��`@Inject` ��ǵ������뷽��
*   `CommonAnnotationBeanPostProcessor#postProcessMergedBeanDefinition`�����ұ� `@Resource` ��ǵ������뷽��
*   `InitDestroyAnnotationBeanPostProcessor#postProcessMergedBeanDefinition`�����ұ� `@PostConstruct`��`@PreDestroy` ��ǵķ���

#### 2.4 �����������

*   ����λ�ã�������û��ִ�У���`AbstractAutowireCapableBeanFactory#doCreateBean`
*   ִ�з�����`SmartInstantiationAwareBeanPostProcessor#getEarlyBeanReference`
*   `AbstractAutoProxyCreator#getEarlyBeanReference`����ǰ���ɴ������

#### 2.5 �Ƿ���Ҫע������

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#populateBean`
*   ִ�з�����`InstantiationAwareBeanPostProcessor#postProcessAfterInstantiation`

#### 2.6 �������

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#populateBean`
*   ִ�з�����`InstantiationAwareBeanPostProcessor#postProcessProperties`
*   `AutowiredAnnotationBeanPostProcessor#postProcessProperties`����䱻 `@Autowired`��`@Value`��`@Inject` ��ǵ������뷽��
*   `CommonAnnotationBeanPostProcessor#postProcessProperties`����䱻 `@Resource` ��ǵ������뷽��
*   `ImportAwareBeanPostProcessor#postProcessProperties`��Ϊ `EnhancedConfiguration` ʵ������ `beanFactory`

#### 2.7 ��ʼ��ǰ

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsBeforeInitialization`
*   ִ�з�����`BeanPostProcessor#postProcessBeforeInitialization`
*   `ApplicationContextAwareProcessor#postProcessBeforeInitialization`������ `XxxAware` �ӿڵķ���
*   `BeanValidationPostProcessor#postProcessBeforeInitialization`������ `JSR-303` У��
*   `ImportAwareBeanPostProcessor#postProcessBeforeInitialization`������ `ImportAware` �ӿڵķ���
*   `InitDestroyAnnotationBeanPostProcessor#postProcessBeforeInitialization`�����ñ� `@PostConstruct` ��ǵķ���
*   `LoadTimeWeaverAwareProcessor#postProcessBeforeInitialization`������ `LoadTimeWeaverAware` �ӿڵķ���
*   `ServletContextAwareProcessor#postProcessBeforeInitialization`������ `ServletContextAware` �ӿڵķ��������� `servletContext` �� `servletConfig`

#### 2.8 ��ʼ����

*   ����λ�ã�`AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterInitialization`
*   ִ�з�����`BeanPostProcessor#postProcessAfterInitialization`
*   `AbstractAdvisingBeanPostProcessor#postProcessAfterInitialization`������ `AopInfrastructureBean`
*   `AbstractAutoProxyCreator#postProcessAfterInitialization`�����ɴ������
*   `AdvisorAdapterRegistrationManager#postProcessAfterInitialization`�������ǰ bean �� `AdvisorAdapter`����ע��
*   `ApplicationListenerDetector#postProcessAfterInitialization`�������ǰ bean �� `ApplicationListener`������ӵ��¼���������
*   `BeanPostProcessorChecker#postProcessAfterInitialization`�������������˸� log
*   `BeanValidationPostProcessor#postProcessAfterInitialization`������ `JSR-303` У��
*   `JmsListenerAnnotationBeanPostProcessor#postProcessAfterInitialization`������ `@JmsListener` ע��
*   `ScheduledAnnotationBeanPostProcessor#postProcessAfterInitialization`������ `@Scheduled` ע��
*   `SimpleServletPostProcessor#postProcessAfterInitialization`���� `Servlet` ʵ�������÷��� `Servlet#init(ServletConfig)`

### 3\. �ܽ�

�����һ��������ܽ���Щ `BeanPostProcessor`:

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b1117b66c4881f366669dab69b332164d8f.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4597551](https://my.oschina.net/funcy/blog/4597551) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
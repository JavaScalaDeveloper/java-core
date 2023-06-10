### 1\. ʲô�� `BeanFactoryPostProcessor`

`BeanFactoryPostProcessor` �������� spring beanFactory �ĺ��ô������������������ƻ� beanFactory ��һЩ��Ϊ��

spring Ϊ�����ṩ������ `BeanFactoryPostProcessor`��

* `org.springframework.beans.factory.config.BeanFactoryPostProcessor`

  ```
  /**
   * beanFactory �ĺ��ô����������Ըı� beanFactory ��һЩ��Ϊ
   */
  public interface BeanFactoryPostProcessor {
  
      /**
       * ���� beanFactory �ķ���������Ϊ beanFactory��ʵ�������� DefaultListableBeanFactory
       */
      void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) 
              throws BeansException;
  
  }
  
  ```

* `org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor`

  ```
  /**
   * BeanDefinition ע��������������������������ע�� beanDefinition ��
   * �̳��� BeanFactoryPostProcessor �ӿڣ�
   * Ҳ������д BeanFactoryPostProcessor#postProcessBeanFactory ����
   * 
   */
  public interface BeanDefinitionRegistryPostProcessor extends BeanFactoryPostProcessor {
  
      /**
       * 1\. �÷������� BeanDefinitionRegistryPostProcessor#postProcessBeanFactory ִ��
       * 2\. �������Ϊ registry��ʵ������ DefaultListableBeanFactory��Ҳ����ʹ�� beanFactory �Ĳ���
       */
      void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) 
              throws BeansException;
  
  }
  
  ```

`BeanFactoryPostProcessor` �� `AbstractApplicationContext#invokeBeanFactoryPostProcessors` �����б�ִ�У�ִ��ʱ��ִ�� `BeanDefinitionRegistryPostProcessor#postProcessBeanDefinitionRegistry`����ִ�� `BeanFactoryPostProcessor#postProcessBeanFactory`���������ķ��������Բο� [spring ��������ִ֮�� BeanFactoryPostProcessor](https://my.oschina.net/funcy/blog/4641114) һ�ġ�

### 2. `BeanFactoryPostProcessor` �ṩ�Ĺ���

�������������� `BeanFactoryPostProcessor` �ṩ�Ĺ��ܡ�

#### 2.1 `BeanFactoryPostProcessor` ������

̽��ǰ�����������˽��� `BeanFactoryPostProcessor` �ṩ������

```
void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) 
        throws BeansException;

```

�÷�����ֻ��һ��������`ConfigurableListableBeanFactory`���������˽� `BeanFactoryPostProcessor` ��Ϊ������ʲô����Ҫ֪����������ṩ����Щ���ܣ�

���������������� `set` ������ ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-63b39c81bcae0b10c60a2f847c6b47af932.png)

����֮�⣬���� `register` ������ ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-50c48da9b50dcf18abcd99db09142644c6c.png)

������Щ���������ǾͿ��Զ��ƻ� `beanFactory` ��һЩ��Ϊ�ˡ�

#### 2.2 `BeanDefinitionRegistryPostProcessor` ������

����Ҳ���˽��� `BeanDefinitionRegistryPostProcessor` �ṩ�ķ�����

```
void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) 
        throws BeansException;

```

��������Ĳ����� `BeanDefinitionRegistry`���������������������Ǹ� `BeanDefinition ע����`�����ṩ�����·�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-5812a2cac994c5940d57c7e6ab55c23a63e.png)

���Կ��������������Ҫ����Χ�� `BeanDefinition` ���������Ƚ���Ҫ�ķ����о����£�

*   `BeanDefinitionRegistry#containsBeanDefinition`���Ƿ����ָ�����Ƶ� `BeanDefinition`
*   `BeanDefinitionRegistry#getBeanDefinition`����ȡָ�����Ƶ� `BeanDefinition`
*   `BeanDefinitionRegistry#registerBeanDefinition`��ע��һ�� `BeanDefinition`
*   `BeanDefinitionRegistry#removeBeanDefinition`���Ƴ� `BeanDefinition`

### 3\. spring �ṩ�� `BeanFactoryPostProcessor`

spring ��һ�������� `BeanFactoryPostProcessor` ��ʵ���࣬�����Ϣ���������£�

*   `EventListenerMethodProcessor`��

    *   ʵ���� `BeanFactoryPostProcessor`��`SmartInitializingSingleton` �ӿ�
    *   �� `BeanDefinitionRegistryPostProcessor#postProcessBeanFactory` �����л�ȡ�� `EventListenerFactory`
    *   �� `SmartInitializingSingleton#afterSingletonsInstantiated` �����д��� `@EventListener` ע��
*   `ConfigurationClassPostProcessor`��

    *   �� `AnnotationConfigUtils#registerAnnotationConfigProcessors(BeanDefinitionRegistry, Object)` ������ע��
    *   ʵ���� `BeanDefinitionRegistryPostProcessor` �ӿ�
    *   ���� `@Conditional` ע��
    *   ���� `@Component` ע��
    *   ���� `@PropertySource/@PropertySources` ע��
    *   ���� `@ComponentScan/@ComponentScans` ע��
    *   ���� `@Import` ע��
    *   ���� `@ImportResource` ע��
    *   ���� `@Bean` ע��
    *   ���� `@Configuration` ע��

���� `EventListenerMethodProcessor` ���� `@EventListener` �ķ��������Բο�[��spring Դ�������spring ̽��֮������ע�� @EventListener](https://my.oschina.net/funcy/blog/4926344).

���� `ConfigurationClassPostProcessor` �����ע������̣����Բο���

*   [ConfigurationClassPostProcessor��һ�������� @ComponentScan ע��](https://my.oschina.net/funcy/blog/4836178)
*   [ConfigurationClassPostProcessor������������ @Bean ע��](https://my.oschina.net/funcy/blog/4492878)
*   [ConfigurationClassPostProcessor������������ @Import ע��](https://my.oschina.net/funcy/blog/4678152)
*   [ConfigurationClassPostProcessor���ģ������� @Conditional ע��](https://my.oschina.net/funcy/blog/4873444)

### 4\. �ܽ�

���Ľ����� `BeanFactoryPostProcessor` �ĸ������˵���� `BeanFactoryPostProcessor` ��ʹ�ã��Լ������� spring �ṩ������ `BeanFactoryPostProcessor` ʵ���ࣺ`EventListenerMethodProcessor` �� `ConfigurationClassPostProcessor`��

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4597545](https://my.oschina.net/funcy/blog/4597545) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
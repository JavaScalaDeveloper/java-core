

# Spring ����Ԫ����



## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)Spring ����Ԫ��Ϣ

*   Spring Bean ����Ԫ��Ϣ - BeanDefinition
*   Spring Bean ����Ԫ��Ϣ - PropertyValues
*   Spring ��������Ԫ��Ϣ
*   Spring �ⲿ������Ԫ��Ϣ - PropertySource
*   Spring Profile Ԫ��Ϣ - @Profile

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-bean-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)Spring Bean ����Ԫ��Ϣ

Bean ����Ԫ��Ϣ - BeanDefinition

*   GenericBeanDefinition��ͨ���� BeanDefinition
*   RootBeanDefinition���� Parent �� BeanDefinition ���ߺϲ��� BeanDefinition
*   AnnotatedBeanDefinition��ע���ע�� BeanDefinition

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-bean-%E5%B1%9E%E6%80%A7%E5%85%83%E4%BF%A1%E6%81%AF)Spring Bean ����Ԫ��Ϣ

*   Bean ����Ԫ��Ϣ - PropertyValues
    *   ���޸�ʵ�� - MutablePropertyValues
    *   Ԫ�س�Ա - PropertyValue
*   Bean ���������Ĵ洢 - AttributeAccessor
*   Bean Ԫ��ϢԪ�� - BeanMetadataElement

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-%E5%AE%B9%E5%99%A8%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)Spring ��������Ԫ��Ϣ

Spring XML ����Ԫ��Ϣ - beans Ԫ�����

| beans Ԫ������ | Ĭ��ֵ | ʹ�ó��� |
| --- | --- | --- |
| profile | null�����գ� | Spring Profiles ����ֵ |
| default-lazy-init | default | �� outter beans ��default-lazy-init�� ���Դ���ʱ���̳и�ֵ������Ϊ��false�� |
| default-merge | default | �� outter beans ��default-merge�� ���Դ���ʱ���̳и�ֵ������Ϊ��false�� |
| default-autowire | default | �� outter beans ��default-autowire�� ���Դ���ʱ���̳и�ֵ������Ϊ��no�� |
| default-autowire-candidates | null�����գ� | Ĭ�� Spring Beans ���� pattern |
| default-init-method | null�����գ� | Ĭ�� Spring Beans �Զ����ʼ������ |
| default-destroy-method | null�����գ� | Ĭ�� Spring Beans �Զ������ٷ��� |

Spring XML ����Ԫ��Ϣ - Ӧ�����������

| XML Ԫ�� | ʹ�ó��� |
| --- | --- |
| `<context:annotation-config />` | ���� Spring ע������ |
| `<context:component-scan />` | Spring @Component �Լ��Զ���ע��ɨ�� |
| `<context:load-time-weaver />` | ���� Spring LoadTimeWeaver |
| `<context:mbean-export />` | ��¶ Spring Beans ��Ϊ JMX Beans |
| `<context:mbean-server />` | ����ǰƽ̨��Ϊ MBeanServer |
| `<context:property-placeholder />` | �����ⲿ��������Դ��Ϊ Spring ������ |
| `<context:property-override />` | �����ⲿ��������Դ���� Spring �� |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-xml-%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD-spring-bean-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)���� XML �ļ�װ�� Spring Bean ����Ԫ��Ϣ

�ײ�ʵ�� - XmlBeanDefinitionReader

| XML Ԫ�� | ʹ�ó��� |
| --- | --- |
| `<beans:beans />` | �� XML ��Դ�µĶ�� Spring Beans ���� |
| `<beans:bean />` | ���� Spring Bean ���壨BeanDefinition������ |
| `<beans:alias />` | Ϊ Spring Bean ���壨BeanDefinition��ӳ����� |
| `<beans:import />` | �����ⲿ Spring XML ������Դ |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-properties-%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD-spring-bean-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)���� Properties �ļ�װ�� Spring Bean ����Ԫ��Ϣ

�ײ�ʵ�� - PropertiesBeanDefinitionReader

| Properties ������ | ʹ�ó��� |
| --- | --- |
| `class` | Bean ��ȫ���޶��� |
| `abstract` | �Ƿ�Ϊ����� BeanDefinition |
| `parent` | ָ�� parent BeanDefinition ���� |
| `lazy-init` | �Ƿ�Ϊ�ӳٳ�ʼ�� |
| `ref` | �������� Bean ������ |
| `scope` | ���� Bean �� scope ���� |
| ${n} | n ��ʾ�� n+1 ������������ |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-java-%E6%B3%A8%E8%A7%A3%E8%A3%85%E8%BD%BD-spring-bean-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)���� Java ע��װ�� Spring Bean ����Ԫ��Ϣ

Spring ģʽע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| `@Repository` | ���ݲִ�ģʽע�� | 2.0 |
| `@Component` | ͨ�����ģʽע�� | 2.5 |
| `@Service` | ����ģʽע�� | 2.5 |
| `@Controller` | Web ������ģʽע�� | 2.5 |
| `@Configuration` | ������ģʽע�� | 3.0 |

Spring Bean ����ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| `@Bean` | �滻 XML Ԫ�� `<bean>` | 3.0 |
| `@DependsOn` | ��� XML ���� `<bean depends-on="..."/>` | 3.0 |
| `@Lazy` | ��� XML ���� `<bean lazy-init="true | falses" />` | 3.0 |
| `@Primary` | �滻 XML Ԫ�� `<bean primary="true | false" />` | 3.0 |
| `@Role` | �滻 XML Ԫ�� `<bean role="..." />` | 3.1 |
| `@Lookup` | ��� XML ���� `<bean lookup-method="...">` | 4.1 |

Spring Bean ����ע��ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| `@Autowired` | Bean ����ע�룬֧�ֶ����������ҷ�ʽ | 2.5 |
| `@Qualifier` | ϸ���ȵ� @Autowired �������� | 2.5 |

 

| Java ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| @Resource | ������ @Autowired | 2.5 |
| @Inject | ������ @Autowired | 2.5 |

Spring Bean ����װ��ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| @Profile | ���û�����װ�� | 3.1 |
| @Conditional | �������װ�� | 4.0 |

Spring Bean �������ڻص�ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| @PostConstruct | �滻 XML Ԫ�� <bean init-method="..."></bean>�� InitializingBean | 2.5 |
| @PreDestroy | �滻 XML Ԫ�� <bean destroy-method="..."></bean>�� DisposableBean | 2.5 |

Spring BeanDefinition ������ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| XML ��Դ | XmlBeanDefinitionReader | 1.0 |
| Properties ��Դ | PropertiesBeanDefinitionReader | 1.0 |
| Java ע�� | AnnotatedBeanDefinitionReader | 3.0 |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-bean-%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF%E5%BA%95%E5%B1%82%E5%AE%9E%E7%8E%B0)Spring Bean ����Ԫ��Ϣ�ײ�ʵ��

### [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-xml-%E8%B5%84%E6%BA%90-beandefinition-%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%B3%A8%E5%86%8C)Spring XML ��Դ BeanDefinition ������ע��

���� API - XmlBeanDefinitionReader

*   ��Դ - Resource
*   �ײ� - BeanDefinitionDocumentReader
    *   XML ���� - Java DOM Level 3 API
    *   BeanDefinition ���� - BeanDefinitionParserDelegate
    *   BeanDefinition ע�� - BeanDefinitionRegistry

### [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-properties-%E8%B5%84%E6%BA%90-beandefinition-%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%B3%A8%E5%86%8C)Spring Properties ��Դ BeanDefinition ������ע��

���� API - PropertiesBeanDefinitionReader

*   ��Դ
    *   �ֽ��� - Resource
    *   �ַ��� - EncodedResouce
*   �ײ�
    *   �洢 - java.util.Properties
    *   BeanDefinition ���� - API �ڲ�ʵ��
    *   BeanDefinition ע�� - BeanDefinitionRegistry

### [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#spring-java-%E6%B3%A8%E5%86%8C-beandefinition-%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%B3%A8%E5%86%8C)Spring Java ע�� BeanDefinition ������ע��

���� API - AnnotatedBeanDefinitionReader

*   ��Դ
    *   ����� - java.lang.Class
*   �ײ�
    *   �������� - ConditionEvaluator
    *   Bean ��Χ���� - ScopeMetadataResolver
    *   BeanDefinition ���� - �ڲ� API ʵ��
    *   BeanDefinition ���� - AnnotationConfigUtils.processCommonDefinitionAnnotations
    *   BeanDefinition ע�� - BeanDefinitionRegistry

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-xml-%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD-spring-ioc-%E5%AE%B9%E5%99%A8%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)���� XML �ļ�װ�� Spring IoC ��������Ԫ��Ϣ

Spring IoC ������� XML ����

| �����ռ� | ����ģ�� | Schema ��Դ URL |
| --- | --- | --- |
| beans | spring-beans | https://www.springframework.org/schema/beans/spring-beans.xsd |
| context | spring-context | https://www.springframework.org/schema/context/spring-context.xsd |
| aop | spring-aop | https://www.springframework.org/schema/aop/spring-aop.xsd |
| tx | spring-tx | https://www.springframework.org/schema/tx/spring-tx.xsd |
| util | spring-beans | beans https://www.springframework.org/schema/util/spring-util.xsd |
| tool | spring-beans | https://www.springframework.org/schema/tool/spring-tool.xsd |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-java-%E6%B3%A8%E8%A7%A3%E8%A3%85%E8%BD%BD-spring-ioc-%E5%AE%B9%E5%99%A8%E9%85%8D%E7%BD%AE%E5%85%83%E4%BF%A1%E6%81%AF)���� Java ע��װ�� Spring IoC ��������Ԫ��Ϣ

Spring IoC ����װ��ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| @ImportResource | �滻 XML Ԫ�� `<import>` | 3.0 |
| @Import | ���� Configuration Class | 3.0 |
| @ComponentScan | ɨ��ָ�� package �±�ע Spring ģʽע����� | 3.1 |

Spring IoC ��������ע��

| Spring ע�� | ����˵�� | ��ʼ�汾 |
| --- | --- | --- |
| @PropertySource | �������Գ��� PropertySource ע�� | 3.1 |
| @PropertySources | @PropertySource ����ע�� | 4.0 |

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-extensible-xml-authoring-%E6%89%A9%E5%B1%95-springxml-%E5%85%83%E7%B4%A0)���� Extensible XML authoring ��չ SpringXML Ԫ��

Spring XML ��չ

*   ��д XML Schema �ļ������� XML �ṹ
*   �Զ��� NamespaceHandler ʵ�֣������ռ��
*   �Զ��� BeanDefinitionParser ʵ�֣�XML Ԫ���� BeanDefinition ����
*   ע�� XML ��չ�������ռ��� XML Schema ӳ��

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#extensible-xml-authoring-%E6%89%A9%E5%B1%95%E5%8E%9F%E7%90%86)Extensible XML authoring ��չԭ��

### [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E8%A7%A6%E5%8F%91%E6%97%B6%E6%9C%BA)����ʱ��

*   AbstractApplicationContext#obtainFreshBeanFactory
    *   AbstractRefreshableApplicationContext#refreshBeanFactory
        *   AbstractXmlApplicationContext#loadBeanDefinitions
            *   ...
                *   XmlBeanDefinitionReader#doLoadBeanDefinitions
                    *   ...
                        *   BeanDefinitionParserDelegate#parseCustomElement

### [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E6%A0%B8%E5%BF%83%E6%B5%81%E7%A8%8B)��������

BeanDefinitionParserDelegate#parseCustomElement(org.w3c.dom.Element, BeanDefinition)

*   ��ȡ namespace
*   ͨ�� namespace ���� NamespaceHandler
*   ���� ParserContext
*   ����Ԫ�أ���ȡ BeanDefinintion

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-properties-%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD%E5%A4%96%E9%83%A8%E5%8C%96%E9%85%8D%E7%BD%AE)���� Properties �ļ�װ���ⲿ������

ע������

*   @org.springframework.context.annotation.PropertySource
*   @org.springframework.context.annotation.PropertySources

API ���

*   org.springframework.core.env.PropertySource
*   org.springframework.core.env.PropertySources

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%9F%BA%E4%BA%8E-yaml-%E6%96%87%E4%BB%B6%E8%A3%85%E8%BD%BD%E5%A4%96%E9%83%A8%E5%8C%96%E9%85%8D%E7%BD%AE)���� YAML �ļ�װ���ⲿ������

API ���

*   org.springframework.beans.factory.config.YamlProcessor
    *   org.springframework.beans.factory.config.YamlMapFactoryBean
    *   org.springframework.beans.factory.config.YamlPropertiesFactoryBean

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E9%97%AE%E9%A2%98)����

**Spring �Ƚ� XML Schema ��������Щ**��

| �����ռ� | ����ģ�� | Schema ��Դ URL |
| --- | --- | --- |
| beans | spring-beans | https://www.springframework.org/schema/beans/spring-beans.xsd |
| context | spring-context | https://www.springframework.org/schema/context/spring-context.xsd |
| aop | spring-aop | https://www.springframework.org/schema/aop/spring-aop.xsd |
| tx | spring-tx | https://www.springframework.org/schema/tx/spring-tx.xsd |
| util | spring-beans | beans https://www.springframework.org/schema/util/spring-util.xsd |
| tool | spring-beans | https://www.springframework.org/schema/tool/spring-tool.xsd |

**Spring ����Ԫ��Ϣ��������Щ**��

*   Bean ����Ԫ��Ϣ��ͨ��ý�飨�� XML��Proeprties �ȣ������� BeanDefinition
*   IoC ��������Ԫ��Ϣ��ͨ��ý�飨�� XML��Proeprties �ȣ������� IoC ������Ϊ������ע��������AOP ��
*   �ⲿ�����ã�ͨ����Դ������ Proeprties��YAML �ȣ������� PropertySource
*   Spring Profile��ͨ���ⲿ�����ã��ṩ������֧����

**Extensible XML authoring ��ȱ��**��

*   �߸��Ӷȣ�������Ա��Ҫ��Ϥ XML Schema��spring.handlers��spring.schemas �Լ� Spring API
*   Ƕ��Ԫ��֧�ֽ�����ͨ����Ҫʹ�÷����ݹ������Ƕ�׽����ķ�ʽ����Ƕ�ף��ӣ�Ԫ��
*   XML �������ܽϲSpring XML ���� DOM Level 3 API ʵ�֣��� API ������⣬Ȼ�����ܽϲ�
*   XML �����ֲ�Բ������������ܺͱ����Ե� XML ��ܣ��� JAXB

## [#](https://dunwu.github.io/spring-tutorial/pages/55f315/#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)�ο�����

*   [Spring �ٷ��ĵ�֮ Core Technologies(opens new window)](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)
*   [��С��署 Spring ���ı��˼�롷(opens new window)](https://time.geekbang.org/course/intro/265)



# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html
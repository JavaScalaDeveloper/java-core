���� | ��ľľ��
��Դ |����ͷ��

**ѧϰĿ��**

1.  Ϊʲô��һ��ע�����ʵ��Զ�̹��̵����أ��Ƶ����ײ��ʵ�������̣�
2.  OpenFeign��ôʵ��RPC�Ļ������ܵ�
3.  ͨ��Դ����֤
    **��1�� OpenFeign�������Ƶ�**
    Ҫ��ȷOpenFeign���������������ǻ���Ҫ��ȷ���ĺ���Ŀ����ʲô��

˵���ˣ�OpenFeign����ĵ�Ŀ������ÿͻ�����Զ�̵��ù����в���Ҫ��ʲô����Ĳ�����ֻҪ�õ�һ������Ȼ����øö���ķ����ͺ��ˣ�ʣ�µĲ���������OpenFeignȥ������ɣ���ʣ��һЩʲô�����أ�

1.  ���ȿ϶��Ǳ�֤����ͨ�ţ������Ǵ󵨵ز²�һ�£�OpenFeign��ʵ�ײ�����Ƿ�װ������ĵ�ַ���˿ڡ���������Լ���Ӧ�Ĳ�����
2.  ��Σ�������Ҫ�ö���ȥ���󷽷��������������Զ�̵ķ����������϶����򵥣�����Ҳ�󵨲²�һ�£��ö���Ҳ��OpenFeign�����Ǵ����ġ�
3.  Ȼ���ڵ��ù����У�����������ɶ�̨�������ṩ�ģ������漰�����ؾ����ˣ���϶�Ҳ��OpenFeign����������ˡ�
4.  ������������⣬������һ�£���Ȼ���ڷ�����Ǽ�Ⱥ��������Ƿ���˵ĵ�ַ�Ͷ˿ڻ���Ҫһ��ע��������ע�ᣬ��϶�Ҳ�����ɿͻ�������ɣ���Ϊ�ͻ���ֻ��עҵ����롣���붼�����룬Ҳ��OpenFeign������ˡ�

OK�������Ƶ���OpenFeignӦ����ɵ���ҪĿ�꣬����������������������������ô���ġ�
![SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/b45564c706ab4113cc23492cc0796907b851f8.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������")֮ǰ�������н���һ�����������ʲô�����ֻҪ�Ǽ���spring����springboot�Ļ�����һ������ͨ��spring����springbootȥ����bean����Ĵ����ģ���ͨ�������õ�����֮����ȥ���ö���ĺ��ķ�������OpenFeign�ڼ���springboot��ʱ������ҲӦ����������

1.  ���Ե�һ����OpenFeign����springboot��ͨ��springboot�õ�����bean����������ͼ�е�userService����
2.  �������϶����򵥣�������ֻ��getUser�Ĺ��ܡ�����һ�룬spring����������ǿ������ʲô�����أ�����������������������;ͺ�֮�����ˣ��������
3.  ���ô������ķ���ʱ�������Ƚ��뵽invoke�У������invoke�У�������ǿ�����˸��ؾ���LoadBalance����Ϊ������������getUser��ʱ��Ҫ֪�������ǵ�����̨�������ķ���
4.  ���ؾ�������͵�ƴ�Ӿ����http�������������ͷ�������ַ������˿��ˡ�
    OK�����Ϸ�����OpenFeign�ײ�Ҫʵ�ֵľ��幦�ܣ�Ҳ���������Ĵ������̣���ô����������ͨ��Դ������֤һ�£����ǲ�����ô��ġ�

**��2�� Դ����֤**

![SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/93070e354fbacedc2b85274846d2dde7dd170a.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������")**2.1 EnableFeignClients**
���Ǵ��������ע��������룬���ע�⿪����FeignClient�Ľ������̡�



```
@EnableFeignClients(basePackages = "com.example.client")
```









���ע����������£����õ���һ��@Importע�⣬����֪��Import����������һ��������ģ�������ȥ��һ��FeignClientsRegistrar�Ķ��塣



```
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Import(FeignClientsRegistrar.class)
public @interface EnableFeignClients {
}
```









FeignClientsRegistrarʵ����
ImportBeanDefinitionRegistrar������һ����̬ע��bean�Ľӿڣ�Spring Boot������ʱ�򣬻�ȥ����������е�registerBeanDefinitions��ʵ�ֶ�̬Bean��װ�ء�registerBeanDefinitions����spring��������ʱִ��invokeBeanFactoryPostProcessors������Ȼ�����Ӧ������н���ע�ᣬ��������������ImportSelector��



```
class FeignClientsRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware,EnvironmentAware {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata metadata,BeanDefinitionRegistry registry) {
        registerDefaultConfiguration(metadata, registry);
        registerFeignClients(metadata, registry);
    }
}
```









**2.1.1 ImportBeanDefinitionRegistrar**
�򵥸������ʾһ��
ImportBeanDefinitionRegistrar�����á�

*   ����һ����Ҫ��װ�ص�IOC�����е���HelloService



```
public class HelloService {
}
```









*   ����һ��Registrar��ʵ�֣�����һ��bean��װ�ص�IOC����



```
public class FeignImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        BeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClassName(HelloService.class.getName());
        registry.registerBeanDefinition("helloService",beanDefinition);
    }
}
```









* ����һ��ע����



  ```
  @Retention(RetentionPolicy.RUNTIME)
  @Target({ElementType.TYPE})
  @Documented
  @Import({FeignImportBeanDefinitionRegistrar.class})
  public @interface EnableFeignTest {
  }
  ```









* ������



```
@EnableFeignClients(basePackages = "com.example.clients")
@EnableFeignTest
@SpringBootApplication
public class OpenfeignUserServiceApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(OpenfeignUserServiceApplication.class, args);
        System.out.println(context.getBean(HelloService.class));
    }

}
```









*   ͨ�������ʾ���Է��֣�HelloService���bean �Ѿ�װ�ص���IOC������
    ����Ƕ�̬װ�صĹ���ʵ�֣��������@Configuration����ע�룬����˺ܶ������ԡ� ok���ٻص�FeignClient�Ľ���������

**2.1.2 FeignClientsRegistrar**

* registerDefaultConfiguration �����ڲ��� SpringBoot �������ϼ���Ƿ���@EnableFeignClients, �и�ע��Ļ��� ����� Feign �����ص�һЩ��������ע��

* registerFeignClients �����ڲ��� classpath �У� ɨ���� @FeignClient ���ε��࣬ ��������ݽ���Ϊ BeanDefinition , ����ͨ������ Spring ����е�BeanDefinitionReaderUtils.resgisterBeanDefinition ������������� FeignClientBeanDeifinition ��ӵ� spring ������.



  ```
  @Override
  public void registerBeanDefinitions(AnnotationMetadata metadata,BeanDefinitionRegistry registry) {
      //ע��@EnableFeignClients�ж���defaultConfiguration�����µ��࣬��װ��FeignClientSpecification��ע�ᵽSpring������
      //��@FeignClient����һ�����ԣ�configuration����������Ǳ�ʾ����FeignClient�Զ���������࣬����Ҳ��ͨ������registerClientConfiguration������ע���FeignClientSpecification��������
      //���ԣ����������ȫ�����@EnableFeignClients�����õ�����Ϊ���׵����ã��ڸ���@FeignClient���õľ����Զ���������
      registerDefaultConfiguration(metadata, registry);
      registerFeignClients(metadata, registry);
  }
  ```









**2.2 registerDefaultConfiguration**



  ```
  private void registerDefaultConfiguration(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
      // ��ȡ��metadata�й���EnableFeignClients������ֵ��ֵ�ԡ�
      Map<String, Object> defaultAttrs = metadata.getAnnotationAttributes(EnableFeignClients.class.getName(), true);
      //���������defaultConfiguration ��������,���û��ʹ��Ĭ�ϵ�configuration
      if (defaultAttrs != null && defaultAttrs.containsKey("defaultConfiguration")) {
          String name;
          if (metadata.hasEnclosingClass()) {
              name = "default." + metadata.getEnclosingClassName();
          } else {
              name = "default." + metadata.getClassName();
          }
          //����ע��
          this.registerClientConfiguration(registry, name, defaultAttrs.get("defaultConfiguration"));
      }
  
  }
  ```











```
private void registerClientConfiguration(BeanDefinitionRegistry registry, Object name, Object configuration) {
    //ʹ��BeanDefinitionBuilder������BeanDefinition,����������ע��
    BeanDefinitionBuilder builder = BeanDefinitionBuilder.genericBeanDefinition(FeignClientSpecification.class);
    builder.addConstructorArgValue(name);
    builder.addConstructorArgValue(configuration);
    registry.registerBeanDefinition(name + "." + FeignClientSpecification.class.getSimpleName(), builder.getBeanDefinition());
}
```









���������BeanDefinitionRegistry��spring������ڶ�̬ע��BeanDefinition��Ϣ�Ľӿڣ�����registerBeanDefinition�������Խ�BeanDefinitionע�ᵽSpring�����У�����name���Ծ���ע���BeanDefinition�����ƣ���������ע����һ��FeignClientSpecification�Ķ���

FeignClientSpecificationʵ����
NamedContextFactory.Specification�ӿڣ�����Feignʵ��������Ҫһ����������ķ����У��������Զ������õ����ʵ����SpringCloudʹ��NamedContextFactory����һЩ�е�����������ApplicationContext���ö�Ӧ��Specification����Щ�������д���ʵ������

NamedContextFactory��3�����ܣ�

*   ����AnnotationConfigApplicationContext�����ġ�
*   ���������д�������ȡbeanʵ����
*   ������������ʱ������е�feignʵ����
    NamedContextFactory�и��ǳ���Ҫ������FeignContext�����ڴ洢����OpenFeign�����ʵ����



```
public class FeignContext extends NamedContextFactory<FeignClientSpecification> {
    public FeignContext() {
       super(FeignClientsConfiguration.class, "feign", "feign.client.name");
    }
 }
```









FeignContext�����ﹹ�����أ�

���ü���
pring-cloud-openfeign-core-2.2.3.RELEASE.jar!\META-INF\spring.factories![SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d830f20713aca01438472786f5f84c7058232b.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������")**2.2.1 FeignAutoConfiguration**

![SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/894c73791fbf7215782217d7132bc57f004085.jpg "SpringCloudϵ�С�Spring Cloud Դ�����֮OpenFeign-��Դ�����������")

��Ĭ�ϵ�FeignClientsConfiguration��Ϊ�������ݸ����캯��

FeignContext������ʱ��Ὣ֮ǰFeignClientSpecificationͨ��setConfigurations���ø�context�����ġ�

**2.2.2 createContext**
���������
org.springframework.cloud.context.named.NamedContextFactory#createContext������

FeignContext�ĸ����createContext�����Ὣ����
AnnotationConfigApplicationContextʵ������ʵ������Ϊ��ǰ�����ĵ��������ģ����ڹ���feign����Ĳ�ͬʵ�����ڵ���FeignClientFactoryBean��getObject����ʱ���á���createContext���������Ļὲ�⣩



```
protected AnnotationConfigApplicationContext createContext(String name) {
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
	//��ȡname����Ӧ��configuration,����о�ע�ᵽ��context��
    if (this.configurations.containsKey(name)) {
        for (Class<?> configuration : this.configurations.get(name)
             .getConfiguration()) {
            context.register(configuration);
        }
    }
    //ע��default��Configuration,Ҳ���� FeignClientsRegistrar����registerDefaultConfiguration������ע���Configuration
    for (Map.Entry<String, C> entry : this.configurations.entrySet()) {
        if (entry.getKey().startsWith("default.")) {
            for (Class<?> configuration : entry.getValue().getConfiguration()) {
                context.register(configuration);
            }
        }
    }
    //ע��PropertyPlaceholderAutoConfiguration
    context.register(PropertyPlaceholderAutoConfiguration.class,
                     this.defaultConfigType);
    //��Environment��propertySources����Դ
    context.getEnvironment().getPropertySources().addFirst(new MapPropertySource(
        this.propertySourceName,
        Collections.<String, Object>singletonMap(this.propertyName, name)));
    if (this.parent != null) {
        // Uses Environment from parent as well as beans
        context.setParent(this.parent);
        // jdk11 issue
        // https://github.com/spring-cloud/spring-cloud-netflix/issues/3101
        context.setClassLoader(this.parent.getClassLoader());
    }
    context.setDisplayName(generateDisplayName(name));
    context.refresh();
    return context;
}
```









����NamedContextFactoryʵ����DisposableBean�����Ե�ʵ��������ʱ������



```
@Override
public void destroy() {
    Collection<AnnotationConfigApplicationContext> values = this.contexts.values();
    for (AnnotationConfigApplicationContext context : values) {
        // This can fail, but it never throws an exception (you see stack traces
        // logged as WARN).
        context.close();
    }
    this.contexts.clear();
}
```









�ܽ᣺NamedContextFactory�ᴴ����
AnnotationConfigApplicationContextʵ��������name��ΪΨһ��ʶ��Ȼ��ÿ��AnnotationConfigApplicationContextʵ������ע�Ჿ�������࣬�Ӷ����Ը���һϵ�еĻ������������ɵ����ʵ���������Ϳ��Ի���name������һϵ�е����ʵ����Ϊ��ͬ��FeignClient׼����ͬ�������ʵ����

**2.3 registerFeignClients**
���������Ҫ��ɨ����·�������е�@FeignClientע�⣬Ȼ����ж�̬Bean��ע�롣�����ջ���� registerFeignClient ������



```
public void registerFeignClients(AnnotationMetadata metadata,BeanDefinitionRegistry registry) {
    //ʡ�Դ���...
    registerFeignClient(registry, annotationMetadata, attributes);
}
```









����������У�����ȥ��װBeanDefinition��Ҳ����Bean�Ķ��壬Ȼ��ע�ᵽSpring IOC������



```
private void registerFeignClient(BeanDefinitionRegistry registry,AnnotationMetadata annotationMetadata, Map<String, Object> attributes) {
    String className = annotationMetadata.getClassName();
    BeanDefinitionBuilder definition = BeanDefinitionBuilder.genericBeanDefinition(FeignClientFactoryBean.class);
    //ʡ�Դ���...
    BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDefinition,className,new String[] { alias });
    BeanDefinitionReaderUtils.registerBeanDefinition(holder, registry);
}
```









���ǹ�עһ�£�BeanDefinitionBuilder����������һ��BeanDefinition�ģ�����ͨ��genericBeanDefinition �������ģ����Ҵ�����һ��FeignClientFactoryBean���ࡣ

���ǿ��Է��֣�FeignClient����̬ע�����һ��FactoryBean

> Spring Cloud FengnClientʵ����������Spring�Ĵ����������ɴ����࣬����������Ż�����е�FeignClient��BeanDefinition����ΪFeignClientFactoryBean���ͣ���FeignClientFactoryBean�̳���FactoryBean������һ������Bean��
>
> ��Spring�У�FactoryBean��һ������Bean��������������Bean��
>
> ���� Bean ��һ������� Bean, ���� Bean ����������˵�� ���߼����Ǹ�֪������� Bean ����ͨ�� Bean ���ǹ��� Bean, ֻ�ǰ��������Ļ�ȡ Bean ��ʽȥ���ã� ������bean ��󷵻ص�ʵ�����ǹ���Bean ���� ����ִ�й��� Bean �� getObject �߼����ص�ʾ������Ҳ������ʵ��������Bean��ʱ���ȥ��������getObject������



```
public static BeanDefinitionBuilder genericBeanDefinition(Class<?> beanClass) {
    BeanDefinitionBuilder builder = new BeanDefinitionBuilder(new GenericBeanDefinition());
    builder.beanDefinition.setBeanClass(beanClass);
    return builder;
}
```









����˵��FeignClient��ע������ӿڣ���ͨ��
FeignClientFactoryBean.getObject()����������һ���������

**2.3.1 FeignClientFactoryBean.getObject**
getObject���õ���getTarget����������applicationContextȡ��FeignContext��FeignContext�̳���NamedContextFactory������������ͳһά��feign�и���feign�ͻ����໥����������ġ�

���ţ�����feign.builder���ڹ���ʱ����FeignContext��ȡ���õ�Encoder��Decoder�ȸ�����Ϣ��FeignContext����ƪ���Ѿ��ᵽ��Ϊÿ��Feign�ͻ��˷�����һ�����������ǵĸ���������spring����

������Feign.Builder֮�����ж��Ƿ���ҪLoadBalance�������Ҫ����ͨ��LoadBalance�ķ��������á�ʵ�����������յ��õ���Target.target()������



```
@Override
public Object getObject() throws Exception {
    return getTarget();
}
<T> T getTarget() {
    //ʵ����Feign�����Ķ���FeignContext
    FeignContext context = this.applicationContext.getBean(FeignContext.class);
    Feign.Builder builder = feign(context);//����Builder����
    if (!StringUtils.hasText(this.url)) {//���urlΪ�գ����߸��ؾ��⣬�����и��ؾ��⹦�ܵĴ�����
        if (!this.name.startsWith("http")) {
            this.url = "http://" + this.name;
        }
        else {
            this.url = this.name;
        }
        this.url += cleanPath();
        return (T) loadBalance(builder, context,new HardCodedTarget<>(this.type, this.name,this.url));
    }
    //���ָ����url��������Ĭ�ϵĴ�����
    if (StringUtils.hasText(this.url) && !this.url.startsWith("http")) {
        this.url = "http://" + this.url;
    }
    String url = this.url + cleanPath();
    //����FeignContext��getInstance������ȡClient����
    Client client = getOptional(context, Client.class);
    if (client != null) {
        if (client instanceof LoadBalancerFeignClient) {
            // not load balancing because we have a url,
            // but ribbon is on the classpath, so unwrap
            client = ((LoadBalancerFeignClient) client).getDelegate();
        }
        if (client instanceof FeignBlockingLoadBalancerClient) {
            // not load balancing because we have a url,
            // but Spring Cloud LoadBalancer is on the classpath, so unwrap
            client = ((FeignBlockingLoadBalancerClient) client).getDelegate();
        }
        builder.client(client);
    }//����Ĭ�ϴ�����
    Targeter targeter = get(context, Targeter.class);
    return (T) targeter.target(this, builder, context,new HardCodedTarget<>(this.type, this.name,url));
}
```









**2.3.2 loadBalance**
���ɾ߱����ؾ���������feign�ͻ��ˣ�Ϊfeign�ͻ��˹�����󶨸��ؾ���ͻ���.

Client client = (Client)this.getOptional(context, Client.class); ���������л�ȡһ��Client��Ĭ����LoadBalancerFeignClient��

������FeignRibbonClientAutoConfiguration����Զ�װ�����У�ͨ��Importʵ�ֵ�



```
@Import({ HttpClientFeignLoadBalancedConfiguration.class,OkHttpFeignLoadBalancedConfiguration.class,DefaultFeignLoadBalancedConfiguration.class })
```











```
protected <T> T loadBalance(Builder builder, FeignContext context,
                            HardCodedTarget<T> target) {
    Client client = (Client)this.getOptional(context, Client.class);
    if (client != null) {
        builder.client(client);
        Targeter targeter = (Targeter)this.get(context, Targeter.class);
        return targeter.target(this, builder, context, target);
    } else {
        throw new IllegalStateException("No Feign Client for loadBalancing defined. Did you forget to include spring-cloud-starter-netflix-ribbon?");
    }
}
```









**2.3.3 DefaultTarget.target**



```
@Override
public <T> T target(FeignClientFactoryBean factory, Feign.Builder feign,FeignContext context, Target.HardCodedTarget<T> target) {
    return feign.target(target);
}
```









**2.3.4 ReflectiveFeign.newInstance**
�����������������һ����̬����ķ����������ɶ�̬����֮ǰ�������ContractЭ�飨Э��������򣬽����ӿ����ע����Ϣ���������ڲ���MethodHandler�Ĵ���ʽ��

��ʵ�ֵĴ����п��Կ�����Ϥ��Proxy.newProxyInstance�������������ࡣ��������Ҫ��ÿ������Ľӿڷ��������ض��Ĵ���ʵ�֣�������������һ��MethodHandler�ĸ�����Ƕ�Ӧ���������InvocationHandler��



```
public <T> T newInstance(Target<T> target) {
    //���ݽӿ����ContractЭ�������ʽ�������ӿ����ϵķ�����ע�⣬ת�����ڲ���MethodHandler����ʽ
    Map<String, MethodHandler> nameToHandler = this.[targetToHandlersByName.apply(target)];
    Map<Method, MethodHandler> methodToHandler = new LinkedHashMap();
    List<DefaultMethodHandler> defaultMethodHandlers = new LinkedList();
    Method[] var5 = target.type().getMethods();
    int var6 = var5.length;
    for(int var7 = 0; var7 < var6; ++var7) {
        Method method = var5[var7];
        if (method.getDeclaringClass() != Object.class) {
            if (Util.isDefault(method)) {
                DefaultMethodHandler handler = new DefaultMethodHandler(method);
                defaultMethodHandlers.add(handler);
                methodToHandler.put(method, handler);
            } else {
                methodToHandler.put(method,nameToHandler.get(Feign.configKey(target.type(), method)));
            }
        }
    }
    InvocationHandler handler = this.factory.create(target, methodToHandler);
    // ����Proxy.newProxyInstance Ϊ�ӿ��ഴ����̬ʵ�֣������е�����ת����InvocationHandler ����
    T proxy = Proxy.newProxyInstance(target.type().getClassLoader(), new Class[]{target.type()}, handler);
    Iterator var12 = defaultMethodHandlers.iterator();
    while(var12.hasNext()) {
        DefaultMethodHandler defaultMethodHandler = (DefaultMethodHandler)var12.next();
        defaultMethodHandler.bindTo(proxy);
    }
    return proxy;
}
```









**2.4 �ӿڶ���Ĳ�������**
����FeignClient�ӿڵ�������������Ӧ���������ݡ�

**2.4.1 targetToHandlersByName.apply(target)**
����ContractЭ����򣬽����ӿ����ע����Ϣ���������ڲ����֣�

targetToHandlersByName.apply(target);������ӿڷ����ϵ�ע�⣬�Ӷ��������������ȵ��ض���������Ϣ��Ȼ������һ��SynchronousMethodHandler Ȼ����Ҫά��һ��<method��MethodHandler>��map������InvocationHandler��ʵ��FeignInvocationHandler�С�



```
public Map<String, MethodHandler> apply(Target target) {
    List<MethodMetadata> metadata = contract.parseAndValidateMetadata(target.type());
    Map<String, MethodHandler> result = new LinkedHashMap<String,MethodHandler>();
    for (MethodMetadata md : metadata) {
        BuildTemplateByResolvingArgs buildTemplate;
        if (!md.formParams().isEmpty() && md.template().bodyTemplate() == null)
        {
            buildTemplate = new BuildFormEncodedTemplateFromArgs(md, encoder, queryMapEncoder,target);
        } else if (md.bodyIndex() != null) {
            buildTemplate = new BuildEncodedTemplateFromArgs(md, encoder,queryMapEncoder, target);
        } else {
            buildTemplate = new BuildTemplateByResolvingArgs(md, queryMapEncoder,target);
        }
        if (md.isIgnored()) {
            result.put(md.configKey(), args -> {
                throw new IllegalStateException(md.configKey() + " is not a method handled by feign");
            });
        } else {
            result.put(md.configKey(),
                       factory.create(target, md, buildTemplate, options, decoder,errorDecoder));
        }
    }
    return result;
}
```









**2.4.2 SpringMvcContract**
��ǰSpring Cloud ΢�����������У�Ϊ�˽���ѧϰ�ɱ���������Spring MVC�Ĳ���ע������� �����������Ҳ����˵ ��д�ͻ�������ӿں���д����˴���һ�����ͻ��˺ͷ���˿���ͨ��SDK�ķ�ʽ����Լ�����ͻ���ֻ��Ҫ�������˷�����SDK API���Ϳ���ʹ������ӿڵı��뷽ʽ�Խӷ���

����̳���Contract.BaseContract��ʵ����ResourceLoaderAware�ӿڣ�

�����þ��Ƕ�RequestMapping��RequestParam��RequestHeader��ע����н����ġ�

**2.5 OpenFeign���ù���**
��ǰ��ķ����У�����֪��OpenFeign���շ��ص���һ��#
ReflectiveFeign.FeignInvocationHandler�Ķ���

��ô���ͻ��˷�������ʱ������뵽
FeignInvocationHandler.invoke�����У������Ҷ�֪��������һ����̬�����ʵ�֡�



```
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    if (!"equals".equals(method.getName())) {
        if ("hashCode".equals(method.getName())) {
            return this.hashCode();
        } else {
            return "toString".equals(method.getName()) ? this.toString() :
            ((MethodHandler)this.dispatch.get(method)).invoke(args);
        }
    } else {
        try {
            Object otherHandler = args.length > 0 && args[0] != null ?
                Proxy.getInvocationHandler(args[0]) : null;
            return this.equals(otherHandler);
        } catch (IllegalArgumentException var5) {
            return false;
        }
    }
}
```









�����ţ���invoke�����У������ this.dispatch.get(method)).invoke(args) ��this.dispatch.get(method) �᷵��һ��SynchronousMethodHandler,�������ش���

�����������ݲ���������ɵ�RequestTemplate�������������Http�����ģ�棬�������¡�



```
public Object invoke(Object[] argv) throws Throwable {
    RequestTemplate template = this.buildTemplateFromArgs.create(argv);
    Options options = this.findOptions(argv);
    Retryer retryer = this.retryer.clone();
    while(true) {
        try {
            return this.executeAndDecode(template, options);
        } catch (RetryableException var9) {
            RetryableException e = var9;
            try {
                retryer.continueOrPropagate(e);
            } catch (RetryableException var8) {
                Throwable cause = var8.getCause();
                if (this.propagationPolicy == ExceptionPropagationPolicy.UNWRAP
                    && cause != null) {
                    throw cause;
                }
                throw var8;
            }
            if (this.logLevel != Level.NONE) {
                this.logger.logRetry(this.metadata.configKey(), this.logLevel);
            }
        }
    }
}
```









**2.5.1 executeAndDecode**
���������Ĵ��룬�����Ѿ���restTemplateƴװ��ɣ�����Ĵ�������һ�� executeAndDecode() �������÷���ͨ��RequestTemplate����Request�������Ȼ������Http Client��ȡresponse������ȡ��Ӧ��Ϣ��



```
Object executeAndDecode(RequestTemplate template, Options options) throws Throwable {
    //ת��ΪHttp������
    Request request = this.targetRequest(template);
    if (this.logLevel != Level.NONE) {
        this.logger.logRequest(this.metadata.configKey(), this.logLevel,request);
    }
    long start = System.nanoTime();
    Response response;
    try {
        //����Զ��ͨ��
        response = this.client.execute(request, options);
        //��ȡ���ؽ��
        response = response.toBuilder().request(request).requestTemplate(template).build();
    } catch (IOException var16) {
        if (this.logLevel != Level.NONE) {
            this.logger.logIOException(this.metadata.configKey(), this.logLevel,var16, this.elapsedTime(start));
        }
        throw FeignException.errorExecuting(request, var16);
    }
    long elapsedTime = TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - start);
    boolean shouldClose = true;
    Response var10;
    try {
        if (this.logLevel != Level.NONE) {
            response = this.logger.logAndRebufferResponse(this.metadata.configKey(), this.logLevel,response, elapsedTime);
        }
        if (Response.class != this.metadata.returnType()) {
            Object result;
            Object var21;
            if (response.status() >= 200 && response.status() < 300) {
                if (Void.TYPE == this.metadata.returnType()) {
                    var10 = null;
                    return var10;
                }
                result = this.decode(response);
                shouldClose = this.closeAfterDecode;
                var21 = result;
                return var21;
            }
            if (this.decode404 && response.status() == 404 && Void.TYPE != this.metadata.returnType()) {
                result = this.decode(response);
                shouldClose = this.closeAfterDecode;
                var21 = result;
                return var21;
            }
            throw this.errorDecoder.decode(this.metadata.configKey(), response);
        }
        if (response.body() == null) {
            var10 = response;
            return var10;
        }
        if (response.body().length() != null && (long)response.body().length() <= 8192L) {
            byte[] bodyData = Util.toByteArray(response.body().asInputStream());
            Response var11 = response.toBuilder().body(bodyData).build();
            return var11;
        }
        shouldClose = false;
        var10 = response;
    } catch (IOException var17) {
        if (this.logLevel != Level.NONE) {
            this.logger.logIOException(this.metadata.configKey(), this.logLevel,var17, elapsedTime);
        }
        throw FeignException.errorReading(request, response, var17);
    } finally {
        if (shouldClose) {
            Util.ensureClosed(response.body());
        }
    }
    return var10;
}
```









**2.5.2 Client.execute**
Ĭ�ϲ���JDK�� HttpURLConnection ����Զ�̵��á�



```
@Override
public Response execute(Request request, Options options) throws IOException {
    HttpURLConnection connection = convertAndSend(request, options);
    return convertResponse(connection, request);
}
Response convertResponse(HttpURLConnection connection, Request request) throws IOException {
    int status = connection.getResponseCode();
    String reason = connection.getResponseMessage();
    if (status < 0) {
        throw new IOException(format("Invalid status(%s) executing %s %s",status,connection.getRequestMethod(),connection.getURL()));
    }
    Map<String, Collection<String>> headers = new LinkedHashMap<>();
    for (Map.Entry<String, List<String>> field :
         connection.getHeaderFields().entrySet()) {
        // response message
        if (field.getKey() != null) {
            headers.put(field.getKey(), field.getValue());
        }
    }
    Integer length = connection.getContentLength();
    if (length == -1) {
        length = null;
    }
    InputStream stream;
    if (status >= 400) {
        stream = connection.getErrorStream();
    } else {
        stream = connection.getInputStream();
    }
    return Response.builder()
        .status(status)
        .reason(reason)
        .headers(headers)
        .request(request)
        .body(stream, length)
        .build();
}
```



# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning
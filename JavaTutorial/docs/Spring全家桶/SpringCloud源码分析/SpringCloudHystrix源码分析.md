ѧϰĿ��

1. ��дMini���Hystrix
2. RxJava֪ʶ����
3. Hystrix�ĺ������̷���
4. Դ����֤
   ��1�� ��дMini��
   �������Ѿ�����ҽ��ܹ���Hystrix�ĺ��Ĺ��ܺ�ʹ���ˣ����޷Ǿ����ṩ���۶ϡ�����������ȹ��ܣ������۶Ϻ͸�����Ŀ�ģ������ǽ������ʹ�ù�������ʵ����ĵ�������ע�⣺@EnableHystrix��@HystrixCommand��@HystrixCollapser������ͨ��ע�� @HystrixCommand�����߼̳� HystrixCommand ��ʵ�ֽ������Լ�һЩ����ϲ��Ȳ�����

����ʽ����ԭ��֮ǰ����������Ҫ��ȷһ���㣬������ @HystrixCommand ע����ʵ�ַ��񽵼�����Hystrix ���ڲ��ǲ���AOP�ķ�ʽ�������ش�������ģ�������ݣ�����Ҳ����ϸ�������������������ʵ��һ�¼��װ�� Hystrix �����һ�£���Ҫ��Ϊ���²���

- �����Լ���@HystrixCommand ע�⡣
- ʵ����������Ĵ����߼���
- ���Ե��á�
  1.�Զ���ע��



    @Target({ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    public @interface MyHystrixCommand {
        //Ĭ�ϳ�ʱʱ��
        int timeout() default 1000;
        //���˷���
        String fallback() default "";
    }









2.�Զ���������



    @Aspect  //����Aspect֧�ֲ��ұ��Ϊһ��������
    @Component
    public class MyHystrixCommandAspect {
        ExecutorService executorService= Executors.newFixedThreadPool(10);
    
        //�����е�
        @Pointcut(value = "@annotation(MyHystrixCommand)")
        public void pointCut(){
    
        }
        //���е㷽���⻷��ִ��  @Around�൱��@Before��@AfterReturning���ܵ��ܺ�
        @Around(value = "pointCut()&&@annotation(hystrixCommand)")
        public Object doPointCut(ProceedingJoinPoint joinPoint, MyHystrixCommand hystrixCommand) throws Exception {
            int timeout=hystrixCommand.timeout();
            Future future=executorService.submit(()->{
                try {
                    //ִ��proceed��������������Ŀ�귽��ִ��
                    return joinPoint.proceed();
                } catch (Throwable throwable) {
                    throwable.printStackTrace();
                }
                return null;
            });
            Object rs;
            try {
                //ͨ��get���첽�ȴ���ʵ�ֳ�ʱ
                rs=future.get(timeout, TimeUnit.MILLISECONDS);
            } catch (InterruptedException | ExecutionException | TimeoutException e) {
                future.cancel(true);
                if(StringUtils.isBlank(hystrixCommand.fallback())){
                    throw new Exception("fallback is null");
                }
                //����fallback
                rs=invokeFallback(joinPoint,hystrixCommand.fallback());
            }
            return rs;
        }
        private Object invokeFallback(ProceedingJoinPoint joinPoint,String fallback) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
            //��ȡ������ķ���������Method
            MethodSignature signature=(MethodSignature)joinPoint.getSignature(); //��ȡ������ͱ����������Ϣ
            Method method=signature.getMethod();
            Class<?>[] parameterTypes=method.getParameterTypes();
            //�õ��ص�����
            try {
                Method fallbackMethod=joinPoint.getTarget().getClass().getMethod(fallback,parameterTypes);
                method.setAccessible(true);
                //ͨ������ص�
                return fallbackMethod.invoke(joinPoint.getTarget(),joinPoint.getArgs());
            } catch (Exception e) {
                throw e;
            }
        }
    }









3.�Զ������



    @RestController
    public class MyHystrixController {
        @Autowired
        OrderServiceClient orderServiceClient;
        @MyHystrixCommand(fallback = "fallback",timeout = 2000)
        @GetMapping("/myhystrix/get/{num}")
        public String get(@PathVariable("num") int num){
            return orderServiceClient.orderLists(num);
        }
        public String fallback(int num){
            return "�Զ���ע�ⷽ��������";
        }
    }









������http://localhost:8080/myhystrix/get/1ʱ�ᴥ����������Ϊ�ڷ���ˣ���num=1ʱ������3s��

OK���������Ǿ�ʵ����һ�����װ��HystrixCommand����������ֻ��ʵ����Hystrix�ĵ�һ����������һ��ע������棬�������ĵײ��߼�ԶԶû����ô�򵥣��ڽ�Դ��֮ǰ������������һ��RxJava��ʲô����ΪHystrix�ײ��߼��ǻ�����Ӧʽ���ʵ�ֵġ�

��2�� RxJava����
2.1 RxJava����
RxJava ��һ����Ӧʽ��̣������������¼����첽�����⡣�����¼�������ʽ���á��߼�������ࡣ

RxJava�۲���ģʽ�ĶԱ�

- ��ͳ�۲�����һ�����۲��߶���۲��ߣ������۲��߷����ı�ʱ��ʱ֪ͨ���й۲���
- RxJava��һ���۲��߶�����۲��ߣ����۲���������һ���������������ڱ��۲���֮�䳯��һ�����򴫵ݣ�ֱ�����ݸ��۲��� ��
  ��ʵ˵���ˣ�������RxJava�д���2�ָ��һ���Ǳ��۲��ߣ�һ���ǹ۲��ߣ���������۲��߶�����ͬһ���۲��ߵ�ʱ����ô���ű��۲������ĳ���¼���ʱ��ͻ�ȥ�ص��۲��ߡ�

2.2 �۲���

Observer



    Observer observer = new Observer() {
        @Override
        public void onCompleted() {
            System.out.println("�����۲�������Complete�¼������ø÷���");
        }
        @Override
        public void onError(Throwable throwable) {
            System.out.println("��Error�¼�������Ӧ");
        }
        @Override
        public void onNext(Object o) {
            System.out.println("��Next�¼�������Ӧ:" + o);
        }
    };











    //Subscriber�� = RxJava ���õ�һ��ʵ���� Observer �ĳ����࣬�� Observer �ӿڽ�������չ
    Subscriber subscriber = new Subscriber() {
        @Override
        public void onCompleted() {
            System.out.println("�����۲�������Complete�¼������ø÷���");
        }
        @Override
        public void onError(Throwable throwable) {
            System.out.println("��Error�¼�������Ӧ");
        }
        @Override
        public void onNext(Object o) {
            System.out.println("��Next�¼�������Ӧ:" + o);
        }
    };









Subscriber ��������Observer �ӿڵ�����

���߻���ʹ�÷�ʽһ�£���RxJava��subscribe�����У�Observer���ȱ�ת����Subscriber��ʹ�ã�
Subscriber������� Observer �ӿڽ�������չ������������������

- onStart()���ڻ�δ��Ӧ�¼�ǰ���ã�������һЩ��ʼ��������������subscribe ���ڵ��̵߳��ã������л��̣߳����Բ��ܽ��н���UI���±��絯����Щ��
- unsubscribe()������ȡ�����ġ��ڸ÷��������ú󣬹۲��߽����ٽ�����Ӧ�¼���������onStop�����п��Ե��ô˷����������ġ����ø÷���ǰ����ʹ�� isUnsubscribed() �ж�״̬��ȷ�����۲���Observable�Ƿ񻹳��й۲���Subscriber�����á�
  2.3 ���۲���
  RxJava �ṩ�˶��ַ������� �������۲��߶���Observable�������������



    // ����1��just(T...)��ֱ�ӽ�����Ĳ������η��ͳ���
    Observable observable = Observable.just("A", "B", "C");
    // �������ε��ã�
    // onNext("A");
    // onNext("B");
    // onNext("C");
    // onCompleted();
    // ����2��fromArray(T[]) / from(Iterable<? extends T>) : ����������� / Iterable ��ֳɾ����������η��ͳ���
    String[] words = {"A", "B", "C"};
    Observable observable = Observable.fromArray(words);
    // �������ε��ã�
    // onNext("A");
    // onNext("B");
    // onNext("C");
    // onCompleted();









2.4 ����



    observable.subscribe(observer); //�������Ĺ�ϵ









2.5 ����



    public class RxJavaDemo {
        // ReactiveX Java  ��Ӧʽ��̿��(android��
        // Java stream() java8
        //�۲���ģʽ
        public static void main(String[] args) throws ExecutionException, InterruptedException {
            final String[] datas = new String[]{"�¼�1"};
            // ����ִ����Ļص����� ��ֹ��������
            //����Observable����ǰ�����ص���call���������������������쳣��ֹ
            final Action0 onComplated = new Action0() {
                @Override
                public void call() {
                    System.out.println("���۲���Ҫ������");
                }
            };
            //���۲���
            Observable<String> observable = Observable.defer(new Func0<Observable<String>>() {
                @Override
                public Observable<String> call() {
                    Observable observable1 = Observable.from(datas);
                    return observable1.doOnCompleted(onComplated);
                }
            });
    //        Observable<String> observable = Observable.just("�¼�1","�¼�2","����");
            //�۲���
            Observer observer = new Observer() {
                @Override
                public void onCompleted() {
                    System.out.println("��Comlate�¼�������Ӧ");
                }
                @Override
                public void onError(Throwable throwable) {
                    System.out.println("��Error�¼�������Ӧ");
                }
                @Override
                public void onNext(Object o) {
                    System.out.println("��Next�¼�������Ӧ:" + o);
                }
            };
            observable.subscribe(observer); //�������Ĺ�ϵ
    
    //        String s = observable.toBlocking().toFuture().get();//�첽�ȴ����
    //        System.out.println(s);
        }
    }









OK�������ָ�����ʹ��RxJava����ˣ����������ǿ�ʼߣԴ�롣

��3�� Դ�����
���Ϲ����ṩ��Դ������ͼ����ͼ�Ͽ��Կ���������ʵ������ȥɨ�����HystrixCommandע��ķ�����Ȼ������������أ�ִ��������߼���������涨��������������execute��queue����ѡһ���е��ã�Ȼ����������������߼������������HystrixCommandע�⣬������Hystrix��@EnableHystrixע�⡣



    @SpringBootApplication
    @EnableFeignClients("com.example.clients")
    //@EnableDiscoveryClient //ע����ʾUser����ע��
    @EnableHystrix //ע�ⷽʽ����Hystrix
    public class HystrixEclipseUserApplication {
    
        public static void main(String[] args) {
            SpringApplication.run(HystrixEclipseUserApplication.class, args);
        }
    
    }









���뵽@EnableHystrixע����



    @Target({ElementType.TYPE})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @Inherited
    @EnableCircuitBreaker
    public @interface EnableHystrix {
    }
    //����@EnableHystrix�̳���@EnableCircuitBreaker
    @Target(ElementType.TYPE)
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
    @Inherited
    @Import(EnableCircuitBreakerImportSelector.class)
    public @interface EnableCircuitBreaker {
    }









�����ⲽ���룬�����źܶ�ѧ��springboot��ͬѧ������Ϥ�ˣ������õ���Importע�⣬�ǿ϶���������һЩ�������ˣ�Ȼ�������ٽ�
EnableCircuitBreakerImportSelector����;



    @Order(Ordered.LOWEST_PRECEDENCE - 100)
    public class EnableCircuitBreakerImportSelector
    		extends SpringFactoryImportSelector<EnableCircuitBreaker> {
    	@Override
    	protected boolean isEnabled() {
    		return getEnvironment().getProperty("spring.cloud.circuit.breaker.enabled",
    				Boolean.class, Boolean.TRUE);
    	}
    }









EnableCircuitBreakerImportSelector�̳���SpringFactoryImportSelector������SpringFactoryImportSelector�������������Ϥ�Ĵ��룬��ʵ����DeferredImportSelector�ӿڣ�ʵ����selectImports������selectImports������������ļ�spring.factories����ض�Ӧ���� org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker������������spring.facotries�ļ���



    org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
    org.springframework.cloud.netflix.hystrix.HystrixAutoConfiguration,\
    org.springframework.cloud.netflix.hystrix.HystrixCircuitBreakerAutoConfiguration,\
    org.springframework.cloud.netflix.hystrix.ReactiveHystrixCircuitBreakerAutoConfiguration,\
    org.springframework.cloud.netflix.hystrix.security.HystrixSecurityAutoConfiguration
    org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker=\
    org.springframework.cloud.netflix.hystrix.HystrixCircuitBreakerConfiguration









��ӦEnableAutoConfiguration����Щʵ������spring������ʱ��ͨ���Զ�װ����ƻ�ȥʵ��������ע�뵽IoC�����У��������Ǻ��Ĺ�ע
HystrixCircuitBreakerConfiguration�ࡣ



    @Configuration(proxyBeanMethods = false)
    public class HystrixCircuitBreakerConfiguration {
        //�����Ǻ��ĵ�����bean
    	@Bean
    	public HystrixCommandAspect hystrixCommandAspect() {
    		return new HystrixCommandAspect();
    	}
    	...
    }









���뵽����������лᷢ�֣����������Ҫ���������ע����Ϊ�����@HystrixCommand��@HystrixCollapser����ִ��������ע�����εķ���ʱ���ᱻ����ִ��
methodsAnnotatedWithHystrixCommand

3.1 HystrixCommandAspect



    @Aspect
    public class HystrixCommandAspect {
        private static final Map<HystrixPointcutType, MetaHolderFactory> META_HOLDER_FACTORY_MAP;
        static {
            //ͨ����̬����������ע�����������ʵ����
            META_HOLDER_FACTORY_MAP = ImmutableMap.<HystrixPointcutType, MetaHolderFactory>builder()
                .put(HystrixPointcutType.COMMAND, new CommandMetaHolderFactory())
                .put(HystrixPointcutType.COLLAPSER, new CollapserMetaHolderFactory())
                .build();
        }
        //���������ע��HystrixCommand
        @Pointcut("@annotation(com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand)")
        public void hystrixCommandAnnotationPointcut() {
        }
        //���������ע��HystrixCollapser������ϲ���
        @Pointcut("@annotation(com.netflix.hystrix.contrib.javanica.annotation.HystrixCollapser)")
        public void hystrixCollapserAnnotationPointcut() {
        }
        //����֪ͨ
        @Around("hystrixCommandAnnotationPointcut() || hystrixCollapserAnnotationPointcut()")
        public Object methodsAnnotatedWithHystrixCommand(final ProceedingJoinPoint joinPoint) throws Throwable {
            //��ȡĿ�귽��
            Method method = getMethodFromTarget(joinPoint);
            Validate.notNull(method, "failed to get method from joinPoint: %s", joinPoint);
            //ֻ����������ע���ע�ķ���
            if (method.isAnnotationPresent(HystrixCommand.class) && method.isAnnotationPresent(HystrixCollapser.class)) {
                throw new IllegalStateException("method cannot be annotated with HystrixCommand and HystrixCollapser " +
                                                "annotations at the same time");
            }
            //���ݲ�ͬ��ע�⣬ѡ���Ӧ��metaHolderFactory, ����MetaHolder, MetaHolder ���������������Ϣ
            MetaHolderFactory metaHolderFactory = META_HOLDER_FACTORY_MAP.get(HystrixPointcutType.of(method));
            //��ȡĿ�귽���ĵ�Ԫ���ݣ�����ǩ����������
            MetaHolder metaHolder = metaHolderFactory.create(joinPoint);
            /**
             * ����������CommandCollapser �� GenericCommand ��ͬ���� ��GenericObservableCommand���첽��
             * GenericCommand���кܶ�super������ͨ��HystrixCommandBuilderFactory.getInstance().create(metaHolder) ������һ��HystrixCommandBuilder��ΪGenericCommad�Ĳ���
             * new  GenericCommand ͨ��super��AbstractHystrixCommand��
             * AbstractHystrixCommand ͨ��super��HystrixCommand��
             * HystrixCommand���յ���AbstractCommand  һ·����
             * һ����AbstractCommand�з�����
             */
            HystrixInvokable invokable = HystrixCommandFactory.getInstance().create(metaHolder);
            //���ݷ���ֵ�ƶ�ִ������
            ExecutionType executionType = metaHolder.isCollapserAnnotationPresent() ?
                metaHolder.getCollapserExecutionType() : metaHolder.getExecutionType();
            //���ݲ�ͬ���������ͣ�ִ��������ؽ��
            Object result;
            try {
                //�Ƿ�����Ӧʽ�ģ�����������Щ����ͬ���Ļ�������߼���
                if (!metaHolder.isObservable()) {
                    //executeִ��
                    result = CommandExecutor.execute(invokable, executionType, metaHolder);
                } else {
                    result = executeObservable(invokable, executionType, metaHolder);
                }
            } catch (HystrixBadRequestException e) {
                throw e.getCause();
            } catch (HystrixRuntimeException e) {
                throw hystrixRuntimeExceptionToThrowable(metaHolder, e);
            }
            return result;
        }
        //HystrixCommand��ʱ��MetaHolder�Ĵ���
        private static class CommandMetaHolderFactory extends MetaHolderFactory {
            @Override
            public MetaHolder create(Object proxy, Method method, Object obj, Object[] args, final ProceedingJoinPoint joinPoint) {
                //��ȡע��HystrixCommand
                HystrixCommand hystrixCommand = method.getAnnotation(HystrixCommand.class);
                //���ݷ��ؽ���ƶ��������ͣ�����֪�������ַ�ʽִ��
                ExecutionType executionType = ExecutionType.getExecutionType(method.getReturnType());
                MetaHolder.Builder builder = metaHolderBuilder(proxy, method, obj, args, joinPoint);
                if (isCompileWeaving()) {
                    builder.ajcMethod(getAjcMethodFromTarget(joinPoint));
                }
                //����û�ж��ٲ���������Ҫ��һ��hystrixCommand������ע�������ʲô
                return builder.defaultCommandKey(method.getName())
                    .hystrixCommand(hystrixCommand)
                    .observableExecutionMode(hystrixCommand.observableExecutionMode())  //ִ��ģʽ
                    .executionType(executionType) //ִ�з�ʽ
                    .observable(ExecutionType.OBSERVABLE == executionType)
                    .build();
            }
        }
    }
    //��ö��ExecutionType����
    public static ExecutionType getExecutionType(Class<?> type) {
        if (Future.class.isAssignableFrom(type)) {
            return ExecutionType.ASYNCHRONOUS;
        } else if (Observable.class.isAssignableFrom(type)) {
            return ExecutionType.OBSERVABLE;
        } else {
            return ExecutionType.SYNCHRONOUS;
        }
    }









�����ص������ͬ������ͨ���������ǿ��Կ���HystrixInvokable �� GenericCommand������ͬ����Ŀ��� CommandExecutor.execute(invokable, executionType, metaHolder)



    public class CommandExecutor {
        public static Object execute(HystrixInvokable invokable, ExecutionType executionType, MetaHolder metaHolder) throws RuntimeException {
            Validate.notNull(invokable);
            Validate.notNull(metaHolder);
    
            switch (executionType) {
                case SYNCHRONOUS: {
                    //�ص㿴ͬ������������Ȱ�GenericCommand ת��HystrixExecutable ��ִ��execute
                    return castToExecutable(invokable, executionType).execute();
                }
                case ASYNCHRONOUS: {
                    // ǿת��HystrixExecutable  �첽ִ��
                    HystrixExecutable executable = castToExecutable(invokable, executionType);
                    // ����� fallback�����������첽ִ�У���ִ�в����ذ�װ���
                    if (metaHolder.hasFallbackMethodCommand()
                            && ExecutionType.ASYNCHRONOUS == metaHolder.getFallbackExecutionType()) {
                        return new FutureDecorator(executable.queue());
                    }
                    return executable.queue();
                }
                case OBSERVABLE: {
                    // ǿת�� HystrixObservable
                    HystrixObservable observable = castToObservable(invokable);
                    // �ж�ִ��ģʽ�ǲ��Ǽ���/���裬��ѡ��ģʽִ��
                    return ObservableExecutionMode.EAGER == metaHolder.getObservableExecutionMode() ? observable.observe() : observable.toObservable();
                }
                default:
                    throw new RuntimeException("unsupported execution type: " + executionType);
            }
        }
    }









���������Ҫ����ִ������Ӵ����п��Կ�������������ִ�����ͣ��ֱ���ͬ�����첽���Լ���Ӧʽ�����У���Ӧʽ�ַ�ΪCold Observable��observable.toObservable()�� �� HotObservable��observable.observe()��Ĭ�ϵ�executionType=SYNCHRONOUS ��ͬ������

- execute()��ͬ��ִ�У�����һ����һ�Ķ���������������ʱ�׳��쳣��
- queue()���첽ִ�У�����һ�� Future ���󣬰�����ִ�н����󷵻صĵ�һ�����
- observe()�������������һ�� Observable ��������������Ķ������������Ѿ������������ѵ��ˡ�
- toObservable()�������������һ�� Observable ��������������Ķ���������Ҫ�����Լ��ֶ����Ĳ����ѵ���
  ��ͼ��ϵ���£�

ͨ��GenericCommandһ�������Ϸ������ն�λ��HystrixCommand�и�execute()



    public abstract class HystrixCommand<R> extends AbstractCommand<R> implements HystrixExecutable<R>, HystrixInvokableInfo<R>, HystrixObservable<R> {
        //ͬ��ִ��
        public R execute() {
            try {
                //ͨ��queue().get()��ͬ��ִ�У���װ�첽����Ľ����
                return queue().get();
            } catch (Exception e) {
                throw Exceptions.sneakyThrow(decomposeException(e));
            }
        }
       //�첽ִ�У�ʲôʱ��get()���ɵ����߾�����get()��ʱ�������
       public Future<R> queue() {
            //���Ĵ������ն�λ����AbstractCommand���toObservable()��
            // toObservableת��ΪObservable,toBlockingת��ΪBlockingObservable, 
            // toFutureת��ΪFuture,�����Observable�Ĵ����Ͷ���
            final Future<R> delegate = toObservable().toBlocking().toFuture();   	
            final Future<R> f = new Future<R>() {
                .....
                @Override
                public R get() throws InterruptedException, ExecutionException {
                    return delegate.get();
                }
                @Override
                public R get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException {
                    return delegate.get(timeout, unit);
                }       	
            };
            //���⴦�����£��Ѿ�ִ�����ˣ�get()Ҳ����������
            if (f.isDone()) {
                try {
                    f.get();
                    return f;
                } catch (Exception e) {
                    ...
                }
            }
            return f;
        }
    }









�����������У��ص����ˣ�������һ��
java.util.concurrent.Future ��Ȼ����� get��ʱ��ί�ɸ� delegate���� delegate������ toObservable().toBlocking().toFuture(); ����������������������ô��롣�������ڵ��ص�Ӧ�÷��� toObservable() �����У�

3.2 toObservable
ͨ��Observable����һ�����۲��ߣ�������۲��߻ᱻtoObservable().toBlocking().toFuture() ��ʵ�������д���ĺ��ĺ������ȥ����һЩ�۶��߼��ж���ִ����ʵ��ҵ���߼�����ִ��fallback�Ļص�������Ȼ�󽫽�����ظ�Future������� run() ��������ִ��������ҵ���߼������������Ҫ�������¼����£�

- ����һ�ѵĶ�������Ҳ��֪����Щ�����Ǹ�ɶ�ģ�����Ҫ��
- �ж��Ƿ����˻��棬������ˣ�����Ҳ�����ˣ���ȥ����������Observable��ʽ����һ��������
- ����һ�����۲��ߣ�������۲��ߺ����ȥ�ص���ʵҵ���߼�����fallback��

�����߼���������۲��߻�ȥִ��applyHystrixSemantics����Ķ���



    public Observable<R> toObservable() {
        final AbstractCommand<R> _cmd = this;
        // ����ִ����Ļص����� ��ֹ��������
        //����Observable����ǰ�����ص���call���������������������쳣��ֹ
        final Action0 terminateCommandCleanup = new Action0() {
    		...
        };
        // ��������Ϊ��ȡ�����洢�ӳ٣����˱�׼����
        //ȡ������ʱ�ļ�������лص��� call����
        final Action0 unsubscribeCommandCleanup = new Action0() {
            @Override
            public void call() {
    			...
            }
        };
        // ִ������ʱ�Ļص�
        final Func0<Observable<R>> applyHystrixSemantics = new Func0<Observable<R>>() {
            @Override
            public Observable<R> call() {
                if (commandState.get().equals(CommandState.UNSUBSCRIBED)) {
                    // ������ֹ�������̡�
                    return Observable.never();
                }
                //����ִ�������Observable
                return applyHystrixSemantics(_cmd);
            }
        };
        final Func1<R, R> wrapWithAllOnNextHooks = new Func1<R, R>() {
            @Override
            public R call(R r) {
    			...
            }
        };
        final Action0 fireOnCompletedHook = new Action0() {
            @Override
            public void call() {
    			...
            }
        };
        // ����Observable,���ø��ִ������
        return Observable.defer(new Func0<Observable<R>>() {
            @Override
            public Observable<R> call() {
                // ������������־, CAS��֤����ִֻ��һ��
                if (!commandState.compareAndSet(CommandState.NOT_STARTED, CommandState.OBSERVABLE_CHAIN_CREATED)) {
                    IllegalStateException ex = new IllegalStateException("This instance can only be executed once. Please instantiate a new instance.");
                    //TODO make a new error type for this
                    throw new HystrixRuntimeException(FailureType.BAD_REQUEST_EXCEPTION, _cmd.getClass(), getLogMessagePrefix() + " command executed multiple times - this is not permitted.", ex, null);
                }
                // ���ʼʱ���
                commandStartTimestamp = System.currentTimeMillis();
                // ��ӡ��־
                if (properties.requestLogEnabled().get()) {
                    // log this command execution regardless of what happened
                    if (currentRequestLog != null) {
                        currentRequestLog.addExecutedCommand(_cmd);
                    }
                }
                // ���濪�أ�����KEY�������Hystrix�����󻺴湦�ܣ�hystrix֧�ֽ�һ������������������
                // ��һ��������ͬkey������ֱ�Ӵӻ�����ȡ�������������������
                final boolean requestCacheEnabled = isRequestCachingEnabled();
                final String cacheKey = getCacheKey();
                // ������������棬����ͼ�ӻ����ȡ��Ĭ�� false
                if (requestCacheEnabled) {
                    HystrixCommandResponseFromCache<R> fromCache = (HystrixCommandResponseFromCache<R>) requestCache.get(cacheKey);
                    if (fromCache != null) {
                        isResponseFromCache = true;
                        return handleRequestCacheHitAndEmitValues(fromCache, _cmd);
                    }
                }
                // ����ִ�������Observable
                // ����Observable, applyHystrixSemantics() ������Observable
                Observable<R> hystrixObservable =
                    Observable.defer(applyHystrixSemantics)
                    .map(wrapWithAllOnNextHooks);
                Observable<R> afterCache;
                // put in cache ������������������
                if (requestCacheEnabled && cacheKey != null) {
                    // wrap it for caching
                    HystrixCachedObservable<R> toCache = HystrixCachedObservable.from(hystrixObservable, _cmd);
                    HystrixCommandResponseFromCache<R> fromCache = (HystrixCommandResponseFromCache<R>) requestCache.putIfAbsent(cacheKey, toCache);
                    if (fromCache != null) {
                        // another thread beat us so we'll use the cached value instead
                        toCache.unsubscribe();
                        isResponseFromCache = true;
                        return handleRequestCacheHitAndEmitValues(fromCache, _cmd);
                    } else {
                        // we just created an ObservableCommand so we cast and return it
                        afterCache = toCache.toObservable();
                    }
                } else {
                    afterCache = hystrixObservable;
                }
                // �������ڻص�����
                return afterCache
                    //����Observable����ǰ�����ص������������������쳣��ֹ
                    .doOnTerminate(terminateCommandCleanup)     
                    //ȡ������ʱ�ļ���
                    .doOnUnsubscribe(unsubscribeCommandCleanup) 
                    //Observable������ֹʱ�ļ���
                    .doOnCompleted(fireOnCompletedHook);
            }
        });
    }









���������������߼�applyHystrixSemantics



    Observable<R> hystrixObservable =
        Observable.defer(applyHystrixSemantics)
        .map(wrapWithAllOnNextHooks);











    final Func0<Observable<R>> applyHystrixSemantics = new Func0<Observable<R>>() {
        @Override
        public Observable<R> call() {
            if (commandState.get().equals(CommandState.UNSUBSCRIBED)) {
                return Observable.never();
            }
            return applyHystrixSemantics(_cmd);
        }
    };









���ﴫ���_cmd��һ��GenericCommand�����ջ�ִ�е����GenericCommand�е�run������

circuitBreaker.allowRequest() ������ж��Ƿ����۶�״̬�ģ�true��ʾû�д����۶�״̬������ִ�У����򣬵��� handleShortCircuitViaFallback ʵ�ַ��񽵼������ջ�ص��������Զ����fallback�����С�

�����ǰhystrix����δ�۶�״̬����

- getExecutionSemaphore �жϵ�ǰ�����Ƿ�Ϊ�ź��������̳߳أ���ȻĬ�����̳߳أ�Ȼ���ٵ���tryAcquireʱд����Ϊtrue��

����executeCommandAndObserve��



    private Observable<R> applyHystrixSemantics(final AbstractCommand<R> _cmd) {
    
        executionHook.onStart(_cmd);
    
        // �Ƿ��������󣬼���·���Ƿ��� ������Ҳ�кü������
        if (circuitBreaker.allowRequest()) {
            // �ź�����ȡ
            final TryableSemaphore executionSemaphore = getExecutionSemaphore();
            final AtomicBoolean semaphoreHasBeenReleased = new AtomicBoolean(false);
    
            // �ź��ͷŻص�
            final Action0 singleSemaphoreRelease = new Action0() {
                @Override
                public void call() {
                    if (semaphoreHasBeenReleased.compareAndSet(false, true)) {
                        executionSemaphore.release();
                    }
                }
            };
    
            // �쳣�ص�
            final Action1<Throwable> markExceptionThrown = new Action1<Throwable>() {
                @Override
                public void call(Throwable t) {
                    eventNotifier.markEvent(HystrixEventType.EXCEPTION_THROWN, commandKey);
                }
            };
    
            // ��ȡ�źţ������ض�Ӧ�� Observable
            // �Ƿ����ź�����Դ���룬δ������ com.netflix.hystrix.AbstractCommand.TryableSemaphoreNoOp#tryAcquire Ĭ�Ϸ���ͨ��
            if (executionSemaphore.tryAcquire()) {
                try {
                    executionResult = executionResult.setInvocationStartTime(System.currentTimeMillis());
                    return executeCommandAndObserve(_cmd)   // ִ��������������ǻص������Բ���
                        .doOnError(markExceptionThrown)
                        .doOnTerminate(singleSemaphoreRelease)
                        .doOnUnsubscribe(singleSemaphoreRelease);
                } catch (RuntimeException e) {
                    return Observable.error(e);
                }
            } else {
                // ��ȡ�ź�ʧ���򽵼�
                return handleSemaphoreRejectionViaFallback();
            }
        } else {
            // ��·���Ѵ򿪣�ֱ�ӽ���
            return handleShortCircuitViaFallback();
        }
    }









������һ��ִ��ʧ�ܽ��뽵�����߼�����������ֱ�ӽ��뵽 HystrixCommand#getFallbackObservable



    public abstract class HystrixCommand<R> extends AbstractCommand<R> implements HystrixExecutable<R>, HystrixInvokableInfo<R>, HystrixObservable<R> {
        @Override
        final protected Observable<R> getFallbackObservable() {
            return Observable.defer(new Func0<Observable<R>>() {
                @Override
                public Observable<R> call() {
                    try {
                        return Observable.just(getFallback());
                    } catch (Throwable ex) {
                        return Observable.error(ex);
                    }
                }
            });
        }
    }









�����getFallback���ջ�ص������Զ���fallback������

�ص�executeCommandAndObserve�����������Ҫ����������������

- ���岻ͬ�Ļص���doOnNext��doOnCompleted��onErrorResumeNext��doOnEach��
- ����executeCommandWithSpecifiedIsolation��

��ִ�����ʱ���Կ��������� Observable.lift����ʵ��ִ�����ʱ���ܡ�



    private Observable<R> executeCommandAndObserve(final AbstractCommand<R> _cmd) {
        final HystrixRequestContext currentRequestContext = HystrixRequestContext.getContextForCurrentThread();
        // Action��Func���Ƕ����һ��������Action���޷���ֵ��Func���з���ֵ
        // doOnNext�еĻص���������ִ��֮ǰִ�еĲ���
        final Action1<R> markEmits = new Action1<R>() {
            @Override
            public void call(R r) {
                if (shouldOutputOnNextEvents()) {
                    executionResult = executionResult.addEvent(HystrixEventType.EMIT);
                    eventNotifier.markEvent(HystrixEventType.EMIT, commandKey);
                }
                if (commandIsScalar()) {
                    long latency = System.currentTimeMillis() - executionResult.getStartTimestamp();
                    eventNotifier.markCommandExecution(getCommandKey(), properties.executionIsolationStrategy().get(), (int) latency, executionResult.getOrderedList());
                    eventNotifier.markEvent(HystrixEventType.SUCCESS, commandKey);
                    executionResult = executionResult.addEvent((int) latency, HystrixEventType.SUCCESS);
                    circuitBreaker.markSuccess();
                }
            }
        };
        // doOnCompleted�еĻص�������ִ����Ϻ�ִ�еĲ���
        final Action0 markOnCompleted = new Action0() {
            @Override
            public void call() {
                if (!commandIsScalar()) {
                    long latency = System.currentTimeMillis() - executionResult.getStartTimestamp();
                    eventNotifier.markCommandExecution(getCommandKey(), properties.executionIsolationStrategy().get(), (int) latency, executionResult.getOrderedList());
                    eventNotifier.markEvent(HystrixEventType.SUCCESS, commandKey);
                    executionResult = executionResult.addEvent((int) latency, HystrixEventType.SUCCESS);
                    circuitBreaker.markSuccess();
                }
            }
        };
        // onErrorResumeNext�еĻص�������ִ��ʧ�ܺ�Ļ����߼�
        final Func1<Throwable, Observable<R>> handleFallback = new Func1<Throwable, Observable<R>>() {
            @Override
            public Observable<R> call(Throwable t) {
                Exception e = getExceptionFromThrowable(t);
                executionResult = executionResult.setExecutionException(e);
                if (e instanceof RejectedExecutionException) {
                    // �̵߳���ʧ�ܻص�
                    return handleThreadPoolRejectionViaFallback(e);
                } else if (t instanceof HystrixTimeoutException) {
                    // ��ʱ�ص�
                    return handleTimeoutViaFallback();
                } else if (t instanceof HystrixBadRequestException) {
                    // HystrixBadRequestException �쳣�ص�
                    return handleBadRequestByEmittingError(e);
                } else {
                    if (e instanceof HystrixBadRequestException) {
                        eventNotifier.markEvent(HystrixEventType.BAD_REQUEST, commandKey);
                        return Observable.error(e);
                    }
                    // ��������
                    return handleFailureViaFallback(e);
                }
            }
        };
        // doOnEach�еĻص���`Observable`ÿ����һ�����ݶ���ִ������ص�����������������
        final Action1<Notification<? super R>> setRequestContext = new Action1<Notification<? super R>>() {
            @Override
            public void call(Notification<? super R> rNotification) {
                setRequestContextIfNeeded(currentRequestContext);
            }
        };
        // ������Ӧ�� Observable��ʵ�� �̸߳��롢������ �Ȳ���
        Observable<R> execution;
        // �ж� ��ʱ��ع����Ƿ��
        if (properties.executionTimeoutEnabled().get()) {
            // HystrixObservableTimeoutOperator  ת����Ӧ�� Observable
            execution = executeCommandWithSpecifiedIsolation(_cmd)
                .lift(new HystrixObservableTimeoutOperator<R>(_cmd));
        } else {
            execution = executeCommandWithSpecifiedIsolation(_cmd);
        }
        //���ûص�
        return execution.doOnNext(markEmits)
            .doOnCompleted(markOnCompleted)
            .onErrorResumeNext(handleFallback)
            .doOnEach(setRequestContext);
    }









3.3 executeCommandWithSpecifiedIsolation
������������Ǹ��ݵ�ǰ��ͬ����Դ�������ִ�в�ͬ���߼���THREAD��SEMAPHORE��



    private Observable<R> executeCommandWithSpecifiedIsolation(final AbstractCommand<R> _cmd) {
        // �̸߳���, �Ƿ��� THREAD ��Դ���뽵��
        if (properties.executionIsolationStrategy().get() == ExecutionIsolationStrategy.THREAD) {
            //����һ��Observable
            return Observable.defer(new Func0<Observable<R>>() {
                @Override
                public Observable<R> call() {
                    executionResult = executionResult.setExecutionOccurred();
                    if (!commandState.compareAndSet(CommandState.OBSERVABLE_CHAIN_CREATED, CommandState.USER_CODE_EXECUTED)) {
                        return Observable.error(new IllegalStateException("execution attempted while in state : " + commandState.get().name()));
                    }
    
                    metrics.markCommandStart(commandKey, threadPoolKey, ExecutionIsolationStrategy.THREAD);
    
                    // �������ڰ�װ�߳��г�ʱ�����������أ����Ҳ��������κμ����������������߼�
                    if (isCommandTimedOut.get() == TimedOutStatus.TIMED_OUT) {
                        // the command timed out in the wrapping thread so we will return immediately
                        // and not increment any of the counters below or other such logic
                        return Observable.error(new RuntimeException("timed out before executing run()"));
                    }
    
                    // �����߳�����
                    if (threadState.compareAndSet(ThreadState.NOT_USING_THREAD, ThreadState.STARTED)) {
                        //we have not been unsubscribed, so should proceed
                        HystrixCounters.incrementGlobalConcurrentThreads();
                        threadPool.markThreadExecution();
                        // store the command that is being run
                        endCurrentThreadExecutingCommand = Hystrix.startCurrentThreadExecutingCommand(getCommandKey());
                        executionResult = executionResult.setExecutedInThread();
    
                        try {
                            executionHook.onThreadStart(_cmd);
                            executionHook.onRunStart(_cmd);
                            executionHook.onExecutionStart(_cmd);
                            //���� Observable,����������ջ᷵��һ����װ�����ǵ�run()�߼���Observable
                            return getUserExecutionObservable(_cmd);
                        } catch (Throwable ex) {
                            return Observable.error(ex);
                        }
                    } else {
                        //command has already been unsubscribed, so return immediately
                        return Observable.error(new RuntimeException("unsubscribed before executing run()"));
                    }
                }
            }).doOnTerminate(new Action0() {
                @Override
                public void call() {
                    if (threadState.compareAndSet(ThreadState.STARTED, ThreadState.TERMINAL)) {
                        handleThreadEnd(_cmd);
                    }
                    if (threadState.compareAndSet(ThreadState.NOT_USING_THREAD, ThreadState.TERMINAL)) {
                    }
                }
            }).doOnUnsubscribe(new Action0() {
                @Override
                public void call() {
                    if (threadState.compareAndSet(ThreadState.STARTED, ThreadState.UNSUBSCRIBED)) {
                        handleThreadEnd(_cmd);
                    }
                    if (threadState.compareAndSet(ThreadState.NOT_USING_THREAD, ThreadState.UNSUBSCRIBED)) {
                    }
                }
            }).subscribeOn(threadPool.getScheduler(new Func0<Boolean>() {
                @Override
                public Boolean call() {
                    return properties.executionIsolationThreadInterruptOnTimeout().get() && _cmd.isCommandTimedOut.get() == TimedOutStatus.TIMED_OUT;
                }
            }));
        } else {
            // �ź�������
            return Observable.defer(new Func0<Observable<R>>() {
                @Override
                public Observable<R> call() {
                    executionResult = executionResult.setExecutionOccurred();
                    if (!commandState.compareAndSet(CommandState.OBSERVABLE_CHAIN_CREATED, CommandState.USER_CODE_EXECUTED)) {
                        return Observable.error(new IllegalStateException("execution attempted while in state : " + commandState.get().name()));
                    }
                    metrics.markCommandStart(commandKey, threadPoolKey, ExecutionIsolationStrategy.SEMAPHORE);
                    endCurrentThreadExecutingCommand = Hystrix.startCurrentThreadExecutingCommand(getCommandKey());
                    try {
                        executionHook.onRunStart(_cmd);
                        executionHook.onExecutionStart(_cmd);
                        // ������ִ��
                        return getUserExecutionObservable(_cmd); 
                    } catch (Throwable ex) {
                        //If the above hooks throw, then use that as the result of the run method
                        return Observable.error(ex);
                    }
                }
            });
        }
    }









- �ж��Ƿ��������������ǻ��ڶ�·��ʵ�֣������·���򿪣�����ж�Ӧ�ص�����ʧ�ܻ򽵼�����
- ��� ��·�� �رգ�����������Ȼ�ȡ�źţ���ȡʧ�������Ӧ�ص���
- ��ȡ�ɹ������ɷ��� executeCommandAndObserve ������Ӧ�� Observable ʵ�� �̸߳��롢������ �Ȳ�����ͬʱע���˶�Ӧ�� �������ڻص���
  3.4 getUserExecutionObservable
  Ȼ���ִ�� HystrixCommand#getExecutionObservable



    abstract class AbstractCommand<R> implements HystrixInvokableInfo<R>, HystrixObservable<R> {
        private Observable<R> getUserExecutionObservable(final AbstractCommand<R> _cmd) {
            Observable<R> userObservable;
            try {
                userObservable = getExecutionObservable();
            } catch (Throwable ex) {
                userObservable = Observable.error(ex);
            }
            return userObservable
                    .lift(new ExecutionHookApplication(_cmd))
                    .lift(new DeprecatedOnRunHookApplication(_cmd));
        }
    }
    public abstract class HystrixCommand<R> extends AbstractCommand<R> implements HystrixExecutable<R>, HystrixInvokableInfo<R>, HystrixObservable<R> {
        @Override
        final protected Observable<R> getExecutionObservable() {
            return Observable.defer(new Func0<Observable<R>>() {
                @Override
                public Observable<R> call() {
                    try {
                        return Observable.just(run());
                    } catch (Throwable ex) {
                        return Observable.error(ex);
                    }
                }
            }).doOnSubscribe(new Action0() {
                @Override
                public void call() {
                    // Save thread on which we get subscribed so that we can interrupt it later if needed
                    executionThread.set(Thread.currentThread());
                }
            });
        }
    }









��� run() �����������Ѿ������ˣ�����������ҵ��ִ�з�����



    @ThreadSafe
    public class GenericCommand extends AbstractHystrixCommand<Object> {
        @Override
        protected Object run() throws Exception {
            LOGGER.debug("execute command: {}", getCommandKey().name());
            return process(new Action() {
                @Override
                Object execute() {
                    return getCommandAction().execute(getExecutionType());
                }
            });
        }
    }









���յ��õ������Լ���ҵ���߼���
# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning

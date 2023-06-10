

�����ģ��������� spring ���������̡�

12. �����������: finishRefresh()

AbstractApplicationContext#finishRefresh �������£�

    protected void finishRefresh() {
        // �����־�֪���ˣ������ʼ��������һϵ�в���ʹ�õ�����Դ����
        clearResourceCaches();
        // ��ʼ��LifecycleProcessor
        initLifecycleProcessor();
        // ����������ڲ�ʵ������������ʵ����Lifecycle�ӿڵ�bean
        getLifecycleProcessor().onRefresh();
        // ����ContextRefreshedEvent�¼�
        publishEvent(new ContextRefreshedEvent(this));
        // ���spring.liveBeansView.mbeanDomain�Ƿ���ڣ��оͻᴴ��һ��MBeanServer
        LiveBeansView.registerApplicationContext(this);
    }


����������벻�࣬�ͼ������������Ƿֱ���������

1. ������Դ���棺clearResourceCaches()

clearResourceCaches() �����������£�

    public class DefaultResourceLoader implements ResourceLoader {
    
        private final Map<Class<?>, Map<Resource, ?>> resourceCaches
            = new ConcurrentHashMap<>(4);
    
        public void clearResourceCaches() {
            this.resourceCaches.clear();
        }
    
        // ʡ���������ĺö����
        ...
    
    }


������������������� resourceCaches �ģ����Ǹ� Map���������������� Resource��

��ʲô�� Resource �أ���ǰ�����ɨ����Ĺ����У����ǻ��Ȱ� class �ļ���ȡ������ת���� Resource ���ٽ�һ������������ Resource ������ FileSystemResource��UrlResource �ȣ�resourceCaches ���Ǵ����Щ Resource �ġ�

2. ���� LifecycleProcessor

������������ʲô�� LifecycleProcessor��

    /**
     * ����������������رղ���
     */
    public interface LifecycleProcessor extends Lifecycle {
    
        /**
         * �����������ʱ����
         */
        void onRefresh();
    
        /**
         * �����ر�ʱ����
         */
        void onClose();
    
    }


����ӿ�����������������������������رղ��������������Լ�ʵ�ָýӿڣ�Ȼ����д onRefresh() �� onClose()���Ա�������������ر�ʱ��һЩ��������������

    @Component
    public class MyLifecycleProcessor implements LifecycleProcessor {
    
        @Override
        public void onRefresh() {
            System.out.println("��������");
        }
    
        @Override
        public void onClose() {
            System.out.println("�����ر�");
        }
    }


�� LifecycleProcessor ��صķ�����������initLifecycleProcessor()��getLifecycleProcessor()������һ��һΪ����������������

AbstractApplicationContext

    private LifecycleProcessor lifecycleProcessor;
    
    /**
     * ��ʼ�� LifecycleProcessor
     */
    protected void initLifecycleProcessor() {
        ConfigurableListableBeanFactory beanFactory = getBeanFactory();
        // ���ڣ�ֱ��ʹ��
        if (beanFactory.containsLocalBean(LIFECYCLE_PROCESSOR_BEAN_NAME)) {
            this.lifecycleProcessor =
                    beanFactory.getBean(LIFECYCLE_PROCESSOR_BEAN_NAME, LifecycleProcessor.class);
        }
        // �������򴴽���Ĭ��ʹ��DefaultLifecycleProcessor
        else {
            DefaultLifecycleProcessor defaultProcessor = new DefaultLifecycleProcessor();
            defaultProcessor.setBeanFactory(beanFactory);
            this.lifecycleProcessor = defaultProcessor;
            beanFactory.registerSingleton(LIFECYCLE_PROCESSOR_BEAN_NAME, this.lifecycleProcessor);
        }
    }
    
    /**
     * ���� lifecycleProcessor
     */
    LifecycleProcessor getLifecycleProcessor() throws IllegalStateException {
        if (this.lifecycleProcessor == null) {
            throw new IllegalStateException(...);
        }
        return this.lifecycleProcessor;
    }


initLifecycleProcessor �����ľ������� AbstractApplicationContext#lifecycleProcessor ���ԣ���� beanFactory �д��� initLifecycleProcessor ��ֱ��ʹ�ã�����ʹ���һ����

getLifecycleProcessor() ����ֻ�Ƿ����� AbstractApplicationContext#lifecycleProcessor ���ԡ�

�� getLifecycleProcessor().onRefresh() �У��������� onRefresh() ����������һ�������� DefaultLifecycleProcessor#onRefresh ����ʲô��

    @Override
    public void onRefresh() {
        startBeans(true);
        this.running = true;
    }


�ӱ��������������������ֻ�Ǹ���һ������״̬��

3. ���� ContextRefreshedEvent �¼�

���� publishEvent(new ContextRefreshedEvent(this)) ������ ContextRefreshedEvent�������Լ�Ҳ�������������¼��������¼������Ĳ����������룬���� spring �¼�����ϸ���������Բο� spring ̽��֮ spring �¼����ơ�

13. �������: resetCommonCaches()

�÷����������£�

    protected void resetCommonCaches() {
        ReflectionUtils.clearCache();
        AnnotationUtils.clearCache();
        ResolvableType.clearCache();
        CachedIntrospectionResults.clearClassLoader(getClassLoader());
    }


�ӷ�������������ִ�и��ֻ��棬ִ�бȽϼ򵥣��Ͳ���ˡ�

---

����ԭ�����ӣ�https://my.oschina.net/funcy/blog/4892555 ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

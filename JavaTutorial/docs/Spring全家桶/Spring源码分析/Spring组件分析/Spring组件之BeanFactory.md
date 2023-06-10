public interface BeanFactory {

    /**
     * factoryBeanʹ��
     */
    String FACTORY_BEAN_PREFIX = "&";

    /**
     * �������ƻ�ȡbean
     */
    Object getBean(String name) throws BeansException;

    /**
     * �������ƻ�ȡbean
     */
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;

    /**
     * �������ƻ�ȡbean
     */
    Object getBean(String name, Object... args) throws BeansException;

    /**
     * �������ͻ�ȡbean
     */
    <T> T getBean(Class<T> requiredType) throws BeansException;

    /**
     * �������ͻ�ȡbean
     */
    <T> T getBean(Class<T> requiredType, Object... args) throws BeansException;

    /**
     * ��ȡBeanProvider
     */
    <T> ObjectProvider<T> getBeanProvider(Class<T> requiredType);

    /**
     * ��ȡBeanProvider
     */
    <T> ObjectProvider<T> getBeanProvider(ResolvableType requiredType);

    /**
     * �Ƿ����bean
     */
    boolean containsBean(String name);

    /**
     * �Ƿ�Ϊ����bean
     */
    boolean isSingleton(String name) throws NoSuchBeanDefinitionException;

    /**
     * �Ƿ�Ϊԭ��bean
     */
    boolean isPrototype(String name) throws NoSuchBeanDefinitionException;

    /**
     * �ж������Ƿ�ƥ��
     */
    boolean isTypeMatch(String name, ResolvableType typeToMatch) 
            throws NoSuchBeanDefinitionException;

    /**
     * �ж������Ƿ�ƥ��
     */
    boolean isTypeMatch(String name, Class<?> typeToMatch) 
            throws NoSuchBeanDefinitionException;

    /**
     * �������ƻ�ȡbean������
     */
    @Nullable
    Class<?> getType(String name) throws NoSuchBeanDefinitionException;

    /**
     * �������ƻ�ȡbean������
     */
    @Nullable
    Class<?> getType(String name, boolean allowFactoryBeanInit) 
            throws NoSuchBeanDefinitionException;

    /**
     * ����bean���ƻ�ȡbean�ı���
     */
    String[] getAliases(String name);

}

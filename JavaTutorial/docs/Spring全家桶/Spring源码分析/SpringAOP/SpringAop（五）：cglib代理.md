

[��һƪ����](https://my.oschina.net/funcy/blog/4696654 "��һƪ����")������ spring �� jdK ��̬�������������� spring �� cglib ����

### 1\. cglib ������

jdk ��Ȼ�ṩ�˶�̬�������Ƕ�̬������һ�����㣺**�����û��ʵ�ֽӿڣ����޷� jdk ��̬����**��Ϊ�˽��������㣬spring �������� cglib ����

cglib �ײ��ǻ��� asm �ģ�Ҳ����ֱ�Ӳ����ֽ��룬�൱�ڶ� asm ������һ���װ��ֱ�Ӳ������룬��Ҫ�� java ָ��ֽ����ļ������������ܽ��У����ֽ����ɬ�Ѷ���һ�㲻����ֱ�Ӳ������� cglib ��װ���ֽ���Ĳ����ͱ�ü򵥶��ˣ����**�����������¶�����ʹ�� cglib ��װ�õķ����������ֽ������**��

spring cglib ����λ�� `spring-core` ģ�飺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6b64440344221ca08ed8c822b5b22c1d341.png)

�������� asm �� cglib ��˵����

```
/**
 * Spring's repackaging of
 * ASM 7.0
 * (with Spring-specific patches; for internal use only).
 *
 * <p>This repackaging technique avoids any potential conflicts with
 * dependencies on ASM at the application level or from third-party
 * libraries and frameworks.
 *
 * <p>As this repackaging happens at the class file level, sources
 * and javadocs are not available here.
 */
 package org.springframework.asm;

```

ע���һ�䣺`Spring's repackaging of ASM 7.0`���������� spring �� `asm7.0` ���´��.

```
/**
 * Spring's repackaging of
 * CGLIB 3.3
 * (with Spring-specific patches; for internal use only).
 *
 * <p>This repackaging technique avoids any potential conflicts with
 * dependencies on CGLIB at the application level or from third-party
 * libraries and frameworks.
 *
 * <p>As this repackaging happens at the class file level, sources
 * and javadocs are not available here.
 */
package org.springframework.cglib;

```

ע���һ�䣺`Spring's repackaging of CGLIB 3.3`���������� spring �� `CGLIB 3.3` ���´��.

��ν���´���أ�������⣬���ǽ� `asm7.0` �� `CGLIB 3.3` ��Դ��ĸ����������Ƶ� spring ��Ŀ�¡���� spring ��û���� `gradle` �ļ������� `asm` �� `cglib` ���൱ jar ������������Ŀ��ֱ����������������Ŀ��Դ�룡

### 2\. cglib ����ʾ��

����ʽ��ʼ֮ǰ������������ �� cglib ��������ν��еġ�

����׼��һ���ࣺ

```
package org.springframework.learn.demo04;

public class CglibProxyService {
    public void hello01() {
        System.out.println("hello01");
    }
}

```

��׼��һ�� `MethodInterceptor`����� jdk ��̬�����е� `InvocationHandler`����

```
package org.springframework.learn.demo04;

import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

public class MyMethodInterceptor implements MethodInterceptor {

    /** Ŀ����� */
    private Object target;

    public MyMethodInterceptor(Object target){
        this.target = target;
    }

    @Override
    public Object intercept(Object proxyObj, Method method, Object[] objects, 
                MethodProxy proxy) throws Throwable {
        System.out.println("ִ�з���Ϊ:" + method.getName());
        return proxy.invoke(target, objects);
    }
}

```

��������ࣺ

```
package org.springframework.learn.demo04;

import org.springframework.cglib.proxy.Enhancer;

/**
 * ���������������
 *
 * @author fangchengyan
 * @date 2020-11-01 9:23 ����
 */
public class Demo04Main {

    public static void main(String[] args) {
        CglibProxyService target = new CglibProxyService();
        MyMethodInterceptor interceptor = new MyMethodInterceptor(target);

        Enhancer enhancer = new Enhancer();
        // ���ø���
        enhancer.setSuperclass(CglibProxyService.class);
        // ����callback�����callback���������ṩ�� MyMethodInterceptor
        enhancer.setCallback(interceptor);
        // ʹ�� enhancer �����������
        CglibProxyService proxy = (CglibProxyService)enhancer.create();
        proxy.hello01();
    }
}

```

���У�������£�

```
ִ�з���Ϊ:hello01
hello01

```

���Կ������������� `MyMethodInterceptor#intercept` ִ��Ŀ�����ķ�����

ͬ jdk ��̬����ȽϺ󣬷������ߴ���߶����ƣ�

*   `InvocationHandler` �� `InvocationHandler`�����ߴ�����ʽ����һ�� ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-6f3e8213e743554a7a8ffc587b98b1d7d3a.png)

*   �������Ĵ�����һ����ʹ�� `Enhangcer` ���д�����󴴽���һ����ʹ�÷�װ�õķ������ж��󴴽��� ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8ee847f9cbb7ec7fa6c35b2ad5a5537ef3a.png)

�Ӵ�����󴴽����������Կ��� `cglib` ���ɶ���ʱ�����õĲ����϶࣬���ܽϷḻ��

���� `Enhangcer` ����δ�����������Լ� `org.springframework.asm` �� `org.springframework.cglib` ���������µĴ��룬��Щ���� cglib �����ݣ��Ͳ���������ˡ�

### 3\. spring �� `cglib` �����������

������������ spring ����δ����������ģ�

> CglibAopProxy#getProxy(java.lang.ClassLoader)

```
public Object getProxy(@Nullable ClassLoader classLoader) {
    try {
        Class<?> rootClass = this.advised.getTargetClass();
        Assert.state(rootClass != null, "...");

        Class<?> proxySuperClass = rootClass;
        if (rootClass.getName().contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {
            proxySuperClass = rootClass.getSuperclass();
            Class<?>[] additionalInterfaces = rootClass.getInterfaces();
            for (Class<?> additionalInterface : additionalInterfaces) {
                this.advised.addInterface(additionalInterface);
            }
        }

        // ��Ŀ������м�飬��Ҫ������������
        // 1\. Ŀ�귽������ʹ��final���Σ�
        // 2\. Ŀ�귽��������private���͵ģ�
        // 3\. Ŀ�귽�������ǰ�����Ȩ�޵ģ�
        // �������������κ�һ������ǰ�����Ͳ��ܱ�������ʱ�÷����ͻᱻ�Թ�
        validateClassIfNecessary(proxySuperClass, classLoader);

        Enhancer enhancer = createEnhancer();
        if (classLoader != null) {
            enhancer.setClassLoader(classLoader);
            if (classLoader instanceof SmartClassLoader &&
                    ((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {
                enhancer.setUseCache(false);
            }
        }
        // Superclass����Ҫ�������
        enhancer.setSuperclass(proxySuperClass);
        // ����AopProxyUtils.completeProxiedInterfaces()��������ҪĿ����ΪҪ���ɵĴ�����
        // ����SpringProxy��Advised��DecoratingProxy������Ҫʵ�ֵĽӿڡ����������ӿڵ��������£�
        // 1\. SpringProxy����һ���սӿڣ����ڱ�ǵ�ǰ���ɵĴ�������Spring���ɵĴ����ࣻ
        // 2\. Advised��Spring���ɴ�������ʹ�õ����Զ������ڸýӿ��У�
        //    ����Advisor��Advice������������ԣ�
        // 3\. DecoratingProxy���ýӿ����ڻ�ȡ��ǰ��������������Ŀ������Class���͡�
        enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
        enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
        enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));

        // ���callback
        Callback[] callbacks = getCallbacks(rootClass);
        Class<?>[] types = new Class<?>[callbacks.length];
        for (int x = 0; x < types.length; x++) {
            types[x] = callbacks[x].getClass();
        }
        // ���ô������и���������Ҫʹ�õ������߼�������ProxyCallbackFilter.accept()��������
        // ������ֵ����һһ��Ӧ����Callback�����и��������߼����±꣬Ҳ����˵�����CallbackFilter
        // ����������ָ���˴������и���������Ҫʹ��Callback�����е��ĸ����ļ��������߼�
        enhancer.setCallbackFilter(new ProxyCallbackFilter( this.advised.getConfigurationOnlyCopy(),
                this.fixedInterceptorMap, this.fixedInterceptorOffset));
        enhancer.setCallbackTypes(types);

        // ���ɴ������
        return createProxyClassAndInstance(enhancer, callbacks);
    }
    catch (...) {
        ...
    }
}

```

���ϴ������������ `Enhancer` �����ԣ��� `classLoader`��`superclass`��`callbackFilter` �ȣ������� `createProxyClassAndInstance(xxx)` �����������

> ObjenesisCglibAopProxy#createProxyClassAndInstance

```
protected Object createProxyClassAndInstance(Enhancer enhancer, Callback[] callbacks) {
    // ����������
    Class<?> proxyClass = enhancer.createClass();
    Object proxyInstance = null;

    // ���ݴ����࣬ʹ�÷������ɶ���
    if (objenesis.isWorthTrying()) {
        try {
            proxyInstance = objenesis.newInstance(proxyClass, enhancer.getUseCache());
        }
        catch (Throwable ex) {
            ...
        }
    }

    if (proxyInstance == null) {
        try {
            Constructor<?> ctor = (this.constructorArgs != null ?
                    proxyClass.getDeclaredConstructor(this.constructorArgTypes) :
                    proxyClass.getDeclaredConstructor());
            ReflectionUtils.makeAccessible(ctor);
            proxyInstance = (this.constructorArgs != null ?
                    ctor.newInstance(this.constructorArgs) : ctor.newInstance());
        }
        catch (Throwable ex) {
            throw new AopConfigException(...);
        }
    }
    // ����callback����
    // �������˶�� callback ʱ����ͨ�� CallbackFilter ��ȷ������ʹ���ĸ� callback
    ((Factory) proxyInstance).setCallbacks(callbacks);
    return proxyInstance;
}

```

ͨ���ڵڶ����ֵ� `demo04` ����֪����cglib ������ִ�У��ᾭ�� `MethodInterceptor#intercept` �������õģ�Ҳ���� `Enhancer` �� `callback` ���ԣ���˽��������������� `callback` �Ļ�ȡ����ش���λ�� `CglibAopProxy#getCallbacks`��

> CglibAopProxy#getCallbacks

```
private Callback[] getCallbacks(Class<?> rootClass) throws Exception {
    boolean exposeProxy = this.advised.isExposeProxy();
    boolean isFrozen = this.advised.isFrozen();
    boolean isStatic = this.advised.getTargetSource().isStatic();

    // �û��Զ���Ĵ����߼���callback���������У������ @Before��@Around��@After�����淽����
    // ����DynamicAdvisedInterceptor���е���
    Callback aopInterceptor = new DynamicAdvisedInterceptor(this.advised);

    Callback targetInterceptor;
    // �ж����Ҫ��¶�����������ǣ���ʹ��AopContext���ý�����������õ�ThreadLocal��
    // �û������ͨ��AopContext��ȡĿ�����
    if (exposeProxy) {
        // �жϱ�����Ķ����Ƿ��Ǿ�̬�ģ�����Ǿ�̬�ģ���Ŀ����󻺴�������ÿ�ζ�ʹ�øö��󼴿ɣ�
        // ���Ŀ������Ƕ�̬�ģ�����DynamicUnadvisedExposedInterceptor��ÿ�ζ�����һ���µ�
        // Ŀ�������֯�����Ĵ����߼�
        targetInterceptor = (isStatic ?
                new StaticUnadvisedExposedInterceptor(this.advised.getTargetSource().getTarget()) :
                new DynamicUnadvisedExposedInterceptor(this.advised.getTargetSource()));
    }
    else {
        // �����������������������Ψһ����������Ƿ�ʹ��AopContext��¶���ɵĴ������
        targetInterceptor = (isStatic ?
                new StaticUnadvisedInterceptor(this.advised.getTargetSource().getTarget()) :
                new DynamicUnadvisedInterceptor(this.advised.getTargetSource()));
    }

    // ��ǰCallback���ڲ��ñ�����ķ���
    Callback targetDispatcher = (isStatic ?
            new StaticDispatcher(this.advised.getTargetSource().getTarget()) : new SerializableNoOp());

    // ����ȡ����callback��װΪһ������
    Callback[] mainCallbacks = new Callback[] {
            // �û��Լ������������
            aopInterceptor,  // for normal advice
            // ���������Ƿ�¶��������������
            targetInterceptor,  // invoke target without considering advice, if optimized
            // �����κβ�����������
            new SerializableNoOp(),  // no override for methods mapped to this
            // ���ڴ洢Advised����ķַ���
            targetDispatcher, this.advisedDispatcher,
            // ���equals�������õ�������
            new EqualsInterceptor(this.advised),
            // ���hashcode�������õ�������
            new HashCodeInterceptor(this.advised)
    };

    Callback[] callbacks;

    // ���Ŀ������Ǿ�̬�ģ����������߼��ĵ������ǹ̶��ģ����Ŀ�������������������л���
    if (isStatic && isFrozen) {
        Method[] methods = rootClass.getMethods();
        Callback[] fixedCallbacks = new Callback[methods.length];
        this.fixedInterceptorMap = new HashMap<>(methods.length);

        for (int x = 0; x < methods.length; x++) {
            Method method = methods[x];
            // ��ȡĿ�����������߼�
            List<Object> chain = this.advised
                    .getInterceptorsAndDynamicInterceptionAdvice(method, rootClass);
            fixedCallbacks[x] = new FixedChainStaticTargetInterceptor(
                    chain, this.advised.getTargetSource().getTarget(), this.advised.getTargetClass());
            // �Ե��������л���
            this.fixedInterceptorMap.put(method, x);
        }

        // �����ɵľ�̬����������Callback������
        callbacks = new Callback[mainCallbacks.length + fixedCallbacks.length];
        System.arraycopy(mainCallbacks, 0, callbacks, 0, mainCallbacks.length);
        System.arraycopy(fixedCallbacks, 0, callbacks, mainCallbacks.length, fixedCallbacks.length);
        // ����fixedInterceptorOffset��¼�˵�ǰ��̬�ĵ������������߼�����ʼλ�ã�
        // �����¼���ô����ں���ʹ��CallbackFilter��ʱ����������Ǿ�̬�ĵ�������
        // ��ֱ��ͨ���ò�����ȡ��Ӧ�ĵ���������ֱ���Թ���ǰ��Ķ�̬������
        this.fixedInterceptorOffset = mainCallbacks.length;
    }
    else {
        callbacks = mainCallbacks;
    }
    return callbacks;
}

```

���ϴ���Ƚϳ�����Ҫ���þ��ǻ�ȡ `callback`����Ȼ spring �ṩ���ڶ� `callback`�����������Զ���֪ͨ��ص� callback ֻ��һ���� `DynamicAdvisedInterceptor`������� `callback` �� `CglibAopProxy.DynamicAdvisedInterceptor#intercept` �����У������ڴ����е��Զ�֪ͨ����������ִ�еġ�

��һ�����ǵõ� cglib �Ĵ������󣬽����������������淽�������ִ�еġ�

### 4\. cglib ���淽����ִ��

cglib ���淽����ִ�� `CglibAopProxy.DynamicAdvisedInterceptor#intercept` ������

> `CglibAopProxy.DynamicAdvisedInterceptor#intercept`

```
public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) 
        throws Throwable {
    Object oldProxy = null;
    boolean setProxyContext = false;
    Object target = null;
    // ͨ��TargetSource��ȡĿ�����
    TargetSource targetSource = this.advised.getTargetSource();
    try {
        // �ж������Ҫ��¶��������򽫵�ǰ����������õ�ThreadLocal��
        if (this.advised.exposeProxy) {
            oldProxy = AopContext.setCurrentProxy(proxy);
            setProxyContext = true;
        }
        target = targetSource.getTarget();
        Class<?> targetClass = (target != null ? target.getClass() : null);
        // ��ȡĿ����������߼��ĵ�����
        List<Object> chain = this.advised
                .getInterceptorsAndDynamicInterceptionAdvice(method, targetClass);
        Object retVal;
        if (chain.isEmpty() && Modifier.isPublic(method.getModifiers())) {
            Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
            // û����������ֱ�ӵ���Ŀ�����ķ���
            retVal = methodProxy.invoke(target, argsToUse);
        }
        else {
            // �������������裺
            // 1\. ����ִ������new CglibMethodInvocation()
            // 2\. ִ������������CglibMethodInvocation#proceed
            retVal = new CglibMethodInvocation(proxy, target, method, args, 
                    targetClass, chain, methodProxy).proceed();
        }
        // �Է���ֵ���д����������ֵ���ǵ�ǰĿ�������ô���������ɵĴ�����󷵻أ�
        // �������ֵΪ�գ����ҷ���ֵ�����Ƿ�void�Ļ����������ͣ����׳��쳣��
        // ����������������������ϣ���ֱ�ӽ����ɵķ���ֵ����
        retVal = processReturnType(proxy, target, method, retVal);
        return retVal;
    }
    finally {
        if (target != null && !targetSource.isStatic()) {
            targetSource.releaseTarget(target);
        }
        if (setProxyContext) {
            AopContext.setCurrentProxy(oldProxy);
        }
    }
}

```

����ִ������ `new CglibMethodInvocation(proxy, target, method, args, targetClass, chain, methodProxy).proceed()`����������ȥ��

> CglibAopProxy.CglibMethodInvocation#proceed

```
public Object proceed() throws Throwable {
    try {
        return super.proceed();
    }
    catch (...) {
        ....
    }
}

```

ֱ�ӵ��õ��Ǹ���ķ�����`CglibAopProxy.CglibMethodInvocation` �ĸ�����˭�أ�һ����ȥ�����־�Ȼ�� `ReflectiveMethodInvocation`��`super.proceed()` ���õ��� `ReflectiveMethodInvocation#proceed`��

��[��һ ƪ����](https://my.oschina.net/funcy/blog/4696654 "��һ ƪ����")�У����Ǿ���ϸ������ `ReflectiveMethodInvocation#proceed` �ĵ��ù��̣������ڣ��� cglib ���������ִ�е�Ҳ��ͬ���Ĵ��룬��һ���ִ�й��̾Ͳ��ظ������ˡ�

�����һ��ͼ��˵������֪ͨ��ִ�й��̣�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-1c31c8e6279af4c150df18ebbd345c7f110.png)

���յ�ִ��˳��

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a1f3ccebe3b7335eaef88b8a39ca36b9e05.png)

### 5\. �ܽ�

���ķ����� cglib �����ִ�й��̣������ִ������λ�� `CglibAopProxy.DynamicAdvisedInterceptor#intercept`�����յ��õ��� `ReflectiveMethodInvocation#proceed`������ jdk ��̬�����ִ��������ͬ��

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4696655](https://my.oschina.net/funcy/blog/4696655) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
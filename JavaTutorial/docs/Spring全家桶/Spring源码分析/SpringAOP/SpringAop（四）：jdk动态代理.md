

��һƪ���µ�������Ƿ����� spring ���ڴ����˴���������д������ķ�ʽΪ `jdk��̬����`�� `cglib����`���������ǽ����� spring �Ķ�̬����

### 1. jdk ��̬�������

������ spring �Ķ�̬����ǰ�����������˽��� jdk �Ķ�̬����jdk ��̬������Ҫ�ӿڣ�Ϊ��������׼�������ӿڣ�

> IJdkDynamicProxy01

```java
package org.springframework.learn.demo03;

public interface IJdkDynamicProxy01 {
    void hello01();
}
```

> IJdkDynamicProxy02

```java
package org.springframework.learn.demo03;

public interface IJdkDynamicProxy02 {
    void hello02();
}
```

����׼������ʵ���ࣺ

> JdkDynamicProxyImpl01

```java
package org.springframework.learn.demo03;

public class JdkDynamicProxyImpl01 implements IJdkDynamicProxy01, IJdkDynamicProxy02{
    @Override
    public void hello01() {
        System.out.println("hello01");
    }

    @Override
    public void hello02() {
        System.out.println("hello02");
    }
}
```

> JdkDynamicProxyImpl02

```java
package org.springframework.learn.demo03;

public class JdkDynamicProxyImpl02 implements IJdkDynamicProxy01 {

    @Override
    public void hello01() {
        System.out.println("hello01");
    }

}
```

������Ҫע����ǣ�`JdkDynamicProxyImpl01` ʵ���� `IJdkDynamicProxy01` �� `IJdkDynamicProxy02` �����ӿڣ�`JdkDynamicProxyImpl02` ֻʵ���� `IJdkDynamicProxy01` һ�� �ӿڡ�

����׼��һ�� `InvocationHandler`:

> MyInvocationHandler

```java
package org.springframework.learn.demo03;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

public class MyInvocationHandler implements InvocationHandler {

     /** Ŀ����� */
     private Object target;

    public MyInvocationHandler(Object target){
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("ִ�з���Ϊ:" + method.getName());
        // ����������ִ��������
        Object rs = method.invoke(target,args);
        return rs;
    }

}
```

���������:

```java
package org.springframework.learn.demo03;

import java.lang.reflect.Proxy;

public class Demo03Main {

    public static void main(String[] args) {
        System.out.println("------------bean01------------");
        JdkDynamicProxyImpl01 bean01 = new JdkDynamicProxyImpl01();
        Object obj1 = Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(),
                // JdkDynamicProxyImpl01ʵ���� IJdkDynamicProxy01, IJdkDynamicProxy02
                // �����classΪ IJdkDynamicProxy01, IJdkDynamicProxy02
                new Class<?>[]{ IJdkDynamicProxy01.class, IJdkDynamicProxy02.class },
                new MyInvocationHandler(bean01));
        // ���Խ�������ǿ��ת��
        ((IJdkDynamicProxy01) obj1).hello01();
        ((IJdkDynamicProxy02) obj1).hello02();

        System.out.println("------------bean01------------");
        Object obj2 = Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(),
                 // JdkDynamicProxyImpl01ʵ���� IJdkDynamicProxy01, IJdkDynamicProxy02
                 // �����classΪ IJdkDynamicProxy01
                 new Class<?>[]{ IJdkDynamicProxy01.class },
                 new MyInvocationHandler(bean01));
        ((IJdkDynamicProxy01) obj2).hello01();
        // ���쳣��java.lang.ClassCastException: class com.sun.proxy.$Proxy1 cannot be cast to class xxx
        //((IJdkDynamicProxy02) obj2).hello02();

        System.out.println("-----------bean02-------------");
        JdkDynamicProxyImpl02 bean02 = new JdkDynamicProxyImpl02();
        Object obj3 = Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(),
                 // JdkDynamicProxyImpl01ʵ���� IJdkDynamicProxy01
                 // �����classΪ IJdkDynamicProxy01, IJdkDynamicProxy02
                 new Class<?>[]{ IJdkDynamicProxy01.class, IJdkDynamicProxy02.class },
                 new MyInvocationHandler(bean02));
        ((IJdkDynamicProxy01) obj3).hello01();
        IJdkDynamicProxy02 proxy02 = (IJdkDynamicProxy02) obj3;
        // ���쳣��java.lang.IllegalArgumentException: object is not an instance of declaring class
        //proxy02.hello02();

    }
}
```

���н����

```
ִ�з���Ϊ:hello01
hello01
ִ�з���Ϊ:hello02
hello02
------------bean01------------
ִ�з���Ϊ:hello01
hello01
-----------bean02-------------
ִ�з���Ϊ:hello01
hello01
```

�Խ���������£�

1. `Proxy#newProxyInstance(ClassLoader, Class<?>[], InvocationHandler)` �ĵڶ�����������Ľӿڣ��������Ǵ�����������Ľӿ����ͣ�������������ִ����������������ִ��Ϊ�� `invoke()` ������
2. `JdkDynamicProxyImpl01` ͬʱʵ���� `IJdkDynamicProxy01` �� `IJdkDynamicProxy02` �ӿڣ�������ӿ�����ʱ��ֻ������ `IJdkDynamicProxy01`����������� obj2 ǿתΪ `IJdkDynamicProxy02` ʱ���ͻᱨ `ClassCastException`��ǿתʧ�ܣ������ `Proxy#newProxyInstance(ClassLoader, Class<?>[], InvocationHandler)` �������Ǵ�����������Ľӿ����ͣ�
3. `JdkDynamicProxyImpl02` ֻʵ���� `IJdkDynamicProxy01` �ӿڣ�������ӿ�����ʱ�������� `IJdkDynamicProxy01` �� `IJdkDynamicProxy02`����������� `obj3` ǿתΪ `IJdkDynamicProxy02` ʱ����δ���쳣��������ִ�� `proxy02.hello02()` ʱ��ȴ���� `java.lang.IllegalArgumentException: object is not an instance of declaring class`��ͬ�������� `Proxy#newProxyInstance(ClassLoader, Class<?>[], InvocationHandler)` �������Ǵ�����������Ľӿ����ͣ���Ŀ�����������޹ء�

### 2. �ٴη��� spring jdk ��̬�������Ĵ���

��������ķ����������������� spring ����δ����������ģ�

```java
@Override
public Object getProxy(@Nullable ClassLoader classLoader) {
    // ��ȡĿ�����ʵ�ֵĽӿ�
    Class<?>[] proxiedInterfaces = AopProxyUtils.completeProxiedInterfaces(this.advised, true);
    // �Ƿ���equals()��hashCode()����
    findDefinedEqualsAndHashCodeMethods(proxiedInterfaces);
    // ���� jdk ���� ��������
    return Proxy.newProxyInstance(classLoader, proxiedInterfaces, this);
}
```

1. ����Ľӿ�Ϊ `proxiedInterfaces`�����ֵ������Ŀ����ʵ�ֵ����нӿڣ�ͬʱ spring Ҳ���������Ľӿڣ��� `SpringProxy`��`Advised`����Щ����һƪ�����Ѿ���ϸ�������ˣ�
2. ָ�� `InvocationHandler` Ϊ `this`��Ҳ���� `JdkDynamicAopProxy` �Ķ���ʵ���� `JdkDynamicAopProxy` ʵ���� `InvocationHandler`.

�ɵ�һ���ֵķ�����֪��jdk ��̬�������ķ����������� `java.lang.reflect.InvocationHandler#invoke` ��ִ�еģ�Ҳ���� `JdkDynamicAopProxy#invoke`�����������Ǿ������� `JdkDynamicAopProxy#invoke` ������������ spring �����ִ�д������ġ�

### 3. jdk ��̬��������ִ��

spring jdk ��̬��������ִ���� `JdkDynamicAopProxy#invoke`��

> JdkDynamicAopProxy#invoke

```java
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    Object oldProxy = null;
    boolean setProxyContext = false;

    TargetSource targetSource = this.advised.targetSource;
    Object target = null;

    try {
        // ��ִ�е� equals ����������Ҫ����ִ��
        if (!this.equalsDefined && AopUtils.isEqualsMethod(method)) {
            return equals(args[0]);
        }
        // ��ִ�е� hashCode ����������Ҫ����ִ��
        else if (!this.hashCodeDefined && AopUtils.isHashCodeMethod(method)) {
            return hashCode();
        }
        // ���ִ�е�class������DecoratingProxy��Ҳ����Ҫ����ִ��
        else if (method.getDeclaringClass() == DecoratingProxy.class) {
            return AopProxyUtils.ultimateTargetClass(this.advised);
        }
        else if (!this.advised.opaque && method.getDeclaringClass().isInterface() &&
                method.getDeclaringClass().isAssignableFrom(Advised.class)) {
            return AopUtils.invokeJoinpointUsingReflection(this.advised, method, args);
        }

        Object retVal;

        // �ж� advised��exposeProxy ֵ�Ƿ�Ϊ true
        // advised��exposeProxy��Դ�� @EnableAspectJAutoProxy �� exposeProxy
        // �� ������ָ��ʱ��@EnableAspectJAutoProxy(exposeProxy = true)�����´���ִ��
        if (this.advised.exposeProxy) {
            // ����ǰ�� proxy ����ŵ� threadLocal ��
            // �������� (UserService (AopContext.currentProxy)).getUser() ��ʽ����
            oldProxy = AopContext.setCurrentProxy(proxy);
            setProxyContext = true;
        }

        // ��ȡĿ�����Ŀ������class
        target = targetSource.getTarget();
        Class<?> targetClass = (target != null ? target.getClass() : null);

        // �� aop �� advisor ת��Ϊ���������������жϸ÷�������ʹ����Щ���淽��
        List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(
                method, targetClass);
        if (chain.isEmpty()) {
            // ����������������Ϊ�գ������÷���û�б����أ�ͨ������ֱ��ִ��
            Object[] argsToUse = AopProxyUtils.adaptArgumentsIfNecessary(method, args);
            retVal = AopUtils.invokeJoinpointUsingReflection(target, method, argsToUse);
        }
        else {
            // ����һ���������ö���
            MethodInvocation invocation =
                   new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);
            // ����ִ�У��ص�
            retVal = invocation.proceed();
        }

        Class<?> returnType = method.getReturnType();
        if (retVal != null && retVal == target &&
                returnType != Object.class && returnType.isInstance(proxy) &&
                !RawTargetAccess.class.isAssignableFrom(method.getDeclaringClass())) {
            retVal = proxy;
        }
        else if (retVal == null && returnType != Void.TYPE && returnType.isPrimitive()) {
            throw new AopInvocationException(...);
        }
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

���Ϸ����������£�

1. �ж�Ҫִ�еķ����Ƿ�Ϊ `equals`��`hashcode` �ȣ���Щ��������Ҫ����
2. ��ȡ������Ҫִ�еķ������������淽�����õ�һ�����������ϣ�
3. �������淽�������뼰Ŀ�귽����

���������ص��ע���淽����Ŀ�귽����ִ�У��ؼ��������£�

```java
// �� aop �� advisor ת��Ϊ���������������жϸ÷�������ʹ����Щ���淽��
List<Object> chain = this.advised.getInterceptorsAndDynamicInterceptionAdvice(
        method, targetClass);
// ����һ���������ö���
MethodInvocation invocation =
       new ReflectiveMethodInvocation(proxy, target, method, args, targetClass, chain);
// ����ִ�У��ص�
retVal = invocation.proceed();
```

#### ��ȡ `MethodInterceptor`

�ڷ���������ִ��ǰ�������������� `getInterceptorsAndDynamicInterceptionAdvice(...)`�����������������ȡִ�е����淽���ģ�Ҳ���� `MethodInterceptor`��

> AdvisedSupport#getInterceptorsAndDynamicInterceptionAdvice

```java
public List<Object> getInterceptorsAndDynamicInterceptionAdvice(Method method, 
        @Nullable Class<?>targetClass) {
    MethodCacheKey cacheKey = new MethodCacheKey(method);
    List<Object> cached = this.methodCache.get(cacheKey);
    if (cached == null) {
        // ����������������ȡ��������ٷ���
        cached = this.advisorChainFactory.getInterceptorsAndDynamicInterceptionAdvice(
                this, method, targetClass);
        this.methodCache.put(cacheKey, cached);
    }
    return cached;
}
```

������

```java
/**
 * ��ȡ Interceptor���������£�
 */
@Override
public List<Object> getInterceptorsAndDynamicInterceptionAdvice(
        Advised config, Method method, @Nullable Class<?> targetClass) {
    AdvisorAdapterRegistry registry = GlobalAdvisorAdapterRegistry.getInstance();
    // ��ȡ advisors��aop��advisors���£�
    Advisor[] advisors = config.getAdvisors();
    List<Object> interceptorList = new ArrayList<>(advisors.length);
    Class<?> actualClass = (targetClass != null ? targetClass : method.getDeclaringClass());
    Boolean hasIntroductions = null;
    for (Advisor advisor : advisors) {
        // ���advisor��PointcutAdvisor����ʹ��PointcutAdvisor���Pointcut����ƥ��
        if (advisor instanceof PointcutAdvisor) {
            PointcutAdvisor pointcutAdvisor = (PointcutAdvisor) advisor;
            // �����ж������߼��ĵ������Ƿ���ǰ���й����ˣ�������й������ٽ���Ŀ�귽����ƥ�䣬
            // ���û�У����ٽ���һ��ƥ�䡣
            if (config.isPreFiltered() 
                    || pointcutAdvisor.getPointcut().getClassFilter().matches(actualClass)) {
                MethodMatcher mm = pointcutAdvisor.getPointcut().getMethodMatcher();
                boolean match;
                if (mm instanceof IntroductionAwareMethodMatcher) {
                    if (hasIntroductions == null) {
                        hasIntroductions = hasMatchingIntroductions(advisors, actualClass);
                    }
                    match = ((IntroductionAwareMethodMatcher) mm)
                            .matches(method, actualClass, hasIntroductions);
                }
                else {
                    match = mm.matches(method, actualClass);
                }
                if (match) {
                    // ��Advisor����ת��ΪMethodInterceptor����
                    MethodInterceptor[] interceptors = registry.getInterceptors(advisor);
                    if (mm.isRuntime()) {
                        for (MethodInterceptor interceptor : interceptors) {
                            // �� interceptor��methodMatcher��װ��InterceptorAndDynamicMethodMatcher
                            interceptorList.add(new InterceptorAndDynamicMethodMatcher(interceptor, mm));
                        }
                    }
                    else {
                        interceptorList.addAll(Arrays.asList(interceptors));
                    }
                }
            }
        }
        else if (advisor instanceof IntroductionAdvisor) {
            // �ж����ΪIntroductionAdvisor���͵�Advisor���򽫵�������װΪInterceptor����
            IntroductionAdvisor ia = (IntroductionAdvisor) advisor;
            if (config.isPreFiltered() || ia.getClassFilter().matches(actualClass)) {
                Interceptor[] interceptors = registry.getInterceptors(advisor);
                interceptorList.addAll(Arrays.asList(interceptors));
            }
        }
        else {
            // �������ṩ��ʹ���Զ����ת������Advisor����ת�����߼�����ΪgetInterceptors()������
            // ��ʹ����Ӧ��Adapter��Ŀ��Advisor����ƥ�䣬�����ƥ���ϣ�ͨ����getInterceptor()����
            // ���Զ����Adviceת��ΪMethodInterceptor����
            Interceptor[] interceptors = registry.getInterceptors(advisor);
            interceptorList.addAll(Arrays.asList(interceptors));
        }
    }
    return interceptorList;
}
```

���Ǹ������Ϸ������ܽ��»�ȡ `MethodInterceptor` �Ĺ��̹������£�

1. ��ȡ��Ŀ�����е� `advisors`

2. ��������ÿ��



   ```
   advisor
   ```



�������������̴���

1. ��� `advisor` �� `PointcutAdvisor`����ʹ�����е� `Pointcut` ����ƥ�䣬ƥ��ɹ��󣬻�ȡ `MethodInterceptor` ���أ�
2. ��� `advisor` �� `IntroductionAdvisor`����ʹ�����е� `ClassFilter` ����ƥ�䣬ƥ��ɹ��󣬻�ȡ `MethodInterceptor` ���أ�
3. ����������������㣬ֱ�ӻ�ȡ `MethodInterceptor` ���أ�

��ô `MethodInterceptor` ����λ�ȡ���أ����Ǽ������¿���

```java
// ��� AdvisorAdapter �ĵط�
private final List<AdvisorAdapter> adapters = new ArrayList<>(3);

// ��� adapter
public DefaultAdvisorAdapterRegistry() {
    // @Before
    registerAdvisorAdapter(new MethodBeforeAdviceAdapter());
    // @AfterReturning
    registerAdvisorAdapter(new AfterReturningAdviceAdapter());
    // @AfterThrowing
    registerAdvisorAdapter(new ThrowsAdviceAdapter());
}

/**
 * ��ȡadvisor��Ӧ��MethodInterceptor
 */
@Override
public MethodInterceptor[] getInterceptors(Advisor advisor) throws UnknownAdviceTypeException {
    List<MethodInterceptor> interceptors = new ArrayList<>(3);
    // ��ȡ��ǰadvisor���MethodInterceptor
    Advice advice = advisor.getAdvice();
    // ��� advice �� MethodInterceptor��ʵ�������
    if (advice instanceof MethodInterceptor) {
        interceptors.add((MethodInterceptor) advice);
    }
    // 
    // ʹ�� AdvisorAdapter �� advice ת��Ϊ MethodInterceptor
    // ���advice����adapter������ adapter.getInterceptor ��ȡ MethodInterceptor
    for (AdvisorAdapter adapter : this.adapters) {
        if (adapter.supportsAdvice(advice)) {
            interceptors.add(adapter.getInterceptor(advisor));
        }
    }
    if (interceptors.isEmpty()) {
        throw new UnknownAdviceTypeException(advisor.getAdvice());
    }
    return interceptors.toArray(new MethodInterceptor[0]);
}
```

����������������ܽ����£�

1. ��� `advice` �� `MethodInterceptor`��ֱ�ӽ���ת���� `MethodInterceptor`��
2. ������ϲ����㣬��ʹ�� `AdvisorAdapter` �� advice ת���� `MethodInterceptor`.

���� `adapters`��spring Ϊ�ṩ������ `Adapter`��

- MethodBeforeAdviceAdapter������ `@Before`
- AfterReturningAdviceAdapter������ `@AfterReturning`
- ThrowsAdviceAdapter������ `@AfterThrowing`

������ `Adapter` ��ֻ��һ�����ܣ����� `advice` ��Ӧ�� `MethodInterceptor`������������ `MethodBeforeAdviceAdapter` �Ĵ���������ˣ�

```java
class MethodBeforeAdviceAdapter implements AdvisorAdapter, Serializable {
    /**
     * �Ƿ��ܴ���ǰadvice
     */
    @Override
    public boolean supportsAdvice(Advice advice) {
        return (advice instanceof MethodBeforeAdvice);
    }

    /**
     * ���ض�Ӧ��MethodInterceptor
     */
    @Override
    public MethodInterceptor getInterceptor(Advisor advisor) {
        MethodBeforeAdvice advice = (MethodBeforeAdvice) advisor.getAdvice();
        return new MethodBeforeAdviceInterceptor(advice);
    }
}
```

�������� `Adapter` �Ĺ��ܼ������ƣ��Ͳ������ˣ������ܽ��¸�ע���Ӧ�� `advice`��`methodInterceptor`��

| ע��            | advice                      | methodInterceptor               |
| --------------- | --------------------------- | ------------------------------- |
| @Before         | AspectJMethodBeforeAdvice   | MethodBeforeAdviceInterceptor   |
| @After          | AspectJAfterAdvice          | AspectJAfterAdvice              |
| @Around         | AspectJAroundAdvice         | AspectJAroundAdvice             |
| @AfterReturning | AspectJAfterReturningAdvice | AfterReturningAdviceInterceptor |
| @AfterThrowing  | AspectJAfterThrowingAdvice  | ThrowsAdviceInterceptor         |

#### ReflectiveMethodInvocation#proceed

��ȡ�� `MethodInterceptor` �󣬾Ϳ�ʼ���з�����ִ���ˣ�����ֱ�ӽ��� `ReflectiveMethodInvocation#proceed` ������

```java
public Object proceed() throws Throwable {
    // ִ�������е���ǿ��ִ��Ŀ�귽��
    // ����ʹ����������ģʽ������������������е��ã�����������ʾ��ǰ�������Ѿ�ִ�е������
    if (this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size() - 1) {
        return invokeJoinpoint();
    }

    // ��ȡ��һ��Ҫִ�е�������
    Object interceptorOrInterceptionAdvice =
           this.interceptorsAndDynamicMethodMatchers.get(++this.currentInterceptorIndex);
    if (interceptorOrInterceptionAdvice instanceof InterceptorAndDynamicMethodMatcher) {
        InterceptorAndDynamicMethodMatcher dm =
                (InterceptorAndDynamicMethodMatcher) interceptorOrInterceptionAdvice;
        Class<?> targetClass = (this.targetClass != null 
                ? this.targetClass : this.method.getDeclaringClass());
        if (dm.methodMatcher.matches(this.method, targetClass, this.arguments)) {
            // ƥ�䣬�͵����������ķ�����Ҳ�������淽��
            // �� MethodInterceptor#invoke����ٴ� ReflectiveMethodInvocation#proceed���ֵ����˵�ǰ����
            return dm.interceptor.invoke(this);
        }
        else {
            // ��ƥ�䣬��ݹ���õ�ǰ����
            return proceed();
        }
    }
    else {
        // ע�⣬�����������Ĳ����� this����ʾ��ǰ����
        // �� MethodInterceptor#invoke����ٴ� ReflectiveMethodInvocation#proceed���ֵ����˵�ǰ����
        return ((MethodInterceptor) interceptorOrInterceptionAdvice).invoke(this);
    }
}

/**
 * ����Ŀ�귽��
 */
protected Object invokeJoinpoint() throws Throwable {
    // ʹ�÷������Ŀ����󷽷���ע�����ﴫ���Ӧ����Ŀ����󣬶����Ǵ������
    return AopUtils.invokeJoinpointUsingReflection(this.target, this.method, this.arguments);
}
```

���ϴ���ĵ���ʹ����������ģʽ��ִ���߼����£�

1. �ж��Ƿ�ִ�������е����淽�������ǣ���ִ��Ŀ�귽��������ִ����һ����
2. ��ȡ��һ�����������ж��ܷ�ִ�У����ܣ����������������������ִ�е� һ��������

�����߼�����ͦ�򵥣�����������ôִ�е��أ��� spring �У�����֪ͨ���������ͣ�`@Before`��`@After`��`@AfterReturning`��`@AfterThrowing` �� `@Around`����������һһ������������֪ͨ����ε��õġ�

#### 1. `@Before`

> MethodBeforeAdviceInterceptor#invoke

```java
@Override
public Object invoke(MethodInvocation mi) throws Throwable {
    // ִ��ǰ��֪ͨ��������
    this.advice.before(mi.getMethod(), mi.getArguments(), mi.getThis());
    // ����ִ����һ��������
    return mi.proceed();
}
```

���� `advice.before(xxx)` ������

> AspectJMethodBeforeAdvice#before

```java
@Override
public void before(Method method, Object[] args, @Nullable Object target) throws Throwable {
    invokeAdviceMethod(getJoinPointMatch(), null, null);
}
```

��������ȥ��

> AbstractAspectJAdvice#invokeAdviceMethod(JoinPointMatch, Object, Throwable)

```java
protected Object invokeAdviceMethod(
         @Nullable JoinPointMatch jpMatch, @Nullable Object returnValue, @Nullable Throwable ex)
         throws Throwable {

     return invokeAdviceMethodWithGivenArgs(argBinding(getJoinPoint(), jpMatch, returnValue, ex));
}

/**
  *  ���÷���ִ��
  */
protected Object invokeAdviceMethodWithGivenArgs(Object[] args) throws Throwable {
    Object[] actualArgs = args;
    if (this.aspectJAdviceMethod.getParameterCount() == 0) {
        actualArgs = null;
    }
    try {
        // ��Ϥ��jdk�������
        ReflectionUtils.makeAccessible(this.aspectJAdviceMethod);
        return this.aspectJAdviceMethod.invoke(
                this.aspectInstanceFactory.getAspectInstance(), actualArgs);
    }
    catch (...) {
        ...
}
```

���Կ����������ǵ��� jdk ���������õġ�

#### 2. `@After`

> AspectJAfterAdvice#invoke

```java
@Override
public Object invoke(MethodInvocation mi) throws Throwable {
    try {
        // ����ִ����һ��������
        return mi.proceed();
    }
    finally {
        // �������淽�������� finally �飬��ʾһ����ִ�У�����Ҳ��ʹ�÷������
        invokeAdviceMethod(getJoinPointMatch(), null, null);
    }
}
```

#### 3. `@AfterReturning`

> AfterReturningAdviceInterceptor#invoke

```java
@Override
public Object invoke(MethodInvocation mi) throws Throwable {
    // ����ִ����һ��������
    Object retVal = mi.proceed();
    // �������淽�����������¿�
    this.advice.afterReturning(retVal, mi.getMethod(), mi.getArguments(), mi.getThis());
    return retVal;
}
```

> AspectJAfterReturningAdvice#afterReturning

```java
public void afterReturning(@Nullable Object returnValue, Method method, 
            Object[] args, @Nullable Object target) throws Throwable {
    if (shouldInvokeOnReturnValueOf(method, returnValue)) {
        // �������淽������Ȼ�ǵ��÷���ִ��
        invokeAdviceMethod(getJoinPointMatch(), returnValue, null);
    }
}
```

#### 4. `@AfterThrowing`

> AspectJAfterThrowingAdvice#invoke

```java
@Override
public Object invoke(MethodInvocation mi) throws Throwable {
    try {
        // ���� ReflectiveMethodInvocation#proceed
        return mi.proceed();
    }
    catch (Throwable ex) {
        if (shouldInvokeOnThrowing(ex)) {
            // �������淽����ֻ�����׳��쳣ʱ�Żᱻ����
            invokeAdviceMethod(getJoinPointMatch(), null, ex);
        }
        throw ex;
    }
}
```

#### 5. `@Around`

> AspectJAroundAdvice#invoke

```java
@Override
public Object invoke(MethodInvocation mi) throws Throwable {
    if (!(mi instanceof ProxyMethodInvocation)) {
        throw new IllegalStateException(...);
    }
    ProxyMethodInvocation pmi = (ProxyMethodInvocation) mi;
    ProceedingJoinPoint pjp = lazyGetProceedingJoinPoint(pmi);
    JoinPointMatch jpm = getJoinPointMatch(pmi);
    // �������淽��
    return invokeAdviceMethod(pjp, jpm, null, null);
}
```

������ʵ�ֻ���֪ͨʱ��һ��������ʵ�֣�

```java
@Around(xxx)
public Object around(ProceedingJoinPoint p){
    // ִ��Ŀ�귽��ǰ�Ĳ���
    ...

    // ִ��Ŀ�귽������һ���ǹؼ�
    // ʵ�����ﲢ��������ִ��Ŀ�귽�������յ��õ��� ReflectiveMethodInvocation#proceed
    // ��������������������ִ����һ��������������ִ��Ŀ�귽��
    Object o = p.proceed();

    // ִ��Ŀ�귽����Ĳ���
    ...
    return o;
}
```

spring ����������֪ͨ��ִ�У���Ҫ��Ϊ�������֣�

1. ʹ�÷��䷽ʽִ�����淽����Ҳ������ν�� ����ǿ����
2. ���� `ReflectiveMethodInvocation#proceed` ����ִ����һ������������ִ��Ŀ�귽����

�����������ֵĲ�������ִ�д���ִ�е�λ�ã���

- `@Before` ֪ͨ��`1` ��ǰ��`2` �ں�
- `@AfterReturning` ֪ͨ��`2` ��ǰ��`1` �ں����ִ�� `2` ʱ�������쳣��`1` �Ͳ���ִ���ˣ�
- `@AfterThrowing` ֪ͨ��`2` ��ǰ��`1` �ں��� `1` �Ƿ��� `catch` ����ִ�У���ֻ�з������쳣��`1` �Ż�ִ�У�
- `@After` ֪ͨ��`2` ��ǰ��`1` �ں�`1` �Ƿ��� `finally` ����ִ�У����� `finally` �������ԣ���ʹ�������쳣��`1` ͬ����ִ�У�
- `@Around` ֪ͨ�������淽��������ָ���� `2` ��ִ��ʱ����

ע������ `@AfterReturning`��`@AfterThrowing` �� `@After` ֪ͨ��ִ��ʱ����

����������������⼸��֪ͨ�����ִ�еġ�

ͨ�����Եķ�ʽ������ spring ִ��֪ͨ��˳�����£�

1. ����ִ�� `@AfterThrowing` ֪ͨ���ȵ��� `mi.proceed()` ִ����һ����������Ȼ���� `catch` ����ִ�����淽��������ֻ�г����쳣ʱ�������淽���Ż�ִ�У�
2. ��һ�������У����� `mi.proceed()` ʱ��ִ�� `@AfterReturning` ֪ͨ��ִ��ʱ�ȵ��� `mi.proceed()` ִ����һ����������Ȼ����ִ�����淽����
3. ��һ�������У����� `mi.proceed()` ʱ��ִ�� `@After` ֪ͨ��ִ��ʱ�ȵ��� `mi.proceed()` ִ����һ����������Ȼ���� `finally` ����ִ�����淽����������ʹ�����쳣�����淽�����ǻ�ִ�У�
4. ��һ�������У����� `mi.proceed()` ʱ��ִ�� `@Around` ֪ͨ��ִ��ʱֱ��ִ�����淽�������� `@Around` ֪ͨ�����淽�������� `ProceedingJoinPoint#proceed()`�����ջ��ǻ�ִ����һ����������
5. ��һ�������У����� `mi.proceed()` ʱ��ִ�� `@Before` ֪ͨ��ִ��ʱ����ִ�����淽�����ٵ��� `mi.proceed()` ִ����һ����������
6. ��������ִ�е���󣬷���û�п�ִ�е��������ˣ���ʱ�Ϳ�ʼִ��Ŀ�귽����

��ͼʾ��֪ͨ��ִ�й������£�

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e88e0cec49c47648005e5d3160663425739.png)

���յ�ִ��˳��

![img](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-97026239d0b2dc02abbe87a9b76325c3cc0.png)

### 4. �ܽ�

������Ҫ������ jdk ��̬�����ִ�й��̣������˸�������֪ͨ��ִ��˳�򡣱��ľ��ȵ������ˣ���һƪ���½����� cglib ��ִ�й��̡�

------

*����ԭ�����ӣ�https://my.oschina.net/funcy/blog/4696654 ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������*
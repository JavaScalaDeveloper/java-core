ǰ�漸ƪ�������Ƿ����� spring aop ����ش��룬�����������ܽᡣ

### 1\. spring ���� aop ����

�� [spring aop��һ����ʾ�� demo �� @EnableAspectJAutoProxy](https://my.oschina.net/funcy/blog/4678093 "spring aop��һ����ʾ�� demo �� @EnableAspectJAutoProxy") һ���У����Ƿ����� spring ͨ�� `@EnableAspectJAutoProxy` ע������ aop ���ܣ������ע��ʵ�������� spring �е����� `AnnotationAwareAspectJAutoProxyCreator`�����������һ�� `BeanPostProcessor`�������� bean ��ʼ��ǰ����ɴ����������ɡ�

### 2\. ������������

spring aop ����ע�ⷽʽ��ʵ����ͨ�� `AnnotationAwareAspectJAutoProxyCreator` ���������ģ��������һ�� `BeanPostProcessor`���� bean �ĳ�ʼ��ǰ��ִ�еĲ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c634a0bda86d94cce68aaa46ac74f57d41d.png)

### 3\. ���淽����ִ��

�����ô������ķ�����jdk ����ݴ�������Ͷ�ѡ��ִ�� `InvocationHandler#invoke`(jdk ��̬����) ���� `MethodInterceptor#intercept`(cglib ����)����һ���ڴ����������ʱ���Ѿ������������ˣ��������޷���������ĸ���������������������������ݿ����߿������ɷ��ӡ��������������У�spring ���ȡ�����õ�ǰ���������� Advisors��Ȼ��ִ�� Advisors ������淽���������������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-96bb9ba4b77e60a85a1da1c2cec3858edf7.png) ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-013fb0c06e03fbe5044c211497df8ce306a.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4701587](https://my.oschina.net/funcy/blog/4701587) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_


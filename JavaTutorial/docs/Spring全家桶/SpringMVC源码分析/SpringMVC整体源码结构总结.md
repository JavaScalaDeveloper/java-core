### 1\. servlet 3.0 �淶

��ϵ��һ��ʼ���Ƚ����� `servlet3.0` �淶��ͨ���ù淶������������ʵ�� web ��Ŀ�� `0xml` ����.

*   `servlet3.0` �淶�У�servlet ͨ�� `SPI` �����ṩ��һ���ӿڣ�`ServletContainerInitializer`��
*   spring ʵ���˸ýӿڣ�����ʵ���� `SpringServletContainerInitializer` �� `onStartup(...)` �����У���ִ������ʵ���� `WebApplicationInitializer` �ӿڵ���� `onStartup(...)` ��������������ֻ��Ҫʵ�� `WebApplicationInitializer` �ӿڼ��ɣ�
*   ����������ʵ�� `WebApplicationInitializer` �ӿڵ����У��� `onStartup(...)` �� servlet �������ֶ�ע����һ �� servlet��`DispatcherServlet`������� servlet �л����� spring ������

�����������̾�������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-0874fa7ef39ca9c405cdf55d99ca891ebf2.png)

### 2\. ���� webMvc �ķ�ʽ

���Ƿ��������� `webMvc` �����ַ�ʽ��

#### 1. `@EnableWebMvc`

���ַ�ʽ�ܼ򵥣�ֻ��Ҫ������

```
// ʹ��@EnableWebMvcע������mvc����
@Component
@EnableWebMvc
public class MvcConfig {
    ...
}

```

�������Ҫ���� webMvc ��һЩ����ʱ����Ҫʵ�� `WebMvcConfigurer`:

```
// ʵ�� WebMvcConfigurer������Զ�������
@Component
public class MyWebMvcConfigurer implements WebMvcConfigurer {

    // ��дWebMvcConfigurer�����������Զ�������
}

```

#### 2\. ʵ�� `WebMvcConfigurationSupport`

����һ�ַ�ʽ���� `webMvc` �� ��ʽ��ʵ�� `WebMvcConfigurationSupport`��

```
@Component
public class MyWebMvcConfigurationSupport extends WebMvcConfigurationSupport {
    // ��д���÷����������Զ�������
    ...

   /**
    * ���磬��ӿ������ã�ֱ����д addCorsMappings ����
    */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // ����Լ�������
        ...
    }

}

```

��Ҫע����ǣ�ʹ�����ַ�ʽ����Ҫ�����Զ�������ʱ���Ͳ�����ȥʵ�� `WebMvcConfigurer` �ӿ��ˣ���Ӧ��ֱ����д `WebMvcConfigurationSupport` �е���Ӧ��������������д `addCorsMappings()`.

### 3\. ������������

��һ��ͼ���ܽ������������̣�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-74d675bbae28247726b8d054e8758c3d8b1.png) ![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-aa6bb35d0ab26925c45c62ab4d709d05cdd.png)

### 4\. ��������

Ҳ��һ��ͼ���ܽ������������̣�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-024b75e7f7952dbf1ace7aa5a8cfe3bcb77.png)

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4773418](https://my.oschina.net/funcy/blog/4773418) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
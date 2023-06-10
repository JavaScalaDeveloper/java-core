### 1\. ʲô��ѭ��������

spring ������ע��ʱ�����ܻ�����໥ע��������

```
@Service
public class Service1 {
    @Autowired
    private Service2 service2;

}

@Service
public class Service2 {
    @Autowired
    private Service1 service1;

}

```

�����ϴ��룬�� `Service1` ��ͨ�� `@Autowird` ע���� `Service2`���� `Service2` ��ͨ�� `@Autowird` ע���� `Service1`�������໥ע���������ͽ���ѭ��������

### 2\. ѭ����������ʲô����

ʵ���ϣ����� `A����B����BҲ����A����`�������java ��������ȫ֧�ֵģ�

```
/**
 * ׼��service1
 */
public class Service1 {
    private Service2 service2;

    public void setService2(Service2 service2) {
        this.service2 = service2;
    }

    public Service2 getService2() {
        return this.service2;
    }
}

/**
 * ׼��service2
 */
public class Service2 {
    private Service1 service1;

    public void setService1(Service1 service1) {
        this.service1 = service1;
    }

    public Service1 getService1() {
        return this.service1;
    }
}

/**
 * �������е���
 */
public class Main {
    public void main(String[] args) {
        // ׼����������
        Service1 service1 = new Service1();
        Service2 service2 = new Service2();
        // �໥����
        service1.setService2(service2);
        service2.setService1(service1);
    }
}

```

��ô���� spring �У��������໥ע��Է�ʵ�������������ʲô�����أ��������� `spring bean` �Ĵ������̣�**ע�⣺�������ǽ����� `bean` �� `scope` Ϊ `singleton` �������Ҳ���� `scope` Ϊ`����`�����**����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ca36e17077b1b191834645b3c8e588ff6c4.png)

����������м�����Ҫ˵���£�

1.  �������������ʵ����ʹ�� jdk �ṩ�ķ�����ƴ��� java �����Ե� 1 ���ᵽ�� `Service1` Ϊ�����ɼ����Ϊ `Service1 service = new Service1()`��
2.  ע���������󣺻����Ե� 1 ���ᵽ�� `Service1` Ϊ����`Service1` ��ͨ�� `@Autowired` �Զ�ע�� `Service2`����һ�����Ǹ� `Service2` ��ֵ�Ĺ��̣��ɼ����Ϊ `service1.setService2(service2)`��
3.  `singletonObjects`����������������һ�� java ����ͱ����һ�� spring bean��Ȼ�󱣴浽 `singletonObjects` �ˣ����Ǹ� `map`��`key` �� bean �����ƣ�`value` �� bean����ֻ���� `spring bean`������ֻ�� java ʵ����

ʵ���ϣ�`java` ������ `spring bean`��������ֻ������ע�룬���г�ʼ����ִ�� `beanPorcessor` �����ȣ�**���ڱ����Ƿ��� `spring bean` ��ѭ�������ģ���������ص��ע��ѭ��������صĲ��衣**

#### 2.1 ѭ����������������

�˽��� spring bean �Ĳ�������֮�󣬽��������Ǿ���������ѭ���������������⣬����ʽ����ǰ������������ȷ�������

*   `java����`��ʵ���ϣ�java ��һ�ж��󶼿��Գ�֮Ϊ `java` ����Ϊ��˵�����㣬�����ᵽ�� `java����`��ָʵ������ɡ���δ���� spring bean ���������ڶ���
*   `spring bean`����һ�� java ���󣬲��ҽ����������� spring bean ���������ڶ���

spring bean �Ĵ����������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b55a211447b5fabeaa0c3ef0bfee0920c82.png)

����ͼ˵�����£�

1.  �� `service1` ���󴴽���ɺ�`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ���ȥ `singletonObjects` �в��� `service2`����ʱ���Ҳ��� `service2`��Ȼ��Ϳ�ʼ�� `service2` �Ĵ������̣�
2.  �� `service2` ���󴴽���ɺ�`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `singletonObjects` �в��� `service1`����ʱ���Ҳ��� `service1`����Ϊ��һ���� `service1` ��û�д����ɹ� ��Ȼ��Ϳ�ʼ�� `service1` �Ĵ������̣�
3.  �������ص� `1`���ٴο�ʼ�� `service1` �Ĵ���������ע����̡�

��������Ǿ�ϲ�ط��֣�ѭ�������ˣ�

#### 2.2 ���� `earlySingletonObjects` ���ѭ������

���Ƿ����£�ѭ�����ֵ�ԭ�����ڣ��� `service2` ��ȡ `service1` ʱ������ `singletonObjects` �д�ʱ�������� `service1`����˻����� `service1` �Ĵ������̣����´��� `service1`����ˣ������и��󵨵��뷨������� `service1` ʵ������Ͱ����������������������� `service1` ʱ���ͷ������δ��������ע��� `service1`��������������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c0eaecbe82b144a6fcd9fd048f2cca53497.png)

��ͼ�У������� `earlySingletonObjects`����Ҳ�Ǹ� map��ͬ `singletonObjects` һ����`key` �� bean �����ƣ�`value` ��һ��δ�������ע��Ķ���

����ͼ˵�����£�

1.  �� `service1` ���󴴽���ɺ��Ƚ� `service1` ���� `earlySingletonObjects`��Ȼ���������ע�룻
2.  �� `service1` ��������ע��ʱ��`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ����ȥ `earlySingletonObjects` ���� `service2`��δ�ҵ�����ȥ `singletonObjects` �в��� `service2`������δ�ҵ������ǾͿ�ʼ�� `service2` �Ĵ������̣�
3.  �� `service2` ���󴴽���ɺ��Ƚ� `service2` ���� `earlySingletonObjects`��Ȼ���������ע�룻
4.  �� `service2` ��������ע��ʱ��`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `earlySingletonObjects` ���� `service1`���ҵ��ˣ��ͽ� `service1` ע�뵽 `service2` �У���ʱ `service2` ����һ�� `spring bean` �ˣ����䱣�浽 `singletonObjects` �У�
5.  ������ 4 �������ǵõ��� `service2`��Ȼ����ע�뵽 `service1` �У���ʱ `service1` Ҳ����һ�� `spring bean`�����䱣�浽 `singletonObjects` �С�

�������ϲ��裬���Ƿ��֣�ѭ�������õ��˽����

#### 2.2 aop �µ�ѭ������

��������ķ��������Ƿ���ֻҪ��������һ�� `earlySingletonObjects` ��ѭ���������ܵõ���������ǣ�ѭ��������ĵõ��˽����spring ���� ioc �⣬������һ���ش��ܣ�aop������������ aop ����³���ѭ��������������

##### 1\. aop ����Ĵ�������

����ʽ���� aop �µ�ѭ������ǰ������������ȷ���������

*   `ԭʼ����`�������ڴ������ָδ���й� aop �Ķ��󣬿����� java ����Ҳ������δ���� aop �� spring bean��
*   `�������`�����й� aop �Ķ��󣬿����� java ��������й� aop �õ��Ķ��� (�����й� aop��δ��������ע�룬Ҳδ���г�ʼ��)��Ҳ�����ǽ��й� aop �� `spring bean`.

������������ aop ����δ�������ģ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e92991c1c173bbd5579be3001a977555be7.png)

����� `2.1` �е����̣�aop ���� "���ɴ������" �Ĳ������������ձ��浽 `singletonObjects` �еĶ���Ҳ�Ǵ������

ԭʼ������������֮����ʲô��ϵ�أ��ô���ʾ���£��������£�

```
public class ProxyObj extends Obj {

    // ԭʼ����
    private Obj obj;

    ...
}

```

ʵ���ϣ�����֮��Ĺ�ϵ��û����ô�򵥣���Ϊ��˵�����⣬��������߹�ϵ���˼򻯣�С�����ֻ��Ҫ���ף�**����������ԭʼ���������**���ɡ�

����ԭʼ������α�ɴ������ģ����Բο� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)��

�����ϴ������̣��� java ����ģ�����£�

```
/**
 * ׼��һ����
 */
public class Obj1 {

}

/**
 * ׼��һ���࣬�ڲ���һ������ Obj1
 */
public class Obj2 {

    private Obj1 obj1;

    // ʡ����������
    ...

}

/**
 * ׼��Obj2�Ĵ����࣬�ڲ�����obj2�Ķ���
 */
public class ProxyObj2 extends Obj2 {

    private Obj2 obj2;

    public ProxyObj2(Obj2 obj2) {
        this.obj2 = obj2;
    }

    // ʡ����������
    ...

}

```

���ţ�����ģ�� ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �� �����ˣ�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // ��ʼ Obj2 �Ĵ�������
     // 1\. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // 2\. �� Obj2 ��ע�� obj1������ʱ��û��obj1�������Ҫ����obj1���ٽ���ע�뵽Obj2��
     Obj1 obj1 = new Obj1();
     obj2.setObj1(obj1);

     // 3\. ����Obj2�Ĵ�����󣬴�������г��� Obj2��ԭʼ����
     ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

     // 4\. proxyObj2�Ѿ��������������������ڣ���˽����������ӵ�����ʱ
     collection.add(proxyObj2); 

}

```

���������У�

*   �� `new Obj2()` ģ�����Ĵ���
*   �� `obj2.setObj1(xxx)` ģ������ע��
*   �� `new ProxyObj2(xxx)` ģ�������������
*   �� `collection.add(xxx)` ģ�������ӵ������еĹ���

ģ����������£�

1.  ���� `obj2` ����
2.  �� `Obj2` ��ע�� `obj1`������ʱ��û�� `obj1`�������Ҫ���� `obj1`���ٽ���ע�뵽 `Obj2` ��
3.  ���� `Obj2` �Ĵ������ `proxyObj2`��`proxyObj2` �г��� `Obj2` ��ԭʼ����
4.  `proxyObj2` �Ѿ��������������������ڣ���˽����������ӵ�����ʱ

��ϸ��������Ĳ��裬�ͻᷢ�֣�����ĵ� 2 ����� 3 ����ȫ����˳��Ҳû���⣬����ģ�����£�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // ��ʼ Obj2 �Ĵ�������
     // 1\. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // 2\. ����Obj2�Ĵ�����󣬴�������г��� Obj2��ԭʼ����
     ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

     // 3\. �� obj2 ��ע�� obj1������ʱ��û��obj1�������Ҫ����obj1���ٽ���ע�뵽Obj2��
     Obj1 obj1 = new Obj1();
     // ������ע�뵽ԭʼ������
     obj2.setObj1(obj1);

     // 4\. proxyObj2�Ѿ��������������������ڣ���˽����������ӵ�����ʱ
     collection.add(proxyObj2); 

}

```

����������������£�

1.  ���� obj2 ����
2.  ���� Obj2 �Ĵ�����󣬴�������г��� Obj2 ��ԭʼ����
3.  �� Obj2 ��ע�� obj1������ʱ��û�� obj1�������Ҫ���� obj1���ٽ���ע�뵽 Obj2
4.  proxyObj2 �Ѿ��������������������ڣ���˽����������ӵ�����ʱ

�Ӵ����Ͽ���`proxyObj2(�������)` �г��� `ob2(ԭʼ����)`�����ɴ������󣬼�����ԭʼ�����������ע�룬��Ȼ��Ӱ�����������մ��������е�ԭʼ����Ҳ���������ע�룬����������ͼ��ʾ�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8ff5579425f73dd5c2d321a86d0303390ac.png)

���������ٴ��������� java ���� spring bean �Ĳ����кö࣬�������ǽ���ע��ѭ��������صĲ��裬������˽� spring bean ��ϸ�ĳ�ʼ�����̣��ɲ鿴 [spring ��������֮�������̸���](https://my.oschina.net/funcy/blog/4597493)��

���������̽�������������������ڿ��������֣�

*   ���� --> ����ע�� --> ���ɴ������ --> ��������󱣴浽������
*   ���� (ԭʼ����)--> ���ɴ������ (��ǰ���� aop)--> ��ԭʼ�����������ע�� --> ��������󱣴浽������

�����ֶ��ܴﵽ����Ŀ�ģ���**���浽�����е��Ǵ�������Ҵ�������Ӧ��ԭʼ�������������ע��**�����μ��������������̣����Ǻ����� aop ��ѭ����������ĺ��ģ�˵���ˣ�**aop �µ�ѭ����������֮�����ܽ����������Ϊ���������ǰ���� aop ����**��

##### 2\. Ϊʲô�� `earlySingletonObjects` �޷����ѭ��������

ǰ��������Ҫ˵���˴������Ĵ������̣������������������� aop �£�ʹ�� `earlySingletonObjects` �����ѭ��������ʲô���⣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d3d00d76ab0c72339faccb7ccd853723d6c.png)

������������ͼ�����̣�

1.  �� `service1` ���󴴽���ɺ��Ƚ� `service1` ���� `earlySingletonObjects`��Ȼ���������ע�룻
2.  �� `service1` ��������ע��ʱ��`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ����ȥ `earlySingletonObjects` ���� `service2`��δ�ҵ�����ȥ `singletonObjects` �в��� `service2`������δ�ҵ������ǾͿ�ʼ�� `service2` �Ĵ������̣�
3.  �� `service2` ���󴴽���ɺ��Ƚ� `service2` ���� `earlySingletonObjects`��Ȼ���������ע�룻
4.  �� `service2` ��������ע��ʱ��`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `earlySingletonObjects` ���� `service1`���ҵ��ˣ��ͽ� `service1` ע�뵽 `service2` �У�Ȼ���ٽ��� aop����ʱ `service2` ��һ��������󣬽��䱣�浽 `singletonObjects` �У�
5.  ������ 4 �������ǵõ��� `service2` �Ĵ������Ȼ����ע�뵽 `service1` �У������ٶ� `service1` ���� aop����ʱ `service1` Ҳ����һ�� `spring bean`�����䱣�浽 `singletonObjects` �С�

����������ʲô�����أ���ϸ���� 4 �����ͻᷢ�֣�**ע�뵽 `service2` �� `service1` �����Ǵ������**���ݹ�ȫ�֣����յõ��� `service1` �� `service2` ���Ǵ������ע�뵽 `service2` �� `service1` Ӧ��Ҳ�Ǵ������Ŷԡ���ˣ��� aop �£�ѭ�������������ֳ����ˣ�

#### 2.3 spring �Ľ������

ǰ�������ᵽ���� aop �£����� `earlySingletonObjects` �����ܽ��ѭ�����������⣬�� spring ����ô������أ�spring �ٴ�������һ�� `map` �����������⣬��Ҳ�����ǳ�˵�� **spring ��������**���������� `map` ˵�����£�

*   һ������ `singletonObjects`������Ϊ `ConcurrentHashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �������� `spring bean`�����������ע�롢��ʼ���� bean����� bean ��Ҫ aop���洢�ľ��Ǵ������
*   �������� `earlySingletonObjects`������Ϊ `HashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` ��ʵ������ɣ���δ��������ע��� `bean`����� `bean` ��Ҫ `aop`������洢�ľ��Ǵ������ֻ����������������е�ԭʼ����δ��������ע�룻
*   �������� `singletonFactories`������Ϊ `HashMap<String, ObjectFactory>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �洢����һ�� `lambda` ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`�� `getEarlyBeanReference` �е� `bean` �Ǹմ�����ɵ� `java bean`��û�н��� spring ����ע�룬Ҳû���� aop (������� `lambda` ���ʽ��������������)��

Ϊ��˵�����㣬����� `singletonObjects`��`earlySingletonObjects` �� `singletonFactories` �ֱ��Ϊ**һ������**��**��������**��**��������**��

spring ��� aop �µ�ѭ�������������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-dc325a87b321e4c246a1b2f14169821a75a.png)

���ͼ���űȽϸ��ӣ���ʵ�ֿ������ͱȽϼ��ˣ����������У�`1~8` �ǻ�ȡ `service1` �����̣�`5.1~5.8` �ǻ�ȡ `service2` �����̣�`5.5.1` ���ٴλ�ȡ `service1` �����̣�ֻ�����ڴ��� `service1` �ĳ�ʼ�������У��ᴥ�� `service2` �ĳ�ʼ�����̣��� `service2` �ĳ�ʼ��ʱ���ֻ������� `service1`����˲ſ�����������һ�𣬱Ƚϸ��ӡ�

����ͼ�Ĺ��̣�����˵�����£����飺����������̱Ƚϸ��ӣ������ȿ� `1~8` �Ĳ������ٿ� `5.1~5.8` �Ĳ�����������������������������������ࣩܶ��

*   1.  `service1`����ȡ `service1`����һ�������л�ȡ����ʱ�ǻ�ȡ�����ģ�
*   1.  `service1`������ `service1` ��ʵ����
*   1.  `service1`����ȡ��Ҫע��������뷽������ԭʼ�����Ͻ��л�ȡ����
*   1.  `service1`�����������֧��ѭ�����������ã��ͽ� `service1` �ŵ����������У��Ƿ�֧��ѭ���������ǿ������õģ���
*   1.  `service1`���� `service1` ��������ע�룬��Ҫ `service2`��Ȼ��Ϳ�ʼ�� `service2` �Ļ�ȡ���̣�
*   5.1 `service2`����ȡ `service2`����һ�������л�ȡ����ʱ�ǻ�ȡ�����ģ�
*   5.2 `service2`������ `service2` ��ʵ����
*   5.3 `service2`����ȡ��Ҫע��������뷽������ԭʼ�����Ͻ��л�ȡ����
*   5.4 `service2`�����������֧��ѭ�����������ã��ͽ� `service2` �ŵ����������У��Ƿ�֧��ѭ���������ǿ������õģ���
*   5.5 `service2`���� `service2` ��������ע�룬��Ҫ `service1`��Ȼ��Ϳ�ʼ�� `service1` �Ļ�ȡ���̣�
*   5.5.1 `service1`: ��ȡ `service1`����һ�������л�ȡ����ȡ��������ʱ���� `service1` ���ڴ����У����Ǽ����Ӷ������������л�ȡ�����մ����������л�ȡ���ˣ��������������档�����������ȡ�Ĺ����У�**���ж� `service1` �Ƿ���Ҫ���� aop��Ȼ��ʼ aop ����**����˷�����������е��� `service1` ���������ǰ���� aop �ǽ��ѭ�������Ĺؼ���
*   5.6 `service2`���õ��� `service1` ������� `service1` �Ǵ�����󣩣�����ע�뵽 `service2` �У����Ŷ� `service2` ���� aop���õ� `service2` �Ĵ������
*   5.7 `service2`�����֧��ѭ���������ȴ�һ�������������ٴλ�ȡ `service2`����δ��ȡ������ʹ�õ�ǰ `service2`����ǰ `service2` �Ǵ������)��
*   5.8 `service2`���� service2 �Ĵ���������һ�������У�ɾ�������������棬���ˣ�`service2` ��ʼ����ɣ�ע��� `service1` �Ǵ������һ�������е� `service2` Ҳ�Ǵ������
*   1.  `service1`���ص� `service1` ���������ڣ��õ� `service2`������� `service2` �Ǵ�����󣩺󣬽���ע�뵽 `service1`��`service1` ������ע����ɣ����г�ʼ����������ж� `service1` �Ƿ���Ҫ���� aop����Ȼ `service1` ����Ҫ���� aop �ģ��������� `5.5.1` �Ѿ����й� aop �ˣ���ˣ�����ֱ�ӷ��أ�����һ����`service1` ����ԭʼ���󣩣�
*   1.  `service1`�����֧��ѭ���������ȴ�һ�������л�ȡ `service1`����ȡ�������ٴӶ������л�ȡ `service1`�����Ի�ȡ������ `5.5.1` ��֪�������������� `service1` ������󣩣����أ�
*   1.  `service1`�������������л�ȡ�Ķ���ע�ᵽһ�������У�ɾ�������������棬���ˣ�`service1` ��ʼ����ɣ�ע��� `service2` �Ǵ������һ�������е� `service1` Ҳ�Ǵ������

�������̣���Ȼ����϶࣬�� `service1` �� `service2` �Ļ�ȡ��������ͬ�ģ�ֻҪŪ��������֮һ�Ļ�ȡ���̣���һ�� bean �Ļ�ȡ���̾ͺ���ͬ�ˡ�

�����������У������������ݽṹ��Ҫ˵���£�

*   `singletonsCurrentlyInCreation`������Ϊ `SetFromMap<String>`��λ�� `DefaultSingletonBeanRegistry`��������ʽΪ `Collections.newSetFromMap(new ConcurrentHashMap<>(16))`���������Ǹ��� `ConcurrentHashMap` ʵ�ֵ� set���洢�������ڴ����еĶ���**�жϵ�ǰ�����Ƿ��ڴ����о���ͨ�����ҵ�ǰ�����Ƿ������ set ��**�����ģ�
*   `earlyProxyReferences`������Ϊ `ConcurrentHashMap<Object, Object>`��λ�� `AbstractAutoProxyCreator`���洢������ǰ���� aop �Ķ���**���һ��������ǰ������ aop���ں����ٴ� aop ʱ����ͨ���ж϶����Ƿ��� `earlyProxyReferences` �ж�ȷ��Ҫ��Ҫ���� aop���Դ�����֤ÿ������ֻ����һ�� aop**��

���ˣ�spring һ���ṩ�� 5 �����ݽṹ���������ѭ���������⣬�ܽ����£�

| �ṹ                            | ˵��                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `singletonObjects`              | **һ������**������Ϊ `ConcurrentHashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �������� `spring bean`�����������ע�롢��ʼ���� bean����� bean ��Ҫ aop���洢�ľ��Ǵ������ |
| `earlySingletonObjects`         | **��������**������Ϊ `HashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` ��ʵ������ɣ���δ��������ע��� `bean`��**��� `bean` ��Ҫ `aop`������洢�ľ��Ǵ������ֻ����������������е�ԭʼ����δ��������ע��** |
| `singletonFactories`            | **��������**������Ϊ `HashMap<String, ObjectFactory>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �洢����һ�� `lambda` ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`��`getEarlyBeanReference(xxx)` �е� `bean` �Ǹմ�����ɵ� `java bean`��û�н��� spring ����ע�룬Ҳû���� aop |
| `singletonsCurrentlyInCreation` | ����Ϊ `SetFromMap<String>`��λ�� `DefaultSingletonBeanRegistry`��������ʽΪ `Collections.newSetFromMap(new ConcurrentHashMap<>(16))`���������Ǹ��� `ConcurrentHashMap` ʵ�ֵ� set���洢�������ڴ����еĶ��󣬿���**�����жϵ�ǰ�����Ƿ��ڴ�����** |
| `earlyProxyReferences`          | ����Ϊ `ConcurrentHashMap<Object, Object>`��λ�� `AbstractAutoProxyCreator`���洢������ǰ���� aop �Ķ��󣬿���**�����ж� bean �Ƿ���й� aop����֤ÿ������ֻ����һ�� aop** |

���Ͼ��� spring ���ѭ�����������������ˡ�

### 3\. ����ģ��

����ʽ����Դ��ǰ����������ģ��ѭ������������Ĺ��̣��������£�

```
/**
 * ׼��һ���࣬�ڲ���һ������ Obj2
 */
public class Obj1 {
    // ��Ҫע�� obj2
    private Obj2 obj2;

    // ʡ����������
    ...
}

/**
 * ׼��һ���࣬�ڲ���һ������ Obj1
 */
public class Obj2 {
    // ��Ҫע�� ob1
    private Obj1 obj1;

    // ʡ����������
    ...

}

/**
 * ׼��Obj2�Ĵ����࣬�ڲ�����obj2�Ķ���
 */
public class ProxyObj2 extends Obj2 {
    // obj2�������ڲ�����obj2��ԭʼ����
    private Obj2 obj2;

    public ProxyObj2(Obj2 obj2) {
        this.obj2 = obj2;
    }

    // ʡ����������
    ...

}

/**
 * ׼��Obj1�Ĵ����࣬�ڲ�����obj1�Ķ���
 */
public class ProxyObj1 extends Obj1 {
    // obj2�������ڲ�����obj1��ԭʼ����
    private Obj1 obj1;

    public ProxyObj1(Obj1 obj1) {
        this.obj1 = obj1;
    }

    // ʡ����������
    ...

}

```

*   ����׼���������ࣺ`Obj1` �� `Obj2`�� ���� `Obj1` �и�����Ϊ `Obj2`��`Obj2` ���и�����Ϊ `Obj1`��
*   ����׼���� `Obj1` �� `Obj2` �Ĵ����� `ProxyObj1`��`ProxyObj2`������ `ProxyObj1`��`ProxyObj2` �ֱ���һ�����ԣ�`Obj1` �� `Obj2`��
*   ���������� `new ObjX()` ģ�����Ĵ�����
*   ���������� `objX.setObjX(xxx)` ģ������ע�룻
*   ���������� `new ProxyObjX(xxx)` ģ������������ɣ�
*   ���������� `collection.add(xxx)` ģ�������ӵ������еĹ��̣�

����ģ�����յõ��Ľ��Ϊ��

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`

׼�������Ѿ�����ˣ����������ǾͿ�ʼ����ģ���ˡ�

#### 3.1 ģ�� 1

Ҫ��

*   Obj1 �� Obj2 �����ϸ��� ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �����̴���
*   ��������Ĵ������̿��Խ������

Ŀ�꣺

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`

�������£�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // 1\. ���� Obj1 ����
     Obj1 obj1 = new Obj1();

     // ��������Ҫ��obj2�Ĵ������ע�뵽obj1�У�����ʱ�����в�û��obj2�Ĵ�����������л���obj2�Ĵ�������
     // һ. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // �����obj2��Ҫע��obj1�Ĵ�����󣬵���ʱ�����в�û��obj2�Ĵ������������Ҫ�е�obj1�Ĵ�������

}

```

��ִ������������ �����ִ��� Obj2 ��������̾ͽ��в���ȥ�ˣ�

*   `obj1` ��Ҫע�� `obj2` �Ĵ�����󣬵��Ҳ����������л��� `obj2` �Ĵ������̣�
*   `obj2` ��Ҫע�� `obj1` �Ĵ�����󣬵��Ҳ����������л��� `obj1` �Ĵ������̣�
*   `obj1` ��Ҫע�� `obj2` �Ĵ�����󣬵��Ҳ����������л��� `obj2` �Ĵ������̣�
*   ...

���ѭ��������

ģ������δ�ﵽԤ��Ŀ�꣬����ģ������ʧ�ܡ�

#### 3.1 ģ�� 2

Ҫ��

*   Obj1 �� Obj2 ����������������֮һ������
    *   ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �����̴���
    *   ������ (ԭʼ����)--> ���ɴ������ --> ��ԭʼ�����������ע�� --> ��������󱣴浽�����С� �����̴���
*   ��������Ĵ������̿��Խ������

Ŀ�꣺

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`### 1\. ʲô��ѭ��������

spring ������ע��ʱ�����ܻ�����໥ע��������

```
@Service
public class Service1 {
    @Autowired
    private Service2 service2;

}

@Service
public class Service2 {
    @Autowired
    private Service1 service1;

}

```

�����ϴ��룬�� `Service1` ��ͨ�� `@Autowird` ע���� `Service2`���� `Service2` ��ͨ�� `@Autowird` ע���� `Service1`�������໥ע���������ͽ���ѭ��������

### 2\. ѭ����������ʲô����

ʵ���ϣ����� `A����B����BҲ����A����`�������java ��������ȫ֧�ֵģ�

```
/**
 * ׼��service1
 */
public class Service1 {
    private Service2 service2;

    public void setService2(Service2 service2) {
        this.service2 = service2;
    }

    public Service2 getService2() {
        return this.service2;
    }
}

/**
 * ׼��service2
 */
public class Service2 {
    private Service1 service1;

    public void setService1(Service1 service1) {
        this.service1 = service1;
    }

    public Service1 getService1() {
        return this.service1;
    }
}

/**
 * �������е���
 */
public class Main {
    public void main(String[] args) {
        // ׼����������
        Service1 service1 = new Service1();
        Service2 service2 = new Service2();
        // �໥����
        service1.setService2(service2);
        service2.setService1(service1);
    }
}

```

��ô���� spring �У��������໥ע��Է�ʵ�������������ʲô�����أ��������� `spring bean` �Ĵ������̣�**ע�⣺�������ǽ����� `bean` �� `scope` Ϊ `singleton` �������Ҳ���� `scope` Ϊ`����`�����**����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-ca36e17077b1b191834645b3c8e588ff6c4.png)

����������м�����Ҫ˵���£�

1.  �������������ʵ����ʹ�� jdk �ṩ�ķ�����ƴ��� java �����Ե� 1 ���ᵽ�� `Service1` Ϊ�����ɼ����Ϊ `Service1 service = new Service1()`��
2.  ע���������󣺻����Ե� 1 ���ᵽ�� `Service1` Ϊ����`Service1` ��ͨ�� `@Autowired` �Զ�ע�� `Service2`����һ�����Ǹ� `Service2` ��ֵ�Ĺ��̣��ɼ����Ϊ `service1.setService2(service2)`��
3.  `singletonObjects`����������������һ�� java ����ͱ����һ�� spring bean��Ȼ�󱣴浽 `singletonObjects` �ˣ����Ǹ� `map`��`key` �� bean �����ƣ�`value` �� bean����ֻ���� `spring bean`������ֻ�� java ʵ����

ʵ���ϣ�`java` ������ `spring bean`��������ֻ������ע�룬���г�ʼ����ִ�� `beanPorcessor` �����ȣ�**���ڱ����Ƿ��� `spring bean` ��ѭ�������ģ���������ص��ע��ѭ��������صĲ��衣**

#### 2.1 ѭ����������������

�˽��� spring bean �Ĳ�������֮�󣬽��������Ǿ���������ѭ���������������⣬����ʽ����ǰ������������ȷ�������

*   `java����`��ʵ���ϣ�java ��һ�ж��󶼿��Գ�֮Ϊ `java` ����Ϊ��˵�����㣬�����ᵽ�� `java����`��ָʵ������ɡ���δ���� spring bean ���������ڶ���
*   `spring bean`����һ�� java ���󣬲��ҽ����������� spring bean ���������ڶ���

spring bean �Ĵ����������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-b55a211447b5fabeaa0c3ef0bfee0920c82.png)

����ͼ˵�����£�

1.  �� `service1` ���󴴽���ɺ�`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ���ȥ `singletonObjects` �в��� `service2`����ʱ���Ҳ��� `service2`��Ȼ��Ϳ�ʼ�� `service2` �Ĵ������̣�
2.  �� `service2` ���󴴽���ɺ�`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `singletonObjects` �в��� `service1`����ʱ���Ҳ��� `service1`����Ϊ��һ���� `service1` ��û�д����ɹ� ��Ȼ��Ϳ�ʼ�� `service1` �Ĵ������̣�
3.  �������ص� `1`���ٴο�ʼ�� `service1` �Ĵ���������ע����̡�

��������Ǿ�ϲ�ط��֣�ѭ�������ˣ�

#### 2.2 ���� `earlySingletonObjects` ���ѭ������

���Ƿ����£�ѭ�����ֵ�ԭ�����ڣ��� `service2` ��ȡ `service1` ʱ������ `singletonObjects` �д�ʱ�������� `service1`����˻����� `service1` �Ĵ������̣����´��� `service1`����ˣ������и��󵨵��뷨������� `service1` ʵ������Ͱ����������������������� `service1` ʱ���ͷ������δ��������ע��� `service1`��������������

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-c0eaecbe82b144a6fcd9fd048f2cca53497.png)

��ͼ�У������� `earlySingletonObjects`����Ҳ�Ǹ� map��ͬ `singletonObjects` һ����`key` �� bean �����ƣ�`value` ��һ��δ�������ע��Ķ���

����ͼ˵�����£�

1.  �� `service1` ���󴴽���ɺ��Ƚ� `service1` ���� `earlySingletonObjects`��Ȼ���������ע�룻
2.  �� `service1` ��������ע��ʱ��`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ����ȥ `earlySingletonObjects` ���� `service2`��δ�ҵ�����ȥ `singletonObjects` �в��� `service2`������δ�ҵ������ǾͿ�ʼ�� `service2` �Ĵ������̣�
3.  �� `service2` ���󴴽���ɺ��Ƚ� `service2` ���� `earlySingletonObjects`��Ȼ���������ע�룻
4.  �� `service2` ��������ע��ʱ��`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `earlySingletonObjects` ���� `service1`���ҵ��ˣ��ͽ� `service1` ע�뵽 `service2` �У���ʱ `service2` ����һ�� `spring bean` �ˣ����䱣�浽 `singletonObjects` �У�
5.  ������ 4 �������ǵõ��� `service2`��Ȼ����ע�뵽 `service1` �У���ʱ `service1` Ҳ����һ�� `spring bean`�����䱣�浽 `singletonObjects` �С�

�������ϲ��裬���Ƿ��֣�ѭ�������õ��˽����

#### 2.2 aop �µ�ѭ������

��������ķ��������Ƿ���ֻҪ��������һ�� `earlySingletonObjects` ��ѭ���������ܵõ���������ǣ�ѭ��������ĵõ��˽����spring ���� ioc �⣬������һ���ش��ܣ�aop������������ aop ����³���ѭ��������������

##### 1\. aop ����Ĵ�������

����ʽ���� aop �µ�ѭ������ǰ������������ȷ���������

*   `ԭʼ����`�������ڴ������ָδ���й� aop �Ķ��󣬿����� java ����Ҳ������δ���� aop �� spring bean��
*   `�������`�����й� aop �Ķ��󣬿����� java ��������й� aop �õ��Ķ��� (�����й� aop��δ��������ע�룬Ҳδ���г�ʼ��)��Ҳ�����ǽ��й� aop �� `spring bean`.

������������ aop ����δ�������ģ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e92991c1c173bbd5579be3001a977555be7.png)

����� `2.1` �е����̣�aop ���� "���ɴ������" �Ĳ������������ձ��浽 `singletonObjects` �еĶ���Ҳ�Ǵ������

ԭʼ������������֮����ʲô��ϵ�أ��ô���ʾ���£��������£�

```
public class ProxyObj extends Obj {

    // ԭʼ����
    private Obj obj;

    ...
}

```

ʵ���ϣ�����֮��Ĺ�ϵ��û����ô�򵥣���Ϊ��˵�����⣬��������߹�ϵ���˼򻯣�С�����ֻ��Ҫ���ף�**����������ԭʼ���������**���ɡ�

����ԭʼ������α�ɴ������ģ����Բο� [spring aop ֮ AnnotationAwareAspectJAutoProxyCreator �������£�](https://my.oschina.net/funcy/blog/4687961)��

�����ϴ������̣��� java ����ģ�����£�

```
/**
 * ׼��һ����
 */
public class Obj1 {

}

/**
 * ׼��һ���࣬�ڲ���һ������ Obj1
 */
public class Obj2 {

    private Obj1 obj1;

    // ʡ����������
    ...

}

/**
 * ׼��Obj2�Ĵ����࣬�ڲ�����obj2�Ķ���
 */
public class ProxyObj2 extends Obj2 {

    private Obj2 obj2;

    public ProxyObj2(Obj2 obj2) {
        this.obj2 = obj2;
    }

    // ʡ����������
    ...

}

```

���ţ�����ģ�� ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �� �����ˣ�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // ��ʼ Obj2 �Ĵ�������
     // 1\. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // 2\. �� Obj2 ��ע�� obj1������ʱ��û��obj1�������Ҫ����obj1���ٽ���ע�뵽Obj2��
     Obj1 obj1 = new Obj1();
     obj2.setObj1(obj1);

     // 3\. ����Obj2�Ĵ�����󣬴�������г��� Obj2��ԭʼ����
     ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

     // 4\. proxyObj2�Ѿ��������������������ڣ���˽����������ӵ�����ʱ
     collection.add(proxyObj2); 

}

```

���������У�

*   �� `new Obj2()` ģ�����Ĵ���
*   �� `obj2.setObj1(xxx)` ģ������ע��
*   �� `new ProxyObj2(xxx)` ģ�������������
*   �� `collection.add(xxx)` ģ�������ӵ������еĹ���

ģ����������£�

1.  ���� `obj2` ����
2.  �� `Obj2` ��ע�� `obj1`������ʱ��û�� `obj1`�������Ҫ���� `obj1`���ٽ���ע�뵽 `Obj2` ��
3.  ���� `Obj2` �Ĵ������ `proxyObj2`��`proxyObj2` �г��� `Obj2` ��ԭʼ����
4.  `proxyObj2` �Ѿ��������������������ڣ���˽����������ӵ�����ʱ

��ϸ��������Ĳ��裬�ͻᷢ�֣�����ĵ� 2 ����� 3 ����ȫ����˳��Ҳû���⣬����ģ�����£�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // ��ʼ Obj2 �Ĵ�������
     // 1\. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // 2\. ����Obj2�Ĵ�����󣬴�������г��� Obj2��ԭʼ����
     ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

     // 3\. �� obj2 ��ע�� obj1������ʱ��û��obj1�������Ҫ����obj1���ٽ���ע�뵽Obj2��
     Obj1 obj1 = new Obj1();
     // ������ע�뵽ԭʼ������
     obj2.setObj1(obj1);

     // 4\. proxyObj2�Ѿ��������������������ڣ���˽����������ӵ�����ʱ
     collection.add(proxyObj2); 

}

```

����������������£�

1.  ���� obj2 ����
2.  ���� Obj2 �Ĵ�����󣬴�������г��� Obj2 ��ԭʼ����
3.  �� Obj2 ��ע�� obj1������ʱ��û�� obj1�������Ҫ���� obj1���ٽ���ע�뵽 Obj2
4.  proxyObj2 �Ѿ��������������������ڣ���˽����������ӵ�����ʱ

�Ӵ����Ͽ���`proxyObj2(�������)` �г��� `ob2(ԭʼ����)`�����ɴ������󣬼�����ԭʼ�����������ע�룬��Ȼ��Ӱ�����������մ��������е�ԭʼ����Ҳ���������ע�룬����������ͼ��ʾ�����£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-8ff5579425f73dd5c2d321a86d0303390ac.png)

���������ٴ��������� java ���� spring bean �Ĳ����кö࣬�������ǽ���ע��ѭ��������صĲ��裬������˽� spring bean ��ϸ�ĳ�ʼ�����̣��ɲ鿴 [spring ��������֮�������̸���](https://my.oschina.net/funcy/blog/4597493)��

���������̽�������������������ڿ��������֣�

*   ���� --> ����ע�� --> ���ɴ������ --> ��������󱣴浽������
*   ���� (ԭʼ����)--> ���ɴ������ (��ǰ���� aop)--> ��ԭʼ�����������ע�� --> ��������󱣴浽������

�����ֶ��ܴﵽ����Ŀ�ģ���**���浽�����е��Ǵ�������Ҵ�������Ӧ��ԭʼ�������������ע��**�����μ��������������̣����Ǻ����� aop ��ѭ����������ĺ��ģ�˵���ˣ�**aop �µ�ѭ����������֮�����ܽ����������Ϊ���������ǰ���� aop ����**��

##### 2\. Ϊʲô�� `earlySingletonObjects` �޷����ѭ��������

ǰ��������Ҫ˵���˴������Ĵ������̣������������������� aop �£�ʹ�� `earlySingletonObjects` �����ѭ��������ʲô���⣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-d3d00d76ab0c72339faccb7ccd853723d6c.png)

������������ͼ�����̣�

1.  �� `service1` ���󴴽���ɺ��Ƚ� `service1` ���� `earlySingletonObjects`��Ȼ���������ע�룻
2.  �� `service1` ��������ע��ʱ��`spring` ���� `service1` ��Ҫע�� `service2`��Ȼ����ȥ `earlySingletonObjects` ���� `service2`��δ�ҵ�����ȥ `singletonObjects` �в��� `service2`������δ�ҵ������ǾͿ�ʼ�� `service2` �Ĵ������̣�
3.  �� `service2` ���󴴽���ɺ��Ƚ� `service2` ���� `earlySingletonObjects`��Ȼ���������ע�룻
4.  �� `service2` ��������ע��ʱ��`spring` ���� `service2` ��Ҫע�� `service1`��Ȼ���ȥ `earlySingletonObjects` ���� `service1`���ҵ��ˣ��ͽ� `service1` ע�뵽 `service2` �У�Ȼ���ٽ��� aop����ʱ `service2` ��һ��������󣬽��䱣�浽 `singletonObjects` �У�
5.  ������ 4 �������ǵõ��� `service2` �Ĵ������Ȼ����ע�뵽 `service1` �У������ٶ� `service1` ���� aop����ʱ `service1` Ҳ����һ�� `spring bean`�����䱣�浽 `singletonObjects` �С�

����������ʲô�����أ���ϸ���� 4 �����ͻᷢ�֣�**ע�뵽 `service2` �� `service1` �����Ǵ������**���ݹ�ȫ�֣����յõ��� `service1` �� `service2` ���Ǵ������ע�뵽 `service2` �� `service1` Ӧ��Ҳ�Ǵ������Ŷԡ���ˣ��� aop �£�ѭ�������������ֳ����ˣ�

#### 2.3 spring �Ľ������

ǰ�������ᵽ���� aop �£����� `earlySingletonObjects` �����ܽ��ѭ�����������⣬�� spring ����ô������أ�spring �ٴ�������һ�� `map` �����������⣬��Ҳ�����ǳ�˵�� **spring ��������**���������� `map` ˵�����£�

*   һ������ `singletonObjects`������Ϊ `ConcurrentHashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �������� `spring bean`�����������ע�롢��ʼ���� bean����� bean ��Ҫ aop���洢�ľ��Ǵ������
*   �������� `earlySingletonObjects`������Ϊ `HashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` ��ʵ������ɣ���δ��������ע��� `bean`����� `bean` ��Ҫ `aop`������洢�ľ��Ǵ������ֻ����������������е�ԭʼ����δ��������ע�룻
*   �������� `singletonFactories`������Ϊ `HashMap<String, ObjectFactory>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �洢����һ�� `lambda` ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`�� `getEarlyBeanReference` �е� `bean` �Ǹմ�����ɵ� `java bean`��û�н��� spring ����ע�룬Ҳû���� aop (������� `lambda` ���ʽ��������������)��

Ϊ��˵�����㣬����� `singletonObjects`��`earlySingletonObjects` �� `singletonFactories` �ֱ��Ϊ**һ������**��**��������**��**��������**��

spring ��� aop �µ�ѭ�������������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-dc325a87b321e4c246a1b2f14169821a75a.png)

���ͼ���űȽϸ��ӣ���ʵ�ֿ������ͱȽϼ��ˣ����������У�`1~8` �ǻ�ȡ `service1` �����̣�`5.1~5.8` �ǻ�ȡ `service2` �����̣�`5.5.1` ���ٴλ�ȡ `service1` �����̣�ֻ�����ڴ��� `service1` �ĳ�ʼ�������У��ᴥ�� `service2` �ĳ�ʼ�����̣��� `service2` �ĳ�ʼ��ʱ���ֻ������� `service1`����˲ſ�����������һ�𣬱Ƚϸ��ӡ�

����ͼ�Ĺ��̣�����˵�����£����飺����������̱Ƚϸ��ӣ������ȿ� `1~8` �Ĳ������ٿ� `5.1~5.8` �Ĳ�����������������������������������ࣩܶ��

*   1.  `service1`����ȡ `service1`����һ�������л�ȡ����ʱ�ǻ�ȡ�����ģ�
*   1.  `service1`������ `service1` ��ʵ����
*   1.  `service1`����ȡ��Ҫע��������뷽������ԭʼ�����Ͻ��л�ȡ����
*   1.  `service1`�����������֧��ѭ�����������ã��ͽ� `service1` �ŵ����������У��Ƿ�֧��ѭ���������ǿ������õģ���
*   1.  `service1`���� `service1` ��������ע�룬��Ҫ `service2`��Ȼ��Ϳ�ʼ�� `service2` �Ļ�ȡ���̣�
*   5.1 `service2`����ȡ `service2`����һ�������л�ȡ����ʱ�ǻ�ȡ�����ģ�
*   5.2 `service2`������ `service2` ��ʵ����
*   5.3 `service2`����ȡ��Ҫע��������뷽������ԭʼ�����Ͻ��л�ȡ����
*   5.4 `service2`�����������֧��ѭ�����������ã��ͽ� `service2` �ŵ����������У��Ƿ�֧��ѭ���������ǿ������õģ���
*   5.5 `service2`���� `service2` ��������ע�룬��Ҫ `service1`��Ȼ��Ϳ�ʼ�� `service1` �Ļ�ȡ���̣�
*   5.5.1 `service1`: ��ȡ `service1`����һ�������л�ȡ����ȡ��������ʱ���� `service1` ���ڴ����У����Ǽ����Ӷ������������л�ȡ�����մ����������л�ȡ���ˣ��������������档�����������ȡ�Ĺ����У�**���ж� `service1` �Ƿ���Ҫ���� aop��Ȼ��ʼ aop ����**����˷�����������е��� `service1` ���������ǰ���� aop �ǽ��ѭ�������Ĺؼ���
*   5.6 `service2`���õ��� `service1` ������� `service1` �Ǵ�����󣩣�����ע�뵽 `service2` �У����Ŷ� `service2` ���� aop���õ� `service2` �Ĵ������
*   5.7 `service2`�����֧��ѭ���������ȴ�һ�������������ٴλ�ȡ `service2`����δ��ȡ������ʹ�õ�ǰ `service2`����ǰ `service2` �Ǵ������)��
*   5.8 `service2`���� service2 �Ĵ���������һ�������У�ɾ�������������棬���ˣ�`service2` ��ʼ����ɣ�ע��� `service1` �Ǵ������һ�������е� `service2` Ҳ�Ǵ������
*   1.  `service1`���ص� `service1` ���������ڣ��õ� `service2`������� `service2` �Ǵ�����󣩺󣬽���ע�뵽 `service1`��`service1` ������ע����ɣ����г�ʼ����������ж� `service1` �Ƿ���Ҫ���� aop����Ȼ `service1` ����Ҫ���� aop �ģ��������� `5.5.1` �Ѿ����й� aop �ˣ���ˣ�����ֱ�ӷ��أ�����һ����`service1` ����ԭʼ���󣩣�
*   1.  `service1`�����֧��ѭ���������ȴ�һ�������л�ȡ `service1`����ȡ�������ٴӶ������л�ȡ `service1`�����Ի�ȡ������ `5.5.1` ��֪�������������� `service1` ������󣩣����أ�
*   1.  `service1`�������������л�ȡ�Ķ���ע�ᵽһ�������У�ɾ�������������棬���ˣ�`service1` ��ʼ����ɣ�ע��� `service2` �Ǵ������һ�������е� `service1` Ҳ�Ǵ������

�������̣���Ȼ����϶࣬�� `service1` �� `service2` �Ļ�ȡ��������ͬ�ģ�ֻҪŪ��������֮һ�Ļ�ȡ���̣���һ�� bean �Ļ�ȡ���̾ͺ���ͬ�ˡ�

�����������У������������ݽṹ��Ҫ˵���£�

*   `singletonsCurrentlyInCreation`������Ϊ `SetFromMap<String>`��λ�� `DefaultSingletonBeanRegistry`��������ʽΪ `Collections.newSetFromMap(new ConcurrentHashMap<>(16))`���������Ǹ��� `ConcurrentHashMap` ʵ�ֵ� set���洢�������ڴ����еĶ���**�жϵ�ǰ�����Ƿ��ڴ����о���ͨ�����ҵ�ǰ�����Ƿ������ set ��**�����ģ�
*   `earlyProxyReferences`������Ϊ `ConcurrentHashMap<Object, Object>`��λ�� `AbstractAutoProxyCreator`���洢������ǰ���� aop �Ķ���**���һ��������ǰ������ aop���ں����ٴ� aop ʱ����ͨ���ж϶����Ƿ��� `earlyProxyReferences` �ж�ȷ��Ҫ��Ҫ���� aop���Դ�����֤ÿ������ֻ����һ�� aop**��

���ˣ�spring һ���ṩ�� 5 �����ݽṹ���������ѭ���������⣬�ܽ����£�

| �ṹ                            | ˵��                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| `singletonObjects`              | **һ������**������Ϊ `ConcurrentHashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �������� `spring bean`�����������ע�롢��ʼ���� bean����� bean ��Ҫ aop���洢�ľ��Ǵ������ |
| `earlySingletonObjects`         | **��������**������Ϊ `HashMap<String, Object>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` ��ʵ������ɣ���δ��������ע��� `bean`��**��� `bean` ��Ҫ `aop`������洢�ľ��Ǵ������ֻ����������������е�ԭʼ����δ��������ע��** |
| `singletonFactories`            | **��������**������Ϊ `HashMap<String, ObjectFactory>`��λ�� `DefaultSingletonBeanRegistry` ���У�`key` Ϊ `beanName`��`value` �洢����һ�� `lambda` ���ʽ��`() -> getEarlyBeanReference(beanName, mbd, bean)`��`getEarlyBeanReference(xxx)` �е� `bean` �Ǹմ�����ɵ� `java bean`��û�н��� spring ����ע�룬Ҳû���� aop |
| `singletonsCurrentlyInCreation` | ����Ϊ `SetFromMap<String>`��λ�� `DefaultSingletonBeanRegistry`��������ʽΪ `Collections.newSetFromMap(new ConcurrentHashMap<>(16))`���������Ǹ��� `ConcurrentHashMap` ʵ�ֵ� set���洢�������ڴ����еĶ��󣬿���**�����жϵ�ǰ�����Ƿ��ڴ�����** |
| `earlyProxyReferences`          | ����Ϊ `ConcurrentHashMap<Object, Object>`��λ�� `AbstractAutoProxyCreator`���洢������ǰ���� aop �Ķ��󣬿���**�����ж� bean �Ƿ���й� aop����֤ÿ������ֻ����һ�� aop** |

���Ͼ��� spring ���ѭ�����������������ˡ�

### 3\. ����ģ��

����ʽ����Դ��ǰ����������ģ��ѭ������������Ĺ��̣��������£�

```
/**
 * ׼��һ���࣬�ڲ���һ������ Obj2
 */
public class Obj1 {
    // ��Ҫע�� obj2
    private Obj2 obj2;

    // ʡ����������
    ...
}

/**
 * ׼��һ���࣬�ڲ���һ������ Obj1
 */
public class Obj2 {
    // ��Ҫע�� ob1
    private Obj1 obj1;

    // ʡ����������
    ...

}

/**
 * ׼��Obj2�Ĵ����࣬�ڲ�����obj2�Ķ���
 */
public class ProxyObj2 extends Obj2 {
    // obj2�������ڲ�����obj2��ԭʼ����
    private Obj2 obj2;

    public ProxyObj2(Obj2 obj2) {
        this.obj2 = obj2;
    }

    // ʡ����������
    ...

}

/**
 * ׼��Obj1�Ĵ����࣬�ڲ�����obj1�Ķ���
 */
public class ProxyObj1 extends Obj1 {
    // obj2�������ڲ�����obj1��ԭʼ����
    private Obj1 obj1;

    public ProxyObj1(Obj1 obj1) {
        this.obj1 = obj1;
    }

    // ʡ����������
    ...

}

```

*   ����׼���������ࣺ`Obj1` �� `Obj2`�� ���� `Obj1` �и�����Ϊ `Obj2`��`Obj2` ���и�����Ϊ `Obj1`��
*   ����׼���� `Obj1` �� `Obj2` �Ĵ����� `ProxyObj1`��`ProxyObj2`������ `ProxyObj1`��`ProxyObj2` �ֱ���һ�����ԣ�`Obj1` �� `Obj2`��
*   ���������� `new ObjX()` ģ�����Ĵ�����
*   ���������� `objX.setObjX(xxx)` ģ������ע�룻
*   ���������� `new ProxyObjX(xxx)` ģ������������ɣ�
*   ���������� `collection.add(xxx)` ģ�������ӵ������еĹ��̣�

����ģ�����յõ��Ľ��Ϊ��

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`

׼�������Ѿ�����ˣ����������ǾͿ�ʼ����ģ���ˡ�

#### 3.1 ģ�� 1

Ҫ��

*   Obj1 �� Obj2 �����ϸ��� ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �����̴���
*   ��������Ĵ������̿��Խ������

Ŀ�꣺

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`

�������£�

```
public static main(String[] args) {
     // ׼��һ�����������ﱣ�������������������ڵĶ���
     // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
     // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
     Collection<?> collection = new ArrayList();

     // 1\. ���� Obj1 ����
     Obj1 obj1 = new Obj1();

     // ��������Ҫ��obj2�Ĵ������ע�뵽obj1�У�����ʱ�����в�û��obj2�Ĵ�����������л���obj2�Ĵ�������
     // һ. ���� Obj2 ����
     Obj2 obj2 = new Obj2();

     // �����obj2��Ҫע��obj1�Ĵ�����󣬵���ʱ�����в�û��obj2�Ĵ������������Ҫ�е�obj1�Ĵ�������

}

```

��ִ������������ �����ִ��� Obj2 ��������̾ͽ��в���ȥ�ˣ�

*   `obj1` ��Ҫע�� `obj2` �Ĵ�����󣬵��Ҳ����������л��� `obj2` �Ĵ������̣�
*   `obj2` ��Ҫע�� `obj1` �Ĵ�����󣬵��Ҳ����������л��� `obj1` �Ĵ������̣�
*   `obj1` ��Ҫע�� `obj2` �Ĵ�����󣬵��Ҳ����������л��� `obj2` �Ĵ������̣�
*   ...

���ѭ��������

ģ������δ�ﵽԤ��Ŀ�꣬����ģ������ʧ�ܡ�

#### 3.1 ģ�� 2

Ҫ��

*   Obj1 �� Obj2 ����������������֮һ������
    *   ������ --> ����ע�� --> ���ɴ������ --> ���浽�����С� �����̴���
    *   ������ (ԭʼ����)--> ���ɴ������ --> ��ԭʼ�����������ע�� --> ��������󱣴浽�����С� �����̴���
*   ��������Ĵ������̿��Խ������

Ŀ�꣺

*   ���շ��������Ķ���ֱ��� `proxyObj1`��`proxyObj2`
*   ע�뵽 `obj1` �е��� `proxyObj2`��ע�뵽 `obj2` �е��� `proxyObj2`

ʾ���������£�

```
 public static main(String[] args) {
      // ׼��һ�����������ﱣ�������������������ڵĶ���
      // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
      // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
      Collection<?> collection = new ArrayList();

      // 1\. ���� Obj1 ����
      Obj1 obj1 = new Obj1();

      // ��������Ҫ��obj2�Ĵ������ע�뵽obj1�У�����ʱ�����в�û��obj2�Ĵ�����������л���obj2�Ĵ�������
      // һ. ���� Obj2 ����
      Obj2 obj2 = new Obj2();

      // 2\. �� Obj1 ��ǰ����
      ProxyObj1 proxyObj1 = new ProxyObj1(obj1);

      // ��. �� proxyObj1 ע�뵽 obj2 ��
      obj2.setObj1(proxyObj1);

      // ��. ���� obj2�Ĵ������
      ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

      // ��. proxyObj2 �Ѿ��������������������ڣ������������ӵ�����ʱ
      collection.add(proxyObj2);

      // ��ʱ�������Ѿ��� obj2 �Ĵ�������ˣ�����obj1����������
      // 3\. �� proxyObj2 ע�뵽 obj1 ��
      obj1.setObj2(proxyObj2);

      // 4\. proxyObj1 �Ѿ��������������������ڣ������������ӵ�����ʱ
      collection.add(proxyObj1);
 }

```

����Ĵ����У�obj1 �������� ��1��2��3��4�� ��ʶ��obj2 �������� ��һ�����������ġ� ��ʶ�������������£�

*   obj1�������� (ԭʼ����)--> ���ɴ������ --> ��ԭʼ�����������ע�� --> ��������󱣴浽�����С�
*   obj2�������� --> ����ע�� --> ���ɴ������ --> ���浽�����С�

�������߶������������У��ﵽ��Ԥ�ڵ�Ŀ�ꡣ

#### 3.3 ��ģ���еõ��Ľ���

�Ա���������ģ����룬����ģ�� 2 ֮ �����ܴﵽԤ��Ŀ�꣬��Ҫ����Ϊ��ע�� `obj2` �� `obj1` ����ʱ����ǰ������ `obj1` �Ĵ������ `proxyObj1`��ʹ�� `obj2` ����������������̡������ٴ�֤�����ṩ���� aop ��ѭ�������Ľ����������Ҫ�����ã�

����ƪ�������ľ��ȵ������ˣ�������Ҫ������ѭ�������Ĳ����������� spring ���ѭ�������Ĳ��裬���ͨ�����δ���ģ����ѭ�������Ľ������һƪ�������ǽ��� spring Դ����� spring ����ν��ѭ�������ġ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4659555](https://my.oschina.net/funcy/blog/4659555) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_

ʾ���������£�

```
 public static main(String[] args) {
      // ׼��һ�����������ﱣ�������������������ڵĶ���
      // 1\. ���Ԫ����ԭʼ������ö����Ѿ����������ע�� 
      // 2\. ���Ԫ���Ǵ��������ö�����е�ԭ�ж����Ѿ����������ע�� 
      Collection<?> collection = new ArrayList();

      // 1\. ���� Obj1 ����
      Obj1 obj1 = new Obj1();

      // ��������Ҫ��obj2�Ĵ������ע�뵽obj1�У�����ʱ�����в�û��obj2�Ĵ�����������л���obj2�Ĵ�������
      // һ. ���� Obj2 ����
      Obj2 obj2 = new Obj2();

      // 2\. �� Obj1 ��ǰ����
      ProxyObj1 proxyObj1 = new ProxyObj1(obj1);

      // ��. �� proxyObj1 ע�뵽 obj2 ��
      obj2.setObj1(proxyObj1);

      // ��. ���� obj2�Ĵ������
      ProxyObj2 proxyObj2 = new ProxyObj2(obj2);

      // ��. proxyObj2 �Ѿ��������������������ڣ������������ӵ�����ʱ
      collection.add(proxyObj2);

      // ��ʱ�������Ѿ��� obj2 �Ĵ�������ˣ�����obj1����������
      // 3\. �� proxyObj2 ע�뵽 obj1 ��
      obj1.setObj2(proxyObj2);

      // 4\. proxyObj1 �Ѿ��������������������ڣ������������ӵ�����ʱ
      collection.add(proxyObj1);
 }

```

����Ĵ����У�obj1 �������� ��1��2��3��4�� ��ʶ��obj2 �������� ��һ�����������ġ� ��ʶ�������������£�

*   obj1�������� (ԭʼ����)--> ���ɴ������ --> ��ԭʼ�����������ע�� --> ��������󱣴浽�����С�
*   obj2�������� --> ����ע�� --> ���ɴ������ --> ���浽�����С�

�������߶������������У��ﵽ��Ԥ�ڵ�Ŀ�ꡣ

#### 3.3 ��ģ���еõ��Ľ���

�Ա���������ģ����룬����ģ�� 2 ֮ �����ܴﵽԤ��Ŀ�꣬��Ҫ����Ϊ��ע�� `obj2` �� `obj1` ����ʱ����ǰ������ `obj1` �Ĵ������ `proxyObj1`��ʹ�� `obj2` ����������������̡������ٴ�֤�����ṩ���� aop ��ѭ�������Ľ����������Ҫ�����ã�

����ƪ�������ľ��ȵ������ˣ�������Ҫ������ѭ�������Ĳ����������� spring ���ѭ�������Ĳ��裬���ͨ�����δ���ģ����ѭ�������Ľ������һƪ�������ǽ��� spring Դ����� spring ����ν��ѭ�������ġ�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4659555](https://my.oschina.net/funcy/blog/4659555) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
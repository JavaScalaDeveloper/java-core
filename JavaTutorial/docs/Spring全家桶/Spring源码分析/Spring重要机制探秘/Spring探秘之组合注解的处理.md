### 1\. ʲô�����ע�⣿

�� spring �У���һ���ر��ע�⣺���ע�⡣������˵��springmvc �У�`@Controller` ע���������÷���·���ȣ�`@ResponseBody` ע����������������ͼ��Ⱦ��ֱ��չʾ���������н����һ����ת�� json ���أ����� `@RestController` ��������ߵĹ��ܣ��������÷���·����ͬʱҲ����ֱ��չʾ���������н�����������£�

```
@Controller
@ResponseBody
public @interface RestController {
    /**
     * ע�����
     */
    @AliasFor(annotation = Controller.class)
    String value() default "";

}

```

���Կ�����`@RestController` �ϱ��������ע�⣺`@Controller` �� `@ResponseBody`����������ͬʱӵ�������ߵĹ��ܡ�

������һ�����ӣ�spring �У������ڱ�ʶһ����Ϊ spring bean ��ʱ�򣬿����õ���Щע�⣺`@Component`��`@Repository`��`@Service` �ȣ��ٽ�һ��������룬���� `@Repository`��`@Service` �ж��� `@Component`��

```
@Component
public @interface Repository {
    @AliasFor(annotation = Component.class)
    String value() default "";
}

@Component
public @interface Service {
    @AliasFor(annotation = Component.class)
    String value() default "";
}

```

Ҳ����˵��`@Repository`��`@Service` ������� `@Component` �Ĺ��ܣ�

ʵ���ϣ���������Լ�дһ��ע�⣬��������

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface MyComponent {

    @AliasFor(annotation = Component.class)
    String value() default "";

}

```

Ȼ������ʹ�ã�

```
@MyComponent("beanObj3")
public class BeanObj3 {
    ...
}

```

spring ��Ȼ��� `BeanObj3` ��ʼ��Ϊ spring bean��

��ô spring �����������һ�����أ�ʵ���ϣ�spring �ڴ��� `@MyComponent` ʱ�����жϸ�ע�����Ƿ���� `@Component` ע�⣬����������ͻ�ȡ��ע������ã�Ȼ�� `@Component` �Ĵ����߼������д���

ͬ���أ�spring �ڴ��� `@RestController` ʱ�������ǰ�Ǵ��� `@Controller` ���߼����ʹ� `@RestController` �л�ȡ `@Controller` ������Ȼ����д��������ǰ�Ǵ��� `@ResponseBody` �߼����ʹ� `@RestController` �л�ȡ `@ResponseBody` ������Ȼ����д���

### 2\. �ݹ��ȡָ���������ע��

���������ˣ����ע���е�ע��Ҫ��ô��ȡ�أ�

������� jdk �ṩ�ķ�������������

```
RestController annotation = BeanObj3.class.getAnnotation(MyComponent.class);

```

�õ��� `annotation` �ض�Ϊ `null`��ԭ���� `Class#getAnnotation` ����ֻ�ܻ�ȡ������ֱ�ӳ��ֵ�ע�⣬`BeanObj3` ��û��ֱ�ӳ��� `@Component` �ģ���˵õ��Ľ��Ϊ null���취Ҳ����Ҳ�뵽�ˣ����Ǽ������¶�ȡ "ע���ע��"���ô���ʾ���£�����������

```
public class AnnotationHandler {

    /**
     * ���jdk�ṩ��Ԫע��
     */
    private static Set<Class<?>> metaAnnotations = new HashSet<>();
    static {
        metaAnnotations.add(Target.class);
        metaAnnotations.add(Documented.class);
        metaAnnotations.add(Retention.class);
    }

    public static void main(String[] args) {
        List<Class<?>> list = getAnnotations(BeanObj3.class);
        System.out.println(list);
    }

    /**
     * ��ȡ�������ݹ����
     */
    public static List<Class<?>> getAnnotations(Class<?> cls) {
        // ������Ÿ����ϵ�����ע�⣬����ע���ע��
        List<Class<?>> list = new ArrayList<>();
        // ���� doGetAnnotations(...) ��ȡ
        doGetAnnotations(list, cls);
        return list;
    }

    /**
     * ��ȡע��ľ������
     */
    private static void doGetAnnotations(List<Class<?>> list, Class<?> cls) {
        // ��ȡ���е�ע��
        Annotation[] annotations = cls.getAnnotations();
        if(annotations != null && annotations.length > 0) {
            for(Annotation annotation : annotations) {
                // ��ȡע�������
                Class<?> annotationType = annotation.annotationType();
                // ����jdk�ṩ��Ԫע��
                if(metaAnnotations.contains(annotationType)) {
                    continue;
                }
                // �ݹ����
                doGetAnnotations(list, annotationType);
            }
        }
        // �����ע�⣬����ӵ� list ��
        if(cls.isAnnotation()) {
            list.add(cls);
        }
    }
}

```

����Ҫ��ȡ `BeanObj3` ������ע�⣬�Ϳ������������ˣ�

```
// �õ� BeanObj3 �ϵ�����ע�⣬������ע���ע�⡱
List<Class<?>> list = AnnotationHandler.getAnnotations(BeanObj3.class);
// �ж� BeanObj3 ��ע�����Ƿ���� @Component
list.contains(Component.class);

```

���� demo ���ǱȽϴֲڣ������� jdk ��Ԫע�⣬����ֻ�ų��������������������� `@Component` �г��ֵģ����� `@Component` ֮�ϵ�ע���ȡ�Ѿ��㹻�ˣ����Ҳ������Ҫ�ģ�����û�л�ȡע������ݡ��� spring �У�ע�Ⲣ��ֻ��һ����ǣ������Զ���һϵ����������������

```
// ���� spring bean ������Ϊ beanObj3
@MyComponent("beanObj3")
public class BeanObj3 {
    ...
}

```

�� `AnnotationHandler` �����ܻ�ȡ��ע������ݣ�

���������������� spring ����ô����ע�����ݵĶ�ȡ�ġ�

### 3\. spring ��ȡע����Ϣ

spring 5.2 �У�����ע����Ϣ�Ķ�ȡ���ṩ�������ࣺ

*   `AnnotationMetadataReadingVisitor`��ע�����ݵĶ�ȡ�࣬���� asm ʵ�֣������� spring5.2 ���Ѿ������������ `@Deprecated`��������ʹ�� `SimpleAnnotationMetadataReadingVisitor`����˱��Ĳ�������
*   `SimpleAnnotationMetadataReadingVisitor`��ע�����ݵĶ�ȡ�࣬���� asm ʵ�֣�spring 5.2 ���������࣬������� `AnnotationMetadataReadingVisitor`����Ҫע����ǣ�`SimpleAnnotationMetadataReadingVisitor` �ķ��ʼ�����Ĭ�ϵģ��޷������ڰ�֮����ʣ�ͬʱ��Ҳ�� `final` �ģ����ܱ��̳У���������޷�ֱ�Ӳ����������� spring �ṩ��һ���ࣺ`SimpleMetadataReaderFactory`��ͨ�����Ϳ���ʹ�� `SimpleAnnotationMetadataReadingVisitor` ��
*   `StandardAnnotationMetadata`��ע�����ݵĶ�ȡ�࣬���ڷ���ʵ��

#### 3.1 `SimpleAnnotationMetadataReadingVisitor`

spring ��û���ṩֱ�Ӳ��� `SimpleAnnotationMetadataReadingVisitor` �Ļ��ᣬ���Ƿ�װ�� `SimpleMetadataReaderFactory` �ˣ�����������������ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f2926fbc022517409bfb6f6641c87a193c2.png)

���Կ�����`SimpleMetadataReaderFactory` ������Ҫ��Ϊ�����֣�

1.  ���췽��
2.  ��Դ�Ļ�ȡ

��������ֱ�ӿ���ȡ�Ļ�ȡ��Ҳ���� `getMetadataReader(...)` ������

`getMetadataReader(Resource resource)`: ���� `Resource` ��ȡ���� `getMetadataReader(String className)`: ����������ȡ���ݣ��������ȫ�޶��������� �������������������Ӵ��������������������Ҳ��ת��Ϊ `Resource`��Ȼ����� `getMetadataReader(Resource)` ���ж�ȡ

�����������ķ���ֵ���� `MetadataReader`�����Ǹ�ɶ�أ����Ǽ������¿�.

##### `MetadataReader`

`MetadataReader` �Ĳ��ַ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-4a1184918664e8a4bd363d6399ed4092692.png)

���Կ��������Ǹ��ӿڣ����ﷵ�صľ������;��� `SimpleMetadataReader` �ˣ�������� 3 ��������

*   `getResource()`: ��ȡ��Դ
*   `getClassMetadata()`: ��ȡ���Ԫ����
*   `getAnnotationMetadata()`: ��ȡע���Ԫ����

�����ǻ�ȡע�����Ϣ����������ֻ��ע `getAnnotationMetadata()` ������

```
AnnotationMetadata getAnnotationMetadata();

```

����������ص��� `AnnotationMetadata`�������Ǹ�ɶ��

##### `AnnotationMetadata`

�����������ķ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-fc19d57bbba3d70da04fd32e6eef511ad4f.png)

��Щ������Ϊ���ࣺ

*   `getXxx(...)`������ע���ȡ��Ӧ����Ϣ
*   `hasXxx(...)`���ж��Ƿ����ĳע��

�����һ�����⼸��������Ĭ��ʵ�֣����ֶ����� `getAnnotations()` ������

```
public interface AnnotationMetadata extends ClassMetadata, AnnotatedTypeMetadata {

    default Set<String> getAnnotationTypes() {
        // ������ getAnnotations()
    return getAnnotations().stream()
        .filter(MergedAnnotation::isDirectlyPresent)
        .map(annotation -> annotation.getType().getName())
        .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    default Set<String> getMetaAnnotationTypes(String annotationName) {
        // ������ getAnnotations()
    MergedAnnotation<?> annotation = getAnnotations().get(annotationName, 
        MergedAnnotation::isDirectlyPresent);
    if (!annotation.isPresent()) {
        return Collections.emptySet();
    }
    return MergedAnnotations.from(annotation.getType(), SearchStrategy.INHERITED_ANNOTATIONS)
                .stream()
        .map(mergedAnnotation -> mergedAnnotation.getType().getName())
        .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    default boolean hasAnnotation(String annotationName) {
        // ������ getAnnotations()
    return getAnnotations().isDirectlyPresent(annotationName);
    }

    ...
}

```

�ٽ�һ���鿴 `getAnnotations()` ������������ `AnnotatedTypeMetadata`��

```
public interface AnnotatedTypeMetadata {

    /**
     * ��ȡע��
     */
    MergedAnnotations getAnnotations();

    ...

}

```

��һ�������ƺ�ע��õ����ռ������ `MergedAnnotations` �ˣ����Ǽ���̽����

##### `MergedAnnotations`

`MergedAnnotations` �Ĳ���ע�����£�

> Provides access to a collection of merged annotations, usually obtained from a source such as a {@link Class} or {@link Method}.
>
> �ṩ�����ע��ļ��ϵķ��ʣ���Щע��ͨ���Ǵ� Class �� Method ֮�����Դ��õġ�

������`MergedAnnotations` �������յ����ע��ļ����ˣ��������������ļ���������

```
// �ж�ע���Ƿ���ڣ�������е�ע�����ж�
<A extends Annotation> boolean isPresent(Class<A> annotationType);

// �ж�ע���Ƿ���ڣ�������е�ע�����жϣ�������ķ�����ͬ���ǣ����ﴫ������ַ���
boolean isPresent(String annotationType);

// �ж�ֱ��ע���Ƿ���ڣ�Ҳ����ֻ�жϵ�ǰ������û�и�ע�⣬���ж�ע���ע��
<A extends Annotation> boolean isDirectlyPresent(Class<A> annotationType);

// ����ͬ�ϣ����ﴫ����������ַ�������ʽΪ"����.����"
boolean isDirectlyPresent(String annotationType);

// ��ȡע��
<A extends Annotation> MergedAnnotation<A> get(Class<A> annotationType);

// ��ȡע�⣬���ﴫ����������ַ�������ʽΪ"����.����"
<A extends Annotation> MergedAnnotation<A> get(String annotationType);

```

�ӷ����ϴ��¿��Կ�����`MergedAnnotations` �����ע��ļ��ϣ��ṩ��ע������ж�ĳע���Ƿ���ڣ�Ҳ���Ի�ȡ���е�ĳ��ע�⡣

##### `MergedAnnotation`

`MergedAnnotations` ��ע��ļ��ϣ�����������зŵ���ɶ�أ������� `get(...)` ��������������ŵ��� `MergedAnnotation`�������������� `MergedAnnotation` ֧�ֵķ�����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a3a749f4546d63b49bfd25d2fc2c73dcb6f.png)

�����ϵķ������Կ�����`MergedAnnotation` ����ע������ݳ������ṩ�˷ḻ�� api ������ȡע������ݡ�

##### ʹ��ʾ��

����������ʾ����

```
// �õ� SimpleMetadataReaderFactory ʵ�������յ��õ��� SimpleAnnotationMetadataReadingVisitor ����ȡ
SimpleMetadataReaderFactory readerFactory = new SimpleMetadataReaderFactory();
MetadataReader metadataReader = readerFactory.getMetadataReader(BeanObj3.class.getName());
AnnotationMetadata annotationMetadata = metadataReader.getAnnotationMetadata();

// AnnotationMetadata �ṩ�����Ĳ������ص��עע����ص�
Set<String> annotationTypes = annotationMetadata.getAnnotationTypes();
System.out.println("-------------");
annotationTypes.forEach(type -> System.out.println(type));
System.out.println("-------------");

// ������ֱ�ӻ�ȡ��BeanObj3 ��ֱ�ӱ�� @MyComponent�ģ����ص���true
boolean exist1 = annotationMetadata.hasAnnotation(MyComponent.class.getName());
System.out.println("hasAnnotation @MyComponent:" + exist1);

// ������ֱ�ӻ�ȡ��BeanObj3 ����û��ֱ�ӱ�� @Component�ģ����ص���false
boolean exist2 = annotationMetadata.hasAnnotation(Component.class.getName());
System.out.println("hasAnnotation @Component:" + exist2);

// ��ȡ MergedAnnotations
MergedAnnotations annotations = annotationMetadata.getAnnotations();
System.out.println("-------------");
annotations.forEach(annotationMergedAnnotation -> System.out.println(annotationMergedAnnotation));
System.out.println("-------------");

// ������ֱ�ӻ�ȡ��BeanObj3 ����û��ֱ�ӱ�� @Component�ģ����ص���false
boolean directlyPresent = annotations.isDirectlyPresent(Component.class);
System.out.println("directlyPresent Component:" + directlyPresent);

// �ж���û�����ע�⣬BeanObj3 �ϵ�@MyComponent�У������ @Component �ģ����ص���true
boolean present = annotations.isPresent(Component.class);
System.out.println("present Component:" + present);

// ��ȡ @Component ע��
MergedAnnotation<Component> mergedAnnotation = annotations.get(Component.class);
// ���� @MyComponent �� value() ���� @AliasFor(annotation = Component.class)
// �������õ��� value �� beanObj3 ��BeanObj3����ôָ���ģ�@MyComponent("beanObj3")��
String value = mergedAnnotation.getString("value");
System.out.println("Component value:" + value);

// �� @Component ��ע�������ת��Ϊ AnnotationAttributes
AnnotationAttributes annotationAttributes = mergedAnnotation.asAnnotationAttributes();
System.out.println(annotationAttributes);

```

���У�������£�

```
-------------
org.springframework.learn.explore.demo01.MyComponent
-------------
hasAnnotation @MyComponent:true
hasAnnotation @Component:false
-------------
@org.springframework.learn.explore.demo01.MyComponent(value=beanObj3)
@org.springframework.stereotype.Component(value=beanObj3)
@org.springframework.stereotype.Indexed()
-------------
directlyPresent Component:false
present Component:true
Component value:beanObj3
{value=beanObj3}

```

##### ���䣺`AnnotationAttributes`

����˵���� `AnnotationAttributes`��

```
public class AnnotationAttributes extends LinkedHashMap<String, Object> {
    ...
}

```

��ʵ���� `LinkedHashMap`���ṩ�Ĳ��ַ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a8c8dc975790719c37a8e41a4b0067c517c.png)

�����ﲻ�ѿ�����`AnnotationAttributes` ���ǰ���ע����������ֵ�� map��key Ϊ��������value Ϊ����ֵ��

#### 3.2 `StandardAnnotationMetadata`

���ǽ��������� `StandardAnnotationMetadata`:

```
public class StandardAnnotationMetadata extends StandardClassMetadata 
        implements AnnotationMetadata {

    /**
     * Create a new {@code StandardAnnotationMetadata} wrapper for the given Class.
     * @param introspectedClass the Class to introspect
     * @see #StandardAnnotationMetadata(Class, boolean)
     * @deprecated since 5.2 in favor of the factory method 
     *   {@link AnnotationMetadata#introspect(Class)}
     */
    @Deprecated
    public StandardAnnotationMetadata(Class<?> introspectedClass) {
    this(introspectedClass, false);
    }

    ...
}

```

`StandardAnnotationMetadata` ʵ���� `AnnotationMetadata` �ӿڣ�����ע��Ĳ�����������ܵ� `AnnotationMetadata` ����̫����������Ͳ�׸���ˡ�

�� `StandardAnnotationMetadata` �Ĺ��췽�����������Ѿ������ˣ�������ʹ�� `AnnotationMetadata#introspect(Class)` ����ȡ `StandardAnnotationMetadata` ��ʵ�������ǣ����ǿ�����������������

```
// ��ȡ���� annotationMetadata ʵ������ StandardAnnotationMetadata
AnnotationMetadata annotationMetadata = AnnotationMetadata.introspect(BeanObj3.class);

//----------- ����������SimpleAnnotationMetadataReadingVisitor һģһ��

// AnnotationMetadata �ṩ�����Ĳ������ص��עע����ص�
Set<String> annotationTypes = annotationMetadata.getAnnotationTypes();
System.out.println("-------------");
annotationTypes.forEach(type -> System.out.println(type));
System.out.println("-------------");

// ������ֱ�ӻ�ȡ��BeanObj3 ��ֱ�ӱ�� @MyComponent�ģ����ص���true
boolean exist1 = annotationMetadata.hasAnnotation(MyComponent.class.getName());
System.out.println("hasAnnotation @MyComponent:" + exist1);

// ������ֱ�ӻ�ȡ��BeanObj3 ����û��ֱ�ӱ�� @Component�ģ����ص���false
boolean exist2 = annotationMetadata.hasAnnotation(Component.class.getName());
System.out.println("hasAnnotation @Component:" + exist2);

// ��ȡ MergedAnnotations
MergedAnnotations annotations = annotationMetadata.getAnnotations();
System.out.println("-------------");
annotations.forEach(annotationMergedAnnotation -> System.out.println(annotationMergedAnnotation));
System.out.println("-------------");

// ������ֱ�ӻ�ȡ��BeanObj3 ����û��ֱ�ӱ�� @Component�ģ����ص���false
boolean directlyPresent = annotations.isDirectlyPresent(Component.class);
System.out.println("directlyPresent Component:" + directlyPresent);

// �ж���û�����ע�⣬BeanObj3 �ϵ�@MyComponent�У������ @Component �ģ����ص���true
boolean present = annotations.isPresent(Component.class);
System.out.println("present Component:" + present);

// ��ȡ @Component ע��
MergedAnnotation<Component> mergedAnnotation = annotations.get(Component.class);
// ���� @MyComponent �� value() ���� @AliasFor(annotation = Component.class)
// �������õ��� value �� beanObj3 ��BeanObj3����ôָ���ģ�@MyComponent("beanObj3")��
String value = mergedAnnotation.getString("value");
System.out.println("Component value:" + value);

// �� @Component ��ע�������ת��Ϊ AnnotationAttributes
AnnotationAttributes annotationAttributes = mergedAnnotation.asAnnotationAttributes();
System.out.println(annotationAttributes);

```

���н�����£�

```
-------------
org.springframework.learn.explore.demo01.MyComponent
-------------
hasAnnotation @MyComponent:true
hasAnnotation @Component:false
-------------
@org.springframework.learn.explore.demo01.MyComponent(value=beanObj3)
@org.springframework.stereotype.Component(value=beanObj3)
@org.springframework.stereotype.Indexed()
-------------
directlyPresent Component:false
present Component:true
Component value:beanObj3
{value=beanObj3}

```

�������ʾ����������������ǧ����࣬���յõ��� `MergedAnnotations`��Ȼ��ͨ�������ж�ע���Ƿ���ڡ���ȡע���ֵ��

#### 3.3 ���ߵ�ʹ�ó���

`SimpleAnnotationMetadataReadingVisitor` �� `StandardAnnotationMetadata` ����Ҫ�������ڣ�`SimpleAnnotationMetadataReadingVisitor` �ǻ��� asm ��ʵ�֣�`StandardAnnotationMetadata` �ǻ��ڷ����ʵ�֣���������ʹ��ʱ��Ӧ��Ҫ��ôѡ�أ�

���ڻ��ڷ�����Ҫ�ȼ�����ص� jvm �еģ�����ҵ��ж��ǣ�**�����ǰ��û�м��ص� jvm �У���ʹ�� `SimpleAnnotationMetadataReadingVisitor`��������Ѿ����ص� jvm ���ˣ����߽Կ�ʹ��**��

��ʵ�ϣ��� spring ��ɨ��׶Σ���ȡ���ϵ�ע��ʱ��ʹ�õĶ��� `SimpleAnnotationMetadataReadingVisitor`����Ϊ��ʱ�ಢû�м��ص� jvm�����ʹ�� `StandardAnnotationMetadata` ��ȡ���ͻᵼ������ǰ���ء�����ǰ������ʲô�����أ�java ���ǰ�����صģ��е������������ jvm ���������ڶ�û�õ������ȫ�������ˣ��Ͱװ��˷��ڴ��ˡ�

### 4\. spring �ṩ��ע�⹤����

��ǰ���ʾ���У�������������ȡע��ģ�

```
// ��ȡ annotationMetadata��Ҳ����ʹ�� SimpleMetadataReaderFactory ��ȡ
AnnotationMetadata annotationMetadata = AnnotationMetadata.introspect(BeanObj3.class);
MergedAnnotations annotations = annotationMetadata.getAnnotations();

// �ж�ע���Ƿ����
boolean present = annotations.isPresent(Component.class);
// ��ȡע�������
MergedAnnotation<Component> mergedAnnotation = annotations.get(Component.class);
AnnotationAttributes annotationAttributes = mergedAnnotation.asAnnotationAttributes();

```

�����˵����ȡע������Բ���Ƚ϶࣬�������㣬���뵽���Խ���Щ�����װ��һ�������н��д���spring Ҳ����ô���ģ���͵ý��� spring ����ע����ص������ࣺ`AnnotationUtils` �� `AnnotatedElementUtils`��`AnnotationUtils` ��ֱ�ӻ�ȡע���ֵ�����ᴦ�����Ը��ǣ��� `AnnotatedElementUtils` �ᴦ�����Ը��ǡ�

ʲô�����Ը����أ�

������˵��`@MyComponent` ��������

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
// ע��Componentָ����ֵ��123
@Component("123")
public @interface MyComponent {

    @AliasFor(annotation = Component.class)
    String value() default "";

}

```

�� `@MyComponent` ע���У�����ָ���� `@Component` �� `value` ֵΪ ��123����Ȼ������ôָ�� `@MyComponent` �� `value` ֵ��

```
@MyComponent("beanObj3")
public class BeanObj3 {

    ...
}    

```

���� spring ��ʼ���õ��� `BeanObj3` �������� `123` ���� `beanObj3` �أ����������� `@MyComponent` �� `value` Ϊ `beanObj3` ��˵����Ȼ��ϣ�� bean ������Ϊ `beanObj3`�������� spring Ҳ����ô���ģ���������Ը����ˣ�`@MyComponent` �� `value` ������ `@Component` �� `value` ֵ��

`AnnotationUtils`/`AnnotatedElementUtils` ��������ܵ� `SimpleAnnotationMetadataReadingVisitor`/`StandardAnnotationMetadata` �Ǻι�ϵ�أ�

������ʹ�� `SimpleAnnotationMetadataReadingVisitor`/`StandardAnnotationMetadata` ʱ��������Ҫ�õ� `MergedAnnotations` �ٽ���һϵ�в������ж�ע���Ƿ���ڡ���ȡע�������ֵ�ȣ���������� `AnnotationUtils`/`AnnotatedElementUtils` ��Դ�룬�ͻᷢ�����ǵ���ط���Ҳ�ǲ��� `MergedAnnotations` �࣬�����ȡע�⣺

`AnnotationUtils#getAnnotation(AnnotatedElement, Class<A>)` ������

```
public static <A extends Annotation> A getAnnotation(AnnotatedElement annotatedElement, 
        Class<A> annotationType) {
    if (AnnotationFilter.PLAIN.matches(annotationType) ||
            AnnotationsScanner.hasPlainJavaAnnotationsOnly(annotatedElement)) {
        return annotatedElement.getAnnotation(annotationType);
    }
    // ͨ������ MergedAnnotations ���л�ȡ
    return MergedAnnotations.from(annotatedElement, 
            SearchStrategy.INHERITED_ANNOTATIONS, RepeatableContainers.none())
            .get(annotationType).withNonMergedAttributes()
            .synthesize(AnnotationUtils::isSingleLevelPresent).orElse(null);
}

```

`AnnotatedElementUtils#getAllMergedAnnotations(AnnotatedElement, Class<A>)` ������

```
public static <A extends Annotation> Set<A> getAllMergedAnnotations(
        AnnotatedElement element, Class<A> annotationType) {
    return getAnnotations(element).stream(annotationType)
            .collect(MergedAnnotationCollectors.toAnnotationSet());
}

// AnnotatedElementUtils#getAnnotations ������Ҳ�ǲ��� MergedAnnotations �ķ���
private static MergedAnnotations getAnnotations(AnnotatedElement element) {
    return MergedAnnotations.from(element, SearchStrategy.INHERITED_ANNOTATIONS, 
            RepeatableContainers.none());
}

```

��ˣ�`AnnotationUtils`/`AnnotatedElementUtils` �� `SimpleAnnotationMetadataReadingVisitor`/`StandardAnnotationMetadata` �ײ㶼�ǲ��� `MergedAnnotations` ��ġ�

#### 4.1 `AnnotationUtils`

`AnnotationUtils` ֧�ֵĲ��ַ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-51b0f496180a16d947b8f83285370cabd8f.png)

������ʵ��ʹ������Щ������

```
// �� BeanObj3 ��ȡ @Component
Annotation annotation = AnnotationUtils.getAnnotation(BeanObj3.class, Component.class);
if(null == annotation) {
    System.out.println("ע�ⲻ���ڣ�");
    return;
}
System.out.println("annotation: " + annotation);

// ��ȡ AnnotationAttributes
AnnotationAttributes annotationAttributes
        = AnnotationUtils.getAnnotationAttributes(BeanObj3.class, annotation);
System.out.println("AnnotationAttributes: " + annotationAttributes);

// ��ȡ annotationAttributeMap
Map<String, Object> annotationAttributeMap = AnnotationUtils.getAnnotationAttributes(annotation);
System.out.println("annotationAttributeMap: " + annotationAttributeMap);

// ��ȡvalue��ֵ
Object value = AnnotationUtils.getValue(annotation, "value");
System.out.println("value: " + value);

```

������£�

```
annotation: @org.springframework.stereotype.Component(value=123)
AnnotationAttributes: {value=123}
annotationAttributeMap: {value=123}
value: 123

```

�ӽ��������ֱ��ͨ�� `AnnotationUtils.getAnnotation(...)` Ҳ���ܻ�ȡ�� `@Component` ע��ģ����� `BeanObj3` ��û��ֱ�ӱ�� `@Component`. ��Ҫע����ǣ�������ȡ���� `@Component` �� `value` ֵ�� "123"�������� `@MyComponent` ���õ� `beanObj3`����Ҳ֤���� `AnnotationUtils` ��ȡ����ֵʱ�����������Ը��ǲ�����

#### 4.2 `AnnotatedElementUtils`

`AnnotatedElementUtils` ֧�ֵĲ��ַ������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9815fe697f5ccf14d3aa215952bfcbcc3ab.png)

����ʾ���ɣ�

```
// 1\. �ж��Ƿ��� Component ע��
boolean result = AnnotatedElementUtils.hasAnnotation(BeanObj3.class, Component.class);
System.out.println("hasAnnotation: " + result);

// 2\. ��ȡ attributeMap�����Կ������ǣ���ȡ @Component �� @MyComponent �õ��Ľ����һ��
// Component attributeMap: {value=[123]}
MultiValueMap<String, Object> attributeMap1 = AnnotatedElementUtils
        .getAllAnnotationAttributes(BeanObj3.class, Component.class.getName());
System.out.println("Component attributeMap: " + attributeMap1);
// MyComponent attributeMap: {value=[beanObj3]}
MultiValueMap<String, Object> attributeMap2 = AnnotatedElementUtils
        .getAllAnnotationAttributes(BeanObj3.class, MyComponent.class.getName());
System.out.println("MyComponent attributeMap: " + attributeMap2);

// 3\. ��ȡ���е� @Component ע�⣬value=beanObj3
Set<Component> mergedAnnotations = AnnotatedElementUtils
        .getAllMergedAnnotations(BeanObj3.class, Component.class);
System.out.println("mergedAnnotations: " + mergedAnnotations);

// 4\. ��ȡ����ֵ��{value=beanObj3}
AnnotationAttributes attributes = AnnotatedElementUtils
        .getMergedAnnotationAttributes(BeanObj3.class, Component.class);
System.out.println("attributes: " + attributes);

// 5\. ��ȡ MyComponent �ϵ�ע��
Set<String> types = AnnotatedElementUtils
        .getMetaAnnotationTypes(BeanObj3.class, MyComponent.class);
System.out.println("types: " + types);

```

������£�

```
hasAnnotation: true
Component attributeMap: {value=[123]}
MyComponent attributeMap: {value=[beanObj3]}
mergedAnnotations: [@org.springframework.stereotype.Component(value=beanObj3)]
attributes: {value=beanObj3}
types: [org.springframework.stereotype.Component, org.springframework.stereotype.Indexed]

```

�Ӵ����������ڵõ��� `Set<Component>` �� `AnnotationAttributes` �У�����ֵ�Ѿ��ϲ���.

��ѡ��ʹ�� `AnnotationUtils` ���� `AnnotatedElementUtils` ʱ�����Ը���Ҫ��Ҫ���Ը�����ѡ�������Ҫ�������Ը��ǣ���ʹ�� `AnnotatedElementUtils`���������Ҫ����ʹ�� `AnnotationUtils` �ɣ�

### 5\. �ܽ�

���Ľ����� spring ����ע��Ĳ�������Ҫ������ `SimpleAnnotationMetadataReadingVisitor` �� `StandardAnnotationMetadata` ��������ʹ�÷�����������������ʹ����������Ƚ϶࣬�����ֽ����� spring �ṩ�����������ࣺ`AnnotationUtils` �� `AnnotatedElementUtils`�������Ҫ�������Ը��ǣ���Ҫʹ�� `AnnotatedElementUtils`���������Ҫ����ʹ�� `AnnotationUtils`��

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4633161](https://my.oschina.net/funcy/blog/4633161) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
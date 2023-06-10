������ `ConfigurationClassPostProcessor` �����ĵ���ƪ����Ҫ�Ƿ��� spring �� `@Conditional` ע��Ĵ������̡�

## 5\. spring ����δ��� @Conditional ע��ģ�

### 5.1 `@Conditional` �Ĵ�������

��ǰ����� `ConfigurationClassParser#processConfigurationClass` ����ʱ������ôһ�У�

```
class ConfigurationClassParser {
    protected void processConfigurationClass(ConfigurationClass configClass) throws IOException {
        // �ж��Ƿ���Ҫ������������� @Conditional ע�⣬�ж��Ƿ���������
        if (this.conditionEvaluator.shouldSkip(configClass.getMetadata(), 
                ConfigurationPhase.PARSE_CONFIGURATION)) {
            return;
        }
        ...
    }
    ...
}

```

`conditionEvaluator.shouldSkip(...)` ���������������� `@Conditional` ע��ģ�������������Ĵ������̣���������ٷ�����������������ʲô�� `@Conditional` ע�⣺

```
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Conditional {

    /**
     * ������
     */
    Class<? extends Condition>[] value();

}

```

`@Conditional` ע��ǳ��򵥣�����һ�����ԣ�����ֵ�� `Class[]`���ұ����� `Condition` �����ࡣ������������ `Condition`��

```
public interface Condition {

    /**
     * ������ָ��ƥ���߼�
     */
    boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata);

}

```

`Condition` �ӿڽ���һ�� `matches` ���������ǿ���������ָ��ƥ���߼���

�������������� `conditionEvaluator.shouldSkip(...)` �Ĵ������̣�

```
class ConditionEvaluator {
    public boolean shouldSkip(@Nullable AnnotatedTypeMetadata metadata, 
            @Nullable ConfigurationPhase phase) {
        // �Ƿ��� @Conditional
        if (metadata == null || !metadata.isAnnotated(Conditional.class.getName())) {
            return false;
        }
        // �жϴ���� phase
        if (phase == null) {
            if (metadata instanceof AnnotationMetadata &&
                    ConfigurationClassUtils.isConfigurationCandidate((AnnotationMetadata) metadata)) {
                return shouldSkip(metadata, ConfigurationPhase.PARSE_CONFIGURATION);
            }
            return shouldSkip(metadata, ConfigurationPhase.REGISTER_BEAN);
        }

        // ʵ���� condition������� conditions ��
        List<Condition> conditions = new ArrayList<>();
        // 1\. getConditionClasses(metadata)����ȡ @Conditional ��ָ�����ж���
        for (String[] conditionClasses : getConditionClasses(metadata)) {
            for (String conditionClass : conditionClasses) {
                // 2\. ʵ�����������õ��Ļ��Ƿ��䣩��ͳһ�ŵ� conditions ��
                Condition condition = getCondition(conditionClass, this.context.getClassLoader());
                conditions.add(condition);
            }
        }
        // 3\. ��������õ��� condition ʵ��
        AnnotationAwareOrderComparator.sort(conditions);
        // ��������õ��� conditions
        for (Condition condition : conditions) {
            ConfigurationPhase requiredPhase = null;
            if (condition instanceof ConfigurationCondition) {
                requiredPhase = ((ConfigurationCondition) condition).getConfigurationPhase();
            }
            // 4\. ���� Condition#matches ���������ж�
            if ((requiredPhase == null || requiredPhase == phase) && 
                    !condition.matches(this.context, metadata)) {
                return true;
            }
        }

        return false;
    }

    ...
}

```

�÷����Ĵ����������£�

1.  ��ȡ `@Conditional` ��ָ�����ж��࣬���� `@Conditional` �� `value` ����ֵ��
2.  ʹ�� ����ʵ������ 1 ���� �õ����ж��࣬�� ���浽 `conditions`�����Ǹ� `List`�� �У�
3.  �Ե� 2 ���õ��� `conditions` ��������
4.  ������ 3 ���õ��� `conditions`������ `Condition#matches` ��������ƥ�䡣

`@Conditional` �Ĵ����Ƿǳ��򵥵ģ���������������������ʹ��ʾ����

### 5.2 `@Conditional` ʹ��ʾ��

#### ʾ�� 1����ָ���������ʱ���Ŵ��� spring bean

��������ʵ�ָ����ܣ���ָ���������ʱ���Ž��� spring bean �Ĵ�������ʼ�����������£�

1. ׼��һ���򵥵� bean:

   ```
   public class BeanObj {
   
   }
   
   ```

2. ʵ�� `Condition` �ӿڣ������ﴦ���ж��߼�

   ```
   public class MyCondition implements Condition {
       @Override
       public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
           String className = "java.lang.Object";
           try {
               // �ж����Ƿ����
               Class.forName(className);
               return true;
           } catch (ClassNotFoundException e) {
               return false;
           }
       }
   }
   
   ```

   �� `matches(...)` ������ ������ָ�� `className` Ϊ `java.lang.Object`��Ȼ���ж����Ƿ���ڣ��жϷ�ʽҲ ʮ�ּ� ������ʹ�� java �ķ�����ƣ�`Class.forName(...)`�����಻����ʱ�����׳� `ClassNotFoundException`�����ǿ��Բ�����쳣���Ӷ���֪������ڲ������ˡ�

3. ׼��������

   ```
   @ComponentScan
   public class BeanConfigs {
       @Bean
       @Conditional(MyCondition.class)
       public BeanObj beanObj() {
           return new BeanObj();
       }
   }
   
   ```

   ������Ƚϼ򵥣���Ҫע����� `beanObj()` �ϵ� `@Conditional` ע�⣬ָ����������ƥ������ `MyCondition`��ƥ�����������������н��еġ�

4. ����

   ```
   public class Demo06Main {
       public static void main(String[] args) {
           ApplicationContext context 
                   = new AnnotationConfigApplicationContext(BeanConfigs.class);
           try {
               Object obj = context.getBean("beanObj");
               System.out.println("beanObj ���ڣ�");
           } catch (Exception e) {
               System.out.println("beanObj �����ڣ�");
           }
       }
   }
   
   ```

���У�������£�

```
beanObj ���ڣ�

```

�� `MyCondition#matches` �У������жϵ��ǵ�ǰ��Ŀ���Ƿ���� `java.lang.Object`����Ȼ���Ǵ��ڵģ���� `beanObj` ���� spring �����У��������ǻ��� `className`:

```
public class MyCondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // ��������
        String className = "java.lang.Object111";
        ...
    }
}

```

��Ȼ��`java.lang.Object111` �ǲ������ڵ�ǰ��Ŀ�еģ����У�������£�

```
beanObj �����ڣ�

```

#### ʾ�� 2���Ľ�ʾ�� 1 ����

��ʾ�� 1 �У�����ͨ���� `MyCondition#matches` �޸� `className` ���ı� `beanObj` �������еĴ���������������Ŀ���зǳ��������Ҫ����Ĵ��������м��أ�������ʵ�ֶ�� `MyCondition` ��

���磬�� `A` ��Ҫ������ `A1` �Ĵ���������ж��Ƿ���г�ʼ������ `B` ��Ҫ������ `B1` �Ĵ���������ж��Ƿ���г�ʼ������ `C` ��Ҫ������ `C1` �Ĵ���������ж��Ƿ���г�ʼ��... �����Ƿ���Ҫ�ֱ�Ϊ`��A`��`��B`��`��C` ʵ�� `Condition`���ڸ��Ե� `match(...)` �����н����ж���

ʵ���ϣ����ǲ�����Ҫ��ô��������ͨ�� spring ���ע��ķ�����������Ϲ��ܡ�

1. ׼��һ�� bean������ʾ�� 1 ��������

   ```
   public class BeanObj {
   
   }
   
   ```

2. ׼��ע�� `@ConditionalForClass`����ע������� `@Conditional` �Ĺ��ܣ���������ƥ�����Ϊ `MyCondition`��`className` ���Ծ��Ǳ�����ڵ��ࣺ

```
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
// ����� @Conditional �Ĺ��ܣ���������ƥ�����Ϊ MyCondition
@Conditional(MyCondition.class)
public @interface ConditionalForClass {

    /**
     * ����ָ��������ڵ���
     */
    String className();

}

```

1. ׼�� `MyCondition`��ע����ʾ���Ĳ�����ڣ�`className` �����ڸ÷����ж��壬������ `@ConditionalForClass` ���룺

   ```
   public class MyCondition implements Condition {
       /**
        * ���ﴦ��ƥ��������ע����ʾ��1�е�����
        */
       @Override
       public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
           // ��ȡ @ConditionalForClass ע�����������ֵ
           Map<String, Object> annotationAttributes = metadata.getAnnotationAttributes(
                   ConditionalForClass.class.getName());
           // ��ȡclassName������ֵ������ @ConditionalForClass �� className ����
           String className = (String)annotationAttributes.get("className");
           if(null == className || className.length() <= 0) {
               return true;
           }
           try {
               // �ж����Ƿ����
               Class.forName(className);
               return true;
           } catch (ClassNotFoundException e) {
               return false;
           }
       }
   }
   
   ```

2. ׼�������࣬��ʱ������ע��Ϊ `@ConditionalForClass`��

   ```
   @ComponentScan
   public class BeanConfigs {
       @Bean
       /**
        * �� @ConditionalForClass ��ָ������������
        */
       @ConditionalForClass(className = "java.lang.Object")
       public BeanObj beanObj() {
           return new BeanObj();
       }
   }
   
   ```

3. ��������࣬��ʾ�� 1 ��������

   ```
   public class Demo07Main {
   
       public static void main(String[] args) {
           ApplicationContext context 
                   = new AnnotationConfigApplicationContext(BeanConfigs.class);
           try {
               Object obj = context.getBean("beanObj");
               System.out.println("beanObj ���ڣ�");
           } catch (Exception e) {
               System.out.println("beanObj �����ڣ�");
           }
       }
   }
   
   ```

������ͨ���Զ���ע�� `@ConditionalForClass` ��ָ�������� `java.lang.Object` ����ʱ��`beanObj` �Żᱻ��ӵ� spring �����У����������Ȼ���������У�������£�

```
beanObj ���ڣ�

```

�������������� `@ConditionalForClass` �� `className` ֵ��

```
@ComponentScan
public class BeanConfigs {
    @Bean
    // ���޸���@ConditionalForClass��classNameֵ��������������
    @ConditionalForClass(className = "java.lang.Object1111")
    public BeanObj beanObj() {
        return new BeanObj();
    }
}

```

���ｫ `@ConditionalForClass` �� `className` ֵ����Ϊ `java.lang.Object1111`����Ȼ����ಢ���ڵ�ǰ��Ŀ�У����н�����£�

```
beanObj �����ڣ�

```

���Ҳ�����ǵ�����һ�¡�

�����ǻص����ڿ�ͷ�����⣺���磬�� `A` ��Ҫ������ `A1` �Ĵ���������ж��Ƿ���г�ʼ������ `B` ��Ҫ������ `B1` �Ĵ���������ж��Ƿ���г�ʼ������ `C` ��Ҫ������ `C1` �Ĵ���������ж��Ƿ���г�ʼ��... �����Ƿ���Ҫ�ֱ�Ϊ`��A`��`��B`��`��C` ʵ�� `Condition`���ڸ��Ե� `match(...)` �����н����ж���

���� `@ConditionalForClass` ע������ǲ�����Ҫ��ô�鷳��ֻ��Ҫ�ڸ��Ե� `@Bean` ��������� `@ConditionalForClass` �����ˣ���������

```
@Bean
@ConditionalForClass(className = "A1")
public A a() {
    return new A();
}

@Bean
@ConditionalForClass(className = "B1")
public B b() {
    return new B();
}

@Bean
@ConditionalForClass(className = "B1")
public C c() {
    return new C();
}

...

```

ע����� `@ConditionalForClass` ��ʵ�֣�springboot �е� `@ConditionalOnClass` ���ǰ�����˼·ʵ�ֵġ�

### 5.3 �ܽ�

������Ҫ������ spring ���� `@Conditional` �����̣��߼��Ƚϼ򵥣����յ��õ��� `Condition#matches` ��������ƥ������ģ���ƥ������� `Condition` ��ʵ��������ָ����

Ϊ�˸��õ�˵�� `@Conditional` ��ʹ�ã�����׼��������ʹ��ʾ�����ر���ʾ�� 2����Ҫ�ر���ᣬspringboot �е� `@ConditionalOnClass` ���ǻ���ʾ�� 2 ��˼·����ʵ�ֵģ����⣬springboot �еĶ������ע��Ҳ�Ƕ� `@Conditional` ����չ��

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4873444](https://my.oschina.net/funcy/blog/4873444) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
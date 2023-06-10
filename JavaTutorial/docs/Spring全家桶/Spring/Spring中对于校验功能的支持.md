# Spring У��

Java API �淶(`JSR303`)������`Bean`У��ı�׼`validation-api`����û���ṩʵ�֡�`hibernate validation`�Ƕ�����淶��ʵ�֣���������У��ע����`@Email`��`@Length`�ȡ�`Spring Validation`�Ƕ�`hibernate validation`�Ķ��η�װ������֧��`spring mvc`�����Զ�У�顣

## [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8)��������

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%BC%95%E5%85%A5%E4%BE%9D%E8%B5%96)��������

��� spring-boot �汾С�� 2.3.x��spring-boot-starter-web ���Զ����� hibernate-validator ��������� spring-boot �汾���� 2.3.x������Ҫ�ֶ�����������



```
<dependency>
  <groupId>org.hibernate.validator</groupId>
  hibernate-validator-parent
  <version>6.2.5.Final</version>
</dependency>

```



���� web ������˵��Ϊ��ֹ�Ƿ�������ҵ�����Ӱ�죬�� Controller ��һ��Ҫ������У��ģ��󲿷�����£����������Ϊ����������ʽ��

*   POST��PUT ����ʹ�� requestBody ���ݲ�����
*   GET ����ʹ�� requestParam/PathVariable ���ݲ�����

ʵ���ϣ������� requestBody ����У�黹�Ƿ��������У�飬���ն��ǵ��� Hibernate Validator ִ��У�飬Spring Validation ֻ������һ���װ��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E6%A0%A1%E9%AA%8C%E7%A4%BA%E4%BE%8B)У��ʾ��

��1����ʵ���ϱ��У��ע��



```
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

    @NotNull
    private Long id;

    @NotBlank
    @Size(min = 2, max = 10)
    private String name;

    @Min(value = 1)
    @Max(value = 100)
    private Integer age;

}

```



��2���ڷ�������������У��ע��



```
@Slf4j
@Validated
@RestController
@RequestMapping("validate1")
public class ValidatorController {

    /**
     * {@link RequestBody} ����У��
     */
    @PostMapping(value = "save")
    public DataResult<Boolean> save(@Valid @RequestBody User entity) {
        log.info("����һ����¼��{}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

    /**
     * {@link RequestParam} ����У��
     */
    @GetMapping(value = "queryByName")
    public DataResult<User> queryByName(
        @RequestParam("username")
        @NotBlank
        @Size(min = 2, max = 10)
        String name
    ) {
        User user = new User(1L, name, 18);
        return DataResult.ok(user);
    }

    /**
     * {@link PathVariable} ����У��
     */
    @GetMapping(value = "detail/{id}")
    public DataResult<User> detail(@PathVariable("id") @Min(1L) Long id) {
        User user = new User(id, "����", 18);
        return DataResult.ok(user);
    }

}

```



��3������������������У���������׳� `ConstraintViolationException` �� `MethodArgumentNotValidException` �쳣��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E7%BB%9F%E4%B8%80%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86)ͳһ�쳣����

��ʵ����Ŀ�����У�ͨ������ͳһ�쳣����������һ�����Ѻõ���ʾ��



```
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * �������в���֪���쳣
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(Throwable.class)
    public Result handleException(Throwable e) {
        log.error("δ֪�쳣", e);
        return new Result(ResultStatus.HTTP_SERVER_ERROR.getCode(), e.getMessage());
    }

    /**
     * ͳһ�����������У���쳣(��ͨ����)
     *
     * @param e ConstraintViolationException
     * @return {@link DataResult}
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ ConstraintViolationException.class })
    public Result handleConstraintViolationException(final ConstraintViolationException e) {
        log.error("ConstraintViolationException", e);
        List<String> errors = new ArrayList<>();
        for (ConstraintViolation<?> violation : e.getConstraintViolations()) {
            Path path = violation.getPropertyPath();
            List<String> pathArr = StrUtil.split(path.toString(), ',');
            errors.add(pathArr.get(0) + " " + violation.getMessage());
        }
        return new Result(ResultStatus.REQUEST_ERROR.getCode(), CollectionUtil.join(errors, ","));
    }

    /**
     * �������У���쳣
     *
     * @param e MethodArgumentNotValidException
     * @return {@link DataResult}
     */
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ MethodArgumentNotValidException.class })
    private Result handleMethodArgumentNotValidException(final MethodArgumentNotValidException e) {
        log.error("MethodArgumentNotValidException", e);
        List<String> errors = new ArrayList<>();
        for (ObjectError error : e.getBindingResult().getAllErrors()) {
            errors.add(((FieldError) error).getField() + " " + error.getDefaultMessage());
        }
        return new Result(ResultStatus.REQUEST_ERROR.getCode(), CollectionUtil.join(errors, ","));
    }

}

```



## [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E8%BF%9B%E9%98%B6%E4%BD%BF%E7%94%A8)����ʹ��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%88%86%E7%BB%84%E6%A0%A1%E9%AA%8C)����У��

��ʵ����Ŀ�У����ܶ��������Ҫʹ��ͬһ�� DTO �������ղ���������ͬ������У�����ܿ����ǲ�һ���ġ����ʱ�򣬼򵥵��� DTO ����ֶ��ϼ�Լ��ע���޷����������⡣��ˣ�spring-validation ֧���˷���У��Ĺ��ܣ�ר����������������⡣

��1���������



```
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface AddCheck { }

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface EditCheck { }

```



��2����ʵ���ϱ��У��ע��



```
@Data
public class User2 {

    @NotNull(groups = EditCheck.class)
    private Long id;

    @NotNull(groups = { AddCheck.class, EditCheck.class })
    @Size(min = 2, max = 10, groups = { AddCheck.class, EditCheck.class })
    private String name;

    @IsMobile(message = "������Ч�ֻ���", groups = { AddCheck.class, EditCheck.class })
    private String mobile;

}

```



��3���ڷ����ϸ��ݲ�ͬ��������У�����



```
@Slf4j
@Validated
@RestController
@RequestMapping("validate2")
public class ValidatorController2 {

    /**
     * {@link RequestBody} ����У��
     */
    @PostMapping(value = "add")
    public DataResult<Boolean> add(@Validated(AddCheck.class) @RequestBody User2 entity) {
        log.info("���һ����¼��{}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

    /**
     * {@link RequestBody} ����У��
     */
    @PostMapping(value = "edit")
    public DataResult<Boolean> edit(@Validated(EditCheck.class) @RequestBody User2 entity) {
        log.info("�༭һ����¼��{}", JSONUtil.toJsonStr(entity));
        return DataResult.ok(true);
    }

}

```



### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%B5%8C%E5%A5%97%E6%A0%A1%E9%AA%8C)Ƕ��У��

ǰ���ʾ���У�DTO ��������ֶζ��ǻ����������ͺ� String ���͡�����ʵ�ʳ����У��п���ĳ���ֶ�Ҳ��һ��������������ȣ�����ʹ��Ƕ��У�顣 post ���磬���汣�� User ��Ϣ��ʱ��ͬʱ������ Job ��Ϣ����Ҫע����ǣ���ʱ DTO ��Ķ�Ӧ�ֶα�����@Valid ע�⡣



```
@Data
public class UserDTO {

    @Min(value = 10000000000000000L, groups = Update.class)
    private Long userId;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 2, max = 10, groups = {Save.class, Update.class})
    private String userName;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String account;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String password;

    @NotNull(groups = {Save.class, Update.class})
    @Valid
    private Job job;

    @Data
    public static class Job {

        @Min(value = 1, groups = Update.class)
        private Long jobId;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String jobName;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String position;
    }

    /**
     * �����ʱ��У�����
     */
    public interface Save {
    }

    /**
     * ���µ�ʱ��У�����
     */
    public interface Update {
    }
}
���ƴ���

```



Ƕ��У����Խ�Ϸ���У��һ��ʹ�á����о���Ƕ�׼���У���Լ��������ÿһ�����У�飬����`List<Job>`�ֶλ����� list �����ÿһ�� Job ���󶼽���У��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%A1%E9%AA%8C%E6%B3%A8%E8%A7%A3)�Զ���У��ע��

��1���Զ���У��ע�� `@IsMobile`



```
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Constraint(validatedBy = MobileValidator.class)
public @interface IsMobile {

    String message();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}

```



��2��ʵ�� `ConstraintValidator` �ӿڣ���д `@IsMobile` У��ע��Ľ�����



```
import cn.hutool.core.util.StrUtil;
import io.github.dunwu.spring.core.validation.annotation.IsMobile;
import io.github.dunwu.tool.util.ValidatorUtil;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class MobileValidator implements ConstraintValidator<IsMobile, String> {

    @Override
    public void initialize(IsMobile isMobile) { }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (StrUtil.isBlank(s)) {
            return false;
        } else {
            return ValidatorUtil.isMobile(s);
        }
    }

}

```



### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%A1%E9%AA%8C)�Զ���У��

����ͨ��ʵ�� `org.springframework.validation.Validator` �ӿ����Զ���У�顣

������Ҫ��

*   ʵ�� `supports` ����
*   ʵ�� `validate` ����
    *   ͨ�� `Errors` �����ռ�����
        *   `ObjectError`������Bean������
        *   `FieldError`������Bean�����ԣ�Property������
    *   ͨ�� `ObjectError` �� `FieldError` ���� `MessageSource` ʵ�ֻ�ȡ���յĴ����İ�



```
package io.github.dunwu.spring.core.validation;

import io.github.dunwu.spring.core.validation.annotation.Valid;
import io.github.dunwu.spring.core.validation.config.CustomValidatorConfig;
import io.github.dunwu.spring.core.validation.entity.Person;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class CustomValidator implements Validator {

    private final CustomValidatorConfig validatorConfig;

    public CustomValidator(CustomValidatorConfig validatorConfig) {
        this.validatorConfig = validatorConfig;
    }

    /**
     * ��У����ֻ��� Person �������У��
     */
    @Override
    public boolean supports(Class<?> clazz) {
        return Person.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ValidationUtils.rejectIfEmpty(errors, "name", "name.empty");

        List<Field> fields = getFields(target.getClass());
        for (Field field : fields) {
            Annotation[] annotations = field.getAnnotations();
            for (Annotation annotation : annotations) {
                if (annotation.annotationType().getAnnotation(Valid.class) != null) {
                    try {
                        ValidatorRule validatorRule = validatorConfig.findRule(annotation);
                        if (validatorRule != null) {
                            validatorRule.valid(annotation, target, field, errors);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    private List<Field> getFields(Class<?> clazz) {
        // ����Field����
        List<Field> fields = new ArrayList<>();
        // ���class���Ͳ�Ϊ��
        while (clazz != null) {
            // ������Ե���������
            Collections.addAll(fields, clazz.getDeclaredFields());
            clazz = clazz.getSuperclass();
        }
        return fields;
    }

}

```



### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%BF%AB%E9%80%9F%E5%A4%B1%E8%B4%A5-fail-fast)����ʧ��(Fail Fast)

Spring Validation Ĭ�ϻ�У���������ֶΣ�Ȼ����׳��쳣������ͨ��һЩ�򵥵����ã����� Fali Fast ģʽ��һ��У��ʧ�ܾ��������ء�



```
@Bean
public Validator validator() {
    ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
            .configure()
            // ����ʧ��ģʽ
            .failFast(true)
            .buildValidatorFactory();
    return validatorFactory.getValidator();
}

```



## [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#spring-%E6%A0%A1%E9%AA%8C%E5%8E%9F%E7%90%86)Spring У��ԭ��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#spring-%E6%A0%A1%E9%AA%8C%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF)Spring У��ʹ�ó���

*   Spring ����У�飨Validator��
*   Spring ���ݰ󶨣�DataBinder��
*   Spring Web �����󶨣�WebDataBinder��
*   Spring WebMVC/WebFlux ����������У��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#validator-%E6%8E%A5%E5%8F%A3%E8%AE%BE%E8%AE%A1)Validator �ӿ����

*   �ӿ�ְ��
    *   Spring �ڲ�У�����ӿڣ�ͨ����̵ķ�ʽУ��Ŀ�����
*   ���ķ���
    *   `supports(Class)`��У��Ŀ�����ܷ�У��
    *   `validate(Object,Errors)`��У��Ŀ����󣬲���У��ʧ�ܵ���������� Errors ����
*   �������
    *   �����ռ�����`org.springframework.validation.Errors`
    *   Validator �����ࣺ`org.springframework.validation.ValidationUtils`

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#errors-%E6%8E%A5%E5%8F%A3%E8%AE%BE%E8%AE%A1)Errors �ӿ����

*   �ӿ�ְ��
    *   ���ݰ󶨺�У������ռ��ӿڣ��� Java Bean ����������ǿ������
*   ���ķ���
    *   `reject` ���������أ����ռ������İ�
    *   `rejectValue` ���������أ����ռ������ֶ��еĴ����İ�
*   �������
    *   Java Bean ����������`org.springframework.validation.ObjectError`
    *   Java Bean ���Դ���������`org.springframework.validation.FieldError`

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#errors-%E6%96%87%E6%A1%88%E6%9D%A5%E6%BA%90)Errors �İ���Դ

Errors �İ����ɲ���

*   ѡ�� Errors ʵ�֣��磺`org.springframework.validation.BeanPropertyBindingResult`��
*   ���� reject �� rejectValue ����
*   ��ȡ Errors ������ ObjectError �� FieldError
*   �� ObjectError �� FieldError �е� code �� args������ MessageSource ʵ�֣��磺`ResourceBundleMessageSource`��

### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#spring-web-%E6%A0%A1%E9%AA%8C%E5%8E%9F%E7%90%86)spring web У��ԭ��

#### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#requestbody-%E5%8F%82%E6%95%B0%E6%A0%A1%E9%AA%8C%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)RequestBody ����У��ʵ��ԭ��

�� spring-mvc �У�`RequestResponseBodyMethodProcessor` �����ڽ��� `@RequestBody` ��ע�Ĳ����Լ�����`@ResponseBody` ��ע�����ķ���ֵ�ġ����У�ִ�в���У����߼��϶����ڽ��������ķ��� `resolveArgument()` �У�



```
@Override
public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
    NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    parameter = parameter.nestedIfOptional();
    Object arg = readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
    String name = Conventions.getVariableNameForParameter(parameter);

    if (binderFactory != null) {
        WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
        if (arg != null) {
            // ���Խ��в���У��
            validateIfApplicable(binder, parameter);
            if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
                // �������У��������׳� MethodArgumentNotValidException
                throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
            }
        }
        if (mavContainer != null) {
            mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
        }
    }

    return adaptArgumentIfNecessary(arg, parameter);
}

```



���Կ�����resolveArgument()������ validateIfApplicable()���в���У�顣



```
protected void validateIfApplicable(WebDataBinder binder, MethodParameter parameter) {
    // ��ȡ����ע�⣬�� @RequestBody��@Valid��@Validated
    Annotation[] annotations = parameter.getParameterAnnotations();
    for (Annotation ann : annotations) {
        // �ȳ��Ի�ȡ @Validated ע��
        Validated validatedAnn = AnnotationUtils.getAnnotation(ann, Validated.class);
        // �����ע�� @Validated��ֱ�ӿ�ʼУ�顣
        // ���û�У���ô�жϲ���ǰ�Ƿ��� Valid ��ͷ��ע�⡣
        if (validatedAnn != null || ann.annotationType().getSimpleName().startsWith("Valid")) {
            Object hints = (validatedAnn != null ? validatedAnn.value() : AnnotationUtils.getValue(ann));
            Object[] validationHints = (hints instanceof Object[] ? (Object[]) hints : new Object[] {hints});
            // ִ��У��
            binder.validate(validationHints);
            break;
        }
    }
}

```



���ϴ��룬�ͽ����� Spring Ϊʲô��ͬʱ֧�� `@Validated`��`@Valid` ����ע�⡣

����������һ�� WebDataBinder.validate() ��ʵ�֣�



```
@Override
public void validate(Object target, Errors errors, Object... validationHints) {
    if (this.targetValidator != null) {
        processConstraintViolations(
            // �˴����� Hibernate Validator ִ��������У��
            this.targetValidator.validate(target, asValidationGroups(validationHints)), errors);
    }
}

```



ͨ��������룬���Կ��� Spring У��ʵ�����ǻ��� Hibernate Validator �ķ�װ��

#### [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E6%96%B9%E6%B3%95%E7%BA%A7%E5%88%AB%E7%9A%84%E5%8F%82%E6%95%B0%E6%A0%A1%E9%AA%8C%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86)��������Ĳ���У��ʵ��ԭ��

Spring ֧�ָ��ݷ���ȥ�������ء�У�飬ԭ�������Ӧ���� AOP ������������˵����ͨ�� `MethodValidationPostProcessor` ��̬ע�� AOP ���棬Ȼ��ʹ�� `MethodValidationInterceptor` ���е㷽��֯����ǿ��



```
public class MethodValidationPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessorimplements InitializingBean {
    @Override
    public void afterPropertiesSet() {
        // Ϊ���� @Validated ��ע�� Bean ��������
        Pointcut pointcut = new AnnotationMatchingPointcut(this.validatedAnnotationType, true);
        // ���� Advisor ������ǿ
        this.advisor = new DefaultPointcutAdvisor(pointcut, createMethodValidationAdvice(this.validator));
    }

    // ���� Advice�����ʾ���һ������������
    protected Advice createMethodValidationAdvice(@Nullable Validator validator) {
        return (validator != null ? new MethodValidationInterceptor(validator) : new MethodValidationInterceptor());
    }
}

```



���ſ�һ�� `MethodValidationInterceptor`��



```
public class MethodValidationInterceptor implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        // ������ǿ�ķ�����ֱ������
        if (isFactoryBeanMetadataMethod(invocation.getMethod())) {
            return invocation.proceed();
        }
        // ��ȡ������Ϣ
        Class<?>[] groups = determineValidationGroups(invocation);
        ExecutableValidator execVal = this.validator.forExecutables();
        Method methodToValidate = invocation.getMethod();
        Set<ConstraintViolation<Object>> result;
        try {
            // �������У�飬���ջ���ί�и� Hibernate Validator ��У��
            result = execVal.validateParameters(
                invocation.getThis(), methodToValidate, invocation.getArguments(), groups);
        }
        catch (IllegalArgumentException ex) {
            ...
        }
        // ���쳣ֱ���׳�
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        // �����ķ�������
        Object returnValue = invocation.proceed();
        // �Է���ֵ��У�飬���ջ���ί�и�Hibernate Validator��У��
        result = execVal.validateReturnValue(invocation.getThis(), methodToValidate, returnValue, groups);
        // ���쳣ֱ���׳�
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        return returnValue;
    }
}

```



ʵ���ϣ������� requestBody ����У�黹�Ƿ��������У�飬���ն��ǵ��� Hibernate Validator ִ��У�飬Spring Validation ֻ������һ���װ��

## [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E9%97%AE%E9%A2%98)����

**Spring ����ЩУ��������**��

*   ��������`org.springframework.validation.Validator`
*   �����ռ�����`org.springframework.validation.Errors`
*   Java Bean ����������`org.springframework.validation.ObjectError`
*   Java Bean ���Դ���������`org.springframework.validation.FieldError`
*   Bean Validation ���䣺`org.springframework.validation.beanvalidation.LocalValidatorFactoryBean`

## [#](https://dunwu.github.io/spring-tutorial/pages/fe6aad/#%E5%8F%82%E8%80%83%E8%B5%84%E6%96%99)�ο�����

*   [Spring �ٷ��ĵ�֮ Core Technologies(opens new window)](https://docs.spring.io/spring-framework/docs/current/spring-framework-reference/core.html#beans)
*   [��С��署 Spring ���ı��˼�롷(opens new window)](https://time.geekbang.org/course/intro/265)
*   https://juejin.cn/post/6856541106626363399


# �ο�����
https://www.w3cschool.cn/wkspring
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring
https://dunwu.github.io/spring-tutorial
https://mszlu.com/java/spring
http://c.biancheng.net/spring/aop-module.html
#### ���ʻ�

* * *

�ڿ���Ӧ�ó����ʱ�򣬾���������֧�ֶ����Ե���������֧�ֶ����ԵĹ��ܳ�֮Ϊ���ʻ���Ӣ����internationalization����дΪi18n����Ϊ����ĸi��ĩ��ĸn�м���18����ĸ����

��������ض������ı��ػ����ܣ�Ӣ����localization����дΪL10n�����ػ���ָ���ݵ��������������������ڵ���ʾ�ȡ�

Ҳ�а��������ߺϳ�Ϊȫ�򻯣�Ӣ����globalization����дΪg11n��

��Java�У�֧�ֶ����Ժͱ��ػ���ͨ��`MessageFormat`���`Locale`ʵ�ֵģ�


����WebӦ�ó���Ҫʵ�ֹ��ʻ����ܣ���Ҫ����ȾView��ʱ��Ҫ�Ѹ������Ե���Դ�ļ����������������ͬ���û�����ͬһ��ҳ��ʱ����ʾ�����Ծ��ǲ�ͬ�ġ�

������������Spring MVCӦ�ó��������ʵ�ֹ��ʻ���

### ��ȡLocale

ʵ�ֹ��ʻ��ĵ�һ���ǻ�ȡ���û���`Locale`����WebӦ�ó����У�HTTP�淶�涨�����������������Я��`Accept-Language`ͷ������ָʾ�û�������趨������˳���磺

```  
Accept-Language: zh-CN,zh;q=0.8,en;q=0.2  
  
```

����HTTP����ͷ��ʾ����ѡ��������ģ����ѡ�����ģ����ѡ��Ӣ�ġ�`q`��ʾȨ�أ����������ǿɻ��һ���������ȼ�����������б�����ת��ΪJava��`Locale`����������û���`Locale`����������ͨ��ֻ����Ȩ����ߵ�`Locale`��

Spring MVCͨ��`LocaleResolver`���Զ���`HttpServletRequest`�л�ȡ`Locale`���ж���`LocaleResolver`��ʵ���࣬������õ���`CookieLocaleResolver`��

```  
@Primary  
@Bean  
LocaleResolver createLocaleResolver() {  
    var clr = new CookieLocaleResolver();    clr.setDefaultLocale(Locale.ENGLISH);    clr.setDefaultTimeZone(TimeZone.getDefault());    return clr;}  
  
```

`CookieLocaleResolver`��`HttpServletRequest`�л�ȡ`Locale`ʱ�����ȸ���һ���ض���Cookie�ж��Ƿ�ָ����`Locale`�����û�У��ʹ�HTTPͷ��ȡ�������û�У��ͷ���Ĭ�ϵ�`Locale`��

���û���һ�η�����վʱ��`CookieLocaleResolver`ֻ�ܴ�HTTPͷ��ȡ`Locale`����ʹ���������Ĭ�����ԡ�ͨ����վҲ�����û��Լ�ѡ�����ԣ���ʱ��`CookieLocaleResolver`�ͻ���û�ѡ������Դ�ŵ�Cookie�У���һ�η���ʱ���ͻ᷵���û��ϴ�ѡ������Զ����������Ĭ�����ԡ�

### ��ȡ��Դ�ļ�

�ڶ����ǰ�д����ģ���е��ַ�������Դ�ļ��ķ�ʽ�洢���ⲿ�����ڶ����ԣ����ļ����������Ϊ`messages`����ô��Դ�ļ����밴���·�ʽ����������classpath�У�

*   Ĭ�����ԣ��ļ�������Ϊ`messages.properties`��
*   �������ģ�Locale��`zh_CN`���ļ�������Ϊ`messages_zh_CN.properties`��
*   ���ģ�Locale��`ja_JP`���ļ�������Ϊ`messages_ja_JP.properties`��
*   �����������ԡ���

ÿ����Դ�ļ�������ͬ��key�����磬Ĭ��������Ӣ�ģ��ļ�`messages.properties`�������£�

```  
language.select=Language  
home=Home  
signin=Sign In  
copyright=Copyright?{0,number,#}  
  
```

�ļ�`messages_zh_CN.properties`�������£�

```  
language.select=����  
home=��ҳ  
signin=��¼  
copyright=��Ȩ����?{0,number,#}  
  
```

### ����MessageSource

�������Ǵ���һ��Spring�ṩ��`MessageSource`ʵ�������Զ���ȡ���е�`.properties`�ļ������ṩһ��ͳһ�ӿ���ʵ�֡����롱��

```  
// code, arguments, locale:  
String text = messageSource.getMessage("signin", null, locale);  
  
```

���У�`signin`��������`.properties`�ļ��ж����key���ڶ���������`Object[]`������Ϊ��ʽ��ʱ����Ĳ��������һ���������ǻ�ȡ���û�`Locale`ʵ����

����`MessageSource`���£�

```  
@Bean("i18n")  
MessageSource createMessageSource() {  
    var messageSource = new ResourceBundleMessageSource();    // ָ���ļ���UTF-8����:  
    messageSource.setDefaultEncoding("UTF-8");    // ָ�����ļ���:  
    messageSource.setBasename("messages");    return messageSource;}  
  
```

ע�⵽`ResourceBundleMessageSource`���Զ��������ļ����Զ�������������Ե���Դ�ļ�����������

��ע�⵽Spring�����ᴴ����ֻһ��`MessageSource`ʵ���������Լ����������`MessageSource`��ר�Ÿ�ҳ����ʻ�ʹ�õģ��������Ϊ`i18n`������������`MessageSource`ʵ����ͻ��

### ʵ�ֶ�����

Ҫ��View��ʹ��`MessageSource`����`Locale`��������ԣ�����ͨ����дһ��`MvcInterceptor`���������Դע�뵽`ModelAndView`�У�

```  
@Component  
public class MvcInterceptor implements HandlerInterceptor {  
    @Autowired    LocaleResolver localeResolver;  
    // ע��ע���MessageSource������i18n:  
    @Autowired    @Qualifier("i18n")    MessageSource messageSource;  
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {        if (modelAndView != null) {            // �����û���Locale:  
            Locale locale = localeResolver.resolveLocale(request);            // ����Model:  
            modelAndView.addObject("__messageSource__", messageSource);            modelAndView.addObject("__locale__", locale);        }    }}  
  
```

��Ҫ������`WebMvcConfigurer`��ע��`MvcInterceptor`�����ڣ��Ϳ�����View�е���`MessageSource.getMessage()`������ʵ�ֶ����ԣ�

```  
{{ __messageSource__.getMessage('signin', null, __locale__) }}  
  
```

��������д����Ȼ���У�����ʽ̫�����ˡ�ʹ��Viewʱ��Ҫ����ÿ���ض���View���涨�ƹ��ʻ���������Pebble�У����ǿ��Է�װһ�����ʻ����������ƾ����»���`_`������һ�´���`ViewResolver`�Ĵ��룺

```  
@Bean  
ViewResolver createViewResolver(@Autowired ServletContext servletContext, @Autowired @Qualifier("i18n") MessageSource messageSource) {  
    var engine = new PebbleEngine.Builder()            .autoEscaping(true)            .cacheActive(false)            .loader(new Servlet5Loader(servletContext))            // �����չ:  
            .extension(createExtension(messageSource))            .build();    var viewResolver = new PebbleViewResolver();    viewResolver.setPrefix("/WEB-INF/templates/");    viewResolver.setSuffix("");    viewResolver.setPebbleEngine(engine);    return viewResolver;}  
  
private Extension createExtension(MessageSource messageSource) {  
    return new AbstractExtension() {        @Override        public Map<String, Function> getFunctions() {            return Map.of("_", new Function() {                public Object execute(Map<String, Object> args, PebbleTemplate self, EvaluationContext context, int lineNumber) {                    String key = (String) args.get("0");                    List<Object> arguments = this.extractArguments(args);                    Locale locale = (Locale) context.getVariable("__locale__");                    return messageSource.getMessage(key, arguments.toArray(), "???" + key + "???", locale);                }                private List<Object> extractArguments(Map<String, Object> args) {                    int i = 1;                    List<Object> arguments = new ArrayList<>();                    while (args.containsKey(String.valueOf(i))) {                        Object param = args.get(String.valueOf(i));                        arguments.add(param);                        i++;                    }                    return arguments;                }                public List<String> getArgumentNames() {                    return null;                }            });        }    };}  
  
```

���������ǿ��԰Ѷ�����ҳ���дΪ��

```  
{{ _('signin') }}  
  
```

����Ǵ������Ķ����ԣ���Ҫ�Ѳ�������ȥ��

```  
<h5>{{ _('copyright', 2020) }}</h5>  
  
```

ʹ������View����ʱ��ҲӦ����������ӿ�ʵ�ָ�������﷨��

### �л�Locale

���������Ҫ�����û��ֶ��л�`Locale`����дһ��`LocaleController`��ʵ�ָù��ܣ�

```  
@Controller  
public class LocaleController {  
    final Logger logger = LoggerFactory.getLogger(getClass());  
    @Autowired    LocaleResolver localeResolver;  
    @GetMapping("/locale/{lo}")    public String setLocale(@PathVariable("lo") String lo, HttpServletRequest request, HttpServletResponse response) {        // ���ݴ����lo����Localeʵ��:  
        Locale locale = null;        int pos = lo.indexOf('_');        if (pos > 0) {            String lang = lo.substring(0, pos);            String country = lo.substring(pos + 1);            locale = new Locale(lang, country);        } else {            locale = new Locale(lo);        }        // �趨��Locale:  
        localeResolver.setLocale(request, response, locale);        logger.info("locale is set to {}.", locale);        // ˢ��ҳ��:  
        String referer = request.getHeader("Referer");        return "redirect:" + (referer == null ? "/" : referer);    }}  
  
```

��ҳ������У�ͨ�������ϽǸ��û��ṩһ������ѡ���б�������Ч����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416194544.png)

�л������ģ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/20230416194602.png)

### С��

������֧����Ҫ��HTTP�����н����û���Locale��Ȼ����Բ�ͬLocale��ʾ��ͬ�����ԣ�

Spring MVCӦ�ó���ͨ��`MessageSource`��`LocaleResolver`�����Viewʵ�ֹ��ʻ���
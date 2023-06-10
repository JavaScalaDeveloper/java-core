![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-3ed1cf4bd6fc2ef3f569376093a6462987d.png)

�� [applicationContext �Ĵ���](https://my.oschina.net/funcy/blog/4608767)�У����Ƿ����� `applicationContext` �Ĵ������̣��ڱ����У����ǽ����� spring ����ν��а�ɨ��ġ�

������ `AnnotationConfigApplicationContext` �Ĺ��췽����

```
public AnnotationConfigApplicationContext(String... basePackages) {
    this();
    //�Դ���İ�����ɨ�裬ɨ����ɺ󣬻�õ�һ�� BeanDefinition �ļ���
    scan(basePackages);
    refresh();
}

```

������ǽ�Ŀ����� `scan(basePackages);` �ϣ�����÷�����

> AnnotationConfigApplicationContext#scan

```
public void scan(String... basePackages) {
     Assert.notEmpty(basePackages, "At least one base package must be specified");
     // �����scanner���������this()�д�����
     this.scanner.scan(basePackages);
}

```

��������ؼ������� `this.scanner.scan(basePackages);`����� `scanner` ������ `this()` �д����Ķ���

```
public AnnotationConfigApplicationContext() {
    this.reader = new AnnotatedBeanDefinitionReader(this);
    // scanner ���������ﴴ����
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}

```

����׷�٣��������ǶԲ���Ҫ�ķ������������������ص��עɨ����Ĺ��̣�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AnnotationConfigApplicationContext#scan
  |-ClassPathBeanDefinitionScanner#scan
   |-ClassPathBeanDefinitionScanner#doScan

```

`ClassPathBeanDefinitionScanner#doScan` �������£�

```
protected Set<BeanDefinitionHolder> doScan(String... basePackages) {
    Assert.notEmpty(basePackages, "At least one base package must be specified");
    Set<BeanDefinitionHolder> beanDefinitions = new LinkedHashSet<>();
    //������Ҫɨ��İ�·��
    for (String basePackage : basePackages) {
        //��ȡ���з���������BeanDefinition
        Set<BeanDefinition> candidates = findCandidateComponents(basePackage);
        for (BeanDefinition candidate : candidates) {
            //��BeanDefinition��Scope
            ScopeMetadata scopeMetadata = this.scopeMetadataResolver.resolveScopeMetadata(candidate);
            candidate.setScope(scopeMetadata.getScopeName());
            //�鿴�Ƿ��������Ƿ�ָ��bean�����ƣ���ûָ����ʹ����������ĸСд
            String beanName = this.beanNameGenerator.generateBeanName(candidate, this.registry);
            //��������if�Ǵ���lazy��Autowire��DependencyOn��initMethod��enforceInitMethod��destroyMethod��
            // enforceDestroyMethod��Primary��Role��Description��Щ�߼���
            if (candidate instanceof AbstractBeanDefinition) {
                postProcessBeanDefinition((AbstractBeanDefinition) candidate, beanName);
            }
            if (candidate instanceof AnnotatedBeanDefinition) {
                AnnotationConfigUtils.processCommonDefinitionAnnotations(
                        (AnnotatedBeanDefinition) candidate);
            }
            //���bean�Ƿ����
            if (checkCandidate(beanName, candidate)) {
                //�ְ�װ��һ��
                BeanDefinitionHolder definitionHolder = new BeanDefinitionHolder(candidate, beanName);
                //���scope�Ƿ񴴽�����δ��������д���
                definitionHolder = AnnotationConfigUtils.applyScopedProxyMode(
                        scopeMetadata, definitionHolder, this.registry);
                beanDefinitions.add(definitionHolder);
                //ע�� beanDefinition
                registerBeanDefinition(definitionHolder, this.registry);
            }
        }
    }
    return beanDefinitions;
}

```

��δ�����ɵĹ��ܺ����ˣ��������������¼����£�

1.  ���ݰ�·�����õ����������� BeanDefinition
2.  ���� BeanDefinition����һ���ḻ beanDefinition ��Ϣ
3.  �� BeanDefinition ��ӵ� beanFactory

> BeanDefinition Ҳ�� spring ����Ҫ���֮һ������ BeanDefinition �ķ������ɲο� [spring ���֮ BeanDefinition](https://my.oschina.net/funcy/blog/4597536 "spring���֮BeanDefinition")��

������������Ҫ�����������Ĳ�����

### 1\. ���ݰ�·���õ� BeanDefinition

��һ����Ҫ������ `Set<BeanDefinition> candidates = findCandidateComponents(basePackage);`�����Ǹ���ȥ���������ִ�У��������ɶԲ���Ҫ����������������÷����ĵ������£�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AnnotationConfigApplicationContext#scan
  |-ClassPathBeanDefinitionScanner#scan
   |-ClassPathBeanDefinitionScanner#doScan
    |-ClassPathScanningCandidateComponentProvider#findCandidateComponents
     |-ClassPathScanningCandidateComponentProvider#scanCandidateComponents

```

���յ��õ��� `ClassPathScanningCandidateComponentProvider#scanCandidateComponents`���������� (��ɾ��)��

```
private Set<BeanDefinition> scanCandidateComponents(String basePackage) {
    Set<BeanDefinition> candidates = new LinkedHashSet<>();
    //��װɨ��·������װ��ɺ������ָ�ʽ��classpath*:org/springframework/learn/demo01/**/*.class��
    String packageSearchPath = ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
            resolveBasePackage(basePackage) + '/' + this.resourcePattern;
    //����·����ȡ��Դ���󣬼�ɨ�����·���µĵ�����class�ļ����õ� Resource
    Resource[] resources = getResourcePatternResolver().getResources(packageSearchPath);
    for (Resource resource : resources) {
        if (resource.isReadable()) {
            //������Դ�����ȡ��Դ�����MetadataReader
            MetadataReader metadataReader = getMetadataReaderFactory().getMetadataReader(resource);
            // �������������£�
            // 1\. �Ƿ���Ҫ��ʼ��Ϊspring bean�����Ƿ��� @Component��@Service��ע��
            // 2\. �鿴�������Ƿ���@Conditionalһϵ�е�ע�⣬Ȼ���Ƿ�����ע��Bean������
            if (isCandidateComponent(metadataReader)) {
                ScannedGenericBeanDefinition sbd = new ScannedGenericBeanDefinition(metadataReader);
                sbd.setResource(resource);
                sbd.setSource(resource);
                if (isCandidateComponent(sbd)) {
                    candidates.add(sbd);
                }
            }
        }
    }
    return candidates;
}

```

���Կ��������ϴ������������£�

1.  ���ݴ���� basePackage �õ�ɨ��·��
2.  ����ɨ��·���õ���·���µ����� class �ļ���Ӧ�� Resource
3.  �� Resource ת��Ϊ beanDefinition

���������Ǿ����ϴ�����з�����

#### 1.1 ���� basePackage �õ���ɨ��·��

��һ��ûɶ�÷���������һ���ַ�����ƴ�����滻��������� `org.springframework.learn.demo01` ת��Ϊ `classpath*:org/springframework/learn/demo01/**/*.class`����ش����һ�У�

```
String packageSearchPath = ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
        resolveBasePackage(basePackage) + '/' + this.resourcePattern;

```

#### 1.2 ɨ���·��

�õ���ɨ��·���󣬽��������ǽ���ɨ���ˡ�spring ��ɨ��ʱ�����ɨ��·���µ����� class �ļ�ɨ�������Ȼ���װ�� `Resource`����������

```
Resource[] resources = getResourcePatternResolver().getResources(packageSearchPath);

```

�������룬ͬ���أ����ǶԲ���Ҫ�ķ���������ֻ�����������ã�

```
AnnotationConfigApplicationContext#AnnotationConfigApplicationContext(String...)
 |-AnnotationConfigApplicationContext#scan
  |-ClassPathBeanDefinitionScanner#scan
   |-ClassPathBeanDefinitionScanner#doScan
    |-ClassPathScanningCandidateComponentProvider#findCandidateComponents
     |-ClassPathScanningCandidateComponentProvider#scanCandidateComponents
      |- GenericApplicationContext#getResources
       |-AbstractApplicationContext#getResources
        |-PathMatchingResourcePatternResolver#getResources
         |-PathMatchingResourcePatternResolver#findPathMatchingResources

```

���ǽ�����ۼ��� `PathMatchingResourcePatternResolver#findPathMatchingResources`:

```
protected Resource[] findPathMatchingResources(String locationPattern) throws IOException {
    // ����� locationPattern �� classpath*:org/springframework/learn/demo01/**/*.class
    // rootDirPath �� classpath*:org/springframework/learn/demo01/
    String rootDirPath = determineRootDir(locationPattern);

    // subPattern �� **/*.class
    String subPattern = locationPattern.substring(rootDirPath.length());

    // ���ﷵ�ص� Resource �� rootDirPath �ľ���·��(��url��ʾ)
    // URL [file:/xxx/spring-learn/build/classes/java/main/org/springframework/learn/demo01/]
    Resource[] rootDirResources = getResources(rootDirPath);

    Set<Resource> result = new LinkedHashSet<>(16);
    for (Resource rootDirResource : rootDirResources) {
        rootDirResource = resolveRootDirResource(rootDirResource);
        URL rootDirUrl = rootDirResource.getURL();
        if (equinoxResolveMethod != null && rootDirUrl.getProtocol().startsWith("bundle")) {
            URL resolvedUrl = (URL) ReflectionUtils.invokeMethod(equinoxResolveMethod, null, rootDirUrl);
            if (resolvedUrl != null) {
                rootDirUrl = resolvedUrl;
            }
            rootDirResource = new UrlResource(rootDirUrl);
        }
        // ���� vfs ��Դ����
        if (rootDirUrl.getProtocol().startsWith(ResourceUtils.URL_PROTOCOL_VFS)) {
            result.addAll(VfsResourceMatchingDelegate
                    .findMatchingResources(rootDirUrl, subPattern, getPathMatcher()));
        }
        // ����jar���ļ�����
        else if (ResourceUtils.isJarURL(rootDirUrl) || isJarResource(rootDirResource)) {
            result.addAll(doFindPathMatchingJarResources(rootDirResource, rootDirUrl, subPattern));
        }
        // �����ļ�·���µ��ļ�����
        else {
            result.addAll(doFindPathMatchingFileResources(rootDirResource, subPattern));
        }
    }
    return result.toArray(new Resource[0]);
}

```

ͨ�����������ָ���Ĵ���������£�

1.  ͨ������� locationPattern �õ��� pattern �µ� url ����·������װΪ Resource
2.  �������ص�·�������� class �ļ�����װΪ Resource

���������� spring ����ν� pattrn ת��Ϊ url ·���ģ����Ǹ������룺

```
|-PathMatchingResourcePatternResolver#getResources
 |-PathMatchingResourcePatternResolver#findAllClassPathResources
  |-PathMatchingResourcePatternResolver#doFindAllClassPathResources

```

���մ��뵽�� `PathMatchingResourcePatternResolver#doFindAllClassPathResources`:

```
protected Set<Resource> doFindAllClassPathResources(String path) throws IOException {
    Set<Resource> result = new LinkedHashSet<>(16);
    ClassLoader cl = getClassLoader();
    // path��Ӧ��url
    Enumeration<URL> resourceUrls = (cl != null ? cl.getResources(path) : 
            ClassLoader.getSystemResources(path));
    while (resourceUrls.hasMoreElements()) {
        URL url = resourceUrls.nextElement();
        // ��urlת��ΪResource������ӵ������
        result.add(convertClassLoaderURL(url));
    }
    if ("".equals(path)) {
        addAllClassLoaderJarRoots(cl, result);
    }
    return result;
}

// ��urlת��ΪResource
protected Resource convertClassLoaderURL(URL url) {
    return new UrlResource(url);
}

```

��ʱ����� `path` Ϊ `org/springframework/learn/demo01/`���Ӵ����֪�����յ����� java �� `ClassLoader` ��������ȡ path ��Ӧ�� url��Ȼ�� url ת��Ϊ `Resource` ��ӵ�������в����ء�

�õ���ľ���·��֮�󣬽��¾��Ƕ�·�����б������õ� class �ļ��ˡ��������ٻص� `PathMatchingResourcePatternResolver#findPathMatchingResources`��spring ɨ��ʱ������ݴ���� url ���ͣ���ɨ�� 3 ���ط���

1.  vfs
2.  jar ��
3.  �ļ�·��

`vfs` ע����˵�� "URL protocol for a general JBoss VFS resource"����ͨ�� JBoss VFS ��Դ�� URL Э�飬���ﲻ��������Ŀ�������� jar ������Ҫɨ�� jar �е�·�����ͻ�ʹ�� jar ��ɨ�跽ʽ���� class �ļ����ң����ڵ���ʱ��`demo01` ��ʹ���ļ���ʽɨ��ģ�������ص�����ļ�ɨ�跽ʽ������ jar �����ɨ��ģ�����Ȥ��С���������о��¡�

���Ǹ��� `findPathMatchingResources` ������

```
|-PathMatchingResourcePatternResolver#findPathMatchingResources
 |-PathMatchingResourcePatternResolver#doFindPathMatchingFileResources
  |-PathMatchingResourcePatternResolver#doFindMatchingFileSystemResources

```

```
protected Set<Resource> doFindMatchingFileSystemResources(File rootDir, 
            String subPattern) throws IOException {
    // ��������ļ�����
    Set<File> matchingFiles = retrieveMatchingFiles(rootDir, subPattern);
    Set<Resource> result = new LinkedHashSet<>(matchingFiles.size());
    for (File file : matchingFiles) {
        result.add(new FileSystemResource(file));
    }
    return result;
}

```

�� `PathMatchingResourcePatternResolver#doFindMatchingFileSystemResources` �У�spring ��ɨ�赽�� File ת��Ϊ `FileSystemResource` ���棬�������������ĵڶ��� `Resource` ������ (ǰ��Ϊ `UrlResource`������Ϊ `FileSystemResource`).

���������ص��ע `Set<File> matchingFiles = retrieveMatchingFiles(rootDir, subPattern);`������ spring ���������ļ����ҵģ�

```
|-PathMatchingResourcePatternResolver#findPathMatchingResources
 |-PathMatchingResourcePatternResolver#doFindPathMatchingFileResources
  |-PathMatchingResourcePatternResolver#doFindMatchingFileSystemResources
   |-PathMatchingResourcePatternResolver#retrieveMatchingFiles
    |-PathMatchingResourcePatternResolver#doRetrieveMatchingFiles

```

```
protected void doRetrieveMatchingFiles(String fullPattern, File dir, Set<File> result) 
        throws IOException {
    for (File content : listDirectory(dir)) {
        String currPath = StringUtils.replace(content.getAbsolutePath(), File.separator, "/");
        if (content.isDirectory() && getPathMatcher().matchStart(fullPattern, currPath + "/")) {
            if (!content.canRead()) {
            }
            else {
                // ������ļ��У��ݹ����
                doRetrieveMatchingFiles(fullPattern, content, result);
            }
        }
        // ������ļ����ļ�·��
        if (getPathMatcher().match(fullPattern, currPath)) {
            result.add(content);
        }
    }
}

```

���ϴ���Ƚϼ򵥣�������ƽ�������ļ��ķ�ʽ��һ���ġ�

ֵ��һ����ǣ�`getPathMatcher().match(fullPattern, currPath)` ���յ��õ����� `AntPathMatcher#doMatch`������һ�� ant ����·��ƥ����֤����·���д��� `*`���紫��� pattern �� `/xxx/spring-framework/spring-learn/build/classes/java/main/org/springframework/learn/demo01/**/*.class`����ʾƥ�� `/xxx/spring-framework/spring-learn/build/classes/java/main/org/springframework/learn/demo01/` �������ļ�����������`.class` �ļ���β���ļ�����ǰ����� path �� `/xxx/spring-framework/spring-learn/build/classes/java/main/org/springframework/learn/demo01/BeanObj2.class`����Ȼƥ�䡣���� `AntPathMatcher#doMatch` ��������ν���ƥ��ģ�����Ͳ�����չ���ˡ�

���������ϲ��裬�������ڵõ��� class �ļ���Ӧ�� Resource ��.

#### 1.3 �� Resource ת��Ϊ BeanDefinition

�� Resource ת��Ϊ BeanDefinition��������

> ClassPathScanningCandidateComponentProvider#scanCandidateComponents

```
// �� resource �õ� MetadataReader
MetadataReader metadataReader = getMetadataReaderFactory().getMetadataReader(resource);

// �������������£�
// 1\. �Ƿ���Ҫ��ʼ��Ϊspring bean�����Ƿ��� @Component��@Service��ע��
// 2\. �鿴�������Ƿ���@Conditionalһϵ�е�ע�⣬Ȼ���Ƿ�����ע��Bean������
if (isCandidateComponent(metadataReader)) {
    // �� metadataReader ת��Ϊ ScannedGenericBeanDefinition����Ҳ��BeanDefinition�����е�һԱ
    ScannedGenericBeanDefinition sbd = new ScannedGenericBeanDefinition(metadataReader);
    ...
}

```

##### 1\. �� Resource �õ� MetadataReader

����׷���� `MetadataReader` �Ļ�ȡ��

```
|-ClassPathScanningCandidateComponentProvider#scanCandidateComponents
 |-CachingMetadataReaderFactory#getMetadataReader
  |-SimpleMetadataReaderFactory#getMetadataReader(Resource)
   |-SimpleMetadataReader#SimpleMetadataReader

```

�����������е��� `SimpleMetadataReader` �Ĺ��췽��:

```
SimpleMetadataReader(Resource resource, @Nullable ClassLoader classLoader) throws IOException {
    SimpleAnnotationMetadataReadingVisitor visitor 
        = new SimpleAnnotationMetadataReadingVisitor(classLoader);
    // ���﷢����class�ļ��Ķ�ȡ�����
    getClassReader(resource).accept(visitor, PARSING_OPTIONS);
    this.resource = resource;
    this.annotationMetadata = visitor.getMetadata();
}

```

�ٽ�һ��׷�٣����� class �ļ��Ķ�ȡ����������� `ClassReader` �ࣺ

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-595687d3a766ffaacf69f31216a5b09f9d5.png)

�����ʹ�� asm ����ȡ class �ļ�������Ƚϸ��ӣ��Ͳ���ˡ�

һֱ�������Ҷ���Ϊ spring ��ͨ����������ȡ����Ϣ�ģ��������֪����**ԭ�� spring ��ͨ�� asm ֱ�Ӷ�ȡ class �ļ�����ȡ�����Ϣ��** ��

������������µõ��� `MetadataReader` �Ľ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-9df07587a3a8191231da87fe21d80052357.png)

�����ص��ע `annotations` ���ԣ�������һ�� `annotations` �� `mappings`��`annotations` ����Ϊ `@Service`��`mappings` ��һ�����飬����Ϊ

```
0-@Service
1-@Component
2-@Index

```

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f5c7e8768b92b7a4303c4e1beb58863fe03.png)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-38b493e0b4b7b73dda5f06f371b66f16d3e.png)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-930a4e6844efd3f9f52c6d3f4e13a200337.png)

`annotations` ���˲²��� `BeanObj1` �ϵ�ע�⣺

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-77271c438dde39f2bc905aa9f2cf9fb73d8.png)

���� `mappings` ��ɶ���Ҳ��ò²⣬����Ҳ���Դ�ע���з���һЩ���ߣ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f31efb6252beb2108dc0ce93d482666f8d0.png)

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-a8ce5d11b4b02907f0ff497c6369a1c1dde.png)

`@Service` ���� `@Component` ע�⣬`@Component` ���� `@Indexed`���������߶��������� `mappings` �У��⿴������ר������������ע��֮�ϵ�ע��ģ�����������ˣ����Ҿ͵������⹦�ܰɣ�**ע�⣺`mappings` ��������ݺ���Ҫ�������������**

##### 2. `isCandidateComponent(MetadataReader)`���ж��Ƿ���Ҫʵ����Ϊ spring bean

����һ���У����ǵõ��� basePackage ��**������**�� `MetadataReader` �����ļ���ע��������**������**������Щ���ǲ��Ƕ�Ҫת�� `spring bean`���йܵ� spring �����أ������ `isCandidateComponent(MetadataReader)` �Ĺ����ˡ��ϻ���˵���ϴ��룺

```
protected boolean isCandidateComponent(MetadataReader metadataReader) throws IOException {
    // ʡ�Բ��ִ���
    for (TypeFilter tf : this.includeFilters) {
        // �����ж��Ƿ���Ҫ�йܵ�spring����
        if (tf.match(metadataReader, getMetadataReaderFactory())) {
            // �ж��Ƿ���@Conditionalһϵ�е�ע��
            return isConditionMatch(metadataReader);
        }
    }
    return false;
}

```

�����Ҫ�����������жϣ�

*   �Ƿ���ҪΪ spring bean
*   �Ƿ��� `@Conditional` ��һϵ�е�ע��

����������������һ���жϡ�

�� spring �У����� spring bean ��ע���кܶ࣬�� `@Component`��`@Repository`��`@Service`��`@Controller`��`@Configuration`�����������Լ�д��ע���ֻ࣬Ҫ���������Щע�⣬��

```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
// ��� @Component �� @Service �� @Repository ������֮һ
@Component
public @interface MySpringBean {
    ...
}

```

���ܱ� spring ʶ������� spring �ṩ��ע�⣨`@Component`��`@Repository` �ȣ������ж��ǲ��� spring bean ʱ��ֻ��Ҫ������

```
if(annotation == Component.class || annotation == Repository.class) {
    ...
}

```

���жϾ����ˡ��������Զ����ע�� `@MySpringBean`��spring ����ô֪������ spring bean �أ������Ƕ��� `@MySpringBean` ʱ��һ��Ҫ��������� `@Component` �� `@Service` �� `@Repository` ������֮һ���ܱ� spring ʶ����������ʲô�����أ����Ǹ������� `AbstractTypeHierarchyTraversingFilter#match(MetadataReader, MetadataReaderFactory)`���������ǶԲ���Ҫ�Ĵ�������ֻ������������

```
|-ClassPathScanningCandidateComponentProvider#isCandidateComponent(MetadataReader)
 |-AbstractTypeHierarchyTraversingFilter#match(MetadataReader, MetadataReaderFactory)
  |-AnnotationTypeFilter#matchSelf

```

�������յ��� `AnnotationTypeFilter#matchSelf`:

```
@Override
protected boolean matchSelf(MetadataReader metadataReader) {
    AnnotationMetadata metadata = metadataReader.getAnnotationMetadata();
    // �����annotationType���� @Component
    return metadata.hasAnnotation(this.annotationType.getName()) ||
        (this.considerMetaAnnotations && metadata.hasMetaAnnotation(this.annotationType.getName()));
}

```

�ؼ��������ˣ�

```
metadata.hasAnnotation(this.annotationType.getName())
��
this.considerMetaAnnotations && metadata.hasMetaAnnotation(this.annotationType.getName())

```

�����ȿ� `metadata.hasAnnotation(this.annotationType.getName())` �ıȽϣ�

```
// AnnotationMetadata#hasAnnotation
default boolean hasAnnotation(String annotationName) {
    return getAnnotations().isDirectlyPresent(annotationName);
}

```

����� `getAnnotations()` �õ��Ľ����

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-3e46b2ece5ddb2328342a469dc7dd554d9e.png)

mappings ���������

```
0-@Service
1-@Component
2-@Index

```

����ʵ��������ǰ��õ��� `MetadataReader` ������ݣ�

��׷����ȥ������ `isDirectlyPresent` �����ж� `annotations` �� `mappings` ����û�г��� `@Component`:

```
private boolean isPresent(Object requiredType, boolean directOnly) {
    // �ж� annotations ����û�г��� @Component
    for (MergedAnnotation<?> annotation : this.annotations) {
        Class<? extends Annotation> type = annotation.getType();
        if (type == requiredType || type.getName().equals(requiredType)) {
            return true;
        }
    }
    if (!directOnly) {
        // �ж� mappings ����û�г��� @Component
        for (AnnotationTypeMappings mappings : this.mappings) {
            for (int i = 1; i < mappings.size(); i++) {
                AnnotationTypeMapping mapping = mappings.get(i);
                if (isMappingForType(mapping, requiredType)) {
                    return true;
                }
            }
        }
    }
    return false;
}

```

�������������� `this.considerMetaAnnotations && metadata.hasMetaAnnotation(this.annotationType.getName())`���鿴���ã�

```
|-AnnotationTypeFilter#matchSelf
 |-AnnotationMetadata#hasMetaAnnotation
  |-MergedAnnotationsCollection#get(String, Predicate)
   |-MergedAnnotationsCollection#get(String, Predicate, MergedAnnotationSelector)
    |-MergedAnnotationsCollection#find

```

���յĲ��ҷ����� `MergedAnnotationsCollection#find`:

```
private <A extends Annotation> MergedAnnotation<A> find(Object requiredType,
        @Nullable Predicate<? super MergedAnnotation<A>> predicate,
        @Nullable MergedAnnotationSelector<A> selector) {

    MergedAnnotation<A> result = null;
    for (int i = 0; i < this.annotations.length; i++) {
        MergedAnnotation<?> root = this.annotations[i];
        AnnotationTypeMappings mappings = this.mappings[i];
        // mappings ���� mappings
        for (int mappingIndex = 0; mappingIndex < mappings.size(); mappingIndex++) {
            AnnotationTypeMapping mapping = mappings.get(mappingIndex);
            if (!isMappingForType(mapping, requiredType)) {
                continue;
            }
            // ����������ҵ��� @Component ע��
            MergedAnnotation<A> candidate = (mappingIndex == 0
                ? (MergedAnnotation<A>) root
                : TypeMappedAnnotation.createIfPossible(mapping, root, IntrospectionFailureLogger.INFO));
            if (candidate != null && (predicate == null || predicate.test(candidate))) {
                if (selector.isBestCandidate(candidate)) {
                    return candidate;
                }
                result = (result != null ? selector.select(result, candidate) : candidate);
            }
        }
    }
    return result;
}

```

���Կ��������ҷ�ʽ������� `metadata.hasAnnotation(this.annotationType.getName())` �߶����ơ�

���Ͼ��� spring �����ж��Ƿ���� `@Service`��`@Component` ��ע����߼��ˡ�

�� `java` �У�ע���ǲ��ܼ̳еģ���

```
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Base {

}

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Child extends  Base {

}

```

�����﷨�� java �в�������ģ�spring ���ǲ��������`ע���ע��`�ķ�ʽ��ʵ���������ڼ̳еĹ��ܡ�

�������������� `ClassPathScanningCandidateComponentProvider#isConditionMatch` ������ʵ���ϣ���������������ж����Ƿ��� `@Conditional` ע��ģ������������ʶ��Ϊ spring bean���������յ��õ��� `ConditionEvaluator#shouldSkip(AnnotatedTypeMetadata, ConfigurationCondition.ConfigurationPhase)`:

```
public boolean shouldSkip(@Nullable AnnotatedTypeMetadata metadata, @Nullable ConfigurationPhase phase) {
    // ʡ����һЩ����

    // �õ� condition ����
    List<Condition> conditions = new ArrayList<>();
        for (String[] conditionClasses : getConditionClasses(metadata)) {
            for (String conditionClass : conditionClasses) {
                Condition condition = getCondition(conditionClass, this.context.getClassLoader());
                conditions.add(condition);
            }
        }
    }

    AnnotationAwareOrderComparator.sort(conditions);
    // �������ж� condition �����Ƿ����
    for (Condition condition : conditions) {
        ConfigurationPhase requiredPhase = null;
        if (condition instanceof ConfigurationCondition) {
            requiredPhase = ((ConfigurationCondition) condition).getConfigurationPhase();
        }
        if ((requiredPhase == null || requiredPhase == phase) 
                // �ж� condition �����Ƿ������һ����������ͷ���true
                && !condition.matches(this.context, metadata)) {
            return true;
        }
    }

    return false;
}

// ͨ�������ȡ Condition ����
private Condition getCondition(String conditionClassName, @Nullable ClassLoader classloader) {
    Class<?> conditionClass = ClassUtils.resolveClassName(conditionClassName, classloader);
    return (Condition) BeanUtils.instantiateClass(conditionClass);
}

```

�������������£�

1.  ��ȡ condition ����
2.  ���� condition ���󣬵��� `condition.matches()` �������ж������Ƿ����

##### 3\. �� `MetadataReader` �õ� `ScannedGenericBeanDefinition`

�����������һ���򵥵ĸ�ֵ������ `ScannedGenericBeanDefinition` �Ĺ��췽���������ˣ�

> ScannedGenericBeanDefinition#ScannedGenericBeanDefinition

```
public ScannedGenericBeanDefinition(MetadataReader metadataReader) {
    Assert.notNull(metadataReader, "MetadataReader must not be null");
    this.metadata = metadataReader.getAnnotationMetadata();
    setBeanClassName(this.metadata.getClassName());
}

```

����Ƚϼ򵥣��Ͳ����������ˡ�

### 2\. �ḻ beanDefinition ��Ϣ

����ǧ�����գ����ڵõ��� `beanDefinition`������ʱ `beanDefinition` �����ḻ�����������ǽ�һ����չ `beanDefinition` ����Ϣ�ˡ���Щ��Ϣ���� `bean������`��`bean��������`��`@Lazy` ע�⡢`@Primary` ע�⡢`@DependsOn` ע��ȣ��������£�

```
public abstract class AnnotationConfigUtils {

    ...

    /**
     * ��һ���ḻ BeanDefinition
     */
    static void processCommonDefinitionAnnotations(AnnotatedBeanDefinition abd, 
            AnnotatedTypeMetadata metadata) {
        // ���� @Lazy
        AnnotationAttributes lazy = attributesFor(metadata, Lazy.class);
        if (lazy != null) {
            abd.setLazyInit(lazy.getBoolean("value"));
        }
        else if (abd.getMetadata() != metadata) {
            lazy = attributesFor(abd.getMetadata(), Lazy.class);
            if (lazy != null) {
                abd.setLazyInit(lazy.getBoolean("value"));
            }
        }
        // ���� @Primary
        if (metadata.isAnnotated(Primary.class.getName())) {
            abd.setPrimary(true);
        }
        // ���� @DependsOn
        AnnotationAttributes dependsOn = attributesFor(metadata, DependsOn.class);
        if (dependsOn != null) {
            abd.setDependsOn(dependsOn.getStringArray("value"));
        }
        // ���� @Role
        AnnotationAttributes role = attributesFor(metadata, Role.class);
        if (role != null) {
            abd.setRole(role.getNumber("value").intValue());
        }
        // ���� @Description
        AnnotationAttributes description = attributesFor(metadata, Description.class);
        if (description != null) {
            abd.setDescription(description.getString("value"));
        }
    }
}

```

### 3.` registerBeanDefinition(definitionHolder, this.registry)`: ��� BeanDefinition �� beanFactory

�� `BeanDefinition` �� `beanFactory` �Ĳ����Ƚϼ򵥣��ؼ��Ĵ������£�

```
|-ClassPathBeanDefinitionScanner#registerBeanDefinition
 |-BeanDefinitionReaderUtils#registerBeanDefinition
  |-GenericApplicationContext#registerBeanDefinition
   |-DefaultListableBeanFactory#registerBeanDefinition

```

> DefaultListableBeanFactory#registerBeanDefinition

```
this.beanDefinitionMap.put(beanName, beanDefinition);

```

�� `ClassPathBeanDefinitionScanner#registerBeanDefinition` �� `DefaultListableBeanFactory#registerBeanDefinition`����������Ȼ������һЩ�������ƣ������ɲ����������ҵ��ؼ��Ĵ��롣

���ˣ������ϵ� class �ļ������� spring ɨ�裬���ڱ���� `BeanDefinition`�������� `BeanFactory` ���ˡ�

### 4\. �ܽ�

���ıȽϳ�����Ҫ������ spring ɨ���·���õ� `beanDefinition` �Ĺ��̣���Ҫ�������£�

1.  ���ݰ����õ�·�� `Resource`��
2.  ����·�� `Resouce` �õ���·�������� class �ļ��� `Resouce`��
3.  ���� class �ļ��� `Resouce` ͨ�� asm �����õ� `MetadataReader`��ע�⣺����� `MetadataReader` �������� class �ļ��� `MetadataReader`��
4.  �� `MetadataReader` ���ҵ���Ҫ spring �йܵ� `MetadataReader`������ת��Ϊ `ScannedGenericBeanDefinition`��`ScannedGenericBeanDefinition` Ϊ `BeanDefinition` �����ࣻ
5.  ��һ���ḻ `ScannedGenericBeanDefinition` ����Ϣ��
6.  ������õ��� `BeanDefinition` ��ӵ� `BeanFactory` ��

���ˣ�����ת��Ϊ `BeanDefinition` ��ɡ�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-f8ff2e4071ba3941e2a0664f6e478b78961.png)

���Ļ�������ֵ��ע��ĵط���

1.  spring �ڻ�ȡ���ϵ�ע��ʱ������ͨ�����䣬����ʹ�� asm ֱ�ӽ��� class �ļ���Ȼ���ٻ�ȡ���ϵ�ע���
2.  �ڴ���ע��ʱ��spring ͨ������ ��ע���ע�⡱ ʵ����һ��������ע��̳еķ�ʽ����Ҳ�� spring ��ʶ�� `@Component`��`@Service` �����ǿ������Զ���ע���ԭ��

�õ��� `BeanDefinition` �󣬽��ž��� spring �����ĳ�ʼ���ˣ�������ƪ�����ټ���

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4614071](https://my.oschina.net/funcy/blog/4614071) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
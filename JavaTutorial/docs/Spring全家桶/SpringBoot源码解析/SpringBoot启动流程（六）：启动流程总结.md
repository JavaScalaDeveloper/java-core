ǰ�漸ƪ���·��� springboot ���������̣��������ܽ��¡�

����һ��ʼ���� `SpringApplication.run(Demo01Application.class, args);` �������֣����ط���������������

*   `SpringApplication#SpringApplication(...)`
*   `SpringApplication#run(...)`

���������������� springboot �������������̣�����������һ�ܽ��� ��

### `SpringApplication#SpringApplication(...)`

����������������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-e9a43f1c523c0f19d37e4741580ed32ca08.png)

���У�

*   `webApplicationType` ���ں����������ʲô���͵� `applicationContext`��
*   `Initialzers` ������ `META-INF/spring.factories`������ springboot ����ʱ��һЩ��ʼ��������
*   `Listteners` ͬ�������� `META-INF/spring.factories`���ṩ�˶�����������Է���ؼ��� springboot ��ִ�й��̡�

### `SpringApplication#run(...)`

�ⲿ�ֵ��������£�

![](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/up-07a6b491fbe69b8dcbd41e59a8543f06671.png)

���У�

*   `getRunListener()` ���ȡ���е� `Listeners`��Ҳ������ `SpringApplication#SpringApplication(...)` �� ��ȡ�� `Listeners`��`Listeners` ���ṩ���ڶ෽�����ɼ��� springboot ���������̣�
*   ׼�����л���ʱ������� `webApplicationType` �����������������ã��õ���Ӧ���͵� `Environment` ������ �������������õ� spring �����У�spring ������ʹ�õ� `Environment` ���������ﴴ�������õģ�
*   ���� ioc ����ʱ��Ҳ�Ǹ��� `webApplicationType` ��������������Ӧ�� `ApplicationContext`��
*   ��׼�� ioc �����ķ����У���� `ApplicationContext` ��һ������ ��`Initializers` Ҳ�����������У�
*   ���� ioc ����ʱ��springboot ��ע��һ�� shutdownhook����������Ŀ�ر�ʱ����رղ��������⣬���� ioc ���������̣�springboot ������չ�лᴴ�������� web ������
*   springboot �ṩ���������͵���������`ApplicationRunner`��`CommandLineRunner`�����������������ߵķ�����

�������ݽ��ıȽϼ��ԣ����Ҫ��ϸ�˽⣬�������Ķ�ǰ������¡�

* * *

_����ԭ�����ӣ�[https://my.oschina.net/funcy/blog/4906588](https://my.oschina.net/funcy/blog/4906588) ���������߸���ˮƽ�����������д���֮������ӭָ����ԭ�����ף���ҵת������ϵ���߻����Ȩ������ҵת����ע��������_
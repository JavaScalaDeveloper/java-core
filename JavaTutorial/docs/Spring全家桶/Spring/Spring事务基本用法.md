# Spring������Ľӿ�

[Spring](http://www.voidme.com/spring) ����������ǻ��� AOP ʵ�ֵģ��� AOP ���Է���Ϊ��λ�ġ�Spring ���������Էֱ�Ϊ������Ϊ�����뼶��ֻ���ͳ�ʱ���ԣ���Щ�����ṩ������Ӧ�õķ������������ԡ�

�� [Java](http://www.voidme.com/java) EE �����������õķֲ�ģʽ�У�Spring ��������λ��ҵ���߼��㣬���ṩ���������Ľ��������

�� Spring ��ѹ���� libs Ŀ¼�У�����һ������Ϊ spring-tx-3.2.13.RELEASE.jar ���ļ������ļ��� Spring �ṩ�������������� JAR �������а������������������Ľӿڣ�PlatformTransactionManager��TransactionDefinition �� TransactionStatus��

���� JAR ���ĺ�׺�� jar �ĳ� zip ����ʽ�󣬽�ѹѹ�����������ѹ�ļ����е� \org\springframework\transaction Ŀ¼�󣬸�Ŀ¼�е��ļ���ͼ 1 ��ʾ��

![���������Ľӿ�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/760_a12_405.png)  
ͼ 1  ���������Ľӿ�

��ͼ 1 �У���������ע�������ļ����Ǳ��ڽ�Ҫ����ĺ��Ľӿڡ����������Ľӿڵ����ü����ṩ�ķ������¡�

#### 1\. PlatformTransactionManager

PlatformTransactionManager �ӿ��� Spring �ṩ��ƽ̨��������������ڹ������񡣸ýӿ����ṩ��������������������������¡�

*   TransactionStatus getTransaction��TransactionDefinition definition�������ڻ�ȡ����״̬��Ϣ��
*   void commit��TransactionStatus status���������ύ����
*   void rollback��TransactionStatus status�������ڻع�����

����Ŀ�У�Spring �� xml �����õ�������ϸ��Ϣ��װ������ TransactionDefinition �У�Ȼ��ͨ������������� getTransaction() ������������״̬��TransactionStatus�����������������һ���Ĳ�����

#### 2\. TransactionDefinition

TransactionDefinition �ӿ��������壨�������Ķ������ṩ�����������Ϣ��ȡ�ķ��������а�������������������¡�

*   String getName()����ȡ����������ơ�
*   int getIsolationLevel()����ȡ����ĸ��뼶��
*   int getPropagationBehavior()����ȡ����Ĵ�����Ϊ��
*   int getTimeout()����ȡ����ĳ�ʱʱ�䡣
*   boolean isReadOnly()����ȡ�����Ƿ�ֻ����

��������������������У�����Ĵ�����Ϊ��ָ��ͬһ�������У���ͬ����ǰ����ʹ�õ����񡣴�����Ϊ��������� 1 ��ʾ��

| �������� | ֵ | ��  �� |  
| --- | --- | --- |  
| PROPAGATION_REQUIRED | required | ֧�ֵ�ǰ������� A �����Ѿ��������У��� B ����ֱ��ʹ�á����򽫴��������� |  
| PROPAGATION_SUPPORTS | supports | ֧�ֵ�ǰ������� A �����Ѿ��������У��� B ����ֱ��ʹ�á������Է�����״ִ̬�� |  
| PROPAGATION_MANDATORY | mandatory | ֧�ֵ�ǰ������� A ����û���������׳��쳣 |  
| PROPAGATION_REQUIRES_NEW | requires_new | �������µ�������� A �����Ѿ��������У��� A ������� |  
| PROPAGATION_NOT_SUPPORTED | not_supported | ��֧�ֵ�ǰ���������Է�����״ִ̬�С���� A �����Ѿ��������У�������� |  
| PROPAGATION_NEVER | never | ��֧�ֵ�ǰ������� A �����������У����׳��쳣 |  
| PROPAGATION.NESTED | nested | Ƕ�����񣬵ײ㽫ʹ�� Savepoint �γ�Ƕ������ |  

�������������У�������Ϊ���Կ����Ƿ���Ҫ���������Լ���δ�������

ͨ������£����ݵĲ�ѯ����ı�ԭ���ݣ����Բ���Ҫ��������������������ݵ����ӡ��޸ĺ�ɾ���Ȳ����������������������û��ָ������Ĵ�����Ϊ���� Spring3 Ĭ�ϵĴ�����Ϊ�� required��

#### 3\. TransactionStatus

TransactionStatus �ӿ��������״̬����������ĳһʱ����������״̬��Ϣ�����а�������������������� 2 ��ʾ��

<caption>�� 2  ����Ĳ���</caption>  
| ���� | ˵�� |  
| --- | --- |  
| void flush() | ˢ������ |  
| boolean hasSavepoint() | ��ȡ�Ƿ���ڱ���� |  
| boolean isCompleted() | ��ȡ�����Ƿ���� |  
| boolean isNewTransaction() | ��ȡ�Ƿ��������� |  
| boolean isRollbackOnly() | ��ȡ�Ƿ�ع� |  
| void setRollbackOnly() | ��������ع� |  

# Spring����ʽ�����������XML��ʽʵ�֣�

[Spring](http://www.voidme.com/spring) ��������������ַ�ʽ��һ���Ǵ�ͳ�ı��ʽ���������ͨ����д����ʵ�ֵ����������һ���ǻ��� AOP ����ʵ�ֵ�����ʽ�������������ʵ�ʿ����У����ʽ����������ʹ�ã���������ֻ�� Spring ������ʽ������������ϸ���⡣

Spring ����ʽ��������ڵײ������ AOP �������������ŵ���������ͨ����̵ķ�ʽ��������ֻ��Ҫ�������ļ��н�����صĹ����������Ϳ��Խ��������Ӧ�õ�ҵ���߼��С�

Spring ʵ������ʽ���������Ҫ�����ַ�ʽ��

*   ���� XML ��ʽ������ʽ�������
*   ͨ�� Annotation ע�ⷽʽ���������

����ͨ������ת�˵İ����������ʹ�� XML �ķ�ʽʵ�� Spring ������ʽ������

#### 1\. ������Ŀ

�� MyEclipse �д���һ����Ϊ springDemo03 �� Web ��Ŀ���� Spring ֧�ֺ������� JAR �����Ƶ� Web ��Ŀ�� lib Ŀ¼�У�����ӵ���·���¡�����ӵ� JAR ����ͼ 1 ��ʾ��

![��Ҫ�����JAR��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/761_732_fcf.png)  
ͼ 1  ��Ҫ�����JAR��

��ͼ 1 �п��Կ������������ӵ����� spring-tx-3.2.13.RELEASE.jar������������Լ� [MySQL](http://www.voidme.com/mysql) ������JDBC �� C3P0 �� JAR ����

#### 2\. �������ݿ⡢���Լ���������

�� MySQL �д���һ����Ϊ spring �����ݿ⣬Ȼ���ڸ����ݿ��д���һ�� account ��������в����������ݣ��� SQL ִ�����������ʾ��

CREATE DATABASE spring;  
USE spring;  
CREATE TABLE account (  
id INT (11) PRIMARY KEY AUTO_INCREMENT,  
username VARCHAR(20) NOT NULL,  
money INT DEFAULT NULL  
);  
INSERT INTO account VALUES (1,'zhangsan',1000);  
INSERT INTO account VALUES (2,'lisi',1000);

ִ�к�� account ���е�������ͼ 2 ��ʾ��

![ִ�н��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/762_276_8a5.PNG)  
ͼ 2  ִ�н��

#### 3\. ���� c3p0-db.properties

����Ŀ�� src �´���һ����Ϊ c3p0-db.properties �������ļ�������ʹ�� C3P0 ����Դ����Ҫ�ڸ��ļ�������������ã�
````  
jdbc.driverClass = com.mysql.jdbc.Driver  
jdbc.jdbcUrl = jdbc:mysql://localhost:3306/spring  
jdbc.user = root  
jdbc.password = root  
````  
#### 4\. ʵ�� DAO

#### 1������ AccountDao �ӿ�

����Ŀ�� src Ŀ¼�´���һ����Ϊ com.mengma.dao �İ����ڸð��´���һ���ӿ� AccountDao�����ڽӿ��д��������տ�ķ�����������ʾ��
````  
package com.mengma.dao;  
public interface AccountDao {  
    // ���  
    public void out(String outUser, int money);  
    // �տ�  
    public void in(String inUser, int money);} ````  
���������У������� out() �� in() �����������ֱ����ڱ�ʾ�����տ  
  
#### 2������DAO��ӿ�ʵ����  
  
����Ŀ�� src Ŀ¼�´���һ����Ϊ com.mengma.dao.impl �İ����ڸð��´���ʵ���� AccountDaoImpl��������ʾ��  
````  
package com.mengma.dao.impl;

import org.springframework.jdbc.core.JdbcTemplate;  
import com.mengma.dao.AccountDao;

public class AccountDaoImpl implements AccountDao {  
private JdbcTemplate jdbcTemplate;  
public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {        this.jdbcTemplate = jdbcTemplate;    }  
// ����ʵ�ַ���  
public void out(String outUser, int money) {        this.jdbcTemplate.update("update account set money =money-?"                + "where username =?", money, outUser);    }  
// �տ��ʵ�ַ���  
public void in(String inUser, int money) {        this.jdbcTemplate.update("update account set money =money+?"                + "where username =?", money, inUser);    }} ````  
���������У�ʹ�� JdbcTemplate ��� update() ����ʵ���˸��²�����

#### 5\. ʵ�� Service

#### 1������ Service ��ӿ�

����Ŀ�� src Ŀ¼�´���һ����Ϊ com.mengma.service �İ����ڸð��´����ӿ� AccountService��������ʾ��
````  
package com.mengma.service;  
  
public interface AccountService {  
    // ת��  
    public void transfer(String outUser, String inUser, int money);} ````  
#### 2������ Service ��ӿ�ʵ����  
  
����Ŀ�� src Ŀ¼�´���һ����Ϊ com.mengma.service.impl �İ����ڸð��´���ʵ���� AccountServiceImpl��������ʾ��  
````  
package com.mengma.service.impl;

import com.mengma.dao.AccountDao;

public class AccountServiceImpl {  
private AccountDao accountDao;  
public void setAccountDao(AccountDao accountDao) {        this.accountDao = accountDao;    }  
public void transfer(String outUser, String inUser, int money) {        this.accountDao.out(outUser, money);        this.accountDao.in(inUser, money);    }} ````  
���������п��Կ���������ʵ���� AccountService �ӿڣ�����ת�˵ķ���������ʵ�֣����ݲ����Ĳ�ͬ���� DAO ����Ӧ�ķ�����

#### 6\. ���� Spring �����ļ�

����Ŀ�� src Ŀ¼�´��� Spirng �����ļ� applicationContext.xml���༭��������ʾ��
````  
 <?xml version="1.0" encoding="UTF-8"?><beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    xmlns:context="http://www.springframework.org/schema/context"    xmlns:tx="http://www.springframework.org/schema/tx"    xmlns:aop="http://www.springframework.org/schema/aop"    xsi:schemaLocation="http://www.springframework.org/schema/beans            http://www.springframework.org/schema/beans/spring-beans-2.5.xsd            http://www.springframework.org/schema/context  
            http://www.springframework.org/schema/context/spring-context.xsd            http://www.springframework.org/schema/tx            http://www.springframework.org/schema/tx/spring-tx-2.5.xsd            http://www.springframework.org/schema/aop            http://www.springframework.org/schema/aop/spring-aop-2.5.xsd">    <!-- ����properties�ļ� -->    <context:property-placeholder location="classpath:c3p0-db.properties" />    <!-- ��������Դ����ȡproperties�ļ���Ϣ -->    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">        <property name="driverClass" value="${jdbc.driverClass}" />        <property name="jdbcUrl" value="${jdbc.jdbcUrl}" />        <property name="user" value="${jdbc.user}" />        <property name="password" value="${jdbc.password}" />    </bean>    <!-- ����jdbcģ�� -->    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">        <property name="dataSource" ref="dataSource" />    </bean>    <!-- ����dao -->  
    <bean id="accountDao" class="com.mengma.dao.impl.AccountDaoImpl">        <property name="jdbcTemplate" ref="jdbcTemplate" />    </bean>    <!-- ����service -->  
    <bean id="accountService" class="com.mengma.service.impl.AccountServiceImpl">        <property name="accountDao" ref="accountDao" />    </bean>    <!-- ���������������������Դ -->    <bean id="txManager"        class="org.springframework.jdbc.datasource.DataSourceTransactionManager">        <property name="dataSource" ref="dataSource" />    </bean>    <!-- ��д֪ͨ�������������ǿ��֪ͨ������Ҫ��д�����;���ִ�������ϸ�� -->    <tx:advice id="txAdvice" transaction-manager="txManager">        <tx:attributes>            <!-- ������㷽������������飬name��ʾ�������ƣ�*��ʾ���ⷽ�����ƣ�propagation�������ô�����Ϊ��read-only��ʾ���뼶���Ƿ�ֻ�� -->            <tx:method name="find*" propagation="SUPPORTS"                rollback-for="Exception" />            <tx:method name="*" propagation="REQUIRED" isolation="DEFAULT"                read-only="false" />        </tx:attributes>    </tx:advice>    <!-- aop��д����Spring�Զ���Ŀ�����ɴ�����Ҫʹ��AspectJ�ı��ʽ -->    <aop:config>        <!-- ����� -->        <aop:pointcut expression="execution(* com.mengma.service.*.*(..))"            id="txPointCut" />        <!-- ���棺���������֪ͨ���� -->        <aop:advisor pointcut-ref="txPointCut" advice-ref="txAdvice" />    </aop:config></beans> ````  
���������У������� <beans> ��ǵĵ� 6��13 �� 14 �д���ֱ������ AOP ����������ռ��������� 42��50 �д���ʹ�� <tx:advice> �����������֪ͨ���ݡ�  
  
�� 52��58 �д���ʹ��  ��Ƕ������棬���е� 54 �д���Ӧ���� AspectJ ���ʽ������ com.mengma.service ��������������з�����Ӧ��������򣬵� 57 �д���ʹ��  ��ǽ������������֪ͨ���ϣ����� AOP ������ʽ����������ɡ�  
  
#### 7\. ����������  
  
����Ŀ�� src Ŀ¼�´��� com.mengma.test �İ����ڸð��´��������� AccountTest��������ʾ��  
````  
package com.mengma.test;  
import org.junit.Test;  
import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  
import com.mengma.service.AccountService;  
public class AccountTest {  
@Test    public void test() {        // ���Spring������������  
String xmlPath = "applicationContext.xml";        ApplicationContext applicationContext = new ClassPathXmlApplicationContext(                xmlPath);        AccountService accountService = (AccountService) applicationContext                .getBean("accountService");        accountService.transfer("zhangsan", "lisi", 100);    }} ````  
����������ģ��������ת��ҵ�񣬴� zhangsan ���˻��� lisi ���˻���ת�� 100 Ԫ��ʹ�� JUnit �������� test() ���������гɹ��󣬲�ѯ account ����ͼ 3 ��ʾ��

��ͼ 3 �Ĳ�ѯ����п��Կ�����zhangsan �ɹ��� lisi ת�� 100 Ԫ��

![��ѯ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/763_9ae_de5.PNG)  
ͼ 3  ��ѯ���

����ͨ���޸İ���ģ��ת��ʧ�ܵ�������ڵ� transfer() ���������һ�д��롰int i=1/0����ģ��ϵͳ�ϵ��������������������ʾ��
````  
 public void transfer(String outUser, String inUser, int money) {    this.accountDao.out(outUser, money);    //ģ��ϵ�  
    int i = 1/0;    this.accountDao.in(inUser, money);
 } 
````  
    
���²������� test() ������JUnit ����̨�������Ϣ��ͼ 4 ��ʾ��  
  
![����̨������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/764_7a3_f52.png)  
ͼ 4  ����̨������  
  
��ͼ 4 �п��Կ�������ִ�в��Է���ʱ�������˳��� 0 ���쳣��Ϣ����ʱ�ٴβ�ѯ account �����ѯ�����ͼ 5 ��ʾ��  
  
��ͼ 5 �Ĳ�ѯ����п��Կ��������е����ݲ�û�з����仯�����ڳ�����ִ�й������׳����쳣���������������ύ������ת��ʧ�ܡ��ɴ˿�֪��Spring �����������Ч�ˡ�  
  
![��ѯ���](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/763_9ae_de5.PNG)  
ͼ 5  ��ѯ���  
  
# Spring����ʽ�����������Annotationע�ⷽʽʵ�֣�  
  
�� [Spring](http://www.voidme.com/spring) �У�����ʹ�û��� XML �ķ�ʽ����ʵ������ʽ����������⣬������ͨ�� Annotation ע��ķ�ʽʵ������ʽ�������  
  
ʹ�� Annotation �ķ�ʽ�ǳ��򵥣�ֻ��Ҫ����Ŀ���������£��������¡�  
  
#### 1���� Spring ������ע������������������ʾ��  
````  
<tx:annotation-driven transaction-manager="txManager"/>
````  
#### 2������Ҫʹ�������ҵ������߷��������ע�� @Transactional�������� @Transactional �Ĳ��������� @Transactional �Ĳ�����ͼ 1 ��ʾ��  
  
![@Transactional�����б�](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/765_7af_ff7.png)  
ͼ 1  @Transactional�����б�  
  
����ͨ���޸ġ� [Spring����XMLʵ���������](http://www.voidme.com/spring/spring-transaction-management-by-xml)���̳�������ת�˵İ����������ʹ�� Annotation ע��ķ�ʽʵ�� Spring ����ʽ�������  
  
#### 1\. ע������  
  
�޸� Spring �����ļ� applicationContext.xml���޸ĺ�������ʾ��  


````  
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"    xmlns:context="http://www.springframework.org/schema/context"    xmlns:tx="http://www.springframework.org/schema/tx"    xmlns:aop="http://www.springframework.org/schema/aop"    xsi:schemaLocation="http://www.springframework.org/schema/beans            http://www.springframework.org/schema/beans/spring-beans-2.5.xsd            http://www.springframework.org/schema/context  
http://www.springframework.org/schema/context/spring-context.xsd            http://www.springframework.org/schema/tx            http://www.springframework.org/schema/tx/spring-tx-2.5.xsd            http://www.springframework.org/schema/aop            http://www.springframework.org/schema/aop/spring-aop-2.5.xsd">    <!-- ����properties�ļ� -->    <context:property-placeholder location="classpath:c3p0-db.properties" />    <!-- ��������Դ����ȡproperties�ļ���Ϣ -->    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">        <property name="driverClass" value="${jdbc.driverClass}" />        <property name="jdbcUrl" value="${jdbc.jdbcUrl}" />        <property name="user" value="${jdbc.user}" />        <property name="password" value="${jdbc.password}" />    </bean>    <!-- ����jdbcģ�� -->    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">        <property name="dataSource" ref="dataSource" />    </bean>    <!-- ����dao -->  
<bean id="accountDao" class="com.mengma.dao.impl.AccountDaoImpl">        <property name="jdbcTemplate" ref="jdbcTemplate" />    </bean>    <!-- ����service -->  
<bean id="accountService" class="com.mengma.service.impl.AccountServiceImpl">        <property name="accountDao" ref="accountDao" />    </bean>    <!-- ���������������������Դ -->    <bean id="txManager"        class="org.springframework.jdbc.datasource.DataSourceTransactionManager">        <property name="dataSource" ref="dataSource" />    </bean>    <!-- ע������������� -->    <tx:annotation-driven transaction-manager="txManager"/></beans> ````  
````
���������п��Կ�������ԭ���������ļ���ȣ�����ֻ�޸���������������֣�����Ӳ�ע���������������������

��Ҫע����ǣ���ѧϰ AOP ע�ⷽʽ����ʱ����Ҫ�������ļ��п���ע�⴦������ָ��ɨ����Щ���µ�ע�⣬����û�п���ע�⴦��������Ϊ�ڵ� 33��35 ���ֶ������� AccountServiceImpl���� @Transactional ע��������ڸ����У����Ի�ֱ����Ч��

#### 2\. ��� @Transactional ע��

�޸� AccountServiceImpl�����ļ������ @Transactional ע�⼰��������Ӻ�������ʾ��
````  
package com.mengma.service.impl;  
  
import org.springframework.transaction.annotation.Isolation;  
import org.springframework.transaction.annotation.Propagation;  
import org.springframework.transaction.annotation.Transactional;  
  
import com.mengma.dao.AccountDao;  
  
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, readOnly = false)  
public class AccountServiceImpl {  
    private AccountDao accountDao;  
    public void setAccountDao(AccountDao accountDao) {        this.accountDao = accountDao;    }  
    public void transfer(String outUser, String inUser, int money) {        this.accountDao.out(outUser, money);        // ģ��ϵ�  
        int i = 1 / 0;        this.accountDao.in(inUser, money);    
}}
````

��Ҫע����ǣ���ʹ�� @Transactional ע��ʱ������֮���á��������зָ���  
  
ʹ�� JUnit �����ٴ����� test() ����ʱ������̨ͬ���������ͼ 2 ��ʾ���쳣��Ϣ����˵��ʹ�û��� Annotation ע��ķ�ʽͬ��ʵ���� Spring ������ʽ����������ע�͵�ģ��ϵ�Ĵ�����в��ԣ���ת�˲�������������ɡ�  
  
![���н��](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/764_7a3_f52.png)  
ͼ 2  ���н��  
  
# �ο�����  
https://www.w3cschool.cn/wkspring  
https://www.runoob.com/w3cnote/basic-knowledge-summary-of-spring.html  
http://codepub.cn/2015/06/21/Basic-knowledge-summary-of-Spring  
https://dunwu.github.io/spring-tutorial  
https://mszlu.com/java/spring  
http://c.biancheng.net/spring/aop-module.html
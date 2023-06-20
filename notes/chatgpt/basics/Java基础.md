# 多线程

## CountDownLatch、CyclicBarrier、Semaphore的区别

CountDownLatch、CyclicBarrier和Semaphore都是Java中用于多线程编程的工具类，它们主要用于协调多个线程之间的操作，以达到有效管理线程的目的。虽然这三个类的作用有一些相似，但其实它们之间还存在一些区别。

CountDownLatch（倒计时器）
CountDownLatch被用来等待一个事件或者多个事件发生后才执行某些操作，即它可以使某个线程一直等待，直到其他线程都执行完毕，再开始执行该线程的任务。CountDownLatch通过一个计数器来实现，计数器初始值为线程总数，每当一个线程完成了自己的任务后，计数器的值就会减一，当计数器的值为0时，表示所有线程都已完成任务，然后在等待的线程就会被唤醒。

CyclicBarrier（屏障）
CyclicBarrier也是Java中的一个同步辅助类，它可以使得一组线程达到一个屏障（也可以叫做同步点）时被阻塞，直到最后一个线程到达屏障时，所有被阻塞的线程才能继续执行。不同于CountDownLatch一次性的减少计数器数量，CyclicBarrier的计数器在达到0之后会重置。

Semaphore（信号量）
Semaphore是用来控制同时访问某个资源的线程数量，它通过一个计数器来实现，如果在初始化Semaphore时指定了许可的数量，那么多个线程就可以同时执行该代码，并且在使用该资源之后释放许可，这样其他被阻塞的线程才能够继续访问该资源。

总的来说，虽然这三个工具类都可以协调多个线程之间的操作，但是它们的使用场景和机制并不完全相同。CountDownLatch适用于等待一组线程全部结束后再执行某个任务的场景，CyclicBarrier适用于等待一组线程全部到达一个屏障后再执行某个任务的场景，而Semaphore则适用于控制对某个资源的访问量的场景。

## Java的几种锁应用的场景分别是什么？
在 Java 中，常见的锁包括 synchronized、ReentrantLock 和 ReadWriteLock 等。它们应用于不同的场景，下面是它们的具体应用场景：

synchronized：synchronized 是 Java 语言的内置锁，适用于需要对共享资源进行加锁和解锁的场景。synchronized 使用起来简单方便，并且可以保证线程安全，但缺点是可扩展性较差，只能支持非公平锁，并且容易出现死锁问题。

ReentrantLock：ReentrantLock 是一个可重入锁，可以重复进入由同一线程持有的任何锁，适用于需要支持公平锁和非公平锁，并且需要更好的可扩展性和更精细的线程交互控制的场景。相比 synchronized，ReentrantLock 提供了更多的功能，例如支持可中断锁和超时锁等特性，但使用起来也更为复杂。

ReadWriteLock：ReadWriteLock 是一种读写锁，用于支持对共享资源的读取和写入操作，适用于读多写少的场景。与普通锁不同，ReadWriteLock 支持多个线程同时读取共享资源，但只允许一个线程进行写入操作。这样可以提高并发性能，减少线程竞争，同时保证数据的一致性。

## volatile关键字的应用场景是什么？
在 Java 中，volatile 是一种关键字，用于修饰变量。当一个变量被 volatile 修饰时，它会具有以下两个特性：

- 可见性：当一个线程修改了一个被 volatile 修饰的变量时，这个变化对其他线程是可见的。

- 禁止指令重排：编译器和处理器不能对被 volatile 修饰的操作进行优化和指令重排。

volatile 的应用场景主要包括：

- 在多线程环境下保证变量的可见性：在多线程环境下，常常需要通过共享变量来实现线程间的通信。如果不加任何同步措施，不同线程之间无法保证对变量的可见性，从而导致数据的不一致性。使用 volatile 可以确保变量的修改对其他线程是可见的，从而避免出现数据不一致问题。

- 作为一种轻量级的同步机制：相比于 synchronized 和 Lock 等同步机制，volatile 更为轻量级，可以减少线程之间的阻塞和上下文切换。因此，当需要保证变量的可见性时，如果加锁的代价过于昂贵，可以考虑使用 volatile。

需要注意的是，volatile 不能替代 synchronized，它只能保证变量的可见性和禁止重排，但无法保证原子性。如果需要同时保证可见性、原子性和有序性，还需要使用 synchronized 或者 Lock 等同步机制。

## 什么场景下应该使用原子性同步？
原子性同步是指在多线程环境下，保证某个操作的原子性和可见性。Java提供了多种原子性同步的类，例如 AtomicInteger、AtomicLong 等。通常，应该使用原子性同步的场景包括：

- 计数器场景：当需要对一个变量进行自增或自减操作时，可以使用原子性的 AtomicInteger 或 AtomicLong 来保证操作的原子性和可见性，从而避免多个线程对同一个变量的竞争问题。

- 缓存场景：当需要实现一个高效的缓存系统时，可以使用 AtomicReference 或 AtomicReferenceArray 等原子性同步的类来保证缓存数据的原子性和可见性。这样可以避免出现多个线程对同一个缓存区域的竞争问题，并提高缓存的并发能力。

- 无锁算法场景：在一些需要实现无锁算法的场景中，例如 CAS 操作等，可以使用原子性同步的类来保证操作的原子性和可见性，并避免出现死锁等问题。

总之，当需要在多线程环境中保证操作的原子性和可见性时，应该使用原子性同步的类，以避免线程间的竞争问题，并提高应用程序的并发处理能力。但需要注意的是，过度使用原子性同步可能会造成性能问题，需要根据实际情况进行选择和权衡。

## Java的集合、Map在什么时候会出现线程安全问题？有什么解决方案？
Java的集合和Map是常用的数据结构，但是在多线程环境下，如果不进行合适的同步处理，可能会出现线程安全问题。常见的线程安全问题包括：ConcurrentModificationException 异常、数据不一致等。

以下是一些可能导致线程安全问题的场景：

遍历操作：在遍历集合或Map时，在另一个线程修改集合或Map容器的情况下，可能会抛出并发修改异常。

并发修改操作：在多个线程同时修改集合或Map容器时，可能会导致数据不一致等线程安全问题。

为了解决这些问题，Java提供了多种线程安全的集合和Map实现类，例如：

ConcurrentHashMap （线程安全的Map实现类）：它使用锁分段技术（Segment）来减小锁的粒度，从而提高并发能力。

CopyOnWriteArrayList 和 CopyOnWriteArraySet （线程安全的List和Set实现类）：每次修改都会复制出一个新的数组来，保证线程安全。

Collections.synchronizedXXX 方法：可以使用该方法对集合或Map进行同步处理，使其具备线程安全性。该方法使用synchronized关键字对整个容器对象进行加锁，从而保证线程安全。

## 多个线程同时对ArrayList、HashMap进行修改，如增加或删除元素时，为什么会出现线程安全问题？

当多个线程同时对ArrayList或HashMap进行修改时，可能会导致以下两种情况：

- 内存不一致问题
多个线程同时修改ArrayList或HashMap时，由于内部实现并非是线程安全的，在多线程并发修改时，可能会出现数据不一致的情况。例如，某个线程在增加或删除元素时，可能没有及时更新集合的长度或哈希表的结构，在其他线程取值时，可能会得到错误的结果。

- 并发修改异常
当一个线程正在遍历ArrayList或HashMap时，另一个线程进行修改操作，例如增加或删除元素，就会导致集合或哈希表结构发生变化，从而使当前正在遍历的线程抛出ConcurrentModificationException异常。

## 根据index查找数组元素时，为什么时间复杂度为O(1)
- 数组在内存中是一段连续的内存空间，元素的存储位置是相邻的。因此，通过索引访问元素时，只需要知道该元素在内存中的起始地址和元素类型的大小，就可以直接计算出元素的存储位置，从而以O(1)的时间复杂度完成元素的访问。

- 数组的每个元素可以通过下标直接访问，只需要乘以每个元素的大小。

因此，如果已知数组的起始地址和元素类型的大小，就可以通过简单的数学计算得到索引对应的元素地址，从而以O(1)的时间复杂度完成元素的访问。这也是数组索引访问的优势所在。

## CopyOnWriteArrayList通过什么方式实现线程安全？
写时复制

## 

# JVM

## jvm在什么情况下会进行full gc

JVM会进行full GC主要有以下几种情况：

当eden区满了，新创建的对象没有足够的空间分配时，会触发一次Minor GC，此时存活下来的对象会被复制到survivor区，如果survivor区已经满了，则会将对象放入老年代中。当老年代也满了时，就会触发一次Full GC。

当永久代（Perm Gen）满了，JVM会触发Full GC来进行回收。

当调用System.gc()方法时，JVM会尝试进行Full GC。

当堆大小限制达到了最大值（-Xmx），JVM会尝试进行Full GC。

当应用程序调用了大量的System.gc()方法，或者频繁地创建大量临时对象时，可能会导致Full GC的触发。

总之，Full GC是一种非常耗费系统资源的操作，应该尽量避免触发。

## jvm在什么情况下会进行young gc

JVM会进行young gc主要有以下几种情况：

当Eden区（年轻代）满了，JVM会触发一次Young GC。这时候存活下来的对象会被复制到Survivor区（幸存者区），如果Survivor区也满了，就会将对象放入老年代中。

当Survivor区满了，JVM会触发一次Young GC。这时候存活下来的对象会被复制到另外一个Survivor区中，如果两个Survivor区都满了，就会将对象放入老年代中。

当对象的年龄达到一定值时，就会晋升到老年代中。这个年龄默认是15，可以通过JVM参数-XX:MaxTenuringThreshold来调整。

当老年代满了，JVM会进行Full GC。这时候，年轻代和老年代都会被GC，因此也会对年轻代进行Young GC。

总之，Young GC是一种频繁进行的GC操作，但是它比Full GC消耗的资源要少得多，因此尽可能地让对象在年轻代中被回收，可以提高应用程序的性能。

jvm的Survivor1区和2区的区别是什么？为什么大小比例是1:1?
JVM中的Survivor区是一个用于存放新生代对象的区域，它被划分为两个部分：Survivor1区和Survivor2区。这两个区域的作用是相同的，它们都用于存放新生代存活下来的对象。

Survivor1区和Survivor2区的大小比例通常是1:
1。这是因为，在垃圾回收过程中，JVM会将某个Survivor区中存活的对象复制到另一个Survivor区中，同时清空原Survivor区。如果两个Survivor区大小不一致，那么复制过程会非常复杂。而且，如果一个Survivor区非常小，那么其中的对象很可能无法得到充分的利用，从而导致频繁的垃圾回收，影响性能。因此，通常设置Survivor1区和Survivor2区的大小比例为1:
1，保证它们能够充分利用，同时也方便垃圾回收过程的实现。

## Java如何自定义一个类加载器？

Java 中的类加载器（Class Loader）是用于将 Java 类文件加载到 JVM 中并生成对应的 Class 对象的重要组件。在 Java
中，默认提供了三种类加载器：BootstrapClassLoader、ExtensionClassLoader 和 AppClassLoader。如果需要实现特定的需求，比如从指定位置加载类，或者实现代码隔离等，就需要自定义一个类加载器。

以下是自定义类加载器的基本步骤：

- 继承ClassLoader类，重写findClass()方法：继承java.lang.ClassLoader类，通过重写它的protected findClass(String name)方法来完成自定义加载逻辑。

- 实现findClass()方法：在该方法中实现类加载的具体逻辑，此处可以通过文件系统、网络等方式获取字节码，并使用defineClass()方法将字节数组转化为Class对象。

- 覆盖loadClass()方法：覆盖ClassLoader类中的protected loadClass(String name, boolean resolve)
  方法，改变父类加载器的委派机制，逐级向上查找时优先使用自定义类加载器进行加载。

- 创建自定义类加载器对象：创建自定义类加载器的实例，通过重载loadClass方法和findClass方法获得类对象。

下面是一个简单的自定义类加载器实现的示例代码：

```java
public class CustomClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] data = getClassData(name);
        if (data == null) {
            throw new ClassNotFoundException();
        }
        return defineClass(name, data, 0, data.length);
    }

    private byte[] getClassData(String name) {
        // 从指定位置读取字节码文件
        // 返回字节数组
        return null;
    }

    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            //若类已经被加载，直接返回该类对应的Class对象
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                try {
                    //先使用自定义加载器进行查找
                    c = findClass(name);
                } catch (ClassNotFoundException e) {
                    //如果自定义加载器未加载到，则使用父类加载器进行查找
                    c = super.loadClass(name, resolve);
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
}
```

需要注意的是，在实现自定义类加载器时，需要考虑很多因素，如命名空间的隔离、安全性、防止字节码篡改等。建议在开发过程中参考相关文档和最佳实践，并进行充分的测试和验证。

## 什么情况下需要使用自定义加载器？

在 Java 应用程序中，通常情况下使用默认的系统类加载器是完全足够的。但是，在某些特定的场景中，需要使用自定义的类加载器来满足特定的需求，比如：

- 实现类隔离：当应用程序需要同时运行多个版本的同一个类或者不同的类库时，使用自定义类加载器可以隔离不同版本的类或类库，避免类之间的冲突。

- 动态加载类：某些情况下需要动态地加载类，比如通过网络传输字节码来实现类的动态扩展。

- 加密和解密：为了保护一些关键的 Java 类，可以使用一些加密技术，以自定义的方式加载这些加密的类，从而增强安全性。

- 跟踪类的加载信息： 通过自定义类加载器可以对类的加载过程进行跟踪和记录，便于开发人员进行调试和分析。

需要注意的是，在使用自定义类加载器时需要谨慎对待，要考虑到安全性、版权问题等因素，并进行充分的测试和验证。自定义加载器的开发人员需要具备深入了解 Java 类加载机制及其相关知识的能力和经验。



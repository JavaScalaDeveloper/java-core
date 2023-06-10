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

Survivor1区和Survivor2区的大小比例通常是1:1。这是因为，在垃圾回收过程中，JVM会将某个Survivor区中存活的对象复制到另一个Survivor区中，同时清空原Survivor区。如果两个Survivor区大小不一致，那么复制过程会非常复杂。而且，如果一个Survivor区非常小，那么其中的对象很可能无法得到充分的利用，从而导致频繁的垃圾回收，影响性能。因此，通常设置Survivor1区和Survivor2区的大小比例为1:1，保证它们能够充分利用，同时也方便垃圾回收过程的实现。

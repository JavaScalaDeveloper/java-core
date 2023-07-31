# 请简述Zookeeper是怎样存储数据的？

Zookeeper 是一个分布式协调服务，它提供了一个层次化的文件系统（类似于文件夹和文件的结构）来存储和管理数据。Zookeeper 的数据模型基于称为 Znode（Zookeeper节点）的树形结构。

Zookeeper 将所有数据存储在内存中，并通过磁盘将数据持久化到磁盘上的事务日志中。它采用了一种基于磁盘的快照（snapshot）的机制，定期将内存中的数据快照写入到磁盘上的文件中，以进行持久化存储。

每个 Znode 都可以存储一个小的数据量（通常不超过1MB），并且可以关联着一个唯一的路径。Znode 路径类似于文件系统中的绝对路径，例如 /myapp/node1。

Zookeeper 提供了以下几种类型的 Znode：

- 持久节点（Persistent Znode）：创建后，它会一直存在于 Zookeeper 中，直到被主动删除。即使客户端与 Zookeeper 断开连接或重启，持久节点仍然存在。

- 临时节点（Ephemeral Znode）：创建后，只会在客户端与 Zookeeper 保持连接的期间存在。当客户端与 Zookeeper 断开连接时，临时节点会自动删除。

- 顺序节点（Sequential Znode）：顺序节点是在节点路径后自动附加一个单调递增的序列号的节点。它保证了每个顺序节点都有唯一的路径，并且序列号的生成是原子操作。

Zookeeper 使用基于观察者模式的机制来通知客户端节点的变化。客户端可以注册对某个 Znode 的数据变化、子节点变化等事件的监听，当这些事件发生时，Zookeeper 会通知客户端，以便及时处理。

总之，Zookeeper 将数据存储在内存中，并通过磁盘持久化存储。通过树形结构的 Znode 来组织和管理数据，并提供了持久节点、临时节点和顺序节点等类型的节点来满足不同的需求。

# Zookeeper有哪些数据结构？
- Znode（Zookeeper节点）：Znode 是 Zookeeper 中最基本的数据单元，类似于文件系统中的节点。每个 Znode 可以存储数据和关联路径，并具有版本号和权限信息。Znode 根据不同的用途可以分为持久节点、临时节点和顺序节点。

- Watcher（观察者）：Watcher 是 Zookeeper 的一种机制，用于实时通知客户端与其关联的 Znode 发生了变化。客户端可以注册对特定 Znode 的观察者，当该 Znode 的状态发生变化时，Zookeeper 会向客户端发送通知。

- ACL（访问控制列表）：ACL 是 Zookeeper 中用于控制对 Znode 进行访问的权限机制。每个 Znode 都可以设置一个 ACL，用于指定哪些用户或角色可以对该节点进行读取、写入和管理操作。

- DataTree（数据树）：DataTree 是 Zookeeper 内部使用的数据结构，用于存储所有的 Znode 数据。它是一个基于内存的树形结构，以哈希表的方式存储 Znode 的元数据和数据内容。DataTree 提供了对 Znode 的添加、删除、更新和查询等操作。

- Transaction Log（事务日志）：Transaction Log 是 Zookeeper 用于持久化存储数据的机制之一。所有对 Znode 的操作都会被写入事务日志，以确保数据的持久性和一致性。当 Zookeeper 重启时，可以通过回放事务日志来恢复数据状态。

这些数据结构相互关联，共同构成了 Zookeeper 的核心组件，使其能够提供高性能、可靠的分布式协调服务。

# Zookeeper怎样实现分布式锁？
- 创建一个持久性节点作为锁的根节点。例如，使用/lock作为根节点。

- 当一个进程需要获取锁时，它创建一个有序临时节点。例如，使用/lock/lock-00000001作为临时节点。

- 进程检查它创建的节点是否是当前所有子节点（其他进程创建的节点）中最小的节点。如果是最小的节点，则表示该进程获得了锁；否则，进程监听前一个节点的变化。

- 如果前一个节点变化或被删除，则回到第3步重新检查自己是否是最小的节点。

- 当进程使用完锁后，它会删除自己创建的临时节点，释放锁。

这种实现方式的关键在于临时节点和有序节点的结合。有序节点保证了节点间的先后顺序，并且可以通过比较节点序号来确定哪个节点是当前获得锁的节点。临时节点则保证了进程在断开连接后，节点会自动删除，避免了因为进程故障而导致锁一直被占用的情况。

通过以上步骤，Zookeeper 实现了一个基于节点的分布式锁，允许多个进程竞争锁资源并保证只有一个进程能够获得锁。其他进程需要等待锁的释放或者监听锁节点的变化。这种方式可用于分布式系统中的任务调度、资源竞争等场景，确保对共享资源的访问是有序的。
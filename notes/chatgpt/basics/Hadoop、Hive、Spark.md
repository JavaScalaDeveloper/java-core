# Hadoop

# Hive

## Hive有哪些用来优化的参数？


hive.exec.parallel：控制并行执行的任务数量，默认为 8。可以根据集群的规模和资源情况适当调整该参数。

hive.exec.parallel.thread.number：在每个任务中使用的并行线程数，默认为 8。可以根据任务的性质和资源情况适当调整该参数。

hive.exec.reducers.bytes.per.reducer：指定每个 reduce 任务处理的数据量大小，默认为 1GB。该参数可以影响 reduce 任务的数量和数据分片的粒度，从而影响性能。

hive.auto.convert.join：开启或关闭自动转换小表的连接操作，默认为 true。当一个表的大小小于配置的阈值时，Hive 会将连接操作转换为 Map 端的操作，以提高性能。

hive.vectorized.execution.enabled：开启或关闭向量化执行模式，默认为 false。该模式可以利用 CPU 的 SIMD 指令集优化查询性能，特别适用于对大量数据进行批处理的场景。

hive.optimize.sort.dynamic.partition：开启或关闭针对动态分区表的排序优化，默认为 true。该优化可以减少写入分区表时的数据移动，提高写入性能。

hive.cbo.enable：开启或关闭基于成本的优化器（CBO），默认为 true。CBO 可以根据表和数据的统计信息，选择更优的执行计划，提高查询性能。

hive.stats.autogather：开启或关闭自动收集表和分区的统计信息，默认为 true。收集统计信息可以提供给 CBO 使用，优化查询计划。

hive.optimize.ppd：开启或关闭基于谓词下推的优化，默认为 true。谓词下推可以将过滤条件尽早应用到数据上，减少数据的读取量和处理量。

hive.optimize.skewjoin：开启或关闭倾斜连接优化，默认为 true。倾斜连接优化可以处理连接操作中的数据倾斜问题，提高性能。

这些参数只是 Hive 提供的一部分优化选项，实际使用中还需要根据具体场景和需求进行调整。你可以通过修改 Hive 的配置文件（hive-site.xml）或在 Hive CLI 中使用 SET 命令来修改这些参数。同时，也建议参考官方文档和相关资源，深入了解这些参数的含义和用法。



# Spark
## Spark有哪些用来优化的参数？
spark.driver.memory：指定驱动程序的内存大小，默认为 1g。根据你的应用程序的需求，可以适当增加或减少该值。

spark.executor.memory：指定每个执行器的内存大小，默认为 1g。根据任务的复杂性和数据量的大小，可以适当调整该值。

spark.executor.instances：指定执行器实例的数量，默认为应用程序运行的核心数。可以根据集群的资源情况和任务的并行度来调整该值。

spark.default.parallelism：指定默认并行度级别，默认为集群中可用的 CPU 核心数。根据数据量和任务的性质，可以适当调整该值。

spark.sql.shuffle.partitions：指定 shuffle 操作的分区数，默认为 200。根据数据的大小和集群的资源情况，可以适当调整该值。

spark.sql.autoBroadcastJoinThreshold：设置自动广播连接的阈值，默认为 10MB。当一个表的大小小于该阈值时，Spark 将自动将其广播到所有的执行器上。

spark.sql.inMemoryColumnarStorage.batchSize：指定列式存储的批次大小，默认为 10000。可以根据列的大小和存储格式进行调整，以提高列式存储的效率。

spark.streaming.kafka.maxRatePerPartition：设置 Spark Streaming 从 Kafka 消费数据的最大速率，默认为无限制。根据流处理的需求和集群的资源情况，可以适当限制该值。

spark.streaming.backpressure.enabled：开启或关闭流处理的背压机制，默认为 false。背压机制可以根据系统的处理能力自动调整数据的拉取速率，以避免任务堆积。

spark.sql.statistics.histogram.enabled：开启或关闭统计信息中直方图的生成，默认为 true。直方图可以提供给优化器更准确的数据分布信息，优化查询计划。

这些参数只是 Spark 提供的一部分优化选项，实际使用中还需要根据具体场景和需求进行调整。你可以通过修改 Spark 的配置文件（spark-defaults.conf 或 spark-env.sh）或在代码中使用 SparkConf 来设置这些参数。同时，也建议参考官方文档和相关资源，深入了解这些参数的含义和用法。


���� | һ��ߣJava
��Դ |����ͷ��

**ѧϰĿ��**

*   Sentinel�Ĺ���ԭ��
    **��1�� ����ԭ��**
    ��Sentinel�У����е���Դ����Ӧһ����Դ�����Լ�һ��Entry��ÿһ��entry���Ա�ʾһ�����󡣶�Sentinel�У�����Ե�ǰ������ڹ�����ж���ʵ�����صĿ��ƣ�ԭ������ͼ��ʾ��

![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/1296c955070646bbc74310e726679bbabfe585.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")��ͼ����Ϊ���˼���չʾ��ͼ�� Slot ��˳���Ѻ����°� Sentinel Slot Chain ˳��һ��
��һ���ⲿ�������֮�󣬻ᴴ��һ��Entry��������Entry��ͬʱ��Ҳ�ᴴ��һϵ�е�slot ���һ����������ÿ��slot�в�ͬ�Ĺ���ְ��

*   NodeSelectorSlot �����ռ���Դ��·����������Щ��Դ�ĵ���·��������״�ṹ�洢���������ڸ��ݵ���·��������������
*   ClusterBuilderSlot �����ڴ洢��Դ��ͳ����Ϣ�Լ���������Ϣ���������Դ�� RT, QPS,thread count �ȵȣ���Щ��Ϣ������Ϊ��ά�����������������ݣ�
*   StatisticSlot �����ڼ�¼��ͳ�Ʋ�ͬγ�ȵ� runtime ָ������Ϣ��
*   FlowSlot �����ڸ���Ԥ������������Լ�ǰ�� slot ͳ�Ƶ�״̬���������������ƣ�
*   AuthoritySlot ��������õĺڰ������͵�����Դ��Ϣ�������ڰ��������ƣ�
*   DegradeSlot ��ͨ��ͳ����Ϣ�Լ�Ԥ��Ĺ��������۶Ͻ�����
*   SystemSlot ��ͨ��ϵͳ��״̬������ load1 �ȣ��������ܵ����������
*   LogSlot �ڳ����������۶ϡ�ϵͳ����ʱ�����¼��־
*   ...
    Sentinel �� ProcessorSlot ��Ϊ SPI �ӿڽ�����չ��1.7.2 �汾��ǰ SlotChainBuilder ��ΪSPI����ʹ�� Slot Chain �߱�����չ�����������������м����Զ���� slot ������ slot ���˳�򣬴Ӷ����Ը� Sentinel ����Զ���Ĺ��ܡ�

![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/d65c2688084bf5be06d3687ce8663cb1b7167b.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")**Spring Cloud ����Sentinel��ԭ��**

Spring Cloud �м���Sentinel�������ǻ�����������ʵ�֣������ʵ��·�����¡�

SentinelWebAutoConfiguration����>addInterceptors����>SentinelWebInterceptor->AbstractSentinelInterceptor



```
public boolean preHandle(HttpServletRequest request, HttpServletResponseresponse, Object handler) throws Exception {  try {    String resourceName = this.getResourceName(request);    if (StringUtil.isEmpty(resourceName)) {      return true;   } else if (this.increaseReferece(request,this.baseWebMvcConfig.getRequestRefName(), 1) != 1) {      return true;   } else {      String origin = this.parseOrigin(request);      String contextName = this.getContextName(request);      ContextUtil.enter(contextName, origin);      Entry entry = SphU.entry(resourceName, 1, EntryType.IN);     request.setAttribute(this.baseWebMvcConfig.getRequestAttributeName(), entry);      return true;   } } catch (BlockException var12) {    BlockException e = var12;    try {      this.handleBlockException(request, response, e);   } finally {      ContextUtil.exit();   }    return false; }}
```









> ��Դ���õ��������ͣ������������ EntryType.IN �����ǳ��������� EntryType.OUT ����ע��ϵͳ����ֻ�� IN ��Ч

**��2�� SphU.entry**
�����Ǽ���dubboҲ�ã����Ǽ��ɵ�spring cloud��Ҳ�ã����ն��ǵ���SphU.entry������������������жϵģ����������Ǵ�SphU.entry���������ȥ�˽�����ʵ��ԭ��

���������ǿ���Ψһ�ɻ�ģ�Ҳ����ؼ���һ���� SphU.entry(resource) �� ���Ǵ���ȥ��һ����Դ�������Դ�����Ƿ������������ǽӿڣ���ô����������ʲô�أ���������һ�����ҿ�����������ɴ��



```
public static Entry entry(String name) throws BlockException {    return Env.sph.entry(name, EntryType.OUT, 1, OBJECTS0);}public class Env {    public static final Sph sph = new CtSph();    ......//ʡ�Բ��ִ���}
```









�� SphU.entry() ��������ִ�л���뵽 Sph.entry() ��Sph��Ĭ��ʵ������ CtSph,�����ջ����CtSph ��entry ������



```
@Overridepublic Entry entry(String name, EntryType type, int count, Object... args) throws BlockException {���� //��װ��һ����Դ����    StringResourceWrapper resource = new StringResourceWrapper(name, type);    return entry(resource, count, args);}
```









�������Ҫ������ͨ�����Ǹ�������Դȥ��װ��һ�� StringResourceWrapper ��Ȼ�����Լ������ط������̶����� entryWithPriority(resourceWrapper, count, false, args)��

*   ResourceWrapper ��ʾsentinel����Դ�����˷�װ
*   count��ʾ���������ռ�õĲ���������Ĭ����1
*   prioritized�����ȼ�



```
private Entry entryWithPriority(ResourceWrapper resourceWrapper, int count,boolean prioritized, Object... args)    throws BlockException {    //��ȡ�����Ļ������洢��ThreadLocal�У�context�л�洢����������    Context context = ContextUtil.getContext();    //����� NullContext����ô˵�� context name ������ 2000 �����μ� ContextUtil#trueEnter    //���ʱ��Sentinel ���ٽ��ܴ����µ� context ���ã�Ҳ���ǲ�����Щ�µĽӿڵ�ͳ�ơ������۶ϵ�    if (context instanceof NullContext) {        // The {@link NullContext} indicates that the amount of context has exceeded the threshold,        // so here init the entry only. No rule checking will be done.        return new CtEntry(resourceWrapper, null, context);    }    if (context == null) {//ʹ��Ĭ��context        // ����Context�Ĳ���        context = InternalContextUtil.internalEnter(Constants.CONTEXT_DEFAULT_NAME);    }    // Global switch is close, no rule checking will do.    if (!Constants.ON) {//ȫ�����������Ƿ��Ѿ�����������ر��ˣ��Ͳ���������������        return new CtEntry(resourceWrapper, null, context);    }    //���ģʽ�е�������ģʽ��    //����һ��slot����    ProcessorSlot<Object> chain = lookProcessChain(resourceWrapper);    //���� lookProcessChain ����������֪������ resource ���� Constants.MAX_SLOT_CHAIN_SIZE��    // Ҳ���� 6000 ��ʱ��Sentinel ��ʼ�������µ�������ô����Ҫ��Ϊ�� Sentinel �����ܿ���    if (chain == null) {        return new CtEntry(resourceWrapper, null, context);    }    //���������������ʼ�����ɸ�entry    Entry e = new CtEntry(resourceWrapper, chain, context);    try {        //��ʼ�����������        chain.entry(context, resourceWrapper, null, count, prioritized, args);    } catch (BlockException e1) {        e.exit(count, args); //���������׳��쳣��        throw e1;    } catch (Throwable e1) {        // This should not happen, unless there are errors existing in Sentinel internal.        RecordLog.info("Sentinel unexpected exception", e1);    }    return e;//���������Ľ��}
```









������Ĵ������ǿ���֪�����÷�������Ҫ�ǻ�ȡ���˱���Դ����Ӧ����Դ���������������� lookProcessChain �з��֣�����ȥ��ȡ��һ����������ȥִ����Դ�����ϴ�����Ȼ�����ﴦ�������Ļ����£���ô����������϶��Ƕ��ڵ�ǰ�������������������������صĴ������Է�Ϊ���¼������֣�

*   �Բ�ȫ������������⣬���������Ҫ���ֱ�ӷ�����һ��CtEntry���󣬲����ٽ��к����������⣬�����������ļ�����̡����ݰ�װ������Դ�����ȡ��Ӧ��SlotChain
*   ִ��SlotChain��entry���������SlotChain��entry�����׳���BlockException���򽫸��쳣���������׳������SlotChain��entry��������ִ���ˣ������Ὣ��entry���󷵻�
*   ����ϲ㷽��������BlockException����˵�����������ˣ���������������ִ��
    **2.1 ����Context**
    InternalContextUtil.internalEnter--->trueEnter



```
protected static Context trueEnter(String name, String origin) {    //��ThreadLocal�л�ȡ����һ�ο϶���null    Context context = contextHolder.get();    if (context == null) {        //�����Ǹ���Context�����ֻ�ȡNode        Map<String, DefaultNode> localCacheNameMap = contextNameNodeMap;        DefaultNode node = localCacheNameMap.get(name);        if (node == null) {            if (localCacheNameMap.size() > Constants.MAX_CONTEXT_NAME_SIZE) {                setNullContext();                return NULL_CONTEXT;            } else {                LOCK.lock();                try {                    node = contextNameNodeMap.get(name);                    if (node == null) {                        if (contextNameNodeMap.size() > Constants.MAX_CONTEXT_NAME_SIZE) {                            setNullContext();                            return NULL_CONTEXT;                        } else {                            //������EntranceNode                            node = new EntranceNode(new StringResourceWrapper(name, EntryType.IN), null);                            //����ȫ�ֵĽڵ�                            // Add entrance node.                            Constants.ROOT.addChild(node);//����map��                            Map<String, DefaultNode> newMap = new HashMap<>(contextNameNodeMap.size() + 1);                            newMap.putAll(contextNameNodeMap);                            newMap.put(name, node);                            contextNameNodeMap = newMap;                        }                    }                } finally {                    LOCK.unlock();                }            }        }        context = new Context(node, name);        context.setOrigin(origin);        //����ThreadLocal��        contextHolder.set(context);    }    return context;}
```









������߼����ǱȽϼ򵥵�

*   ������ThreadLocal��ȡ����ȡ�����ʹ�������Ȼ�ͷ���
*   Ȼ����Map�и���ContextName��һ��Node
*   û���ҵ�Node�ͼ����ķ�ʽ������һ��EntranceNode��Ȼ�����Map��
*   ����Context������node��name��origin���ٷ���ThreadLocal��
    ����Context�ʹ������

ĿǰContext�����״̬����ͼ![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/a114ee154527b7fcf24169d5291c7bac87ac93.png "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")**2.2 ����slot��**
����һ��slot������·�����Ϊ

> DefaultProcessorSlotChain -> NodeSelectorSlot -> ClusterBuilderSlot -> LogSlot ->StatisticSlot -> AuthoritySlot -> SystemSlot -> ParamFlowSlot -> FlowSlot -> DegradeSlot



```
ProcessorSlot<Object> lookProcessChain(ResourceWrapper resourceWrapper) {    //���Կ�����chain��������Դ����Ϊkey����ͬ����Դ�϶��ǲ�ͬchain��    ProcessorSlotChain chain = chainMap.get(resourceWrapper);    if (chain == null) {////������spring(����bean) dubbo(˫�ؼ����)�����һ�ޣ����û������        synchronized (LOCK) {            chain = chainMap.get(resourceWrapper);            if (chain == null) {                //chainMap��С����һ��ֵ��Ҳ����entry������С�����ˣ�һ��chain��Ӧһ��entry                if (chainMap.size() >= Constants.MAX_SLOT_CHAIN_SIZE) {                    return null;                }                //����һ��slot chain                chain = SlotChainProvider.newSlotChain();                //������߼��ǣ��½�һ��Map��С��oldMap+1                Map<ResourceWrapper, ProcessorSlotChain> newMap = new                    HashMap<ResourceWrapper, ProcessorSlotChain>(                    chainMap.size() + 1);                //Ȼ�����������oldMap���ٷ��½���chain                newMap.putAll(chainMap);                newMap.put(resourceWrapper, chain); //��ӵ�newMap�� ����Ӧ���ǿ��Ǳ���Ƶ������                chainMap = newMap;            }        }    }    return chain;}
```









����Ĵ�����������Է��֣����ȴӻ����л�ȡ�ô�����������һ�ν����϶���û�еģ������������ SlotChainProvider ȥ���촦������������ɺ�����뻺���Ա��´�ʹ�ã�



```
public static ProcessorSlotChain newSlotChain() {    if (slotChainBuilder != null) {        return slotChainBuilder.build();    }    // ����ͨ��spi����ȥ������������������Լ�����slot�Ļ�ֻ��Ҫ����SPI����ʵ��SlotChainBuilder�ӿھͺ�    //SentinelĬ�ϵ�����sentinel-core���µ�META-INF.services��    slotChainBuilder = SpiLoader.loadFirstInstanceOrDefault(SlotChainBuilder.class, DefaultSlotChainBuilder.class);    if (slotChainBuilder == null) {        // Should not go through here.        RecordLog.warn("[SlotChainProvider] Wrong state when resolving slot chain builder, using default");        slotChainBuilder = new DefaultSlotChainBuilder();    } else {        RecordLog.info("[SlotChainProvider] Global slot chain builder resolved: "                       + slotChainBuilder.getClass().getCanonicalName());    }    return slotChainBuilder.build();}
```









������������˶�ε�У�飬ȷ��builder ��Ϊ�գ�Ȼ��ͨ����ȥ���������������



```
public class DefaultSlotChainBuilder implements SlotChainBuilder {    @Override    public ProcessorSlotChain build() {        ProcessorSlotChain chain = new DefaultProcessorSlotChain();        chain.addLast(new NodeSelectorSlot());        chain.addLast(new ClusterBuilderSlot());        chain.addLast(new LogSlot());        chain.addLast(new StatisticSlot());        chain.addLast(new SystemSlot());        chain.addLast(new AuthoritySlot());        chain.addLast(new FlowSlot());        chain.addLast(new DegradeSlot());        return chain;    }}
```









���������������ڷ����������������������������Ҳ�ж������˵�����Ͼ���Sentinel�����������㷨��ʵ�ָ��أ����ǿ�һ�¹����Ľ��ܣ�

�� Sentinel ���棬���е���Դ����Ӧһ����Դ���ƣ�resourceName����ÿ����Դ���ö��ᴴ��һ�� Entry ����Entry ����ͨ����������ܵ������Զ�������Ҳ����ͨ��ע��ķ�ʽ����� SphU API ��ʽ������Entry ������ʱ��ͬʱҲ�ᴴ��һϵ�й��ܲ�ۣ�slot chain������Щ����в�ͬ��ְ�𡣾���ְ���������Ѿ��ᵽ�ˡ�

**��������**

�����ִ���������¡�

* NodeSelectorSlot����Ҫ���ڹ�����������

* ClusterBuilderSlot�����ڼ�Ⱥ�������۶ϡ�

* LogSlot�����ڼ�¼��־��

* StatisticSlot������ʵʱ�ռ�ʵʱ��Ϣ��

* AuthoritySlot������Ȩ��У��ġ�

* SystemSlot��������֤ϵͳ����Ĺ���

* FlowSlot��ʵ���������ơ�

* DegradeSlot��ʵ���۶ϻ��ơ�
  **2.3 ����Entry**

  > Entry e = new CtEntry(resourceWrapper, chain, context);



```
CtEntry(ResourceWrapper resourceWrapper, ProcessorSlot<Object> chain, Context context) {    super(resourceWrapper);    this.chain = chain;    this.context = context;    setUpEntryFor(context);}private void setUpEntryFor(Context context) {    // The entry should not be associated to NullContext.    if (context instanceof NullContext) {        return;    }    this.parent = context.getCurEntry();    if (parent != null) {        ((CtEntry) parent).child = this;    }    context.setCurEntry(this);}

```









����һ��Entry���ɵ�ʱ��context.getCurEntry�ض���NULL����ôֱ��ִ��Context.setCurEntry����

Ȼ�����Context��״̬����ͼ  ![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/57273a794d51cfc587c923de97943491e9da0b.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")��ִ��һ���µ�Sphu.entry����ٴ��½�һ��Entry�����ʱ��curEntry����null����ôִ��((CtEntry)parent).child = this;

�������ͼ![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/c3c36f101ef031102dd270287bf7635e715229.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")���Կ�����ԭ����CtEntry���Ƴ�Context���½���CtEntry�;�CtEntryͨ���ڲ���parent��child��������

**2.4 NodeSelectorSlot**
�������Ҫ���ڹ����������������Ҫ����һ�£��ں��������л�ȽϹؼ����������¡�



```
@Overridepublic void entry(Context context, ResourceWrapper resourceWrapper, Object obj,                  int count, boolean prioritized, Object... args)    throws Throwable {    //�����и����棬����context�����ֻ���node    DefaultNode node = map.get(context.getName());    //˫�ؼ�⣬�̰߳�ȫ    if (node == null) {        synchronized (this) {            node = map.get(context.getName());            if (node == null) {                //�������ɵ���DefaultNode�ڵ�                node = new DefaultNode(resourceWrapper, null);                //������Щ�߼��Ƿ���map���߼�����Ϊ����map�Ƚϴ������������룬���ܻ��һЩ                HashMap<String, DefaultNode> cacheMap = new HashMap<String,DefaultNode>(map.size());                cacheMap.putAll(map);                cacheMap.put(context.getName(), node);                map = cacheMap;                // �ؼ����⣬�����޸ĵ��������ĵط�                ((DefaultNode) context.getLastNode()).addChild(node);            }        }    }    //�滻context�е�curEntry�е�curNode    context.setCurNode(node);    fireEntry(context, resourceWrapper, node, count, prioritized, args);}
```









��ѯ�������Ƿ������node������߼�Ҳ�ܼ�

*   ����ContextName��ѯ�����Ƿ������Node
*   û�о��������DefaultNode�����뻺�棬Ȼ�����������
*   Context��curEntry�е�curnode����Ϊ���node
    �����м�������Ҫ����˵����

1��context����ʾ�����ģ�һ���̶߳�Ӧһ��context�����а���һЩ��������

*   name������
*   entranceNode�����������
*   curEntry����ǰentry
*   origin����������Դ
*   async���첽
    2��Node�� ��ʾһ���ڵ㣬����ڵ�ᱣ��ĳ����Դ�ĸ���ʵʱͳ�����ݣ�ͨ������ĳ���ڵ㣬�Ϳ��Ի�ö�Ӧ��Դ��ʵʱ״̬�����������Ϣ�����������ͽ��������м��ֽڵ�����
*   StatisticNode��ʵ����Node�ӿڣ���װ�˻���������ͳ�ƺͻ�ȡ����
*   DefaultNode��Ĭ�Ͻڵ㣬NodeSelectorSlot�д����ľ�������ڵ㣻����ͬ����Դ�ڲ�ͬ�������и��Ե��������
*   ClusterNode����Ⱥ�ڵ㣬����ͬ����Դ�ڲ�ͬ��������������������
*   EntranceNode���ýڵ��ʾһ�õ�����������ڽڵ㣬ͨ�������Ի�ȡ�������������е��ӽڵ㣻ÿ�������Ķ�����һ����ڽڵ㣬����ͳ�Ƶ�ǰ�����ĵ������������
*   OriginNode����һ��StatisticNode���͵Ľڵ㣬������ͬ����Դ������Դ���������
    **2.5 StatisticSlot**
    ������slot��·�У��Ƚ���Ҫ�ģ�������������ͳ���Լ�����������������slot��������������һ��StatisticSlot�������

StatisticSlot�� Sentinel �ĺ��Ĺ��ܲ��֮һ������ͳ��ʵʱ�ĵ������ݡ�

*   clusterNode����ԴΨһ��ʶ�� ClusterNode �� runtime ͳ��
*   origin���������Բ�ͬ�����ߵ�ͳ����Ϣ
*   defaultnode: ������������Ŀ���ƺ���Դ ID �� runtime ͳ��
*   ��ڵ�ͳ��



```
public void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count,                  boolean prioritized, Object... args) throws Throwable {    try {        // �Ƚ��ɺ���������&������processorSlot����Ȼ����ݴ���������ͳ��        // Sentinel�������ľ�������ʹ�� for ѭ���������� ProcessorSlot ��ԭ��        fireEntry(context, resourceWrapper, node, count, prioritized, args);        //ִ�е������ʾͨ����飬��������        // Request passed, add thread count and pass count.        node.increaseThreadNum(); //��ǰ�ڵ�������߳�����1        node.addPassRequest(count);        //��Բ�ͬ���͵�node��¼�߳�����������ͨ��������ͳ�ơ�        if (context.getCurEntry().getOriginNode() != null) {            // Add count for origin node.            context.getCurEntry().getOriginNode().increaseThreadNum();            context.getCurEntry().getOriginNode().addPassRequest(count);        }        if (resourceWrapper.getEntryType() == EntryType.IN) {            // Add count for global inbound entry node for global statistics.            Constants.ENTRY_NODE.increaseThreadNum();            Constants.ENTRY_NODE.addPassRequest(count);        }        //�ɵ��� StatisticSlotCallbackRegistry#addEntryCallback ��̬����ע��ProcessorSlotEntryCallback        for (ProcessorSlotEntryCallback<DefaultNode> handler :             StatisticSlotCallbackRegistry.getEntryCallbacks()) {            handler.onPass(context, resourceWrapper, node, count, args);        }        //���ȼ��ȴ��쳣�������FlowRule�л����漰����    } catch (PriorityWaitException ex) {//�����߳�ͳ��        node.increaseThreadNum();        if (context.getCurEntry().getOriginNode() != null) {            // Add count for origin node.            context.getCurEntry().getOriginNode().increaseThreadNum();        }        if (resourceWrapper.getEntryType() == EntryType.IN) {            // Add count for global inbound entry node for global statistics.            Constants.ENTRY_NODE.increaseThreadNum();        }        // Handle pass event with registered entry callback handlers.        for (ProcessorSlotEntryCallback<DefaultNode> handler :             StatisticSlotCallbackRegistry.getEntryCallbacks()) {            handler.onPass(context, resourceWrapper, node, count, args);        }    } catch (BlockException e) {        // Blocked, set block exception to current entry.        context.getCurEntry().setBlockError(e); //���������쳣����ǰentry��        // Add block count.        node.increaseBlockQps(count); //���ӱ�����������        //���ݲ�ͬNode�����������������Ĵ���        if (context.getCurEntry().getOriginNode() != null) {            context.getCurEntry().getOriginNode().increaseBlockQps(count);        }        if (resourceWrapper.getEntryType() == EntryType.IN) {            // Add count for global inbound entry node for global statistics.            Constants.ENTRY_NODE.increaseBlockQps(count);        }        // Handle block event with registered entry callback handlers.        for (ProcessorSlotEntryCallback<DefaultNode> handler :             StatisticSlotCallbackRegistry.getEntryCallbacks()) {            handler.onBlocked(e, context, resourceWrapper, node, count, args);        }        throw e;    } catch (Throwable e) {        // Unexpected internal error, set error to current entry.        context.getCurEntry().setError(e);        throw e;    }}
```









����ֳ��������֣���һ������entry�������÷������Ȼᴥ������slot��entry��������SystemSlot��FlowSlot��DegradeSlot�ȵĹ����������ͨ�����ͻ��׳�BlockException�������node��ͳ�Ʊ�block����������֮����node��ͳ��ͨ�������������߳�������Ϣ���ڶ���������exit�����У����˳���Entry���ʱ����ͳ��rt��ʱ�䣬�������߳�����

���ǿ��Կ��� node.addPassRequest() ��δ�������fireEntryִ��֮��ִ�еģ�����ζ�ţ���ǰ����ͨ����sentinel�����صȹ��򣬴�ʱ��Ҫ�����������¼������Ҳ����ִ�� node.addPassRequest()���д��룬���Ǹ���ȥ������

**2.5.1 addPassRequest**
@Overridepublic void addPassRequest(int count) {    // ���ø��ࣨStatisticNode��������ͳ��    super.addPassRequest(count);    // ����clusterNode ����ͳ�ƣ�����Ҳ�ǵ��ø���StatisticNode��    this.clusterNode.addPassRequest(count);}
��������֪�������node��һ�� DefaultNode ʵ�����ڵ�һ��NodeSelectorSlot ��entry�����ж���Դ�����˷�װ����װ����һ��DefaultNode��

*   DefaultNode��������ĳ��resource��ĳ��context�е�ʵʱָ�꣬ÿ��DefaultNode��ָ��һ��ClusterNode
*   ClusterNode��������ĳ��resource�����е�context��ʵʱָ����ܺͣ�ͬ����resource�Ṳ��ͬһ��ClusterNode�����������ĸ�context��
    �ֱ��������ʱ�䴰������������������

�ڲ�ʵ�ʵ��õ���ArrayMetric����������������ͳ��



```
//��������ͳ�ƣ��ֳ��������ڣ�ÿ������500ms������ͳ��QPSprivate transient volatile Metric rollingCounterInSecond = new ArrayMetric(SampleCountProperty.SAMPLE_COUNT,        IntervalProperty.INTERVAL);//���շ���ͳ�ƣ�����60�����ڣ�ÿ������1000msprivate transient Metric rollingCounterInMinute = new ArrayMetric(60, 60 * 1000, false);public void addPassRequest(int count) {    rollingCounterInSecond.addPass(count);    rollingCounterInMinute.addPass(count);}
```









������õ��ǻ������ڵķ�ʽ����¼����Ĵ�����![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/e4624bb214fd8020d1447098c8cde98a554e59.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")������Ĺ�ϵͼʵ�����ǱȽ������ģ�ArrayMetricʵ������һ����װ�࣬�ڲ�ͨ��LeapArray��ʵ�־����ͳ���߼�����LeapArray��ά���˶��WindowWrap���������ڣ�����WindowWrap�в�����MetricBucket������ָ�����ݵ�ͳ�ơ�

*   Metric: ָ���ռ��Ľӿڣ����廬�������гɹ��������쳣����������������TPS����Ӧʱ�������
*   ArrayMetric �������ں���ʵ����
*   LeapArray
*   WindowWrap ÿһ���������ڵİ�װ�࣬�ڲ������ݽṹ����MetricBucket
*   MetricBucket�� ��ʾָ��Ͱ�����������������쳣�������ɹ�������Ӧʱ���
*   MetricEvent ָ�����ͣ�ͨ���������������쳣�����ɹ�����
    **2.5.2 ArrayMetric.addPass**
    �������Ŵ������¿������뵽ArrayMetric.addPass������
*   ��LeapArray�и��ݵ�ǰʱ���õ���Ӧ�Ĵ���
*   ����MetricBucket�е�addPass���������ӵ�ǰ�����е�ͳ�ƴ���

�Ӵ��������ǿ��Կ���������ָ����� addPass ��ͨ��һ���� ArrayMetric ���࣬���������ڽ��� ArrayMetric �п�һ�¡�����Ĵ���������ʾ��



```
private final LeapArray<MetricBucket> data;// SAMPLE_COUNT=2  INTERVAL=1000public ArrayMetric(int sampleCount, int intervalInMs) {  //������������ʾ���������ڵĴ�С��2����ÿһ���������ڵ�ʱ�䵥λ��500ms    this.data = new OccupiableBucketLeapArray(sampleCount, intervalInMs);}public void addPass(int count) {    WindowWrap<MetricBucket> wrap = data.currentWindow();    wrap.value().addPass(count);}
```









�������ڳ������뻬����������ô������� window�ˣ�window�����Ǵ��������ͨ�� data ����ȡ��ǰ���ڡ�������Ĵ��ڴ�СΪ sampleCount=2.���ǿ��Կ�����������ͨ�� MetricBucket ���������ָ�꣬����ά����һ��ͳ��������LongAdder[] counters �����棬�� WindowWrap�����ǿ��Կ���ÿһ�� WindowWrap����������������ɣ�



```
public class WindowWrap<T> {����// ʱ�䴰�ڵĳ���    private final long windowLengthInMs;����// ʱ�䴰�ڵĿ�ʼʱ�䣬��λ�Ǻ���    private long windowStart;���� //ʱ�䴰�ڵ����ݣ��� WindowWrap �����÷��ͱ�ʾ���ֵ�ģ���ʵ���Ͼ��� MetricBucket ��    private T value;    //......ʡ�Բ��ִ���}
```









�ٿ� LeapArray ����ࣺ



```
public abstract class LeapArray<T> {    // ʱ�䴰�ڵĳ���    protected int windowLength;    // �������ڵĸ���    protected int sampleCount;    // �Ժ���Ϊ��λ��ʱ����    protected int intervalInMs;    // ������ʱ�䴰������    protected AtomicReferenceArray<WindowWrap<T>> array;    /**     * LeapArray����     * @param windowLength ʱ�䴰�ڵĳ��ȣ���λ������     * @param intervalInSec ͳ�Ƶļ������λ����     */    public LeapArray(int windowLength, int intervalInSec) {        this.windowLength = windowLength;        // ʱ�䴰�ڵĲ���������Ĭ��Ϊ2����������        this.sampleCount = intervalInSec * 1000 / windowLength;        this.intervalInMs = intervalInSec * 1000;//������Ϊ��λ��ʱ�䴰���У����ʼ���������ȵ����飺`AtomicReferenceArray<WindowWrap<T>>array`����������ʾ�������ڵĴ�С�����У�ÿ�����ڻ�ռ��500ms��ʱ�䡣        this.array = new AtomicReferenceArray<WindowWrap<T>>(sampleCount);    }}
```









���Ժ������Ŀ������� LeapArray �д�����һ�� AtomicReferenceArray ���飬������ʱ�䴰���е�ͳ��ֵ���в�����ͨ��������ͳ��ֵ�ټ����ƽ��ֵ������������Ҫ�����յ�ʵʱָ���ֵ�ˡ����Կ�����������Ĵ�����ͨ��ע�ͣ�������Ĭ�ϲ�����ʱ�䴰�ڵĸ�����2�������ֵ����ô�õ����أ����ǻ���һ�� LeapArray ���󴴽�����ͨ���� StatisticNode �У�new��һ�� ArrayMetric��Ȼ�󽫲���һ·���ϴ��ݺ󴴽��ģ�



```
private transient volatile Metric rollingCounterInSecond = new ArrayMetric(SampleCountProperty.SAMPLE_COUNT,IntervalProperty.INTERVAL);
```









**2.5.3 currentWindow**
���Ǹ�����ȡ��ǰ���ڵķ��� data.currentWindow() �У�



```
@Overridepublic WindowWrap<Window> currentWindow(long time) {    .....//ʡ�Բ��ִ���    //���㵱ǰʱ���ڻ��������е����������㷽ʽ�Ƚϼ򵥣���ǰʱ����Ե���ʱ�䴰�ڵ�ʱ�䳤�ȣ��ٴ�����ʱ�䴰�ڳ��Ƚ���ȡģ���� int idx = calculateTimeIdx(timeMillis);    //���㵱ǰʱ����ʱ�䴰���еĿ�ʼʱ��    long windowStart = calculateWindowStart(timeMillis);    // timeÿ����һ��windowLength�ĳ��ȣ�timeId�ͻ�����1��ʱ�䴰�ھͻ���ǰ����һ��        while (true) {        // �Ӳ��������и���������ȡ�����ʱ�䴰��        WindowWrap<Window> old = array.get(idx);        // array���鳤�Ȳ��˹��󣬷���old�ܶ�����¶����в��ˣ��ͻᴴ���ܶ��WindowWrap����        //���Ϊ�գ�˵���˴���δ��ʼ��        if (old == null) {            // ���û�л�ȡ�����򴴽�һ���µ�            WindowWrap<Window> window = new WindowWrap<Window>(windowLength, currentWindowStart, new Window());            // ͨ��CAS���´������õ�������ȥ            if (array.compareAndSet(idx, null, window)) {                // ��������óɹ����򽫸ô��ڷ���                return window;            } else {                // ����ǰ�߳��ó�ʱ��Ƭ���ȴ�                Thread.yield();            }        // �����ǰ���ڵĿ�ʼʱ����old�Ŀ�ʼʱ����ȣ���ֱ�ӷ���old����        } else if (currentWindowStart == old.windowStart()) {            return old;        // �����ǰʱ�䴰�ڵĿ�ʼʱ���Ѿ�������old���ڵĿ�ʼʱ�䣬�����old����        // ����time����Ϊ�µ�ʱ�䴰�ڵĿ�ʼʱ�䣬��ʱ������ǰ����        } else if (currentWindowStart > old.windowStart()) {            if (addLock.tryLock()) {                try {                    // if (old is deprecated) then [LOCK] resetTo currentTime.                    return resetWindowTo(old, currentWindowStart);                } finally {                    addLock.unlock();                }            } else {                Thread.yield();            }        // ������������ܴ���        } else if (currentWindowStart < old.windowStart()) {            // Cannot go through here.            return new WindowWrap<Window>(windowLength, currentWindowStart, new Window());        }    }}
```









����ܳ��������𲽽���ֽ⣬����ʵ�ʿ��԰����ֳ����¼�����

1.  ���ݵ�ǰʱ�䣬�����ʱ���timeId��������timeId�����ǰ�����ڲ������������е�����idx��
2.  ���ݵ�ǰʱ�������ǰ���ڵ�Ӧ�ö�Ӧ�Ŀ�ʼʱ��time���Ժ���Ϊ��λ��
3.  ��������idx���ڲ�������������ȡ��һ��ʱ�䴰�ڡ�
4.  ѭ���ж�ֱ����ȡ��һ����ǰʱ�䴰�� old ��

*   ���oldΪ�գ��򴴽�һ��ʱ�䴰�ڣ����������뵽array�ĵ�idx��λ�ã�array�����Ѿ��������ˣ���һ�� AtomicReferenceArray��
*   �����ǰ���ڵĿ�ʼʱ��time��old�Ŀ�ʼʱ����ȣ���ô˵��old���ǵ�ǰʱ�䴰�ڣ�ֱ�ӷ���old��
*   �����ǰ���ڵĿ�ʼʱ��time����old�Ŀ�ʼʱ�䣬��˵��old�����Ѿ���ʱ�ˣ���old�Ŀ�ʼʱ�����Ϊ����ֵ��time��������һ�ε�ѭ�����жϵ�ǰ���ڵĿ�ʼʱ��time��old�Ŀ�ʼʱ����ȵ�ʱ�򷵻ء�
*   �����ǰ���ڵĿ�ʼʱ��timeС��old�Ŀ�ʼʱ�䣬ʵ������������ǲ����ܴ��ڵģ���Ϊtime�ǵ�ǰʱ�䣬old�ǹ�ȥ��һ��ʱ�䡣
    ����timeId�ǻ�����ʱ������������ӣ���ǰʱ��ÿ����һ��windowLength�ĳ��ȣ�timeId�ͼ�1������idx����������ֻ����0��1֮��任����Ϊarray����ĳ�����2��ֻ����������ʱ�䴰�ڡ�����ΪʲôĬ��ֻ�������������ڣ����˾�����Ϊsentinel�ǱȽ������Ŀ�ܡ�ʱ�䴰���б����źܶ�ͳ�����ݣ����ʱ�䴰�ڹ���Ļ���һ�����ռ�ù����ڴ棬��һ����ʱ�䴰�ڹ������ζ��ʱ�䴰�ڵĳ��Ȼ��С�����ʱ�䴰�ڳ��ȱ�С���ͻᵼ��ʱ�䴰�ڹ���Ƶ���Ļ�����������һ�����еĵ�һ�����ڶ�����



```
private int calculateTimeIdx(/*@Valid*/ long timeMillis) {    // timeÿ����һ��windowLength�ĳ��ȣ�timeId�ͻ�����1��ʱ�䴰�ھͻ���ǰ����һ��    long timeId = timeMillis / windowLengthInMs;     // idx���ֳ�[0,arrayLength-1]�е�ĳһ��������Ϊarray�����е�����    return (int)(timeId % array.length());}protected long calculateWindowStart(/*@Valid*/ long timeMillis) {    return timeMillis - timeMillis % windowLengthInMs;}
```









���ݵ�ǰʱ����� windowLength �õ�һ�� timeId(���500ms���������ֵ����һ�µ�),����timeId��ȡ�����ڵĳ��Ƚ���һ��ȡģ����ô��һ�������� 0��1����λ�õ�����һ����Ȼ����ݵ�ǰʱ�������ǰ���ڵ�Ӧ�ö�Ӧ�Ŀ�ʼʱ��time�����ڸոտ�ʼ��ʱ�� array �ǿյģ���ô����ȡ����oldӦ����null����ô���ᴴ��һ���µ�ʵ����������ͼ��һ�³�ʼ���� LeapArray��

��Ӧ���� currentWindow ������ 4.1 ����(����idx=0)��![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/95b0b64926eae4d2753986af9c978da9980da0.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")����ȡ������null,��ô��ʼ��ʱ��arrays������ֻ��һ������(�����ǵ�һ��(idx=0)��Ҳ�����ǵڶ���(idx=1))��ÿ��ʱ�䴰�ڵĳ�����500ms�������ζ��ֻҪ��ǰʱ����ʱ�䴰�ڵĲ�ֵ��500ms֮�ڣ�ʱ�䴰�ھͲ�����ǰ���������磬���統ǰʱ���ߵ�300����500ʱ����ǰʱ�䴰����Ȼ����ͬ���Ǹ���

��Ӧ���� currentWindow ������ 4.2 ���裺![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/85c047336a2c2186bcc7737a4c28da852cb603.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")ʱ�������ǰ�ߣ�������500msʱ��ʱ�䴰�ھͻ���ǰ��������һ������ʱ�ͻ���µ�ǰ���ڵĿ�ʼʱ��,ʱ�������ǰ�ߣ�ֻҪ������1000ms����ǰ���ڲ��ᷢ���仯�����д���ʵ���� resetWindowTo ������



```
protected WindowWrap<MetricBucket> resetWindowTo(WindowWrap<MetricBucket> w, long time) {    // Update the start time and reset value.    // ����windowStart    w.resetTo(time);    MetricBucket borrowBucket = borrowArray.getWindowValue(time);    if (borrowBucket != null) {        w.value().reset();        w.value().addPass((int)borrowBucket.pass());    } else {        w.value().reset();    }    return w;}
```









��Ӧ���� currentWindow ������ 4.3 ����![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/03d6e3886f95f5768e05969d7eb8307c26f381.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")��ʱ�������ǰ�ߣ���ǰʱ�䳬��1000msʱ���ͻ��ٴν�����һ��ʱ�䴰�ڣ���ʱarrays�����еĴ��ڽ�����һ��ʧЧ��������һ���µĴ��ڽ����滻��![SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������](https://java-tutorial.oss-cn-shanghai.aliyuncs.com/241926a53c2a5b06938844199046d31e593d62.jpg "SpringCloud Alibabaϵ�С���15Sentinelԭ�����-��Դ�����������")�Դ���������ʱ������ţ�ʱ�䴰��Ҳ�ڷ����仯���ڵ�ǰʱ����н�������󣬻ᱻͳ�Ƶ���ǰʱ���Ӧ��ʱ�䴰���У��ص�addpass �����У�



```
public void addPass(int count) {    WindowWrap<MetricBucket> wrap = data.currentWindow();    wrap.value().addPass(count);}
```









��ȡ�������Ժ����뵽 wrap.value().addPass(count); QPS�����ӡ�������� wrap.value() �õ�����֮ǰ�ᵽ�� MetricBucket ���� Sentinel ��QPS������ݵ�ͳ�ƽ����ά���������� LongAdder[] �У����������ָ����������ʵ�����úõĹ������ƥ�䣬�鿴�Ƿ�������Ҳ���� StatisticSlot��entry �����е� fireEntry(context, resourceWrapper, node, count, prioritized, args); ��Ҫ�Ƚ��뵽 FlowSlot��entry���������������ˣ�



```
public void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count,                  boolean prioritized, Object... args) throws Throwable {    checkFlow(resourceWrapper, context, node, count, prioritized);    fireEntry(context, resourceWrapper, node, count, prioritized, args);}
```









���Կ��������и�����Ҫ�ķ��� checkFlow ����ȥ������



```
public void checkFlow(Function<String, Collection<FlowRule>> ruleProvider, ResourceWrapper resource,                      Context context, DefaultNode node, int count, boolean prioritized) throws BlockException {    if (ruleProvider == null || resource == null) {        return;    }    Collection<FlowRule> rules = ruleProvider.apply(resource.getName());    if (rules != null) {        for (FlowRule rule : rules) {            if (!canPassCheck(rule, context, node, count, prioritized)) {                throw new FlowException(rule.getLimitApp(), rule);            }        }    }}
```









������һ�ж�Ӧ�������ˣ������õ����������õ� FlowRule ѭ��ƥ����Դ�����������ˡ������Sentinel ������������ԭ��

**2.6 FlowRuleSlot**
��� slot ��Ҫ����Ԥ�����Դ��ͳ����Ϣ�����չ̶��Ĵ���������Ч�����һ����Դ��Ӧ�������߶������ع������������´������μ��飬ֱ��ȫ��ͨ��������һ��������ЧΪֹ:

*   ָ��Ӧ����Ч�Ĺ��򣬼���Ե��÷������ģ�
*   ���÷�Ϊ other �Ĺ���
*   ���÷�Ϊ default �Ĺ���



```
@Overridepublic void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count,                  boolean prioritized, Object... args) throws Throwable {    checkFlow(resourceWrapper, context, node, count, prioritized);    fireEntry(context, resourceWrapper, node, count, prioritized, args);}
```









**2.6.1 checkFlow**
���뵽FlowRuleChecker.checkFlow�����С�

*   ������Դ���ƣ��ҵ����������б�
*   �����������Ϊ�գ���������򣬵���canPassCheck��������У�顣



```
public void checkFlow(Function<String, Collection<FlowRule>> ruleProvider,ResourceWrapper resource,                      Context context, DefaultNode node, int count, boolean prioritized) throws BlockException {    if (ruleProvider == null || resource == null) {        return;    }    Collection<FlowRule> rules = ruleProvider.apply(resource.getName());    if (rules != null) {        for (FlowRule rule : rules) {            if (!canPassCheck(rule, context, node, count, prioritized)) {                throw new FlowException(rule.getLimitApp(), rule);            }        }    }}
```









**2.6.2 canPassCheck**
�ж��Ƿ��Ǽ�Ⱥ����ģʽ������ǣ�����passClusterCheck�����򣬵���passLocalCheck������



```
public boolean canPassCheck(/*@NonNull*/ FlowRule rule, Context context,DefaultNode node, int acquireCount,                            boolean prioritized) {    String limitApp = rule.getLimitApp();    if (limitApp == null) {        return true;    }    if (rule.isClusterMode()) {        return passClusterCheck(rule, context, node, acquireCount, prioritized);    }    return passLocalCheck(rule, context, node, acquireCount, prioritized);}
```









**2.6.3 passLocalCheck**

*   selectNodeByRequesterAndStrategy����������Ͳ��������Node
*   rule.getRater(), ���ݲ�ͬ������������Ϊ��������canPass����У�顣



```
private static boolean passLocalCheck(FlowRule rule, Context context,DefaultNode node, int acquireCount,                                      boolean prioritized) {    Node selectedNode = selectNodeByRequesterAndStrategy(rule, context, node);    if (selectedNode == null) {        return true;    }    return rule.getRater().canPass(selectedNode, acquireCount, prioritized);}
```









**2.6.4 DefaultController.canPass**
ͨ��Ĭ�ϵ�������Ϊ��ֱ�Ӿܾ��������������жϡ�



```
@Overridepublic boolean canPass(Node node, int acquireCount, boolean prioritized) {    //�ȸ���node��ȡ��Դ��ǰ��ʹ����������������qps���߲����������������ص�ֵ    int curCount = avgUsedTokens(node);    //��ǰ��ʹ�õ����������ϱ�������������Ƿ������ֵ    if (curCount + acquireCount > count) {//���Ϊtrue��˵��Ӧ�ñ�����        // �����������һ�������ȼ����󣬲�����������Ϊqps���򲻻�����ʧ�ܣ�����ȥռ��δ����ʱ�䴰�ڣ��ȵ���һ��ʱ�䴰��ͨ������        if (prioritized && grade == RuleConstant.FLOW_GRADE_QPS) { //            long currentTime;            long waitInMs;            currentTime = TimeUtil.currentTimeMillis();            waitInMs = node.tryOccupyNext(currentTime, acquireCount, count);            if (waitInMs < OccupyTimeoutProperty.getOccupyTimeout()) {                node.addWaitingRequest(currentTime + waitInMs, acquireCount);                node.addOccupiedPass(acquireCount);                sleep(waitInMs);                // PriorityWaitException indicates that the request will pass after waiting for {@link @waitInMs}.                throw new PriorityWaitException(waitInMs);            }        }        return false;    }    return true;}
```









һ�����ܾ������׳� FlowException �쳣��

**2.7 PriorityWait**
��DefaultController.canPass�У��������´���ȥ������Ĵ���



```
node.addWaitingRequest(currentTime + waitInMs, acquireCount);node.addOccupiedPass(acquireCount);
```









> addWaitingRequest -> ArrayMetric.addWaiting->OccupiableBucketLeapArray.addWaiting

borrowArray������һ��FutureBucketLeapArray�������ﶨ�����δ����ʱ�䴰�ڣ�Ȼ����δ��ʱ��Ĵ���ȥ���Ӽ���



```
@Overridepublic void addWaiting(long time, int acquireCount) {    WindowWrap<MetricBucket> window = borrowArray.currentWindow(time);    window.value().add(MetricEvent.PASS, acquireCount);}
```









���գ���StatisticSlot.entry�У������쳣

����������ȼ��Ƚϸߵ����񣬲��ҵ�ǰ�������Ѿ��ﵽ��ֵ���׳�����쳣��ʵ������ȥռ��δ����һ��ʱ�䴰��ȥ���м������׳�����쳣֮�󣬻���뵽StatisticSlot�н��в���Ȼ��ֱ��ͨ��



```
public void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count,                  boolean prioritized, Object... args) throws Throwable {    try{        //...    } catch (PriorityWaitException ex) {        node.increaseThreadNum();        if (context.getCurEntry().getOriginNode() != null) {            // Add count for origin node.            context.getCurEntry().getOriginNode().increaseThreadNum();        }        if (resourceWrapper.getEntryType() == EntryType.IN) {            // Add count for global inbound entry node for global statistics.            Constants.ENTRY_NODE.increaseThreadNum();        }        // Handle pass event with registered entry callback handlers.        for (ProcessorSlotEntryCallback<DefaultNode> handler :             StatisticSlotCallbackRegistry.getEntryCallbacks()) {            handler.onPass(context, resourceWrapper, node, count, args);        }    }}
```



# �ο�����
https://lijunyi.xyz/docs/SpringCloud/SpringCloud.html#_2-2-x-%E5%88%86%E6%94%AF
https://mp.weixin.qq.com/s/2jeovmj77O9Ux96v3A0NtA
https://juejin.cn/post/6931922457741770760
https://github.com/D2C-Cai/herring
http://c.biancheng.net/springcloud
https://github.com/macrozheng/springcloud-learning
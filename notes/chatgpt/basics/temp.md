# 基础算法

## 快排
```java
public void quickSort(int[] nums, int left, int right) {
if (left >= right) return;
int pivot = partition(nums, left, right); 
quickSort(nums, left, pivot-1); 
quickSort(nums, pivot+1, right); 
}
private int partition(int[] nums, int left, int right) {
int pivot = nums[left]; 
int i = left + 1; 
for (int j = i; j <= right; j++) {
    if (nums[j] < pivot) { 
        swap(nums, i, j);
        i++;
    }
}
swap(nums, left, i-1);
return i-1; 
}
```
## 归并排序
```java
public void mergeSort(int[] nums, int left, int right) {
if (left >= right) return;
int mid = (left + right) / 2; 
mergeSort(nums, left, mid); 
mergeSort(nums, mid+1, right); 
merge(nums, left, mid, right);
}
private void merge(int[] nums, int left, int mid, int right) {
int[] temp = new int[right-left+1]; 
int i = left, j = mid+1, k = 0;
while (i <= mid && j <= right) {
    if (nums[i] < nums[j]) {
        temp[k] = nums[i];
        i++;
    } else { 
        temp[k] = nums[j];
        j++;
    }
    k++;
}
while (i <= mid) { // 复制左子数组中剩余的元素到临时数组中
    temp[k] = nums[i];
    k++;
    i++;
}
while (j <= right) { // 复制右子数组中剩余的元素到临时数组中
    temp[k] = nums[j];
    k++;
    j++;
}
for (int x = 0; x < temp.length; x++) {
    nums[left+x] = temp[x];
}
}
```
## 桶排序
```java
public void bucketSort(int[] nums, int bucketSize) {
if (nums.length == 0) return;
int minValue = nums[0], maxValue = nums[0];
for (int i = 1; i < nums.length; i++) { // 找到数组中的最小值和最大值
    if (nums[i] < minValue) minValue = nums[i];
    else if (nums[i] > maxValue) maxValue = nums[i];
}
int bucketCount = (maxValue - minValue) / bucketSize + 1; 
List<List<Integer>> buckets = new ArrayList<>();
for (int i = 0; i < bucketCount; i++) { // 创建空桶
    buckets.add(new ArrayList<>());
}
for (int i = 0; i < nums.length; i++) { // 将元素分配到不同的桶中
    int bucketIndex = (nums[i] - minValue) / bucketSize;
    buckets.get(bucketIndex).add(nums[i]);
}
int index = 0;
for (List<Integer> bucket : buckets) { // 对每个桶中的元素进行排序，并放回原数组中
    int[] temp = new int[bucket.size()];
    for (int i = 0; i < bucket.size(); i++) {
        temp[i] = bucket.get(i);
    }
    Arrays.sort(temp);
    for (int i = 0; i < temp.length; i++) {
        nums[index++] = temp[i];
    }
}
}
```
## 二分查找
```java
public int binarySearch(int[] nums, int target) {
int left = 0,right = nums.length - 1; 
while (left <= right) {
    int mid = (left + right) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
}
return -1; 
}
```
## 回溯法
```java
public void dfs(int[] nums, List<Integer> path, List<List<Integer>> res) {
if (path.size() == nums.length) { 
    res.add(new ArrayList<>(path));
    return;
}
for (int i = 0; i < nums.length; i++) { 
    if (path.contains(nums[i])) continue;
    path.add(nums[i]); // 将元素加入路径中
    dfs(nums, path, res); // 继续搜索
    path.remove(path.size()-1); // 回溯
}
}
```
## 反转链表
```java
public ListNode reverseList(ListNode head) {
ListNode prev = null, current = head;
while (current != null) {
    ListNode next = current.next;
    current.next = prev;
    prev = current;
    current = next;
}
return prev;
}
```
## BFS
```java
public void bfs(TreeNode root) {
if (root == null) return;
Queue<TreeNode> queue = new LinkedList<>();
queue.offer(root);
while (!queue.isEmpty()) {
    int size = queue.size();
    for (int i = 0; i < size; i++) {
        TreeNode node = queue.poll();
        System.out.print(node.val + " ");
        if (node.left != null) {
            queue.offer(node.left);
        }
        if (node.right != null) {
            queue.offer(node.right);
        }
    }
}
}
```

## 约瑟夫环
```java
public int lastRemaining(int n, int m) {
int ans = 0;//f(n,m) = (f(n-1,m)+m) % n
for (int i = 2; i <= n; i++) {
    ans = (ans + m) % i;
}
return ans;
}
```

## 查找回文串
```java
public List<String> findPalindromes(String s) {
List<String> res = new ArrayList<>();
for (int i = 0; i < s.length(); i++) {
    findPalindrome(s, i, i, res);
    findPalindrome(s, i, i + 1, res);
}
return res;
}
private void findPalindrome(String s, int left, int right, List<String> res) {
while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
    res.add(s.substring(left, right + 1));
    left--;right++;
}
}
```

## 背包问题
```java
public int knapsack(int V, int[] w, int[] v) {
int n = w.length;
int[][] dp = new int[n+1][V+1];
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= V; j++) {
        if (w[i-1] > j) dp[i][j] = dp[i-1][j];
        else dp[i][j] = Math.max(dp[i-1][j], dp[i-1][j-w[i-1]]+v[i-1]);
    }
}
return dp[n][V];
}
```
## 打家劫舍
```java
public int rob(int[] nums) {
int n = nums.length;
int[] dp = new int[n];
dp[0] = nums[0],dp[1] = Math.max(nums[0], nums[1]);
for (int i = 2; i < n; i++) {
    dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
}
return dp[n - 1];
}
```

>给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。你可以假设数组中无重复元素。

###   示例
```
输入: [1,3,5,6], 5
输出: 2

输入: [1,3,5,6], 2
输出: 1

输入: [1,3,5,6], 7
输出: 4

输入: [1,3,5,6], 0
输出: 0
```

###   coding

```java
public int searchInsert(int[] nums, int target) {
    if (nums == null) {
        return 0;
    }
    /**
     * 思路：逐个比较，没有相等的数的话就插入。
     */
    for (int i = 0; i < nums.length; i++) {
        //如果目标值比当前值大，啥也不做，如果比当前值小，插入，如果等于当前值，返回。
        if (target <= nums[i]) {
            return i;
        }
    }
    return nums.length;
}
```
>假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

>每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

>注意：给定 n 是一个正整数。

###   示例
```
输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶

输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
```

###   分析
1. 暴力求解：其实就是 x+2y=n 解方程，然后把x,y全排列。
2. 动态规划：把每种结果做累加

###   coding
```java
public int climbStairs(int n) {
    if(n <=1){
        return 1;
    }
    int[] dp = new int[n];
    dp[0] = 1;
    dp[1] = 2;
    for(int i =2;i<n;i++){
        dp[i]=dp[i-1]+dp[i-2];
    }
    return dp[n-1];
}
```
这个算法理解难度挺大的，我刚开始看我也想不出为什么num[]的相加能，需要一个来更好的图来理解：


![](https://note.youdao.com/yws/api/personal/file/415C210049A84FA5A39FA5583568D579?method=download&shareKey=0ca6c3337a43b620515a573d5ee34315)

5层的话就是：2+1+2+1+2 = 8
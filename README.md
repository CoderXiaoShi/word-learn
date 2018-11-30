# word-learn
单词练习: 随机给出一个单词, 抄一遍默写5遍

```
Usage: index [options]

Options:
  -V, --version    output the version number
  -r, --refresh    更换单词列表: 重新从服务端拉去单词
  -d, --pineapple  开始练习: 抄一遍,默写5遍
  -l, --words      打印单词列表
  -h, --help       output usage information
```
## Version
### 1.0.1
----
- word -d 离开时打印用户行为
  > 正确次数,错误次数, 各个单词的练习次数(输入正确的)
- word -d 练习中出入 -exit 退出练习
  ```
    $ word -d
    抄一遍,默写5遍
    storage:存储
    > -exit
    beybey...
  ```
### 1.0.0
----
- word -l 列出本地所有单词
- word -d 开始练习, 抄一遍,默写5遍
- word -r 从远程拉去单词, 更新到本地
- init



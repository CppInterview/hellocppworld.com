# 第 3 章 字符串、向量和数组

`C++`定义了一个内容丰富的抽象数据类型库。其中`string`和`vector`是两种最重要的标准库类型，前者支持可变长字符串，后者则表示可变长的集合。

内置数组是一种更基础的数据类型，`string`和`vector`是对它的某种抽象。内置数组在性能上优于`string`和`vector`，但在灵活性上稍显不足。

## 3.1 命名空间的using声明

到目前为止，我们用到的库函数基本上都属于命名空间`std`，可以通过更简单的途径也能使用到命名空间中的成员。

```CPP
#include <iostream>
using std::cout;
using std::endl;
int main(int argc, char* argv[])
{
	cout << "Hello Cpp World!" << endl;	//上文中引入了std::cout 和std::endl，所以这里可以省略std::
    return 0;
}
```

**每个名字都需要独立的using声明**

在上个例子中，如果要使用`cin`，还需要单独的将`cin`引入到当前作用域。当然也可以直接引入`namespace`，这样就把`namespace`命名Jon关键下的所以成员全部引入到当前作用域中。

```CPP
#include <iostream>
using namespace std;
int main(int argc, char* argv)
{
    int i = 0;
    cin >> i;
    cout << i << endl;
    return 0;
}
```

但是不建议这样做，引入不需要的命名空间不是一个好习惯，极端情况可能会有成员名称与命名空间成员名称重合，造成不必要的麻烦。

**头文件不应该包含using声明**

头文件的代码一般不应该使用`using`语句。这是一位内头文件的内容会拷贝到所以引用它的文件中。这可能会造成名字冲突。

## 3.2 标准库类型string

标准库类型`string`表示可变长度的字符序列。使用`string`类型必须首先包含`string`头文件。作为标准库的一部分，`string`定义在命名空间`std`中。

```cpp
#include <string>
using std::string;
```

`C++`对标准库所提供的操作做了详细的规定（各个编译器厂商必须按标准实现），另一方面的库的实现做了一些性能上的要求。因此标准库类型对于一般应用场合来说有足够的效率。

### 3.2.1 定义和初始化string对象

| 初始化方式          | 释义                         |
| ------------------- | ---------------------------- |
| string s1           | 默认初始化，s1是一个空字符串 |
| string s2(s1)       | 使用s1初始化s2               |
| string s2 = s1      | 等价于string s2(s1)          |
| string s3("value")  | 使用“value” 初始化s3         |
| string s3 = "value" | 使用“value” 初始化s3         |
| string s4(n,'c')    | 把s4初始化为n个c组成的字符串 |

**直接初始化和拷贝初始化**

如果使用等号（`=`）初始化一个变量，实际上执行的是**拷贝初始化**（`copy initialization`），编译器把等号右侧的初始值拷贝到新创建的对象中。如果不适用等号，则执行的是**直接初始化**（`direct initialization`）。

```cpp
string s5 = "hello";	//拷贝初始化
string s6("cpp");		//直接初始化
string s7(10,'w');		//直接初始化
```

### 3.2.2 string对象上的操作

| 操作          | 释义                                               |
| ------------- | -------------------------------------------------- |
| os << s       | 将s写入到os流中，返回os                            |
| is >> s       | 从is中读取字符串赋给s，字符串以空白分割，返回is    |
| getline(is,s) | 从is中读取一行赋给s，返回is                        |
| s.empty()     | s为空返回true，否则返回false                       |
| s.size()      | 返回s中字符的个数                                  |
| s[n]          | 返回s中第n个字符的引用，n从0记起                   |
| s1+s2         | 返回s1和s2连接后的结果                             |
| s1 = s2       | 把s2中的内容赋给s1                                 |
| s1 == s2      | 如果s1和s2所含的字符完全一样，则他们相等           |
| s1 != s2      | string对象的相等判断对字符的大小写敏感             |
| <，<=，>，>=  | 利用字符在字典中的顺序进行比较，对字母的大小写敏感 |

**读写string对象**

在执行读取操作时，`string`对象会自动忽略开头的空白（空格符、换行符、制表符）并从第一个真正的字符开始读起，直到遇到下一处空白。

```cpp
//test.cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    std::string s;
    std::cin >> s;				//
    std::cout << s << std::endl;
    return 0;
}
// g++ test.cpp -o test -std=c++11
// ./test
//   helllo cpp world !!!
// hello
```

和内置类型的输入输出操作一样，string对象的此类操作也是返回运算符左侧的运算对象作为结果。

```cpp
//test.cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    std::string s1,s2,s3;
    std::cin >> s1 >> s2 >> s3;	
    std::cout << s1 << s2 <<s3 << std::endl;
    return 0;
}
// g++ test.cpp -o test -std=c++11
// ./test
//   helllo cpp world !!!
// hellocppworld
```

**读取未知数量的string对象**

```CPP
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    std::string world;
    while(std::cin >> world)
    {
        std::cout << world << std::endl;
    }
    return 0;
}
```

`std::cin >> world`返回`std::cin`可以转换为`bool`类型，当流的状态异常时才会返回`false`。

**使用getline读取一整行**

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    std::string line;
    while(std::getline(std::cin,line))
    {
        std::cout << line << std::endl;
    }
    return 0;
}
```

出发`getline`函数返回的那个换行符实际上被丢弃掉了，得到的`string`对象中并不包含该换行符。

**string的empty和size操作**

```cpp
#include <iostream>
#include <string>

int main(int argc, char* argv[])
{
    std::string s1;
    std::string s2("hello cpp world");
    std::cout << "s1.empty():" << s1.empty() << "s2.empty():" << s2.empty() << std::endl;
    std::cout << "s1.size():" << s1.size() << "s2.size():" << s2.size() << std::endl;
    return 0;
}
```



### 3.2.3 处理string对象中的字符

## 3.3 标准库类型vector

## 3.4 迭代器介绍

## 3.5 数组

## 3.6 多维数组


# 第1章 开始

## 1.1 编写一个简单的`C++`程序

**学习大纲**

* 函数
* 类型
* 编译并运行hellocppworld程序

```cpp
#include <iostream>
int main()
{
    std::cout << "Hello Cpp World" << std::endl;
    return 0;
}
```

每个`C++`程序都包含一个或多个**函数（function）**，其中有且只有一个命名为**main**。main函数是`C++`程序的入口。

一个函数的定义包含4个部分：返回类型（return type）、函数名（function name）、形参列表（parameter list）（可以为空）和函数体。

在上面的`main`函数中，返回类型是`int`,函数名是`main`，形参列表为空，函数体是大括号括住的部分。

`main`函数的返回类型必须为`int`，`int`类型是一种内置类型（built-in type），即`C++`自身定义的类型。在函数体的最后一行是`return`，此`return`值类型一定要和函数的返回类型一致，如本例中的`0`就是`int`类型。

**重要概念：类型**

类型是程序设计的最基本概念之一。`C++`类型不仅定义了数据元素的内容，还定义了这类数据上可以进行的运算。（`C`语言的类型只定义了数据元素的内容，而数据类型的运算则定义在类型外）

`C++`中每个变量都有确切的类型。

### 1.1.1 编译、运行程序

#### Windows

打开`Visual Studio 2022`，

![VS2022开始界面](https://s2.loli.net/2022/05/29/8YJqmpGEMfeHXCo.png)

点击创建新项目，选择`C++`，创建空项目，点击下一步，

![创建新项目](https://s2.loli.net/2022/05/29/kaXYlSrmJ8jg9KI.png)

填写项目名称、位置，勾选将解决方案和项目放在同一目录中，点击创建，

![配置新项目](https://s2.loli.net/2022/05/29/Kkeg3vsFVyGLrB7.png)

在打开的`VS`界面的左侧解决方案资源管理器中的源文件上点击右键->添加->新建项，

![添加源文件](https://s2.loli.net/2022/05/29/cDESYTBdxfGPLyI.png)

在左侧选中`Visual `C++``右侧选择`C++`文件，名称修改为`hellocppworld.cpp`，点击添加，

![添加cpp文件](https://s2.loli.net/2022/05/29/6iqXfY4IGhDsN8n.png)

之后，进入了编辑界面，在编辑界面中敲入以下代码：

```cpp
#include <iostream>
int main()
{
    std::cout << "Hello Cpp World" << std::endl;
    return 0;
}
```

![编辑界面](https://s2.loli.net/2022/05/29/qfYgWcj9onrpuQD.png)

点击本地`Windows`调试器或直接按`F5`，`VS`会为我们编译链接此项目，并运行项目，

![运行效果](https://s2.loli.net/2022/05/29/6ZYcDHMKORLjPJV.png)

此时，我们的第一个程序就完成了。

尝试以下把`Hello Cpp World`改成其他内容，然后`F5`运行一下试试。

#### Linux

首先我们登录系统，在终端中执行：

```sh
mkdir hellocppworld
cd hellocppworld
```

然后在终端中执行：

```sh
touch hellocppworld.cpp
vi hellocppworld.cpp
```

如果执行正确的话会进入以下界面：

![编辑模式](https://s2.loli.net/2022/05/29/itZrBnTYexwJbgm.png)

在此界面输入小写的`i`，进入插入模式：

![插入模式](https://s2.loli.net/2022/05/29/DI9Chngu6mRpq1j.png)

在此模式下输入：

```cpp
#include <iostream>
int main()
{
    std::cout << "Hello Cpp World!" << std::endl;
    return 0;
}
```

然后按`Esc`键退出插入模式，然后按`:`(`Shift + ;`)，之后输入`wq`，

![保存并退出](https://s2.loli.net/2022/05/29/vcpkJyjz4o2wnKl.png)

然后按`Enter`键保存输入的内容并退出编辑器。

文件编辑好了，需要手动编译我们的文本文件，在终端中输入：

```sh
g++ hellocppworld.cpp -o hellocppworld
```

![编译源文件](https://s2.loli.net/2022/05/29/AoFDVvhlfCPYyX6.png)

如果没有错误信息，此时我们的源文件就被编译成了可执行文件，可以使用`ls`或`ll -a`指令查看：

![查看可执行文件](https://s2.loli.net/2022/05/29/eCMESJvkubhisD3.png)

如上图所示，绿色的就是我们编译出来的可执行文件，我们可以使用以下指令执行编译的可执行文件：

```sh
./hellocppworld
```

![执行可执行文件](https://s2.loli.net/2022/05/29/Fy6ouvwCad8D1h4.png)

如图，终端中成功的打印出了`Hello Cpp World!`，我们的第一个`C++`程序就编写完成执行成功了！

## 1.2 初识输入输出

**学习大纲：**

* `iostream`
* `std::cin`
* `std::cout`

`C++`并未定义任何输入输出（`IO`）语句，取而代之的是一个全面的标准库来提供`IO`机制。`iostream`库将伴随着我们的`C++`开发生涯。`iostream`库包含了两个基本的流，

* `istream`，input stream，输入流，从键盘输入到电脑
* `ostream`，output stream，输出流，从电脑输出到屏幕

**标准输入输出对象**

* 标准输入对象：`std::cin`
* 标准输出对象：`std::cout`
* 标准错误对象：`std::cerr`
* 标准日志对象：`std::clog`

用的最多的是`cout`，可以重定向输出到文件。`cerr`不会经过缓冲直接输出到屏幕，而clog需要等到缓冲区满或者遇到std::endl后输出到屏幕。

**一个使用IO库的程序**

下面我们来写个简单的两个数相加的程序：

```cpp
#include <iostream>
int main()
{
    std::cout << "Please enter two numbers:" << std::endl;
    int a = 0, b = 0;
    std::cin >> a;
    std::cin >> b;
    std::cout << "The sum of " << a << " and " << b << " is " << a+b << std::endl;
    return 0;
}
```

在程序的第一行我们引入了`iostream`这个`头文件`。引入的头文件的效果和把头文件中的内容复制到当前文档的最前面效果是一样的。

**向流写入数据**

`main`函数体的第一条语句执行了一个表达式（`expression`）。这个表达式使用了**输出运算符**（`<<`）在标准输出上打印消息。

`<<`运算符接受两个运算对象：左侧的运算对象必须是一个`ostream`对象，右侧的运算对象是要牙龈的值。

`std::endl`是一个**操纵符**（`manipulator`），写入`std::endl`相当于写入换行符。当然`std::endl`还有一个作用，那就是刷新缓冲器，将当前缓冲区内的内容刷新到终端上。

**使用标准库中的名字**

`std::cout`和`std::endl`都是定义在`std`的**命名空间**（`namespace`）。命名空间可以帮助我们避免不经意的名字定义冲突，标准库定义的所有名字都在命名空间`std`中。

需要显示的使用**作用域运算符**（`::`）来指出我们想使用定义在命名空间`std`中的`cout`。当然也可以使用`using namespace std;`引入命名空间，从而可以直接使用`cout`而不加`std::`。

**从流读取数据**

**输入运算符**（`>>`）。

如何区分输入运算符和输出运算符？不管是输入运算符和输出运算符，第一个运算对象是流，第二个运算对象都是用户定义实例。`<<`表示从第二个对象到流，数据从对象到流，表示输出，而`>>`则是流到第二个对象，数据从流到对象，表示输入。

## 1.3 注释简介

`C++`中有两种注释，单行注释和界定符对注释。

我们以上一段代码来讲解注释：

```cpp

#include <iostream>
/*
*这个程序的主要作用是：
*接受用户输入的两个数，
*并将两个数相加，
*并输出到终端上。        <----这里是多行注释
*/
int main()
{
    std::cout << "Please enter two numbers:" << std::endl;
    int a = 0, b = 0;
    //从终端接收2个数组并赋给a和b  <---- 单行注释
    std::cin >> a;
    std::cin >> b;
    std::cout << "The sum of " << a << " and " << b << " is " << a+b << std::endl;
    return 0;
}
```

一般如果注释内容比较多或跨越多行，用`/* */`，而如果注释内容较少或不需要跨行，则使用`//`单行注释。现实开发中如果团队内部没有明文规定，可以选择你喜欢的方式。我个人一般只是用单行注释。

值得注意的是，界定符（`/* */`）内是不能嵌套界定符的。

```cpp
#include <iostream>
int main()
{
    std::cout << "/*";
    std::cout << "*/";
    std::cout << /* "*/" /* "/*" */;
    return 0;
}
```

以上程序输出什么？尝试编译运行以下。看看和你猜测的是否相同。

## 1.4 控制流

语句一般是顺序执行的：语句块的第一条先执行，然后是第二天，依次类推。当然多线程存在乱序执行问题，暂且不在讨论范畴。

### 1.4.1 while 语句

`while`语句反复执行一段代码知道给定的条件为假为止。

```cpp {7,8}
#include <iostream>
int main()
{
    int i = 1, max = 100, sum = 0;
    while (i <= max)
    {
        sum += i;
        ++i;
    }
    std::cout << "1+2+3+...+100 = " << sum << std::endl;
    return 0;
}
```

程序第`7`行把当前的`i`加到`sum`上，第`8`行把`i`加`1`，然后判断`i`和`max`的大小，如果`i<=max`成立则继续执行`while`循环内的语句。知道`i == 101`，跳出循环。此时`sum`则从`1`加到了`100`。

值得注意的是，第`7`行使用了**复合赋值运算符**（`+=`），它本质上是一个加法运算符结合一个赋值运算符（`assignment`），等同于：`sum = sum + 1`。

第`8`行则使用了`前缀递增运算符`（`++`），在以上上下文中它的作用等同于`i = i + 1`和`i + =1`。

### 1.4.2 for 语句

我们同样可以使用`for`循环来计算从`1`到`100`的和：

```cpp
#include <iostream>
int main()
{
    int sum = 0, sum = 100;
    for(int i = 0; i <= sum; ++i)
    {
        sum += i;
    }
    std::cout << "1+2+3+...+100 = " << sum << std::endl;
    return 0;
}
```

`for`内部包含两个部分：循环头和循环体。

循环头有`3`个部分：

第1部分，初始化语句，`int i = 0;`只会在执行到`for`循环的时候执行`1`次。

第2部分，循环条件，控制循环是否继续。`i <= sum`，会在每次循环的时候对比一次，如果条件为真，则进入`for`内部代码块执行，如果不为真，则跳出`for`循环。

第3部分，一个表达式，每次循环结束都会执行一次。`++i`，每次`for`内部代码块执行完成后执行。记住这三句的含义，以后遇到奇奇怪怪的`for`循环就不会一脸懵逼了。

### 1.4.3 读取数量不定的输入数据

```cpp
#include <iostream>
int main()
{
    int sum = 0, i = 0;
    while (std::cin >> i)
    {
        sum += i;
    }
    std::cout << "Sum = " << sum << std::endl;
    return 0;
}
```

第`5`行的`while`循环会一直执行知道遇到文件结束符（或输入错误）。Windows系统使用Ctrl+Z表示输入文件结束符（再按`Enter`），而UNIX系统中则使用`Ctrl+D`。

此段程序中，输入的数据的数量是不定的，用户可以一直输入数据，当用户输入完成之后，按`Ctrl+Z`(`Windows`，再按`Enter`)或`Ctrl+D`（`UNIX`）来结束输入。

**再探编译**

编译四步骤：

1. 预处理：替换宏、常量
2. 编译：检查语法错误，并给出提示（具体哪一行）
3. 汇编：把`C/C++`语言转换成汇编语言
4. 链接：链接到库。地址回填。

编译器的一部分工作（2步）是寻找程序文本中的错误。下列是一些常见的错误类型：

* 语法错误（syntax error）
* 类型错误（type error）
* 声明错误（declaration error）

### 1.4.4 if 语句

与大多数语言一样`C++`提供了`if`语句支持条件执行。if语句的基本格式如下：

```cpp
if(codition1)
{
    do_something();
}else if(codition2)
{
    do_something2();
}else{
    do_something3();
}
```

`if`语句中可以搭配多个`else if`，也可以没有`else  if`，但`else` 最多只有一个，当然也可以没有`else`。

当`condition1`为`true`时，会执行`do_something()`，执行完成之后不会再判断后续的`else if` 条件。

当`condition1`为`false`时，会判断`condition2`，如果此时`condition2`为`true`，则执行`do_something2()`。

如果所有的`condition`都为`false`，则执行`else`内的`do_something3`。

```cpp
#include <iostream>

int main()
{
    int a = 10;
    int b = 10 * 2;
    int c = 20;
    if (a == b)
    {
        std::cout << "a equel b" << std::endl;
    }
    else if (a == c)
    {
        std::cout << "a equel c" << std::endl;
    }
    else if (b == c)
    {
        std::cout << "b equel c" << std::endl;
    }
    else
    {
        std::cout << "none of them equel " << std::endl;
    }
    return 0;
}
```

以上代码中，使用`==`判断两个变量是否相等。在C++中，使用`=`赋值，使用`==`比较，两者千万不能搞混。

```cpp
int a = 10;
if(a = 20)
{
    do1();
}
else
{
    do2();
}
```

在`if`语句中不是一个比较语句，而是一个赋值语句。赋值语句的结果是`20`，在`C++`中，对一切非`0`的整数做布尔运算都会返回`true`，所以以上的语句会进入`else`中执行，产生`bug`。

为了避免这样的现象，一般我们会把比较的常量放在前面，如`if(20 == a)`，如果误写成`if(20 = a)`，把一个变量赋给一个常量就会产生一个编译错误，从而暴露问题，`bug`也能很快的修复。

在实际编程中，产生`bug`不可怕，可怕的是产生编译器无法发现的`bug`，如果这种`bug`隐藏较深，在测试中无法被覆盖，将会对项目产生无法预估的风险。

## 1.5 类的介绍

在C++中，我们通过定义一个**类**（`class`）来定义自己的数据结构。

一个类定义了一种类型，以及关联的一组操作。

一个类一般包含两部分，一部分是数据结构，也就是这个类中包含了哪些数据。

另一部分就是算法，这个类可以执行哪些运算。

类是一个对象的模板。对象是按照类中数据结构的定义来生成的。这些对象可以执行类中定义的操作。数据结构定义了类是什么（组成），类关联的方法告诉类能够干什么（执行哪些操作）。

```cpp
class Foo
{
public:
    int x;
    void print(){std::cout << x << std::endl;}
};
```

如上图，我们定义了一个类`Foo`，然后定义了数据结构（`int x`)，还有一个关联的方法（`print`）。

实际上在以`Foo`为模板生成`foo1`和`foo2`对象时，`foo1`和`foo2`是什么呢？这就是一个`int`！

但是当我们看它能干什么时，它可以执行`print`操作，而普通的`int`类型的变量是不能执行`print`操作的。

```cpp
#include <iostream>
class Foo
{
public:
    int x;
    void print(){std::cout << x << std::endl;}
};
int main()
{
    Foo f;
    f.x = 42;
    f.print();
    return 0;
}
```

编译执行，可以看到屏幕上输出了`42`。好了，我们的第一个带类的`C++`程序就完成了！

下一章开始，我们会讲到C++中的变量和基本类型。

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


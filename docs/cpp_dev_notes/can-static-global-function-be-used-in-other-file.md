
# static修饰的全局函数能否在其他文件中使用？

在编译代码的时候发现了一些`util`头文件中包含一些`static`全局函数，心中突然冒出一个念头，`static`全局函数不是不能够在其他文件中使用吗？那么在此头文件中定义的`static`全局函数有什么用？难道能够编译通过？

稍等片刻之后，真的编译通过了，并且没有给出任何错误！

于是我写了一个小`demo`测试我的疑惑：

```cpp
//test.h
#include "stdio.h"
static void static_fun()
{
    printf("hello static_fun\n");
}

//main.c
#include "test.h"
int main(int argc,char* argv[])
{
   static_fun();
}
```

编译如下：

```bash
gcc main.c -o test
./test
hello static_fun
```

竟然编译通过！执行也没任何问题！

难道是书本上的知识有误？或者编译器扩展？想到了编译器，我突然想到编译四步骤中的第一步，**预处理**！**预处理会展开头文件**，那么`main.c`和`test.h`就处于同一个文件中啦！

为了验证我的猜想，我把`test.h`中的`static_fun`声明和定义分开：

```cpp
//test.h
#include "stdio.h"
static void static_fun();

//test.c
#include "test.h"
static void static_fun()
{
    printf("hello static_fun\n");
}

//main.c
#include "test.h"
int main(int argc,char* argv[])
{
   static_fun();
}
```

编译如下：

```bash
gcc main.c test.c -o test
In file included from main.c:1:0:
test.h:2:13: warning: ‘static_fun’ used but never defined
 static void static_fun();
             ^
/tmp/cc40Q5z0.o: In function `main':
main.c:(.text+0x15): undefined reference to `static_fun'
collect2: error: ld returned 1 exit status
```

可以清楚的看出，编译器在编译阶段报出一个警告，`static_fun`未定义，在链接阶段找不到`static_fun`函数。

这个警告比链接错误更值得关注，如果`test.h`和`test.c`不加`static`修饰，那么函数声明在`.h`文件，定义在`.c`文件，声明和定义分离，编译时能够找到函数声明，链接时能够找到函数地址，完全没有任何问题。但加上`static`修饰，`test.h`和`test.c`中的`static_fun`被限制在当前文件中，也就是说，这是两个函数。编译时在`main.c`中展开`test.h`，函数名称找到了，但编译器检测到函数没有定义，编译器报出警告，链接时找不到函数地址，链接错误。

回到最初的问题，`static`全局函数真的不能用于其他文件中吗？

要看你怎么定义其他文件啦！

如果其他文件直接引用`static`函数所在文件（当然预处理的时候会展开，相当于还是在一个文件中），那么在其他文件中是可以使用`static`全局函数的！

测试环境：`Ubuntu 16.4 LTS / GCC 5.4.0`
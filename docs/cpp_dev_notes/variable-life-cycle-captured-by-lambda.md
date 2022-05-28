# C++11中lambda表达式捕获变量的生命周期详解

在C++11中，lambda表达式有两种变量捕获方式，分别为值捕获和引用捕获。这两种捕获的形式如下：

``` c++
#include <iostream>

int main(int argc, char* argv[])
{
    int i = 42;
    auto l1 = [i]() //值捕获
    {
        std::cout << "l1::i = " <<  i << std::endl;
    };
    auto l2 = [&i]() //引用捕获
    {
        std::cout << "l2::i = " << i << std::endl;
    };
    i = 1024;

    l1(); //42
    l2(); //1024

    return 0;
}
//g++ lambda_lifecycle.cpp -o test -std=c++11
```

使用值传递时，编译器将`l1`中的`i`初始化为`main`函数中的`i`相同的值（42），之后，`l1`中的`i`与`main`函数中的`i`不再有任何关系。使用引用传递时则不同，`l2`中的`i`为`main`函数中`i`的副本，两者在内存中的地址是相同的。

所以，在`main`函数中更改`i`的值时，对`l1`无任何影响，而对`l2`有影响。`l1`中的`i`的声明周期与`main`函数中的`i`没有任何关系，`l2`中的`i`的声明周期与`main`函数中的`i`是相同的。这也导致了一个问题：当`lambda`表达式的生命周期大于`main`函数`i`的生命周期时，程序会产生致命错误。

```cpp
#include <iostream>
#include <thread>
#include <chrono>

std::thread t;
void func()
{
    int i = 42;
    std::cout << "address of i:" << &i << " value of i:" << i << std::endl;
    t = std::thread([&i](){
        std::this_thread::sleep_for(std::chrono::seconds(2));
        std::cout << "address of i:" << &i << " value of i:" << i << std::endl;
    });
}

int main(int argc, char* argv[])
{
    func();
    std::this_thread::sleep_for(std::chrono::seconds(1));
    t.join();
    return 0;
}
```

执行结果如下：

```bash
g++ lambda_lifecycle.cpp -o test -std=c++11 -lpthread
./test
address of i:0x7fff7ab11ebc value of i:42
address of i:0x7fff7ab11ebc value of i:0
```

当`func`函数执行完成之后，变量`i`所在地址被弹出栈，等待`2`秒之后，线程`t`对变量`i`执行读取操作是未定义行为。

在使用`lambda`表达式捕获变量时，**永远不要在捕获局部变量时使用引用捕获。**
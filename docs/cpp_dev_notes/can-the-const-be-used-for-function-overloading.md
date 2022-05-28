
# const能否用于函数重载？

因为const关键字在函数签名中可以以不同的方式出现，所以分几种不同的情况：

## const修饰形参，形参为非引用型

```cpp
//test.cpp
#include <iostream>


void func(int a)
{
    std::cout << "Func signature:" << "func(int a)" << std::endl;
}

void func(const int a)
{
    std::cout << "Func signature:" << "func(int a)" << std::endl;
}

int main(int argc, char const *argv[])
{
    int a = 42;
    const int b = 10;
    func(a);
    func(b);
    return 0;
}
//g++ -std=c++11 test.cpp -o test
```

编译无法通过，提示`redefinition of ‘void func(int)’`错误。所以当形参为非引用类型时，在编译器看来，有无const修饰形参都是一样的，两者没有任何区别，是同一个函数。所以此时const不能作为函数重载的依据。

## const修饰形参，形参为引用型

```cpp
//test.cpp
#include <iostream>
void func(int& a)
{
    std::cout << "Func signature:" << "func(int& a)" << std::endl;
}

void func(const int& a)
{
    std::cout << "Func signature:" << "func(const int& a)" << std::endl;
}

int main(int argc, char const *argv[])
{
    int a = 42;
    const int b = 10;
    func(a);
    func(b);
    return 0;
}
//g++ -std=c++11 test.cpp -o test
```

编译通过，执行`test`文件：

```bash
./test
Func signature:func(int& a)
Func signature:func(const int& a)
```

可以清楚的看到，当实参类型是非const的时，执行的是非const修饰形参的函数版本，而当实参类型是const的时，执行的函数是const修饰形参的函数版本。所以此时const可以作为函数重载的依据。

## const修饰形参，形参为指针型

指针和引用非常类似，

```cpp
//test.cpp
#include <iostream>
void func(int* a)
{
    std::cout << "Func signature:" << "func(int* a)" << std::endl;
}

void func(const int* a)
{
    std::cout << "Func signature:" << "func(const int* a)" << std::endl;
}

int main(int argc, char const *argv[])
{
    int a = 42;
    const int b = 10;
    func(&a);
    func(&b);
    return 0;
}
//g++ -std=c++11 test.cpp -o test
```

编译通过，执行`test`文件：

```bash
./test
Func signature:func(int* a)
Func signature:func(const int* a)
```

但是指针情况更为复杂，因为指针分为常量指针（指针为常量，不可修改，但是指向的内容可以修改）和指向常量的指针（指针可以修改，但是不同通过指针更改指针指向的对象），

```cpp
//test.cpp
#include <iostream>

void func(int* a)
{
    std::cout << "Func signature:" << "func(int* a)" << std::endl;
}

void func(int* const a)
{
    std::cout << "Func signature:" << "func(int* const a)" << std::endl;
}

int main(int argc, char const *argv[])
{
    int a = 42;
    const int b = 10;
    int * const c = new int(0);
    func(&a);
    func(c);
    delete c;
    return 0;
}
//g++ -std=c++11 test.cpp -o test
```

编译无法通过，原因和第一种情况类似，不能重定义函数`void func(int*)`，也就是说函数签名`func(int* const a)`中的const被编译器忽略了。

结合第一种情况我们不难得出，在编译过程中，编译器忽略了**顶层const**，而**底层const**被保留了。所以底层const可以作为重载的依据，而顶层const却不能。

## const修饰的常量成员函数

```cpp
//test2.cpp
#include <iostream>
class Demo{
public:
    void func(int a){
        std::cout << "Func signature:" << "Demo::func(int a)" << std::endl;
    }
    void func(int a) const{
        std::cout << "Func signature:" << "Demo::func(int a) const" << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    Demo demo;
    const Demo cst_demo;
    int a = 42;
    demo.func(a);
    cst_demo.func(a);
    return 0;
}
//g++ test2.cpp -std=c++11 -o test
```

执行结果如下：

```bash
./test 
Func signature:Demo::func(int a)
Func signature:Demo::func(int a) const
```

可以看出，可以根据是否在类的成员函数后跟上const来重载成员函数。但是这个重载在形式上并非通过实参是否是const来判断调用函数，而是通过类的实例是否是const的来匹配成员函数。（其实实际上也是，因为`func(int a)`函数真实的签名是`func(Demo&,int)`，而`func(int a) const`的真实签名是`func(const Demo&,int)`，本文不再深究，有兴趣的同学可以研究一下类的成员函数的真实签名。）


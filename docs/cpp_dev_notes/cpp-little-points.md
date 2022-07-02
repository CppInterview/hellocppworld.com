1.override的函数默认是virtual的，可以不用添加virtual关键字。

2.在vc编译器下，如果类有默认构造函数，则可以使用`class c()`或`class c`两种方式声明一个变量c，而在g++编译器下只能使用 `class c`这种方式。

3.类的引用类型成员，必须初始化。从内存的角度上来说，引用成员是一根指针，占sizeof(void*)大小的空间。

```cpp
//test.cpp
#include <iostream>

struct Foo
{
    Foo(char c):cr_(c){}
    char& cr_;
};

int main(int argc, char* argv)
{
    std::cout << sizeof(Foo) << std::endl;
    return 0;
}
//g++ test.cpp -o test
//./test 8/64 4/32
```

4.模板类的实现和模板函数实现一定要放在头文件中，不然会发生链接错误。原因在于，普通的函数调用是可以通过函数签名在链接的时候找到函数地址，回填到call位置。而模板函数需要在编译时生成新的函数，链接时是把新的函数地址回填进去，如果头文件中不存在模板函数的实现，编译时无法生成新函数地址，链接时无法找到对应的地址，自然无法完成链接过程。

```c++
//head.h
int funci(int,int);
template<class M,class N>
auto funct(M,N);
```

```c++
//head.cpp
int funci(int a,int b){return a+b;}
template<class M,class N>
auto funct(M m,N n)->(decltype(m+n)){return m+n;}
```

```c++
//head_test.cpp
#include <iostream>
#include "head.h"

int main(int argc, char const *argv[])
{
    int a =2,b =4;
    std::cout << funci(a,b) << std::endl;
    std::cout << funct(a,b) << std::endl;
    return 0;
}
//g++ -std=c++11 main.cpp head.cpp -o test
```

```bash
g++ -std=c++11 head_test.cpp head.cpp -o test
/tmp/ccL2jAkD.o: In function `main':
head_test.cpp:(.text+0x50): undefined reference to `decltype ({parm#1}+{parm#2}) funct<int, int>(int, int)'
collect2: error: ld returned 1 exit status
```

连接错误，找不到` funct<int, int>(int, int)`，原因是编译的时候头文件中没有`funct`的实现，编译器无法根据M、N生成`funct<M,N>`的特殊版本，链接时自然找不到。

解决办法很简单，把模板函数实现放在头文件中即可：

```c++
//head.h
int funci(int,int);
template<class M,class N>
auto funct(M m,N n)->(decltype(m+n)){return m+n;}
```

```c++
//head.cpp
int funci(int a,int b){return a+b;}
```

编译执行：

```bash
g++ -std=c++11 head_test.cpp head.cpp -o test 
./test 
6
6
```

5.对智能指针解引用返回智能指针持有资源的左值，对这个左值取地址，结果等于智能指针方法`get`返回的裸指针。而直接对智能指针取地址，则返回智能指针的地址。一般智能指针地址在栈上生成，而智能指针持有的资源则在堆中建立。

```c++
//dereference_shared_pointer.cpp
#include <iostream>
#include <memory>
#include <cmath>

struct Foo{
    int x;
    int y;
    float z;
};

int main(int argc, char const *argv[])
{
    auto shptr = std::make_shared<Foo>();
    std::cout << &(*shptr) << std::endl;
    std::cout << shptr.get() << std::endl;
    std::cout << &shptr << std::endl;
    return 0;
}
```

```bash
g++ -std=c++11 dereference_shared_pointer.cpp -o test
./test
0xbaac30   			#堆上
0xbaac30			#堆上
0x7ffe889e8e10		#栈中
```

6.shared_ptr不要传引用，有线程安全问题。

7.容器的emplace一定比push操作快吗？

答案是不一定的。原因在于，如果容器中存储的是类型没有在堆上申请空间，那么`emplace`和`push`操作的速度相当，都是从栈上拷贝到堆上。而如果容器中存储的类型有在堆上申请内存，那么使用`std::move()`把对象转移到容器中，的确可以节省申请内存所使用的时间。一句话来说，如果类型在堆上申请内存，的确有可能，如果没有，则不会更快。

8.`pass-by-value`、`pass-by-reference`、`pass-by-pointer`和`pass-by-rvalue`效率哪个最高，哪个最低？

答案是不确定的。要看具体传递的对象的数据结构。总体来说，有以下规律：

如果sizeof(传递的对象) < 8，则`pass-by-value`效率更高。

如果sizeof(传递的对象) = 8，则`pass-by-value`、`pass-by-reference`和`pass-by-pointer`效率相当。（64位系统）

如果如果sizeof(传递的对象) > 8，则`pass-by-reference`和`pass-by-pointer`效率更高。

如果对象中包含的成员变量在堆上申请了空间，接收方需要存储对象（ STL容器），且传递过变量之后不再使用，则`pass-by-rvalue`效率更高。

9.虚函数可以内联。内联只是给编译器建议。虚函数具体是否内联要看函数体大小、虚函数地址在编译时是否可以确定地址等因素。（final关键字修饰的方法或类）

10.内联的坏处：代码膨胀，cache命中率下降，性能下降。修改内联方法导致所有调用此方法的地方重新编译，增加编译时间。此外，内联函数调试困难。 

11.list遍历性能比array和vector差，因为list在内存中不是连续的，缓存不能命中。

12.初始化线程时如果传入的具名函数需要传递引用，需要使用`std::ref`修饰。

```c++
//pass_reference_to_thread.cpp
#include <iostream>
#include <thread>
void fun(int& a)
{
    ++a;
}
int main(int argc, char const *argv[])
{
    int a = 42;
    std::thread t(fun,std::ref(a)); //这里如果直接传入a，编译错误
    t.join();
    std::cout << a << std::endl;
    return 0;
}
```

编译执行如下：

```bash
g++ pass_reference_to_thread.cpp -o test -std=c++11 -lpthread
./test
42
```

13.std::mem_fn生成指向类的成员函数的指针的包装对象，该对象可以存储复制和执行，该对象的第一个参数是类的对象。

```c++
#include <functional>
#include <iostream>
class Foo{
    public:
    void func1(){
        std::cout << "func1" << std::endl;
    }

    void func2(int j)
    {
        std::cout << j << std::endl;
    }
};

int main(int argc, char const *argv[])
{
    Foo f;
    auto func1 = std::mem_fn(&Foo::func1);
    func1(f);
    auto func2 = std::mem_fn(&Foo::func2);
    func2(f,42);
    return 0;
}
```

14.`std::cout `无法输出`char`指针地址，原因在于`cout`输出`char*`地址时，当做`c`字符串处理，输出的是当前指针指向的内存地址起遇到`\n`结尾的字符串，而非当前指针的地址。

15.`->`运算符返回左值，`.`运算符返回左值或右值取决于`.`运算符的运算对象是左值还是右值。

```c++
struct Foo
{
    int i;
    long l;
};
Foo f;
Foo& getFooRef()
{
    f = {42,1024};
    return f;
}
Foo getFooVal()
{
    return Foo{42,1024};
}

int main(int argc,char* argv[])
{
    getFooRef().i = 100;	//getFooRef return lvalue,so i is lvalue, it's OK
    getFooVal().i = 100;	//getFooVal return rvalue,so i is rvalue, cannot be assigned
}
```

16.派生类中不能重载基类的函数。与基类中函数名相同、参数类型和个数不同的函数只会遮掩基类中的方法。可以在派生类中使用`using Base::func`的方法使得派生类和派生类实例化的对象能够调用基类中被遮掩的方法。

```C++
#include <iostream>

struct Base {
  void func(int) { std::cout << "Base::func" << std::endl; }
};

struct Derived : Base {
  using Base::func; //using Base::func here
  void func() {
    this->func(0);  // if not use using Base::func in Derived class, compiler error
    std::cout << "Derived::func" << std::endl;
  }
};

int main(int argc, char const *argv[]) {
  Derived d;
  d.func();
  d.func(0);  // if not use using Base::func in Derived class, compiler error

  return 0;
}
```


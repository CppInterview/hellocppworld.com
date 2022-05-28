# C++中构造函数、析构函数和虚函数是否应该声明为内联函数？

## 内联函数

内联函数在编译阶段会被展开，这避免了函数压栈和弹栈带来的开销，从而提升性能。那么是否把所有的函数都声明为内联函数呢？答案是否定的，因为

​	1.内联声明只是给编译器的建议，具体是否内联由编译器自行决定

​	2.内联函数会展开，如果内联函数的函数体太大，会使得代码膨胀，增加编译结果的体积

一般体积超过10行的函数是不需要声明为内联函数的，就算声明，编译器也可能不会内联。递归函数不应该内联。

## 构造函数和析构函数

构造函数和析构函数通常不需声明为内联的，因为构造函数和析构函数通常要做一些更复杂的事情，如申请/释放内存，构造/析构对象等操作，一般编译器是不会对其内联。

```cpp
class Demo{
public:
    Demo();
    int func1(){ return 1;} //类内体内隐式内联
    inline int func2();     //类内显式内联
    int func3();
    ~Demo();
};

Demo::Demo(){}
int Demo::func2(){return 2;}
inline int Demo::func3(){return 3;} //类外显式内联
Demo::~Demo(){}
```

## 虚函数

将虚函数声明为`inline`时，要分情况。如果是对象调用虚函数（早绑定，编译时确定调用地址），可能会内联（取决于编译器），如果使用对象的指针或引用调用虚函数（晚绑定，运行时确定调用地址），是不会发生内联的。

```cpp
#include <iostream>

class Base
{
public:
    inline virtual void func()
    {
        std::cout << "Base::func" << std::endl;
    }
};

class Derived : public Base
{
public:
    virtual inline void func() override
    {
        std::cout << "Derived::func" << std::endl;
    }
};

int main()
{
    Derived d;
    Base b = d;
    b.func();   //早绑定
    Base& rb = d;
    rb.func();  //晚绑定
    Base* pb = &d;
    pb->func(); //晚绑定
    return 0;
}
```

使用`-g`选项编译，编译命令：` g++ -std=c++11 -g virtual.cpp -o test`

使用`objdump`查看汇编指令，命令：`objdump -ld test`。汇编代码节选如下：

```assembly
0000000000400986 <main>:
main():
/home/samir/test/virtual.cpp:22
  400986:	55                   	push   %rbp
  400987:	48 89 e5             	mov    %rsp,%rbp
  40098a:	48 83 ec 30          	sub    $0x30,%rsp
  40098e:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
  400995:	00 00 
  400997:	48 89 45 f8          	mov    %rax,-0x8(%rbp)
  40099b:	31 c0                	xor    %eax,%eax
/home/samir/test/virtual.cpp:23
  40099d:	b8 90 0b 40 00       	mov    $0x400b90,%eax
  4009a2:	48 89 45 d0          	mov    %rax,-0x30(%rbp)
/home/samir/test/virtual.cpp:24
  4009a6:	48 8d 55 d0          	lea    -0x30(%rbp),%rdx
  4009aa:	48 8d 45 e0          	lea    -0x20(%rbp),%rax
  4009ae:	48 89 d6             	mov    %rdx,%rsi
  4009b1:	48 89 c7             	mov    %rax,%rdi
  4009b4:	e8 09 01 00 00       	callq  400ac2 <_ZN4BaseC1ERKS_>
/home/samir/test/virtual.cpp:25
  4009b9:	48 8d 45 e0          	lea    -0x20(%rbp),%rax
  4009bd:	48 89 c7             	mov    %rax,%rdi
  4009c0:	e8 a5 00 00 00       	callq  400a6a <_ZN4Base4funcEv>
/home/samir/test/virtual.cpp:26
  4009c5:	48 8d 45 d0          	lea    -0x30(%rbp),%rax
  4009c9:	48 89 45 e8          	mov    %rax,-0x18(%rbp)
/home/samir/test/virtual.cpp:27
  4009cd:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
  4009d1:	48 8b 00             	mov    (%rax),%rax
  4009d4:	48 8b 00             	mov    (%rax),%rax
  4009d7:	48 8b 55 e8          	mov    -0x18(%rbp),%rdx
  4009db:	48 89 d7             	mov    %rdx,%rdi
  4009de:	ff d0                	callq  *%rax
/home/samir/test/virtual.cpp:28
  4009e0:	48 8d 45 d0          	lea    -0x30(%rbp),%rax
  4009e4:	48 89 45 f0          	mov    %rax,-0x10(%rbp)
/home/samir/test/virtual.cpp:29
  4009e8:	48 8b 45 f0          	mov    -0x10(%rbp),%rax
  4009ec:	48 8b 00             	mov    (%rax),%rax
  4009ef:	48 8b 00             	mov    (%rax),%rax
  4009f2:	48 8b 55 f0          	mov    -0x10(%rbp),%rdx
  4009f6:	48 89 d7             	mov    %rdx,%rdi
  4009f9:	ff d0                	callq  *%rax
/home/samir/test/virtual.cpp:30
  4009fb:	b8 00 00 00 00       	mov    $0x0,%eax
/home/samir/test/virtual.cpp:31
  400a00:	48 8b 4d f8          	mov    -0x8(%rbp),%rcx
  400a04:	64 48 33 0c 25 28 00 	xor    %fs:0x28,%rcx
  400a0b:	00 00 
  400a0d:	74 05                	je     400a14 <main+0x8e>
  400a0f:	e8 3c fe ff ff       	callq  400850 <__stack_chk_fail@plt>
  400a14:	c9                   	leaveq 
  400a15:	c3                   	retq
```

其中`virtual.cpp`的第25行发生了编译时绑定，指令是`callq  400a6a <_ZN4Base4funcEv>`，`400a6a`地址是确定的，也就是`Base::func`的地址，而27行和29行则在运行时确定函数地址存放在`rax`寄存器中，然后跳转执行。

 




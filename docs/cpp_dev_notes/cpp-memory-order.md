# std::memory_order内存模型详解

```cpp
typedef enum memory_order
{
	memory_order_relaxed,
	memory_order_consume,
	memory_order_acquire,
	memory_order_release,
	memory_order_acq_rel,
	memory_order_scq_cst
} memory_order;
```

`std::memory_order` 指定如何围绕原子操作对内存访问进行排序（包括常规的非原子内存访问）。当多个线程同时读取和写入多个变量时，一个线程可以观察到值变化的顺序与另一个线程写入它们的顺序可能并不相同。 更甚至，多个读线程观察到的值的变化顺序都可能不同。 由于内存模型允许的编译器对指令重排，即使在单处理器系统上也会发生一些类似的影响。

`STL`库为所有原子操作的提供的默认内存模型是`memory_order_scq_cst`。 该默认内存模型可能会影响性能，所有标准库为原子操作提供一个额外的 `std::memory_order `参数，规定编译器和处理器在重排当前原子操作指令时，必须遵守当前参数的约束。

## memory_order_relaxed

**宽松操作**：没有对其他读或写施加同步或排序约束，只保证该操作的原子性。也就是说当前原子操作之前的读写指令可以排在当前原子操作之后，当前原子操作之后的读写指令也可以排在当前原子操作之前。

```cpp
// Thread 1:
r1 = y.load(std::memory_order_relaxed); // A
x.store(r1, std::memory_order_relaxed); // B
// Thread 2:
r2 = x.load(std::memory_order_relaxed); // C 
y.store(42, std::memory_order_relaxed); // D
```

允许存在`r1 == r2 == 42`的结果存在，原因在于语句D可以重排在语句C之前执行，具体执行顺序为D、A、B、C。

## memory_order_consume

一个**load操作**使用这个内存模型时在受影响的内存位置施行一个**consume操作**：在**当前线程**中，之后的依赖于此原子变量的读和写操作都不能被重排到当前指令前。在**其他线程中**使用`memory_order_release`内存模型对此原子变量进行`store`操作，在当前线程中是可见的。 在大多数平台上，此内存模型仅影响编译器优化。

```cpp
#include <thread>
#include <atomic>
#include <cassert>
#include <string>
 
std::atomic<std::string*> ptr;
int data;
 
void producer()
{
    std::string* p  = new std::string("Hello");
    data = 42;
    ptr.store(p, std::memory_order_release);//由于之前的读写指令不能重排到当前指令之后，所以当ptr改变后，data一定是被改变过的
}
 
void consumer()
{
    std::string* p2;
    while (!(p2 = ptr.load(std::memory_order_consume))) //当前线程中，与ptr相关的指令不可以被重新排序到当前指令之前，也就是不可能出现 assert(*p2 == "Hello") 这条语句翻译的指令排序到当前指令之前
        ;
    assert(*p2 == "Hello"); //所以这条指令断言不可能失败，因为不能排序到当前上条指令之前，执行这条指令是data == 42
    assert(data == 42); //这条语句对应的指令可以被重排在上上条之前，所以可能断言失败
}
 
int main()
{
    std::thread t1(producer);
    std::thread t2(consumer);
    t1.join(); t2.join();
}
```

## memory_order_acquire

一个**load操作**使用这个内存模型时在受影响的内存位置施行一个**acquire操作**：在**当前线程**中，之后读和写操作都不能被重排到当前指令前。在**其他线程中**使用`memory_order_release`内存模型对此原子变量进行`store`操作，在当前线程中是可见的。

```cpp
#include <thread>
#include <atomic>
#include <cassert>
#include <string>
 
std::atomic<std::string*> ptr;
int data;
 
void producer()
{
    std::string* p  = new std::string("Hello");
    data = 42;
    ptr.store(p, std::memory_order_release);//由于之前的读写指令不能重排到当前指令之后，所以当ptr改变后，data一定是被改变过的
}
 
void consumer()
{
    std::string* p2;
    while (!(p2 = ptr.load(std::memory_order_acquire))) //当前线程中，读和写操作不可以被重新排序到当前指令之前
        ;
    assert(*p2 == "Hello"); //这条指令断言不可能失败，因为不能排序到当前上条指令之前
    assert(data == 42); //这条指令断言也不可能失败，因为不能排序到当前上上条指令之前
}
 
int main()
{
    std::thread t1(producer);
    std::thread t2(consumer);
    t1.join(); t2.join();
}
```

## memory_order_release

一个`store`操作使用这个内存模型时执行**release操作**：在**当前线程**中，之前的读和写操作都不能被重排到当前指令之后。当前内存模型结合`memory_order_consume`使用时，称为`release-consume`模型，结合`memory_order_acquire`使用时，称为`release-acquire`模型。两者的区别在于，`consume`只对之后的与当前指令原子变量相关的指令有效（不能重排到当前指令之前），而`acquire`对之后的所有指令有效。

## memory_order_acq_rel

一个**read-modify-write操作**使用这个内存模型时执行一个**acquire操作**和一个**release操作**。在**当前线程**中，之前和之后的读和写操作都不能被重排。在其他线程中，所有对此原子变量执行的`release`操作，在当前线程中的`modify`操作之前是可见的。当前线程对原子变量的`modify`操作，在其他线程中对此原子变量的`load`操作是可见的。

## memory_order_seq_cst

一个**load操作**使用这个内存模型时执行一个**acquire操作**，一个**store操作**使用这个内存模型时执行一个**release操作**。一个`read-modify-write`操作使用这个内存模型时执行一个`acquire`操作和一个`release`操作，另外加上一个单一的总序列，所有的线程都以相同的顺序观察所有修改，完全不允许编译器和CPU重排任何指令。



# C++11中std::shared_ptr是线程安全的吗？

C++11中的`shared_ptr`是线程安全的吗？先说结论，部分是，部分不是。

## shared_ptr自身线程安全性

我们首先看一下`shared_ptr`实现的原理，一个简单的`shared_ptr`实现如下：

```cpp
//shared_point.h
#include <atomic>
template<class T>
class shared_point{
public:
    shared_point(T* p):ptr_(p),cnt_(new std::atomic<int>{1}){}
    shared_point(const shared_point<T>& rhs)
        :ptr_(rhs.ptr_),cnt_(rhs.cnt_)
    {
        ++(*cnt_);
    }
    shared_point(shared_point<T>&&) = delete;
    shared_point<T>& operator=(const shared_point<T>& rhs)
    {
        if(this == &rhs) return *this;
        if(--*cnt_ <= 0)
        {
            delete ptr_;
            delete cnt_;
        }
        ptr_ = rhs.ptr_;
        cnt_ = rhs.cnt_;
        ++(*cnt_);
    }
    shared_point<T>&& operator=(shared_point<T>&&) = delete; 
    ~shared_point(){
        if(--*cnt_ <= 0)
        {
            delete ptr_;
            delete cnt_;
        }
    }

    T operator*(){
        return *ptr_;
    }

    T* operator->(){
        return ptr_;
    }

    int use_count(){
        return *cnt_;
    }
private:
    T* ptr_;
    std::atomic<int>* cnt_;
};
```

当使用pass-by-value的方式传递`shard_ptr`对象时，由于引用计数是原子类型，所有`++`和`--`操作都是线程安全的，不存在由于多线程导致的引用计数问题，释放时同理。

而拷贝赋值同样是线程安全的，因为资源的释放由引用计数决定，而`shared_ptr`对象本身没有和其他对象共享数据（`ptr_`和`cnt_`都是独享，只是指向的对象是共享的），所以也是线程安全的。

所以**使用传值方式传递`shared_ptr`变量，`shared_ptr`是线程安全的。**

验证如下：

```cpp
//shared_ptr.cpp
#include <iostream>
#include <memory>
#include <chrono>
#include <thread>
#include <vector>
#include "shared_point.h"

struct Demo
{
    int i;
    long j;
};

void func(shared_point<Demo> ptr)
{
    shared_point<Demo> demo(new Demo{0,0});
    demo = ptr;
    // std::cout <<"use_count:" << ptr.use_count() << std::endl;
}

int main(int argc, char const *argv[])
{
    shared_point<Demo> demo(new Demo{42,1024});
    std::vector<std::thread> threads;
    threads.reserve(1024*16);
    for (size_t i = 0; i < 1024*16; i++)
    {
        threads.emplace_back([demo](){
            func(demo);
        });
    }
    // std::this_thread::sleep_for(std::chrono::seconds(1));
    // std::cout << demo.use_count() << std::endl;
    for(auto& t:threads){
        t.join();
    }
    std::cout << demo.use_count() << std::endl;
    return 0;
}
//g++ -std=c++11 shared_ptr.cpp -o test -lpthread
//.test
//1
```

`main`函数中启用了`1024*16`个线程，多次执行测试程序，结果一定为`1`。

当使用pass-by-reference方式传递`shared_ptr`时，要注意引用的生命周期不能长于被引用方，否则，当被引用方的计数为`0`，资源被释放后，引用方对于引用对象的任何操作都是未定义的。

同时拷贝赋值同样是非线程安全的，原因在于，`ptr_`和`cnt_`都是共享的，而拷贝赋值并非原子操作，所以可能存在数据竞争。

考虑以下情况：

```cpp
if(--*cnt_ <= 0)
{
    delete ptr_;
    delete cnt_;
}
ptr_ = rhs.ptr_;
cnt_ = rhs.cnt_;
```

当`--*cnt_`为`0`时，自身的`ptr_`和`cnt_`都被释放，此时当前线程的CPU时间片到期，切换到其他线程执行。而这个线程正好要访问这个`shared_ptr`,问题就产生了。

为什么pass-by-value不会出现以上情况呢？因为如果是值传递，如果有另一个线程的`shared_ptr`拥有相同的资源，那么引用计数一定大于等于`2`，而当前线程的引用计数减`1`一定大于`0`!

所以**使用引用方式传递的`shared_ptr`不是线程安全的。**

```cpp
//shared_ptr2.cpp
#include <iostream>
#include <memory>
#include <chrono>
#include <thread>
#include <vector>
#include "shared_point.h"

struct Demo
{
    int i;
    long j;
};

void func1(shared_point<Demo> ptr)
{
    std::this_thread::sleep_for(std::chrono::seconds(1));
    std::cout <<"use_count 1:" << ptr.use_count() << std::endl;
}

void func2(shared_point<Demo>& ptr)
{
    std::this_thread::sleep_for(std::chrono::seconds(1));
    std::cout <<"use_count 2:" << ptr.use_count() << std::endl;
}

std::vector<std::thread> threads(2);
void func(){
    shared_point<Demo> demo(new Demo{42,1024});
    
    threads[0] = std::thread([demo](){
        func1(demo);
    });
    threads[1] = std::thread([&demo](){
        func2(demo);
    });
}

int main(int argc, char const *argv[])
{
    func();
    threads[0].join();
    threads[1].join();
    return 0;
}
//g++ -std=c++11 shared_ptr2.cpp -o test -lpthread
//./test
//use_count 1:2
//use_count 2:-1508628736 未定义的
```

## 对象T的线程安全性

`shared_ptr`所管理的对象的线程安全性不是确定的。这取决于T本身的线程安全性。

如`shared_ptr<std::atomic<int>>`的对象，多线程对其`fetch_add`是安全的，而对象的类型如果是`shared_ptr<std::vector<int>>`，多线程对其`push_back`则是不安全的。


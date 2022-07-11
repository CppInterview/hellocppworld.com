# 第16章 模板与泛型编程

面向对象编程（`OOP`）和泛型编程都能处理在编写程序时不知道类型的情况。不同之处在于：`OPP`能处理类型在程序运行之前都未知的情况；而泛型编程中，在编译时就能获知类型了。

容器、迭代器和算法都是泛型编程的例子。当我们编写一个泛型程序时，独立于任何特定类型来编写的。当使用一个泛型程序时，提供类型或值，程序实例可在其上运行。

模板是泛型编程的基础。一个模板就是一个创建类或函数的蓝图或者公式。当使用一个`vector`泛型类型或者`find`泛型函数时，只需要提供足够的信息，就能够将蓝图转换为特定的类或函数。这种转换发生在编译时。

## 16.1 定义模板

```cpp
int compare(const std::string & v1, const std::string &v2)
{
    if(v1 < v2) return -1;
    if(v2 < v1) return 1;
    return 0;
}

int compare(const std::double & v1, const std::double &v2)
{
    if(v1 < v2) return -1;
    if(v2 < v1) return 1;
    return 0;
}
```

这两个函数除了参数类型不同，其他几乎都是相同的。如果要写不同的类型相比较，多少中类型就要写多少个函数。

### 16.1.1 函数模板

可以定义一个通用的**函数模板**（`function template`），而不是为每个类型都定义一个新的函数。一个函数模板就是一个公式，可以用来生成针对特定类型版函数版本。

```cpp
template<class T>
int compare(const T& v1, const T& t2)
{
    if(v1 < v2) return -1;
    if(v2 < v2) return 1;
    return 0;
}
```

模板定义以关键字`template`开始，后跟一个**模板参数列表（**`template parameter list`），这是一个逗号分隔的一个或多个**模板参数**（`template parameter`）的列表，用小于号（`<`）和大于号（`>`）包围起来。

模板参数列表的作用很像函数参数列表。函数参数列表定义了若干特定类型的局部变量，但并未指出如何初始化他们。在运行时，调用者提供实参来初始化形参。

类似的，模板参数表示类或函数定义中用到的类型或直。当使用模板时，（隐式或显式的）指定**模板实参**（`template parameter`），将其绑定到模板参数上。

**实例化函数模板**

当调用一个函数模板时，编译器通常用函数实参来为我们推断模板实参。

```cpp
std::cout << compare(1,0) << std::endl;			//实例化compare(const int&,const int&)函数
std::cout << compare(1.0,0.5) << std::endl;		//实例化compare(const double&,const double&)函数
std::vector<int> v1{1,2,3};
std::vector<int> v1{4,5,6};
std::cout << compare(v1,v2) << std::endl;		//实例化compare(const std::vector<int> &,const std::vector<int>&)函数
```

编译器用推断出来的模板参数为我们**实例化**（`instantiate`）一个特定版本的函数。当编译器实例化一个模板时，它使用实际的模板实参替代对应的模板参数来创建出模板的一个新“实例”。

**模板类型参数**

`compare`函数有一个**模板类型参数**（`type parameter`）。一般可以将类型参数看作类型说明符，就像内置类型或类类型说明符一样使用。类型参数可以用力指定返回值类型或函数的参数类型，以及在函数体内用于变量声明或类型转换。

```cpp
template<typename T>
T foo(T* p)		//返回类型参数 类型
{
    T temp = *p;	//用于变量声明
    return tmp;
}
```

类型参数前必须使用关键字`class`或`typename`，

```cpp
template<class T,U>
T calc(const T&, const U&);		//错误，U前要加上calss或typename

template<class T,typename U>
T calc(const T&, const U&);		//正确
```

`typename`是在`C++`模板广泛使用之后才引入进来的，某些程序员仍然使用`class`。

**非类型模板参数**

除了定义类型模板参数，还可以在模板中定义**非类型参数**（`nontype parameter`）。一个非类型参数表示一个值而非一个类型。通过一个特定的类型名而非关键字`class`或`typename`来指定非类型参数。

当一个模板被实例化时，非类型参数被一个用户提供的或编译器推断出的值所代替。这些值必须是常量表达式，从而允许编译器在编译时实例化模板。

```CPP
template<unsigned M, unsigned N>
int compare(const char (&p1)[M], const char (&p2)[N])
{
    return strcmp(p1,p2);
}

compare("hello","cppworld");
```

其中`M`被初始化为`6`，`N`被初始化为`9`。

编译器将实例化如下版本的`compare`：

```cpp
int compare(const char (&p1)[6], const char (&p2)[9]);
```

一个非类型参数可以是一个整数，或者只想对象或函数类型的**指针**或**（左值）引用**。绑定到非类型整形参数的实参必须是一个常量表达式。绑定到指针或引用的非类型参数的实参必须具有静态的生存周期。

根本原因在于，只有常量表达式在编译时能够确定结果，只有静态生命周期的指针或引用才能够在在编译时确定地址。模板需要在编译时确定结果，所以不能够使用运行时声明周期的变量，包括整形、引用和指针。

非类型模板参数的模板实参必须是常量表达式。（可以在在编译时求值）

**inline和constexpr的函数模板**

函数模板可以声明为`inline`和`constexpr`的，如同非模板函数一样。

```CPP
template<class T>
inline int compare(const T& v1, const T& v2);

template<class T>
constexpr T get_value(const T* p)
{
    return *p;
}
```

**编写类型无关的代码**

从最初的`compare`函数中得出，编写泛型代码的两个原则：

1. 模板中的函数参数是`const`的引用。（为了能够处理不可拷贝类型，同时大类型速度更快）
2. 函数体中的条件判断仅使用`<`比较运算。（类型只需要支持`<`运算符即可）

```cpp
template<class T>
int compare(const T* v1, const T& v2)
{
    if(v1 < v2) return -1;
    if(v1 > v2) return 1;
    return 0;
}
```

以上代码完全可以实现泛型`compare`函数功能，唯一的缺点是，类型`T`不仅要实现`<`比较功能，还要实现`>`比较功能。

如果我们自己写一个类，需要通过compare比较两个类对象的大小，那么不仅仅要重载`<`运算符，还要重载`>`运算符。而最初的版本只需要重载`<`运算符即可。

**模板编译**

当编译器遇到一个模板定义时，它并不生产代码。只有当我们实例化出模板的一个特定版本时，编译器财会生成代码。当使用（而不是定义）模板时，编译器才生成代码，这一特性影响了我们如何组织代码以及错误如何被检测到。

通常在调用一个函数时，编译器只需要掌握函数的声明。类似的，当使用一个类类型的对象时，类定义必须时可用的，但成员函数的定义不必已经出现。因此，可以把类的定义和函数声明放在头文件中，而普通函数和类的成员函数的定义放在源文件中。

模板则不同，为了生成一个实例化版本，编译器需要掌握函数模板或类模板的成员函数的定义。因此，模板的头文件通常既要包含声明也要包含定义。

函数模板和类模板成员函数的定义通常放在头文件中。

**大多数编译错误都在实例化期间报告**

模板直到实例化时才会生成代码，通常编译器会在三个阶段报告错误。

第一阶段时编译模板本身。这个阶段编译器通常不会发现很多错误。编译器可以检查语法错误，例如忘记分号或者变量名拼错等。

第二阶段时编译器遇到模板使用时。这个阶段编译器仍然没有很多可检查的。对于函数模板的调用，编译器通常会检查实参数目是否正确，还会检查参数类型是否匹配。对于类模板，编译器可以检查用户是否提供了正确的数目的模板实参，但仅限于此。

第三阶段时模板实例化时，只有这个阶段才会发现类型相关的错误。这依赖于编译器如何管理实例化，这类错误可能在链接时才报告。

当我们编写模板时，代码不能时针对特定类型的，但模板代码通常对其所使用的类型有一些假设。最初版本的`compare`模板函数假定传入的参数能够执行`<`操作，具体的`<`操作如何比较，看类的实现。

保证传递给模板的实参支持模板所要求的操作，以及这些操作在模板中能正确工作，是调用者的责任。

### 16.1.2 类模板

**类模板**（`class template`）是用来生成类的蓝图的。与函数模板的不同之处是，编译器不能为类模板推断模板参数类型。

为了使用类模板，必须在模板名后的尖括号中提供额外的信息，用来替代参数的模板实参列表。

**定义类模板**

```cpp
template<typename T>
class Blob
{
public:
  	typedef T value_type;
    typedef typename std::vector<T>::size_type size_type;
    Blob();
    Blob(std::initializer_list<T> li);
    size_type size() const {return data->size();}
    bool empty() const {return data->empry();}
    void push_back(const T& t){data->push_back(t);}
    void push_back(T&& t){data->push_back(std::move(t));}
    void pop_back();
    T& back();
    T& operator[](size_type i);
private:
    std::share_ptr<std::vector>> data;
    void check(size_type i,const std::string& msg) const;
};
```

`Blob`模板有一个名为`T`的模板类型参数，用来表示`Blob`保存的元素的类型。

**实例化类模板**

当使用一个类模板时，必须提供额外信息。额外的信息就是**显式模板实参**（`explicit template argument`）列表，它们被绑定到模板参数上。

```cpp
Blob<int> ia;	//模板实参是int，绑定到形参T上
```

编译器会实例化出一个与下面定义等价的类：

```cpp
template<>
class Blob<int>
{
public:
    typedef typename std::vector<int>::size_type size_type;
    Blob();
    ...
private:
    std::shared_prt<std::vector<int>> data;
 	...
};
```

对于每一种类型，编译器都会生成一个不同的类：

```cpp
Blob<std::string> names;
Blob<double> prices;
```

这连个定义会实例化出两个不同的类。

一个类模板的每个实例都形成一个独立的类。类型`Blob<std::string>`与任何其他`Blob`类型都没有关系，也不会对任何其他`Blob`类型的成员有特殊访问权限。

**在模板作用域中引用奴版类型**

在阅读模板代码时，记住类模板的名字不是一个类型名。类模板用来实例化类型，而一个实例化的模板类型总包含模板参数。

一个实例化的模板类型可以当作模板参数传入模板类型。

```cpp
std::shared_ptr<std::vector<int>> data;
```

`std::vector<int>`是一个使用`int`类型实例化的模板类型，而它又被当作模板类型参数传入到`std::shared_ptr<T>`中。

**类模板的成员函数**

与其他类相同，既可以在类模板内部，也可以在类模板外部为其定义成员函数，并且定义在类模板内的成员函数被隐式声明为内联函数。

类模板的成员函数本身是一个普通函数。但是，类模板的每个实例都有属于自己版本的成员函数。因此，类模板的成员函数具有和模板相同的模板参数。因此，定义在类模板之外的成员函数就必须以关键字`template`开始，后接类模板参数列表。

```cpp
ret-type StrBlob::member-name(parm-list)
//对应的Blob的成员应该是
template<class T>
ret-type Blob<T>::member-name(parm-list)
```

**check和元素访问成员**

```CPP
template<typename T>
void Blob<T>::check(size_type i,const std::string& msg) const
{
    if(i >= data.size())
    {
        throw std::out_of_range(msg);
    }
}

template<class T>
T& Blob<T>::back()
{
    check(0,"back on empty Blob");
    return data->back();
}

template<class T>
T& Blob<T>::operator[](size_type i)
{
    check(i,"subscript out of range");
    return (*data)[i];
}

template<class T>
void Blob<T>::pop_back()
{
    check(0, "pop_back on empty Blob");
    data->pop_back();
}
```

 **Blob构造函数**

与其他任何定义在模板外的成员一样，构造函数的定义也要以模板参数开始/

```cpp
template<class T>
Blob<T>::Blob():data(std::make_shared<std::vector<T>()){}

template<class T>
Blob<T>::Blob(std::initializer_list<T> li):data(std::make_shared<std::vector<T>>(li)){}
```

**类模板成员函数的实例化**

默认情况下，一个类模板的成员函数只有当程序使用它的时候才进行实例化。

```cpp
Blob<int> squares = {0,1,2,3,4,5,6,7,8,9};
for(size_t i = 0; i < squares.size(); ++i)
{
    squares[i] = i*i;
}
```

实例化`Blob<int>`类和它的三个成员函数：`operator[]`、`size`和接受`initializer_list<int>`的构造函数。

如果一个成员函数没有被使用，则它不会被实例化。成员函数只有在被用到时才进行实例化，这一特征使得某些类型不完全符合模板操作的要求，仍然能用该类型实例化模板类。

**在类代码内简化模板类名的使用**

在类模板自己的作用域中，可以直接使用模板名而不提供实参。

```cpp
template<class T>
class BlobPtr
{
public:
    BlobPtr():curr(0){}		//这里的BlobPtr<T> 的T可以省略
    BlobPtr(Blob<T> &a, size_t sz = 0): wptr(a.data). curr(sz) {}
    T& operator*() const
    {
        auto p = check(curr, "dereference past end");
        return (*p)[curr];
    }
    BlobPtr& operator++();	//返回BlobPtr&，而不是BlobPtr<T>&
    BlobPtr& operator--();	//返回BlobPtr&，而不是BlobPtr<T>&
private:
    std::shared_ptr<std::vector<T>> check(std::size_t,const std::string&) const;
    std::weak_ptr<std::vector<T>> wptr;
    std::size_t curr;
};
```

**在类模板外使用类模板名**

```cpp
template<class T>
BlobPtr<T> BlobPtr<T>::operator(int)	//模板类的作用域外必须使用<T>
{
    BlobPtr ret = *this;	//作用域内不需要加上<T>
    ++*this;
    return ret;
}
```

在一个模板的作用域内，可以直接使用模板名而不必指定模板实参。

**模板类和友元**

当一个类包含一个友元声明时，类与友元各自是否时模板相互没有关系。

如果一个模板包含一个非模板友元，则友元被授权可以访问所有模板实例。如果友元自身是模板，类可以授权给所有友元模板实例，也可以授权给特定实例。

**一对一友好关系**

```CPP
template<class>
class BlobPtr;
template<class>
class Blob;
template<class T>
bool operator==(const Blob<T>&, const Blob<T>&);

template<class T>
class Blob
{
  friend class BlobPtr<T>;
  friend bool operator<T>==(const Blob<T>&, const Blob<T>&);
};
```

友元的声明用`Blob`的模板形参作为他们自己的模板实参，因此好友关系被限定在用相同类型实例化的`Blob`和`BlobPtr`。

```cpp
Blob<char> ca;	//BlobPtr<char> 和 operator==<char>都是本对象的友元
Blob<int> ca;	//BlobPtr<int> 和 operator==<int>都是本对象的友元
//但是Blob<char>和BlobPtr<int> 及 operator==<int>没有友元关系
```

**通用和特定的模板好友关系**

一个类可以将另一个模板的每个实例都声明为自己的友元，或者限定特定的实例为友元。

```cpp
template<class T>
class Pal;
class C
{
  friend class Pal<C>;	//用类C实例化的Pal是C的一个友元
  template<class T>
  friend class Pal2;	//Pal2的所有实例都是C的友元
};
template<class T>
class C2
{
  friend class Pal<T>;	//C2的每个实例将相同实例化的Pal声明为友元
  template<class X>
  friend class Pal2;	//Pal2的所有实例都是C2每个实例的友元
  friend class Pal3;	//Pal3是C2所有实例的友元
};
```

**令模板自己的类型参数成为友元**

新标准中，可以将模板类型参数声明为友元：

```cpp
template<class Type>
class Bar
{
    friend Type  
};
```

虽然友元通常应该是一个类或一个函数，但可以用一个内置类型来实例化`Bar`。这种与内置类型的友好关系是允许的，以便我们使用内置类型来实例化`Bar`这样的类。

**模板类型别名**

类模板的一个实例定义了一个类类型，与任何其他类类型一样，可以定义一个`typedef`来引用实例化的类：

```cpp
typedef Blob<string> StrBlob;
```

新标准允许为类模板定义一个类型别名：

```cpp
template<class T>
using twin = pair<T,T>;
twin<string> authors;	//等同于 pair<string,string> authors;

template<class T>
using partNo = pair<T, unsigned>;
partNo<string> books;	// == pair<string, unsigned> books;
```

**类模板的static成员**

```cpp
template<class T>
class Foo
{
public:
    static std::size_t count() {return ctr;}
private:
    static std::size_t ctr;
};
template<class T>
std::size_t Foo<T>::ctr = 0;

Foo<int> fi;
auto ct = Foo<int>::count();	//正确
ct = fi.count();	//正确
ct = Foo::count();	//错误，Foo不是一个完整的类型，需要参数T才是完整的类型
```

### 16.1.3 模板参数

通常将类型参数命名为`T`，但实际上可以使用任何名字。

```cpp
template<class Foo>
Foo calc(const Foo& a, const Foo& b)
{
    Foo tmp =a;
    //...
    return tmp;
}
```

**模板参数与作用域**

模板参数遵循普通的作用域规则。但是在模板内部不能重用模板参数名。模板参数不能重用，一个模板参数名称在一个特定模板参数列表中只能出现一次。

```cpp
typedef double A；
template<class A, class B> //隐藏外层作用域中的A
void f(A a, B b)
{
    A tmp = a;
    double B;		//错误，不能重新声明类型模板B
}

template<class T,class T> ...	//错误，T只能被用一次
```

**模板声明**

模板声明必须好汉模板参数。

```cpp
template<class T>
int compare(const T&,const T&);	//声明一个模板函数

template<class T>
class Blob;		//声明一个模板类，但没有定义
```

与函数参数相同，声明中的模板参数的名字不必与定义中的相同。

```cpp
template<class T> T calc(const T&, const T&);	//模板声明
template<class U> T calc(const U&, const U&);	//模板声明
//模板函数定义
template<class Type>
Type calc(const Type& a, const Type& b)
{
    ....
}
```

一个给定模板的每个声明和定义必须有相同数量和种类的参数。

一个特定文件所需的所有模板的声明通常一起放置在文件开始位置，出现在任何使用这些模板的代码之前。

**使用类的类型成员**

在非模板代码中，使用作用域运算符（`::`）访问`static`成员和类型成员。

### 16.1.4 成员模板

### 16.1.5 控制实例化

### 16.1.6 效率和灵活性

## 16.2 模板实参推断

### 16.2.1 类型转换与模板类型参数

### 16.2.2 函数模板显式实参

### 16.2.3 尾置返回类型与类型转换

### 16.2.4 函数指针和实参推断

### 16.2.5 模板实参推断和引用

### 16.2.6 理解std::move

### 16.2.7 转发

## 16.3 重载与模板

## 16.4 可变参数模板

### 16.4.1 编写可变参数函数模板

### 16.4.2 包扩展

### 16.4.3 转发参数包

## 16.5 模板特例化




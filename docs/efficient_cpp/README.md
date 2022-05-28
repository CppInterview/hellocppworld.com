# 《Effective C++ 改善程序与设计的55个具体做法》读书笔记

## 1 .让自己习惯C++

### 条款01 视C++为一个语言联邦

* `C`
* `Object-Oriented C++`
* `Template C++`
* `STL`
* `C++`高效编程守则视情况而变化，取决于你使用`C++`的哪一部分。

### 条款02 尽量与const，enum，inline替换#define

* 对于单纯常量，最好以`const`对象或`enums`替换`#defines`。
* 对于形似函数的宏（`macros`），最好改用`inline`函数替换`#defines`。

### 条款03 尽可能使用const

* 将某些东西声明为`const`可以帮助编译器侦测出错误用法。`const`可被施加于任何作用域内的对象、函数参数、函数返回类型、成员函数本体。
* 编译器强制实施`bitwise constness`，但你编写程序时应该使用“概念上的常量性”（`conceptual constness`）。
* 当`const`和`non-const`成员函数有着实质等价的实现时，令`con-const`版本调用`const`版本可避免代码重复。

### 条款04 确定对象使用前已被初始化

* 为内置类型对象进行手工初始化，因为`C++`不保证初始化他们。
* 构造函数最好使用成员初始值列（`member initialization list`），而不要在构造函数本体内使用赋值操作（`assignment`）。初始值列列出的成员变量，其排列次序应该和它们在`class`中声明的次序相同。
* 为免除“跨编译单元之初始化次序”问题，请以`local static`对象替换`non-local static`对象。

## 2. 构造/析构/赋值运算

### 条款05 了解C++默认编写并调用哪些函数

* 编译器可以暗自为`class`创建`default`构造函数、`copy`构造函数和`copy assignment`操作符，以及析构函数。（`C++11`开始还有`move constructor` 和`move assignment`）。

### 条款06 若不想使用编译器自动生成的函数，就应该明确拒绝

* 为驳回编译器自动（暗自）提供的机能，可将相应的成员函数声明为`private`并且不予实现。使用像`uncopyable`这样的`base calss`也是一种做法。（`C++11`以后可以使用`=delete`告诉编译器删除不需要的成员函数。）

### 条款07 为多态积累声明virtual析构函数

* 多态性质的`base calsses`应该声明一个`virtual`析构函数。如果`class`带有任何`virtual`函数，它就应该拥有一个`virtual`析构函数。
* `Classes`的设计目的如果不是作为`base classes`使用，或不是为了具备多态（`polymorphically`），就不应该声明`virtual`析构函数。

### 条款08 别让异常逃离析构函数

* 析构函数绝对不要吐出异常。如果一个被析构哈你数调用的函数可能抛出异常，析构函数应该捕捉人分和异常，并吞下它们或结束程序。
* 如果客户需要对某个操作函数运行期间抛出的异常做出反应，那么`class`应该提供一个普通函数（而非析构函数中）执行该操作。

### 条款09 绝不在构造和析构过程中调用virtual函数

* 在构造和析构期间不要调用`virtual`函数，因为这类调用从不下降至`derived class`。

### 条款10 令operator=返回一个reference to *this

* 为了实现“连锁赋值”，应该令`operator=`返回一个`reference to *this`。

### 条款11 在operator=中处理“自我赋值”

* 确保当对象自我赋值时`operator=`有良好的行为。其中技术包括比较“来源对象”和“目标对象”的地址、精心周到的语句顺序、以及`copy-and-swap`。
* 确定任何函数如果操作一个以上的对象，而其中多个对象时同一个对象时，其行为仍然正确。

### 条款12 复制对象时勿忘其每一个成分

* `Copying`函数应该确保赋值“对象内的所有成员变量”及“所有base class”成分。
* 不要尝试以某个`copying`函数实现另一个`copying`函数。应该将共同机能放在第三个函数中，并有两个`copying`函数共同调用。

## 3. 资源管理

### 条款13 以对象管理资源

* 为了防止资源泄露，请使用`RAII`对象，它们在构造函数中获得资源并在析构函数中释放资源。
* 两个常被使用的`RAII Class`分别时`tr1::shared_ptr`和`auto_ptr`。前者通常是较好的选择，因为其`copy`行为比较直观。若选择`auto_ptr`，赋值动作会使它（被复制物）指向null。（`C++11`中使用`std::shared_ptr`、`std::unique_ptr`和`std::weak_ptr`代替了两者。）

### 条款14 在资源管理类中小心copying行为

* 复制`RAII`对象必须一并复制它所管理的资源，所以资源的`copying`行为决定`RAII`对象的`copying`行为。
* 普通常见的`RAII class copying`行为是：抑制`copying`、实行引用计数法（`reference counting`）。不过其行为也都可以被实现。

### 条款15 在资源管理类中提供对原始资源的访问

* `APIs`往往要求访问原始资源（`raw resources`），所以每一个`RAII Class`应该提供一个“取得其所管理之资源”的办法。
* 对原始资源的访问可能经由显式转换或隐式转换。一般而言显式转换比较安全，隐式转换对客户比较方便。

### 条款16 成对使用new和delete时要采取相同形式

* 如果在`new`表达式中使用`[]`，必须在相应的`delete`表达式中也使用`[]`。如如果在`new`表达式中不使用`[]`，一定不要在相应的`delete`表达式中也使用`[]`。

### 条款17 以独立语句蒋newed对象置入智能指针

* 以独立语句将`newed`对象存储于（置入）智能指针内。如果不这样做，一旦异常被抛出，有可能导致难以察觉的资源泄露。

## 4. 设计与声明

### 条款18 让接口容易被正确使用，不易被吴用

* 好的接口很容易被正确使用，不容易被误用。应该在所有的接口中努力达成这些性质。
* “促进正确使用”的办法包括接口的一致性，以及与内置类型的行为兼容。
* “阻止误用”的办法包括建立新类型、限制类型上的操作，束缚对象值，以及消除客户的资源管理责任。

### 条款19 设计class犹如设计type

* `Class`的设计就是`type`的设计。应该带着和“语言设计者当初设计语言内置类型”时一样的谨慎来研讨`class`的设计。

### 条款20 宁以pass-by-reference-to-const 替换 pass-by-value

* 尽量以`pass-by-reference-to-const`替换`pass-by-value`。前者通常比较高效，并可避免切割问题。（`slicing problem`）
* 以上规则并不适用于内置类型，以及`STL`的迭代器和函数对象。对它们而言，`pass-by-value`往往比较适当。

### 条款21 必须返回对象时，别妄想返回其reference

* 绝不要返回`pointer`或`reference`指向一个`local stack`对象，或返回`reference`指向一个`heap-allocated`对象，或返回`pointer`或`reference`指向一个`local static`对象而有可能同事需要多个这样的对象。

### 条款22 将成员变量声明为private

* 切记将成员变量声明为`private`。这可赋予客户访问数据的一致性、可细微划分访问控制、允诺约束条件获得保证，并提供`class`作者以充分的实现弹性。
* `protected`并不比`public`更具封装性。

### 条款23 宁以non-member、non-friend替换number函数

* 宁可拿`non-member non-friend`函数替换`member`函数。这样做可以增加封装性、包裹弹性（`packing flexibility`）和机能扩充性。

### 条款24 若所有参数皆需类型转换，请为此采用non-number函数

* 如果需要为某个函数的所有参数（包括被`this`指针所指向的那个隐喻参数）进行类型转换，那么这个函数必须是个`non-member`。

### 条款25 考虑写出一个不抛弃异常的swap函数

* 当`std::swap`对你的类型效率不高时，提供一个`swap`成员函数，并确定这个函数不抛出异常。
* 如果你提供一个`member swap`，也该提供一个`non-member swap`用来调用前者。对于`class`（而非`template`），也请特化`std;;swap`。
* 调用`swap`时应针对`std::swap`使用`using`声明式，然后调用`swap`并且不带任何“命名空间资格修饰”。
* 为“用户定义类型”进行`std templates`全特化时好的，但千万不要尝试在`std`内加入某些对`std`而言全新的东西。

## 5. 实现

### 条款26 尽可能延后变量定义式的出现时间

* 尽可能延后变量定义式的出现。这样做可增加程序的清晰度并改善程序效率。

### 条款27 尽量少做转型动作

* 如果可以，尽量避免转型，特别时在注重效率的代码中避免`dynamic_casts`。如果有个设计需要转型动作，试着发展无需转型的替代设计。
* 如果转型时必须的，试着将它隐藏于某个函数背后。客户随后可以调用该函数，而不需将转型放进自己的代码内。
* 宁可使用`C++-style`（新式）转型，而不是用旧式转型。前者很容易辨识出来，而且也比较有着分门别类的执掌。

### 条款28 避免返回handles指向对象内部成员

* 避免返回`handles`（包括`references`、指针、迭代器）指向内部对象。遵守这个条款可增加封装性，帮助`const`成员函数的行为像个`const`，并将发生`dangling handlers`的可能性降至最低。

### 条款29 为“异常安全”而努力是值得的

* 异常安全函数（`Exception-salf functions`）即使发生异常也不会泄露资源或允许任何数据结构破坏。这样的函数区分为三种可能的保证：基本型、强烈型、不抛异常型。
* “强烈保证”往往能够以`copy-and-swap`实现出来，但“强烈保证”并非对所有函数都可以实现或具备实现意义。
* 函数提供的“异常安全保证”通常最高只等于其所调用之各个函数的“异常安全保证”中的最弱者。

### 条款30 透彻了解inlining的里里外外

* 将大多数`inlining`限制在小型、被频繁调用的函数身上。这可使日后的调试过程和二进制升级（`binary upgradability`）更容易，也可使潜在的代码膨胀问题最小化，使程序的速度提升机会最大化。
* 不要只因为`function templates`出现在头文件，就将它们声明为`inline`。

### 条款31 将文件间的编译依存关系降至最低

* 支持“编译依赖最小化”的一般构想是：依赖于声明式，不要依赖于定义式。基于此构想的两个手段时`Handle classes`和`Interface classes`。
* 程序库头文件应该以“完全且仅有声明式”（`full and declaration-only forms`）的形式存在。这种做法不论是否设计`templates`都适用。

## 6. 继承与面向对象

### 条款32 确定你的public继承塑模出Is-a关系

* “`public`继承”意味`Is-a`。适用于`base class`身上的每一件事情一定也适用于`derived classes`身上，因为每一个“derived class”对象也是一个`base class`对象。

### 条款33 避免遮掩继承而来的名称

* `derived class`内的名称会遮掩`base class`内的名称。在`public`继承下从来没有人希望如此。
* 为了让被遮掩的名称再见天日，可使用`using`声明式或转交函数（`forwarding functions`）。

### 条款34 区分接口继承和实现继承

* 接口继承和实现继承不同。在`public`继承之下，`derived classes`总是继承`base class`的接口。
* 纯虚（`pure virtual`）函数只具体指定接口继承。
* 非纯虚（`impure virtual`）函数具体指定接口继承及缺省实现继承。
* `non-virtual`函数具体指定接口继承预计强制性实现继承。

### 条款35 考虑virtual函数以外的其他选择

* `virtual`函数的替代方案包括`NVI`手法及`Strategy`设计模式的多种形式。`NVI`手法自身时一个特殊形式的`Template Method`设计模式。
* 将机能从成员函数移到`class`外部函数，带来的一个缺点时，非成员函数无法访问`class`的`non-public`成员。
* `tr1::function`（`C++11`已经移到`std::function`）对象的行为就像一般函数指针。这样的对象可接纳“与给定之目标签名式（`target signature`）兼容”的所有可调用物（`callable entities`）。

### 条款36 绝不重新定义继承而来的non-virtual函数

* 绝对不要重新定义继承而来的`non-virtual`函数。

### 条款37 绝不重新定义继承而来的缺省参数

* 绝对不要重新定义一个继承而来的缺省参数值，因为缺省参数值是静态绑定，而`virtual`函数——你唯一应该覆写的定西——确是动态绑定。

### 条款38 通过复合塑模出has-a或“根据某物实现出”

* 复合（`composition`）的意义和`public`继承完全不同。
* 在应用域（`application domain`），复合意味着`has-a`（有一个），在实现域（`implementation domain`），复合意味着`is-implemented-in-terms-of`（根据某物实现出）。

### 条款39 明智而审慎的使用private继承

* `Private`继承意味着`is-implemented-in-terms-of`（根据某物实现出）。它通常比复合（`composition`）的级别低。但是当`derived class` 需要访问`protected base class`的成员，或需要重新定义继承而来的`virtual`函数时，这么设计时合理的。
* 和复合（`composition`）不同，`private`继承可以造成`empty base`最优化。这对致力于“对象尺寸最小化”的程序库开发者而言，可能很重要。

### 条款40 明智而审慎的使用多重继承

* 多重继承比单一继承复杂。它可能导致新的歧义性，以及对`virtual`继承的需要。
* `virtual`继承会增加大小、速度、初始化（及赋值）复杂度等成本。如果`virtual base classes`不带任何数据，将时最具有实用价值的情况。
* 多重继承的确有正当用途。其中一个情节涉及“`public`继承某个`interface class`”和“`private`继承某个协助实现的`class`”的两相组合。

## 7. 模板与泛型编程

### 条款41 了解隐式接口和编译器多态

* `classes`和`templates`都支持接口（`interface`）接多态（`polymorphism`）。
* 对`classes`而言接口时显式的（`explicit`），以函数签名为中心，多态则是通过`virtual`函数发生于运行期。
* 对于`templates`参数而言，接口是隐式的（`implicit`），奠基于有效表达式。多态则时通过`template`具现化和函数重载 解析（`function overloading resolution`）发生于编译期。

### 条款42 了解typename的双重意义

* 声明`template`参数时，前缀关键字`class`和`typename`可互换。
* 请使用关键字`typename`标识嵌套从属类型名称；但不得在`base class lists`（基类列）或`member initialization list`（成员初始值列）内以它最为`base class` 修饰符。

### 条款43 学习处理模板化基类内的名称

* 可在`derived class templates`内通过`this->`指涉`base class templates`内的成员名称，或由一个明白写出的“`base class`资格修饰符”完成。

### 条款44 将与参数无关的代码抽离templates

* `Templates`生成多个`classes`和多个函数，所有任何`template`代码都不该与某个造成膨胀的`template`参数产生相依关系。
* 因非类型模板参数（`non-type template parameters`）而造成的代码膨胀往往可以消除，做法是以函数参数或`class`成员变量替换`template`参数。

### 条款45 运用成员函数末班接受所有兼容类型

* 请使用`member functions templates`（成员函数模板）生成“可接受所有兼容类型”的函数。
* 如果你声明`member templates`用于“泛化`copy`构造”或“泛化`assignment`操作”，你还是需要声明正常的`copy`构造函数和`copy assignment`操作符。

### 条款46 需要类型转换时请为模板定义非成员函数

* 当编写一个`class template`，而它所提供的“与此`template`相关的”函数支持“所有参数之隐式类型转换”时，请将那些函数定义为“`class template`内部的`friend`函数”。

### 条款47 请使用traits classes表现类型信息

* `Traits classes`使得“类型相关信息”在编译期可用。它们以`template`和"`template`特化"完成实现。
* 整合重载技术（`overloading`）后，`traits calsses`有可能在编译器对类型执行`if...else`测试。

### 条款48 认识template元编程

* `Template metaprogramming`（`TPM`，模板元编程）可将工作由运行期移到编译期，因而得以实现早期错误侦测和更高的执行效率。
* `TMP`可被用来生成“基于政策选择组合”（`based on combinations of policy choices`）的客户定制代码，也可用来避免生成对某些特殊类型并不适合的代码。

## 8. 定制new和delete

### 条款49 了解new-handler的行为

* `set_new_handler`允许客户指定一个函数，在内存分配无法获得满足时被调用。
* `Nothrow new`是一个颇为局限的工具，因为它只适用于内存分配，后继的构造函数调用还是可能抛出异常。

### 条款50 了解new和delete的合理替换时机

* 有许多理由需要写个自定义的`new`和`delete`，包括改善效能、对`heap`运用错误进行调试、收集`heap`使用信息。

### 条款51 编写new和delete时需固守常规

* `operator new`应该内含一个无穷循环，并在其中尝试分配内存，如果它无法满足内存需求，就该调用`new-handler`。它也应该有能力处理`0 byte`申请。`class`专属版本则还应该处理“比正确大小更大的（错误）申请”。
* `operator delete`应该在收到`null`指针时不做任何事。`class`专属版本则还应该处理“比正确大小更大的（错误）申请”。

### 条款52 写了placement new也要写placement delete

* 当你写一个`placement operator new`，请确定也写出对应的`placement operator delete`。如果没有这样做，你的程序可能会发生隐微而时断时续的内存泄露。
* 当你声明`placement new`和placement delete时，确定不要无意识（非故意）的掩盖了它们的正常版本。

## 9. 杂项讨论

### 条款53 不要轻忽编译器的警告

* 请严肃对待编译器发出的警告信息。努力在你的编译器的最高（最严苛）警告级别下争取“无任何警告”的荣誉。
* 不要过度依赖编译器的报警能力，因为不同的编译器对待事情的态度并不相同。一旦移植到另一个编译器上，你原本依赖的警告信息有可能消失。

### 条款54 让自己熟悉包括TR1在内的标准程序库

* `C++`标准库的主要机能由`STL`、`iostreams`、`locales`组成。并包含`C99`标准程序库。
* `TR1`添加了智能指针（例如`tr1::shared_ptr`）、一般化函数指针（`tr1::function`）、`hash-based`容器（`unorderd_map,unordered_set`）、正则表达式(`regular expressions`)以及另外10个组件的支持。
* `TR1`自身只是一份规范。为了获得`TR1`提供的好处，你需要一份实物。一个好的实物来源时`Boost`。

### 条款55 让自己熟悉Boost 

* `Boost`是一个社群，也是一个网站。致力于免费、源码开放、同僚复审的`C++`程序库开发。`Boost`在`C++`标准化过程中扮演深具影响力的角色。
* `Boost`提供许多`TR1`组件的实现品，以及其他许多程序库。
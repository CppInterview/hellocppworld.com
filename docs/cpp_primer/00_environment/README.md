# 第0章 环境配置


## 0.1 C++开发有哪些环境需要配置？

首先，我们需要选择一个**操作系统**。`Window`，`Linux`和`MacOs`都可以。

其次，我们需要一个**编译器**，目前可选的有`msvc`、`gcc`和`llvm`。

最后，我们需要选择一款顺手的**IDE**，可选择的有`Visual Studio`、`vscode`、`vim`等等。

如果你是萌新，我的建议是`Windows+Visual Studio`，在安装`vs`的时候会自动安装`msvc`编译器，装完即用，无需任何其他的配置。写完代码F5一键调试/运行，同时还支持图形界面的断点调试，极大方便了新手学习`C++`开发的过程。事实上，我本人最开始也是使用这一套工具学习`C++`的。

如果你熟悉`Linux`系统，我推荐你使用`Linux+vscode+gcc/g++`，只有了解代码编译的流程，才能更好的解决各种编译问题。而`Linux`环境需要你手动编译代码和执行编译结果。

如果你是`vim`大神，那请自便。

本系列视频我准备在前7章基础课程中使用Windows+Visual Studio环境，后续的章节使用`Linux+vscode+gcc/g++`环境，让大家熟悉一下`Linux`下`C++`的开发流程。

## 0.2 如何配置C++开发环境？

### 0.2.1 Windows环境配置

首先我们来配置`Windows`下的开发环境，我是用的是`Windows 11`操作系统，`IDE`选用`Visual Studio 2022 Community`，个人开发者选用`Community`版本是免费的，而且对于我们来说`Community`版本的功能已经完全够用。

https://visualstudio.microsoft.com/zh-hans/vs/

![vs下载地址](https://s2.loli.net/2022/05/29/EqoMKCfSuxa41Xh.png)

下载完成后双击，

![Installer](https://s2.loli.net/2022/05/29/9XMpqCu6UbYFEvB.png)

点击继续，

![选择安装项](https://s2.loli.net/2022/05/29/ecUJj9QGIdyrT2O.png)

选择”使用C++的桌面开发“，点击安装，Visual Studio Installer开始下载相关组件并且安装到本地。安装完成后首次启动需要你登录，也可以创建一个免费的Microsoft账号登录。

![登录](https://s2.loli.net/2022/05/29/GleoWTSDhimYIBH.png)

登录完成之后`Windows`上的`C++`开发环境就配置完成了。

### 0.2.2 Linux环境配置

`Linux`发行版本较多，本文将以`Ubuntu 22.04 LTS`演示，其他发行版本大同小异。

首先登录`Linux`，在终端中执行：

```sh
sudo apt install gcc g++ -y
```

执行完命令之后，可以在终端中执行：

```sh
g++ -v
```

![验证C++开发环境](https://s2.loli.net/2022/05/29/yHI4YXuQVicegpU.png)

如果出现以上界面，就证明`C++`开发环境安装完成了。

当然你可以装个`vscode`当Linux桌面的`C++`开发`IDE`，也可以直接使用Linux系统自带的vim作为编辑工具。`vscode`安装不再赘述，如果你选择了`Linux`，相信你有解决问题的能力。

雄关漫漫真如铁，而今迈步从头越。让我们开始`C++`学习的伟大旅程吧！
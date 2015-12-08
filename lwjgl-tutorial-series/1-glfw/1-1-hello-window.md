---
title: Hello Window
layout: lwjgltutorial
permalink: /lwjgl-tutorial-series/hello-window/
section: 1
---

Welcome to the first part of the LWJGL Tutorial Series. The aim of this first tutorial in this series is to teach you how to create a window. I also show you how to setup LWJGL with your project in this same tutorial.

If you still haven’t configured LWJGL with your project, the process is very simple. First go to [LWJGL Website](http://www.lwjgl.org/download) and download the latest nightly. Once downloaded, extract the ZIP file and you will see these contents.

{% highlight sh %}
.
├── doc
├── jar            # The JAR file we need will be here
├── native         # The natives we need will be here
└── src.zip        # This is the source code of LWJGL

4 directories, 30 files
{% endhighlight %}

The above is the directory tree of the LWJGL download. If you take a look, you will find three main directories, which contains the docs, jars and also the natives which are required.

|`doc`   |Contains LICENCE files and the LWJGL JavaDocs                                  |
|`jar`   |Contains the LWJGL JAR file (`lwjgl.jar`)                                      |
|`native`|Contains the required native libraries for various platforms and architectures |

The setup is very simple, just copy the `jar` and `native` directories to the directory containing your Java project. Add the JAR files from the `jar` directory to the classpath. Then in your run-configuration, set the VM Parameters to `-Djava.library.path=native/` and you are ready to go.

##The GLFW Package

Now that you have your project ready configured with LWJGL, now we can start creating the window. To provide windowing stuff, LWJGL relies on GLFW library. The GLFW bindings in LWJGL are provided in the `org.lwjgl.glfw` package. To make things easy, I will be using static imports to import the members of the `org.lwjgl.glfw.GLFW` class.

{% comment %}
```java
{% endcomment %}
{% highlight java %}
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.system.MemoryUtil.*;
{% endhighlight %}
{% comment %}
```
{% endcomment %}

We also import the `GL11` class members and `MemoryUtil` class members in our code. I’ll explain the `GL11` imports later in the coming up tutorials. We imported `MemoryUtil` class because it provides us the very useful `NULL` constant to Java. Note that this `NULL` constant is different from the Java’s `null` keyword.

##Initialising GLFW

Before using GLFW that we just imported, we have to initialise it. This initialisation is done by calling `glfwInit()` function. This function returns `0` if there is any error, which is also the value of `GL_FALSE`, the constant we import from the `GL11` class. Here is how you initialise the library.

{% highlight java %}
if (glfwInit() != GL_TRUE)
{
    System.err.println("Error initializing GLFW");
    System.exit(1);
}
{% endhighlight %}

First we try to initialise GLFW by calling `glfwInit()` and compare the return value for errors. If we couldn’t initialise the library, we simply write an error message to the console and exit with a return code of `1` to indicate error.

##Terminating GLFW

Once your work with GLFW is completed, you must ask it to terminate and clean up any of the resources it might be using. For this purpose, there exists another function called `glfwTerminate()` which simply cleans up any of the resources it might be using, and it will terminate.

{% highlight java %}
glfwTerminate();
{% endhighlight %}

That’s simply it. We call this function in the end of the game, after we destroy the window we are going to create. Now we can focus on creating the window.

##Creating a Window

We need a window to render our contents to the screen and the player to be able to see them. To create our window, we have the `glfwCreateWindow()` function in GLFW. It’s signature or prototype in LWJGL is the following.

{% highlight java %}
public static long glfwCreateWindow(int width, int height, CharSequence title, long monitor, long share);
{% endhighlight %}

Let me quickly explain the properties here. The `width`, `height` and `title`, obviously specifies the size and title of the window. The two new ones are `monitor` and `share`. GLFW has support for multiple monitors, setting the monitor to any monitors will cause the new window to be a fullscreen window over that monitor. If you need a windowed mode (no fullscreen), you set that to the `NULL` constant.

The `share` property is only used if you want a shared context. Suppose if you want to share the same context between two windows, you pass the handle of the first window as share of the second window. Since we only want one window here, we set the second property to `NULL` constant.

{% highlight java %}
long windowID = glfwCreateWindow(640, 480, "My GLFW Window", NULL, NULL);

if (windowID == NULL)
{
    System.err.println("Error creating a window");
    System.exit(1);
}
{% endhighlight %}

By default, GLFW creates compatibility OpenGL contexts, which are often limited to OpenGL 2.1 and are deprecated. To make GLFW create a core context for us, we need to specify some window hints to it. There are a lot of window hints, but most are self explanatory, so I’d leave the explanation of the code to you to research.

{% highlight java %}
glfwWindowHint(GLFW_SAMPLES, 4);
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
{% endhighlight %}

For these window hints to work, we need to place them before the call to `glfwCreateWindow()` function. If you want more explanation of the window hints, please refer to the [GLFW Window Handling Guide](http://www.glfw.org/docs/latest/window.html).

##Destroying a Window

We can destroy a window using the `glfwDestroyWindow()` function. This function takes a parameter, which is the handle of the window. We close the window before terminating GLFW.

{% highlight java %}
glfwDestroyWindow(windowID);
{% endhighlight %}

And that above one line of code destroys the window we created with more effort, certainly it is true that _Destruction is easier than Creation_ which we heard a lot in the child hood, what a truth!

##Making an OpenGL context Active

In order to render to the screen, we need a few more steps, we need to specify the active context from a window, and we must have a render-loop. So first, let’s specify the active context.

{% highlight java %}
glfwMakeContextCurrent(windowID);
GLContext.createFromCurrent();
glfwSwapInterval(1);
{% endhighlight %}

The first line specifies GLFW to make the context of the window whose handle is `windowID` the current one. The second line creates the LWJGL context from the current GLFW context. There is this third-line with the `glfwSwapInterval()` function, this specifies that the context should refresh immediately when the buffers are swapped.

##Writing the Render Loop

The render loop is placed in the `start()` method of the `Game` class. This method starts the render loop, which initialises the game, and steps into a `update`-`render` loop. Finally, it calls the `dispose()` method and destroys the window.

{% highlight java %}
public void start()
{
    float now, last, delta;

    last = 0;

    // Initialise the Game
    init();

    // Loop continuously and render and update
    while (glfwWindowShouldClose(windowID) != GL_TRUE)
    {
        // Get the time
        now = (float) glfwGetTime();
        delta = now - last;
        last = now;

        // Update and render
        update(delta);
        render(delta);

        // Poll the events and swap the buffers
        glfwPollEvents();
        glfwSwapBuffers(windowID);
    }

    // Dispose the game
    dispose();

    // Destroy the window
    glfwDestroyWindow(windowID);
    glfwTerminate();

    System.exit(0);
}
{% endhighlight %}

I’m not going to explain what `delta` is, and about this loop, since that is not the main aspect of this series. If you want to learn more on that aspect, google `game loops` and you will get a lot of knowledge on them. Okay, now if you run it, you will be greeted with a window like this.

<div class="text-center" markdown='1'>
![GLFW Window]({{ site.url }}/assets/images/lwjgl-tutorial-series/hello-window.png)
</div>

And this is the end of the first part of the LWJGL Tutorial Series. In the next part, let us dive a bit more into GLFW and learn about Callbacks. If you are having any problems following this tutorial, please let me know through the comments and I’ll try to fix them.

##Source Code

All the source code in this series is hosted on the [GitHub repository](https://sriharshachilakapati/LWJGL-Tutorial-Series/) here.

  - [Game.java](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/b388c1c54e8ffe9a785e22411756495b757dfb59/src/com/shc/tutorials/lwjgl/Game.java)

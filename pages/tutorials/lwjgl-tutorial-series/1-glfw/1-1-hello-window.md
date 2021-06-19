---
title: Hello Window
layout: lwjgltutorial
permalink: /lwjgl-tutorial-series/hello-window/
section: 1
updated: true
---

Welcome to the first part of the LWJGL Tutorial Series. The aim of this first tutorial in this series is to teach you how to create a window. I also show you how to setup LWJGL with your project in this same tutorial.

If you still haven’t configured LWJGL with your project, the process is very simple. First go to [LWJGL Website](https://www.lwjgl.org/download) and customize your LWJGL build. Get the latest release (3.1.2 at the time of this writing) with the following checked. We will add additional LWJGL modules when we need them later.

Select the preset as **Minimal OpenGL** and add **JOML** extension. Now get the Gradle build file. Once done, just edit the gradle build script to apply the java plugin.

~~~groovy
apply plugin: 'java'
~~~

Once done, you can import this into any IDE of your choice. Then you are ready to code.

## The GLFW Package

Now that you have your project ready configured with LWJGL, now we can start creating the window. To provide windowing stuff, LWJGL relies on GLFW library. The GLFW bindings in LWJGL are provided in the `org.lwjgl.glfw` package. To make things easy, I will be using static imports to import the members of the `org.lwjgl.glfw.GLFW` class.

~~~java
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.system.MemoryUtil.*;
~~~

We also import the `GL11` class members and `MemoryUtil` class members in our code. I’ll explain the `GL11` imports later in the coming up tutorials. We imported `MemoryUtil` class because it provides us the very useful `NULL` constant to Java. Note that this `NULL` constant is different from the Java’s `null` keyword.

## Initialising GLFW

Before using GLFW that we just imported, we have to initialise it. This initialisation is done by calling `glfwInit()` function. This function returns a boolean that specifies the success of initialization. However, it might fail for different reasons, and to prevent that, we create a callback for errors so that we get to know where the errors reside.

~~~java
GLFWErrorCallback.createPrint(System.err).set();

if (!glfwInit())
{
    System.err.println("Error initializing GLFW");
    System.exit(1);
}
~~~

First we try to initialise GLFW by calling `glfwInit()` and compare the return value for errors. If we couldn’t initialise the library, we simply write an error message to the console and exit with a return code of `1` to indicate error.

## Terminating GLFW

Once your work with GLFW is completed, you must ask it to terminate and clean up any of the resources it might be using. For this purpose, there exists another function called `glfwTerminate()` which simply cleans up any of the resources it might be using, and it will terminate.

~~~java
glfwTerminate();
~~~

That’s simply it. We call this function in the end of the game, after we destroy the window we are going to create. Now we can focus on creating the window.

## Creating a Window

We need a window to render our contents to the screen and the player to be able to see them. To create our window, we have the `glfwCreateWindow()` function in GLFW. It’s signature or prototype in LWJGL is the following.

~~~java
public static long glfwCreateWindow(int width, int height, CharSequence title, long monitor, long share);
~~~

Let me quickly explain the properties here. The _width_, _height_ and _title_, obviously specifies the size and title of the window. The two new ones are _monitor_ and _share_. GLFW has support for multiple monitors, setting the monitor to any monitors will cause the new window to be a fullscreen window over that monitor. If you need a windowed mode (no fullscreen), you set that to the `NULL` constant.

The _share_ property is only used if you want a shared context. Suppose if you want to share the same context between two windows, you pass the handle of the first window as share of the second window. Since we only want one window here, we set the second property to `NULL` constant.

~~~java
long windowID = glfwCreateWindow(640, 480, "My GLFW Window", NULL, NULL);

if (windowID == NULL)
{
    System.err.println("Error creating a window");
    System.exit(1);
}
~~~

By default, GLFW creates compatibility OpenGL contexts, which are often limited to OpenGL 2.1 and are deprecated. To make GLFW create a core context for us, we need to specify some window hints to it. There are a lot of window hints, but most are self explanatory, so I’d leave the explanation of the code to you to research.

~~~java
glfwWindowHint(GLFW_SAMPLES, 4);
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
~~~

For these window hints to work, we need to place them before the call to `glfwCreateWindow()` function. If you want more explanation of the window hints, please refer to the [GLFW Window Handling Guide](http://www.glfw.org/docs/latest/window.html).

## Destroying a Window

We can destroy a window using the `glfwDestroyWindow()` function. This function takes a parameter, which is the handle of the window. We close the window before terminating GLFW.

~~~java
glfwDestroyWindow(windowID);
~~~

And that above one line of code destroys the window we created with more effort, certainly it is true that _Destruction is easier than Creation_ which we heard a lot in the child hood, what a truth!

## Making an OpenGL context Active

In order to render to the screen, we need a few more steps, we need to specify the active context from a window, and we must have a render-loop. So first, let’s specify the active context.

~~~java
glfwMakeContextCurrent(windowID);
GL.createCapabilities();
glfwSwapInterval(1);
~~~

The first line specifies GLFW to make the context of the window whose handle is `windowID` the current one. The second line creates the LWJGL context from the current GLFW context. There is this third-line with the `glfwSwapInterval()` function, this specifies that the context should refresh immediately when the buffers are swapped.

## Writing the Render Loop

The render loop is placed in the `start()` method of the `Game` class. This method starts the render loop, which initialises the game, and steps into a update-render loop. Finally, it calls the `dispose()` method and destroys the window.

~~~java
public void start()
{
    float now, last, delta;

    last = 0;

    // Initialise the Game
    init();

    // Loop continuously and render and update
    while (!glfwWindowShouldClose(windowID))
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
~~~

I’m not going to explain what `delta` is, and about this loop, since that is not the main aspect of this series. If you want to learn more on that aspect, google **game loops** and you will get a lot of knowledge on them. Okay, now if you run it, you will be greeted with a window like this.

<div class="text-center" markdown='1'>
![GLFW Window]({{ site.url }}/assets/images/lwjgl-tutorial-series/hello-window.png)
</div>

And this is the end of the first part of the LWJGL Tutorial Series. In the next part, let us dive a bit more into GLFW and learn about Callbacks. If you are having any problems following this tutorial, please let me know through the comments and I’ll try to fix them.

## Source Code

All the source code in this series is hosted on the [GitHub repository](https://sriharshachilakapati/LWJGL-Tutorial-Series/) here.

  - [build.gradle](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/c77684f2d584dd5f79acc68301260a9e5a3d5d07/build.gradle)
  - [Game.java](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/c77684f2d584dd5f79acc68301260a9e5a3d5d07/src/main/java/com/shc/tutorials/lwjgl/Game.java)

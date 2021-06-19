---
title: Window Callbacks
layout: lwjgltutorial
permalink: /lwjgl-tutorial-series/window-callbacks/
section: 1
updated: true
---

Welcome to the second part of the LWJGL Tutorial Series. In the first part, we made a beautiful looking plain black window, that looks cute, but doesn't do anything and closes when you hit close. In this part of the series, I will teach you what Callbacks are and how to set them. By the way, I'll be using Java 8 Lambdas and Function References to make this part easier.

## Callback functions

Talking in plain C, callbacks are implemented using pointers, GLFW defines callback function types, and you pass them a function pointer. For this example, we take a look at how it is done in C, and then later let's see the Java example.

~~~c
typedef void(* GLFWwindowsizefun) (GLFWWindow*, int, int);
~~~

Considering the window size callback (a function that is called whenever user resizes the window), GLFW declares that in native C header files as above with name `GLFWwindowsizefun` with arguments being the **window**, **width** and **height** of the window. Then there is a function that accepts a callback function and sets it as the window size callback.

~~~c
GLFWwindowsizefun glfwSetWindowSizeCallback(GLFWWindow* window, GLFWwindowsizefun cbfun);
~~~

So when a user wants to know whenever the window is resized, he/she writes a function matching the signature of the `GLFWwindowsizefun` and calls the above function with the pointer to the function they have written. Much similar to the following.

~~~c
// Function to be called
void myWindowSizeCallback(GLFWWindow* window, int width, int height)
{
    printf("Window resized to %dx%d\n", width, height);
}

// Register our function with GLFW
glfwSetWindowSizeCallback(windowID, myWindowSizeCallback);
~~~

With the contract of GLFW saying about pointers that _GLFW will never free the pointers you pass it, and you should never free the pointers GLFW passes to you_, this all works exceptionally well. However the case is not that in Java, as Java is a language that is free of pointers.

## Using callbacks from Java

Because of the aforementioned issue of the lack of pointers in Java, LWJGL introduces custom classes for the callbacks, and calculates the pointer address in the native code. Taking the previous example of window size callback, LWJGL has this class `GLFWWindowSizeCallback` in the `org.lwjgl.glfw` package. Let's first see it in pre Java 8 style.

~~~java
GLFWWindowSizeCallback sizeCallback = new GLFWWindowSizeCallback()
{
    @Override
    public void invoke(long window, int width, int height)
    {
        System.out.println(String.format("Window resized to %dx%d", width, height));
    }
};
~~~

I would say this is too much verbose. LWJGL strives to make the bindings look a lot similar to the native code, and got with an alternative, using functional interfaces. For every callback, they had got a functional interface, namely `GLFWWindowSizeCallbackI` in this case, and the callback class implements it. We can then pass it as an argument to the static `create()` method in the callback class to get an instance.

~~~java
private void myWindowSizeCallback(long window, int width, int height)
{
    // [... snipped ...]
}

GLFWWindowSizeCallback sizeCallback = GLFWWindowSizeCallback.create(this::myWindowSizeCallback);
~~~

Whenever you created a callback instance, LWJGL internally treats it as a pointer, and a function pointer is created in the native code for it. In case you don't free it up, it will cause a memory leak. So you will be doing this as follows.

~~~java
glfwSetWindowSizeCallback(windowID, sizeCallback);

// Before destroying the window
glfwSetWindowSizeCallback(windowID, null);
sizeCallback.free();
~~~

Good enough till now, but we can make it even simpler. If you take a keen look at the Java method signature of the `glfwSetWindowSizeCallback` method, you will see that it accepts the interface which the callback class implements, and that means you can directly pass in the method reference. In that case, we can make it even simpler and avoid the instance field being stored in the class.

~~~java
glfwSetWindowSizeCallback(windowID, this::myWindowSizeCallback);

// Before destroying the window
glfwSetWindowSizeCallback(windowID, null).free();
~~~

As you see now, we are calling free on the object returned by the `glfwSetWindowSizeCallback` function. According to the GLFW documentation, it returns an instance of the previously set callback, and we are freeing it here. This makes it more simpler.

## GLFW Window Callbacks

Not only window size callback, but there are different callbacks that are available to be attached to a window. GLFW can notify you on various window events, like such as window position change, window size change, user hit close button, focus change, window iconified or restored, framebuffer resized etc., To easily use them in the future tutorials, let's create methods in the `Game` class that can be overridden.

~~~java
public void windowMoved(int x, int y) { /* snipped */ }
public void windowResized(int width, int height) { /* snipped */ }
public void windowClosing() { /* snipped */ }
public void windowFocusChanged(boolean focused) { /* snipped */ }
public void windowIconfyChanged(boolean iconified) { /* snipped */ }
public void framebufferResized(int width, int height) { /* snipped */ }
~~~

Now let us register them with the window in the start method. Set the callbacks before the event loop and free them before destroying the window.

~~~java
// Registering callbacks (before game loop)
glfwSetWindowPosCallback(windowID, (window, x, y) -> windowMoved(x, y));
glfwSetWindowSizeCallback(windowID, (window, width, height) -> windowResized(width, height));
glfwSetWindowCloseCallback(windowID, window -> windowClosing());
glfwSetWindowFocusCallback(windowID, (window, focused) -> windowFocusChanged(focused));
glfwSetWindowIconifyCallback(windowID, (window, iconified) -> windowIconfyChanged(iconified));
glfwSetFramebufferSizeCallback(windowID, (window, width, height) -> framebufferResized(width, height));

// Freeing callbacks (after game loop)
glfwSetWindowPosCallback(windowID, null).free();
glfwSetWindowSizeCallback(windowID, null).free();
glfwSetWindowCloseCallback(windowID, null).free();
glfwSetWindowFocusCallback(windowID, null).free();
glfwSetWindowIconifyCallback(windowID, null).free();
glfwSetFramebufferSizeCallback(windowID, null).free();
~~~

And that should complete the use of callbacks with GLFW and LWJGL. It looks so simple, and easier once you gain familiarity. From the future tutorials, you can just override these public methods simply. In the next part of the series, let us take a look at using input in GLFW.

## Source Code

All the source code in this series is hosted on the [GitHub repository](https://sriharshachilakapati/LWJGL-Tutorial-Series/) here.

  - [Game.java](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/4e05d975175d8486438b373b3fce52fd3a7bfdbd/src/main/java/com/shc/tutorials/lwjgl/Game.java)

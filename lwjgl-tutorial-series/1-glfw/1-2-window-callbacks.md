---
title: Window Callbacks
layout: lwjgltutorial
permalink: /lwjgl-tutorial-series/window-callbacks/
section: 1
---

Welcome to the second part of the LWJGL Tutorial Series. In the first part, we made a beautiful looking plain black window, that looks cute, but doesn't do anything and closes when you hit close. In this part of the series, I will teach you what Callbacks are and how to set them. By the way, I'll be using Java8 Lambdas and Function References to make this part easier.

## Callback functions

This section is not really the part of this tutorial, it introduces how functions can be used as callbacks in C language. I think this is essential to understand how these callbacks function, since GLFW uses a lot of them. So to start with the definition, here is it.

> A callback function is a function that you pass as an argument to another function and let that function call it at some point of time.

These callbacks are expected to be called whenever an event happens, and the type of event decides the arguments of the callback. Whenever you pass a callback function, you are passing the memory address of the function which can be used to call it later. So in C language, you will simply pass in the pointer of the function.

~~~c
void keyCallback(GLFWWindow* window, int key, int scancode, int action, int mods)
{
    // Do something here
}

glfwSetKeyCallback(window, keyCallback);
~~~

However, we are using Java, and Java doesn't even have a pointers concept. To come over this problem, in Java, we often write anonymous classes. LWJGL provides wrapper abstract classes that do the same thing and we pass an instance of the the Callback delegate object. The following is the equivalent in Java of the above C code.

~~~java
GLFWKeyCallback keyCallback = new GLFWKeyCallback()
{
    public void invoke(long window, int key, int scancode, int action, int mods)
    {
        // Do something here
    }
};

glfwSetKeyCallback(window, keyCallback);
~~~

Though the both code snippets above do the same work, they are different, in that the C version, we are passing a pointer to the function, whereas in the Java version, we are passing an instance of the class which wraps the callback function nicely into an anonymous object.

## Callbacks using Java8 Method References

To even tidy this up, Java8 provides a new feature called Method References, which allows us to write code that looks very much similar to the C code which was shown above. I'm not going to explain Method References feature here, but you can learn that by following [this awesome article](http://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html) in the Java Trails.

To support Method References, LWJGL provides Functional interfaces that wrap up the callback classes which we are required to extend in the previous snippet. Using them, our code will look more simpler like this.

~~~java
public void myKeyCallbackMethod(long window, int key, int scancode, int action, int mods)
{
    // Do something here
}

GLFWKeyCallback keyCallback;
glfwSetKeyCallback(window, keyCallback = GLFWKeyCallback(this::myKeyCallbackMethod));
~~~

This looks better, what we are using is we are creating a `GLFWKeyCallback` object that calls our `myKeyCallbackMethod` when invoked. Then we simply pass that object to the `glfwSetKeyCallback` function. This is how I'm going to define the callbacks in this series.

## Fixing the Segmentation Fault Errors

Once you have set the error callbacks in LWJGL, you will receive `segmentation fault` errors, more commonly known as `segfaults` in the native world of C programmers. This is because, these callbacks are registered to the native code. Even when you destroy the window, these remain in the memory. To prevent all this, you have to do two things.

  - Store the callback instances in the class, so that they won't be garbage collected.
  - Call the `release()` method on these callbacks before destroying the window.

The reason for this is that LWJGL uses `libffi` closures under the hood which takes some resources. If they are not released, they will cause a problem called as **Memory Leak** and hence they should be released before the window is destroyed.

## The GLFWErrorCallback

We want to be notified of the GLFW errors, so the first one we need to do is that we should add a callback to `GLFWErrorCallback` so that we can be notified of the errors, if any, does occur.

~~~java
public void myErrorCallback(int error, long description)
{
    System.err.println("[GLFW ERROR] " + error + ": " + memDecodeUTF8(description));
}

glfwSetErrorCallback(errorCallback = GLFWErrorCallback(this::myErrorCallback));
~~~

So confusing right? All it does is it prints the error to `System.err` Fortunately, this default behaviour is already in-built into the LWJGL library as `Callbacks.errorCallbackPrint()` that takes in a `PrintStream`, so let's use that instead.

~~~java
glfwSetErrorCallback(errorCallback = Callbacks.errorCallbackPrint(System.err));
~~~

What a simple one liner? Yes!!! This is about the error callback. From now on, whenever you receive an error, it will automatically be printed to the error stream. Don't forget to release this error callback before destroying the window.

## The GLFWKeyCallback

The `GLFWKeyCallback` lets you notified whenever a keyboard event has been generated. You have seen this as an example before, I've shown this when I'm explaining what callbacks are. However, let's now see the callback in more detail.

~~~java
glfwSetKeyCallback(windowID, keyCallback = GLFWKeyCallback(this::glfwKeyCallback));

public void glfwKeyCallback(long window, int key, int scancode, int action, int mods)
{
    // Exit on ESCAPE
    if (key == GLFW_KEY_ESCAPE && action != GLFW_RELEASE)
        end();
}
~~~

The first thing there, is the window. This is the ID of the window that received the Key event. We doesn't need that since we are only dealing with a single window. The next parameter `key` specifies the key code of the key that caused the event. To know which key it is, you will compare it with the `GLFW_KEY_**` constants. The next parameter `scancode` is a system and platform specific constant, we do not need it and we simply ignore it.

There are two more parameters that are present, namely `action` and `mods`. The last one `mods` specifies which modifiers are held, like for example SHIFT or CTRL or ALT, etc., Now for the `action`, in GLFW, there are three actions for a key event. They are `GLFW_PRESS` _(The key was pressed)_, `GLFW_RELEASE` _(The key was released)_ and `GLFW_REPEAT` _(The key was continuously held down)_. I hope they are pretty simple.

## Conclusion

There are many more callbacks that are there that can be useful, but I'll cover those when time comes, when they are really required. This is the end of the second part of the series, and we've understood how the callbacks work, and how we can use callbacks in Java and LWJGL. In the next part of the series, we'll learn how to use polled input. If you are having any problems following this tutorial, please let me know through the comments and I’ll try to fix them.

## Source Code

All the source code in this series is hosted on the [GitHub repository](https://sriharshachilakapati/LWJGL-Tutorial-Series/) here.

  - [Game.java](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/1ec0189920c64afa5fe877b5d85a1a4d71a208ad/src/com/shc/tutorials/lwjgl/Game.java)

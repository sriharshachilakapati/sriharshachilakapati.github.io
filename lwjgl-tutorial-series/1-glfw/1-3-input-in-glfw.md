---
title: Input in GLFW
layout: lwjgltutorial
permalink: /lwjgl-tutorial-series/input-in-glfw/
section: 1
---

Welcome to the third part in the LWJGL Tutorial Series. In the previous part, we have learnt about callbacks and how we can use callbacks in GLFW. In this part of the series, we will be learning about different types of input GLFW provides us and how we will be using that.

##Event Based Input

There are two ways to handle input, one is event based, and depends on callbacks and the second way is to use polled input. Event based input means that we can only access the input data when an input event occurs, we cant check it whenever we want. While this type of event system is fine in applications, in games we often end up creating boolean flags for the various keys like this.

{% highlight java %}
private boolean moveUp    = false;
private boolean moveDown  = false;
private boolean moveLeft  = false;
private boolean moveRight = false;

@Override
public void glfwKeyCallback(long window, int key, int scancode, int action, int mods)
{
    switch (key)
    {
        case GLFW_KEY_UP:
            moveUp = (action != GLFW_RELEASE);
            break;

        [... snip ...]
    }
}
{% endhighlight %}

Then you make use of those boolean flags in your logic and you update the velocities. While there is an alternative of storing the velocities directly and modify them in the callback, this is not just preferred for two reasons, one it is being confusion to remember all the arguments of the callbacks and the second, maintaining lists of booleans can be confusing, it's just a large amount of unnecessary code.

##Introducing Polled Input

For the above mentioned reasons, GLFW provides Polled input. If you notice the Game class that we have written in the previous tutorials, you can see that we call a function namely `glfwPollEvents()` just before swapping the buffers. This function does all the above mentioned tedious time consuming work of storing the input for us. We can then simply query the input simply like this.

{% highlight java %}
if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS)
{
    // Move up
}
{% endhighlight %}

This is very much simpler than the previous way right? This is the reason that I will be using Polled Input as much as I can. There is also a function in GLFW to query the mouse button state. Here you can see it in action.

{% highlight java %}
if (glfwGetMouseButton(window, GLFW_MOUSE_BUTTON_1) == GLFW_PRESS)
{
    // Left Mouse button is down!!
}
{% endhighlight %}

Though this method gives you a lot of ease to use the input, you also should note one thing, you cannot know whether a key or mouse is held down, that is, GLFW will send you `GLFW_PRESS` even if it should be `GLFW_REPEAT`. I don't know what happens on other platforms, but on OS X, that is the behaviour. To prevent that, I went with my own custom polling utilities in [SilenceEngine](https://github.com/sriharshachilakapati/SilenceEngine/) _(My 2D/3D Game Engine written using LWJGL3)_, but that is out of scope of this tutorial.

##Callbacks are still necessary

I can surprise you by saying that callbacks are still necessary. It is a fact that GLFW limits some forms of input can only be read by using callback functions. Such types of inputs include scrolling input, joystick input, and also in the case of LWJGL, you must use a callback to know the position of the mouse.

So to make this easy, we provide overridable callback functions for cursor position, mouse buttons, scroll wheel, and also key input. There are other forms of input as well, but we are not interested in them for this series. I have already shown you the `GLFWKeyCallback`, so let us see the `GLFWCursorPosCallback` first.

{% highlight java %}
public void glfwCursorPosCallback(long window, double xpos, double ypos)
{
}

public void glfwMouseButtonCallback(long window, int button, int action, int mods)
{
}

public void glfwScrollCallback(long window, double xoffset, double yoffset)
{
}
{% endhighlight %}

By default our Game class will not use them, but it will specify the callbacks. We can use them in our future tutorial for implementing mouse look and scroll zoom in 3D when we come to cameras, but that is a long way to go! Now, here is the remaining code for setting the callbacks.

{% highlight java %}
// Create the callbacks
errorCallback       = Callbacks.errorCallbackPrint(System.err);
scrollCallback      = GLFWScrollCallback(this::glfwScrollCallback);
cursorPosCallback   = GLFWCursorPosCallback(this::glfwCursorPosCallback);
mouseButtonCallback = GLFWMouseButtonCallback(this::glfwMouseButtonCallback);

// Set the callbacks
glfwSetErrorCallback(errorCallback);
glfwSetKeyCallback(windowID, keyCallback);
glfwSetCursorPosCallback(windowID, cursorPosCallback);
glfwSetMouseButtonCallback(windowID, mouseButtonCallback);
glfwSetScrollCallback(windowID, scrollCallback);
{% endhighlight %}

I'm not going to show the release calls on the callbacks, just because they are so simple and also that I believe that you will not forget releasing them, will you? I hope you will keep my belief up and do remember to release them. Also I'm leaving the explanation of those parameters to the callback functions, because I think they are pretty much self explanatory with their names.

##Conclusion

This is the end of the third part of the LWJGL Tutorial Series, and I think I have covered enough topics of GLFW. Keeping that this series is based on LWJGL, I will go forward into OpenGL from the next part, where I will be starting with the rendering pipeline. If you have any problems following the tutorial, please contact me with the comment form below, and I will be glad to get back to you.

##Source Code

The only file that was changed is the Game class. You can find the source of it on [GitHub][1] by clicking [here][1].

  [1]: https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series/blob/c02f94c5fa9c792ccd67ad0900ca6fa04ae503b9/src/com/shc/tutorials/lwjgl/Game.java

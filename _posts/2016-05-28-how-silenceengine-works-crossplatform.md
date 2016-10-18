---
title: How SilenceEngine works Cross Platform
tags: ['SilenceEngine', 'Cross Platform', 'Devices', 'Under the hood', 'Windows', 'Mac OS', 'Unix/Linux', 'Android', 'HTML5']
layout: post
---

The aim of this post is to explain how SilenceEngine works across platforms, and also to explain the life cycle of the game. Right now, SilenceEngine can work officially on Windows, Mac, Linux and HTML5. Unofficially it works on Android (work is in progress, only audio device is not available there). To make it work everywhere, SilenceEngine is designed in two parts &mdash; the engine and it's runtime. The engine is just a collection of game related classes, where as there is a separate runtime for every platform. Let's talk about the runtimes in this post.

## Introducing the Runtime

What is a runtime, and why is it needed? This question strikes first, and here is the answer. A runtime is an implementation of the SilenceEngine platform which delegates the work to the native platforms. To work on all the platforms, SilenceEngine uses the concept of devices and the runtime implements these devices for the target platform.

{% include image href="/assets/images/silenceengine-thoughts/basic-structure.png" alt="SilenceEngine Structure" %}

Right now, there are four different runtimes which make it possible for the engine to run on different platforms. Backend is a module which provides a runtime. They are listed below. These runtimes when combined with SilenceEngine and your game, creates the final game that actually runs on the target platform.

| Runtime        |  Description                                                                     |
|----------------|----------------------------------------------------------------------------------|
| LwjglRuntime   | The LWJGL 3 based runtime, targets the desktop platforms Mac, Windows and Linux. |
| GwtRuntime     | The HTML5 based runtime, targets the HTML5 platform via the use of HTML5 APIs.   |
| AndroidRuntime | This runtime uses the Android specific APIs and targets all the android devices. |

A runtime also handles the event loop, and is responsible for making the game loop perform a frame. It is responsible for abstracting the platform's features into SilenceEngine devices, so SilenceEngine works on that platform without any issue. Now that you understand what a runtime is, we can now go to the next section.

## SilenceEngine Devices

SilenceEngine needs to interact with the native platform to do some tasks, which include creating the display, getting keyboard, mouse and touch input, querying the time, playing the sounds etc., and the way these tasks are performed vary from device to device. To solve this, SilenceEngine has interfaces called as devices, which specify what each device should do. The runtimes implement these devices and performs the task on the target platform. Here are the list of devices that SilenceEngine is having.

| Device         | Description                                                                                        |
|----------------|----------------------------------------------------------------------------------------------------|
| DisplayDevice  | This device takes care of creating the game window, and also provide a high resolution timer.      |
| GraphicsDevice | This device provides a subset of OpenGL that is available to both desktop and mobile devices.      |
| AudioDevice    | This device provides OpenAL 1.1 API functions completely that allows playing audio in 3D.          |
| InputDevice    | This device gathers the input from the native platform's event handlers and generate input events. |
| IODevice       | This device provides IO operations like reading files, images etc., Both text and binary files are supported. |

The instances for these devices will be created by the runtime, and they are accessible as static objects in the `SilenceEngine` class. All the classes in the engine uses these objects so the operation works on all the platforms. These devices make SilenceEngine a full featured game platform. The access for these devices is public so that even users who needed advanced features can use them.

## Game Life Cycle

Every game using SilenceEngine should have a public class which extends from the `Game` class. The game class contains methods for each stage in the life cycle, which the user can override to do his work. There is no need to call the super methods here, they do nothing by default. Every game starts with initialization and ends with disposing the resources. In between there's a loop of update and render calls.

{% include image href="/assets/images/silenceengine-cross-platform/life-cycle.png" alt="SilenceEngine game life cycle" %}

Apart from these states, there is an additional method to be overridden called as `resized` which is automatically called by the display device whenever the game window is resized or whenever the screen orientation is changed. All these handlers are fired by event manager that SilenceEngine uses. Using it, you can add additional callbacks on all these events.

## The Game Entry Point

Every program should have an entry point, which is where the execution of the program starts. But since different platforms has different entry points, the project creator creates separate modules for each platform. All you have to do is to use the platform's entry point, and start the runtime there.

~~~java
// For LWJGL backend, running on desktop
public static void main(String[] args)
{
    LwjglRuntime.start(new MyGame());
}

// For GWT backend, running in browser
public void onModuleLoaded()
{
    GwtRuntime.start(new MyGame());
}

// For Android backend, running on phones and tablets
public void launchGame()
{
    AndroidRuntime.start(new MyGame());
}
~~~

Of course, these methods belong to separate classes in separate modules. The requirement for the launcher classes is that the GWT launcher should implement the `Entrypoint` interface, and the android launcher should extend from `AndroidLauncher` class to make it an activity that android will recognize. And with this small work, voila! you have a cross platform game!

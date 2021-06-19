---
title: New thoughts on SilenceEngine
layout: post
keywords: [SilenceEngine, Improvements]
tags: ['SilenceEngine']
---

The aim of this post is to put my new thoughts on the improvement of SilenceEngine, a 2D/3D game engine. Initially SilenceEngine has been written with LWJGL3 in mind, and I'm happy to say that it is the first game engine that is using LWJGL3 for the low level bindings, like GLFW, OpenGL, OpenAL, JEmalloc, STB etc., But due to that, SilenceEngine has been limited to a single platform, that is the desktop.

## The Overview

I wanted SilenceEngine to be really cross platform, and export to desktop, html5 and android with a single code base. The desktop is already working, but is hard to get working in html5 due to the usage of blocking I/O, where the web requires to use asynchronous non-blocking I/O. So I had to redesign it, and here is an overview of the process.

{% include components/widgets/image.html href='/assets/images/silenceengine-thoughts/basic-structure.png' alt='SilenceEngine Overview' %}

I'll be writing one backend per platform, so the desktop backend uses LWJGL3 for the bindings, the android backend uses the native android libraries, and the html5 backend uses GWT with WebGL4J and GWT-AL libraries. The work on SilenceEngine 1.0.1 will start in a new branch in the repository, and will be a multi project one with the backends separated right from the start.

## The Event Queue

I don't want to make the new engine drastically different from the current one, but the only thing I want to introduce is an event queue, so the I/O file loading is done asynchronously. In the GWT backend, it will be done through the use of `XmlHttpRequest` and on the desktop and android backends, the resources are loaded from a separate thread. By resources, I only mean the files from disk and not OpenGL / OpenAL objects.

~~~java
SilenceEvent.addResourceLoadedHandler(resourceEvent ->
{
    // Do something with the resourceEvent here. The event will be
    // of ResourceEvent type, and this handler will be called whenever
    // a resource is loaded asynchronously.
});

SilenceEvent.addResourceLoadingHandler(resourceEvent ->
{
    // Do something with the resourceEvent here. The event will be
    // of ResourceEvent type, and this handler will be called while
    // a resource is still loading.
});
~~~

The above code is just a sample right now, but it will be in that fashion. This will also make the engine a bit more low level, but will allow much more control to the programmer of the game. The current `ResourceLoader` will continue to exist, and will use this new API to provide backwards compatibility. It will however be modified to not block the thread, but set the game state to a custom game state which draws the progress.

## Introducing Devices

A device is an interface (defined under the name `IDevice` in the core package) which provides signatures of the low level methods that the engine uses to communicate with the backends. There will be three device interfaces defined in the engine, and the backends should implement them to do the work using the platform specific APIs. Here is an overview of how those devices work.

{% include components/widgets/image.html href='/assets/images/silenceengine-thoughts/device-graphics.png' alt='The IGraphicsDevice' %}

As you can see in the above image, there will be interfaces `IGraphicsDevice` for handling the graphics, and each of the backends implement a graphics, such as the LWJGL backend will implement it in a class called as `LWJGLGraphicsDevice` whereas the GWT backend will implement it in a class called as `GWTGraphicsDevice` and these will be provided to the engine through starter classes.

## Resources in GWT backend

Having resources in GWT is a difficult task, and is different to the standard way that we are used to in the desktop backend. To support this, we have two options &mdash; compile resources into a custom format and include it as a virtual file system, or use `XmlHttpRequest` to load them asynchronously. I'm in favour of the second option, as that means we can at least show the loading progress while it is loading, as with the first option since GWT embeds client bundles in JavaScript code, it takes a while to get to present anything on the page.

In GWT, however the FilePath is always external, as they are served from the server that the game is hosted in. So we can make the internal FilePath as an alias to the external one, so the same code will work on all the platforms. This also does mean that we are removing some methods like the getInputStream() / getOutputStream() methods from the FilePath class, and we replace it with custom classes so we can throw an exception when using from GWT.

## The Game configuration

To be able to store configuration, I will be adding in a new FilePath, and uses the local storage API from HTML5 specification that we can use to store high scores etc., in the game. We can access it like this from code:

~~~java
FilePath config = FilePath.getConfig("unique-name-to-identify-game");
~~~

Then we can use new classes that are going to be available in the new version, which is however asynchronous too. In other platforms this will create a file on the user directory to store the configuration.

## Conclusion

So this is for this post, all these are the basic core design of the SilenceEngine. There are also going to be huge changes in the graphics package too, which I will be explaining in a future blog post. If you have any other ideas and suggestions, feel free to contact me, either through the comments here, or on IRC or even on the forum or e-mail.

By the way, I'll add the android backend a while later, but the desktop and html5 backends will be worked upon concurrently.

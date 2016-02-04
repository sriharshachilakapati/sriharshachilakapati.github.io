---
title: WebGL Context
layout: webgl4jtutorial
section: 1
permalink: /webgl4j-tutorial-series/webgl-context/
---

Welcome back to the second part of the WebGL4J tutorial series. In the previous part, we learned how to setup the workspace with Gradle as the build tool and created a basic application in which we have a black canvas on an empty page. This time, we will be learning what a context is and how WebGL4J allows multiple contexts.

## What is a context?

The key term that we say very often is **context**, which is an object that manages the state of OpenGL. In WebGL, this context also contains the OpenGL ES functions that are exposed to JavaScript which we can call. Before continuing, let's take a look at what we had in the previous tutorial.

~~~java
WebGL10.createContext(canvas);
~~~

What we are doing here is creating a WebGL 1.0 context on our canvas. We need to create a context before we can draw anything using WebGL. The `createContext` method creates a WebGL context and returns a [WebGLContext](http://webgl4j.goharsha.com/?com/shc/webgl4j/client/WebGLContext.html) object that is used to refer to a WebGL context. The newly created context will immediately be made as current context.

## The current context

In desktop versions of OpenGL there is a concept of contexts which WebGL4J emulates to be similar to the desktop OpenGL, as the main aim of this library is to support porting of desktop OpenGL applications to the web. You can think of a context as the OpenGL object containing all of the OpenGL states. There can be multiple contexts in a page, and each context is associated with an HTML5 canvas element.

We call it current since there can be many other contexts. All the WebGL functions defined in the WebGL10 and WebGL20 classes operate on the current context. Rather than explaining in text, I'll show you a simple example of using multiple contexts (of course, this is very rarely used in applications).

~~~java
WebGLContext ctx1 = WebGL10.createContext(canvas1);
WebGLContext ctx2 = WebGL10.createContext(canvas2);

// [... all GL calls now operate on ctx2 ...]
~~~

Here we created two contexts with two canvas elements. By default, a context is automatically made current, and since all the GL calls will now operate on `ctx2`,  the output is seen on the second canvas. In order to make the rendering take place using the first context, you need to make it current.

~~~java
ctx1.makeCurrent();

// [... all GL calls now operate on ctx1 ...]
~~~

WebGL4J also exports the active context object to the 'window' variable in the host page, which is helpful when debugging. The `gl` object is of the `WebGLRenderingContext` type, and `glv`is a float containing the version of the active context. These two are contained in a `ctx` object in the window variable.

## Context Attributes

WebGL allows some attributes to be specified before creating the context, as well as retrieving the attributes from any context. See the documentation on the  [WebGLContext.Attributes](http://webgl4j.goharsha.com/index.html?com/shc/webgl4j/client/WebGLContext.Attributes.html) class to see what options are available. The following example shows the creation of a context with a stencil buffer attached to it.

~~~java
WebGLContext.Attributes attrib = WebGLContext.Attributes.create();
attrib.setStencil(true);

// Create the context with the specified attributes
WebGLContext ctx = WebGL10.createContext(canvas, attrib);
~~~

Even though you can request the attributes on a canvas, there is no guarantee that the WebGL implementation will grant you all of them. Therefore you should be checking the attributes after the creation of the context. To do this, we can use the following code.

~~~java
if (ctx.getAttributes().getStencil())
    // Success!! Stencil buffer exists for this context
else
    // Failed!! :(
~~~

The attributes only fail to be set if the hardware is low end (such as mobiles) or lack of graphics drivers on the device, which is very rare to occur. Apart from this, there is one more feature that WebGL4J provides through WebGL contexts: the fullscreen mode. However, let's keep that for another tutorial.

## Source code

There is no source code attached to this tutorial, since all it does is explain how the contexts work. No source code from the previous tutorial is modified.

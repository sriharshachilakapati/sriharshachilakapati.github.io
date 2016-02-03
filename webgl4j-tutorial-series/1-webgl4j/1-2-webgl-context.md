---
title: WebGL Context
layout: webgl4jtutorial
section: 1
permalink: /webgl4j-tutorial-series/webgl-context/
---

Welcome back to the second part of the WebGL4J tutorial series. Last part, we have learnt how to setup the workspace with Gradle as the build tool and created a basic application where we have a black canvas in an empty page. This time, we will be understanding what a context is and how WebGL4J allows to have multiple contexts.

## What is a context?

The key term that we say very often is **context**, which is an object that manages the state of the OpenGL. In WebGL, this context also contains the OpenGL ES functions that are exposed to JavaScript which we can call. Let's take a look at what we had in the last tutorial before continuing.

~~~java
WebGL10.createContext(canvas);
~~~

What we are doing here is that we are creating a WebGL 1.0 context on our canvas. We need to create a context before we can draw anything using WebGL. This method, returns a [WebGLContext](http://webgl4j.goharsha.com/?com/shc/webgl4j/client/WebGLContext.html) object that is used to refer to a WebGL context. The newly created context will be immediately made as current context.

## The current context

In desktop version of OpenGL there is a concept of contexts and WebGL4J emulates this to be alike to the desktop OpenGL as the main aim of this library is to support porting of desktop OpenGL apps to the web. You can think a context as the OpenGL object, which contains all of the OpenGL state. There can be multiple contexts in a page, and each context is associated with a HTML5 canvas element.

It is implemented as a single object which is a current context, we call it current since there can be many other contexts. All the WebGL functions defined in WebGL10 and WebGL20 classes operate on this current context. Instead of giving much explanation on this, I'll show you a simple example of using multiple contexts (of course, this is very rarely used in applications).

~~~java
WebGLContext ctx1 = WebGL10.createContext(canvas1);
WebGLContext ctx2 = WebGL10.createContext(canvas2);

// [... all GL calls now operate on ctx2 ...]
~~~

Here we created two contexts with two canvas elements. By default a context is automatically made current, and since all the GL calls will now operate on `ctx2` and the output is seen on the second canvas. Now in order to switch the rendering to take place using the first context, you need to make it current.

~~~java
ctx1.makeCurrent();

// [... all GL calls now operate on ctx1 ...]
~~~

WebGL4J also exports the active context object to the 'window' in the host page, so it is helpful to do the debugging if needed. The `gl` object is the `WebGLRenderingContext` type, and then `glv` says the version of the active context, as a float. These two are contained in a `ctx` object in the window. This is how contexts operate.

## Context Attributes

WebGL allows some attributes to be specified before creating the context, and also query the attributes back on any context. See the documentation of  [WebGLContext.Attributes](http://webgl4j.goharsha.com/index.html?com/shc/webgl4j/client/WebGLContext.Attributes.html) class to see what options are available. The following example shows the creation of a context with a stencil buffer attached to it.

~~~java
WebGLContext.Attributes attrib = WebGLContext.Attributes.create();
attrib.setStencil(true);

// Create the context with the specified attributes
WebGLContext ctx = WebGL10.createContext(canvas, attrib);
~~~

Even though you can request the attributes on a canvas, there is no guarantee that the WebGL implementation will grant you all the attributes on a context, so you should be checking the attributes after the creation of the context. To check that, we can use the following code.

~~~java
if (ctx.getAttributes().getStencil())
    // Success!! Stencil buffer exists for this context
else
    // Failed!! :(
~~~

The attributes only fail to be set if there is a low end hardware (such as mobiles) or lack of graphics drivers on the device, which is very rare to occur. Apart from this, there is one more feature that WebGL4J provides through WebGL contexts, the full screen mode. However, let's keep that for another tutorial.

## Source code

There is no source code attached with this tutorial, since all it does is explaining how the contexts work. No source code from the previous tutorial is modified.

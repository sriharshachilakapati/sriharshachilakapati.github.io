---
title: LWJGL Tutorial Series
layout: lwjgltutorial
section: 0
permalink: /lwjgl-tutorial-series/
updated: true
---

Welcome to the LWJGL Tutorial Series Home page. This is where I write articles on LWJGL introducing modern graphics card programming with OpenGL 3.2 Core. These tutorials start at the very basic level, setting up the workspace and move on eventually building our framework and learning how GPUs work.

## What is LWJGL?

LWJGL means **Light Weight Java Game Library**. It provides low level bindings to native libraries such as **OpenGL**, **OpenAL** and **OpenCL** to Java using JNI. Though LWJGL provides access to the most powerful libraries, it is not for everyone, as it needs a good understanding of those APIs. Don’t worry though, by the end of this tutorial series, I’m sure that you will be using LWJGL with the greatest ease. You can find LWJGL [here](https://www.lwjgl.org/).

## What is GLFW?

GLFW is a C library that provides an easy to use API for creating cross-platform Windows and OpenGL contexts. LWJGL provides bindings to GLFW (in the `org.lwjgl.glfw` package) and that is what we are going to use to create our window and the OpenGL context. GLFW also provides us with input handling for Keyboard, Mouse, and also for Joysticks. You can find GLFW [here](http://www.glfw.org/).

## What is OpenGL?

OpenGL is not actually a library, it is a specification written in C. In the market, there are a variety of GPUs from a number of manufacturers, and each might work differently and hence, is difficult to use natively. This is where OpenGL comes in, it specifies an API (Application Programming Interface) that the GPU manufacturers provide in their drivers. So briefly, OpenGL can be said as a software interface to various GPUs out there in the market.

## Source Code

All the source code for this tutorial series is hosted on the GitHub repository [here](https://github.com/sriharshachilakapati/LWJGL-Tutorial-Series).

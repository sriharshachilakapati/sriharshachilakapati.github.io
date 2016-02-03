---
layout: post
title: Delaying LWJGL Tutorial Series
tags: [lwjgl3, tutorials]
---

As you might have been noticed, there are no updates to the LWJGL Tutorial series, and I now want to further delay the writing of tutorials regarding LWJGL3. The reason, is that initially I was excited about the new version and started writing the tutorial series, but now it happened to change a lot from the alpha builds in the API, making all my tutorials obsolete (they're still good on OpenGL part though).

So I planned to delay them until I feel that the API is finally frozen, and rewrite them again when the changes have yet been finalized. Even though the tutorials are on a halt, I'm still working with the latest nightlies, and updating my game engine for each build. The tutorials that are existing will be kept where they are, and I'll modify parts of them to the new API.

## Important changes in tutorial code

To get the code in the tutorials working, there needs a few changes to be done, where most are heavily regarding on GLFW where the new builds have a lot of differences in the API and also the C names are modified to give them a Java-ish look. I'm stating these changes here to help people who are still wondering why my tutorials suddenly stopped working with latest builds of LWJGL3.

### Creating the context

Previously there is a class called as `GLContext` which we used to create a context from current. This is now gone since the context is managed by GLFW in the native code. The statement is now replaced with the following statement.

~~~java
GL.createCapabilities();
~~~

This is the new one, and I think this is more aptly named. Of course there is now method to set the active capabilities without recreating the context capabilities when context switching, I'll explain it in the tutorials when updated.

### The callbacks

The callback classes are now renamed to be more friendly with the Java conventions. For example the `GLFWkeyfun` is now changed into `GLFWKeyCallback` which I think is more meaningful. And the static functions with the same name as the callbacks in the `GLFW` class are now removed and are replaced with a create method.

~~~java
keyCallback = GLFWKeyCallback.create(this::myKeyCallback);
~~~

Fortunately, the function signature is not changed, and that remains the same even now.

### OpenGL function names

Now the OpenGL function names are more close to the native function names, unlike LWJGL 2. LWJGL2 used to remove the suffixes of the OpenGL functions, making `glUniformMatrix4fv` for example look as `glUniformMatrix4` which is not the case any more.

## Conclusion

There are a lot of other changes as well, from including the EGL context libraries and LibOVR bindings in the library to changing the way the structs are generated from the C sources. Right now, there is the thread [LWJGL 3 - API Freeze (request for feedback)](http://forum.lwjgl.org/index.php?topic=5965.0) in the LWJGL forums, so I'm guessing that the updation is almost near to be done. Waiting for that to take place.

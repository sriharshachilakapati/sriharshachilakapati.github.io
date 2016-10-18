---
layout: post
title: SilenceEngine - Thoughts on Shaders
keywords: ["SilenceEngine", "Improvements", "Shaders"]
tags: ["SilenceEngine", "GLSL", "GLSL ES"]
---

Recently I've been thinking on how to make SilenceEngine more awesome by writing a new API and as well as multiple backends, and today I'm presenting you the ideas I'm having regarding the shaders, an important part in programming graphics.

## What are shaders?

So what are these shaders? Simply put, shaders are small little programs that run on the GPU, and produce the output on the framebuffer. If you haven't noticed as a user of current SilenceEngine, there are shaders, but they are provided by SilenceEngine for you. Now, I'll be making it possible to override the default shaders if you like.

Not only that, but multiple backends have also presented with a new issue, that is, we need to write our shaders in a way that they are compatible with the GLSL version supported by the platform, and there are many variants of them. For example, the desktop supports GLSL 330 version, while the WebGL supports only a subset of the language.

## SilenceEngine generates Shaders

Writing one shader for each platform is no easy task, and will make us wanting to sync all the shaders manually when we change the shader on one platform to give the same effect on the other platforms as well, and as the number of platforms or the size of the shader increases, the complexity in maintaining the shaders increases. The solution that SilenceEngine provides is that your shaders are generated. Take a look at the following example.

~~~glsl
uniform {
    mat4 mvp;
}

vertex_shader {
    in {
        vec4 pos;
    }

    main {
        se_position = mvp * pos;
    }
}

fragment_shader {
    main {
        se_fragColor = vec4(1.0);
    }
}
~~~

Now let us take a look at how the shaders are generated. We look at the vertex shader first, followed by the fragment shader.

~~~glsl
// Vertex shader
#version 330 core
#line 2
uniform mat4 mvp;

#line 7
in vec4 pos;

void main()
{
    #line 10
    gl_Position = mvp * pos;
}

// Fragment shader
#version 330 core
#line 2
uniform mat4 mvp;

out vec4 se_fragColor;

void main()
{
    #line 16
    se_fragColor = vec4(1.0);
}
~~~

Interesting right? You might notice that the compiler inserts the `#line` pragma comments to help you find the line when getting error messages at runtime from GLSL version. The compiler also removes any comments and tidies the version. Now let's see how the GLSL spit out for WebGL version will be.

~~~glsl
// Vertex shader
#version 100
#line 2
uniform mat4 mvp;

#line 7
attribute vec4 pos;

void main()
{
    #line 10
    gl_Position = mvp * pos;
}

// Fragment shader
#version 100
precision mediump float;

#line 2
uniform mat4 mvp;

void main()
{
    #line 16
    gl_FragColor = vec4(1.0);
}
~~~

Both the versions are mostly similar, so why write an entire new language for the case of portability? This is being done for another reason, adding features to SilenceEngine, so we could provide shader library functions making the process of writing the shaders easy to newbies.

## Namespaces

SESL (SilenceEngine Shading Language) will provide a new feature called as namespaces, similar to the Java's packages. For example, you wanted to write your own lighting shader, but don't know how lighting algorithms work. You can simply call the phong calculation present in the library.

~~~glsl
main {
    se::lights::Light light;
    light.position = cameraPosition;
    light.color = se::colors::red;

    se_fragColor = se::lights::phong(light, surfaceNormal,
        camMatrix, modelMatrix);
}
~~~

In the GLSL, that is translated to the following code (Ignore the line numbers for now).

~~~glsl
void main()
{
    se_lights_Light light;
    light.position = cameraPosition;
    light.color = se_colors_red;

    se_fragColor = se_lights_phong(light, surfaceNormal,
        camMatrix, modelMatrix);
}
~~~

Defining functions in your namespace is as simple as attaching the namespace to the function signature. This is how you can define your own library in the slib file.

~~~glsl
vec4 myns::myfunction(float greyNess)
{
    return vec4(greyNess, greyNess, greyNess, 1.0);
}
~~~

That is how you define namespaces in your program. The same applies to structures as well. We also allow that any function might depend on any other function, and there is no restriction that you must use forward declaration. Forward declaration will be automatically done.

All this is just a rough representation at the time of this writing and haven't yet been implemented. This will be done as a side project from SilenceEngine (since it is a complete compiler) but will be used by SilenceEngine. SilenceEngine will of course accept standard platform supported GLSL.

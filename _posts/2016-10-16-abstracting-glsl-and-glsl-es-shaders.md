---
title: "Abstracting GLSL and GLSL ES shaders"
layout: post
tags: ["GLSL", "GLSL ES", "Shaders", "OpenGL", "OpenGL ES", "WebGL"]
---

Though OpenGL is cross platform, and also has variations of it like OpenGL ES for embedded systems and mobiles, and WebGL for the HTML5 web platform, there are still differences on the shading languages they use. This means that we have to write a separate shader with changing syntax which does the same operation. Well, this post is about how we can abstract away these differences.

## An example Vertex shader

For the sake of example, let's just assume a simple shader, which just does gray-scale filter of what is rendered. I'm first going to write this in GLSL ES 100, and then compare with its equivalent in Core GLSL 330. First comes the vertex shader. All it does is take two attributes, the vertex and the texture coordinates, and pass them to the fragment shader.

~~~glsl
#version 100 es
uniform mat4 MVP;

attribute vec3 position;
attribute vec2 texCoords;

varying vec2 vTexCoords;

void main()
{
    // Pass the input texCoords to fragment shader
    vTexCoords = texCoords;

    // Compute the final position
    gl_Position = MVP * vec4(position, 1.0);
}
~~~

Now let us look at the same vertex shader in GLSL 330 Core, which is what required on desktop with core profile. I have recently received bug reports which say that AMD is giving warning on GLSL 110 shaders in desktop with core profile. Let us see how this same vertex shader looks in GLSL 330.

~~~glsl
#version 330 core
uniform mat4 MVP;

in vec3 position;
in vec2 texCoords;

out vec2 vTexCoords;

void main()
{
    // Pass the input texCoords to fragment shader
    vTexCoords = texCoords;

    // Compute the final position
    gl_Position = MVP * vec4(position, 1.0);
}
~~~

Everything is the same as before, except for the keywords, all `attribute` keywords are now named as `in` and all `varying` keywords are named as `out` in the vertex shader. So in the case of vertex shader, we can just use text replacement.

## An example Fragment shader

Now take a look at the fragment shader, which is the gray-scale shader. It accepts the texture coordinates from the vertex shader above, fetches the texel, converts it to gray-scale, and outputs it to the framebuffer.

~~~glsl
#version 100 es
precision mediump float;

uniform sampler2D texUnit;

varying vec2 vTexCoords;

void main()
{
    // Sample the texture
    vec4 vColor = texture2D(texUnit, vTexCoords);

    // Gray-scale is the average of the components
    float gray = (vColor.r + vColor.g + vColor.b) / 3.0;

    // Set the gray as the display color of the pixel
    gl_FragColor = vec4(vec3(gray), vColor.a);
}
~~~

And how it translates is the following. The change is that there is a change in the version, the `varying` keyword is changed to `in` and additionally we have changed `gl_FragColor` to `g_FragColor`, and made it an `out` variable which is a output. And then we have to change `texture2D` function to `texture` as that is changed in the newer GLSL versions.

~~~glsl
#version 330 core
precision mediump float;

uniform sampler2D texUnit;

in vec2 vTexCoords;

out vec4 g_FragColor;

void main()
{
    // Sample the texture
    vec4 vColor = texture(texUnit, vTexCoords);

    // Gray-scale is the average of the components
    float gray = (vColor.r + vColor.g + vColor.b) / 3.0;

    // Set the gray as the display color of the pixel
    g_FragColor = vec4(vec3(gray), vColor.a);
}
~~~

So keeping multiple shader versions for each shader makes it difficult for the developer, because whenever he changes a shader, he has to change all its other versions too. To change this, we can write the shader in a custom format, and translate it at runtime, using the string manipulation functions the language provides.

## The code for Translation

Without any further ado, I'm going to present the code that I'm using in [SilenceEngine](http://silenceengine.goharsha.com) to generate shader sources from the common sources. This code is not perfect, and does not cover the complete changes in the language of GLSL, but this can be done. Now here is the code.

~~~java
StringBuilder sb = new StringBuilder();

// Get the platform, we translate to 100es if on WebGL or Android. On desktop,
// the version that we translate to is 330 core.
SilenceEngine.Platform platform = SilenceEngine.display.getPlatform();

// If the source contains a #version directive, do not change it.
if (!source.contains("#version"))
{
    // We assign the version tag only if it is not the default language version, that is core.
    String version = null;

    // Use CORE profile only on the desktop.
    if (platform != SilenceEngine.Platform.HTML5 && platform != SilenceEngine.Platform.ANDROID)
        version = "330 core";

    if (version != null)
    {
        // Append the version derivative followed by a new line character
        sb.append("#version ").append(version).append("\n");

        // If the shader is fragment shader, then we have to add a global directive
        // for the output color. This is only needed for fragment shaders.
        if (type == Shader.Type.FRAGMENT_SHADER)
            sb.append("out vec4 g_FragColor;\n");
    }
    else
    {
        // We are not on desktop OpenGL, that means we are on either WebGL or OpenGL ES.
        // So we have to translate the modern keywords in and out as well depending on the
        // type of the shader. This is done through #define directives.
        sb.append("#define in ").append(type == Shader.Type.VERTEX_SHADER ? "attribute\n"
                                                                          : "varying\n");

        if (type == Shader.Type.VERTEX_SHADER)
            sb.append("#define out varying\n");

        // Now change the texture function name, and change the global to the built-in.
        // Also set the precision to float by default.
        sb.append("#define texture texture2D\n")
                .append("#define g_FragColor gl_FragColor\n")
                .append("precision mediump float;\n");
    }

    // Finally append the #line 0 directive, so that the error messages in the
    // shaders are reported at the correct line number. From the next line, the count
    // starts at one and so on.
    sb.append("#line 0\n");
}

// Now append the original source code and we can work fine with it.
sb.append(source);

return sb.toString();
~~~

As you can see, I don't use string replacement here, but instead I go with appending `#define` directives before the code, by using a `StringBuilder`. Though this makes the process easy, this also has a few advantages:

  - String replacement might change the length of the words, and if that is done, the errors if present will get reported with a different column numbers.
  - String replacement takes some time to be done, and it is cheaper to append strings to StringBuilder than replacing the string. This gives performance.

So now you know how to abstract the GLSL and GLSL ES languages, go on now and comment how you do this. There are a lot of other clauses to be changed due to the differences, so try to add the other changes as well.

Do you know that you can use this kind of approach to implement the `#include` directive? Yes you can do that, try it as an exercise, and tell me if it works for you.

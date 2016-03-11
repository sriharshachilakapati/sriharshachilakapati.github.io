---
title: Fullscreen Mode
layout: webl4jtutorial
permalink: /webgl4j-tutorial-series/fullscreen-mode/
section: 1
---

Welcome back to the third part of the WebGL4J tutorial series. In the previous part, I have covered about the WebGL context, we understood what a context is, how to create one, and also using multiple contexts. However, WebGL4J offers yet another feature which is tied to the contexts - the fullscreen mode.

## Fullscreen API

The fullscreen API is actually implemented differently in different browsers, and they all impose some restrictions on it's usage, due to security issues. The API provided by WebGL4J is a cross-browser polyfill (a common abstraction for all the browsers) which has been tested on Edge, Chrome, Firefox, Opera and Safari (Mac version, Windows version doesn't support WebGL).

> A context can only be made fullscreen if and only if the API call is triggered by user interaction.

This means that you cannot just switch to the fullscreen mode just upon module load, you can only switch the state upon a button click or a key press. In no other way it will work. And in chrome, some special keys like <kbd>Alt</kbd>, <kbd>Ctrl</kbd> etc., doesn't work when in fullscreen mode.

## Fullscreen and the Context

As said earlier, the fullscreen polyfill is tied to the context, and WebGL4J provides 3 methods that help you to use the fullscreen API with ease. Here are the functions and what they does.

| Method                | Modifiers & Type        | Description                                  |
|:----------------------|:------------------------|:---------------------------------------------|
| `requestFullscreen()` | `public boolean`        | Requests the browser to make the canvas fullscreen. Returns whether the request is accepted or not. |
| `isFullscreen()`      | `public static boolean` | Checks if there is any context which is fullscreen. Might include non-canvas objects too. |
| `exitFullscreen()`    | `public static void`    | Orders the browser to exit the fullscreen mode. This call will succeed immediately.    |

With these three methods, you can use the fullscreen API in all the major browsers. On unsupported browsers, I guarantee that these calls will be ignored.

~~~java
// Store the context upon creation.
WebGLContext ctx = WebGL10.createContext();

// Request the browser to make it fullscreen.
boolean success = ctx.requestFullscreen();

if (success)
    // Request accepted, we should be in fullscreen mode shortly.
else
    // Browser didn't accept the request, check Console for reason.
~~~

Remember that these requests can only be made upon user interaction. Then only the browser will accept the request. However there is still one more thing to do.

## True fullscreen in Chrome

In Google Chrome, there is an issue with fullscreen, instead of setting the canvas to the size of the screen, Chrome makes it in the center with the original size with other content of the page blacked out. This also happened in the earlier builds of some other browsers, so we have to stretch the canvas ourselves by using CSS.

~~~css
canvas:fullscreen
{
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    margin: auto;
    width: 100%   !important;
    height: 100%  !important;
}
~~~

This is the actual CSS, but we also have to handle the case of vendor prefixes, and also we have to do it the GWT way. So we create a `StyleElement`, set the inner HTML of the element with the CSS, and append it to the head of the document. This is how it looks like.

~~~java
StyleElement style = Document.get().createStyleElement();

style.setInnerHTML(
        // Style as per the specification
        "canvas:fullscreen                          \n" +
        "{                                          \n" +
        "    position: absolute;                    \n" +
        "    top: 0; left: 0; right: 0; bottom: 0;  \n" +
        "    margin: auto;                          \n" +
        "    width: 100%   !important;              \n" +
        "    height: 100%  !important;              \n" +
        "}" +

        // Style for webkit browsers (Chrome & Safari)
        "canvas:-webkit-full-screen                 \n" +
        "{                                          \n" +
        "    position: absolute;                    \n" +
        "    top: 0; left: 0; right: 0; bottom: 0;  \n" +
        "    margin: auto;                          \n" +
        "    width: 100%   !important;              \n" +
        "    height: 100%  !important;              \n" +
        "}" +

        // Style for mozilla (Firefox)
        "canvas:-moz-full-screen                    \n" +
        "{                                          \n" +
        "    position: absolute;                    \n" +
        "    top: 0; left: 0; right: 0; bottom: 0;  \n" +
        "    margin: auto;                          \n" +
        "    width: 100%   !important;              \n" +
        "    height: 100%  !important;              \n" +
        "}" +

        // Style for MS browsers (IE and Edge)
        "canvas:-ms-fullscreen                      \n" +
        "{                                          \n" +
        "    position: absolute;                    \n" +
        "    top: 0; left: 0; right: 0; bottom: 0;  \n" +
        "    margin: auto;                          \n" +
        "    width: 100%   !important;              \n" +
        "    height: 100%  !important;              \n" +
        "}"
);

// Insert the CSS into head of the page
Document.get().getHead().appendChild(style);
~~~

The issue is currently only seen in Google Chrome, but we set the CSS for all browsers to guarantee the same behaviour. Now we are forcing the size, so the contents of the canvas are stretched.

## Fixing the stretched canvas

To prevent the stretching on the canvas and to make use of the entire screen, just change the viewport in WebGL to the client size of the canvas. You have to note that the element size and element client size are different.

~~~java
glViewport(0, 0, canvas.getElement().getClientWidth(), canvas.getElement().getClientHeight());
~~~

And that is it for this tutorial, you have understood how to use the fullscreen API to make your WebGL canvas occupy the entire screen.

## Source Code

The source code for the tutorial can be found in the GitHub repository.

  - [Main.java](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/blob/ad768f8932f1a64692df9aa09592145136d333c9/src/main/java/com/shc/tutorial/webgl4j/client/Main.java)

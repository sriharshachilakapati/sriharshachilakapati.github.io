---
title: Setting up the workspace
section: 1
layout: webgl4jtutorial
permalink: /webgl4j-tutorial-series/setting-up-workspace/
---

Welcome to the first tutorial in the WebGL4J Tutorial Series. This tutorial does assume that you know the basics of GWT, as this is a GWT library, and we use GWT as the compiler to compile to JavaScript code. Since different IDEs have different ways of setting up a GWT project, this tutorial series will use [Gradle](http://gradle.org/) as the build tool. We will be using the awesome [gwt-gradle-plugin](https://github.com/steffenschaefer/gwt-gradle-plugin) for compiling GWT application with this.

## Creating a Gradle project

The first step we will be doing is to create the project. Start with this command in the terminal (I'm assuming that you have gradle installed, you should have it installed, it's so awesome I'd say). We'll create the project first and then we will be adding WebGL4J and GWT to the dependencies later.

{% comment %}
```bash
{% endcomment %}
{% highlight bash %}
$ gradle init
{% endhighlight %}
{% comment %}
```
{% endcomment %}

That should get you started with a Gradle template, which we could start to configure for our GWT project, by attaching the gwt plugin, creating the war file and the directory structure. It should have created a directory structure for you that looks like this.

{% comment %}
```bash
{% endcomment %}
{% highlight bash %}
.
├─ gradle
|  └─ wrapper           # The gradle wrapper
|
├─ build.gradle         # The build script
├─ settings.gradle      # Gradle settings file
├─ gradlew              # Unix gradle launcher
└─ gradlew.bat          # Windows gradle launcher
{% endhighlight %}
{% comment %}
```
{% endcomment %}

Now, let us start adding new directory called as `src` in the root, and create the paths `src\main\java\` and `src\main\webapp\` which will make up the final directory structure for our Gradle based GWT project. This is how the latest directory structure looks.

{% comment %}
```bash
{% endcomment %}
{% highlight bash %}
.
├─ gradle
|  └─ wrapper
|
├─ src
|  └─ main
|     ├─ java       # The root for Java sources
|     └─ webapp     # The root for web application
|
├─ build.gradle
├─ settings.gradle
├─ gradlew
└─ gradlew.bat
{% endhighlight %}
{% comment %}
```
{% endcomment %}

I guess you already know, but let me reiterate the things. We will be having our Java sources in the `java` directory. These files will be compiled by the GWT compiler, and the output JS files are produced. The `webapp` directory is used to contain the starter HTML page called as `index.html` which includes the JS file produced by the compiler so the browser can run it.

## Build Script dependencies

Now that we have created the gradle project, it's now time to edit the build script and add in GWT, and WebGL4J to the build, and also setup the **SuperDevMode** to develop our application in live and have the same reflected in the browser. We will be using Jetty to run the local server. Instead of dumping the whole build file at once, I will show you part by part. Let's start by adding the dependencies of the build script.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
buildscript {
    // The gwt-gradle-plugin can be found in jcenter repository
    repositories {
        jcenter()
    }

    // Add gwt-gradle-plugin to the dependencies of the build script
    dependencies {
        classpath 'de.richsource.gradle.plugins:gwt-gradle-plugin:0.6'
    }
}
{% endhighlight %}
{% comment %}
```
{% endcomment %}

The **gwt-gradle-plugin** is not part of the Gradle distribution, so we have to have it in the classpath so Gradle can load the plugin and let us compile GWT Java code. This plugin is available in the [jCenter](https://bintray.com/steffenschaefer/maven/gwt-gradle-plugin/view) repository, so we add it to the repositories section. Then we add it to the classpath.

## Configuring GWT

To configure GWT successfully with the Gradle, we have to apply the GWT plugin and configure it with the `gwt` section in the build script. We also apply the `java` plugin since we are using Java for our sources. Start by adding the plugins to the build.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
apply plugin: 'gwt'
apply plugin: 'java'
{% endhighlight %}
{% comment %}
```
{% endcomment %}

Now we will take a look at the configuration. Here we will tell the plugin what GWT version to use as the compiler, the GWT modules that we want to compile, and also the module that we want to use in development mode. To do that, we use the `gwt` section.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
gwt {
    // Increase the memory
    minHeapSize = "512M"
    maxHeapSize = "1024M"

    // Set the GWT version
    gwtVersion = '2.7.0'

    // Set the modules to be compiled
    modules 'com.shc.tutorial.webgl4j.client'
    devModules 'com.shc.tutorial.webgl4j.client'

    // SuperDevMode configuration
    superDev {
        noPrecompile = true
    }
}
{% endhighlight %}
{% comment %}
```
{% endcomment %}

As you can see, I have increased the memory settings from the default. That is done to avoid the `OutOfMemoryError` from being raised when the GWT compiler is working. GWT is very memory hungry, and will work more fast when you give it more memory. I have also set the modules to be compiled to our tutorial package (Create one). Also I have added the `noPrecompile` flag to the SuperDevMode runtime.

## The SuperDevMode

SuperDevMode allows us to live test our application in a browser, and also debug it through the use of a standard called as **SourceMaps**. We will be using it to preview the application. I guess that you have at least some basic experience with GWT so I'm skipping the details. Let's start by importing the required class from the GWT plugin and applying other required plugins.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
import de.richsource.gradle.plugins.gwt.GwtSuperDev

apply plugin: 'jetty'
apply plugin: 'war'
{% endhighlight %}
{% comment %}
```
{% endcomment %}

The SuperDevMode works by running the generated WAR archive, and we will be using jetty server to run the WAR in the browser. To do that, we need to write some tasks to allow us to launch in SuperDevMode from the command line when we are building our application.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
// Control what goes into the output archive. Also pack the resources
// along with the HTML file and the compiled JS sources.
war {
    from sourceSets.main.resources
}

// A task to run a generated war file. This task depends on the war
// plugin to generate a war file that contains the build output that
// is ready to be run on the server.
task run(type: JettyRunWar) {
    dependsOn war
    webApp = war.archivePath
    daemon = true
}

// This task starts the super dev mode of GWT where you can run your
// application in a local server. The changes you make to your java
// source will be detected and the app will be re-compiled automatically.
task superDev(type: GwtSuperDev) {
    dependsOn run

    doFirst {
        gwt.modules = gwt.devModules
    }
}
{% endhighlight %}
{% comment %}
```
{% endcomment %}

Here the task `superDev` is used to run the development mode, and it calls the `run` task, after switching the gwt module to the development modules. The run task, sets the web application to the archive path of the generated war file, and starts the server in daemon mode, that is we can have continuous builds while the server is on. The task run depends on the generation of the war, and that's how this works.

## Adding WebGL4J to the project

It's now finally time to add WebGL4J library as the dependency. For this tutorial series, we will be using the latest version of WebGL4J as of this writing, which is 0.2.8. We will be using WebGL4J from the maven central repository. Also let's add in some of the additional dependencies. One thing to keep a note, there is `gwt-servlet` library in the dependencies even though we don't use it. That is because if we don't specify it there, then it is added by default by the gwt plugin.

{% comment %}
```groovy
{% endcomment %}
{% highlight groovy %}
dependencies {
    providedCompile 'com.goharsha:webgl4j:0.2.8'
    providedCompile 'com.google.gwt:gwt-user:2.7.0'
    providedCompile 'com.google.gwt:gwt-servlet:2.7.0'
}
{% endhighlight %}
{% comment %}
```
{% endcomment %}

You can note that from the dependencies section, we are using `providedCompile` instead of `compile` to add our dependencies. That helps reduce the size of the war file that is created when we build the app, as it prevents the library JAR files from getting into the WAR file. We also don't need them since all the relevant code will already be compiled into the JS output files.

## Creating the GWT module

All we have now is just the build script and the gradle project, we cannot build anything since we have no sources. Let's first start with the HTML page, create a file called as `index.html` in the webapp directory with the following contents. All we do here is just load up the generated javascript file into the page.

{% comment %}
```html
{% endcomment %}
{% highlight html %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WebGL Tutorial Series</title>

    <script src="webgl4j_tutorial_series/webgl4j_tutorial_series.nocache.js" type="text/javascript"></script>
</head>
<body>
</body>
</html>
{% endhighlight %}
{% comment %}
```
{% endcomment %}

Now we have the HTML starter page, this is the page that displays our application in the browser. Now create a file called as `client.gwt.xml` in the location **src\main\java\com\shc\tutorial\webgl4j** that describes our GWT module. It should be as follows.

{% comment %}
```xml
{% endcomment %}
{% highlight xml %}
<!DOCTYPE module PUBLIC "-//Google Inc.//DTD Google Web Toolkit 2.0//EN"
        "http://google-web-toolkit.googlecode.com/svn/releases/2.0/distro-source/core/src/gwt-module.dtd">
<module rename-to="webgl4j_tutorial_series">

    <!-- Inherit the core Web Toolkit stuff.                  -->
    <inherits name='com.google.gwt.user.User'/>

    <!-- Inherit the WebGL4J library.                         -->
    <inherits name='com.shc.webgl4j.client'/>

    <!-- Define the entry point                               -->
    <entry-point class='com.shc.tutorial.webgl4j.client.Main'/>

    <!-- The source path for the GWT compiler -->
    <source path='client'/>
</module>

{% endhighlight %}
{% comment %}
```
{% endcomment %}

Now we are at our last step. That is creating the entry point class. Create a java class in the package **com.shc.tutorial.webgl4j.client** named as `Main` and make it implement the `EntryPoint` interface.

{% comment %}
```java
{% endcomment %}
{% highlight java %}
package com.shc.tutorial.webgl4j.client;

import com.google.gwt.core.client.EntryPoint;

public class Main implements EntryPoint
{
    @Override
    public void onModuleLoad()
    {
        // Implement application here
    }
}
{% endhighlight %}
{% comment %}
```
{% endcomment %}

That's it, we now have everything set up for our gradle gwt project, to test everything, run **gradlew clean build superDev** and once you browse to the localhost server location it outputs, you should be greeted with a blank page. If you get to that point, you are done setting up the project.

## Creating a black Canvas

I won't be going into too much details here, as it's already too long for this tutorial. This will be covered in the next part of the tutorial series in much depth. Bear with me for a few minutes and we will be having our black canvas. Instead of too much explanation, here is the code.

{% comment %}
```java
{% endcomment %}
{% highlight java %}
// The first thing one should do is to create a canvas. It is required to perform WebGL rendering.
Canvas canvas = Canvas.createIfSupported();

if (canvas == null)
{
    // Now if a canvas is null, that means that the browser has no HTML5 support.
    Window.alert("Error, cannot create canvas, please use a supported HTML5 browser.");
    return;
}

if (!WebGL10.isSupported())
{
    // You can check if WebGL is supported. If not, report to the user that the browser is not supported.
    Window.alert("Error, your browser does not support WebGL, please use a supported browser.");
    return;
}

// Now set the dimensions of the canvas, and add it to the RootPanel.
canvas.setCoordinateSpaceWidth(640);
canvas.setCoordinateSpaceHeight(480);
RootPanel.get().add(canvas);

// Create the context, here we are creating a WebGL 1.0 context.
WebGL10.createContext(canvas);

// Set the clear color of the canvas, and clear the color buffer. Here we make it back.
glClearColor(0, 0, 0, 1);
glClear(GL_COLOR_BUFFER_BIT);
{% endhighlight %}
{% comment %}
```
{% endcomment %}

Of course to make it work you have to static import the functions in the class `WebGL10` which belong to the WebGL 1.0 specification. All we do here is create a canvas, create the context, set the size of the canvas and add it to the RootPanel, and clear the screen with black.

## Source Code

The source code for this tutorial is available at [GitHub](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/tree/6e0f3d97b6834ce8c7604d63a8a51f1396a7df77) repository.

  - [build.gradle](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/blob/b2f2828f03fa6daf81e6e03d110de49b7db3a225/build.gradle)
  - [index.html](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/blob/b2f2828f03fa6daf81e6e03d110de49b7db3a225/src/main/webapp/index.html)
  - [client.gwt.xml](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/blob/b2f2828f03fa6daf81e6e03d110de49b7db3a225/src/main/java/com/shc/tutorial/webgl4j/client.gwt.xml)
  - [Main.java](https://github.com/sriharshachilakapati/WebGL4J-Tutorial-Series/blob/b2f2828f03fa6daf81e6e03d110de49b7db3a225/src/main/java/com/shc/tutorial/webgl4j/client/Main.java)

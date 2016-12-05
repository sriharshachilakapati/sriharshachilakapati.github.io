---
layout: post
title: Complete Website Theme and Tutorials Update
tags: Jekyll Website Theme LWJGL3 WebGL4J Tutorial
date: 2016-12-05 11:13 +5:30
---

This post is to share with you about the changes to the website, and also what I plan to do in the future regarding the tutorials that I'm writing, especially **LWJGL Tutorials** and **WebGL4J Tutorials**. I agree it's been a long time since I wrote the tutorials, and I have been kept waiting because the libraries they use were unstable and in alpha. It was so early that I jumped in, and wrote the tutorials, even while LWJGL is in alpha, and I think it is a mistake. Now that it got released, I'm now going to refactor them with the new API changes within a few weeks.

## The Website Theme

There are also a lot of changes in the look and feel of this website, I completely re-did the theme, evaluating every factor of the website, and have done major work in modularizing the functionality with different includes. Of course, I tried to reuse as much code as possible, and hence I was able to get this final theme only by changing a few areas:

  - The background is now striped using CSS3
  - The navigation bar is now redesigned with a different tint of blue
  - The code blocks are now translucent and have a blue border on their left
  - All the font units are now in **em**
  - All the layout units are now specified in **%** unit

Apart from these, I did tweak a little bit of other areas like syntax highlighting fonts, they are now made to use a lot of fonts in preference. Take a look at the preview of some dummy code block.

~~~java
// Some dummy pointless code in Java language
System.out.println("Hello World!!");
~~~

It looks cool isn't it? Care has been taken that the code blocks doesn't wrap text, but instead they overflow, allowing you to clearly read the text on mobiles, keeping track of the indentation easily. The following GIF shows the new navigation bar and the dropdown menu.

{% include image href='/assets/images/complete-website-theme-and-tutorials-update/dropdown-menu.gif' alt='The new tweaked Dropdown menu' %}

There you can see the new navigation bar, and the colors. It is essentially the same as the previous one, but the dropdown background color is made a dark blue, and selection is actually a translucent gray color which makes any color dark automatically.

## LWJGL Tutorials

The LWJGL tutorials need some major changes in the API, and before changing the code in the tutorials, I'm going to first update the code in the repository. Once that is done, updating the articles is fairly easy. Here is my roadmap for the LWJGL tutorials.

  - Modify the code in the repository for the new API
  - Structure tutorials such that each tutorial is in its own module
  - Update existing tutorials on the website
  - Record videos for existing tutorials for those who prefer video tutorials over text
  - Add more tutorials later

This is planned to be done by the end of my current semester, as I have some roadblocks in the middle in the form of mid-term exams, a ludumdare event, a hackathon on MEAN stack, etc., I also plan to explain the math, and then use the JOML library in the tutorial.

## WebGL4J Tutorials

The WebGL4J tutorials take more time, since the GWT gradle plugin seems not to be maintained anymore, and it doesn't support the latest GWT version, which is 2.8.0 at the time of writing this post. In that context, I have been postponing the WebGL4J tutorials. The roadmap for that is the following:

  - Find a maintained fork of gwt-gradle plugin, or I'll fork it myself
  - Make the code work with the latest GWT version
  - Try to get SuperDevMode to work with Gretty (Jetty is deprecated)
  - Structure tutorials such that each tutorial is in its own module
  - Update existing tutorials on the website
  - Record videos for existing tutorials for those who prefer video tutorials over text
  - Add more tutorials later

I'm planning to make it completely work by the mid of 2017. It's a long time, I know, but that is required for the amount of work that is present. Additionally I'll be adding a run task for the gradle projects so that one can easily run the tutorials from command-line.

## Conclusion

So this is the new update, and this also taught me how to apply modern CSS, how the units work etc., where previously I used to use all the units in pixels with different media queries for mobile and desktop, but now, em units are easy to use in responsive designs.

I also got planned on updating the tutorials. In the mean time, I received many e-mails from people asking about the future of the tutorials, and also in the comments, thanks a lot to them for keeping me interested in all this tedious work.

---
title: New changes to the Tutorial system
layout: post
tags: ['tutorial system', jekyll, 'data driven', 'update']
---

I have recently made enhancements to the tutorial system in this site, which allows me to write tutorials easily without worrying about the generation of the contents HTML. There are three main things that this post elaborates to you &mdash; the contents pane, the way new tutorials will be written, and the future plans regarding the contents.

## The Contents Pane

<div class="pull-right" style="background: #f5f5f5; border: 1px solid #eee; margin-left: 15px !important; padding-left: 0px !important;" markdown='1'>
![The contents section in LWJGL Tutorial Series]({{ site.url }}/assets/images/changes-to-tutorials/lwjgl-tuts_contents.png)

<div class="text-center small" style="padding: 0px !important; margin: 0px !important;" markdown='1'>
_A screenshot of contents pane_
</div>
</div>

The contents pane existed in the tutorials for a long time, so what is changed? I'm now using YAML data that Jekyll offers to write the contents, which gets copied into every post with the help of a recursively included html template file.

This is a huge refactoring, considering the fact that I was previously using `toc` in the front matter for every post which contains HTML of the contents for that tutorial in the series, maintaining which is a nightmare. Now that I have made this switch, everything is awesome for me. You can see it for yourself in the screenshot onto the right.

As you can see, it shows all the main sections, and opens the section that the current tutorial is in. This is perfect for my needs, and is now generated from a YAML data file stored in the `_data` folder.

That data file is rendered using a recursively included HTML include file, which I use to replace the missing functions in Liquid. That YAML data file looks like this snippet (Most code omitted for brevity).

~~~yaml
- text: 'Home'
  href: '/lwjgl-tutorial-series/'

- text: '1. GLFW'
  href: '/lwjgl-tutorial-series/hello-window/'
  section: 1
  children:
      - text: '1.1. Hello Window'
        href: '/lwjgl-tutorial-series/hello-window/'
        [...]

- text: '2. Basic OpenGL'
  href: '/lwjgl-tutorial-series/world-of-shaders/'
  section: 2
  children:
      - text: '2.1. World of Shaders'
        href: '/lwjgl-tutorial-series/world-of-shaders/'
        [...]
~~~

This makes them much easier to maintain. The magic is then done in a recursively included HTML file that I use as a function. This recursively iterates through the data file, and generating the contents section. It is done in an include file called as `tutorial-contents.html` residing in the `_includes` directory of my site. Since it's a bit long, I'd simply give a link to GitHub source [here](https://github.com/sriharshachilakapati/sriharshachilakapati.github.io/blob/master/_includes/tutorial-contents.html). And I can then use it in the layout like this:

~~~html
<div class="row toc">
    <h3>Contents</h3>
    <ul class="nav navbar-pills navbar-stacked">
        {% raw %}{% include tutorial-contents.html items=site.data.lwjgltuts %}{% endraw %}
    </ul>
</div>
~~~

I can also put a parameter `exists: false` in the YAML of the data file, and have the link generated in red color, indicating that the tutorial is planned but not yet written. You can see an example of that in the [WebGL4J Tutorial Series]({{ site.url }}/webgl4j-tutorial-series/) page.

## Writing new tutorials

I can now write new tutorials for this just by copying the layout, and changing the data file in the TOC. To get the sub-sections to be rendered, I add a new parameter called as `section` to the YAML front matter of the markdown file.

~~~yaml
---
section: 1
---
~~~

When this is added along with other parameters, the include file (the magic widget as I call it) will open the section 1 in the contents. I have not added opening of sub-sections as I just do not need it, but it should be easy enough to do that when I require it.

## Future plans regarding tutorials

I think you might have noticed, I have started a new tutorial series called as [WebGL4J Tutorial Series]({{ site.url }}//webgl4j-tutorial-series/) which are tutorials for my WebGL4J library. Since now there is a clashing with OpenGL tutorials in WebGL4J and LWJGL3 (Both share the same design), writing tutorials for both of them in a full detail manner will provide duplication of tutorials.

OpenGL is same whether it is WebGL or Desktop GL. So I would like to turn them away from OpenGL, and I will be showing how to make an example OpenGL application, one with WebGL4J and one with LWJGL3. And then, I might be starting a new OpenGL Tutorial Series. I'll also have a tutorial series on [SilenceEngine](http://silenceengine.goharsha.com) in the future.

And my plan for now, is to write a tutorial a week, and publish it on Sunday, that might make it a bit regular. I might also make video versions of these tutorials.

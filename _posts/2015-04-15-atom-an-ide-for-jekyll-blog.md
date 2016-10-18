---
title: Atom - An IDE for Jekyll blog
layout: post
keywords: ["atom", "editor", "jekyll", "ide", "static", "website", "development"]
tags: ["Jekyll", "Atom", "Website"]
---

Since I moved my website to Jekyll, I was looking for a good and complete editor to write my posts. I always didn't like seeing myself switching between my editor, project folder and the web browser to see how the post will be on the final page.

I looked for soo long in order to find an IDE **(An Integrated Development Environment)** for web development as it simplifies the process and increases productivity. There are complex IDEs like **IntelliJ WebStorm** but they are very heavy for blogging with Jekyll. Their features like debuggers are not useful for me because I'm not a web developer writing web apps.

All I wanted is a simple editor which supports syntax highlighting and had a built-in web browser so that I don't need to **Alt-Tab** in between the editor and browser windows. Fortunately, I have found [Atom](https://atom.io/), a programmers text editor from [GitHub](https://github.com/).

![My Atom Workspace setup]({{ site.url }}/assets/images/atom-jekyll-ide/atom-ide-in-action.png)

As you can see in the image above, I have my workspace in the Atom editor split into three panes, the first one being the **File Tree** followed by the **Editor** in the second pane and the **Browser** in the third pane. This helps me greatly, it is now very interesting to blog using Jekyll.

I still need to open the **Command Prompt** on my own though, but since that is only used to run the Jekyll server, I simply keep it minimized because Jekyll has an option to watch the file system. I had also installed one plugin for the web-browser, located here: [https://atom.io/packages/web-browser](https://atom.io/packages/web-browser).

The next gotcha is the **Live-Reload** feature is not working for me, but I can always manually press the reload button on the browser toolbar above. This is how I blog with Jekyll.

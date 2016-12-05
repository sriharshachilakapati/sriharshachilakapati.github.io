---
layout: post
title: Jekyll Trick - Implementing DevMode and LiveReload
tags: Jekyll Website Tutorial
---

Normally just as every other web developer, we try to have a development mode, and a production mode. We want to keep some features only in the development mode, even though we want to commit it to our repository, or we want to include adsense code only in the production mode, that is, when deployed on the website.

Unfortunately, Jekyll does not have any built-in feature of development mode, but don't worry, we have an alternative that works without installing any other software, with Jekyll itself. We are going to exploit the configuration files for this purpose.

## The DevMode configuration file

Jekyll supports the use of multiple configuration files, which we are going to use to support the development mode. Let's get into a bit more detail on how this works. Remember the `_config.yml` file that you had in the root of your website? That is the configuration file that Jekyll uses by default, but it is also possible to build it with custom configuration files locally.

~~~yml
development: true
~~~

Add the above to create a new file `_development.yml` and also do not forget to add the same with the opposite value to the default `_config.yml` file. Now to launch the site in development mode, you can do the following:

~~~
$ jekyll serve --watch --config _config.yml,_development.yml
~~~

This is how we can implement the development modes. This works only if you append the `_development.yml` after the regular configuration file, so that the `development` property will get overridden and you get the development mode.

~~~liquid {% raw %}
{% unless site.development %}
    {% comment %}
    The code for adsense goes in here!
    {% endcomment %}
{% endunless %}{% endraw %}
~~~

You can now use this property in Liquid syntax, and do certain things, like I want to include adsense code only in production mode (because reloading the same page often in development mode with adsense on may cause strikes on the site, and the ads get disabled for some time).

## Implementing LiveReload

Live reloading is nothing but having not to reload the browser you made changes to your code, or to your posts. We usually find ourselves constantly pressing <kbd>Alt</kbd>+<kbd>Tab</kbd> in order to switch between browser and editor, and then using <kbd>Ctrl</kbd>+<kbd>R</kbd> to reload the page. This is much painful when we are working with CSS, as in that case we have to keep on switching and reloading everytime we made a change.

~~~html {% raw %}
{% if site.development %}
    <script src="{{ site.url }}/live.js" type="text/javascript"></script>
{% endif %}{% endraw %}
~~~

This is done by using [Live JS](http://livejs.com) that implements a JavaScript library that constantly checks with the server whether the file is changed or not, and if changed, it triggers a reload. Even nicer, when we change the CSS, it dynamically applies the styles without reloading the pages, saving much time. It is great if we have multiple monitors. However we do not want this to be in production, so just add it with in the guard as shown above.

## Conclusion

In case that you are wondering whether this works on GitHub Pages, believe me it works, I myself am using GitHub pages for this website, and GitHub just calls Jekyll with the default `_config.yml` file and it doesn't know what is the `_development.yml` file is. So that is the end of this short trick, go on and enjoy blogging in Jekyll.

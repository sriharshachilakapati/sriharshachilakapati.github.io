---
title: Sharing Buttons, Jekyll How-to
layout: post
keywords: ["Sharing Buttons", "Jekyll", "How-to"]
tags: ["Jekyll", "Website", "Tutorial"]
---

This post is to explain how I added the sharing buttons to this Jekyll website. I was trying to do this for quite some time before, but all I got into was trouble, as I'm not a web developer basically and don't know how these buttons work. After a long time, today I managed to get sharing buttons to be working, and here is how. I will be detailing the process for each social media platform individually.

## Google Plus Share button

Sharing on Google Plus is extremely easy, in fact it is easiest of them all. All you need to do is to add the following code into the page where you want the Google+ sharing button. The icon is downloaded from [here](https://developers.google.com/+/web/share/#sharelink-sizes).

{% raw %}
~~~html
<a href="https://plus.google.com/share?url=http://goharsha.com{{ include.url }}&hl=en-US"
 onclick="javascript:window.open(this.href,'',
  'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;">
    <kbd>
        <!-- use the google+ logo for the link -->
        <img
            alt="..."
            class="footer-icon"
            width="28px"
            src="{{ site.baseurl }}/assets/social-icons/g+icon.png">
        </img>

        Google+
    </kbd>
</a>
~~~
{% endraw %}

Make sure that you replace the site url with the url of your site, or else you will generate 404 errors on my site. Now there is this `include.url` which means that we are going to do it as a Jekyll widget, so we can include it where ever we want in the site.

## Linkedin Share button

The Linkedin share button is a bit more work than the Google+ button, that it requires you to also specify the title of the page in the button data. The image is downloaded from [brand.linkedin.com](https://brand.linkedin.com/) as a zip archive. The code looks like this.

{% raw %}
~~~html
<a href="http://www.linkedin.com/shareArticle?mini=true&url=http://goharsha.com{{ include.url }}&title={{ include.title }}&source={{ include.title }}">
    <kbd>
        <!-- use the linkedin logo for the link -->
        <img alt="..."
            class="footer-icon"
            width="34px"
            src="{{ site.baseurl }}/assets/social-icons/lnicon.png">
        </img>

        Linkedin
    </kbd>
</a>
~~~
{% endraw %}

Here we got another additional parameter `include.title` which will be the title of the page. There are a variety of options here, but I just copied this code from the documentation site, and tweaked it for Jekyll. Now let's get to the last share button, which is Facebook share.

## Facebook share button

The Facebook share button is the most difficult one to make, as incorrectly doing it caused me to read an error saying that the application is in development mode, and I thought what this application is. The process is that you are required to create a Facebook developer account, and register your website as an application.

  - **Step 1.**
     Go to [developers.facebook.com](https://developers.facebook.com/) and click on the button in the top-right called as _register_ and register yourself as a developer.

  - **Step 2.**
     Now create a new Facebook page for your website, and get a unique name for it, such as **https://facebook.com/goharshasite/** and remember the name (**goharshasite**) for it. We need it to create an application.

  - **Step 3.**
     Now go do the developers site, and create an application, and give the name the same as the page as you have created in step 2. Now you will be given an application ID, which is a number.

After doing these three steps, you are now almost ready to implement the Facebook share button. So start by adding the Facebook SDK to the website. The following code should go just after the `<body>` tag in the layout.

~~~html
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : 'your-id-here',
      xfbml      : true,
      version    : 'v2.5'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
~~~

Make sure you replace the `appId` parameter in the script with the application id that you received from Facebook. This script is necessary so you can share your website posts. Now we can finally go and implement the code for the share button.

{% raw %}
~~~html
<a href="https://www.facebook.com/dialog/share?app_id=<your-id-here>&display=popup&href=http://goharsha.com{{ include.url }}&redirect_uri=http://goharsha.com{{ include.url }}">
    <kbd>
        <!-- use the facebook logo for the link -->
        <img
            alt="..."
            class="footer-icon"
            width="25px"
            src="{{ site.baseurl }}/assets/social-icons/fbicon.png">
        </img>

        Facebook
    </kbd>
</a>
~~~
{% endraw %}

Make sure that you replace the application id, and the site URL with yours, and then voila you had done adding the Facebook share button to your website. The image can be downloaded from [facebookbrand.com](https://www.facebookbrand.com/) website.

## Making the widget

To make it the Jekyll way, we make an HTML file and place it in the `__includes` directory, which I call as a widget, since it can be reused. Paste all the code above (except the Facebook SDK code) into a HTML file like this.

~~~html
<!-- Code for Facebook share button -->
<!-- Code for Linkedin share button -->
<!-- Code for Google+ share button -->
~~~

And then include it in all the layouts that you have, I added this at the end of the `post` and `page` layouts, so except the home page and 404 error page, the share buttons appear everywhere. All you have to do is just this.

{% raw %}
~~~liquid
{% include share-buttons.html url=page.url title=page.title %}
~~~
{% endraw %}

So simple isn't it? This way I have included it in the blog too, but replacing page elements with post, so the buttons are also visible right after the blog entry. This is one of the reasons I love widgets, and that is why I love Jekyll.

Why not give these buttons a try before implementing in your website?? ;)

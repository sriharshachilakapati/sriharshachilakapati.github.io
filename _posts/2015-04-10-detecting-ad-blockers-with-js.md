---
title: Detecting Ad Blockers with JavaScript
layout: post
tags: [AdBlockers, JavaScript, Identification]
---

AdBlockers are browser plugins that block the ads from displaying on the web pages. While they may be useful for blocking obtrusive ads, they also prevent some non-obtrusive ads from displaying on your pages. As a blogger who generates some small amount of revenue from ads, you may want to escape from these ad blockers.

Since these AdBlockers are implemented as browser extensions, there is no way that you can block them and you should not do so. At lease, I would like to show them a small message requesting them to disable their ad blocker on my site. This is possible to some extent, and this is how you can implement it into your site using JavaScript and jQuery.

## The JavaScript

Without requiring you to read up long paragraphs, I show you the JavaScript code immediately.

~~~js
$(document).ready(function ()
{
    // Run the check after 2 seconds giving the ads some time to load
    setTimeout(function ()
    {
        // Now check each ad container if it is blocked
        $('.ad_container').each(function ()
        {
            var ad = this;

            // We can consider a container blocked if it is empty or
            // it's client height is 0 (invisible)
            if (!ad || ad.innerHTML.length == 0 || ad.clientHeight === 0)
                $('#adblocker').css('display', 'block');
        });
    }, 2000);
});
~~~

In the above code, the `ad_container` is a class that you will use on the `<div>` element that wraps up the code for displaying your ads. The `adblocker` is the ID that is given to the `<img>` that shows the image requesting the user to disable their ad blocker on your site. Don't forget to hide the image initially using CSS.

This is how I detect ad blockers on my website. You can try enabling/disabling the adblocker to see this code in action on my website. My final word is, be gentle in chosing the message to be shown, or there is a danger that the visitor can block your container too.

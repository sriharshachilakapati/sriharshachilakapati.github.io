---
title: 'Implementing Tag Viewer in Jekyll Site'
layout: post
tags: ['Jekyll', 'Website', 'Tutorial']
---

Everyone wants a website with a tag viewer, who doesn't want that? But unfortunately it was troublesome for Jekyll (or static in general) websites, because for every new tag created, one needs to create a new page with some Liquid code to display posts with that tag. For example, we used to do this in the code.

~~~liquid
{% raw %}{% for post in site.tags.TAGNAME %}
    {{ post.title }}

    ... [ snipped ] ...
{% endfor %}{% endraw %}
~~~

This is good enough for most people, but not for everyone who likes to create a page like that dynamically. Guess what? You can do that in Jekyll (and all static websites too) but you need some client side JavaScript code for our help.

## A JSON of post meta-data

The approach we are going to take is to make Jekyll generate a JSON file with all the meta-data of the posts and the tags they contain, and then load them up in the page at runtime. So to create a JSON dynamically every time the site is regenerated, we include the YAML header to it so Jekyll will process the file.

~~~liquid
{% raw %}---
---
{
    "posts": [
        {% for post in site.posts %}
        {
            "title": "{{ post.title }}",
            "url": "{{ post.url }}",
            "date": "{{ post.date | date: "%b %-d, %Y" }}",
            "excerpt": {{ post.excerpt | jsonify }},
            "tags": [
                {% for tag in post.tags %}
                    "{{ tag }}"{% if forloop.last == false %},{% endif %}
                {% endfor %}
            ]
        }{% if forloop.last == false %},{% endif %}
        {% endfor %}
    ],

    "tags": [
        {% assign sortedTags = site.tags | sort %}
        {% for tag in sortedTags %}
            "{{ tag[0] }}"{% if forloop.last == false %},{% endif %}
        {% endfor %}
    ]
}{% endraw %}
~~~

We are generating a JSON file such as [this tags.json]({{ site.url }}/tags.json) on my site (You can use this as an alternative to RSS, this is always updated with my site). It contains all the post meta data, and also a list of tags in the site. But, how do we display them to the user?

## Idea of the Tag Cloud

What we want to do is to have a page which accepts `GET` parameters on the page, and parse them using JavaScript. There are several ways to get the query parameters, so I will leave it to you. We get the tag for which to display all the posts from the URL as `tags/?name=mytag` and display them. In case there are no parameters supplied, we are going to just display all the tags. By the way, I'm using the `<kbd>` tag for the tags.

## Creating the template page

To get the data displayed to the user, we need to have a template page, so go ahead and create `tags/index.html` with the following content. Don't forget to include the default layout, I'm only showing the code with the most important things here. We are going to keep the markup simple.

~~~html
<div id="template" style="display: none;">
    {% raw %}{% include blog-entry.html postUrl='$postUrl' postTitle='$postTitle' postDate='$date' postExcerpt='$excerpt' tags='$tags' %}{% endraw %}
</div>

<div id="content">
</div>

<div class="row">
    <h2>Tag Cloud</h2>
    <div id="tagCloud" class="col-xs-12">
    </div>
</div>
~~~

I made use of the includes, as then I can have a single template for the posts in both my blog and also my tag viewer. I separated the things from my blog into a separate file which you can find on [GitHub here](https://github.com/sriharshachilakapati/sriharshachilakapati.github.io/blob/master/_includes/blog-entry.html) which is then reused. I include it in my tag viewer under a `div` with an id `template` and it's style set to hidden. Additionally, there is a separate div for the tag cloud as well. Now it is time to load the JSON file and write JS to display them in the content div.

## Displaying the contents

To load the file and display the results, I am going to use jQuery library as I want to write the data in a shorter way. The following code is done in a script tag, via the javascript code. We load the JSON file, parse it, and then we loop over the posts. If the post contains the asked tag, then it is shown in the list. In the similar way, we do have the tags as well.

~~~js
$.getJSON('/tags.json', function(data) {
    var tagTemplate = '<a href="/tags/?name=$tag"><kbd>$tag</kbd></a>';

    for (var i = 0; i < data.posts.length; i++) {
        var post = data.posts[i];

        // If the post doesn't have the current tag, skip it.
        if ($.inArray(queryString.name, post.tags) == -1)
            continue;

        // Create the list of tags as a string. This is HTML code.
        var tags = "";

        // For each tag in the post, add it to the tags after
        // using it in the template.
        for (var j = 0; j < post.tags.length; j++) {
            var tag = post.tags[j];
            tags += tagTemplate.replace(/\$tag/g, tag);
        }

        // Get the template from the '#template' div and replace the values
        // in it to get the new entry.
        var template = $('#template').html()
            .replace(/\$postUrl/g, post.url)
            .replace(/\$postTitle/g, post.title)
            .replace(/\$date/g, post.date)
            .replace(/\$tags/g, tags)
            .replace(/\$excerpt/g, post.excerpt);

        // Append the entry to the HTML of #content
        $('#content').html($('#content').html() + template);
    }

    // Now comes the tag cloud, just add all the tags here.
    for (var i = 0; i < data.tags.length; i++) {
        var tag = data.tags[i];
        $('#tagCloud').html($('#tagCloud').html() + tagTemplate.replace(/\$tag/g, tag));
    }
});
~~~

Okay this is a long piece of code, but I think there is nothing to explain really in it. All we do is iterate over the posts and tags, and populate them to the content div, thus the results are populated dynamically. This is however not the best way to do, there are even more high performance solutions available.

## Further improvements

I haven't done these yet, but they can improve the user experience and are worth it when implemented. One such optimization is to rewrite the above script using `setTimeout` method so that when there are a lot of posts on a blog, then this does not stop the UI of the browser from responding.

Additionally, one may want to use bootstrap or such frameworks to implement client side pagination similar to the one done by Jekyll's paginate gem. And by the way, see this in action, in the tag cloud of my site: [goharsha.com/tags/]({{ site.url }}/tags/)

Hope to see you soon again, and thanks for taking time to read this post. Feel free to comment if you have any queries about this.

---
layout: post
title: Been to AP Cloud Initiative - Learnt MEAN stack
tags: ['AP', 'cloud', 'initiative', 'MEAN', 'MongoDB', 'ExpressJS', 'AngularJS', 'NodeJS']
---

The government of Andhra Pradesh has initiated the **AP Cloud Initiative** five days ago along with **Miracle Software Systems** with the mission to create 1,00,000 professionals who can make the state transform into **Digital AP** by investing ₹6,00,00,000/- (six crore rupees) for this mission, and I attended the training they are providing along with my team from our college. There were 26 teams from 26 different colleges across the state, and this was a great opportunity for all of us. Our team consisted of me along with three seniors of me in college and one of my faculty. I do thank both the government and team Miracle for this opportunity. I also thank my college for selecting me to be part of this team.

## A trip to Vizag city

All of us has never been to Vizag city, and when we reached there, it was a really cool place, although tiny showers of rain are happening due to this being the rainy season here. We got boarding at a local lodge, and we were there at Vizag city one day before the event started. So we used that day to get to know the surroundings, visit the beach, and get a clear path on the address of the campus and the training area.

{% include image href='/assets/images/vizag-ap-cloud/beach_selfie.jpg" width="500px' alt='A selfie at RK beach, Vizag city' %}

The next day we went to attend the inauguration function held at the **Andhra University** campus and immediately after the inauguration is done, we were taken to their office campus at Miracle Heights. It was an amazing location, with sea visible from the top.

## What's this Cloud is about?

Everyday there are loads and loads of data is being created, and we just cannot keep adding more and more hardware to keep up with the amount of data needed. We need a solution that is able to meet this huge data requirement. Another issue is that the number of concurrent connections to the server. Traditional web servers have limitations on the number of concurrent connections to the database, and the process isn't super fast too. So managing these things using high level tools is nothing but the cloud.

> Simply put, cloud computing is the practice of using a network of remote servers hosted on the Internet to store, manage, and process data, rather than a local server or a personal computer.

The solution requires us to have better control over the servers, and use high performance technologies for the database and stuff. This is why the world is moving away from the traditional LAMP stack and towards the MEAN stack. Though the LAMP stack served the world for years and still most of the web sites are using it with good enough performance, it is failing to give support for the enterprise services which required even more performance.

## The MEAN stack to the rescue

The MEAN stack is nothing but a set of tools, **MongoDB** for the database, **ExpressJS** for creating the server, **AngularJS** to easily write the templates and wire them up in client side, and finally **NodeJS** which is a high performance runtime for JavaScript language based on the Google's V8 JavaScript Engine. This lets one to easily write the web application using the same JavaScript language that they are already familiar with when doing the front-end.

~~~js
"use strict";

const app = require('express')();

function writePage(title, res) {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.write(
        // Generate the Page here.
    );
    res.end();
}

app.get('/', function routeHome(req, res) {
    writePage('Home', res);
});

app.get('/about', function routeAbout(req, res) {
    writePage('About', res);
});

app.listen(8080, function onSuccess() {
    console.log('Server running on port 8080');
});
~~~

The above example is as short as it can get to create a simple web server using NodeJS and ExpressJS and it does create two paths in the server. It's so simple and very easy to use API too. I don't want to get more code in this post, but will reserve that for a future post. The next good thing I liked to my heart is the **MongoDB**, which is a document based database system.

> Any relational database has a typical schema design that shows number of tables and the relationship between these tables. While in MongoDB there is no concept of relationship.

And that is the most amazing part of it, it is so flexible. We were confused in the start, like what did we hear? Is there such databases? And yes there are such databases that we didn't learn in **Database Management Systems (DBMS)** course in college, and **MongoDB** is one such amazing database software. The thing I liked about it is that it used **JSON** format to write the queries and insert the data into collections, which is my favorite data format language of choice.

## AngularJS, I might not use it right now

I'm no expert in the Web development, but to me AngularJS looks like a template rendering library in the client, correct me if I'm wrong, I'd really love to get on a discussion about that. Its syntax makes me remember **Mustache**, a JavaScript client side template rendering library, but it can also be used in server side. AngularJS is however a little bit more, like it can have multiple controllers, and template files.

However to me, it feels like client side routing with custom template variables is not any better because I think it will just result in multiple requests to the server from the browser which can be eliminated if the response is generated with the first request itself by rendering the template on the server itself. I might be wrong because I'm a newbie here, so please correct me if I'm wrong about it.

## Conclusion, and what our team will do now

The workshop has been an awesome time, and we were really excited about what we can do with this. I just got this idea when I'm writing this post, but this is going to be an awesome idea. It's about writing a web application which allows people to create online examinations, give them options and the system should also give the result, the percentage or GPA score, and also the correct key after the exam so the student can check where he/she committed the error.

So that's it for this post. Thanks a lot for reading this till the end, would love if we could get into a discussion on this in the comment box below. It's also free to share this post, why not try it??

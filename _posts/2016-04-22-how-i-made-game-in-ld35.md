---
title: Ludum Dare 35 - How I made the game
layout: post
tags: ['Ludum Dare', 'Amoebam', 'Post-Mortem']
description: The compo starts at 6:30 AM in my locality on Saturday, and I was awake by 5:00 AM on that day, waiting for the theme to be announced. It was very hyped and the site went down for me. I got to know the theme from the IRC and it is something that I had voted down!! It is shape shift. I must say it confused me a lot. I immediately went for a shower, and got to think about the theme.
---

If you haven't heard of the Ludum Dare before, it is the world's largest game jam, intended for game developers where you have to make a game according to a given theme within 48 hours. I've been participating in since Ludum Dare 31, and I've decided to participate again this time. This time, I wanted to try a new platform as well, that is HTML 5, and be productive with my engine too.

{% include components/widgets/image.html href="/assets/images/amoebam/IntroScreen.png" alt="Amoebam - Intro screen" %}

## Two months ago

I have started planning to learn HTML 5. I already knew some basics, which I learned along with WebGL when I wrote a Java binding of WebGL with the help of Google web toolkit. However the road block that I got into was sound.

I took a few weeks to study the web audio API and the OpenAL specification, and came to understand that the two APIs are very similar in design. I quickly wrote Java bindings for web audio API. But using two different APIs at once is time consuming, so I wrote an implementation of OpenAL according to the specification which delegated the calls to the web audio API which rendered the sound.

## One month ago

Except for the Ludum Dare 31, I have been using my own game engine for LD games, and I wanted to continue using it. However since I had written my engine with synchronous IO from the start, I had to rewrite it using asynchronous IO to support the HTML5 backend.

I also decided to rewrite the graphics, audio and also collisions etc., So I made a jump right in, and started developing in a new branch. I was able to plug in WebGL4J and GWT-AL for graphics and audio in the HTML5 backend, and LWJGL for desktop backends.

I quickly started writing interfaces in the engine project, and writing their implementations in the backend projects. I was able to get the basic tests up and running, with input support for keyboard, mouse and touch. Unfortunately the graphics and audio were incomplete, so I decided to use raw OpenAL and OpenGL for this JAM.

## Two days ago

I thought I should make a warmup this time, so I started to make a multi project build using gradle build system so that I can build to both desktop and HTML5 with a single code base. It was a bit hard to configure actually, so I thought it might consume a lot of time that is costly during the compo, so I quickly wrote a project generator that can be used to generate project files on run do that time can be saved.

{% include components/widgets/image.html href="https://github.com/sriharshachilakapati/SEProjectCreator/raw/master/screenshot.png" alt="Project Creator User Interface" %}

One thing to be noted, I always wanted to learn the JavaFX for writing user interfaces, and I learned it this time in just an hour to write the project generator. I felt it was really easy when compared with the traditional Swing and AWT GUIs. I wrote as many tests as I can for the engine, and started waiting for the compo to start.

## On the first day

The compo starts at 6:30 AM in my locality on Saturday, and I was awake by 5:00 AM on that day, waiting for the theme to be announced. It was very hyped and the site went down for me. I got to know the theme from the IRC and it is something that I had voted down!! It is shape shift. I must say it confused me a lot. I immediately went for a shower, and got to think about the theme.

Change in the shape.. hmm.. what is an object that changes shape? I thought in the shower and something else struck my mind.

> If the object has no shape like water, it will occupy the shape of the container.

But making a game about water is bit easy since I need to implement multiple containers for shifting shapes. The alternative that came to my mind was **Amoeba**. I immediately fired up Inkscape and made the assets, it took about two hours of the time. I made the sprite sheet for the character, the background and the clouds.

{% include components/widgets/image.html href="/assets/images/amoebam/Art.svg" alt="Complete Vector Art sheet for Amoebam" %}

By the afternoon, I have done the basic assets, and done the resource loading. Fortunately it worked in but l both HTML5 and desktop backends. I quickly turned the sprite sheets into animation objects and with a custom `SpriteRenderComponent` I was able to draw them. However the frame rate was too low, so I quickly coded by custom batch, which is the reason the game performed too bad in WebGL build, I used CPU to transform each and every vertex.

I also got the basic tile map defined in text files to load and render that day. I added entities, and coded the basic platformer movement, and buggy jump code. It was 2:00 in the night, and I went to sleep.

## The second day

The second day being the Sunday, and I had pretty much lack of sleep, I woke up at 10:00 in the morning, and had 8 hours of uninterrupted sleep. I immediately took a shower and took some breakfast. I skipped coffee, and started to code by 11:00 AM.

> The art is okay, but what about music?

I have composed a track before going to sleep the previous day, but it didn't play well according to the theme. I have composed another track from scratch while having breakfast and got that into the game. I decided to get other sound effects later if I had any time left.

{% include components/widgets/image.html href="/assets/images/amoebam/BeepBoxMusic.png" alt="Music composing in BeepBox" %}

I had refactored the tile map data into level objects which manipulated the scene and created entities by parsing a text file. I just made one level, and fixed some bugs in movement. By noon, I have the first level completely done. I had my lunch in half an hour, and sat down again to code.

> Hehe hhehe he.. Movie!!!

I got very bored after I made a cut scene mechanism and I switched over to watch a movie. Three hours passed away, and I came back to my computer. I took the coffee this time and started programming again. I have modified the shooting animation and changed the bullet sprite.

{% include components/widgets/image.html href="/assets/images/amoebam/GamePlay1.png" alt="Game Play screen" %}

I have only one evening left, and I decided to do the levels before dinner. I have made 6 levels and 10 cutscenes to make up a story and tutorial for the player. This rush explains why you will feel that the levels are too hard. I had dinner and then added 4 more levels. Finally I added sound effects for shoot and explosion.

{% include components/widgets/image.html href="/assets/images/amoebam/Rolling.png" alt="The rolling action in Amoebam" %}

The rolling animation is done in the end, before I did the last few levels. I had found some more bugs here, causing the entity to go inside the ground when rolling, so I had to prevent the rotation from affecting the collision component, written in a separate component. It's already night, and I need to be fast.

## Wait, my game is not playing!!

I started to deploy to my site (using GitHub pages) and the game didn't load!! It was a quick fix, I had typed `POST` instead of `GET` and the server is reporting with error 405. To my surprise this didn't happen in the development server.

I also noticed another bug in the desktop build, that the wav file loader is skipping some frames from loading, so I chose to deploy OGG format this time. I also fixed a crash in HTML5 build that forgot to create an OpenAL context.

## Submitting the game

It's finally 1:00 in the night and I finally submitted my entry. I immediately fell asleep after becoming too tired. The next morning I took the screenshots of the development and made a short time lapse. Here you can watch it:

{% include components/widgets/youtube.html id="iYfg83YExtQ" %}

So I was able to make a game in 48 hours, and with a theme that I never understood clearly. We learn something every time we take up challenges like this, and I did learn a lot, [Entity Component Systems (ECS) architecture](http://gameprogrammingpatterns.com/component.html), [JavaFX GUIs](http://zetcode.com/gui/javafx/), WebGL, Web Audio API, JS Fullscreen API, and also a bit on optimizations. This also taught me Ajax (for loading assets in HTML5 build), and a lot of other stuff.

You can play the game online [here](http://goharsha.com/Amoebam/) and please give a rating on the Ludum Dare entry page [here](http://ludumdare.com/compo/ludum-dare-35/?action=preview&uid=22490).

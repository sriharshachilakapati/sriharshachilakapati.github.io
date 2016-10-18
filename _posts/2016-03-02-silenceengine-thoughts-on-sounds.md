---
title: SilenceEngine - Thoughts on Sounds
layout: post
keywords: ["SilenceEngine", "Improvements", "Audio", "SoundEngine"]
tags: ["SilenceEngine", "Audio"]
---

Previously I have written my thoughts on the core and the graphics API of the upcoming rewrite of SilenceEngine, and now in this post, I'll talk about my thoughts on the audio API. As an OpenAL implementer (I'm implementing OpenAL for the GWT, which SilenceEngine uses in it's HTML5 build) I can say that OpenAL by itself is pretty simple and clear enough from the specification, and has a lot of features that are more than enough for 99% of the games. But still, it's static API might be confusing to newbies, so we provide an object oriented wrapper for the API.

Another reason is that loading the sounds is not the same across platforms, so having a custom wrapping API on top of it is nice. Here we will use the same terminology in our API too. So instead of talking other things, I'll dive right into the topic for this post.

## The Sounds

Due to limitations on GWT-AL (the OpenAL implementation that I use in GWT backend), we won't be supporting streaming audio. The sounds must be loaded into the memory before they can be played. In order to load the sound, queue it up in the resource loader with a `FilePath` instance.

~~~java
// Create a resource loader, and set an on load complete handler.
ResourceLoader loader = new ResourceLoader();
loader.onLoadComplete(this::doneLoading);

// Define a sound resource to load from .WAV file.
ResourceID.ID_MYSOUND = loader.addSound(FilePath.forResource("mysound.wav"));

// Start loading the resources. On completion, the doneLoading
// method is invoked automatically.
loader.startLoading();
~~~

Now once the loading is done, you can fetch the loaded sounds from the resource loader, and be ready to feed it to the sources. The system will play WAV, and OGG, but try to use MP3 in case for the GWT platform when running on the new Edge browser. You can test if your format is being supported by using the following code.

~~~java
if (SilenceEngine.audio.isFormatSupported(AudioFormat.OGG))
    // Platform supports OGG format!
~~~

This is added because the loader is dependent on the browser in the case of HTML5 build, and we need to be sure whether it works or not to prevent the underlying system from throwing JavaScript errors and crashing our game. Once you got them loaded, you can either play it directly, or use the AudioScene to play it in a 3D environment.

## Playing the Sounds

When it comes to playing the loaded sounds, you can choose between two ways, whether you want to play it statically, or whether you want to give it a position in the scene. In case you need to play it statically, you have to use the play method on the sound and ignore the scene.

~~~java
Sound mySound = loader.getResource(ResourceID.ID_MYSOUND);
mySound.play();
~~~

And then it simply starts playing in the game. Do note that playing this way will not take the properties like spatialization, or properties like pitch or gain into consideration. If you want to set them, you are encouraged to make use of the AudioScene.

## The Audio Scene

Just like the rendering part, we will have a Scene for audio which consists of the player in the center of the world (configurable through the use of listener and camera data) and sources representing the entities, which contain the spatial data. Also note that there will only be one single scene, because of the existence of a single context.

~~~java
AudioScene scene = SilenceEngine.audio.scene;

// You can use the same camera that you use for rendering graphics
// to also render the audio and spatial data.
scene.camera = gameCamera;

// Finally call the update method to let the scene save the changes
// to the active device, and the changes to become effective.
scene.update();
~~~

If you don't want spatialization support, that is rendering 3D audio and just want to play some sounds no matter where there are from, just call the play method on a sound directly. These changes does apply to actively playing sounds as well.

## The Audio Sources

In order to play a sound, we actually need a source, think of it like the speaker which is playing that sound. In SilenceEngine, there is a difference, the source here is just a data object containing the position, direction, and velocity in the scene. This allows for a source to play multiple simultaneous sounds at once.

~~~java
AudioSource source = SilenceEngine.audio.createSource();

source.position.set(entity.position);
source.velocity.set(entity.velocity);
source.direction.set(entity.direction);

source.update();

scene.play(sound1, source);
scene.play(sound2, source);
~~~

This will play the sounds *sound1* and *sound2* using the source, that it is played at the specified position in the source object, with the specified velocity applied that generates a doppler effect. The source will also contain the properties like volume, and pitch, so that real time adjustments can be made.

## Static sources with volume / pitch

There might be situations that you may want to create a source that is always near the listener, that is without spatialization features, and at the same time you want to control the pitch and volume of the source. In that case, you can use the `createStaticSource()` method of `AudioEngine` class.

~~~java
StaticAudioSource staticSource = SilenceEngine.audio.createStaticSource();

staticSource.volume = 0.8f; // Will be clamped between 0 and 1
staticSource.pitch = 0.9f;  // Range is 0 to Infinity

staticSource.update();

scene.play(sound, staticSource);
~~~

This will play the sound using the static source, which doesn't move anywhere. There are other things that I have not explained in this post as this post is about the outline of how things are going to be in the engine. I still have to think about the new APIs of collision detection, and the math modules, and still some part of the graphics is left (3D animation). Will continue this in the next post.

If you have any thoughts or suggestions, feel free to comment below. Please let me know if there can be any improvements to this API.

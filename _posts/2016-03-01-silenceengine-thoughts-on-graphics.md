---
title: SilenceEngine - Thoughts on Graphics
layout: post
tags: SilenceEngine Graphics Improvements
---

A few days before, I have written a post titled [New thoughts on SilenceEngine]({{ site.url }}/blog/new-thoughts-on-silenceengine/) explaining how I'm going to re-implement SilenceEngine as a multi backend cross platform engine, and shared my thoughts on the new up coming core architecture of the engine. In this post, I will be sharing about how the new graphics are being handled.

Currently in the engine, everything is very high level, and I thought that we need a bit more control on how it is rendering the graphics, since most performance will be gained from the optimisation of graphics. Doing things like batching will work on the GPU but all it does is it shifts the vertex processing load to CPU, and thus will often only gain a very few amounts of performance. So in the new engine, I'd like to give a bit more low level rendering exposed through an API to allow the users to gain more FPS, but also continue to provide the wrappers like the batcher so the newbies can easily make the games too.

## The geometry definitions

The geometry will be held in the `Mesh` class, which contains vertex positions, normals, tangents and bi-tangents. The mesh also contains methods that allows you to calculate normals, tangents and bi-tangents from the vertex position data, but also allow you to set the data by yourself. It also contains a utility method to calculate bounding boxes, spheres or a tightly packed polyhedron that can be used for collision detection. Let's take a look at the Mesh class details.

~~~java
public class Mesh
{
    public final List<Vector3> positions;
    public final List<Vector3> normals;
    public final List<Vector3> tangents;
    public final List<Vector3> bitangents;
    public final List<Vector2> uvs;

    public void computeNormals();
    public void computeTangentBasis();

    public void computeBoundingBox(Polyhedron bBox);
    public void computeBoundingSphere(Polyhedron bSphere);
    public void computeBoundingPolyhedron(Polyhedron bPoly);
}
~~~

As you can see, there are three new changes from the current implementation, with the first being there are no tangents and bi-tangents before. These are required when applying some effects like normal mapping etc. The UVs can either be empty if there are no textures, or can be set to `Vector2.ZERO` to have no effect in rendering. The next change is, the fields are `public` and `final` by default, where the current implementation uses getters and setters. In my opinion, this is more better in two ways, easy remembering of the code, and also that it saves a method invocation.

And the final change, is the compute methods for bounding volumes, they take in a `Polyhedron` and modify it. However they generate new `Vector3` instances for the positions (although the internal implementation of Polyhedron will use the `REUSABLE_STACK` to allocate vectors, it is not guaranteed that there will be exactly the same number of vertices), so it is recommended that you do not create them every frame. The best way is to create the bounding volume once in the start and store them somewhere.

## Models and custom formats

Due to the restrictions posed by GWT (and web in general) on the binary data, I cannot write the implementations to use binary formats like MD2 etc., and even then, it is tough for me to add in support for each and every model format, so the idea is to use the [glTF format](https://github.com/KhronosGroup/glTF/), a content specification format from KhronosGroup that works well in OpenGL and also in WebGL environment. I still had to take a deep into it, but from the skim, it seems really cool. This will be explained in a future article. However I'm sure that the new implementation supports animations. I'm also trying to keep everything related to modeling in an editor like Blender or Maya or an editor of your choice that allows exporting to the glTF format which will be the only one supported.

## Materials and Rendering

The Materials in the current implementation are confusing, and although the `Material` class do offer all the fields, the implementation never supported all the properties defined there. This time, I'm going to simplify the material, which only contain high level things like the opacity, tint color, and common light properties like ambient coefficient and light intensity. All others will be contained in a class called as `Effect` which contains a program that does the rendering, and other properties that are unique to the effect program. All effects do take in a mesh and renders it.

~~~java
Effect effect = SilenceEngine.graphics.createPointLightEffect();

effect.position.set(entity.position);
effect.color.set(Color.GOLDEN_ROD);

effect.render(entityMesh, transform, material);

effect.dispose();
~~~

This is how a mesh is rendered, we create an effect, set it's properties and do a render with a mesh. We can do this with a system, so we can implement other rendering systems later on. One system that will be implemented in the first is a forward rendering system, in a class called as `ForwardRenderer` which takes in a list of effects, and renders an entity using all those effects in a forward rendering system. This way, we can add a `DeferredRenderer` if we required it in the future.

## Batching static Entities

Though it is cool to have good performance when dynamically rendering these entities with effects, you sometimes want to batch render many static entities to have good performance and render them in a single go. That will be possible with a `Batch` which is a collection of data stored in a `Mesh` by combining different meshes with different transforms once at the time of creation by using a `Batcher` and then it is a single mesh and can be rendered in a single go with any effects and a system, and all the entities in the batch will render in one go.

~~~java
Batcher batcher = new Batcher();

Batch batch = new Batch(material);

batcher.begin(batch);
{
    batcher.add(mesh1, transform1);
    batcher.add(mesh2, transform2);
    batcher.add(mesh3, transform3);
}
batcher.end();

ForwardRenderer renderer = SilenceEngine.graphics.createForwardRenderer();

renderer.addEffect(effect1);
renderer.addEffect(effect2);
renderer.addEffect(effect3);

renderer.render(batch, commonBatchTransform);

renderer.dispose();
batch.dispose();
~~~

There are disadvantages to this approach though, as this can be done only for static entities, computing batches at runtime for large number of entities is not an option, as it increases work on the CPU. The next disadvantage is the entities should be of the same material, which can be solved by generating a `BatchGroup`, a group of batches per material. Note that there will be no class named `BatchGroup`, this will be simply a list of batch instances. This is left out to the developer.

## Instanced Rendering

When there are a lot of entities in the scene, one might want to do instanced rendering, which is submitting the entities and the transforms in a list to the `InstancedRenderer` which instances them in the GPU. This gives far greater amounts of performance. On platforms that doesn't support instancing (mobiles/web) this will be fallen back to a `ForwardRenderer` to do the rendering. Unlike in the case of forward rendering, we can only render one mesh for a multiple times in instanced rendering.

~~~java
InstancedRenderer blockRenderer = SilenceEngine.graphics.createInstancedRenderer();

blockRenderer.addEffect(effect1);
blockRenderer.addEffect(effect2);
blockRenderer.addEffect(effect3);

blockRenderer.initInstances(100); // Initialize for 100 instances

blockRenderer.mesh = blockMesh;
blockRenderer.material = blockMaterial;

blockRenderer.addInstance(blockInstanceTransform1);
blockRenderer.addInstance(blockInstanceTransform2);
blockRenderer.addInstance(blockInstanceTransform3);

blockRenderer.render();
~~~

However, since this takes a maximum number of instances to create instance attribute VBOs, you have to give it the maximum number of instances that you want to render in a batch. Generally, 100 instances per batch is a good number. This is even better than static batch rendering since here the data of the combined mesh doesn't reside in the memory, only the transformations are resided here. However, static batches can have multiple meshes that reuse the same material, where instances can have only one material and one mesh.

So this is all my thoughts for today, and I will write a new post on graphics detailing how the model system is going to be. If you have any thoughts and suggestions for me, please don't hesitate to share with me.

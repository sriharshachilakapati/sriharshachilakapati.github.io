---
title: SilenceEngine - Thoughts on Entities
layout: post
tags: SilenceEngine Thoughts Improvements Entities
---

Previously I have written about my thoughts on the SilenceEngine and how it can be improved, and covered the areas of graphics, audio and core. Now it's time to implement a new thing which is not yet implemented in the original implementation, the entities.

## Entities and Components

SilenceEngine will support entities and components, but not in the completely traditional way. An entity is the base class for all the objects in the game. It raises events as update events and render events, and the update and render methods will be final. Here is some code on the outline.

~~~java
public class Entity
{
    public List<LogicComponent> logicalComponents;
    public List<RenderComponent> renderComponents;

    // [... raises update event, on all the components ...]
    public final void update() {}

    // [... raises the render event, on all the components ...]
    public final void render() {}

    public void onUpdate() {}

    public void onRender() {}
}
~~~

The entities will also contain the overridable event methods, so you can use it in a traditional OOP way. The components will receive the entity property. The behaviors will be added by the components, and the advantage is we can add the same component to multiple entities.

## Built-in components

The entity system in SilenceEngine is **NOT** a **ECS** entirely, but an Entity-component model (it has no System). Here are some examples for components that are available built-in to the engine. Let's first take a look at the logic components.

~~~java
public class Transform2DComponent extends LogicComponent { ... }
public class Transform3DComponent extends LogicComponent { ... }
public class Collision2DComponent extends LogicComponent { ... }
public class Collision3DComponent extends LogicComponent { ... }
~~~

The built-in components are transform and collision components which are separate for 2D and 3D. Once the bindings for JBullet and JBox2D are done, physics components will also be available. Now coming for the render components, you will be provided with the following components in both 2D and 3D.

~~~java
public class SpriteRenderComponent extends RenderComponent { ... }
public class MeshRenderComponent extends RenderComponent { ... }
~~~

These components do not take care about animations yet, but once they are available, these components can be constructed with the animation controllers as arguments, and then they will handle the animations too. It is also possible to write custom components, and do your own work. The order in which these are called is the same order in which they are added.

## Grouping entities

Entities can now be grouped in a hierarchy model, paving way for the traditional scene graphs to be represented by the parent-child entity architecture. Each entity will contain a field for the parent object, and a list of entities which are children.

~~~java
Entity car = new Entity();
car.children.add(new CarBody());
car.children.add(new CarEngine());
car.children.add(new CarWheels());
~~~

This allows to let all the components rotate when the car is rotated. Of course, it is not recommended to do so in this case, as these can be components of a car, and then they can be used in enemy cars too, with the only difference will be in controller component.

## Checking for existence of components

A component can be queried for existence in an entity. SilenceEngine provides two methods for that purpose, which return `null` if that component does not exist.

~~~java
Transform3DComponent transform = entity.getComponent<Transform3DComponent>();
List<MyCustomComponent> components = entity.getComponents<MyCustomComponent>();
~~~

If there are multiple components of same type, the `getComponent()` returns the first entity in that list. Otherwise it returns `null` as the list.

## Conclusion

So this is how the entity system is going to be. For surprise, the Scene here will also be an entity, allowing you to transform whole scene in a single go. Your thoughts and suggestions are very appreciated. Thank you for reading.

---
title: ClassJS
layout: page
permalink: /classjs/
---

ClassJS is a library written to allow us to write class-based applications in JavaScript, which only supports prototype based object oriented code by default. A word of warning is that this project is only developed out of enthusiasm and doesn't include any support. Writing classes is fun and this library facilitates you to write that. I wrote this library to port some of my Java applications to JavaScript. Currently, ClassJS is in it's second beta version 0.0.2

<div class="text-center">
{% include download url='http://downloads.goharsha.com/ClassJS-Beta2.zip' text='Download ClassJS 0.0.2' %}
</div>

## Features

ClassJS supports almost all the necessary features that are required to program using classes including method overloading and extending of classes. Here are a list of the features that ClassJS supports at this stage.

  - Define classes. (Obviously, that's the point of this library)
  - Extend classes. (Only supports single inheritance)
  - Multiple constructors. (Constructors are treated as methods)
  - Method overloading. (You can define methods that accepts different arguments)
  - Basic type checking. (Only for overloading)

These are some of the features of this library at the moment. Future plans include allowing interfaces with default methods and namespaces. This page will guide you through the installation and usage of this library.

## Installation

You cannot use this library with server side technologies like nodejs or others. This is designed to be used on the client side. For the first part, you need the file `class.js` which contains the entire source code of ClassJS. Then just reference it in the `<head>` tag of your document like in this code snippet.

~~~html
<script src="class.js" type="text/javascript"></script>
~~~

You are now ready to use it in the scripts that are present in this html file. If you want to keep the sources in separate JS files like me, just reference ClassJS before others and it should work just fine. For more information, keep reading.

## Defining Classes

A class can be defined easily by using the `ClassJS.Define` function. This function takes the prototype i.e., the body of the class and returns an object which can then be instantiated by just using the new keyword. Lets see an example on defining a simple class using this function.

~~~js
var Apple = ClassJS.Define
({
    // Class body goes here.
});
~~~

The above example specifies how to define a class named `Apple`. Unfortunately there are no mention of word `class` because that is a reserved word in JavaScript but had no functionality.

## Constructors

For every class, a constructor is a must. In ClassJS, a constructor is nothing but a function named as `create`. This create function will be called automatically when you instantiate your object. For example, see this constructor of the above mentioned `Apple` class.

~~~js
var Apple = ClassJS.Define
({
    create: function()
    {
        // An apple is created!!!
    }
});
~~~

The above constructor is pretty useless actually, but it works as an example of this library. Since a class must have a constructor for it to instantiate, ClassJS will automatically define an empty constructor for you when it doesn't find one. It is also possible to overload constructor, and chaining them is possible too, continue reading.

## Methods

To say simply, a method is a member function of a class. For simple methods, that would not be required to overload, you can just directly use the javascript functions and ClassJS will take care of that. For an example, see the following function.

~~~js
var Apple = ClassJS.Define
({
    eat: function(name)
    {
        console.log("This Apple is eaten by " + name);
    }
});
~~~

That's a simple method that outputs a message in the console every time this method is called. These type of methods are simple, but they lack support for overloading and type information of arguments. For that purpose, ClassJS has the `ClassJS.Method` function. Here is a small example.

~~~js
var Area = ClassJS.Define
({
    calculate: ClassJS.Method
    (
        ['Number'],
        function (radius)
        {
            return Math.PI * radius * radius;
        },

        ['Number', 'Number'],
        function (length, breadth)
        {
            return length * breadth;
        }
    )
});
~~~

Notice the above piece of code carefully. We define a method called `calculate` in the `Area` class from two functions that return the area of a circle or a rectangle. Also notice how we specify the types of the arguments as arrays and don't forget the commas, because the `ClassJS.Method` is itself a function and the contents are the arguments. This function simply takes in the list consisting of type and function and type and function and so on.. and creates a new function which will be overloaded in it's logic and it is assigned to the body of the class with `calculate` as the name.

In the same way, you can overload your constructor. Just assign the created function to the name `create` to make it a constructor.

## Extending Classes

The point of this tutorial is not to explain what inheritance is, but its the point of this same tutorial to explain how to inherit from a super class. That is the whole point in having the `ClassJS.Extend` function. Here is a small example to get you going.

~~~js
// The Base Employee class
var Employee = ClassJS.Define
({
    create: ClassJS.Method
    (
        ['String', 'Number'],
        function (name, salary)
        {
            this.name   = name;
            this.salary = salary;
        }
    ),

    logDetails: function()
    {
        console.log("Hello! I'm " + this.name);
        console.log("My salary is " + this.salary);
    }
});
~~~

In the above post, we define a class called `Employee` which has the default functionality of an employee. Now we need a manager. Since a manager is also an employee, we will make the `Manager` a sub-class which inherits from `Employee`

~~~js
// The Manager Inherits from the Employee
var Manager = ClassJS.Extend (Employee,
{
    create: ClassJS.Method
    (
        ['String', 'Number', 'Number'],
        function (name, salary, bonus)
        {
            // Call the base constructor
            this.base.create(name, salary);

            this.bonus = bonus;
        }
    ),

    logDetails: function()
    {
        // Call the base logDetails function
        this.base.logDetails();

        console.log("And I earn " + this.bonus + " as bonus because I'm the manager");
    }
});
~~~

See, it's pretty simple actually. In this example, you also see how to call the methods of the base class. Now let's step ahead and learn how to override these methods.

## Overriding Methods

The first thing here, is that you should keep in mind that all the methods are virtual, just like in the case of Java. Now, if you carefully observe the previous example, the `logDetails` method of the `Manager` overrides the `logDetails` method of the `Employee` class. In ClassJS, you won't specify that you override a method like you do in C# or C++.

ClassJS automatically takes care of that for you. If there are methods in the sub-class which has the same name as of the base-class, those methods are overriden. You can call all other base-class methods in the same way as if they belongs to the sub-class.

## Conclusion

This is all that ClassJS offers you for now. In future versions, I plan for implementing more features like interfaces and namespaces. Be-aware that this is still in beta, so please don't use this library for production. Only for testing. Thank you for taking time to read this, and thanks for your interest.

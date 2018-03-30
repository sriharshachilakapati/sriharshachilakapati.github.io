---
title: PureScript for Beginners
tags: ['PureScript', 'Functional Programming']
layout: post
lang: en
ref: 'pfb-bp'
---

I recently got selected for internship in a company that uses Functional Programming a lot, and had to switch to it because that is the language the company was deep into. As a guy who is coming from an imperative background from languages like Java, C, C++, C#, JavaScript, etc., PureScript was completely new for me and I sort-of felt lost into a world of void. But soon, I realized, that I can easily understand the language if I started comparing it with the output it produces.

> The PureScript book is really the best thing you can find. I suggest reading it first unlike me. I jumped into the code directly before reading it.

This post is going to be a very basic introduction for someone who is completely new into it. I'm going to write this post exactly how I wanted someone to teach it to me. So enough chat for now and let's get started!

## Functional Programming, eh what??

For those of you who don't know what it is, I'll explain. For those of you who do, uhm.. I'm going to say it anyway, so read on. Functional Programming is nothing but a paradigm where each and everything is made up of functions, just like how you do it in mathematics. Did you remember how you wrote a function in your mathematics class?

$$ f(x) = x + 10 $$

So you remember it after all. When I say \\( f(2) \\), then you will immediately shout out \\(12\\). Great. This itself is functional programming. Everything here is functions.

## Functions in PureScript

Let us now see some functions in PureScript and see how they end up in JavaScript. Now fire-up [Try PureScript](http://try.purescript.org) and watch the JS output as you type. Let's start with simpler functions.

~~~haskell
add10 x = 10 + x
~~~

This produces a function like this in JavaScript.

~~~javascript
var add10 = function (x) {
    return x + 10 | 0;
};
~~~

Now let's try to type it. Yes, PureScript is a Typed language (although they were optional) and now let us explicitly say the type of the `add10` function that we just wrote.

~~~haskell
add10 :: Int -> Int
add10 x = 10 + x
~~~

When I first saw this piece of code, I was able to guess, add10 is a function that accepts an int and returns an int. But then I wrote this function and let the compiler infer the type for me. (Atom with ide-purescript plugin can automatically add missing types to your functions by the way).

## Multi-argument functions and currying

Now let us write a two argument function.

~~~haskell
add' :: Int -> Int -> Int
add' x y = x + y
~~~

Now we have got a function that adds two numbers. We can say from the type that both x and y are integers and hence the result is also an integer. By the way, did you get the same doubt that I got when I started learning it three months ago?

> At first looking at it, I wondered which ever is the return type. Is the return type written at the left most end or at the right most end?

Sorry for making you wonder now. The answer is at the right end. Let's look at the output now.

~~~javascript
var add$prime = function (x) {
    return function (y) {
        return x + y | 0;
    };
};
~~~

And let's see the type again.

~~~haskell
add' :: Int -> (Int -> Int)
~~~

The only difference this time is that I included a pair of parentheses to make it clear. As you can see, the function takes an integer, `x` and returns a function of type `Int -> Int`. This second function takes another integer `y` and returns an integer as the result, which is their sum.

This technique is called as _currying_ in the functional world. By using this, we can create new functions from one base function. We are going to do it now, let's see how we can create the `add10` function that we were seeing previously.

~~~haskell
add10 :: Int -> Int
add10 = add' 10
~~~

Wondering how it worked? If we see the type of the `add'` function again, it is `Int -> (Int -> Int)` meaning that it takes an integer and returns another function of type `Int -> Int`. When we are passing `add' 10`, due to it being curried function, we are getting a new function which adds some `y` to the value `x`, which is substituted with 10. Since the type of `add10` matches with it, we can simply assign it.

## Difference between currying and Regular calling

If you haven't known that currying exists, and you were told to write a function `add10'` using the `add'` function, then you would have written it like this:

~~~haskell
add10' :: Int -> Int
add10' x = add' 10 x
~~~

Both of them work the same, so what is the difference? The difference is surely there, even when you don't recognize it. To understand the difference better, let us look at the compiled code for both of these functions.

~~~javascript
var add10$prime = function (x) {
    return add$prime(10)(x);
};

var add10 = add$prime(10);
~~~

You see the difference? I'd bet you saw it. When you are using `add10`, i.e., the curried version, you are calling only a single function. But when you use the `add10'` function, you are invoking three functions to get the same result. So now you can see why to prefer currying whereever you can.

## Function composition

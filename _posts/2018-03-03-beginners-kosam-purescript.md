---
title: బిగినర్స్ కోసం ప్యూర్‌స్క్రిప్ట్
tags: ['PureScript', 'Functional Programming']
layout: post
lang: te
ref: 'pfb-bp'
hidden: true
---

ఈ మధ్యనే నేను ఫంక్షనల్ ప్రోగ్రామింగును విపరీతంగా ఉపయోగించే ఒక సంస్థలో ఇంటర్న్‌షిప్పులో జాయిన్ అయ్యాను. వాళ్ళు అందరూ అక్కడ ప్యూర్‌స్క్రిప్ట్ అనే లాంగ్వేజీని వాడుతున్నందున నేను కూడా అదే ఉపయోగించవలసి వచ్చింది. Java, C, C++, C#, మొదలగు ఇంపరేటివ్ లాంగ్వేజీలను ఇప్పటిదాకా ఉపయోగించిన నాకు అది చాలా కొత్తగా అనిపించింది. నేనేమన్నా తప్పిపోయానా అని కూడా అనుకున్నాను. దాన్ని బాగా అర్థం చేసుకోవడానికి నేను దాన్ని కంపైల్ చేసి, ఆ వచ్చిన జావాస్క్రిప్ట్ ని చదవి రెండింటినీ కంపేర్ చేయటం మొదలుపెట్టాను.

> ప్యూర్‌స్క్రిప్టుపై మనకు దొరికే అతి తక్కువ రిసోర్సెస్‌లో ముఖ్యంగా చెప్పుకోవాల్సింది 'The PureScript book'. నాలాగా తొందరపడి కోడింగులోకి దిగకుండా ముందు ఆ పుస్తకాన్ని చదవండి.

ఈ పోస్టులో నేను కేవలం దీన్ని అర్థం చేసుకోవడానికి కావలసిన బేసిక్స్‌ను మాత్రమే వివరిస్తాను. నేను దీన్ని నేర్చుకునేటప్పుడు ఎలాంటి ట్యుటోరియల్ ఉంటే బాగుంటుందనుకున్నానో దీన్ని అలాగే వ్రాస్తున్నాను. ఇంక మనం ఉపోద్ఘాతాన్ని ముగించి నేర్చుకోవడం మొదలుపెడదాం.

## ఫంక్షనల్ ప్రోగ్రామింగా, అంటే ఏంటి??

అసలు ఫంక్షనల్ ప్రోగ్రామింగు అంటే ఏమిటో తెలియకపోతే నేను చెప్తాను. ఒకవేళ మీకు తెలిసినా కూడా తెలియనివారికోసం నేను ఎటూ చెప్పాలి కనుక చెప్పేస్తాను చదవండి. ఫంక్షనల్ ప్రోగ్రామింగ్ అనేది ఒక పారడిగమ్, ఇందులో ప్రతిదీ అచ్చం మనం మ్యాథ్స్‌లో చేసినట్లుగా ఫంక్షన్లతోనే చేస్తాం. చిన్నప్పుడు మనం స్కూలులో విన్న మ్యాథ్స్ క్లాసు గుర్తుందా?

$$ f(x) = x + 10 $$

ఇప్పుడు గుర్తొచ్చిందా? నేను \\( f(2) \\) అనగానే మీరు వెంటనే \\( 12 \\) అన్నారుగా, గుర్తొచ్చేసిందన్నమాట. ఇదే ఫంక్షనల్ ప్రోగ్రామింగ్ అంటే. పైన చెప్పినట్లుగానే ఇక్కడ ఉండేవన్నీ ఫంక్షన్లే.

## ప్యూర్‌స్క్రిప్ట్‌లో ఫంక్షన్లు

ఇప్పుడు మనం ప్యూర్‌స్క్రిప్ట్‌లో కొన్ని ఫంక్షన్లను వ్రాసి అవి జావాస్క్రిప్టులోకి మారిన తరువాత ఎలా ఉంటాయో చూద్దాం. ఇప్పుడు [ట్రై ప్యూర్‌స్క్రిప్ట్](http://try.purescript.org) వెబ్‌సైటుని ఓపెన్ చేసి మన ఫంక్షన్లు ఎలా మారతాయో చూద్దాం. ముందుగా చిన్న చిన్న ఫంక్షన్లని చూద్దాం.

~~~haskell
add10 x = 10 + x
~~~

ఈ చిన్న ఫంక్షన్ జావాస్క్రిప్ట్‌లోకి మారితే ఇలా ఉంటుంది.

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

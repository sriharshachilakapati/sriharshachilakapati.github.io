---
layout: post
title: Simple way to define ViewModel Factories
tags: ['Android', 'Jetpack', 'Kotlin', 'Abstractions', 'ViewModel', 'ViewModel Factory']
lang: en
ref: 'and-vmf-abst'
---

I started working on my final project for Udacity's Kotlin Android Developer Nanodegree, where I started noticing that my `ViewModel` factories are becoming large and complex. So I wanted to keep them simple.

## What did I already have?

To have an idea of how complex they have become, see the following `ViewModelProvider.Factory` that I have created for `VoterInfoViewModel` that I have in my project.

~~~kotlin
class VoterInfoViewModelFactory(
        private val context: Context,
        private val election: Election
) : ViewModelProvider.Factory {
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        val database = ElectionDatabase.getInstance(context)
        val repository = ElectionRepository(database.electionDao)

        val followString = context.getString(R.string.follow_election)
        val unFollowString = context.getString(R.string.unfollow_election)

        return modelClass.getConstructor(
                ElectionRepository::class.java,
                Election::class.java,
                String::class.java,
                String::class.java
        ).newInstance(repository, election, followString, unFollowString)
    }
}
~~~

The problems I have with it are the following:

  * It is too long for a simple `ViewModel` creation.
  * Getting the constructor and creating a new instance isn't intuitive.
  * I don't want to write a class every time I make such simple factories in the project.

## How did I abstract it out?

The first thing I noticed is that the structure is almost the same for all the factories I currently have in the project, and am sure that only part that changes is the body of the factory. So I created a class which delegates the body to a provider.

```kotlin
class SimpleViewModelFactory(
        private val `class`: Class<*>,
        private val provider: () -> ViewModel
) : ViewModelProvider.Factory {

    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
        if (!modelClass.isAssignableFrom(`class`)) {
            throw IllegalArgumentException("ViewModel type is non assignable")
        }

        @Suppress("UNCHECKED_CAST")
        return provider() as T
    }
}
```

So what is changed here? I delegated the body of the function to a `provider` which is a lambda. Also, the check is now done before hand, and now a proper exception is thrown in case of a misfire, which is pretty nice.

Also, I didn't want to provide the class to the constructor always, so I made one inline function using reified generics to help me out.

```kotlin
inline fun <reified T : ViewModel> viewModelFactory(noinline provider: () -> T) =
        SimpleViewModelFactory(T::class.java, provider)
```

The use of reified generics is only allowed for inline functions, but care has to be taken so that provider doesn't get inlined.

## What is the end result?

So after adding this utility, I was able to refactor the factory to an even simpler and nice blob of code. See it for yourself.

```kotlin
fun voterInfoViewModelFactory(context: Context, election: Election) = viewModelFactory {
    val database = ElectionDatabase.getInstance(context)
    val repository = ElectionRepository(database.electionDao)

    val followString = context.getString(R.string.follow_election)
    val unFollowString = context.getString(R.string.unfollow_election)

    VoterInfoViewModel(repository, election, followString, unFollowString)
}
```

Now it is a lot more cleaner and easy enough to follow! Do let me know what you think about this in the comments. Happy hacking!
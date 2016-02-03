---
title: Compiling wxWidgets-3.0.2 on Mac OS X Yosemite
layout: post
tags: wxWidgets MacOS build error quick-fix webkit apple Yosemite
---

Recently wxWidgets 3.0.2 has been released, and it also introduced some problems with building them on Yosemite, the latest iteration of Apple's new Operating System. If you tried to build it on Yosemite, you are supposed to get some of the errors like the following. Fortunately, I've been able to build it, so here are the steps I've took to get it working.

~~~objc
../src/osx/webview_webkit.mm:392:30: warning: incompatible pointer types sending
      'WebViewUIDelegate *' to parameter of type 'id'
      [-Wincompatible-pointer-types]
    [m_webView setUIDelegate:uiDelegate];
                             ^~~~~~~~~~
../src/osx/webview_webkit.mm:464:34: warning: 'WKPreferences' may not respond to
      'setUsesPageCache:'
        [[m_webView preferences] setUsesPageCache:NO];
         ~~~~~~~~~~~~~~~~~~~~~~~ ^
../src/osx/webview_webkit.mm:466:34: warning: 'WKPreferences' may not respond to
      'setUsesPageCache:'
        [[m_webView preferences] setUsesPageCache:YES];
         ~~~~~~~~~~~~~~~~~~~~~~~ ^
../src/osx/webview_webkit.mm:936:25: error: cannot initialize a variable of type
      'WebBackForwardList *' with an rvalue of type 'WKBackForwardList *'
    WebBackForwardList* history = [m_webView backForwardList];
                        ^         ~~~~~~~~~~~~~~~~~~~~~~~~~~~
../src/osx/webview_webkit.mm:954:25: error: cannot initialize a variable of type
      'WebBackForwardList *' with an rvalue of type 'WKBackForwardList *'
    WebBackForwardList* history = [m_webView backForwardList];
                        ^         ~~~~~~~~~~~~~~~~~~~~~~~~~~~
3 warnings and 2 errors generated.
make: *** [webviewlib_osx_webview_webkit.o] Error 1
~~~

This is a [reported bug](http://trac.wxwidgets.org/ticket/16329) with wxWidgets-3.0.2 that only occurs on Yosemite. The reason for this bug is that Apple updated it's Headers for Webkit. Fortunately, the old headers still exist in a header file called `WebkitLegacy.h`. This bug, however is fixed in the 3.0.3 version of the library, but isn't still available for download (you can still get that by cloning the wxwidgets repo). Currently to fix this, all you need to edit a file `src/osx/webview_webkit.mm` and look for line 31.

~~~objc
#include <WebKit/WebKit.h>
~~~

The above is the line 31 of the source file `wxWidgets-3.0.2/src/osx/webview_webkit.mm`. All you need to do is to replace that line with the following alternative.

~~~objc
#include <WebKit/WebKitLegacy.h>
~~~

And now, you can build wxWidgets successfully. Here are the commands that I've used to build a debug build of wxWidgets in order.

~~~sh
$ cd /Volumes/Data/wxWidgets-3.0.2/
$ mkdir build-release
$ cd build-release
$ export PATH=$(pwd):$PATH
$ ../configure --enable-debug --enable-unicode --prefix="$(pwd)"
~~~

If all went clear (hopefully that will be the case), you can see that configure finally completes and the following input is seen on your terminal screen.

~~~
Configured wxWidgets 3.0.2 for `x86_64-apple-darwin14.0.0'

  Which GUI toolkit should wxWidgets use?                 osx_cocoa
  Should wxWidgets be compiled into single library?       no
  Should wxWidgets be linked as a shared library?         no
  Should wxWidgets support Unicode?                       yes (using wchar_t)
  What level of wxWidgets compatibility should be enabled?
                                       wxWidgets 2.6      no
                                       wxWidgets 2.8      yes
  Which libraries should wxWidgets use?
                                       STL                no
                                       jpeg               builtin
                                       png                builtin
                                       regex              builtin
                                       tiff               builtin
                                       zlib               sys
                                       expat              sys
                                       libmspack          no
                                       sdl                no
~~~

Then finally, enter `make` command into the terminal to start the build process. Get a good coffee in the meanwhile, because this will take 10-15 minutes depending on the speed of your computer. To check if this was working, I compiled the wxAUI demo and it ran awesome as you can see in the following screenshot.

<div class="text-center" markdown='1'>
![wxAUI Demo]({{ site.url }}/assets/images/wxwidgets/wxAUI-example.png)
</div>

This is how I got wxWidgets-3.0.2 to compile on my mac. If this guide had helped you, please consider sharing it. If you got any other doubts, please comment below and I'd be glad to help.

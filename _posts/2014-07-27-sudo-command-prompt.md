---
title: Sudo for Command Prompt
layout: post
tags: sudo command prompt linux mac unix administrator
excerpt: The command `sudo` is most common among linux and mac users. It allows people to launch any application with administrator privileges. This command will come handy for power users who wants to launch applications with those privileges. I find myself using that command atleast ten times a day on linux and I miss it on windows. So I created this small utility application using C# that allows for that sort of behavior in windows.
---

The command `sudo` is most common among linux and mac users. It allows people to launch any application with administrator privileges. This command will come handy for power users who wants to launch applications with those privileges. I find myself using that command atleast ten times a day on linux and I miss it on windows. So I created this small utility application using C# that allows for that sort of behavior in windows. Here is a screenshot for you.

<div class="text-center" markdown='1'>
![SUDO For Command Prompt]({{ site.url }}/assets/images/sudo/sudo.png)
</div>

With the help of this small utility, you can launch any program using administer privileges. The only thing this utility differs from the original sudo command is that instead of asking you for the administer password, it presents you with UAC dialog box, just as in the case that you right-click on the executable and select to run as administrator. Another limitation is that this currently only supports basic execution, no `-i` or other options provided by the original `sudo` command. You can download it here.

<div class="text-center">
{% include download url='/downloads/sudo.exe' text='Download SUDO.exe' %}
</div>

To install it, you will need a system with Windows Vista or above because it relies on UAC (Sorry XP users). Just place the file in a location like _**(C:\batch-utils)**_ for example, that is included in the `PATH` environment variable. An example is to run `sudo notepad` to open notepad as administrator (required to edit files over ftp locations). Hoping this little tool aids you when on Command Prompt.

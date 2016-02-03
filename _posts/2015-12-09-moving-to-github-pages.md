---
layout: post
title: Moving to GitHub Pages, while maintaining other features
tags: [github, pages, jekyll, hosting, email, cpanel]
---

This post is a guide that explains how I recently switched to GitHub pages for hosting my website, and how I did that while still keeping access to my e-mails, my cPanel and webmail services that I have purchased at [GoDaddy.com](https://godaddy.com/). Before explaining the procedure of how I did it, I have to explain the page layout that I had been using previously. I have been hosting an SMF forum, and two websites directly from my shared hosting since the last three years, and that structure is a complete mess, as I have been a newbie in the web and server stuff.

## #0. The original setup

Initially when I was new to websites and stuff, I thought that I have to try, and I purchased it for only 6 months as a start. Then since it was working okay, I have excited a bit, and renewed my hosting and domain services to a 5 years, out of which 3 years are already completed. Eventually I added myself e-mail service. I found Jekyll an year ago, and started using it, for this exact same site and it was awesome, with the only downside of manually uploading the compiled sources to the server via FTP and backing up my sources in Dropbox and a private repo in Bitbucket. This is the main structure I was having initially.

~~~nsis
; A records, for the root domain and the subdomain
@	600	IN	A	160.153.72.39
silenceengine	600	IN	A	160.153.72.39

; CNAME records, for cpanel, ftp, mail and webmail
cpanel	3600	IN	CNAME	@
ftp	3600	IN	CNAME	@
mail	3600	IN	CNAME	@
webmail	3600	IN	CNAME	@

; MX records, for mail exchange
@	3600	IN	MX	0	@
~~~

That is I have two A records, one `@` which refers to this top-level domain which just contained my website (a bunch of static html pages with the power of Jekyll, really), and `silenceengine` subdomain, which hosts my project website (Also Jekyll) and an SMF forum. Since I started getting more page views in the forum, GoDaddy started complaining about high resource usage.

<div class="text-center" markdown='1'>
![GoDaddy alert]({{ site.url }}/assets/images/moving-to-github-pages/godaddy-alerts.png)
</div>

So I had to act fast, and decided to move my main website (the one which you are reading right now) to GitHub pages, and reduce the stress on my server a bit. Of course I had been suffering from manually uploading all the files through FTP everytime I made a change in my website or made a new post, which has been another reason. Now I have a challenge, I have to keep the working access to my cPanel and webmail links, while moving the main website to another hosting. So I first did a backup of the whole server contents and also the database of my forum, just in case. I have also put my forum in maintenance mode for the time being.

## #1. Creating a GitHub pages repository

The first step I took was to create a GitHub pages repository and commit my Jekyll sources. Since I am making a single user website and not an organization or project website, I have to create a repository with name **username.github.io** where I have to replace the username with mine. So I created a repository named as [sriharshachilakapati.github.io](https://github.com/sriharshachilakapati/sriharshachilakapati.github.io) and pushed my jekyll sources into it. I could now see the same website I was having at my old website at [sriharshachilakapati.github.io](http://sriharshachilakapati.github.io/) online. The next step is to link it with my domain.

## #2. Linking with my domain

Now I had to link up my website at **sriharshachilakapati.github.io** to my domain, so the first step I did was to push a file called as **CNAME** to the root of my repository which contained this only line of text.

    goharsha.com

Now, just as expected, GitHub pages started redirecting the url **http://sriharshachilakapati.github.io** to my own domain, but the contents of the old website are appearing. I then quickly removed all the website files (still keeping the subdomain files) and it started responding with an error saying cannot connect to the website. Now I had to change the A records of the DNS zone file to point to the IP addresses **192.30.252.153** and **192.30.252.154** respectively. Here is my new DNS zone file.

~~~nsis
; A records, for the root domain and the subdomain
@	600	IN	A	192.30.252.153
@	600	IN	A	192.30.252.154
silenceengine	600	IN	A	160.153.72.39
~~~

This took them approximately 45 minutes to change the DNS records and make them active, and I can now see my website again. However, I have found that I'm not recieving the e-mails on my server, they are not just sent.

## #3. Fixing the e-mails

I found it when someone pinged me on the IRC saying that they have sent me an e-mail, but I have never received one. Looking at the DNS zone file again, I was able to find out the issue. It is with the following lines.

~~~nsis
; CNAME record for mail
mail	3600	IN	CNAME	@

; MX records, for mail exchange
@	3600	IN	MX	0	@
~~~

Obviously, they are now referring to `@` which means they are referring to GitHub pages server, and not my server, and the mail is never reached in my server. So removed the CNAME record for mail, and made it an A record, with the IP of my GoDaddy server. And then I have changed the MX record to match this change.

~~~nsis
; A record for mail
mail	600	IN	A	160.153.72.39

; MX records, for mail exchange
@	3600	IN	MX	0	@
@	3600	IN	MX	0	mail.goharsha.com
~~~

And great, I now have my e-mails back in my Outlook. Fortunately, I don't know how that happened, but I had got the mails that I had missed while the records are pointed towards the GitHub servers automatically, even with the same time as they were sent originally. That was awesome.

## #4. The FTP access

Suspecting from the same issue of e-mails, I tried to do FTP and it also failed, for the same reason that spoiled my e-mails. Yeah, it was the CNAME records again, they were pointing the FTP to GitHub servers, and GitHub is rejecting all client connections to it's FTP. So I quickly made a new subdomain called as **ftp.goharsha.com** by changing that CNAME record to an A record like this.

~~~nsis
; A record for ftp, allows ftp access on ftp.goharsha.com now
ftp	600	IN	A	160.153.72.39
~~~

And now everything is fine, I have got FTP access for my web server, got my e-mails working, and also hosted my main website at GitHub pages. You might ask me, isn't the name **ftp.goharsha.com** misleading when **goharsha.com** is itself on a different host? Well, I don't think it is, because I run two other websites on the same server, a project site and a forum. I also store the JGO backups and my backups as cron jobs into that server which I can access with this URL now.

## #5. The cPanel and the webmail

The final things that were missing were the cPanel and webmail shortcuts. Previously I used to go to the cPanel and webmail with the URLs **http://goharsha.com/cpanel** and **http://goharsha.com/webmail** which used to redirect me to the secure GoDaddy server pages. So I logged into the cPanel by clicking on the _Manage Hosting_ link in my account, and searched for **Shortcuts** to find these links.

<div class="text-center" markdown='1'>
![cPanel Shortcuts]({{ site.url }}/assets/images/moving-to-github-pages/cPanel-shortcuts.png)
</div>

Now I'm simply using these shortcuts and placed them onto my bookmarks bar. That's it, this is how I had performed this move two days ago, and also solved all the issues I had in the beginning. I'm now more happy, since I can now just commit and push my website, instead of copying all the compiled HTML files and uploading them through FTP.

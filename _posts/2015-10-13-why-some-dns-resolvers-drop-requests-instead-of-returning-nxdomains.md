---
layout: post
title: "Why some DNS Resolvers drop requests instead of returning NXDomains."
description: "Non-professional analogies"
category: "Funny"
tags: ['ShowerThoughts']
---
{% include JB/setup %}

Whilst working on resolving DNS related bugs at my job at CloudFront, we had a discussion as to why certain resolvers 
choose not to send NXDomains for certain responses when it processes and knows that I can't answer them.

I've had a random ShowerThought during work where I explained DNS Resolver behaviour as the 'High School Prom Date'.

Say for example that you (a strapping young lad/gal) are looking for a prom date (the DNS request). 
You are trying to find the Domain (because domains are gender neutral ... at least I hope) 
of your dreams which begins with "a-date" and ends in ".marriage". 

<pre>
dig a-date.marriage @resolver
</pre>

You might start your search through a list of known resolvers in your local friend group, or you want to ask a explicit
person out to the prom. This is the '@resolver' notation that fires a request off at that person.

So now we look at what the resolver can choose to do. They can hand back a NXDomain, which is esentially a full on 
rejection; telling you that they are not interested in a-date.marriage. (or more precisely, they don't know how to 
locate you to your dream domain, or refer you to their friends.) The other thing they can do is choose to not give a 
response, even though they heard you request. 

The latter behaviour is akin to the High School Prom Date, because you don't know if they are just not able to answer 
right away or if they are just stringing you along. It might be  because this is a hot domain, and the resolver can't 
handle all the requests. 
Or they want you to retry later, and keep you guessing. If they reject you with NXDomains too many times, 
(depending on your personality ... implementation) you will slowly depreference them for any more requests to 
a-date.marriage. [citation needed] 

Some resolvers might want you to keep checking them later, so they choose not to answer, essentially making you check
back at them after a certain delay when other resovlers in your list can't help you. [citation needed]

In summary, this is meant as technical humour, and should not be used for any real descriptions of DNS services.
For that you should read the RFCs, of which I may look up later on to verify my showerthoughts.

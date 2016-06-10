---
layout: post
title: "Deduplicating Large Datasets"
description: ""
category: "infrastructure"
tags: []
---
{% include JB/setup %}

# Introduction

So recently I had to deduplicate a set of 1TB of data on redshift. 

The input of the task is as follows, we have a dataset of requests that is 6x duplicated.
The output of the task is to deduplicate the the data back to the original set.

The first attempt to deduplicate the table directly in Redshift, but the query just timed out after 9 hours. This was
the simplest approach of using the existing infrastructure.

After that failed, the next though was method was to directly try it on Hadoop. 
These days the since first getting out of school, any data equates to a Hadoop job. Though after working a while,
most of the time you don't need it. There is so much upfront configuration and tweaking to get the Hadoop job going 
that if you are not going to perform the same job continiously, the expected value is just negative.

I wasted a few days fighting with Hive SQL, AWS data pipeline, and EMR just to realize that without spending 3 weeks of 
work I won't get the Hadoop cluster fast enough to make it work.

In the end, I just sharded the Database into multiple small tables and just performed the same SQL query on a much
smaller dataset. This is less 'cool', but it should have been the first thing to try after the large dataset failed.
It would have saved quiet a few days.

# Lessons Learned

Lesson learned, you probably don't need hadoop, and even if you do think you need it, you probably shouldn't try to 
configure it all yourself for large jobs. 

If its not a regular job for some critical business operation, you might as well use regular databases to perform 
the operations on a smaller set.

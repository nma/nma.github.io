---
layout: post
title: "Learning More Mongo Admin Procedures"
description: "Managing Mongo DBs"
category: ""
tags: ["MongoDB", "DevOps"]
---

{% include JB/setup %}

# Intro

Recently I had to help out to deal with Mongo backups and provisioning on a live production environment.
Due to unforseen circumstances, a security audit forced us to rebuild the old stack which had replSets and clustered across multiple regions with MMS monitoring. It was old, but stable.
The audit forced us to rebuild it from the ground up, to lock down access points and to use VPCs with private subnets and various other fixes.

This broke all of the monitoring with mongo MMS and the multi-region clustering that it use to run with. With such a major change required in such a short duration, there were some risks that were taken.

# Situation Operating with a Single Mongo

One of the switch overs into a firewall deployment caused a mongo to be unresponsive.

The situation at hand is that we have a production stack running with one Mongo.
The goal of this is to hook up the Mongo with MMS automation agents, and get backups and monitoring working again.
Some of the issues encountered require some documenting on this post so that future Mongo workings can be fixed up.

As an oncall, the single `sudo service mongod start` process was the scariest. It was the only access point for a low write application at scale. Though for a single Mongo was able to handle the production traffic stood up to the traffic pretty well on an r3.2xlarge.
We used to have multi-region replication, but now the database had to accept a backup from the main DB to a Mongo on another region.

## Data Corruption is worse than the reliability hit

There was minimal downtime, but the main problem with a single mongo is that instead of letting mongo handle the replication, we had to use we use a `mongodump` and `mongorestore` from an active table running on another region.
This was a terrible idea as this dumped a corrupt table. We then replicated this table onto the remote region, and found that writes were timing out, indexes were not built.

This caused the most amount of headaches, as the Mongo should not even have started with the amount of data corruption in the collections. Yet the database kept chugging along and servicing requests on a best effort.
Needless to say, we got paged at 4am to discover 10000 active connections and a locked up Mongo instance. This may be why mongo management service does not allow backups created from single process mongos, even in a single mongo, we had to run it in a replset or else backup won't start.

## Always run in a replset, even if it is a single instance

What saved us was that our single mongo was still in a replset, this still allowed backups to be made, and we can always add hosts to the replset when the network partitioning was completed.
[documentation on expanding a replset](https://docs.mongodb.com/manual/tutorial/expand-replica-set/)

# Mongo Cloud MMS agent with Firewall Rules

Lastly, this is just a note on how Mongo Cloud MMS Agent work. The concepts are that every paid account is in a `Group`.
Every `Group` has one active Mongo MMS and Mongo Backup agent, this agent must have network access to all hosts in the group.
So even if we have every host with the mongo agent installed, only one instance of the agent will actually be running, every mongod monitored in this group will require IP whitelisting of the monitoring host.

Multiple replsets and standalone instances can be monitored by this single agent running on some instance inside the `Group`.

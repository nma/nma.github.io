---
layout: post
title: "Vim Save as Sudo"
description: ""
category: ""
tags: []
---

{% include JB/setup %}

Have you ever had one of those days where you were trying to edit a config file and you realized that you were not
sudo?

![Vim-Save](https://s3-us-west-2.amazonaws.com/nickma.com/vim-save.png)

![Vim-Save2](https://s3-us-west-2.amazonaws.com/nickma.com/vim-save2.png)

![Vim-Save3](https://s3-us-west-2.amazonaws.com/nickma.com/vim-save3.png)

Well recently I just picked up a trick from a seasoned systems admin where you can enforce your will upon the file.
Instead of exiting and re-editting as sudo.

Just run this and you can see that you will be able to force save the config file as root.

```bash
:w !sudo tee %

```

A little about the command:

```bash
: # semi-colon to enter vim command mode
w # to write to the file
_ # space
! # vim pipe the outputs of previous command
sudo # run as sudo
_ # space
tee # tee the command
_ # space
% # Vim substitution for the current file
```

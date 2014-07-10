---
layout: post
title: "Wordpress on Dokku with Vagrant Devo."
description: "A little tutorial to setup workpress on dokku."
category: "Tutorial"
tags: ["Vagrant", "Dokku"]
---
{% include JB/setup %}

For a new project I am taking on, I wanted to have my own Platform as a Service (PaaS) that has a git push deploy hook like Heroku.
There are a few open source projects out there that are currently trying to replicate Heroku, such as [Flynn] (https://github.com/flynn/flynn). 

Flynn is trying to become an open source Heroku replacement, but it has too many features that are overkill for our simple applications. 
I only want the git push deploy for now, this is where [Dokku] (https://github.com/progrium/dokku) comes in. 

Dokku is a very hackable and has very small code base, making it much easier to understand. I plan to use Vagrant to setup a local Dokku instance. 

To start a development environment I choose to use Vagrant, which is a tool that wraps development environments inside a virtual machine using VirtualBox, VMware, and AWS, and etc. (Full list on the official Vagrant docs). After a few attempts fiddling with my own opts and constantly being hit with {{ \"it works on my machine bugs\" }}.
The first step is to install Vagrant and the virtual machine provider (VirtualBox in my case), the installation will vary, so make sure to check the Vagrant docs for your platform. 

I am currently reading the book [Vagrant: Up and Running] (http://www.amazon.com/gp/product/1449335837/ref=as_li_tl?ie=UTF8&amp;camp=1789&amp;creative=390957&amp;creativeASIN=1449335837&amp;linkCode=as2&amp;tag=nisbl00c-20&amp;linkId=E3QWJ4CWFM7XNHFW) to learn Vagrant as I go along.
This is a pretty detailed book written by the author of Vagrant, it contains all the details you need to start using Vagrant properly. If bedside reading is not your thing, don't worry, this tutorial provides a Vagrant configuration so you don't need to touch anything. 

### What You Need

Before we begin our tutorial, please make sure you have the following installed:

* [Vagrant] (http://www.vagrantup.com/) 
* [Virtualbox] (https://www.virtualbox.org/) (or any other provider supported by Vagrant)

You can go on their official webpages for most troubleshooting information.

### Vagrant Developement Setup

We first get our working folder setup, then setup our Vagrant. 

{% highlight bash %}
$ git clone https://github.com/mhoofman/wordpress-heroku wp-app
{% endhighlight %}

{% highlight bash %}
$ cd wp-app
{% endhighlight %}

Following up, we setup our devo environment. 

{% highlight bash %}
$ vagrant init
{% endhighlight %}

You should now see a file called [Vagrantfile] (https://docs.vagrantup.com/v2/vagrantfile/index.html) in your project directory. Which is a configuration file for launching and provisioning VMs. 
Next we will use the following configuration to setup our devo environment. 

The following configuration file is modified from the Dokku project repo, which will allow us to configure our virtual machine. 

{% highlight ruby %}
VAGRANTFILE_API_VERSION = "2"

# locate requisite ENV variables or default
BOX_NAME = ENV["BOX_NAME"] || "trusty32"
BOX_URI = ENV["BOX_URI"] || "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box" 
BOX_MEMORY = ENV["BOX_MEMORY"] || "512"
DOKKU_DOMAIN = ENV["DOKKU_DOMAIN"] || "dokku.me"
DOKKU_IP = ENV["DOKKU_IP"] || "10.0.0.2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # define the vm box we need to use to config dokku
  config.vm.box = BOX_NAME
  
  # tell vagrant where to find the box if it can't locate it by the name
  config.vm.box_url = BOX_URI

  # tells vagrant to sync this folder with /root/dokku/ on the virtual machine 
  config.vm.synced_folder File.dirname(__FILE__), "/root/dokku"

  # configure the vm to forward its 80 port to 8080
  config.vm.network :forwarded_port, guest: 80, host: 8080

  # configure the vm's name
  config.vm.hostname = "#{DOKKU_DOMAIN}"

  # From Vagrant doc's: 
  # Private networks allow you to access your guest machine only from your own machine 
  # disallows public accessible, specify ip to your DOKKU_IP
  config.vm.network :private_network, ip: DOKKU_IP

  # tell vagrant to use virtualbox for our purposes, 
  # we can have multiple provider blocks for as many providers as we need.
  config.vm.provider :virtualbox do |vb|
    # this option makes the NAT engine use the host's resolver mechanisms to handle DNS requests 
    # which essentially means that we can specify domain "dokku.me" to be resolved by our local hosts file 
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    # set the memory of the virtualbox
    vb.customize ["modifyvm", :id, "--memory", BOX_MEMORY]
  end
  
  # no vagrant provisioning because we setup Dokku and let it provision our wp-app for us.
  # install Dokku on the vagrant vm with bootstrap.sh.
end
{% endhighlight %}

Next we create a bash script to bootstrap our Vagrant machine. Using a script creates a deterministic provisioning process to avoid future headaches. 
Create a file called bootstrap.sh with the following contents. 

bootstrap.sh

{% highlight bash %}
#!/bin/bash

# reference of bootstrap.sh of https://github.com/RyanBalfanz/dokku-vagrant-example

# add our envs
DB_PLUGIN=postgresql

# setup the vmachine if it hasn't been done already
vagrant up

# run commands to build Dokku on our vagrant box
# vagrant ssh will automagtocally open up an interactive terminal to our vm.
# the '--' means the end of a command, so vagrant ssh will not take any more arguments.
# once we vagrant ssh, we install Dokku (commands from the Dokku github page).
vagrant ssh -- "wget -qO- https://raw.github.com/progrium/dokku/v0.2.3/bootstrap.sh | sudo DOKKU_TAG=v0.2.3 bash"

# run commands to install our Dokku postgresql plugin 
PLUGIN_FOUND=`vagrant ssh -- "test -d /var/lib/dokku/plugins/${DB_PLUGIN} && echo 0 || echo 1"`
if [ ${PLUGIN_FOUND} -eq 0 ]; then
    echo "${DB_PLUGIN} plugin found! Skipping installation." 
else
    echo "${DB_PLUGIN} plugin does not exist! Installing..."
    # install ${DB_PLUGIN} plugin on our Dokku, commands from the plugin github page.
    vagrant ssh -- "cd /var/lib/dokku/plugins && sudo git clone https://github.com/Kloadut/dokku-pg-plugin ${DB_PLUGIN} && sudo dokku plugins-install"
fi

# pass our public key to the dokku machine, this allows us to git push deploy
cat ~/.ssh/id_rsa.pub | vagrant ssh -- sudo sshcommand acl-add dokku ${USER}
{% endhighlight %}

At this point your file structure should look like this.

{% highlight text %}
$ ls 
   |- .git
   |- .htaccess
   |- .vagrant
   |- README.md
   |- Vagrantfile  <-- 
   |- bootstrap.sh <-- 
   |- index.php
   |- ... etc wp files ...
{% endhighlight %}

Next we make bootstrap.sh executable and run it.

{% highlight text %}
$ chmod +x bootstrap.sh
$ ./bootstrap.sh
$ ... etc Vagrant output ... 
{% endhighlight %}

It will take a while for the bootstrapper to install and configure vagrant. 

So I highly recommend you go view a [video on how Dokku works] (http://progrium.com/blog/2013/06/19/dokku-the-smallest-paas-implementation-youve-ever-seen/) by the creator.
By the time you finish checking out the video your vagrant vm should be provisioned and you should be ready to push to your devo.

### Preparing to Deploy to Devo

Since we have set our Vagrant config to resolve domains to our native hosts file, we define a few host entries in /etc/hosts.

/etc/hosts

{% highlight text %}
# for local dokku deploy
10.0.0.2    dokku.me
10.0.0.2    wp-app.dokku.me
{% endhighlight %}

Finally, we prepare to deploy our app.

{% highlight text %}
$ git remote add devo dokku@dokku.me:wp-app
$ git push devo master 
{% endhighlight %}

{% highlight text %}
Counting objects: 5127, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2643/2643), done.
Writing objects: 100% (5127/5127), 15.12 MiB | 17.37 MiB/s, done.
Total 5127 (delta 2403), reused 5114 (delta 2395)
-----> Cleaning up ...
remote: Cloning into '/tmp/tmp.QbyOZK2Zde'...
-----> Building wp-app ...
remote: warning: You appear to have cloned an empty repository.
remote: done.
remote: HEAD is now at 2b0ea36... copied over dokku devo vagrantfile.
       PHP (classic) app detected
-----> Bundling NGINX 1.4.4
-----> Bundling PHP 5.5.9
-----> Bundling extensions
       apcu
       phpredis
       mongo
-----> Setting up default configuration
-----> Vendoring binaries into slug
-----> Discovering process types
       Default process types for PHP (classic) -> web
-----> Releasing wp-app ...
-----> Deploying wp-app ...
=====> Application deployed:
       http://wp-app.dokku.me

To dokku@dokku.me:wp-app
 * [new branch]      master -> master 
{% endhighlight %}

#### Setting Up Our Database

Before we proceed to test our instance we want a database, so we run some Dokku postgresql commands to create one.

{% highlight text %}
$ ssh dokku@dokku.me postgresql:create wp-app
{% endhighlight %}

{% highlight text %}
-----> Creating /home/dokku/wp-app/ENV
-----> Setting config vars and restarting wp-app
DATABASE_URL: postgres://root:ZwCRrphjiQYJ1Pvx@172.17.42.1:49154/db
-----> Releasing wp-app ...
-----> Release complete!
-----> Deploying wp-app ...
-----> Checking status of PostgreSQL
       Found image postgresql/wp-app database
       Checking status... ok.
-----> Deploy complete!

-----> wp-app linked to postgresql/wp-app database

-----> PostgreSQL container created: postgresql/wp-app

       Host: 172.17.42.1
       Port: 49154
       User: 'root'
       Password: 'ZwCRrphjiQYJ1Pvx'
       Database: 'db'

       Url: 'postgres://root:ZwCRrphjiQYJ1Pvx@172.17.42.1:49154/db'

{% endhighlight %}
Note: Docs for plugin we used for this tutorial can be found here [Kloadut/dokku-pg-plugin] (https://github.com/Kloadut/dokku-pg-plugin).

Then update Dokku with the environment variable.

{% highlight text %}
$ ssh dokku@dokku.me postgresql:link wp-app wp-app 
{% endhighlight %}

{% highlight text %}
-----> Setting config vars and restarting wp-app
DATABASE_URL: postgres://root:ZwCRrphjiQYJ1Pvx@172.17.42.1:49154/db 
-----> Releasing wp-app ...
-----> Release complete!
-----> Deploying wp-app ...
-----> Checking status of PostgreSQL
       Found image postgresql/wp-app database
       Checking status... ok.
-----> Deploy complete!

-----> wp-app linked to postgresql/wp-app database
{% endhighlight %}

Then do the same for the application environment variables.

#### Setup Application Environment Variables

Store unique keys and salts in Dokku environment variables. Wordpress can provide random values [here](https://api.wordpress.org/secret-key/1.1/salt/).

{% highlight text %}
# You can upload all the variables with one config:set command, but I broke them out for clarity.
# Due to the way Dokku parses config:set key, value pairs, make sure you wrap the values in escaped quotes (\''<your value here.
#>'\') e.g. AUTH_KEY='<your key>' should be AUTH_KEY=\''<your key>'\'. 

ssh dokku@dokku.me config:set wp-app AUTH_KEY=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app SECURE_AUTH_KEY=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app LOGGED_IN_KEY=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app NONCE_KEY=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app AUTH_SALT=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app SECURE_AUTH_SALT=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app LOGGED_IN_SALT=\''<your value here>'\'
ssh dokku@dokku.me config:set wp-app NONCE_SALT=\''<your value here>'\'
{% endhighlight %} 

One thing we need to do before the database will connect is to edit wp-config.php to accept a port parameter for our psql.

wp-config.php

{% highlight php %}
<?php
// ** Heroku Postgres settings - from Heroku Environment ** //
$db = parse_url($_ENV["DATABASE_URL"]);

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', trim($db["path"],"/"));

/** MySQL database username */
define('DB_USER', $db["user"]);

/** MySQL database password */
define('DB_PASSWORD', $db["pass"]);

/** MySQL hostname */
define('DB_HOST', $db["host"].":".$db["port"]);  // <---- add .":".$db["port"]

... 
{% endhighlight %}

Update the changes in a new branch.

{% highlight text %}
$ git checkout -b wp-app-devo
$ git add wp-config.php
$ git commit -m "added db port to wp-config.php"
{% endhighlight %}

{% highlight text %}
$ git push devo wp-app-devo:master
---> app updates...
{% endhighlight %}

Now you should have a working local environment for you wordpress application to run. 

Test it out at [http://wp-app.dokku.me] (http://wp-app.dokku.me). Yata!

### Production Setup (Bonus)

This post mainly focuses on how to use Vagrant to setup a manageable Dokku developement stack. It is recommended that you play with the local stack to get a feel for how Dokku works before committing to a production stack. 
This section will just be a quickstart guide for production environments, so I assume you have working knowledge of git and setting up a VPS with a Dokku installation.

The easiest way to get a Dokku host is by following a [1-click setup on digitalocean] (https://www.digitalocean.com/community/tutorials/how-to-use-the-dokku-one-click-digitalocean-image-to-run-a-node-js-app). 
You can also setup Dokku on any server with root access, just follow the instructions listed on the installation readme on [Dokku] (https://github.com/progrium/dokku).
The steps to setup a working application should be the same.


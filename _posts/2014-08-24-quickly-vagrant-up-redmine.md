---
layout: post
title: "Quickly Vagrant Up Redmine"
description: ""
category: "Tutorial"
tags: ["Vagrant", "Redmine", "Bitnami"]
---
{% include JB/setup %}

I am placing these quick tutorials in my [opensource projects respository](https://github.com/nma/opensource) so I can have a quick reference on how to spin up new opensource instances when I need them.

Bitnami stacks it really easy to spin up preconfigured stacks for the websites, they have a comprehensive list of open source stuff at [Bitnami stacks](https://bitnami.com/stacks).

You could provision the machines with a [Bitnami Redmine Installer](https://bitnami.com/stack/redmine/installer) for Ubuntu and have that run on your Vagrant vm. Alternatively, you could use a 
normal shell script and it will install redmine through the apt-get channels. 

If you want to see how to deploy redmine independantly, please check out bootstrap.sh.I did not write it, but I learned a lot of new commands such as defconf-set-selections for provisioning with shell scripts.

For purpose of this tutorial, would be best if we stick with the bitnami stacks, the VagrantFile has commented out the bootstrap.sh and prefers bitnami-bootstrap.sh.
The files can all be located [here](https://github.com/nma/opensource/redmine).

The bashscript is as follows:

{% highlight bash %}
#bin/bash

sudo cat > redmine.ini <<EOF
base_user=admin
base_password=redminepwd
redmine_language=en
smtp_email_provider=custom
smtp_enable=1
smtp_user=myemail@mydomain.com
smtp_password=mySMTPPassword
smtp_host=smtp.domain.com
smtp_port=587
smtp_protocol=tls
EOF

INSTALLER=bitnami-redmine

# get the installer
wget -O $INSTALLER "https://bitnami.com/redirect/to/39065/bitnami-redmine-2.5.2-1-linux-x64-installer.run" > /dev/null

echo "[INFO] Done installing bitnami-redmine installer"

# set permissions
chmod a+x $INSTALLER

# do the deed
./$INSTALLER --mode unattended --optionfile redmine.ini
# ssh and configure manually
#./$INSTALLER --mode text  

{% endhighlight %}

The Vagrant Environment will take shell script above and provision the VM. The VagrantFile:

{% highlight ruby %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

# locate requisite ENV variables or default
BOX_NAME = ENV["BOX_NAME"] || "trusty64-amd"
BOX_URI = ENV["BOX_URI"] || "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box" 
BOX_MEMORY = ENV["BOX_MEMORY"] || "2048"
REDMINE_DOMAIN = ENV["REDMINE_DOMAIN"] || "redmine.me"
REDMINE_IP = ENV["REDMINE_IP"] || "10.0.0.2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = BOX_NAME

  # The url from where the 'config.vm.box' box will be fetched if it
  # doesn't already exist on the user's system.
  config.vm.box_url = BOX_URI 

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: REDMINE_IP
  
  # tells vagrant to sync just our theme on the virtual machine
  # comment out to sync everything to /vagrant
  config.vm.synced_folder File.dirname(__FILE__), "/vagrant/"

  # tells vagrant to use our hostname
  config.vm.hostname = "#{REDMINE_DOMAIN}"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
     # Don't boot with headless mode
     #vb.gui = true
  
    # this option makes the NAT engine use the host's resolver mechanisms to handle DNS requests 
    # which essentially means that we can specify domain "redmine.me" to be resolved by our local hosts file 
    #vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    # set the memory of the virtualbox
    vb.customize ["modifyvm", :id, "--memory", BOX_MEMORY]
  end

  # once the vm is started
  # use the bootstrap.sh file to install and setup redmine
  config.vm.provision "shell", path: "bitnami-bootstrap.sh"
  # config.vm.provision "shell", path: "update-theme.sh"
end

{% endhighlight %}

If you check out the other files in the repository, you can find the bootstrap.sh method, which demonstrates how redmine can be provisioned from pure shell script. 
I plan to add on a chef provisioner as I am currently planning to look into that, a puppet provisioner may follow soon as well.

```
vagrant up
```
You should see redmine at 10.0.0.2/redmine

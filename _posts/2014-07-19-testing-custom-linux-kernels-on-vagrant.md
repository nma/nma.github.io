---
layout: post
title: "Testing Custom Linux Kernels on Vagrant."
description: "Why not?"
category: "Tutorial"
tags: ["Vagrant", "Ubuntu Kernel"]
---
{% include JB/setup %}

NOTE: This post doesn't go into building the kernel, all I did for this week was to use vagrant to use best practices to pull the preempt-rt kernel. I will continue this post chain when I get time to compile and build a kernel properly.

A friend was building a custom Ubuntu kernel and after installing the new kernel on the machine the login page refused to work.

After reading about vagrant and working with virtual machines, I felt that testing major OS changes will definitely be beneficial on a virtual machine.
So this blog post details my attempt (vain or not) at making a easily rebootable Vagrant environment to test potentially OS breaking changes to the kernel with out having to constantly re-install the OS on a physical machine. 

The first step will be to setup a default box for Vagrant to work. Since I had previously downloaded a trusty32-amd machine, I will stick with that for my base box.

Define our Vagrantfile in the project directory should look like this.

VagrantFile

{% highlight ruby %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
BOX_NAME = ENV["BOX_NAME"] || "trusty32-amd"
BOX_URI = ENV["BOX_URI"] || "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box" 
BOX_MEMORY = ENV["BOX_MEMORY"] || 750
BOX_HOST = ENV["BOX_HOST"] || "preempt-rt"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = BOX_NAME
  config.vm.box_url = BOX_URI

  config.vm.host_name = BOX_HOST

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 80, host: 8080

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # If true, then any SSH connections made will enable agent forwarding.
  # Default value: false
  # config.ssh.forward_agent = true

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
    # Don't boot with headless mode
    # vb.gui = true

    # Use VBoxManage to customize the VM. For example to change memory:
    vb.customize ["modifyvm", :id, "--memory", BOX_MEMORY]

    # Allow vm to directly access the hosts pci hardware
    # https://www.virtualbox.org/manual/ch09.html#pcipassthrough
    # vb.customize ["modifyvm", :id, "--pciattach", <CPU-architecture supported id.>]

  end
  
  config.vm.provision "shell", path: "get-linux-kernel.sh"
end

{% endhighlight %}

After defining our Vagrantfile, we setup a shell provisioner to automate our installation of our system.

get-linux-kernel.sh

{% highlight bash %}
#!/bin/bash

# locate our most up to date preempt_rt kernel patch, default to 3.14 if not set
PREEMPT_RT_VERSION=${PREEMPT_RT_VERSION:-"3.14.12-rt9"}
# the linux kernel must match the patch version.
LINUX_KERNEL_VERSION=${PREEMPT_RT_VERSION}
# to ensure our kernel does not contain any malware, we grab the signer's public key 
KERNEL_GPG_KEY=${KERNEL_GPG_KEY:-"00411886"}

echo "GET KERNAL VERSION --> ${PREEMPT_RT_VERSION}"

# install linux kernel manager ketchup
echo "Attempting to install ketchup kernel manager."
sudo apt-get install ketchup
cd /usr/src/kernels
mkdir linux
cd linux

# setup our loading key
gpg --recv-keys ${KERNEL_GPG_KEY}

# grab the kernel source 
echo "Grabbing kernel version ${LINUX_KERNEL_VERSION}... (may take a while to grab source files)"
ketchup -r -G ${PREEMPT_RT_VERSION} > /dev/null 2>&1
echo "Completed linux kernel source download. Now you can go configure it."

# NOTE: ketchup command above just automating this process below...

# get and apply the preempt-rt patch
# wget http://www.kernel.org/pub/linux/kernel/v3.14/linux-3.14.12.tar.bz2 > /dev/null 2>&1 
# wget https://www.kernel.org/pub/linux/kernel/projects/rt/3.14/patch-3.14.12-rt9.patch.gz > /dev/null 2>&1  

# tar -jxvf linux-3.14.12.tar.bz2
# mv linux-3.14.12 linux-3.14.12-rt9
# cd linux-3.14.12-rt9
# zcat ../patch-3.14.12-rt9.patch.gz | patch -p1

{% endhighlight %}

With the patched kernel setup, we can go configure and test the installation to our leisure.
First we need to login to our vagrant box.

{% highlight bash %}
vagrant ssh
{% endhighlight %}

Then we perform the kernel setup steps listed below.

{% highlight bash %}
cd linux-3.14.12-rt9
{% endhighlight %}

{% highlight bash %}
# copy over your current kernel config file
cp /boot/config-`uname -r` .config
{% endhighlight %}

{% highlight bash %}
# run menuconfig
# I ran into an issue where I was missing library ncurses
sudo apt-get install libncurses5-dev
make menuconfig 
{% endhighlight %}
 
You should see a text based configuration screen for the kernel. Follow the steps outlined below to install your kernel.
Lets go completely preemptable. 

{% highlight text %}
Processor type and features  --->
      Preemption Mode (Complete Preemption (Real-Time))  --->
{% endhighlight %}

You probably want some debugging to see what blows up.

{% highlight text %}
Kernel hacking  --->
   [*] Tracers  --->
      --- Tracers
      [*]   Kernel Function Tracer
      [*]   Interrupts-off Latency Tracer
      [*]     Interrupts-off Latency Histogram
      [*]   Preemption-off Latency Traver
      [*]     Preemption-off Latency Histogram
      [*]   Scheduling Latency Tracer
      [*]     Scheduling Latency Histogram
      [*]   Missed timer offsets histogram
   [*] Debug Preemptive Kernel --->
      --- Locking Debug 
      [*] RT Mutex debugging, deadlock detection
      [*] Built-in scriptable tester for rt-mutexes
      -*- Spinlock and rw-lock debugging: basic checks
      -*- Mutex debugging: basic checks
      [*] Wait/wound mutex debugging: Slowpath testing 
      -*- Lock debugging: detect incorrect freeing of live locks
      [*] Lock debugging: prove locking correctness
      [*] Lock usage statistics
      [*] Lock dependency engine debugging
      [*] Sleep inside atomic section checking
      [*] Locking API boot-time self-tests
{% endhighlight %}

![Config Page](https://s3-us-west-2.amazonaws.com/nickma.com/Kernelconfig-2014-07-19+at+12.42.42+PM.png)

![Preempt RT Flag](https://s3-us-west-2.amazonaws.com/nickma.com/Screen+Shot+2014-07-19+at+1.05.54+PM.png)

A note from [www.osadl.com](https://www.osadl.org/Realtime-Preempt-Kernel.kernel-rt.0.html#ubuntu):
Should you happen to be the proud owner of a multi-core processor, be sure to specify the -j `<jobs`> option of make where `<jobs`> is twice the number of cores your processor has, as this will speed up kernel compilation considerably.

{% highlight bash %}
# takes a while to build the things, good time to coffee break
# add the -j if you know how many cores you have.
sudo make

# then we install the built kernel
make modules_install install
{% endhighlight %}

At this point you should be able to test out the kernel, perhaps in a later post if I find the bandwidth. 

### Alternative ###
Near the end of my research I found out that ubuntu has its own linux-realtime that can be apt-get installed, though only for certain versions, you may end up on an older version of the kernel.
This is a far simpler solution on [ubuntu/RealTime](https://wiki.ubuntu.com/RealTime).

If you want to try this method, its easy! Since we are on a virtual machine, just kill it off with vagrant destroy and rebuild it with the correct base box.
Just replace the provisioning script with the procedures on link above. 


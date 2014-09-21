---
layout: post
title: "Testing kubernetes with Vagrant and AWS."
description: ""
category: "Tutorial"
tags: ["Vagrant", "kubernetes", "AWS"]
---
{% include JB/setup %}

First off, we figure what is this Kubernetes thing? How do I play with it?

Kubernetes is a large scale cluster management from the GoogleCloudPlatform. It was recently opensourced at Google and has seen significant attention by the cloud infrastructure community.
An excerpt form the github blurb is as below: "While the concepts and architecture in Kubernetes represent years of experience designing and building large scale cluster manager at Google, the Kubernetes project is still under heavy development. Expect bugs, design and API changes as we bring it to a stable, production product over the coming year."

I wanted a play ground to work with it so I wanted to make a test bed to figure out how to use it, and also tweak around with clean deployments.

I have been using Vagrant a lot for all my projects, but the problem of VMs taking significant space on my small laptop drive makes me cringe. So for this tutorial, we will use the vagrant AWS plugin to manage VMs on the cloud.
First off we get the kubernetes source code.

```
$ git clone https://github.com/GoogleCloudPlatform/kubernetes.git
```

Once you have the kubernetes we should continue to setup Vagrant, if you don't have it, instructions are on the [Vagrant Website](https://www.vagrantup.com/). We need to be able to spin up virtual machines on the cloud, so we downlaod the vagrant-aws plugin.

```
$ vagrant plugin install vagrant-aws 
```

We need to download an aws dummy box for it to work.

```
$ vagrant box add dummy https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box
```

Now everything should be setup, so lets go and checkout the kubernetes source folder which contains a VagrantFile, lets tweak it so that it spins up the environments on our AWS account.

The original VagrantFile specified a fedora instance, so we can locate substitute on the [Fedora project](http://fedoraproject.org/en/get-fedora#clouds). Specify the region and an ami code will show up.

Next we need to build a VPC on aws, I had one laying around oregon.  To build a new one, just follow the instructions listed on the [AWS VPC Docs](http://docs.aws.amazon.com/AmazonVPC/latest/GettingStartedGuide/Wizard.html).

Once thats taken care of, just follow the tweaked VagrantFile and you should be able to launch a kubernetes cluster on your AWS VPC.

{% highlight ruby %}
# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

# Require a recent version of vagrant otherwise some have reported errors setting host names on boxes
Vagrant.require_version ">= 1.6.2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # The number of minions to provision
  num_minion = (ENV['KUBERNETES_NUM_MINIONS'] || 1).to_i

  # Determine the OS platform to use
  kube_os = ENV['KUBERNETES_OS'] || "fedora"

  # Root user
  root_user = ENV['ROOT_USER'] || "fedora"

  # ip configuration
  master_ip = "172.31.1.2"
  minion_ip_base = "172.31.2."
  minion_ips = num_minion.times.collect { |n| minion_ip_base + "#{n+2}" }
  minion_ips_str = minion_ips.join(",")

  # Force default box to a dummy to use AWS
  config.vm.box = "dummy"
  config.vm.box_url = "https://github.com/mitchellh/vagrant-aws/raw/master/dummy.box"

  config.vm.provider :aws do |aws, override|
    aws.access_key_id = "<ACCESS_KEY>"
    aws.secret_access_key = "<ACCESS_SECRET>"

    aws.region = "us-west-2"
    aws.availability_zone = "us-west-2c"
    aws.ami = "ami-cc8de6fc" # fedora

    aws.keypair_name = "<KEY_PAIR>"
    aws.instance_type = "t1.micro"
    aws.security_groups = ["sg-52169437"]
    aws.subnet_id = "subnet-f2b9e399"
    
    aws.user_data = "#!/bin/bash\n echo 'Defaults:#{root_user} !requiretty' > /etc/sudoers.d/90-vagrant-cloud-init-requiretty && chmod 440 /etc/sudoers.d/999-vagrant-cloud-init-requiretty\n"

    override.ssh.private_key_path = "<LOCAL_PATH_TO_KEY_PAIR>"
    override.ssh.username = "#{root_user}"
    override.ssh.pty = true
  end

  # Kubernetes master
  config.vm.define "master" do |config|

    config.vm.provider :aws do |aws|
      aws.private_ip_address = "#{master_ip}"
      aws.tags = {
        'Name' => "kubernetes-master"
      }
    end

    config.vm.hostname = "kubernetes-master"
    config.vm.provision "shell", inline: "/vagrant/cluster/vagrant/provision-master.sh #{master_ip} #{num_minion} #{minion_ips_str}"
  end

  # Kubernetes minion
  num_minion.times do |n|

    config.vm.define "minion-#{n+1}" do |minion|

      minion_index = n+1
      minion_ip = minion_ips[n]
      # fix up the aws details for each individual minion
      minion.vm.provider :aws do |aws|
        aws.private_ip_address = "#{minion_ip}"
        aws.tags = {
          'Name' => "kubernetes-minion-#{minion_index}"
        }
      end

      minion.vm.hostname = "kubernetes-minion-#{minion_index}"
      minion.vm.provision "shell", inline: "/vagrant/cluster/vagrant/provision-minion.sh #{master_ip} #{num_minion} #{minion_ips_str} #{minion_ip}"
    end
  end

  config.vm.synced_folder File.dirname(__FILE__), "/vagrant", type: "rsync"
end
{% endhighlight %}

Now that we set up the file we perform a quick Vagrant Up to spin up some AWS instances. (due to a race condition where permissions to rsync is not setup after ssh is available, we don't provision yet.)

```
$ vagrant up --provider=aws --no-provision
```

You should see output along the lines of the following:

{% highlight text %}
...
==> master: Waiting for instance to become "ready"...
==> minion-2: Waiting for instance to become "ready"...
==> minion-1: Waiting for instance to become "ready"...
==> minion-3: Waiting for instance to become "ready"...
==> minion-2: Waiting for SSH to become available...
==> minion-3: Waiting for SSH to become available...
==> master: Waiting for SSH to become available...
==> minion-1: Waiting for SSH to become available...
...
{% endhighlight %}

Which indiccate that the following instances are now being spun up on your AWS account, pretty cool right?

![Loading instances](https://s3-us-west-2.amazonaws.com/nickma.com/Kubernetes-EC2-instances)

Next, we perform the provisioning commands, first we rsync the kubernets source onto the aws boxes.

```
$ vagrant rsync
```

Finally, we run the Kubernetes provisioning scripts on the AWS boxes.

```
$ vagrant provision
```









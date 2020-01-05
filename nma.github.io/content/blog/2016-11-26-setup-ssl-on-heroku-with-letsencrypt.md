---
title: 'Setup SSL on Heroku with letsencrypt and Rails'
date: '2016-11-26'
description: 'how to setup SSL works with letsencrypt'
category: ''
tags: ['Open Source', 'DevOps']
---

So this weekend I had some time to help out on a opensource project manage by some awesome Toronto folks. Yay Toronto!

Task breakdown as follows.

The steps are as follows:

- figure out how to setup the app for SSL or enforce SSL.
- how to test it properly without downtime? because SSL is tied to a domain this mean the quickest way to test is on production.
- figure out how heroku SSL solutions.

## Enforce SSL and Testing

In Rails the way that SSL is enforced is set in a config file, this would be the following path `config/environments/production.rb`.

```ruby
...
config.force_ssl = true
# This is required or the host server will send headers telling us its from the *.herokuapp.com domain
# subsequently, this will cause the SSL certs registered for our private DNS address to fail.
config.action_controller.default_url_options = { host: "www.example.org" }
config.action_controller.asset_host = "www.example.org"
...
```

By default SSL is an optional protocol to the webapp, a user can direct to `http://` or `https://`, but websites also need a DNS change to redirect `http://` -> `https://`.
For most servers we also need to enable the endpoint/port, because regular web traffic routes on `:80`, but https requires `:443` by convention. Rails will perform the redirect when _force_ssl_ is set to true.

> In Heroku... An alternative SSL implementation is available via the SSL Endpoint add-on. The SSL Endpoint add-on is only recommended if you need to support legacy browser clients which do not support SNI. It also costs another \$20/mo to enable.

Since most of this projects users won't be using legacy browsers, we drop the clunky SSL Endpoint and go with the SNI version. Much faster and friendlier!
Don't worry too much about the distinction, but if you must here is a [wiki link](https://en.wikipedia.org/wiki/Server_Name_Indication).

Now to allow this functionality Heroku requests that you direct your app's DNS to a specific DNS name, which then resolves your application server so that it hits your server with an internal IP.
When you just hit the app at `example.heroku.com`, you are hitting the app at the top level heroku DNS router.

```
$> heroku domains
=== example Heroku Domain
example.herokuapp.com

=== example Custom Domains
Domain Name       DNS Target
────────────────  ──────────────────────────────
example.me      example.me.herokudns.com
www.example.me  www.example.me.herokudns.com

```

This is required or the host server will route from \*.herokuapp.com domain subsequently, this will cause the SSL certs registered for our private DNS address to fail.

```
 dig www.example.org

 ; <<>> DiG 9.10.3-P4-Ubuntu <<>> www.if-me.org
 ;; global options: +cmd
 ;; Got answer:
 ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 23689
 ;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 4, ADDITIONAL: 1

 ;; OPT PSEUDOSECTION:
 ; EDNS: version: 0, flags:; udp: 1280
 ;; QUESTION SECTION:
 ;www.example.org.            IN  A

 ;; ANSWER SECTION:
 www.example.org.     1800    IN  CNAME   example.herokuapp.com.
 example.herokuapp.com.    300 IN  CNAME   us-east-1-a.route.herokuapp.com.
 us-east-1-a.route.herokuapp.com. 50 IN A   1.2.188.105

 ;; AUTHORITY SECTION:
 herokuapp.com.     400 IN  NS  ns-505.awsdns-63.com.
 herokuapp.com.     400 IN  NS  ns-662.awsdns-18.net.
 herokuapp.com.     400 IN  NS  ns-1378.awsdns-44.org.
 herokuapp.com.     400 IN  NS  ns-1624.awsdns-11.co.uk.

 ;; Query time: 218 msec
 ;; SERVER: 127.0.1.1#53(127.0.1.1)
 ;; WHEN: Sun Nov 27 00:52:12 EST 2016
 ;; MSG SIZE  rcvd: 256
```

When your ANSWER SECTION is a CNAME redirect to example.herokuapp.com, the DNS server tells the browser that this is \*.herokuapp.com.
Since your SSL is registered for www.example.com and not \*.herokuapp.com!

You need to change your DNS to point to the topmost DNS resolver as output by your `heroku domains` command.
Then your DNS resolution will now return the correct www.example.com metadata for the SSL Cert to be validated.

```
; <<>> DiG 9.10.3-P4-Ubuntu <<>> www.example.org
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 43572
;; flags: qr rd ra; QUERY: 1, ANSWER: 9, AUTHORITY: 4, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1280
;; QUESTION SECTION:
;www.example.org.      IN  A

;; ANSWER SECTION:
www.example.org.   1800    IN  CNAME   www.example.org.herokudns.com.
www.example.org.herokudns.com. 60 IN   A   54.243.119.83
www.example.org.herokudns.com. 60 IN   A   54.243.91.166
www.example.org.herokudns.com. 60 IN   A   54.561.252.234
www.example.org.herokudns.com. 60 IN   A   50.19.93.247
www.example.org.herokudns.com. 60 IN   A   54.565.193.561
www.example.org.herokudns.com. 60 IN   A   54.565.563.184
www.example.org.herokudns.com. 60 IN   A   54.235.135.158
www.example.org.herokudns.com. 60 IN   A   54.235.212.238

;; AUTHORITY SECTION:
herokudns.com.      123094  IN  NS  ns-44.awsdns-05.com.
herokudns.com.      123094  IN  NS  ns-955.awsdns-55.net.
herokudns.com.      123094  IN  NS  ns-1260.awsdns-29.org.
herokudns.com.      123094  IN  NS  ns-1672.awsdns-17.co.uk.

;; Query time: 69 msec
;; SERVER: 127.0.1.1#53(127.0.1.1)
;; WHEN: Sun Nov 27 00:57:16 EST 2016
;; MSG SIZE  rcvd: 353

```

Check #1.

To test SSL we don't need to enforce SSL to test that it works, we can in theory setup SSL certs but don't enforce it, this way
our app can still stay in production to serve regular http request without anything breaking.

All we need to do is just hit it with `https://` and see if the cert breaks or not. The normal traffic will just flow from `http://` without an issues.

Check #2.

## SSL options

Last step is to browse through the SSL options we are given.

The initial options are given to me with a Heroku plugin called:

- ExpediateSSL at \$15/month. This gives you a SSL cert along with automagically integrating all the settings. Though it is a bit more black box.
- Lets Encrypt + Heroku SSL SNI

ExpediateSSL most likely works by similar methods, as they have a video about setup in [3 minute setup](https://www.youtube.com/watch?v=OcyR7Yus4pc), but some issues made it not work, so I checked out the alternative setup.
The issue seems to be that, expediateSSL seems to require the SSL-Endpoint, so in the note on the documentation.

> NOTE: Expedited SSL works with your Heroku SSL Endpoint. If one is not already a part of your application, one will be added at its base monthly cost.

In total, the expediated SSL + SSL-Endpoint runs at an additional \$35/mo, since the app is still in the hobby phase, we can cut that cost with the letsencrypt method, until the day we actually need to support legacy browsers and have automated cert updates to CloudFront.

With a bit more doc reading (I am a weird person, I like reading docs while listening to [music](http://www.indieshuffle.com/playlists/readingdocs-115588/).)
We also have the service provided by letsencrypt, [Let’s Encrypt](https://letsencrypt.org/) is a free, automated, and open Certificate Authority.
Their setup is a bit more involved, but it is well worth it! Plus this SSL knowledge can then be applied to every app idea you have thus forth.
Personally I'm of the mentality to learn it the hard way, as infrastructure is black box most of the time. Gotta show that all the wasted time on reading tech docs isn't actually a waste!

> Since Let's Encrypt is backed by Chrome, Mozilla, Akamai
> and other major browser and CDN vendors, we can have a higher confidence that a browser update won't redact our SSL certs. e.g. [Chrome 53 rejects Chase online bankings Symantec SSL Certs.](https://sslmate.com/blog/post/ct_redaction_in_chrome_53)

A sample of the setup I used is found on medium.com on a [letsencrypt example with heroku post](https://medium.com/@franxyzxyz/setting-up-free-https-with-heroku-ssl-and-lets-encrypt-80cf6eac108e#.v9azmm96o),
this tut meshes well with a sample that is tailored to rails apps [letsencrypt with heroku and rails](http://collectiveidea.com/blog/archives/2016/01/12/lets-encrypt-with-a-rails-app-on-heroku).

Though essentially, the following steps were used.

```
$> sudo apt-get install letsencrypt

# Hit the above links for pictures!
$> sudo letsencrypt certonly  --manual
...
Make sure your web server displays the following content at
http://www.example.com/.well-known/acme-challenge/xxxxxxxxxxxx-yyyy.zzzzzzzzzzzzzzzzzzz before continuing:
xxxxxxxxxxxx-yyyy.zzzzzzzzzzzzzzzzzzz
If you don’t have HTTP server configured, you can run the following
command on the target server (as root):
mkdir -p /tmp/certbot/public_html/.well-known/acme-challenge
cd /tmp/certbot/public_html
printf “%s” Gm35kFLiXnNtKT9OAOG_KPZvqMmYYAZU6DN-QRoGclg.s2I4ZV9Ne2CNtczlqXV9uw1ZdB5OSypG_cIdiuT7BwI > .well-known/acme-challenge/Gm35kFLiXnNtKT9OAOG_KPZvqMmYYAZU6DN-QRoGclg
# run only once per server:
$(command -v python2 || command -v python2.7 || command -v python2.6) -c \
“import BaseHTTPServer, SimpleHTTPServer; \
s = BaseHTTPServer.HTTPServer((‘’, 80), SimpleHTTPServer.SimpleHTTPRequestHandler); \
s.serve_forever()”
Press ENTER to continue
```

In rails, add these files:

```ruby
# config/routes.rb
get '/.well-known/acme-challenge/:id' => 'pages#letsencrypt'
```

In the controllers, add the following method.

```ruby
  class PagesController < ApplicationController
    def letsencrypt
      # use your code here, not mine
      render text: "ya6k1edW38z-your-value-here"
    end
  end
```

Now deploy your app on heroku, then continue the letsencrypt workflow. An automated agent will hit your server with your domain name just to verify that you own it. The challenge above needs to be returned.

```
IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/www.example.com/fullchain.pem. Your cert will
   expire on 2016-04-11. To obtain a new version of the certificate in
   the future, simply run Let's Encrypt again.
```

All your certs will live in /etc/letsencrypt/live/www.example.com/\*.pem, this directory should be centralized and backed up.

```
# upload certs to the mothership
$> sudo heroku certs:add /etc/letsencrypt/live/www.example.com/fullchain.pem
```

```
$> curl -vI https://www.example.com

# boom.
```

When you need to upgrade the cert.

```
sudo letsencrypt certonly --manual -d www.example.com
```

Free certs for all your domains, no \$35/mo issues.

When you need to update the cert to match new subdomains

```
sudo letsencrypt certonly --expand -d www.example.com
```

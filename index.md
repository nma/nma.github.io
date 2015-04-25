---
layout: page 
tagline: Dev the World!
---
{% include JB/setup %}

<div class="social">
    <ul class="list-linear">
        <li><div class="twitter-follow"><a href="https://twitter.com/{{ site.author.twitter }}" class="twitter-follow-button" data-show-count="false" data-lang="en"></a></div></li>
        <li><div class="twitter-tweet"><a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-via="{{ site.author.twitter }}" data-lang="en">Tweet</a></div></li>
    </ul>
</div>

{% for post in site.posts limit:1 %}
  <div class="row">
    <div class="span12">
        <h1><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h1>
        {{ post.content }}
    </div>
  </div>
{% endfor %}

<h3>Recent Posts</h3>
<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>


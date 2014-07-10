---
layout: page 
tagline: Dev the World!
---
{% include JB/setup %}

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


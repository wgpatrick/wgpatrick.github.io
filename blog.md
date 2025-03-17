---
layout: page
title: Blog
permalink: /blog/
---

<script>
document.body.classList.add('blog-page');
</script>

<link rel="stylesheet" href="/assets/css/blog-styles.css">

<!-- Hide the default post header -->
<style>
  .post-header {
    display: none;
  }
</style>

<div class="blog-container">
  <h1 class="blog-title">Blog</h1>
  
  <div class="blog-posts">
    {% for post in site.posts %}
      <article class="blog-post-preview">
        <h2 class="post-title">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h2>
        <div class="post-meta">
          <time datetime="{{ post.date | date_to_xmlschema }}">
            {{ post.date | date: "%B %-d, %Y" }}
          </time>
          {% if post.category %}
          • <span class="post-category">{{ post.category }}</span>
          {% endif %}
        </div>
        <div class="post-excerpt">
          {{ post.excerpt }}
        </div>
        <a href="{{ post.url | relative_url }}" class="read-more">Read More →</a>
      </article>
    {% endfor %}
  </div>
</div> 
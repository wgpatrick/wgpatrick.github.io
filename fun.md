---
layout: default
title: "Fun Creative Projects"
permalink: /fun/
hide_in_nav: true
---

<div class="fun-page">
  <div class="section-title">
    <h1>Creative Experiments</h1>
    <p>Interactive explorations and creative side projects</p>
  </div>
  
  <div class="fun-grid">
    <a href="/growth" class="fun-item">
      <div class="thumbnail">
        <img src="/assets/images/fun/organic-growth-thumbnail.svg" alt="Organic Growth Patterns">
      </div>
      <div class="fun-item-info">
        <h3>Organic Growth Patterns</h3>
        <p>Interactive simulation of natural branching structures</p>
      </div>
    </a>

    <a href="/finmodel/index.html" class="fun-item">
      <div class="thumbnail">
        <img src="/assets/images/fun/finmodel-thumbnail.svg" alt="Financial Model Demo">
      </div>
      <div class="fun-item-info">
        <h3>Startup Financial Model</h3>
        <p>Interactive financial planning tool with sensitivity analysis and cash flow visualization</p>
      </div>
    </a>
  </div>
</div>

<style>
  .fun-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .section-title {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .section-title h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .section-title p {
    font-size: 1.2rem;
    color: #666;
  }
  
  .fun-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 2rem;
    justify-content: center;
  }
  
  .fun-item {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .fun-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  
  .thumbnail {
    height: 200px;
    overflow: hidden;
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .fun-item-info {
    padding: 1.5rem;
    background: #fff;
  }
  
  .fun-item-info h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .fun-item-info p {
    margin: 0;
    color: #666;
  }
</style> 
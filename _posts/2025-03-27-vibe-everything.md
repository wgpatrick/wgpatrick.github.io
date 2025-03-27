---
layout: post
title: "Vibe Code Everything"
date: 2025-03-27 10:00:00 -0800
category: Technology
---

I have been spending a lot of time <span class="annotated-term" data-id="vibe-coding">vibe coding</span> recently. Now, when I come across a task of any type, I think: could I do it in <span class="annotated-term" data-id="cursor">Cursor</span>? Making a quick financial model? Cursor. Building a 3D model of a desk? Cursor. Writing a book for my son? You guessed it, Cursor. It's made me think that there's a near future where most non-software tasks are done with code. In other words, vibe code everything. Let me tell you how.

My son likes trains, so I wanted to write a short children's book about my son and I riding the Muni. I chatted with Cursor and Cursor wrote the story, generated prompts for illustrations, sent API requests for images (using <span class="annotated-term" data-id="replicate">Replicate</span>), and created the final book. I told Cursor to "Add the text to the images for each page", and it created a Python script to add the dialogue to the images. All of this took all of 10-15 minutes and I didn't leave the <span class="annotated-term" data-id="ide">IDE</span>. The alternative would have been hours brushing up on photoshop, futsing around with the image generation APIs, tweaking text, and so on. Now that it's complete, I can extend the story with a query like, "Continue for 2-3 more pages." 

<figure>
  <img src="/assets/images/blog/book-page-1.png" alt="Page 1 of the children's book">
  <figcaption>Page 1 of the book. The text was added to this image with a prompt that said, "Can you add the text to the images. Is there some way you can do that programmatically?". Cursor wrote a script that used PIL library to add the text.</figcaption>
</figure>

I'm also on the board of a company, and I recently wanted to run a sensitivity analysis of the company's operating plan for the next 12 months. I gave Cursor the basic details of the business and then it built a model. After 2-3 iterations and about 90 seconds of actual work time, I had a stunningly useful local web app (just HTML/CSS/JS) where I could move sliders to adjust revenue growth and look at the impact on the company's runway. Again, the alternative would have been spending time with Excel (yay!), and the result would have been far less pretty. Check out a demo (with synthetic data) of this <a href="/finmodel/index.html">here</a>. 

<figure>
  <img src="/assets/images/blog/financial-model.png" alt="Financial model demo">
  <figcaption>A demo version (scrubbed of real data) of the simple cash flow model that I made in about ~10-15 mins using Cursor.</figcaption>
</figure>

What enables these new workflows is a combination of code generation, <span class="annotated-term" data-id="agentic-tool-use">agentic tool use</span>, reasoning models, <span class="annotated-term" data-id="model-context-protocol">Model Context Protocol (MCP)</span>, multimodal models, and whatever magic Cursor is doing under the hood to bring in the right context. I chat with the agent about how to solve the problem and then we write documents, create images, write code, and use tools. The key unlock is that, in this new world, everything is programmable. For example, a markdown document can be updated with a simple query  ("Outline each page of Jasper's story in a markdown doc."). Alternatively, a markdown document can serve as input data to another action ("For each page, create a prompt that we can use to generate an image via the Replicate MCP.") 

I think these powerful vibe everything workflows will extend beyond personal tasks to how we complete most work. AI native start-ups are already using the IDE to quickly and effectively complete non-software tasks. And, I think it's a safe assumption that this approach will have a huge impact on many if not the majority of businesses in the near future. 

## As always, start-ups are on the vanguard

My friends running AI native startups are using IDE agents as a core part of their business already. For example, Tim Delisle, founder of FiveOneFour told me recently <span class="annotated-term" data-id="company-repo">his entire company lives in a GitHub repo</span>. Strategy documents, sales assets, marketing materials—all in markdown. The benefits? Everything's version-controlled. No time spent switching to a different UI.  And, again, everything is programmable. This enables superpowers like automatically creating customer-specific sales and marketing assets from template markdown materials, or automatically updating company strategy and comms based on product progress.

Another founder running an AI agent start-up showed me his custom <span class="annotated-term" data-id="crm">CRM</span> using <span class="annotated-term" data-id="sqlite">SQLite</span> and ~10 scripts. It pulls lead data from the web, generates personalized cold emails, tracks responses, and updates automatically. He looked at off-the-shelf CRMs, but their workflows didn't make it easy to programmatically interface with the data. And, features like permissioning were an impediment.

<figure>
  <img src="/assets/images/blog/crm-ui.png" alt="Custom CRM UI">
  <figcaption>The read-only UI for the CRM that my friend built. To blur the email addresses in the image above, I first tried to use the recently launched <span class="annotated-term" data-id="gpt4o-image-generation">GPT4o image generation</span>. Didn't work. Instead, I asked Cursor to do it, and it wrote a script that worked beautifully.</figcaption>
</figure>

Why does this matter? Obviously, large companies won't move their businesses into GitHub repos (yet!). But, AI-native startups will grow and I think this vibe everything approach will become a core part of company building.

## Here are 3 ways I see this playing out: 

1. There are many existing SaaS apps that don't need to be re-built. <span class="annotated-term" data-id="hris">HRIS</span> systems (e.g. Rippling) come to mind as a prime example; it would be silly for a start-up to build out all of the regulatory logic/workflows into their own in-house app. Instead of building their own, IDE dwellers will want to interface with these apps programmatically using Model Context Protocol (MCP) ("Update my board deck in my company strategy folder with our org chart from Rippling"). If existing apps fail to create a programmatic interface, we could see new players that are MCP-first (with only a lightweight UI) that compete with them.

2. I think business critical software like Hubspot will be exploded into 5-20 modular sub-components available via API, enabling AI native start-ups to easily create their own software for core business apps. For example, the founder who built the CRM wanted to use a hosted API service for writing cold email campaigns with built-in best practices. There's a big opportunity for new start-ups to build these modular app components. 

3. Finally, some currently popular apps won't be used by AI native start-ups. I've found myself using Google Docs only in particularly situations where I need collaborative feedback (e.g. like this blog post). Even Notion, which has nailed AI integration, is not necessary for most work that I do. I imagine this will accelerate once some kind of collaborative / multiplayer Cursor/IDE is created. 

## Vibe everything

Did I convince you to dive in? Maybe it's all a little overwhelming? If you want a place to start, here's a suggestion. Download [Cursor](https://cursor.sh). Switch into Agent mode in the menu at the bottom of the chat. 

Now think of the next task on your to-do list that involves creating any kind of output. Type in the prompt: "I want to make a ___. How should we start?" 

And see what happens :) 
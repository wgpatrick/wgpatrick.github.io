/**
 * Blog Annotations
 * This file handles loading post-specific annotation data based on the post URL
 */

// Store annotations data for each blog post
const blogAnnotations = {
  // First post's annotations
  'first-blog-post': {
    'synthetic-biology': {
      title: 'Synthetic Biology',
      body: `<p>Synthetic biology is an interdisciplinary field that combines biology, engineering, genetics, and computational design to create new biological parts, devices, and systems or redesign existing ones in nature.</p>
             <p>Key applications include:</p>
             <ul>
               <li>Biofuels and sustainable materials</li>
               <li>Medical treatments and diagnostics</li>
               <li>Agricultural innovations</li>
               <li>Environmental solutions</li>
             </ul>`
    },
    'bioreactor': {
      title: 'Bioreactors',
      body: `<p>A bioreactor is a vessel designed to provide a controlled environment for biological processes. They're used to grow cells, tissues, microorganisms, or in the production of pharmaceuticals, chemicals, and other biological products.</p>
             <p>Modern bioreactors are equipped with sensors and control systems that monitor and regulate conditions such as temperature, pH, oxygen levels, and nutrient availability to optimize growth and productivity.</p>`
    }
    // Add more terms as needed
  },
  
  // Market of One blog post annotations
  'software-with-a-market-of-one': {
    'market-of-one': {
      title: 'Market of One',
      body: `<p>I first heard the term "product with a market of one" from my friend Che-Wei Wang at MIT Media Lab orientation.</p>`
    },
    'pub1': {
      title: 'Publication Note',
      body: `<p>This is an example annotation to demonstrate how footnotes and additional information can be added to blog posts.</p>
             <p>Annotations can provide context, citations, or additional thoughts without disrupting the flow of the main text.</p>`
    },
    'useful-annotations': {
      title: 'Useful Annotations',
      body: `<p>This is a SUPER DUPER useful annotation.</p>`
    }
  },
  
  // Vibe Code Everything blog post annotations
  'vibe-everything': {
    'vibe-coding': {
      title: 'Vibe Coding',
      body: `<p>Made famous by Andrej Karpathy in this viral tweet: <a href="https://x.com/karpathy/status/1886192184808149383" target="_blank">@karpathy</a></p>`
    },
    'cursor': {
      title: 'Cursor',
      body: `<p>Cursor is one of the hot, leading apps for code generation. I've mainly used Cursor and Claude code for my recent vibe everything explorations.</p>`
    },
    'replicate': {
      title: 'Replicate',
      body: `<p>A platform that lets you run machine learning models with a cloud API. It provides access to a wide variety of AI models for tasks like image generation, audio processing, and text analysis without requiring specialized hardware or deep ML expertise.</p>`
    },
    'ide': {
      title: 'IDE',
      body: `<p>Integrated Development Environment - a software application that provides comprehensive facilities for software development. Modern AI-powered IDEs like Cursor combine code editing, debugging, and AI assistance in a single interface.</p>`
    },
    'company-repo': {
      title: '514 Company Repo',
      body: `<div><img src="/assets/images/blog/company-repo.png" alt="514's company repository" style="width: 100%; max-width: 600px; border-radius: 8px; margin-bottom: 12px;"><p>514's company repo in Cursor. The entire business operates out of a single GitHub repository, with all company documents stored as markdown files. This enables version control for all company assets and makes everything programmatically accessible.</p></div>`
    },
    'agentic-tool-use': {
      title: 'Agentic Tool Use',
      body: `<p>The ability of AI systems to autonomously use external tools and APIs to accomplish tasks. This includes capabilities like searching the web, running code, accessing databases, or calling other AI services to complete complex workflows.</p>`
    },
    'model-context-protocol': {
      title: 'Model Context Protocol (MCP)',
      body: `<p>A standardized way for AI models to interact with various tools and services. MCP provides a consistent interface for models to request information or perform actions across different platforms and applications.</p>`
    },
    'crm': {
      title: 'CRM',
      body: `<p>Customer Relationship Management - a system for managing interactions with current and potential customers. CRM software helps businesses organize customer data, track sales activities, and improve customer service.</p>`
    },
    'sqlite': {
      title: 'SQLite',
      body: `<p>A lightweight, file-based relational database that requires minimal setup and administration. SQLite is often used for local/embedded applications where a full client-server database would be unnecessary.</p>`
    },
    'gpt4o-image-generation': {
      title: 'GPT-4o Image Generation',
      body: `<p>The image generation capability in GPT-4o, an OpenAI multimodal model that can process and generate both text and images. </p>`
    },
    'hris': {
      title: 'HRIS',
      body: `<p>Human Resource Information System - software that manages HR functions like employee data, payroll, benefits administration, and compliance with employment laws and regulations.</p>`
    }
  }
  // You can add more posts by adding their URL slugs as keys
};

/**
 * Load annotations specific to the current blog post
 */
function loadBlogAnnotations() {
  // Get the post slug from URL path
  const pathParts = window.location.pathname.split('/');
  
  // Try different methods to get the slug, depending on the URL structure
  let postSlug = null;
  
  // For URL structure like /YYYY/MM/DD/post-slug/
  if (pathParts.length >= 5) {
    postSlug = pathParts[pathParts.length - 2];
  }
  
  // For URL structure like /category/YYYY/MM/DD/post-slug.html
  if (!postSlug && pathParts.length >= 2) {
    const lastPath = pathParts[pathParts.length - 1];
    if (lastPath.endsWith('.html')) {
      postSlug = lastPath.replace('.html', '');
    }
  }
  
  console.log('Identified post slug:', postSlug);
  
  // If we have annotations for this post, set them as the current itemData
  if (postSlug && blogAnnotations[postSlug]) {
    console.log('Found annotations for:', postSlug);
    window.itemData = blogAnnotations[postSlug];
    return true;
  }
  
  // Try with just the post name from URL (fallback)
  for (const slug in blogAnnotations) {
    if (window.location.pathname.includes(slug)) {
      console.log('Found annotations via URL inclusion:', slug);
      window.itemData = blogAnnotations[slug];
      return true;
    }
  }
  
  console.warn('No annotations found for this post. URL path:', window.location.pathname);
  return false;
}

// When the document is ready, set up blog annotations
document.addEventListener('DOMContentLoaded', function() {
  if (document.body.classList.contains('blog-post-page')) {
    const annotationsLoaded = loadBlogAnnotations();
    if (annotationsLoaded) {
      // Initialize annotations after a slight delay to ensure DOM is ready
      setTimeout(() => {
        // Check for the new Annotations module first
        if (typeof Annotations !== 'undefined' && typeof Annotations.setupHandlers === 'function') {
          console.log('Setting up blog annotations with new Annotations module');
          // No need to call setupHandlers here as it will be handled by the wrapper
        } else if (typeof setupAnnotations === 'function') {
          // Fallback to legacy method if available
          console.log('Using legacy setupAnnotations function');
          setupAnnotations();
        } else {
          console.error('No annotation setup function found');
        }
      }, 100);
    }
  }
}); 
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
        if (typeof setupAnnotations === 'function') {
          setupAnnotations();
        } else {
          console.error('setupAnnotations function not found. Make sure annotations.js is loaded first.');
        }
      }, 100);
    }
  }
}); 
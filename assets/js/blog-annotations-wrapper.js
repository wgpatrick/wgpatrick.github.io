/**
 * Blog Annotations Wrapper
 * 
 * This script loads blog post annotation data into the central Annotations module.
 * It's a wrapper around the legacy blog-annotations.js to transition to the new system.
 */

// Wait for the Annotations module to be loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof Annotations === 'undefined') {
    console.error('Blog Annotations Wrapper: Annotations module not found!');
    return;
  }
  
  // Only run on blog post pages
  if (!document.body.classList.contains('blog-post-page')) {
    return;
  }
  
  console.log('Blog Annotations Wrapper: Detected blog post page');
  
  // Function to detect the current blog post slug - using the same approach as in blog-annotations.js
  function getBlogPostSlug() {
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
    
    console.log('Blog Annotations Wrapper: Identified post slug:', postSlug);
    
    // Try with just the post name from URL (fallback)
    if (!postSlug) {
      for (const part of pathParts) {
        if (part && part.length > 5 && !/^\d+$/.test(part)) {
          postSlug = part;
          console.log('Blog Annotations Wrapper: Using fallback slug:', postSlug);
          break;
        }
      }
    }
    
    return postSlug;
  }
  
  // Function to check if blogAnnotations is available and load it
  function checkAndLoadData() {
    if (typeof blogAnnotations !== 'undefined') {
      console.log('Blog Annotations Wrapper: Found blogAnnotations data');
      
      let slug = getBlogPostSlug();
      let foundData = false;
      
      // First try with the exact slug
      if (slug && blogAnnotations[slug]) {
        console.log(`Blog Annotations Wrapper: Loading data for slug: ${slug}`);
        Annotations.setData('blog', {
          slug: slug,
          entries: blogAnnotations[slug]
        });
        // Force reinitialization to ensure everything is properly set up
        if (typeof Annotations.setupHandlers === 'function') {
          setTimeout(() => Annotations.setupHandlers(), 50);
        }
        foundData = true;
      } 
      // If not found, try with URL inclusion (like the original script does)
      else {
        const currentPath = window.location.pathname;
        for (const possibleSlug in blogAnnotations) {
          if (currentPath.includes(possibleSlug)) {
            console.log(`Blog Annotations Wrapper: Found slug via URL inclusion: ${possibleSlug}`);
            Annotations.setData('blog', {
              slug: possibleSlug,
              entries: blogAnnotations[possibleSlug]
            });
            // Force reinitialization to ensure everything is properly set up
            if (typeof Annotations.setupHandlers === 'function') {
              setTimeout(() => Annotations.setupHandlers(), 50);
            }
            foundData = true;
            break;
          }
        }
      }
      
      if (!foundData) {
        console.warn(`Blog Annotations Wrapper: No data found for page: ${window.location.pathname}`);
      }
    } else {
      console.log('Blog Annotations Wrapper: blogAnnotations not yet available, will retry');
      setTimeout(checkAndLoadData, 100);
    }
  }
  
  // Start checking for data
  checkAndLoadData();
});
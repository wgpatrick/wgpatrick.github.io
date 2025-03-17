/**
 * CV Page Interactions
 * Handles all interactive elements on the CV page including:
 * - Term annotations with popup descriptions
 * - Citation count fetching for publications
 * - Modal positioning and behavior
 */

// Initialize the itemData variable to avoid undefined errors
window.itemData = window.itemData || {};

// Citation fetching functions
async function fetchCitationCount(doi) {
  // Check cache first
  const cache = localStorage.getItem(`citation_${doi}`);
  const cacheTime = localStorage.getItem(`citation_${doi}_time`);
  
  // Use cache if it's less than 24 hours old
  if (cache && cacheTime && (Date.now() - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
    return parseInt(cache);
  }
  
  try {
    // Fetch from Crossref API
    const response = await fetch(`https://api.crossref.org/works/${doi}`, {
      headers: {
        'User-Agent': 'WillPatrickCV/1.0 (https://wgpatrick.github.io; mailto:wgpatrick@gmail.com)'
      }
    });
    const data = await response.json();
    
    // Get citation count
    const citations = data.message['is-referenced-by-count'] || 0;
    
    // Update cache
    localStorage.setItem(`citation_${doi}`, citations.toString());
    localStorage.setItem(`citation_${doi}_time`, Date.now().toString());
    
    return citations;
  } catch (error) {
    console.error('Error fetching citation count:', error);
    return null;
  }
}

async function updateCitationCounts() {
  // Get all publication annotations
  document.querySelectorAll('.annotated-term[data-id^="pub"]').forEach(async (pub) => {
    const id = pub.dataset.id;
    if (!window.itemData[id] || !window.itemData[id].doi) return;
    
    const citations = await fetchCitationCount(window.itemData[id].doi);
    if (citations !== null) {
      // Get the modal summary div for this publication
      const summaryText = window.itemData[id].summary;
      
      // Insert citation count after the download link
      const updatedSummary = summaryText.replace('</a><br><br>', `</a><br>Cited ${citations} times (from Crossref)<br><br>`);
      
      // Update the summary in itemData
      window.itemData[id].summary = updatedSummary;
    }
  });
}

// Function to set up annotations (can be called from blog or CV pages)
function setupAnnotations() {
  console.log('Setting up annotations...');
  console.log('Current itemData:', window.itemData);
  
  // Elements
  const annotationPanel = document.querySelector('.annotation-panel');
  const annotationTitle = document.querySelector('.annotation-title');
  const annotationBody = document.querySelector('.annotation-body');
  const closeButton = document.querySelector('.close-button');
  let currentOpenItem = null;
  
  if (!annotationPanel || !annotationTitle || !annotationBody) {
    console.error('Annotation panel elements not found');
    return;
  }
  
  // Click event for annotated terms
  document.querySelectorAll('.annotated-term').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the item ID
      const id = this.dataset.id;
      
      // Check if we have data for this item
      if (!window.itemData || !window.itemData[id]) {
        console.error(`No data found for item with ID: ${id}`);
        return;
      }
      
      // Set the current open item
      currentOpenItem = this;
      
      // Update annotation content
      annotationTitle.innerText = window.itemData[id].title || 'Details';
      
      // Use body for blog posts or summary for CV items
      if (window.itemData[id].body) {
        annotationBody.innerHTML = window.itemData[id].body;
      } else {
        annotationBody.innerHTML = window.itemData[id].summary || 'No details available.';
      }
      
      // Position and show annotation panel
      positionAnnotation(this);
      
      // Show the annotation panel
      annotationPanel.style.display = 'block';
      annotationPanel.classList.add('visible');
      
      // Prevent event from bubbling up
      e.stopPropagation();
    });
  });
  
  // Position the annotation panel relative to the clicked term
  function positionAnnotation(element) {
    if (!annotationPanel) return;
    
    // Get the element's bounding rectangle
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if we're on a blog post page
    if (document.body.classList.contains('blog-post-page')) {
      // Calculate the modal width and height
      const panelWidth = annotationPanel.offsetWidth;
      const panelHeight = annotationPanel.offsetHeight;
      
      // Get the width of the content container
      const contentContainer = document.querySelector('.post') || document.querySelector('.wrapper');
      const contentWidth = contentContainer ? contentContainer.getBoundingClientRect().width : 800;
      const contentRight = contentContainer ? contentContainer.getBoundingClientRect().right : 800;
      const viewportWidth = window.innerWidth;
      
      // Position in right margin (aligned with right edge of content container)
      let top = rect.top + scrollTop - 20; // Slightly above the element
      let left = contentRight + 20; // 20px to the right of content area
      
      // Ensure the annotation doesn't go off the right side of the screen
      if (left + panelWidth > viewportWidth - 20) {
        left = Math.max(viewportWidth - panelWidth - 20, contentRight - panelWidth);
      }
      
      // Make sure panel is within viewport vertically
      if (top + panelHeight > scrollTop + window.innerHeight - 20) {
        // If it would go off the bottom of the screen, align bottom of panel with bottom of viewport
        top = scrollTop + window.innerHeight - panelHeight - 20;
      }
      
      // Make sure it's not above the top of the viewport
      if (top < scrollTop + 20) {
        top = scrollTop + 20;
      }
      
      // For mobile (narrow screens), position below the element
      if (viewportWidth < 960) {
        top = rect.bottom + scrollTop + 10;
        left = Math.max(20, Math.min(rect.left, viewportWidth - panelWidth - 20));
      }
      
      // Apply position
      annotationPanel.style.top = top + 'px';
      annotationPanel.style.left = left + 'px';
      console.log('Blog post annotation positioned at:', left, top);
      return;
    }
    
    // For CV and other pages, use the regular positioning logic
    // Calculate panel position
    const panelWidth = annotationPanel.offsetWidth;
    const viewportWidth = window.innerWidth;
    
    // Default position to the right of the element
    let top = rect.top + scrollTop - 10;
    let left = rect.right + 20;
    
    // If it would go off the right side of the screen, position it to the left
    if (left + panelWidth > viewportWidth - 20) {
      left = Math.max(20, rect.left - panelWidth - 20);
    }
    
    // If it still doesn't fit, position it below
    if (left + panelWidth > viewportWidth - 20 || left < 20) {
      top = rect.bottom + scrollTop + 10;
      left = Math.max(20, Math.min(rect.left, viewportWidth - panelWidth - 20));
    }
    
    // Apply position
    annotationPanel.style.top = top + 'px';
    annotationPanel.style.left = left + 'px';
  }
  
  // Close annotation when clicking the close button
  if (closeButton) {
    closeButton.addEventListener('click', function() {
      closeAnnotation();
    });
  }
  
  // Close annotation when clicking outside
  document.addEventListener('click', function(e) {
    if (annotationPanel.style.display === 'block' && 
        !annotationPanel.contains(e.target) && 
        !e.target.classList.contains('annotated-term')) {
      closeAnnotation();
    }
  });
  
  // Close annotation with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && annotationPanel.style.display === 'block') {
      closeAnnotation();
    }
  });
  
  // Function to close the annotation panel
  function closeAnnotation() {
    annotationPanel.classList.remove('visible');
    
    // Hide after transition ends
    setTimeout(() => {
      annotationPanel.style.display = 'none';
      currentOpenItem = null;
    }, 200);
  }
  
  // Update citation counts for CV page
  if (document.body.classList.contains('cv-page')) {
    updateCitationCounts();
  }
}

// Initialize annotations on page load
document.addEventListener('DOMContentLoaded', function() {
  // Will be called explicitly on blog pages from the post.html layout
  // For CV and other pages, initialize here
  if (!document.body.classList.contains('blog-post-page')) {
    setupAnnotations();
  }
}); 
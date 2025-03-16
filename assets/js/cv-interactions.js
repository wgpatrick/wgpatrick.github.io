/**
 * CV Page Interactions
 * Handles all interactive elements on the CV page including:
 * - Term annotations with popup descriptions
 * - Citation count fetching for publications
 * - Modal positioning and behavior
 */

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
    const data = itemData[id];
    if (!data || !data.doi) return;
    
    const citations = await fetchCitationCount(data.doi);
    if (citations !== null) {
      // Get the modal summary div for this publication
      const summaryText = data.summary;
      
      // Insert citation count after the download link
      const updatedSummary = summaryText.replace('</a><br><br>', `</a><br>Cited ${citations} times (from Crossref)<br><br>`);
      
      // Update the summary in itemData
      itemData[id].summary = updatedSummary;
    }
  });
}

// Setup annotation interactions
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const modal = document.getElementById('annotation-modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalSummary = document.querySelector('.modal-summary');
  const closeBtn = document.querySelector('.close-btn');
  let currentOpenItem = null;
  
  // Click event for annotated terms
  document.querySelectorAll('.annotated-term').forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the item ID
      const id = this.dataset.id;
      
      // Check if we have data for this item
      if (!itemData[id]) {
        console.error(`No data found for item with ID: ${id}`);
        return;
      }
      
      // Set the current open item
      currentOpenItem = this;
      
      // Update modal content
      modalTitle.innerText = itemData[id].title || 'Details';
      modalSummary.innerHTML = itemData[id].summary || 'No details available.';
      
      // Position and show modal
      positionComment(this);
      
      // Add active class to modal (for CSS transitions)
      modal.classList.add('active');
      modal.style.display = 'block';
      modal.style.opacity = '1';
      
      // Prevent event from bubbling up
      e.stopPropagation();
    });
  });
  
  // Position the comment modal relative to the clicked term
  function positionComment(element) {
    if (!modal) return;
    
    // Get the element's bounding rectangle
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Calculate the modal width and height
    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
    
    // Get the width of the container (assuming a max-width content container)
    const contentContainer = document.querySelector('.wrapper') || document.querySelector('main');
    const containerRect = contentContainer ? contentContainer.getBoundingClientRect() : {right: window.innerWidth};
    const viewportWidth = window.innerWidth;
    
    // Position in right margin (aligned with right edge of content container)
    let top = rect.top + scrollTop - 20; // Slightly above the element
    let left = Math.min(containerRect.right + 20, viewportWidth - modalWidth - 20); // Right margin
    
    // Make sure modal is within viewport vertically
    if (top + modalHeight > scrollTop + window.innerHeight - 20) {
      // If it would go off the bottom of the screen, align bottom of modal with bottom of viewport
      top = scrollTop + window.innerHeight - modalHeight - 20;
    }
    
    // Make sure it's not above the top of the viewport
    if (top < scrollTop + 20) {
      top = scrollTop + 20;
    }
    
    // For mobile (narrow screens), position below the element instead of in margin
    if (viewportWidth < 768) {
      top = rect.bottom + scrollTop + 10;
      left = Math.max(scrollLeft + 10, Math.min(rect.left + scrollLeft, scrollLeft + viewportWidth - modalWidth - 10));
    }
    
    // Apply the calculated position
    modal.style.top = top + 'px';
    modal.style.left = left + 'px';
    
    console.log('Positioned popup at:', modal.style.left, modal.style.top);
  }
  
  // Close comment
  function closeComment() {
    console.log('Closing comment function called');
    modal.classList.remove('active');
    modal.style.display = 'none'; // Force hide
    modal.style.opacity = '0';
    currentOpenItem = null;
    console.log('Modal should now be closed');
  }
  
  // Close button event
  if (closeBtn) {
    console.log('Close button found and listener attached');
    closeBtn.addEventListener('click', function(e) {
      console.log('Close button clicked');
      e.preventDefault();
      e.stopPropagation();
      // Force modal to close with direct style manipulation
      modal.style.display = 'none';
      modal.classList.remove('active');
      currentOpenItem = null;
      console.log('Modal forcibly closed');
    });
  } else {
    console.error('Close button not found!');
  }
  
  // Escape key to close
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeComment();
    }
  });
  
  // Close comment when scrolling far from original position
  window.addEventListener('scroll', function() {
    // Throttle scroll events to avoid performance issues
    if (!this.scrollTimeout) {
      this.scrollTimeout = setTimeout(() => {
        this.scrollTimeout = null;
        
        console.log('Scroll event processed');
        if (currentOpenItem) {
          const rect = currentOpenItem.getBoundingClientRect();
          
          // Close if the element is off screen
          if (rect.top < -100 || rect.bottom > window.innerHeight + 100) {
            console.log('Closing due to scroll distance');
            // Force modal to close directly
            modal.style.display = 'none';
            modal.classList.remove('active');
            currentOpenItem = null;
          }
        }
      }, 100); // Process scroll events at most every 100ms
    }
  });
  
  // Reposition on window resize
  window.addEventListener('resize', function() {
    if (currentOpenItem) {
      positionComment(currentOpenItem);
    }
  });

  // Update CSS for the close button
  const style = document.createElement('style');
  style.textContent = `
    .close-btn {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      font-size: 24px;
      font-weight: bold;
      cursor: pointer;
      z-index: 1000;
      color: #444;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }
    
    .close-btn:hover {
      color: #000;
    }
    
    @media (max-width: 768px) {
      .close-btn {
        width: 34px;
        height: 34px;
        font-size: 20px;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (modal && modal.classList.contains('active')) {
      // Check if the click is outside the modal and not on an annotated term
      if (!modal.contains(e.target) && 
         (!e.target.classList || !e.target.classList.contains('annotated-term'))) {
        closeComment();
      }
    }
  });
  
  // Update citation counts on page load
  updateCitationCounts();
}); 
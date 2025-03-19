/**
 * Annotations Core Module
 * 
 * A unified system for managing term annotations across the website.
 * 
 * Features:
 * - Consistent annotation panels for both CV and blog pages
 * - Modular architecture with central data management
 * - Automatic citation counting for publications using CrossRef API
 * - Responsive positioning that adapts to different viewport sizes
 * - LocalStorage caching for API responses
 * 
 * Usage:
 * 1. Include this script on any page that needs annotations
 * 2. Mark terms with <span class="annotated-term" data-id="unique-id">term</span>
 * 3. Provide data through Annotations.setData() or through a wrapper script
 * 
 * @author Will Patrick
 * @version 1.0.0
 */

// Define the Annotations module
const Annotations = {
  // Configuration
  config: {
    selectors: {
      term: '.annotated-term',
      panel: '.annotation-panel',
      title: '.annotation-title', 
      body: '.annotation-body',
      close: '.close-button'
    },
    templates: {
      panel: `<div class="annotation-panel">
                <div class="annotation-content">
                  <div class="close-button">&times;</div>
                  <h3 class="annotation-title"></h3>
                  <div class="annotation-body"></div>
                </div>
              </div>`
    },
    citations: {
      enabled: true,              // Enable citation counting for publications
      cacheTime: 24 * 60 * 60,    // Cache time in seconds (24 hours)
      userAgent: 'WillPatrickCV/2.0 (https://wgpatrick.github.io; mailto:wgpatrick@gmail.com)'
    },
    positioning: {
      margin: 20,                 // Margin from content or element
      mobileBreakpoint: 960,      // Width in pixels to switch to mobile layout
      cvMarginOffset: 30          // Extra margin for CV page positioning
    },
    debug: false,                 // Set to true for detailed console logs
    useOriginalSetup: false,      // Set to true to also call the original setupAnnotations function
    autoCreatePanel: true         // Automatically create panel if not found
  },
  
  // Data storage
  data: {
    cv: {},      // CV page annotations
    blog: {},    // Blog post annotations by slug
    current: {}  // Points to the active data source
  },
  
  /**
   * ==========================
   * DATA MANAGEMENT METHODS
   * ==========================
   */
  
  /**
   * Sets annotation data for a specific type (CV or blog)
   * 
   * @param {string} type - The type of data ('cv' or 'blog')
   * @param {object} data - The annotation data to store
   * @param {string} [data.slug] - Required for blog type - the post slug
   * @param {object} [data.entries] - For blog type - the annotation entries
   * @returns {boolean} - True if successful, false otherwise
   */
  setData: function(type, data) {
    this.log(`Setting data for type: ${type} with ${Object.keys(data).length} entries`);
    
    if (type === 'cv') {
      // Store CV data directly
      this.data.cv = data;
      
      // If we're on the CV page, set as current
      if (this.pageType === 'cv') {
        this.data.current = this.data.cv;
        this.log('Set as current data source');
      }
      return true;
    } 
    else if (type === 'blog') {
      // For blog, data is keyed by post slug
      const slug = data.slug;
      if (!slug) {
        this.error('Blog data must include a slug property');
        return false;
      }
      
      // Store blog data by slug
      this.data.blog[slug] = data.entries || {};
      this.log(`Stored blog data for slug: ${slug}`);
      
      // If we're on a blog post page with this slug, set as current
      if (this.pageType === 'blog' && this.currentSlug === slug) {
        this.data.current = this.data.blog[slug];
        this.log(`Set blog post "${slug}" as current data source`);
      }
      return true;
    }
    else {
      this.error(`Unknown data type: ${type}`);
      return false;
    }
  },
  
  /**
   * Retrieves annotation data for a specific ID
   * Searches all data sources if not found in current context
   * 
   * @param {string} id - The unique identifier for the annotation
   * @returns {object|null} - The annotation data or null if not found
   */
  getData: function(id) {
    this.log(`Looking for annotation with ID: ${id}`);
    this.log(`Current page type: ${this.pageType}`);
    this.log(`Current data keys: ${Object.keys(this.data.current || {}).join(', ')}`);
    
    // First check current data source
    if (this.data.current && this.data.current[id]) {
      this.log(`Found entry "${id}" in current data`);
      return this.data.current[id];
    }
    
    // If not found in current, try all sources (for cross-references)
    if (this.data.cv[id]) {
      this.log(`Found entry "${id}" in CV data`);
      return this.data.cv[id];
    }
    
    // For blog, we need to check all slugs
    this.log(`Blog data slugs: ${Object.keys(this.data.blog || {}).join(', ')}`);
    for (const slug in this.data.blog) {
      this.log(`Checking blog slug: ${slug}, keys: ${Object.keys(this.data.blog[slug] || {}).join(', ')}`);
      if (this.data.blog[slug][id]) {
        this.log(`Found entry "${id}" in blog data for ${slug}`);
        return this.data.blog[slug][id];
      }
    }
    
    // One more attempt with window.itemData if it exists (backward compatibility)
    if (typeof window.itemData !== 'undefined' && window.itemData[id]) {
      this.log(`Found entry "${id}" in legacy window.itemData`);
      return window.itemData[id];
    }
    
    this.error(`No data found for ID: ${id}`);
    return null;
  },
  
  /**
   * Detects the current blog post slug from the URL
   * Handles various URL patterns used in Jekyll sites
   * 
   * @returns {string|null} - The detected slug or null if not on a blog page
   */
  detectCurrentSlug: function() {
    if (this.pageType !== 'blog') return null;
    
    // Parse the URL to get the post slug
    const pathParts = window.location.pathname.split('/');
    let slug = null;
    
    // For URL structure like /YYYY/MM/DD/post-slug/
    if (pathParts.length >= 5) {
      slug = pathParts[pathParts.length - 2];
    }
    
    // For URL structure like /post-slug.html
    if (!slug && pathParts.length >= 2) {
      const lastPath = pathParts[pathParts.length - 1];
      if (lastPath.endsWith('.html')) {
        slug = lastPath.replace('.html', '');
      }
    }
    
    // Last resort: try to find a matching path component
    if (!slug) {
      for (const part of pathParts) {
        if (part && part !== '' && !/^\d+$/.test(part)) {
          slug = part;
          break;
        }
      }
    }
    
    this.log(`Detected blog post slug: ${slug}`);
    this.currentSlug = slug;
    return slug;
  },
  
  // Logging system
  log: function(message) {
    if (this.config.debug) {
      console.log('Annotations:', message);
    }
  },
  
  error: function(message) {
    console.error('Annotations Error:', message);
  },
  
  /**
   * ==========================
   * CORE FUNCTIONS
   * ==========================
   */

  /**
   * Initializes the Annotations module
   * - Detects page type (CV or blog)
   * - Loads data from appropriate sources
   * - Sets up event handlers for annotations
   */
  init: function() {
    this.log('Module initializing');
    
    // Debug the DOM structure to help diagnose layout issues
    this.debugPageStructure();
    
    // Detect if we're on a supported page type
    if (document.body.classList.contains('cv-page')) {
      this.log('Detected CV page');
      this.pageType = 'cv';
      
      // For CV page, immediately make CV data the current source
      this.data.current = this.data.cv;
    } else if (document.body.classList.contains('blog-post-page')) {
      this.log('Detected blog post page');
      this.pageType = 'blog';
      
      // For blog, detect the current slug and set current data
      this.detectCurrentSlug();
      if (this.currentSlug && this.data.blog[this.currentSlug]) {
        this.data.current = this.data.blog[this.currentSlug];
      }
    } else {
      this.log('Unknown page type, but continuing initialization');
      this.pageType = 'unknown';
    }
    
    // Load data from existing global sources (temporary)
    this.loadLegacyData();
    
    // Initialize our own setupHandlers
    this.setupHandlers();
    
    // For backward compatibility, still call the original function if it exists
    if (typeof setupAnnotations === 'function' && this.config.useOriginalSetup) {
      this.log('For compatibility, still calling original setupAnnotations');
      setupAnnotations();
    }
    
    this.log('Module initialization complete');
  },
  
  // Debug page structure to help diagnose layout issues
  debugPageStructure: function() {
    // Only log basic information in debug mode
    if (this.config.debug) {
      console.log('Annotations: Page type:', this.pageType);
      console.log('Annotations: Body classes:', document.body.className);
      console.log('Annotations: Page URL:', window.location.pathname);
      
      // Check existing annotations
      const terms = document.querySelectorAll('.annotated-term');
      console.log(`Annotations: Found ${terms.length} annotated terms`);
    }
  },
  
  /**
   * Loads data from legacy global variables for backward compatibility
   * This is a temporary function to support transition to the new system
   */
  loadLegacyData: function() {
    // Try both window.itemData and itemData (var without window prefix)
    const legacyData = (typeof window.itemData !== 'undefined') ? window.itemData : 
                       (typeof itemData !== 'undefined') ? itemData : null;
    
    if (legacyData) {
      this.log('Found legacy itemData with keys: ' + Object.keys(legacyData).join(', '));
      
      if (this.pageType === 'cv') {
        // For CV page, import all itemData
        this.setData('cv', legacyData);
        this.log('Imported legacy data to CV context');
      }
      else if (this.pageType === 'blog') {
        // For blog, we need to determine the slug
        const slug = this.currentSlug || 'current-blog-post';
        
        // Structure the data properly
        this.setData('blog', {
          slug: slug,
          entries: legacyData
        });
        this.log('Imported legacy data to blog context with slug: ' + slug);
      }
      else {
        // For unknown page types, still import as fallback
        this.data.current = legacyData;
        this.log('Imported legacy data to current context for unknown page type');
      }
    } else {
      this.log('No legacy itemData found');
    }
  },
  
  /**
   * Sets up event handlers for annotations
   * - Attaches click events to annotated terms
   * - Sets up panel close handlers
   * - Updates citation counts if applicable
   */
  setupHandlers: function() {
    this.log('Setting up annotation handlers');
    
    // Ensure annotation panel exists
    this.ensurePanelExists();
    
    // Get references to DOM elements (after potentially creating the panel)
    const annotationPanel = document.querySelector(this.config.selectors.panel);
    const annotationTitle = document.querySelector(this.config.selectors.title);
    const annotationBody = document.querySelector(this.config.selectors.body);
    const closeButton = document.querySelector(this.config.selectors.close);
    
    // Store references for later use
    this.elements = {
      panel: annotationPanel,
      title: annotationTitle,
      body: annotationBody,
      closeButton: closeButton,
      currentOpenItem: null
    };
    
    // Check if all required elements exist
    if (!annotationPanel || !annotationTitle || !annotationBody) {
      this.error('Annotation panel elements not found or creation failed');
      return;
    }
    
    this.log('Found all required annotation elements');
    
    // If we're on the CV page and citations are enabled, update citation counts
    if (this.pageType === 'cv' && this.config.citations.enabled) {
      this.updateCitationCounts();
    }
    
    // Add click handlers to all annotated terms
    const self = this; // Save reference to use in callbacks
    
    document.querySelectorAll(this.config.selectors.term).forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the item ID
        const id = this.dataset.id;
        self.log(`Term clicked with ID: ${id}`);
        
        // Get data for this term using our data management system
        const itemData = self.getData(id);
        if (!itemData) {
          self.error(`No data found for item with ID: ${id}`);
          return;
        }
        
        // Store current open item
        self.elements.currentOpenItem = this;
        
        // Update annotation content
        annotationTitle.innerText = itemData.title || 'Details';
        
        // Use body for blog posts or summary for CV items
        if (itemData.body) {
          annotationBody.innerHTML = itemData.body;
        } else {
          annotationBody.innerHTML = itemData.summary || 'No details available.';
        }
        
        // Position and show annotation panel
        self.positionPanel(this);
        
        // Show the annotation panel
        annotationPanel.style.display = 'block';
        annotationPanel.classList.add('visible');
        
        // Prevent event from bubbling up
        e.stopPropagation();
      });
    });
    
    // Set up the close button
    if (closeButton) {
      closeButton.addEventListener('click', function() {
        self.closePanel();
      });
    }
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (annotationPanel.style.display === 'block' && 
          !annotationPanel.contains(e.target) && 
          !e.target.classList.contains('annotated-term')) {
        self.closePanel();
      }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && annotationPanel.style.display === 'block') {
        self.closePanel();
      }
    });
    
    // Currently we won't handle citation counts in this step
    // We'll add that functionality in a later step
    
    this.log('Annotation handlers setup complete');
  },
  
  // Close the annotation panel
  closePanel: function() {
    const panel = this.elements.panel;
    
    panel.classList.remove('visible');
    
    // Hide after transition ends
    const self = this;
    setTimeout(function() {
      panel.style.display = 'none';
      self.elements.currentOpenItem = null;
    }, 200);
  },
  
  /**
   * Positions the annotation panel relative to the clicked element
   * Uses the blog-style positioning for consistency across all pages
   * 
   * @param {HTMLElement} clickedElement - The element that was clicked
   */
  positionPanel: function(clickedElement) {
    const panel = this.elements.panel;
    if (!panel) return;
    
    // Get the element's bounding rectangle
    const rect = clickedElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Always use the blog-style positioning for right margin
    // This ensures consistency between pages
    this.positionPanelForBlog(clickedElement, rect, scrollTop);
  },
  
  /**
   * Positions the annotation panel in the right margin of the content
   * This is the preferred positioning method for all pages
   * 
   * @param {HTMLElement} clickedElement - The element that was clicked
   * @param {DOMRect} rect - The bounding rectangle of the clicked element
   * @param {number} scrollTop - The current scroll position
   */
  positionPanelForBlog: function(clickedElement, rect, scrollTop) {
    const panel = this.elements.panel;
    
    // Calculate the modal width and height
    const panelWidth = panel.offsetWidth || 350;
    const panelHeight = panel.offsetHeight || 300;
    
    // Force a fixed width for the panel to ensure consistency
    if (panelWidth < 10) {
      panel.style.width = '350px';
    }
    
    // Find the best container to align with - the widest one that has the correct right margin
    const possibleContainers = [
      '.wrapper',
      '.page-content',
      '.post',
      'main',
      'article',
      '.site-content'
    ];
    
    // Find the main content container to position against
    let contentContainer = null;
    let contentRight = 0;
    
    // Different selectors for CV page vs Blog
    const pageSelectors = this.pageType === 'cv' 
      ? ['.wrapper', '.page-content', 'main', 'article', '.site-content', '.cv-nav-wrapper']
      : possibleContainers;
    
    for (const selector of pageSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        const containerRect = container.getBoundingClientRect();
        if (containerRect.right > contentRight) {
          contentContainer = container;
          contentRight = containerRect.right;
          this.log(`Using container: ${selector} with right edge at: ${contentRight}`);
        }
      }
    }
    
    // If no container found, use a reasonable default
    if (!contentContainer) {
      contentRight = Math.max(800, window.innerWidth * 0.7);
    }
    
    const viewportWidth = window.innerWidth;
    const margin = this.config.positioning.margin || 20;
    
    // Add extra margin for CV page
    const extraMargin = this.pageType === 'cv' ? (this.config.positioning.cvMarginOffset || 30) : 0;
    
    // Position in right margin (aligned with right edge of content container)
    let top = rect.top + scrollTop - margin; // Slightly above the element
    let left = contentRight + margin + extraMargin; // margin to the right of content area
    
    this.log(`Positioning panel at: ${left},${top} with margin: ${margin}+${extraMargin}`);
    
    // Ensure the annotation doesn't go off the right side of the screen
    if (left + panelWidth > viewportWidth - margin) {
      left = Math.max(margin, viewportWidth - panelWidth - margin);
    }
    
    // Make sure panel is within viewport vertically
    if (top + panelHeight > scrollTop + window.innerHeight - margin) {
      // If it would go off the bottom of the screen, align bottom of panel with bottom of viewport
      top = scrollTop + window.innerHeight - panelHeight - margin;
    }
    
    // Make sure it's not above the top of the viewport
    if (top < scrollTop + margin) {
      top = scrollTop + margin;
    }
    
    // For mobile (narrow screens), position below the element
    if (viewportWidth < this.config.positioning.mobileBreakpoint) {
      top = rect.bottom + scrollTop + 10;
      left = Math.max(margin, Math.min(rect.left, viewportWidth - panelWidth - margin));
    }
    
    // Apply position
    panel.style.top = top + 'px';
    panel.style.left = left + 'px';
    
    this.log(`Panel positioned at: ${left}px, ${top}px`);
  },
  
  /**
   * Legacy positioning method - no longer used
   * Kept for reference and backward compatibility
   * 
   * @deprecated Use positionPanelForBlog instead
   */
  positionPanelDefault: function(clickedElement, rect, scrollTop) {
    // This method is kept for backward compatibility
    // All positioning now uses positionPanelForBlog for consistency
    this.positionPanelForBlog(clickedElement, rect, scrollTop);
  },
  
  /**
   * ==========================
   * PANEL STYLING
   * ==========================
   */
  
  /**
   * Applies consistent styling to the annotation panel
   * Ensures panels look the same across different pages
   * 
   * @param {HTMLElement} panel - The panel element to style
   */
  applyPanelStyles: function(panel) {
    if (!panel) return;
    
    // Set a consistent width - we like the blog post style better
    panel.style.maxWidth = '400px';
    panel.style.width = '90%';
    panel.style.maxHeight = '80vh';
    panel.style.overflowY = 'auto';
    panel.style.backgroundColor = 'white';
    panel.style.borderRadius = '8px';
    panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    panel.style.padding = '20px';
    panel.style.position = 'absolute';
    panel.style.zIndex = '1000';
    
    // Style the title (h3)
    const title = panel.querySelector(this.config.selectors.title);
    if (title) {
      title.style.fontSize = '18px';
      title.style.fontWeight = '600';
      title.style.marginTop = '0';
      title.style.marginBottom = '15px';
      title.style.paddingRight = '30px';
      title.style.fontFamily = 'inherit';
    }
    
    // Style the body
    const body = panel.querySelector(this.config.selectors.body);
    if (body) {
      body.style.fontSize = '14px';
      body.style.lineHeight = '1.6';
      body.style.color = '#333';
    }
    
    this.log('Applied consistent panel styles');
  },
  
  /**
   * Ensures the annotation panel exists in the DOM
   * Creates it if it doesn't exist using the template
   * 
   * @returns {boolean} - True if panel exists or was created, false otherwise
   */
  ensurePanelExists: function() {
    let panel = document.querySelector(this.config.selectors.panel);
    
    // If panel exists, apply styling
    if (panel) {
      this.log('Existing annotation panel found');
      
      // Check if all required child elements exist
      const title = panel.querySelector(this.config.selectors.title);
      const body = panel.querySelector(this.config.selectors.body);
      const closeBtn = panel.querySelector(this.config.selectors.close);
      
      if (!title || !body || !closeBtn) {
        this.error('Panel is missing required elements');
      }
      
      // Apply consistent styling to the panel
      this.applyPanelStyles(panel);
    }
    
    // If panel doesn't exist and auto-creation is enabled, create it
    if (!panel && this.config.autoCreatePanel) {
      this.log('Annotation panel not found, creating it');
      
      // Create panel from template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.config.templates.panel.trim();
      panel = tempDiv.firstChild;
      
      // Apply styling to the new panel
      this.applyPanelStyles(panel);
      
      // Add to document body
      document.body.appendChild(panel);
      
      this.log('Annotation panel created');
      return true;
    }
    
    return !!panel;
  },
  
  /**
   * ==========================
   * CITATION FUNCTIONS
   * ==========================
   */
  
  /**
   * Updates citation counts for all publications in the data
   * Fetches citation data from CrossRef API and updates the summaries
   */
  updateCitationCounts: function() {
    this.log('Updating citation counts for publications');
    
    // Find all publication entries in our data
    const publications = [];
    
    // Helper to collect publications with DOIs
    const collectPublications = (source) => {
      for (const id in source) {
        if (id.startsWith('pub') && source[id].doi) {
          publications.push({
            id: id,
            doi: source[id].doi,
            data: source[id]
          });
        }
      }
    };
    
    // Collect from all data sources
    collectPublications(this.data.cv);
    for (const slug in this.data.blog) {
      collectPublications(this.data.blog[slug]);
    }
    
    this.log(`Found ${publications.length} publications with DOIs`);
    
    // Fetch citation counts for each publication
    publications.forEach(publication => {
      this.fetchCitationCount(publication.doi)
        .then(count => {
          if (count !== null) {
            this.log(`Updated citation count for ${publication.id}: ${count}`);
            
            // Update the summary text in our data
            const summaryText = publication.data.summary;
            if (summaryText) {
              // Insert citation count after the download link
              const updatedSummary = summaryText.replace(
                '</a><br><br>', 
                `</a><br>Cited ${count} times (from Crossref)<br><br>`
              );
              
              // Update in our data
              publication.data.summary = updatedSummary;
              
              // Also update in the original global itemData if it exists (for backward compatibility)
              if (typeof itemData !== 'undefined' && itemData[publication.id]) {
                itemData[publication.id].summary = updatedSummary;
              }
            }
          }
        })
        .catch(error => {
          this.error(`Error fetching citation count for ${publication.doi}: ${error.message}`);
        });
    });
  },
  
  /**
   * Fetches citation count for a DOI from CrossRef API
   * Uses localStorage to cache results for specified time
   * 
   * @param {string} doi - The DOI to fetch citation count for
   * @returns {Promise<number|null>} - The citation count or null if error
   */
  fetchCitationCount: async function(doi) {
    this.log(`Fetching citation count for DOI: ${doi}`);
    
    // Check cache first
    const cacheKey = `citation_${doi}`;
    const cacheTsKey = `${cacheKey}_time`;
    const cache = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTsKey);
    
    // Use cache if it's less than configured cache time
    if (cache && cacheTime) {
      const age = (Date.now() - parseInt(cacheTime)) / 1000;
      if (age < this.config.citations.cacheTime) {
        this.log(`Using cached citation count for ${doi}: ${cache} (${Math.round(age / 60)} minutes old)`);
        return parseInt(cache);
      }
    }
    
    try {
      // Fetch from Crossref API
      const response = await fetch(`https://api.crossref.org/works/${doi}`, {
        headers: {
          'User-Agent': this.config.citations.userAgent
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching citation data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Get citation count
      const citations = data.message['is-referenced-by-count'] || 0;
      
      // Update cache
      localStorage.setItem(cacheKey, citations.toString());
      localStorage.setItem(cacheTsKey, Date.now().toString());
      
      this.log(`Retrieved citation count for ${doi}: ${citations}`);
      return citations;
    } catch (error) {
      this.error(`Error fetching citation count: ${error}`);
      return null;
    }
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  Annotations.log('DOM ready, initializing Annotations module');
  Annotations.init();
});
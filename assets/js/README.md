# Annotations System

This directory contains the JavaScript files that implement the annotations system used throughout the website.

## Overview

The annotations system allows text terms to be marked up with additional information that appears in a popup panel when clicked. It's used on both the CV page (for skills, companies, etc.) and blog posts (for technical terms, references, etc.).

## Architecture

The system follows a modular architecture with the following components:

### Core Module (`annotations-core.js`)

The main module that provides:
- Data management (storing and retrieving annotation data)
- Panel creation and styling
- Event handling for clicks
- Panel positioning
- Citation counting for publications

### Data Files

- `cv-annotations.js`: Contains data for CV page annotations (legacy format)
- `blog-annotations.js`: Contains functionality for blog post annotations

### Wrapper Files (Bridge Between Old and New Systems)

- `cv-annotations-wrapper.js`: Connects CV page data with the new core system
- `blog-annotations-wrapper.js`: Connects blog post data with the new core system

## How It Works

1. When a page loads, the core module detects if it's a CV or blog page
2. Data is loaded from the appropriate sources
3. Click handlers are attached to annotated terms
4. When a term is clicked, its data is retrieved and displayed in a panel
5. For CV pages, publication citations are automatically fetched and updated

## How to Use

### Adding Annotations to Terms

```html
<span class="annotated-term" data-id="unique-id">Term to annotate</span>
```

### Creating Annotation Data for CV Page

```javascript
// In cv-annotations.js
var itemData = {
  "unique-id": {
    title: "Title of Annotation",
    summary: "Detailed explanation that appears in the panel"
  },
  // More annotations...
};
```

### Creating Annotation Data for Blog Posts

```javascript
// In a blog's annotation data file
Annotations.setData('blog', {
  slug: 'post-slug',
  entries: {
    "unique-id": {
      title: "Title of Annotation",
      body: "Detailed explanation for this blog post term"
    }
  }
});
```

## Publication Citations

For items with IDs starting with "pub" and containing a DOI field, the system automatically:
1. Fetches citation counts from CrossRef API
2. Caches the results in localStorage (24-hour expiry)
3. Updates the summary text with citation counts

## Panel Positioning

Annotations appear in the right margin of content by default, with fallbacks for:
- Small screens (panels appear below the term)
- Terms near the bottom of the screen (panels shift upward)
- Terms near the right edge of the screen (panels shift leftward)

## Styling

Annotation styling is defined in `/assets/css/annotations.css` and includes:
- Underlined terms with dashed borders
- Popup panels with consistent styling
- Animations for panel appearance/disappearance
- Responsive adjustments for mobile devices

## Dependencies

The annotation system is standalone and does not require any external libraries.
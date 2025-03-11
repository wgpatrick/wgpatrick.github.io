document.addEventListener('DOMContentLoaded', function() {
  // Only add PDF button on the CV page
  if (window.location.pathname.includes('/cv')) {
    const cvNav = document.querySelector('.cv-nav');
    
    if (cvNav) {
      // Create the PDF download button
      const pdfButton = document.createElement('a');
      pdfButton.href = '#';
      pdfButton.className = 'nav-link pdf-button';
      pdfButton.textContent = 'Download PDF';
      pdfButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
      });
      
      // Add to CV navigation
      cvNav.appendChild(pdfButton);
    }
  }
}); 
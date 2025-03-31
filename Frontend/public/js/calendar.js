document.addEventListener("DOMContentLoaded", function () {
  const calendlyWidget = document.querySelector(".calendly-inline-widget");

  // Function to load Calendly widget
  window.loadCalendly = function (url) {
    calendlyWidget.innerHTML = ''; // Clear any existing widget content

    // Create the iframe on the screen and set its attributes
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '700px';
    iframe.style.border = 'none';
    calendlyWidget.appendChild(iframe);

    // Reapply styles after iframe is loaded
    iframe.onload = function () {
      applyCustomStyles(); // Ensure styles are reapplied
     
    };
  };

  // Function to apply custom styles to the widget container
  function applyCustomStyles() {
    const buttons = document.querySelectorAll('.events-container .event-button');
    buttons.forEach((button) => {

      // Add click event listener to toggle active class for when service button is clicked
      // For it to turn red
      button.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active')); // Remove active class from all buttons
        button.classList.add('active'); // Add active class to clicked button
      });
    });
  }

});




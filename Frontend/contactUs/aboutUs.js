document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
  
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault(); // Prevent form from submitting
        form.reportValidity(); // Show built-in validation messages
      } else {
        // Optional: Show confirmation or handle form submission
        alert("Form submitted successfully!");
      }
    });
  });
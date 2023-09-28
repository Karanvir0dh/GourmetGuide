// IIFE for encapsulation and avoiding global scope conflicts.
(function () {
  "use strict";  // Use strict mode for better error handling.

  // Get all forms with validation.
  const forms = document.querySelectorAll(".validation-form");

  // Apply custom Bootstrap validation for each form.
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        // Prevent submission if form isn't valid.
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        // Add Bootstrap's 'was-validated' class for styling.
        form.classList.add("was-validated");
      },
      false // Event to be captured in the bubbling phase.
    );
  });
})();

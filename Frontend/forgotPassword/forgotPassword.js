const emailField = document.getElementById("email-field");
const emailError = document.getElementById("email-error");
const form = document.getElementById("forgot-form");

function validateEmail() {
  const email = emailField.value;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.match(emailRegex)) {
    emailError.textContent = "Please enter a valid email address";
    return false;
  }
  emailError.textContent = "";
  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateEmail()) return;

  const email = emailField.value;
  const res = await fetch("http://localhost:5999/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  alert(data.message || data.error);
});

emailField.addEventListener("input", validateEmail);
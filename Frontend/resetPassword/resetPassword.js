const token = new URLSearchParams(window.location.search).get("token");

const form = document.getElementById("reset-form");
const passwordField = document.getElementById("password-field");
const confirmPasswordField = document.getElementById("confirm-password-field");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");
const successMessage = document.getElementById("success-message");

function clearErrors() {
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  successMessage.textContent = "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const newPassword = passwordField.value;
  const confirmPassword = confirmPasswordField.value;

  // Validate password
  if (newPassword.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    return;
  }

  if (newPassword !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5999/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      successMessage.textContent = "🎉 Password reset successful! You can now log in.";
      form.reset();
      setTimeout(() => {
        window.location.href = "/Frontend/login/loginpage.html";
      }, 3000); // 3-second delay
    } else {
      passwordError.textContent = data.error || "Password reset failed.";
    }
  } catch (err) {
    passwordError.textContent = "Something went wrong. Try again.";
  }
});

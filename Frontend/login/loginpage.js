
var emailField = document.getElementById("email-field");
var passwordField = document.getElementById("password");
var emailError = document.getElementById("email-error");
var passwordError = document.getElementById("password-error");
var form = document.getElementById("login-form");

function validateEmail() {
  var email = emailField.value;
  var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.match(emailRegex)) {
    emailError.innerHTML = "Please enter a valid email address";
    return false;
  }
  emailError.innerHTML = ""; // Clear error message
  return true;
}

// Validate password (check if it's empty)
function validatePassword() {
  if (!passwordField.value) {
    passwordError.innerHTML = "Please enter your password";
    return false;
  }
  passwordError.innerHTML = ""; // Clear error message
  return true;
}
const loginUser = async () => {
  const email = emailField.value;
  const password = passwordField.value;

  try {
    const response = await fetch("http://localhost:5999/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Login successful:", data);
      alert("Login successful!");
      // Redirect or store token if needed
    } else {
      console.error("Login failed:", data);
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Network or server error");
  }
};

emailField.addEventListener("input", validateEmail);
passwordField.addEventListener("input", validatePassword);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (isEmailValid && isPasswordValid) {
    loginUser(); // use the updated async login function
  }
});


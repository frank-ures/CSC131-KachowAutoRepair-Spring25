const form = document.getElementById("register-form");
const message = document.getElementById("register-message");
const confirmPasswordError = document.getElementById("confirm-password-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  confirmPasswordError.textContent = "";

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("http://localhost:5999/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password,
        role: "customer",
        hourlyWage: 0,
      }),
    });

    const data = await response.json();
    console.log("Register Response:", data);

    if (response.ok) {
      message.style.color = "lightgreen";
      message.textContent = "🎉 Registration successful!";
      form.reset();
      setTimeout(() => {
        window.location.href = "/login/loginpage.html";
      }, 2000);
    } else {
      message.style.color = "red";
      message.textContent = data.error || "Registration failed.";
    }
  } catch (err) {
    console.error("Registration error:", err);
    message.style.color = "red";
    message.textContent = "Something went wrong. Try again.";
  }
});

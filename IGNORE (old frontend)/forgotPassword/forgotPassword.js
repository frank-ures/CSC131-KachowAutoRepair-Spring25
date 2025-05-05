const emailField = document.getElementById("email-field");
const emailError = document.getElementById("email-error");
const form = document.getElementById("forgot-form");


const statusMessage = document.createElement("p");
statusMessage.id = "status-message";
statusMessage.style.marginTop = "10px";
form.appendChild(statusMessage);

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

  statusMessage.textContent = data.message || data.error;
  statusMessage.style.color = res.ok ? "lightgreen" : "red";

  if (res.ok) {
    // Redirect to login after 3 seconds
    setTimeout(() => {
      window.location.href = "../login/loginpage.html";
    }, 3000);
  }
});

emailField.addEventListener("input", validateEmail);
const btnRegistration = document.getElementById("btn-registration");

const xhr = new XMLHttpRequest();
const url = "http://127.0.0.1:5000/api/auth/register";

btnRegistration.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const fullname = document.getElementById("fullname").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Validate input is not empty
  if (!email || !fullname || !password || !confirmPassword) {
    alert("All fields are required!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  const body = JSON.stringify({
    name: fullname,
    email: email,
    password: password,
  });

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 201) {
      // Handle response
      window.location.href = "/auth/login";
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(body);
});

const btnLogin = document.getElementById("btn-login");

const xhr = new XMLHttpRequest();
const url = "http://127.0.0.1:5000/api/auth/login";

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate email and password
  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  const body = JSON.stringify({
    email: email,
    password: password,
  });

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.response);
      // Save access_token to localStorage
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      // Redirect to home page
      window.location.href = "/";
    }
  };

  // Send request
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(body);
});

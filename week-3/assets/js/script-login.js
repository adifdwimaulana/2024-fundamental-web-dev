const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validate email and password
  if (!email || !password) {
    alert("Email and password are required!");
    return;
  }

  // Validate input
  if (email === "john@gmail.com" && password === "123456") {
    // Redirect to Home
    window.location.href = "index.html";
  } else {
    alert("Email or password is incorrect!");
  }
});

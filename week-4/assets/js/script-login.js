const btnLogin = document.getElementById("btn-login");

window.onload = () => {
  const xhr = new XMLHttpRequest();
  const url = "/data/data-user.json";

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.response);

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
        if (email === response.email && password === response.password) {
          // Redirect to Home
          localStorage.setItem("isLogin", true);
          window.location.href = "index.html";
        } else {
          alert("Email or password is incorrect!");
        }
      });
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

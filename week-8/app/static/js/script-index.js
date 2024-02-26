const todo = document.getElementById("todo");
const done = document.getElementById("done");
const addBtn = document.getElementById("add-btn");
const modalEdit = document.getElementById("modal-edit");
const modalDelete = document.getElementById("modal-delete");

const accessToken = localStorage.getItem("access_token");

if (!accessToken) {
  window.location.href = "/auth/login";
}

// Fetching data-task.json when page loaded
window.onload = () => {
  // All scripts inside window.onload will be executed when page loaded
  const xhr = new XMLHttpRequest();
  const url = "http://127.0.0.1:5000/api/tasks";

  // Initialize AJAX calls
  xhr.onreadystatechange = function () {
    if (this.readyState === 1) console.log("Server connection established");

    if (this.readyState === 2) console.log("Request received");

    if (this.readyState === 3) console.log("Processing request");

    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.response);
      const data = response.data;

      // Looping data and render to HTML
      for (let i = 0; i < data.length; i++) {
        const article = document.createElement("article");
        article.setAttribute("class", "border p-3 mt-2");
        article.setAttribute("draggable", "true");
        article.setAttribute("ondragstart", "drag(event)");
        article.setAttribute("id", "drag-" + i);
        // Create h4 element
        const elementH4 = document.createElement("h4"); // <h4></h4>
        elementH4.innerHTML = data[i].title; // <h4>Judul 2</h5>
        // Create p element
        const elementP = document.createElement("p"); // <p></p>
        elementP.innerHTML = data[i].description; // <p>Deskripsi 2</p>
        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.setAttribute(
          "class",
          "bg-danger rounded-5 px-3 py-1 border-0 text-white me-1"
        );
        deleteBtn.setAttribute("id", data[i].id);
        deleteBtn.setAttribute("data-bs-toggle", "modal");
        deleteBtn.setAttribute("data-bs-target", "#modal-delete");

        // Create edit button
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.setAttribute(
          "class",
          "bg-info rounded-5 px-3 py-1 border-0 text-white me-1"
        );
        editBtn.setAttribute("id", data[i].id);
        editBtn.setAttribute("data-bs-toggle", "modal");
        editBtn.setAttribute("data-bs-target", "#modal-edit");

        if (data[i].status === true) {
          elementH4.style.textDecoration = "line-through";
          elementP.style.textDecoration = "line-through";
        }

        article.appendChild(elementH4);
        article.appendChild(elementP);
        article.appendChild(deleteBtn);
        article.appendChild(editBtn);

        if (data[i].status === true) {
          done.appendChild(article);
        } else {
          todo.appendChild(article);
        }
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.send();
};

addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // add data to local storage
  const title = document.getElementById("add-form-title").value;
  const description = document.getElementById("add-form-description").value;

  const body = JSON.stringify({
    title: title,
    description: description,
  });

  const xhr = new XMLHttpRequest();
  const url = "http://127.0.0.1:5000/api/tasks";

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      window.location.reload();
    }
  };

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.send(body);
});

modalEdit.addEventListener("show.bs.modal", (event) => {
  const oldTitle = document.getElementById("edit-form-title");
  const oldDescription = document.getElementById("edit-form-description");

  const id = event.relatedTarget["id"];
  const btnId = document.getElementById(id);
  const article = btnId.parentElement;

  const title = article.children[0].innerHTML;
  const description = article.children[1].innerHTML;

  // Assign old data to input value
  oldTitle.value = title;
  oldDescription.value = description;

  // Update data
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    const url = `http://127.0.0.1:5000/api/tasks/${id}`;

    const body = JSON.stringify({
      title: oldTitle.value,
      description: oldDescription.value,
    });

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        window.location.reload();
      }
    };

    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.send(body);
  });
});

modalDelete.addEventListener("show.bs.modal", (event) => {
  const oldTitle = document.getElementById("delete-form-title");
  const oldDescription = document.getElementById("delete-form-description");

  const id = event.relatedTarget["id"];
  const btnId = document.getElementById(id);
  const article = btnId.parentElement;

  const title = article.children[0].innerHTML;
  const description = article.children[1].innerHTML;

  // Assign old data to input value
  oldTitle.value = title;
  oldDescription.value = description;

  // Delete data
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    const url = `http://127.0.0.1:5000/api/tasks/${id}`;

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        window.location.reload();
      }
    };

    xhr.open("DELETE", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
    xhr.send();
  });
});

function updateStatus(id, status) {
  const xhr = new XMLHttpRequest();
  const url = `http://127.0.0.1:5000/api/tasks/status/${id}`;

  const body = JSON.stringify({
    status: status,
  });

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // window.location.reload();
    }
  };

  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.send(body);
}

function checkStatus(id) {
  const xhr = new XMLHttpRequest();
  const url = `http://127.0.0.1:5000/api/tasks/${id}`;

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const response = JSON.parse(this.response);
      const status = response.data.status;
      updateStatus(id, !status);
    }
  };

  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.send();
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("article", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("article");
  event.target.appendChild(document.getElementById(data));

  const article = document.getElementById(data);
  const id = article.children[2].id;

  checkStatus(id);
}

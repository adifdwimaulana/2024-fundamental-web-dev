const todo = document.getElementById("todo");
const addBtn = document.getElementById("add-btn");
const modalEdit = document.getElementById("modal-edit");
const modalDelete = document.getElementById("modal-delete");

const isLogin = JSON.parse(localStorage.getItem("isLogin"));

if (!isLogin) {
  window.location.href = "login.html";
}

// Fetching data-task.json when page loaded
window.onload = () => {
  // All scripts inside window.onload will be executed when page loaded
  const xhr = new XMLHttpRequest();
  const url = "/data/data-task.json"; // File URL

  // Initialize AJAX calls
  xhr.onreadystatechange = function () {
    if (this.readyState === 1) console.log("Server connection established");

    if (this.readyState === 2) console.log("Request received");

    if (this.readyState === 3) console.log("Processing request");

    if (this.readyState === 4 && this.status === 200) {
      // Check data in local storage
      let dataString = localStorage.getItem("data"); // All data in local storage stored as string
      let data = JSON.parse(dataString);

      if (!data) {
        data = this.response;
        localStorage.setItem("data", data);
      }

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

        article.appendChild(elementH4);
        article.appendChild(elementP);
        article.appendChild(deleteBtn);
        article.appendChild(editBtn);
        todo.appendChild(article);
      }
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
};

addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  // add data to local storage
  const title = document.getElementById("add-form-title").value;
  const description = document.getElementById("add-form-description").value;

  // TODO: Add validation and show toast

  // Get existing data
  const dataString = localStorage.getItem("data"); // All data in local storage stored as string
  const data = JSON.parse(dataString);

  // Add new data into existing data
  data.push({
    id: data.length,
    title: title,
    description: description,
  });

  localStorage.setItem("data", JSON.stringify(data));
  window.location.reload();
});

modalEdit.addEventListener("show.bs.modal", (event) => {
  const oldTitle = document.getElementById("edit-form-title");
  const oldDescription = document.getElementById("edit-form-description");

  const dataString = localStorage.getItem("data");
  const data = JSON.parse(dataString);

  const id = event.relatedTarget["id"];
  const currentIdx = data.findIndex((item) => item.id === Number(id));

  // Assign old data to input value
  oldTitle.value = data[currentIdx].title;
  oldDescription.value = data[currentIdx].description;

  // Update data
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Update data
    data[currentIdx].title = oldTitle.value;
    data[currentIdx].description = oldDescription.value;

    // Set data to local storage
    localStorage.setItem("data", JSON.stringify(data));
    window.location.reload();
  });
});

modalDelete.addEventListener("show.bs.modal", (event) => {
  const oldTitle = document.getElementById("delete-form-title");
  const oldDescription = document.getElementById("delete-form-description");

  const dataString = localStorage.getItem("data");
  const data = JSON.parse(dataString);

  const id = event.relatedTarget["id"];
  const currentIdx = data.findIndex((item) => item.id === Number(id));

  // Assign old data to input value
  oldTitle.value = data[currentIdx].title;
  oldDescription.value = data[currentIdx].description;

  // Delete data
  const deleteBtn = document.getElementById("delete-btn");
  deleteBtn.addEventListener("click", (event) => {
    event.preventDefault();

    // Delete data
    data.splice(currentIdx, 1);

    // Set data to local storage
    localStorage.setItem("data", JSON.stringify(data));
    window.location.reload();
  });
});

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
}

const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const todo = document.getElementById("todo");

  const title = prompt("Masukkan Judul");
  const description = prompt("Masukkan Deskripsi");

  if (!title || !description) {
    alert("Semua field harus diisi!");
    return;
  }

  // Create article element
  const article = document.createElement("article");
  article.setAttribute("class", "border p-3 mt-2");
  article.setAttribute("draggable", "true");
  article.setAttribute("ondragstart", "drag(event)");
  article.setAttribute("id", "drag-" + todo.childElementCount + 1);
  // Create h4 element
  const elementH4 = document.createElement("h4"); // <h4></h4>
  elementH4.innerHTML = title; // <h4>Judul 2</h5>
  // Create p element
  const elementP = document.createElement("p"); // <p></p>
  elementP.innerHTML = description; // <p>Deskripsi 2</p>

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.setAttribute(
    "class",
    "bg-danger rounded-5 px-3 py-1 border-0 text-white me-1"
  );
  // Create edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit";
  editBtn.setAttribute(
    "class",
    "bg-info rounded-5 px-3 py-1 border-0 text-white me-1"
  );

  article.appendChild(elementH4);
  article.appendChild(elementP);
  article.appendChild(deleteBtn);
  article.appendChild(editBtn);

  todo.appendChild(article);
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

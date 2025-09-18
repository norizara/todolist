const form = document.querySelector(".addTask");
const dateInput = document.getElementById("date");
const taskInput = document.getElementById("task");
const descInput = document.getElementById("desc");
const taskDisplay = document.querySelector(".taskDisplay");

const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

let editingIndex = null;

function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const tasks = loadTasks();
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  taskDisplay.innerHTML = "";

  tasks.forEach((t, index) => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <div class="view-mode">
        <strong>${escapeHTML(t.task)}</strong><br>
        ${escapeHTML(t.date)}<br>
        ${escapeHTML(t.description)}
        <div class="actions">
          <button onclick="startEdit(${index})">Edit</button>
          <button onclick="deleteTask(${index})">Delete</button>
        </div>
      </div>
      <div class="edit-mode" style="display:none;">
        <input type="date" value="${t.date}" id="edit-date-${index}" required>
        <input type="text" value="${t.task}" id="edit-task-${index}" required>
        <textarea maxlength="300" id="edit-desc-${index}" required>${t.description}</textarea>
        <button onclick="saveEdit(${index})">Save</button>
        <button onclick="cancelEdit(${index})">Cancel</button>
      </div>
      <hr>
    `;

    taskDisplay.appendChild(div);
  });
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = dateInput.value;
    const task = taskInput.value;
    const desc = descInput.value;

    if (new Date(date) < new Date(today)) {
        alert("You cannot select a past date!");
        return;
    }


    const tasks = loadTasks();

    if(editingIndex == null){
        tasks.push({date, task, description: desc});
    } else {
        tasks[editingIndex] = {date, task, description: desc};
        editingIndex = null;
    }

    saveTasks(tasks);
    renderTasks();
    form.reset();
});



window.deleteTask = function (index) {
    const tasks = loadTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
}

window.startEdit = function(index) {
  const taskDiv = taskDisplay.children[index];
  const editDateInput = taskDiv.querySelector(`#edit-date-${index}`);
  editDateInput.setAttribute("min", today);

  taskDiv.querySelector(".view-mode").style.display = "none";
  taskDiv.querySelector(".edit-mode").style.display = "block";
};


window.cancelEdit = function(index) {
  const taskDiv = taskDisplay.children[index];
  taskDiv.querySelector(".view-mode").style.display = "block";
  taskDiv.querySelector(".edit-mode").style.display = "none";
};

window.saveEdit = function(index) {
  const tasks = loadTasks();

  const newDate = document.getElementById(`edit-date-${index}`).value;
  const newTask = document.getElementById(`edit-task-${index}`).value;
  const newDesc = document.getElementById(`edit-desc-${index}`).value;

  tasks[index] = { date: newDate, task: newTask, description: newDesc };

  saveTasks(tasks);
  renderTasks();
};

renderTasks();

let deferredPrompt;
const installBtn = document.getElementById("install-btn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block"; 
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("User choice:", outcome);

  deferredPrompt = null;
});
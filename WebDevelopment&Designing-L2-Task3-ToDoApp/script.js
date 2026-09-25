// ================================
// GET HTML ELEMENTS
// ================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");

const pendingCount = document.getElementById("pending-count");
const completedCount = document.getElementById("completed-count");

const pendingEmpty = document.getElementById("pending-empty");
const completedEmpty = document.getElementById("completed-empty");

const dateDisplay = document.getElementById("date-display");


// ================================
// LOAD TASKS FROM LOCAL STORAGE
// ================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ================================
// SAVE TASKS
// ================================

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ================================
// DISPLAY TODAY'S DATE
// ================================

const today = new Date();

dateDisplay.textContent = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});


// ================================
// ADD A NEW TASK
// ================================

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Don't add empty tasks
    if (taskText === "") {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    renderTasks();

    taskInput.focus();
});


// ================================
// DISPLAY TASKS
// ================================

function renderTasks() {

    // Clear existing tasks
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    // Separate tasks
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);


    // -------------------------------
    // PENDING TASKS
    // -------------------------------

    pendingTasks.forEach(task => {

        const taskElement = createTaskElement(task);

        pendingList.appendChild(taskElement);

    });


    // -------------------------------
    // COMPLETED TASKS
    // -------------------------------

    completedTasks.forEach(task => {

        const taskElement = createTaskElement(task);

        completedList.appendChild(taskElement);

    });


    // -------------------------------
    // UPDATE COUNTS
    // -------------------------------

    pendingCount.textContent =
        `${pendingTasks.length} pending`;

    completedCount.textContent =
        `${completedTasks.length} completed`;


    // -------------------------------
    // EMPTY STATES
    // -------------------------------

    pendingEmpty.style.display =
        pendingTasks.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completedTasks.length === 0 ? "block" : "none";
}


// ================================
// CREATE TASK CARD
// ================================

function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }


    taskItem.innerHTML = `
        <div class="task-content">

            <button
                class="complete-button"
                data-id="${task.id}"
                title="${task.completed ? "Mark as pending" : "Mark as complete"}"
            >
                ${task.completed ? "✓" : "○"}
            </button>


            <div class="task-details">

                <p class="task-text">${escapeHTML(task.text)}</p>

                <span class="task-time">
                    Added ${formatTime(task.createdAt)}
                </span>

            </div>

        </div>


        <div class="task-actions">

            <button
                class="edit-button"
                data-id="${task.id}"
            >
                Edit
            </button>

            <button
                class="delete-button"
                data-id="${task.id}"
            >
                Delete
            </button>

        </div>
    `;

    return taskItem;
}


// ================================
// COMPLETE / UNCOMPLETE TASK
// ================================

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("complete-button")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();
});


// ================================
// DELETE TASK
// ================================

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-button")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();

    renderTasks();
});


// ================================
// EDIT TASK
// ================================

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-button")) {
        return;
    }

    const taskId = Number(event.target.dataset.id);

    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    const trimmedText = newText.trim();

    if (trimmedText === "") {
        return;
    }

    task.text = trimmedText;

    saveTasks();

    renderTasks();
});


// ================================
// FORMAT TIME
// ================================

function formatTime(date) {

    const taskDate = new Date(date);

    return taskDate.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit"
    });
}


// ================================
// ESCAPE HTML
// ================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ================================
// INITIAL DISPLAY
// ================================

renderTasks();
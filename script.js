// 要素取得
const todoInput = document.getElementById("todo-input");
const todoDate = document.getElementById("todo-date");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");

const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let editingId = null;

// LocalStorage取得
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 初期表示
renderTodos();

// タスク追加・保存
addBtn.addEventListener("click", addTodo);

// Enterキー対応
todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});

// フィルター切替
filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTodos();

    });

});

// タスク追加・編集
function addTodo() {

    const text = todoInput.value.trim();

    if (text === "") {
        alert("タスクを入力してください");
        return;
    }

    // 編集モード
    if (editingId !== null) {

        const todo = todos.find(
            item => item.id === editingId
        );

        todo.text = text;
        todo.date = todoDate.value;

        editingId = null;

        addBtn.textContent = "追加";

    } else {

        // 新規追加
        const todo = {
            id: Date.now(),
            text: text,
            date: todoDate.value,
            completed: false
        };

        todos.push(todo);

    }

    saveTodos();
    renderTodos();

    todoInput.value = "";
    todoDate.value = "";

}

// 描画
function renderTodos() {

    todoList.innerHTML = "";

    let filteredTodos = [...todos];

    if (currentFilter === "active") {

        filteredTodos = todos.filter(
            todo => !todo.completed
        );

    }

    if (currentFilter === "completed") {

        filteredTodos = todos.filter(
            todo => todo.completed
        );

    }

    filteredTodos.forEach((todo) => {

        const li = document.createElement("li");

        // チェックアイコン
        const icon = document.createElement("span");

        icon.classList.add("todo-icon");

        icon.textContent =
            todo.completed ? "☑" : "☐";

        icon.addEventListener("click", () => {

            todo.completed = !todo.completed;

            saveTodos();
            renderTodos();

        });

        // タスク表示
        const span = document.createElement("span");

        if (todo.date) {

            const date = new Date(todo.date);

            const formattedDate =
                `${date.getFullYear()}/` +
                `${String(date.getMonth() + 1).padStart(2, "0")}/` +
                `${String(date.getDate()).padStart(2, "0")} ` +
                `${String(date.getHours()).padStart(2, "0")}:` +
                `${String(date.getMinutes()).padStart(2, "0")}`;

            span.innerHTML =
                `${todo.text}<br><small>${formattedDate}</small>`;

        } else {

            span.textContent = todo.text;

        }

        if (todo.completed) {
            span.classList.add("completed");
        }

        span.addEventListener("click", () => {

            todo.completed = !todo.completed;

            saveTodos();
            renderTodos();

        });

        // 編集ボタン
        const editBtn = document.createElement("button");

        editBtn.textContent = "編集";
        editBtn.classList.add("edit-btn");

        editBtn.addEventListener("click", () => {

            todoInput.value = todo.text;
            todoDate.value = todo.date || "";

            editingId = todo.id;

            addBtn.textContent = "保存";

            todoInput.focus();

        });

        // 削除ボタン
        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "削除";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", () => {

            todos = todos.filter(
                item => item.id !== todo.id
            );

            saveTodos();
            renderTodos();

        });

        li.appendChild(icon);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

    });

    updateTaskCount();

}

// 件数表示
function updateTaskCount() {

    const activeTasks = todos.filter(
        todo => !todo.completed
    ).length;

    taskCount.textContent =
        `未完了タスク：${activeTasks}件`;

}

// LocalStorage保存
function saveTodos() {

    localStorage.setItem(
        "todos",
        JSON.stringify(todos)
    );

}
"use strict";

// Elements
const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");
// End of Elements

// initial states
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editTodoID = -1;

// Functions
// generate random hex color
const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

// save to local storage
const saveLocalStorage = () =>
  localStorage.setItem("todos", JSON.stringify(todos));

// show notification
const showNotif = (msg) => {
  // change notication message
  notificationEl.innerHTML = msg;
  // show notification
  notificationEl.classList.add("notif-enter");
  // hide notification after 2 secs.
  setTimeout(() => {
    notificationEl.classList.remove("notif-enter");
  }, 2000);
};

// save to do
const saveTodo = () => {
  const todoValue = todoInput.value;

  // check duplicate to dos
  const isDuplicate = todos.some(
    (todo) => todo.value.toLowerCase() === todoValue.toLowerCase()
  );

  if (!todoValue) {
    showNotif("To do is empty!");
  } else if (isDuplicate) {
    showNotif("To do already exists!");
  } else {
    if (editTodoID >= 0) {
      todos = todos.map((todo, i) => ({
        ...todo,
        value: i === editTodoID ? todoValue : todo.value,
      }));
      editTodoID = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: `#${randomColor()}`,
      });
    }
    todoInput.value = "";
  }
};

// render to do
const renderTodos = () => {
  if (todos.length === 0) {
    todosListEl.innerHTML = "<center>Nothing to do!</center>";
    return;
  }

  // clear elements before re-render
  todosListEl.innerHTML = "";

  // render to dos
  todos.forEach((todo, i) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${i}>
        <i class="bi ${
          todo.checked ? "bi-check-circle-fill" : "bi-circle"
        }" style="color: ${todo.color}" data-action="check"></i>
        <p class="${todo.checked ? "checked" : ""}" data-action="check">${
      todo.value
    }</p>
        <i class="bi bi-pencil-square" data-action="edit"></i>
        <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
};
// render initial to do
renderTodos();

// check to do
const checkTodo = (todoId) => {
  todos = todos.map((todo, i) => ({
    ...todo,
    checked: i === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
  saveLocalStorage();
};

// edit to do
const editTodo = (todoId) => {
  todoInput.value = todos[todoId].value;
  editTodoID = todoId;
  todoInput.focus();
};

// delete to do
const deleteTodo = (todoId) => {
  todos = todos.filter((_, i) => i !== todoId);
  editTodoID = -1;
  // re-render
  renderTodos();
  saveLocalStorage();
};

// target a todo
const targetTodo = (e) => {
  const target = e.target;
  const parentElement = target.parentElement;

  if (parentElement.className !== "todo") return;

  // to do id
  const todo = parentElement;
  const todoId = +todo.id;

  // target action
  const action = target.dataset.action;

  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);
};
// End of Functions

// Event Handlers
// adding to do when user submits
form.addEventListener("submit", (e) => {
  e.preventDefault();
  saveTodo();
  renderTodos();
  saveLocalStorage();
});

// target a to do when user clicks a to do
todosListEl.addEventListener("click", targetTodo);
// End of Event Handlers

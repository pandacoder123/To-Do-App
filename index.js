import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR41FrkWcmxS5CKxWwtCGAgTlxb5mrJYo",
  authDomain: "task-manager-2d410.firebaseapp.com",
  databaseURL: "https://task-manager-2d410-default-rtdb.firebaseio.com",
  projectId: "task-manager-2d410",
  storageBucket: "task-manager-2d410.appspot.com",
  messagingSenderId: "297015841491",
  appId: "1:297015841491:web:e87acb07fd798da762fa26",
  measurementId: "G-WW3LKDKFWX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const input = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const div = document.getElementsByClassName("task-container")[0];

// Function to reload tasks
function reload() {
  div.innerHTML = "";
  onValue(ref(db, "tasks"), (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const task = childSnapshot.val().task;
      const li = document.createElement("li");
      li.innerHTML = `${task} <button onclick="removeTask('${childSnapshot.key}')">X</button>`;
      div.appendChild(li);
    });
  });
}

// Function to add a task
function addTask() {
  const task = input.value;
  if (task.trim() !== "") {
    push(ref(db, "tasks"), { task: task })
      .then(() => {
        console.log("Task added successfully");
        input.value = "";
        reload();
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
      });
  }
}

// Function to remove a task
function removeTask(key) {
  remove(ref(db, `tasks/${key}`))
    .then(() => {
      console.log("Task removed successfully");
      reload();
    })
    .catch((error) => {
      console.error("Error removing task: ", error);
    });
}

// Expose the removeTask function to the global scope
window.removeTask = removeTask;

// Initial load
reload();

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });
});

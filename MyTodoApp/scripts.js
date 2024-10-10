"use strict";
let LOCALLY_SAVED_LIST_KEY = "todos";
let BIN_ID = "6705396fe41b4d34e43f27dc";
let BIN_ROOT = "https://api.jsonbin.io/v3";
let BIN_API_KEY =
  "$2a$10$hAg2rcgTpOpUtPAQKvgXC.5gciFw4Kz8Xf2tYmvteo2Mm5lKQwkcu";
let todoList = [];

//* list initialization
let initList = function () {
  // let savedList = window.localStorage.getItem(LOCALLY_SAVED_LIST_KEY);
  // if (savedList != null) todoList = JSON.parse(savedList);
  //code creating a default list with 2 items
  // else
  todoList.push(
    {
      title: "Learn JS",
      description: "Create a demo application for my TODO's",
      place: "445",
      category: "",
      dueDate: new Date(2024, 10, 16),
    },
    {
      title: "Lecture test",
      description: "Quick test from the first three lectures",
      place: "F6",
      category: "",
      dueDate: new Date(2024, 10, 17),
    }
  );
};

//* handling GET request / getting data from server
let getREQ = new XMLHttpRequest();
getREQ.onreadystatechange = () => {
  if (getREQ.readyState == XMLHttpRequest.DONE) {
    if (getREQ.status == 200) {
      let responseObject = JSON.parse(getREQ.responseText);
      //   console.log(responseObject.record);
      todoList = responseObject.record;
    } else {
      console.error("Request failed with status: " + getREQ.status);
      initList();
    }
  }
};
getREQ.open("GET", `${BIN_ROOT}/b/${BIN_ID}/latest`, true);
// "https://api.jsonbin.io/v3/b/<BIN_ID>/<BIN_VERSION | latest>",
getREQ.setRequestHeader("X-Master-Key", BIN_API_KEY);
getREQ.send();

//* handling PUT request / updating data on server
let updateJSONbin = function () {
  //! overwrites content on server
  let putREQ = new XMLHttpRequest();

  putREQ.onreadystatechange = () => {
    if (putREQ.readyState == XMLHttpRequest.DONE) {
      if (putREQ.status == 200) {
        console.log(putREQ.responseText);
      } else {
        console.error("Request failed with status: " + putREQ.status);
      }
    }
  };

  putREQ.open("PUT", `${BIN_ROOT}/b/${BIN_ID}`, true);
  putREQ.setRequestHeader("Content-Type", "application/json");
  putREQ.setRequestHeader("X-Master-Key", BIN_API_KEY);
  putREQ.send(JSON.stringify(todoList));
};

//* updating table
let updateTodoTable = function () {
  let todoTable = document.getElementById("todoTableView");
  // remove all elements
  while (todoTable.rows.length > 1) {
    todoTable.deleteRow(1);
  }

  //add all elements
  let filterInput = document.getElementById("inputSearch");
  for (let todo in todoList) {
    if (
      filterInput.value == "" ||
      todoList[todo].title
        .toLowerCase()
        .includes(filterInput.value.toLowerCase()) ||
      todoList[todo].description
        .toLowerCase()
        .includes(filterInput.value.toLowerCase())
    ) {
      let newElement = document.createElement("tr");
      let newTitle = document.createElement("td");
      newTitle.textContent = todoList[todo].title;
      newTitle.className = "p-2 classTitle";
      let newDesc = document.createElement("td");
      newDesc.textContent = todoList[todo].description;
      newDesc.className = "p-2 classDesc";
      //create delete button
      let newDeleteButton = document.createElement("button");
      newDeleteButton.type = "button";
      newDeleteButton.className = "btn btn-danger m-3";
      newDeleteButton.innerHTML = '<i class="bi bi-trash3-fill"></i>';
      newDeleteButton.addEventListener("click", function () {
        deleteTodo(todo);
      });
      let newDeleteTD = document.createElement("td");
      newDeleteTD.appendChild(newDeleteButton);

      newElement.appendChild(newTitle);
      newElement.appendChild(newDesc);
      newElement.appendChild(newDeleteTD);

      todoTable.appendChild(newElement);
    }
  }
};
// setInterval(updateTodoTable, 1000);
setTimeout(updateTodoTable, 1000);

//* delete element (called by EventListener)
let deleteTodo = function (index) {
  todoList.splice(index, 1);
  updateJSONbin();
};

//* add elements via form
let addTodo = function () {
  //get the elements in the form
  let inputTitle = document.getElementById("inputTitle");
  let inputDescription = document.getElementById("inputDescription");
  let inputPlace = document.getElementById("inputPlace");
  let inputDate = document.getElementById("inputDate");
  //get the values from the form
  let newTitle = inputTitle.value;
  let newDescription = inputDescription.value;
  let newPlace = inputPlace.value;
  let newDate = new Date(inputDate.value);
  //create new item
  let newTodo = {
    title: newTitle,
    description: newDescription,
    place: newPlace,
    category: "",
    dueDate: newDate,
  };

  //add item to the list
  todoList.push(newTodo);
  updateJSONbin();
};

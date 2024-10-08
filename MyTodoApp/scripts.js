"use strict";
let LOCALLY_SAVED_LIST_KEY = "todos";
let todoList = [];

//* list initialization
let initList = function () {
  let savedList = window.localStorage.getItem(LOCALLY_SAVED_LIST_KEY);
  if (savedList != null) todoList = JSON.parse(savedList);
  //code creating a default list with 2 items
  else
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

initList();

//* updating list
let updateTodoList = function () {
  let todoListDiv = document.getElementById("todoListView");

  //remove all elements
  while (todoListDiv.firstChild) {
    todoListDiv.removeChild(todoListDiv.firstChild);
  }

  //! old add all elements
  //   for (let todo in todoList) {
  //     let newElement = document.createElement("div");
  //     let newContent = document.createTextNode(
  //       todoList[todo].title + " " + todoList[todo].description
  //     );
  //     //create delete button
  //     let newDeleteButton = document.createElement("input");
  //     newDeleteButton.type = "button";
  //     newDeleteButton.value = "x";
  //     newDeleteButton.addEventListener("click", function () {
  //       deleteTodo(todo);
  //       window.localStorage.setItem(LOCALLY_SAVED_LIST_KEY, JSON.stringify(todoList));
  //     });
  //     newElement.appendChild(newContent);
  //     newElement.appendChild(newDeleteButton);
  //     todoListDiv.appendChild(newElement);
  //   }

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
      let newElement = document.createElement("p");
      let newContent = document.createTextNode(
        todoList[todo].title + " " + todoList[todo].description
      );

      //create delete button
      let newDeleteButton = document.createElement("input");
      newDeleteButton.type = "button";
      newDeleteButton.value = "x";
      newDeleteButton.addEventListener("click", function () {
        deleteTodo(todo);
        window.localStorage.setItem(
          LOCALLY_SAVED_LIST_KEY,
          JSON.stringify(todoList)
        );
      });
      newElement.appendChild(newContent);
      newElement.appendChild(newDeleteButton);
      todoListDiv.appendChild(newElement);
    }
  }
};

setInterval(updateTodoList, 1000);

//* delete element (called by EventListener)
let deleteTodo = function (index) {
  todoList.splice(index, 1);
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
  //save item locally
  window.localStorage.setItem(LOCALLY_SAVED_LIST_KEY, JSON.stringify(todoList));
};

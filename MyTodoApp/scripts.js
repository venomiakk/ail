
const binApiKey = import.meta.env.VITE_binApiKey;
const binId= import.meta.env.VITE_binId;
const aiKey = import.meta.env.VITE_aiKey;


let generateCategory = async function (description) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiKey}` 
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: 'jaką kategorię zadania na liście zadań do zrobienia przypisałbyś "' + description + '", podaj jedno slowo jako odpowiedź na to pytanie' }]
            })
        });

        if (!response.ok) {
            throw new Error('Błąd sieci lub API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return 'Inne';
    }
}


let todoList = [];
let todoTable = document.getElementById("todoTableView");

function generateTable(data) {
    for (let item in data) {
        let newElement = document.createElement("tr");
        let newTitle = document.createElement("td");
        newTitle.textContent = data[item].title;
        newTitle.className = "p-2 classTitle";
        let newDesc = document.createElement("td");
        newDesc.textContent = data[item].description;
        newDesc.className = "p-2 classDesc";
        let newCat = document.createElement("td");
        newCat.textContent = data[item].category;
        newCat.className = "p-2 classDesc";
        let dueDate = document.createElement("td");
        let date  = new Date(data[item].dueDate);
        dueDate.textContent = date.toLocaleDateString('pl-PL');
        dueDate.className = "p-2 classDesc";
        let newDeleteButton = document.createElement("button");
        newDeleteButton.type = "button";
        newDeleteButton.className = "btn btn-danger m-3";
        newDeleteButton.innerHTML = '<i class="bi bi-trash3-fill"></i>';
        newDeleteButton.addEventListener("click", function () {
          deleteTodo(item);
        });
        let newDeleteTD = document.createElement("td");
        newDeleteTD.appendChild(newDeleteButton);
        newElement.appendChild(newTitle);
        newElement.appendChild(newDesc);
        newElement.appendChild(newCat);
        newElement.appendChild(dueDate);
        newElement.appendChild(newDeleteTD);
        todoTable.appendChild(newElement);
    }
}

let updateRepository = () => {
    try{
        let req = new XMLHttpRequest();

        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                console.log(req.responseText);
            }
        };
        req.open("PUT", binId, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("X-Master-Key", binApiKey);
        req.send(JSON.stringify(todoList));
    }catch(err){
        console.error(err);
    }
    
}


let initList = () => {
    try{
        let req = new XMLHttpRequest();
        req.onreadystatechange = () => {
            if (req.readyState == XMLHttpRequest.DONE) {
                let obj = JSON.parse(req.responseText);
                todoList = obj.record;
                updateTodoList();
    
            }
        };
        req.open("GET", binId, true);
        req.setRequestHeader("X-Master-Key", binApiKey);
        req.send();
    }catch(err){
        console.error(err);
    }
    
}

let deleteTodo = function (index) {
    todoList.splice(index, 1)
    updateRepository();
}


let checkText = function(string){
    let filterInput = document.getElementById("inputSearch");
    if(filterInput.value == "" ||
    string.toLowerCase().includes(filterInput.value.toLowerCase()) ||
    string.toLowerCase().includes(filterInput.value.toLowerCase())){
        return true;
    }
};

let checkFirstDate = function(date){
    let dateFrom = document.getElementById("startDate");
    if(dateFrom.value == ''){
        return true;
    }else if(date > dateFrom.value){
        return true;
    }
    return false
};

let checkEndDate = function(date){
    let dateTo = document.getElementById("endDate");
    if(dateTo.value==''){
        return true;
    }else if(date < dateTo.value){
        return true;
    }
    return false
};


let updateTodoList = function () {
    while (todoTable.rows.length > 1) {
        todoTable.deleteRow(1);
      }

    let tempArray = todoList.filter((todo) => checkText(todo.description)&&checkFirstDate(todo.dueDate)&&checkEndDate(todo.dueDate));
    generateTable(tempArray) 
}

let addTodo = async function () {
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        category: await generateCategory(newDescription),
        dueDate: newDate
    };
    todoList.push(newTodo);
    updateRepository();
    document.getElementById("taskForm").reset();
}
document.querySelector('#addButton').addEventListener('click', addTodo);
setInterval(updateTodoList, 1000);
initList();



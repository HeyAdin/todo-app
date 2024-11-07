document.addEventListener('DOMContentLoaded', async () => {
    const token = window.localStorage.getItem("token");
    let username = window.localStorage.getItem('name');
    const usernameTrimIndex = username.indexOf('@gmail.com');
    username = username.slice(0,usernameTrimIndex);
    if (!token) {
        window.location.href = '../login/login.html'
    }
    else {
         const response = await fetch('http://localhost:8001/get-todo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization' : token
            }
        })
        const jsonData = await response.json();
        console.group(jsonData.allTodos)
        const todoContainer = document.querySelector('.todocontainer');
        const todos = document.createElement('div');
        todos.innerHTML = jsonData.allTodos[0].title;
        todoContainer.appendChild(todos);
        // console.log(jsonData.allTodos._id)
        const heading = document.querySelector('.heading').innerHTML = username + "taskFolio";

    }
})
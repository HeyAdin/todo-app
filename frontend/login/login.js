async function userLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const response = await fetch('http://localhost:8001/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            pass
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const jsonData = await response.json();
    if(jsonData.msg==="logged in successfully"){
        window.localStorage.setItem("token", jsonData.token);
        window.location.href = '../todo/todo.html';
    }
    else{
        alert("user not found")
    }
}
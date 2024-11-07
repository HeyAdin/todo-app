function userSignup() {
    const fullName = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    console.log(fullName,email,password);
    fetch('http://localhost:8001/signup',{
        method :'POST',
        body : JSON.stringify({
            username : fullName,
            email,
            pass
        }),
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then(async(res)=>{
        const json = await res.json({msg : "Signup successfull please sign in"})
        alert('Signup Successfull please login')
    })
}

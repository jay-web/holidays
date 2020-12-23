
const login = async (email, password) => {
    console.log(email, password);
    try{
        const res = await axios(
            {
             method: "POST",
             url: "http://localhost:5000/api/v1/users/login",
             data: {
                 email,
                 password
             }
            }
        );
        console.log(res);
    }catch(err){
        console.log(err.response.data)
    }

    
}

document.querySelector(".form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    login(email, password);
})
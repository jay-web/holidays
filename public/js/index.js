import "@babel/polyfill";
import { login, logout, signup } from "./login";
import { showMap } from "./mapbox";


const mapBox = document.getElementById('map');
const logoutButton = document.querySelector(".nav__el--logout");
// const signupButton = document.querySelector(".nav__el--cta");
 
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log("map box integrated", locations);
    
    showMap(locations);
}

const form = document.querySelector(".form");
const signUpForm = document.querySelector(".signupForm");

if(form){
    form.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        login(email, password);
    })
}

if(signUpForm){
    console.log("sign up form")
    signUpForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirmpassword").value;
        signup(name, email, password, confirmPassword);
    })
}

if(logoutButton) logoutButton.addEventListener("click", logout);
// if(signupButton) signupButton.addEventListener("click", )

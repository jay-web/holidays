import "@babel/polyfill";
import { login, logout, signup } from "./login";
import {updateMe } from "./accountSetting";
import { showMap } from "./mapbox";


const mapBox = document.getElementById('map');
const logoutButton = document.querySelector(".nav__el--logout");
// const signupButton = document.querySelector(".nav__el--cta");
 
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log("map box integrated", locations);
    
    showMap(locations);
}

const form = document.querySelector(".form--login");
const signUpForm = document.querySelector(".signupForm");
const dataUpdationForm = document.querySelector(".form-user-data");

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

if(dataUpdationForm){
    dataUpdationForm.addEventListener("submit", e => {
        e.preventDefault();
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        updateMe(name, email);
    })
}

if(logoutButton) logoutButton.addEventListener("click", logout);


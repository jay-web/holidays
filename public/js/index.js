import "@babel/polyfill";
import { login, logout, signup } from "./login";
import {updateSetting } from "./accountSetting";
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
const updatePasswordForm = document.querySelector(".form-user-password");

if(form){
    form.addEventListener("submit", e => {
        e.preventDefault();
        document.querySelector(".btn--login").innerHTML = "Please wait";
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        login(email, password);
    })
}

if(signUpForm){
    console.log("sign up form")
    signUpForm.addEventListener("submit", e => {
        e.preventDefault();
        document.querySelector(".btn--signup").innerHTML = "Please wait";
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
        const userForm = new FormData();
        userForm.append("name", document.querySelector("#name").value);
        userForm.append("email", document.querySelector("#email").value);
        userForm.append("photo", document.querySelector("#photo").files[0]);
        
        updateSetting(userForm, "data");
    })
}

if(updatePasswordForm){
    
    updatePasswordForm.addEventListener("submit", e => {
        console.log("udpate password")
        document.querySelector(".btn--save-password").innerHTML = "Updating..."
        e.preventDefault();
        const oldPassword = document.querySelector("#password-current").value;
        const password = document.querySelector("#password").value;
        const passwordConfirm = document.querySelector("#password-confirm").value;
        console.log(oldPassword, password, passwordConfirm)
        updateSetting({oldPassword, password, passwordConfirm}, "password");
    })
}

if(logoutButton) logoutButton.addEventListener("click", logout);


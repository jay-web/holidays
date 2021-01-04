import "@babel/polyfill";
import { login, logout, signup, forgotPassword , resetPassword } from "./login";
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
const forgotPasswordForm = document.querySelector(".forgotPassword");
const resetPasswordForm = document.querySelector(".resetPasswordForm");


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

if(forgotPasswordForm){
  
    forgotPasswordForm.addEventListener("submit", (e) => {
        console.log("Forgot password");
        document.querySelector(".btn--forgotPassword").innerHTML = "Please wait..."
        e.preventDefault();
        const email = document.querySelector("#email").value;
        forgotPassword(email);
    })
}

if(resetPasswordForm){
    resetPasswordForm.addEventListener("submit", (e) => {
        console.log(e);
        e.preventDefault();
        const password = document.querySelector("#password").value;
        const passwordConfirm = document.querySelector("#confirmpassword").value;
        const resetToken = e.path[6].location.pathname.split("/")[2];
        console.log(resetToken);
        resetPassword(password, passwordConfirm, resetToken);
    })
}

if(logoutButton) logoutButton.addEventListener("click", logout);


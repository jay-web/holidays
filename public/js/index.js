import "@babel/polyfill";
import { login, logout } from "./login";
import { showMap } from "./mapbox";

const mapBox = document.getElementById('map');
const logoutButton = document.querySelector(".nav__el--logout");
 
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log("map box integrated", locations);
    
    showMap(locations);
}

const form = document.querySelector(".form");

if(form){
    form.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        login(email, password);
    })
}

if(logoutButton) logoutButton.addEventListener("click", logout);

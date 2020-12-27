import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
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
        if(res.data.status === "success"){
            showAlert("success", "Logged In successfully");
            setTimeout(() => {
                location.assign("/")
            }, 1000);
        }
    }catch(err){
        showAlert("error" , err.response.data.message);
        // setTimeout(() => {
        //     location.assign("/login")
        // }, 1000);
        
    }   
}

export const logout = async () => {
    try{
        const res = await axios({
            method: "GET",
            url: "http://localhost:5000/api/v1/users/logout"
        })
        if(res.data.status === "success"){
            showAlert("success", "Logged Out successfully");
            setTimeout(() => {
                location.reload(true)
            }, 1000);
        }
    }catch(err){
        showAlert("error", "Error in logging out, please try again");
    }
}


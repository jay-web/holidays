import axios from "axios";
import { showAlert } from "./alert";

export const signup = async (name, email, password, passwordConfirm) => {
    console.log("signing up");
    console.log(email, password, passwordConfirm);

    try{
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if(res.data.status === "success"){
            showAlert("success", "Welcome in Holidays !!!");
            setTimeout(() => {
                location.assign("/")
            }, 1000);
        }
    }catch(error){
        console.log(error);
        showAlert("error" , error.response.data.message);
    }
}

export const login = async (email, password) => {
    console.log(email, password);
    try{
        const res = await axios(
            {
             method: "POST",
             url: "/api/v1/users/login",
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
            url: "/api/v1/users/logout"
        })
        if(res.data.status === "success"){
            showAlert("success", "Logged Out successfully");
            setTimeout(() => {
                location.assign("/")
            }, 1000);
        }
    }catch(err){
        showAlert("error", "Error in logging out, please try again");
    }
}

export const forgotPassword = async (email) => {
    console.log(email);
    try{
        const res = await axios({
            method: "POST",
            url: "/api/v1/users/forgotPassword",
            data: {
                email: email
            }
        });
        console.log({res});
        if(res.data.status === "success"){
            location.assign("/passwordInstruction")
        }
    }catch(error) {
        showAlert("error", error.message)
    }
}

export const resetPassword = async (password, passwordConfirm, resetToken) => {
    try{
        const res = await axios({
            method: "PATCH",
            url: `/api/v1/users/resetPassword/${resetToken}`,
            data: {
                password: password,
                passwordConfirm: passwordConfirm
            }
        })
        if(res.data.status === "success"){
            showAlert("success", "Password reset successfully");
            setTimeout(() => {
                location.assign("/")
            }, 1000);
        }
    }catch(error){
        showAlert("error", error.message);
    }
}
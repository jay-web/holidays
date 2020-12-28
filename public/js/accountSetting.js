import axios from "axios";
import showAlert from "./alert";

export const updateMe = async (name, email ) => {
    try {
        const res = await axios({
            method: "PATCH",
            url: "http://localhost:5000/api/v1/users/updateMe",
            data: {
                name, 
                email
            }
        });
        
        if(res.data.status === "success"){
            showAlert("Account updated successfully");
            setTimeout(() => {
                location.reload(true)
            }, 1000);
        }
    }catch(error){
        showAlert("error", error.response.data.message);
    }
}
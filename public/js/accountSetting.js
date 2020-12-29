import axios from "axios";
import {showAlert} from "./alert";

// type will be either password or data
export const updateSetting  = async (dataToChange, type ) => {
    console.log({dataToChange});
    try {
        const url = 
            type === "password" 
            ? "http://localhost:5000/api/v1/users/updatePassword" 
            : "http://localhost:5000/api/v1/users/updateMe"

        const res = await axios({
          method: "PATCH",
          url: url,
          data: dataToChange
        });
        console.log(res.data.status);
        if(res.data.status === "success"){
            showAlert("success", `${type.toUpperCase()} updated successfully`);
            
            setTimeout(() => {
                location.reload(true)
            }, 1000);
        }
    }catch(error){
        console.log({error});
        const msg = error.response.data.message;
        showAlert("error", msg);
    }
}
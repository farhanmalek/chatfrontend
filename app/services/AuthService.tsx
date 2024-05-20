import axios from "axios"
import { handleError } from "../helpers/errorHandler";
import { UserProfileToken } from "../models/UserModel";

const api = "http://localhost:5148/api"

//Login Api - taps login endpoint
export const loginAPI = async (userName: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "account/login", {
            userName: userName,
            password: password
        })

        return data;
        
    } catch (error) {
        handleError(error);
    }
}

//Register Api
export const registerAPI = async (email:string, userName: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "account/register", {
            email: email,
            userName: userName,
            password: password,
        })

        return data;
        
    } catch (error) {
        handleError(error);
    }
}
//api calls to get back details about users and friendships

import { handleError } from "../helpers/errorHandler"
import axios from "axios"
import { UserProfile } from "../models/UserModel"

//get list of all users 

const api = "http://localhost:5148/api/"

export const getAllUsers = async (searchInput:string)  => {
    try {

        const data = await axios.get<UserProfile[]>(api + "account/users", {
            params: {
                searchInput: searchInput
            }
        })
        return data;
    } catch (error) {
        handleError(error)
    }
}

//get friends for a user

export const getFriends = async (searchInput:string) => {
    try {
        const data = await axios.get<UserProfile[]>(api + "friendships", {
            params: {
                searchInput: searchInput
            }
        })
        return data;
        
    } catch (error) {
        handleError(error)
    }
}

//send a friend request
export const sendFriendRequest = async (receiver: UserProfile) => {
    try {
        const data = await axios.post(api + "friendships/send", {
            userId: receiver.userId,
            userName: receiver.userName
        })
        return data
        
    } catch (error) {
        handleError(error)
    }
}

//handle a friend request
export const handleFriendRequest = async (sender: UserProfile, action:string) => {
    try {
        const data = await axios.put(api + "friendships/send", {
            userId: sender.userId,
            userName: sender.userName,
            action: action
        })
        return data
        
    } catch (error) {
        handleError(error)
    }
}

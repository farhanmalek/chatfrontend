import axios from 'axios';
import { handleError } from '../helpers/errorHandler';
const api = "http://localhost:5148/api/"


//get chats for a logged in user
export const getAllChats = async() => {
    try {
        
    } catch (error) {
        handleError(error)
    }
}

//get a chat by its id

//create a new chat

//edit the chat name

//get all messages for a chat by its id
import axios from 'axios';
import { handleError } from '../helpers/errorHandler';
import { ChatModel } from '../models/ChatModel';
import { UserProfile } from '../models/UserModel';
import { MessageModel } from '../models/MessageModel';
const api = "http://localhost:5148/api/"


//get chats for a logged in user
export const getAllChats = async() => {
    try {
        const data = await axios.get<ChatModel[]>(api + "chats")
        return data;
        
    } catch (error) {
        handleError(error)
    }
}

//get a chat by its id
export const getChatById = async(chatId: number) => {
    try {
        const data = await axios.get<ChatModel>(api + `chats/${chatId}`)
        return data;
        
    } catch (error) {
        handleError(error)
    }
}

//create a new chat
export const createChat = async(participants: UserProfile[]) => {

    try {
        const data = await axios.post<ChatModel>(api + "chats/create", participants)

        return data
    } catch (error) {
        handleError(error)
    }
}


//edit the chat name
export const editChatName = async(chatId: number, newName: string) => {
    try {
        const data = await axios.put<ChatModel>(api + `chats/${chatId}`, {
            newName: newName
        })
        return data
    } catch (error) {
        handleError(error)
    }
}

//get all messages for a chat by its id
export const getChatMessages = async(chatId: number) => {
    try {
        const data = await axios.get<MessageModel[]>(api + `chats/${chatId}/messages`)
        return data
    } catch (error) {
        handleError(error)
    }
}
import * as signalR from "@microsoft/signalr";
import { UserProfile } from "../models/UserModel";
import { MessageModel } from "../models/MessageModel";

const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5148/chat") // Update this URL to match your backend SignalR hub endpoint
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startConnection = async () => {
    try {
        await hubConnection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log("Error while establishing connection: ", err);
        setTimeout(startConnection, 5000);
    }
};

export const sendMessage = async (user: UserProfile, message: MessageModel, chatId: number) => {
    try {
        console.log("Sending message: ", message);
        await hubConnection.invoke("SendMessageByChatId", user, message, chatId);
    } catch (err) {
        console.error(err);
    }
};

export const onReceiveMessage = (callback: (user: UserProfile, message: MessageModel) => void) => {
    console.log("Setting up event listener for receiving messages");
    hubConnection.on("ReceiveMessageByChatId", callback);
};

export default hubConnection;

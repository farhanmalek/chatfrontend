import { MessageModel } from "./MessageModel"
import { UserProfile } from "./UserModel"

export type ChatModel = {
    chatId: string,
    chatName: string,
    participants: UserProfile[],
    messages: MessageModel[]
}
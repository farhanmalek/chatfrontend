import { UserProfile } from "./UserModel"

export type MessageModel = {
    chatId: number,
    sender: UserProfile,
    content: string,
    sentAt?: string
}
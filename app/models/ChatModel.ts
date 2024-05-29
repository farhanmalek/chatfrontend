import { MessageModel } from "./MessageModel"
import { UserProfile } from "./UserModel"

export type ChatModel = {
    id: number,
    name: string,
    participants: UserProfile[],
    messages: MessageModel[]
}
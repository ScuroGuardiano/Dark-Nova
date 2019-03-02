import { MESSAGE_TYPES } from "./message-types";

export default interface IMessageData {
    subject?: string;
    content: string;
    type: MESSAGE_TYPES;
    receiverId: number;
    senderName: string;
    senderId?: number;
}

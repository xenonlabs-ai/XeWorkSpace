export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface Message {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isMe: boolean;
  status: "sending" | "sent" | "delivered" | "read";
  reactions?: Reaction[];
  isLatest?: boolean;
}

export interface Conversation {
  id: number;
  name: string;
  avatar: string; // use string like '1', '2', etc.
  unread: number;
  lastMessage: string;
  time: string;
  isActive: boolean;
  online: boolean;
  isDirect?: boolean;
  members?: number;
  membersOnline?: number;
  isTyping?: boolean;
}

"use client";

import type { Conversation, Message } from "@/components/types/chat";
import { useMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { ChatWindow } from "./chat-window";
import { ConversationsList } from "./conversations-list";

export function MessagesContent() {
  const conversationsData: Conversation[] = [
    {
      id: 1,
      name: "Team Jhon",
      avatar: "1",
      unread: 3,
      lastMessage: "Meeting notes yesterday",
      time: "10:45 AM",
      isActive: true,
      online: true,
      members: 8,
      membersOnline: 3,
    },
    {
      id: 2,
      name: "Dan Alpha",
      avatar: "2",
      unread: 0,
      lastMessage: "Updated the design files",
      time: "Yesterday",
      isActive: false,
      online: false,
      members: 5,
      membersOnline: 2,
    },
    {
      id: 3,
      name: "Marketing T",
      avatar: "3",
      unread: 1,
      lastMessage: "Campaign results are in!",
      time: "Yesterday",
      isActive: false,
      online: true,
      members: 4,
      membersOnline: 1,
    },
    {
      id: 4,
      name: "John Smith",
      avatar: "4",
      unread: 0,
      lastMessage: "Can we discuss the proposal?",
      time: "Monday",
      isActive: false,
      online: true,
      isDirect: true,
    },
    {
      id: 5,
      name: "Sarah Polin",
      avatar: "5",
      unread: 0,
      lastMessage: "Thanks for your help!",
      time: "Monday",
      isActive: false,
      online: false,
      isDirect: true,
    },
    {
      id: 6,
      name: "Tech Support",
      avatar: "6",
      unread: 0,
      lastMessage: "Your ticket has been resolved",
      time: "Last week",
      isActive: false,
      online: true,
      members: 3,
      membersOnline: 2,
    },
  ];

  const messagesData: Message[] = [
    {
      id: 1,
      sender: "Jane Doe",
      avatar: "1",
      content: "Good morning team!",
      time: "9:30 AM",
      isMe: false,
      status: "read",
    },
    {
      id: 2,
      sender: "Me",
      avatar: "me",
      content: "I'll be joining a few minutes late.",
      time: "9:35 AM",
      isMe: true,
      status: "delivered",
    },
    {
      id: 3,
      sender: "John Smith",
      avatar: "2",
      content: "Thanks for the reminder.",
      time: "9:32 AM",
      isMe: false,
      status: "read",
    },
    // ... other messages
  ];

  const [conversations, setConversations] = useState(conversationsData);
  const [messages, setMessages] = useState(messagesData);
  const [activeConversation, setActiveConversation] = useState(
    conversationsData[0]
  );

  const [mobileView, setMobileView] = useState<"conversations" | "chat">(
    "conversations"
  );
  const isMobile = useMobile();

  const handleSelectConversation = (conversation: Conversation) => {
    setConversations(
      conversations.map((c) => ({
        ...c,
        isActive: c.id === conversation.id,
        unread: c.id === conversation.id ? 0 : c.unread,
      }))
    );
    setActiveConversation(conversation);
    if (isMobile) setMobileView("chat");
  };

  const handleBackToList = () => setMobileView("conversations");

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Me",
      avatar: "me",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
      status: "sending",
    };
    setMessages((prev) => [...prev, newMessage]);
    setTimeout(
      () =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, status: "sent" } : m
          )
        ),
      500
    );
    setTimeout(
      () =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, status: "delivered" } : m
          )
        ),
      1500
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Messages</h1>

      <div className="grid h-[calc(100vh-200px)] min-h-[500px] overflow-hidden grid-cols-6 gap-6">
        {/* Show conversation list */}
        {(!isMobile || mobileView === "conversations") && (
          <ConversationsList
            conversations={conversations}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            className="overflow-y-auto col-span-6 md:col-span-3 lg:col-span-3 xl:col-span-2 h-full"
          />
        )}

        {/* Show chat window */}
        {(!isMobile || mobileView === "chat") && (
          <ChatWindow
            conversation={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBackToList}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}

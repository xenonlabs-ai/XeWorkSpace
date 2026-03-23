"use client";

import type { Conversation, Message } from "@/components/types/chat";
import { useMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ChatWindow } from "./chat-window";
import { ConversationsList } from "./conversations-list";
import { MessageSquare } from "lucide-react";

export function MessagesContent() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [mobileView, setMobileView] = useState<"conversations" | "chat">("conversations");
  const isMobile = useMobile();

  // Fetch conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/messages/conversations");
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations || []);
          if (data.conversations?.length > 0) {
            setActiveConversation(data.conversations[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchConversations();
    }
  }, [session]);

  // Fetch messages for active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;

      try {
        const response = await fetch(`/api/messages/conversations/${activeConversation.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [activeConversation]);

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

  const handleSendMessage = async (content: string) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: session?.user?.name || "Me",
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

    try {
      const response = await fetch(`/api/messages/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, status: "delivered" } : m
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === newMessage.id ? { ...m, status: "failed" } : m
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, status: "failed" } : m
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
          <p className="text-muted-foreground max-w-md">
            Start a conversation with a team member to begin messaging.
          </p>
        </div>
      </div>
    );
  }

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
        {(!isMobile || mobileView === "chat") && activeConversation && (
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

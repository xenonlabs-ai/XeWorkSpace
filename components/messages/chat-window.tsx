import type { Conversation, Message } from "@/components/types/chat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack: () => void;
  isMobile: boolean;
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onBack,
  isMobile,
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(messageText.trim());
    setMessageText("");
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (!containerRef.current || !endRef.current) return;

    // Scroll smoothly to the bottom
    containerRef.current.scrollTo({
      top: endRef.current.offsetTop,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Card className="md:col-span-3 xl:col-span-4 h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex items-center justify-between border-b py-3">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft size={18} />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <Image
              src={`/images/users/${conversation.avatar}.jpg`}
              alt={conversation.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-medium">{conversation.name}</h4>
              <p className="text-xs text-muted-foreground">
                {conversation.isTyping
                  ? "Typing..."
                  : conversation.online
                  ? "Online"
                  : "Offline"}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={`${msg.id}-${msg.time}`} // unique key
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            {!msg.isMe && (
              <Image
                src={`/images/users/${msg.avatar}.jpg`}
                alt={msg.sender}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full mr-2"
              />
            )}
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                msg.isMe
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <div className="text-xs mt-1 opacity-70 flex justify-between">
                <span>{msg.time}</span>
                {msg.isMe && <span>{msg.status}</span>}
              </div>
              {msg.reactions && (
                <div className="flex gap-2 mt-1">
                  {msg.reactions.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs bg-background/40 rounded-full px-2 py-0.5"
                    >
                      {r.emoji} {r.count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </CardContent>

      {/* Input - stays at bottom */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-4 border-t flex gap-2 bg-card"
      >
        <Input
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <Button type="submit" size="icon" variant="default">
          <Send size={18} />
        </Button>
      </form>
    </Card>
  );
}

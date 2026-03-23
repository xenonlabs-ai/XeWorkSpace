"use client";

import { Conversation } from "@/components/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Plus, Search, User, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NewConversationDialog } from "./new-conversation-dialog";

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  className?: string;
}

export function ConversationsList({
  conversations,
  activeConversation,
  onSelectConversation,
  className,
}: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);

  const filteredConversations = conversations.filter((convo) => {
    const matchesSearch = convo.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "direct") return matchesSearch && convo.isDirect;
    if (activeTab === "groups") return matchesSearch && !convo.isDirect;
    return matchesSearch;
  });

  return (
    <Card
      className={`md:col-span-2 lg:col-span-3 h-full flex flex-col border dark:border bg-card/50 backdrop-blur-sm ${className}`}
    >
      <CardHeader className="pb-4 space-y-3 border-b dark:border/90">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Conversations
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 hover:bg-accent/60 transition-colors cursor-pointer"
            onClick={() => setIsNewConversationOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="search"
            placeholder="Search messages..."
            className="pl-9 h-9 bg-background/50 border dark:border-border/50 focus-visible:bg-background transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="w-full h-9 gap-1 bg-muted/30 p-1">
            <TabsTrigger
              value="all"
              className="flex-1 text-center text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="direct"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              <User className="h-3.5 w-3.5" /> Direct
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              <Users className="h-3.5 w-3.5" /> Groups 
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="p-3 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-muted-foreground/80 mb-4 text-sm font-medium">
                No conversations found
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 flex items-center gap-2 border dark:border-border/60 hover:bg-accent/50 transition-colors"
                onClick={() => setIsNewConversationOpen(true)}
              >
                <Plus className="h-4 w-4" /> Start New Conversation
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((convo) => (
                <motion.div
                  key={convo.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    convo.id === activeConversation?.id
                      ? "bg-accent border dark:border-border/70 shadow-sm dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_2px_8px_rgba(0,0,0,0.4)]"
                      : "hover:bg-accent/40 border border-transparent dark:hover:border-border/50 dark:hover:shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                  }`}
                  onClick={() => onSelectConversation(convo)}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 ring-2 ring-border/20 dark:ring-border/30">
                      <Image
                        src={`/images/users/${convo.id}.jpg`}
                        alt={convo.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover rounded-full"
                      />
                    </Avatar>
                    {convo.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full ring-1 ring-green-500/30" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3
                        className={`font-medium text-sm truncate ${
                          convo.id === activeConversation?.id
                            ? "text-foreground"
                            : "text-foreground/90"
                        }`}
                      >
                        {convo.name}
                      </h3>
                      <span className="text-xs text-muted-foreground/70 whitespace-nowrap shrink-0">
                        {convo.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 truncate leading-relaxed">
                      {convo.lastMessage}
                    </p>

                    {!convo.isDirect && (
                      <div className="flex items-center mt-1.5 text-xs text-muted-foreground/60">
                        {convo.membersOnline} / {convo.members} online
                      </div>
                    )}
                  </div>

                  {convo.unread > 0 && (
                    <Badge
                      variant="default"
                      className="rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 text-[10px] font-semibold shrink-0 shadow-sm"
                    >
                      {convo.unread}
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <NewConversationDialog
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
      />
    </Card>
  );
}

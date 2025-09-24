import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import botAvatar from "@/assets/childbot-avatar.png";
import { Sparkles, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface BotKnowledge {
  id: string;
  keyword: string;
  response: string;
  category: string;
}

const ChildBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! I'm ChildBot, your friendly learning companion! 🌟 What would you like to talk about today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [botKnowledge, setBotKnowledge] = useState<BotKnowledge[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Fetch bot knowledge from database
  useEffect(() => {
    const fetchBotKnowledge = async () => {
      try {
        const { data, error } = await supabase
          .from('bot_knowledge')
          .select('*')
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching bot knowledge:', error);
          return;
        }
        
        setBotKnowledge(data || []);
      } catch (error) {
        console.error('Error fetching bot knowledge:', error);
      }
    };

    fetchBotKnowledge();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Find matching response from database
    const matchingKnowledge = botKnowledge.find(knowledge => 
      message.includes(knowledge.keyword.toLowerCase())
    );
    
    if (matchingKnowledge) {
      return matchingKnowledge.response;
    }
    
    return "That's really interesting! 🌟 Tell me more about that, or we could explore something new together. I'm here to help and have fun with you!";
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="bot-avatar w-20 h-20 border-4 border-white shadow-2xl animate-float">
              <AvatarImage src={botAvatar} alt="ChildBot" />
              <AvatarFallback className="bg-gradient-to-br from-bot-primary to-bot-secondary text-white text-2xl">
                🤖
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-bot-primary bg-clip-text text-transparent mb-2">
            ChildBot
          </h1>
          <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Your Friendly Learning Companion
            <Heart className="w-5 h-5 text-red-400" />
          </p>
        </div>

        {/* Chat Container */}
        <Card className="bg-card/80 backdrop-blur-sm border-2 border-white/20 shadow-2xl rounded-3xl overflow-hidden">
          {/* Messages */}
          <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && (
                <div className="flex gap-3 mb-4">
                  <Avatar className="bot-avatar w-10 h-10 border-2 border-white shadow-lg">
                    <AvatarImage src={botAvatar} alt="ChildBot" />
                    <AvatarFallback className="bg-gradient-to-br from-bot-primary to-bot-secondary text-white font-bold">
                      🤖
                    </AvatarFallback>
                  </Avatar>
                  <div className="chat-message-bot">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 bg-muted/30 border-t border-white/20">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isTyping}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChildBot;
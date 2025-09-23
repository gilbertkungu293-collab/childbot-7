import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import botAvatar from "@/assets/childbot-avatar.png";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: Date;
}

const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <Avatar className="bot-avatar w-10 h-10 border-2 border-white shadow-lg">
          <AvatarImage src={botAvatar} alt="ChildBot" />
          <AvatarFallback className="bg-gradient-to-br from-bot-primary to-bot-secondary text-white font-bold">
            🤖
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`${isBot ? 'chat-message-bot' : 'chat-message-user'} animate-in slide-in-from-bottom-2 duration-300`}>
        <p className="text-base leading-relaxed">{message}</p>
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      
      {!isBot && (
        <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
          <AvatarFallback className="bg-gradient-to-br from-accent to-secondary text-foreground font-bold">
            😊
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
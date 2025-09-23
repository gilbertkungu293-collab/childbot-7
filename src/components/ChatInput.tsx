import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, Heart, Star } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const quickMessages = [
  { text: "Tell me a story!", icon: "📚" },
  { text: "What's your favorite color?", icon: "🎨" },
  { text: "Can you help me learn?", icon: "🧠" },
  { text: "Let's play a game!", icon: "🎮" },
];

const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleQuickMessage = (quickMessage: string) => {
    if (!disabled) {
      onSendMessage(quickMessage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick message buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {quickMessages.map((quick, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            onClick={() => handleQuickMessage(quick.text)}
            disabled={disabled}
            className="rounded-full hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <span className="mr-1">{quick.icon}</span>
            {quick.text}
          </Button>
        ))}
      </div>

      {/* Chat input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={disabled}
          className="chat-input flex-1 rounded-2xl border-2 border-muted text-lg py-3 px-4 focus:border-primary"
        />
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          size="lg"
          className="rounded-2xl px-6 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg hover:scale-105 transition-all duration-200 animate-pulse-glow"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
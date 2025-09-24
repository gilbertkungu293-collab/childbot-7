-- Create bot knowledge table for dynamic responses
CREATE TABLE public.bot_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  response TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bot_knowledge ENABLE ROW LEVEL SECURITY;

-- Create policies - public can read, but only authenticated users can modify
CREATE POLICY "Anyone can view active bot knowledge" 
ON public.bot_knowledge 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage bot knowledge" 
ON public.bot_knowledge 
FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bot_knowledge_updated_at
BEFORE UPDATE ON public.bot_knowledge
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default bot knowledge
INSERT INTO public.bot_knowledge (keyword, response, category) VALUES
('story', 'Once upon a time, in a magical forest, there lived a kind robot who loved helping children learn new things! 📖✨ Would you like to hear more or create your own story?', 'entertainment'),
('color', 'I love all colors, but purple and blue are super special to me! 💜💙 They remind me of the sky and flowers. What''s your favorite color?', 'preferences'),
('learn', 'I''d love to help you learn! We could practice counting, learn about animals, or explore fun facts about space! 🚀 What sounds interesting to you?', 'education'),
('help', 'I''m here to help you with anything! We can learn together, play games, or just chat. What would you like to do?', 'assistance'),
('game', 'Games are so much fun! 🎮 We could play 20 questions, count things around you, or I could tell you riddles! What kind of game sounds fun?', 'entertainment'),
('play', 'Let''s play! I know lots of fun games and activities. What sounds interesting - word games, counting games, or maybe some riddles?', 'entertainment'),
('hello', 'Hello! It''s wonderful to meet you! 😊 I''m so excited to chat and learn together. What''s your name?', 'greeting'),
('hi', 'Hi there! I''m ChildBot, your friendly learning companion! What would you like to explore today?', 'greeting'),
('name', 'I''m ChildBot! I''m here to be your friendly learning buddy. I love helping kids discover new things and have fun while learning! 🤖💕', 'identity'),
('math', 'Math is awesome! 🔢 We can practice addition, subtraction, or even learn about shapes and patterns. What math topic interests you?', 'education'),
('animal', 'Animals are amazing! 🐾 Did you know elephants can remember their friends for decades? What''s your favorite animal?', 'education'),
('space', 'Space is incredible! 🚀 There are billions of stars and planets out there. Did you know Saturn has over 80 moons? What would you like to know about space?', 'education');
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Send, ShoppingCart, ChefHat, Check, Clock, Users, Zap } from 'lucide-react';

// Add Tailwind dark mode config
if (typeof window !== 'undefined' && window.tailwind) {
  window.tailwind.config = {
    darkMode: 'class'
  };
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: {
    shoppingList?: string[];
    recipe?: {
      title: string;
      ingredients: string[];
      instructions: string[];
      cookTime: string;
      servings: number;
    };
  };
}

interface ShoppingListProps {
  items: string[];
}

interface RecipeCardProps {
  recipe: {
    title: string;
    ingredients: string[];
    instructions: string[];
    cookTime: string;
    servings: number;
  };
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-3 shadow-sm">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <ShoppingCart className="w-4 h-4 text-green-500" />
        Shopping List
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => toggleItem(item)}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              checkedItems.has(item) 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {checkedItems.has(item) && <Check className="w-3 h-3" />}
            </div>
            <span className={`flex-1 ${
              checkedItems.has(item) 
                ? 'line-through text-gray-500 dark:text-gray-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-3 shadow-sm">
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-green-500" />
          {recipe.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {recipe.cookTime}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {recipe.servings} servings
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate different responses based on user input
    if (lowerMessage.includes('shopping list') || lowerMessage.includes('grocery list')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I've created a shopping list based on your needs! You can check off items as you shop.",
        timestamp: new Date(),
        data: {
          shoppingList: [
            'Organic bananas',
            'Whole grain bread',
            'Greek yogurt',
            'Free-range eggs',
            'Baby spinach',
            'Olive oil',
            'Avocados',
            'Chicken breast'
          ]
        }
      };
    } else if (lowerMessage.includes('recipe') || lowerMessage.includes('cook') || lowerMessage.includes('meal')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Here's a delicious and healthy recipe I recommend! Click to expand for full details.",
        timestamp: new Date(),
        data: {
          recipe: {
            title: 'Mediterranean Quinoa Bowl',
            cookTime: '25 minutes',
            servings: 4,
            ingredients: [
              '1 cup quinoa',
              '2 cups vegetable broth',
              '1 cucumber, diced',
              '1 cup cherry tomatoes, halved',
              '1/2 red onion, thinly sliced',
              '1/2 cup kalamata olives',
              '1/4 cup feta cheese, crumbled',
              '2 tbsp olive oil',
              '1 lemon, juiced',
              'Fresh herbs (mint, parsley)'
            ],
            instructions: [
              'Rinse quinoa and cook with vegetable broth until fluffy, about 15 minutes',
              'Let quinoa cool while preparing other ingredients',
              'Dice cucumber, halve cherry tomatoes, and slice red onion',
              'Whisk olive oil and lemon juice for dressing',
              'Combine quinoa with vegetables and olives',
              'Top with feta cheese and fresh herbs',
              'Drizzle with dressing and serve'
            ]
          }
        }
      };
    } else {
      const responses = [
        "I'm here to help with all your grocery needs! Whether you need a shopping list, recipe ideas, or meal planning - just ask away!",
        "Perfect! I can help you create shopping lists, suggest recipes, or find ingredients for any dish you have in mind.",
        "Great question! I love helping with grocery shopping and cooking. What specific help do you need today?",
        "I'm your grocery guru! I can suggest ingredients, create shopping lists, recommend recipes, or help plan your meals."
      ];
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!hasStarted) {
      setHasStarted(true);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const quickActions = [
    'Generate shopping list',
    'Suggest healthy recipes',
    'Plan weekly meals',
    'Find ingredients for pasta'
  ];

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Groceasy</h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </header>

        {/* Onboarding Screen */}
        <div className="relative min-h-[calc(100vh-80px)]">
          {/* Hero Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            }}
          >
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold italic text-white mb-4 drop-shadow-lg">
              I'm <em>Groceasy</em>, your grocery guru
            </h2>
            <p className="text-lg font-bold italic text-white/90 mb-8 max-w-md drop-shadow-md">
              Inspired by users for users, I'm here to make shopping effortless. Let's turn your grocery chaos into culinary magic!
            </p>
          </div>

          {/* Central Input */}
          <div className="w-full max-w-md mb-6">
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tell me about your groceries or ask for ideas..."
                className="w-full p-4 pr-12 font-bold italic text-gray-800 dark:text-gray-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:font-bold placeholder:italic"
                className="w-full p-4 pr-12 text-gray-800 dark:text-gray-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-4 py-2 text-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
              >
                {action}
              </button>
            ))}
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200"><em>Groceasy</em></h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg ${
                message.type === 'user' 
                  ? 'bg-green-500 text-white rounded-tl-lg rounded-br-lg rounded-bl-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gray-200 dark:border-gray-700'
              } p-4 shadow-sm`}>
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <ChefHat className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400"><em>Groceasy</em></span>
                  </div>
                )}
                <p className="text-sm md:text-base">{message.content}</p>
                
                {/* Render shopping list if present */}
                {message.data?.shoppingList && (
                  <ShoppingList items={message.data.shoppingList} />
                )}
                
                {/* Render recipe if present */}
                {message.data?.recipe && (
                  <RecipeCard recipe={message.data.recipe} />
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <ChefHat className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-bold italic text-gray-600 dark:text-gray-400">***Groceasy***</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about groceries, recipes, or meal planning..."
              className="w-full p-4 pr-12 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import ShoppingList from './ShoppingList';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: {
    recommendations?: string[];
    shoppingList?: string[];
    productInfo?: {
      name: string;
      category: string;
      origin: string;
      price?: string;
    };
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      type: 'ai',
      content: 'Γεια σου! Welcome to GreekMarket. I can help you discover amazing Greek products - wine, cheese, olive oil, and more. What are you looking for today?',
      timestamp: new Date(),
    }]);
  }, []);

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('shopping list') || lowerMessage.includes('λίστα αγορών')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I've created a shopping list with popular Greek products for you:",
        timestamp: new Date(),
        data: {
          shoppingList: [
            'Feta cheese (200g)',
            'Kalamata olives (250g)',
            'Extra virgin olive oil (1L)',
            'Greek yogurt (500g)',
            'Pita bread (pack of 6)',
            'Tzatziki sauce',
            'Halloumi cheese (250g)',
            'Greek honey (jar)'
          ]
        }
      };
    } else if (lowerMessage.includes('wine') || lowerMessage.includes('κρασί')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'd recommend these excellent Greek wines available nearby:",
        timestamp: new Date(),
        data: {
          recommendations: [
            'Assyrtiko from Santorini - Crisp white wine',
            'Xinomavro from Naoussa - Bold red wine',
            'Moschofilero from Mantinia - Aromatic white',
            'Agiorgitiko from Nemea - Smooth red wine'
          ]
        }
      };
    } else if (lowerMessage.includes('cheese') || lowerMessage.includes('τυρί')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "Here are some authentic Greek cheeses you might enjoy:",
        timestamp: new Date(),
        data: {
          recommendations: [
            'Feta PDO - Classic Greek cheese',
            'Graviera - Sweet nutty flavor',
            'Kasseri - Semi-hard yellow cheese',
            'Manouri - Creamy white cheese'
          ]
        }
      };
    } else if (lowerMessage.includes('olive oil') || lowerMessage.includes('λάδι')) {
      return {
        id: Date.now().toString(),
        type: 'ai',
        content: "These premium Greek olive oils are highly rated:",
        timestamp: new Date(),
        data: {
          recommendations: [
            'Kalamata Extra Virgin - From Messinia',
            'Koroneiki Single Estate - From Crete',
            'Organic Mytilene - From Lesvos',
            'Cold Pressed Athinolia - From Lakonia'
          ]
        }
      };
    }
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: "I can help you find the best Greek products! Try asking about wine, cheese, olive oil, or any other Greek specialty you're interested in.",
      timestamp: new Date(),
    };
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Ionicons name="chatbubble" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.headerTitle}>GreekMarket Assistant</Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.type === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              {message.type === 'ai' && (
                <View style={styles.aiHeader}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="leaf" size={16} color="white" />
                  </View>
                  <Text style={styles.aiName}>Assistant</Text>
                </View>
              )}
              <Text style={[
                styles.messageText,
                message.type === 'user' && styles.userMessageText
              ]}>
                {message.content}
              </Text>
              
              {/* Recommendations */}
              {message.data?.recommendations && (
                <View style={styles.recommendationsContainer}>
                  {message.data.recommendations.map((item, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.recommendationText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {/* Shopping List */}
              {message.data?.shoppingList && (
                <View style={styles.shoppingListContainer}>
                  <ShoppingList items={message.data.shoppingList} />
                </View>
              )}
            </View>
          ))}
          
          {isTyping && (
            <View style={[styles.messageBubble, styles.aiMessage]}>
              <ActivityIndicator size="small" color="#4CAF50" />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Ask about Greek products..."
            placeholderTextColor="#999"
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputValue.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  userMessageText: {
    color: 'white',
  },
  recommendationsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  shoppingListContainer: {
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
}); 
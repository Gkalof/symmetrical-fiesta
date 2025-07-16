import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShoppingListProps {
  items: string[];
  onItemToggle?: (item: string, checked: boolean) => void;
}

export default function ShoppingList({ items, onItemToggle }: ShoppingListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) {
      newChecked.delete(item);
      onItemToggle?.(item, false);
    } else {
      newChecked.add(item);
      onItemToggle?.(item, true);
    }
    setCheckedItems(newChecked);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cart" size={20} color="#4CAF50" />
        <Text style={styles.title}>Shopping List</Text>
      </View>
      
      <ScrollView style={styles.itemsContainer}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => toggleItem(item)}
          >
            <View style={styles.checkbox}>
              {checkedItems.has(item) && (
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
              )}
            </View>
            <Text style={[
              styles.itemText,
              checkedItems.has(item) && styles.itemTextChecked
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {checkedItems.size > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {checkedItems.size} of {items.length} items selected
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  itemsContainer: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
}); 
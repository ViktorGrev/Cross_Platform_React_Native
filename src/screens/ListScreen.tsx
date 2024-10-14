import React, { useState, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

interface Item {
  id: string;
  text: string;
  completed: boolean;
}

interface List {
  id: string;
  name: string;
  items: Item[];
}

const ListScreen = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState('');
  const inputRef = useRef<TextInput>(null); // Reference to the input field

  const addItem = () => {
    if (inputValue.trim() && selectedListId) {
      const updatedLists = lists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              items: [{ id: Date.now().toString(), text: inputValue, completed: false }, ...list.items], // Add new item at the beginning
            }
          : list
      );
      setLists(updatedLists);
      setInputValue(''); // Clear the input field
      inputRef.current?.focus(); // Keep the input field focused
    }
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        // Toggle the completion status of the item
        const updatedItems = list.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        // Sort items: incomplete at the top, completed at the bottom
        const incompleteItems = updatedItems.filter((item) => !item.completed);
        const completedItems = updatedItems.filter((item) => item.completed);
        return { ...list, items: [...incompleteItems, ...completedItems] };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => toggleItemCompletion(selectedListId!, item.id)}>
      <View style={styles.item}>
        <Text style={item.completed ? styles.completedText : styles.text}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: List = { id: Date.now().toString(), name: newListName, items: [] };
      setLists([...lists, newList]);
      setNewListName('');
      setIsModalVisible(false); // Close the modal
      setSelectedListId(newList.id); // Automatically select the new list
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal for creating a new list */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <Button title="Create List" onPress={createNewList} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Top bar for "Add New List" button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonText}>Add New List</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal list of available lists */}
      <View style={styles.listSelectorContainer}>
        <ScrollView horizontal contentContainerStyle={styles.listSelectorContent}>
          {lists.map((list) => (
            <TouchableOpacity key={list.id} onPress={() => setSelectedListId(list.id)} style={styles.listButton}>
              <Text style={styles.listButtonText}>{list.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input and item list for the selected list */}
      {selectedListId && (
        <>
          <TextInput
            ref={inputRef} // Attach the ref to the input field
            style={styles.input}
            placeholder="Add an item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={() => {
              addItem();
              inputRef.current?.focus(); // Refocus the input field after submitting
            }}
            blurOnSubmit={false} // Prevent the keyboard from dismissing
          />
          <Button title="Add Item" onPress={addItem} />
          <FlatList
            data={lists.find((list) => list.id === selectedListId)?.items || []}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    height: 50, // Height of the top bar
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginBottom: 10, // Add some space below the top bar
  },
  addButton: {
    backgroundColor: '#14213d', // Button background color
    paddingVertical: 10, // Vertical padding for the button
    paddingHorizontal: 20, // Horizontal padding for the button
    borderRadius: 5, // Rounded corners
  },
  addButtonText: {
    color: '#fff', // Button text color
    fontSize: 16, // Button text size
    fontWeight: 'bold', // Make the text bold
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  completedText: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  listSelectorContainer: {
    height: 40, // Set the height for the horizontal list container to 100px
    marginBottom: 16,
  },
  listSelectorContent: {
    alignItems: 'center', // Center content vertically
  },
  listButton: {
    padding: 10,
    backgroundColor: '#fca311',
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    height: 80, // Ensure the button height fits within the container height
    minWidth: 80, // Set a minimum width for the buttons
  },
  listButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
});

export default ListScreen;

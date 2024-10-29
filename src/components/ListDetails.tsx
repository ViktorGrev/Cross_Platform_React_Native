import React, { useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ListDetails = ({ selectedListId, lists, setLists, inputValue, setInputValue }) => {
  const inputRef = useRef<TextInput>(null);

  const addItem = () => {
    if (inputValue.trim()) {
      const updatedLists = lists.map((list) =>
        list.id === selectedListId
          ? { ...list, items: [{ id: Date.now().toString(), text: inputValue, completed: false }, ...list.items] }
          : list
      );
      setLists(updatedLists);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const toggleItemCompletion = (itemId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === selectedListId) {
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const selectedList = lists.find((list) => list.id === selectedListId);
  const incompleteItems = selectedList?.items.filter((item) => !item.completed) || [];
  const completedItems = selectedList?.items.filter((item) => item.completed) || [];
  const combinedItems = [...incompleteItems, ...completedItems];

  return (
    <View>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Add an item"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={addItem}
        blurOnSubmit={false}
      />
      <TouchableOpacity onPress={addItem} style={styles.addButton}>
        <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 5v14M5 12h14" />
        </Svg>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
      <FlatList
        data={combinedItems}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleItemCompletion(item.id)}>
            <View style={styles.item}>
              <Text style={item.completed ? styles.completedText : styles.text}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  addButton: {
    padding: 10,
    backgroundColor: '#5D3FD3',
    borderRadius: 5,
    justifyContent: 'center',
    marginBottom: 8,
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ListDetails;

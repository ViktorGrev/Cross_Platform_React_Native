import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import myImg from '../icons/delete.png';
import RNFS from 'react-native-fs';

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
  const inputRef = useRef<TextInput>(null);

  const listsFilename = `${RNFS.DownloadDirectoryPath}/lists.json`;

  useEffect(() => {
    // Load lists from JSON file on initialization
    const loadLists = async () => {
      try {
        const listsJson = await RNFS.readFile(listsFilename);
        const savedLists = JSON.parse(listsJson);
        setLists(savedLists);
      } catch (error) {
        console.log('No lists found, starting with an empty list.');
      }
    };
    loadLists();
  }, []);

  useEffect(() => {
    // Save lists to JSON file each time they change
    const saveLists = async () => {
      try {
        await RNFS.writeFile(listsFilename, JSON.stringify(lists), 'utf8');
      } catch (error) {
        console.log('Error saving lists:', error);
      }
    };
    saveLists();
  }, [lists]);

  const addItem = () => {
    if (inputValue.trim() && selectedListId) {
      const updatedLists = lists.map((list) =>
        list.id === selectedListId
          ? {
            ...list,
            items: [{ id: Date.now().toString(), text: inputValue, completed: false }, ...list.items],
          }
          : list
      );
      setLists(updatedLists);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        const incompleteItems = updatedItems.filter((item) => !item.completed);
        const completedItems = updatedItems.filter((item) => item.completed);
        return { ...list, items: [...incompleteItems, ...completedItems] };
      }
      return list;
    });
    setLists(updatedLists);
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: List = { id: Date.now().toString(), name: newListName, items: [] };
      setLists([...lists, newList]);
      setNewListName('');
      setIsModalVisible(false);
      setSelectedListId(newList.id);
    }
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter((list) => list.id !== listId));
    setSelectedListId(null);
  };

  return (
    <View style={styles.container}>
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter list name"
              value={newListName}
              onChangeText={setNewListName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={createNewList}>
                <Text style={styles.buttonText}>Create List</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 5v14M5 12h14" />
          </Svg>
          <Text style={styles.addButtonText}>Create List</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your lists</Text>
      </View>

      <View style={styles.listSelectorContainer}>
        <ScrollView horizontal contentContainerStyle={styles.listSelectorContent}>
          {lists.map((list) => (
            <TouchableOpacity
              key={list.id}
              onPress={() => setSelectedListId(list.id)}
              style={[styles.listButton, selectedListId === list.id && styles.selectedListButton]}>
              <Text style={styles.listButtonText}>{list.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {selectedListId && (
        <>
          <View style={styles.listTitleContainer}>
            <Text style={styles.listTitle}>
              {lists.find((list) => list.id === selectedListId)?.name}
            </Text>

            {/* Delete button for the selected list */}
            <TouchableOpacity
              onPress={() => deleteList(selectedListId)}
              style={styles.deleteButton}
            >
              <Image source={myImg} style={styles.icon} />
              <Text>Delete list</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Add an item"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={() => {
              addItem();
              inputRef.current?.focus();
            }}
            blurOnSubmit={false}
          />
          <Button title="Add Item" onPress={addItem} />
          <FlatList
            data={lists.find((list) => list.id === selectedListId)?.items || []}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleItemCompletion(selectedListId, item.id)}>
                <View style={styles.item}>
                  <Text style={item.completed ? styles.completedText : styles.text}>{item.text}</Text>
                </View>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    height: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#14213d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14213d',
  },
  titleContainer: {
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14213d',
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 12,
    borderBottomColor: '#14213d',
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  listSelectorContent: {
    alignItems: 'center',
  },
  listButton: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#fca311',
    borderRadius: 10,
    marginRight: 5,
  },
  selectedListButton: {
    borderColor: '#14213d',
    borderWidth: 2,
  },
  listButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
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
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default ListScreen;

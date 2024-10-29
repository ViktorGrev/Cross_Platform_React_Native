import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import TopBar from '../components/TopBar';
import ListSelector from '../components/ListSelector';
import ListDetails from '../components/ListDetails';
import ModalComponent from '../components/ModalComponent';
import ListTitle from '../components/ListTitle';

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
  const listsDirectory = `${RNFS.DownloadDirectoryPath}/lists`;

  useEffect(() => {
    // Ensure lists directory exists
    const ensureDirectory = async () => {
      const exists = await RNFS.exists(listsDirectory);
      if (!exists) await RNFS.mkdir(listsDirectory);
    };
    ensureDirectory();

    // Load all lists from files in the directory
    const loadLists = async () => {
      try {
        const files = await RNFS.readDir(listsDirectory);
        const loadedLists: List[] = [];
        for (const file of files) {
          if (file.isFile()) {
            const listJson = await RNFS.readFile(file.path);
            loadedLists.push(JSON.parse(listJson));
          }
        }
        setLists(loadedLists);
      } catch (error) {
        console.log('Error loading lists:', error);
      }
    };
    loadLists();
  }, []);

  const saveList = async (list: List) => {
    try {
      const listPath = `${listsDirectory}/${list.id}.json`;
      await RNFS.writeFile(listPath, JSON.stringify(list), 'utf8');
    } catch (error) {
      console.log('Error saving list:', error);
    }
  };

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: List = { id: Date.now().toString(), name: newListName, items: [] };
      setLists([...lists, newList]);
      setNewListName('');
      setIsModalVisible(false);
      setSelectedListId(newList.id);
      saveList(newList);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      const listPath = `${listsDirectory}/${listId}.json`;
      await RNFS.unlink(listPath);
      setLists(lists.filter((list) => list.id !== listId));
      setSelectedListId(null);
    } catch (error) {
      console.log('Error deleting list:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ModalComponent
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreateList={createNewList}
      />
      <TopBar onOpenModal={() => setIsModalVisible(true)} />
      <ListSelector lists={lists} selectedListId={selectedListId} onSelectList={setSelectedListId} />
      {selectedListId && (
        <>
          <ListTitle
            title={lists.find((list) => list.id === selectedListId)?.name || ''}
            onDelete={() => deleteList(selectedListId)}
          />
          <ListDetails
            selectedListId={selectedListId}
            lists={lists}
            setLists={(updatedLists) => {
              setLists(updatedLists);
              const updatedList = updatedLists.find((list) => list.id === selectedListId);
              if (updatedList) saveList(updatedList);
            }}
            inputValue={inputValue}
            setInputValue={setInputValue}
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
});

export default ListScreen;

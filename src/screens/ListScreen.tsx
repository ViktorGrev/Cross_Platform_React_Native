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
  const listsFilename = `${RNFS.DownloadDirectoryPath}/lists.json`;

  useEffect(() => {
    const loadLists = async () => {
      try {
        const listsJson = await RNFS.readFile(listsFilename);
        setLists(JSON.parse(listsJson));
      } catch {
        console.log('No lists found, starting with an empty list.');
      }
    };
    loadLists();
  }, []);

  useEffect(() => {
    const saveLists = async () => {
      try {
        await RNFS.writeFile(listsFilename, JSON.stringify(lists), 'utf8');
      } catch (error) {
        console.log('Error saving lists:', error);
      }
    };
    saveLists();
  }, [lists]);

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
            setLists={setLists}
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

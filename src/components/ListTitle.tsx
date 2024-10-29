import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import myImg from '../icons/delete.png';

const ListTitle = ({ title, onDelete }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
      <Image source={myImg} style={styles.icon} />
      <Text style={styles.deleteText}>Delete list</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14213d',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  deleteText: {
    color: '#d9534f',
    fontSize: 16,
  },
});

export default ListTitle;

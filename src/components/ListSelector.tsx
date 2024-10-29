import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ListSelector = ({ lists, selectedListId, onSelectList }) => (
    <View style={styles.listSelectorContainer}>
        <Text style={styles.title}>Your lists</Text>
        <ScrollView horizontal contentContainerStyle={styles.listSelectorContent}>
            {lists.map((list) => (
                <TouchableOpacity
                    key={list.id}
                    onPress={() => onSelectList(list.id)}
                    style={[styles.listButton, selectedListId === list.id && styles.selectedListButton]}>
                    <Text style={styles.listButtonText}>{list.name}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#14213d',
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#5D3FD3',
        borderRadius: 10,
        marginRight: 5,
    },
    selectedListButton: {
        borderColor: '#14213d',
        borderWidth: 2,
        backgroundColor: '#7E6ED3',
        paddingHorizontal: 25,
        paddingVertical: 17,
    },
    listButtonText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff',
    },
});

export default ListSelector;

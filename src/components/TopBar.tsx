import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TopBarProps {
    onOpenModal: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenModal }) => (
    <View style={styles.topBar}>
        <TouchableOpacity style={styles.addButton} onPress={onOpenModal}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 5v14M5 12h14" />
            </Svg>
            <Text style={styles.addButtonText}> Create List</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    topBar: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 5,
    },
    addButton: {
        backgroundColor: '#5D3FD3',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        flexDirection: 'row',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TopBar;

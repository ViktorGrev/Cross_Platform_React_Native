// App.tsx

import React from 'react';
import { SafeAreaView } from 'react-native';
import ListScreen from './screens/ListScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ListScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;

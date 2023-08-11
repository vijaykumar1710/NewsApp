import React from 'react';
import {SafeAreaView} from 'react-native';
import NewsScreen from './src/screens/NewsScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView>
      <SafeAreaView>
        <NewsScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;

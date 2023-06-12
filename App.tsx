/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView
} from 'react-native';
import Map from './src/screens/Map';
import Colors from './src/color/Colors';

function App(): JSX.Element {
  const {container} = getStyles()

  return (
    <SafeAreaView style={container}>
     <Map />
    </SafeAreaView>
  );
}

const getStyles = () => {
  return ({
      container: {
          flex: 1,
          backgroundColor: Colors.white,
      },
  })
}


export default App;

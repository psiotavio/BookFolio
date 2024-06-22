import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useTheme } from "../../constants/temas/ThemeContext";
import TabOneScreen from '.';
import TabTwoScreen from './profile';
import Recomendations from './recomendations';
import { StatusBar } from 'expo-status-bar';
import Library from './library';

export default function TabLayout() {
  const { theme, themeName } = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: "home", unfocusedIcon: "home-outline" },
    { key: 'recomendations', title: 'Recomendações', focusedIcon: "star", unfocusedIcon: "star-outline" },
    { key: 'library', title: 'Biblioteca', focusedIcon: "book", unfocusedIcon: "book-outline" },
    { key: 'tabTwo', title: 'Perfil', focusedIcon: "cog", unfocusedIcon: "cog-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: TabOneScreen,
    tabTwo: TabTwoScreen,
    recomendations: Recomendations,
    library: Library,
  });

  const statusBarStyle = themeName === 'light' ? 'dark' : 'light';

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        activeColor={theme.text}
        inactiveColor={theme.text}
        activeIndicatorStyle={{ backgroundColor: theme.details }}
        barStyle={{ backgroundColor: theme.modalBackground }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

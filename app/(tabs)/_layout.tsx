import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useTheme } from "../../constants/temas/ThemeContext";
import { useDictionary } from "../../contexts/DictionaryContext"; // Importando o hook de tradução
import { useNavigationContext } from "../../contexts/NavigationContext";
import TabOneScreen from '.';
import TabTwoScreen from './profile';
import Recomendations from './recomendations';
import { StatusBar } from 'expo-status-bar';
import Library from './library';

export default function TabLayout() {
  const { theme, themeName } = useTheme();
  const { t } = useDictionary(); // Usando o dicionário de tradução
  const { shouldNavigateToHome, setShouldNavigateToHome } = useNavigationContext();
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: 'home', title: t('home'), focusedIcon: "home", unfocusedIcon: "home-outline" },
    { key: 'recomendations', title: t('recomendations'), focusedIcon: "star", unfocusedIcon: "star-outline" },
    { key: 'library', title: t('library'), focusedIcon: "book", unfocusedIcon: "book-outline" },
    { key: 'tabTwo', title: t('profile'), focusedIcon: "cog", unfocusedIcon: "cog-outline" },
  ]);

  // Atualiza as rotas sempre que a função de tradução for alterada
  useEffect(() => {
    setRoutes([
      { key: 'home', title: t('home'), focusedIcon: "home", unfocusedIcon: "home-outline" },
      { key: 'recomendations', title: t('recomendations'), focusedIcon: "star", unfocusedIcon: "star-outline" },
      { key: 'library', title: t('library'), focusedIcon: "book", unfocusedIcon: "book-outline" },
      { key: 'tabTwo', title: t('profile'), focusedIcon: "cog", unfocusedIcon: "cog-outline" },
    ]);
  }, [t]);

  // Navegar para home quando solicitado
  useEffect(() => {
    if (shouldNavigateToHome) {
      setIndex(0); // 0 é o índice da aba 'home'
      setShouldNavigateToHome(false);
    }
  }, [shouldNavigateToHome, setShouldNavigateToHome]);

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

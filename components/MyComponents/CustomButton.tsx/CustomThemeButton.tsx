import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeName } from "../../../constants/temas/ThemeContext";
import { themes } from "../../../constants/temas/ThemeColors";
import CustomButton from "./CustomButton";
import { useDictionary } from "@/contexts/DictionaryContext"; // Importando o hook de tradução

const { width } = Dimensions.get('window');

const CustomThemeButton: React.FC = () => {
  const { theme, setThemeName, themeName } = useTheme();
  const { t } = useDictionary(); // Usando o hook de tradução
  const [modalVisible, setModalVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const handleThemeChange = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const themeLabels: Record<ThemeName, string> = {
    light: t("claro"),
    dark: t("escuro"),
    "1984": t(1984),
    gollum: t("gollum"),
    dracula: t("dracula"),
    gatsby: t("gatsby"),
    maravilhas: t("maravilhas"),
    odisseia: t("odisseia"),
    orgulhoEPreconceito: t("orgulhoEPreconceito"),
    ulisses: t("ulisses"),
    amado: t("amado"),
    fahrenheit451: t("fahrenheit451"),
    duna: t("duna"),
    belaEAFera: t("belaEAFera"),
  };

  const themeIcons: Record<ThemeName, keyof typeof Ionicons.glyphMap> = {
    light: "sunny",
    dark: "moon",
    "1984": "book",
    gollum: "eye",
    dracula: "skull",
    gatsby: "flower",
    maravilhas: "sparkles",
    odisseia: "boat",
    orgulhoEPreconceito: "heart",
    ulisses: "compass",
    amado: "rose",
    fahrenheit451: "flame",
    duna: "planet",
    belaEAFera: "diamond",
  };

  const ThemePreview = ({ themeKey }: { themeKey: ThemeName }) => {
    const themeColors = themes[themeKey];
    const isSelected = themeKey === themeName;
    
    return (
      <TouchableOpacity
        style={[
          styles.themeCard,
          {
            backgroundColor: themeColors.background,
            borderColor: isSelected ? theme.details : theme.borderBottom,
            borderWidth: isSelected ? 3 : 1,
            transform: [{ scale: isSelected ? 1.05 : 1 }],
          },
        ]}
        onPress={() => handleThemeChange(themeKey)}
        activeOpacity={0.8}
      >
        <View style={styles.themePreview}>
          <View style={[styles.previewHeader, { backgroundColor: themeColors.details }]}>
            <Ionicons 
              name={themeIcons[themeKey]} 
              size={16} 
              color={themeColors.textButtons} 
            />
          </View>
          <View style={styles.previewContent}>
            <View style={[styles.previewLine, { backgroundColor: themeColors.text }]} />
            <View style={[styles.previewLine, { backgroundColor: themeColors.textSecondary, width: '70%' }]} />
            <View style={[styles.previewLine, { backgroundColor: themeColors.textSecondary, width: '50%' }]} />
          </View>
        </View>
        <Text style={[styles.themeName, { color: isSelected ? theme.details : theme.text }]}>
          {themeLabels[themeKey]}
        </Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.details }]}>
            <Ionicons name="checkmark" size={16} color={theme.textButtons} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: "100%" }}>
      <CustomButton
        onPress={openModal}
        placeholder={`${t("changeTheme")}: ${themeLabels[themeName]}`}
        styleType={1}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              { 
                backgroundColor: theme.modalBackground,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {t("selectTheme")}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.themesContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.themesGrid}
            >
              {([
                "light",
                "dark",
                "1984",
                "gollum",
                "dracula",
                "gatsby",
                "maravilhas",
                "odisseia",
                "orgulhoEPreconceito",
                "ulisses",
                "amado",
                "fahrenheit451",
                "duna",
                "belaEAFera",
              ] as ThemeName[]).map((themeKey) => (
                <ThemePreview key={themeKey} themeKey={themeKey} />
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: "80%",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  themesContainer: {
    maxHeight: 400,
  },
  themesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 10,
  },
  themeCard: {
    width: (width * 0.9 - 60) / 2,
    marginBottom: 15,
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themePreview: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 8,
  },
  previewHeader: {
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  previewContent: {
    flex: 1,
    padding: 8,
    justifyContent: "space-around",
  },
  previewLine: {
    height: 3,
    borderRadius: 2,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomThemeButton;

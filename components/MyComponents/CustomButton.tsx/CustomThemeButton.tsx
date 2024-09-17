import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useTheme, ThemeName } from "../../../constants/temas/ThemeContext";
import CustomButton from "./CustomButton";

const CustomThemeButton: React.FC = () => {
  const { theme, setThemeName, themeName } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleThemeChange = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    setModalVisible(false);
  };

  return (
    <View style={{ width: "100%" }}>
      <CustomButton
        onPress={() => setModalVisible(true)}
        placeholder={`Change Theme: ${themeName}`}
        styleType={1}
      ></CustomButton>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.modalBackground },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.text }]}>
              Select a Theme
            </Text>
            {(
              [
                "light",
                "dark",
                "1984",
                "gollum",
                "dracula",
                "gatsby",
                "wonderland",
                "odyssey",
                "pridePrejudice",
                "ulysses",
                "beloved",
                "fahrenheit451",
                "dune",
                "beautyAndBeast",
              ] as ThemeName[]
            ).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.button}
                onPress={() => handleThemeChange(themeOption)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        themeOption === themeName ? theme.details : theme.text,
                    },
                  ]}
                >
                  {themeOption}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[{ backgroundColor: theme.errorColor }, styles.button]}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 30,
    paddingHorizontal: 35,
    justifyContent: "center",
    width: "100%",
    flexShrink: 1, // Permite que os botões encolham igualmente
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  textDefault: {
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomThemeButton;

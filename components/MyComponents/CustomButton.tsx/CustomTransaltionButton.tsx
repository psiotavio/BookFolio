import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importando AsyncStorage
import { useDictionary } from "../../../contexts/DictionaryContext"; // Hook de tradução
import CustomButton from "./CustomButton";

const CustomTranslationButton: React.FC = () => {
  const { language, setLanguage, t } = useDictionary(); // Adicionando tradução
  const [modalVisible, setModalVisible] = useState(false);

  // Função para salvar a linguagem selecionada no AsyncStorage
  const saveLanguageToStorage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem("selectedLanguage", newLanguage);
    } catch (error) {
      console.error("Erro ao salvar idioma no AsyncStorage", error);
    }
  };

  // Função para mudar a linguagem e salvar no AsyncStorage
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    saveLanguageToStorage(newLanguage);
    setModalVisible(false);
  };

  // Função para carregar o idioma salvo no AsyncStorage
  const loadLanguageFromStorage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (savedLanguage) {
        setLanguage(savedLanguage); // Define o idioma salvo
      }
    } catch (error) {
      console.error("Erro ao carregar idioma do AsyncStorage", error);
    }
  };

  // Carregar o idioma salvo quando o componente for montado
  useEffect(() => {
    loadLanguageFromStorage();
  }, []);

  const languageLabels: Record<string, string> = {
    pt: t("portugues"),
    en: t("ingles"),
    es: t("espanhol"),
    fr: t("frances"),
  };

  return (
    <View style={{ width: "100%" }}>
      <CustomButton
        onPress={() => setModalVisible(true)}
        placeholder={`${t("changeLanguage")}: ${languageLabels[language]}`} // Exibe o idioma atual
        styleType={1}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{t("selectLanguage")}</Text>

            {["pt", "en", "es", "fr"].map((languageOption) => (
              <TouchableOpacity
                key={languageOption}
                style={styles.button}
                onPress={() => handleLanguageChange(languageOption)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color:
                        languageOption === language ? "#FF5733" : "#000", // Destaque para o idioma selecionado
                    },
                  ]}
                >
                  {languageLabels[languageOption]}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[{ backgroundColor: "#D32F2F" }, styles.button]}
            >
              <Text style={styles.buttonText}>{t("close")}</Text>
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
    backgroundColor: "#FFF",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomTranslationButton;

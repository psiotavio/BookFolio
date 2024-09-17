import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDictionary } from "../../../contexts/DictionaryContext"; // Hook de tradução
import CustomButton from "./CustomButton";

const CustomTranslationButton: React.FC = () => {
  const { language, setLanguage } = useDictionary();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setModalVisible(false);
  };

  const languageLabels: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
    fr: "Francês",
  };

  return (
    <View style={{ width: "100%" }}>
      <CustomButton
        onPress={() => setModalVisible(true)}
        placeholder={`Mudar Idioma: ${languageLabels[language]}`} // Exibe o idioma atual
        styleType={1}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent]}>
            <Text style={styles.modalText}>Selecione um Idioma</Text>

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

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useTheme, ThemeName } from "../../../constants/temas/ThemeContext";
import CustomButton from "./CustomButton";
import { useDictionary } from "@/contexts/DictionaryContext"; // Importando o hook de tradução

const CustomThemeButton: React.FC = () => {
  const { theme, setThemeName, themeName } = useTheme();
  const { t } = useDictionary(); // Usando o hook de tradução
  const [modalVisible, setModalVisible] = useState(false);

  const handleThemeChange = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    setModalVisible(false);
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

  return (
    <View style={{ width: "100%" }}>
      <CustomButton
        onPress={() => setModalVisible(true)}
        placeholder={`${t("changeTheme")}: ${themeLabels[themeName]}`} // Usando o nome legível do tema atual
        styleType={1}
      />

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
              {t("selectTheme")}
            </Text>
            {(
              [
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
                  {themeLabels[themeOption]}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[{ backgroundColor: theme.errorColor }, styles.button]}
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

export default CustomThemeButton;

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../constants/temas/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import CustomThemeButton from "@/components/MyComponents/CustomButton.tsx/CustomThemeButton";
import CustomButton from "../../components/MyComponents/CustomButton.tsx/CustomButton";
import { useUser } from "../../contexts/UserContext";
import ReadingProgress from "../../components/MyComponents/ProgressBar/ProgressBar";
import CustomTranslationButton from "@/components/MyComponents/CustomButton.tsx/CustomTransaltionButton";
import { useDictionary } from "@/contexts/DictionaryContext"; // Adicionando o hook de tradução

export default function TabTwoScreen() {
  const { theme } = useTheme();
  const { t } = useDictionary(); // Hook para tradução
  const { livrosLidos, biblioteca, updateLivroReview, clearAll } = useUser();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SafeAreaView
      edges={["top"]}
      style={[
        styles.view,
        { backgroundColor: theme.background, paddingVertical: 10 },
      ]}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/logo3.png")}
            style={styles.logo}
          />
        </View>

        {showSettings ? (
          <View style={styles.settingsContainer}>
            <CustomThemeButton />
            <CustomTranslationButton />
            <CustomButton
              onPress={clearAll}
              placeholder={t("resetAccount")} // Usando tradução
              styleType={1}
            />
            <CustomButton
              onPress={() => setShowSettings(false)}
              placeholder={t("back")} // Usando tradução
              styleType={2}
            />
            <View style={styles.anuncioSection}>
              <CustomButton
                onPress={() => {}}
                placeholder={t("testAd")} // Usando tradução
                styleType={3}
              />
            </View>
          </View>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity
              style={styles.cogButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <FontAwesome name="cog" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>
              {t("profile")} {/* Usando tradução */}
            </Text>
            <ScrollView style={styles.progressSection}>
              <ReadingProgress />
            </ScrollView>
            <View style={styles.anuncioSection}>
              <CustomButton
                onPress={() => {}}
                placeholder={t("testAd")} // Usando tradução
                styleType={3}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    alignItems: "center",
  },
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    top: 30,
  },
  logo: {
    marginVertical: 5,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    margin: "auto",
  },
  buttonsContainer: {
    width: "70%",
  },
  progressSection: {
    marginTop: "10%",
    width: "90%",
  },
  settingsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "75%",
    margin: "auto",
  },
  cogButton: {
    position: "absolute",
    top: -100,
    right: 5,
    padding: 20,
  },
  anuncioSection: {
    height: 70,
    backgroundColor: "grey",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexShrink: 1,
    width: "100%",
  },
});

import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Modal } from "react-native";
import { ProgressBar as PaperProgressBar } from "react-native-paper";
import CustomButton from "../CustomButton.tsx/CustomButton";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import { useDictionary } from "../../../contexts/DictionaryContext"; // Hook para tradução

interface ProgressBarProps {
  title: string;
  goal: number;
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ title, goal, progress }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.progressBarContainer}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <PaperProgressBar
        progress={progress / goal}
        style={styles.progressBar}
        color={theme.details}
      />
      <Text style={styles.indicator}>
        {progress}/{goal}
      </Text>
    </View>
  );
};

const ReadingProgress: React.FC = () => {
  const { livrosLidos } = useUser();
  const { t } = useDictionary(); // Hook de traduções
  const [yearGoal, setYearGoal] = useState(365);
  const [monthGoal, setMonthGoal] = useState(30);
  const [weekGoal, setWeekGoal] = useState(7);

  const calculateBooksRead = (
    books: { LidoQuando?: Date }[],
    timeFrame: "year" | "month" | "week"
  ) => {
    const now = new Date();
    return books.filter((book) => {
      if (!book.LidoQuando) return false;
      const dateRead = new Date(book.LidoQuando);
      if (timeFrame === "year") {
        return dateRead.getFullYear() === now.getFullYear();
      }
      if (timeFrame === "month") {
        return (
          dateRead.getFullYear() === now.getFullYear() &&
          dateRead.getMonth() === now.getMonth()
        );
      }
      if (timeFrame === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return dateRead > oneWeekAgo;
      }
      return false;
    }).length;
  };

  const yearProgress = calculateBooksRead(livrosLidos, "year");
  const monthProgress = calculateBooksRead(livrosLidos, "month");
  const weekProgress = calculateBooksRead(livrosLidos, "week");

  const [modalVisible, setModalVisible] = useState(false);
  const [newYearGoal, setNewYearGoal] = useState(String(yearGoal));
  const [newMonthGoal, setNewMonthGoal] = useState(String(monthGoal));
  const [newWeekGoal, setNewWeekGoal] = useState(String(weekGoal));

  const { theme } = useTheme();

  const openModal = () => {
    setNewYearGoal(String(yearGoal));
    setNewMonthGoal(String(monthGoal));
    setNewWeekGoal(String(weekGoal));
    setModalVisible(true);
  };

  const saveGoals = () => {
    setYearGoal(parseInt(newYearGoal));
    setMonthGoal(parseInt(newMonthGoal));
    setWeekGoal(parseInt(newWeekGoal));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        title={t("yearBooksRead")} // Traduzido
        goal={yearGoal}
        progress={yearProgress}
      />
      <ProgressBar
        title={t("monthBooksRead")} // Traduzido
        goal={monthGoal}
        progress={monthProgress}
      />
      <ProgressBar
        title={t("weekBooksRead")} // Traduzido
        goal={weekGoal}
        progress={weekProgress}
      />

      <CustomButton
        onPress={openModal}
        placeholder={t("adjustGoalsButton")} // Traduzido
        styleType={1}
      />

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.modalBackground },
            ]}
          >
            <Text style={[styles.textTitle, { color: theme.text }]}>
              {t("adjustGoals")} {/* Traduzido */}
            </Text>
            <Text style={[styles.textTitleInput, { color: theme.text }]}>
              {t("annualGoal")} {/* Traduzido */}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              keyboardType="number-pad"
              value={newYearGoal}
              onChangeText={setNewYearGoal}
              placeholder={t("annualGoal")} // Traduzido
              selectionColor={theme.details}
              placeholderTextColor={theme.text}
            />
            <Text style={[styles.textTitleInput, { color: theme.text }]}>
              {t("monthlyGoal")} {/* Traduzido */}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              keyboardType="number-pad"
              value={newMonthGoal}
              onChangeText={setNewMonthGoal}
              placeholder={t("monthlyGoal")} // Traduzido
              selectionColor={theme.details}
              placeholderTextColor={theme.text}
            />
            <Text style={[styles.textTitleInput, { color: theme.text }]}>
              {t("weeklyGoal")} {/* Traduzido */}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              keyboardType="number-pad"
              value={newWeekGoal}
              onChangeText={setNewWeekGoal}
              placeholder={t("weeklyGoal")} // Traduzido
              selectionColor={theme.details}
              placeholderTextColor={theme.text}
            />

            <View style={styles.buttonsContainer}>
              <CustomButton
                onPress={saveGoals}
                placeholder={t("save")} // Traduzido
                styleType={1}
              />
              <CustomButton
                onPress={() => setModalVisible(false)}
                placeholder={t("cancel")} // Traduzido
                styleType={2}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  progressBarContainer: {
    marginVertical: 10,
    gap: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  textTitle: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  textTitleInput: {
    marginVertical: 5,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: -2,
  },
  progressBar: {
    height: 20,
    borderRadius: 100,
  },
  indicator: {
    fontSize: 16,
    color: "#555",
    alignSelf: "center",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 30,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 25,
    gap: 15,
  },
});

export default ReadingProgress;

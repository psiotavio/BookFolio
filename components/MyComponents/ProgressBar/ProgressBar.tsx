import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Animated, Dimensions } from "react-native";
import { ProgressBar as PaperProgressBar } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../CustomButton.tsx/CustomButton";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import { useDictionary } from "../../../contexts/DictionaryContext"; // Hook para tradução

const { width } = Dimensions.get('window');

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
  const [fadeAnim] = useState(new Animated.Value(0));

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

  const saveGoals = () => {
    setYearGoal(parseInt(newYearGoal));
    setMonthGoal(parseInt(newMonthGoal));
    setWeekGoal(parseInt(newWeekGoal));
    closeModal();
  };

  const GoalInput = ({ 
    label, 
    value, 
    onChangeText, 
    icon, 
    placeholder 
  }: { 
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
  }) => (
    <View style={styles.goalInputContainer}>
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={20} color={theme.details} />
        <Text style={[styles.inputLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.goalInput,
          { 
            backgroundColor: theme.modalBackgroundSecondary,
            color: theme.text,
            borderColor: theme.borderBottom,
          }
        ]}
        keyboardType="number-pad"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.details}
      />
    </View>
  );

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

      <Modal visible={modalVisible} transparent={true} animationType="fade">
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
                {t("adjustGoals")}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputsContainer}>
              <GoalInput
                label={t("annualGoal")}
                value={newYearGoal}
                onChangeText={setNewYearGoal}
                icon="calendar"
                placeholder="365"
              />
              <GoalInput
                label={t("monthlyGoal")}
                value={newMonthGoal}
                onChangeText={setNewMonthGoal}
                icon="calendar-outline"
                placeholder="30"
              />
              <GoalInput
                label={t("weeklyGoal")}
                value={newWeekGoal}
                onChangeText={setNewWeekGoal}
                icon="today"
                placeholder="7"
              />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: theme.details }]}
                onPress={saveGoals}
              >
                <Ionicons name="checkmark" size={20} color={theme.textButtons} />
                <Text style={[styles.saveButtonText, { color: theme.textButtons }]}>
                  {t("save")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.modalBackgroundSecondary }]}
                onPress={closeModal}
              >
                <Ionicons name="close" size={20} color={theme.text} />
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>
                  {t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 87, 51, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  inputsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  goalInputContainer: {
    marginBottom: 20,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  goalInput: {
    height: 50,
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonsContainer: {
    flexDirection: "row",
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ReadingProgress;

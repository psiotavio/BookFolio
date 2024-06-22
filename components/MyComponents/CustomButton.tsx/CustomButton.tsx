// CustomButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../../constants/temas/ThemeContext";

interface CustomButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  placeholder: string;
  styleType: number;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  placeholder,
  styleType,
  ...rest
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (type: number): ViewStyle => {
    switch (type) {
      case 1:
        return { backgroundColor: theme.details || "#2196F3" }; // Exemplo de uso do tema
      case 2:
        return { backgroundColor: theme.modalBackgroundSecondary || "#4CAF50" }; // Ajuste conforme sua definição de tema
      case 3:
        return { backgroundColor: theme.amazon || "#FF5722" }; // Ajuste conforme sua definição de tema
      case 4:
        return { backgroundColor: theme.details || "#9C27B0" }; // Ajuste conforme sua definição de tema
      default:
        return { backgroundColor: theme.details || "gray" }; // Fallback para uma cor default
    }
  };

  return (
    <TouchableOpacity
      style={[styles.buttonBase, getButtonStyle(styleType)]}
      onPress={onPress}
      {...rest}
    >
      <Text style={styles.textBase}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 30,
    paddingHorizontal: 35,
    justifyContent: "center",
    width:"100%",
    flexShrink: 1, // Permite que os botões encolham igualmente
  },
  textBase: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;

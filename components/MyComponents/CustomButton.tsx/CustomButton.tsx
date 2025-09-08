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
  size?: 'xs' | 'small' | 'medium' | 'large';
  fontSize?: number;
  height?: number;
  fullWidth?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  placeholder,
  styleType,
  size = 'medium',
  fontSize,
  height,
  fullWidth = true,
  ...rest
}) => {
  const { theme } = useTheme();

  const getSizeConfig = () => {
    switch (size) {
      case 'xs':
        return { padding: 6, paddingHorizontal: 12, fontSize: fontSize || 10 };
      case 'small':
        return { padding: 8, paddingHorizontal: 20, fontSize: fontSize || 12 };
      case 'large':
        return { padding: 16, paddingHorizontal: 40, fontSize: fontSize || 18 };
      default: // medium
        return { padding: 12, paddingHorizontal: 35, fontSize: fontSize || 16 };
    }
  };

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

  const sizeConfig = getSizeConfig();

  return (
    <TouchableOpacity
      style={[
        styles.buttonBase, 
        getButtonStyle(styleType),
        {
          padding: sizeConfig.padding,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          height: height || undefined,
          width: fullWidth ? '100%' : 'auto',
          alignSelf: fullWidth ? 'stretch' : 'center',
        }
      ]}
      onPress={onPress}
      {...rest}
    >
      <Text style={[styles.textBase, { fontSize: sizeConfig.fontSize }]}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    marginVertical: 5,
    borderRadius: 30,
    justifyContent: "center",
    flexShrink: 1, // Permite que os botões encolham igualmente
  },
  textBase: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomButton;

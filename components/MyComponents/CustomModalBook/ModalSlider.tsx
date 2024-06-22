import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import SliderReview from "../SliderReview/SliderReview"; // Verifique o caminho se está correto
import { useTheme } from "../../../constants/temas/ThemeContext";
import CustomButton from "../CustomButton.tsx/CustomButton";
import FiveStarReview from "../FiveStarComponent/FiveStarComponent";

interface ModalSliderReviewProps {
  isVisible: boolean;
  currentRating: number;
  onSave: (rating: number) => void;
  onClose: () => void;
}

const ModalSliderReview: React.FC<ModalSliderReviewProps> = ({
  isVisible,
  currentRating,
  onSave,
  onClose,
}) => {
  const [rating, setRating] = useState(currentRating);

  const handleSave = () => {
    onSave(rating); // Executa função onSave passada como prop para salvar a avaliação
    onClose(); // Fecha o modal
  };

  const { theme } = useTheme();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View
          style={[styles.modalView, { backgroundColor: theme.modalBackground }]}
        >
          <Text style={[styles.modalText, { color: theme.text }]}>
            Avalie o Livro
          </Text>
          <View style={{transform: 'scale(1.3)'}}>
          <FiveStarReview rating={rating} />
          </View>
          <SliderReview
            value={rating}
            onChange={setRating} // Passa setRating diretamente para atualizar o rating
          />
          <CustomButton
           onPress={handleSave}
            placeholder={"Confirmar"}
            styleType={1}
          />
          <CustomButton
           onPress={onClose}
            placeholder={"Cancelar"}
            styleType={1}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default ModalSliderReview;

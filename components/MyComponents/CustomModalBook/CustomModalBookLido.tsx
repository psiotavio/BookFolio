import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Livro } from "../../../interfaces/Livro"; // Importando o tipo Livro
import CustomButton from "../CustomButton.tsx/CustomButton";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import CustomPhoto from "../CustomPhoto/CustomPhoto";
import FiveStarReview from "../FiveStarComponent/FiveStarComponent";
import SliderReview from "../SliderReview/SliderReview";
import { LinearGradient } from "expo-linear-gradient";

interface CustomModalBookProps {
  isVisible: boolean;
  book: Livro | null;
  onClose: () => void;
  currentRating: number;
  onSave: (rating: number) => void;
}

const CustomModalBookLido: React.FC<CustomModalBookProps> = ({
  isVisible,
  book,
  onClose,
  currentRating,
  onSave,
}) => {
  const { addLivroLido, addLivroBiblioteca } = useUser();
  const [rating, setRating] = useState(currentRating);
  const { theme, themeName } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!book) {
    return null;
  }

  const handleSave = () => {
    onSave(rating); // Executa função onSave passada como prop para salvar a avaliação
    onClose(); // Fecha o modal
  };

  const handleBuyOnAmazon = () => {
    if (book.amazonLink) {
      Linking.openURL(book.amazonLink);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const truncatedDescription =
    book.description!.length > 400
      ? book.description!.substring(0, 400) + "..."
      : book.description;

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.modalBackground },
        ]}
      >
        <ScrollView
          style={[
            styles.modalScrollViewContent,
            { backgroundColor: theme.modalBackground },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.modalBackground },
            ]}
          >
            <View style={styles.bookHeader}>
              <CustomPhoto
                uri={
                  book.imageLinks?.thumbnail! ||
                  book.imageLinks?.smallThumbnail! ||
                  "https://via.placeholder.com/150"
                }
                type={1}
              ></CustomPhoto>
              <View style={styles.bookTitleAndAuthors}>
                <Text style={[styles.bookTitle, { color: theme.text }]}>
                  {book.title}
                </Text>
                <Text style={[styles.bookAuthors, { color: theme.text }]}>
                  {book.authors.join(", ")}
                </Text>
                <CustomButton
                  onPress={handleBuyOnAmazon}
                  placeholder="Comprar na Amazon"
                  styleType={3}
                />
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={[styles.bookDescription, { color: theme.text }]}>
                {isExpanded ? book.description : truncatedDescription}
              </Text>
              {!isExpanded && book.description!.length > 400 && (
                <View>
                <LinearGradient
                  colors={["transparent", theme.text]}
                  style={styles.gradient}
                >
                </LinearGradient>
                  <TouchableOpacity onPress={toggleExpansion}>
                    <Text style={[styles.readMore, { color: theme.text }]}>
                      Ver mais
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isExpanded && (
                <TouchableOpacity onPress={toggleExpansion}>
                  <Text style={[styles.readMore, { color: theme.text }]}>
                    Ver menos
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.bookDetails, { color: theme.text }]}>
            Editora: {book.publisher}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              Lançamento: {book.publishedDate}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              Páginas: {book.pageCount}
            </Text>


            <View style={styles.ratingSection}>
              <Text
                style={{ color: theme.text, fontSize: 20, fontWeight: "bold" }}
              >
                Avalie o Livro
              </Text>
              <View style={{ transform: "scale(1.3)" }}>
                <FiveStarReview rating={rating} />
              </View>
              <SliderReview
                value={rating}
                onChange={setRating} // Passa setRating diretamente para atualizar o rating
              />
              <View style={styles.modalButtonsContainer}>
                <CustomButton
                  onPress={onClose}
                  placeholder={"Cancelar"}
                  styleType={2}
                />
                <CustomButton
                  onPress={handleSave}
                  placeholder={"Confirmar"}
                  styleType={1}
                />
              </View>
            </View>

            <View style={styles.anuncioSection}>
              <CustomButton
                onPress={() => {}}
                placeholder={"TESTE ANUNCIO"}
                styleType={3}
              ></CustomButton>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalScrollViewContent: {
    height: "55%",
    width: "100%",
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  bookCover: {
    width: 130,
    height: 200,
    resizeMode: "cover",
    marginBottom: 20,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    flexWrap: "wrap",
    width: "65%",
  },
  bookAuthors: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  bookDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify",
  },
  bookDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  modalButtonsContainer: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 20,
  },
  bookHeader: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    gap: 15,
    alignItems: "center",
  },
  bookTitleAndAuthors: {
    gap: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    display: "flex",
  },
  ratingSection: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    gap: 10,
  },
  descriptionContainer: {
    position: "relative",
    marginBottom: 10,
  },
  gradient: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    height: 100,
    opacity: 0.3
  },
  readMore: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 4,
  },

  anuncioSection: {
    height: 70,
    backgroundColor: "grey",
    marginVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomModalBookLido;

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
import { Ionicons } from "@expo/vector-icons"; // Importando o ícone do lixo
import { useDictionary } from "../../../contexts/DictionaryContext"; // Hook de tradução

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
  const { removeLivroLido } = useUser(); // Usar a função de remover livro
  const [rating, setRating] = useState(currentRating);
  const { theme } = useTheme();
  const { t } = useDictionary(); // Hook de tradução
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

  const handleRemoveBook = () => {
    removeLivroLido(book.id); // Remove o livro da lista de lidos
    onClose(); // Fecha o modal após a remoção
  };

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
            {/* Ícone de remover no canto superior direito */}
            <TouchableOpacity
              style={styles.trashIcon}
              onPress={handleRemoveBook}
            >
              <Ionicons name="trash" size={24} color={theme.errorColor} />
            </TouchableOpacity>

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
                  placeholder={t("buyOnAmazon")} // Tradução
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
                  />
                  <TouchableOpacity onPress={toggleExpansion}>
                    <Text style={[styles.readMore, { color: theme.text }]}>
                      {t("showMore")} {/* Tradução */}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isExpanded && (
                <TouchableOpacity onPress={toggleExpansion}>
                  <Text style={[styles.readMore, { color: theme.text }]}>
                    {t("showLess")} {/* Tradução */}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("publisher")}: {book.publisher} {/* Tradução */}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("releaseDate")}: {book.publishedDate} {/* Tradução */}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("pageCount")}: {book.pageCount} {/* Tradução */}
            </Text>

            <View style={styles.ratingSection}>
              <Text
                style={{ color: theme.text, fontSize: 20, fontWeight: "bold" }}
              >
                {t("rateBook")}
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
                  placeholder={t("cancel")}
                  styleType={2}
                />
                <CustomButton
                  onPress={handleSave}
                  placeholder={t("confirm")}
                  styleType={1}
                />
              </View>
            </View>

            {/* <View style={styles.anuncioSection}>
              <CustomButton
                onPress={() => {}}
                placeholder={t("testAd")} // Tradução
                styleType={3}
              ></CustomButton>
            </View> */}
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
  trashIcon: {
    position: "absolute",
    top: 30,
    right: 35,
    zIndex: 1,
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
    opacity: 0.3,
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
  modalButtonsContainer: {
    alignSelf: "center",
    flexDirection: "row",
    gap: 20,
  },
});

export default CustomModalBookLido;

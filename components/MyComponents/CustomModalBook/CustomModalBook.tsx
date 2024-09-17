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
import { LinearGradient } from "expo-linear-gradient";
import { useDictionary } from "../../../contexts/DictionaryContext";

interface CustomModalBookProps {
  isVisible: boolean;
  book: Livro | null;
  onClose: () => void;
  AddToLibrary?: boolean;
  removeFromLibrary?: boolean;
  removeFromRecommended?: boolean;
}

const CustomModalBook: React.FC<CustomModalBookProps> = ({
  isVisible,
  book,
  onClose,
  AddToLibrary = true,
  removeFromLibrary = false,
  removeFromRecommended = false,
}) => {
  const {
    addLivroLido,
    addLivroBiblioteca,
    removeLivroBiblioteca,
    removeLivroRecomendados,
  } = useUser();
  const { theme } = useTheme();
  const { t } = useDictionary();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!book) {
    return null;
  }

  const handleBuyOnAmazon = () => {
    if (book.amazonLink) {
      console.log(book.amazonLink);
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
                  placeholder={t("buyOnAmazon")} // Tradução integrada
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
                  ></LinearGradient>
                  <TouchableOpacity onPress={toggleExpansion}>
                    <Text style={[styles.readMore, { color: theme.text }]}>
                      {t("showMore")} {/* Tradução integrada */}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isExpanded && (
                <TouchableOpacity onPress={toggleExpansion}>
                  <Text style={[styles.readMore, { color: theme.text }]}>
                    {t("showLess")} {/* Tradução integrada */}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("publisher")}: {book.publisher} {/* Tradução integrada */}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("releaseDate")}: {book.publishedDate} {/* Tradução integrada */}
            </Text>
            <Text style={[styles.bookDetails, { color: theme.text }]}>
              {t("pageCount")}: {book.pageCount} {/* Tradução integrada */}
            </Text>

            <View style={styles.modalButtonsContainerDetails}>
              {AddToLibrary === false && (
                <>
                  <CustomButton
                    onPress={() => {
                      addLivroLido(book);
                      onClose();
                      if (removeFromLibrary === true) {
                        removeLivroBiblioteca(book.id);
                      }
                      if (removeFromRecommended === true) {
                        removeLivroRecomendados(book.id);
                      }
                    }}
                    placeholder={t("read")} // Tradução integrada
                    styleType={1}
                  />
                  <CustomButton
                    onPress={onClose}
                    placeholder={t("close")} // Tradução integrada
                    styleType={2}
                  />
                </>
              )}

              {AddToLibrary === true && (
                <>
                  <CustomButton
                    onPress={() => {
                      addLivroBiblioteca(book);
                      onClose();
                      if (removeFromRecommended === true) {
                        removeLivroRecomendados(book.id);
                      }
                    }}
                    placeholder={t("readLater")} // Tradução integrada
                    styleType={1}
                  />
                  <CustomButton
                    onPress={onClose}
                    placeholder={t("close")} // Tradução integrada
                    styleType={2}
                  />
                </>
              )}
            </View>

            {/* <View style={styles.anuncioSection}>
              <CustomButton
                onPress={() => {}}
                placeholder={t("testAd")} // Tradução integrada
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
    width: "100%",
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
    marginVertical: 10,
  },
  modalButtonsContainerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    gap: 15,
  },
  bookHeader: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
  },
  bookTitleAndAuthors: {
    width: "70%",
    gap: 5,
    flexDirection: "column",
    alignItems: "flex-start",
    display: "flex",
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
});

export default CustomModalBook;

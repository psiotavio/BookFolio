import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../constants/temas/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Livro } from "../../interfaces/Livro";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomModalBook from "../../components/MyComponents/CustomModalBook/CustomModalBook";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import { useDictionary } from "@/contexts/DictionaryContext"; // Adicionando o hook de tradução
import { fetchBookRecommendationsByGenre } from "@/services/BookService";

export default function Recomendations() {
  const { theme } = useTheme();
  const { t } = useDictionary(); // Hook de traduções
  const { livrosRecomendados } = useUser();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recommendedBooks, setRecommendedBooks] =
    useState<Livro[]>(livrosRecomendados);
  const [selectedGenre, setSelectedGenre] = useState(t("recomendadoParaVoce"));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedGenre === t("recomendadoParaVoce")) {
        setRecommendedBooks(livrosRecomendados); // Mostrar lista atual de livros recomendados
        return;
      }
      setLoading(true);
      const books = await fetchBookRecommendationsByGenre([selectedGenre]);
      setRecommendedBooks(books);
      setLoading(false);
    };

    fetchRecommendations();
  }, [selectedGenre]);

  const loadMoreBooks = async () => {
    if (loading || selectedGenre === t("recomendadoParaVoce")) return;

    setLoading(true);
    try {
      const newPage = page + 1;
      const books = await fetchBookRecommendationsByGenre(
        [selectedGenre],
        newPage
      );
      setRecommendedBooks((prevBooks) => [...prevBooks, ...books]);
      setPage(newPage);
    } catch (error) {
      console.error(t("carregandoMaisLivros"), error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookPress = (book: Livro) => {
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  const renderBookItem = ({ item }: { item: Livro }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <View style={{ marginHorizontal: 5, alignItems: "center" }}>
        <CustomPhoto
          uri={
            item.imageLinks?.thumbnail ||
            item.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/150"
          }
          type={3}
        />
      </View>
    </TouchableOpacity>
  );

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

        <View style={styles.recommendedView}>
          <View style={styles.recommendedFilterSection}>
            <Text style={[styles.listTitle, { color: theme.text }]}>
              {t("livrosRecomendados")}
            </Text>
            <View style={{ width: "80%", alignSelf: "center" }}>
              <View
                style={[
                  styles.recomendationButton,
                  { backgroundColor: theme.details },
                ]}
              >
                <Text style={[styles.buttonText, { color: theme.textButtons }]}>
                  {t("recomendadosParaVoce")}
                </Text>
              </View>
            </View>
          </View>
          <FlatList
            data={recommendedBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={styles.list}
            contentContainerStyle={styles.containerGrid}
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreBooks}
            ListFooterComponent={() =>
              loading ? (
                <ActivityIndicator size="large" color={theme.text} />
              ) : null
            }
            ListEmptyComponent={() => (
              <Text style={[styles.emptyMessage, { color: theme.text }]}>
                {t("nenhumLivroEncontrado")}
              </Text>
            )}
          />
        </View>
      </View>
      {selectedBook && (
        <CustomModalBook
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          removeFromRecommended={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
    alignItems: "center",
    zIndex: 9999,
  },
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  containerGrid: {
    justifyContent: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  logo: {
    marginVertical: 5,
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  booksList: {
    alignContent: "flex-start",
    width: "100%",
    display: "flex",
    flex: 1,
  },
  listTitle: {
    marginHorizontal: 10,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },

  list: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  bookItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 16,
  },
  bookCover: {
    width: 125,
    height: 180,
    resizeMode: "cover",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  recommendedView: {
    flex: 1,
    marginBottom: -25,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  recommendedFilterSection: {
    paddingHorizontal: 10,
    flexDirection: "column",
    gap: 20,
  },
  recomendationButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

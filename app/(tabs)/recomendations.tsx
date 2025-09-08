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
import UnifiedBookModal from "../../components/MyComponents/CustomModalBook/UnifiedBookModal";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import { useDictionary } from "@/contexts/DictionaryContext"; // Adicionando o hook de tradução
import { fetchBookRecommendationsByAuthor } from "@/services/BookService";
import EmptyState from "../../components/MyComponents/EmptyState/EmptyState";
import { useNavigationContext } from "../../contexts/NavigationContext";

export default function Recomendations() {
  const { theme } = useTheme();
  const { t, language } = useDictionary(); // Hook de traduções com idioma
  const { livrosRecomendados, livrosLidos } = useUser();
  const { setShouldFocusSearchBar, setShouldNavigateToHome } = useNavigationContext();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);

  const authors = [
    ...new Set(livrosRecomendados.map((livro) => livro.authors[0])),
  ]; // Pega os autores únicos

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const books = await fetchBookRecommendationsByAuthor(
        authors, // Array de autores dos livros lidos
        livrosLidos, // Lista de livros lidos
        language // Linguagem selecionada no app
      );
      setRecommendedBooks(books); // Define os livros recomendados
    } catch (error) {
      console.error("Erro ao buscar recomendações", error);
    } finally {
      setLoading(false);
    }
  };

  // Quando a linguagem ou a lista de livros lidos mudar, redefine a lista e busca novos livros
  useEffect(() => {
    setRecommendedBooks([]); // Reseta a lista de livros recomendados
    fetchRecommendations(); // Busca novos livros recomendados com a nova linguagem
  }, [language, livrosLidos]); // A linguagem e os livros lidos afetam a busca

  const handleBookPress = (book: Livro) => {
    console.log(`📖 LIVRO SELECIONADO: "${book.title}"`);
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
          
          {livrosLidos.length === 0 ? (
            <EmptyState
              icon="bulb-outline"
              title={t('empty.recommendations.title')}
              subtitle={t('empty.recommendations.subtitle')}
              actionText={t('empty.recommendations.action')}
              onAction={() => {
                // Navegar para a tela home e focar na SearchBar
                setShouldFocusSearchBar(true);
                setShouldNavigateToHome(true);
              }}
            />
          ) : (
            <FlatList
              data={[...recommendedBooks].reverse()} // Reverte a ordem dos itens
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              style={styles.list}
              contentContainerStyle={styles.containerGrid}
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
          )}
        </View>
      </View>
      {selectedBook && (
        <UnifiedBookModal
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          modalType="view"
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
  logo: {
    marginVertical: 5,
    width: 72,
    height: 72,
    resizeMode: "contain",
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

import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../constants/temas/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Livro } from "../../interfaces/Livro";
import { SafeAreaView } from "react-native-safe-area-context";
import UnifiedBookModal from "../../components/MyComponents/CustomModalBook/UnifiedBookModal";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import CustomRating from "../../components/MyComponents/CustomRating/CustomRating";
import { useDictionary } from "@/contexts/DictionaryContext";
import EmptyState from "../../components/MyComponents/EmptyState/EmptyState";
import { useNavigationContext } from "../../contexts/NavigationContext";
import CustomButton from "../../components/MyComponents/CustomButton.tsx/CustomButton";

export default function Library() {
  const { t } = useDictionary(); // Hook de traduções
  const { theme } = useTheme();
  const { biblioteca, livrosLidos, livrosLendo, updateLivroReview } = useUser();
  const { setShouldFocusSearchBar, setShouldNavigateToHome } = useNavigationContext();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showBest, setShowBest] = useState(false); // Estado para o toggle "Melhores"
  const [view, setView] = useState<"Lidos" | "Quero ler" | "Lendo">(
    "Quero ler"
  ); // Estado para alternar entre "Lidos", "Quero ler" e "Lendo"

  const handleBookPress = (book: Livro) => {
    console.log(`📖 LIVRO SELECIONADO: "${book.title}"`);
    setSelectedBook(book);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
  };

  const handleSaveRating = (newRating: number) => {
    if (selectedBook) {
      updateLivroReview(selectedBook.id, newRating);
    }
    closeModal();
  };

  const renderBookItemLidos = ({
    item,
    index,
  }: {
    item: Livro;
    index: number;
  }) => (
    <TouchableOpacity
      onPress={() => handleBookPress(item)}
      style={styles.bookListContainer}
    >
      <View style={styles.bookListContent}>
        <View style={styles.photoAndNumber}>
          <Text style={[styles.bestText, { color: theme.textButtons }]}>
            {index + 1}{t('sufixoNumero')}
          </Text>
          <CustomPhoto
            uri={
              item.imageLinks?.thumbnail ||
              item.imageLinks?.smallThumbnail ||
              "https://via.placeholder.com/150"
            }
            type={1}
          />
        </View>

        <View style={styles.bookInfoContainer}>
          <Text style={[styles.bookTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <CustomRating
              value={item.Review ?? 0}
              onRatingChange={() => {}}
              size={20}
              color="#FFD700"
              emptyColor="#CCCCCC"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBookItemBiblioteca = ({ item }: { item: Livro }) => (
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

  const orderBooks = (books: Livro[]) => {
    if (showBest) {
      return [...books].sort((a, b) => (b.Review ?? 0) - (a.Review ?? 0));
    }
    return books;
  };

  const orderedBooks = orderBooks(livrosLidos);

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

        <View style={styles.toggleContainer}>
          <CustomButton
            onPress={() => {
              setView("Lidos"), setShowBest(true);
            }}
            placeholder={t('lidos')}
            styleType={view === "Lidos" ? 1 : 2}
            size="small"
            //fullWidth={false}
            height={36}
          />
          <CustomButton
            onPress={() => {setView("Lendo"), setShowBest(false);}}
            placeholder={t('lendo')}
            styleType={view === "Lendo" ? 1 : 2}
            size="small"
           // fullWidth={false}
            height={36}
          />
          <CustomButton
            onPress={() => {setView("Quero ler") , setShowBest(false);}}
            placeholder={t('queroLer')}
            styleType={view === "Quero ler" ? 1 : 2}
            size="small"
           // fullWidth={false}
            height={36}
          />
        </View>

        {view === "Lidos" ? (
          livrosLidos.length === 0 ? (
            <EmptyState
              icon="book-outline"
              title={t('empty.booksRead.title')}
              subtitle={t('empty.booksRead.subtitle')}
              actionText={t('empty.booksRead.action')}
              onAction={() => {
                // Navegar para a tela home (index) e focar na SearchBar
                setShouldFocusSearchBar(true);
                setShouldNavigateToHome(true);
              }}
            />
          ) : (
            <View style={styles.readedView}>
              <FlatList
                data={orderedBooks}
                renderItem={renderBookItemLidos}
                keyExtractor={(item) => item.id}
                key="lidos" // chave única para forçar a recriação da FlatList
                horizontal={false}
                style={styles.list}
              />
            </View>
          )
        ) : view === "Lendo" ? (
          livrosLendo.length === 0 ? (
            <EmptyState
              icon="book-outline"
              title="Nenhum livro sendo lido"
              subtitle="Adicione livros que você está lendo atualmente"
              actionText="Adicionar livro"
              onAction={() => {
                // Navegar para a tela home (index) e focar na SearchBar
                setShouldFocusSearchBar(true);
                setShouldNavigateToHome(true);
              }}
            />
          ) : (
            <View style={styles.readedView}>
              <FlatList
                data={livrosLendo}
                renderItem={renderBookItemLidos}
                keyExtractor={(item) => item.id}
                key="lendo" // chave única para forçar a recriação da FlatList
                horizontal={false}
                style={styles.list}
              />
            </View>
          )
        ) : view === "Quero ler" ? (
          biblioteca.length === 0 ? (
            <EmptyState
              icon="library-outline"
              title={t('empty.library.title')}
              subtitle={t('empty.library.subtitle')}
              actionText={t('empty.library.action')}
              onAction={() => {
                // Navegar para a tela home (index) e focar na SearchBar
                setShouldFocusSearchBar(true);
                setShouldNavigateToHome(true);
              }}
            />
          ) : (
            <View style={styles.recommendedView}>
              <FlatList
                data={biblioteca}
                renderItem={renderBookItemBiblioteca}
                keyExtractor={(item) => item.id}
                key="biblioteca" // chave única para forçar a recriação da FlatList
                numColumns={3}
                style={styles.list}
                contentContainerStyle={styles.containerGrid}
              />
            </View>
          )
        ) : null}
      </View>
      {selectedBook && (view === "Quero ler" || view === "Lendo") && (
        <UnifiedBookModal
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          modalType="view"
          removeFromLibrary={view === "Quero ler"}
        />
      )}

      {selectedBook && view === "Lidos" && (
        <UnifiedBookModal
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          modalType="read"
          currentRating={selectedBook.Review!}
          onSaveRating={handleSaveRating}
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
    width: 72,
    height: 72,
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    flexWrap: "wrap",
    lineHeight: 22,
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
  readedView: {
    flex: 1,
    marginBottom: -15,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 8,
    paddingHorizontal: 20,
    gap: 8,
  },
  bestText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  bookListContainer: {
    width: "100%",
    paddingBottom: 10,
  },
  bookListContent: {
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: 10,
  },
  photoAndNumber: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    minWidth: 80,
  },
  bookInfoContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },
  ratingContainer: {
    marginTop: 8,
    alignItems: "flex-start",
  },
});

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
import CustomModalBook from "../../components/MyComponents/CustomModalBook/CustomModalBook";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import FiveStarReview from "../../components/MyComponents/FiveStarComponent/FiveStarComponent";
import CustomModalBookLido from "@/components/MyComponents/CustomModalBook/CustomModalBookLido";

export default function Library() {
  const { theme } = useTheme();
  const { biblioteca, livrosLidos, updateLivroReview } = useUser();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showBest, setShowBest] = useState(false); // Estado para o toggle "Melhores"
  const [view, setView] = useState<"Lidos" | "Ler mais tarde">(
    "Ler mais tarde"
  ); // Estado para alternar entre "Lidos" e "Ler mais tarde"

  const handleBookPress = (book: Livro) => {
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
            {index + 1}º
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

        <View>
          <Text style={[styles.bookTitle, { color: theme.text }]}>
            {item.title}
          </Text>
          <FiveStarReview type={2} rating={item.Review ?? 0} />
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
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor:
                  view === "Lidos"
                    ? theme.details
                    : theme.modalBackgroundSecondary,
              },
            ]}
            onPress={() => {
              setView("Lidos"), setShowBest(true);
            }}
          >
            <Text style={[styles.toggleButtonText, { color: theme.text }]}>
              Lidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor:
                  view === "Ler mais tarde"
                    ? theme.details
                    : theme.modalBackgroundSecondary,
              },
            ]}
            onPress={() => {setView("Ler mais tarde") , setShowBest(false);}}
          >
            <Text style={[styles.toggleButtonText, { color: theme.text }]}>
              Ler mais tarde
            </Text>
          </TouchableOpacity>
        </View>

        {view === "Lidos" ? (
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
        )}
      </View>
      {selectedBook && !showBest &&(
        <CustomModalBook
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          AddToLibrary={false}
          removeFromLibrary={true}
        />
      )}

      {selectedBook && showBest && (
        <CustomModalBookLido
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          currentRating={selectedBook.Review!}
          onSave={handleSaveRating}
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
    flexWrap: "wrap",
    width: "55%",
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
    marginVertical: 5,
    width: '80%',
    alignSelf:'center'
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    flex: 1,
    alignItems:'center'
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
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
    gap: 10,
  },
  photoAndNumber: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingLeft: 10,
  },
});

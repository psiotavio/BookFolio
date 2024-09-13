import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../../components/MyComponents/SearchBar/SearchBar";
import { useTheme } from "../../constants/temas/ThemeContext";
import { useUser } from "../../contexts/UserContext";
import { Livro } from "../../interfaces/Livro";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import CustomModalBook from "../../components/MyComponents/CustomModalBook/CustomModalBook";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import FiveStarReview from "../../components/MyComponents/FiveStarComponent/FiveStarComponent";
import ModalSliderReview from "../../components/MyComponents/CustomModalBook/ModalSlider";
import CustomModalBookLido from "@/components/MyComponents/CustomModalBook/CustomModalBookLido";
import CustomButton from "@/components/MyComponents/CustomButton.tsx/CustomButton";
import CustomModalAddBook from "@/components/MyComponents/CustomModalBook/CustomModalAddBook";
import { CheckBox } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons'; // Importando o ícone

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function TabOneScreen() {
  const { theme } = useTheme();
  const { livrosLidos, updateLivroReview } = useUser();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [showBest, setShowBest] = useState(false);
  const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false); // Estado para controlar o modal de adicionar livro

  const handleBookPress = (book: Livro) => {
    setSelectedBook(book);
    setCurrentRating(book.Review || 0); 
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

  const handleAddBook = (newBook: any) => {
    console.log("Livro adicionado:", newBook);
    setIsAddBookModalVisible(false);
  };

  const renderBookItem = ({ item, index }: { item: Livro; index: number }) => (
    <TouchableOpacity onPress={() => handleBookPress(item)}>
      <View style={{ marginHorizontal: 5, alignItems: "center" }}>
        {showBest && (
          <Text style={[styles.bestText, { color: theme.textButtons }]}>
            {index + 1}
          </Text>
        )}
        <CustomPhoto
          uri={
            item.imageLinks?.thumbnail ||
            item.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/150"
          }
          type={3}
        />
        <FiveStarReview rating={item.Review ?? 0} />
      </View>
    </TouchableOpacity>
  );

  const groupBooksByMonthYear = (books: Livro[]) => {
    const groupedBooks: { [key: string]: Livro[] } = {};
    books.forEach((book) => {
      const date = new Date(book.LidoQuando!);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!groupedBooks[monthYear]) {
        groupedBooks[monthYear] = [];
      }
      groupedBooks[monthYear].push(book);
    });

    if (showBest) {
      for (const key in groupedBooks) {
        groupedBooks[key].sort((a, b) => (b.Review ?? 0) - (a.Review ?? 0));
      }
    }

    return groupedBooks;
  };

  const groupedBooks = groupBooksByMonthYear(livrosLidos);

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
          <SearchBar />
        </View>

        <View style={styles.toggleContainer}>
          <CheckBox
            center
            title="Melhores"
            iconRight={true}
            size={20}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={showBest}
            onPress={() => setShowBest(!showBest)}
            checkedColor={theme.details}
            textStyle={[
              {
                fontSize: 17,
                color: showBest ? theme.details : theme.borderBottom,
              },
            ]}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              padding: 0,
            }}
          />
        </View>

        <ScrollView>
          <View style={styles.booksList}>
            {Object.keys(groupedBooks)
              .sort((a, b) => {
                const [monthA, yearA] = a.split(" ");
                const [monthB, yearB] = b.split(" ");

                const dateA = new Date(
                  parseInt(yearA, 10),
                  monthNames.indexOf(monthA)
                );
                const dateB = new Date(
                  parseInt(yearB, 10),
                  monthNames.indexOf(monthB)
                );

                return dateB.getTime() - dateA.getTime();
              })
              .map((monthYear) => (
                <View key={monthYear} style={{ marginVertical: 20 }}>
                  <Text style={[styles.listTitle, { color: theme.text }]}>
                    Livros Lidos em {monthYear}
                  </Text>
                  <FlatList
                    data={groupedBooks[monthYear]}
                    renderItem={(props) =>
                      renderBookItem({ ...props, index: props.index })
                    }
                    keyExtractor={(item) => item.id}
                    horizontal
                    style={styles.list}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ))}
          </View>
        </ScrollView>

        {selectedBook && (
          <CustomModalBookLido
            isVisible={isModalVisible}
            book={selectedBook}
            onClose={closeModal}
            currentRating={currentRating}
            onSave={handleSaveRating}
          />
        )}

        {/* Botão flutuante de adicionar livro */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsAddBookModalVisible(true)}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>

        {/* Modal de adicionar livro */}
        <CustomModalAddBook
          isVisible={isAddBookModalVisible}
          onClose={() => setIsAddBookModalVisible(false)}
          onSave={handleAddBook}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 70,
    alignItems: "center",
    zIndex: 9998,
  },
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
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
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  bookItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  toggleContainer: {
    position: "absolute",
    top: 10,
    right: 15,
    zIndex: 9999,
  },
  bestText: {
    fontSize: 120,
    fontWeight: "bold",
    marginBottom: 5,
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff7b00ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
});

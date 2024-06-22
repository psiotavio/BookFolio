import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { fetchBookDetails } from "../../../services/BookService"; // Sua função de busca de livros
import { Livro } from "../../../interfaces/Livro"; // Importando o tipo Livro
import CustomModalBook from "../CustomModalBook/CustomModalBook";
import { useTheme } from "../../../constants/temas/ThemeContext";

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Livro[]>([]); // Definindo o tipo do estado como Livro[]
  const [isKeyboardDismissed, setIsKeyboardDismissed] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null); // Estado para o livro selecionado
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Estado para a visibilidade do modal
  const { theme, themeName } = useTheme();
  

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        fetchBookDetails(query).then((fetchedBooks: Livro[]) => {
          setBooks(fetchedBooks);
        });
      }, 500);

      return () => clearTimeout(delayDebounce);
    } else if (query.length === 0) {
      setBooks([]); // Limpa a lista de livros se a consulta estiver vazia
    }
  }, [query]);

  const handleOutsidePress = () => {
    if (isKeyboardDismissed) {
      setBooks([]); // Recolhe o dropdown na segunda vez que é clicado fora
      setIsKeyboardDismissed(false); // Reset estado
    } else {
      Keyboard.dismiss(); // Recolhe o teclado na primeira vez que é clicado fora
      setIsKeyboardDismissed(true); // Define estado para indicar que o teclado foi recolhido
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

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TextInput
          style={[styles.searchInput , {backgroundColor: theme.modalBackground, color: theme.text, borderColor: theme.details}]}
          placeholder="Search for books..."
          placeholderTextColor={theme.text}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsKeyboardDismissed(false)} // Reset estado ao focar na barra de pesquisa
        />
        {books.length > 0 && (
          <FlatList
            style={[styles.flatlist, {backgroundColor: theme.modalBackground, borderColor: theme.details}]}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleBookPress(item)}
              >
                <Image
                  source={{
                    uri:
                      item.imageLinks?.thumbnail! ||
                      item.imageLinks?.smallThumbnail! ||
                      "https://via.placeholder.com/150",
                  }}
                  style={styles.bookCover}
                />
                <Text style={[styles.bookTitle, {color: theme.text}]}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <CustomModalBook
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
        />


      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    position: 'absolute',
    paddingHorizontal: 10,
    width: "86%",
    top: 60
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    padding: 10,
    borderRadius: 100,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    
  },
  bookCover: {
    width: 55,
    height: 80,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 5,
  },
  bookTitle: {
    flex: 1,
  },
  flatlist: {
    width: '92%',
    alignSelf: 'center',
    maxHeight: "45%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    borderTopColor: 'transparent',
    borderStyle: 'solid',
  },
});

export default SearchBar;

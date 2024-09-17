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
} from "react-native";
import { fetchBookDetails } from "../../../services/BookService"; // Sua função de busca de livros
import { Livro } from "../../../interfaces/Livro"; // Importando o tipo Livro
import CustomModalBook from "../CustomModalBook/CustomModalBook";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useDictionary } from "@/contexts/DictionaryContext"; // Importando o hook de tradução

const SearchBar = () => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Livro[]>([]);
  const [isKeyboardDismissed, setIsKeyboardDismissed] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t, language } = useDictionary(); // Usando o idioma do contexto

  useEffect(() => {
    if (query.length > 2) {
      const delayDebounce = setTimeout(() => {
        // Se o idioma for 'pt-BR', altere para 'pt' para garantir compatibilidade
        const searchLanguage = language === "pt-BR" ? "pt" : language;
  
        fetchBookDetails(query, searchLanguage)
          .then((fetchedBooks: Livro[]) => {
            if (fetchedBooks.length === 0) {
              console.log("No books found in the specified language.");
            }
            setBooks(fetchedBooks);
          })
          .catch((error) => {
            console.error("Error fetching books:", error);
            setBooks([]);
          });
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    } else {
      setBooks([]);
    }
  }, [query, language]);
  

  const handleOutsidePress = () => {
    if (isKeyboardDismissed) {
      setBooks([]);
      setIsKeyboardDismissed(false);
    } else {
      Keyboard.dismiss();
      setIsKeyboardDismissed(true);
    }
  };

  const handleBookPress = (book: Livro) => {
    setSelectedBook(book);
    setBooks([]);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBook(null);
    setBooks([]);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.modalBackground, color: theme.text, borderColor: theme.details }]}
          placeholder={t("searchBooksPlaceholder")} // Adiciona tradução ao placeholder
          placeholderTextColor={theme.text}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsKeyboardDismissed(false)}
        />
        {books.length > 0 && (
          <FlatList
            style={[styles.flatlist, { backgroundColor: theme.modalBackground, borderColor: theme.details }]}
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleBookPress(item)}
              >
                <Image
                  source={{
                    uri: item.imageLinks?.thumbnail || item.imageLinks?.smallThumbnail || "https://via.placeholder.com/150",
                  }}
                  style={styles.bookCover}
                />
                <Text style={[styles.bookTitle, { color: theme.text }]}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <CustomModalBook
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          AddToLibrary={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    position: "absolute",
    paddingHorizontal: 10,
    width: "86%",
    top: 60,
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
    overflow: 'hidden',
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
    width: "90%",
    alignSelf: "center",
    maxHeight: 275,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 2,
    borderTopColor: "transparent",
    borderStyle: "solid",
    overflow: 'hidden', 
  },
});

export default SearchBar;

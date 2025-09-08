import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
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
import UnifiedBookModal from "../CustomModalBook/UnifiedBookModal";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useDictionary } from "@/contexts/DictionaryContext"; // Importando o hook de tradução

export interface SearchBarRef {
  focus: () => void;
}

const SearchBar = forwardRef<SearchBarRef>((props, ref) => {
  const [query, setQuery] = useState<string>("");
  const [books, setBooks] = useState<Livro[]>([]);
  const [isKeyboardDismissed, setIsKeyboardDismissed] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { theme } = useTheme();
  const { t, language } = useDictionary(); // Usando o idioma do contexto
  const textInputRef = React.useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    },
  }));

  useEffect(() => {
    if (query.length > 2) {
      console.log(`🔍 INICIANDO BUSCA: "${query}" (${query.length} caracteres)`);
      const delayDebounce = setTimeout(() => {
        // Se o idioma for 'pt-BR', altere para 'pt' para garantir compatibilidade
        const searchLanguage = language === "pt-BR" ? "pt" : language;
  
        fetchBookDetails(query, searchLanguage)
          .then((fetchedBooks: Livro[]) => {
            if (fetchedBooks.length === 0) {
              console.log("❌ Nenhum livro encontrado na linguagem especificada.");
            } else {
              console.log(`✅ ${fetchedBooks.length} livros encontrados para "${query}"`);
            }
            setBooks(fetchedBooks);
          })
          .catch((error) => {
            console.error("❌ Erro ao buscar livros:", error);
            setBooks([]);
          });
      }, 500);
  
      return () => clearTimeout(delayDebounce);
    } else {
      console.log(`🔍 BUSCA CANCELADA: Query muito curta (${query.length} caracteres)`);
      setBooks([]);
    }
  }, [query, language]);
  

  const handleOutsidePress = () => {
    if (isKeyboardDismissed) {
      console.log(`🔍 SEGUNDO CLIQUE: Fechando resultados da busca`);
      setBooks([]);
      setIsKeyboardDismissed(false);
    } else {
      console.log(`⌨️ PRIMEIRO CLIQUE: Dispensando teclado`);
      Keyboard.dismiss();
      setIsKeyboardDismissed(true);
    }
  };

  const handleBookPress = (book: Livro) => {
    console.log(`📖 LIVRO SELECIONADO: "${book.title}"`);
    setSelectedBook(book);
    setBooks([]);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    console.log(`❌ MODAL FECHADO`);
    setIsModalVisible(false);
    setSelectedBook(null);
    setBooks([]);
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <TextInput
          ref={textInputRef}
          style={[styles.searchInput, { backgroundColor: theme.modalBackground, color: theme.text, borderColor: theme.details }]}
          placeholder={t("searchBooksPlaceholder")} // Adiciona tradução ao placeholder
          placeholderTextColor={theme.text}
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            console.log(`⌨️ INPUT EM FOCO: Teclado ativado`);
            setIsKeyboardDismissed(false);
          }}
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

        <UnifiedBookModal
          isVisible={isModalVisible}
          book={selectedBook}
          onClose={closeModal}
          modalType="view"
        />
      </View>
    </TouchableWithoutFeedback>
  );
});

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

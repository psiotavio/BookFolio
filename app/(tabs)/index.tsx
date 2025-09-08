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
import { SafeAreaView } from "react-native-safe-area-context";
import UnifiedBookModal from "../../components/MyComponents/CustomModalBook/UnifiedBookModal";
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto";
import FiveStarReview from "../../components/MyComponents/FiveStarComponent/FiveStarComponent";
import CustomButton from "@/components/MyComponents/CustomButton.tsx/CustomButton";
import { CheckBox } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons'; // Importando o ícone
import { useDictionary } from "../../contexts/DictionaryContext"; // Importa o hook de traduções
import { Translations } from "../../contexts/DictionaryContext"; // Ajuste o caminho conforme necessário

export default function TabOneScreen() {
  const { theme } = useTheme();
  const { livrosLidos, updateLivroReview } = useUser();
  const { t } = useDictionary(); // Usa o hook de traduções
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [showBest, setShowBest] = useState(false);
  const [isAddBookModalVisible, setIsAddBookModalVisible] = useState(false); // Estado para controlar o modal de adicionar livro
  
  const handleBookPress = (book: Livro) => {
    console.log(`📖 LIVRO SELECIONADO: "${book.title}"`);
    console.log(`   👥 Autores: ${book.authors?.join(', ') || 'N/A'}`);
    console.log(`   ⭐ Avaliação atual: ${book.Review || 0}/5`);
    console.log(`   📅 Data de leitura: ${book.LidoQuando ? new Date(book.LidoQuando).toLocaleDateString('pt-BR') : 'N/A'}`);
    console.log(`   🖼️ Imagem Links:`, book.imageLinks);
    console.log(`   🖼️ Thumbnail: ${book.imageLinks?.thumbnail || 'N/A'}`);
    console.log(`   🖼️ Small Thumbnail: ${book.imageLinks?.smallThumbnail || 'N/A'}`);
    console.log(`   🖼️ Large: ${book.imageLinks?.large || 'N/A'}`);
    console.log(`   🖼️ Medium: ${book.imageLinks?.medium || 'N/A'}`);
    console.log(`   🖼️ Small: ${book.imageLinks?.small || 'N/A'}`);
    console.log(`   🖼️ Extra Large: ${book.imageLinks?.extraLarge || 'N/A'}`);
    
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
      console.log(`💾 SALVANDO AVALIAÇÃO:`);
      console.log(`   📖 Livro: "${selectedBook.title}"`);
      console.log(`   ⭐ Avaliação anterior: ${selectedBook.Review || 0}/5`);
      console.log(`   ⭐ Nova avaliação: ${newRating}/5`);
      
      updateLivroReview(selectedBook.id, newRating);
    }
    closeModal();
  };

  const handleAddBook = (newBook: any) => {
    console.log(`${t('livroAdicionado')}`, newBook);
    setIsAddBookModalVisible(false);
  };

  const renderBookItem = ({ item, index }: { item: Livro; index: number }) => {
    console.log(`🎨 RENDERIZANDO LIVRO ${index + 1}: "${item.title}"`);
    console.log(`   🖼️ Imagem: ${item.imageLinks?.thumbnail || item.imageLinks?.smallThumbnail || 'placeholder'}`);
    console.log(`   ⭐ Avaliação: ${item.Review ?? 0}/5`);
    console.log(`   🏆 Posição no ranking: ${showBest ? index + 1 : 'N/A'}`);
    
    return (
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
  };

  const groupBooksByMonthYear = (books: Livro[]) => {
    console.log(`📚 PROCESSANDO LIVROS LIDOS: ${books.length} livros encontrados`);
    
    const groupedBooks: { [key: string]: Livro[] } = {};
    books.forEach((book, index) => {
      console.log(`\n📖 LIVRO ${index + 1}: "${book.title}"`);
      console.log(`   👥 Autores: ${book.authors?.join(', ') || 'N/A'}`);
      console.log(`   📅 Data de leitura: ${book.LidoQuando ? new Date(book.LidoQuando).toLocaleDateString('pt-BR') : 'N/A'}`);
      console.log(`   ⭐ Avaliação: ${book.Review || 0}/5`);
      
      const date = new Date(book.LidoQuando!);
      const monthName = t(getMonthTranslationKey(date.getMonth()));
      const monthYear = `${monthName} ${date.getFullYear()}`;
      
      console.log(`   📅 Agrupado em: ${monthYear}`);
      
      if (!groupedBooks[monthYear]) {
        groupedBooks[monthYear] = [];
        console.log(`   🆕 Novo grupo criado: ${monthYear}`);
      }
      groupedBooks[monthYear].push(book);
    });

    console.log(`\n📊 GRUPOS CRIADOS:`);
    Object.keys(groupedBooks).forEach(group => {
      console.log(`   📅 ${group}: ${groupedBooks[group].length} livros`);
    });

    if (showBest) {
      console.log(`\n🏆 ORDENANDO LIVROS POR AVALIAÇÃO (modo "melhores" ativado)`);
      for (const key in groupedBooks) {
        const originalOrder = [...groupedBooks[key]];
        groupedBooks[key].sort((a, b) => (b.Review ?? 0) - (a.Review ?? 0));
        
        console.log(`\n   📅 ${key}:`);
        groupedBooks[key].forEach((book, index) => {
          console.log(`     ${index + 1}. "${book.title}" - ⭐ ${book.Review || 0}/5`);
        });
      }
    } else {
      console.log(`\n📅 MODO NORMAL: Livros mantidos na ordem original`);
    }

    return groupedBooks;
  };

  // Helper para obter o nome do mês
  const getMonthTranslationKey = (monthIndex: number): keyof Translations => {
    const monthKeys: (keyof Translations)[] = [
      'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return monthKeys[monthIndex];
  };

  const groupedBooks = groupBooksByMonthYear(livrosLidos);
  
  console.log(`\n🎯 RESUMO FINAL DA TELA:`);
  console.log(`   📚 Total de livros lidos: ${livrosLidos.length}`);
  console.log(`   📅 Total de grupos (meses/anos): ${Object.keys(groupedBooks).length}`);
  console.log(`   🏆 Modo "melhores" ativo: ${showBest ? 'SIM' : 'NÃO'}`);
  console.log(`   📱 Livros que serão exibidos na tela:`);
  
  Object.keys(groupedBooks).forEach(group => {
    console.log(`     📅 ${group}: ${groupedBooks[group].length} livros`);
  });

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
            title={t('melhores')}
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
                  new Date().toLocaleString('pt-BR', { month: 'long' }).indexOf(monthA)
                );
                const dateB = new Date(
                  parseInt(yearB, 10),
                  new Date().toLocaleString('pt-BR', { month: 'long' }).indexOf(monthB)
                );

                return dateB.getTime() - dateA.getTime();
              })
              .map((monthYear) => (
                <View key={monthYear} style={{ marginVertical: 20 }}>
                  <Text style={[styles.listTitle, { color: theme.text }]}>
                    {`${t('livrosLidosEm')} ${monthYear}`}
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
          <UnifiedBookModal
            isVisible={isModalVisible}
            book={selectedBook}
            onClose={closeModal}
            modalType="read"
            currentRating={currentRating}
            onSaveRating={handleSaveRating}
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
        <UnifiedBookModal
          isVisible={isAddBookModalVisible}
          book={null}
          onClose={() => setIsAddBookModalVisible(false)}
          modalType="add"
          onSaveBook={handleAddBook}
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

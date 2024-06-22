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

export default function Recomendations() {
  const { theme } = useTheme();
  const { livrosRecomendados } = useUser();
  const [selectedBook, setSelectedBook] = useState<Livro | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          <Text style={[styles.listTitle, { color: theme.text }]}>
            Livros Recomendados
          </Text>
            <FlatList
              data={livrosRecomendados}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              style={styles.list}
              contentContainerStyle={styles.containerGrid}
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
    marginBottom: -25
  },
});

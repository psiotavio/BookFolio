import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import CustomButton from "../CustomButton.tsx/CustomButton";
import { useTheme } from "../../../constants/temas/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../../contexts/UserContext";
import { Livro } from "../../../interfaces/Livro"; // Importando o tipo Livro
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';


interface CustomModalAddBookProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (book: Livro) => void; // Atualize o tipo do parâmetro onSave para Livro
}

const CustomModalAddBook: React.FC<CustomModalAddBookProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const { addLivroLido } = useUser();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pageCount, setPageCount] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [publisher, setPublisher] = useState("");
  const [imageUri, setImageUri] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [9, 16], // Proporção 9:16 para capa de livro
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
  

  const handleSave = () => {
    const amazonLink = `https://www.amazon.com.br/s?k=${encodeURIComponent(
      title + " " + author
    )}&linkCode=ll2&tag=bookfolio-20&language=pt_BR&ref_=as_li_ss_tl`;

    // Criando um novo livro com todas as propriedades obrigatórias
    const newBook: Livro = {
      id: generateUUID(), // Gerando um ID único
      title,
      authors: [author], // Transformando o autor em um array, como esperado pela interface Livro
      pageCount: parseInt(pageCount, 10),
      description,
      publishedDate,
      publisher,
      amazonLink,
      imageLinks: { thumbnail: imageUri }, // Adicionando o URI da imagem no formato esperado
      LidoQuando: new Date(), // Você pode definir a data de leitura como a data atual
    };

    // Adicionar o livro à lista de livros lidos
    addLivroLido(newBook);
    onSave(newBook); // Opcional: Chama onSave para fazer qualquer outra ação
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[
          styles.modalContainer,
          { backgroundColor: theme.modalBackground },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: theme.text }]}>
            Não encontrou um livro?
          </Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Adicionar Livro
          </Text>
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.bookCover} />
              ) : (
                <Text style={[styles.addPhotoText, { color: theme.text }]}>
                  Adicionar capa
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <TextInput
            placeholder="Título"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Autor"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={author}
            onChangeText={setAuthor}
          />
          <TextInput
            placeholder="Qtd de Páginas"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={pageCount}
            onChangeText={setPageCount}
          />
          <TextInput
            placeholder="Descrição (opcional)"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            placeholder="Lançamento (opcional)"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={publishedDate}
            onChangeText={setPublishedDate}
          />
          <TextInput
            placeholder="Editora (opcional)"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.textSecondary },
            ]}
            value={publisher}
            onChangeText={setPublisher}
          />

          <View style={styles.modalButtonsContainer}>
            <CustomButton
              onPress={handleSave}
              placeholder="Salvar"
              styleType={1}
            />
            <CustomButton
              onPress={onClose}
              placeholder="Fechar"
              styleType={2}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    width: "100%",
  },
  modalButtonsContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imagePicker: {
    width:  200,
    height:  300,
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  bookCover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  addPhotoText: {
    fontSize: 16,
  },
});

export default CustomModalAddBook;

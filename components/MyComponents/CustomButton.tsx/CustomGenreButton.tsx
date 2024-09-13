import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../../constants/temas/ThemeContext';

interface ButtonGenreProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

const genres = [
  'Recomendado para você', 'Fiction', 'Mystery', 'Romance', 'Science Fiction', 'Fantasy', 
  'Horror', 'Thriller', 'Biography', 'History', 'Philosophy', 'Psychology', 'Self-Help', 
  'Health', 'Travel', 'Children\'s', 'Cooking', 'Art', 'Poetry', 'Drama', 'Religion'
];

const ButtonGenre: React.FC<ButtonGenreProps> = ({ selectedGenre, onSelectGenre }) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenreSelect = (genre: string) => {
    onSelectGenre(genre);
    setModalVisible(false);
  };

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.details }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Selecionar Gênero</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.modalBackground }]}>
            <ScrollView>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreButton,
                    { backgroundColor: selectedGenre === genre ? theme.details : theme.modalBackground }
                  ]}
                  onPress={() => handleGenreSelect(genre)}
                >
                  <Text style={[styles.genreButtonText, { color: theme.text }]}>{genre}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.genreButton, { backgroundColor: theme.errorColor }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.genreButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    // width: '70%',
    // alignSelf: 'center',
    // marginTop: 20
  },
  buttonText: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    height: '50%'
  },
  genreButton: {
    padding: 12,
    marginVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  genreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ButtonGenre;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FiveStarReviewProps {
  rating: number;
  type?: number;
}

const FiveStarReview: React.FC<FiveStarReviewProps> = ({ rating, type }) => {
  const totalStars = 5;
  let fullStars = Math.floor(rating); // Estrelas completamente preenchidas
  let halfStar = rating % 1 >= 0.5; // Determina se há uma meia estrela
  let emptyStars = totalStars - fullStars - (halfStar ? 1 : 0); // Estrelas vazias

  const fontSize = type === 2 ? 34 : 24; // Define o tamanho da fonte com base no tipo

  return (
    <View style={styles.container}>
      {Array(fullStars).fill(null).map((_, index) => (
        <Text key={`full-${index}`} style={[styles.fullStar, { fontSize }]}>&#9733;</Text> // Estrela dourada completa
      ))}
      {halfStar && (
        <View style={styles.halfStarDesign}>
          <Text key="half-star-left" style={[styles.halfStarLeft, { fontSize }]}>&#9733;</Text> 
          <Text key="half-star-right" style={[styles.halfStarRight, { fontSize }]}>&#9734;</Text> 
        </View>
      )}
      {Array(emptyStars).fill(null).map((_, index) => (
        <Text key={`empty-${index}`} style={[styles.emptyStar, { fontSize }]}>&#9734;</Text> // Estrela vazia
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  fullStar: {
    color: 'gold',
  },
  halfStarLeft: {
    color: 'gold',
    overflow: 'hidden',
    width: 10, // Tamanho ajustado para cobrir metade do texto
  },
  halfStarRight: {
    color: 'gray',
    width: 10, // Tamanho ajustado para cobrir metade do texto
    transform: [{ scaleX: -1 }] // Inverte horizontalmente o texto
  },
  emptyStar: {
    color: 'gray',
  },
  halfStarDesign: {
    flexDirection: 'row',
  }
});

export default FiveStarReview;

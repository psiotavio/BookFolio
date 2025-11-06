import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import { useDictionary } from "../../../contexts/DictionaryContext";
import ReadingProgress from "../ProgressBar/ProgressBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface StatsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const createStyles = (theme: any) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.background,
    borderRadius: 20,
    padding: 24,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.modalBackgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: theme.modalBackgroundSecondary,
    borderRadius: 15,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.details,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  progressSection: {
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 15,
  },
});

const StatsModal: React.FC<StatsModalProps> = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  const { t } = useDictionary();
  const { livrosLidos, biblioteca, livrosLendo } = useUser();
  const styles = createStyles(theme);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [isVisible]);

  const totalPages = livrosLidos.reduce((sum, book) => sum + (book.pageCount || 0), 0);
  const averageRating = livrosLidos.length > 0 
    ? livrosLidos.reduce((sum, book) => sum + (book.Review || 0), 0) / livrosLidos.length 
    : 0;

  const stats = [
    { number: livrosLidos.length, label: t('booksRead') },
    { number: livrosLendo.length, label: t('currentlyReading') },
    { number: biblioteca.length, label: t('wantToRead') },
    { number: totalPages, label: t('totalPages') },
    { number: averageRating.toFixed(1), label: t('averageRating') },
    { number: livrosLidos.filter(book => book.Review && book.Review >= 4).length, label: t('favoriteBooks') },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('statistics')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>{t('readingStats')}</Text>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statCard}>
                    <Text style={styles.statNumber}>{stat.number}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressTitle}>{t('readingGoals')}</Text>
              <ReadingProgress />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default StatsModal;

import React from 'react'
import { StyleSheet, View, Text, Modal, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native'
import { useTheme } from '../../../constants/temas/ThemeContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import CustomThemeButton from '../CustomButton.tsx/CustomThemeButton'
import CustomButton from '../CustomButton.tsx/CustomButton'
import CustomTranslationButton from '../CustomButton.tsx/CustomTransaltionButton'
import { useDictionary } from '../../../contexts/DictionaryContext'
import { useUser } from '../../../contexts/UserContext'

interface SettingsModalProps {
  isVisible: boolean
  onClose: () => void
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const { theme } = useTheme()
  const { t } = useDictionary()
  const { clearAll } = useUser()

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle={theme.background === '#1A1316' ? 'light-content' : 'dark-content'} />
      <SafeAreaView edges={["top"]} style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header com gradiente */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.modalBackgroundSecondary }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Configurações</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                Personalize sua experiência
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Seções de configurações */}
          <View style={styles.settingsContainer}>
            {/* Aparência */}
            <View style={styles.settingsSection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: theme.details + '20' }]}>
                  <Ionicons name="color-palette-outline" size={20} color={theme.details} />
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Aparência</Text>
                  <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Personalize cores e tema
                  </Text>
                </View>
              </View>
              <View style={[styles.settingsCard, { backgroundColor: theme.modalBackgroundSecondary }]}>
                <CustomThemeButton />
              </View>
            </View>

            {/* Idioma */}
            <View style={styles.settingsSection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: theme.details + '20' }]}>
                  <Ionicons name="language-outline" size={20} color={theme.details} />
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Idioma</Text>
                  <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Escolha seu idioma preferido
                  </Text>
                </View>
              </View>
              <View style={[styles.settingsCard, { backgroundColor: theme.modalBackgroundSecondary }]}>
                <CustomTranslationButton />
              </View>
            </View>

            {/* Conta */}
            <View style={styles.settingsSection}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#FF6B6B20' }]}>
                  <Ionicons name="person-outline" size={20} color="#FF6B6B" />
                </View>
                <View style={styles.sectionInfo}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Conta</Text>
                  <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Gerencie seus dados
                  </Text>
                </View>
              </View>
              <View style={[styles.settingsCard, { backgroundColor: theme.modalBackgroundSecondary }]}>
                <CustomButton
                  onPress={clearAll}
                  placeholder={t("resetAccount")}
                  styleType={1}
                />
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 50,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.6,
  },
  settingsContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  aboutLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: '500',
  },
})

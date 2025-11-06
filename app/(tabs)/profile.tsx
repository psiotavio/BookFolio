"use client"

import { useState } from "react"
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, FlatList, TextInput, Modal, Alert } from "react-native"
import { useTheme } from "../../constants/temas/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useUser } from "../../contexts/UserContext"
import { useDictionary } from "@/contexts/DictionaryContext"
import StatsModal from "../../components/MyComponents/StatsModal/StatsModal"
import SettingsModal from "../../components/MyComponents/SettingsModal/SettingsModal"
import CustomPhoto from "../../components/MyComponents/CustomPhoto/CustomPhoto"
import CustomRating from "../../components/MyComponents/CustomRating/CustomRating"
import type { Livro } from "../../interfaces/Livro"
import * as ImagePicker from 'expo-image-picker'
import { getImagesByType } from "../../assets/images/profileOptions"

export default function TabTwoScreen() {
  const { theme } = useTheme()
  const { t } = useDictionary()
  const { livrosLidos, biblioteca, updateLivroReview } = useUser()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [imagePickerType, setImagePickerType] = useState<"banner" | "profile">("profile")
  const [newTag, setNewTag] = useState("")
  const [showAddTag, setShowAddTag] = useState(false)

  const { userProfile, updateUserProfile } = useUser()

  // Obter imagens baseado no tipo selecionado
  const suggestedImages = getImagesByType(imagePickerType)
  
  // Debug: verificar se as imagens estão sendo carregadas
  console.log('🔍 DEBUG - imagePickerType:', imagePickerType)
  console.log('🔍 DEBUG - suggestedImages:', suggestedImages)
  console.log('🔍 DEBUG - suggestedImages.length:', suggestedImages.length)
  
  // Fallback: usar imagens hardcoded para testar
  const fallbackImages = [
    require("../../assets/images/logo3.png"), // Usando uma imagem que sabemos que funciona
  ]

  const handleImageSelect = (imageSource: any) => {
    console.log('🖼️ Selecionando imagem:', imageSource)
    console.log('🖼️ Tipo do picker:', imagePickerType)
    
    if (imagePickerType === "banner") {
      console.log('🖼️ Salvando banner:', imageSource)
      updateUserProfile({ bannerImage: imageSource })
    } else {
      console.log('🖼️ Salvando foto de perfil:', imageSource)
      updateUserProfile({ profileImage: imageSource })
    }
    setShowImagePicker(false)
  }

  const pickImageFromGallery = async () => {
    try {
      console.log('📱 Tentando abrir galeria...')
      
      // Verificar permissão atual
      const currentPermission = await ImagePicker.getMediaLibraryPermissionsAsync()
      console.log('📱 Permissão atual:', currentPermission.status)
      
      // Se não tem permissão, pedir
      if (currentPermission.status !== 'granted') {
        console.log('📱 Pedindo permissão...')
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        console.log('📱 Resultado da permissão:', permissionResult)
        
        if (permissionResult.status !== 'granted') {
          Alert.alert(
            'Permissão necessária', 
            'Para escolher uma imagem da galeria, precisamos de permissão para acessar suas fotos. Por favor, permita o acesso.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Tentar novamente', onPress: () => pickImageFromGallery() }
            ]
          )
          return
        }
      }

      console.log('📱 Abrindo seletor de imagem...')
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: imagePickerType === "banner" ? [16, 9] : [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      })

      console.log('📱 Resultado do seletor:', result)
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('📱 Imagem selecionada:', result.assets[0].uri)
        handleImageSelect(result.assets[0].uri)
      } else {
        console.log('📱 Seleção cancelada')
      }
    } catch (error) {
      console.log('📱 Erro ao selecionar imagem:', error)
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Verifique se o app tem permissão para acessar a galeria.')
    }
  }

  const showImagePickerOptions = () => {
    setShowImagePicker(true)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !userProfile.tags.includes(newTag.trim())) {
      updateUserProfile({
        tags: [...userProfile.tags, newTag.trim()],
      })
      setNewTag("")
      setShowAddTag(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    updateUserProfile({
      tags: userProfile.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const renderBookItem = ({ item, index }: { item: Livro; index: number }) => (
    <TouchableOpacity style={[styles.bookItem, { backgroundColor: theme.modalBackgroundSecondary }]}>
      <CustomPhoto
        uri={item.imageLinks?.thumbnail || item.imageLinks?.smallThumbnail || "https://via.placeholder.com/150"}
        type={3}
      />
      <View style={styles.bookOverlay}>
        <CustomRating
          value={item.Review ?? 0}
          onRatingChange={() => {}}
          size={12}
          color="#FFD700"
          emptyColor="rgba(255,255,255,0.3)"
        />
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView edges={[]} style={[styles.view, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Botão de configurações posicionado absolutamente */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettingsModal(true)}
            >
              <Ionicons name="settings-outline" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.bannerContainer}>
              <TouchableOpacity
                style={[styles.banner, { backgroundColor: theme.details }]}
                onPress={() => {
                  setImagePickerType("banner")
                  showImagePickerOptions()
                }}
              >
                {userProfile.bannerImage ? (
                  <Image 
                    source={typeof userProfile.bannerImage === 'string' 
                      ? { uri: userProfile.bannerImage } 
                      : userProfile.bannerImage
                    } 
                    style={styles.bannerImage} 
                  />
                ) : (
                  <View style={styles.bannerPlaceholder}>
                    <Ionicons name="camera" size={32} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.bannerPlaceholderText}>Adicionar capa</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setImagePickerType("profile")
                    showImagePickerOptions()
                  }}
                >
                  <View style={[styles.profileImageWrapper, { borderColor: theme.background }]}>
                    {userProfile.profileImage ? (
                      <Image 
                        source={typeof userProfile.profileImage === 'string' 
                          ? { uri: userProfile.profileImage } 
                          : userProfile.profileImage
                        } 
                        style={styles.profileImage} 
                      />
                    ) : (
                      <View
                        style={[styles.profileImagePlaceholder, { backgroundColor: theme.modalBackgroundSecondary }]}
                      >
                        <Ionicons name="person" size={40} color={theme.text} />
                      </View>
                    )}
                    <View style={[styles.editImageOverlay, { backgroundColor: theme.details }]}>
                      <Ionicons name="camera" size={16} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileSection}>
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  {isEditingProfile ? (
                    <TextInput
                      style={[styles.nameInput, { color: theme.text, borderColor: theme.textSecondary }]}
                      value={userProfile.name}
                      onChangeText={(text) => updateUserProfile({ name: text })}
                      placeholder="Seu nome"
                      placeholderTextColor={theme.textSecondary}
                    />
                  ) : (
                    <Text style={[styles.profileName, { color: theme.text }]}>{userProfile.name}</Text>
                  )}

                  <View style={styles.profileMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                      <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                        Desde {userProfile.joinDate}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.editButton, { borderColor: theme.details }]}
                  onPress={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Text style={[styles.editButtonText, { color: theme.details }]}>
                    {isEditingProfile ? "Salvar" : "Editar"}
                  </Text>
                </TouchableOpacity>
              </View>

              {isEditingProfile ? (
                <TextInput
                  style={[styles.bioInput, { color: theme.text, borderColor: theme.textSecondary }]}
                  value={userProfile.bio}
                  onChangeText={(text) => updateUserProfile({ bio: text })}
                  placeholder="Conte um pouco sobre você..."
                  placeholderTextColor={theme.textSecondary}
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={[styles.profileBio, { color: theme.text }]}>{userProfile.bio}</Text>
              )}

              <View style={styles.statsContainer}>
                <TouchableOpacity style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: theme.text }]}>{livrosLidos.length}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Livros</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.statItem} onPress={() => setShowStatsModal(true)}>
                  <Ionicons name="stats-chart" size={20} color={theme.details} />
                  <Text style={[styles.statLabel, { color: theme.details }]}>Stats</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tagsSection}>
                <Text style={[styles.tagsTitle, { color: theme.text }]}>Interesses</Text>
                <View style={styles.tagsContainer}>
                  {userProfile.tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.tag, { backgroundColor: theme.details + "20", borderColor: theme.details }]}
                      onLongPress={() => isEditingProfile && handleRemoveTag(tag)}
                    >
                      <Text style={[styles.tagText, { color: theme.details }]}>{tag}</Text>
                      {isEditingProfile && (
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                          <Ionicons name="close" size={14} color={theme.details} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  ))}
                  {isEditingProfile && (
            <TouchableOpacity
                      style={[styles.addTagButton, { borderColor: theme.textSecondary }]}
                      onPress={() => setShowAddTag(true)}
                    >
                      <Ionicons name="add" size={16} color={theme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.booksSection}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Biblioteca</Text>
                <TouchableOpacity>
                  <Text style={[styles.viewAllText, { color: theme.details }]}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              {livrosLidos.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="library-outline" size={48} color={theme.textSecondary} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Sua biblioteca está vazia</Text>
                  <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                    Comece adicionando seus primeiros livros!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={livrosLidos.slice(0, 6)}
                  renderItem={renderBookItem}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={styles.bookRow}
                />
              )}
            </View>
      </ScrollView>

      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.imagePickerModal, { backgroundColor: theme.modalBackground }]}>
            {/* Handle para indicar que é expansível */}
            <View style={styles.modalHandle}>
              <View style={[styles.handleBar, { backgroundColor: theme.textSecondary }]} />
            </View>
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Escolher {imagePickerType === "banner" ? "Capa" : "Foto de Perfil"}
            </Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {/* Botão da Galeria */}
            <TouchableOpacity 
              style={[styles.galleryButton, { backgroundColor: theme.details }]}
              onPress={async () => {
                console.log('📱 Botão da galeria pressionado!')
                setShowImagePicker(false)
                await pickImageFromGallery()
              }}
            >
              <Ionicons name="images-outline" size={24} color="white" />
              <Text style={styles.galleryButtonText}>Escolher da Galeria</Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.textSecondary }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>ou</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.textSecondary }]} />
            </View>

            {/* Imagens Sugeridas */}
            <View style={styles.suggestedSection}>
              <Text style={[styles.suggestedTitle, { color: theme.text }]}>Imagens Sugeridas</Text>
              <ScrollView 
                style={styles.imageGrid}
                showsVerticalScrollIndicator={true}
                bounces={true}
              >
                {imagePickerType === "profile" ? (
                  // Grid 3x3 para fotos de perfil
                  <View style={styles.profileGrid}>
                    {(suggestedImages.length > 0 ? suggestedImages : fallbackImages).map((imageSource, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.profileImageOption} 
                        onPress={() => handleImageSelect(imageSource)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.profileGridImageContainer}>
                          <Image source={imageSource} style={styles.profileImagePreview} />
                        </View>
                        <Text style={[styles.imageLabel, { color: theme.textSecondary }]}>
                          {index + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  // Lista vertical para banners
                  <View>
                    {(suggestedImages.length > 0 ? suggestedImages : fallbackImages).map((imageSource, index) => (
                      <TouchableOpacity key={index} style={styles.bannerImageOption} onPress={() => handleImageSelect(imageSource)}>
                        <Image source={imageSource} style={styles.bannerImagePreview} />
                        <Text style={[styles.imageLabel, { color: theme.textSecondary }]}>
                          Banner {index + 1}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                {suggestedImages.length === 0 && fallbackImages.length === 0 && (
                  <View style={styles.emptyImagesContainer}>
                    <Text style={[styles.emptyImagesText, { color: theme.textSecondary }]}>
                      Nenhuma imagem sugerida disponível
                    </Text>
                  </View>
                )}
            </ScrollView>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showAddTag} transparent animationType="fade" onRequestClose={() => setShowAddTag(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.addTagModal, { backgroundColor: theme.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Adicionar Interesse</Text>
            <TextInput
              style={[styles.tagInput, { color: theme.text, borderColor: theme.textSecondary }]}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Ex: Ficção Científica"
              placeholderTextColor={theme.textSecondary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.textSecondary }]}
                onPress={() => setShowAddTag(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.details }]} onPress={handleAddTag}>
                <Text style={styles.modalButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
      </View>
      </Modal>

      <StatsModal isVisible={showStatsModal} onClose={() => setShowStatsModal(false)} />
      <SettingsModal isVisible={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
    top: 70,
    right: 20,
    zIndex: 9999,
    padding: 8,
  },
  bannerContainer: {
    position: "relative",
    marginBottom: 60,
  },
  banner: {
    height: 250,
    marginHorizontal: 0,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  bannerPlaceholderText: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontSize: 14,
  },
  profileImageContainer: {
    position: "absolute",
    bottom: -50,
    left: 20,
  },
  profileImageWrapper: {
    position: "relative",
    borderWidth: 4,
    borderRadius: 50,
    // overflow: "hidden",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 46, // 50 - 4 (border width)
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 46, // 50 - 4 (border width)
    justifyContent: "center",
    alignItems: "center",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "bold",
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom: 8,
  },
  profileMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  profileBio: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  bioInput: {
    fontSize: 16,
    lineHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  addTagButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  booksSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  bookRow: {
    justifyContent: "space-between",
  },
  bookItem: {
    width: "31%",
    aspectRatio: 0.7,
    borderRadius: 8,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  bookOverlay: {
    position: "absolute",
    bottom: 8,
    left: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  imagePickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    minHeight: "60%",
    paddingBottom: 20,
  },
  modalHandle: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  galleryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  suggestedSection: {
    flex: 1,
    minHeight: 200,
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 12,
  },
  imageGrid: {
    flex: 1,
  },
  // Estilos para grid de fotos de perfil (3x3)
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  profileImageOption: {
    width: "28%",
    marginBottom: 16,
    alignItems: "center",
  },
  profileGridImageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.08)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  // Estilos para lista de banners (vertical)
  bannerImageOption: {
    marginBottom: 12,
    marginHorizontal: 20,
  },
  bannerImagePreview: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageLabel: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  emptyImagesContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyImagesText: {
    fontSize: 14,
    textAlign: "center",
  },
  addTagModal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  tagInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "600",
  },
})

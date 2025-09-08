import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    Modal,
    Linking,
    TouchableOpacity,
    TextInput,
    Dimensions,
    StatusBar,
    Animated,
    Pressable,
    ImageBackground,
} from "react-native";
import { Livro } from "../../../interfaces/Livro";
import CustomButton from "../CustomButton.tsx/CustomButton";
import { useTheme } from "../../../constants/temas/ThemeContext";
import { useUser } from "../../../contexts/UserContext";
import CustomPhoto from "../CustomPhoto/CustomPhoto";
import FiveStarReview from "../FiveStarComponent/FiveStarComponent";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useDictionary } from "../../../contexts/DictionaryContext";
import * as ImagePicker from "expo-image-picker";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from "../../../constants/temas/ThemeColors";
import { getBestGoogleCoverBookImage } from '../../../services/BookService';
import CustomRating from '../CustomRating/CustomRating';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Tipos de modal
export type ModalType = 'view' | 'add' | 'read' | 'library';

interface UnifiedBookModalProps {
    isVisible: boolean;
    book: Livro | null;
    onClose: () => void;
    modalType: ModalType;

    // Props específicas para modal de avaliação
    currentRating?: number;
    onSaveRating?: (rating: number) => void;

    // Props específicas para modal de adicionar
    onSaveBook?: (book: Livro) => void;

    // Props para remoção
    removeFromLibrary?: boolean;
    removeFromRecommended?: boolean;
}

const createStyles = (theme: Theme) => StyleSheet.create({
    // Novos estilos
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    bookDetailsContainer: {
        flex: 2,
        flexGrow: 2,
        backgroundColor: theme.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingStart: 24,
        paddingEnd: 24,
    },
    bookContentContainer: {
        flex: 1,
        paddingTop: 24,
        paddingStart: 24,
        paddingEnd: 24,
    },
    bookHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 45,
    },
    bookTitle: {
        maxWidth: 260,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 20,
        color: 'white',
    },
    bookAuthor: {
        fontSize: 14,
        fontWeight: 'normal',
        
        color: 'white',
    },
    bookDate: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'white',
    },
   
    bookMetrics: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 44,
    },
    metricContainer: {
        paddingHorizontal: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    metricValue: {
        fontSize: 19,
        fontWeight: 'bold',
        color: theme.text,
    },
    metricLabel: {
        fontSize: 14,
        fontWeight: 'regular',
        color: theme.text,
    },
    synopsisContainer: {
        marginTop: 15,
    },
    synopsisTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 30,
        paddingBottom: 10,
        color: theme.text,
    },
    synopsisText: {
        fontSize: 14,
        fontWeight: 'regular',
        paddingRight: 35,
        textAlign: 'justify',
        color: theme.textSecondary,
        lineHeight: 22,
    },
     actionButtonsContainer: {
         flex: 1,
         gap: 15,
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         paddingTop: 30,
         paddingBottom: 20,
     },
    actionButton: {
        flex: 1,
        backgroundColor: theme.details,
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
    },
    actionButtonText: {
        color: theme.textButtons,
        fontSize: 16,
        fontWeight: 'bold',
    },
    showMoreButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: theme.modalBackgroundSecondary,
        borderRadius: 20,
        marginTop: 10,
    },
    showMoreButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    amazonButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    amazonButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },

    // Estilos antigos
    modalContainer: {
        flex: 1,
        backgroundColor: theme.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    placeholder: {
        width: 40,
    },
    trashButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    heroSection: {
        marginBottom: 20,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        color: theme.textSecondary,
    },
    imagePickerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePicker: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    modernBookCover: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    addPhotoSubtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        marginBottom: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    modernInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 15,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    actionButtons: {
        marginTop: 20,
    },
    saveButton: {
        width: '100%',
        marginBottom: 15,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 25,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 15,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

const UnifiedBookModal: React.FC<UnifiedBookModalProps> = ({
    isVisible,
    book,
    onClose,
    modalType,
    currentRating = 0,
    onSaveRating,
    onSaveBook,
    removeFromLibrary = false,
    removeFromRecommended = false,
}) => {
    const {
        addLivroLido,
        addLivroBiblioteca,
        removeLivroBiblioteca,
        removeLivroRecomendados,
        removeLivroLido,
    } = useUser();

    const { theme } = useTheme();
    const styles = createStyles(theme);
    console.log('Theme:', theme);
    const { t } = useDictionary();

    // Estados para diferentes tipos de modal
    const [isExpanded, setIsExpanded] = useState(false);
    const [rating, setRating] = useState(currentRating);

    // Função para atualizar rating com incrementos de 0.5
    const updateRating = (newRating: number) => {
        // Garantir que o rating seja múltiplo de 0.5 e esteja entre 0 e 5
        const roundedRating = Math.round(newRating * 2) / 2;
        const clampedRating = Math.max(0, Math.min(5, roundedRating));
        setRating(clampedRating);
    };


    // Estados para modal de adicionar livro
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [pageCount, setPageCount] = useState("");
    const [description, setDescription] = useState("");
    const [publishedDate, setPublishedDate] = useState("");
    const [publisher, setPublisher] = useState("");
    const [imageUri, setImageUri] = useState("");

    // Animações
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    // Reset states when modal opens/closes
    React.useEffect(() => {
        if (isVisible) {
            if (modalType === 'add') {
                setTitle("");
                setAuthor("");
                setPageCount("");
                setDescription("");
                setPublishedDate("");
                setPublisher("");
                setImageUri("");
            } else if (modalType === 'read') {
                setRating(currentRating);
            }

            // Animações de entrada
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
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
            // Reset animações
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
            scaleAnim.setValue(0.9);
        }
    }, [isVisible, modalType, currentRating]);

    // Log da imagem sendo usada no modal
    React.useEffect(() => {
        if (isVisible && book) {
            const bestImage = getBestGoogleCoverBookImage(book.imageLinks);
            console.log(`🖼️ MODAL ABERTO - Imagem de fundo otimizada: ${bestImage || 'N/A'}`);
            console.log(`🖼️ MODAL ABERTO - Todas as imagens:`, book.imageLinks);
        }
    }, [isVisible, book]);

    // Função para gerar UUID
    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    // Função para selecionar imagem
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [9, 16],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Função para comprar na Amazon
    const handleBuyOnAmazon = () => {
        if (book?.amazonLink) {
            console.log(`🛒 ABRINDO AMAZON: ${book.amazonLink}`);
            Linking.openURL(book.amazonLink);
        }
    };

    // Função para alternar expansão da descrição
    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    // Função para salvar avaliação
    const handleSaveRating = () => {
        if (onSaveRating) {
            console.log(`⭐ SALVANDO AVALIAÇÃO: ${rating} estrelas para "${book?.title}"`);
            onSaveRating(rating);
        }
        onClose();
    };

    // Função para salvar livro adicionado
    const handleSaveBook = () => {
        if (!title || !author || !pageCount) {
            console.log(`❌ CAMPOS OBRIGATÓRIOS FALTANDO`);
            return;
        }

        const amazonLink = `https://www.amazon.com.br/s?k=${encodeURIComponent(
            title + " " + author
        )}&linkCode=ll2&tag=bookfolio-20&language=pt_BR&ref_=as_li_ss_tl`;

        const newBook: Livro = {
            id: generateUUID(),
            title,
            authors: [author],
            pageCount: parseInt(pageCount, 10),
            description,
            publishedDate,
            publisher,
            amazonLink,
            imageLinks: { thumbnail: imageUri },
            LidoQuando: new Date(),
        };

        console.log(`📚 SALVANDO NOVO LIVRO: "${newBook.title}" por ${newBook.authors.join(", ")}`);
        addLivroLido(newBook);

        if (onSaveBook) {
            onSaveBook(newBook);
        }
        onClose();
    };

    // Função para remover livro
    const handleRemoveBook = () => {
        if (book) {
            console.log(`🗑️ REMOVENDO LIVRO: "${book.title}"`);
            removeLivroLido(book.id);
            onClose();
        }
    };

    // Função para adicionar à biblioteca
    const handleAddToLibrary = () => {
        if (book) {
            console.log(`📚 ADICIONANDO À BIBLIOTECA: "${book.title}"`);
            addLivroBiblioteca(book);

            if (removeFromRecommended) {
                removeLivroRecomendados(book.id);
            }
            onClose();
        }
    };

    // Função para marcar como lido
    const handleMarkAsRead = () => {
        if (book) {
            console.log(`✅ MARCADO COMO LIDO: "${book.title}"`);
            addLivroLido(book);

            if (removeFromLibrary) {
                removeLivroBiblioteca(book.id);
            }
            if (removeFromRecommended) {
                removeLivroRecomendados(book.id);
            }
            onClose();
        }
    };

    // Renderizar modal de adicionar livro
    if (modalType === 'add') {
        return (
            <Modal
                visible={isVisible}
                onRequestClose={onClose}
                animationType="slide"
                presentationStyle="fullScreen"
                statusBarTranslucent
            >
                <StatusBar barStyle={theme.modalThemeMode === 'black' ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <Animated.View
                        style={[
                            styles.modalHeader,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.closeButton,
                                {
                                    backgroundColor: theme.modalBackgroundSecondary,
                                    transform: [{ scale: pressed ? 0.95 : 1 }]
                                }
                            ]}
                        >
                            <Ionicons name="close" size={24} color={theme.text} />
                        </Pressable>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{t('addBook')}</Text>
                        <View style={styles.placeholder} />
                    </Animated.View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Hero Section */}
                        <Animated.View
                            style={[
                                styles.heroSection,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <Text style={[styles.heroTitle, { color: theme.text }]}>{t('didntFindBook')}</Text>
                            <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>Adicione seu livro favorito à coleção</Text>
                        </Animated.View>

                        {/* Image Picker */}
                        <Animated.View
                            style={[
                                styles.imagePickerContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }]
                                }
                            ]}
                        >
                            <Pressable
                                onPress={pickImage}
                                style={({ pressed }) => [
                                    styles.imagePicker,
                                    {
                                        backgroundColor: theme.modalBackgroundSecondary,
                                        borderColor: theme.details,
                                        transform: [{ scale: pressed ? 0.98 : 1 }]
                                    }
                                ]}
                            >
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.modernBookCover} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="camera" size={40} color={theme.details} />
                                        <Text style={[styles.addPhotoText, { color: theme.textSecondary }]}>{t('addCover')}</Text>
                                        <Text style={[styles.addPhotoSubtext, { color: theme.textSecondary }]}>Toque para adicionar</Text>
                                    </View>
                                )}
                            </Pressable>
                        </Animated.View>

                        {/* Form Fields */}
                        <Animated.View
                            style={[
                                styles.formContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>{t('title')} *</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.inputWrapper,
                                        {
                                            backgroundColor: theme.modalBackgroundSecondary,
                                            borderColor: title ? theme.details : theme.borderBottom,
                                            transform: [{ scale: pressed ? 0.99 : 1 }]
                                        }
                                    ]}
                                >
                                    <Ionicons name="book" size={20} color={title ? theme.details : theme.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Digite o título do livro"
                                        placeholderTextColor={theme.textSecondary}
                                        style={[styles.modernInput, { color: theme.text }]}
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>{t('author')} *</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.inputWrapper,
                                        {
                                            backgroundColor: theme.modalBackgroundSecondary,
                                            borderColor: author ? theme.details : theme.borderBottom,
                                            transform: [{ scale: pressed ? 0.99 : 1 }]
                                        }
                                    ]}
                                >
                                    <Ionicons name="person" size={20} color={author ? theme.details : theme.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Nome do autor"
                                        placeholderTextColor={theme.textSecondary}
                                        style={[styles.modernInput, { color: theme.text }]}
                                        value={author}
                                        onChangeText={setAuthor}
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>{t('pageCount')} *</Text>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.inputWrapper,
                                        {
                                            backgroundColor: theme.modalBackgroundSecondary,
                                            borderColor: pageCount ? theme.details : theme.borderBottom,
                                            transform: [{ scale: pressed ? 0.99 : 1 }]
                                        }
                                    ]}
                                >
                                    <Ionicons name="layers" size={20} color={pageCount ? theme.details : theme.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Número de páginas"
                                        placeholderTextColor={theme.textSecondary}
                                        keyboardType="numeric"
                                        style={[styles.modernInput, { color: theme.text }]}
                                        value={pageCount}
                                        onChangeText={setPageCount}
                                    />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>{t('descriptionOptional')}</Text>
                                <View style={[styles.inputWrapper, { backgroundColor: theme.modalBackgroundSecondary, borderColor: theme.details }]}>
                                    <Ionicons name="document-text" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Descrição do livro (opcional)"
                                        placeholderTextColor={theme.textSecondary}
                                        style={[styles.modernInput, styles.textArea, { color: theme.text }]}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        numberOfLines={4}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, styles.halfWidth]}>
                                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('publishedDateOptional')}</Text>
                                    <View style={[styles.inputWrapper, { backgroundColor: theme.modalBackgroundSecondary, borderColor: theme.details }]}>
                                        <Ionicons name="calendar" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                        <TextInput
                                            placeholder="2023"
                                            placeholderTextColor={theme.textSecondary}
                                            style={[styles.modernInput, { color: theme.text }]}
                                            value={publishedDate}
                                            onChangeText={setPublishedDate}
                                        />
                                    </View>
                                </View>

                                <View style={[styles.inputGroup, styles.halfWidth]}>
                                    <Text style={[styles.inputLabel, { color: theme.text }]}>{t('publisherOptional')}</Text>
                                    <View style={[styles.inputWrapper, { backgroundColor: theme.modalBackgroundSecondary, borderColor: theme.details }]}>
                                        <Ionicons name="business" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                        <TextInput
                                            placeholder="Editora"
                                            placeholderTextColor={theme.textSecondary}
                                            style={[styles.modernInput, { color: theme.text }]}
                                            value={publisher}
                                            onChangeText={setPublisher}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Animated.View>

                        {/* Action Buttons */}
                        <Animated.View
                            style={[
                                styles.actionButtons,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <Pressable
                                onPress={handleSaveBook}
                                style={({ pressed }) => [
                                    styles.saveButton,
                                    {
                                        transform: [{ scale: pressed ? 0.95 : 1 }]
                                    }
                                ]}
                                disabled={!title || !author || !pageCount}
                            >
                                <View style={[
                                    styles.gradientButton,
                                    {
                                        backgroundColor: (!title || !author || !pageCount) ? theme.textSecondary : theme.details,
                                        opacity: (!title || !author || !pageCount) ? 0.5 : 1
                                    }
                                ]}>
                                    <Ionicons name="checkmark" size={24} color={theme.textButtons} />
                                    <Text style={[styles.saveButtonText, { color: theme.textButtons }]}>{t('save')}</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                onPress={onClose}
                                style={({ pressed }) => [
                                    styles.cancelButton,
                                    {
                                        transform: [{ scale: pressed ? 0.95 : 1 }]
                                    }
                                ]}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>{t('close')}</Text>
                            </Pressable>
                        </Animated.View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    // Para outros tipos de modal, precisa ter um livro
    if (!book) {
        return null;
    }

    const truncatedDescription = book.description && book.description.length > 400
        ? book.description.substring(0, 400) + "..."
        : book.description;

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={{ uri: getBestGoogleCoverBookImage(book?.imageLinks) || undefined }}
                    style={styles.backgroundImage}
                >
                    <View style={styles.backgroundOverlay} />
                    <View style={styles.bookContentContainer}>
                        <View style={styles.bookHeaderContainer}>
                            <Pressable onPress={onClose}>
                                <Ionicons
                                    name="return-up-back-outline"
                                    size={30}
                                    color="white"
                                />
                            </Pressable>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    display: "flex",
                                    gap: 20,
                                    justifyContent: "flex-end",
                                }}
                            >
                                <CustomButton
                                    onPress={handleBuyOnAmazon}
                                    placeholder="Comprar"
                                    styleType={3}
                                    size="xs"
                                    fontSize={12}
                                    height={32}
                                    fullWidth={false}
                                />
                                <Pressable onPress={() => console.log('Share')}>
                                    <Ionicons name="share-outline" size={24} color="white" />
                                </Pressable>
                            </View>
                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
                            <CustomPhoto uri={getBestGoogleCoverBookImage(book?.imageLinks) || ""} type={3} />

                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={styles.bookTitle}>
                                    {book?.title && book.title.length > 40
                                        ? book.title.substring(0, 40).trim() + "..."
                                        : book?.title}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                    <Text style={styles.bookAuthor}>
                                        {book?.authors?.join(", ") && book.authors.join(", ").length > 30
                                            ? book.authors.join(", ").substring(0, 30).trim() + "..."
                                            : book?.authors?.join(", ") || t('author.unknown')}
                                    </Text>
                                   
                                   <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}> - </Text>
                                        <Text style={styles.bookDate}>
                                            {book?.publishedDate || 'N/A'}
                                        </Text>
                                    


                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: 12,
                                    }}
                                >
                                    <CustomRating
                                        value={rating}
                                        onRatingChange={updateRating}
                                        size={24}
                                        color='#FFD700'
                                        emptyColor='#CCCCCC'
                                    />
                                    <CustomButton
                                        onPress={() => console.log('Avaliar')}
                                        placeholder="Avaliar"
                                        styleType={1}
                                        size="xs"
                                        fontSize={12}
                                        height={32}
                                        fullWidth={false}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView
                        style={styles.bookDetailsContainer}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                            autoscrollToTopThreshold: 10,
                        }}
                    >
                        {/* Book Metrics */}
                        <View style={styles.bookMetrics}>
                            <View style={styles.metricContainer}>
                                <Text style={styles.metricValue}>{book?.pageCount || 'N/A'}</Text>
                                <Text style={styles.metricLabel}>{t('book.pages')}</Text>
                            </View>
                            <View style={styles.metricContainer}>
                                <Text style={styles.metricValue}>{rating.toFixed(1)}</Text>
                                <Text style={styles.metricLabel}>{t('book.rating')}</Text>
                            </View>
                        </View>

                         {/* Action Buttons */}
                         <View style={styles.actionButtonsContainer}>
                             <CustomButton
                                 onPress={() => {
                                     if (book) {
                                         addLivroLido(book);
                                         onClose();
                                     }
                                 }}
                                 placeholder="Já Li"
                                 styleType={1}
                                 size="small"
                                 fontSize={12}
                                 height={36}
                             />
                             <CustomButton
                                 onPress={() => {
                                     if (book) {
                                         addLivroBiblioteca(book);
                                         onClose();
                                     }
                                 }}
                                 placeholder="Quero Ler"
                                 styleType={2}
                                 size="small"
                                 fontSize={12}
                                 height={36}
                             />
                         </View>

                        {/* Synopsis */}
                        <View style={styles.synopsisContainer}>
                            <Text style={styles.synopsisTitle}>{t('book.synopsis')}</Text>
                            <Text
                                style={styles.synopsisText}
                                numberOfLines={isExpanded ? undefined : 5}
                            >
                                {book?.description || t('book.noSynopsisAvailable')}
                            </Text>
                            {book?.description && book.description.length > 200 && (
                                <CustomButton
                                    onPress={toggleExpansion}
                                    placeholder={isExpanded ? t('showLess') : t('showMore')}
                                    styleType={2}
                                    size="xs"
                                    fontSize={12}
                                    height={32}
                                    fullWidth={false}
                                />
                            )}
                        </View>

                        <View style={{ marginBottom: 500 }}></View>
                    </ScrollView>
                </ImageBackground>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    // Modal Container
    modalContainer: {
        flex: 1,
    },

    // Header
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    placeholder: {
        width: 40,
    },
    trashButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    // Scroll Content
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },

    // Hero Section (Add Book)
    heroSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },

    // Image Picker
    imagePickerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    imagePicker: {
        width: 200,
        height: 300,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    imagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
    addPhotoSubtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
        textAlign: 'center',
    },

    // Form
    formContainer: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    inputIcon: {
        marginRight: 12,
    },
    modernInput: {
        flex: 1,
        fontSize: 16,
        color: 'white',
        paddingVertical: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },

    // Action Buttons (Add Book)
    actionButtons: {
        alignItems: 'center',
    },
    saveButton: {
        width: '100%',
        marginBottom: 15,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 25,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    cancelButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    cancelButtonText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },

    // Book Card
    bookCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    bookCardGradient: {
        padding: 20,
    },
    bookHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bookImageContainer: {
        position: 'relative',
        marginRight: 20,
    },
    modernBookCover: {
        width: 120,
        height: 180,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    bookImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 15,
    },
    bookInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    modernBookTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        lineHeight: 28,
    },
    modernBookAuthors: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
    },
    actionButtonsRow: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 15,
        width: '100%',
    },
    amazonButton: {
        width: '100%',
    },
    amazonButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    amazonButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
        marginLeft: 8,
    },
    actionButtonsSubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
    },
    actionButton: {
        flex: 1,
    },
    actionButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 8,
    },

    // Details Card
    detailsCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    detailsGradient: {
        padding: 20,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    detailsGrid: {
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginLeft: 12,
        marginRight: 8,
        minWidth: 80,
    },
    detailValue: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        flex: 1,
    },

    // Description Card
    descriptionCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    descriptionGradient: {
        padding: 20,
    },
    descriptionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    modernDescription: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 24,
        marginBottom: 15,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    expandButtonText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginRight: 5,
    },

    // Rating Card
    ratingCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    ratingGradient: {
        padding: 20,
    },
    ratingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    ratingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    ratingContent: {
        alignItems: 'center',
    },
    starsContainer: {
        marginBottom: 20,
        transform: [{ scale: 1.2 }],
    },
    ratingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    ratingCancelButton: {
        flex: 1,
        paddingVertical: 15,
        marginRight: 10,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    ratingCancelText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    ratingSaveButton: {
        flex: 1,
        marginLeft: 10,
    },
    ratingSaveGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 25,
        gap: 8,
    },
    ratingSaveText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },

});

export default UnifiedBookModal;

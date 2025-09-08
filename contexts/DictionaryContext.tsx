import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importando AsyncStorage

interface TranslationsDictionary {
  pt: Translations;
  es: Translations;
  fr: Translations;
  en: Translations;
}

export interface Translations {
  melhores: string;
  livrosLidosEm: string;
  livroAdicionado: string;
  adicionarLivro: string;
  lidos: string;
  lerMaisTarde: string;
  sufixoNumero: string;
  fechar: string;
  recomendadoParaVoce: string;
  livrosRecomendados: string;
  livrosDoGenero: string;
  recomendadosParaVoce: string;
  nenhumLivroEncontrado: string;
  carregandoMaisLivros: string;
  searchBooksPlaceholder: string; // Adicionado para o placeholder
  janeiro: string;
  fevereiro: string;
  marco: string;
  abril: string;
  maio: string;
  junho: string;
  julho: string;
  agosto: string;
  setembro: string;
  outubro: string;
  novembro: string;
  dezembro: string;
  resetAccount: string;
  back: string;
  testAd: string;
  profile: string;
  yearBooksRead: string;
  monthBooksRead: string;
  weekBooksRead: string;
  adjustGoals: string;
  annualGoal: string;
  monthlyGoal: string;
  weeklyGoal: string;
  save: string;
  cancel: string;
  adjustGoalsButton: string;
  changeTheme: string;
  selectTheme: string;
  close: string;
  claro: string;
  escuro: string;
  1984: string;
  gollum: string;
  dracula: string;
  gatsby: string;
  maravilhas: string;
  odisseia: string;
  orgulhoEPreconceito: string;
  ulisses: string;
  amado: string;
  fahrenheit451: string;
  duna: string;
  belaEAFera: string;
  selectLanguage: string; // Novo
  changeLanguage: string; // Novo
  portugues: string; // Novo
  ingles: string; // Novo
  espanhol: string; // Novo
  frances: string; // Novo
  didntFindBook: string;
  addBook: string;
  addCover: string;
  title: string;
  author: string;
  pageCount: string;
  descriptionOptional: string;
  publishedDateOptional: string;
  publisherOptional: string;
  confirm: string;
  rateBook: string;
  buyOnAmazon: string;
  showMore: string;
  showLess: string;
  publisher: string;
  releaseDate: string;
  read: string;
  readLater: string;
  home: string;
  recomendations: string;
  library: string;

  // Novas traduções para o modal de livros
  'author.unknown': string;
  'book.readers': string;
  'book.pages': string;
  'book.rating': string;
  'book.synopsis': string;
  'book.noSynopsisAvailable': string;
  'book.read': string;
  'book.readLater': string;
  
  // Empty states
  'empty.booksRead.title': string;
  'empty.booksRead.subtitle': string;
  'empty.booksRead.action': string;
  'empty.library.title': string;
  'empty.library.subtitle': string;
  'empty.library.action': string;
  'empty.recommendations.title': string;
  'empty.recommendations.subtitle': string;
  'empty.recommendations.action': string;
  'empty.profile.title': string;
  'empty.profile.subtitle': string;
  'empty.profile.action': string;
}

const translations: TranslationsDictionary = {
  pt: {
    melhores: "Melhores",
    livrosLidosEm: "Livros Lidos em",
    livroAdicionado: "Livro adicionado:",
    adicionarLivro: "Adicionar Livro",
    lidos: "Lidos",
    lerMaisTarde: "Ler mais tarde",
    sufixoNumero: "º",
    fechar: "Fechar",
    recomendadoParaVoce: "Recomendado para você",
    livrosRecomendados: "Livros Recomendados",
    livrosDoGenero: "Livros do Gênero",
    recomendadosParaVoce: "Recomendados para Você",
    nenhumLivroEncontrado: "Nenhum livro encontrado.",
    carregandoMaisLivros: "Carregando mais livros...",
    searchBooksPlaceholder: "Buscar livros...", // Adicionado
    janeiro: "Janeiro",
    fevereiro: "Fevereiro",
    marco: "Março",
    abril: "Abril",
    maio: "Maio",
    junho: "Junho",
    julho: "Julho",
    agosto: "Agosto",
    setembro: "Setembro",
    outubro: "Outubro",
    novembro: "Novembro",
    dezembro: "Dezembro",
    resetAccount: "Resetar Conta", // Novo
    back: "Voltar", // Novo
    testAd: "TESTE ANUNCIO", // Novo
    profile: "Perfil", // Novo
    yearBooksRead: "Ano: Livros lidos",
    monthBooksRead: "Mês: Livros lidos",
    weekBooksRead: "Semana: Livros lidos",
    adjustGoals: "Ajustar Metas",
    annualGoal: "Meta anual:",
    monthlyGoal: "Meta mensal:",
    weeklyGoal: "Meta semanal:",
    save: "Salvar",
    cancel: "Cancelar",
    adjustGoalsButton: "Ajustar Metas",
    changeTheme: "Mudar Tema", // Novo
    selectTheme: "Selecione um Tema", // Novo
    close: "Fechar", // Novo
    claro: "Claro", // Novo
    escuro: "Escuro", // Novo
    1984: "1984", // Novo
    gollum: "Gollum", // Novo
    dracula: "Drácula", // Novo
    gatsby: "Gatsby", // Novo
    maravilhas: "Maravilhas", // Novo
    odisseia: "Odisseia", // Novo
    orgulhoEPreconceito: "Orgulho e Preconceito", // Novo
    ulisses: "Ulisses", // Novo
    amado: "Amado", // Novo
    fahrenheit451: "Fahrenheit 451", // Novo
    duna: "Duna", // Novo
    belaEAFera: "Bela e a Fera", // Novo
    selectLanguage: "Selecione um Idioma", // Adicionado
    changeLanguage: "Mudar Idioma", // Adicionado
    portugues: "Português", // Adicionado
    ingles: "Inglês", // Adicionado
    espanhol: "Espanhol", // Adicionado
    frances: "Francês", // Adicionado
    didntFindBook: "Não encontrou um livro?",
    addBook: "Adicionar Livro",
    addCover: "Adicionar capa",
    title: "Título",
    author: "Autor",
    pageCount: "Qtd de Páginas",
    descriptionOptional: "Descrição (opcional)",
    publishedDateOptional: "Lançamento (opcional)",
    publisherOptional: "Editora (opcional)",
    buyOnAmazon: "Comprar na Amazon",
    showMore: "Ver mais",
    showLess: "Ver menos",
    publisher: "Editora",
    releaseDate: "Lançamento",
    read: "Lido",
    readLater: "Ler mais tarde",
    rateBook: "Avalie o Livro",
    confirm: "Confirmar",
    home: "Home",
    recomendations: "Para Você",
    library: "Biblioteca",

    // Novas traduções para o modal de livros
    'author.unknown': "Autor Desconhecido",
    'book.readers': "Leitores",
    'book.pages': "Páginas",
    'book.rating': "Avaliação",
    'book.synopsis': "Sinopse",
    'book.noSynopsisAvailable': "Nenhuma sinopse disponível",
    'book.read': "Lido",
    'book.readLater': "Ler mais tarde",
    
    // Empty states
    'empty.booksRead.title': "Nenhum livro lido ainda",
    'empty.booksRead.subtitle': "Comece sua jornada literária adicionando seu primeiro livro",
    'empty.booksRead.action': "Adicionar primeiro livro",
    'empty.library.title': "Sua biblioteca está vazia",
    'empty.library.subtitle': "Adicione livros para ler mais tarde e organize sua lista",
    'empty.library.action': "Adicionar livros",
    'empty.recommendations.title': "Nenhuma recomendação disponível",
    'empty.recommendations.subtitle': "Leia alguns livros primeiro para receber recomendações personalizadas",
    'empty.recommendations.action': "Ver livros lidos",
    'empty.profile.title': "Bem-vindo ao BookFolio",
    'empty.profile.subtitle': "Configure suas metas de leitura e personalize sua experiência",
    'empty.profile.action': "Começar",
  },
  es: {
    melhores: "Mejores",
    livrosLidosEm: "Libros Leídos en",
    livroAdicionado: "Libro añadido:",
    adicionarLivro: "Agregar Libro",
    lidos: "Leídos",
    lerMaisTarde: "Leer más tarde",
    sufixoNumero: "º",
    fechar: "Cerrar",
    recomendadoParaVoce: "Recomendado para ti",
    livrosRecomendados: "Libros Recomendados",
    livrosDoGenero: "Libros del Género",
    recomendadosParaVoce: "Recomendados para Ti",
    nenhumLivroEncontrado: "Ningún libro encontrado.",
    carregandoMaisLivros: "Cargando más libros...",
    searchBooksPlaceholder: "Buscar libros...", // Adicionado
    janeiro: "Enero",
    fevereiro: "Febrero",
    marco: "Marzo",
    abril: "Abril",
    maio: "Mayo",
    junho: "Junio",
    julho: "Julio",
    agosto: "Agosto",
    setembro: "Septiembre",
    outubro: "Octubre",
    novembro: "Noviembre",
    dezembro: "Diciembre",
    resetAccount: "Restablecer Cuenta", // Novo
    back: "Regresar", // Novo
    testAd: "PRUEBA ANUNCIO", // Novo
    profile: "Perfil", // Novo
    yearBooksRead: "Año: Libros leídos",
    monthBooksRead: "Mes: Libros leídos",
    weekBooksRead: "Semana: Libros leídos",
    adjustGoals: "Ajustar Metas",
    annualGoal: "Meta anual:",
    monthlyGoal: "Meta mensual:",
    weeklyGoal: "Meta semanal:",
    save: "Guardar",
    cancel: "Cancelar",
    adjustGoalsButton: "Ajustar Metas",
    changeTheme: "Cambiar Tema", // Novo
    selectTheme: "Seleccione un Tema", // Novo
    close: "Cerrar", // Novo
    claro: "Claro", // Novo
    escuro: "Oscuro", // Novo
    1984: "1984", // Novo
    gollum: "Gollum", // Novo
    dracula: "Drácula", // Novo
    gatsby: "Gatsby", // Novo
    maravilhas: "Maravillas", // Novo
    odisseia: "Odisea", // Novo
    orgulhoEPreconceito: "Orgullo y Prejuicio", // Novo
    ulisses: "Ulises", // Novo
    amado: "Amado", // Novo
    fahrenheit451: "Fahrenheit 451", // Novo
    duna: "Duna", // Novo
    belaEAFera: "La Bella y la Bestia", // Novo
    selectLanguage: "Seleccione un Idioma",
    changeLanguage: "Cambiar Idioma",
    portugues: "Portugués",
    ingles: "Inglés",
    espanhol: "Español",
    frances: "Francés",
    didntFindBook: "¿No encontraste un libro?",
    addBook: "Agregar Libro",
    addCover: "Agregar portada",
    title: "Título",
    author: "Autor",
    pageCount: "Cantidad de Páginas",
    descriptionOptional: "Descripción (opcional)",
    publishedDateOptional: "Lanzamiento (opcional)",
    publisherOptional: "Editorial (opcional)",
    buyOnAmazon: "Comprar en Amazon",
    showMore: "Ver más",
    showLess: "Ver menos",
    publisher: "Editorial",
    releaseDate: "Fecha de publicación",
    read: "Leído",
    readLater: "Leer más tarde",
    rateBook: "Califica el Libro",
    confirm: "Confirmar",
    home: "Inicio",
    recomendations: "Para Ti",
    library: "Biblioteca",

    // Novas traduções para o modal de livros
    'author.unknown': "Autor Desconocido",
    'book.readers': "Lectores",
    'book.pages': "Páginas",
    'book.rating': "Calificación",
    'book.synopsis': "Sinopsis",
    'book.noSynopsisAvailable': "Ninguna sinopsis disponible",
    'book.read': "Leído",
    'book.readLater': "Leer más tarde",
    
    // Empty states
    'empty.booksRead.title': "Aún no has leído libros",
    'empty.booksRead.subtitle': "Comienza tu viaje literario agregando tu primer libro",
    'empty.booksRead.action': "Agregar primer libro",
    'empty.library.title': "Tu biblioteca está vacía",
    'empty.library.subtitle': "Agrega libros para leer más tarde y organiza tu lista",
    'empty.library.action': "Agregar libros",
    'empty.recommendations.title': "No hay recomendaciones disponibles",
    'empty.recommendations.subtitle': "Lee algunos libros primero para recibir recomendaciones personalizadas",
    'empty.recommendations.action': "Ver libros leídos",
    'empty.profile.title': "Bienvenido a BookFolio",
    'empty.profile.subtitle': "Configura tus metas de lectura y personaliza tu experiencia",
    'empty.profile.action': "Comenzar",
  },
  fr: {
    melhores: "Meilleurs",
    livrosLidosEm: "Livres Lus en",
    livroAdicionado: "Livre ajouté:",
    adicionarLivro: "Ajouter Livre",
    lidos: "Lus",
    lerMaisTarde: "Lire plus tard",
    sufixoNumero: "º",
    fechar: "Fermer",
    recomendadoParaVoce: "Recommandé pour vous",
    livrosRecomendados: "Livres Recommandés",
    livrosDoGenero: "Livres du Genre",
    recomendadosParaVoce: "Recommandés pour Vous",
    nenhumLivroEncontrado: "Aucun livre trouvé.",
    carregandoMaisLivros: "Chargement de plus de livres...",
    searchBooksPlaceholder: "Rechercher des livres...", // Adicionado
    janeiro: "Janvier",
    fevereiro: "Février",
    marco: "Mars",
    abril: "Avril",
    maio: "Mai",
    junho: "Juin",
    julho: "Juillet",
    agosto: "Août",
    setembro: "Septembre",
    outubro: "Octobre",
    novembro: "Novembre",
    dezembro: "Décembre",
    resetAccount: "Réinitialiser le Compte", // Novo
    back: "Retour", // Novo
    testAd: "TEST ANNONCE", // Novo
    profile: "Profil", // Novo
    yearBooksRead: "Année: Livres lus",
    monthBooksRead: "Mois: Livres lus",
    weekBooksRead: "Semaine: Livres lus",
    adjustGoals: "Ajuster les Objectifs",
    annualGoal: "Objectif annuel:",
    monthlyGoal: "Objectif mensuel:",
    weeklyGoal: "Objectif hebdomadaire:",
    save: "Sauvegarder",
    cancel: "Annuler",
    adjustGoalsButton: "Ajuster les Objectifs",
    changeTheme: "Changer de Thème", // Novo
    selectTheme: "Sélectionnez un Thème", // Novo
    close: "Fermer", // Novo
    claro: "Clair", // Novo
    escuro: "Sombre", // Novo
    1984: "1984", // Novo
    gollum: "Gollum", // Novo
    dracula: "Dracula", // Novo
    gatsby: "Gatsby", // Novo
    maravilhas: "Merveilles", // Novo
    odisseia: "Odyssée", // Novo
    orgulhoEPreconceito: "Orgueil et Préjugés", // Novo
    ulisses: "Ulysse", // Novo
    amado: "Amado", // Novo
    fahrenheit451: "Fahrenheit 451", // Novo
    duna: "Dune", // Novo
    belaEAFera: "La Belle et la Bête", // Novo
    selectLanguage: "Sélectionnez une Langue",
    changeLanguage: "Changer de Langue",
    portugues: "Portugais",
    ingles: "Anglais",
    espanhol: "Espagnol",
    frances: "Français",
    didntFindBook: "Vous n'avez pas trouvé de livre?",
    addBook: "Ajouter un Livre",
    addCover: "Ajouter une couverture",
    title: "Titre",
    author: "Auteur",
    pageCount: "Nombre de Pages",
    descriptionOptional: "Description (facultatif)",
    publishedDateOptional: "Date de publication (facultatif)",
    publisherOptional: "Éditeur (facultatif)",
    buyOnAmazon: "Acheter sur Amazon",
    showMore: "Voir plus",
    showLess: "Voir moins",
    publisher: "Éditeur",
    releaseDate: "Date de sortie",
    read: "Lu",
    readLater: "Lire plus tard",
    rateBook: "Évaluez le Livre",
    confirm: "Confirmer",
    home: "Accueil",
    recomendations: "Pour Vous",
    library: "Bibliothèque",

    // Novas traduções para o modal de livros
    'author.unknown': "Auteur Inconnu",
    'book.readers': "Lecteurs",
    'book.pages': "Pages",
    'book.rating': "Évaluation",
    'book.synopsis': "Synopsis",
    'book.noSynopsisAvailable': "Aucun synopsis disponible",
    'book.read': "Lu",
    'book.readLater': "Lire plus tard",
    
    // Empty states
    'empty.booksRead.title': "Aucun livre lu pour le moment",
    'empty.booksRead.subtitle': "Commencez votre voyage littéraire en ajoutant votre premier livre",
    'empty.booksRead.action': "Ajouter le premier livre",
    'empty.library.title': "Votre bibliothèque est vide",
    'empty.library.subtitle': "Ajoutez des livres à lire plus tard et organisez votre liste",
    'empty.library.action': "Ajouter des livres",
    'empty.recommendations.title': "Aucune recommandation disponible",
    'empty.recommendations.subtitle': "Lisez d'abord quelques livres pour recevoir des recommandations personnalisées",
    'empty.recommendations.action': "Voir les livres lus",
    'empty.profile.title': "Bienvenue sur BookFolio",
    'empty.profile.subtitle': "Configurez vos objectifs de lecture et personnalisez votre expérience",
    'empty.profile.action': "Commencer",
  },
  en: {
    melhores: "Best",
    livrosLidosEm: "Books Read in",
    livroAdicionado: "Book added:",
    adicionarLivro: "Add Book",
    lidos: "Read",
    lerMaisTarde: "Read Later",
    sufixoNumero: "th",
    fechar: "Close",
    recomendadoParaVoce: "Recommended for you",
    livrosRecomendados: "Recommended Books",
    livrosDoGenero: "Books in Genre",
    recomendadosParaVoce: "Recommended for You",
    nenhumLivroEncontrado: "No books found.",
    carregandoMaisLivros: "Loading more books...",
    searchBooksPlaceholder: "Search for books...", // Adicionado
    janeiro: "January",
    fevereiro: "February",
    marco: "March",
    abril: "April",
    maio: "May",
    junho: "June",
    julho: "July",
    agosto: "August",
    setembro: "September",
    outubro: "October",
    novembro: "November",
    dezembro: "December",
    resetAccount: "Reset Account", // Novo
    back: "Back", // Novo
    testAd: "TEST AD", // Novo
    profile: "Profile", // Novo
    yearBooksRead: "Year: Books Read",
    monthBooksRead: "Month: Books Read",
    weekBooksRead: "Week: Books Read",
    adjustGoals: "Adjust Goals",
    annualGoal: "Annual Goal:",
    monthlyGoal: "Monthly Goal:",
    weeklyGoal: "Weekly Goal:",
    save: "Save",
    cancel: "Cancel",
    adjustGoalsButton: "Adjust Goals",
    changeTheme: "Change Theme", // Novo
    selectTheme: "Select a Theme", // Novo
    close: "Close", // Novo
    claro: "Light", // Novo
    escuro: "Dark", // Novo
    1984: "1984", // Novo
    gollum: "Gollum", // Novo
    dracula: "Dracula", // Novo
    gatsby: "Gatsby", // Novo
    maravilhas: "Wonders", // Novo
    odisseia: "Odyssey", // Novo
    orgulhoEPreconceito: "Pride and Prejudice", // Novo
    ulisses: "Ulysses", // Novo
    amado: "Beloved", // Novo
    fahrenheit451: "Fahrenheit 451", // Novo
    duna: "Dune", // Novo
    belaEAFera: "Beauty and the Beast", // Novo
    selectLanguage: "Select Language", // Adicionado
    changeLanguage: "Change Language", // Adicionado
    portugues: "Portuguese", // Adicionado
    ingles: "English", // Adicionado
    espanhol: "Spanish", // Adicionado
    frances: "French", // Adicionado
    didntFindBook: "Didn't find a book?",
    addBook: "Add Book",
    addCover: "Add cover",
    title: "Title",
    author: "Author",
    pageCount: "Page Count",
    descriptionOptional: "Description (optional)",
    publishedDateOptional: "Published Date (optional)",
    publisherOptional: "Publisher (optional)",
    buyOnAmazon: "Buy on Amazon",
    showMore: "Show more",
    showLess: "Show less",
    publisher: "Publisher",
    releaseDate: "Release Date",
    read: "Read",
    readLater: "Read Later",
    rateBook: "Rate the Book",
    confirm: "Confirm",
    home: "Home",
    recomendations: "For You",
    library: "Library",

    // Novas traduções para o modal de livros
    'author.unknown': "Unknown Author",
    'book.readers': "Readers",
    'book.pages': "Pages",
    'book.rating': "Rating",
    'book.synopsis': "Synopsis",
    'book.noSynopsisAvailable': "No synopsis available",
    'book.read': "Read",
    'book.readLater': "Read Later",
    
    // Empty states
    'empty.booksRead.title': "No books read yet",
    'empty.booksRead.subtitle': "Start your literary journey by adding your first book",
    'empty.booksRead.action': "Add first book",
    'empty.library.title': "Your library is empty",
    'empty.library.subtitle': "Add books to read later and organize your list",
    'empty.library.action': "Add books",
    'empty.recommendations.title': "No recommendations available",
    'empty.recommendations.subtitle': "Read some books first to receive personalized recommendations",
    'empty.recommendations.action': "View read books",
    'empty.profile.title': "Welcome to BookFolio",
    'empty.profile.subtitle': "Set up your reading goals and personalize your experience",
    'empty.profile.action': "Get started",
  },
};

type DictionaryContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations) => string;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined
);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>("pt");

  useEffect(() => {
    // Carrega o idioma do AsyncStorage quando o app inicializa
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('appLanguage');
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Erro ao carregar a linguagem:', error);
      }
    };

    loadLanguage();
  }, []);

  const saveLanguage = async (newLanguage: string) => {
    try {
      await AsyncStorage.setItem('appLanguage', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Erro ao salvar a linguagem:', error);
    }
  };


  const t = (key: keyof Translations): string => {
    const translation =
      translations[language as keyof TranslationsDictionary][key];
    return translation;
  };

  return (
    <DictionaryContext.Provider value={{ language, setLanguage: saveLanguage, t }}>
    
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};

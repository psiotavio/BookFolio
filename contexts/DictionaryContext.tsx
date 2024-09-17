import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Translations {
  melhores: string;
  livrosLidosEm: string;
  livroAdicionado: string;
  adicionarLivro: string;
  lidos: string;
  lerMaisTarde: string;
  sufixoNumero: string;
  fechar: string;
  recomendadoParaVoce: string;        // Novo
  livrosRecomendados: string;         // Novo
  livrosDoGenero: string;             // Novo
  recomendadosParaVoce: string;       // Novo
  nenhumLivroEncontrado: string;      // Novo
  carregandoMaisLivros: string;       // Novo
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
}

interface TranslationsDictionary {
  pt: Translations;
  es: Translations;
  fr: Translations;
  en: Translations;
}

const translations: TranslationsDictionary = {
  pt: {
    melhores: 'Melhores',
    livrosLidosEm: 'Livros Lidos em',
    livroAdicionado: 'Livro adicionado:',
    adicionarLivro: 'Adicionar Livro',
    lidos: 'Lidos',
    lerMaisTarde: 'Ler mais tarde',
    sufixoNumero: 'º',
    fechar: 'Fechar',
    recomendadoParaVoce: 'Recomendado para você',         // Adicionado
    livrosRecomendados: 'Livros Recomendados',            // Adicionado
    livrosDoGenero: 'Livros do Gênero',                   // Adicionado
    recomendadosParaVoce: 'Recomendados para Você',       // Adicionado
    nenhumLivroEncontrado: 'Nenhum livro encontrado.',    // Adicionado
    carregandoMaisLivros: 'Carregando mais livros...',    // Adicionado
    janeiro: 'Janeiro',
    fevereiro: 'Fevereiro',
    marco: 'Março',
    abril: 'Abril',
    maio: 'Maio',
    junho: 'Junho',
    julho: 'Julho',
    agosto: 'Agosto',
    setembro: 'Setembro',
    outubro: 'Outubro',
    novembro: 'Novembro',
    dezembro: 'Dezembro',
  },
  es: {
    melhores: 'Mejores',
    livrosLidosEm: 'Libros Leídos en',
    livroAdicionado: 'Libro añadido:',
    adicionarLivro: 'Agregar Libro',
    lidos: 'Leídos',
    lerMaisTarde: 'Leer más tarde',
    sufixoNumero: 'º',
    fechar: 'Cerrar',
    recomendadoParaVoce: 'Recomendado para ti',           // Adicionado
    livrosRecomendados: 'Libros Recomendados',            // Adicionado
    livrosDoGenero: 'Libros del Género',                  // Adicionado
    recomendadosParaVoce: 'Recomendados para Ti',         // Adicionado
    nenhumLivroEncontrado: 'Ningún libro encontrado.',    // Adicionado
    carregandoMaisLivros: 'Cargando más libros...',       // Adicionado
    janeiro: 'Enero',
    fevereiro: 'Febrero',
    marco: 'Marzo',
    abril: 'Abril',
    maio: 'Mayo',
    junho: 'Junio',
    julho: 'Julio',
    agosto: 'Agosto',
    setembro: 'Septiembre',
    outubro: 'Octubre',
    novembro: 'Noviembre',
    dezembro: 'Diciembre',
  },
  fr: {
    melhores: 'Meilleurs',
    livrosLidosEm: 'Livres Lus en',
    livroAdicionado: 'Livre ajouté:',
    adicionarLivro: 'Ajouter Livre',
    lidos: 'Lus',
    lerMaisTarde: 'Lire plus tard',
    sufixoNumero: 'º',
    fechar: 'Fermer',
    recomendadoParaVoce: 'Recommandé pour vous',           // Adicionado
    livrosRecomendados: 'Livres Recommandés',              // Adicionado
    livrosDoGenero: 'Livres du Genre',                     // Adicionado
    recomendadosParaVoce: 'Recommandés pour Vous',         // Adicionado
    nenhumLivroEncontrado: 'Aucun livre trouvé.',          // Adicionado
    carregandoMaisLivros: 'Chargement de plus de livres...',// Adicionado
    janeiro: 'Janvier',
    fevereiro: 'Février',
    marco: 'Mars',
    abril: 'Avril',
    maio: 'Mai',
    junho: 'Juin',
    julho: 'Juillet',
    agosto: 'Août',
    setembro: 'Septembre',
    outubro: 'Octobre',
    novembro: 'Novembre',
    dezembro: 'Décembre',
  },
  en: {
    melhores: 'Best',
    livrosLidosEm: 'Books Read in',
    livroAdicionado: 'Book added:',
    adicionarLivro: 'Add Book',
    lidos: 'Read',
    lerMaisTarde: 'Read Later',
    sufixoNumero: 'th',
    fechar: 'Close',
    recomendadoParaVoce: 'Recommended for you',            // Adicionado
    livrosRecomendados: 'Recommended Books',               // Adicionado
    livrosDoGenero: 'Books in Genre',                      // Adicionado
    recomendadosParaVoce: 'Recommended for You',           // Adicionado
    nenhumLivroEncontrado: 'No books found.',              // Adicionado
    carregandoMaisLivros: 'Loading more books...',         // Adicionado
    janeiro: 'January',
    fevereiro: 'February',
    marco: 'March',
    abril: 'April',
    maio: 'May',
    junho: 'June',
    julho: 'July',
    agosto: 'August',
    setembro: 'September',
    outubro: 'October',
    novembro: 'November',
    dezembro: 'December',
  },
};

type DictionaryContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: keyof Translations) => string;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string>('pt');

  const t = (key: keyof Translations): string => {
    const translation = translations[language as keyof TranslationsDictionary][key];
    return translation;
  };

  return (
    <DictionaryContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </DictionaryContext.Provider>
  );
};

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error('useDictionary must be used within a DictionaryProvider');
  }
  return context;
};
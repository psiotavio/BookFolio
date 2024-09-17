import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
    melhores: string;
    livrosLidosEm: string;
    livroAdicionado: string;
    adicionarLivro: string;
    meses: string[];
  }
  
  interface TranslationsDictionary {
    pt: Translations;
    es: Translations;
    fr: Translations;
    en: Translations;
  }
  

// Definição dos idiomas suportados
const translations: TranslationsDictionary = {
  pt: {
    melhores: 'Melhores',
    livrosLidosEm: 'Livros Lidos em',
    livroAdicionado: 'Livro adicionado:',
    adicionarLivro: 'Adicionar Livro',
    meses: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
  },
  es: {
    melhores: 'Mejores',
    livrosLidosEm: 'Libros Leídos en',
    livroAdicionado: 'Libro añadido:',
    adicionarLivro: 'Agregar Libro',
    meses: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
  },
  fr: {
    melhores: 'Meilleurs',
    livrosLidosEm: 'Livres Lus en',
    livroAdicionado: 'Livre ajouté:',
    adicionarLivro: 'Ajouter Livre',
    meses: [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
  },
  en: {
    melhores: 'Best',
    livrosLidosEm: 'Books Read in',
    livroAdicionado: 'Book added:',
    adicionarLivro: 'Add Book',
    meses: [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ],
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
    
    if (Array.isArray(translation)) {
      return translation.join(', '); 
    }
  
    return translation as string;
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


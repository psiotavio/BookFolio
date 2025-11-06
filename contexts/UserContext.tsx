import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Livro } from "../interfaces/Livro";
import { fetchBookRecommendations } from "../services/BookService"; // Importe corretamente
import { useDictionary } from "./DictionaryContext";

interface UserProfile {
  profileImage: any;
  bannerImage: any;
  name: string;
  bio: string;
  tags: string[];
  joinDate: string;
}

interface UserContextType {
  livrosLidos: Livro[];
  biblioteca: Livro[];
  livrosLendo: Livro[];
  livrosRecomendados: Livro[];
  userProfile: UserProfile;
  addLivroLido: (livro: Livro) => void;
  addLivroBiblioteca: (livro: Livro) => void;
  addLivroLendo: (livro: Livro) => void;
  removeLivroLido: (id: string) => void;
  removeLivroBiblioteca: (id: string) => void;
  removeLivroLendo: (id: string) => void;
  removeLivroRecomendados:(id: string) => void;
  updateLivroReview: (id: string, newReview: number) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  clearAll: () => void;
  recommendBooks: (livro: Livro, language: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [livrosRecomendados, setLivrosRecomendados] = useState<Livro[]>([]);
  const [livrosLidos, setLivrosLidos] = useState<Livro[]>([]);
  const [biblioteca, setBiblioteca] = useState<Livro[]>([]);
  const [livrosLendo, setLivrosLendo] = useState<Livro[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profileImage: null,
    bannerImage: null,
    name: "Leitor Avid",
    bio: "Apaixonado por livros e histórias",
    tags: ["Ficção", "Fantasia", "Romance"],
    joinDate: "Janeiro 2024"
  });
  const { language } = useDictionary(); // Obtendo o idioma atual do app

  useEffect(() => {
    
    const loadStorageData = async () => {
      try {
        const [storedLivrosLidos, storedBiblioteca, storedLivrosLendo, storedLivrosRecomendados, storedUserProfile] = await Promise.all([
          AsyncStorage.getItem("livrosLidos"),
          AsyncStorage.getItem("biblioteca"),
          AsyncStorage.getItem("livrosLendo"),
          AsyncStorage.getItem("livrosRecomendados"),
          AsyncStorage.getItem("userProfile")
        ]);

        if (storedLivrosLidos) {
          const parsedLivrosLidos = JSON.parse(storedLivrosLidos);
          setLivrosLidos(parsedLivrosLidos);
        }
        if (storedBiblioteca) {
          const parsedBiblioteca = JSON.parse(storedBiblioteca);
          setBiblioteca(parsedBiblioteca);
        }

        if (storedLivrosLendo) {
          const parsedLivrosLendo = JSON.parse(storedLivrosLendo);
          setLivrosLendo(parsedLivrosLendo);
        }
        if (storedLivrosRecomendados) {
          const parsedLivrosRecomendados = JSON.parse(storedLivrosRecomendados);
          setLivrosRecomendados(parsedLivrosRecomendados);
        }
        if (storedUserProfile) {
          const parsedUserProfile = JSON.parse(storedUserProfile);
          setUserProfile(parsedUserProfile);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do armazenamento:", error);
      }
    };

    loadStorageData();
  }, []);

  useEffect(() => {
    const saveLivrosLidos = async () => {
      try {
        await AsyncStorage.setItem("livrosLidos", JSON.stringify(livrosLidos));
      } catch (error) {
        console.error("Erro ao salvar livros lidos:", error);
      }
    };

    saveLivrosLidos();
  }, [livrosLidos]);

  useEffect(() => {
    const saveBiblioteca = async () => {
      try {
        await AsyncStorage.setItem("biblioteca", JSON.stringify(biblioteca));
      } catch (error) {
        console.error("Erro ao salvar biblioteca:", error);
      }
    };

    saveBiblioteca();
  }, [biblioteca]);

  useEffect(() => {
    const saveLivrosLendo = async () => {
      try {
        await AsyncStorage.setItem("livrosLendo", JSON.stringify(livrosLendo));
      } catch (error) {
        console.error("Erro ao salvar livros lendo:", error);
      }
    };

    saveLivrosLendo();
  }, [livrosLendo]);

  useEffect(() => {
    const saveLivrosRecomendados = async () => {
      try {
        await AsyncStorage.setItem("livrosRecomendados", JSON.stringify(livrosRecomendados));
      } catch (error) {
        console.error("Erro ao salvar livros recomendados:", error);
      }
    };

    saveLivrosRecomendados();
  }, [livrosRecomendados]);

  useEffect(() => {
    const saveUserProfile = async () => {
      try {
        await AsyncStorage.setItem("userProfile", JSON.stringify(userProfile));
      } catch (error) {
        console.error("Erro ao salvar perfil do usuário:", error);
      }
    };

    saveUserProfile();
  }, [userProfile]);

  const addLivroLido = async (livro: Livro) => {
    if (!livrosLidos.some((l) => l.id === livro.id)) {
      const livroComData = { ...livro, LidoQuando: new Date(), Review: 0 };
      setLivrosLidos((prevLivrosLidos) => [...prevLivrosLidos, livroComData]);
      await recommendBooks(livro, language); // Passa o idioma para a função de recomendação
    }
  };

  const addLivroBiblioteca = (livro: Livro) => {
    if (!biblioteca.some((l) => l.id === livro.id)) {
      setBiblioteca((prevBiblioteca) => [...prevBiblioteca, livro]);
    }
  };

  const addLivroLendo = (livro: Livro) => {
    if (!livrosLendo.some((l) => l.id === livro.id)) {
      setLivrosLendo((prevLivrosLendo) => [...prevLivrosLendo, livro]);
    }
  };

  const removeLivroLido = (id: string) => {
    setLivrosLidos((prevLivrosLidos) =>
      prevLivrosLidos.filter((livro) => livro.id !== id)
    );
  };

  const removeLivroBiblioteca = (id: string) => {
    setBiblioteca((prevBiblioteca) =>
      prevBiblioteca.filter((livro) => livro.id !== id)
    );
  };

  const removeLivroLendo = (id: string) => {
    setLivrosLendo((prevLivrosLendo) =>
      prevLivrosLendo.filter((livro) => livro.id !== id)
    );
  };
  const removeLivroRecomendados = (id: string) => {
    setLivrosRecomendados((prevRecomendados) =>
      prevRecomendados.filter((livro) => livro.id !== id)
    );
  };

  const updateLivroReview = (id: string, newReview: number) => {
    setLivrosLidos((prevLivrosLidos) =>
      prevLivrosLidos.map((livro) =>
        livro.id === id ? { ...livro, Review: newReview } : livro
      )
    );
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prevProfile) => ({ ...prevProfile, ...profile }));
  };

  const clearAll = async () => {
    setLivrosLidos([]);
    setBiblioteca([]);
    setLivrosLendo([]);
    setLivrosRecomendados([]);
    setUserProfile({
      profileImage: null,
      bannerImage: null,
      name: "Leitor Avid",
      bio: "Apaixonado por livros e histórias",
      tags: ["Ficção", "Fantasia", "Romance"],
      joinDate: "Janeiro 2024"
    });
    await AsyncStorage.removeItem('livrosLidos');
    await AsyncStorage.removeItem('biblioteca');
    await AsyncStorage.removeItem('livrosLendo');
    await AsyncStorage.removeItem('livrosRecomendados');
    await AsyncStorage.removeItem('userProfile');
  };

  const recommendBooks = async (livro: Livro, language: string) => {
    try {
      const recommendedBooks = await fetchBookRecommendations(livro.authors, language); // Busca livros recomendados passando o idioma
      const novosRecomendados = [
        ...recommendedBooks.slice(0, 18).filter(
          (newBook) => !livrosRecomendados.some((book) => book.id === newBook.id)
        ),
        ...livrosRecomendados,
      ];
      setLivrosRecomendados(novosRecomendados);
      await AsyncStorage.setItem("livrosRecomendados", JSON.stringify(novosRecomendados));
    } catch (error) {
      console.error("Erro ao buscar livros recomendados:", error);
    }
  };
  

  return (
    <UserContext.Provider
      value={{
        livrosLidos,
        biblioteca,
        livrosLendo,
        livrosRecomendados,
        userProfile,
        addLivroLido,
        addLivroBiblioteca,
        addLivroLendo,
        removeLivroLido,
        removeLivroBiblioteca,
        removeLivroLendo,
        removeLivroRecomendados,
        updateLivroReview,
        updateUserProfile,
        clearAll,
        recommendBooks,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

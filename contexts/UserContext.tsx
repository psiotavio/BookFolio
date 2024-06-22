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

interface UserContextType {
  livrosLidos: Livro[];
  biblioteca: Livro[];
  livrosRecomendados: Livro[];
  addLivroLido: (livro: Livro) => void;
  addLivroBiblioteca: (livro: Livro) => void;
  removeLivroLido: (id: string) => void;
  removeLivroBiblioteca: (id: string) => void;
  removeLivroRecomendados:(id: string) => void;
  updateLivroReview: (id: string, newReview: number) => void;
  clearAll: () => void;
  recommendBooks: (livro: Livro) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [livrosRecomendados, setLivrosRecomendados] = useState<Livro[]>([]);
  const [livrosLidos, setLivrosLidos] = useState<Livro[]>([]);
  const [biblioteca, setBiblioteca] = useState<Livro[]>([]);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [storedLivrosLidos, storedBiblioteca, storedLivrosRecomendados] = await Promise.all([
          AsyncStorage.getItem("livrosLidos"),
          AsyncStorage.getItem("biblioteca"),
          AsyncStorage.getItem("livrosRecomendados")
        ]);

        if (storedLivrosLidos) {
          const parsedLivrosLidos = JSON.parse(storedLivrosLidos);
          setLivrosLidos(parsedLivrosLidos);
        }
        if (storedBiblioteca) {
          const parsedBiblioteca = JSON.parse(storedBiblioteca);
          setBiblioteca(parsedBiblioteca);
        }
        if (storedLivrosRecomendados) {
          const parsedLivrosRecomendados = JSON.parse(storedLivrosRecomendados);
          setLivrosRecomendados(parsedLivrosRecomendados);
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
    const saveLivrosRecomendados = async () => {
      try {
        await AsyncStorage.setItem("livrosRecomendados", JSON.stringify(livrosRecomendados));
      } catch (error) {
        console.error("Erro ao salvar livros recomendados:", error);
      }
    };

    saveLivrosRecomendados();
  }, [livrosRecomendados]);

  const addLivroLido = async (livro: Livro) => {
    if (!livrosLidos.some((l) => l.id === livro.id)) {
      const livroComData = { ...livro, LidoQuando: new Date(), Review: 0 };
      setLivrosLidos((prevLivrosLidos) => [...prevLivrosLidos, livroComData]);
      await recommendBooks(livro); // Aguarda a função recomendar livros
    }
  };

  const addLivroBiblioteca = (livro: Livro) => {
    if (!biblioteca.some((l) => l.id === livro.id)) {
      setBiblioteca((prevBiblioteca) => [...prevBiblioteca, livro]);
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

  const clearAll = async () => {
    setLivrosLidos([]);
    setBiblioteca([]);
    setLivrosRecomendados([]);
    await AsyncStorage.removeItem('livrosLidos');
    await AsyncStorage.removeItem('biblioteca');
    await AsyncStorage.removeItem('livrosRecomendados');
  };

  const recommendBooks = async (livro: Livro) => {
    try {
      const recommendedBooks = await fetchBookRecommendations(livro.authors); // Busca livros recomendados
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
        livrosRecomendados,
        addLivroLido,
        addLivroBiblioteca,
        removeLivroLido,
        removeLivroBiblioteca,
        removeLivroRecomendados,
        updateLivroReview,
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

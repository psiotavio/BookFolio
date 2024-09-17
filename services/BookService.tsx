import { Livro } from "../interfaces/Livro"; // Asegure-se de que o caminho até a interface está correto

const API_KEY = "AIzaSyBkHfmfEHDKGhGrkk_J0LYNeTCy2HKwV2c";  // Utilize sua chave de API válida

const fetchBookDetails = async (bookTitle: string, language: string): Promise<Livro[]> => {
  const query = encodeURI(bookTitle);
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=${language}`
    );
    const data = await response.json();
    if (!data.items) {
      return [];
    }

    const uniqueBooks = new Map<string, Livro>();

    data.items.forEach((item: any) => {
      const book: Livro = {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["Desconhecido"],
        publisher: item.volumeInfo.publisher,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        maturityRating: item.volumeInfo.maturityRating,
        imageLinks: item.volumeInfo.imageLinks,
        language: item.volumeInfo.language,
        previewLink: item.volumeInfo.previewLink,
        similarBooks: [],
        Review: 0,
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
      };

      if (
        !uniqueBooks.has(book.title) &&
        book.language === language &&
        book.imageLinks !== undefined
      ) {
        uniqueBooks.set(book.title, book);
      }
    });

    const sortedBooks = Array.from(uniqueBooks.values()).sort((a, b) => {
      return (b.ratingsCount || 0) - (a.ratingsCount || 0);
    });

    return sortedBooks;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return [];
  }
};

const fetchBookRecommendations = async (authors: string[], language: string): Promise<Livro[]> => {
  try {
    const authorQuery = authors.map(author => `inauthor:${encodeURI(author)}`).join('+');
    const queryAuhtor = `${authorQuery}`;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${queryAuhtor}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=${language}`
    );
    const data = await response.json();
    if (!data.items) {
      return [];
    }

    const uniqueBooks = new Map<string, Livro>();

    data.items.forEach((item: any) => {
      const book: Livro = {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["Desconhecido"],
        publisher: item.volumeInfo.publisher,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        maturityRating: item.volumeInfo.maturityRating,
        imageLinks: item.volumeInfo.imageLinks,
        language: item.volumeInfo.language,
        previewLink: item.volumeInfo.previewLink,
        similarBooks: [],
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
        Review: 0,
      };

      if (
        !uniqueBooks.has(book.title) &&
        book.language === language &&
        book.imageLinks !== undefined
      ) {
        uniqueBooks.set(book.title, book);
      }
    });

    const sortedBooks = Array.from(uniqueBooks.values()).sort((a, b) => {
      return (b.ratingsCount || 0) - (a.ratingsCount || 0);
    });

    return sortedBooks.slice(0, 18); // Retorna apenas os 18 primeiros livros recomendados
  } catch (error) {
    console.error("Error fetching book details:", error);
    return [];
  }
};

const fetchBookRecommendationsByGenre = async (genres: string[], authors: string[], language: string, page: number = 1): Promise<Livro[]> => {
  try {
    const startIndex = (page - 1) * 18;
    const genreQuery = genres.map(genre => `subject:${encodeURI(genre)}`).join('+');
    const queryGenre = `${genreQuery}`;

    console.log(`Fetching books with query: ${queryGenre} (page: ${page})`);

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${queryGenre}&key=${API_KEY}&langRestrict=${language}&maxResults=18&printType=books&orderBy=relevance&startIndex=${startIndex}`
    );
    const data = await response.json();
    
    console.log('Data fetched from API:', data);

    // Se não houver livros retornados para o gênero, faz a busca pelos autores
    if (data.totalItems === 0) {
      console.log("No books found for genre, fetching recommendations by author...");
      return fetchBookRecommendations(authors, language); // Chama a função para buscar por autor
    }

    const uniqueBooks = new Map<string, Livro>();

    data.items.forEach((item: any) => {
      const book: Livro = {
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ["Desconhecido"],
        publisher: item.volumeInfo.publisher,
        publishedDate: item.volumeInfo.publishedDate,
        description: item.volumeInfo.description,
        pageCount: item.volumeInfo.pageCount,
        categories: item.volumeInfo.categories || [],
        averageRating: item.volumeInfo.averageRating,
        ratingsCount: item.volumeInfo.ratingsCount,
        maturityRating: item.volumeInfo.maturityRating,
        imageLinks: item.volumeInfo.imageLinks,
        language: item.volumeInfo.language,
        previewLink: item.volumeInfo.previewLink,
        similarBooks: [],
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
        Review: 0,
      };

      const publicationYear = parseInt(book.publishedDate!.substring(0, 4));
      const currentYear = new Date().getFullYear();

      if (
        publicationYear >= 1999 &&
        !uniqueBooks.has(book.title) &&
        book.imageLinks !== undefined
      ) {
        uniqueBooks.set(book.title, book);
      }
    });

    const sortedBooks = Array.from(uniqueBooks.values()).sort((a, b) => {
      return (b.ratingsCount || 0) - (a.ratingsCount || 0);
    });

    return sortedBooks;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return [];
  }
};


export { fetchBookDetails, fetchBookRecommendations, fetchBookRecommendationsByGenre };

import { Livro } from "../interfaces/Livro"; // Asegure-se de que o caminho até a interface está correto

const API_KEY = "AIzaSyBkHfmfEHDKGhGrkk_J0LYNeTCy2HKwV2c";  // Utilize sua chave de API válida

const fetchBookDetails = async (bookTitle: string): Promise<Livro[]> => {
  const query = encodeURI(bookTitle);
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=pt`
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
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=pt_BR&ref_=as_li_ss_tl`,
      };

      if (
        !uniqueBooks.has(book.title) &&
        book.language === "pt-BR" &&
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

const fetchBookRecommendations = async (authors: string[]): Promise<Livro[]> => {
  try {
    const authorQuery = authors.map(author => `inauthor:${encodeURI(author)}`).join('+');
    const queryAuhtor = `${authorQuery}`;

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${queryAuhtor}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=pt`
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
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=pt_BR&ref_=as_li_ss_tl`,
        Review: 0,
      };

      if (
        !uniqueBooks.has(book.title) &&
        book.language === "pt-BR" &&
        book.imageLinks !== undefined
      ) {
        uniqueBooks.set(book.title, book);
      }
    });

    const sortedBooks = Array.from(uniqueBooks.values()).sort((a, b) => {
      return (b.ratingsCount || 0) - (a.ratingsCount || 0);
    });

    return sortedBooks.slice(0, 18); // Retorna apenas os 9 primeiros livros recomendados
  } catch (error) {
    console.error("Error fetching book details:", error);
    return [];
  }
};

export { fetchBookDetails, fetchBookRecommendations };

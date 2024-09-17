import { Livro } from "../interfaces/Livro"; // Asegure-se de que o caminho até a interface está correto

const API_KEY = "AIzaSyBkHfmfEHDKGhGrkk_J0LYNeTCy2HKwV2c";  // Utilize sua chave de API válida

const fetchBookDetails = async (bookTitle: string, language: string): Promise<Livro[]> => {
  const query = encodeURI(bookTitle);
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=${language}`
    );

    const data = await response.json();

    // Verifique se a API está retornando algum erro
    if (data.error) {
      console.error("Error from Google Books API:", data.error);
      return [];
    }

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
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(item.volumeInfo.title + ' ' + (item.volumeInfo.authors ? item.volumeInfo.authors.join(' ') : ''))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
        Review: 0,
      };

      if (!uniqueBooks.has(book.id) && book.imageLinks) {
        uniqueBooks.set(book.id, book);
      }
    });

    const sortedBooks = Array.from(uniqueBooks.values()).sort((a, b) => (b.ratingsCount || 0) - (a.ratingsCount || 0));

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

const fetchBookRecommendationsByAuthor = async (
  authors: string[],
  livrosLidos: Livro[],  // Agora utilizando a lista de livros lidos
  appLanguage: string
): Promise<Livro[]> => {
  try {
    const recommendedBooks: Livro[] = [];
    const uniqueBooks = new Map<string, Livro>();

    for (const livro of livrosLidos) {
      const livroLanguage = livro.language || appLanguage; // Se não houver linguagem no livro, use a linguagem do app

      // Se a linguagem do livro for a mesma do app, busca pelo título do livro na linguagem do livro
      if (livroLanguage === appLanguage) {
        console.log(`Buscando livros por título: ${livro.title} na linguagem: ${livroLanguage}`);

        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
            livro.title
          )}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=${livroLanguage}`
        );

        const data = await response.json();
        if (data.items) {
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
              amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(
                item.volumeInfo.title + " " + (item.volumeInfo.authors ? item.volumeInfo.authors.join(" ") : "")
              )}&linkCode=ll2&tag=bookfolio-20&language=${livroLanguage}&ref_=as_li_ss_tl`,
              Review: 0,
            };

            // Verifica se o livro já foi adicionado e adiciona se não
            if (!uniqueBooks.has(book.id) && book.imageLinks) {
              uniqueBooks.set(book.id, book);
              recommendedBooks.push(book);
            }
          });
        }

        // Caso não encontre livros pelo título, busca pelo autor
        if (recommendedBooks.length === 0) {
          for (const author of livro.authors) {
            console.log(`Buscando livros por autor: ${author} na linguagem: ${appLanguage}`);

            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(
                author
              )}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=${appLanguage}`
            );

            const data = await response.json();
            if (data.items) {
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
                  amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(
                    item.volumeInfo.title + " " + (item.volumeInfo.authors ? item.volumeInfo.authors.join(" ") : "")
                  )}&linkCode=ll2&tag=bookfolio-20&language=${appLanguage}&ref_=as_li_ss_tl`,
                  Review: 0,
                };

                // Verifica se o livro já foi adicionado e adiciona se não
                if (!uniqueBooks.has(book.id) && book.imageLinks) {
                  uniqueBooks.set(book.id, book);
                  recommendedBooks.push(book);
                }
              });
            }
          }
        }
      } else {
        // Se a linguagem do livro for diferente da linguagem do app, busca pelo autor na linguagem do app
        for (const author of livro.authors) {
          console.log(`Buscando livros por autor: ${author} na linguagem: ${appLanguage}`);

          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(
              author
            )}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=${appLanguage}`
          );

          const data = await response.json();
          if (data.items) {
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
                amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(
                  item.volumeInfo.title + " " + (item.volumeInfo.authors ? item.volumeInfo.authors.join(" ") : "")
                )}&linkCode=ll2&tag=bookfolio-20&language=${appLanguage}&ref_=as_li_ss_tl`,
                Review: 0,
              };

              // Verifica se o livro já foi adicionado e adiciona se não
              if (!uniqueBooks.has(book.id) && book.imageLinks) {
                uniqueBooks.set(book.id, book);
                recommendedBooks.push(book);
              }
            });
          }
        }
      }
    }

    return recommendedBooks.slice(0, 13); // Limita a 13 livros recomendados no total
  } catch (error) {
    console.error("Erro ao buscar livros recomendados por autor", error);
    return [];
  }
};

export { fetchBookDetails, fetchBookRecommendations, fetchBookRecommendationsByAuthor };
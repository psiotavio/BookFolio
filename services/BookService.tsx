import { Livro } from "../interfaces/Livro"; // Asegure-se de que o caminho até a interface está correto

const API_KEY = "AIzaSyBkHfmfEHDKGhGrkk_J0LYNeTCy2HKwV2c";  // Utilize sua chave de API válida
const API_URL = "https://www.googleapis.com/books/v1/volumes";

// Função para melhorar a qualidade da imagem de capa
const upscaleGoogleBooksCoverImage = async (googleBooksImageLink: string): Promise<string | null> => {
  try {
    const imageCandidateUrl = googleBooksImageLink.replace(/zoom=\d/, "zoom=10");
    
    const response = await fetch(imageCandidateUrl, { method: 'HEAD' });
    
    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      // Verifica se não é uma imagem placeholder (tamanhos comuns de placeholders)
      if (contentLength && contentLength !== "9103" && contentLength !== "4448") {
        return imageCandidateUrl;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao verificar qualidade da imagem:", error);
    return null;
  }
};

// Função para otimizar URL da imagem com zoom máximo
const optimizeImageUrl = (url: string): string => {
  if (!url) return url;
  
  // Substitui zoom=1 por zoom=6 para máxima qualidade
  let optimizedUrl = url.replace(/zoom=\d+/g, 'zoom=6');
  
  // Se não tem parâmetro zoom, adiciona zoom=6
  if (!optimizedUrl.includes('zoom=')) {
    const separator = optimizedUrl.includes('?') ? '&' : '?';
    optimizedUrl = `${optimizedUrl}${separator}zoom=6`;
  }
  
  console.log(`🖼️ URL OTIMIZADA: ${url} → ${optimizedUrl}`);
  
  return optimizedUrl;
};

// Função para obter a melhor imagem de capa disponível
export const getBestGoogleCoverBookImage = (imageLinks: any): string | null => {
  if (!imageLinks) {
    console.log('🖼️ IMAGEM: Nenhum imageLinks disponível');
    return null;
  }
  
  // Ordenado por largura de pixel (≈1280 → 800 → 500 → 300 → 128)
  const priority = [
    { size: 'extraLarge', url: imageLinks.extraLarge },
    { size: 'large', url: imageLinks.large },
    { size: 'medium', url: imageLinks.medium },
    { size: 'small', url: imageLinks.small },
    { size: 'thumbnail', url: imageLinks.thumbnail },
    { size: 'smallThumbnail', url: imageLinks.smallThumbnail },
  ];

  const bestImage = priority.find(item => item.url) ?? null;
  
  if (bestImage) {
    const optimizedUrl = optimizeImageUrl(bestImage.url);
    console.log(`🖼️ IMAGEM SELECIONADA: ${bestImage.size} - ${optimizedUrl}`);
    return optimizedUrl;
  } else {
    console.log('🖼️ IMAGEM: Nenhuma imagem disponível');
    return null;
  }
};

// Função para obter livros únicos por título (evita duplicatas de edições diferentes)
const getUniqueBooksByTitle = (books: any[]): any[] => {
  const uniqueBooks = new Map<string, any>();

  for (const book of books) {
    const title = book.volumeInfo.title?.toLowerCase().trim();
    if (title && !uniqueBooks.has(title)) {
      uniqueBooks.set(title, book);
    }
  }

  return Array.from(uniqueBooks.values());
};

// Função para obter livros únicos por ID (mantida para compatibilidade)
const getUniqueBooksById = (books: any[]): any[] => {
  const booksIds = new Set<string>();
  const uniqueBooks: any[] = [];

  for (const book of books) {
    if (!booksIds.has(book.id)) {
      booksIds.add(book.id);
      uniqueBooks.push(book);
    }
  }

  return uniqueBooks;
};

// Função para ordenar livros por ordem de saga
const sortBooksBySaga = (books: Livro[]): Livro[] => {
  // Definir ordens das sagas principais
  const sagaOrders = {
    harryPotter: [
      "harry potter e a pedra filosofal",
      "harry potter e a câmara secreta", 
      "harry potter e o prisioneiro de azkaban",
      "harry potter e o cálice de fogo",
      "harry potter e a ordem da fênix",
      "harry potter e o enigma do príncipe",
      "harry potter e as relíquias da morte"
    ],
    percyJackson: [
      "percy jackson e os ladrões do olimpo",
      "percy jackson e o mar dos monstros",
      "percy jackson e a maldição do titã",
      "percy jackson e a batalha do labirinto",
      "percy jackson e o último olimpiano"
    ],
    jogosVorazes: [
      "jogos vorazes",
      "em chamas",
      "a esperança"
    ]
  };

  return books.sort((a, b) => {
    const titleA = a.title.toLowerCase().trim();
    const titleB = b.title.toLowerCase().trim();
    
    // Verificar se pertencem à mesma saga
    for (const [sagaName, sagaOrder] of Object.entries(sagaOrders)) {
      const indexA = sagaOrder.findIndex(order => titleA.includes(order));
      const indexB = sagaOrder.findIndex(order => titleB.includes(order));
      
      // Se ambos são da mesma saga, ordena pela ordem da saga
      if (indexA !== -1 && indexB !== -1) {
        console.log(`📚 Ordenando ${sagaName}: "${a.title}" (${indexA}) vs "${b.title}" (${indexB})`);
        return indexA - indexB;
      }
      
      // Se apenas um é da saga, ele vem primeiro
      if (indexA !== -1) {
        console.log(`📚 Priorizando ${sagaName}: "${a.title}" vem antes de "${b.title}"`);
        return -1;
      }
      if (indexB !== -1) {
        console.log(`📚 Priorizando ${sagaName}: "${b.title}" vem antes de "${a.title}"`);
        return 1;
      }
    }
    
    // Se nenhum é de saga conhecida, mantém ordenação por avaliações
    return (b.ratingsCount || 0) - (a.ratingsCount || 0);
  });
};

// Função para validar se um livro tem todos os campos necessários
const isValidBook = (volumeInfo: any): boolean => {
  const hasTitle = !!volumeInfo.title;
  const hasAuthors = !!volumeInfo.authors?.length;
  const hasPageCount = !!volumeInfo.pageCount;
  const hasDescription = !!volumeInfo.description;
  const hasImageLinks = !!volumeInfo.imageLinks;
  const hasPublishedDate = !!volumeInfo.publishedDate;

  const isValid = hasTitle && hasAuthors && hasPageCount && hasDescription && hasImageLinks && hasPublishedDate;

  if (!isValid) {
    console.log(`❌ LIVRO REJEITADO - "${volumeInfo.title || 'Sem título'}"`);
    console.log(`   📝 Título: ${hasTitle ? '✅' : '❌'} (${volumeInfo.title || 'N/A'})`);
    console.log(`   👥 Autores: ${hasAuthors ? '✅' : '❌'} (${volumeInfo.authors?.length || 0} autores)`);
    console.log(`   📄 Páginas: ${hasPageCount ? '✅' : '❌'} (${volumeInfo.pageCount || 'N/A'})`);
    console.log(`   📖 Descrição: ${hasDescription ? '✅' : '❌'} (${volumeInfo.description ? 'Presente' : 'Ausente'})`);
    console.log(`   🖼️ Imagem: ${hasImageLinks ? '✅' : '❌'} (${volumeInfo.imageLinks ? 'Presente' : 'Ausente'})`);
    console.log(`   📅 Data: ${hasPublishedDate ? '✅' : '❌'} (${volumeInfo.publishedDate || 'N/A'})`);
  } else {
    console.log(`✅ LIVRO APROVADO - "${volumeInfo.title}"`);
    console.log(`   📝 Título: ${volumeInfo.title}`);
    console.log(`   👥 Autores: ${volumeInfo.authors.join(', ')}`);
    console.log(`   📄 Páginas: ${volumeInfo.pageCount}`);
    console.log(`   📅 Data: ${volumeInfo.publishedDate}`);
  }

  return isValid;
};

const fetchBookDetails = async (bookTitle: string, language: string = "pt-BR"): Promise<Livro[]> => {
  const query = `intitle:${encodeURIComponent(bookTitle)}`;
  
  console.log(`🔍 INICIANDO BUSCA DE LIVROS`);
  console.log(`   📚 Título buscado: "${bookTitle}"`);
  console.log(`   🌍 Idioma: ${language}`);
  console.log(`   🔗 Query: ${query}`);
  
  try {
    const response = await fetch(
      `${API_URL}?q=${query}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=pt-BR`
    );

    const data = await response.json();

    // Verifique se a API está retornando algum erro
    if (data.error) {
      console.error("❌ Error from Google Books API:", data.error);
      return [];
    }

    if (!data.items) {
      console.log(`❌ Nenhum resultado encontrado para "${bookTitle}"`);
      return [];
    }

    console.log(`📊 RESULTADOS DA API: ${data.items.length} livros encontrados`);

    // Obter livros únicos por título (evita duplicatas de edições diferentes)
    const uniqueBooksData = getUniqueBooksByTitle(data.items);
    console.log(`🔄 APÓS REMOÇÃO DE DUPLICATAS POR TÍTULO: ${uniqueBooksData.length} livros únicos`);
    
    const validBooks: Livro[] = [];

    // Processar cada livro com validação rigorosa
    for (const item of uniqueBooksData) {
      const volumeInfo = item.volumeInfo;

      console.log(`\n📖 PROCESSANDO LIVRO: "${volumeInfo.title || 'Sem título'}"`);

      // Validar se o livro tem todos os campos necessários
      if (!isValidBook(volumeInfo)) {
        console.log(`   ⏭️ Pulando livro - não atende aos critérios de qualidade`);
        continue;
      }

      // Verificar se a linguagem corresponde (aceita pt, pt-BR, ou português)
      const isPortuguese = volumeInfo.language === 'pt' || 
                          volumeInfo.language === 'pt-BR' || 
                          volumeInfo.language === 'português' ||
                          volumeInfo.language === 'Portuguese';
      
      if (!isPortuguese) {
        console.log(`   ❌ REJEITADO: Idioma não é português (${volumeInfo.language})`);
        continue;
      }

      console.log(`   ✅ Idioma correto: ${volumeInfo.language}`);

      // Obter a melhor imagem de capa
      const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
      if (!bestBookCoverImage) {
        console.log(`   ❌ REJEITADO: Nenhuma imagem de capa válida encontrada`);
        continue;
      }

      console.log(`   🖼️ Imagem de capa encontrada: ${bestBookCoverImage}`);

      // Tentar melhorar a qualidade da imagem
      const upscaledImage = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
      if (!upscaledImage) {
        console.log(`   ❌ REJEITADO: Imagem de baixa qualidade (placeholder detectado)`);
        continue;
      }

      console.log(`   ✅ Imagem melhorada: ${upscaledImage}`);

      const book: Livro = {
        id: item.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors.filter((author: any): author is string => !!author),
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
        averageRating: volumeInfo.averageRating,
        ratingsCount: volumeInfo.ratingsCount,
        maturityRating: volumeInfo.maturityRating,
        imageLinks: {
          ...volumeInfo.imageLinks,
          // Usar a imagem melhorada como principal
          large: upscaledImage,
          medium: upscaledImage,
        },
        language: volumeInfo.language || language,
        previewLink: volumeInfo.previewLink,
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + ' ' + volumeInfo.authors.join(' '))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
        Review: 0,
      };

      validBooks.push(book);
      console.log(`   🎉 LIVRO ADICIONADO À LISTA FINAL!`);
    }

    console.log(`\n📈 RESULTADO FINAL:`);
    console.log(`   📚 Livros processados: ${uniqueBooksData.length}`);
    console.log(`   ✅ Livros aprovados: ${validBooks.length}`);
    console.log(`   ❌ Livros rejeitados: ${uniqueBooksData.length - validBooks.length}`);

    // Ordenar por relevância (número de avaliações) e ordem das sagas
    const sortedBooks = sortBooksBySaga(validBooks);

    console.log(`\n🏆 LIVROS ORDENADOS POR RELEVÂNCIA E ORDEM DAS SAGAS:`);
    sortedBooks.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" - ${book.ratingsCount || 0} avaliações`);
    });

    return sortedBooks;
  } catch (error) {
    console.error("❌ Error fetching book details:", error);
    return [];
  }
};


const fetchBookRecommendations = async (authors: string[], language: string = "pt-BR"): Promise<Livro[]> => {
  try {
    const authorQuery = authors.map(author => `inauthor:${encodeURIComponent(author)}`).join('+');
    const queryAuthor = `${authorQuery}`;

    console.log(`🔍 INICIANDO BUSCA DE RECOMENDAÇÕES POR AUTOR`);
    console.log(`   👥 Autores: ${authors.join(', ')}`);
    console.log(`   🌍 Idioma: ${language}`);
    console.log(`   🔗 Query: ${queryAuthor}`);

    const response = await fetch(
      `${API_URL}?q=${queryAuthor}&key=${API_KEY}&maxResults=30&printType=books&orderBy=relevance&langRestrict=pt-BR`
    );
    
    const data = await response.json();
    if (!data.items) {
      console.log(`❌ Nenhuma recomendação encontrada para os autores: ${authors.join(', ')}`);
      return [];
    }

    console.log(`📊 RESULTADOS DA API: ${data.items.length} livros encontrados`);

    // Obter livros únicos por título (evita duplicatas de edições diferentes)
    const uniqueBooksData = getUniqueBooksByTitle(data.items);
    console.log(`🔄 APÓS REMOÇÃO DE DUPLICATAS POR TÍTULO: ${uniqueBooksData.length} livros únicos`);
    
    const validBooks: Livro[] = [];

    // Processar cada livro com validação rigorosa
    for (const item of uniqueBooksData) {
      const volumeInfo = item.volumeInfo;

      console.log(`\n📖 PROCESSANDO RECOMENDAÇÃO: "${volumeInfo.title || 'Sem título'}"`);

      // Validar se o livro tem todos os campos necessários
      if (!isValidBook(volumeInfo)) {
        console.log(`   ⏭️ Pulando livro - não atende aos critérios de qualidade`);
        continue;
      }

      // Verificar se a linguagem corresponde (aceita pt, pt-BR, ou português)
      const isPortuguese = volumeInfo.language === 'pt' || 
                          volumeInfo.language === 'pt-BR' || 
                          volumeInfo.language === 'português' ||
                          volumeInfo.language === 'Portuguese';
      
      if (!isPortuguese) {
        console.log(`   ❌ REJEITADO: Idioma não é português (${volumeInfo.language})`);
        continue;
      }

      console.log(`   ✅ Idioma correto: ${volumeInfo.language}`);

      // Obter a melhor imagem de capa
      const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
      if (!bestBookCoverImage) {
        console.log(`   ❌ REJEITADO: Nenhuma imagem de capa válida encontrada`);
        continue;
      }

      console.log(`   🖼️ Imagem de capa encontrada: ${bestBookCoverImage}`);

      // Tentar melhorar a qualidade da imagem
      const upscaledImage = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
      if (!upscaledImage) {
        console.log(`   ❌ REJEITADO: Imagem de baixa qualidade (placeholder detectado)`);
        continue;
      }

      console.log(`   ✅ Imagem melhorada: ${upscaledImage}`);

      const book: Livro = {
        id: item.id,
        title: volumeInfo.title,
        authors: volumeInfo.authors.filter((author: any): author is string => !!author),
        publisher: volumeInfo.publisher,
        publishedDate: volumeInfo.publishedDate,
        description: volumeInfo.description,
        pageCount: volumeInfo.pageCount,
        categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
        averageRating: volumeInfo.averageRating,
        ratingsCount: volumeInfo.ratingsCount,
        maturityRating: volumeInfo.maturityRating,
        imageLinks: {
          ...volumeInfo.imageLinks,
          // Usar a imagem melhorada como principal
          large: upscaledImage,
          medium: upscaledImage,
        },
        language: volumeInfo.language,
        previewLink: volumeInfo.previewLink,
        similarBooks: [],
        amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + ' ' + volumeInfo.authors.join(' '))}&linkCode=ll2&tag=bookfolio-20&language=${language}&ref_=as_li_ss_tl`,
        Review: 0,
      };

      validBooks.push(book);
      console.log(`   🎉 RECOMENDAÇÃO ADICIONADA À LISTA FINAL!`);
    }

    console.log(`\n📈 RESULTADO FINAL DAS RECOMENDAÇÕES:`);
    console.log(`   📚 Livros processados: ${uniqueBooksData.length}`);
    console.log(`   ✅ Livros aprovados: ${validBooks.length}`);
    console.log(`   ❌ Livros rejeitados: ${uniqueBooksData.length - validBooks.length}`);

    // Ordenar por relevância (número de avaliações) e ordem das sagas
    const sortedBooks = sortBooksBySaga(validBooks);

    console.log(`\n🏆 RECOMENDAÇÕES ORDENADAS POR RELEVÂNCIA E ORDEM DAS SAGAS:`);
    sortedBooks.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" - ${book.ratingsCount || 0} avaliações`);
    });

    const finalRecommendations = sortedBooks.slice(0, 18);
    console.log(`\n🎯 RETORNANDO ${finalRecommendations.length} RECOMENDAÇÕES FINAIS`);

    return finalRecommendations;
  } catch (error) {
    console.error("❌ Error fetching book recommendations:", error);
    return [];
  }
};

const fetchBookRecommendationsByAuthor = async (
  authors: string[],
  livrosLidos: Livro[],  // Agora utilizando a lista de livros lidos
  appLanguage: string = "pt-BR"
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
          `${API_URL}?q=intitle:${encodeURIComponent(livro.title)}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=pt-BR`
        );

        const data = await response.json();
        if (data.items) {
          const uniqueBooksData = getUniqueBooksByTitle(data.items);
          
          for (const item of uniqueBooksData) {
            const volumeInfo = item.volumeInfo;

            // Validar se o livro tem todos os campos necessários
            if (!isValidBook(volumeInfo)) {
          continue;
        }

            // Verificar se a linguagem corresponde (aceita pt, pt-BR, ou português)
            const isPortuguese = volumeInfo.language === 'pt' || 
                                volumeInfo.language === 'pt-BR' || 
                                volumeInfo.language === 'português' ||
                                volumeInfo.language === 'Portuguese';
            
            if (!isPortuguese) {
              console.log(`   ❌ REJEITADO: Idioma não é português (${volumeInfo.language})`);
              continue;
            }

            // Obter a melhor imagem de capa
            const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
            if (!bestBookCoverImage) {
              continue;
            }

            // Tentar melhorar a qualidade da imagem
            const upscaledImage = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
            if (!upscaledImage) {
              continue;
            }

            const book: Livro = {
              id: item.id,
              title: volumeInfo.title,
              authors: volumeInfo.authors.filter((author: any): author is string => !!author),
              publisher: volumeInfo.publisher,
              publishedDate: volumeInfo.publishedDate,
              description: volumeInfo.description,
              pageCount: volumeInfo.pageCount,
              categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
              averageRating: volumeInfo.averageRating,
              ratingsCount: volumeInfo.ratingsCount,
              maturityRating: volumeInfo.maturityRating,
              imageLinks: {
                ...volumeInfo.imageLinks,
                // Usar a imagem melhorada como principal
                large: upscaledImage,
                medium: upscaledImage,
              },
              language: volumeInfo.language,
              previewLink: volumeInfo.previewLink,
              amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + " " + volumeInfo.authors.join(" "))}&linkCode=ll2&tag=bookfolio-20&language=${livroLanguage}&ref_=as_li_ss_tl`,
              Review: 0,
            };

            // Verifica se o livro já foi adicionado e adiciona se não
            if (!uniqueBooks.has(book.id)) {
              uniqueBooks.set(book.id, book);
              recommendedBooks.push(book);
            }
          }
        }

        // Caso não encontre livros pelo título, busca pelo autor
        if (recommendedBooks.length === 0) {
          for (const author of livro.authors) {
            console.log(`Buscando livros por autor: ${author} na linguagem: ${appLanguage}`);

            const response = await fetch(
              `${API_URL}?q=inauthor:${encodeURIComponent(author)}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=pt-BR`
            );

            const data = await response.json();
            if (data.items) {
              const uniqueBooksData = getUniqueBooksByTitle(data.items);
              
              for (const item of uniqueBooksData) {
                const volumeInfo = item.volumeInfo;

                // Validar se o livro tem todos os campos necessários
                if (!isValidBook(volumeInfo)) {
              continue;
            }

                // Verificar se a linguagem corresponde (aceita pt, pt-BR, ou português)
                const isPortuguese = volumeInfo.language === 'pt' || 
                                    volumeInfo.language === 'pt-BR' || 
                                    volumeInfo.language === 'português' ||
                                    volumeInfo.language === 'Portuguese';
                
                if (!isPortuguese) {
                  console.log(`   ❌ REJEITADO: Idioma não é português (${volumeInfo.language})`);
                  continue;
                }

                // Obter a melhor imagem de capa
                const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
                if (!bestBookCoverImage) {
                  continue;
                }

                // Tentar melhorar a qualidade da imagem
                const upscaledImage = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
                if (!upscaledImage) {
                  continue;
                }

                const book: Livro = {
                  id: item.id,
                  title: volumeInfo.title,
                  authors: volumeInfo.authors.filter((author: any): author is string => !!author),
                  publisher: volumeInfo.publisher,
                  publishedDate: volumeInfo.publishedDate,
                  description: volumeInfo.description,
                  pageCount: volumeInfo.pageCount,
                  categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
                  averageRating: volumeInfo.averageRating,
                  ratingsCount: volumeInfo.ratingsCount,
                  maturityRating: volumeInfo.maturityRating,
                  imageLinks: {
                    ...volumeInfo.imageLinks,
                    // Usar a imagem melhorada como principal
                    large: upscaledImage,
                    medium: upscaledImage,
                  },
                  language: volumeInfo.language,
                  previewLink: volumeInfo.previewLink,
                  amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + " " + volumeInfo.authors.join(" "))}&linkCode=ll2&tag=bookfolio-20&language=${appLanguage}&ref_=as_li_ss_tl`,
                  Review: 0,
                };

                // Verifica se o livro já foi adicionado e adiciona se não
                if (!uniqueBooks.has(book.id)) {
                  uniqueBooks.set(book.id, book);
                  recommendedBooks.push(book);
                }
              }
            }
          }
        }
      } else {
        // Se a linguagem do livro for diferente da linguagem do app, busca pelo autor na linguagem do app
        for (const author of livro.authors) {
          console.log(`Buscando livros por autor: ${author} na linguagem: ${appLanguage}`);

          const response = await fetch(
            `${API_URL}?q=inauthor:${encodeURIComponent(author)}&key=${API_KEY}&maxResults=13&printType=books&orderBy=relevance&langRestrict=pt-BR`
          );

          const data = await response.json();
          if (data.items) {
            const uniqueBooksData = getUniqueBooksByTitle(data.items);
            
            for (const item of uniqueBooksData) {
              const volumeInfo = item.volumeInfo;

              // Validar se o livro tem todos os campos necessários
              if (!isValidBook(volumeInfo)) {
            continue;
          }

              // Verificar se a linguagem corresponde (aceita pt, pt-BR, ou português)
              const isPortuguese = volumeInfo.language === 'pt' || 
                                  volumeInfo.language === 'pt-BR' || 
                                  volumeInfo.language === 'português' ||
                                  volumeInfo.language === 'Portuguese';
              
              if (!isPortuguese) {
                console.log(`   ❌ REJEITADO: Idioma não é português (${volumeInfo.language})`);
                continue;
              }

              // Obter a melhor imagem de capa
              const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
              if (!bestBookCoverImage) {
                continue;
              }

              // Tentar melhorar a qualidade da imagem
              const upscaledImage = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
              if (!upscaledImage) {
                continue;
              }

              const book: Livro = {
                id: item.id,
                title: volumeInfo.title,
                authors: volumeInfo.authors.filter((author: any): author is string => !!author),
                publisher: volumeInfo.publisher,
                publishedDate: volumeInfo.publishedDate,
                description: volumeInfo.description,
                pageCount: volumeInfo.pageCount,
                categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
                averageRating: volumeInfo.averageRating,
                ratingsCount: volumeInfo.ratingsCount,
                maturityRating: volumeInfo.maturityRating,
                imageLinks: {
                  ...volumeInfo.imageLinks,
                  // Usar a imagem melhorada como principal
                  large: upscaledImage,
                  medium: upscaledImage,
                },
                language: volumeInfo.language,
                previewLink: volumeInfo.previewLink,
                amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + " " + volumeInfo.authors.join(" "))}&linkCode=ll2&tag=bookfolio-20&language=${appLanguage}&ref_=as_li_ss_tl`,
                Review: 0,
              };

              // Verifica se o livro já foi adicionado e adiciona se não
              if (!uniqueBooks.has(book.id)) {
                uniqueBooks.set(book.id, book);
                recommendedBooks.push(book);
              }
            }
          }
        }
      }
    }

    // Ordenar por relevância (número de avaliações) e ordem das sagas
    const sortedBooks = sortBooksBySaga(recommendedBooks);

    console.log(`\n🏆 RECOMENDAÇÕES FINAIS ORDENADAS POR RELEVÂNCIA E ORDEM DAS SAGAS:`);
    sortedBooks.forEach((book, index) => {
      console.log(`   ${index + 1}. "${book.title}" - ${book.ratingsCount || 0} avaliações`);
    });

    return sortedBooks.slice(0, 13); // Limita a 13 livros recomendados no total
  } catch (error) {
    console.error("Erro ao buscar livros recomendados por autor", error);
    return [];
  }
};

// Função para buscar um livro específico por ID
const getBookById = async (bookId: string): Promise<Livro | null> => {
  try {
    console.log(`🔍 BUSCANDO LIVRO POR ID: ${bookId}`);
    const url = `${API_URL}/${bookId}?key=${API_KEY}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ Erro ao buscar livro com ID ${bookId}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || !data.volumeInfo) {
      console.error(`❌ Dados do livro não encontrados para ID ${bookId}`);
      return null;
    }

    const volumeInfo = data.volumeInfo;

    console.log(`📖 LIVRO ENCONTRADO: "${volumeInfo.title}"`);

    // Validar se o livro tem todos os campos necessários
    if (!isValidBook(volumeInfo)) {
      console.error(`❌ Livro com ID ${bookId} não possui todos os campos necessários`);
      return null;
    }

    // Obtém a melhor imagem de capa disponível
    const bestBookCoverImage = getBestGoogleCoverBookImage(volumeInfo.imageLinks);
    if (!bestBookCoverImage) {
      console.error(`❌ Nenhuma imagem de capa encontrada para o livro com ID ${bookId}`);
      return null;
    }

    console.log(`🖼️ Imagem de capa encontrada: ${bestBookCoverImage}`);

    // Tenta melhorar a qualidade da imagem se disponível
    const upscaledGoogleImageBook = await upscaleGoogleBooksCoverImage(bestBookCoverImage);
    if (!upscaledGoogleImageBook) {
      console.error(`❌ Não foi possível melhorar a qualidade da imagem para o livro com ID ${bookId}`);
      return null;
    }

    console.log(`✅ Imagem melhorada: ${upscaledGoogleImageBook}`);

    const book: Livro = {
      id: bookId,
      title: volumeInfo.title,
      authors: volumeInfo.authors.filter((author: any): author is string => !!author),
      publisher: volumeInfo.publisher,
      publishedDate: volumeInfo.publishedDate,
      description: volumeInfo.description,
      pageCount: volumeInfo.pageCount,
      categories: volumeInfo.categories?.filter((category: any): category is string => !!category) || [],
      averageRating: volumeInfo.averageRating,
      ratingsCount: volumeInfo.ratingsCount,
      maturityRating: volumeInfo.maturityRating,
      imageLinks: {
        ...volumeInfo.imageLinks,
        // Usar a imagem melhorada como principal
        large: upscaledGoogleImageBook,
        medium: upscaledGoogleImageBook,
      },
      language: volumeInfo.language || "pt-BR",
      previewLink: volumeInfo.previewLink,
      amazonLink: `https://www.amazon.com.br/s?k=${encodeURIComponent(volumeInfo.title + " " + volumeInfo.authors.join(" "))}&linkCode=ll2&tag=bookfolio-20&language=pt-BR&ref_=as_li_ss_tl`,
      Review: 0,
    };

    console.log(`🎉 LIVRO PROCESSADO COM SUCESSO: "${book.title}"`);
    console.log(`   📝 Título: ${book.title}`);
    console.log(`   👥 Autores: ${book.authors.join(', ')}`);
    console.log(`   📄 Páginas: ${book.pageCount}`);
    console.log(`   📅 Data: ${book.publishedDate}`);
    console.log(`   🌍 Idioma: ${book.language}`);

    return book;
  } catch (error) {
    console.error(`❌ Erro ao buscar livro com ID ${bookId}:`, error);
    return null;
  }
};

export { fetchBookDetails, fetchBookRecommendations, fetchBookRecommendationsByAuthor, getBookById };
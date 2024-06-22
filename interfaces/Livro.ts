export interface Livro {
    id: string;
    title: string;
    authors: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?:string;
      large?: string;
      extraLarge?:string;
    };
    language?: string;
    previewLink?: string;
    similarBooks?: string[];  // Lista de títulos de livros similares
    amazonLink?: string; // Adicione esta linha
    LidoQuando?: Date; // data
    Review?: number;
  }
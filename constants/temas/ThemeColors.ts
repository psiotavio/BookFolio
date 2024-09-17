export type Theme = {
  background: string;
  text: string;
  textSecondary: string;
  details: string;
  modalBackground: string;
  modalBackgroundSecondary: string;
  textButtons: string;
  errorColor: string;
  modalThemeMode: string;
  borderBottom: string;
  amazon: string;
};

export const themes: Record<
  | "light"
  | "dark"
  | "1984"
  | "gollum"
  | "dracula"
  | "gatsby"
  | "maravilhas"
  | "odisseia"
  | "orgulhoEPreconceito"
  | "ulisses"
  | "amado"
  | "fahrenheit451"
  | "duna"
  | "belaEAFera",
  Theme
> = {
  // Temas escuros
  dark: {
    background: "#121212",
    text: "#E0E0E0",
    textSecondary: "#CCCCCC",
    details: "#FF5733",
    modalBackground: "#1C1C1C",
    modalBackgroundSecondary: "#2A2A2A",
    textButtons: "#FFFFFF",
    errorColor: "#D32F2F",
    modalThemeMode: "black",
    borderBottom: "rgba(255,255,255,0.25)",
    amazon: "#146EB4",
  },
  1984: {
    background: "#1A1A1D",
    text: "#C5C6C7",
    textSecondary: "#888888",
    details: "#FF5733",
    modalBackground: "#0B0C10",
    modalBackgroundSecondary: "#4A4E69",
    textButtons: "#FFFFFF",
    errorColor: "#C3073F",
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.2)",
    amazon: "#146EB4",
  },
  dracula: {
    background: "#2B2B2B",
    text: "#F0EDEE",
    textSecondary: "#CCCCCC",
    details: "#FF5733",
    modalBackground: "#3C3C3C",
    modalBackgroundSecondary: "#525252",
    textButtons: "#FFFFFF",
    errorColor: "#900C3F",
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.2)",
    amazon: "#146EB4",
  },

  // Temas claros
  light: {
    background: "#FFFFFF",
    text: "#1C1C1C",
    textSecondary: "#333333",
    details: "#FF5733",
    modalBackground: "#F5F5F5",
    modalBackgroundSecondary: "#E0E0E0",
    textButtons: "#FFFFFF",
    errorColor: "#D32F2F",
    modalThemeMode: "white",
    borderBottom: "rgba(0,0,0,0.25)",
    amazon: "#146EB4",
  },
  gatsby: {
    background: "#F8F8F8",
    text: "#333333",
    textSecondary: "#5A5A5A",
    details: "#FF5733",
    modalBackground: "#EDEDED",
    modalBackgroundSecondary: "#CFCFCF",
    textButtons: "#FFFFFF",
    errorColor: "#D32F2F",
    modalThemeMode: "white",
    borderBottom: "rgba(0,0,0,0.15)",
    amazon: "#146EB4",
  },
  orgulhoEPreconceito: {
    background: "#FAF9F6",
    text: "#3A3A3A",
    textSecondary: "#6E6E6E",
    details: "#FF5733",
    modalBackground: "#FFFFFF",
    modalBackgroundSecondary: "#EDEDED",
    textButtons: "#FFFFFF",
    errorColor: "#D32F2F",
    modalThemeMode: "white",
    borderBottom: "rgba(0,0,0,0.1)",
    amazon: "#146EB4",
  },

  // Temas únicos
  maravilhas: {
    background: "#FFFAF0", // Fundo claro com tom quente
    text: "#3B3B3B", // Texto em marrom suave
    textSecondary: "#5C5C5C",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#F4E7D9", // Fundo do modal com tom quente
    modalBackgroundSecondary: "#E3D5B3", // Fundo secundário quente
    textButtons: "#FFFFFF",
    errorColor: "#B23A48", // Vermelho mais suave
    modalThemeMode: "white",
    borderBottom: "rgba(0,0,0,0.1)",
    amazon: "#146EB4",
  },
  odisseia: {
    background: "#001F3F", // Azul profundo do mar
    text: "#F0EDEE", // Texto claro
    textSecondary: "#A5A5A5",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#012840", // Fundo modal mais escuro
    modalBackgroundSecondary: "#034A6D", // Fundo secundário azul marinho
    textButtons: "#FFFFFF",
    errorColor: "#C70039", // Vermelho forte
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.15)",
    amazon: "#146EB4",
  },
  ulisses: {
    background: "#2D2D2D", // Fundo cinza escuro
    text: "#E7E7E7", // Texto claro
    textSecondary: "#A0A0A0",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#3C3C3C", // Fundo do modal cinza escuro
    modalBackgroundSecondary: "#4A4A4A", // Fundo secundário
    textButtons: "#FFFFFF",
    errorColor: "#D91E18", // Vermelho forte
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.2)",
    amazon: "#146EB4",
  },

  // Tema especial - Bela e a Fera
  belaEAFera: {
    background: "#F2D7D5", // Rosa claro inspirado na rosa encantada
    text: "#3C3C3C", // Texto escuro
    textSecondary: "#7B7B7B",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#FDEDEC", // Fundo do modal suave
    modalBackgroundSecondary: "#F9E1E0", // Fundo secundário rosa claro
    textButtons: "#FFFFFF",
    errorColor: "#C0392B", // Vermelho inspirado na paixão
    modalThemeMode: "white",
    borderBottom: "rgba(0, 0, 0, 0.2)",
    amazon: "#146EB4",
  },

  // Tema baseado em "Amado"
  amado: {
    background: "#1C1C1C", // Fundo quase preto
    text: "#E6E6E6", // Texto claro
    textSecondary: "#CCCCCC",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#2B2B2B", // Fundo modal mais escuro
    modalBackgroundSecondary: "#4A4A4A", // Fundo secundário em cinza
    textButtons: "#FFFFFF",
    errorColor: "#9B1B30", // Vermelho profundo
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.2)",
    amazon: "#146EB4",
  },

  // Tema baseado em "Fahrenheit 451"
  fahrenheit451: {
    background: "#0D0D0D", // Fundo preto
    text: "#E0E0E0", // Texto claro
    textSecondary: "#999999",
    details: "#FF5733", // Laranja vibrante (fogo)
    modalBackground: "#171717", // Fundo modal escuro
    modalBackgroundSecondary: "#262626", // Fundo secundário
    textButtons: "#FFFFFF",
    errorColor: "#FF2D00", // Vermelho fogo
    modalThemeMode: "black",
    borderBottom: "rgba(255, 255, 255, 0.2)",
    amazon: "#146EB4",
  },

  // Tema baseado em "Duna"
  duna: {
    background: "#F5E1A4", // Fundo areia
    text: "#4A4A4A", // Texto escuro
    textSecondary: "#787878",
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#F0DCA1", // Fundo modal em tom de areia claro
    modalBackgroundSecondary: "#D8B67D", // Fundo secundário areia mais escura
    textButtons: "#FFFFFF",
    errorColor: "#D35400", // Laranja queimado para erros
    modalThemeMode: "white",
    borderBottom: "rgba(0,0,0,0.2)",
    amazon: "#146EB4",
  },
  gollum: {
    background: "#0D1B2A", // Fundo azul profundo
    text: "#E0E1DD", // Texto em cinza muito claro
    textSecondary: "#A5A5A5", // Texto secundário em cinza médio
    details: "#FF5733", // Laranja vibrante
    modalBackground: "#1B263B", // Fundo modal azul escuro
    modalBackgroundSecondary: "#415A77", // Fundo secundário azul mais claro
    textButtons: "#FFFFFF", // Texto dos botões em branco
    errorColor: "#D90429", // Vermelho forte
    borderBottom: "rgba(255, 255, 255, 0.15)", // Borda sutil em branco
    modalThemeMode: "black", // Tema do modal em preto
    amazon: "#146EB4",
  }
};

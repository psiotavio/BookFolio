export type Theme = {
  background: string;
  text: string;
  details: string;
  modalBackground: string;
  modalBackgroundSecondary: string;
  textButtons: string;
  errorColor: string;
  modalThemeMode: string;
  borderBottom: string;
  amazon: string;
};

export const themes: Record<'light' | 'blue' | 'orange' | 'pink' | 'lightpink' | 'green' | 'red' | 'dark', Theme> = {
  light: {
    background: '#F5F5F7',
    text: '#383838',
    details: '#B3ABD4',
    modalBackground: '#F1EFF2',
    modalBackgroundSecondary: '#35383F',
    textButtons: '#FFFFFF',
    errorColor: '#D14848',
    modalThemeMode: '#B3ABD4',
    borderBottom: 'rgba(0,0,0,0.25)',
    amazon: '#146EB4'
  },
  dark: {
    background: '#121212',     
    text: '#FDFDFD',
    details: '#8770B9',
    modalBackground: '#1C1C1C',
    modalBackgroundSecondary: '#35383F',
    textButtons: '#FFFFFF',
    errorColor: '#D14848',
    modalThemeMode: 'black',
    borderBottom: 'rgba(255,255,255,0.25)',
    amazon: '#146EB4'
  },
// COLOCAR ADS:
blue: {
  background: '#121212', // Fundo escuro
  text: '#E0E0E0', // Texto em cinza claro
  details: '#4169E1', // Borda em azul royal
  modalBackground: '#1C1C1C', // Fundo do modal
  modalBackgroundSecondary: '#2A2A2A', // Fundo secundário do modal
  textButtons: '#FFFFFF', // Texto dos botões em azul royal
  errorColor: '#D32F2F', // Cor de erro
  modalThemeMode: 'black', // Tema do modal em preto
  borderBottom: 'rgba(255,255,255,0.25)', // Borda inferior sutil,
  amazon: '#146EB4'
},
orange: {
  background: '#121212', // Fundo escuro
  text: '#E0E0E0', // Texto em cinza claro
  details: '#FF5733', // Borda em laranja vibrante
  modalBackground: '#1C1C1C', // Fundo do modal
  modalBackgroundSecondary: '#2A2A2A', // Fundo secundário do modal
  textButtons: '#FFFFFF', // Texto dos botões em laranja vibrante
  errorColor: '#D32F2F', // Cor de erro
  modalThemeMode: 'black', // Tema do modal em preto
  borderBottom: 'rgba(255,255,255,0.25)', // Borda inferior sutil,
  amazon: '#146EB4'
},
pink: {
  background: '#121212',                  // Fundo escuro
  text: '#E0E0E0',                        // Texto em cinza claro
  details: '#A2207D',                   // Borda em rosa escuro
  modalBackground: '#1C1C1C',             // Fundo do modal
  modalBackgroundSecondary: '#2A2A2A',    // Fundo secundário do modal
  textButtons: '#FFFFFF',                 // Texto dos botões em rosa escuro
  errorColor: '#D32F2F',                  // Cor de erro
  modalThemeMode: 'black',                // Tema do modal em preto
  borderBottom: 'rgba(255,255,255,0.25)',  // Borda inferior sutil,
  amazon: '#146EB4'
},
lightpink: {
  background: '#FFFFFF',                  // Fundo claro
  text: '#333333',                        // Texto em cinza escuro para melhor legibilidade
  details: '#FFC0CB',                   // Borda em rosa bebê
  modalBackground: '#F8F8F8',             // Fundo do modal em um cinza muito claro
  modalBackgroundSecondary: '#EFEFEF',    // Fundo secundário do modal em cinza claro
  textButtons: '#000000',                 // Texto dos botões em rosa bebê
  errorColor: '#D32F2F',                  // Cor de erro
  modalThemeMode: 'white',                // Tema do modal em branco
  borderBottom: 'rgba(0,0,0,0.25)' ,
  amazon: '#146EB4'
},
green: {
  background: '#121212',                  // Fundo escuro
  text: '#E0E0E0',                        // Texto em cinza claro
  details: '#005F37',                   // Borda em verde escuro
  modalBackground: '#1C1C1C',             // Fundo do modal
  modalBackgroundSecondary: '#2A2A2A',    // Fundo secundário do modal
  textButtons: '#FFFFFF',                 // Texto dos botões em verde escuro
  errorColor: '#D32F2F',                  // Cor de erro
  modalThemeMode: 'black',                // Tema do modal em preto
  borderBottom: 'rgba(255,255,255,0.25)',  // Borda inferior sutil,
  amazon: '#146EB4'
},
red: {
  background: '#121212',                  // Fundo escuro
  text: '#E0E0E0',                        // Texto em cinza claro
  details: '#B41717',                   // Borda em vermelho escarlate escuro
  modalBackground: '#1C1C1C',             // Fundo do modal
  modalBackgroundSecondary: '#2A2A2A',    // Fundo secundário do modal
  textButtons: '#FFFFFF',                 // Texto dos botões em vermelho escarlate escuro
  errorColor: '#D32F2F',                  // Cor de erro
  modalThemeMode: 'black',                // Tema do modal em preto
  borderBottom: 'rgba(255,255,255,0.25)',  // Borda inferior sutil,
  amazon: '#146EB4',
},
};

//MAIS PERSONAGENS

// noivaCadaver: { background: '#142237',          // Um azul muito escuro, quase preto, remetendo ao ambiente sombrio do filme
//     text: '#CAD7E3',                // Um azul claro, quase cinza, para texto, evocando o tom pálido da pele da noiva
//     details: '#7B9BA6',           x
//     modalBackground: '#1B3039',     // Fundo de modal em um tom de azul mais profundo, ainda dentro da paleta sombria
//     modalBackgroundSecondary: '#273D4C', // Um azul médio para modal secundário, mantendo a sensação etérea
//     textButtons: '#FFFFFF',         // Botões em branco para contrastar com o fundo escuro
//     errorColor: '#C45C80',          // Um rosa suave para erros, lembrando a cor das rosas que aparecem no filme
//     modalThemeMode: 'lightblue',  // Nome do modo, refletindo a vibe fantasmagórica e azulada do filme
//     borderBottom: 'rgba(123, 155, 166, 0.3)' // Borda inferior semi-transparente com uma cor suave da paleta do f
// }

// ursula: {
//   background: '#120E18',         
//     text: '#E8E8FF',                // Lilás muito claro, quase branco, para o texto, simbolizando a palidez da Úrsula
//     details: '#5B437A',           // Roxo médio, solidamente representativo da cor dos tentáculos de Úrsula
//     modalBackground: '#1F1929',     // Fundo de modal em roxo escuro, trazendo a aura misteriosa e sombria de Úrsula
//     modalBackgroundSecondary: '#312D41',
//     textButtons: '#FFFFFF',         // Mantendo os botões em branco para destacar sobre os tons escuros do fundo
//     errorColor: '#FF4081',          // Rosa vibrante, emprestando a vivacidade da coloração dos tentáculos de Úrsula
//     modalThemeMode: 'black',     // "Bruxa do Mar" como nome do modo, em alusão direta ao título dado a Úrsula
//     borderBottom: 'rgba(255, 64, 129, 0.3)'
// }

// joker: { 
//   background: '#200033',          // Um roxo escuro e intenso, refletindo o terno icônico do Joker
// text: '#F1E4F3',                // Texto em lilás pálido, quase branco, para destacar sobre o fundo escuro
// details: '#21A336',           
// modalBackground: '#3D2058',     // Um tom de roxo mais profundo e mais sofisticado para o fundo do modal
// modalBackgroundSecondary: '#4E2C6E', // Um tom de roxo mais vibrante e luxuoso para o modal secundário
// textButtons: '#FFFFFF',         // Botões em branco para alta visibilidade e contrastar com o fundo escuro
// errorColor: '#D32F2F',          // Vermelho intenso para erros, capturando a intensidade dramática do personagem
// modalThemeMode: 'black', // Modo "Chaotic Purple", mantendo a essência errática do Joker
// borderBottom: 'rgba(255, 255, 255, 0.35)'
// }

// ravenclaw: {
  // background: '#251D3A',          // Um roxo profundo que evoca o manto da casa Ravenclaw
  // text: '#D2D0F0',                // Um tom de azul claro para o texto, simbolizando o céu noturno e a sabedoria
  // details: '#4C4390',           // Um azul-roxo, cor que combina com o roxo base mas traz uma pitada de exclusividade
  // modalBackground: '#302948',     // Roxo intermediário para o fundo do modal, inspirado pelas cores da casa
  // modalBackgroundSecondary: '#423D5F', // Roxo mais claro para o modal secundário, complementando a paleta
  // textButtons: '#FFFFFF',         // Botões em branco para maior visibilidade
  // errorColor: '#AA336A',          // Um tom de vinho para erros, elegante e discreto
  // modalThemeMode: 'black', // Modo "Sabedoria do Mago", evocando a inteligência e criatividade de Ravenclaw
  // borderBottom: 'rgba(255, 255, 255, 0.35)'
// }

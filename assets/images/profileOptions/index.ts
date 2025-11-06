// Imagens de perfil disponíveis
export const profilePhotos = [
  require('./profilePhoto/profilePhoto1.png'),
  require('./profilePhoto/profilePhoto2.png'),
  require('./profilePhoto/profilePhoto3.png'),
  require('./profilePhoto/profilePhoto4.png'),
  require('./profilePhoto/profilePhoto5.png'),
  require('./profilePhoto/profilePhoto6.png'),
  require('./profilePhoto/profilePhoto7.png'),
  require('./profilePhoto/profilePhoto8.png'),
  require('./profilePhoto/profilePhoto9.png'),
  require('./profilePhoto/profilePhoto10.png'),
  require('./profilePhoto/profilePhoto11.png'),
  // Adicione mais imagens conforme necessário
];

// Imagens de banner disponíveis
export const bannerImages = [
  require('./banners/banner1.jpg'),
  require('./banners/banner2.jpg'),
  require('./banners/banner3.jpg'),
  require('./banners/banner4.jpg'),
  require('./banners/banner5.jpg'),
  require('./banners/banner6.jpg'),
  require('./banners/banner7.jpg'),
  require('./banners/banner8.jpg'),
  require('./banners/banner9.jpg'),
  require('./banners/banner10.jpg'),
];

// Função para obter imagens baseado no tipo
export const getImagesByType = (type: 'profile' | 'banner') => {
  if (type === 'profile') {
    return profilePhotos;
  }
  return bannerImages;
};

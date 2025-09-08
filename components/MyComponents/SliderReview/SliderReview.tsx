import React from 'react';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../../constants/temas/ThemeContext';

interface SliderReviewProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SliderReview: React.FC<SliderReviewProps> = ({ 
  value, 
  onChange, 
  disabled = false, 
  size = 'medium' 
}) => {
  const { theme } = useTheme();
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 120, height: 20 };
      case 'large':
        return { width: 250, height: 50 };
      default:
        return { width: 200, height: 40 };
    }
  };
  
  return (
    <Slider
      style={getSizeStyles()}
      minimumValue={0}
      maximumValue={5}
      step={0.5}
      value={value}
      onValueChange={disabled ? undefined : onChange}
      minimumTrackTintColor={theme.details}
      maximumTrackTintColor={theme.modalBackgroundSecondary}
      disabled={disabled}
      thumbStyle={disabled ? { width: 0, height: 0 } : undefined}
    />
  );
};

export default SliderReview;

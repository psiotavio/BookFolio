import React from 'react';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../../constants/temas/ThemeContext';

interface SliderReviewProps {
  value: number;
  onChange: (value: number) => void;
}

const SliderReview: React.FC<SliderReviewProps> = ({ value, onChange }) => {
    const { theme } = useTheme();
    
  return (
    <Slider
      style={{ width: 200, height: 40 }}
      minimumValue={0}
      maximumValue={5}
      step={0.5}
      value={value}
      onValueChange={onChange}
      minimumTrackTintColor= {theme.details}
      maximumTrackTintColor= {theme.modalBackgroundSecondary}
    />
  );
};

export default SliderReview;

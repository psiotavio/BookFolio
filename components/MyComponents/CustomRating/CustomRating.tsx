import React, { useState, useRef } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../constants/temas/ThemeContext';

interface CustomRatingProps {
  value: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  color?: string;
  emptyColor?: string;
  showLabel?: boolean;
}

const CustomRating: React.FC<CustomRatingProps> = ({
  value,
  onRatingChange,
  size = 24,
  color = '#FFD700',
  emptyColor = '#CCCCCC',
  showLabel = false,
}) => {
  const { theme } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<View>(null);

  const handleStarPress = (starIndex: number, isLeftSide: boolean = false) => {
    const baseRating = starIndex + 1;
    const newRating = isLeftSide ? starIndex + 0.5 : baseRating;
    onRatingChange(newRating);
  };

  const calculateRatingFromPosition = (x: number, containerWidth: number) => {
    const starWidth = (containerWidth - 16) / 5; // 16 = gap between stars (4 * 4)
    const starIndex = Math.floor(x / starWidth);
    const positionInStar = (x % starWidth) / starWidth;
    
    if (starIndex >= 5) return 5;
    if (starIndex < 0) return 0;
    
    // If position is in the left half of the star, give half rating
    if (positionInStar < 0.5) {
      return starIndex + 0.5;
    } else {
      return starIndex + 1;
    }
  };

  const handlePanGesture = (event: any) => {
    const { x } = event.nativeEvent;
    if (containerRef.current) {
      containerRef.current.measure((fx, fy, width) => {
        const newRating = calculateRatingFromPosition(x, width);
        onRatingChange(Math.max(0, Math.min(5, newRating)));
      });
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = value >= starValue;
    const isHalfFilled = value >= index + 0.5 && value < starValue;

    return (
      <View key={index} style={styles.starContainer}>
        {/* Left half for half star */}
        <Pressable
          onPress={() => handleStarPress(index, true)}
          style={({ pressed }) => [
            styles.halfStarButton,
            { 
              transform: [{ scale: pressed ? 0.9 : 1 }],
              width: size / 2,
              height: size,
            }
          ]}
        >
          <View style={styles.invisibleOverlay} />
        </Pressable>
        
        {/* Right half for full star */}
        <Pressable
          onPress={() => handleStarPress(index, false)}
          style={({ pressed }) => [
            styles.halfStarButton,
            { 
              transform: [{ scale: pressed ? 0.9 : 1 }],
              width: size / 2,
              height: size,
            }
          ]}
        >
          <View style={styles.invisibleOverlay} />
        </Pressable>
        
        {/* Visual star */}
        <View style={styles.starVisual}>
          <Ionicons
            name={isFilled ? "star" : "star-outline"}
            size={size}
            color={isFilled ? color : emptyColor}
          />
        </View>
        
        {/* Half star overlay */}
        {isHalfFilled && (
          <View style={[styles.halfStarOverlay, { width: size / 2 }]}>
            <Ionicons
              name="star"
              size={size}
              color={color}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handlePanGesture}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === 1) { // BEGAN
            setIsDragging(true);
          } else if (event.nativeEvent.state === 5) { // END
            setIsDragging(false);
          }
        }}
      >
        <View ref={containerRef} style={styles.starsRow}>
          {[0, 1, 2, 3, 4].map(renderStar)}
        </View>
      </PanGestureHandler>
      {showLabel && (
        <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
          {value.toFixed(1)}/5.0
        </Text>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  halfStarButton: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  invisibleOverlay: {
    flex: 1,
  },
  starVisual: {
    zIndex: 1,
  },
  halfStarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    height: '100%',
    zIndex: 3,
  },
  ratingText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default CustomRating;

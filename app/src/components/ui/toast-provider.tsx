import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/theme';

type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const translateY = useRef(new Animated.Value(-100)).current;

  const showToast = useCallback(({ message, type = 'info', duration = 3000 }: ToastOptions) => {
    setMessage(message);
    setType(type);
    setVisible(true);

    Animated.spring(translateY, {
      toValue: 50,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();

    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, duration);
  }, [translateY]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return '#10B981'; // Emerald 500
      case 'warning': return '#F59E0B'; // Amber 500
      case 'error': return '#EF4444';   // Rose 500
      default: return COLORS.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'warning': return 'alert-circle';
      case 'error': return 'close-circle';
      default: return 'information-circle';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View 
          style={[
            styles.toastContainer, 
            { transform: [{ translateY }], backgroundColor: getBackgroundColor() }
          ]}
        >
          <View className="flex-row items-center px-4 py-3">
            <Ionicons name={getIcon() as any} size={24} color="white" />
            <Text className="text-white font-bold ml-3 flex-1">{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 16,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

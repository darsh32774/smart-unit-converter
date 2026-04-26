import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  // FIX: Import Platform here!
  Platform,
} from 'react-native';
import { Menu } from 'lucide-react-native';

// --- Imports from Modular Architecture ---
import { CATEGORIES, ICONS, UNITS } from './src/constants/data.js';
import BaseConverter from './src/modules/Base/BaseConverter.jsx';
import CurrencyConverter from './src/modules/Currency/CurrencyConverter.jsx';
import DistanceConverter from './src/modules/Distance/DistanceConverter.jsx';
import TemperatureConverter from './src/modules/Temperature/TemperatureConverter.jsx';
import WeightConverter from './src/modules/Weight/WeightConverter.jsx';

const THEMES = {
  light: {
    background: '#e9ecf5',
    surface: '#f7f8fc',
    surfaceAlt: '#eef1fb',
    border: '#d5dbef',
    headerBg: '#1f2f57',
    headerText: '#f8fbff',
    chipInactiveBg: '#f7f8fc',
    chipActiveBg: '#1f2f57',
    chipInactiveText: '#1f2f57',
    chipActiveText: '#f8fbff',
    textPrimary: '#142448',
    textSecondary: '#4f5d80',
    toggleBg: '#1f2f57',
    toggleText: '#f8fbff',
    menuBg: '#f7f8fc',
    menuBorder: '#d5dbef',
    resultCardBg: '#1f2f57',
    resultCardText: '#f8fbff',
    swapBg: '#1f2f57',
    swapIcon: '#f8fbff',
    pickerBg: '#ffffff',
  },
  dark: {
    background: '#05070f',
    surface: '#121a30',
    surfaceAlt: '#0d1325',
    border: '#1f2b4a',
    headerBg: '#16254a',
    headerText: '#e7edff',
    chipInactiveBg: '#141f38',
    chipActiveBg: '#1f2f57',
    chipInactiveText: '#d5deff',
    chipActiveText: '#f8fbff',
    textPrimary: '#e7edff',
    textSecondary: '#98a8d8',
    toggleBg: '#e7edff',
    toggleText: '#0b1222',
    menuBg: '#16254a',
    menuBorder: '#243356',
    resultCardBg: '#1f2f57',
    resultCardText: '#f8fbff',
    swapBg: '#e7edff',
    swapIcon: '#0b1222',
    pickerBg: '#0d1325',
  },
};

const CONVERSION_COMPONENTS = {
  [CATEGORIES.BASE]: BaseConverter,
  [CATEGORIES.CURRENCY]: CurrencyConverter,
  [CATEGORIES.DISTANCE]: DistanceConverter,
  [CATEGORIES.TEMPERATURE]: TemperatureConverter,
  [CATEGORIES.WEIGHT]: WeightConverter,
};

const createStyles = (theme, layout) => {
  const { width, height } = layout;
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      width,
      minHeight: height,
      paddingHorizontal: 0,
      paddingTop: 0,
    },
    appContainer: {
      flex: 1,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      // Removed padding: 10
      borderRadius: 0,
    },
    topRow: {
      top: 25,
      paddingTop: 20,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    menuTrigger: {
      width: 44,
      height: 44,
      borderRadius: 14,
      borderWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceAlt,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    currentCategory: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.textPrimary,
      flexShrink: 1,
    },
    moduleArea: {
      marginTop: 20,
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 0,
      paddingHorizontal: 0,
    },
    drawerOverlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#00000070',
    },
    drawer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: Math.min(width * 0.75, 320),
      backgroundColor: theme.surface,
      paddingTop: 50,
      paddingHorizontal: 20,
      borderRightWidth: 0,
      borderColor: theme.border,
      elevation: 10,
    },
    drawerHeader: {
      top: 0,
      fontSize: 22,
      fontWeight: '800',
      color: theme.textPrimary,
      marginBottom: 20,
    },
    drawerItem: {
      top: 0,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 0,
      backgroundColor: 'transparent',
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    drawerItemActive: {
      backgroundColor: theme.chipActiveBg,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    drawerItemText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      marginLeft: 10,
    },
    drawerItemTextActive: {
      color: theme.chipActiveText,
    },
    drawerFooter: {
      marginTop: 'auto',
      paddingVertical: 30,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    toggleLabel: {
      top: 0,
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    toggleButton: {
      top: 0,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: theme.toggleBg,
    },
    toggleButtonText: {
      color: theme.toggleText,
      fontWeight: '600',
    },
  });
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.DISTANCE);
  const [themeName, setThemeName] = useState('light');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = THEMES[themeName];
  const layout = useWindowDimensions();
  const styles = useMemo(() => createStyles(theme, layout), [theme, layout]);
  const ActiveComponent = CONVERSION_COMPONENTS[activeCategory];
  const categoriesAlphabetical = useMemo(
    () => [...Object.values(CATEGORIES)].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const handleCategoryChange = useCallback((cat) => {
    setActiveCategory(cat);
    setDrawerOpen(false);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => (prev === 'light' ? 'dark' : 'light'));
    setDrawerOpen(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={themeName === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />
      <View style={styles.screen}>
        <View style={styles.appContainer}>
          <View style={styles.topRow}>
            <TouchableOpacity
              style={styles.menuTrigger}
              onPress={() => setDrawerOpen(true)}
              activeOpacity={0.75}
            >
              <Menu size={20} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.currentCategory}>{activeCategory} Conversion</Text>
          </View>

          <View style={styles.moduleArea}>
            {ActiveComponent && (
              <ActiveComponent
                activeCategory={activeCategory}
                units={UNITS[activeCategory]}
                theme={theme}
              />
            )}
          </View>
        </View>
      </View>

      {drawerOpen && (
        <>
          <TouchableOpacity
            style={styles.drawerOverlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
          <View style={styles.drawer}>
            <Text style={styles.drawerHeader}>Conversion Modes</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categoriesAlphabetical.map((cat) => {
                const IconComponent = ICONS[cat];
                const isActive = activeCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.drawerItem,
                      isActive && styles.drawerItemActive,
                    ]}
                    onPress={() => handleCategoryChange(cat)}
                    activeOpacity={0.8}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={18}
                        color={isActive ? theme.chipActiveText : theme.textPrimary}
                      />
                    )}
                    <Text
                      style={[
                        styles.drawerItemText,
                        isActive && styles.drawerItemTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.drawerFooter}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Theme</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={toggleTheme}
                  activeOpacity={0.8}
                >
                  <Text style={styles.toggleButtonText}>
                    {themeName === 'light' ? 'Dark' : 'Light'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

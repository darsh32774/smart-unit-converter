import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ArrowRightLeft, Trash2, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.surface,
      borderRadius: 28,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    inputWrapper: {
      borderBottomWidth: 0,
      paddingBottom: 0,
      marginBottom: 4,
      position: 'relative',
    },
    input: {
      fontSize: 48,
      fontWeight: '600',
      color: theme.textPrimary,
      paddingVertical: 4,
      paddingRight: 50,
    },
    clearButton: {
      position: 'absolute',
      right: 0,
      top: 10,
      padding: 8,
    },
    unitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    unitColumn: {
      flex: 1,
      marginHorizontal: 4,
    },
    pickerWrapper: {
      borderWidth: 0,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: theme.surfaceAlt,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    picker: {
      height: 55,
      width: '100%',
      color: theme.textPrimary,
      backgroundColor: 'transparent',
    },
    swapButton: {
      top: 15,
      padding: 12,
      borderRadius: 999,
      backgroundColor: theme.swapBg,
      marginHorizontal: 8,
    },
    resultCard: {
      flex: 1,
      backgroundColor: theme.resultCardBg,
      borderRadius: 24,
      padding: 24,
      justifyContent: 'space-between',
      ...Platform.select({
        ios: {
          shadowColor: theme.resultCardBg,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 10,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    resultLabel: {
      color: theme.resultCardText,
      fontSize: 15,
      fontWeight: '700',
    },
    copyButton: {
      padding: 10,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.resultCardText + '66',
    },
    resultValueRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      minHeight: 70,
      marginTop: 8,
    },
    resultValue: {
      color: theme.resultCardText,
      fontSize: 56,
      fontWeight: '800',
      flexShrink: 1,
      marginRight: 10,
    },
    resultUnit: {
      color: theme.resultCardText + 'cc',
      fontSize: 20,
      fontWeight: '600',
    },
    rateRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: theme.resultCardText + '22',
      paddingTop: 12,
      marginTop: 12,
    },
    rateText: {
      color: theme.resultCardText + 'dd',
      fontSize: 13,
    },
    currencyCaption: {
      color: theme.resultCardText + 'aa',
      fontSize: 11,
      fontStyle: 'italic',
      marginTop: 10,
    },
  });

const UnitSelect = ({ value, onValueChange, units, styles, theme }) => {
  // Map your existing units data into the format required by the Dropdown library
  // assuming units looks like: [{ id: 'KM', label: 'Kilometers' }, ...]
  const data = useMemo(() => 
    units.map(u => ({ 
      label: u.label, 
      value: u.id, 
      id: u.id // Keep original ID if needed elsewhere
    })), 
    [units]
  );
  
  return (
    <View style={styles.pickerWrapper}>
      <Dropdown
        // Data and Value Props
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        onChange={item => onValueChange(item.value)}

        // Styling Props
        style={[styles.picker, { paddingHorizontal: 12 }]}
        containerStyle={{ 
            backgroundColor: theme.surfaceAlt, // Dropdown container background (Dark: #0d1325)
            borderColor: theme.border,
            borderRadius: 16,
        }}
        placeholderStyle={{ color: theme.textSecondary }}
        selectedTextStyle={{ color: theme.textPrimary, fontSize: 16 }} // Text displayed when unit is selected
        itemTextStyle={{ color: theme.textPrimary }} // Text inside the dropdown list
        iconColor={theme.textPrimary}
        
        // Custom rendering for consistency (optional)
        renderItem={(item, isSelected) => (
            <View 
                style={{ 
                    padding: 12, 
                    backgroundColor: isSelected ? theme.surfaceAlt + '60' : 'transparent' 
                }}
            >
                <Text style={{ color: theme.textPrimary, fontSize: 16 }}>{item.label}</Text>
            </View>
        )}
      />
    </View>
  );
};

// ... (rest of ConverterUI.jsx) ...

const ConverterUI = ({
  category,
  amount,
  setAmount,
  fromUnit,
  setFromUnit,
  toUnit,
  setToUnit,
  result,
  isLoading,
  swapUnits,
  categoryUnits = [],
  getUnitCode,
  isInputText,
  isCurrency,
  rateNote,
  onRateNotePress,
  theme,
}) => {
  const palette = theme || DEFAULT_THEME;
  const styles = useMemo(() => createStyles(palette), [palette]);
  const placeholderText = isInputText ? 'e.g., 1A4F' : '0';
  const keyboardType = isInputText ? 'default' : 'decimal-pad';

  const previewRate = useMemo(() => {
    if (isLoading || isInputText) return 'N/A';
    const numericAmount = parseFloat(amount);
    const numericResult = parseFloat(result);
    if (!numericAmount || !isFinite(numericResult)) return 'N/A';
    const rate = numericResult / numericAmount;
    if (!isFinite(rate)) return 'N/A';
    return rate >= 0.000001 ? rate.toFixed(6) : '< 0.000001';
  }, [amount, result, isInputText, isLoading]);

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const copyToClipboard = async () => {
    if (!result || result === '---' || isLoading) return;
    const payload = `${amount || '0'} ${getUnitCode(fromUnit)} = ${result} ${getUnitCode(toUnit)}`;
    try {
      await Clipboard.setStringAsync(payload);
      showToast('Copied!');
    } catch (err) {
      console.warn('Copy failed', err);
      showToast('Unable to copy');
    }
  };

  const handleClear = () => {
    setAmount(isInputText ? '' : '0');
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 24 }}>
        <Text style={styles.label}>{isInputText ? 'Number String' : 'Amount'}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder={placeholderText}
            placeholderTextColor={palette.textSecondary + '88'}
            style={styles.input}
            keyboardType={keyboardType}
            autoCapitalize="characters"
            autoCorrect={false}
            selectionColor={palette.textPrimary}
          />
          {!!amount && amount !== '0' && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Trash2 size={18} color={palette.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.unitRow}>
        <View style={styles.unitColumn}>
          <Text style={styles.label}>From ({getUnitCode(fromUnit)})</Text>
          <UnitSelect
            value={fromUnit}
            onValueChange={setFromUnit}
            units={categoryUnits}
            styles={styles}
            theme={palette}
          />
        </View>

        <TouchableOpacity
          style={styles.swapButton}
          onPress={swapUnits}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          <ArrowRightLeft size={20} color={palette.swapIcon || palette.resultCardText} />
        </TouchableOpacity>

        <View style={styles.unitColumn}>
          <Text style={styles.label}>To ({getUnitCode(toUnit)})</Text>
          <UnitSelect
            value={toUnit}
            onValueChange={setToUnit}
            units={categoryUnits}
            styles={styles}
            theme={palette}
          />
        </View>
      </View>

      <View style={styles.resultCard}>
        <View>
          <View style={styles.resultHeader}>
            <Text style={styles.resultLabel}>{isLoading ? 'Calculating…' : 'Result'}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={copyToClipboard}
              disabled={isLoading || result === '---'}
              activeOpacity={0.7}
            >
              <Copy size={18} color={palette.resultCardText} />
            </TouchableOpacity>
          </View>

          <View style={styles.resultValueRow}>
            {isLoading ? (
              <ActivityIndicator color={palette.resultCardText} size="large" />
            ) : (
              <>
                <Text style={styles.resultValue}>{result || '---'}</Text>
                {category !== 'Base' && (
                  <Text style={styles.resultUnit}>{getUnitCode(toUnit)}</Text>
                )}
              </>
            )}
          </View>
        </View>

        <View>
          <View style={styles.rateRow}>
            <Text style={styles.rateText}>
              {isInputText ? 'Base Conversion' : `1 ${getUnitCode(fromUnit)} equals`}
            </Text>
            <Text style={styles.rateText}>
              {isLoading ? '...' : previewRate}{' '}
              {!isInputText && previewRate !== 'N/A' ? getUnitCode(toUnit) : ''}
            </Text>
          </View>

          {isCurrency && (
            onRateNotePress ? (
              <TouchableOpacity onPress={onRateNotePress} activeOpacity={0.75}>
                <Text style={styles.currencyCaption}>
                  {rateNote || 'Tap to refresh the latest rates.'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.currencyCaption}>
                {rateNote || 'Rates are approximate and stored locally.'}
              </Text>
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default ConverterUI;

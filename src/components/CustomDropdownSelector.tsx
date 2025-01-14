// This dropdown is especially for input or form selector

import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Controller} from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';
import {ThemedText} from './ThemedText';
import {Colors} from '../constants/Color';

// svg
import DropDownSvg from '../assets/svg/chevron-right.svg';

interface CustomDropdownSelectorProps {
  name: string;
  control: any;
  label: string;
  options: {label: string; value: string}[]; // Removed icon field
  isRequired?: boolean;
}

const CustomDropdownSelector: React.FC<CustomDropdownSelectorProps> = ({
  name,
  control,
  label,
  options,
  isRequired,
}) => {
  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label}>
        {label}
        {isRequired && <Text style={styles.requiredSymbol}>*</Text>}
      </ThemedText>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <>
            <SelectDropdown
              data={options}
              onSelect={(selectedItem, _) => onChange(selectedItem.value)}
              defaultValue={options.find((option) => option.value === value)}
              renderButton={(selectedItem, isOpened) => (
                <View style={styles.dropdownButtonStyle}>
                  <ThemedText style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.label) || 'Select an option'}
                  </ThemedText>
                  <ThemedText style={styles.dropdownButtonArrowStyle}>
                    {isOpened ? (
                      <DropDownSvg style={styles.DDSvgOpen} />
                    ) : (
                      <DropDownSvg />
                    )}
                    {/* Placeholder arrow */}
                  </ThemedText>
                </View>
              )}
              renderItem={(item, index, isSelected) => (
                <View
                  style={[
                    styles.dropdownItemStyle,
                    // eslint-disable-next-line react-native/no-inline-styles
                    isSelected && {backgroundColor: '#D2D9DF'},
                  ]}>
                  <ThemedText style={styles.dropdownItemTxtStyle}>
                    {item.label}
                  </ThemedText>
                </View>
              )}
              dropdownStyle={styles.dropdownMenuStyle}
              showsVerticalScrollIndicator={false}
            />
            {error && (
              <ThemedText style={styles.errorText}>{error.message}</ThemedText>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.whiteTunedBG,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
    color: '#151E26',
  },
  dropdownMenuStyle: {
    backgroundColor: Colors.whiteTunedBG,
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.muteGray,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  DDSvgOpen: {
    transform: [{rotate: '180deg'}],
  },
  requiredSymbol: {
    color: Colors.redMain,
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    color: Colors.redMain,
    marginTop: 4,
  },
});

export default CustomDropdownSelector;

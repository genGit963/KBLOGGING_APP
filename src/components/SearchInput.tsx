import React, {useEffect} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {ThemedText} from './ThemedText';
import SearchIconSvg from '../assets/svg/search.svg';
import supplyShadowEffect from '../utils/Shadow';
import {Colors} from '../constants/Color';
import useTranslate from '../hooks/language/translate';

const SearchSchema = z.object({
  searchText: z.string(),
});

export type SearchType = z.infer<typeof SearchSchema>;

interface SearchProps extends TextInputProps {
  placeHolder: string;
  callBackSetSearchValue: (val: SearchType['searchText']) => void;
}

const SearchInput: React.FC<SearchProps> = ({
  style,
  placeHolder,
  callBackSetSearchValue,
  ...rest
}) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<SearchType>({
    resolver: zodResolver(SearchSchema),
  });

  const {translateLanguage} = useTranslate();

  const onSubmit = (data: SearchType) => {
    // console.log('search text: ', data);
    callBackSetSearchValue(data.searchText);
  };

  const searchTextWatch = watch('searchText');
  useEffect(() => {
    callBackSetSearchValue(searchTextWatch);
  }, [searchTextWatch]);

  return (
    <View style={styles.SearchContainer}>
      <Controller
        control={control}
        name={'searchText'}
        render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
          <>
            <TextInput
              style={[styles.input, style]}
              placeholder={translateLanguage(
                `Search ${placeHolder}`,
                `${placeHolder} खोज्नुहोस्`,
              )}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              returnKeyType="search"
              onSubmitEditing={handleSubmit(onSubmit)}
              {...rest}
            />
            {errors.searchText && (
              <ThemedText style={styles.errorText}>{error?.message}</ThemedText>
            )}
          </>
        )}
      />
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <SearchIconSvg height={26} width={26} style={styles.SearchIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  SearchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,

    ...supplyShadowEffect({
      X_off: 0,
      Y_off: 0,
      Radius: 3,
      Color: '#000',
      Opacity: 0.15,
      Elevation: 3.4,
    }),
  },
  input: {
    flex: 1,
    fontSize: Platform.OS === 'ios' ? 16 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 0 : 0,
    color: Colors.darkGray,
    fontFamily: Platform.OS === 'ios' ? 'Poppins Medium' : 'PoppinsMedium',
    // backgroundColor: 'red',
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
  SearchIcon: {
    // backgroundColor: 'green',
  },
});

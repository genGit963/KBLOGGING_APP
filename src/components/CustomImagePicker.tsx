import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Control, Controller, FieldErrors} from 'react-hook-form';
import {PERMISSIONS} from 'react-native-permissions';
import {
  ImageLibraryOptions,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {checkPermission, requestPermission} from '../utils/permissions';
import {Colors} from '../constants/Color';
import {ThemedText} from './ThemedText';

interface ImagePickerComponentProps {
  control: Control<any>;
  errors: FieldErrors;
  label: string;
  controllerName: string;
  isRequired: boolean;
}

const CustomImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  control,
  errors,
  label,
  controllerName,
  isRequired,
}) => {
  const [filename, setFilename] = useState<string | undefined>('');
  const [imageUri, setImageUri] = useState<string | undefined>('');
  const [, setImageAsset] = useState<Asset | undefined>();

  const handleImageUpload = async (
    onChange: (value: Asset | undefined) => void,
  ) => {
    const imagePickerLauncher = async () => {
      const mediaOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
      };
      await launchImageLibrary(mediaOptions, (response) => {
        if (response.didCancel) {
          console.log('User canceled the image selection');
        } else if (response.assets) {
          const asset = response.assets[0];
          setFilename(asset.fileName);
          setImageUri(asset.uri);
          setImageAsset(asset);
          onChange(asset);
        }
      });
    };

    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
    await checkPermission(permission).then((res) => {
      if (!res) {
        requestPermission(permission).then((grantedResponse) => {
          if (grantedResponse) {
            imagePickerLauncher();
          }
        });
      } else {
        imagePickerLauncher();
      }
    });
  };

  return (
    <View style={styles.imagePickerContainer}>
      <View style={styles.labelContainer}>
        <ThemedText style={styles.label}>
          {label}
          {isRequired && <Text style={styles.requiredSymbol}>*</Text>}
        </ThemedText>
      </View>
      {imageUri && (
        <Image source={{uri: imageUri}} style={styles.selectedImage} />
      )}
      <Controller
        control={control}
        name={controllerName}
        render={({field: {onChange}}) => (
          <View style={styles.imagePickerBox}>
            <ThemedText style={styles.filename}>
              {filename ? filename : 'eg: filename.jpg'}
            </ThemedText>
            <TouchableOpacity onPress={() => handleImageUpload(onChange)}>
              <ThemedText type="link">
                {imageUri ? 'Change Image' : 'Upload Image'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors[controllerName] && (
        <Text style={styles.error}>
          {errors[controllerName]?.message as string}
        </Text>
      )}
    </View>
  );
};

export default CustomImagePickerComponent;

const styles = StyleSheet.create({
  imagePickerContainer: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000',
  },
  requiredSymbol: {
    color: Colors.redMain,
    fontSize: 18,
    marginBottom: 5,
  },
  imagePickerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.muteGray,
    height: 50,
    borderRadius: 10,
    padding: 10,
  },
  filename: {
    fontSize: 15,
    color: Colors.muteGray,
  },
  error: {
    color: Colors.redMain,
    marginTop: 4,
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginVertical: 8,
  },
});

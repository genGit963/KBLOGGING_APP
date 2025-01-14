import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {ThemedText} from '../../../../../../components/ThemedText';
import {Colors} from '../../../../../../constants/Color';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  AlekhZType,
  AlekhZSchema,
} from '../../../../../../schema/tabs/dashboard/alekh.schema';
import CustomTextInput from '../../../../../../components/CustomInput';
import HeroButton from '../../../../../../components/HeroButton';
import CustomImagePickerComponent from '../../../../../../components/CustomImagePicker';
import {usePostAlekhs} from '../../../../../../hooks/tabs/dashboard/alekh';
import ApiError from '../../../../../../components/api/ApiError';
import {Asset} from 'react-native-image-picker';
import useTranslate from '../../../../../../hooks/language/translate';
import supplyShadowEffect from '../../../../../../utils/Shadow';
import {confirmFormClose} from '../../../../../../utils/closeModalConfirmation';

const AlekhAddModal = ({
  isVisible,
  modalVisibile,
}: {
  isVisible: boolean;
  modalVisibile: (val: boolean) => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AlekhZType>({
    resolver: zodResolver(AlekhZSchema),
  });

  const {translateLanguage} = useTranslate();

  const {loading, error, handlePostAlekhs} = usePostAlekhs();

  const onSubmit = async (data: AlekhZType) => {
    console.log('handlePostAlekhs data: ', data);
    const formData = new FormData();

    if (data.image) {
      const image = data.image as unknown as Asset;
      formData.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      } as any);
    }

    formData.append('title', data.title);
    formData.append('desc', data.desc);
    formData.append('author', data.author);
    formData.append('body', data.body);

    const response = await handlePostAlekhs(formData);

    if (response) {
      console.log('postAlekhRes: ', response);
      Alert.alert('Post Alekh', 'Alekh is posted successfully');
      modalVisibile(false);
    }
    // if (!error) {
    //   modalVisibile(false);
    // }
  };

  const addAlekhLabels = {
    modalTitle: translateLanguage('Add Aalekh', 'आलेख थप्नुहोस्'),
    formName: translateLanguage('Aalekh Form', 'आलेख फारम'),
    image: translateLanguage('Upload Image', 'फोटो अपलोड गर्नुहोस्'),
    title: translateLanguage('Aalekh Title', 'आलेख शीर्षक'),
    details: translateLanguage('Details', 'विवरणहरू'),
    author: translateLanguage('Author Name', 'लेखकको नाम'),
    write_alekh: translateLanguage('Write Aalekh', 'आलेख लेख्नुहोस्'),
    submit: translateLanguage('Submit', 'बुझाउनुहोस्'),
    loading: translateLanguage('Loading...', 'पेस गर्दै...'),
    cancel: translateLanguage('Cancel', 'रद्द गर्नुहोस्'),
    cancelQuestion: translateLanguage(
      'Are you sure want to cancel?',
      'के तपाईँ निश्चित रूपमा रद्द गर्न चाहनुहुन्छ?',
    ),
    yes: translateLanguage('YES', 'हो'),
    no: translateLanguage('NO', 'होइन'),
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() =>
        confirmFormClose({
          formName: addAlekhLabels.formName,
          cancelQuestion: addAlekhLabels.cancelQuestion,
          yes: addAlekhLabels.yes,
          no: addAlekhLabels.no,
          callbackModalVisible: modalVisibile,
        })
      }>
      <View style={styles.ModelContainer}>
        <View style={styles.modalView}>
          <HeroButton
            btnText={addAlekhLabels.cancel}
            varient="cancel"
            onPress={() =>
              confirmFormClose({
                formName: addAlekhLabels.formName,
                cancelQuestion: addAlekhLabels.cancelQuestion,
                yes: addAlekhLabels.yes,
                no: addAlekhLabels.no,
                callbackModalVisible: modalVisibile,
              })
            }
          />

          <ScrollView
            style={styles.ScrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <ThemedText type="subtitle">{addAlekhLabels.modalTitle}</ThemedText>

            <CustomImagePickerComponent
              label={addAlekhLabels.image}
              isRequired
              errors={errors}
              controllerName="image"
              control={control}
            />

            <CustomTextInput
              name="title"
              control={control}
              placeholder="Title"
              label={addAlekhLabels.title}
              isRequired={true}
              error={errors.title}
            />

            <CustomTextInput
              name="desc"
              control={control}
              placeholder="Alekh Details"
              label={addAlekhLabels.details}
              isRequired={true}
              error={errors.desc}
            />

            <CustomTextInput
              name="author"
              control={control}
              placeholder="Author Name"
              label={addAlekhLabels.author}
              isRequired={true}
              error={errors.author}
            />

            <CustomTextInput
              name="body"
              control={control}
              placeholder="Write Alekh..."
              label={addAlekhLabels.author}
              isRequired={true}
              multiline
              style={styles.writeAlekh}
              error={errors.body}
              textAlignVertical="top"
            />

            {error && <ApiError message={error} />}
            <HeroButton
              disabled={loading}
              btnText={loading ? 'Loading...' : addAlekhLabels.submit}
              onPress={handleSubmit(onSubmit)}
              style={styles.SubmitBtn}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ModelContainer: {
    height: Platform.OS === 'ios' ? '94%' : '99%',
    width: '100%',
    position: 'absolute',
    bottom: -5,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  modalView: {
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 3,
    borderColor: Colors.muteGray,

    ...supplyShadowEffect({
      X_off: 0,
      Y_off: -4,
      Radius: 15,
      Color: '#000',
      Opacity: 0.4,
      Elevation: 8,
    }),
  },
  ScrollContainer: {
    width: '100%',
    marginBottom: 10,
  },
  writeAlekh: {
    height: 150,
  },
  SubmitBtn: {
    marginTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: Platform.OS === 'android' ? 70 : 30,
  },
});

export default AlekhAddModal;

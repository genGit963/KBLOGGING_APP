import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {AppScreenNavigationType} from '../../../core/navigation-type';
import ScreenTopTitle from '../../../components/ScreenTopTitle';
import BottomSpace from '../../../components/BottomSpace';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// types and interface
type NoticeTabScreenProps = {} & AppScreenNavigationType;

// ----------------- Subscription Screen ---------------------
const NoticeTabScreen: React.FC<NoticeTabScreenProps> = ({navigation}) => {
  return (
    <View style={styles.Page}>
      <SafeAreaView style={styles.Screen}>
        {/* Title */}
        <ScreenTopTitle navigation={navigation} screenTitle="Notice" />

        {/*  Screen Body */}

        <BottomSpace spaceHeight={'5%'} />
      </SafeAreaView>
    </View>
  );
};

export const styles = StyleSheet.create({
  Page: {
    backgroundColor: Colors.screenBackground,
    flex: 1,
    paddingHorizontal: 24,
  },
  Screen: {
    backgroundColor: Colors.screenBackground,
  },
});

export default NoticeTabScreen;
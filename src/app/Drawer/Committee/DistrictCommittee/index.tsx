import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {
  AppScreenNavigationType,
  AppScreenRouteType,
} from '../../../../core/navigation-type';
import ScreenTopTitle from '../../../../components/ScreenTopTitle';
import {Colors} from '../../../../constants/Color';
import {dummydataCommitteMember} from '../../../../schema/drawer/committee';
import MemberCard from './components/MemberCard';
import {useGetCommitteMembers} from '../../../../hooks/drawer/committee/committee';
import EmptyResponse from '../../../../components/EmptyResponse';
import ScreenDropDownSelector from '../../../../components/ScreenDropdownSelector';
import Loader from '../../../../components/Loader';
import useTranslate from '../../../../hooks/language/translate';

// types and interface
type DistrictCommitteeScreenProps = {} & AppScreenNavigationType &
  AppScreenRouteType;

// ----------------- DistrictCommittee screen ---------------------
const DistrictCommitteeScreen: React.FC<DistrictCommitteeScreenProps> = ({
  navigation,
  route,
}) => {
  const {endpointType} = route.params as {endpointType: string};

  const [districtCommMembers, setDistrictCommMembers] = useState([]);

  const [DDSelectedYear, setDDSelectedYear] = useState<string>('2080');

  const {loading, error, handleGetMembers} = useGetCommitteMembers();

  //the district of the user nai as the district parameter pass hunu parchha
  const getCommitteeMembers = async (year: number = 2080) => {
    const membersResponse = await handleGetMembers(
      endpointType,
      year,
      'kathmandu',
    );
    if (membersResponse) {
      console.log('getCommitteeMembers District: ', membersResponse);
    }
  };

  const {translateLanguage} = useTranslate();

  useEffect(() => {
    getCommitteeMembers(parseInt(DDSelectedYear));
  }, [DDSelectedYear]);

  return (
    <View style={styles.Page}>
      <SafeAreaView style={styles.Screen}>
        {/* Title */}
        <ScreenTopTitle
          navigation={navigation}
          screenTitle={translateLanguage('District committee', 'जिल्ला समिति')}
        />

        <ScreenDropDownSelector
          defaultValue="2080"
          callBackSetSelectedValue={setDDSelectedYear}
          ddViewWidth={160}
          options={[
            {label: '2070-2073', value: '2070'},
            {label: '2076-2079', value: '2076'},
            {label: '2080-2083', value: '2080'},
          ]}
        />

        {/* Body */}
        <ScrollView
          style={styles.ScrollView}
          contentContainerStyle={styles.ScrollContent}
          showsVerticalScrollIndicator={false}>
          {/* all Sadsaya contents */}
          <View style={styles.MembersView}>
            {districtCommMembers.length > 0 ? (
              <View>
                {dummydataCommitteMember.map((member, _) => {
                  if (member.Post === 'अध्यक्ष') {
                    return (
                      <View
                        style={styles.TopMemberView}
                        key={member.Id + member.Name}>
                        <MemberCard memberData={member} />
                      </View>
                    );
                  } else {
                    return (
                      <View
                        style={styles.OtherMemberView}
                        key={member.Id + member.Name}>
                        <MemberCard memberData={member} />
                      </View>
                    );
                  }
                })}
              </View>
            ) : loading ? (
              <Loader />
            ) : (
              <EmptyResponse message="No members available for now" />
            )}
          </View>
        </ScrollView>
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
  ScrollView: {marginBottom: 10, paddingBottom: 30},
  ScrollContent: {paddingBottom: 180},
  MembersView: {
    // borderWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 20,
    flexWrap: 'wrap',
  },
  TopMemberView: {
    // borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  OtherMemberView: {},
});

export default DistrictCommitteeScreen;

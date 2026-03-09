import { addResident } from '@/utils/supaSync';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { db, initDatabase } from './sql/optionsDB';


const { width, height } = Dimensions.get('screen');

type OptionProps = {
  id: number;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
}

type FamHeadProps = {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string;
}

export type Barangays = {
  id: number;
  name: string;
  code: string;
  municipality: string;
  province: string;
  region: string;
  created_at: string;
  updated_at: string;
}

export type EducationProps = {
  id?: number;
  educational_attainment_school_id?: number;
  strand_id?: number
  degree_id?: number;
  school?: string;
  year_level?: string;
  year_graduated?: string;
  school_id?: number;
}

export type ResidentData = {
    id: string;
    last_name?: string;
    first_name?: string;
    middle_name?: string;
    suffix_id?: number;
    civil_status_id?: number;
    sitio_id?: number;
    sex?: string;
    date_of_birth?: string;
    place_of_birth?: string;
    occupation?: string;
    citizenship?: string;
    religion_id?: number;
    voting_eligibility?: boolean;
    registered_voter?: boolean;
    registered_brgy?: string;
    blood_type_id?: number;
    contact_number?: string;
    email?: string;
    emergency_contact_person?: string;
    emergency_contact_number?:  string;
    relationship_contact_id?:  number;
    lgbt?: boolean;
    lgbtq_id?: number;
    is_4ps_member?: boolean
    pwd?: boolean;
    pwd_types_id?: number;
    senior?: boolean
    indigent_senior?: boolean;
    pensioner?: boolean
    ofw?: boolean;
    indigenous_people?: boolean
    ethnicity?: boolean;
    ethnicity_id?: number;
    ph_number?: string;
    solo_parent?: boolean;
    sss_number?: string;
    gsis_number?: string;
    hdmf_number?: string;
    has_ph?: boolean
    has_sss?: boolean;
    has_gsis?: boolean
    family_id?: number;
    make_head_of_family?: boolean;
    has_hdmf?: boolean;
    status_id?: number;
    school?: EducationProps[];
    osy?: boolean;
    reason?: string;
    inactive_type?: number
    date_of_death?: string
    date_of_migration?: string
    place_to_migrate?: string;
    created_at?: string;
    updated_at?: string;
    synced?: boolean
}

const sexes = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
];

const specialStatus = [
  { label: '4Ps Member', key: 'is_4ps_member' },
  { label: 'Senior', key: 'senior' },
  { label: 'Indigent Senior', key: 'indigent_senior' },
  { label: 'Pensioner', key: 'pensioner' },
  { label: 'OFW', key: 'ofw' },
  { label: 'Indigenous People', key: 'indigenous_people' },
  { label: 'Solo Parent', key: 'solo_parent' }
] as { label: string; key: keyof ResidentData }[];

const governmentIds = [
  { label: 'HDMF', key: 'has_hdmf', value: 'hdmf_number' },
  { label: 'GSIS', key: 'has_gsis', value: 'gsis_number' },
  { label: 'PhilHealth', key: 'has_ph', value: 'ph_number' },
  { label: 'SSS', key: 'has_sss', value: 'sss_number' },

] as { label: string; key: keyof ResidentData, value: keyof ResidentData }[];

const votingRegistration = [
  { label: 'Voting Eligibility', key: 'voting_eligibility' },
  { label: 'Registered Voter', key: 'registered_voter', value: 'registered_brgy' }
] as { label: string; key: keyof ResidentData, value?: keyof ResidentData }[];

const requiredFields: { key: keyof ResidentData; label: string }[] = [
  { key: 'last_name', label: 'Last Name' },
  { key: 'first_name', label: 'First Name' },
  { key: 'sex', label: 'Sex' },
  { key: 'date_of_birth', label: 'Date of Birth' },
  { key: 'sitio_id', label: 'Sitio' },
  { key: 'civil_status_id', label: 'Civil Status' },
];


export default function ResidentForm() {
  const [loading, setLoading] = useState(true);
  const [residentData, setResidentData] = useState<ResidentData>({id: ''});
  const [showDatePicker, setShowDatePicker] = useState<keyof ResidentData | null>(null);
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [famHeads, setFamHeads] = useState<FamHeadProps[]>([]);
  const [barangays, setBarangays] = useState<Barangays[]>([]);
  const [isEligable, setIsEligible] = useState(false);

  const [defaultBrgyId, setDefaultBrgyId] = useState(0);

  useEffect(() => {
    handleAssigning();

    const brgyId = async () => {
      const id = await AsyncStorage.getItem('barangay_id');
      setDefaultBrgyId(Number(id))
    }

    brgyId();
  }, []);

  useEffect(() => {
    const isEligibleVoter = (dob?: Date) => {
      if(!dob) return;
      const today = new Date();

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      if(age >= 15) {
        setIsEligible(true);
      }else {
        setIsEligible(false)
      }
    };

    isEligibleVoter(residentData.date_of_birth ? new Date(residentData.date_of_birth) : undefined)
  }, [residentData.date_of_birth])

  const handleAssigning = async () => {
    try {
      await initDatabase();
  
      const optionsData: any = await db.getAllAsync(`SELECT * FROM options`);
      const heads: any = await db.getAllAsync(`SELECT * FROM heads`);
      const brgyData: any = await db.getAllAsync(`SELECT * FROM barangays`);
      
      setOptions(optionsData);
      setFamHeads(heads);
      setBarangays(brgyData);
      
    } catch(error) {
      console.log(error);
    }finally {
      setTimeout(() => {
        setLoading(false)
      }, 600);
    }
  }

  const handleAddEducation = () => [
    setResidentData(prev => {
      if(!prev) return { school: [{} as EducationProps] } as ResidentData;

      return {
        ...prev,
        school: prev.school ? [...prev.school, {} as EducationProps]: [{} as EducationProps]
      }
    })
  ]

  const handleOnChange = <K extends keyof ResidentData> (
    k: K,
    value: ResidentData[K]
  ) => {
    setResidentData(prev => ({
      ...prev, [k]: value
    }))
  }

  const removeSchoolEntry = (index: number) => {
    setResidentData(prev => {
      if (!prev || !prev.school) return prev;

      const updatedSchools = prev.school.filter((_, i) => i !== index);

      return {
        ...prev,
        school: updatedSchools
      };
    });
  };

  const handleSchoolChange = <K extends keyof EducationProps>(
    index: number,
    key: K,
    value: EducationProps[K]
  ) => {
    setResidentData((prev) => {
      if (!prev) return prev;

      const schools = prev.school ? [...prev.school] : [];

      if (!schools[index]) schools[index] = {} as EducationProps;

      schools[index] = { ...schools[index], [key]: value };

      return { ...prev, school: schools };
    });
  };

  const handleSubmit = async () => {
    function validateResident(data: ResidentData) {
      for (const field of requiredFields) {
        const value = data[field.key];
        if (
          value === undefined ||
          value === null ||
          value === '' ||
          (typeof value === 'number' && value === 0)
        ) {
          Alert.alert('Validation Error', `${field.label} is required`);
          return false;
        }
      }

      if (data.registered_voter && (!data.registered_brgy || data.registered_brgy === '')) {
        Alert.alert('Validation Error', 'Registered Barangay is required for Registered Voter');
        return false;
      }

      if (data.lgbt && (!data.lgbtq_id || data.lgbtq_id === 0)) {
        Alert.alert('Validation Error', 'Please select an option for LGBTQ+');
        return false;
      }

      if (data.pwd && (!data.pwd_types_id || data.pwd_types_id === 0)) {
        Alert.alert('Validation Error', 'Please select PWD type');
        return false;
      }

      if (data.ethnicity && (!data.ethnicity_id || data.ethnicity_id === 0)) {
        Alert.alert('Validation Error', 'Please select an Ethnicity option');
        return false;
      }

      return true;
    }

    try {
      if (!residentData) return;

      const isValid = validateResident(residentData);
      if (!isValid) return;

      const payload: ResidentData = {
        ...residentData,
        school: residentData.school || []
      };

      addResident(payload);
    } catch (error) {
      console.error('Failed to add resident:', error);
      Alert.alert('Error', 'Failed to add resident. Please try again.');
    } finally {
      setResidentData({ id: '' });
    }
  };
  

  return (
    <View style={{ paddingBottom: 50, flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#306060', width, height: 90, paddingTop: 35, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} >
            <Ionicons name={'arrow-back'} color={'#fff'} size={25} />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500' }}>Add resident</Text>
      </View>
      {loading == true ? (
        <View style={{ height, alignItems: 'center', paddingTop: 250 }}>
          <ActivityIndicator size={'large'} color={'#306060'} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView style={{ padding: 16 }}>
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Basic Information</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Basic details about the resident</Text>
              </View>
              <View style={{ padding: 10 }}>
                {(['last_name', 'first_name', 'middle_name'] as (keyof ResidentData)[]).map(field => (
                  <View key={field} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</Text>
                    <TextInput
                      value={residentData?.[field] as string}
                      onChangeText={(text) => handleOnChange(field, text)}
                      style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                    />
                  </View>
                ))}

                {/* Row: Suffix & Civil Status */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ width: '48%' }}>
                    <Text style={{ fontSize: 12 }}>Suffix</Text>
                    <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 50, justifyContent: 'center' }}>
                      <Picker
                        mode="dropdown"
                        selectedValue={residentData?.suffix_id ?? null}
                        onValueChange={(val) => handleOnChange('suffix_id', Number(val))}
                      >
                        <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                        {options.filter(opt => opt.category == 'suffix').map(s => (
                          <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={{ width: '48%' }}>
                    <Text style={{ fontSize: 12 }}>Sex</Text>
                    <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 50, justifyContent: 'center' }}>
                      <Picker
                        mode="dropdown"
                        selectedValue={residentData?.sex}
                        onValueChange={(val) => handleOnChange('sex', val)}
                      >
                        <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                        {sexes.map(s => (
                          <Picker.Item key={s.id} label={s.name} value={s.name} style={{ fontSize: 13 }} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* civil status */}
                <View style={{ width: '100%', marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>Civil Status</Text>
                  <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 50, justifyContent: 'center' }}>
                    <Picker
                      mode="dropdown"
                      selectedValue={residentData?.civil_status_id ?? null}
                      onValueChange={(val) => handleOnChange('civil_status_id', Number(val))}
                    >
                      <Picker.Item label="Select Option" style={{ fontSize: 14 }} value={null} color="#999" />
                      {options.filter(d => d.category == 'civil_status').map(s => (
                        <Picker.Item key={s.id} label={s.name} value={s.id} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/*  Sitio */}
                <View style={{ width: '100%', marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>Sitio</Text>
                  <Dropdown
                    style={{
                      borderWidth: 1,
                      borderColor: '#C6C6C6',
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 13,
                    }}
                    data={options.filter(d => d.category === 'sitio')
                      .map(s => ({ label: s.name, value: s.id }))
                    }
                    search
                    searchPlaceholder="Type to search..."
                    labelField="label"
                    valueField="value"
                    placeholder="Select Sitio"
                    value={residentData?.sitio_id}
                    onChange={item => handleOnChange('sitio_id', item.value)}
                  />
                </View>

                {/* Date of Birth */}
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>Date of Birth</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker('date_of_birth')}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderWidth: 1,
                      borderColor: '#C6C6C6',
                      borderRadius: 8,
                    }}
                  >
                    <Text>{residentData?.date_of_birth ?? 'Select date'}</Text>
                    <Ionicons name="calendar" size={20} color="#989898" />
                  </TouchableOpacity>
                  {showDatePicker == 'date_of_birth' && (
                    <DateTimePicker
                      value={residentData?.date_of_birth ? new Date(residentData.date_of_birth) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(_, date) => {
                        if (date) handleOnChange('date_of_birth', String(date.toISOString().split('T')[0]));
                        setShowDatePicker(null);
                      }}
                    />
                  )}
                </View>

                {/* Place of Birth, Occupation, Citizenship */}
                {(['place_of_birth', 'occupation', 'citizenship'] as (keyof ResidentData)[]).map(field => (
                  <View key={field} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</Text>
                    <TextInput
                      value={residentData?.[field] as string}
                      onChangeText={(text) => handleOnChange(field, text)}
                      style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                    />
                  </View>
                ))}

                {/* Religion */}
                <View>
                  <Text style={{ fontSize: 12 }}>Religion</Text>
                  <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                    <Picker
                      mode="dropdown"
                      selectedValue={residentData?.religion_id}
                      onValueChange={(val) => handleOnChange('religion_id', val)}
                    >
                      {options.filter(d => d.category == 'religion').map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
                    </Picker>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Contact Information</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Contact details of the resident</Text>
              </View>

              <View style={{ padding: 10 }}>
                {(['contact_number', 'email', 'emergency_contact_person', 'emergency_contact_number'] as (keyof ResidentData)[]).map(field => (
                  <View key={field} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</Text>
                    <TextInput
                      value={residentData?.[field] as string}
                      onChangeText={(text) => handleOnChange(field, text)}
                      style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                    />
                  </View>
                ))}

                {/* Relationship Contact */}
                <Text style={{ fontSize: 12 }}>Relationship to Contact Person</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, height: 50, justifyContent: 'center' }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={residentData?.relationship_contact_id}
                    onValueChange={(val) => handleOnChange('relationship_contact_id', val)}
                  >
                    <Picker.Item label="Select Option" style={{ fontSize: 14 }} value={null} color="#999" />
                    {options.filter(d => d.category == 'relationship_contact').map(r => 
                    <Picker.Item key={r.id} label={r.name} value={r.id} />)}
                  </Picker>
                </View>
              </View>
            </View>
            
            {/* Special Status */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Special Status</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Special status attributes of the resident</Text>
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', padding: 10, justifyContent: 'space-between' }}>
                {specialStatus.map(({ label, key }, index) => (
                  <View key={index} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                    <Switch
                      value={!!residentData?.[key]}
                      onValueChange={(val) => handleOnChange(key, val)}
                    />
                    <Text style={{ flex: 1, fontSize: 12 }}>{label}</Text>
                  </View>
                ))}

                <View style={{ width: '48%', marginBottom: 12, }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <Switch
                      value={!!residentData?.lgbt}
                      onValueChange={(val) => handleOnChange('lgbt', val)}
                    />
                    <Text style={{ flex: 1, fontSize: 12 }}>LGBTQ+</Text>
                  </View>
                  {residentData?.lgbt == true && (
                    <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 40, justifyContent: 'center' }}>
                      <Picker
                        mode="dropdown"
                        selectedValue={residentData?.lgbtq_id}
                        onValueChange={(val) => handleOnChange('lgbtq_id', val)}
                      >
                        <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                        {options.filter(d => d.category == 'lgbtq').map(s => (
                          <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>
                
                <View style={{ width: '48%', marginBottom: 12, }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <Switch
                      value={!!residentData?.pwd}
                      onValueChange={(val) => handleOnChange('pwd', val)}
                    />
                    <Text style={{ flex: 1, fontSize: 12 }}>PWD</Text>
                  </View>
                  {residentData?.pwd == true && (
                    <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 40, justifyContent: 'center' }}>
                      <Picker
                        mode="dropdown"
                        selectedValue={residentData?.pwd_types_id}
                        onValueChange={(val) => handleOnChange('pwd_types_id', val)}
                      >
                        <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                        {options.filter(d => d.category == 'pwd_type').map(s => (
                          <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>
                
                <View style={{ width: '48%', marginBottom: 12, }}>
                  <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                    <Switch
                      value={!!residentData?.ethnicity}
                      onValueChange={(val) => handleOnChange('ethnicity', val)}
                    />
                    <Text style={{ flex: 1, fontSize: 12 }}>Ethnicity</Text>
                  </View>
                  {residentData?.ethnicity == true && (
                    <Dropdown
                      style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 }}
                      data={options.filter(d => d.category === 'ethnicity')
                        .map(s => ({ label: s.name, value: s.id }))
                      }
                      search
                      searchPlaceholder="Type to search..."
                      labelField="label"
                      valueField="value"
                      placeholder="Select Option"
                      value={residentData?.ethnicity_id ?? null}
                      onChange={item => handleOnChange('ethnicity_id', item.value)}
                    />
                  )}
                </View>

              </View>
            </View>

            {/* Government IDs */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Government IDs</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Government identification details of the resident</Text>
              </View>
              
              <View style={{ flexDirection: 'column', padding: 10 }}>
                {governmentIds.map(({ label, key, value }, index) => (
                  <View key={index}  style={{ width: '100%', marginBottom: 12, }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
                      <Switch
                        value={!!residentData?.[key]}
                        onValueChange={(val) => handleOnChange(key, val)}
                      />
                      <Text style={{ flex: 1, fontSize: 12 }}>{label}</Text>
                    </View>
                    {residentData?.[key] == true && (
                      <TextInput
                        placeholder={`Enter ${label} Number`}
                        onChangeText={(text) => handleOnChange(value, text)}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Voting & Registration */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Voting & Registration</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Voting and registration details of the resident</Text>
              </View>

              <View style={{ flexDirection: 'column', padding: 10, justifyContent: 'space-between' }}>
                {votingRegistration.map(({ label, key, value }, index) => (
                  <View key={index} style={{ width: '100%', marginBottom: label != 'Voting Eligibility' ? 12 : 0 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Switch
                        disabled= {!isEligable}
                        value={label == 'Voting Eligibility' ? isEligable : !!residentData?.[key]}
                        onValueChange={(val) => handleOnChange(key, val)}
                      />
                      <Text style={{ flex: 1, fontSize: 12 }}>{label}</Text>
                    </View>
                    {label == 'Voting Eligibility' && (
                      <Text style={{ fontWeight: '400', fontSize: 12, marginTop: -10, marginBottom: 8, marginLeft: 47,color: '#8f8f8f' }}>
                        Automatically set to true when age is 15 or older
                      </Text>
                    )}
                    {label == 'Registered Voter' && residentData?.[key] == true && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                        <Dropdown
                          style={{
                            paddingHorizontal: 10,
                            width: '86%'
                          }}
                          data={barangays.map(s => ({ label: s.name, value: s.id }))
                          }
                          search
                          searchPlaceholder="Type to search barangay"
                          labelField="label"
                          valueField="value"
                          placeholder="Select Barangay"
                          value={residentData?.registered_brgy ?? defaultBrgyId}
                          onChange={item => handleOnChange('registered_brgy', item.value)}
                        />
                        <TouchableOpacity style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6' }}>
                          <Ionicons name={'add'} size={20} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Status & Migration */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Status & Migration</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Status and migration details of the resident</Text>
              </View>

              <View style={{ padding: 10, flexDirection: 'column' }}>
                {/* Status Picker */}
                <View style={{ width: '100%', marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>Status</Text>
                  <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, height: 50, justifyContent: 'center' }}>
                    <Picker
                      mode='dropdown'
                      selectedValue={residentData?.status_id}
                      onValueChange={(val) => handleOnChange('status_id', val)}
                    >
                      {options.filter(opt => opt.category == 'status').map((s) => (
                        <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Date of Death */}
                {residentData.status_id == options.filter(opt => opt.category == 'status').find(s => s.name == 'Deceased')?.id && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12 }}>Date of Death</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker('date_of_death')}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 12,
                        borderWidth: 1,
                        borderColor: '#C6C6C6',
                        borderRadius: 8,
                      }}
                    >
                      <Text>{residentData?.date_of_death ?? 'Select date'}</Text>
                      <Ionicons name="calendar" size={20} color="#989898" />
                    </TouchableOpacity>
                    {showDatePicker == 'date_of_death' && (
                      <DateTimePicker
                        value={residentData?.date_of_death ? new Date(residentData.date_of_death) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(_, date) => {
                          if (date) handleOnChange('date_of_death', String(date.toISOString().split('T')[0]));
                          setShowDatePicker(null);
                        }}
                      />
                    )}
                  </View>
                )}

                {/* Date of Migration */}
                {residentData.status_id == options.filter(opt => opt.category == 'status').find(s => s.name == 'Inactive')?.id && (
                  <View>
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12 }}>Date of Migration</Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker('date_of_migration')}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 10,
                          paddingVertical: 12,
                          borderWidth: 1,
                          borderColor: '#C6C6C6',
                          borderRadius: 8,
                        }}
                      >
                        <Text>{residentData?.date_of_migration ?? 'Select date'}</Text>
                        <Ionicons name="calendar" size={20} color="#989898" />
                      </TouchableOpacity>
                      {showDatePicker == 'date_of_migration' && (
                        <DateTimePicker
                          value={residentData?.date_of_migration ? new Date(residentData.date_of_migration) : new Date()}
                          mode="date"
                          display="default"
                          onChange={(_, date) => {
                            if (date) handleOnChange('date_of_migration', String(date.toISOString().split('T')[0]));
                            setShowDatePicker(null);
                          }}
                        />
                      )}
                    </View>

                    {/* Place to Migrate */}
                    <View style={{ width: '100%', marginBottom: 10 }}>
                      <Text style={{ fontSize: 12 }}>Migrated To</Text>
                      <TextInput
                        value={residentData?.place_to_migrate}
                        onChangeText={(text) => handleOnChange('place_to_migrate', text)}
                        placeholder="Enter place"
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Education Section */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Education</Text>
              </View>
                
              {residentData?.school?.map((s: any, index) => (
                <View key={index}>
                  {index != 0 && (
                    <TouchableOpacity onPress={() => removeSchoolEntry(index)} style={{ alignSelf: 'flex-end', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Ionicons name={'close'} color={'#F54927'} size={20} />
                      <Text style={{ color: '#F54927' }}>Remove</Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ padding: 10 }}>  
                    <Text style={{ fontSize: 12 }}>Educational Attainment/School</Text>
                  <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, marginBottom: 10, height: 50, justifyContent: 'center' }}>
                    <Picker
                      mode='dropdown'
                      selectedValue={s.educational_attainment_school_id  ?? null}
                      onValueChange={(val) => handleSchoolChange(index, 'educational_attainment_school_id', Number(val))}
                    >
                      <Picker.Item label="Select attainment" value="" style={{ color: '#888888' }} />
                      {options.filter(d => d.category.toLowerCase() == 'educational attainment/school').map((att) => (
                        <Picker.Item key={att.id} label={att.name} value={att.id} style={{ fontSize: 14 }} />
                      ))}
                    </Picker>
                  </View>

                  {/* School Name */}
                  <Text style={{ fontSize: 12 }}>School Attended</Text>
                  <TextInput
                    value={s?.school}
                    onChangeText={(text) => handleSchoolChange(index, 'school', text)}
                    placeholder="Enter school name"
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 4, marginBottom: 10 }}
                  />
                  {/* {residentData.school[index].educational_attainment_school_id} */}
                  {options.filter(opt => opt.category.toLowerCase() == 'Educational Attainment/School')
                  .find(opt => opt.name == 'Senior High School') == (residentData.school && residentData.school[index].educational_attainment_school_id) && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                      <Dropdown
                        style={{
                          paddingHorizontal: 10,
                          width: '86%'
                        }}
                        data={barangays.map(s => ({ label: s.name, value: s.id }))
                        }
                        search
                        searchPlaceholder="Type to search "
                        labelField="label"
                        valueField="value"
                        placeholder="Select Barangay"
                        value={residentData?.registered_brgy ?? defaultBrgyId}
                        onChange={item => handleOnChange('registered_brgy', item.value)}
                      />
                      <TouchableOpacity style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6' }}>
                        <Ionicons name={'add'} size={20} />
                      </TouchableOpacity>
                    </View>
                  )}
                    
                  {/* Year Graduated */}
                  <Text style={{ fontSize: 12 }}>Year Graduated</Text>
                  <TextInput
                    editable={!residentData.osy}
                    onChangeText={(text) => handleSchoolChange(index, 'year_graduated', text)}
                    placeholder="Enter year"
                    keyboardType="numeric"
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 4, marginBottom: 10 }}
                  />
                </View>
                </View>
              ))}

              {/* Out of School Youth */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Switch
                  value={residentData?.osy}
                  onValueChange={(val) => handleOnChange('osy', val)}
                />
                <Text style={{ flex: 1, fontSize: 12 }}>Out of School Youth (OSY)</Text>
              </View>
              {residentData.osy == true && (
                <View style={{ paddingHorizontal: 10 }}>
                  <Text style={{ fontSize: 12 }}>Year Level</Text>
                  <View style={{ borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, borderRadius: 4, marginBottom: 10, height: 'auto' }}>
                    <TextInput
                      placeholder="Enter level"
                      style={{ alignSelf: 'flex-start', width: '100%' }}
                    />
                  </View>
                  <Text style={{ fontSize: 12 }}>Reason</Text>
                  <View style={{ borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 12, borderRadius: 4, marginBottom: 10, height: 'auto' }}>
                    <TextInput
                      placeholder="Enter reason"
                      style={{ alignSelf: 'flex-start', width: '100%' }}
                    />
                  </View>
                </View>
              )}
            </View>

            <Pressable onPress={() => handleAddEducation()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10, backgroundColor: '#306060', alignSelf: 'center', marginBottom: 15, borderRadius: 8 }}>
              <Ionicons name={'add-circle-outline'} color={'#fff'} size={24} />
              <Text style={{ color: '#fff', fontWeight: 700 }}>Add Education</Text>
            </Pressable>

            {/* Head of the Family */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Select Head of Family</Text>
                <Text style={{ fontWeight: '400', fontSize: 11 }}>Select the head of family for this resident</Text>
              </View>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 12 }}>Select Head</Text>
                <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, justifyContent: 'center' }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={residentData?.family_id}
                    onValueChange={(val) => handleOnChange('family_id', val)}
                  >
                    <Picker.Item label="Select Head of Family" value="" style={{ fontSize: 14 }} />
                    {famHeads.map((member) => (
                      <Picker.Item
                        key={member.id}
                        label={`${member.first_name} ${member.last_name}`}
                        value={member.id}
                        style={{ fontSize: 14 }}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    // value={residentData?.osy}
                    // onValueChange={(val) => handleOnChange('osy', val)}
                  />
                  <Text style={{ flex: 1, fontSize: 12 }}>Set resident as Head</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => handleSubmit()} style={{ paddingVertical: 15, backgroundColor: '#306060', marginBottom: 20, borderRadius: 8 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 16 }}>Add Resident</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

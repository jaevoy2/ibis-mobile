import { addBrgys, addOption, addResident } from '@/utils/supaSync';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './sql/optionsDB';


const { width, height } = Dimensions.get('screen');

export type OptionProps = {
  id: string;
  name: string;
  category: string;
  created_at: string;
  updated_at: string;
  synced: number;
}

export type VaccinationRecord = {
  vaccination_type?: 'child' | 'adult' | null;
  vaccine_type_id?: number | null;
  vaccines_received?: string[];
  date_of_vaccination?: string;
  next_due_date?: string;
  remarks?: string;
}

type HouseholdProps = {
  id: number;
  house_number: string;
}

type FamHeadProps = {
  id: number;
  last_name: string;
  first_name: string;
  middle_name?: string;
}

export type Barangays = {
  id: string;
  name: string;
  code: string;
  municipality: string;
  province: string;
  region: string;
  created_at: string;
  updated_at: string;
  synced?: number;
}

export type EducationProps = {
  id: number;
  educational_attainment_school_id?: number;
  strand_id?: number
  degree_id?: number;
  school?: string;
  year_level?: string;
  year_graduated?: string;
  school_id?: number;
  synced: number;
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
    household_id?: number;
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
    vaccinations?: VaccinationRecord[];
    osy?: boolean;
    reason?: string;
    inactive_type?: number;
    vaccination_type?: 'child' | 'adult' | null;
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
  const [residentData, setResidentData] = useState<ResidentData>({
    id: '',
    vaccinations: [{}  as VaccinationRecord]
  });
  const [showDatePicker, setShowDatePicker] = useState<keyof ResidentData | null>(null);
  const [households, setHouseholds] = useState<HouseholdProps[]>([]);
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [famHeads, setFamHeads] = useState<FamHeadProps[]>([]);
  const [barangays, setBarangays] = useState<Barangays[]>([]);
  const [isEligable, setIsEligible] = useState(false);
  const [brgyModalView, setBrgyModalView] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [newBrgy, setNewBrgy] = useState<Omit<Barangays, 'id' | 'created_at' | 'updated_at' | 'synced'>>({
    name: '',
    code: '',
    municipality: '',
    province: '',
    region: '',
  });
  const [newOption, setNewOption] = useState<Omit<OptionProps, 'id' | 'created_at' | 'updated_at' | 'synced'>>({
    name: '',
    category: ''
  });

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
      const householdData: any = await db.getAllAsync(`SELECT * FROM households`);
      
      setHouseholds(householdData);
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
        school: residentData.school ?? []
      };

      addResident(payload);
    } catch (error) {
      console.error('Failed to add resident:', error);
      Alert.alert('Error', 'Failed to add resident. Please try again.');
    }
  };
  

  const handleNewBrgyChange = (key: keyof typeof newBrgy, value: string) => {
    setNewBrgy(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveBarangay = async () => {
    if(!newBrgy.code.trim() || !newBrgy.municipality.trim() || !newBrgy.name.trim() || !newBrgy.province.trim() || !newBrgy.region.trim()) {
      Alert.alert('Invalid', 'All fields are required. Please try again.');
      return;
    }

    const payload: Barangays = {
      ...newBrgy,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: 0,
    };

    addBrgys(payload);
    await handleAssigning();  
    setBrgyModalView(false)
  }

  const handleAddOptionChange = (key: keyof typeof newOption, value: string) => {
    setNewOption(prev => ({ ...prev, [key]: value }));
  }

  const handleSaveOption = async () => {
    if(!newOption.name.trim() || !newOption.category.trim()) {
      Alert.alert('Invalid', 'All fields are required. Please try again.');
      return;
    }

    const payload: OptionProps = {
      ...newOption,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      synced: 0,
    }

    addOption(payload);
    await handleAssigning();
    setOptionModal(false);
  }

  return (
    <View style={{ paddingBottom: 50, flex: 1 }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#F07E13', width, height: 90, paddingTop: 35, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} >
            <Ionicons name={'arrow-back'} color={'#fff'} size={25} />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500' }}>Add resident</Text>
      </View>
      {loading == true ? (
        <View style={{ height, alignItems: 'center', paddingTop: 250 }}>
          <ActivityIndicator size={'large'} color={'#F07E13'} />
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView style={{ padding: 16 }}>
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'person-outline'} color={'#F07E13'} size={22} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Basic Information</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Basic details about the resident</Text>
                </View>
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

                <View style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 12 }}>Blood Type</Text>
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
                      placeholder="Select Blood Type"
                      value={residentData?.registered_brgy ?? defaultBrgyId}
                      onChange={item => handleOnChange('registered_brgy', item.value)}
                    />
                    <TouchableOpacity onPress={() => setBrgyModalView(true)} style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6' }}>
                      <Ionicons name={'add'} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>


            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'call-outline'} size={22} color={'#F07E13'} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Contact Information</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Contact details of the resident</Text>
                </View>
              </View>

              <View style={{ padding: 10 }}>
                {(['contact_number', 'email', 'emergency_contact_person', 'emergency_contact_number'] as (keyof ResidentData)[]).map(field => (
                  <View key={field} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</Text>
                    <TextInput

                      autoCapitalize='none'
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
            
            
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'star-outline'} color={'#F07E13'} size={22} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Special Status</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Special status attributes of the resident</Text>
                </View>
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
              </View>
              <View style={{ width: '100%', marginBottom: 12, paddingHorizontal: 10 }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    value={!!residentData?.lgbt}
                    onValueChange={(val) => handleOnChange('lgbt', val)}
                  />
                  <Text style={{ flex: 1, fontSize: 12 }}>LGBTQ+</Text>
                </View>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 40, justifyContent: 'center' }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={residentData?.lgbtq_id}
                    onValueChange={(val) => handleOnChange('lgbtq_id', val)}
                  >
                    <Picker.Item label="Select LGBTQ Option" style={{ fontSize: 13 }} value={null} color="#999" />
                    {options.filter(d => d.category == 'lgbtq').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                    ))}
                  </Picker>
                </View>
                {/* {residentData?.lgbt == true && (
                )} */}
              </View>
              
              <View style={{ width: '100%', marginBottom: 12, paddingHorizontal: 10 }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    value={!!residentData?.pwd}
                    onValueChange={(val) => handleOnChange('pwd', val)}
                  />
                  <Text style={{ flex: 1, fontSize: 12 }}>PWD</Text>
                </View>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 40, justifyContent: 'center' }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={residentData?.pwd_types_id}
                    onValueChange={(val) => handleOnChange('pwd_types_id', val)}
                  >
                    <Picker.Item label="Select PWD Option" style={{ fontSize: 13 }} value={null} color="#999" />
                    {options.filter(d => d.category == 'pwd_type').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                    ))}
                  </Picker>
                </View>
                {/* {residentData?.pwd == true && (
                )} */}
              </View>
              
              <View style={{ width: '100%', paddingHorizontal: 10, marginBottom: 12, }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                  <Switch
                    value={!!residentData?.ethnicity}
                    onValueChange={(val) => handleOnChange('ethnicity', val)}
                  />
                  <Text style={{ flex: 1, fontSize: 12 }}>Ethnicity</Text>
                </View>
                <Dropdown
                  style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 }}
                  data={options.filter(d => d.category === 'ethnicity')
                    .map(s => ({ label: s.name, value: s.id }))
                  }
                  search
                  searchPlaceholder="Type to search..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Ethnicity Option"
                  placeholderStyle={{ color: '#b3b3b3', fontSize: 13 }}
                  value={residentData?.ethnicity_id ?? null}
                  onChange={item => handleOnChange('ethnicity_id', item.value)}
                />
                {/* {residentData?.ethnicity == true && (
                )} */}
              </View>
            </View>


            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'id-card-outline'} color={'#F07E13'} size={24} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Government IDs</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Government identification details of the resident</Text>
                </View>
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


            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'checkmark-circle-outline'} color={'#F07E13'} size={22} /> 
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Voting & Registration</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Voting and registration details of the resident</Text>
                </View>
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
                        <TouchableOpacity onPress={() => setBrgyModalView(true)} style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6' }}>
                          <Ionicons name={'add'} size={20} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
                {brgyModalView == true && (
                  <Modal visible={brgyModalView} animationType="fade" transparent>
                    <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
                      <View style={{ width: "90%", backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', gap: 5 }}>
                          <Ionicons name={'map'} size={20} color={'#F07E13'} />
                          <Text style={{ marginBottom: 15, fontSize: 18, fontWeight: 'bold', color: '#F07E13' }}>Add Barangay</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 12 }}>Name</Text>
                          <TextInput onChangeText={(text) => handleNewBrgyChange('name', text)} placeholder="Name" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 12 }}>Code</Text>
                          <TextInput onChangeText={(text) => handleNewBrgyChange('code', text)} placeholder="Code" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 12 }}>Municipality</Text>
                          <TextInput onChangeText={(text) => handleNewBrgyChange('municipality', text)} placeholder="Municipality" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 12 }}>Province</Text>
                          <TextInput onChangeText={(text) => handleNewBrgyChange('province', text)} placeholder="Province" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                        </View>
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 12 }}>Region</Text>
                          <TextInput onChangeText={(text) => handleNewBrgyChange('region', text)} placeholder="Region" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setBrgyModalView(false)} style={{ padding: 10 }}>
                              <Text style={{ color: '#919191' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSaveBarangay()} style={{ paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#F07E13' }}>
                                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                )}
            </View>


            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                  <Ionicons name={'flag-outline'} color={'#F07E13'} size={22} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Status & Migration</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Status and migration details of the resident</Text>
                </View>
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
                {residentData.status_id == options.filter(opt => opt.category == 'status').find(s => s.name == 'Migrated')?.id && (
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
                  </View>
                )}
                {/* Place to Migrate */}
                {residentData.status_id == options.filter(opt => opt.category == 'status').find(s => s.name == 'Migrated')?.id && (
                  <View style={{ width: '100%', marginBottom: 10 }}>
                    <Text style={{ fontSize: 12 }}>Migrated To</Text>
                    <TextInput
                      value={residentData?.place_to_migrate}
                      onChangeText={(text) => handleOnChange('place_to_migrate', text)}
                      placeholder="Enter place"
                      style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, height: 45 }}
                    />
                  </View>
                )}
              </View>
            </View>


            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'school-outline'} color={'#F07E13'} size={22} />
                <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Education</Text>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, marginBottom: 10, height: 50 }}>
                      <Picker
                        mode='dropdown'
                        selectedValue={s.educational_attainment_school_id ?? null}
                        onValueChange={(val) => handleSchoolChange(index, 'educational_attainment_school_id', Number(val))}
                        style={{ flex: 1 }}
                      >
                        <Picker.Item label="Select attainment" value="" style={{ color: '#888888', fontSize: 14 }} />
                        {options.filter(d => d.category.toLowerCase() == 'educational attainment/school').map((att) => (
                          <Picker.Item key={att.id} label={att.name} value={att.id} style={{ fontSize: 14 }} />
                        ))}
                      </Picker>
                      <TouchableOpacity
                        onPress={() => {
                          setNewOption({ name: '', category: 'educational attainment/school' });
                          setOptionModal(true);
                        }}
                        style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6', height: '100%', justifyContent: 'center' }}
                      >
                        <Ionicons name={'add'} size={20} />
                      </TouchableOpacity>
                    </View>

                  <Text style={{ fontSize: 12 }}>School Attended</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                    <Dropdown
                      style={{ paddingHorizontal: 10, width: '86%' }}
                      data={options.filter(opt => opt.category === 'school').map(s => ({ label: s.name, value: s.name }))}
                      search
                      searchPlaceholder="Type to search school..."
                      labelField="label"
                      valueField="value"
                      placeholder="Select School"
                      placeholderStyle={{ color: '#b3b3b3', fontSize: 13 }}
                      value={s?.school ?? null}
                      onChange={item => handleSchoolChange(index, 'school', item.value)}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        setNewOption({ name: '', category: 'school' });
                        setOptionModal(true);
                      }}
                      style={{ padding: 10, borderLeftWidth: 1, borderLeftColor: '#C6C6C6', height: 45, justifyContent: 'center' }}
                    >
                      <Ionicons name={'add'} size={20} />
                    </TouchableOpacity>
                  </View>

                    {options.filter(opt => opt.category.toLowerCase() == 'educational attainment/school')
                    .find(opt => opt.name == 'Senior High School')?.id == (residentData.school && residentData.school[index].educational_attainment_school_id) && (
                      <>
                        <Text style={{ fontSize: 12 }}>Strand</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                          <Dropdown
                            style={{
                              paddingHorizontal: 10,
                              width: '86%',
                            }}
                            data={options.filter(opt => opt.category == 'strand').map(s => ({ label: s.name, value: s.id }))
                            }
                            search
                            searchPlaceholder="Type to search strand"
                            labelField="label"
                            valueField="value"
                            placeholder="Select Strand"
                            value={residentData?.school && residentData?.school[index].strand_id}
                            onChange={item => handleSchoolChange(index, 'strand_id', item.value)}
                          />
                          <TouchableOpacity onPress={() => setOptionModal(true)} style={{ paddingHorizontal: 10, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#C6C6C6', height: 45 }}>
                            <Ionicons name={'add'} size={20} />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {options.filter(opt => opt.category.toLowerCase() == 'educational attainment/school')
                    .find(opt => opt.name.toLowerCase() == 'college' || opt.name.toLowerCase() == 'post graduate')?.id == (residentData.school && residentData.school[index].educational_attainment_school_id) && (
                      <>
                        <Text style={{ fontSize: 12 }}>Degree</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, width: '100%', marginBottom: 12 }}>
                          <Dropdown
                            style={{
                              paddingHorizontal: 10,
                              width: '86%',
                            }}
                            data={options.filter(opt => opt.category == 'degree').map(s => ({ label: s.name, value: s.id }))
                            }
                            search
                            searchPlaceholder="Type to search degree"
                            labelField="label"
                            valueField="value"
                            placeholder="Select Degree"
                            value={residentData?.school && residentData?.school[index].degree_id}
                            onChange={item => handleSchoolChange(index, 'degree_id', item.value)}
                          />
                          <TouchableOpacity onPress={() => setOptionModal(true)} style={{ paddingHorizontal: 10, justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#C6C6C6', height: 45 }}>
                            <Ionicons name={'add'} size={20} />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {optionModal == true && (
                      <Modal visible={optionModal} animationType="fade" transparent>
                        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" }}>
                          <View style={{ width: "90%", backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
                            <View style={{ flexDirection: 'row', alignContent: 'center', gap: 5, marginBottom: 15 }}>
                              <Ionicons name={'bookmark'} size={20} color={'#F07E13'} />
                              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F07E13' }}>
                                {options.filter(opt => opt.category.toLowerCase() == 'educational attainment/school')
                                .find(opt => opt.name == 'College')?.id == (residentData.school && residentData.school[index].educational_attainment_school_id)
                                  ? 'Add Degree' : 'Add Strand'
                                }
                              </Text>
                            </View>
                            <View style={{ marginBottom: 10 }}>
                              <Text style={{ fontSize: 12 }}>Name</Text>
                              <TextInput onChangeText={(text) => handleAddOptionChange('name', text)} placeholder="Name" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }} />
                            </View>
                            <View style={{ marginBottom: 10 }}>
                              <Text style={{ fontSize: 12 }}>Category</Text>
                              <TextInput editable={false} placeholder="Category" style={{ borderWidth: 1, borderColor: "#C6C6C6", borderRadius: 8, padding: 10 }}
                              value= {options.filter(opt => opt.category.toLowerCase() == 'educational attainment/school')
                                .find(opt => opt.name == 'College')?.id == (residentData.school && residentData.school[index].educational_attainment_school_id)
                                  ? 'degree' : 'strand'
                                } />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-end' }}>
                                <TouchableOpacity onPress={() => setOptionModal(false)} style={{ padding: 10 }}>
                                  <Text style={{ color: '#919191' }}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSaveOption()} style={{ paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: '#F07E13' }}>
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                                </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    )}
                      
                  {/* Year Graduated */}
                  {residentData.osy == false && (
                    <>
                      <Text style={{ fontSize: 12 }}>Year Graduated</Text>
                      <TextInput
                        onChangeText={(text) => handleSchoolChange(index, 'year_graduated', text)}
                        placeholder="Enter year"
                        keyboardType="numeric"
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 4, marginBottom: 10 }}
                      />
                    </>
                  )}
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
                      placeholder="Enter level (Optional)"
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

            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'heart-outline'} color={'#F07E13'} size={22} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Vaccination Records</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Vaccination records of the resident</Text>
                </View>
              </View>

              {residentData?.vaccinations?.map((record, index) => (
                <View key={index} style={{ padding: 10, borderBottomWidth: index !== (residentData.vaccinations!.length - 1) ? 1 : 0, borderBottomColor: '#C6C6C6' }}>
                  {index !== 0 && (
                    <TouchableOpacity
                      onPress={() => setResidentData(prev => ({
                        ...prev,
                        vaccinations: prev.vaccinations?.filter((_, i) => i !== index)
                      }))}
                      style={{ alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 }}
                    >
                      <Ionicons name={'close'} color={'#F54927'} size={20} />
                      <Text style={{ color: '#F54927' }}>Remove</Text>
                    </TouchableOpacity>
                  )}

                  {/* Vaccination Type */}
                  <Text style={{ fontSize: 12 }}>Vaccination Type</Text>
                  <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, height: 50, justifyContent: 'center', marginBottom: 12 }}>
                    <Picker
                      mode="dropdown"
                      selectedValue={record.vaccination_type ?? null}
                      onValueChange={(val) => setResidentData(prev => {
                        const updated = [...(prev.vaccinations ?? [])];
                        updated[index] = { ...updated[index], vaccination_type: val, vaccine_type_id: null, vaccines_received: [] };
                        return { ...prev, vaccinations: updated };
                      })}
                    >
                      <Picker.Item label="Select an Option" value={null} color="#999" style={{ fontSize: 14 }} />
                      <Picker.Item label="Child Vaccination" value="child" style={{ fontSize: 14 }} />
                      <Picker.Item label="Adult Vaccination" value="adult" style={{ fontSize: 14 }} />
                    </Picker>
                  </View>

                  {/* Adult: Vaccine Type dropdown */}
                  {record.vaccination_type === 'adult' && (
                    <>
                      <Text style={{ fontSize: 12 }}>Vaccine Type</Text>
                      <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, height: 50, justifyContent: 'center', marginBottom: 12 }}>
                        <Picker
                          mode="dropdown"
                          selectedValue={record.vaccine_type_id ?? null}
                          onValueChange={(val) => setResidentData(prev => {
                            const updated = [...(prev.vaccinations ?? [])];
                            updated[index] = { ...updated[index], vaccine_type_id: val };
                            return { ...prev, vaccinations: updated };
                          })}
                        >
                          <Picker.Item label="Select Vaccine Type" value={null} color="#999" style={{ fontSize: 14 }} />
                          {options.filter(opt => opt.category === 'Vaccine Type').map(opt => (
                            <Picker.Item key={opt.id} label={opt.name} value={opt.id} style={{ fontSize: 14 }} />
                          ))}
                        </Picker>
                      </View>
                    </>
                  )}

                  {/* Child: Vaccines Received checkboxes */}
                  {record.vaccination_type === 'child' && (
                    <>
                      <Text style={{ fontSize: 12, marginBottom: 8 }}>Vaccines Received</Text>
                      {options.filter(opt => opt.category === 'Child Vaccine').map(opt => {
                        const isChecked = record.vaccines_received?.includes(opt.id) ?? false;
                        return (
                          <TouchableOpacity
                            key={opt.id}
                            onPress={() => setResidentData(prev => {
                              const updated = [...(prev.vaccinations ?? [])];
                              const current = updated[index].vaccines_received ?? [];
                              updated[index] = {
                                ...updated[index],
                                vaccines_received: isChecked
                                  ? current.filter(id => id !== opt.id)
                                  : [...current, opt.id]
                              };
                              return { ...prev, vaccinations: updated };
                            })}
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}
                          >
                            <View style={{
                              width: 20, height: 20, borderRadius: 4,
                              borderWidth: 1, borderColor: isChecked ? '#F07E13' : '#C6C6C6',
                              backgroundColor: isChecked ? '#F07E13' : '#fff',
                              alignItems: 'center', justifyContent: 'center'
                            }}>
                              {isChecked && <Ionicons name={'checkmark'} size={14} color={'#fff'} />}
                            </View>
                            <Text style={{ fontSize: 13 }}>{opt.name}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  )}

                  {/* Shared fields */}
                  {record.vaccination_type && (
                    <>
                      {/* Date of Vaccination */}
                      <Text style={{ fontSize: 12 }}>Date of Vaccination</Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(`vaccination_date_${index}` as any)}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, marginBottom: 12 }}
                      >
                        <Text style={{ color: record.date_of_vaccination ? '#000' : '#b3b3b3' }}>
                          {record.date_of_vaccination ?? 'Select date'}
                        </Text>
                        <Ionicons name="calendar" size={20} color="#989898" />
                      </TouchableOpacity>
                      {showDatePicker === `vaccination_date_${index}` && (
                        <DateTimePicker
                          value={record.date_of_vaccination ? new Date(record.date_of_vaccination) : new Date()}
                          mode="date"
                          display="default"
                          onChange={(_, date) => {
                            if (date) setResidentData(prev => {
                              const updated = [...(prev.vaccinations ?? [])];
                              updated[index] = { ...updated[index], date_of_vaccination: date.toISOString().split('T')[0] };
                              return { ...prev, vaccinations: updated };
                            });
                            setShowDatePicker(null);
                          }}
                        />
                      )}

                      {/* Next Due Date */}
                      <Text style={{ fontSize: 12 }}>Next Due Date</Text>
                      <TouchableOpacity
                        onPress={() => setShowDatePicker(`vaccination_next_${index}` as any)}
                        style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8, marginBottom: 12 }}
                      >
                        <Text style={{ color: record.next_due_date ? '#000' : '#b3b3b3' }}>
                          {record.next_due_date ?? 'Select date'}
                        </Text>
                        <Ionicons name="calendar" size={20} color="#989898" />
                      </TouchableOpacity>
                      {showDatePicker === `vaccination_next_${index}` && (
                        <DateTimePicker
                          value={record.next_due_date ? new Date(record.next_due_date) : new Date()}
                          mode="date"
                          display="default"
                          onChange={(_, date) => {
                            if (date) setResidentData(prev => {
                              const updated = [...(prev.vaccinations ?? [])];
                              updated[index] = { ...updated[index], next_due_date: date.toISOString().split('T')[0] };
                              return { ...prev, vaccinations: updated };
                            });
                            setShowDatePicker(null);
                          }}
                        />
                      )}

                      {/* Remarks */}
                      <Text style={{ fontSize: 12 }}>Remarks / Note</Text>
                      <TextInput
                        value={record.remarks}
                        onChangeText={(text) => setResidentData(prev => {
                          const updated = [...(prev.vaccinations ?? [])];
                          updated[index] = { ...updated[index], remarks: text };
                          return { ...prev, vaccinations: updated };
                        })}
                        placeholder="Enter remarks or notes"
                        multiline
                        numberOfLines={3}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, marginBottom: 10, textAlignVertical: 'top' }}
                      />
                    </>
                  )}
                </View>
              ))}

              <Pressable
                onPress={() => setResidentData(prev => ({
                  ...prev,
                  vaccinations: [...(prev.vaccinations ?? []), {} as VaccinationRecord]
                }))}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10, backgroundColor: '#F07E13', alignSelf: 'center', marginBottom: 10, borderRadius: 8 }}
              >
                <Ionicons name={'add-circle-outline'} color={'#fff'} size={24} />
                <Text style={{ color: '#fff', fontWeight: '700' }}>Add Vaccination Record</Text>
              </Pressable>
            </View>
            


            <Pressable onPress={() => handleAddEducation()} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, padding: 10, backgroundColor: '#F07E13', alignSelf: 'center', marginBottom: 15, borderRadius: 8 }}>
              <Ionicons name={'add-circle-outline'} color={'#fff'} size={24} />
              <Text style={{ color: '#fff', fontWeight: 700 }}>Add Education</Text>
            </Pressable>

            {/* Head of the Family */}
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
                <Ionicons name={'people-outline'} color={'#F07E13'} size={22} />
                <View>
                  <Text style={{ fontWeight: '900', color: '#F07E13', fontSize: 16 }}>Household & Family</Text>
                  <Text style={{ fontWeight: '400', fontSize: 11 }}>Assign this resident to a household and family</Text>
                </View>
              </View>
              <View style={{ padding: 10 }}>

                {/* Household */}
                <Text style={{ fontSize: 12 }}>Household</Text>
                <Dropdown
                  style={{
                    borderWidth: 1,
                    borderColor: '#C6C6C6',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 13,
                    marginBottom: 12,
                  }}
                  data={households.map(h => ({
                    label: `House No. ${h.house_number || h.id}`,
                    value: h.id
                  }))}
                  search
                  searchPlaceholder="Type to search household..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Household"
                  placeholderStyle={{ color: '#b3b3b3', fontSize: 13 }}
                  value={residentData?.household_id ?? null}
                  onChange={item => handleOnChange('household_id', item.value)}
                />

                {/* Make Head toggle */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Switch
                    value={residentData?.make_head_of_family}
                    onValueChange={(val) => handleOnChange('make_head_of_family', val)}
                  />
                  <Text style={{ flex: 1, fontSize: 12 }}>Set resident as Head of Family</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#8f8f8f', marginLeft: 47, marginTop: -15, marginBottom: 15 }}>
                  Enable to automatically create a new family with this resident as the head
                </Text>

                {/* Head of Family — hidden when make_head_of_family is true */}
                {!residentData?.make_head_of_family && (
                  <>
                    <Text style={{ fontSize: 12 }}>Head of Family</Text>
                    <Dropdown
                      style={{
                        borderWidth: 1,
                        borderColor: '#C6C6C6',
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 13,
                        marginBottom: 12,
                      }}
                      data={famHeads.map(member => ({
                        label: `${member.first_name} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name}`,
                        value: member.id
                      }))}
                      search
                      searchPlaceholder="Type to search family head..."
                      labelField="label"
                      valueField="value"
                      placeholder="Select Head of Family"
                      placeholderStyle={{ color: '#b3b3b3', fontSize: 13 }}
                      value={residentData?.family_id ?? null}
                      onChange={item => handleOnChange('family_id', item.value)}
                    />
                  </>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => handleSubmit()} style={{ paddingVertical: 15, backgroundColor: '#F07E13', marginBottom: 20, borderRadius: 8 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700', fontSize: 16 }}>Add Resident</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

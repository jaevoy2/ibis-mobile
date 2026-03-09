import { addResident } from '@/utils/supaSync';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


const { width, height } = Dimensions.get('screen');


export type ResidentData = {
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
    educational_attainment_school_id?: number;
    strand_id?: number
    degree_id?: number;
    school?: string;
    year_graduated?: string;
    osy?: boolean;
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
    family_id?: number
    has_hdmf?: boolean;
    status_id?: number;
    inactive_type?: number
    date_of_death?: string
    date_of_migration?: string
    place_to_migrate?: string
}


export const data = [
  // Suffix
  { id: 1, name: 'Jr.', category: 'suffix' },
  { id: 2, name: 'Sr.', category: 'suffix' },
  { id: 3, name: 'III', category: 'suffix' },

  // Civil Status
  { id: 4, name: 'Single', category: 'civil_status' },
  { id: 5, name: 'Married', category: 'civil_status' },
  { id: 6, name: 'Widowed', category: 'civil_status' },
  { id: 7, name: 'Separated', category: 'civil_status' },

  // Sitio
  { id: 8, name: 'Sitio Proper', category: 'sitio' },
  { id: 9, name: 'Sitio Riverside', category: 'sitio' },
  { id: 10, name: 'Sitio Hilltop', category: 'sitio' },
  { id: 11, name: 'Sitio Poblacion', category: 'sitio' },
  { id: 12, name: 'Sitio Coastal', category: 'sitio' },

  // Religion
  { id: 13, name: 'Roman Catholic', category: 'religion' },
  { id: 14, name: 'Iglesia ni Cristo', category: 'religion' },
  { id: 15, name: 'Born Again Christian', category: 'religion' },
  { id: 16, name: 'Muslim', category: 'religion' },

  // Blood Type
  { id: 17, name: 'A+', category: 'blood_type' },
  { id: 18, name: 'A-', category: 'blood_type' },
  { id: 19, name: 'B+', category: 'blood_type' },
  { id: 20, name: 'O+', category: 'blood_type' },
  { id: 21, name: 'AB+', category: 'blood_type' },

  // Relationship Contact
  { id: 22, name: 'Mother', category: 'relationship_contact' },
  { id: 23, name: 'Father', category: 'relationship_contact' },
  { id: 24, name: 'Sibling', category: 'relationship_contact' },
  { id: 25, name: 'Spouse', category: 'relationship_contact' },

  // Educational Attainment
  { id: 26, name: 'Elementary Graduate', category: 'educational_attainment_school' },
  { id: 27, name: 'High School Graduate', category: 'educational_attainment_school' },
  { id: 28, name: 'Senior High School', category: 'educational_attainment_school' },
  { id: 29, name: 'College Graduate', category: 'educational_attainment_school' },

  // Strands (SHS)
  { id: 30, name: 'STEM', category: 'strand' },
  { id: 31, name: 'ABM', category: 'strand' },
  { id: 32, name: 'HUMSS', category: 'strand' },
  { id: 33, name: 'TVL', category: 'strand' },

  // Degrees
  { id: 34, name: 'BS Information Technology', category: 'degree' },
  { id: 35, name: 'BS Hospitality Management', category: 'degree' },
  { id: 36, name: 'BS Criminology', category: 'degree' },

  // LGBTQ
  { id: 37, name: 'Gay', category: 'lgbtq' },
  { id: 38, name: 'Lesbian', category: 'lgbtq' },
  { id: 39, name: 'Straight', category: 'lgbtq' },

  // Status
  { id: 40, name: 'Active', category: 'status' },
  { id: 41, name: 'Inactive', category: 'status' },
  { id: 42, name: 'Deceased', category: 'status' },

  // PWD Type
  { id: 43, name: 'Physical Disability', category: 'pwd_type' },
  { id: 44, name: 'Hearing Impaired', category: 'pwd_type' },
  { id: 45, name: 'Visually Impaired', category: 'pwd_type' },

  // Ethnicity
  { id: 46, name: 'Tagalog', category: 'ethnicity' },
  { id: 47, name: 'Bisaya', category: 'ethnicity' },
  { id: 48, name: 'Ilocano', category: 'ethnicity' },

  // Family Type
  { id: 49, name: 'Nuclear', category: 'family_type' },
  { id: 50, name: 'Extended', category: 'family_type' },
  { id: 51, name: 'Single Parent', category: 'family_type' },

  // Income Level
  { id: 52, name: 'Low Income', category: 'income_level' },
  { id: 53, name: 'Middle Income', category: 'income_level' },
  { id: 54, name: 'High Income', category: 'income_level' },

  // House Type
  { id: 55, name: 'Concrete', category: 'house_type' },
  { id: 56, name: 'Wooden', category: 'house_type' },
  { id: 57, name: 'Mixed Materials', category: 'house_type' },

  // Ownership Type
  { id: 58, name: 'Owned', category: 'ownership_type' },
  { id: 59, name: 'Rented', category: 'ownership_type' },
  { id: 60, name: 'Borrowed', category: 'ownership_type' },

  // Toilet Type
  { id: 61, name: 'Water Closet', category: 'toilet_type' },
  { id: 62, name: 'Pit Latrine', category: 'toilet_type' },
  { id: 63, name: 'None', category: 'toilet_type' },

  // Source of Water
  { id: 64, name: 'Tap Water', category: 'source_of_water' },
  { id: 65, name: 'Well', category: 'source_of_water' },
  { id: 66, name: 'Rain Collection', category: 'source_of_water' },

  // Internet Type
  { id: 67, name: 'Fiber', category: 'internet_type' },
  { id: 68, name: 'WiFi', category: 'internet_type' },
  { id: 69, name: 'Mobile Data', category: 'internet_type' },

  // Types of Materials
  { id: 70, name: 'Concrete Block', category: 'types_of_materials' },
  { id: 71, name: 'Wood', category: 'types_of_materials' },
  { id: 72, name: 'Nipa', category: 'types_of_materials' },

  { id: 73, name: 'Select Option', category: 'default' }
];

const familyMembers = [
  { id: 1, first_name: 'Juan', middle_name: 'D.', last_name: 'Cruz' },
  { id: 2, first_name: 'Maria', middle_name: 'S.', last_name: 'Santos' },
  { id: 3, first_name: 'Pedro', middle_name: 'R.', last_name: 'Garcia' },
  { id: 4, first_name: 'Ana', middle_name: 'M.', last_name: 'Delos Reyes' },
  { id: 5, first_name: 'Jose', middle_name: 'L.', last_name: 'Lopez' },
  { id: 6, first_name: 'Ligaya', middle_name: 'P.', last_name: 'Velasco' },
  { id: 7, first_name: 'Ramon', middle_name: 'C.', last_name: 'Torres' },
  { id: 8, first_name: 'Rosalinda', middle_name: 'T.', last_name: 'Morales' },
  { id: 9, first_name: 'Vicente', middle_name: 'A.', last_name: 'Magsayo' },
  { id: 10, first_name: 'Lucia', middle_name: 'B.', last_name: 'Agustin' },
];

const sexes = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
];

const specialStatus = [
  { label: '4Ps Member', key: 'is_4ps_member' },
  { label: 'Senior', key: 'senior' },
  {  label: 'Indigent Senior', key: 'indigent_senior' },
  { label: 'Pensioner', key: 'pensioner' },
  { label: 'OFW', key: 'ofw' },
  { label: 'Indigenous People', key: 'indigenous_people' },
  { label: 'Solo Parent', key: 'solo_parent' }
] as { label: string; key: keyof ResidentData }[];

const governmentIds = [
  { label: 'HDMF', key: 'has_hdmf' },
  { label: 'GSIS', key: 'has_gsis' },
  {  label: 'PhilHealth', key: 'has_ph' },
  { label: 'SSS', key: 'has_sss' },

] as { label: string; key: keyof ResidentData }[];

const votingRegistration = [
  { label: 'Voting Eligibility', key: 'voting_eligibility' },
  { label: 'Registered Voter', key: 'registered_voter' }
] as { label: string; key: keyof ResidentData }[];


export default function ResidentForm() {
  const [residentData, setResidentData] = useState<ResidentData | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<keyof ResidentData | null>(null);

  const handleOnChange = (k: keyof ResidentData, value: string | number | boolean | undefined) => {
    setResidentData(prev => ({
      ...prev, [k]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      const payload: ResidentData = {
        ...residentData,
      };

      addResident(payload);
    }catch(error) {
      console.error('Failed to add resident:', error);
      alert('Failed to add resident. Please try again.');
    }
  };
  

  const capitalizeFirstLetter = (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };


  return (
    <View style={{ paddingBottom: 50, height }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#306060', width, height: 90, paddingTop: 35, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} >
            <Ionicons name={'arrow-back'} color={'#fff'} size={25} />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500' }}>Add resident</Text>
      </View>
      <ScrollView style={{ padding: 16 }}>
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: '900', color: '#306060', fontSize: 16 }}>Basic Information</Text>
            <Text style={{ fontWeight: '400', fontSize: 11 }}>Basic details about the resident</Text>
          </View>
          <View style={{ padding: 10 }}>
            {(['last_name', 'first_name', 'middle_name'] as (keyof ResidentData)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{capitalizeFirstLetter(field.replace(/_/g, ' '))}</Text>
                <TextInput
                  placeholder={`Enter ${capitalizeFirstLetter(field.replace(/_/g, ' '))}`}
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
                    selectedValue={residentData?.suffix_id}
                    onValueChange={(val) => handleOnChange('suffix_id', val)}
                  >
                    <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                    {data.filter(d => d.category == 'suffix').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Civil Status</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 8, height: 50, justifyContent: 'center' }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={residentData?.civil_status_id}
                    onValueChange={(val) => handleOnChange('civil_status_id', val)}
                  >
                    <Picker.Item label="Select Option" style={{ fontSize: 13 }} value={null} color="#999" />
                    {data.filter(d => d.category == 'civil_status').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Row: Sex & Sitio */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
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
                      <Picker.Item key={s.id} label={s.name} value={s.id} style={{ fontSize: 13 }} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Sitio</Text>
                <Dropdown
                  style={{
                    borderWidth: 1,
                    borderColor: '#C6C6C6',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                  }}
                  data={data
                    .filter(d => d.category === 'sitio')
                    .map(s => ({ label: s.name, value: s.id }))
                  }
                  search
                  searchPlaceholder="Type to search..."
                  labelField="label"
                  valueField="value"
                  placeholder="Select Sitio"
                  value={residentData?.sitio_id ?? null}
                  onChange={item => handleOnChange('sitio_id', item.value)}
                />
              </View>
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
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').toUpperCase()}</Text>
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
                  {data.filter(d => d.category == 'religion').map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            Contact Information
          </Text>
          <View style={{ padding: 10 }}>
            {(['contact_number', 'email', 'emergency_contact_person', 'emergency_contact_number'] as (keyof ResidentData)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').toUpperCase()}</Text>
                <TextInput
                  value={residentData?.[field] as string}
                  onChangeText={(text) => handleOnChange(field, text)}
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                />
              </View>
            ))}

            {/* Relationship Contact */}
            <Text style={{ fontSize: 12 }}>Relationship to Contact Person</Text>
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
              <Picker
                mode="dropdown"
                selectedValue={residentData?.relationship_contact_id}
                onValueChange={(val) => handleOnChange('relationship_contact_id', val)}
              >
                {data.filter(d => d.category == 'relationship_contact').map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Special Status */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <View style={{ padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: '700' }}>Special Status</Text>
            <Text style={{ fontWeight: '400', fontSize: 10 }}>Special status attributes of the resident</Text>
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
                    {data.filter(d => d.category == 'lgbtq').map(s => (
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
                    {data.filter(d => d.category == 'pwd_type').map(s => (
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
                  data={data
                    .filter(d => d.category === 'ethnicity')
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
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Government IDs</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' }}>
            {governmentIds.map(({ label, key }, index) => (
              <View key={index} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                <Switch
                  value={!!residentData?.[key]}
                  onValueChange={(val) => handleOnChange(key, val)}
                />
                <Text style={{ flex: 1, fontSize: 12 }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Voting & Registration */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Voting & Registration</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-between' }}>
            {votingRegistration.map(({ label, key }, index) => (
              <View key={index} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                <Switch
                  value={!!residentData?.[key]}
                  onValueChange={(val) => handleOnChange(key, val)}
                />
                <Text style={{ flex: 1, fontSize: 12 }}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status & Migration */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            Status & Migration
          </Text>
          <View style={{ padding: 10, flexDirection: 'column' }}>

            {/* Status Picker */}
            <View style={{ width: '100%', marginBottom: 12 }}>
              <Text style={{ fontSize: 12 }}>Status</Text>
              <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                <Picker
                  mode='dropdown'
                  selectedValue={residentData?.status_id}
                  onValueChange={(val) => handleOnChange('status_id', val)}
                >
                  {['Active', 'Inactive', 'Deceased'].map((s) => (
                    <Picker.Item key={s} label={s} value={s} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date of Death */}
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

            {/* Date of Migration */}
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
            <View style={{ width: '100%', marginBottom: 12 }}>
              <Text style={{ fontSize: 12 }}>Place to Migrate</Text>
              <TextInput
                value={residentData?.place_to_migrate}
                onChangeText={(text) => handleOnChange('place_to_migrate', text)}
                placeholder="Enter place"
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
              />
            </View>

          </View>
        </View>

        {/* Education Section */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 20 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            Education
          </Text>
          <View style={{ padding: 10 }}>
            
            {/* Educational Attainment Picker */}
            <Text style={{ fontSize: 12 }}>Educational Attainment / School</Text>
            <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10, marginBottom: 10 }}>
              <Picker
                mode='dropdown'
                selectedValue={residentData?.educational_attainment_school_id}
                onValueChange={(val) => handleOnChange('educational_attainment_school_id', val)}
              >
                <Picker.Item label="Select attainment" value="" />
                {data.filter(d => d.category == 'educational_attainment_school').map((att) => (
                  <Picker.Item key={att.id} label={att.name} value={att.id} />
                ))}
              </Picker>
            </View>

            {/* School Name */}
            <Text style={{ fontSize: 12 }}>School</Text>
            <TextInput
              value={residentData?.school}
              onChangeText={(text) => handleOnChange('school', text)}
              placeholder="Enter school name"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 4, marginBottom: 10 }}
            />

            {/* Year Graduated */}
            <Text style={{ fontSize: 12 }}>Year Graduated</Text>
            <TextInput
              value={residentData?.year_graduated}
              onChangeText={(text) => handleOnChange('year_graduated', text)}
              placeholder="Enter year"
              keyboardType="numeric"
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 4, marginBottom: 10 }}
            />

            {/* Out of School Youth */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Switch
                value={residentData?.osy}
                onValueChange={(val) => handleOnChange('osy', val)}
              />
              <Text style={{ flex: 1, fontSize: 12 }}>Out of School Youth (OSY)</Text>
            </View>
            
          </View>
        </View>

        {/* Head of the Family */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 12 }}>Head of the Family</Text>
          <View style={{ borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 10 }}>
            <Picker
              mode="dropdown"
              selectedValue={residentData?.family_id}
              onValueChange={(val) => handleOnChange('family_id', val)}
            >
              <Picker.Item label="Select Head of Family" value="" />
              {familyMembers.map((member) => (
                <Picker.Item
                  key={member.id}
                  label={`${member.last_name}, ${member.first_name} ${member.middle_name}`}
                  value={member.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity onPress={() => handleSubmit()} style={{ padding: 10, backgroundColor: '#306060', marginBottom: 20, borderRadius: 8 }}>
          <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '500', fontSize: 16 }}>Add Resident</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

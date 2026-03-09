import { addResident } from '@/utils/supaSync';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';


const { width, height } = Dimensions.get('screen');


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
];

const sexes = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' }
];

const specialStatus = [
  'LGBTQ+',
  '4Ps Member',
  'PWD',
  'Senior',
  'Indigent Senior',
  'Pensioner',
  'OFW',
  'Indigenous People',
  'Solo Parent',
  'Ethnicity'
];

const governmentIds = [
  'HDMF',
  'GSIS',
  'PhilHealth',
  'SSS'
];

const votingRegistration = [
  'Voting Eligibility',
  'Registered Voter'
];


export default function ResidentForm() {
const getInitialForm = () => ({
  last_name: '',
  first_name: '',
  middle_name: '',
  suffix_id: 1,
  civil_status_id: 1,
  sitio_id: 1,
  sex: '',
  date_of_birth: new Date(),
  place_of_birth: '',
  occupation: '',
  citizenship: '',
  religion_id: 1,
  voting_eligibility: false,
  registered_voter: false,
  registered_brgy: '',
  blood_type_id: 1,
  contact_number: '',
  email: '',
  emergency_contact_person: '',
  emergency_contact_number: '',
  relationship_contact_id: 1,
  educational_attainment_school_id: 1,
  strand_id: 1,
  degree_id: 1,
  school: '',
  osy: false,
  lgbtq_id: 1,
  is_4ps_member: false,
  pwd: false,
  pwd_types_id: 1,
  senior: false,
  indigent_senior: false,
  pensioner: false,
  ofw: false,
  indigenous_people: false,
  ethnicity_id: 1,
  ph_number: '',
  solo_parent: false,
  sss_number: '',
  gsis_number: '',
  hdmf_number: '',
  has_ph: false,
  has_sss: false,
  has_gsis: false,
  family_id: 0,
  has_hdmf: false,
  status_id: 1,
  inactive_type: false,
  date_of_death: new Date(),
  date_of_migration: new Date(),
  place_to_migrate: '',
});

  const [form, setForm] = useState(getInitialForm());

  const [showPicker, setShowPicker] = useState<null | keyof typeof form>(null);

  const handleChange = <K extends keyof typeof form>(name: K, value: typeof form[K]) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        date_of_birth: form.date_of_birth
          ? form.date_of_birth.toISOString().split('T')[0]
          : null,
        date_of_death: form.date_of_death
          ? form.date_of_death.toISOString().split('T')[0]
          : null,
        date_of_migration: form.date_of_migration
          ? form.date_of_migration.toISOString().split('T')[0]
          : null,
  
        deleted_at: null
      };
  
      addResident(payload);
      setForm(getInitialForm())
      alert('Resident added');
    }catch(error) {
      console.error('Failed to add resident:', error);
      alert('Failed to add resident. Please try again.');
    }
  };


  const [switchState, setSwitchState] = useState<Record<string, boolean>>({});

  // Generic handler
  const handleSwitchChange = (key: string, value: boolean) => {
    setSwitchState(prev => ({ ...prev, [key]: value }));
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
        {/* Personal Information */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>
            Personal Information
          </Text>
          <View style={{ padding: 10 }}>
            {(['last_name', 'first_name', 'middle_name'] as (keyof typeof form)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').toUpperCase()}</Text>
                <TextInput
                  value={form[field] as string}
                  onChangeText={(text) => handleChange(field, text)}
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                />
              </View>
            ))}

            {/* Row: Suffix & Civil Status */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Suffix</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={form.suffix_id}
                    onValueChange={(val) => handleChange('suffix_id', val)}
                  >
                    {data.filter(d => d.category == 'suffix').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Civil Status</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={form.civil_status_id}
                    onValueChange={(val) => handleChange('civil_status_id', val)}
                  >
                    {data.filter(d => d.category == 'civil_status').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Row: Sex & Sitio */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Sex</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={form.sex}
                    onValueChange={(val) => handleChange('sex', val)}
                  >
                    {sexes.map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Sitio</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                  <Picker
                    mode="dropdown"
                    selectedValue={form.sitio_id}
                    onValueChange={(val) => handleChange('sitio_id', val)}
                  >
                    {data.filter(d => d.category == 'sitio').map(s => (
                      <Picker.Item key={s.id} label={s.name} value={s.id} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Date of Birth */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12 }}>Date of Birth</Text>
              <TouchableOpacity
                onPress={() => setShowPicker('date_of_birth')}
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
                <Text>{form.date_of_birth ? (form.date_of_birth as Date).toDateString() : 'Select date'}</Text>
                <Ionicons name="calendar" size={20} color="#989898" />
              </TouchableOpacity>
              {showPicker === 'date_of_birth' && (
                <DateTimePicker
                  value={form.date_of_birth as Date || new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, date) => {
                    if (date) handleChange('date_of_birth', date);
                    setShowPicker(null);
                  }}
                />
              )}
            </View>

            {/* Place of Birth, Occupation, Citizenship */}
            {(['place_of_birth', 'occupation', 'citizenship'] as (keyof typeof form)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').toUpperCase()}</Text>
                <TextInput
                  value={form[field] as string}
                  onChangeText={(text) => handleChange(field, text)}
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
                  selectedValue={form.religion_id}
                  onValueChange={(val) => handleChange('religion_id', val)}
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
            {(['contact_number', 'email', 'emergency_contact_person', 'emergency_contact_number'] as (keyof typeof form)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g, ' ').toUpperCase()}</Text>
                <TextInput
                  value={form[field] as string}
                  onChangeText={(text) => handleChange(field, text)}
                  style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                />
              </View>
            ))}

            {/* Relationship Contact */}
            <Text style={{ fontSize: 12 }}>Relationship to Contact Person</Text>
            <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
              <Picker
                mode="dropdown"
                selectedValue={form.relationship_contact_id}
                onValueChange={(val) => handleChange('relationship_contact_id', val)}
              >
                {data.filter(d => d.category == 'relationship_contact').map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Special Status */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Special Status</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
            {specialStatus.map((item, index) => (
              <View key={index} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                <Switch
                  value={!!switchState[item]}
                  onValueChange={(val) => handleSwitchChange(item, val)}
                />
                <Text style={{ flex: 1, fontSize: 12 }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Government IDs */}
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Government IDs</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
            {governmentIds.map((item, index) => (
              <View key={index} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                <Switch
                  value={!!switchState[item]}
                  onValueChange={(val) => handleSwitchChange(item, val)}
                />
                <Text style={{ flex: 1, fontSize: 12 }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Voting & Registration */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: '700', marginBottom: 10 }}>Voting & Registration</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {votingRegistration.map((item, index) => (
              <View key={index} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingRight: 8 }}>
                <Text style={{ flex: 1, fontSize: 12 }}>{item}</Text>
                <Switch
                  value={!!switchState[item]}
                  onValueChange={(val) => handleSwitchChange(item, val)}
                />
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity onPress={() => handleSubmit()} style={{ padding: 10, backgroundColor: '#306060', marginBottom: 20, borderRadius: 8 }}>
          <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '500', fontSize: 16 }}>Add Resident</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

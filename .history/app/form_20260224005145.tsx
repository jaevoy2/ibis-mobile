import { addResident } from '@/utils/supaSync';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';


const { width, height } = Dimensions.get('screen');


// Placeholder reference arrays
const suffixes = [
  { id: 1, name: 'Jr' },
  { id: 2, name: 'Sr' }
];
const civilStatuses = [
  { id: 1, name: 'Single' },
  { id: 2, name: 'Married' }
];
const sitios = [
  { id: 1, name: 'Sitio 1' },
  { id: 2, name: 'Sitio 2' }
];

const sexes = [
  {id: 1, name: 'Male'},
  {id: 2, name: 'Female'}
]

const religions = [
  { id: 1, name: 'Roman Catholic' },
  { id: 2, name: 'Islam' },
  { id: 3, name: 'Iglesia ni Cristo' },
  { id: 4, name: 'Born Again Christian' },
  { id: 5, name: 'Seventh-day Adventist' },
  { id: 6, name: 'Jehovah’s Witness' },
  { id: 7, name: 'Baptist' },
  { id: 8, name: 'Methodist' },
  { id: 9, name: 'Latter-day Saints (Mormon)' },
  { id: 10, name: 'Other' }
]

const relationships = [
  { id: 1, name: 'Father' },
  { id: 2, name: 'Mother' },
  { id: 3, name: 'Spouse' },
  { id: 4, name: 'Brother' },
  { id: 5, name: 'Sister' },
  { id: 6, name: 'Son' },
  { id: 7, name: 'Daughter' },
  { id: 8, name: 'Grandparent' },
  { id: 9, name: 'Relative' },
  { id: 10, name: 'Guardian' },
  { id: 11, name: 'Friend' },
  { id: 12, name: 'Other' }
]

export default function ResidentForm() {
const getInitialForm = () => ({
  last_name: '',
  first_name: '',
  middle_name: '',
  suffix_id: 1,
  civil_status_id: 1,
  sitio_id: 1,
  sex: 'Male',
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



  return (
    <View style={{ paddingBottom: 50, height }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#306060', width, height: 90, paddingTop: 35, paddingHorizontal: 10 }}>
        <Pressable onPress={() => router.back()} >
            <Ionicons name={'arrow-back'} color={'#fff'} size={25} />
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500' }}>Add Resident</Text>
      </View>
      <ScrollView style={{ padding: 16 }}>

        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom: 15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Personal Information</Text>
          <View style={{ padding: 10 }}>
            {([ 'last_name','first_name','middle_name' ] as (keyof typeof form)[]).map(field => (
                <View key={field} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
                  <TextInput
                    value={form[field] as string}
                    onChangeText={(text) => handleChange(field, text)}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                  />
                </View>
            ))}
            <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={{  width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Suffix</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, width: '100%' }}>
                  <Picker
                    mode={'dropdown'}
                    selectedValue={form.suffix_id}
                    onValueChange={(val) => handleChange('suffix_id', val)}
                  >
                    {suffixes.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                  </Picker>
                </View>
              </View>
              <View style={{  width: '48%' }}>
                  <Text style={{ fontSize: 12 }}>Civil Status</Text>
                  <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10,  width: '100%'}}>  
                    <Picker
                      mode={'dropdown'}
                      selectedValue={form.civil_status_id}
                      onValueChange={(val) => handleChange('civil_status_id', val)}
                    >
                      {civilStatuses.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                    </Picker>
                  </View>
              </View>
            </View>
            <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Sex</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10,  width: '100%'}}>
                  <Picker
                    mode={'dropdown'}
                    selectedValue={form.sex}
                    onValueChange={(val) => handleChange('sex', val)}
                  >
                    {sexes.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                  </Picker>
                </View>
              </View>
              <View style={{ width: '48%' }}>
                <Text style={{ fontSize: 12 }}>Sitio</Text>
                <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10,  width: '100%'}}>
                  <Picker
                    mode={'dropdown'}
                    selectedValue={form.sitio_id}
                    onValueChange={(val) => handleChange('sitio_id', val)}
                  >
                    {sitios.map(s => <Picker.Item key={s.id} label={s.name} value={s.id} />)}
                  </Picker>
                </View>
              </View>
            </View>
            {(['date_of_birth' ] as (keyof typeof form)[]).map(field => (
              <View key={field} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 12 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
                <TouchableOpacity onPress={() => setShowPicker(field)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 12, borderWidth: 1, borderColor: '#C6C6C6', borderRadius: 8 }}>
                  <Text style={{ color: '#000', }}>{form[field] != '' ? (form[field] as Date).toDateString() : 'Select date'}</Text>
                  <Ionicons name={'calendar'} size={20} color={'#989898'} />
                </TouchableOpacity>
                {showPicker === field && (
                  <DateTimePicker
                    value={form[field] as Date || new Date()}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                      if (date) handleChange(field, date);
                      setShowPicker(null);
                    }}
                  />
                )}
              </View>
            ))}
            {([ 'place_of_birth', 'occupation','citizenship', ] as (keyof typeof form)[]).map(field => (
                <View key={field} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
                  <TextInput
                    value={form[field] as string}
                    onChangeText={(text) => handleChange(field, text)}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                  />
                </View>
            ))}
            <View>
              <Text style={{ fontSize: 12 }}>Religion</Text>
              <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                <Picker
                mode={'dropdown'}
                  selectedValue={form.religion_id}
                  onValueChange={(val) => handleChange('religion_id', val)}
                >
                  {religions.map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom:  15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Contact Information</Text>
          <View style={{ padding: 10 }}>
            {([ 'contact_number', 'email','emergency_contact_person','emergency_contact_number' ] as (keyof typeof form)[]).map(field => (
                <View key={field} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
                  <TextInput
                    value={form[field] as string}
                    onChangeText={(text) => handleChange(field, text)}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                  />
                </View>
            ))}
            <View>
              <Text style={{ fontSize: 12 }}>Relationship to Contact Person</Text>
              <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10 }}>
                <Picker
                mode={'dropdown'}
                  selectedValue={form.relationship_contact_id}
                  onValueChange={(val) => handleChange('relationship_contact_id', val)}
                >
                  {relationships.map(r => <Picker.Item key={r.id} label={r.name} value={r.id} />)}
                </Picker>
              </View>
            </View>
          </View>
        </View>
        <View style={{ borderColor: '#C6C6C6', borderWidth: 1, borderRadius: 10, marginBottom:  15 }}>
          <Text style={{ fontWeight: '700', padding: 10, borderBottomColor: '#C6C6C6', borderBottomWidth: 1 }}>Government Identification Numbers</Text>
          <View style={{ padding: 10 }}>
            {([ 'sss_number','gsis_number','hdmf_number', 'ph_number' ] as (keyof typeof form)[]).map(field => (
                <View key={field} style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 12 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
                  <TextInput
                    value={form[field] as string}
                    onChangeText={(text) => handleChange(field, text)}
                    style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4 }}
                  />
                </View>
            ))}
          </View>
        </View>

        {/* Pickers */}
        

        

        {/* Boolean switches */}
        {(['voting_eligibility','registered_voter','osy','is_4ps_member','pwd','senior','indigent_senior','pensioner','ofw','indigenous_people','solo_parent','has_ph','has_sss','has_gsis','has_hdmf'] as (keyof typeof form)[]).map(field => (
          <View key={field} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ flex: 1 }}>{field.replace(/_/g,' ').toUpperCase()}</Text>
            <Switch
              value={!!form[field]}
              onValueChange={(val) => handleChange(field, val ? 1 : 0)}
            />
          </View>
        ))}

        {/* Date fields */}
        {(['date_of_birth','date_of_death','date_of_migration'] as (keyof typeof form)[]).map(field => (
          <View key={field} style={{ marginBottom: 12 }}>
            <Text>{field.replace(/_/g,' ').toUpperCase()}</Text>
            <TouchableOpacity onPress={() => setShowPicker(field)} style={{ backgroundColor: '#ebebebff', paddingVertical: 8}}>
              <Text style={{ color: '#000', textAlign: 'center' }}>{form[field] != '' ? (form[field] as Date).toDateString() : 'Select date'}</Text>
            </TouchableOpacity>
            {showPicker === field && (
              <DateTimePicker
                value={form[field] as Date || new Date()}
                mode="date"
                display="default"
                onChange={(_, date) => {
                  if (date) handleChange(field, date);
                  setShowPicker(null);
                }}
              />
            )}
          </View>
        ))}

        {/* Submit button */}
        <TouchableOpacity onPress={() => handleSubmit()} style={{ padding: 10, backgroundColor: '#306060', marginBottom: 20, borderRadius: 8 }}>
          <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '500', fontSize: 16 }}>Add Resident</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

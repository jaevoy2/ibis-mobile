create table resident_school (
    id bigint generated always as identity primary key,
    brgy_resident_id uuid references brgys_residents(id) on delete cascade,
    educational_attainment_school_id bigint,
    strand_id bigint,
    degree_id bigint,
    school text,
    year_graduated text,
    created_at timestamp with time zone default now()
);
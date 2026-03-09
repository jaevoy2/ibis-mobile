create table resident_school (
    id uuid default gen_random_uuid() primary key,
    brgy_resident_id uuid references brgys_residents(id) on delete cascade,
    educational_attainment_school_id bigint NULL,
    strand_id bigint NULL,
    degree_id bigint NULL,
    school varchar NULL,
    year_level varchar NULL,
    year_graduated varchar NULL,
    created_at timestamp with time zone default now()
);
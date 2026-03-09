create table schools (
    id bigint generated always as identity primary key,
    resident_id bigint references residents(id) on delete cascade,
    educational_attainment_school_id bigint,
    strand_id bigint,
    degree_id bigint,
    school text,
    year_graduated text,
    osy boolean default false,
    created_at timestamp with time zone default now()
);
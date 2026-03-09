create table residents (
    id uuid default gen_random_uuid() primary key,
    last_name varchar not null,
    first_name varchar not null,
    middle_name varchar not null,
    sex varchar,

    suffix_id bigint NULL,
    civil_status_id bigint NULL,
    sitio_id bigint NULL,

    date_of_birth date NULL,
    place_of_birth varchar NULL,
    occupation varchar NULL,
    citizenship varchar NULL,

    religion_id bigint NULL,

    voting_eligibility boolean NULL,
    registered_voter boolean NULL,
    registered_brgy varchar NULL,

    blood_type_id bigint NULL,

    contact_number varchar NULL,
    email varchar NULL,
    family_id bigint

    emergency_contact_person varchar,
    emergency_contact_number varchar,
    relationship_contact_id bigint,

    educational_attainment_school_id bigint,
    strand_id bigint,
    degree_id bigint,
    school varchar,

    osy boolean,
    lgbtq_id bigint,
    is_4ps_member boolean,
    pwd boolean,
    pwd_types_id bigint,
    senior boolean,
    indigent_senior boolean,
    pensioner boolean,
    ofw boolean,
    indigenous_people boolean,

    ethnicity_id bigint,
    ph_number varchar,

    solo_parent boolean,
    sss_number varchar,
    gsis_number varchar,
    hdmf_number varchar,

    resident_photo varchar,
    death_certificate_photo varchar,

    has_ph boolean,
    has_sss boolean,
    has_gsis boolean,
    has_hdmf boolean,

    status_id bigint,

    inactive_type boolean default false,

    date_of_death date,
    date_of_migration date,
    place_to_migrate varchar,

    deleted_at timestamp null,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

alter
    publication supabase_realtime add table residents;

CREATE OR REPLACE FUNCTION handle_times()
    RETURNS TRIGGER AS
    $$
    BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.created_at = OLD.created_at;
        NEW.updated_at = now();
    ENDIF;
    RETURN NEW;
    END;
    $$ language plpgsql;

CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON residents;
    FOR EACH ROW;

EXECUTE PROCEDURE handle_times();


create index idx_residents_suffix_id on_residents(suffix_id);
create index idx_residents_civil_status_id on_residents(civil_status_id);
create index idx_residents_sitio_id on_residents(sitio_id);
create index idx_residents_status_id on_residents(status_id);


create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_update_residents_updated_at
before update on_residents
for each row
execute function update_updated_at_column();
create table residents (
    id uuid default gen_random_uuid() primary key,
    last_name varchar not null,
    first_name varchar not null,
    middle_name null,
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

    contact_number varchar NULL,
    email varchar NULL,

    family_id bigint NULL,
    make_head_of_family boolean NULL,

    emergency_contact_person varchar NULL,
    emergency_contact_number varchar NULL,
    relationship_contact_id bigint NULL,

    osy boolean NULL,
    reason text,

    lgbtq_id bigint NULL,
    is_4ps_member boolean NULL,
    pwd boolean NULL,
    pwd_types_id bigint NULL,
    senior boolean NULL,
    indigent_senior boolean NULL,
    pensioner boolean NULL,
    ofw boolean NULL,
    indigenous_people boolean NULL,

    ethnicity_id bigint NULL,
    ph_number varchar NULL,

    solo_parent boolean NULL,
    sss_number varchar NULL,
    gsis_number varchar NULL,
    hdmf_number varchar NULL,

    resident_photo varchar NULL,
    death_certificate_photo varchar NULL,

    has_ph boolean NULL,
    has_sss boolean NULL,
    has_gsis boolean NULL,
    has_hdmf boolean NULL,

    status_id bigint NULL,

    inactive_type int NULL,

    date_of_death date NULL,
    date_of_migration date NULL,
    place_to_migrate varchar NULL,

    deleted_at timestamp null,
    created_at timestamp default now(),
    updated_at timestamp default now(),

    synced boolean
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
    ELSEIF (TG_OP = 'UPDATE') THEN
        NEW.created_at := OLD.created_at;
        NEW.updated_at := now();
    END IF;
    RETURN NEW;
    END;
    $$ language plpgsql;

CREATE TRIGGER handle_times
    BEFORE INSERT OR UPDATE ON residents
    FOR EACH ROW
EXECUTE PROCEDURE handle_times();


create index idx_residents_suffix_id ON residents(suffix_id);
create index idx_residents_civil_status_id ON residents(civil_status_id);
create index idx_residents_sitio_id ON residents(sitio_id);
create index idx_residents_status_id ON residents(status_id);

CREATE TABLE educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resident_id UUID REFERENCES residents(id) ON DELETE CASCADE,

    educational_attainment_school_id BIGINT,
    strand_id BIGINT,
    degree_id BIGINT,

    school TEXT,
    year_level TEXT,
    year_graduated TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_educations_resident_id ON educations(resident_id);

ALTER PUBLICATION supabase_realtime ADD TABLE educations;

CREATE OR REPLACE FUNCTION handle_times()
RETURNS TRIGGER AS
$$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.created_at := now();
        NEW.updated_at := now();
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.created_at := OLD.created_at;
        NEW.updated_at := now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_times_educations
BEFORE INSERT OR UPDATE ON educations
FOR EACH ROW
EXECUTE PROCEDURE handle_times();
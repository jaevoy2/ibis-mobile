CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_options_category ON options(category);

ALTER PUBLICATION supabase_realtime ADD TABLE options;

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

-- 5️⃣ Trigger for this table
CREATE TRIGGER handle_times_options
BEFORE INSERT OR UPDATE ON options
FOR EACH ROW
EXECUTE PROCEDURE handle_times();
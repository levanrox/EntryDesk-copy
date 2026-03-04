-- Migration to add student registration IDs and entry chest numbers

-- 1. Student Registration IDs
CREATE SEQUENCE IF NOT EXISTS student_reg_seq;

ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS registration_no TEXT UNIQUE;

CREATE OR REPLACE FUNCTION generate_student_registration_no()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_val INTEGER;
BEGIN
    year_prefix := 'SK' || to_char(now(), 'YY');
    SELECT nextval('student_reg_seq') INTO next_val;
    NEW.registration_no := year_prefix || '-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_generate_student_registration_no ON public.students;
CREATE TRIGGER tr_generate_student_registration_no
BEFORE INSERT ON public.students
FOR EACH ROW
EXECUTE FUNCTION generate_student_registration_no();

-- 2. Entry Chest Numbers
ALTER TABLE public.entries
ADD COLUMN IF NOT EXISTS chest_no INTEGER;

CREATE OR REPLACE FUNCTION assign_chest_no_on_approval()
RETURNS TRIGGER AS $$
DECLARE
    next_chest_no INTEGER;
BEGIN
    -- Only assign chest_no if status is changing to 'approved' and chest_no is not already set
    IF (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') AND NEW.chest_no IS NULL) THEN
        SELECT COALESCE(MAX(chest_no), 0) + 1
        INTO next_chest_no
        FROM public.entries
        WHERE event_id = NEW.event_id;
        
        NEW.chest_no := next_chest_no;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_assign_chest_no_on_approval ON public.entries;
CREATE TRIGGER tr_assign_chest_no_on_approval
BEFORE UPDATE ON public.entries
FOR EACH ROW
EXECUTE FUNCTION assign_chest_no_on_approval();

-- 3. Update Organizer View to include the new columns
DROP VIEW IF EXISTS organizer_entries_view CASCADE;

CREATE OR REPLACE VIEW organizer_entries_view AS
SELECT 
    e.id AS entry_id, 
    e.event_id, 
    e.status, 
    e.participation_type, 
    e.created_at, 
    e.coach_id, 
    e.event_day_id, 
    e.category_id, 
    e.student_id,
    e.chest_no, -- Added chest_no

    -- Student info
    s.name AS student_name,
    s.rank AS student_rank,
    s.gender AS student_gender,
    s.weight AS student_weight,
    s.date_of_birth AS student_dob,
    s.registration_no AS student_registration_no, -- Added registration_no

    -- Dojo info
    d.name AS dojo_name,

    -- Category info
    c.name AS category_name,

    -- Day info
    ed.name AS event_day_name, 
    ed.date AS event_day_date,

    -- Coach info
    p.full_name AS coach_name, 
    p.email AS coach_email,

    -- Event Organizer ID for filtering
    ev.organizer_id
FROM
    entries e
    JOIN students s ON e.student_id = s.id
    LEFT JOIN dojos d ON s.dojo_id = d.id
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN event_days ed ON e.event_day_id = ed.id
    JOIN profiles p ON e.coach_id = p.id
    JOIN events ev on e.event_id = ev.id
WHERE
    ev.organizer_id = auth.uid ()
    AND EXISTS (
        SELECT 1
        FROM profiles
        WHERE
            id = auth.uid ()
            AND role IN ('organizer', 'admin')
    );

GRANT SELECT ON organizer_entries_view TO authenticated;

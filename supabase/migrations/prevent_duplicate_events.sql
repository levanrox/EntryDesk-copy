-- Prevent accidental duplicate event creation for the same organizer.
-- Treats case and NULL/empty location consistently.
CREATE UNIQUE INDEX IF NOT EXISTS events_dedupe_unique_idx ON events (
    organizer_id,
    lower(title),
    event_type,
    start_date,
    end_date,
    lower(coalesce(location, ''))
);
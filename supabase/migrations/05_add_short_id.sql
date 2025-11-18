ALTER TABLE lead_submissions
ADD COLUMN short_id TEXT;

ALTER TABLE projects
ADD COLUMN short_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS lead_submissions_short_id_unique ON lead_submissions (short_id) WHERE short_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS projects_short_id_unique ON projects (short_id) WHERE short_id IS NOT NULL;

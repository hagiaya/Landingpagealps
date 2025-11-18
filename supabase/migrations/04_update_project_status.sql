-- Drop the old projects_status_check constraint if it exists
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'projects_status_check') THEN
    ALTER TABLE projects DROP CONSTRAINT projects_status_check;
  END IF;
END;
$$;

-- Update existing projects data to match new statuses
UPDATE projects SET status = 'Diskusi' WHERE status = 'pending';
UPDATE projects SET status = 'Development' WHERE status = 'in_progress';
UPDATE projects SET status = 'Selesai' WHERE status = 'completed';

-- Add the new projects_status_check constraint with the updated status values
ALTER TABLE projects ADD CONSTRAINT projects_status_check CHECK (status IN ('Diskusi', 'Desain', 'Development', 'Test', 'Selesai'));

-- Drop the old project_milestones_status_check constraint if it exists
DO $$
BEGIN
  IF EXISTS(SELECT 1 FROM pg_constraint WHERE conname = 'project_milestones_status_check') THEN
    ALTER TABLE project_milestones DROP CONSTRAINT project_milestones_status_check;
  END IF;
END;
$$;

-- Update existing project_milestones data to match new statuses
-- Assuming milestones status also needs to be updated from old values to new.
-- If a milestone was 'pending', it becomes 'Diskusi'.
-- If a milestone was 'in_progress', it becomes 'Development'.
-- If a milestone was 'completed', it becomes 'Selesai'.
UPDATE project_milestones SET status = 'Diskusi' WHERE status = 'pending';
UPDATE project_milestones SET status = 'Development' WHERE status = 'in_progress';
UPDATE project_milestones SET status = 'Selesai' WHERE status = 'completed';

-- Add the new project_milestones_status_check constraint
ALTER TABLE project_milestones ADD CONSTRAINT project_milestones_status_check CHECK (status IN ('Diskusi', 'Desain', 'Development', 'Test', 'Selesai'));

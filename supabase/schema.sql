-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  service_type TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'No-show')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for booking form)
CREATE POLICY "Allow public insert" ON appointments
  FOR INSERT TO anon WITH CHECK (true);

-- Allow public read (for Desk via backend — backend uses service_role key)
CREATE POLICY "Allow public read" ON appointments
  FOR SELECT TO anon USING (true);

-- Allow public update (status changes via backend)
CREATE POLICY "Allow public update" ON appointments
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Allow public delete (via backend)
CREATE POLICY "Allow public delete" ON appointments
  FOR DELETE TO anon USING (true);

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cxqylswachcjtceunnap.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cXlsc3dhY2hjanRjZXVubmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTgxNDIsImV4cCI6MjA3OTUzNDE0Mn0.Ttf94vmvBOQQoxK2Moib8ffI_8ihLvR2ux5TTGSuv-I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
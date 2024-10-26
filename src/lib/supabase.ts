import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lehxusgbnqdphrdlagtj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaHh1c2dibnFkcGhyZGxhZ3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NzE3MjgsImV4cCI6MjA0NTU0NzcyOH0.8BIGeAFqMr8O-KfPM3zMdJWHeKO2Wmxt6UEca0KENEo';

export const supabase = createClient(supabaseUrl, supabaseKey);
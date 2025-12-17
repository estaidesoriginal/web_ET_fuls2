import { createClient } from '@supabase/supabase-js';

let client;

export function getSupabase() {
  if (!client) {
    
    const url = process.env.REACT_APP_SUPABASE_URL;
    const anon = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    if (!url || !anon) {
      console.warn('Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY en .env');
      
      client = createClient(
        'https://kqeftmzvzvghgysuttfn.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZWZ0bXp2enZnaGd5c3V0dGZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NzAzOTEsImV4cCI6MjA3NzM0NjM5MX0._d2I3ldPJjCBs8p2uZottAmRXn0SIfU0kRu6tCk5fFc'
      );
    } else {
      client = createClient(url, anon);
    }
  }
  return client;
}
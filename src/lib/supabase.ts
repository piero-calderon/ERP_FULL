// Cliente Supabase - GEA SERVICES ERP
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zrfbnyopbkgvddmolvco.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZmJueW9wYmtndmRkbW9sdmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNjQ2NDEsImV4cCI6MjA5NDY0MDY0MX0.JWSpZUqnIfpxaW7bz-GD7nLPL7tk-bTZ0UNPy9wTfMg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

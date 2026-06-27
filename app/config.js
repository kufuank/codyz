// Codyz MVP — Supabase istemci yapılandırması
// NOT: publishable (anon) anahtar tarayıcıda güvenlidir; veriyi RLS korur.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://vbkjkpkogccspccecase.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_PwGfmvY9t9QXSPR5bZKBVA_9Gs1QJ5x';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// Oturum yoksa auth ekranına gönder
export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { location.replace('./index.html'); return null; }
  return session;
}

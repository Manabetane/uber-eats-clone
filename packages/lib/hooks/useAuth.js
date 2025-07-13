import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const useAuth = () => {
  const user = supabase.auth.user();

  const login = async (email, password) => {
    const { user, session } = await supabase.auth.signIn({ email, password });
    return user;
  };

  const signup = async (email, password) => {
    const { user, session } = await supabase.auth.signUp({ email, password });
    return user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, login, signup, logout };
};

export default useAuth;
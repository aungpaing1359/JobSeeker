import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RedirectIfAuthenticated() {
  const { user, loading } = useAuth();

  // 1. Loading ပြီးဆုံးသည်အထိ စောင့်ဆိုင်းခြင်း
//   if (loading) {
//     // ယာယီ Loading Message ပြသခြင်း
//     return <div>Loading user status...</div>; 
//   }

  // 2. User log in ဝင်ပြီးသားလား စစ်ဆေးခြင်း
  if (user) {
    // Log In ဝင်ပြီးသားဆိုရင် Home page ကို Redirect လုပ်ပါ
    // 
    return <Navigate to="/" replace />; 
  }

  // 3. Log In မဝင်ရသေးဘူးဆိုရင် Child Routes (Sign In) ကို ဆက်လက်သွားခွင့်ပြုပါ
  return <Outlet />;
}
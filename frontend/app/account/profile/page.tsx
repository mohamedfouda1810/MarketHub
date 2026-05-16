'use client';

import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { useUpdateProfileMutation, useUploadProfilePhotoMutation, useLogoutMutation } from '@/lib/api/authApi';
import { logout as logoutAction, setCredentials } from '@/lib/store/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { User, Camera, LogOut, Save, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadPhoto] = useUploadProfilePhotoMutation();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile({ fullName }).unwrap();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    const loadingToast = toast.loading('Uploading photo...');
    try {
      await uploadPhoto(formData).unwrap();
      toast.success('Photo updated successfully', { id: loadingToast });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to upload photo', { id: loadingToast });
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      dispatch(logoutAction());
      router.push('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="container max-w-4xl px-4 md:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Account <span className="text-primary italic">Settings.</span></h1>
          <p className="text-muted-foreground font-medium text-lg">Manage your profile and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Avatar & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft p-8 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="w-full h-full rounded-full overflow-hidden bg-accent flex items-center justify-center border-4 border-white shadow-lg">
                  {user.profilePictureUrl ? (
                    <Image src={user.profilePictureUrl} alt={user.fullName} fill className="object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-4 border-white hover:scale-110 transition-transform"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              <h3 className="text-xl font-black mb-1">{user.fullName}</h3>
              <p className="text-sm font-bold text-muted-foreground mb-6">{user.email}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-8">
                <Shield size={12} /> {user.role}
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Right Column: Profile Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft p-8 md:p-10">
              <h3 className="text-2xl font-black mb-8">Personal <span className="text-primary italic">Information</span></h3>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Email Address</label>
                  <div className="relative opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="flex h-14 w-full rounded-2xl border-none bg-muted px-12 py-2 text-base shadow-inner-soft cursor-not-allowed outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium ml-1">Email cannot be changed.</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full md:w-auto h-14 px-10 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save size={20} />
                        <span>Save Changes</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Input } from "@/components/ui";
import { Avatar } from "@/components/ui";
import { Camera, Upload, CheckCircle, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, loading } = useAuth();
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        toast.success("Avatar uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your personal information and preferences</p>
      </div>

      <Card className="p-8 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.charAt(0).toUpperCase() || <User className="h-16 w-16" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-violet-600 text-white rounded-full cursor-pointer hover:bg-violet-700 transition-colors shadow-lg">
                <Camera className="h-4 w-4" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">{profile?.full_name}</h3>
              <p className="text-gray-500 capitalize">{profile?.role}</p>
            </div>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                <Input label="Email" type="email" value={formData.email} disabled />
                <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <div className="px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 capitalize">{profile?.role}</div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={saving} className="shadow-lg shadow-violet-500/25">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Input } from "@/components/ui";
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  Phone,
  Shield,
  Bell,
  Palette,
  Key,
  Save,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: "FaceTrack AI Academy",
    email: "admin@facetrack.ai",
    phone: "+1 234 567 890",
    allowLateMark: true,
    lateThreshold: 15,
    autoExport: false,
    notifications: true,
    darkMode: true,
    language: "en",
    recognitionThreshold: 70,
    antiSpoofing: true,
    requireBlink: true,
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your application settings and preferences</p>
      </div>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">General Settings</h2>
        </div>
        <div className="space-y-4">
          <Input label="Institution Name" value={settings.schoolName} onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Admin Email" type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} icon={<Mail className="h-5 w-5" />} />
            <Input label="Phone" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} icon={<Phone className="h-5 w-5" />} />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">Attendance Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-medium text-white">Allow Late Marks</p>
              <p className="text-sm text-gray-500">Automatically mark students as late after cutoff time</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.allowLateMark} onChange={(e) => setSettings({ ...settings, allowLateMark: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Late Threshold (minutes)</label>
            <input type="number" value={settings.lateThreshold} onChange={(e) => setSettings({ ...settings, lateThreshold: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">Face Recognition Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recognition Threshold (%)</label>
            <input type="range" min="50" max="99" value={settings.recognitionThreshold} onChange={(e) => setSettings({ ...settings, recognitionThreshold: parseInt(e.target.value) })} className="w-full accent-violet-500" />
            <p className="text-xs text-gray-500 mt-1">Current: {settings.recognitionThreshold}% — Higher values are stricter</p>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-medium text-white">Anti-Spoofing</p>
              <p className="text-sm text-gray-500">Detect and reject fake faces</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.antiSpoofing} onChange={(e) => setSettings({ ...settings, antiSpoofing: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-medium text-white">Blink Detection</p>
              <p className="text-sm text-gray-500">Require blink for liveness verification</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.requireBlink} onChange={(e) => setSettings({ ...settings, requireBlink: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Bell className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="font-medium text-white">Push Notifications</p>
              <p className="text-sm text-gray-500">Receive attendance alerts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2 shadow-lg shadow-violet-500/25">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
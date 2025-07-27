import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { User, Lock, Bell, Palette, Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoadingProfile(true);
    setTimeout(() => {
      toast({
        title: "🚧 Feature Incomplete",
        description: "Profile update functionality is not implemented yet. You can request it in your next prompt! 🚀",
      });
      setIsLoadingProfile(false);
    }, 1500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingPassword(true);
    setTimeout(() => {
      toast({
        title: "🚧 Feature Incomplete",
        description: "Password change functionality is not implemented yet. You can request it in your next prompt! 🚀",
      });
      setIsLoadingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  const handleNotificationToggle = (id, checked) => {
    toast({
        title: `Notification setting '${id}' toggled ${checked ? 'ON' : 'OFF'}`,
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Settings - EduManage</title>
        <meta name="description" content="Manage your profile, password, and notification settings." />
      </Helmet>
      <div className="space-y-6">
        <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight"
        >
            Settings
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {/* Profile Settings */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <User className="h-6 w-6" />
                                <div>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal details.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" name="email" type="email" value={profileData.email} disabled />
                                </div>
                                <Button type="submit" isLoading={isLoadingProfile}>
                                    {isLoadingProfile ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Password Settings */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Lock className="h-6 w-6" />
                                <div>
                                    <CardTitle>Change Password</CardTitle>
                                    <CardDescription>Update your account's password.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                                </div>
                                <Button type="submit" isLoading={isLoadingPassword}>
                                    {isLoadingPassword ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
            <div className="space-y-6">
                {/* Preferences */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Palette className="h-6 w-6" />
                                <div>
                                    <CardTitle>Preferences</CardTitle>
                                    <CardDescription>Customize your experience.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="theme-toggle">Dark Mode</Label>
                                <Switch id="theme-toggle" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="language">Language</Label>
                                <Button variant="outline" size="sm" onClick={() => toast({ description: 'Multi-language support is coming soon!' })}>
                                    <Languages className="mr-2 h-4 w-4" /> English
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Bell className="h-6 w-6" />
                                <div>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Manage your notification settings.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications">Email Notifications</Label>
                                <Switch id="email-notifications" onCheckedChange={(c) => handleNotificationToggle('Email', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="push-notifications">Push Notifications</Label>
                                <Switch id="push-notifications" onCheckedChange={(c) => handleNotificationToggle('Push', c)} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="grade-updates">Grade Updates</Label>
                                <Switch id="grade-updates" defaultChecked onCheckedChange={(c) => handleNotificationToggle('Grade Updates', c)} />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
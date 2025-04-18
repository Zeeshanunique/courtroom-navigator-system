import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dashboard } from "@/components/layout/Dashboard";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  
  // Notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    caseUpdates: true,
    hearingReminders: true,
    documentUploads: false,
    systemAnnouncements: true
  });
  
  // Theme preferences
  const [appearance, setAppearance] = useState({
    theme: "system",
    fontSize: "normal",
    reducedMotion: false
  });
  
  const handleToggleChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleAppearanceChange = (key: keyof typeof appearance, value: string | boolean) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePasswordReset = async () => {
    setIsLoading(true);
    // Simulate password reset email
    setTimeout(() => {
      setPasswordResetSent(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dashboard>
      <div className="container max-w-4xl py-10">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Separator />
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Manage your basic account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role || "User"} Account
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <div className="flex items-center gap-2">
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <div className="flex items-center gap-2">
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>Eastern Time (ET)</option>
                        <option>Central Time (CT)</option>
                        <option>Mountain Time (MT)</option>
                        <option>Pacific Time (PT)</option>
                        <option>UTC</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleToggleChange("emailNotifications")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Case Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about updates to your cases
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.caseUpdates}
                      onCheckedChange={() => handleToggleChange("caseUpdates")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Hearing Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive reminders about upcoming hearings
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.hearingReminders}
                      onCheckedChange={() => handleToggleChange("hearingReminders")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document Uploads</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when documents are uploaded
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.documentUploads}
                      onCheckedChange={() => handleToggleChange("documentUploads")}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Announcements</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive system-wide announcements
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.systemAnnouncements}
                      onCheckedChange={() => handleToggleChange("systemAnnouncements")}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize how the application looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={appearance.theme === "light" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("theme", "light")}
                        className="w-24"
                      >
                        Light
                      </Button>
                      <Button 
                        variant={appearance.theme === "dark" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("theme", "dark")}
                        className="w-24"
                      >
                        Dark
                      </Button>
                      <Button 
                        variant={appearance.theme === "system" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("theme", "system")}
                        className="w-24"
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant={appearance.fontSize === "small" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("fontSize", "small")}
                        className="w-24"
                      >
                        Small
                      </Button>
                      <Button 
                        variant={appearance.fontSize === "normal" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("fontSize", "normal")}
                        className="w-24"
                      >
                        Normal
                      </Button>
                      <Button 
                        variant={appearance.fontSize === "large" ? "default" : "outline"} 
                        onClick={() => handleAppearanceChange("fontSize", "large")}
                        className="w-24"
                      >
                        Large
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch 
                      checked={appearance.reducedMotion}
                      onCheckedChange={(checked) => handleAppearanceChange("reducedMotion", checked)}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Change Password</Label>
                    <div className="space-y-4">
                      {passwordResetSent ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Password reset link has been sent to your email address.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Button 
                          onClick={handlePasswordReset}
                          disabled={isLoading}
                          variant="outline"
                        >
                          {isLoading ? "Sending..." : "Send Password Reset Link"}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Two-Factor Authentication</Label>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Set Up 2FA</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Active Sessions</Label>
                    <div className="space-y-2">
                      <div className="rounded-md border p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              Last active: {new Date().toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2">Current</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Dashboard>
  );
}

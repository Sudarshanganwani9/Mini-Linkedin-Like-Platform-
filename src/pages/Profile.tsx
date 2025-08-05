import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Building, Calendar, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    job_title: "",
    company: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          display_name: data.display_name || "",
          bio: data.bio || "",
          job_title: data.job_title || "",
          company: data.company || "",
          location: data.location || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert([
          {
            user_id: user.id,
            ...formData,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-0">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/30 relative">
              {profile?.banner_url && (
                <img 
                  src={profile.banner_url} 
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Profile Header */}
            <div className="p-6 -mt-16 relative">
              <div className="flex flex-col sm:flex-row gap-6">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-3xl">
                    {profile?.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">
                        {profile?.display_name || "Add your name"}
                      </h1>
                      {profile?.job_title && profile?.company && (
                        <p className="text-lg text-muted-foreground">
                          {profile.job_title} at {profile.company}
                        </p>
                      )}
                      {profile?.location && (
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditing(!editing)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {editing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>

                  {profile?.bio && (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {editing && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Your display name"
                />
              </div>

              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, job_title: e.target.value }))}
                  placeholder="Your job title"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Your location"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
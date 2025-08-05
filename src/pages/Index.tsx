import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/auth/AuthForm";
import { Header } from "@/components/layout/Header";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { CreatePost } from "@/components/posts/CreatePost";
import { PostsList } from "@/components/posts/PostsList";
import { Sidebar } from "@/components/layout/Sidebar";

const Index = () => {
  const { user, loading } = useAuth();
  const [refreshPosts, setRefreshPosts] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <CreatePost onPostCreated={() => setRefreshPosts(prev => prev + 1)} />
            <PostsList refresh={refreshPosts} />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

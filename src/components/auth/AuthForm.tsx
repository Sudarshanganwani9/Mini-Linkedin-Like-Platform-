import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Welcome to Social</CardTitle>
          <CardDescription>Connect with professionals and share your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "hsl(200 100% 43%)",
                    brandAccent: "hsl(200 100% 35%)",
                    brandButtonText: "white",
                    defaultButtonBackground: "hsl(210 40% 96.1%)",
                    defaultButtonBackgroundHover: "hsl(210 40% 90%)",
                    inputBackground: "white",
                    inputBorder: "hsl(214.3 31.8% 91.4%)",
                    inputBorderHover: "hsl(200 100% 43%)",
                    inputBorderFocus: "hsl(200 100% 43%)",
                  },
                },
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
};
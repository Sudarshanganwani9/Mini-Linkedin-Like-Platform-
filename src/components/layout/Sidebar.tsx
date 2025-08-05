import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Calendar, Bookmark } from "lucide-react";

export const Sidebar = () => {
  const trendingTopics = [
    "#TechJobs",
    "#RemoteWork", 
    "#AI",
    "#Networking",
    "#CareerGrowth"
  ];

  const suggestedConnections = [
    { name: "John Doe", title: "Software Engineer", mutual: 12 },
    { name: "Jane Smith", title: "Product Manager", mutual: 8 },
    { name: "Mike Johnson", title: "Designer", mutual: 5 },
  ];

  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {trendingTopics.map((topic) => (
            <Button
              key={topic}
              variant="ghost"
              size="sm"
              className="w-full justify-start p-2 h-auto"
            >
              <span className="text-primary font-medium">{topic}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* People you may know */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedConnections.map((person) => (
            <div key={person.name} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-sm">{person.name}</div>
                <div className="text-xs text-muted-foreground">{person.title}</div>
                <div className="text-xs text-muted-foreground">
                  {person.mutual} mutual connections
                </div>
              </div>
              <Button size="sm" variant="outline" className="ml-2">
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved items
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
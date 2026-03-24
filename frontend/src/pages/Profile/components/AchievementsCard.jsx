import React from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const AchievementItem = ({ title, subtitle }) => (
  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all duration-300">
    <p className="text-xs font-bold tracking-tight">{title}</p>
    <p className="text-[10px] font-medium text-muted-foreground mt-1">{subtitle}</p>
  </div>
);

const AchievementsCard = () => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Trophy className="text-yellow-500" size={16} />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-0">
        <AchievementItem title="100 WPM Club" subtitle="Peak reached" />
        <AchievementItem title="7-Day Streak" subtitle="Consistent" />
        <AchievementItem title="First Test" subtitle="Welcome" />
        <AchievementItem title="Speed Demon" subtitle="Improving" />
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;

import React from "react";
import { Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import ContributionGraph from "../../../components/ContributionGraph";

const ActivityJourney = ({ email, theme }) => {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Your Journey
        </CardTitle>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          LIVE TRACKING
        </div>
      </CardHeader>
      <CardContent>
        <ContributionGraph
          email={email}
          token={localStorage.getItem("token")}
          isDark={theme === "dark"}
          compact={false}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityJourney;

import React from "react";
import { Trophy, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ACHIEVEMENTS_CONFIG } from "../../../config/achievements";

const AchievementItem = ({ achievement, unlocked }) => {
  const Icon = achievement.icon;
  
  return (
    <div 
      className={`
        relative group p-3 rounded-lg border transition-all duration-300 flex flex-col justify-between h-auto min-h-24
        ${unlocked 
          ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40 shadow-sm" 
          : "bg-muted/20 border-border/40 opacity-50 grayscale hover:opacity-80 hover:grayscale-0 hover:bg-muted/40"
        }
      `}
    >
      <div className="flex items-start justify-between w-full mb-2">
        <div className={`p-1.5 rounded-md transition-colors ${unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
          <Icon size={16} />
        </div>
        {unlocked && (
          <div className="text-[9px] font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
            Unlocked
          </div>
        )}
        {!unlocked && <Lock size={12} className="text-muted-foreground" />}
      </div>
      
      <div>
        <h4 className={`text-xs font-bold leading-tight mb-0.5 ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
          {achievement.title}
        </h4>
        <p className="text-[10px] text-muted-foreground leading-3 line-clamp-2">
          {achievement.subtitle}
        </p>
      </div>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-max max-w-48">
        <div className="bg-popover text-popover-foreground text-[10px] font-medium py-1 px-2 rounded shadow border border-border">
          {achievement.description}
        </div>
      </div>
    </div>
  );
};

const AchievementsCard = ({ achievements = [] }) => {
  const validAchievements = (achievements || []).filter(id => 
    ACHIEVEMENTS_CONFIG.some(a => a.id === id)
  );
  const unlockedCount = validAchievements.length;
  const totalCount = ACHIEVEMENTS_CONFIG.length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <Card className="border-border shadow-sm h-full flex flex-col w-full">
      <CardHeader className="pb-3 pt-4 px-4 space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" size={16} />
            Achievements
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono font-medium bg-muted px-2 py-0.5 rounded text-[10px]">
            {unlockedCount}/{totalCount}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-2 pt-0 px-4 pb-4 overflow-y-auto max-h-96">
        {ACHIEVEMENTS_CONFIG.map((achievement) => {
          const isUnlocked = achievements && achievements.includes(achievement.id);
          return (
            <AchievementItem 
              key={achievement.id} 
              achievement={achievement} 
              unlocked={isUnlocked} 
            />
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AchievementsCard;

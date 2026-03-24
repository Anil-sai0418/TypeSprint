import React from "react";
import { motion } from "framer-motion";
import { Activity, Zap, Trophy, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";

const StatBox = ({ icon, label, value, accent }) => (
  <div className={`p-5 rounded-2xl flex items-center gap-5 transition-all duration-300 ${accent ? "bg-primary/10 border-2 border-primary/20 shadow-primary/5 shadow-lg" : "bg-muted/30 border border-border shadow-sm"
    }`}>
    <div className={`p-3 rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-background text-primary shadow-sm"}`}>
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-2xl font-black tracking-tighter">{value}</p>
    </div>
  </div>
);

const SummaryCard = ({ title, value }) => (
  <div className="p-4 rounded-xl bg-muted/20 border border-border text-center group hover:bg-muted/30 transition-colors">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 group-hover:text-primary transition-colors">{title}</p>
    <p className="text-lg font-black tracking-tight">{value}</p>
  </div>
);

const TypingStatsOverview = ({ stats }) => {
  return (
    <motion.div
      key="stats-overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Activity size={20} className="text-primary" />
            Typing Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && Object.keys(stats).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatBox icon={<Zap />} label="Max Speed" value={`${stats.highestSpeed || 0} WPM`} accent />
              <StatBox icon={<Trophy />} label="Fastest Test" value={`${stats.bestTest || 0}s`} />
              <StatBox icon={<Clock />} label="Total Tests" value={stats.totalTests || 0} />
              <div className="col-span-full grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <SummaryCard title="Current Streak" value={`${stats.dailyStreak || 0} Days`} />
                <SummaryCard title="Lifetime Average" value={`${stats.averageSpeed || 0} WPM`} />
              </div>
            </div>
          ) : (
            <div className="text-center py-10 rounded-lg border-2 border-dashed border-border text-muted-foreground">
              <p>Start your first typing test to see your insights!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TypingStatsOverview;

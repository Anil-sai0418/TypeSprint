import { GraduationCap, Zap, Trophy, Crown, Flame, Target, Timer, Keyboard } from "lucide-react";

// These IDs must match the strings stored in the backend database (UserProfile.achievements)
export const ACHIEVEMENTS_CONFIG = [
  {
    id: "First Test",
    title: "First Steps",
    subtitle: "Complete your first typing test",
    description: "Welcome to the club! You've taken your first step towards mastery.",
    icon: GraduationCap,
    category: "milestone"
  },
  {
    id: "Speed Improver", 
    title: "Getting Started",
    subtitle: "Complete 10 typing tests",
    description: "Practice makes perfect. Keep going!",
    icon: Keyboard,
    category: "milestone"
  },
  {
    id: "100 WPM Club",
    title: "Speed Demon",
    subtitle: "Reach 100 WPM",
    description: "You're flying! 100 WPM is a serious milestone.",
    icon: Zap,
    category: "speed"
  },
  {
    id: "150 WPM Club",
    title: "Typing God",
    subtitle: "Reach 150 WPM",
    description: "Unbelievable speed. You are among the elite.",
    icon: Crown,
    category: "speed"
  },
  {
    id: "7-Day Streak",
    title: "Consistency King",
    subtitle: "7-day streak",
    description: "Dedication pays off. You've typed for a week straight.",
    icon: Flame,
    category: "streak"
  },
  // Future achievements (not yet implemented in backend but good for UI)
  {
    id: "Accuracy Master",
    title: "Precision",
    subtitle: "100% Accuracy",
    description: "Perfect accuracy on a test.",
    icon: Target,
    category: "accuracy"
  },
  {
    id: "Marathon",
    title: "Marathon Runner",
    subtitle: "Complete 100 tests",
    description: "A true testament to endurance.",
    icon: Timer,
    category: "milestone"
  }
];

export default function Leaderboard() {
  const leaders = [
    { rank: 1, name: "Anil", wpm: 98, accuracy: "99%" },
    { rank: 2, name: "Vijendra", wpm: 94, accuracy: "97%" },
    { rank: 3, name: "Gowatham", wpm: 91, accuracy: "95%" },
    { rank: 4, name: "Ashok", wpm: 89, accuracy: "94%" },
    { rank: 5, name: "Brama", wpm: 87, accuracy: "93%" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-foreground">🏆 Leaderboard</h2>
      <div className="w-full max-w-3xl bg-white dark:bg-muted p-6 rounded-2xl shadow-lg">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-primary/20 dark:bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">Rank</th>
              <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">WPM</th>
              <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-muted/20">
            {leaders.map((player) => (
              <tr key={player.rank} className="hover:bg-muted/10 transition">
                <td className="px-4 py-3">{player.rank}</td>
                <td className="px-4 py-3">{player.name}</td>
                <td className="px-4 py-3">{player.wpm}</td>
                <td className="px-4 py-3">{player.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
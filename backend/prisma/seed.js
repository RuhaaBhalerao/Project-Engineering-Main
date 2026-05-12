import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const games = [
  'Donkey Kong', 'Pac-Man', 'Space Invaders', 'Asteroids', 'Galaxian',
  'Ms. Pac-Man', 'Centipede', 'Tempest', 'Dig Dug', 'Frogger',
  'Galaga', 'Defender', 'Joust', 'Arcade Volleyball', 'Breakout',
];

const playerNames = [
  'Billy Mitchell', 'Walter Day', 'Steve Wiebe', 'Twin Galaxies', 'Kong Master',
  'Arcade Legend', 'Pixel Warrior', 'High Roller', 'Score Hunter', 'Game Over',
  'Champion Pro', 'Elite Gamer', 'Retro King', 'Arcade Ace', 'Classic Hero',
];

const strategyNotes = [
  'Focus on corner positioning and use the jump button strategically. Always maintain distance from moving obstacles. When barrel patterns emerge, exploit the safe zones on the right side of the map. Time your jumps perfectly to avoid bouncing hazards. Keep moving forward steadily; panic leads to mistakes. Study barrel trajectories for 2-3 minutes before attempting a serious run. Remember that speed and precision trump aggressive play. Invest in learning each level layout completely.',
  'The key to high scores is rapid directional changes and wall bouncing. Never eat power pellets unless critical; they create unnecessary complications. Instead, focus on eating in straight lines and using tunnel passages efficiently. Blinky\'s pattern is predictable after 2 minutes of observation. Use the bottom corridor to reset ghost positions when overwhelmed. Master the four-ghost chase pattern; it repeats every 256 levels. Patience and rhythm matter more than panic-mashing.',
  'Timing invader waves and predicting spawn points is crucial. Always move to extremes (left/right edges) between shots. Fire early and often to create gaps. The shield blocks degrade predictably; position yourself accordingly. Space Invaders rewards steady, methodical play. Never stay in the center. Study the enemy wave patterns; they follow exact mathematical sequences. Kill one column at a time for rhythm. Saving the last invader for final shots is a proven strategy.',
  'Asteroids require constant movement and strategic rotation. Never fire blindly; every shot should have a target. The saucer movements follow patterns every 20 shots. Use the hyperspace button only in emergencies. Learn to clear the screen without using hyperspace. Constant circular motion prevents collisions. The rock formations break into predictable sub-rocks. Memorize the physics; they never change. Stay calm and focus on clean, deliberate shots.',
  'Galaxian rewards precision and aggressive early play. The formation-breaking aliens offer bonus points; exploit this. Never waste bullets; each shot counts. The alien formations follow strict mathematical patterns. Plan your escape route before firing. Scoring peaks occur during specific formation phases. Horizontal movement at the edges maximizes survival time. Patience during alien descents is key. Watch for safe zones in the formation.',
  'Use Ms. Pac-Man\'s predictability against the ghosts. The maze has strategic points that provide temporary safety. Power-pellet timing is everything; activate them at optimal moments. Each ghost has a unique behavior pattern; master them individually. The maze layout repeats; memorize safe paths. Speed and direction changes confuse the ghosts effectively. Plan every turn in advance; improvisation leads to death. The tunnel is your best friend for resetting ghost positions.',
  'Centipede is all about precision aiming and target prioritization. Shoot the mushrooms strategically to create barriers. The centipede head should be tracked constantly. Once the head dies, the body segments become individual threats. Mushroom patterns create temporary shields. The spider movements are erratic but exploitable. Focus on the head first; the body follows naturally. Stay mobile and never get cornered by body segments. Spray-and-pray leads to quick deaths.',
  'Tempest requires rapid reflexes and perfect timing. The tunnel rotations demand constant adjustment. Never fire directly; predict enemy positions. The enemy spawns follow exact patterns. Rotate preemptively to intercept incoming threats. Superzappers should be saved for critical moments. The tunnel geometry changes every level; adapt quickly. Staying at the tunnel mouth is usually optimal. Practice rotational muscle memory relentlessly.',
  'Dig Dug rewards risk management and strategic hole digging. The worm and pooka patterns are mathematically predictable. Inflate enemies near the surface for quick kills. Digging creates tactical barriers. Never dig blindly into the abyss. The fruit bonuses appear in specific patterns. Stay near dig-out routes for escape potential. Pooka behavior changes based on distance and position. Study the artificial intelligence deeply.',
  'Frogger demands patience and pixel-perfect timing. Each platform move must be deliberate and timed perfectly. The traffic patterns are completely predictable. Study the log spacing before committing to a crossing. Waiting at the starting line is often the best strategy. Winning requires understanding the exact traffic cycle. Never rush; each game is a strategic puzzle. The safe zones are your planning areas.',
];

async function main() {
  console.log('Seeding database with 300+ arcade high scores...');

  // Clear existing data
  await prisma.score.deleteMany({});

  const scores = [];

  // Generate 300+ scores
  for (let i = 0; i < 320; i++) {
    const game = games[i % games.length];
    const player = playerNames[Math.floor(Math.random() * playerNames.length)];
    const baseScore = Math.floor(Math.random() * 900000) + 100000;
    const strategyNote = strategyNotes[i % strategyNotes.length];
    const daysAgo = Math.floor(Math.random() * 365);

    scores.push({
      game,
      player: `${player}-${i}`,
      score: baseScore + i * 1000,
      strategyNote,
      date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  await prisma.score.createMany({
    data: scores,
  });

  console.log(`✅ Seeded ${scores.length} high scores`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

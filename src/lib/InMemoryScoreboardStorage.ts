import type { Match } from '@/types/match.ts';
import type { ScoreboardStorage } from '@/types/scoreboard.ts';

/**
 * In-memory implementation of ScoreboardStorage.
 */
export class InMemoryScoreboardStorage implements ScoreboardStorage {
    private matches = new Map<string, Match>();

    save(match: Match): void {
        this.matches.set(match.id, match);
    }

    remove(matchId: string): void {
        this.matches.delete(matchId);
    }

    findById(matchId: string): Match | undefined {
        return this.matches.get(matchId);
    }

    findByTeams(homeTeam: string, awayTeam: string): Match | undefined {
        return Array.from(this.matches.values()).find(
            (m) =>
                (m.homeTeam === homeTeam && m.awayTeam === awayTeam) ||
                (m.homeTeam === awayTeam && m.awayTeam === homeTeam),
        );
    }

    getAll(): Match[] {
        return Array.from(this.matches.values());
    }
}

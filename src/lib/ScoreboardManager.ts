import type { Match } from '@/types/match';
import type { Scoreboard as IScoreboard, ScoreboardStorage as IScoreboardStorage } from '@/types/scoreboard.ts';
import { InMemoryScoreboardStorage } from '@/lib/InMemoryScoreboardStorage.ts';
import { v4 as uuidv4 } from 'uuid';
import { getNewMatch, getTotalScore, updateScore } from '@/utils/match.ts';

export class ScoreboardManager implements IScoreboard {
    private readonly _scoreboardStorage: IScoreboardStorage;

    constructor(scoreboardStorage?: IScoreboardStorage) {
        this._scoreboardStorage = scoreboardStorage || new InMemoryScoreboardStorage();
    }

    startMatch(homeTeam: string, awayTeam: string): Match {
        const existingMatch = this._scoreboardStorage.findByTeams(homeTeam, awayTeam);

        if (existingMatch) {
            throw Error('A match with these teams already exists');
        }

        const match = {
            id: uuidv4(),
            ...getNewMatch(homeTeam, awayTeam),
        };

        this._scoreboardStorage.save(match);

        return match;
    }

    updateScore(matchId: Match['id'], homeScore: number, awayScore: number): Match {
        const match = this.getMatchById(matchId);

        const updatedMatch = updateScore(match, homeScore, awayScore);

        this._scoreboardStorage.save(updatedMatch);

        return updatedMatch;
    }

    finishMatch(matchId: Match['id']): boolean {
        // Check the match existence and throw the Error if needed
        this.getMatchById(matchId);

        this._scoreboardStorage.remove(matchId);

        return true;
    }

    getSummary(): Match[] {
        const matches = this._scoreboardStorage.getAll();

        return matches.toSorted((a, b) => {
            // First sort by total score (descending)
            const scoreDiff = getTotalScore(b) - getTotalScore(a);

            if (scoreDiff !== 0) {
                return scoreDiff;
            }

            // If scores are equal, sort by start time (most recent first)
            return b.startTime.getTime() - a.startTime.getTime();
        });
    }

    getAllMatches(): Match[] {
        return this._scoreboardStorage.getAll();
    }

    getMatchById(matchId: Match['id']): Match {
        const match = this._scoreboardStorage.findById(matchId);

        if (!match) {
            throw new Error("A match with this ID doesn't exist");
        }

        return match;
    }

    findMatch(homeTeam: string, awayTeam: string): Match | undefined {
        return this._scoreboardStorage.findByTeams(homeTeam, awayTeam);
    }
}

import type { Match } from '@/types/match.ts';

/**
 * Creates a new match with initial score 0-0
 * @param homeTeam Name of the home team
 * @param awayTeam Name of the away team
 * @returns A new Match object
 */
export function getNewMatch(homeTeam: string, awayTeam: string): Omit<Match, 'id'> {
    if (!homeTeam.trim() || !awayTeam.trim()) {
        throw new Error('Both home team and away team names are required');
    }

    if (homeTeam === awayTeam) {
        throw new Error('Home team and away team cannot be the same');
    }

    return {
        homeTeam,
        awayTeam,
        homeScore: 0,
        awayScore: 0,
        startTime: new Date(),
    };
}

/**
 * Returns a new Match object with updated scores.
 * @param match {Match} he match to update
 * @param homeScore New home team score
 * @param awayScore New away team score
 * @returns A new Match object with updated scores
 */
export function updateScore(match: Match, homeScore: number, awayScore: number): Match {
    if (!Number.isSafeInteger(homeScore) || !Number.isSafeInteger(awayScore)) {
        throw new Error('Scores must be safe integers');
    }

    if (homeScore < 0 || awayScore < 0) {
        throw new Error('Scores cannot be negative');
    }

    return {
        ...match,
        homeScore,
        awayScore,
    };
}

/**
 * Calculates the total score of a match
 * @param match The match
 * @returns The sum of home and away scores
 */
export function getTotalScore(match: Match): number {
    return match.homeScore + match.awayScore;
}

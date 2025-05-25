import { describe, it, expect, afterAll, beforeEach, vi, beforeAll } from 'vitest';
import { ScoreboardManager } from './ScoreboardManager.ts';

describe('ScoreboardManager', () => {
    let scoreboard: ScoreboardManager;

    beforeAll(() => {
        // Mock Date.now to ensure consistent timestamps
        vi.useFakeTimers();
    });

    beforeEach(() => {
        scoreboard = new ScoreboardManager();
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    const teams = ['Team A', 'Team B', 'Team C', 'Team D'];

    describe('startMatch', () => {
        it('starts a new match with initial score 0-0', () => {
            const match = scoreboard.startMatch(teams[0], teams[1]);

            expect(match.homeTeam).toBe(teams[0]);
            expect(match.awayTeam).toBe(teams[1]);

            expect(match.homeScore).toBe(0);
            expect(match.awayScore).toBe(0);

            // Verify match is in the scoreboard
            const allMatches = scoreboard.getAllMatches();

            expect(allMatches).toHaveLength(1);
            expect(allMatches[0]).toEqual(match);
        });

        it('throws an error when starting a match with same teams', () => {
            scoreboard.startMatch(teams[0], teams[1]);

            expect(() => scoreboard.startMatch(teams[0], teams[1])).toThrowError();
        });

        it('throws an error when starting a match with teams in reverse order', () => {
            scoreboard.startMatch(teams[0], teams[1]);

            expect(() => scoreboard.startMatch(teams[1], teams[0])).toThrowError();
        });
    });

    describe('updateScore', () => {
        it('updates the score of an existing match', () => {
            const match = scoreboard.startMatch(teams[0], teams[1]);

            const updatedMatch = scoreboard.updateScore(match.id, 2, 1);

            expect(updatedMatch).toBeDefined();

            expect(updatedMatch!.homeScore).toBe(2);
            expect(updatedMatch!.awayScore).toBe(1);

            // Verify score is updated in the scoreboard
            const scoreboardMatch = scoreboard.getMatchById(match.id);

            expect(scoreboardMatch).toBeDefined();
            expect(scoreboardMatch!.homeScore).toBe(2);
            expect(scoreboardMatch!.awayScore).toBe(1);
        });

        it('throws an error when updating score for non-existent match', () => {
            expect(() => scoreboard.updateScore('35ec3f52-f61f-4d0a-aaed-88a256ec400f', 1, 1)).toThrowError();
        });
    });

    describe('finishMatch', () => {
        it('finishes a match and removes it from the scoreboard', () => {
            const match = scoreboard.startMatch(teams[0], teams[1]);

            const result = scoreboard.finishMatch(match.id);

            expect(result).toBe(true);

            // Verify match is removed from the scoreboard
            const allMatches = scoreboard.getAllMatches();

            expect(allMatches).toHaveLength(0);
        });

        it('throws an error when finishing a non-existent match', () => {
            expect(() => scoreboard.finishMatch('2e088d04-fe43-43b6-896d-1b25a54660a3')).toThrowError();
        });
    });

    describe('getSummary', () => {
        it('returns matches ordered by total score and start time', () => {
            // Set up matches from the example with the correct score
            vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
            const match_1 = scoreboard.startMatch('Mexico', 'Canada');
            scoreboard.updateScore(match_1.id, 0, 5);

            vi.setSystemTime(new Date('2025-01-01T12:15:00Z'));
            const match_2 = scoreboard.startMatch('Spain', 'Brazil');
            scoreboard.updateScore(match_2.id, 10, 2);

            vi.setSystemTime(new Date('2025-01-01T12:30:00Z'));
            const match_3 = scoreboard.startMatch('Germany', 'France');
            scoreboard.updateScore(match_3.id, 2, 2);

            vi.setSystemTime(new Date('2025-01-01T12:45:00Z'));
            const match_4 = scoreboard.startMatch('Uruguay', 'Italy');
            scoreboard.updateScore(match_4.id, 6, 6);

            vi.setSystemTime(new Date('2025-01-01T13:00:00Z'));
            const match_5 = scoreboard.startMatch('Argentina', 'Australia');
            scoreboard.updateScore(match_5.id, 3, 1);

            // Get a summary
            const summary = scoreboard.getSummary();

            // Verify order as per the example
            expect(summary).toHaveLength(5);

            expect(
                summary.map(
                    ({ homeTeam, homeScore, awayTeam, awayScore }) =>
                        `${homeTeam} ${homeScore} - ${awayTeam} ${awayScore}`,
                ),
            ).toEqual([
                'Uruguay 6 - Italy 6',
                'Spain 10 - Brazil 2',
                'Mexico 0 - Canada 5',
                'Argentina 3 - Australia 1',
                'Germany 2 - France 2',
            ]);
        });

        it('orders matches with same total score by start time (most recent first)', () => {
            // Create two matches with the same total score but different start times
            vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
            const match_1 = scoreboard.startMatch(teams[0], teams[1]);

            vi.setSystemTime(new Date('2025-01-01T13:00:00Z'));
            const match_2 = scoreboard.startMatch(teams[2], teams[3]);

            // Both matches have a total score of 2
            scoreboard.updateScore(match_1.id, 1, 1);
            scoreboard.updateScore(match_2.id, 2, 0);

            const summary = scoreboard.getSummary();

            // Team C vs. Team D should come first as it started more recently
            expect(summary[0].homeTeam).toBe(teams[2]);
            expect(summary[1].homeTeam).toBe(teams[0]);
        });

        it('returns an empty array if no matches are in progress', () => {
            const summary = scoreboard.getSummary();

            expect(summary).toEqual([]);
        });
    });

    describe('findMatch', () => {
        it('returns a match by team names', () => {
            scoreboard.startMatch(teams[0], teams[1]);

            const scoreboardMatch = scoreboard.findMatch(teams[0], teams[1]);

            expect(scoreboardMatch).toBeDefined();

            expect(scoreboardMatch!.homeTeam).toBe(teams[0]);
            expect(scoreboardMatch!.awayTeam).toBe(teams[1]);
        });

        it('returns undefined for a non-existent match', () => {
            const match = scoreboard.findMatch(teams[0], teams[1]);

            expect(match).toBeUndefined();
        });
    });
});

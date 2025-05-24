import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { Scoreboard } from './Scoreboard';

describe('Scoreboard', () => {
    let scoreboard: Scoreboard;

    beforeEach(() => {
        scoreboard = new Scoreboard();

        // Mock Date.now to ensure consistent timestamps
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('startMatch', () => {
        it('starts a new match with initial score 0-0', () => {
            const match = scoreboard.startMatch('Team A', 'Team B');

            expect(match.homeTeam).toBe('Team A');
            expect(match.awayTeam).toBe('Team B');
            expect(match.homeScore).toBe(0);
            expect(match.awayScore).toBe(0);

            // Verify match is in the scoreboard
            const allMatches = scoreboard.getAllMatches();

            expect(allMatches).toHaveLength(1);
            expect(allMatches[0]).toEqual(match);
        });

        it('throws an error when starting a match with same teams', () => {
            scoreboard.startMatch('Team A', 'Team B');

            expect(() => scoreboard.startMatch('Team A', 'Team B')).toThrow('A match with these teams already exists');
        });

        it('throws an error when starting a match with teams in reverse order', () => {
            scoreboard.startMatch('Team A', 'Team B');

            expect(() => scoreboard.startMatch('Team B', 'Team A')).toThrow('A match with these teams already exists');
        });
    });

    describe('updateScore', () => {
        it('updates the score of an existing match', () => {
            scoreboard.startMatch('Team A', 'Team B');
            const updatedMatch = scoreboard.updateScore('Team A', 'Team B', 2, 1);

            expect(updatedMatch).toBeDefined();

            expect(updatedMatch!.homeScore).toBe(2);
            expect(updatedMatch!.awayScore).toBe(1);

            // Verify score is updated in the scoreboard
            const scoreboardMatch = scoreboard.getMatch('Team A', 'Team B');

            expect(scoreboardMatch).toBeDefined();
            expect(scoreboardMatch!.homeScore).toBe(2);
            expect(scoreboardMatch!.awayScore).toBe(1);
        });

        it('returns undefined when updating score for non-existent match', () => {
            const result = scoreboard.updateScore('Team A', 'Team B', 1, 1);

            expect(result).toBeUndefined();
        });
    });

    describe('finishMatch', () => {
        it('finishes a match and remove it from the scoreboard', () => {
            scoreboard.startMatch('Team A', 'Team B');

            const result = scoreboard.finishMatch('Team A', 'Team B');

            expect(result).toBe(true);

            // Verify match is removed from the scoreboard
            const allMatches = scoreboard.getAllMatches();

            expect(allMatches).toHaveLength(0);
        });

        it('returns false when finishing a non-existent match', () => {
            const result = scoreboard.finishMatch('Team A', 'Team B');

            expect(result).toBe(false);
        });
    });

    describe('getSummary', () => {
        it('returns matches ordered by total score and start time', () => {
            // Set up matches from the example
            vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
            scoreboard.startMatch('Mexico', 'Canada');

            vi.setSystemTime(new Date('2025-01-01T12:15:00Z'));
            scoreboard.startMatch('Spain', 'Brazil');

            vi.setSystemTime(new Date('2025-01-01T12:30:00Z'));
            scoreboard.startMatch('Germany', 'France');

            vi.setSystemTime(new Date('2025-01-01T12:45:00Z'));
            scoreboard.startMatch('Uruguay', 'Italy');

            vi.setSystemTime(new Date('2025-01-01T13:00:00Z'));
            scoreboard.startMatch('Argentina', 'Australia');

            // Update scores
            scoreboard.updateScore('Mexico', 'Canada', 0, 5);
            scoreboard.updateScore('Spain', 'Brazil', 10, 2);
            scoreboard.updateScore('Germany', 'France', 2, 2);
            scoreboard.updateScore('Uruguay', 'Italy', 6, 6);
            scoreboard.updateScore('Argentina', 'Australia', 3, 1);

            // Get a summary
            const summary = scoreboard.getSummary();

            // Verify order as per the example
            expect(summary).toHaveLength(5);
            expect(`${summary[0].homeTeam} ${summary[0].homeScore} - ${summary[0].awayTeam} ${summary[0].awayScore}`).toBe('Uruguay 6 - Italy 6');
            expect(`${summary[1].homeTeam} ${summary[1].homeScore} - ${summary[1].awayTeam} ${summary[1].awayScore}`).toBe('Spain 10 - Brazil 2');
            expect(`${summary[2].homeTeam} ${summary[2].homeScore} - ${summary[2].awayTeam} ${summary[2].awayScore}`).toBe('Mexico 0 - Canada 5');
            expect(`${summary[3].homeTeam} ${summary[3].homeScore} - ${summary[3].awayTeam} ${summary[3].awayScore}`).toBe('Argentina 3 - Australia 1');
            expect(`${summary[4].homeTeam} ${summary[4].homeScore} - ${summary[4].awayTeam} ${summary[4].awayScore}`).toBe('Germany 2 - France 2');
        });

        it('orders matches with same total score by start time (most recent first)', () => {
            // Create two matches with same total score but different start times
            vi.setSystemTime(new Date('2025-01-01T12:00:00Z'));
            scoreboard.startMatch('Team A', 'Team B');

            vi.setSystemTime(new Date('2025-01-01T13:00:00Z'));
            scoreboard.startMatch('Team C', 'Team D');

            // Both matches have a total score of 2
            scoreboard.updateScore('Team A', 'Team B', 1, 1);
            scoreboard.updateScore('Team C', 'Team D', 2, 0);

            const summary = scoreboard.getSummary();

            // Team C vs. Team D should come first as it started more recently
            expect(summary[0].homeTeam).toBe('Team C');
            expect(summary[1].homeTeam).toBe('Team A');
        });

        it('returns an empty array if no matches are in progress', () => {
            const summary = scoreboard.getSummary();

            expect(summary).toEqual([]);
        });
    });

    describe('getMatch', () => {
        it('returns a match by team names', () => {
            scoreboard.startMatch('Team A', 'Team B');

            const scoreboardMatch = scoreboard.getMatch('Team A', 'Team B');

            expect(scoreboardMatch).toBeDefined();

            expect(scoreboardMatch!.homeTeam).toBe('Team A');
            expect(scoreboardMatch!.awayTeam).toBe('Team B');
        });

        it('returns undefined for a non-existent match', () => {
            const match = scoreboard.getMatch('Team A', 'Team B');

            expect(match).toBeUndefined();
        });
    });
});

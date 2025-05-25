import { describe, it, expect } from 'vitest';
import { getNewMatch, updateScore, getTotalScore } from './match.ts';
import type { Match } from '@/types/match';

describe('matchUtils', () => {
    describe('getNewMatch', () => {
        it('creates a match with initial scores 0-0 and current start time', () => {
            const homeTeam = 'Team A';
            const awayTeam = 'Team B';

            const match = getNewMatch(homeTeam, awayTeam);

            expect(match.homeTeam).toBe(homeTeam);
            expect(match.awayTeam).toBe(awayTeam);

            expect(match.homeScore).toBe(0);
            expect(match.awayScore).toBe(0);

            expect(match.startTime).toBeInstanceOf(Date);
        });

        it('throws if team names are empty', () => {
            expect(() => getNewMatch('', 'Team B')).toThrowError();
            expect(() => getNewMatch('Team A', '')).toThrowError();
        });

        it('throws if team names are identical', () => {
            expect(() => getNewMatch('Team A', 'Team A')).toThrowError();
        });
    });

    describe('updateScore', () => {
        const baseMatch: Match = {
            id: '123',
            homeTeam: 'Team A',
            awayTeam: 'Team B',
            homeScore: 0,
            awayScore: 0,
            startTime: new Date(),
        };

        it('updates the score correctly', () => {
            const updatedMatch = updateScore(baseMatch, 2, 3);

            expect(updatedMatch.homeScore).toBe(2);
            expect(updatedMatch.awayScore).toBe(3);
        });

        it('throws if scores are negative', () => {
            expect(() => updateScore(baseMatch, -1, 0)).toThrowError();
            expect(() => updateScore(baseMatch, 0, -1)).toThrowError();
        });

        it('throws if scores are not safe integers', () => {
            expect(() => updateScore(baseMatch, 2.5, 1)).toThrowError();
            expect(() => updateScore(baseMatch, 1, NaN)).toThrowError();
        });
    });

    describe('getTotalScore', () => {
        it('returns the correct total score', () => {
            const match: Match = {
                id: '456',
                homeTeam: 'Team A',
                awayTeam: 'Team B',
                homeScore: 3,
                awayScore: 2,
                startTime: new Date(),
            };

            expect(getTotalScore(match)).toBe(5);
        });
    });
});

import type { Match } from './match.ts';

/**
 * Manages live football matches and their scores
 */
export interface Scoreboard {
    /**
     * Starts a new match with initial score 0-0 and adds it to the scoreboard
     * @param homeTeam Name of the home team
     * @param awayTeam Name of the away team
     * @returns {Match} The newly created match
     * @throws Error if a match between these teams is already in progress
     */
    startMatch(homeTeam: string, awayTeam: string): Match;

    /**
     * Updates the score for a match in progress
     * @param matchId Unique ID of the match
     * @param homeScore New home team score
     * @param awayScore New away team score
     * @returns {Match} The updated match
     * @throws {Error} if match not found
     */
    updateScore(matchId: Match['id'], homeScore: number, awayScore: number): Match;

    /**
     * Ends a match and removes it from the scoreboard
     * @param matchId Unique ID of the match
     * @returns bool Whether the match was successfully finished
     * @throws {Error} if match not found
     */
    finishMatch(matchId: Match['id']): boolean;

    /**
     * Returns a summary of all ongoing matches, ordered by:
     *  - Total score (descending),
     *  - Then by most recent start time
     * @returns {Match[]} Sorted list of ongoing matches
     */
    getSummary(): Match[];

    /**
     * Returns all matches currently in progress
     * @returns {Match[]} Array of all matches
     */
    getAllMatches(): Match[];

    /**
     * Retrieves a specific match by its unique ID
     * @param matchId Unique match identifier
     * @returns {Match} The Match instance
     * @throws {Error} if match not found
     */
    getMatchById(matchId: Match['id']): Match;

    /**
     * Finds a match based on team names.
     * @param homeTeam Name of the home team
     * @param awayTeam Name of the away team
     * @returns {Match | undefined} The matching Match, or undefined if not found.
     */
    findMatch(homeTeam: string, awayTeam: string): Match | undefined;
}

/**
 * Interface for storing and retrieving matches.
 */
export interface ScoreboardStorage {
    /**
     * Saves or updates a match.
     * @param match Match an object to store.
     */
    save(match: Match): void;

    /**
     * Removes a match by ID.
     * @param matchId Unique identifier for the match.
     */
    remove(matchId: Match['id']): void;

    /**
     * Finds a match by ID.
     * @param matchId Unique identifier.
     * @returns The match or undefined if not found.
     */
    findById(matchId: Match['id']): Match | undefined;

    /**
     * Finds a match by team names.
     * @param homeTeam Home team name.
     * @param awayTeam Away team name.
     * @returns The match or undefined if not found.
     */
    findByTeams(homeTeam: string, awayTeam: string): Match | undefined;

    /**
     * Gets all stored matches.
     * @returns Array of matches.
     */
    getAll(): Match[];
}

/**
 * In-memory implementation of ScoreboardStorage.
 */
export declare class InMemoryScoreboardStorage implements ScoreboardStorage {
    private matches;
    save(match: Match): void;
    remove(matchId: string): void;
    findById(matchId: string): Match | undefined;
    findByTeams(homeTeam: string, awayTeam: string): Match | undefined;
    getAll(): Match[];
}

/**
 * Represents a live football match with team names, scores, and a start timestamp.
 */
export declare interface Match {
    /**
     * Unique identifier for the match
     * @type string
     */
    id: string;
    /**
     * The name of the home team
     * @type string
     */
    homeTeam: string;
    /**
     * The name of the away team
     * @type number
     */
    awayTeam: string;
    /**
     * Current score of the home team
     * @type number
     */
    homeScore: number;
    /**
     * Current score of the away team
     * @type number
     */
    awayScore: number;
    /**
     * Timestamp when the match was started
     * @type Date
     */
    startTime: Date;
}

/**
 * Manages live football matches and their scores
 */
export declare interface Scoreboard {
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

export declare class ScoreboardManager implements Scoreboard {
    private readonly _scoreboardStorage;
    constructor(scoreboardStorage?: ScoreboardStorage);
    startMatch(homeTeam: string, awayTeam: string): Match;
    updateScore(matchId: Match['id'], homeScore: number, awayScore: number): Match;
    finishMatch(matchId: Match['id']): boolean;
    getSummary(): Match[];
    getAllMatches(): Match[];
    getMatchById(matchId: Match['id']): Match;
    findMatch(homeTeam: string, awayTeam: string): Match | undefined;
}

/**
 * Interface for storing and retrieving matches.
 */
export declare interface ScoreboardStorage {
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

export { }

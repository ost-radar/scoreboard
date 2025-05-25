/**
 * Represents a live football match with team names, scores, and a start timestamp.
 */
export interface Match {
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

// Genuine owner-supplied aggregate ratings, keyed by course ID.
// Leave empty until actual scores and review counts are supplied.
// Record schema: numeric course ID -> { score: number from 1 to 5, count: positive integer }.
// This file is separate from the catalogue so course imports preserve ratings.
const COURSE_RATINGS = {};

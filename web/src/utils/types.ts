export type SearchResponse = {
	result: "fail" | "success";
	online: number;
};

export type GameExistsResponse = {
	online: number;
	gameExists: boolean;
};

export type Moves = "Thinking" | "Stone" | "Paper" | "Scissor" | "Unknown";

import { API_URL } from "./constants";
import { GameExistsResponse, SearchResponse } from "./types";

export const searchGame = async (
	gameId: string
): Promise<GameExistsResponse> => {
	const res = await fetch(`${API_URL}api/search/game`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ game_id: gameId }),
	});
	const data: SearchResponse = await res.json();

	if (data.result === "fail")
		return {
			gameExists: false,
			online: 0,
		};
	if (data.result === "success")
		return {
			gameExists: true,
			online: data.online,
		};
	return {
		gameExists: false,
		online: 0,
	};
};

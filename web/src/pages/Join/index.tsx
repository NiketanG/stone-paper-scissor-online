import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { API_URL } from "../../utils/constants";

import { errorToast } from "../../utils/showToast";
type Params = {
	gameId: string;
};

const Join: React.FC<any> = () => {
	const params = useParams<Params>();
	const history = useHistory();

	const searchGame = async () => {
		const res = await fetch(`${API_URL}api/search/game`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ game_id: params.gameId }),
		});

		const data = await res.json();
		if (data.result === "fail") {
			errorToast("Game does'nt exist");
			history.replace({
				pathname: "/",
			});
		}

		if (data.result === "success")
			history.replace({
				pathname: "/game",
				state: {
					gameId: params.gameId,
					mode: "JOIN",
				},
			});
	};
	useEffect(() => {
		searchGame();
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen ">
			<p className="text-2xl md:text-4xl my-2">Joining Game</p>
			<p className="my-8">Game ID: {params.gameId}</p>
		</div>
	);
};

export default Join;

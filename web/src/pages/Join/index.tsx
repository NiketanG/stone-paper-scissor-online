import { FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useNavigate, useParams } from "react-router";
import { API_URL } from "../../utils/constants";

import { errorToast } from "../../utils/showToast";
type Params = {
	gameId: string;
};

const Join: FunctionComponent<any> = () => {
	const params = useParams<Params>();
	const navigate = useNavigate();

	const searchGame = async () => {
		const res = await fetch(`${API_URL}api/search/game`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ game_id: params.gameId }),
		});

		const data = await res.json();
		if (data.result === "fail") {
			errorToast("Game does'nt exist");
			navigate(
				{
					pathname: "/",
				},
				{
					replace: true,
				}
			);
		}

		if (data.result === "success")
			navigate(`/game?gameId=${params.gameId}`, {
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

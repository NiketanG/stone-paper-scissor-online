// import React, { useEffect, useRef, useState } from "react";
import {
	Link,
	useLocation,
	useNavigate,
	useSearchParams,
} from "react-router-dom";
import { API_URL } from "../../utils/constants";
import { searchGame } from "../../utils/searchGame";
import socket from "../../utils/socket";
import { errorToast, showToast } from "../../utils/showToast";
import { Moves } from "../../utils/types";
import Move from "../../Components/Move";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { FunctionalComponent } from "preact";

type BoardProps = {
	mode: "CREATE" | "JOIN";
	gameId: number | string;
	data: {
		xScore: number;
		yScore: number;
		yourMove: Moves;
		opponentMove: Moves;
		winner: Moves | null;
		gameStatus: string | null;
		enableRestart: boolean;
	};
	makeMove: (move: Moves) => void;
	restartGame: () => void;
};

const Board: FunctionalComponent<BoardProps> = ({
	mode,
	gameId,
	data: {
		xScore,
		yScore,
		yourMove,
		opponentMove,
		winner,
		gameStatus,
		enableRestart,
	},
	makeMove,
	restartGame,
}) => {
	return (
		<div className="flex flex-col w-screen  items-center">
			<div className="text-center flex flex-col items-center ">
				<h1>Score</h1>
				<p className="text-sm text-gray-800 md:text-base">
					You: {mode === "CREATE" ? xScore : yScore} |{" "}
					{(gameId as any) === "COMPUTER" ? "Computer" : "Opponent"}:{" "}
					{mode === "CREATE" ? yScore : xScore}
				</p>
			</div>

			<div className="flex justify-evenly items-center flex-row mt-12 mb-12 w-full">
				<div
					className={`
					flex items-center justify-center rounded-full w-24 h-24 md:w-48 md:h-48 ${yourMove === winner ? "bg-green-50" : "bg-transparent"}`}
				>
					<Move move={yourMove as Moves} />
				</div>
				<span className="text-sm md:text-xl text-gray-500">vs</span>
				<div
					className={`
					flex items-center justify-center rounded-full w-24 h-24 md:w-48 md:h-48 
					${opponentMove === winner ? "bg-green-50" : "bg-transparent"}`}
				>
					<Move
						move={opponentMove as Moves}
						isComputer={gameId === "COMPUTER"}
					/>
				</div>
			</div>

			<div className="flex justify-evenly flex-row  w-full">
				{["Stone", "Paper", "Scissor"].map((move) => (
					<div
						key={move}
						className={`transition ${
							yourMove === "Thinking" ? "hover:bg-gray-50" : ""
						} flex items-center justify-center rounded-full w-20 h-20 md:w-40 md:h-40 ${
							yourMove === move ? "bg-gray-100" : "bg-transparent"
						}
						`}
						onClick={() => makeMove(move as Moves)}
					>
						<Move move={move as Moves} />
					</div>
				))}
			</div>

			<p className="mt-16 text-gray-500 text-sm md:text-base">
				{gameStatus}
			</p>

			{enableRestart && (
				<button
					className="mt-8 mb-4 px-4 py-3 bg-white border border-black rounded hover:text-white hover:bg-black transition"
					onClick={restartGame}
				>
					Restart
				</button>
			)}
		</div>
	);
};

function calculateWinner(
	xMove: string,
	yMove: string
): {
	winner: Moves | null;
	gameTied: boolean;
} | null {
	const winner = [
		[["Stone", "Paper"], "Paper"],
		[["Paper", "Scissor"], "Scissor"],
		[["Stone", "Scissor"], "Stone"],
	];
	if (xMove === yMove) {
		return {
			winner: null,
			gameTied: true,
		};
	} else {
		for (let i = 0; i < winner.length; i++) {
			if (winner[i][0].includes(xMove) && winner[i][0].includes(yMove)) {
				return {
					winner: winner[i][1] as Moves,
					gameTied: false,
				};
			}
		}
	}

	return null;
}

type LocationStateType = {
	gameId: number;
	mode: "CREATE" | "JOIN";
};

type SocketConnectedData = {
	game_id: string;
	online: string[];
};

type FetchGameResponse = {
	result: "fail" | "success";
	xMove: Moves;
	yMove: Moves;
	xScore: number;
	yScore: number;
};

type onMoveResponse = {
	move: Moves;
	player: "X" | "Y";
};

const Game: FunctionalComponent<any> = () => {
	const [online, setOnline] = useState(0);

	const [xScore, setXScore] = useState(0);
	const [yScore, setYScore] = useState(0);
	const [yourMove, setYourMove] = useState<Moves>("Thinking");

	const xScoreRef = useRef(xScore);
	const yScoreRef = useRef(yScore);

	const [opponentMove, setOpponentMove] = useState<Moves>("Thinking");

	const yourMoveRef = useRef(yourMove);
	const opponentMoveRef = useRef(opponentMove);

	const [fetchedOpponentMove, setFetchedOpponentMove] =
		useState<Moves>("Thinking");

	const [winner, setWinner] = useState<Moves | null>(null);
	const [gameStatus, setGameStatus] = useState<string | null>(null);
	const [enableRestart, setEnableRestart] = useState(false);

	const location = useLocation();

	const mode = (location.state as LocationStateType)?.mode || "JOIN";
	const playingAs = mode === "CREATE" ? "X" : "Y";

	const onRestart = () => {
		setYourMove("Thinking");
		setFetchedOpponentMove("Thinking");
		setEnableRestart(false);
		setOpponentMove("Thinking");
		setGameStatus(null);
		setWinner(null);
		showToast("Game Restarted !");
	};

	useEffect(() => {
		yourMoveRef.current = yourMove;
		opponentMoveRef.current = opponentMove;
		xScoreRef.current = xScore;
		yScoreRef.current = yScore;
	});

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const gameId = useMemo(
		() =>
			(location.state as LocationStateType)?.gameId ??
			searchParams.get("gameId"),
		[location, searchGame]
	);

	// Socket related
	const [connectedData, setConnectedData] =
		useState<SocketConnectedData | null>(null);

	const prevConnectedRef = useRef<SocketConnectedData | null>();
	useEffect(() => {
		//assign the ref's current value to the count Hook
		prevConnectedRef.current = connectedData;
	}, [connectedData]);

	const connected = (data: SocketConnectedData) => {
		// setConnected(data);
		const currentPlayer = mode === "CREATE" ? "X" : "O";
		// Notify when opponent joins

		if (
			prevConnectedRef?.current?.online.length === 1 &&
			data.online.length === 2 &&
			prevConnectedRef?.current?.online.includes(currentPlayer)
		) {
			showToast("🆕  Opponent joined");
		}

		if (
			prevConnectedRef?.current?.online.length === 2 &&
			data.online.length === 1
		) {
			showToast("❌  Opponent left");
		}
		setConnectedData(data);
		setOnline(data.online.length);
	};

	const checkIfGameExists = async () => {
		const gameExists = await searchGame(gameId.toString());
		if (!gameExists) {
			errorToast("Game doesn't exist");
			navigate("/", {
				replace: true,
			});
		}
	};

	useEffect(() => {
		if (gameId && (gameId as any) !== "COMPUTER") checkIfGameExists();
	}, [gameId]);

	useEffect(() => {
		if ((gameId as any) !== "COMPUTER") {
			if (location.state !== undefined && gameId)
				socket.emit("join", {
					game_id: gameId,
					player: mode === "CREATE" ? "X" : "O",
				});

			socket.on("connected", connected);
			socket.on("disconnected", connected);
			return () => {
				socket.emit("leave", {
					game_id: gameId,
					player: mode === "CREATE" ? "X" : "O",
				});
				socket.off("connected", connected);
				socket.off("disconnected", connected);
			};
		}
	}, [gameId]);

	if (!location.state || !gameId) {
		navigate("/", {
			replace: true,
		});
	}

	const getGame = async () => {
		const res = await fetch(`${API_URL}api/fetch/game`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				game_id: gameId,
			}),
		});
		const data: FetchGameResponse = await res.json();

		if (data.result === "success") {
			if (playingAs === "X") {
				setYourMove(data.xMove);
				if (data.yMove !== "Thinking") {
					if (data.xMove !== "Thinking") {
						setOpponentMove(data.yMove);
						setEnableRestart(true);
						const gameResult = calculateWinner(
							data.xMove,
							data.yMove
						);
						if (gameResult?.winner) {
							setGameStatus("Winner: " + gameResult.winner);
							setWinner(gameResult.winner);
						}
						if (gameResult?.gameTied) setGameStatus("Game tied");
					} else {
						setFetchedOpponentMove(data.yMove);
					}
				}
			} else {
				setYourMove(data.yMove);
				if (data.xMove !== "Thinking") {
					if (data.yMove !== "Thinking") {
						setOpponentMove(data.xMove);
						setEnableRestart(true);
						const gameResult = calculateWinner(
							data.xMove,
							data.yMove
						);
						if (gameResult?.winner) {
							setGameStatus("Winner: " + gameResult.winner);
							setWinner(gameResult.winner);
						}
						if (gameResult?.gameTied) setGameStatus("Game tied");
					} else {
						setFetchedOpponentMove(data.xMove);
					}
				}
			}
			setXScore(data.xScore);
			setYScore(data.yScore);
		} else if (data.result === "fail") {
			errorToast("Game doesn't exist");
			navigate("/", {
				replace: true,
			});
			// history.replace({ pathname: "/" });
		}
	};

	const onMove = (data: onMoveResponse) => {
		if (yourMoveRef.current !== "Thinking") {
			if (data.player !== playingAs) {
				setOpponentMove(data.move);
				const gameResult = calculateWinner(
					yourMoveRef.current,
					data.move
				);
				if (gameResult) {
					setEnableRestart(true);
					if (gameResult.gameTied) {
						setGameStatus("Game Tied");
						showToast("Game Tied");
					}

					if (gameResult.winner) {
						let winnerPlayer: "X" | "Y";
						setGameStatus("Winner: " + gameResult.winner);
						setWinner(gameResult.winner);

						if (gameResult.winner === yourMoveRef.current) {
							winnerPlayer = playingAs;
							showToast("You won 🎉️");
						} else {
							winnerPlayer = playingAs === "X" ? "Y" : "X";
							showToast("You lost");
						}

						if (winnerPlayer === "X") {
							setXScore(xScoreRef.current + 1);
						} else if (winnerPlayer === "Y") {
							setYScore(yScoreRef.current + 1);
						}
					}
					if (gameResult?.gameTied) setGameStatus("Game tied");
				}
			}
		} else if (yourMoveRef.current === "Thinking") {
			if (data.player !== playingAs) {
				setOpponentMove("Unknown");
				setFetchedOpponentMove(data.move);
			}
		}
	};

	const enqueueComputerMove = () => {
		// Computer move
		const moves = ["Stone", "Paper", "Scissor"];
		const randomMove = moves[Math.floor(Math.random() * moves.length)];

		// Wait for 1 second
		setTimeout(() => {
			onMove({
				move: randomMove as Moves,
				player: "Y",
			});
		}, 1000);
	};

	const makeMove = (move: Moves) => {
		if (yourMove === "Thinking") {
			setYourMove(move);
			if (fetchedOpponentMove !== "Thinking") {
				setOpponentMove(fetchedOpponentMove);
				const gameResult = calculateWinner(move, fetchedOpponentMove);
				setOpponentMove(fetchedOpponentMove);
				if (gameResult) {
					if (gameResult.gameTied) {
						setGameStatus("Game Tied");
						showToast("Game Tied");
					}
					setEnableRestart(true);
					if (gameResult.winner) {
						let winnerPlayer: "X" | "Y";
						setGameStatus("Winner: " + gameResult.winner);
						setWinner(gameResult.winner);
						if (gameResult.winner === move) {
							winnerPlayer = playingAs;
							showToast("You won 🎉️");
						} else {
							winnerPlayer = playingAs === "X" ? "Y" : "X";
							showToast("You lost");
						}

						if (winnerPlayer === "X") {
							setXScore(xScoreRef.current + 1);
						} else if (winnerPlayer === "Y") {
							setYScore(yScoreRef.current + 1);
						}
						if ((gameId as any) !== "COMPUTER") {
							socket.emit("winner", {
								game_id: gameId,
								winner: winnerPlayer,
							});
						}
					}
				}
			}
			if ((gameId as any) !== "COMPUTER") {
				socket.emit("move", {
					move,
					game_id: gameId,
					player: playingAs,
				});
			} else {
				onMove({
					move: move,
					player: "X",
				});

				enqueueComputerMove();
			}
		}
	};

	const restartGame = () => {
		if (gameId && (gameId as any) !== "COMPUTER") {
			socket.emit("restartGame", { game_id: gameId });
		} else {
			onRestart();
		}
	};

	useEffect(() => {
		if (gameId && (gameId as any) !== "COMPUTER") {
			getGame();
			socket.on("moved", onMove);
			socket.on("restarted", onRestart);
			return () => {
				socket.off("moved", onMove);
				socket.off("restarted", onRestart);
			};
		}
	}, []);

	return (
		<div
			className="flex flex-col items-center px-4"
			style={{
				height: window.innerHeight,
			}}
		>
			<Link to="/" className="underline text-gray-500">
				Go Home
			</Link>

			{(gameId as any) !== "COMPUTER" ? (
				<p className="self-end md:text-lg">Joined: {online}</p>
			) : null}

			<div className="flex-grow-1 h-full justify-center flex flex-col">
				<Board
					gameId={gameId}
					mode={mode}
					data={{
						xScore,
						yScore,
						yourMove,
						opponentMove,
						winner,
						gameStatus,
						enableRestart,
					}}
					makeMove={makeMove}
					restartGame={restartGame}
				/>
			</div>

			{(gameId as any) !== "COMPUTER" ? (
				<a
					target="_blank"
					href={window.location.origin + "/join/" + gameId}
					className="my-4 text-gray-500 text-sm md:text-base"
					rel="noreferrer"
				>
					Game: {gameId}
				</a>
			) : null}
		</div>
	);
};

export default Game;

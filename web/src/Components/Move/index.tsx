import React from "react";
import { Moves } from "../../utils/types";

type MoveProps = {
	move: Moves;
};
const Move: React.FC<MoveProps> = ({ move }) => (
	<button className="focus:outline-none text-5xl md:text-8xl" title={move}>
		{move === "Stone" && "✊️"}
		{move === "Paper" && "🖐️"}
		{move === "Scissor" && "✌️"}
		{move === "Thinking" && "🤔️"}
		{move === "Unknown" && "❓️"}
	</button>
);

export default Move;

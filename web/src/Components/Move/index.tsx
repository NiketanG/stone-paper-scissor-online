import { FunctionComponent } from "preact";
import { Moves } from "../../utils/types";

type MoveProps = {
	move: Moves;
	isComputer?: boolean;
};
const Move: FunctionComponent<MoveProps> = ({ move, isComputer }) => (
	<button className="focus:outline-none text-5xl md:text-8xl" title={move}>
		{move === "Stone" && "✊️"}
		{move === "Paper" && "🖐️"}
		{move === "Scissor" && "✌️"}
		{move === "Thinking" && (isComputer ? "🤖" : "🤔")}
		{move === "Unknown" && "❓️"}
	</button>
);

export default Move;

export const API_URL =
	import.meta.env.NODE_ENV === "development" ||
	import.meta.env.MODE === "development"
		? import.meta.env.VITE_API_URL
		: "/";

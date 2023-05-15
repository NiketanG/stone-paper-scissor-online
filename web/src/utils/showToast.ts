/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { toast, Slide, ToastOptions } from "react-toastify";

const ToastConfig: ToastOptions = {
	position: "bottom-center",
	hideProgressBar: true,
	draggable: false,
	autoClose: 2000,
	pauseOnHover: false,
	closeOnClick: true,
	transition: Slide,

	bodyClassName: "flex items-center flex-row text-black rounded-lg",
};

export const errorToast = (text = "An error occured") =>
	toast(text, {
		...ToastConfig,
		type: "error",
		bodyClassName: "flex items-center flex-row text-red-500 rounded-lg",
	});

export const showToast = (text: string) =>
	toast(text, {
		...ToastConfig,
		transition: Slide,
	});

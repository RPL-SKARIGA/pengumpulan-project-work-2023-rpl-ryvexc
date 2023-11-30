import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getStartOfWeekMonday(date: Date) {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0); // Clear hours, minutes, seconds, and milliseconds
	const dayOfWeek = d.getDay();
	const diff = d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to the previous Monday
	d.setDate(diff);
	return d;
}

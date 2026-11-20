import { useEffect, useRef, useState } from "react";

export function useDebounce<T>({
	value,
	delay = 300,
	onDebounceStart,
	onDebounceEnd,
}: {
	value: T;
	delay?: number;
	onDebounceStart?: () => void;
	onDebounceEnd?: () => void;
}): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const onDebounceStartRef = useRef(onDebounceStart);
	const onDebounceEndRef = useRef(onDebounceEnd);

	useEffect(() => {
		onDebounceStartRef.current = onDebounceStart;
	}, [onDebounceStart]);

	useEffect(() => {
		onDebounceEndRef.current = onDebounceEnd;
	}, [onDebounceEnd]);

	useEffect(() => {
        onDebounceStartRef.current?.();

		const timer = setTimeout(() => {
			setDebouncedValue(value);
			onDebounceEndRef.current?.();
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
}

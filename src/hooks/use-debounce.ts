import { useEffect, useRef, useState } from "react";

export function useDebounce<T>({
    value,
    delay = 300,
    onDebounce,
}: {
    value: T;
    delay?: number;
    onDebounce?: () => void;
}): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const onDebounceRef = useRef(onDebounce);

    useEffect(() => {
        onDebounceRef.current = onDebounce;
    }, [onDebounce]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
            onDebounceRef.current?.();
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
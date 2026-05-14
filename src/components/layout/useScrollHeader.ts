"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollHeaderOptions = {
    hideAfter?: number;
    delta?: number;
};

export function useScrollHeader({
    hideAfter = 96,
    delta = 8,
}: UseScrollHeaderOptions = {}) {
    const [isHidden, setIsHidden] = useState(false);
    const [isCompact, setIsCompact] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        const updateHeader = () => {
            const currentScrollY = Math.max(window.scrollY, 0);
            const scrollDelta = currentScrollY - lastScrollY.current;

            setIsCompact(currentScrollY > delta);

            if (currentScrollY <= delta) {
                setIsHidden(false);
            } else if (
                scrollDelta > delta &&
                currentScrollY > hideAfter
            ) {
                setIsHidden(true);
            } else if (scrollDelta < -delta) {
                setIsHidden(false);
            }

            lastScrollY.current = currentScrollY;
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateHeader);
                ticking.current = true;
            }
        };

        updateHeader();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, [delta, hideAfter]);

    return { isHidden, isCompact };
}

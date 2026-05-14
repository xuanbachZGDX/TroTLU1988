import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const customScrollToTop = (duration) => {
      const startPos = window.pageYOffset;
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - --t * t * t * t;

      const animateScroll = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuart(progress);

        window.scrollTo(0, startPos * (1 - easedProgress));

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    };

    customScrollToTop(800);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;

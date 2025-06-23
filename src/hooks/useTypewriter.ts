import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 20) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // This effect handles the "typing" animation.
    // It only runs if the displayedText is shorter than the target text.
    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeoutId);
    }
  }, [displayedText, text, speed]);

  // This effect handles the text updates from the stream.
  // If the incoming text is shorter than what's displayed, it means a new stream has started.
  if (text.length < displayedText.length) {
    setDisplayedText(text);
  }

  return displayedText;
}

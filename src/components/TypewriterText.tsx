import { useTypewriter } from '../hooks/useTypewriter';

export function TypewriterText({ text, delay = 30 }: { text: string; delay?: number }) {
  const { displayed, done } = useTypewriter(text, delay);
  return (
    <>
      {displayed}
      {!done && (
        <span className="inline-block w-0.5 h-4 bg-emerald-500 ml-0.5 animate-pulse align-middle" />
      )}
    </>
  );
}

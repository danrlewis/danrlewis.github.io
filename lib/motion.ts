export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export function fadeUpProps(delay = 0, duration = 0.9) {
  return {
    initial: { y: 28, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay, duration, ease: ease.out },
  } as const;
}

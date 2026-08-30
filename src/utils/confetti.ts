import confetti from 'canvas-confetti';

/**
 * Fires a cyberpunk amber/gold particle burst micro-interaction.
 */
export function fireCyberpunkConfetti(options?: confetti.Options) {
  // Use amber, gold, emerald, and bright white particles
  const colors = ['#F59E0B', '#FCD34D', '#10B981', '#FFFFFF', '#F43F5E'];

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors,
    disableForReducedMotion: true,
    ...options
  });
}

/**
 * Fires a celebratory particle cannon for major milestones (e.g. resume download).
 */
export function fireMilestoneCannon() {
  const colors = ['#F59E0B', '#FCD34D', '#10B981', '#FFFFFF'];
  const end = Date.now() + 1000;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

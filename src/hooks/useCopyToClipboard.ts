import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetDelayMs = 2500): [boolean, (text: string) => Promise<boolean>] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return false;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelayMs);
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopied(false);
      return false;
    }
  }, [resetDelayMs]);

  return [copied, copy];
}

/** Maps a 0-100 score to a CSS colour */
export function getScoreColor(score: number): string {
  if (score >= 90) return '#D4AF37';  // Gold / primary
  if (score >= 70) return '#10b981';  // Emerald
  if (score >= 40) return '#f59e0b';  // Amber
  return '#f43f5e';                   // Rose
}

export function getScoreGlow(score: number): string {
  if (score >= 90) return 'rgba(212,175,55,0.5)';
  if (score >= 70) return 'rgba(16,185,129,0.4)';
  if (score >= 40) return 'rgba(245,158,11,0.4)';
  return 'rgba(244,63,94,0.4)';
}

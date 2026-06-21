import { Match, BetRecord } from './mockData';

export function generateShareLink(matches: Match[]): string {
  const matchIds = matches.map((m) => m.id).join(',');
  const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1).toFixed(2);
  return `${window.location.origin}?watchlist=${matchIds}&odds=${totalOdds}`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function generatePredictionSummary(matches: Match[]): string {
  const summary = matches
    .map((m) => {
      return `${m.homeTeam} vs ${m.awayTeam} - ${m.prediction.result.toUpperCase()} (${m.prediction.confidence}%, Odds: ${m.odds})`;
    })
    .join('\n');

  const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1).toFixed(2);
  const potentialWin = (100 * parseFloat(totalOdds)).toFixed(2);

  return `🎯 KADI PREDICTIONS WATCHLIST\n\n${summary}\n\nTotal Odds: ${totalOdds}\nPotential Return on $100: $${potentialWin}\n\nGenerated on ${new Date().toLocaleString()}`;
}

export function exportWatchlistAsJSON(matches: Match[]): string {
  return JSON.stringify(
    {
      exported: new Date().toISOString(),
      totalMatches: matches.length,
      totalOdds: matches.reduce((acc, m) => acc * m.odds, 1),
      matches: matches.map((m) => ({
        id: m.id,
        homeTeam: m.homeTeam,
        awayTeam: m.awayTeam,
        league: m.league,
        prediction: m.prediction,
        odds: m.odds,
        date: m.date,
      })),
    },
    null,
    2
  );
}

export function downloadAsJSON(data: string, filename: string = 'watchlist.json'): void {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function generateBettingHistoryHTML(records: BetRecord[]): string {
  const totalStaked = records.reduce((sum, r) => sum + r.stakeAmount, 0);
  const totalReturned = records.reduce((sum, r) => sum + (r.returnAmount || 0), 0);
  const totalProfit = records.reduce((sum, r) => sum + (r.profit || 0), 0);
  const wins = records.filter((r) => r.result === 'win').length;
  const losses = records.filter((r) => r.result === 'loss').length;
  const winRate = records.length > 0 ? ((wins / records.length) * 100).toFixed(1) : 0;

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>KADI Betting History Report</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #f0f0f0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #00ff88; margin-bottom: 20px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
        .stat-card { background: #1a1a1a; border: 1px solid #00ff88; padding: 15px; border-radius: 8px; }
        .stat-value { font-size: 24px; font-weight: bold; color: #00ff88; }
        .stat-label { font-size: 12px; color: #999; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #1a1a1a; color: #00ff88; padding: 12px; text-align: left; border-bottom: 2px solid #00ff88; }
        td { padding: 12px; border-bottom: 1px solid #333; }
        tr:hover { background-color: #1a1a1a; }
        .win { color: #00ff88; }
        .loss { color: #ff3366; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>KADI Betting History Report</h1>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${records.length}</div>
            <div class="stat-label">Total Bets</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${winRate}%</div>
            <div class="stat-label">Win Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: ${totalProfit >= 0 ? '#00ff88' : '#ff3366'};">
              ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}
            </div>
            <div class="stat-label">Total Profit</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${(((totalProfit / totalStaked) * 100).toFixed(1))}%</div>
            <div class="stat-label">ROI</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Match</th>
              <th>Prediction</th>
              <th>Odds</th>
              <th>Stake</th>
              <th>Result</th>
              <th>Profit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${records
              .map(
                (r) => `
              <tr>
                <td>${r.homeTeam} vs ${r.awayTeam}</td>
                <td>${r.prediction}</td>
                <td>${r.odds.toFixed(2)}</td>
                <td>$${r.stakeAmount.toFixed(2)}</td>
                <td><span class="${r.result === 'win' ? 'win' : 'loss'}">${r.result.toUpperCase()}</span></td>
                <td style="color: ${(r.profit || 0) >= 0 ? '#00ff88' : '#ff3366'};">
                  ${(r.profit || 0) >= 0 ? '+' : ''}$${(r.profit || 0).toFixed(2)}
                </td>
                <td>${r.matchDate.toLocaleDateString()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>KADI Sports Analytics & Predictions</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export function downloadAsHTML(html: string, filename: string = 'report.html'): void {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function shareToSocialMedia(url: string, platform: 'twitter' | 'facebook' | 'whatsapp'): void {
  const text = encodeURIComponent(
    'Check out my KADI sports predictions watchlist! High confidence predictions with real-time odds updates.'
  );

  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
  };

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

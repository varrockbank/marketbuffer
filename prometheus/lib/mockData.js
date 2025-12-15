// Mock data tree for all TUI views
// Each path maps to an array of content lines

export const mockData = {
  // ============================================
  // YAP - Chat/Messaging
  // ============================================
  yap: {
    // AI Chats
    'market-analysis': [
      'claude: Based on current technicals, SPY is testing resistance at 480.',
      'you: What about NVDA? Seems overextended.',
      'claude: NVDA RSI at 72, approaching overbought. Consider trailing stops.',
      'you: Good call. Setting stop at 485.',
      'claude: Noted. Also watching AMD for a sympathy play if NVDA pulls back.',
    ],
    'portfolio-review': [
      'claude: Your portfolio is up 12.4% YTD vs SPY +8.2%.',
      'claude: Top performer: NVDA (+45%), Laggard: JNJ (-4.2%).',
      'you: Should I trim NVDA position?',
      'claude: Consider taking 25% off the table to lock in gains.',
      'claude: JNJ may recover with healthcare rotation. Hold for now.',
    ],
    'trading-strategy': [
      'you: Thinking about adding momentum to my strategy.',
      'claude: 10-day momentum works well in trending markets.',
      'claude: Backtest shows +18% annual return, 1.4 Sharpe.',
      'you: What about mean reversion as a complement?',
      'claude: Good diversification. They tend to be uncorrelated.',
    ],
    // DMs
    alice: [
      'alice: Hey, did you see that AAPL earnings report?',
      'you: Yeah, beat estimates. Services revenue was strong.',
      'alice: Thinking of adding to my position.',
      'you: I bought some calls last week. Looking good so far.',
    ],
    bob: [
      'bob: Quick question - what broker do you use for options?',
      'you: IBKR for the low commissions.',
      'bob: How are the fills?',
      'you: Generally good, especially for liquid names.',
    ],
    charlie: [
      'charlie: That energy trade worked out!',
      'you: Nice! What was your entry on XOM?',
      'charlie: $98.50, sold at $104. Quick 5.5%.',
      'you: Well played. I missed that one.',
    ],
    dave: [
      'dave: New to trading. Any book recommendations?',
      'you: Market Wizards by Schwager is a classic.',
      'dave: Thanks! Ill check it out.',
      'you: Also Trading in the Zone for psychology.',
    ],
    // Channels
    general: [
      'alice: Good morning everyone! Ready for another trading day?',
      'bob: Morning! Watching the pre-market closely.',
      'charlie: Fed announcement might affect tech stocks.',
      'alice: Keeping an eye on AAPL and MSFT.',
      'dave: Just joined. Whats the sentiment today?',
      'bob: Cautiously optimistic. Futures are green.',
    ],
    random: [
      'eve: Anyone watching the game tonight?',
      'bob: Lakers vs Celtics? Definitely.',
      'alice: More of a football person myself.',
      'charlie: Speaking of random, anyone tried that new coffee shop?',
    ],
    trading: [
      'bob: NVDA breaking out of the wedge pattern.',
      'alice: Volume confirming the move. Looks legit.',
      'charlie: Just entered at 468. Stop at 460.',
      'dave: What timeframe are you looking at?',
      'bob: Daily chart, but watching 15min for entries.',
    ],
    markets: [
      'eve: 10Y yield spiking. Could pressure growth stocks.',
      'bob: Good point. Rotating to value names.',
      'alice: Energy and financials looking strong.',
      'charlie: XLE up 2% premarket on oil news.',
    ],
    tech: [
      'alice: Anyone using the new IBKR TWS update?',
      'bob: Yeah, the new charting is nice.',
      'dave: Still prefer TradingView for analysis.',
      'charlie: TradingView + IBKR for execution is my setup.',
    ],
    'off-topic': [
      'eve: Working from home today. Much better focus.',
      'alice: Same. No commute = more research time.',
      'bob: I need the office energy personally.',
      'charlie: Hybrid is the way. Best of both.',
    ],
  },

  // ============================================
  // DATA - Tables and Datasets
  // ============================================
  data: {
    portfolio: {
      columns: ['id', 'ticker', 'shares', 'avg_cost', 'current_price', 'pnl'],
      rows: [
        [1, 'AAPL', 150, 142.50, 178.25, 5362.50],
        [2, 'MSFT', 75, 285.00, 378.50, 7012.50],
        [3, 'GOOGL', 40, 125.75, 138.92, 526.80],
        [4, 'AMZN', 60, 145.20, 178.35, 1989.00],
        [5, 'NVDA', 25, 420.00, 495.80, 1895.00],
        [6, 'TSLA', 30, 265.50, 248.20, -519.00],
        [7, 'META', 45, 298.00, 505.75, 9348.75],
        [8, 'JPM', 80, 145.25, 198.40, 4252.00],
      ],
      totalRows: 1247,
    },
    transactions: {
      columns: ['id', 'date', 'ticker', 'type', 'shares', 'price', 'total'],
      rows: [
        [1, '2024-12-01', 'NVDA', 'BUY', 25, 465.20, 11630.00],
        [2, '2024-11-28', 'AAPL', 'BUY', 50, 189.50, 9475.00],
        [3, '2024-11-25', 'MSFT', 'SELL', 25, 378.91, 9472.75],
        [4, '2024-11-22', 'GOOGL', 'BUY', 40, 125.75, 5030.00],
        [5, '2024-11-20', 'TSLA', 'SELL', 20, 248.20, 4964.00],
        [6, '2024-11-15', 'META', 'BUY', 45, 298.00, 13410.00],
      ],
      totalRows: 8421,
    },
    watchlist: {
      columns: ['ticker', 'name', 'price', 'change', 'volume', 'alert'],
      rows: [
        ['AMD', 'Advanced Micro Devices', 148.50, '+2.3%', '45.2M', '$150.00'],
        ['PLTR', 'Palantir Technologies', 24.80, '+5.1%', '82.1M', '$25.00'],
        ['SNOW', 'Snowflake Inc', 168.25, '-1.2%', '12.4M', '$175.00'],
        ['CRWD', 'CrowdStrike Holdings', 285.40, '+0.8%', '8.2M', '$290.00'],
        ['DDOG', 'Datadog Inc', 125.60, '+1.5%', '6.8M', '$130.00'],
      ],
      totalRows: 45,
    },
    stocks_daily: {
      columns: ['date', 'ticker', 'open', 'high', 'low', 'close', 'volume'],
      rows: [
        ['2024-12-01', 'AAPL', 178.50, 180.25, 177.80, 179.25, 52340000],
        ['2024-12-01', 'MSFT', 378.00, 382.50, 376.20, 380.15, 28450000],
        ['2024-12-01', 'GOOGL', 138.20, 140.15, 137.50, 139.80, 18920000],
        ['2024-12-01', 'NVDA', 468.00, 475.50, 465.20, 472.30, 45680000],
        ['2024-12-01', 'TSLA', 250.00, 252.80, 245.50, 248.20, 82150000],
        ['2024-11-30', 'AAPL', 176.80, 179.00, 175.50, 178.50, 48920000],
      ],
      totalRows: 2100000,
    },
    stocks_intraday: {
      columns: ['timestamp', 'ticker', 'price', 'volume', 'bid', 'ask'],
      rows: [
        ['14:32:15', 'AAPL', 179.25, 1250, 179.24, 179.26],
        ['14:32:14', 'AAPL', 179.24, 800, 179.23, 179.25],
        ['14:32:13', 'MSFT', 380.15, 450, 380.14, 380.16],
        ['14:32:12', 'NVDA', 472.30, 2100, 472.28, 472.32],
        ['14:32:11', 'GOOGL', 139.80, 680, 139.79, 139.81],
      ],
      totalRows: 48000000,
    },
    earnings: {
      columns: ['ticker', 'date', 'quarter', 'eps_est', 'eps_act', 'surprise'],
      rows: [
        ['AAPL', '2024-11-01', 'Q4 2024', 1.39, 1.46, '+5.0%'],
        ['MSFT', '2024-10-30', 'Q1 2025', 2.95, 3.10, '+5.1%'],
        ['GOOGL', '2024-10-29', 'Q3 2024', 1.85, 1.75, '-5.4%'],
        ['AMZN', '2024-10-31', 'Q3 2024', 1.14, 1.20, '+5.3%'],
        ['META', '2024-10-30', 'Q3 2024', 5.28, 5.42, '+2.7%'],
        ['NVDA', '2024-11-20', 'Q3 2025', 0.74, 0.81, '+9.5%'],
      ],
      totalRows: 125000,
    },
    fundamentals: {
      columns: ['ticker', 'pe_ratio', 'market_cap', 'dividend', 'beta', 'sector'],
      rows: [
        ['AAPL', 29.5, '2.8T', '0.48%', 1.25, 'Technology'],
        ['MSFT', 35.2, '2.9T', '0.72%', 0.92, 'Technology'],
        ['GOOGL', 24.8, '1.7T', '0.00%', 1.08, 'Technology'],
        ['AMZN', 62.4, '1.9T', '0.00%', 1.22, 'Consumer'],
        ['NVDA', 65.8, '1.2T', '0.03%', 1.85, 'Technology'],
        ['JPM', 11.2, '580B', '2.25%', 1.12, 'Financial'],
      ],
      totalRows: 42000,
    },
    options_chain: {
      columns: ['ticker', 'expiry', 'strike', 'type', 'bid', 'ask', 'volume'],
      rows: [
        ['AAPL', '2024-12-20', 180.00, 'CALL', 2.45, 2.48, 15420],
        ['AAPL', '2024-12-20', 180.00, 'PUT', 3.12, 3.15, 12350],
        ['NVDA', '2024-12-20', 500.00, 'CALL', 8.50, 8.65, 28400],
        ['NVDA', '2024-12-20', 450.00, 'PUT', 5.20, 5.35, 18200],
        ['TSLA', '2024-12-20', 250.00, 'CALL', 12.80, 12.95, 45600],
        ['SPY', '2024-12-20', 480.00, 'CALL', 4.25, 4.30, 125000],
      ],
      totalRows: 890000,
    },
  },

  // ============================================
  // STREAM - News and Feeds
  // ============================================
  stream: {
    'all-news': [
      { source: 'Bloomberg', time: '2m', title: 'Fed Officials Signal Potential Rate Cut in Early 2025' },
      { source: 'Reuters', time: '15m', title: 'Apple Announces $100B Stock Buyback Program' },
      { source: 'SEC', time: '45m', title: 'Microsoft Corp - Form 10-K Annual Report Filed' },
      { source: 'WSJ', time: '1h', title: 'Oil Prices Surge 4% on Middle East Supply Concerns' },
      { source: 'Bloomberg', time: '1h', title: 'Tesla Deliveries Miss Estimates' },
    ],
    earnings: [
      { source: 'Earnings', time: '5m', title: 'AAPL Q4 EPS $1.46 vs $1.39 est, Revenue $89.5B vs $88.2B' },
      { source: 'Earnings', time: '1h', title: 'MSFT Cloud Revenue +29% YoY, Beats Estimates' },
      { source: 'Earnings', time: '2h', title: 'GOOGL Ad Revenue Disappoints, Stock Down 3% AH' },
      { source: 'Earnings', time: '4h', title: 'AMZN AWS Growth Slows to 12%, Guidance Weak' },
      { source: 'Preview', time: '1d', title: 'NVDA Reports Tomorrow - Options Imply 8% Move' },
    ],
    'sec-filings': [
      { source: 'Form 4', time: '10m', title: 'NVDA CEO Jensen Huang sells 100,000 shares @ $468' },
      { source: '10-K', time: '45m', title: 'Microsoft Corp - Annual Report Filed' },
      { source: '8-K', time: '2h', title: 'Tesla - Material Event: New Factory Announcement' },
      { source: '13F', time: '1d', title: 'Berkshire Q3 Holdings: Added OXY, Trimmed AAPL' },
      { source: 'Form 4', time: '1d', title: 'META Zuckerberg sells 50,000 shares @ $505' },
    ],
    bloomberg: [
      { source: 'Bloomberg', time: '2m', title: 'Fed Officials Signal Potential Rate Cut in Early 2025' },
      { source: 'Bloomberg', time: '1h', title: 'Tesla Deliveries Miss Estimates' },
      { source: 'Bloomberg', time: '3h', title: 'China Tech Stocks Rally on Stimulus Hopes' },
      { source: 'Bloomberg', time: '5h', title: 'Gold Hits Record High Amid Geopolitical Tensions' },
    ],
    reuters: [
      { source: 'Reuters', time: '15m', title: 'Apple Announces $100B Stock Buyback Program' },
      { source: 'Reuters', time: '2h', title: 'European Markets Close Higher on ECB Comments' },
      { source: 'Reuters', time: '4h', title: 'Oil Inventories Fall More Than Expected' },
    ],
    wsj: [
      { source: 'WSJ', time: '1h', title: 'Oil Prices Surge 4% on Middle East Supply Concerns' },
      { source: 'WSJ', time: '3h', title: 'Inflation Data Shows Signs of Cooling' },
      { source: 'WSJ', time: '6h', title: 'Housing Market Shows Mixed Signals' },
    ],
    reddit: [
      { source: 'WSB', time: '5m', title: 'YOLO: $50k on NVDA 500C expiring Friday' },
      { source: 'WSB', time: '20m', title: 'GME short interest rising again. Round 2?' },
      { source: 'WSB', time: '1h', title: 'Loss porn: -$200k on TSLA puts. F in chat' },
      { source: 'WSB', time: '2h', title: 'DD: Why AMD will hit $200 by Q2' },
      { source: 'WSB', time: '3h', title: 'Apes together strong. PLTR to the moon' },
    ],
    'price-alerts': [
      { source: 'ALERT', time: '23m', title: 'NVDA crossed above $500.00', isAlert: true },
      { source: 'ALERT', time: '1h', title: 'AAPL hit target price $180.00', isAlert: true },
      { source: 'ALERT', time: '3h', title: 'TSLA dropped below $250.00 stop', isAlert: true },
    ],
    'volume-alerts': [
      { source: 'ALERT', time: '2h', title: 'Unusual volume in AMD (3.5x avg)', isAlert: true },
    ],
    'earnings-alerts': [],
    'gap-up': [
      { source: 'Scanner', time: 'now', title: 'SMCI +8.2% - AI server demand' },
      { source: 'Scanner', time: 'now', title: 'RIVN +5.4% - Delivery numbers beat' },
      { source: 'Scanner', time: 'now', title: 'COIN +4.8% - Bitcoin rally' },
      { source: 'Scanner', time: 'now', title: 'MARA +6.1% - Crypto momentum' },
      { source: 'Scanner', time: 'now', title: 'ARM +3.9% - AI chip demand' },
    ],
    'high-volume': [
      { source: 'Scanner', time: 'now', title: 'AMD - 3.5x avg volume, +2.1%' },
      { source: 'Scanner', time: 'now', title: 'NVDA - 2.8x avg volume, +1.8%' },
      { source: 'Scanner', time: 'now', title: 'TSLA - 2.2x avg volume, -0.5%' },
      { source: 'Scanner', time: 'now', title: 'SPY - 1.8x avg volume, +0.3%' },
    ],
    'new-highs': [
      { source: 'Scanner', time: 'now', title: 'NVDA $502.30 - New ATH' },
      { source: 'Scanner', time: 'now', title: 'META $510.25 - New ATH' },
      { source: 'Scanner', time: 'now', title: 'MSFT $385.40 - New ATH' },
      { source: 'Scanner', time: 'now', title: 'LLY $642.80 - New ATH' },
      { source: 'Scanner', time: 'now', title: 'COST $728.50 - New ATH' },
    ],
    'unusual-options': [
      { source: 'Options', time: '10m', title: 'NVDA Jan 550C - 15,000 contracts, $2.1M premium' },
      { source: 'Options', time: '25m', title: 'AAPL Dec 190C - 8,500 contracts swept' },
      { source: 'Options', time: '1h', title: 'TSLA Jan 300P - 12,000 contracts, bearish bet' },
      { source: 'Options', time: '2h', title: 'AMD Feb 200C - Large block trade' },
    ],
  },

  // ============================================
  // SIMULATE - Backtests and Strategies
  // ============================================
  simulate: {
    'momentum-2024': {
      type: 'backtest',
      period: 'Jan 1, 2024 - Dec 1, 2024',
      symbols: 'AAPL, MSFT, GOOGL',
      return: '+24.5%',
      sharpe: '1.85',
      maxDD: '-8.3%',
      winRate: '62%',
      trades: [
        { date: 'Dec 1', symbol: 'AAPL', type: 'SELL', price: '$191.24', pnl: '+$342.50' },
        { date: 'Nov 28', symbol: 'AAPL', type: 'BUY', price: '$187.81', pnl: '-' },
        { date: 'Nov 25', symbol: 'MSFT', type: 'SELL', price: '$378.91', pnl: '-$125.00' },
        { date: 'Nov 22', symbol: 'MSFT', type: 'BUY', price: '$380.16', pnl: '-' },
        { date: 'Nov 20', symbol: 'GOOGL', type: 'SELL', price: '$138.45', pnl: '+$567.80' },
      ],
    },
    'mean-reversion-q4': {
      type: 'backtest',
      period: 'Oct 1, 2024 - Dec 1, 2024',
      symbols: 'SPY, QQQ, IWM',
      return: '+8.2%',
      sharpe: '1.42',
      maxDD: '-4.1%',
      winRate: '58%',
      status: 'running',
      trades: [
        { date: 'Dec 1', symbol: 'SPY', type: 'BUY', price: '$479.50', pnl: '-' },
        { date: 'Nov 29', symbol: 'QQQ', type: 'SELL', price: '$412.30', pnl: '+$215.00' },
        { date: 'Nov 27', symbol: 'QQQ', type: 'BUY', price: '$410.15', pnl: '-' },
        { date: 'Nov 25', symbol: 'IWM', type: 'SELL', price: '$198.75', pnl: '+$87.50' },
      ],
    },
    'pairs-spy-qqq': {
      type: 'backtest',
      period: 'Jan 1, 2024 - Nov 30, 2024',
      symbols: 'SPY/QQQ pair',
      return: '+12.8%',
      sharpe: '2.15',
      maxDD: '-3.2%',
      winRate: '71%',
      trades: [
        { date: 'Nov 30', symbol: 'SPY/QQQ', type: 'CLOSE', price: 'Spread: 0.82', pnl: '+$425.00' },
        { date: 'Nov 28', symbol: 'SPY/QQQ', type: 'OPEN', price: 'Spread: 0.78', pnl: '-' },
        { date: 'Nov 20', symbol: 'SPY/QQQ', type: 'CLOSE', price: 'Spread: 0.85', pnl: '+$312.50' },
        { date: 'Nov 18', symbol: 'SPY/QQQ', type: 'OPEN', price: 'Spread: 0.81', pnl: '-' },
      ],
    },
    'breakout-failed': {
      type: 'backtest',
      period: 'Sep 1, 2024 - Oct 15, 2024',
      symbols: 'NVDA, AMD, SMCI',
      return: '-15.2%',
      sharpe: '-0.45',
      maxDD: '-22.1%',
      winRate: '35%',
      status: 'failed',
      trades: [
        { date: 'Oct 15', symbol: 'NVDA', type: 'STOP', price: '$425.00', pnl: '-$1,250.00' },
        { date: 'Oct 12', symbol: 'AMD', type: 'STOP', price: '$142.50', pnl: '-$875.00' },
        { date: 'Oct 10', symbol: 'SMCI', type: 'STOP', price: '$38.20', pnl: '-$2,100.00' },
      ],
    },
    momentum: {
      type: 'strategy',
      name: 'momentum.algo',
      description: '10-day momentum strategy',
      parameters: {
        lookback_period: 10,
        entry_threshold: 0.02,
        exit_threshold: -0.01,
        position_size: 0.25,
        max_positions: 4,
      },
      symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'],
      logic: {
        entry: '10d return > 2%',
        exit: '10d return < -1% OR trailing stop 5%',
      },
    },
    'mean-reversion': {
      type: 'strategy',
      name: 'mean-reversion.algo',
      description: 'RSI mean reversion',
      parameters: {
        rsi_period: 14,
        oversold: 30,
        overbought: 70,
        position_size: 0.20,
      },
      symbols: ['SPY', 'QQQ', 'IWM'],
      logic: {
        entry: 'RSI < 30 (oversold)',
        exit: 'RSI > 50 OR stop loss 3%',
      },
    },
    'pairs-trading': {
      type: 'strategy',
      name: 'pairs-trading.algo',
      description: 'Statistical arbitrage',
      parameters: {
        zscore_entry: 2.0,
        zscore_exit: 0.5,
        lookback: 60,
        position_size: 0.50,
      },
      pairs: ['SPY/QQQ', 'XLF/XLK', 'GLD/SLV'],
      logic: {
        entry: 'Z-score > 2 or < -2',
        exit: 'Z-score crosses 0.5',
      },
    },
  },

  // ============================================
  // AGENTS - AI Agents and Tasks
  // ============================================
  agents: {
    'momentum-bot': {
      type: 'agent',
      name: 'Momentum Bot',
      letter: 'M',
      status: 'running',
      strategy: 'momentum.algo',
      pnl: '+$1,245.80',
      positions: 3,
      trades: 12,
      winRate: '75%',
      positions_list: [
        { symbol: 'AAPL', qty: 100, entry: '$189.50', current: '$191.24', pnl: '+$174.00' },
        { symbol: 'NVDA', qty: 50, entry: '$465.20', current: '$468.75', pnl: '+$177.50' },
        { symbol: 'MSFT', qty: 75, entry: '$380.15', current: '$378.90', pnl: '-$93.75' },
      ],
      logs: [
        { time: '14:32:15', type: 'SIGNAL', message: 'Momentum signal detected on NVDA' },
        { time: '14:32:16', type: 'TRADE', message: 'BUY 50 NVDA @ $465.20' },
        { time: '14:15:42', type: 'INFO', message: 'Scanning AAPL, MSFT, GOOGL, NVDA' },
        { time: '13:45:22', type: 'TRADE', message: 'BUY 100 AAPL @ $189.50' },
      ],
    },
    'mean-rev-bot': {
      type: 'agent',
      name: 'Mean Reversion',
      letter: 'R',
      status: 'running',
      strategy: 'mean-reversion.algo',
      pnl: '+$892.40',
      positions: 2,
      trades: 8,
      winRate: '62%',
      positions_list: [
        { symbol: 'SPY', qty: 50, entry: '$478.20', current: '$479.85', pnl: '+$82.50' },
        { symbol: 'QQQ', qty: 30, entry: '$410.50', current: '$412.30', pnl: '+$54.00' },
      ],
      logs: [
        { time: '14:28:10', type: 'INFO', message: 'RSI check: SPY=42, QQQ=38, IWM=45' },
        { time: '14:15:05', type: 'TRADE', message: 'BUY 50 SPY @ $478.20 (RSI oversold)' },
        { time: '13:50:22', type: 'SIGNAL', message: 'QQQ approaching oversold territory' },
      ],
    },
    'vwap-bot': {
      type: 'agent',
      name: 'VWAP Reversion',
      letter: 'V',
      status: 'error',
      strategy: 'vwap-reversion.algo',
      pnl: '-$342.10',
      positions: 0,
      trades: 3,
      winRate: '33%',
      error: 'API rate limit exceeded. Retrying in 60s...',
      positions_list: [],
      logs: [
        { time: '14:30:00', type: 'ERR', message: 'API rate limit exceeded' },
        { time: '14:29:58', type: 'ERR', message: 'Failed to fetch VWAP data' },
        { time: '14:15:00', type: 'TRADE', message: 'SELL 25 AMD @ $148.50 (stop loss)' },
        { time: '13:30:00', type: 'INFO', message: 'Bot started, watching AMD, INTC' },
      ],
    },
    'review-algo': {
      type: 'task',
      name: 'Review momentum algo',
      status: 'completed',
      dueDate: 'Today',
      description: 'Review momentum algo performance and adjust parameters',
      notes: [
        'Reviewed backtest results from Q3 2024',
        'Win rate improved to 62% after adjusting entry threshold',
        'Recommended: increase position size to 30%',
        'Next review scheduled for Jan 2025',
      ],
    },
    'backtest-spy': {
      type: 'task',
      name: 'Backtest SPY strategy',
      status: 'in_progress',
      dueDate: 'Tomorrow',
      description: 'Run backtest on SPY mean reversion strategy',
      notes: [
        'Testing RSI period 14 vs 21',
        'Current results: RSI-14 shows better Sharpe (1.4 vs 1.2)',
        'Need to test different entry thresholds',
        'Progress: 60% complete',
      ],
    },
    'add-stops': {
      type: 'task',
      name: 'Add stop losses to NVDA',
      status: 'pending',
      dueDate: 'This week',
      description: 'Add stop losses to NVDA position',
      notes: [
        'Current NVDA position: 50 shares @ $465.20',
        'Suggested stop: $445.00 (4.3% below entry)',
        'Consider trailing stop instead',
        'Waiting for volatility to settle',
      ],
    },
  },

  // ============================================
  // DEPLOYMENTS - Live Strategies
  // ============================================
  deployments: {
    'momentum-10': {
      enabled: true,
      name: '10-day momentum',
      category: 'production',
      pnlToday: '+$1,247.50',
      pnlYtd: '+$24,832.50',
      target: 500,
      executed: 350,
      avgPrice: '$142.38',
      winRate: '67%',
      trades: 142,
      logs: [
        { time: '09:30:01', level: 'INFO', msg: 'Strategy initialized. Watching AAPL, MSFT, GOOGL' },
        { time: '09:31:15', level: 'INFO', msg: 'AAPL: SMA10=142.35, SMA20=141.82, Close=142.50' },
        { time: '09:31:15', level: 'OK', msg: 'AAPL: Entry signal triggered. Bought 100 shares @ $142.38' },
        { time: '09:45:22', level: 'INFO', msg: 'AAPL: Position P&L +0.8% ($112.00)' },
        { time: '10:02:08', level: 'WARN', msg: 'MSFT: Volume spike detected (2.3x avg) but no entry signal' },
      ],
    },
    'mean-reversion': {
      enabled: true,
      name: 'Mean reversion',
      category: 'production',
      pnlToday: '-$342.10',
      pnlYtd: '+$8,421.30',
      target: 200,
      executed: 180,
      avgPrice: '$478.50',
      winRate: '58%',
      trades: 89,
      logs: [
        { time: '09:30:05', level: 'INFO', msg: 'Mean reversion bot started. Symbols: SPY, QQQ, IWM' },
        { time: '09:35:12', level: 'INFO', msg: 'SPY RSI: 42 (neutral), QQQ RSI: 38, IWM RSI: 45' },
        { time: '10:15:30', level: 'OK', msg: 'QQQ: RSI crossed below 30. Bought 50 shares @ $410.25' },
        { time: '11:22:45', level: 'WARN', msg: 'QQQ: Position down -0.8%. Monitoring stop level.' },
        { time: '14:01:00', level: 'ERR', msg: 'QQQ: Stop loss triggered. Sold @ $407.10 (-0.77%)' },
      ],
    },
    'pairs-trade': {
      enabled: true,
      name: 'Pairs trading',
      category: 'production',
      pnlToday: '+$523.00',
      pnlYtd: '+$12,156.80',
      target: 100,
      executed: 100,
      avgPrice: 'Spread: 0.82',
      winRate: '71%',
      trades: 64,
      logs: [
        { time: '09:30:02', level: 'INFO', msg: 'Pairs trading initialized. Watching SPY/QQQ spread' },
        { time: '09:32:00', level: 'INFO', msg: 'Current spread: 0.82, Z-score: 0.3 (neutral)' },
        { time: '10:45:15', level: 'OK', msg: 'Z-score crossed 2.0. Opening spread position' },
        { time: '10:45:16', level: 'OK', msg: 'Long 100 SPY @ $479.50, Short 82 QQQ @ $412.10' },
        { time: '13:20:30', level: 'OK', msg: 'Z-score mean reverted to 0.5. Closing position +$523' },
      ],
    },
    'breakout-vol': {
      enabled: true,
      name: 'Breakout + volume',
      category: 'walk-forward',
      pnlToday: '+$89.25',
      pnlYtd: '+$1,842.50',
      target: 50,
      executed: 45,
      avgPrice: '$168.30',
      winRate: '55%',
      trades: 28,
      logs: [
        { time: '09:30:10', level: 'INFO', msg: 'Walk-forward test started. Period: Week 49' },
        { time: '09:45:00', level: 'INFO', msg: 'Scanning for breakout candidates with volume confirmation' },
        { time: '10:12:30', level: 'OK', msg: 'SMCI: Breakout detected +3.2% with 2.5x volume' },
        { time: '10:12:31', level: 'OK', msg: 'Bought 25 SMCI @ $42.50 (paper trade)' },
      ],
    },
    'vwap-revert': {
      enabled: true,
      name: 'VWAP reversion',
      category: 'walk-forward',
      pnlToday: '+$312.40',
      pnlYtd: '+$4,567.20',
      target: 75,
      executed: 70,
      avgPrice: '$465.80',
      winRate: '64%',
      trades: 45,
      logs: [
        { time: '09:30:08', level: 'INFO', msg: 'VWAP reversion test active. Watching NVDA, AMD' },
        { time: '09:42:15', level: 'INFO', msg: 'NVDA: Price $468.50, VWAP $465.20 (+0.7% deviation)' },
        { time: '10:05:00', level: 'OK', msg: 'NVDA: Deviation > 1%. Short entry @ $470.25' },
        { time: '11:30:22', level: 'OK', msg: 'NVDA: Mean reverted to VWAP. Closed +$312.40' },
      ],
    },
    'gap-fill': {
      enabled: true,
      name: 'Gap fill',
      category: 'walk-forward',
      pnlToday: '-$78.50',
      pnlYtd: '+$892.30',
      target: 40,
      executed: 35,
      avgPrice: '$142.60',
      winRate: '52%',
      trades: 31,
      logs: [
        { time: '09:30:15', level: 'INFO', msg: 'Gap fill scanner active. Min gap: 2%' },
        { time: '09:31:00', level: 'INFO', msg: 'Found 3 gap-down candidates: TSLA, RIVN, LCID' },
        { time: '09:35:00', level: 'OK', msg: 'TSLA: Gapped down -2.8%. Long entry @ $248.50' },
        { time: '10:45:00', level: 'WARN', msg: 'TSLA: Gap not filling. Down -1.2% from entry' },
        { time: '11:00:00', level: 'ERR', msg: 'TSLA: Stop triggered @ $245.50 (-1.2%)' },
      ],
    },
    'rsi-oversold': {
      enabled: false,
      name: 'RSI oversold',
      category: 'disabled',
      pnlYtd: '+$2,145.00',
      reason: 'Paused for parameter optimization',
      logs: [
        { time: 'Nov 28', level: 'INFO', msg: 'Strategy paused by user' },
        { time: 'Nov 25', level: 'WARN', msg: 'Win rate dropped to 45%. Review recommended.' },
        { time: 'Nov 20', level: 'ERR', msg: 'Three consecutive losses. Auto-pause triggered.' },
      ],
    },
    'macd-cross': {
      enabled: false,
      name: 'MACD crossover',
      category: 'disabled',
      pnlYtd: '-$1,234.50',
      reason: 'Underperforming - needs review',
      logs: [
        { time: 'Nov 15', level: 'INFO', msg: 'Strategy disabled after review' },
        { time: 'Nov 14', level: 'ERR', msg: 'Sharpe ratio dropped below 0.5' },
        { time: 'Nov 10', level: 'WARN', msg: 'Max drawdown exceeded threshold (-12%)' },
      ],
    },
  },

  // ============================================
  // PUBLISH - Documents
  // ============================================
  publish: {
    'market-outlook': {
      title: 'Q4 2024 Market Outlook',
      status: 'draft',
      body: `As we enter the final quarter of 2024, markets face a complex landscape.

Key themes:
1. Interest Rate Trajectory
2. Earnings Season Dynamics
3. Technical Levels

Portfolio Positioning:
- Maintaining neutral equity exposure
- Overweight quality factor
- Tactical allocation to volatility strategies`,
    },
    'trading-journal': {
      title: 'Trading Journal - December 2024',
      status: 'draft',
      body: `Week 1 Summary:

Trades Executed: 8
Win Rate: 62.5%
Total P&L: +$1,847.50

Notable Trades:
- NVDA momentum play: +$567.80 (held 2 days)
- AAPL earnings fade: -$125.00 (stopped out)
- SPY mean reversion: +$425.00 (textbook setup)

Lessons Learned:
- Need to reduce position size on earnings plays
- Morning momentum setups working well
- Should add more pairs trades for diversification`,
    },
    'algo-notes': {
      title: 'Algorithm Design Notes',
      status: 'draft',
      body: `Current Strategy Performance Review:

Momentum Strategy (v2.3):
- Sharpe: 1.85 (up from 1.42)
- Key change: Added volume confirmation
- Next: Test 5-day vs 10-day lookback

Mean Reversion (v1.8):
- Sharpe: 1.42
- Issue: Too many false signals in trending markets
- Idea: Add trend filter (SMA50 > SMA200)

Pairs Trading (v1.2):
- Sharpe: 2.15 (best performer)
- Working well, no changes needed
- Consider adding XLF/XLK pair`,
    },
    'momentum-guide': {
      title: 'Momentum Trading Guide',
      status: 'published',
      body: `A Complete Guide to Momentum Trading

What is Momentum Trading?
Momentum trading is a strategy that aims to capitalize on the
continuance of existing trends in the market.

Key Principles:
1. Trend is your friend
2. Cut losers quickly
3. Let winners run
4. Volume confirms moves

Entry Criteria:
- 10-day return > 2%
- Volume > 1.5x average
- Price above 20-day SMA

Exit Criteria:
- Trailing stop: 5%
- Time stop: 10 days
- Momentum reversal signal`,
    },
    'risk-management': {
      title: 'Risk Management 101',
      status: 'published',
      body: `Essential Risk Management Principles

Position Sizing:
- Never risk more than 2% per trade
- Scale into positions (1/3 at a time)
- Maximum 6 concurrent positions

Stop Loss Rules:
- Always use stops
- Set before entry, never move down
- Use ATR-based stops for volatility adjustment

Portfolio Rules:
- Max sector exposure: 30%
- Max single stock: 10%
- Cash reserve: 20% minimum

Daily Risk Limits:
- Max daily loss: 3% of portfolio
- Stop trading after 2 consecutive losses`,
    },
    'backtest-results': {
      title: 'Backtest Results - November 2024',
      status: 'published',
      body: `November 2024 Backtest Summary

Tested: 5 strategy variations
Period: Jan 2020 - Nov 2024

Best Performer: Momentum + Volume Filter
- Annual Return: 24.5%
- Sharpe Ratio: 1.85
- Max Drawdown: -8.3%
- Win Rate: 62%

Worst Performer: Pure RSI Mean Reversion
- Annual Return: 8.2%
- Sharpe Ratio: 0.95
- Max Drawdown: -15.2%
- Win Rate: 48%

Recommendations:
1. Deploy Momentum + Volume to production
2. Pause RSI strategy for parameter optimization
3. Continue walk-forward on Pairs strategy`,
    },
  },

  // ============================================
  // SETTINGS - Categories
  // ============================================
  settings: {
    appearance: {
      theme: ['dark', 'light'],
      contrast: true,
    },
    desktop: {
      wallpapers: ['solid', 'gradient', 'pattern'],
    },
  },

  // ============================================
  // APPLICATIONS - Type 2 Apps
  // ============================================
  applications: {
    // Dynamically populated from store.type2Apps
  },
};

// Helper to get content lines for a route
export const getContentLines = (view, item) => {
  const viewData = mockData[view];
  if (!viewData) return ['View not found'];

  const itemData = viewData[item];
  if (!itemData) return ['Item not found'];

  // Different formatting based on view type
  if (view === 'yap') {
    return itemData;
  }

  if (view === 'data') {
    const lines = [];
    lines.push(`${itemData.totalRows.toLocaleString()} rows | ${itemData.columns.length} columns`);
    lines.push('');
    lines.push(itemData.columns.join(' | '));
    lines.push('-'.repeat(60));
    itemData.rows.forEach(row => {
      lines.push(row.join(' | '));
    });
    return lines;
  }

  if (view === 'stream') {
    const lines = [];
    lines.push(`${itemData.length} items | Updated 1 min ago`);
    lines.push('');
    itemData.forEach(entry => {
      const alert = entry.isAlert ? '! ' : '  ';
      lines.push(`${alert}${entry.time} [${entry.source}] ${entry.title}`);
    });
    return lines;
  }

  // Default: return raw data
  return Array.isArray(itemData) ? itemData : [JSON.stringify(itemData, null, 2)];
};

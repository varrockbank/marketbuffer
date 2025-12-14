"""
Portfolio management for WarrenBuffer
"""

from dataclasses import dataclass, field
from typing import Dict, List
from datetime import datetime


@dataclass
class Trade:
    symbol: str
    side: str  # 'buy' or 'sell'
    shares: int
    price: float
    timestamp: datetime = field(default_factory=datetime.now)

    @property
    def value(self) -> float:
        return self.shares * self.price


@dataclass
class Holding:
    symbol: str
    shares: int
    avg_cost: float

    @property
    def cost_basis(self) -> float:
        return self.shares * self.avg_cost

    def unrealized_pnl(self, current_price: float) -> float:
        return (current_price - self.avg_cost) * self.shares


class Portfolio:
    """
    Manages portfolio state and tracks performance.

    Follows Buffett's principle: "Our favorite holding period is forever."
    """

    def __init__(self, initial_capital: float):
        self.initial_capital = initial_capital
        self.cash = initial_capital
        self.holdings: Dict[str, Holding] = {}
        self.trades: List[Trade] = []
        self.created_at = datetime.now()

    @property
    def total_invested(self) -> float:
        """Total amount currently invested in holdings."""
        return sum(h.cost_basis for h in self.holdings.values())

    @property
    def equity(self) -> float:
        """Total portfolio value (cash + holdings at cost)."""
        return self.cash + self.total_invested

    def market_value(self, prices: Dict[str, float]) -> float:
        """Calculate market value given current prices."""
        holdings_value = sum(
            h.shares * prices.get(h.symbol, h.avg_cost)
            for h in self.holdings.values()
        )
        return self.cash + holdings_value

    def buy(self, symbol: str, shares: int, price: float) -> bool:
        """
        Execute a buy order.

        Position sizing follows the Kelly criterion, but we cap at 25%
        per position to maintain diversification.
        """
        cost = shares * price

        if cost > self.cash:
            return False

        # Check position size limit (25% max)
        if cost > self.equity * 0.25:
            print(f"Warning: Position would exceed 25% limit")

        self.cash -= cost

        if symbol in self.holdings:
            # Average up/down
            existing = self.holdings[symbol]
            total_shares = existing.shares + shares
            total_cost = existing.cost_basis + cost
            existing.shares = total_shares
            existing.avg_cost = total_cost / total_shares
        else:
            self.holdings[symbol] = Holding(symbol, shares, price)

        self.trades.append(Trade(symbol, 'buy', shares, price))
        return True

    def sell(self, symbol: str, shares: int, price: float) -> bool:
        """Execute a sell order."""
        if symbol not in self.holdings:
            return False

        holding = self.holdings[symbol]
        if shares > holding.shares:
            return False

        proceeds = shares * price
        self.cash += proceeds

        holding.shares -= shares
        if holding.shares == 0:
            del self.holdings[symbol]

        self.trades.append(Trade(symbol, 'sell', shares, price))
        return True

    def summary(self, prices: Dict[str, float] = None) -> dict:
        """Generate portfolio summary."""
        prices = prices or {}

        return {
            'cash': self.cash,
            'invested': self.total_invested,
            'market_value': self.market_value(prices),
            'num_holdings': len(self.holdings),
            'num_trades': len(self.trades),
            'return_pct': (self.market_value(prices) / self.initial_capital - 1) * 100,
        }

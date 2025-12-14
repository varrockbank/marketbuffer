"""
WarrenBuffer - Value Investing Algorithm
Inspired by Warren Buffett's investment principles
"""

import pandas as pd
import numpy as np
from datetime import datetime
from dataclasses import dataclass
from typing import List, Optional

from strategies.value import ValueStrategy
from strategies.moat import MoatAnalyzer
from portfolio import Portfolio
from data import MarketData


@dataclass
class Position:
    symbol: str
    shares: int
    entry_price: float
    entry_date: datetime

    @property
    def cost_basis(self) -> float:
        return self.shares * self.entry_price


class WarrenBuffer:
    """
    A value investing algorithm that follows Buffett's principles:
    1. Buy wonderful companies at fair prices
    2. Focus on long-term value, not short-term price movements
    3. Invest in businesses you understand
    4. Look for companies with economic moats
    """

    def __init__(self, initial_capital: float = 100000):
        self.portfolio = Portfolio(initial_capital)
        self.value_strategy = ValueStrategy()
        self.moat_analyzer = MoatAnalyzer()
        self.market_data = MarketData()
        self.positions: List[Position] = []

    def analyze_company(self, symbol: str) -> dict:
        """Analyze a company using value investing metrics."""
        fundamentals = self.market_data.get_fundamentals(symbol)

        return {
            'symbol': symbol,
            'intrinsic_value': self.value_strategy.calculate_intrinsic_value(fundamentals),
            'margin_of_safety': self.value_strategy.margin_of_safety(fundamentals),
            'moat_score': self.moat_analyzer.score(fundamentals),
            'pe_ratio': fundamentals.get('pe_ratio'),
            'pb_ratio': fundamentals.get('pb_ratio'),
            'roe': fundamentals.get('roe'),
            'debt_to_equity': fundamentals.get('debt_to_equity'),
        }

    def screen_universe(self, symbols: List[str]) -> List[dict]:
        """Screen a universe of stocks for value opportunities."""
        opportunities = []

        for symbol in symbols:
            analysis = self.analyze_company(symbol)

            # Buffett criteria
            if (analysis['margin_of_safety'] > 0.25 and
                analysis['moat_score'] >= 7 and
                analysis['roe'] > 0.15 and
                analysis['debt_to_equity'] < 0.5):
                opportunities.append(analysis)

        return sorted(opportunities, key=lambda x: x['margin_of_safety'], reverse=True)

    def execute_trade(self, symbol: str, shares: int, price: float) -> bool:
        """Execute a buy order."""
        cost = shares * price

        if cost > self.portfolio.cash:
            print(f"Insufficient funds: need ${cost:.2f}, have ${self.portfolio.cash:.2f}")
            return False

        self.portfolio.cash -= cost
        self.positions.append(Position(
            symbol=symbol,
            shares=shares,
            entry_price=price,
            entry_date=datetime.now()
        ))

        print(f"Bought {shares} shares of {symbol} @ ${price:.2f}")
        return True


if __name__ == '__main__':
    algo = WarrenBuffer(initial_capital=100000)

    # Screen the market
    universe = ['AAPL', 'MSFT', 'BRK.B', 'JNJ', 'KO', 'PG', 'V', 'MA']
    opportunities = algo.screen_universe(universe)

    print("Top value opportunities:")
    for opp in opportunities[:5]:
        print(f"  {opp['symbol']}: MoS={opp['margin_of_safety']:.1%}, Moat={opp['moat_score']}")

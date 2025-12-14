"""
Market Data - Data fetching and caching
"""

import os
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass


@dataclass
class Quote:
    symbol: str
    price: float
    change: float
    change_pct: float
    volume: int
    timestamp: datetime


@dataclass
class OHLC:
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int


class MarketData:
    """
    Market data provider abstraction.

    Currently supports:
    - Polygon.io
    - Alpha Vantage
    - Yahoo Finance (fallback)

    Buffett: "Risk comes from not knowing what you're doing."
    Good data is the foundation of good decisions.
    """

    def __init__(self, provider: str = 'polygon'):
        self.provider = provider
        self.api_key = os.environ.get('POLYGON_API_KEY', '')
        self._cache: Dict[str, tuple] = {}  # (data, timestamp)
        self.cache_ttl = timedelta(hours=1)

    def get_quote(self, symbol: str) -> Quote:
        """Get current quote for a symbol."""
        # Check cache first
        cached = self._get_cached(f'quote:{symbol}')
        if cached:
            return cached

        # Fetch from provider
        data = self._fetch_quote(symbol)
        quote = Quote(
            symbol=symbol,
            price=data['price'],
            change=data['change'],
            change_pct=data['change_pct'],
            volume=data['volume'],
            timestamp=datetime.now()
        )

        self._set_cache(f'quote:{symbol}', quote)
        return quote

    def get_fundamentals(self, symbol: str) -> Dict:
        """
        Get fundamental data for a symbol.

        Returns comprehensive financial metrics needed for
        value analysis.
        """
        cached = self._get_cached(f'fundamentals:{symbol}')
        if cached:
            return cached

        data = self._fetch_fundamentals(symbol)
        self._set_cache(f'fundamentals:{symbol}', data)
        return data

    def get_historical(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
        timeframe: str = '1d'
    ) -> List[OHLC]:
        """Get historical OHLC data."""
        cache_key = f'historical:{symbol}:{start.date()}:{end.date()}:{timeframe}'
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        data = self._fetch_historical(symbol, start, end, timeframe)
        bars = [
            OHLC(
                date=bar['date'],
                open=bar['open'],
                high=bar['high'],
                low=bar['low'],
                close=bar['close'],
                volume=bar['volume']
            )
            for bar in data
        ]

        self._set_cache(cache_key, bars)
        return bars

    def _fetch_quote(self, symbol: str) -> Dict:
        """Fetch quote from provider API."""
        # Placeholder - would call actual API
        return {
            'price': 150.00,
            'change': 2.50,
            'change_pct': 0.017,
            'volume': 50_000_000
        }

    def _fetch_fundamentals(self, symbol: str) -> Dict:
        """Fetch fundamental data from provider API."""
        # Placeholder - would call actual API
        # Returns mock data for demonstration
        mock_data = {
            'AAPL': {
                'symbol': 'AAPL',
                'name': 'Apple Inc.',
                'price': 191.24,
                'market_cap': 2_980_000_000_000,
                'shares_outstanding': 15_580_000_000,
                'pe_ratio': 31.2,
                'pb_ratio': 47.5,
                'ps_ratio': 7.8,
                'roe': 0.147,
                'roa': 0.283,
                'debt_to_equity': 1.81,
                'current_ratio': 0.99,
                'gross_margin': 0.438,
                'operating_margin': 0.297,
                'net_margin': 0.253,
                'eps': 6.13,
                'book_value_per_share': 4.03,
                'dividend_yield': 0.005,
                'net_income': 96_995_000_000,
                'depreciation': 11_519_000_000,
                'capex': 10_959_000_000,
                'working_capital_change': 1_200_000_000,
                'earnings_growth': 0.08,
                'revenue_growth': 0.02,
                'brand_value': 482_000_000_000,
                'customer_retention': 0.92,
            },
            'MSFT': {
                'symbol': 'MSFT',
                'name': 'Microsoft Corporation',
                'price': 378.91,
                'market_cap': 2_810_000_000_000,
                'shares_outstanding': 7_420_000_000,
                'pe_ratio': 35.8,
                'pb_ratio': 12.1,
                'roe': 0.388,
                'debt_to_equity': 0.35,
                'gross_margin': 0.695,
                'operating_margin': 0.422,
                'eps': 10.58,
                'net_income': 72_361_000_000,
                'depreciation': 13_861_000_000,
                'capex': 28_107_000_000,
                'earnings_growth': 0.15,
                'brand_value': 278_000_000_000,
                'customer_retention': 0.95,
                'net_revenue_retention': 1.18,
            }
        }

        return mock_data.get(symbol, self._default_fundamentals(symbol))

    def _default_fundamentals(self, symbol: str) -> Dict:
        """Return default fundamentals for unknown symbols."""
        return {
            'symbol': symbol,
            'price': 100.00,
            'pe_ratio': 20,
            'roe': 0.10,
            'debt_to_equity': 0.5,
            'gross_margin': 0.30,
            'eps': 5.00,
            'net_income': 1_000_000_000,
            'depreciation': 100_000_000,
            'capex': 150_000_000,
            'earnings_growth': 0.05,
        }

    def _fetch_historical(
        self,
        symbol: str,
        start: datetime,
        end: datetime,
        timeframe: str
    ) -> List[Dict]:
        """Fetch historical data from provider API."""
        # Placeholder - would call actual API
        return []

    def _get_cached(self, key: str) -> Optional[any]:
        """Get value from cache if not expired."""
        if key not in self._cache:
            return None

        data, timestamp = self._cache[key]
        if datetime.now() - timestamp > self.cache_ttl:
            del self._cache[key]
            return None

        return data

    def _set_cache(self, key: str, value: any) -> None:
        """Set value in cache."""
        self._cache[key] = (value, datetime.now())

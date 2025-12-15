"""
Value Strategy - Core valuation methods
"""

import numpy as np
from typing import Dict, Optional


class ValueStrategy:
    """
    Implements value investing calculations following Benjamin Graham
    and Warren Buffett's principles.

    Key metrics:
    - Intrinsic value using DCF
    - Margin of safety
    - Owner earnings
    """

    def __init__(self, discount_rate: float = 0.10, growth_rate: float = 0.03):
        self.discount_rate = discount_rate  # Required return
        self.growth_rate = growth_rate      # Terminal growth rate

    def calculate_intrinsic_value(self, fundamentals: Dict) -> float:
        """
        Calculate intrinsic value using discounted cash flow.

        Uses owner earnings (Buffett's preferred metric):
        Owner Earnings = Net Income + Depreciation - CapEx - Working Capital Changes
        """
        owner_earnings = self._calculate_owner_earnings(fundamentals)
        shares_outstanding = fundamentals.get('shares_outstanding', 1)

        # Two-stage DCF model
        # Stage 1: High growth (5 years)
        high_growth_rate = min(fundamentals.get('earnings_growth', 0.10), 0.20)
        stage1_value = self._npv_stage(owner_earnings, high_growth_rate, years=5)

        # Stage 2: Terminal value (perpetuity)
        year5_earnings = owner_earnings * (1 + high_growth_rate) ** 5
        terminal_value = self._gordon_growth(year5_earnings, self.growth_rate)
        terminal_pv = terminal_value / (1 + self.discount_rate) ** 5

        total_value = stage1_value + terminal_pv
        return total_value / shares_outstanding

    def margin_of_safety(self, fundamentals: Dict) -> float:
        """
        Calculate margin of safety.

        MoS = (Intrinsic Value - Market Price) / Intrinsic Value

        Buffett: "Price is what you pay, value is what you get."
        """
        intrinsic = self.calculate_intrinsic_value(fundamentals)
        market_price = fundamentals.get('price', intrinsic)

        if intrinsic <= 0:
            return -1.0

        return (intrinsic - market_price) / intrinsic

    def _calculate_owner_earnings(self, fundamentals: Dict) -> float:
        """
        Calculate owner earnings (Buffett's preferred metric).

        Owner Earnings = Net Income
                       + Depreciation/Amortization
                       - Average CapEx
                       - Working Capital Changes
        """
        net_income = fundamentals.get('net_income', 0)
        depreciation = fundamentals.get('depreciation', 0)
        capex = fundamentals.get('capex', 0)
        working_capital_change = fundamentals.get('working_capital_change', 0)

        return net_income + depreciation - abs(capex) - working_capital_change

    def _npv_stage(self, initial_cf: float, growth_rate: float, years: int) -> float:
        """Calculate NPV of growing cash flows."""
        npv = 0
        cf = initial_cf

        for year in range(1, years + 1):
            cf *= (1 + growth_rate)
            npv += cf / (1 + self.discount_rate) ** year

        return npv

    def _gordon_growth(self, cash_flow: float, growth_rate: float) -> float:
        """
        Gordon Growth Model for terminal value.

        TV = CF * (1 + g) / (r - g)
        """
        if self.discount_rate <= growth_rate:
            raise ValueError("Discount rate must exceed growth rate")

        return cash_flow * (1 + growth_rate) / (self.discount_rate - growth_rate)

    def graham_number(self, fundamentals: Dict) -> float:
        """
        Benjamin Graham's fair value formula.

        Graham Number = sqrt(22.5 * EPS * BVPS)

        A conservative estimate of maximum price to pay.
        """
        eps = fundamentals.get('eps', 0)
        book_value = fundamentals.get('book_value_per_share', 0)

        if eps <= 0 or book_value <= 0:
            return 0

        return np.sqrt(22.5 * eps * book_value)

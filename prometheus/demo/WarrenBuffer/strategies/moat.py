"""
Moat Analyzer - Economic moat evaluation
"""

from typing import Dict, List
from dataclasses import dataclass


@dataclass
class MoatFactor:
    name: str
    score: float  # 0-10
    weight: float
    evidence: List[str]


class MoatAnalyzer:
    """
    Analyzes economic moats following Morningstar's framework.

    Five sources of moat:
    1. Network Effects - Value increases with users
    2. Intangible Assets - Brands, patents, licenses
    3. Cost Advantages - Economies of scale, process
    4. Switching Costs - Lock-in effects
    5. Efficient Scale - Natural monopolies

    Buffett: "The key to investing is determining the competitive
    advantage of any given company and, above all, the durability
    of that advantage."
    """

    def __init__(self):
        self.weights = {
            'network_effects': 0.20,
            'intangible_assets': 0.20,
            'cost_advantages': 0.20,
            'switching_costs': 0.20,
            'efficient_scale': 0.20,
        }

    def score(self, fundamentals: Dict) -> float:
        """
        Calculate overall moat score (0-10).

        Combines individual moat factors with their weights.
        """
        factors = self.analyze_factors(fundamentals)

        total_score = sum(
            f.score * f.weight for f in factors
        )

        return round(total_score, 1)

    def analyze_factors(self, fundamentals: Dict) -> List[MoatFactor]:
        """Analyze individual moat factors."""
        return [
            self._analyze_network_effects(fundamentals),
            self._analyze_intangible_assets(fundamentals),
            self._analyze_cost_advantages(fundamentals),
            self._analyze_switching_costs(fundamentals),
            self._analyze_efficient_scale(fundamentals),
        ]

    def _analyze_network_effects(self, f: Dict) -> MoatFactor:
        """
        Network effects: Does the product become more valuable
        as more people use it?

        Examples: Visa, Meta, eBay
        """
        score = 0
        evidence = []

        # User growth acceleration
        user_growth = f.get('user_growth', 0)
        if user_growth > 0.20:
            score += 4
            evidence.append(f"Strong user growth: {user_growth:.0%}")
        elif user_growth > 0.10:
            score += 2

        # Revenue per user increasing
        arpu_growth = f.get('arpu_growth', 0)
        if arpu_growth > 0.05:
            score += 3
            evidence.append("Growing revenue per user")

        # Market share
        market_share = f.get('market_share', 0)
        if market_share > 0.30:
            score += 3
            evidence.append(f"Dominant market share: {market_share:.0%}")

        return MoatFactor(
            name='Network Effects',
            score=min(score, 10),
            weight=self.weights['network_effects'],
            evidence=evidence
        )

    def _analyze_intangible_assets(self, f: Dict) -> MoatFactor:
        """
        Intangible assets: Brands, patents, regulatory licenses.

        Examples: Coca-Cola (brand), Pfizer (patents), Moody's (license)
        """
        score = 0
        evidence = []

        # Brand value
        brand_value = f.get('brand_value', 0)
        if brand_value > 50_000_000_000:  # $50B+
            score += 4
            evidence.append("Globally recognized brand")
        elif brand_value > 10_000_000_000:
            score += 2

        # Patent portfolio
        patents = f.get('patent_count', 0)
        if patents > 1000:
            score += 3
            evidence.append(f"Strong patent portfolio: {patents} patents")

        # Pricing power (gross margin stability)
        gross_margin = f.get('gross_margin', 0)
        if gross_margin > 0.60:
            score += 3
            evidence.append(f"Strong pricing power: {gross_margin:.0%} gross margin")

        return MoatFactor(
            name='Intangible Assets',
            score=min(score, 10),
            weight=self.weights['intangible_assets'],
            evidence=evidence
        )

    def _analyze_cost_advantages(self, f: Dict) -> MoatFactor:
        """
        Cost advantages: Can produce cheaper than competitors.

        Sources: Scale, location, unique assets, process
        Examples: Walmart, Costco, GEICO
        """
        score = 0
        evidence = []

        # Operating margin vs industry
        op_margin = f.get('operating_margin', 0)
        industry_margin = f.get('industry_operating_margin', 0.10)

        if op_margin > industry_margin * 1.5:
            score += 4
            evidence.append("Operating margin 50%+ above industry")
        elif op_margin > industry_margin * 1.2:
            score += 2

        # Revenue per employee (efficiency)
        rev_per_employee = f.get('revenue_per_employee', 0)
        if rev_per_employee > 500_000:
            score += 3
            evidence.append(f"High efficiency: ${rev_per_employee:,.0f}/employee")

        # Asset turnover
        asset_turnover = f.get('asset_turnover', 0)
        if asset_turnover > 1.5:
            score += 3
            evidence.append("Efficient asset utilization")

        return MoatFactor(
            name='Cost Advantages',
            score=min(score, 10),
            weight=self.weights['cost_advantages'],
            evidence=evidence
        )

    def _analyze_switching_costs(self, f: Dict) -> MoatFactor:
        """
        Switching costs: How hard is it for customers to leave?

        Types: Learning curve, data lock-in, integration costs
        Examples: Oracle, Salesforce, banks
        """
        score = 0
        evidence = []

        # Customer retention
        retention = f.get('customer_retention', 0)
        if retention > 0.95:
            score += 4
            evidence.append(f"Excellent retention: {retention:.0%}")
        elif retention > 0.90:
            score += 2

        # Revenue from existing customers
        expansion_revenue = f.get('net_revenue_retention', 0)
        if expansion_revenue > 1.10:
            score += 3
            evidence.append("Growing revenue from existing customers")

        # Contract length
        avg_contract = f.get('avg_contract_years', 0)
        if avg_contract > 3:
            score += 3
            evidence.append(f"Long-term contracts: {avg_contract} years avg")

        return MoatFactor(
            name='Switching Costs',
            score=min(score, 10),
            weight=self.weights['switching_costs'],
            evidence=evidence
        )

    def _analyze_efficient_scale(self, f: Dict) -> MoatFactor:
        """
        Efficient scale: Market only supports limited competitors.

        Often seen in: Utilities, railroads, airports
        Examples: Union Pacific, airport operators
        """
        score = 0
        evidence = []

        # Market concentration
        hhi = f.get('herfindahl_index', 0)
        if hhi > 2500:  # Highly concentrated
            score += 4
            evidence.append("Highly concentrated market")
        elif hhi > 1500:
            score += 2

        # Capital intensity as barrier
        capex_to_revenue = f.get('capex_to_revenue', 0)
        if capex_to_revenue > 0.20:
            score += 3
            evidence.append("High capital requirements deter entry")

        # Regulatory barriers
        if f.get('regulated_industry', False):
            score += 3
            evidence.append("Regulatory barriers to entry")

        return MoatFactor(
            name='Efficient Scale',
            score=min(score, 10),
            weight=self.weights['efficient_scale'],
            evidence=evidence
        )

    def moat_rating(self, score: float) -> str:
        """Convert score to Morningstar-style rating."""
        if score >= 8:
            return "Wide Moat"
        elif score >= 5:
            return "Narrow Moat"
        else:
            return "No Moat"

import { MetricData, RegionData, Campaign, Alert } from '../types/analytics';

export const generateMockMetrics = (): MetricData => {
  const baseImpressions = 1000 + Math.random() * 500;
  const clicks = Math.floor(baseImpressions * (0.02 + Math.random() * 0.03));
  const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.15));
  const ctr = (clicks / baseImpressions) * 100;
  const bounceRate = 30 + Math.random() * 40;
  const revenue = conversions * (50 + Math.random() * 100);

  return {
    timestamp: Date.now(),
    impressions: Math.floor(baseImpressions),
    clicks,
    conversions,
    ctr: Number(ctr.toFixed(2)),
    bounceRate: Number(bounceRate.toFixed(1)),
    revenue: Number(revenue.toFixed(2))
  };
};

export const mockRegions: RegionData[] = [
  { region: 'North America', country: 'USA', users: 1250, conversions: 87, revenue: 4350, coordinates: [40, -100] },
  { region: 'Europe', country: 'Germany', users: 890, conversions: 62, revenue: 3100, coordinates: [51, 9] },
  { region: 'Asia Pacific', country: 'Japan', users: 1100, conversions: 78, revenue: 3900, coordinates: [36, 138] },
  { region: 'Europe', country: 'UK', users: 750, conversions: 52, revenue: 2600, coordinates: [54, -2] },
  { region: 'North America', country: 'Canada', users: 420, conversions: 29, revenue: 1450, coordinates: [60, -95] },
  { region: 'Asia Pacific', country: 'Australia', users: 380, conversions: 26, revenue: 1300, coordinates: [-25, 133] },
  { region: 'Europe', country: 'France', users: 680, conversions: 47, revenue: 2350, coordinates: [46, 2] },
  { region: 'Asia Pacific', country: 'Singapore', users: 290, conversions: 20, revenue: 1000, coordinates: [1, 104] }
];

export const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Sale 2025',
    status: 'active',
    budget: 50000,
    spent: 32500,
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    impressions: 125000,
    clicks: 3750,
    conversions: 188
  },
  {
    id: '2',
    name: 'Product Launch Campaign',
    status: 'active',
    budget: 75000,
    spent: 28900,
    startDate: '2025-01-15',
    endDate: '2025-03-15',
    impressions: 89000,
    clicks: 2670,
    conversions: 134
  },
  {
    id: '3',
    name: 'Retargeting Campaign',
    status: 'paused',
    budget: 25000,
    spent: 18750,
    startDate: '2024-12-01',
    endDate: '2025-01-31',
    impressions: 67000,
    clicks: 2010,
    conversions: 101
  }
];

export const generateMockAlert = (): Alert => {
  const types: Alert['type'][] = ['threshold', 'campaign', 'system'];
  const severities: Alert['severity'][] = ['info', 'warning', 'error'];
  const messages = [
    'CTR dropped below 2% threshold',
    'Campaign budget 80% depleted',
    'High bounce rate detected in mobile traffic',
    'Conversion rate exceeded target by 15%',
    'System latency spike detected',
    'New campaign activated successfully'
  ];

  return {
    id: Math.random().toString(36).substring(7),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: Date.now(),
    acknowledged: false
  };
};
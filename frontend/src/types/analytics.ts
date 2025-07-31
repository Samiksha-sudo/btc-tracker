export interface MetricData {
  timestamp: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  bounceRate: number;
  revenue: number;
}

export interface RegionData {
  region: string;
  country: string;
  users: number;
  conversions: number;
  revenue: number;
  coordinates: [number, number];
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface Alert {
  id: string;
  type: 'threshold' | 'campaign' | 'system';
  severity: 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

export interface ThresholdConfig {
  metric: string;
  operator: 'gt' | 'lt' | 'eq';
  value: number;
  enabled: boolean;
}

export type TimeWindow = '5m' | '1h' | '24h' | 'custom';
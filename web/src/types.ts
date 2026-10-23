export interface ControlItem {
  key: string;
  action: string;
  category: 'gameplay' | 'research' | 'system';
  description: string;
}

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  source: string;
  description: string;
}

export interface ComparisonPoint {
  feature: string;
  baseline: string;
  proposed: string;
  advantage: string;
}

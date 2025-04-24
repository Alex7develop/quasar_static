export interface StatisticModel {
  board: string;
  type: string;
}

export interface StatisticPowerRange {
  first_id: number;
  from: number;
  to: number;
  step: number;
}

export interface StatisticPowerCurrent {
  rate: string;
  profile: string;
  status: string;
  type: string;
}

export interface StatisticConf {
  ip: string;
  port: number;
  user: string;
  password?: string; 
  online: boolean;
}

export interface StatisticBlinkState {
  is_blinking: boolean;
  blinks_left: number | null;
}

export interface StatisticNetwork {
  address: string;
  macaddr: string;
  netmask: string;
}

export interface StatisticTemps {
  in: number;
  out: number;
  in_values: number[];
  out_values: number[];
}

export interface StatisticResponse {
  model: StatisticModel;
  is_overheat: boolean;
  power_ids: number[] | null;
  power_range: StatisticPowerRange;
  power_current: StatisticPowerCurrent;
  conf: StatisticConf;
  blink_state: StatisticBlinkState;
  network: StatisticNetwork;
  uptime_bin: number;
  uptime_sys: number;
  fan: number[];
  bild: string;
  chain_num: number;
  real: number; 
  avg: number; 
  pwm: number;
  temps: StatisticTemps;
  miner_status: string;
  power: string; 
}

export interface HistoryMetricValue {
  avg: number;
  min: number;
  max: number;
}

export interface HistoryMetric {
  unix_time: number;
  hashrate: HistoryMetricValue;
  inlet_temp_max: HistoryMetricValue;
  outlet_temp_max: HistoryMetricValue;
  power: HistoryMetricValue;
  fan: HistoryMetricValue;
  water_temp: HistoryMetricValue;
}

export interface HistoryResponse {
  uptime: string; 
  ts: string;     
  timezone: string;
  metrics: HistoryMetric[];
}

// Payload for updating configuration
export interface ConfigUpdatePayload {
  ip: string;
  port: number;
  user: string;
  password: string;
}

export interface ApiError {
  message: string;
 
} 
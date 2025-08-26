export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
}

export interface Analysis {
  id: string;
  coin_id: string;
  coin_name: string;
  coin_symbol: string;
  content: string;
  date: string;
  ratings: {
    sentiment: number; // -100 to 100
    onChain: number; // 0 to 100
    eco: number; // 1 to 10
    overall: number; // 1 to 5 stars
  };
  price_prediction: {
    short_term: string;
    medium_term: string;
    long_term: string;
  };
  on_chain_data: {
    transactions_24h: number;
    whale_activity: string;
    network_growth: number;
  };
  social_sentiment: {
    twitter_score: number;
    reddit_score: number;
    overall_score: number;
  };
}

export interface CoinQueue {
  id: string;
  coin_id: string;
  last_analyzed_date: string | null;
  priority: number;
}

export interface UserVote {
  id: string;
  coin_id: string;
  user_ip: string;
  created_at: string;
}

export interface Comment {
  id: string;
  analysis_id: string;
  user_name: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

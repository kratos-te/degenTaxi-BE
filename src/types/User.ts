export interface User {
  id: number;
  address: string;
  name: string;
  pfp: string;
  created_at: Date;
  balance: number;
  is_connected: boolean;
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'forever_free';
export type UserRole = 'admin' | 'staff';
export type CardStatus = 'active' | 'reward_available' | 'completed' | 'redeemed';
export type TransactionType = 'stamp' | 'redeem';
export type OutletScope = 'all' | 'selected';

export interface User {
  id: string;
  mobile_number: string;
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  address?: string | null;
  logo_url?: string | null;
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  subscription_status: SubscriptionStatus;
  forever_free: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface Outlet {
  id: string;
  business_id: string;
  name: string;
  address?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StaffOutletAssignment {
  id: string;
  business_user_id: string;
  outlet_id: string;
  created_at: string;
}

export interface LoyaltyCard {
  id: string;
  business_id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  stamps_required: number;
  reward_title: string;
  reward_description?: string | null;
  max_stamps_per_visit: number;
  collect_bill_value: boolean;
  terms_and_conditions?: string | null;
  is_active: boolean;
  start_date?: string | null;
  end_date?: string | null;
  outlet_scope: OutletScope;
  redemption_scope: OutletScope;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyCardOutlet {
  id: string;
  loyalty_card_id: string;
  outlet_id: string;
}

export interface CustomerBusinessProfile {
  id: string;
  business_id: string;
  user_id: string;
  notes?: string | null;
  birthday?: string | null;
  visit_count: number;
  first_visit_at?: string | null;
  last_visit_at?: string | null;
  total_stamps_earned: number;
  total_rewards_redeemed: number;
  total_cards_issued: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerCard {
  id: string;
  user_id: string;
  loyalty_card_id: string;
  business_id: string;
  stamps_collected: number;
  status: CardStatus;
  cycle_number: number;
  issued_at: string;
  completed_at?: string | null;
  redeemed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  business_id: string;
  outlet_id?: string | null;
  loyalty_card_id: string;
  customer_card_id: string;
  user_id: string;
  staff_business_user_id: string;
  transaction_type: TransactionType;
  quantity: number;
  bill_value?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface ReportRecipient {
  id: string;
  business_id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface DailyReport {
  id: string;
  business_id: string;
  report_date: string;
  total_transactions: number;
  total_stamps: number;
  total_redemptions: number;
  total_customers_served: number;
  report_data?: Record<string, unknown> | null;
  sent_at?: string | null;
  created_at: string;
}

export interface Superadmin {
  id: string;
  created_at: string;
}

export interface StaffPin {
  id: string;
  business_user_id: string;
  pin_hash: string;
  created_at: string;
  updated_at: string;
}

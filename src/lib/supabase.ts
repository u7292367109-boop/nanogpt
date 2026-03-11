import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          uid: string
          referral_code: string
          referred_by: string | null
          level: number
          avatar_url: string | null
          language: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      assets: {
        Row: {
          user_id: string
          task_balance: number
          vault_balance: number
          withdrawal_balance: number
          daily_yield: number
          total_yield: number
          updated_at: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          device_id: string
          model: string
          platform: string
          os: string
          ip: string | null
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          task_type: string
          investment_amount: number
          return_rate: number
          status: string
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          status: string
          created_at: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          content: string | null
          read: boolean
          created_at: string
        }
      }
      kyc: {
        Row: {
          user_id: string
          status: string
          full_name: string | null
          document_type: string | null
          document_number: string | null
          submitted_at: string | null
          updated_at: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          tier: number
          created_at: string
        }
      }
    }
  }
}

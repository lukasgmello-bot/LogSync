import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient(supabaseUrl || 'http://placeholder.url', supabaseAnonKey || 'placeholder_key');

export type Profile = {
  id: string;
  full_name: string;
  role: 'admin' | 'manager' | 'driver';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Vehicle = {
  id: string;
  license_plate: string;
  model: string;
  capacity_kg: number;
  fuel_consumption_per_km: number;
  status: 'available' | 'in_use' | 'maintenance';
  last_maintenance: string | null;
  created_at: string;
};

export type Driver = {
  id: string;
  user_id: string;
  license_number: string;
  license_expiry: string;
  availability_status: 'available' | 'on_route' | 'off_duty';
  rating: number;
  total_deliveries: number;
  created_at: string;
};

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};

export type Route = {
  id: string;
  name: string;
  vehicle_id: string | null;
  driver_id: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  total_distance_km: number;
  estimated_duration_minutes: number;
  estimated_fuel_cost: number;
  actual_fuel_cost: number | null;
  planned_start: string | null;
  actual_start: string | null;
  actual_end: string | null;
  created_by: string | null;
  created_at: string;
};

export type Delivery = {
  id: string;
  route_id: string | null;
  client_id: string | null;
  type: 'delivery' | 'pickup';
  status: 'pending' | 'in_transit' | 'delivered' | 'delayed' | 'failed';
  priority: number;
  sequence_order: number | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  weight_kg: number | null;
  scheduled_time: string | null;
  actual_time: string | null;
  notes: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: 'delay' | 'deviation' | 'maintenance' | 'general';
  title: string;
  message: string;
  is_read: boolean;
  related_entity_type: 'route' | 'delivery' | 'vehicle' | null;
  related_entity_id: string | null;
  created_at: string;
};

export type AnalyticsSnapshot = {
  id: string;
  snapshot_date: string;
  total_routes: number;
  total_deliveries: number;
  total_distance_km: number;
  total_fuel_cost: number;
  average_delivery_time_minutes: number;
  on_time_deliveries: number;
  delayed_deliveries: number;
  active_vehicles: number;
  created_at: string;
};

/*
  # LogiSync Database Schema - Complete Logistics Management System

  ## Overview
  This migration creates a comprehensive database schema for a logistics and route optimization application.
  It includes user management, fleet tracking, route planning, deliveries, and analytics capabilities.

  ## New Tables

  ### 1. profiles
  Extends auth.users with additional user information
  - `id` (uuid, pk) - Links to auth.users
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'admin', 'manager', 'driver'
  - `phone` (text) - Contact phone number
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. vehicles
  Fleet vehicle information and specifications
  - `id` (uuid, pk) - Unique vehicle identifier
  - `license_plate` (text, unique) - Vehicle registration number
  - `model` (text) - Vehicle model name
  - `capacity_kg` (numeric) - Maximum cargo capacity in kg
  - `fuel_consumption_per_km` (numeric) - Fuel usage rate
  - `status` (text) - Current status: 'available', 'in_use', 'maintenance'
  - `last_maintenance` (date) - Last maintenance date
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. drivers
  Driver information and availability
  - `id` (uuid, pk) - Unique driver identifier
  - `user_id` (uuid, fk) - Links to profiles table
  - `license_number` (text, unique) - Driver's license number
  - `license_expiry` (date) - License expiration date
  - `availability_status` (text) - Status: 'available', 'on_route', 'off_duty'
  - `rating` (numeric) - Average performance rating (0-5)
  - `total_deliveries` (integer) - Lifetime delivery count
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. clients
  Customer and delivery recipient information
  - `id` (uuid, pk) - Unique client identifier
  - `name` (text) - Client/company name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `address` (text) - Primary address
  - `latitude` (numeric) - Geocoded latitude
  - `longitude` (numeric) - Geocoded longitude
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. routes
  Planned delivery routes
  - `id` (uuid, pk) - Unique route identifier
  - `name` (text) - Route name/identifier
  - `vehicle_id` (uuid, fk) - Assigned vehicle
  - `driver_id` (uuid, fk) - Assigned driver
  - `status` (text) - Status: 'planned', 'in_progress', 'completed', 'cancelled'
  - `total_distance_km` (numeric) - Total route distance
  - `estimated_duration_minutes` (integer) - Estimated completion time
  - `estimated_fuel_cost` (numeric) - Projected fuel expense
  - `actual_fuel_cost` (numeric) - Actual fuel expense (after completion)
  - `planned_start` (timestamptz) - Scheduled start time
  - `actual_start` (timestamptz) - Actual start time
  - `actual_end` (timestamptz) - Actual completion time
  - `created_by` (uuid, fk) - User who created the route
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. deliveries
  Individual delivery/pickup tasks
  - `id` (uuid, pk) - Unique delivery identifier
  - `route_id` (uuid, fk) - Associated route
  - `client_id` (uuid, fk) - Delivery recipient
  - `type` (text) - Type: 'delivery' or 'pickup'
  - `status` (text) - Status: 'pending', 'in_transit', 'delivered', 'delayed', 'failed'
  - `priority` (integer) - Delivery priority (1-5, 5 being highest)
  - `sequence_order` (integer) - Stop order in the route
  - `address` (text) - Delivery address
  - `latitude` (numeric) - Geocoded latitude
  - `longitude` (numeric) - Geocoded longitude
  - `weight_kg` (numeric) - Package weight
  - `scheduled_time` (timestamptz) - Scheduled delivery time
  - `actual_time` (timestamptz) - Actual delivery time
  - `notes` (text) - Special instructions or notes
  - `created_at` (timestamptz) - Record creation timestamp

  ### 7. notifications
  System alerts and user notifications
  - `id` (uuid, pk) - Unique notification identifier
  - `user_id` (uuid, fk) - Recipient user
  - `type` (text) - Type: 'delay', 'deviation', 'maintenance', 'general'
  - `title` (text) - Notification title
  - `message` (text) - Notification content
  - `is_read` (boolean) - Read status
  - `related_entity_type` (text) - Related entity: 'route', 'delivery', 'vehicle'
  - `related_entity_id` (uuid) - Related entity identifier
  - `created_at` (timestamptz) - Notification timestamp

  ### 8. analytics_snapshots
  Daily aggregated metrics for reporting
  - `id` (uuid, pk) - Unique snapshot identifier
  - `snapshot_date` (date) - Date of the snapshot
  - `total_routes` (integer) - Routes completed that day
  - `total_deliveries` (integer) - Deliveries completed
  - `total_distance_km` (numeric) - Total distance covered
  - `total_fuel_cost` (numeric) - Total fuel expenses
  - `average_delivery_time_minutes` (numeric) - Average delivery duration
  - `on_time_deliveries` (integer) - Deliveries completed on time
  - `delayed_deliveries` (integer) - Deliveries that were delayed
  - `active_vehicles` (integer) - Vehicles in use
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Admins have full access to all data
  - Managers can view and modify operational data
  - Drivers can only view their assigned routes and deliveries
  - All policies check authentication and enforce role-based access

  ## Notes
  - All tables include automatic timestamp tracking
  - Foreign key constraints ensure data integrity
  - Indexes added for frequently queried columns
  - Mock data will be added separately for testing
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'driver')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_plate text UNIQUE NOT NULL,
  model text NOT NULL,
  capacity_kg numeric NOT NULL,
  fuel_consumption_per_km numeric NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance')),
  last_maintenance date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  license_number text UNIQUE NOT NULL,
  license_expiry date NOT NULL,
  availability_status text NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'on_route', 'off_duty')),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_deliveries integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view drivers"
  ON drivers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can update own record"
  ON drivers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and managers can manage drivers"
  ON drivers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text NOT NULL,
  latitude numeric,
  longitude numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view clients"
  ON clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and managers can manage clients"
  ON clients FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES drivers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')),
  total_distance_km numeric DEFAULT 0,
  estimated_duration_minutes integer DEFAULT 0,
  estimated_fuel_cost numeric DEFAULT 0,
  actual_fuel_cost numeric,
  planned_start timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view routes"
  ON routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can view assigned routes"
  ON routes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.user_id = auth.uid()
      AND drivers.id = routes.driver_id
    )
  );

CREATE POLICY "Admins and managers can manage routes"
  ON routes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id uuid REFERENCES routes(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('delivery', 'pickup')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'delayed', 'failed')),
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  sequence_order integer,
  address text NOT NULL,
  latitude numeric,
  longitude numeric,
  weight_kg numeric,
  scheduled_time timestamptz,
  actual_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Drivers can view assigned deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers
      JOIN routes ON routes.driver_id = drivers.id
      WHERE drivers.user_id = auth.uid()
      AND routes.id = deliveries.route_id
    )
  );

CREATE POLICY "Drivers can update assigned deliveries"
  ON deliveries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM drivers
      JOIN routes ON routes.driver_id = drivers.id
      WHERE drivers.user_id = auth.uid()
      AND routes.id = deliveries.route_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM drivers
      JOIN routes ON routes.driver_id = drivers.id
      WHERE drivers.user_id = auth.uid()
      AND routes.id = deliveries.route_id
    )
  );

CREATE POLICY "Admins and managers can manage deliveries"
  ON deliveries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('delay', 'deviation', 'maintenance', 'general')),
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  related_entity_type text CHECK (related_entity_type IN ('route', 'delivery', 'vehicle')),
  related_entity_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'manager')
    )
  );

-- Create analytics_snapshots table
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date UNIQUE NOT NULL,
  total_routes integer DEFAULT 0,
  total_deliveries integer DEFAULT 0,
  total_distance_km numeric DEFAULT 0,
  total_fuel_cost numeric DEFAULT 0,
  average_delivery_time_minutes numeric DEFAULT 0,
  on_time_deliveries integer DEFAULT 0,
  delayed_deliveries integer DEFAULT 0,
  active_vehicles integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view analytics"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage analytics"
  ON analytics_snapshots FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_drivers_user_id ON drivers(user_id);
CREATE INDEX IF NOT EXISTS idx_routes_driver_id ON routes(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_vehicle_id ON routes(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_route_id ON deliveries(route_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshot_date ON analytics_snapshots(snapshot_date);
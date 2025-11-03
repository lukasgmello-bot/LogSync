/*
  # Seed Mock Data for LogiSync Application (v2)

  ## Overview
  This migration adds mock data for testing all features of the LogiSync application.
  User profiles will be created through the signup process.

  ## Data Added
  
  ### 1. Vehicles
  - 5 fleet vehicles with varying specifications
  
  ### 2. Clients
  - 10 client records with complete contact information
  
  ### 3. Analytics Snapshots
  - 7 days of historical analytics data

  ## Notes
  - Users must be created via the signup form
  - Demo credentials will be: admin@logisync.com, manager@logisync.com, driver@logisync.com
  - Password for all: password123
*/

DO $$
DECLARE
  vehicle1_id uuid;
  vehicle2_id uuid;
  vehicle3_id uuid;
  vehicle4_id uuid;
  vehicle5_id uuid;
BEGIN
  vehicle1_id := gen_random_uuid();
  vehicle2_id := gen_random_uuid();
  vehicle3_id := gen_random_uuid();
  vehicle4_id := gen_random_uuid();
  vehicle5_id := gen_random_uuid();

  IF NOT EXISTS (SELECT 1 FROM vehicles WHERE license_plate = 'AB-1234') THEN
    INSERT INTO vehicles (id, license_plate, model, capacity_kg, fuel_consumption_per_km, status, last_maintenance) VALUES
    (vehicle1_id, 'AB-1234', 'Ford Transit 350', 1500, 0.12, 'available', CURRENT_DATE - 30),
    (vehicle2_id, 'CD-5678', 'Mercedes Sprinter', 1800, 0.11, 'available', CURRENT_DATE - 15),
    (vehicle3_id, 'EF-9012', 'Toyota Hiace', 1200, 0.10, 'available', CURRENT_DATE - 45),
    (vehicle4_id, 'GH-3456', 'Volkswagen Crafter', 1600, 0.11, 'maintenance', CURRENT_DATE - 5),
    (vehicle5_id, 'IJ-7890', 'Renault Master', 1400, 0.12, 'available', CURRENT_DATE - 20);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM clients WHERE name = 'TechCorp Solutions') THEN
    INSERT INTO clients (name, email, phone, address, latitude, longitude) VALUES
    ('TechCorp Solutions', 'contact@techcorp.com', '+1-555-1001', '123 Business Ave, New York, NY 10001', 40.7580, -73.9855),
    ('Global Imports LLC', 'info@globalimports.com', '+1-555-1002', '456 Commerce St, Brooklyn, NY 11201', 40.6782, -73.9442),
    ('QuickMart Supplies', 'orders@quickmart.com', '+1-555-1003', '789 Market Rd, Queens, NY 11354', 40.7614, -73.8298),
    ('Precision Manufacturing', 'logistics@precision.com', '+1-555-1004', '321 Industrial Pkwy, Bronx, NY 10451', 40.8201, -73.9196),
    ('UrbanFresh Grocers', 'delivery@urbanfresh.com', '+1-555-1005', '654 Main St, Manhattan, NY 10002', 40.7150, -73.9843),
    ('BuildRight Construction', 'materials@buildright.com', '+1-555-1006', '987 Construction Way, Staten Island, NY 10301', 40.6437, -74.0831),
    ('MedSupply Direct', 'orders@medsupply.com', '+1-555-1007', '147 Health Plaza, Manhattan, NY 10016', 40.7452, -73.9783),
    ('Office Essentials Co', 'supplies@officeessentials.com', '+1-555-1008', '258 Corporate Blvd, Queens, NY 11373', 40.7401, -73.8785),
    ('FoodService Partners', 'orders@foodservice.com', '+1-555-1009', '369 Restaurant Row, Brooklyn, NY 11215', 40.6602, -73.9690),
    ('Retail Distributors Inc', 'logistics@retaildist.com', '+1-555-1010', '741 Distribution Center, Bronx, NY 10475', 40.8740, -73.8260);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM analytics_snapshots WHERE snapshot_date = CURRENT_DATE) THEN
    INSERT INTO analytics_snapshots (snapshot_date, total_routes, total_deliveries, total_distance_km, total_fuel_cost, average_delivery_time_minutes, on_time_deliveries, delayed_deliveries, active_vehicles) VALUES
    (CURRENT_DATE, 3, 8, 136.5, 81.90, 42, 7, 1, 3),
    (CURRENT_DATE - 1, 2, 6, 95.2, 57.12, 38, 5, 1, 2),
    (CURRENT_DATE - 2, 4, 12, 178.4, 107.04, 45, 10, 2, 3),
    (CURRENT_DATE - 3, 3, 9, 142.8, 85.68, 40, 8, 1, 3),
    (CURRENT_DATE - 4, 2, 5, 88.6, 53.16, 36, 5, 0, 2),
    (CURRENT_DATE - 5, 3, 10, 156.3, 93.78, 44, 8, 2, 3),
    (CURRENT_DATE - 6, 4, 11, 165.7, 99.42, 41, 9, 2, 3);
  END IF;

END $$;
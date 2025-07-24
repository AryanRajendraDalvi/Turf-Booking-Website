-- Insert sample users
INSERT INTO users (name, email, password_hash, phone, user_type) VALUES
('John Doe', 'user@example.com', '$2b$10$hashedpassword1', '+91-9876543210', 'user'),
('Admin User', 'admin@turfbook.com', '$2b$10$hashedpassword2', '+91-9876543211', 'admin'),
('Priya Sharma', 'priya@example.com', '$2b$10$hashedpassword3', '+91-9876543212', 'user'),
('Rahul Kumar', 'rahul@example.com', '$2b$10$hashedpassword4', '+91-9876543213', 'user'),
('Sneha Patel', 'sneha@example.com', '$2b$10$hashedpassword5', '+91-9876543214', 'user');

-- Insert Mumbai turfs
INSERT INTO turfs (name, location, sport, capacity, price_per_hour, rating, image_url, facilities, description) VALUES
('Elite Sports Arena', 'Bandra West, Mumbai', 'Football', 22, 200.00, 4.9, '/placeholder.svg?height=200&width=300', 
 ARRAY['Floodlights', 'Parking', 'Changing Rooms'], 'Premium football turf with FIFA-approved synthetic grass'),

('Champions Cricket Ground', 'Andheri East, Mumbai', 'Cricket', 22, 250.00, 4.8, '/placeholder.svg?height=200&width=300',
 ARRAY['Professional Pitch', 'Pavilion', 'Scoreboard'], 'Professional cricket ground with excellent pitch conditions'),

('Pro Basketball Courts', 'Powai, Mumbai', 'Basketball', 10, 120.00, 4.7, '/placeholder.svg?height=200&width=300',
 ARRAY['Indoor', 'AC', 'Sound System'], 'Indoor basketball court with wooden flooring'),

('Tennis Excellence Center', 'Juhu, Mumbai', 'Tennis', 4, 150.00, 4.9, '/placeholder.svg?height=200&width=300',
 ARRAY['Clay Court', 'Coaching', 'Equipment'], 'Professional clay court with coaching facilities'),

('Mumbai Sports Complex', 'Goregaon West, Mumbai', 'Football', 22, 180.00, 4.6, '/placeholder.svg?height=200&width=300',
 ARRAY['Synthetic Turf', 'Parking', 'Cafeteria'], 'Large sports complex with multiple facilities'),

('Victory Cricket Academy', 'Thane, Mumbai', 'Cricket', 22, 220.00, 4.5, '/placeholder.svg?height=200&width=300',
 ARRAY['Net Practice', 'Coaching', 'Equipment'], 'Cricket academy with professional coaching'),

('Slam Dunk Basketball Arena', 'Malad West, Mumbai', 'Basketball', 10, 100.00, 4.4, '/placeholder.svg?height=200&width=300',
 ARRAY['Indoor', 'Wooden Floor', 'Scoreboard'], 'Modern basketball arena with professional setup'),

('Ace Tennis Club', 'Versova, Mumbai', 'Tennis', 4, 180.00, 4.8, '/placeholder.svg?height=200&width=300',
 ARRAY['Hard Court', 'Coaching', 'Equipment Rental'], 'Premium tennis club with hard courts'),

('Striker Football Ground', 'Kandivali East, Mumbai', 'Football', 22, 160.00, 4.3, '/placeholder.svg?height=200&width=300',
 ARRAY['Natural Grass', 'Parking', 'First Aid'], 'Natural grass football ground'),

('Royal Cricket Stadium', 'Borivali West, Mumbai', 'Cricket', 22, 300.00, 4.9, '/placeholder.svg?height=200&width=300',
 ARRAY['Stadium Seating', 'Professional Pitch', 'Live Streaming'], 'Premium cricket stadium with live streaming');

-- Insert sample bookings
INSERT INTO bookings (user_id, turf_id, booking_date, start_time, end_time, total_amount, status, payment_status, payment_method) VALUES
(1, 1, '2024-01-20', '06:00:00', '07:00:00', 236.00, 'confirmed', 'completed', 'card'),
(3, 1, '2024-01-20', '10:00:00', '11:00:00', 236.00, 'confirmed', 'completed', 'upi'),
(4, 1, '2024-01-20', '12:00:00', '13:00:00', 236.00, 'confirmed', 'completed', 'card'),
(1, 2, '2024-01-20', '08:00:00', '09:00:00', 295.00, 'confirmed', 'completed', 'card'),
(5, 2, '2024-01-20', '14:00:00', '15:00:00', 295.00, 'confirmed', 'completed', 'wallet'),
(3, 3, '2024-01-20', '09:00:00', '10:00:00', 141.60, 'confirmed', 'completed', 'upi'),
(4, 3, '2024-01-20', '15:00:00', '16:00:00', 141.60, 'confirmed', 'completed', 'card'),
(5, 3, '2024-01-20', '19:00:00', '20:00:00', 141.60, 'confirmed', 'completed', 'card');

-- Insert sample reviews
INSERT INTO reviews (user_id, turf_id, booking_id, rating, comment) VALUES
(1, 1, 1, 5, 'Amazing facilities and seamless booking process. The turf quality is top-notch and the staff is very professional.'),
(3, 1, 2, 5, 'Excellent football ground with great lighting. Perfect for evening games.'),
(4, 1, 3, 4, 'Good facilities but parking could be better. Overall great experience.'),
(1, 2, 4, 5, 'Best cricket ground in Mumbai! The pitch conditions are perfect and the booking system is so convenient.'),
(5, 2, 5, 5, 'Professional setup with excellent facilities. Highly recommended for cricket enthusiasts.'),
(3, 3, 6, 5, 'Excellent indoor courts with great lighting and sound system. My team loves playing here every weekend.'),
(4, 3, 7, 4, 'Good basketball court but could use better air conditioning during summer.'),
(5, 3, 8, 5, 'Perfect for basketball games. Clean facilities and professional setup.');

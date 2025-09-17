-- supabase/migrations/0010_seed_events_table.sql
-- Create a minimal `events` table and idempotently seed it with the local `eventDetails` dataset.
-- Safe to re-run.

BEGIN;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  href text,
  created_at timestamptz DEFAULT now()
);

-- Upsert seed rows: use a stable key on name to avoid duplicates
-- We'll insert or update rows using name as unique constraint via ON CONFLICT

CREATE UNIQUE INDEX IF NOT EXISTS events_name_idx ON public.events( lower(name) );

-- Seed data (idempotent). Replace or extend as needed.
INSERT INTO public.events (name, description, href)
VALUES
  ('Haunted House Tours', 'Experience the thrill of haunted house tours with safe, fun group transportation. Perfect for Halloween and spooky nights out!', '/events/haunted-house-tours'),
  ('Thanksgiving Parties', 'Gather your friends and family for a memorable Thanksgiving celebration. We handle the driving so you can focus on the fun.', NULL),
  ('Christmas Parties', 'Celebrate the holidays in style! Our party buses and limos are perfect for Christmas light tours and festive gatherings.', NULL),
  ('Ski Resort Tours', 'Hit the slopes with ease. Our spacious vehicles make ski trips comfortable and convenient for your whole group.', NULL),
  ('New Year\'s Eve', 'Ring in the new year with a safe ride to and from your party destination. No need to worry about parking or driving!', NULL),
  ('Sporting Events', 'Cheer on your favorite team! Avoid traffic and parking hassles with group transportation to any sporting event.', '/events/sporting-events'),
  ('Weddings', 'Make your big day seamless and stylish. We offer wedding shuttles, limos, and party buses for guests and bridal parties.', NULL),
  ('Prom', 'Arrive in style and make prom night unforgettable. Our professional drivers ensure a safe, fun experience.', NULL),
  ('Graduation Celebration', 'Celebrate your achievement with friends and family. Our vehicles are perfect for graduation parties and ceremonies.', NULL),
  ('Concerts / Events', 'Enjoy concerts and special events without the stress of driving. Let us get your group there and back safely.', '/events/concerts'),
  ('Bachelor Parties', 'The ultimate bachelor party starts with the right ride. Party buses and limos for a night to remember!', NULL),
  ('Bachelorette Parties', 'Celebrate with your best friends in a luxury vehicle. Safe, fun, and unforgettable bachelorette parties.', NULL),
  ('Brewery Tours', 'Tour the best breweries in comfort and style. No need for a designated driver—just enjoy the ride!', NULL),
  ('Red Rocks Concerts', 'Make your Red Rocks experience even better with group transportation. Avoid parking and enjoy the show!', NULL),
  ('Girl\'s Night Out', 'Plan the perfect girls’ night out with a party bus or limo. Safe, stylish, and so much fun.', NULL),
  ('Guys Night Out', 'Get the crew together for a legendary night out. We’ll handle the driving so you can focus on fun.', NULL),
  ('Retirement Celebrations', 'Celebrate retirement with friends and family. Our vehicles make group outings easy and enjoyable.', NULL),
  ('Blackhawk Casinos', 'Try your luck at the casino! Our group transportation is perfect for casino nights and day trips.', NULL),
  ('Corporate Parties', 'Impress your team and clients with professional group transportation for corporate events and parties.', NULL),
  ('Birthday Parties', 'Make birthdays extra special with a party bus or limo. Perfect for all ages and group sizes.', NULL),
  ('Kid\'s Parties', 'Safe, fun, and memorable transportation for kids’ parties and special occasions.', NULL),
  ('Entertainment Tours', 'See the sights and enjoy entertainment tours with your group. Relax and let us do the driving.', NULL),
  ('Charter Services', 'Flexible charter services for any occasion. Custom routes and schedules for your group’s needs.', NULL),
  ('Airport Shuttle', 'Start your trip stress-free with airport shuttle service for groups of any size.', NULL),
  ('Quinceanera Parties', 'Celebrate this milestone in style. Our vehicles are perfect for quinceanera parties and family gatherings.', NULL),
  ('Anniversary Celebrations', 'Make your anniversary unforgettable with a luxury ride to your special destination.', NULL),
  ('Special Dinners Out', 'Enjoy a night out with friends or loved ones. We’ll get you to and from your dinner safely and in style.', NULL)
ON CONFLICT (lower(name)) DO UPDATE
  SET description = EXCLUDED.description,
      href = EXCLUDED.href;

COMMIT;

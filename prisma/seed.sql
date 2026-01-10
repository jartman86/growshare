-- Seed data for GrowShare database

-- Insert sample users
INSERT INTO "User" (id, "clerkId", email, "firstName", "lastName", avatar, bio, role, "totalPoints", level, "createdAt", "updatedAt")
VALUES
('user_1', 'user_clerk_1', 'sarah@example.com', 'Sarah', 'Chen',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
 'Organic farmer passionate about heirloom tomatoes and sustainable agriculture.',
 ARRAY['LANDOWNER', 'RENTER']::"UserRole"[], 2847, 6, NOW(), NOW()),
('user_2', 'user_clerk_2', 'michael@example.com', 'Michael', 'Rodriguez',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
 'Market gardener specializing in organic pest management.',
 ARRAY['LANDOWNER']::"UserRole"[], 1892, 5, NOW(), NOW()),
('user_3', 'user_clerk_3', 'emma@example.com', 'Emma', 'Thompson',
 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
 'Herb enthusiast and seed saver.',
 ARRAY['RENTER']::"UserRole"[], 1456, 5, NOW(), NOW());

-- Insert sample plots
INSERT INTO "Plot" (id, "ownerId", title, description, status, address, city, state, "zipCode", county,
                   latitude, longitude, acreage, "soilType", "soilPH", "waterAccess", "usdaZone", "sunExposure",
                   "hasFencing", "hasGreenhouse", "hasToolStorage", "hasElectricity", "hasRoadAccess", "hasIrrigation",
                   "isADAAccessible", "allowsLivestock", "allowsStructures", "pricePerMonth", "pricePerSeason", "pricePerYear",
                   "securityDeposit", "instantBook", "minimumLease", images, "viewCount", "bookingCount", "averageRating",
                   "publishedAt", "createdAt", "updatedAt")
VALUES
('plot_1', 'user_1', 'Sunny 5-Acre Organic Farm Plot',
 'Beautiful organic farmland with rich soil and full sun exposure. Perfect for vegetables, herbs, and small-scale farming.',
 'ACTIVE', '15420 SW Pleasant Hill Rd', 'Sherwood', 'Oregon', '97140', 'Washington',
 45.3551, -122.8440, 5.0, ARRAY['LOAM']::"SoilType"[], 6.8, ARRAY['WELL', 'IRRIGATION']::"WaterAccess"[],
 '8b', 'full', true, false, true, true, true, true, false, false, true,
 450.00, 1200.00, 4800.00, 450.00, false, 6,
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
       'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800'],
 127, 3, 4.8, '2024-01-15'::timestamp, NOW(), NOW()),
('plot_2', 'user_2', 'Urban Garden Plot - Half Acre',
 'Conveniently located urban garden plot with excellent soil. Great for community gardening.',
 'ACTIVE', '2345 SE Division St', 'Portland', 'Oregon', '97214', 'Multnomah',
 45.5048, -122.6398, 0.5, ARRAY['LOAM', 'SANDY']::"SoilType"[], 6.5, ARRAY['MUNICIPAL']::"WaterAccess"[],
 '9a', 'partial', true, false, false, false, true, false, true, false, false,
 175.00, NULL, NULL, 175.00, true, 3,
 ARRAY['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'],
 89, 5, 4.9, '2024-02-01'::timestamp, NOW(), NOW());

-- Insert badges
INSERT INTO "Badge" (id, name, description, category, tier, icon, points, criteria, "createdAt")
VALUES
('badge_1', 'Welcome to GrowShare', 'Complete your profile and get started', 'MILESTONE', 'BRONZE', '👋', 10,
 '{"requirement": "Complete profile setup"}'::jsonb, NOW()),
('badge_2', 'Plot Pioneer', 'Rent your first plot', 'MILESTONE', 'BRONZE', '🌱', 50,
 '{"requirement": "Rent 1 plot"}'::jsonb, NOW()),
('badge_3', 'First Harvest', 'Record your first harvest', 'PRODUCTION', 'SILVER', '🌾', 150,
 '{"requirement": "Record 1 harvest"}'::jsonb, NOW()),
('badge_4', 'Harvest Master', 'Record 10 successful harvests', 'PRODUCTION', 'GOLD', '🏆', 500,
 '{"requirement": "Record 10 harvests"}'::jsonb, NOW());

-- Award badges to users
INSERT INTO "UserBadge" (id, "userId", "badgeId", "earnedAt")
VALUES
('ub_1', 'user_1', 'badge_1', NOW()),
('ub_2', 'user_1', 'badge_2', NOW()),
('ub_3', 'user_1', 'badge_3', NOW()),
('ub_4', 'user_1', 'badge_4', NOW()),
('ub_5', 'user_2', 'badge_1', NOW()),
('ub_6', 'user_2', 'badge_2', NOW()),
('ub_7', 'user_3', 'badge_1', NOW());

-- Insert courses
INSERT INTO "Course" (id, title, description, category, level, duration, "pointsAwarded", "isPublished", "createdAt", "updatedAt")
VALUES
('course_1', 'Introduction to Organic Farming',
 'Learn the fundamentals of organic farming practices and sustainable agriculture.',
 'FARMING_METHODS', 'BEGINNER', 120, 100, true, NOW(), NOW()),
('course_2', 'Soil Science Fundamentals',
 'Deep dive into soil composition, testing, and improvement techniques.',
 'SOIL_SCIENCE', 'INTERMEDIATE', 180, 200, true, NOW(), NOW());

-- Insert course modules
INSERT INTO "CourseModule" (id, "courseId", title, description, content, "order", "createdAt", "updatedAt")
VALUES
('module_1', 'course_1', 'What is Organic Farming?', 'Understanding the principles of organic agriculture',
 'Organic farming is a method of crop and livestock production...', 1, NOW(), NOW()),
('module_2', 'course_1', 'Soil Health Basics', 'The foundation of organic farming',
 'Healthy soil is the cornerstone of organic farming...', 2, NOW(), NOW()),
('module_3', 'course_2', 'Soil Composition', 'Understanding soil particles and structure',
 'Soil is composed of minerals, organic matter, water, and air...', 1, NOW(), NOW());

-- Insert crop journals
INSERT INTO "CropJournal" (id, "userId", "cropName", variety, "plantedDate", "expectedHarvest", stage, title, content,
                           images, "plantCount", "areaUsed", "createdAt", "updatedAt")
VALUES
('journal_1', 'user_1', 'Heritage Tomatoes', 'Cherokee Purple', '2024-04-15'::timestamp, '2024-07-15'::timestamp,
 'HARVESTING', 'First Tomato Planting', 'Planted 6 Cherokee Purple tomato seedlings. Looking forward to a great harvest!',
 ARRAY['https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800'], 6, 48.0, NOW(), NOW());

-- Insert harvests
INSERT INTO "Harvest" (id, "cropJournalId", "harvestDate", quantity, quality, notes, "createdAt")
VALUES
('harvest_1', 'journal_1', '2024-07-10'::timestamp, 12.5, 'excellent',
 'Beautiful ripe tomatoes, amazing flavor!', NOW());

-- Insert produce listings
INSERT INTO "ProduceListing" (id, "userId", "productName", variety, description, category, quantity, unit, "pricePerUnit",
                              status, "availableDate", "deliveryMethods", "pickupLocation", "deliveryRadius", images,
                              "isOrganic", "createdAt", "updatedAt")
VALUES
('listing_1', 'user_1', 'Organic Cherry Tomatoes', 'Sun Gold',
 'Sweet, golden cherry tomatoes bursting with flavor. Freshly harvested.',
 'vegetables', 10.0, 'lb', 6.50, 'AVAILABLE', NOW(), ARRAY['PICKUP', 'DELIVERY']::"DeliveryMethod"[],
 'Sherwood, OR', 15, ARRAY['https://images.unsplash.com/photo-1546470427-e26264be0b07?w=800'],
 true, NOW(), NOW());

-- Insert user activities
INSERT INTO "UserActivity" (id, "userId", type, title, description, points, "createdAt")
VALUES
('activity_1', 'user_1', 'PLOT_LISTED', 'Listed new plot', 'Sunny 5-Acre Organic Farm Plot', 50, NOW()),
('activity_2', 'user_1', 'FIRST_HARVEST', 'Recorded first harvest', 'Heritage Tomatoes - 12.5 lbs', 150, NOW()),
('activity_3', 'user_1', 'BADGE_EARNED', 'Earned Harvest Master badge', 'Achieved 10 successful harvests', 500, NOW());

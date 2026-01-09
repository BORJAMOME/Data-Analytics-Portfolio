-- Create database 
create database Airbnb_Menorca;
use Airbnb_Menorca;

-- Grouping by average price and neighbourhood in descending order
SELECT DISTINCT neighbourhood, CONCAT(ROUND(AVG(price), 2),'€') AS avg_price 
FROM airbnb_menorca  
GROUP BY neighbourhood 
ORDER BY avg_price DESC;

-- Grouping by neighbourhood and price
SELECT DISTINCT neighbourhood, 
AVG(price) OVER (PARTITION BY neighbourhood) AS avg_price 
FROM airbnb_menorca 
ORDER BY avg_price DESC;

-- Top 10 by number of reviews
SELECT * FROM airbnb_menorca ORDER BY number_of_reviews DESC LIMIT 10;

-- Number of Airbnb properties per neighbourhood
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC;

-- Top 10 hosts with the most properties
SELECT 
    host_id,
    COUNT(*) AS num_properties
FROM airbnb_menorca
GROUP BY host_id
ORDER BY num_properties DESC
LIMIT 10;

-- Top 10 by number of Airbnb properties per neighbourhood 
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca 
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC LIMIT 10;

-- Top 10 by number of room types
SELECT room_type, COUNT(room_type) AS num_Airbnb 
FROM airbnb_menorca
GROUP BY room_type 
ORDER BY room_type DESC;

-- Average price by room type per neighbourhood
SELECT DISTINCT neighbourhood, room_type, AVG(price) AS avg_price 
FROM airbnb_menorca 
GROUP BY neighbourhood, room_type 
ORDER BY avg_price DESC;

-- Analysis of average occupancy per neighbourhood
SELECT neighbourhood, AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY neighbourhood;

-- Analysis of annual availability
SELECT 
    AVG(availability_365) AS avg_availability,
    MAX(availability_365) AS max_availability,
    MIN(availability_365) AS min_availability
FROM airbnb_menorca;

-- Number of reviews per neighbourhood
SELECT 
    neighbourhood,
    SUM(number_of_reviews_ltm) AS total_reviews_ltm
FROM airbnb_menorca
GROUP BY neighbourhood;

-- Comparison of minimum nights by room type and neighbourhood
SELECT 
    neighbourhood,
    room_type,
    AVG(minimum_nights) AS avg_min_nights
FROM airbnb_menorca
GROUP BY neighbourhood, room_type;

-- Analysis of price distribution by minimum nights
SELECT 
    minimum_nights,
    AVG(price) AS avg_price,
    COUNT(*) AS num_listings
FROM airbnb_menorca
GROUP BY minimum_nights
ORDER BY minimum_nights;

-- Analysis of average availability by room type
SELECT 
    room_type,
    AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY room_type;

-- Analysis of price distribution by number of reviews
SELECT 
    CASE 
        WHEN number_of_reviews <= 10 THEN '0-10'
        WHEN number_of_reviews <= 50 THEN '11-50'
        WHEN number_of_reviews <= 100 THEN '51-100'
        ELSE '101+'
    END AS review_range,
    AVG(price) AS avg_price
FROM airbnb_menorca
GROUP BY review_range;

<img width="894" alt="Screenshot 2024-05-13 at 13 29 36" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/1cd9195b-7ab4-4a80-9693-08b143c48814">

[![SQL](https://img.shields.io/badge/MySQL-8.0+-f29221?style=for-the-badge&logo=mysql&logoColor=white&labelColor=101010)](https://mysql.com)


# Airbnb Data Analysis with SQL (2022)
Welcome to the Airbnb Data Analysis repository! In this project, we explore and analyze Airbnb data using SQL queries. This analysis provides valuable insights into the Airbnb market, allowing us to understand pricing trends, popular neighborhoods, host activity, and more.

# Dataset
The dataset used for this analysis contains information about Airbnb listings in Menorca. It includes the following columns:
- **host_id:** The ID of the host
- **neighbourhood:** The neighborhood where the property is located
- **room_type:** The type of room (e.g., entire home/apartment, private room, shared room)
- **price:** The price per night for the listing
- **minimum_nights:** The minimum number of nights required for booking
- **number_of_reviews:** The total number of reviews for the listing
- **calculated_host_listings_count:** The number of listings the host has
- **availability_365:** The number of days the listing is available in a year
- **number_of_reviews_ltm:** The number of reviews in the last twelve months

  

### Top 10 by number of reviews
```sql
SELECT * FROM airbnb_menorca
ORDER BY number_of_reviews DESC LIMIT 10;
```
<img width="955" alt="Screenshot 2024-05-13 at 13 15 51" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/316d4fe6-f2b4-4b3b-ae7c-c3a580500b97">

### Top 10 hosts with the most properties
 ```sql
SELECT host_id, COUNT(*) AS num_properties
FROM airbnb_menorca
GROUP BY host_id
ORDER BY num_properties DESC LIMIT 10;
```
<img width="255" alt="Screenshot 2024-05-13 at 13 17 00" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/db5528d4-f75a-4af4-ada5-e50fc2319759">

### Top 10 by number of Airbnb properties per neighbourhood 
```sql
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca 
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC LIMIT 10;
```
<img width="352" alt="Screenshot 2024-05-13 at 13 17 51" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/06c0c8a1-a2e1-4fd5-aaa0-ef237b27fcf4">

### Top 10 by number of room types
```sql
SELECT room_type, COUNT(room_type) AS num_Airbnb 
FROM airbnb_menorca
GROUP BY room_type 
ORDER BY room_type DESC;
```
<img width="276" alt="Screenshot 2024-05-13 at 13 19 30" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/d24b27cf-bb67-4b66-b2ac-721ef876b2b3">

### Analysis of average occupancy per neighbourhood
```sql
SELECT neighbourhood, AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY neighbourhood;
```
<img width="312" alt="Screenshot 2024-05-13 at 13 20 00" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/7414b2ca-6b66-4a18-8cfa-786321c65594">

### Analysis of annual availability
```sql
SELECT 
    AVG(availability_365) AS avg_availability,
    MAX(availability_365) AS max_availability,
    MIN(availability_365) AS min_availability
FROM airbnb_menorca;
```
<img width="328" alt="Screenshot 2024-05-13 at 13 20 33" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/51c82a5b-725e-4c57-a0e5-424f7dd3b485">


### Analysis of price distribution by minimum nights
```sql
SELECT 
    minimum_nights,
    AVG(price) AS avg_price,
    COUNT(*) AS num_listings
FROM airbnb_menorca
GROUP BY minimum_nights
ORDER BY minimum_nights;
```
<img width="314" alt="Screenshot 2024-05-13 at 13 21 23" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/37790bc0-39df-493f-a688-f50fc1591445">

### Analysis of average availability by room type
```sql
SELECT room_type, AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY room_type;
```
<img width="266" alt="Screenshot 2024-05-13 at 13 22 18" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/1d095fff-09f7-4a2f-a142-1bea6b811aa3">

### Analysis of price distribution by number of reviews
```sql
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
```
<img width="251" alt="Screenshot 2024-05-13 at 13 22 46" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/9d830eb7-3039-4edb-bcec-51295cd4af0c">

### Average price by room type per neighbourhood
```sql
SELECT DISTINCT neighbourhood, room_type, AVG(price) AS avg_price 
FROM airbnb_menorca 
GROUP BY neighbourhood, room_type 
ORDER BY avg_price DESC;
```
<img width="370" alt="Screenshot 2024-05-13 at 13 23 11" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/3ba1c1b6-5eff-4545-a80e-bd27bf15f955">

### Number of Airbnb properties per neighbourhood
```sql
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC;
```
<img width="302" alt="Screenshot 2024-05-13 at 13 23 35" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/4e51b095-f7bb-43a5-9486-55c771246937">


### Number of reviews per neighbourhood
```sql
SELECT 
    neighbourhood,
    SUM(number_of_reviews_ltm) AS total_reviews_ltm
FROM airbnb_menorca
GROUP BY neighbourhood;
```
<img width="302" alt="Screenshot 2024-05-13 at 13 23 57" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/2eb6b42a-e0c8-4de1-ab9c-c7d062a46002">


### Comparison of minimum nights by room type and neighbourhood
```sql
SELECT neighbourhood,room_type,
    AVG(minimum_nights) AS avg_min_nights
FROM airbnb_menorca
GROUP BY neighbourhood, room_type;
```
<img width="379" alt="Screenshot 2024-05-13 at 13 24 30" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/f7ffda8d-ad16-4f37-bb67-ed09998584c8">

### Grouping by neighbourhood and price
```sql
SELECT DISTINCT neighbourhood, 
AVG(price) OVER (PARTITION BY neighbourhood) AS avg_price 
FROM airbnb_menorca 
ORDER BY avg_price DESC;
```
<img width="303" alt="Screenshot 2024-05-13 at 13 24 49" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/e8d8e47d-cd83-455b-a990-e0514296cdde">

### Grouping by average price and neighbourhood in descending order
```sql
SELECT DISTINCT neighbourhood, CONCAT(ROUND(AVG(price), 2),'€') AS avg_price 
FROM airbnb_menorca  
GROUP BY neighbourhood 
ORDER BY avg_price DESC;
```
<img width="286" alt="Screenshot 2024-05-13 at 13 25 19" src="https://github.com/BORJAMOME/Airbnb_Menorca/assets/19588053/b301380a-47db-454f-bdf7-07e5e00551c5">









































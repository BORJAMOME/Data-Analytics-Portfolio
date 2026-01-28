
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

### Top 10 hosts with the most properties
 ```sql
SELECT host_id, COUNT(*) AS num_properties
FROM airbnb_menorca
GROUP BY host_id
ORDER BY num_properties DESC LIMIT 10;
```

### Top 10 by number of Airbnb properties per neighbourhood 
```sql
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca 
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC LIMIT 10;
```

### Top 10 by number of room types
```sql
SELECT room_type, COUNT(room_type) AS num_Airbnb 
FROM airbnb_menorca
GROUP BY room_type 
ORDER BY room_type DESC;
```

### Analysis of average occupancy per neighbourhood
```sql
SELECT neighbourhood, AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY neighbourhood;
```

### Analysis of annual availability
```sql
SELECT 
    AVG(availability_365) AS avg_availability,
    MAX(availability_365) AS max_availability,
    MIN(availability_365) AS min_availability
FROM airbnb_menorca;
```


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

### Analysis of average availability by room type
```sql
SELECT room_type, AVG(availability_365) AS avg_availability
FROM airbnb_menorca
GROUP BY room_type;
```

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

### Average price by room type per neighbourhood
```sql
SELECT DISTINCT neighbourhood, room_type, AVG(price) AS avg_price 
FROM airbnb_menorca 
GROUP BY neighbourhood, room_type 
ORDER BY avg_price DESC;
```

### Number of Airbnb properties per neighbourhood
```sql
SELECT DISTINCT neighbourhood, COUNT(host_id) AS num_Airbnb  
FROM airbnb_menorca
GROUP BY neighbourhood
ORDER BY num_Airbnb DESC;
```


### Number of reviews per neighbourhood
```sql
SELECT 
    neighbourhood,
    SUM(number_of_reviews_ltm) AS total_reviews_ltm
FROM airbnb_menorca
GROUP BY neighbourhood;
```


### Comparison of minimum nights by room type and neighbourhood
```sql
SELECT neighbourhood,room_type,
    AVG(minimum_nights) AS avg_min_nights
FROM airbnb_menorca
GROUP BY neighbourhood, room_type;
```

### Grouping by neighbourhood and price
```sql
SELECT DISTINCT neighbourhood, 
AVG(price) OVER (PARTITION BY neighbourhood) AS avg_price 
FROM airbnb_menorca 
ORDER BY avg_price DESC;
```

### Grouping by average price and neighbourhood in descending order
```sql
SELECT DISTINCT neighbourhood, CONCAT(ROUND(AVG(price), 2),'€') AS avg_price 
FROM airbnb_menorca  
GROUP BY neighbourhood 
ORDER BY avg_price DESC;
```









































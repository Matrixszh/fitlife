-- SQL-like query structure for generating workout data
-- This is a conceptual query structure, not executable SQL
-- Use this as a reference for data generation logic

-- Running Activities (25 rows)
-- Duration: 15-60 minutes, Distance: 2-10 km, Calories: 60-100 per km
SELECT 
    ROUND(RANDOM() * 45 + 15) as duration,  -- 15-60
    ROUND(RANDOM() * 8 + 2, 1) as distance,  -- 2-10 km
    ROUND((RANDOM() * 8 + 2) * (RANDOM() * 40 + 60)) as calories,  -- Based on distance
    'Running' as activityType
FROM generate_series(1, 25);

-- Cycling Activities (25 rows)
-- Duration: 20-90 minutes, Distance: 5-30 km, Calories: 20-40 per km
SELECT 
    ROUND(RANDOM() * 70 + 20) as duration,  -- 20-90
    ROUND(RANDOM() * 25 + 5, 1) as distance,  -- 5-30 km
    ROUND((RANDOM() * 25 + 5) * (RANDOM() * 20 + 20)) as calories,  -- Based on distance
    'Cycling' as activityType
FROM generate_series(1, 25);

-- Walking Activities (25 rows)
-- Duration: 20-90 minutes, Distance: 2-8 km, Calories: 30-50 per km
SELECT 
    ROUND(RANDOM() * 70 + 20) as duration,  -- 20-90
    ROUND(RANDOM() * 6 + 2, 1) as distance,  -- 2-8 km
    ROUND((RANDOM() * 6 + 2) * (RANDOM() * 20 + 30)) as calories,  -- Based on distance
    'Walking' as activityType
FROM generate_series(1, 25);

-- Gym Workout Activities (25 rows)
-- Duration: 30-120 minutes, Distance: 0, Calories: 200-600
SELECT 
    ROUND(RANDOM() * 90 + 30) as duration,  -- 30-120
    0 as distance,  -- No distance
    ROUND(RANDOM() * 400 + 200) as calories,  -- 200-600
    'Gym_Workout' as activityType
FROM generate_series(1, 25);

-- Combined query (UNION ALL)
-- This would generate all 100 rows in one query
SELECT * FROM (
    -- Running
    SELECT 
        ROUND(RANDOM() * 45 + 15) as duration,
        ROUND(RANDOM() * 8 + 2, 1) as distance,
        ROUND((RANDOM() * 8 + 2) * (RANDOM() * 40 + 60)) as calories,
        'Running' as activityType
    FROM generate_series(1, 25)
    
    UNION ALL
    
    -- Cycling
    SELECT 
        ROUND(RANDOM() * 70 + 20) as duration,
        ROUND(RANDOM() * 25 + 5, 1) as distance,
        ROUND((RANDOM() * 25 + 5) * (RANDOM() * 20 + 20)) as calories,
        'Cycling' as activityType
    FROM generate_series(1, 25)
    
    UNION ALL
    
    -- Walking
    SELECT 
        ROUND(RANDOM() * 70 + 20) as duration,
        ROUND(RANDOM() * 6 + 2, 1) as distance,
        ROUND((RANDOM() * 6 + 2) * (RANDOM() * 20 + 30)) as calories,
        'Walking' as activityType
    FROM generate_series(1, 25)
    
    UNION ALL
    
    -- Gym Workout
    SELECT 
        ROUND(RANDOM() * 90 + 30) as duration,
        0 as distance,
        ROUND(RANDOM() * 400 + 200) as calories,
        'Gym_Workout' as activityType
    FROM generate_series(1, 25)
) AS all_workouts
ORDER BY RANDOM();  -- Shuffle the results


/*
   Report #4 SQL Query
   Average Total Virtual vs. In-person Appointments Per Hour for Clinics in Metro Manila during 2023
*/

SELECT
    Hour,
    AVG(`Virtual`) AS Avg_Virtual,
    AVG(InPerson) AS Avg_In_Person
FROM
    (SELECT
        c.City AS City,
        HOUR(a.StartTime) AS Hour,
        SUM(CASE WHEN a.isVirtual = 1 THEN 1 ELSE 0 END) AS `Virtual`,
        SUM(CASE WHEN a.isVirtual = 0 THEN 1 ELSE 0 END) AS InPerson
    FROM
        appointments a
    JOIN
        clinics c ON a.clinicid = c.clinicid
    WHERE
        c.RegionName = 'National Capital Region (NCR)'
        AND YEAR(a.StartTime) = 2023
    GROUP BY
        City, Hour) AS subquery
GROUP BY
    Hour
ORDER BY
    Hour;
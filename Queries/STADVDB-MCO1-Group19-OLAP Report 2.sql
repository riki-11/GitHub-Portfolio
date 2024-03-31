/*
    Report 2 SQL Queries
    Appointment Location Concentration With Varying Location Granularity
*/

SELECT      c.RegionName, COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
GROUP BY    c.RegionName
ORDER BY    AppointmentCount DESC;


SELECT      c.RegionName, COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    c.RegionName
ORDER BY    AppointmentCount DESC;


SELECT      c.Province, COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    c.Province
ORDER BY    AppointmentCount DESC;


SELECT      c.City, COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
AND         c.RegionName IN (
                                'National Capital Region (NCR)',
                                'Cordillera Administrative Region (CAR)',
                                'Ilocos Region (I)',
                                'Cagayan Valley (II)',
                                'Central Luzon (III)',
                                'CALABARZON (IV-A)',
                                'MIMAROPA (IV-B)',
                                'Bicol Region (V)'
                            )
GROUP BY    c.City
ORDER BY    AppointmentCount DESC;


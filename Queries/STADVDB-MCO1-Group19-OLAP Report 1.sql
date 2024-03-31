/*
    Report 1 SQL Queries
    Clinic and Hospital Locations With Varying Granularity
*/

SELECT      RegionName,
            COUNT(*) as ClinicCount,
            COUNT(IF(IsHospital = 1, 1, NULL)) as HospitalCount
FROM        clinics
GROUP BY    RegionName;

SELECT      Province,
            RegionName,
            COUNT(*) as ClinicCount
FROM        clinics
GROUP BY    Province, RegionName
ORDER BY    Province, RegionName;

SELECT      City,
            Province,
            RegionName,
            COUNT(*) as ClinicCount,
            COUNT(IF(IsHospital = 1, 1, NULL)) as HospitalCount
FROM        clinics
GROUP BY    City, Province, RegionName
ORDER BY    RegionName, Province, City;


/*
    Report 3 SQL Queries
    Appointment Quantity Trend OVer Time With Varying Appointment Date Granularity
*/

SELECT      DATE(a.StartTime) as AppointmentDate,
            COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    DATE(a.StartTime) WITH ROLLUP
ORDER BY    AppointmentCount DESC;


SELECT      YEAR(a.StartTime) as AppointmentYear,
            MONTH(a.StartTime) as AppointmentMonth,
            WEEK(a.StartTime) as AppointmentWeek,
            COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    AppointmentWeek, AppointmentMonth, AppointmentYear WITH ROLLUP
ORDER BY    AppointmentYear, AppointmentMonth, AppointmentWeek;


SELECT      YEAR(a.StartTime) as AppointmentYear,
            MONTH(a.StartTime) as AppointmentMonth,
            COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    AppointmentYear, AppointmentMonth WITH ROLLUP
ORDER BY    AppointmentYear, AppointmentMonth;


SELECT      YEAR(a.StartTime) as AppointmentYear,
            QUARTER(a.StartTime) as AppointmentQuarter,
            COUNT(*) as AppointmentCount
FROM        appointments as a
JOIN        clinics as c
ON          a.clinicid = c.clinicid
WHERE       a.StartTime BETWEEN '2020-01-30' AND '2023-05-05'
GROUP BY    AppointmentYear, AppointmentQuarter  WITH ROLLUP
ORDER BY    AppointmentQuarter, AppointmentYear;




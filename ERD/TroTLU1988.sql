
/*
- Xoá và tạo lại bảng thay vì xoá từng dòng, không tốn tài nguyên ghi log hệ thống
- Reset ID: bộ đếm tự động tăng sẽ được reset lại về 1
*/
TRUNCATE TABLE TroTLU1988.users;

TRUNCATE TABLE TroTLU1988.overviews;

TRUNCATE TABLE TroTLU1988.images;

TRUNCATE TABLE TroTLU1988.posts;

TRUNCATE TABLE TroTLU1988.categories;

DROP database TroTLU1988;

CREATE DATABASE TroTLU1988;

SELECT * FROM TroTLU1988.attributes;

SELECT * FROM TroTLU1988.overviews;

SELECT * FROM TroTLU1988.users;

SELECT * FROM TroTLU1988.categories;

SELECT * FROM TroTLU1988.images;

ALTER TABLE TroTLU1988.images MODIFY COLUMN image TEXT;

SELECT * FROM TroTLU1988.posts;

SELECT * FROM TroTLU1988.labels;
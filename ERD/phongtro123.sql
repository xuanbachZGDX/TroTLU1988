
/*
- Xoá và tạo lại bảng thay vì xoá từng dòng, không tốn tài nguyên ghi log hệ thống
- Reset ID: bộ đếm tự động tăng sẽ được reset lại về 1
*/
TRUNCATE TABLE phongtro123.users;

TRUNCATE TABLE phongtro123.overviews;

TRUNCATE TABLE phongtro123.images;

TRUNCATE TABLE phongtro123.posts;

TRUNCATE TABLE phongtro123.categories;

DROP database phongtro123;

CREATE DATABASE phongtro123;

SELECT * FROM phongtro123.attributes;

SELECT * FROM phongtro123.overviews;

SELECT * FROM phongtro123.users;

SELECT * FROM phongtro123.categories;

SELECT * FROM phongtro123.images;

ALTER TABLE phongtro123.images MODIFY COLUMN image TEXT;

SELECT * FROM phongtro123.posts;

SELECT * FROM phongtro123.labels;
📘 Student Information System (SIS) – DBMS Laboratory Project
Project Overview

The Student Information System (SIS) is a database-driven application developed to manage and organize academic information within an educational institution. The system efficiently handles student personal details, course information, faculty data, enrollment records, and academic results.

This project is implemented as part of the Database Management Systems Laboratory to practically apply DBMS concepts including requirement analysis, Entity-Relationship (ER) modeling, relational schema design, normalization, SQL implementation, stored procedures, and basic user interface development.

Motivation

Traditional methods of managing student data using manual registers or unstructured digital files often result in:

Data redundancy

Data inconsistency

Difficulty in record maintenance

Slow information retrieval

Poor data security

The Student Information System addresses these issues by utilizing a structured relational database design based on an ER model, ensuring data integrity, accuracy, and scalability.

Problem Statement

Managing student information manually becomes inefficient as the number of students and courses increases. Tracking personal details, enrollments, faculty assignments, and academic results becomes complex and prone to errors.

Therefore, a centralized and well-structured database system is required to:

Store academic data systematically

Reduce redundancy and update anomalies

Enable fast data retrieval and modification

Maintain consistency and integrity of records

Objectives of the Project

The key objectives of the Student Information System are:

To analyze system requirements

To identify entities, attributes, and relationships

To design the Entity-Relationship (ER) Diagram

To convert ER design into relational tables

To apply normalization techniques

To implement SQL queries and stored procedures

To develop a basic user interface for interaction

Scope of the Project

The system focuses on academic data management, including:

Student personal and academic details

Course information

Faculty information

Student enrollment in courses

Academic results

Advanced modules such as attendance systems, fee management, and authentication are not included in this project.

Stakeholders
Administrator

Manages student, course, faculty, and enrollment records

Faculty Members

Access student enrollments

Update student marks and grades

Students

View personal academic information and results

Requirement Analysis
7.1 Functional Requirements

The system should allow users to:

Add, update, and delete student records

Store and manage course details

Maintain faculty information

Enroll students into courses each semester

Store academic results for each enrollment

Retrieve data using SQL queries

Generate academic reports

7.2 Non-Functional Requirements

High data consistency and integrity

Minimal data redundancy

Secure data handling

Efficient query processing

Scalability for future enhancements

Data Requirements
8.1 Student Data

Student ID (Primary Key)

Name

Date of Birth

Gender

Department

Year of Study

Contact Details

8.2 Course Data

Course ID (Primary Key)

Course Name

Credits

Department

8.3 Faculty Data

Faculty ID (Primary Key)

Name

Department

Designation

8.4 Enrollment Data

(Bridge entity between Student and Course)

Enrollment ID (Primary Key)

Student ID (Foreign Key)

Course ID (Foreign Key)

Semester

8.5 Result Data

Result ID (Primary Key)

Enrollment ID (Foreign Key)

Marks

Grade

Identified Entities

Student

Course

Faculty

Enrollment

Result

Identified Relationships

A student can enroll in multiple courses

A course can have multiple students enrolled

The many-to-many relationship between Student and Course is resolved using the Enrollment entity

A faculty member can teach multiple courses (1:N relationship)

Each enrollment record is associated with exactly one result (1:1 relationship)

Assumptions

Each student is uniquely identified by Student ID

Each course has a unique Course ID

Each faculty member has a unique Faculty ID

One faculty member teaches a course in a given semester

A student may enroll in multiple courses in a semester

Each enrollment produces one academic result

Tools and Technologies

Database: MySQL

Query Language: SQL

Frontend (Future Implementation): HTML, CSS, JavaScript

Operating System: Windows

Lab-wise Implementation Plan
Lab No.	Description
Lab 1	Requirement Gathering
Lab 2	ER Diagram Design
Lab 3	ER to Relational Mapping
Lab 4	Normalization
Lab 5	Stored Procedures
Lab 6	SQL Queries
Lab 7	User Interface
Conclusion

The Student Information System is designed using a structured Entity-Relationship model that accurately represents academic processes such as student enrollment, course management, faculty assignment, and result storage. The use of a bridge entity (Enrollment) efficiently resolves the many-to-many relationship between students and courses, while the Result entity ensures accurate academic performance tracking.

This well-organized database design minimizes redundancy, maintains data integrity, and provides a scalable foundation for future enhancements. The project serves as a practical application of core DBMS concepts learned in the laboratory.
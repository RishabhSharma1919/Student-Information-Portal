📘 Student Information System (SIS)
Database Management Systems Laboratory Project
1. Project Overview

The Student Information System (SIS) is a database-oriented application designed to efficiently manage and maintain student-related information in an educational institution. The system provides a centralized platform for storing, updating, and retrieving student records, academic details, course enrollments, and faculty information.

This project is developed as part of the Database Management Systems Laboratory to practically implement theoretical DBMS concepts such as requirement analysis, Entity-Relationship (ER) modeling, relational mapping, normalization, SQL queries, stored procedures, and user interface development.

2. Motivation

In many institutions, student data is still managed using manual registers or unstructured digital files such as spreadsheets. These traditional methods suffer from several limitations:

High data redundancy

Inconsistency across records

Difficulty in maintaining large datasets

Slow retrieval of information

Poor data security

The Student Information System aims to overcome these limitations by using a well-designed relational database, ensuring data integrity, consistency, and scalability.

3. Problem Statement

The manual management of student records leads to inefficiencies in data storage, retrieval, and maintenance. Handling student personal details, course registrations, faculty assignments, and academic performance becomes complex and error-prone as the number of students increases.

Hence, there is a need for a structured database system that can:

Store student information in an organized manner

Reduce redundancy and anomalies

Allow easy retrieval and modification of records

Maintain data accuracy and integrity

4. Objectives of the Project

The main objectives of the Student Information System are:

To analyze and gather system requirements

To identify entities, attributes, and relationships

To design an Entity-Relationship diagram

To convert ER models into relational tables

To apply normalization techniques

To implement SQL queries and stored procedures

To design a basic user interface for database interaction

5. Scope of the Project

The scope of this project is limited to academic data management within an educational institution. The system focuses on:

Student personal and academic details

Course and subject information

Faculty details

Student enrollment records

Student marks and results

Advanced features such as online attendance, fee payment, or authentication systems are beyond the scope of this project.

6. Stakeholders

The primary stakeholders of the system include:

Administrator

Manages student, course, and faculty records

Faculty Members

Access student details and update marks

Students (optional)

View academic information

7. Requirement Analysis
7.1 Functional Requirements

The system should be able to:

Add, update, and delete student records

Store course and faculty information

Enroll students into courses

Maintain student academic performance

Retrieve student information using SQL queries

Generate basic academic reports

7.2 Non-Functional Requirements

Data consistency and integrity

Reduced data redundancy

Secure and controlled access

Efficient query performance

Scalability for future expansion

8. Data Requirements
8.1 Student Data

Student ID

Name

Date of Birth

Gender

Department

Year of Study

Contact Details

8.2 Course Data

Course ID

Course Name

Credits

Department

8.3 Faculty Data

Faculty ID

Name

Department

Designation

8.4 Enrollment Data

Enrollment ID

Student ID

Course ID

Semester

8.5 Result Data

Result ID

Enrollment ID

Marks

Grade

9. Identified Entities and Relationships
Entities:

Student

Course

Faculty

Enrollment

Result

Relationships:

A student can enroll in multiple courses

A course can have multiple students

A faculty member can teach multiple courses

Each enrollment has one result

10. Assumptions

Each student has a unique Student ID

Each course has a unique Course ID

One faculty member teaches a course per semester

A student can enroll in multiple courses in a semester

11. Tools and Technologies

Database: MySQL 

Query Language: SQL

Frontend (Later Labs): HTML, CSS, Javascript

Operating System: Windows

12. Lab-wise Implementation Plan
Lab No.	Description
Lab 1	Requirement Gathering
Lab 2	ER Diagram
Lab 3	ER to Relational Mapping
Lab 4	Normalization
Lab 5	Stored Procedures
Lab 6	SQL Queries
Lab 7	User Interface
13. Conclusion

The requirement analysis of the Student Information System provides a strong foundation for database design and implementation. A clear understanding of entities, relationships, and data requirements ensures the development of a robust and efficient database system. Subsequent laboratory experiments will build upon this analysis to implement a complete DBMS-based application.
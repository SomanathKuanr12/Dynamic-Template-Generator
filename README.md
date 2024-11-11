# Dynamic-Template-Generator

# Dynamic Template Generator Project

This project consists of an Angular 18 frontend and a Node.js backend that interacts with a MySQL database to manage dynamic templates.

## Table of Contents
1. [Requirements](#requirements)
2. [Setup Instructions](#setup-instructions)
3. [Frontend (Angular)](#frontend-angular)
4. [Backend (Node.js)](#backend-nodejs)
5. [MySQL Database Setup](#mysql-database-setup)
6. [Running the Application](#running-the-application)

## Requirements
- Node.js (v22 or higher)
- Angular CLI (v18 or higher)
- MySQL (5.7 or compatible database)
- Git (for version control)

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/SomanathKuanr12/Dynamic-Template-Generator.git
cd dynamic-template-generator

## frontend-angular
cd Frontend
npm install


## backend-nodejs

cd ../Backend
npm install


## mysql-database-setup

### Requirements
- MySQL installed on your system
- Access to MySQL Workbench or command-line MySQL

### Steps to Import Database
1. **Create a Database**: 
   Open your MySQL client and create a new database:
   ```sql
   CREATE DATABASE dynamic_template_generator;
2. **import  Database Schema**: 
mysql -u your_username -p dynamic_template_generator < sql/schema_export.sql

3.**Set up database credentials: Create a .env file in the Backend directory with the following content:**

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=dynamic_template_generator
PORT=4700


## running-the-application

cd Frontend
ng serve

cd Backend
npm start




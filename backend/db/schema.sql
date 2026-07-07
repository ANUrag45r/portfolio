-- Portfolio Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ---------------------------------------------------------------
-- Core profile info (single row, editable without touching code)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  tagline VARCHAR(255),
  bio TEXT,
  email VARCHAR(120),
  phone VARCHAR(30),
  location VARCHAR(120),
  resume_url VARCHAR(255),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  leetcode_url VARCHAR(255),
  gfg_url VARCHAR(255),
  cgpa VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- Education
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id INT PRIMARY KEY AUTO_INCREMENT,
  institution VARCHAR(200) NOT NULL,
  degree VARCHAR(200),
  score VARCHAR(60),
  start_date VARCHAR(30),
  end_date VARCHAR(30),
  display_order INT DEFAULT 0
);

-- ---------------------------------------------------------------
-- Work experience
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(200) NOT NULL,
  organization VARCHAR(200) NOT NULL,
  start_date VARCHAR(30),
  end_date VARCHAR(30),
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS experience_bullets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  experience_id INT NOT NULL,
  bullet_text TEXT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (experience_id) REFERENCES experience(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  summary TEXT,
  tech_stack VARCHAR(255),
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  start_date VARCHAR(30),
  end_date VARCHAR(30),
  featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS project_bullets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  bullet_text TEXT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_metrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_id INT NOT NULL,
  metric_label VARCHAR(80) NOT NULL,
  metric_value VARCHAR(40) NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Skills (grouped)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(80) NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NOT NULL,
  skill_name VARCHAR(80) NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  achievement_text TEXT NOT NULL,
  display_order INT DEFAULT 0
);

-- ---------------------------------------------------------------
-- Contact form submissions (from site visitors / recruiters)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

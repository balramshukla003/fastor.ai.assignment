
CREATE DATABASE IF NOT EXISTS fastor_ai_crm
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE fastor_ai_crm;


-- =========================================
-- TABLE: employees
-- Stores CRM counselor accounts
-- =========================================

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(254) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    updated_at DATETIME(3) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(3)
        ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),

    CONSTRAINT uq_employees_email UNIQUE (email)

) ENGINE=InnoDB;


-- =========================================
-- TABLE: enquiries
-- Stores public and claimed student enquiries
-- =========================================

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(254) NOT NULL,

    course_interest VARCHAR(150) NOT NULL,

    status ENUM('unclaimed', 'claimed')
        NOT NULL DEFAULT 'unclaimed',

    claimed_by BIGINT UNSIGNED NULL,

    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    updated_at DATETIME(3) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(3)
        ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (id),

    CONSTRAINT fk_enquiries_claimed_by
        FOREIGN KEY (claimed_by)
        REFERENCES employees(id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    CONSTRAINT chk_enquiry_ownership
        CHECK (
            (status = 'unclaimed' AND claimed_by IS NULL)
            OR
            (status = 'claimed' AND claimed_by IS NOT NULL)
        ),

    INDEX idx_enquiries_public_list (
        status,
        created_at DESC,
        id DESC
    ),

    INDEX idx_enquiries_employee_list (
        claimed_by,
        created_at DESC,
        id DESC
    )

) ENGINE=InnoDB;

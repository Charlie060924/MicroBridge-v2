
2025/09/03 19:13:47 C:/Users/yeekw/Desktop/MicroBridge-v2/backend/internal/database/database.go:70
[26.082ms] [rows:0]
                CREATE TABLE IF NOT EXISTS migrations (
                        id SERIAL PRIMARY KEY,
                        version BIGINT UNIQUE NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        description TEXT,
                        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );


2025/09/03 19:13:47 C:/Users/yeekw/Desktop/MicroBridge-v2/backend/internal/database/database.go:88 ERROR: unterminated quoted identifier at or near "" WHERE version = $1" (SQLSTATE 42601)
[31.678ms] [rows:0] SELECT count(*) FROM " WHERE version = 20240101000001

2025/09/03 19:13:47 C:/Users/yeekw/Desktop/MicroBridge-v2/backend/internal/database/database.go:92 ERROR: relation "users" already exists (SQLSTATE 42P07)
[25.140ms] [rows:0]
                                CREATE TABLE users (
                                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                        email VARCHAR(255) UNIQUE NOT NULL,
                                        password_hash VARCHAR(255) NOT NULL,
                                        first_name VARCHAR(100) NOT NULL,
                                        last_name VARCHAR(100) NOT NULL,
                                        user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'employer', 'admin')),
                                        is_verified BOOLEAN DEFAULT FALSE,
                                        is_active BOOLEAN DEFAULT TRUE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                );
                                CREATE INDEX idx_users_email ON users(email);        
                                CREATE INDEX idx_users_type ON users(user_type);     
                                CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

2025-09-03T19:13:47-04:00 ERR Database migration failed error="failed to run migration create_users_table (version 20240101000001): ERROR: relation \"users\" already exists (SQLSTATE 42P07)"
exit status 1
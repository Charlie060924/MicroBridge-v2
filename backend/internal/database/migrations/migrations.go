package migrations

func GetAllMigrations() []Migration {
	return []Migration{
		{
			Version: 20240101000001,
			Name:    "create_users_table",
			Description: "Create users table with basic fields",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS IF NOT EXISTS users (
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
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_email ON users(email);
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_type ON users(user_type);
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = TRUE;
			`,
			DownSQL: `DROP TABLE users;`,
		},
		{
			Version: 20240101000002,
			Name:    "create_jobs_table",
			Description: "Create jobs table with requirements",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS IF NOT EXISTS jobs (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					employer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					title VARCHAR(255) NOT NULL,
					description TEXT NOT NULL,
					requirements JSONB DEFAULT '{}',
					skills_required JSONB DEFAULT '[]',
					experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'mid', 'senior')),
					location VARCHAR(255),
					is_remote BOOLEAN DEFAULT FALSE,
					salary_min INTEGER,
					salary_max INTEGER,
					status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					expires_at TIMESTAMP
				);
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_jobs_employer ON jobs(employer_id);
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_jobs_status ON jobs(status) WHERE status = 'active';
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_jobs_skills ON jobs USING GIN(skills_required);
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_jobs_location ON jobs(location) WHERE location IS NOT NULL;
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_jobs_created ON jobs(created_at DESC);
			`,
			DownSQL: `DROP TABLE jobs;`,
		},
		{
			Version: 20240101000003,
			Name:    "create_user_profiles_table",
			Description: "Create user profiles with skills and experience",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS user_profiles (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					bio TEXT,
					skills JSONB DEFAULT '[]',
					experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'mid', 'senior')),
					location VARCHAR(255),
					availability VARCHAR(20) CHECK (availability IN ('full_time', 'part_time', 'contract', 'internship')),
					portfolio_url VARCHAR(500),
					resume_url VARCHAR(500),
					achievements JSONB DEFAULT '[]',
					level INTEGER DEFAULT 1,
					xp INTEGER DEFAULT 0,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					UNIQUE(user_id)
				);
				CREATE INDEX IF NOT EXISTS idx_profiles_user ON user_profiles(user_id);
				CREATE INDEX IF NOT EXISTS idx_profiles_skills ON user_profiles USING GIN(skills);
				CREATE INDEX IF NOT EXISTS idx_profiles_level ON user_profiles(level DESC);
				CREATE INDEX IF NOT EXISTS idx_profiles_location ON user_profiles(location) WHERE location IS NOT NULL;
			`,
			DownSQL: `DROP TABLE user_profiles;`,
		},
		{
			Version: 20240101000004,
			Name:    "create_applications_table",
			Description: "Create job applications table",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS applications (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
					user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
					cover_letter TEXT,
					match_score DECIMAL(5,3),
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					UNIQUE(job_id, user_id)
				);
				CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
				CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
				CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
				CREATE INDEX IF NOT EXISTS idx_applications_score ON applications(match_score DESC);
			`,
			DownSQL: `DROP TABLE applications;`,
		},
		{
			Version: 20240101000005,
			Name:    "create_match_cache_table",
			Description: "Create match cache for performance optimization",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS match_cache (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
					user_to_job_score DECIMAL(5,3) NOT NULL,
					job_to_user_score DECIMAL(5,3) NOT NULL,
					harmonic_mean_score DECIMAL(5,3) NOT NULL,
					skill_match_details JSONB DEFAULT '{}',
					calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					expires_at TIMESTAMP NOT NULL,
					UNIQUE(user_id, job_id)
				);
				CREATE INDEX IF NOT EXISTS idx_match_cache_user ON match_cache(user_id);
				CREATE INDEX IF NOT EXISTS idx_match_cache_job ON match_cache(job_id);
				CREATE INDEX IF NOT EXISTS idx_match_cache_score ON match_cache(harmonic_mean_score DESC);
				CREATE INDEX IF NOT EXISTS idx_match_cache_expires ON match_cache(expires_at);
			`,
			DownSQL: `DROP TABLE match_cache;`,
		},
		{
			Version: 20240101000006,
			Name:    "create_reviews_table",
			Description: "Create reviews table for job completion feedback",
			UpSQL: `
				CREATE TABLE IF NOT EXISTS reviews (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
					job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
					rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
					comment TEXT,
					category_ratings JSONB,
					is_visible BOOLEAN DEFAULT FALSE,
					visible_at TIMESTAMP,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					UNIQUE(reviewer_id, job_id)
				);
				CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
				CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
				CREATE INDEX IF NOT EXISTS idx_reviews_job ON reviews(job_id);
				CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
				CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible);
				CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);
			`,
			DownSQL: `DROP TABLE reviews;`,
		},
		{
			Version: 20240101000007,
			Name:    "add_auth_fields_to_users",
			Description: "Add authentication fields to users table",
			UpSQL: `
				ALTER TABLE users 
				ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
				ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
				ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255),
				ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP,
				ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP;
				
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_verification_token ON users(verification_token) WHERE verification_token IS NOT NULL;
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_reset_token ON users(reset_token) WHERE reset_token IS NOT NULL;
				CREATE INDEX IF NOT EXISTS IF NOT EXISTS idx_users_email_verified ON users(email_verified) WHERE email_verified = FALSE;
			`,
			DownSQL: `
				DROP INDEX IF EXISTS idx_users_verification_token;
				DROP INDEX IF EXISTS idx_users_reset_token;
				DROP INDEX IF EXISTS idx_users_email_verified;
				
				ALTER TABLE users 
				DROP COLUMN IF EXISTS email_verified,
				DROP COLUMN IF EXISTS verification_token,
				DROP COLUMN IF EXISTS reset_token,
				DROP COLUMN IF EXISTS reset_token_expires_at,
				DROP COLUMN IF EXISTS last_activity_at;
			`,
		},
	}
}

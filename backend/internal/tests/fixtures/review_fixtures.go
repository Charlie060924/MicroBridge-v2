package testutils

import (
	"time"
	"microbridge/backend/internal/models"
)

// CreateMockReviewData creates a complete set of mock data for testing the review system
func CreateMockReviewData() (*MockReviewData, error) {
	// Create mock users
	students := createMockStudents()
	employers := createMockEmployers()
	
	// Create mock jobs
	jobs := createMockJobs(employers)
	
	// Create mock applications (accepted ones that lead to completed jobs)
	applications := createMockApplications(students, jobs)
	
	// Create mock completed jobs
	completedJobs := createMockCompletedJobs(jobs, applications)
	
	// Create mock reviews
	reviews := createMockReviews(students, employers, completedJobs)
	
	return &MockReviewData{
		Students:       students,
		Employers:      employers,
		Jobs:           jobs,
		Applications:   applications,
		CompletedJobs:  completedJobs,
		Reviews:        reviews,
	}, nil
}

// MockReviewData contains all the mock data for testing
type MockReviewData struct {
	Students       []*models.User
	Employers      []*models.User
	Jobs           []*models.Job
	Applications   []*models.Application
	CompletedJobs  []*models.Job
	Reviews        []*models.Review
}

// Create mock students
func createMockStudents() []*models.User {
	now := time.Now()
	
	return []*models.User{
		{
			ID:              "student-001",
			Email:           "sarah.chen@example.com",
			Name:            "Sarah Chen",
			UserType:        "student",
			Bio:             "Passionate frontend developer with 2 years of experience in React and TypeScript. Love creating beautiful user interfaces and solving complex problems.",
			Skills: models.SkillsArray{
				{Name: "React", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "TypeScript", Level: 3, Experience: "1-2 years", Verified: true},
				{Name: "JavaScript", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "CSS", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "Node.js", Level: 2, Experience: "0-1 years", Verified: false},
			},
			Interests:       models.StringArray{"Web Development", "UI/UX Design", "Mobile Development"},
			ExperienceLevel: "intermediate",
			Location:        "San Francisco, CA",
			WorkPreference:  "remote",
			Level:           3,
			XP:              1500,
			CreatedAt:       now.AddDate(0, -6, 0),
			UpdatedAt:       now,
		},
		{
			ID:              "student-002",
			Email:           "mike.rodriguez@example.com",
			Name:            "Mike Rodriguez",
			UserType:        "student",
			Bio:             "Full-stack developer specializing in Python and Django. Experienced in building scalable web applications and APIs.",
			Skills: models.SkillsArray{
				{Name: "Python", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "Django", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "PostgreSQL", Level: 3, Experience: "1-2 years", Verified: true},
				{Name: "JavaScript", Level: 3, Experience: "1-2 years", Verified: false},
				{Name: "Docker", Level: 2, Experience: "0-1 years", Verified: false},
			},
			Interests:       models.StringArray{"Backend Development", "API Design", "DevOps"},
			ExperienceLevel: "intermediate",
			Location:        "Austin, TX",
			WorkPreference:  "hybrid",
			Level:           4,
			XP:              2200,
			CreatedAt:       now.AddDate(0, -8, 0),
			UpdatedAt:       now,
		},
		{
			ID:              "student-003",
			Email:           "emma.wilson@example.com",
			Name:            "Emma Wilson",
			UserType:        "student",
			Bio:             "UI/UX designer with a passion for creating intuitive and beautiful user experiences. Skilled in Figma, Adobe Creative Suite, and user research.",
			Skills: models.SkillsArray{
				{Name: "Figma", Level: 5, Experience: "3-5 years", Verified: true},
				{Name: "Adobe XD", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "Photoshop", Level: 4, Experience: "2-3 years", Verified: true},
				{Name: "User Research", Level: 3, Experience: "1-2 years", Verified: true},
				{Name: "Prototyping", Level: 4, Experience: "2-3 years", Verified: true},
			},
			Interests:       models.StringArray{"UI/UX Design", "User Research", "Design Systems"},
			ExperienceLevel: "advanced",
			Location:        "New York, NY",
			WorkPreference:  "onsite",
			Level:           5,
			XP:              3200,
			CreatedAt:       now.AddDate(0, -12, 0),
			UpdatedAt:       now,
		},
	}
}

// Create mock employers
func createMockEmployers() []*models.User {
	now := time.Now()
	
	return []*models.User{
		{
			ID:              "employer-001",
			Email:           "john.techcorp@example.com",
			Name:            "John Smith",
			UserType:        "employer",
			Bio:             "CTO at TechCorp, a fast-growing startup focused on building innovative web applications. Looking for talented developers to join our team.",
			Skills:          models.SkillsArray{},
			Interests:       models.StringArray{"Web Development", "Startups", "Innovation"},
			ExperienceLevel: "expert",
			Location:        "San Francisco, CA",
			WorkPreference:  "remote",
			Level:           8,
			XP:              8500,
			CreatedAt:       now.AddDate(0, -18, 0),
			UpdatedAt:       now,
		},
		{
			ID:              "employer-002",
			Email:           "lisa.designstudio@example.com",
			Name:            "Lisa Johnson",
			UserType:        "employer",
			Bio:             "Creative Director at DesignStudio, a boutique design agency specializing in digital products and branding. Passionate about design excellence.",
			Skills:          models.SkillsArray{},
			Interests:       models.StringArray{"Design", "Creative Direction", "Branding"},
			ExperienceLevel: "expert",
			Location:        "New York, NY",
			WorkPreference:  "hybrid",
			Level:           7,
			XP:              7200,
			CreatedAt:       now.AddDate(0, -24, 0),
			UpdatedAt:       now,
		},
		{
			ID:              "employer-003",
			Email:           "david.datatech@example.com",
			Name:            "David Chen",
			UserType:        "employer",
			Bio:             "VP of Engineering at DataTech, a data analytics company. Leading a team of engineers building cutting-edge data processing solutions.",
			Skills:          models.SkillsArray{},
			Interests:       models.StringArray{"Data Science", "Engineering", "Analytics"},
			ExperienceLevel: "expert",
			Location:        "Seattle, WA",
			WorkPreference:  "remote",
			Level:           9,
			XP:              9200,
			CreatedAt:       now.AddDate(0, -30, 0),
			UpdatedAt:       now,
		},
	}
}

// Create mock jobs
func createMockJobs(employers []*models.User) []*models.Job {
	now := time.Now()
	
	return []*models.Job{
		{
			ID:          "job-001",
			EmployerID:  employers[0].ID, // TechCorp
			Title:       "Senior Frontend Developer",
			Description: "We're looking for a talented frontend developer to join our team and help build amazing user experiences. You'll work with React, TypeScript, and modern web technologies.",
			Company:     "TechCorp",
			Skills: models.RequiredSkillsArray{
				{Name: "React", Level: 4, IsRequired: true, Importance: 0.9, CanLearn: false},
				{Name: "TypeScript", Level: 3, IsRequired: true, Importance: 0.8, CanLearn: true},
				{Name: "JavaScript", Level: 4, IsRequired: true, Importance: 0.9, CanLearn: false},
				{Name: "CSS", Level: 3, IsRequired: true, Importance: 0.7, CanLearn: true},
			},
			ExperienceLevel: "intermediate",
			Location:        "San Francisco, CA",
			Duration:        12, // 12 weeks
			Category:        "Web Development",
			IsRemote:        true,
			JobType:         "contract",
			Salary: models.SalaryRange{
				Min:          8000,
				Max:          12000,
				Currency:     "USD",
				Period:       "monthly",
				IsNegotiable: true,
			},
			Status:     "active",
			CreatedAt:  now.AddDate(0, -3, 0),
			UpdatedAt:  now.AddDate(0, -1, 0),
		},
		{
			ID:          "job-002",
			EmployerID:  employers[1].ID, // DesignStudio
			Title:       "UI/UX Designer",
			Description: "Join our creative team as a UI/UX designer. You'll be responsible for creating beautiful and intuitive user interfaces for web and mobile applications.",
			Company:     "DesignStudio",
			Skills: models.RequiredSkillsArray{
				{Name: "Figma", Level: 4, IsRequired: true, Importance: 0.9, CanLearn: false},
				{Name: "Adobe XD", Level: 3, IsRequired: true, Importance: 0.7, CanLearn: true},
				{Name: "User Research", Level: 3, IsRequired: true, Importance: 0.8, CanLearn: true},
				{Name: "Prototyping", Level: 4, IsRequired: true, Importance: 0.8, CanLearn: false},
			},
			ExperienceLevel: "advanced",
			Location:        "New York, NY",
			Duration:        16, // 16 weeks
			Category:        "Design",
			IsRemote:        false,
			JobType:         "contract",
			Salary: models.SalaryRange{
				Min:          6000,
				Max:          9000,
				Currency:     "USD",
				Period:       "monthly",
				IsNegotiable: true,
			},
			Status:     "active",
			CreatedAt:  now.AddDate(0, -4, 0),
			UpdatedAt:  now.AddDate(0, -2, 0),
		},
		{
			ID:          "job-003",
			EmployerID:  employers[2].ID, // DataTech
			Title:       "Full-Stack Python Developer",
			Description: "We need a skilled Python developer to help build our data processing platform. Experience with Django, PostgreSQL, and API development required.",
			Company:     "DataTech",
			Skills: models.RequiredSkillsArray{
				{Name: "Python", Level: 4, IsRequired: true, Importance: 0.9, CanLearn: false},
				{Name: "Django", Level: 3, IsRequired: true, Importance: 0.8, CanLearn: true},
				{Name: "PostgreSQL", Level: 3, IsRequired: true, Importance: 0.7, CanLearn: true},
				{Name: "API Development", Level: 3, IsRequired: true, Importance: 0.8, CanLearn: true},
			},
			ExperienceLevel: "intermediate",
			Location:        "Seattle, WA",
			Duration:        20, // 20 weeks
			Category:        "Backend Development",
			IsRemote:        true,
			JobType:         "contract",
			Salary: models.SalaryRange{
				Min:          7000,
				Max:          11000,
				Currency:     "USD",
				Period:       "monthly",
				IsNegotiable: true,
			},
			Status:     "active",
			CreatedAt:  now.AddDate(0, -5, 0),
			UpdatedAt:  now.AddDate(0, -3, 0),
		},
	}
}

// Create mock applications (only accepted ones that lead to completed jobs)
func createMockApplications(students []*models.User, jobs []*models.Job) []*models.Application {
	now := time.Now()
	
	return []*models.Application{
		{
			ID:         "app-001",
			UserID:     students[0].ID, // Sarah Chen
			JobID:      jobs[0].ID,     // TechCorp Frontend Developer
			Status:     "accepted",
			CoverLetter: "I'm excited to apply for the Senior Frontend Developer position at TechCorp. With 2 years of experience in React and TypeScript, I believe I can contribute significantly to your team...",
			MatchScore: 92.5,
					AppliedAt:  now.AddDate(0, -3, -5),
		ReviewedAt: func() *time.Time { t := now.AddDate(0, -3, -2); return &t }(),
		ResponseAt: func() *time.Time { t := now.AddDate(0, -3, -1); return &t }(),
			CreatedAt:  now.AddDate(0, -3, -5),
			UpdatedAt:  now.AddDate(0, -3, -1),
		},
		{
			ID:         "app-002",
			UserID:     students[2].ID, // Emma Wilson
			JobID:      jobs[1].ID,     // DesignStudio UI/UX Designer
			Status:     "accepted",
			CoverLetter: "As a passionate UI/UX designer with 3 years of experience, I'm thrilled to apply for the design position at DesignStudio. I love creating intuitive user experiences...",
			MatchScore: 95.2,
					AppliedAt:  now.AddDate(0, -4, -3),
		ReviewedAt: func() *time.Time { t := now.AddDate(0, -4, -1); return &t }(),
		ResponseAt: func() *time.Time { t := now.AddDate(0, -4, 0); return &t }(),
			CreatedAt:  now.AddDate(0, -4, -3),
			UpdatedAt:  now.AddDate(0, -4, 0),
		},
		{
			ID:         "app-003",
			UserID:     students[1].ID, // Mike Rodriguez
			JobID:      jobs[2].ID,     // DataTech Python Developer
			Status:     "accepted",
			CoverLetter: "I'm applying for the Full-Stack Python Developer position at DataTech. With my experience in Django and PostgreSQL, I'm confident I can help build your data processing platform...",
			MatchScore: 88.7,
					AppliedAt:  now.AddDate(0, -5, -7),
		ReviewedAt: func() *time.Time { t := now.AddDate(0, -5, -3); return &t }(),
		ResponseAt: func() *time.Time { t := now.AddDate(0, -5, -1); return &t }(),
			CreatedAt:  now.AddDate(0, -5, -7),
			UpdatedAt:  now.AddDate(0, -5, -1),
		},
	}
}

// Create mock completed jobs (copy of original jobs with completed status)
func createMockCompletedJobs(jobs []*models.Job, applications []*models.Application) []*models.Job {
	now := time.Now()
	completedJobs := make([]*models.Job, len(jobs))
	
	for i, job := range jobs {
		completedJob := *job // Copy the job
		completedJob.ID = "completed-" + job.ID
		completedJob.Status = "completed"
		completedJob.UpdatedAt = now.AddDate(0, -1, 0) // Completed 1 month ago
		completedJobs[i] = &completedJob
	}
	
	return completedJobs
}

// Create mock reviews
func createMockReviews(students []*models.User, employers []*models.User, completedJobs []*models.Job) []*models.Review {
	now := time.Now()
	visibleAt := now.AddDate(0, -1, -7) // Made visible 1 week after completion
	
	reviews := []*models.Review{
		// Job 1: TechCorp Frontend Developer (Sarah Chen)
		{
			ID:         "review-001",
			ReviewerID: students[0].ID, // Sarah Chen (student)
			RevieweeID: employers[0].ID, // John Smith (employer)
			JobID:      completedJobs[0].ID,
			Rating:     5,
			Comment:    "Excellent experience working with TechCorp! John was very clear about requirements and provided great feedback throughout the project. The payment process was smooth and professional. Highly recommend working with this team.",
			CategoryRatings: models.CategoryRatings{
				ClearRequirements:  5,
				Professionalism:    5,
				PaymentReliability: 5,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -14), // 2 weeks ago
			UpdatedAt: now.AddDate(0, -1, -7),  // 1 week ago
		},
		{
			ID:         "review-002",
			ReviewerID: employers[0].ID, // John Smith (employer)
			RevieweeID: students[0].ID, // Sarah Chen (student)
			JobID:      completedJobs[0].ID,
			Rating:     5,
			Comment:    "Sarah is an exceptional developer! Her React and TypeScript skills are top-notch, and she delivered the project ahead of schedule. Communication was excellent throughout, and the code quality was outstanding. Would definitely hire again.",
			CategoryRatings: models.CategoryRatings{
				QualityOfWork: 5,
				Communication: 5,
				Timeliness:    5,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -13), // 2 weeks ago
			UpdatedAt: now.AddDate(0, -1, -7),  // 1 week ago
		},
		
		// Job 2: DesignStudio UI/UX Designer (Emma Wilson)
		{
			ID:         "review-003",
			ReviewerID: students[2].ID, // Emma Wilson (student)
			RevieweeID: employers[1].ID, // Lisa Johnson (employer)
			JobID:      completedJobs[1].ID,
			Rating:     4,
			Comment:    "Great experience working with DesignStudio! Lisa was very professional and provided clear direction. The project requirements were well-defined, though there were some last-minute changes. Payment was reliable and on time.",
			CategoryRatings: models.CategoryRatings{
				ClearRequirements:  4,
				Professionalism:    5,
				PaymentReliability: 5,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -10), // 1.5 weeks ago
			UpdatedAt: now.AddDate(0, -1, -3),  // 3 days ago
		},
		{
			ID:         "review-004",
			ReviewerID: employers[1].ID, // Lisa Johnson (employer)
			RevieweeID: students[2].ID, // Emma Wilson (student)
			JobID:      completedJobs[1].ID,
			Rating:     5,
			Comment:    "Emma is a fantastic designer! Her work exceeded our expectations. She has a great eye for detail and created beautiful, user-friendly interfaces. Communication was excellent, and she was very responsive to feedback. Highly recommend!",
			CategoryRatings: models.CategoryRatings{
				QualityOfWork: 5,
				Communication: 5,
				Timeliness:    4,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -9), // 1.5 weeks ago
			UpdatedAt: now.AddDate(0, -1, -3), // 3 days ago
		},
		
		// Job 3: DataTech Python Developer (Mike Rodriguez)
		{
			ID:         "review-005",
			ReviewerID: students[1].ID, // Mike Rodriguez (student)
			RevieweeID: employers[2].ID, // David Chen (employer)
			JobID:      completedJobs[2].ID,
			Rating:     3,
			Comment:    "The project was challenging but rewarding. David was knowledgeable about the domain, though requirements could have been clearer from the start. Payment was reliable, but communication could have been more frequent.",
			CategoryRatings: models.CategoryRatings{
				ClearRequirements:  3,
				Professionalism:    4,
				PaymentReliability: 5,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -5), // 5 days ago
			UpdatedAt: now.AddDate(0, -1, -2), // 2 days ago
		},
		{
			ID:         "review-006",
			ReviewerID: employers[2].ID, // David Chen (employer)
			RevieweeID: students[1].ID, // Mike Rodriguez (student)
			JobID:      completedJobs[2].ID,
			Rating:     4,
			Comment:    "Mike is a solid developer with good Python skills. He delivered the project on time and the code quality was good. Communication was adequate, though I would have appreciated more proactive updates. Overall, a good experience.",
			CategoryRatings: models.CategoryRatings{
				QualityOfWork: 4,
				Communication: 3,
				Timeliness:    5,
			},
			IsVisible: true,
			VisibleAt: &visibleAt,
			CreatedAt: now.AddDate(0, -1, -4), // 4 days ago
			UpdatedAt: now.AddDate(0, -1, -2), // 2 days ago
		},
	}
	
	return reviews
}

// GetMockUserByID returns a mock user by ID
func GetMockUserByID(userID string) *models.User {
	students := createMockStudents()
	employers := createMockEmployers()
	
	// Check students
	for _, student := range students {
		if student.ID == userID {
			return student
		}
	}
	
	// Check employers
	for _, employer := range employers {
		if employer.ID == userID {
			return employer
		}
	}
	
	return nil
}

// GetMockReviewsByUserID returns reviews for a specific user
func GetMockReviewsByUserID(userID string) []*models.Review {
	mockData, _ := CreateMockReviewData()
	
	var userReviews []*models.Review
	for _, review := range mockData.Reviews {
		if review.RevieweeID == userID && review.IsVisible {
			userReviews = append(userReviews, review)
		}
	}
	
	return userReviews
}

// GetMockCompletedJobs returns all completed jobs
func GetMockCompletedJobs() []*models.Job {
	mockData, _ := CreateMockReviewData()
	return mockData.CompletedJobs
}

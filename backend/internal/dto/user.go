package dto

type CreateUserRequest struct {
	Email           string   `json:"email" validate:"required,email" example:"user@example.com"`
	Name            string   `json:"name" validate:"required,min=2,max=100" example:"John Doe"`
	Password        string   `json:"password" validate:"required,min=8" example:"password123"`
	UserType        string   `json:"user_type" validate:"required,user_type" example:"student"`
	Phone           string   `json:"phone,omitempty" validate:"omitempty,e164" example:"+1234567890"`
	ExperienceLevel string   `json:"experience_level,omitempty" validate:"omitempty,experience_level" example:"intermediate"`
	Location        string   `json:"location,omitempty" validate:"omitempty,max=200" example:"Hong Kong"`
	WorkPreference  string   `json:"work_preference,omitempty" validate:"omitempty,work_preference" example:"remote"`
	Bio             string   `json:"bio,omitempty" validate:"omitempty,max=500" example:"Software developer with 5 years experience"`
	Portfolio       string   `json:"portfolio,omitempty" validate:"omitempty,url" example:"https://portfolio.example.com"`
	Skills          []string `json:"skills,omitempty" example:"[\"JavaScript\", \"Go\", \"React\"]"`
	Interests       []string `json:"interests,omitempty" example:"[\"Web Development\", \"AI\", \"Blockchain\"]"`
}

type ResendVerificationRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type UserListResponse struct {
	Users      []UserResponse `json:"users"`
	Total      int64          `json:"total"`
	Page       int            `json:"page"`
	Limit      int            `json:"limit"`
	TotalPages int            `json:"total_pages"`
}
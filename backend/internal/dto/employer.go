package dto

// CreateEmployerRequest represents the request to create a new employer profile
type CreateEmployerRequest struct {
	UserID      string `json:"user_id" validate:"required"`
	CompanyName string `json:"company_name" validate:"required,min=2,max=100"`
	CompanyType string `json:"company_type" validate:"required,oneof=startup sme corporate nonprofit education other"`
	Industry    string `json:"industry" validate:"required"`
	CompanySize string `json:"company_size" validate:"required,oneof=1-10 10-50 50-200 200-1000 1000+"`
	Location    string `json:"location" validate:"required"`
	Website     string `json:"website"`
	Description string `json:"description"`
	FirstName   string `json:"first_name" validate:"required,min=2,max=50"`
	LastName    string `json:"last_name" validate:"required,min=2,max=50"`
	Email       string `json:"email" validate:"required,email"`
	Phone       string `json:"phone" validate:"required"`
	Position    string `json:"position" validate:"required"`
	Bio         string `json:"bio"`
}

// UpdateEmployerRequest represents the request to update an employer profile
type UpdateEmployerRequest struct {
	CompanyName string `json:"company_name,omitempty" validate:"omitempty,min=2,max=100"`
	CompanyType string `json:"company_type,omitempty" validate:"omitempty,oneof=startup sme corporate nonprofit education other"`
	Industry    string `json:"industry,omitempty"`
	CompanySize string `json:"company_size,omitempty" validate:"omitempty,oneof=1-10 10-50 50-200 200-1000 1000+"`
	Location    string `json:"location,omitempty"`
	Website     string `json:"website,omitempty"`
	Description string `json:"description,omitempty"`
	FirstName   string `json:"first_name,omitempty" validate:"omitempty,min=2,max=50"`
	LastName    string `json:"last_name,omitempty" validate:"omitempty,min=2,max=50"`
	Email       string `json:"email,omitempty" validate:"omitempty,email"`
	Phone       string `json:"phone,omitempty"`
	Position    string `json:"position,omitempty"`
	Bio         string `json:"bio,omitempty"`
}
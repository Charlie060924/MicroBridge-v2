package validation

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

type Validator struct {
	validate *validator.Validate
}

func New() *Validator {
	validate := validator.New()
	
	// Register custom tag name function
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	// Register custom validators
	validate.RegisterValidation("user_type", validateUserType)
	validate.RegisterValidation("experience_level", validateExperienceLevel)
	validate.RegisterValidation("work_preference", validateWorkPreference)

	return &Validator{validate: validate}
}

func (v *Validator) Validate(s interface{}) error {
	if err := v.validate.Struct(s); err != nil {
		var errors []string
		for _, err := range err.(validator.ValidationErrors) {
			errors = append(errors, v.formatValidationError(err))
		}
		return fmt.Errorf(strings.Join(errors, ", "))
	}
	return nil
}

func (v *Validator) formatValidationError(err validator.FieldError) string {
	field := err.Field()
	
	switch err.Tag() {
	case "required":
		return fmt.Sprintf("%s is required", field)
	case "email":
		return fmt.Sprintf("%s must be a valid email", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters long", field, err.Param())
	case "max":
		return fmt.Sprintf("%s must be at most %s characters long", field, err.Param())
	case "oneof":
		return fmt.Sprintf("%s must be one of: %s", field, err.Param())
	case "e164":
		return fmt.Sprintf("%s must be a valid phone number", field)
	case "user_type":
		return fmt.Sprintf("%s must be either 'student' or 'employer'", field)
	case "experience_level":
		return fmt.Sprintf("%s must be one of: entry, intermediate, advanced, senior, expert", field)
	case "work_preference":
		return fmt.Sprintf("%s must be one of: remote, onsite, hybrid", field)
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s", field, err.Param())
	case "lte":
		return fmt.Sprintf("%s must be less than or equal to %s", field, err.Param())
	case "url":
		return fmt.Sprintf("%s must be a valid URL", field)
	default:
		return fmt.Sprintf("%s is invalid", field)
	}
}

// Custom validation functions
func validateUserType(fl validator.FieldLevel) bool {
	userType := fl.Field().String()
	return userType == "student" || userType == "employer"
}

func validateExperienceLevel(fl validator.FieldLevel) bool {
	level := fl.Field().String()
	validLevels := []string{"entry", "intermediate", "advanced", "senior", "expert"}
	for _, validLevel := range validLevels {
		if level == validLevel {
			return true
		}
	}
	return false
}

func validateWorkPreference(fl validator.FieldLevel) bool {
	preference := fl.Field().String()
	validPreferences := []string{"remote", "onsite", "hybrid"}
	for _, validPref := range validPreferences {
		if preference == validPref {
			return true
		}
	}
	return false
}

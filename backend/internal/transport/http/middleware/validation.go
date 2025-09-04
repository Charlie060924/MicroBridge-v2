package middleware

import (
	"net/http"
	"reflect"
	"strings"

	"microbridge/backend/internal/dto"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
	
	// Register custom validators
	validate.RegisterValidation("application_status", validateApplicationStatus)
	
	// Use JSON field names for validation errors
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

// ValidationMiddleware provides request validation middleware
func ValidationMiddleware() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Next()
	})
}

// ValidateStruct validates a struct and returns formatted errors
func ValidateStruct(data interface{}) map[string][]string {
	validationErrors := make(map[string][]string)

	if err := validate.Struct(data); err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			field := err.Field()
			message := getValidationMessage(err)
			
			if validationErrors[field] == nil {
				validationErrors[field] = []string{}
			}
			validationErrors[field] = append(validationErrors[field], message)
		}
	}

	return validationErrors
}

// HandleValidationError creates a standardized validation error response
func HandleValidationError(c *gin.Context, data interface{}) bool {
	if validationErrors := ValidateStruct(data); len(validationErrors) > 0 {
		c.JSON(http.StatusBadRequest, dto.ValidationErrorResponse{
			Success: false,
			Message: "Validation failed",
			Errors:  validationErrors,
		})
		return true
	}
	return false
}

// Custom validation functions
func validateApplicationStatus(fl validator.FieldLevel) bool {
	status := fl.Field().String()
	validStatuses := []string{
		"draft", "submitted", "reviewed", "interviewed", 
		"accepted", "rejected", "withdrawn",
	}
	
	for _, validStatus := range validStatuses {
		if status == validStatus {
			return true
		}
	}
	return false
}

// getValidationMessage returns a user-friendly validation message
func getValidationMessage(err validator.FieldError) string {
	field := err.Field()
	tag := err.Tag()
	
	switch tag {
	case "required":
		return field + " is required"
	case "email":
		return field + " must be a valid email address"
	case "min":
		return field + " must be at least " + err.Param() + " characters long"
	case "max":
		return field + " must be at most " + err.Param() + " characters long"
	case "oneof":
		return field + " must be one of: " + strings.ReplaceAll(err.Param(), " ", ", ")
	case "application_status":
		return field + " must be a valid application status"
	case "url":
		return field + " must be a valid URL"
	case "numeric":
		return field + " must be a number"
	default:
		return field + " is invalid"
	}
}

// ValidateJSON middleware validates JSON request body
func ValidateJSON(model interface{}) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		// Create a new instance of the model type
		modelType := reflect.TypeOf(model)
		if modelType.Kind() == reflect.Ptr {
			modelType = modelType.Elem()
		}
		modelValue := reflect.New(modelType).Interface()

		// Bind and validate JSON
		if err := c.ShouldBindJSON(modelValue); err != nil {
			c.JSON(http.StatusBadRequest, dto.APIResponse{
				Success: false,
				Message: "Invalid JSON format",
				Errors:  []string{err.Error()},
			})
			c.Abort()
			return
		}

		// Validate struct
		if HandleValidationError(c, modelValue) {
			c.Abort()
			return
		}

		// Store validated data in context
		c.Set("validatedData", modelValue)
		c.Next()
	})
}

// GetValidatedData retrieves validated data from context
func GetValidatedData(c *gin.Context, dest interface{}) bool {
	if data, exists := c.Get("validatedData"); exists {
		// Use reflection to copy data to destination
		destValue := reflect.ValueOf(dest)
		if destValue.Kind() != reflect.Ptr {
			return false
		}
		
		dataValue := reflect.ValueOf(data)
		if dataValue.Kind() == reflect.Ptr {
			dataValue = dataValue.Elem()
		}
		
		destValue.Elem().Set(dataValue)
		return true
	}
	return false
}
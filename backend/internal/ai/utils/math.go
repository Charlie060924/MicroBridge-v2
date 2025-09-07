package utils

import "math"

// Sigmoid activation function
func Sigmoid(x float64) float64 {
	return 1.0 / (1.0 + math.Exp(-x))
}

// ReLU activation function
func ReLU(x float64) float64 {
	if x > 0 {
		return x
	}
	return 0
}

// Tanh activation function
func Tanh(x float64) float64 {
	return math.Tanh(x)
}
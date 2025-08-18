.PHONY: help build run test clean docker-up docker-down migrate deps lint format

# Variables
BINARY_NAME=microbridge-api
DOCKER_COMPOSE=docker-compose
GO_VERSION=1.21

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the application
	go build -o bin/$(BINARY_NAME) cmd/api/main.go

run: ## Run the application
	go run cmd/api/main.go

run-secure: ## Run the secure application
	go run cmd/api/secure_main.go

test: ## Run tests
	go test -v ./...

test-security: ## Run security tests
	@echo "Running security tests..."
	chmod +x scripts/test_security.sh
	./scripts/test_security.sh

test-jwt: ## Run JWT tests specifically
	@echo "Running JWT tests..."
	go test -v ./pkg/jwt/...

test-coverage: ## Run tests with coverage
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out

test-unit: ## Run only unit tests
	go test -v -short ./...

test-integration: ## Run integration tests
	go test -v -run Integration ./...

clean: ## Clean build artifacts
	rm -rf bin/
	rm -f coverage.out

docker-build: ## Build Docker image
	docker build -t $(BINARY_NAME) .

docker-up: ## Start all services with Docker Compose
	$(DOCKER_COMPOSE) up -d

docker-down: ## Stop all services with Docker Compose
	$(DOCKER_COMPOSE) down

docker-logs: ## View Docker Compose logs
	$(DOCKER_COMPOSE) logs -f

migrate: ## Run database migrations
	go run cmd/migrate/main.go

seed: ## Seed database with mock data
	go run cmd/seed/main.go

seed-clear: ## Clear existing data and seed database
	go run cmd/seed/main.go --clear

deps: ## Install dependencies
	go mod tidy
	go mod download

deps-update: ## Update dependencies
	go get -u ./...
	go mod tidy

lint: ## Run linter
	@which golangci-lint > /dev/null || (echo "Installing golangci-lint..." && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest)
	golangci-lint run

format: ## Format code
	go fmt ./...
	@which goimports > /dev/null || (echo "Installing goimports..." && go install golang.org/x/tools/cmd/goimports@latest)
	goimports -w .

gen-docs: ## Generate API documentation (placeholder)
	@echo "Generating API documentation..."
	@echo "TODO: Install and configure swag"
	# swag init -g cmd/api/main.go -o docs/

gen-mocks: ## Generate mocks for testing
	@which mockgen > /dev/null || (echo "Installing mockgen..." && go install github.com/golang/mock/mockgen@latest)
	@echo "Generating mocks..."
	@echo "TODO: Add mockgen commands for interfaces"

security-scan: ## Run security scan
	@which gosec > /dev/null || (echo "Installing gosec..." && go install github.com/securecodewarrior/gosec/v2/cmd/gosec@latest)
	gosec ./...

benchmark: ## Run benchmarks
	go test -bench=. -benchmem ./...

dev-setup: deps ## Setup development environment
	@echo "Setting up development environment..."
	@echo "Creating .env file from .env.example if it doesn't exist..."
	@if [ ! -f .env ]; then \
		if [ -f .env.example ]; then \
			cp .env.example .env; \
			echo ".env file created from .env.example"; \
		else \
			echo "Creating basic .env file..."; \
			echo "GO_ENV=development" > .env; \
			echo "SERVER_HOST=localhost" >> .env; \
			echo "SERVER_PORT=8080" >> .env; \
			echo "DB_HOST=localhost" >> .env; \
			echo "DB_PORT=5432" >> .env; \
			echo "DB_USER=postgres" >> .env; \
			echo "DB_PASSWORD=password" >> .env; \
			echo "DB_NAME=microbridge_dev" >> .env; \
			echo "JWT_SECRET=your-secret-key-change-in-production" >> .env; \
		fi; \
	fi
	@echo "Development environment setup complete!"

check: lint test ## Run all checks

ci: deps check ## Run CI pipeline
	@echo "Running CI pipeline..."

.DEFAULT_GOAL := help

.PHONY: migrate-up migrate-down migrate-status
migrate-up:
	go run cmd/migrate/main.go -action=up

migrate-down:
	@read -p "Enter target version: " version; \
	go run cmd/migrate/main.go -action=down -version=$version

migrate-status:
	go run cmd/migrate/main.go -action=status

.PHONY: monitoring-up monitoring-down
monitoring-up:
	docker-compose -f docker-compose.monitoring.yml up -d

monitoring-down:
	docker-compose -f docker-compose.monitoring.yml down

.PHONY: load-test stress-test
load-test:
	k6 run tests/load-test.js

stress-test:
	k6 run tests/stress-test.js

.PHONY: performance-profile
performance-profile:
	go test -cpuprofile=cpu.prof -memprofile=mem.prof -bench=. ./internal/services/matching/
	go tool pprof cpu.prof

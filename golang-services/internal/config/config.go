package config

import (
	"os"
)

type Config struct {
	Port        string
	DatabaseURL string
	Environment string
	BaseURL     string
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgresql://postgres:postgres@localhost:5432/shorturl_db?sslmode=disable"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "development"
	}

	baseURL := os.Getenv("BASE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	return &Config{
		Port:        port,
		DatabaseURL: dbURL,
		Environment: env,
		BaseURL:     baseURL,
	}
}


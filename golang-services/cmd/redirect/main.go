package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"shorturl-services/internal/config"
	"shorturl-services/internal/modules/analytics"
	"shorturl-services/internal/modules/redirect"
)

func main() {
	cfg := config.Load()
	log.Printf("🚀 Initializing Golang High-Concurrency Redirect Engine on port %s", cfg.Port)

	// Connect to Database (optional / graceful fallback)
	var db *sql.DB
	/*
	// If PostgreSQL driver is available:
	var err error
	db, err = sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Printf("⚠️  Database connection unavailable, running in low-latency cached mode: %v", err)
	}
	*/

	repo := redirect.NewSQLRepository(db)
	service := redirect.NewService(repo)
	handler := redirect.NewHandler(service)

	// Context for graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Launch async analytics ingestion worker
	worker := analytics.NewWorker(db)
	go worker.StartConsumer(ctx)

	// Setup HTTP Server
	mux := http.NewServeMux()
	mux.HandleFunc("/", handler.HandleRedirect)

	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      mux,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Graceful shutdown listener
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("✅ Go Redirection Gateway active: http://localhost:%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server listen failed: %v", err)
		}
	}()

	<-stopChan
	log.Println("Shutting down Go engine gracefully...")
	cancel()

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}
	log.Println("Go engine stopped.")
}


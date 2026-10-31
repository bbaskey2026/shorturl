package analytics

import (
	"context"
	"database/sql"
	"log"
	"time"

	"shorturl-services/internal/shared"
)

type Worker struct {
	db *sql.DB
}

func NewWorker(db *sql.DB) *Worker {
	return &Worker{db: db}
}

// StartConsumer processes the event channel in micro-batches
func (w *Worker) StartConsumer(ctx context.Context) {
	log.Println("⚡ Analytics Ingestion Worker started (batch size: 200, interval: 500ms)")

	buffer := make([]shared.ClickEvent, 0, 200)
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			if len(buffer) > 0 {
				w.flush(buffer)
			}
			log.Println("Analytics Worker stopped gracefully")
			return

		case evt := <-shared.EventChannel:
			buffer = append(buffer, evt)
			if len(buffer) >= 200 {
				w.flush(buffer)
				buffer = make([]shared.ClickEvent, 0, 200)
			}

		case <-ticker.C:
			if len(buffer) > 0 {
				w.flush(buffer)
				buffer = make([]shared.ClickEvent, 0, 200)
			}
		}
	}
}

func (w *Worker) flush(events []shared.ClickEvent) {
	count := len(events)
	if count == 0 {
		return
	}

	log.Printf("📊 Flushing %d click events to analytics datastore", count)

	if w.db == nil {
		return
	}

	// Insert into PostgreSQL
	tx, err := w.db.Begin()
	if err != nil {
		log.Printf("Failed to begin transaction: %v", err)
		return
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		INSERT INTO click_events (link_id, visitor_hash, referrer, country, city, browser, os, device_type, clicked_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`)
	if err != nil {
		log.Printf("Failed to prepare statement: %v", err)
		return
	}
	defer stmt.Close()

	for _, evt := range events {
		_, _ = stmt.Exec(
			evt.LinkID,
			evt.VisitorHash,
			evt.Referrer,
			evt.Country,
			evt.City,
			evt.Browser,
			evt.OS,
			evt.DeviceType,
			evt.ClickedAt,
		)
	}

	if err := tx.Commit(); err != nil {
		log.Printf("Failed to commit analytics batch: %v", err)
	}
}

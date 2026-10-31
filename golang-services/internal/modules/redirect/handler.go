package redirect

import (
	"fmt"
	"net/http"
	"strings"
	"time"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) HandleRedirect(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	// Extract shortCode from path
	path := strings.TrimPrefix(r.URL.Path, "/")
	if path == "" || path == "favicon.ico" {
		http.NotFound(w, r)
		return
	}

	// Handle health check
	if path == "health" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"healthy","service":"golang-redirect-engine","time":"%s"}`, time.Now().UTC().Format(time.RFC3339))
		return
	}

	// Extract domain host
	host := r.Host
	if colonIdx := strings.Index(host, ":"); colonIdx != -1 {
		host = host[:colonIdx]
	}

	// 1. Resolve Link
	link, err := h.service.Resolve(path, host)
	if err != nil || link == nil {
		w.WriteHeader(http.StatusNotFound)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprintf(w, `
			<!DOCTYPE html>
			<html><head><title>Link Not Found</title></head>
			<body style="font-family:sans-serif; background:#08090D; color:#F9FAFB; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
				<div style="text-align:center; padding:32px; border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:#12141A;">
					<h2 style="color:#EF4444; margin-bottom:8px;">404 - Link Not Found</h2>
					<p style="color:#9CA3AF;">The short link code '<b>%s</b>' does not exist.</p>
				</div>
			</body></html>`, path)
		return
	}

	// 2. Validate Active Status
	if !link.IsActive {
		http.Error(w, "This shortened link is currently disabled.", http.StatusGone)
		return
	}

	// 3. Validate Expiration
	if link.ExpiresAt != nil && time.Now().After(*link.ExpiresAt) {
		http.Error(w, "This shortened link has expired.", http.StatusGone)
		return
	}

	// 4. Validate Password Protection
	if link.PasswordHash != nil && *link.PasswordHash != "" {
		pwd := r.URL.Query().Get("pwd")
		if pwd == "" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			fmt.Fprintf(w, `
				<!DOCTYPE html>
				<html><head><title>Password Required</title></head>
				<body style="font-family:sans-serif; background:#08090D; color:#F9FAFB; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
					<form method="GET" style="padding:32px; border:1px solid rgba(255,255,255,0.1); border-radius:12px; background:#12141A; display:flex; flex-direction:column; gap:16px;">
						<h3 style="margin:0;">🔒 Password Protected Link</h3>
						<input type="password" name="pwd" placeholder="Enter password" required style="padding:10px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background:#1D2232; color:#FFF;" />
						<button type="submit" style="padding:10px; border-radius:8px; border:none; background:#3B82F6; color:#FFF; font-weight:600; cursor:pointer;">Continue</button>
					</form>
				</body></html>`)
			return
		}
		if !VerifyPassword(pwd, *link.PasswordHash) {
			http.Error(w, "Invalid password provided.", http.StatusForbidden)
			return
		}
	}

	// 5. Asynchronous telemetry ingestion
	clientIP := r.Header.Get("X-Forwarded-For")
	if clientIP == "" {
		clientIP = r.RemoteAddr
	}
	userAgent := r.UserAgent()
	referrer := r.Referer()

	h.service.TrackClickAsync(link, clientIP, userAgent, referrer)

	// Set low-latency headers & redirect
	w.Header().Set("X-Redirect-Latency", fmt.Sprintf("%dµs", time.Since(start).Microseconds()))
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	http.Redirect(w, r, link.OriginalURL, http.StatusFound) // 302 Found
}


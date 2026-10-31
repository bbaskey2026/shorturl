package shared

import (
	"crypto/sha256"
	"encoding/hex"
	"strings"
	"time"
)

// ClickEvent represents an analytics telemetry record
type ClickEvent struct {
	LinkID      string    `json:"link_id"`
	VisitorHash string    `json:"visitor_hash"`
	Referrer    string    `json:"referrer"`
	Country     string    `json:"country"`
	City        string    `json:"city"`
	Browser     string    `json:"browser"`
	OS          string    `json:"os"`
	DeviceType  string    `json:"device_type"`
	ClickedAt   time.Time `json:"clicked_at"`
}

// Global async event channel (capacity 50,000)
var EventChannel = make(chan ClickEvent, 50000)

// Helper to calculate daily anonymized visitor hash
func HashVisitor(ip, userAgent string) string {
	today := time.Now().UTC().Format("2006-01-02")
	raw := ip + "|" + userAgent + "|" + today + "|shorturl_privacy_salt"
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}

// Simple heuristic parser for user-agent
func ParseUserAgent(ua string) (browser, os, deviceType string) {
	uaLower := strings.ToLower(ua)

	// Device
	if strings.Contains(uaLower, "mobile") || strings.Contains(uaLower, "android") || strings.Contains(uaLower, "iphone") {
		deviceType = "Mobile"
	} else if strings.Contains(uaLower, "tablet") || strings.Contains(uaLower, "ipad") {
		deviceType = "Tablet"
	} else {
		deviceType = "Desktop"
	}

	// Browser
	if strings.Contains(uaLower, "edg/") {
		browser = "Edge"
	} else if strings.Contains(uaLower, "chrome/") {
		browser = "Chrome"
	} else if strings.Contains(uaLower, "firefox/") {
		browser = "Firefox"
	} else if strings.Contains(uaLower, "safari/") && !strings.Contains(uaLower, "chrome/") {
		browser = "Safari"
	} else {
		browser = "Other"
	}

	// OS
	if strings.Contains(uaLower, "iphone") || strings.Contains(uaLower, "ipad") || strings.Contains(uaLower, "ios") {
		os = "iOS"
	} else if strings.Contains(uaLower, "android") {
		os = "Android"
	} else if strings.Contains(uaLower, "windows") {
		os = "Windows"
	} else if strings.Contains(uaLower, "macintosh") || strings.Contains(uaLower, "mac os") {
		os = "macOS"
	} else if strings.Contains(uaLower, "linux") {
		os = "Linux"
	} else {
		os = "Other"
	}

	return
}

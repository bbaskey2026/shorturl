package redirect

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"sync"
	"time"

	"shorturl-services/internal/shared"
)

type Service struct {
	cache   sync.Map
	repo    Repository
}

type Repository interface {
	FindByCode(code string, domain string) (*ShortLink, error)
	IncrementClick(id string) error
}

func NewService(repo Repository) *Service {
	return &Service{
		repo: repo,
	}
}

// In-memory cache record with 15-minute TTL
type cachedEntry struct {
	link      *ShortLink
	expiresAt time.Time
}

func (s *Service) Resolve(code, domain string) (*ShortLink, error) {
	cacheKey := domain + ":" + code

	// 1. Check hot cache
	if val, ok := s.cache.Load(cacheKey); ok {
		entry := val.(cachedEntry)
		if time.Now().Before(entry.expiresAt) {
			return entry.link, nil
		}
		s.cache.Delete(cacheKey)
	}

	// 2. Query Repository
	link, err := s.repo.FindByCode(code, domain)
	if err != nil {
		return nil, err
	}
	if link == nil {
		return nil, errors.New("link not found")
	}

	// 3. Cache entry for 15 minutes
	s.cache.Store(cacheKey, cachedEntry{
		link:      link,
		expiresAt: time.Now().Add(15 * time.Minute),
	})

	return link, nil
}

func (s *Service) TrackClickAsync(link *ShortLink, ip, userAgent, referrer string) {
	browser, os, device := shared.ParseUserAgent(userAgent)
	hash := shared.HashVisitor(ip, userAgent)

	event := shared.ClickEvent{
		LinkID:      link.ID,
		VisitorHash: hash,
		Referrer:    referrer,
		Country:     "US", // Default or GeoIP lookup
		City:        "Unknown",
		Browser:     browser,
		OS:          os,
		DeviceType:  device,
		ClickedAt:   time.Now().UTC(),
	}

	// Non-blocking publish to pipeline
	select {
	case shared.EventChannel <- event:
	default:
		// Saturated queue: drops telemetry instead of degrading redirect response
	}
}

// Simple hash verification for passwords
func VerifyPassword(inputPassword, storedHash string) bool {
	sum := sha256.Sum256([]byte(inputPassword))
	return hex.EncodeToString(sum[:]) == storedHash
}


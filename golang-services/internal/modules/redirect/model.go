package redirect

import "time"

type ShortLink struct {
	ID                 string     `json:"id"`
	OriginalURL        string     `json:"original_url"`
	ShortCode          string     `json:"short_code"`
	CustomDomain       string     `json:"custom_domain,omitempty"`
	PasswordHash       *string    `json:"password_hash,omitempty"`
	IsActive           bool       `json:"is_active"`
	ExpiresAt          *time.Time `json:"expires_at,omitempty"`
	CachedAt           time.Time  `json:"cached_at"`
}


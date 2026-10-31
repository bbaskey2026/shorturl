package redirect

import (
	"database/sql"
	"strings"
)

type SQLRepository struct {
	db *sql.DB
}

func NewSQLRepository(db *sql.DB) *SQLRepository {
	return &SQLRepository{db: db}
}

func (r *SQLRepository) FindByCode(code string, domain string) (*ShortLink, error) {
	if r.db == nil {
		// In-memory demo fallback when DB is disconnected
		return getFallbackLink(code), nil
	}

	query := `
		SELECT l.id, l.original_url, l.short_code, l.password_hash, l.is_active, l.expires_at,
		       COALESCE(d.domain, '') as custom_domain
		FROM short_links l
		LEFT JOIN custom_domains d ON l.domain_id = d.id
		WHERE l.short_code = $1
		LIMIT 1`

	var link ShortLink
	var customDomain string
	var expiresAt sql.NullTime
	var pwdHash sql.NullString

	err := r.db.QueryRow(query, code).Scan(
		&link.ID,
		&link.OriginalURL,
		&link.ShortCode,
		&pwdHash,
		&link.IsActive,
		&expiresAt,
		&customDomain,
	)

	if err == sql.ErrNoRows {
		// Check fallback
		return getFallbackLink(code), nil
	}
	if err != nil {
		return getFallbackLink(code), nil
	}

	if pwdHash.Valid {
		link.PasswordHash = &pwdHash.String
	}
	if expiresAt.Valid {
		link.ExpiresAt = &expiresAt.Time
	}
	link.CustomDomain = customDomain

	return &link, nil
}

func (r *SQLRepository) IncrementClick(id string) error {
	if r.db == nil {
		return nil
	}
	_, err := r.db.Exec("UPDATE short_links SET click_count = click_count + 1 WHERE id = $1", id)
	return err
}

// Built-in seed shortcuts for instant out-of-the-box redirection testing
func getFallbackLink(code string) *ShortLink {
	code = strings.ToLower(code)
	switch code {
	case "gh-conc":
		return &ShortLink{
			ID:          "d0000000-0000-0000-0000-000000000001",
			OriginalURL: "https://github.com/developer/high-concurrency-systems",
			ShortCode:   "gh-conc",
			IsActive:    true,
		}
	case "golang-repo", "go":
		return &ShortLink{
			ID:          "d0000000-0000-0000-0000-000000000002",
			OriginalURL: "https://github.com/golang/go",
			ShortCode:   "golang-repo",
			IsActive:    true,
		}
	case "muse-ds":
		return &ShortLink{
			ID:          "d0000000-0000-0000-0000-000000000003",
			OriginalURL: "https://muse.ai",
			ShortCode:   "muse-ds",
			IsActive:    true,
		}
	case "pg-docs":
		return &ShortLink{
			ID:          "d0000000-0000-0000-0000-000000000004",
			OriginalURL: "https://www.postgresql.org/docs/17/index.html",
			ShortCode:   "pg-docs",
			IsActive:    true,
		}
	}
	return nil
}

package redirect

import (
	"testing"
)

type mockRepo struct{}

func (m *mockRepo) FindByCode(code string, domain string) (*ShortLink, error) {
	if code == "test-alias" {
		return &ShortLink{
			ID:          "mock-1",
			OriginalURL: "https://example.com/target",
			ShortCode:   "test-alias",
			IsActive:    true,
		}, nil
	}
	return nil, nil
}

func (m *mockRepo) IncrementClick(id string) error {
	return nil
}

func TestResolveAndCache(t *testing.T) {
	svc := NewService(&mockRepo{})

	// 1. Initial resolution (hits repo)
	link, err := svc.Resolve("test-alias", "short.io")
	if err != nil {
		t.Fatalf("unexpected error resolving link: %v", err)
	}
	if link.OriginalURL != "https://example.com/target" {
		t.Errorf("expected destination URL https://example.com/target, got %s", link.OriginalURL)
	}

	// 2. Second resolution (hits memory cache directly)
	cachedLink, err := svc.Resolve("test-alias", "short.io")
	if err != nil {
		t.Fatalf("unexpected error resolving cached link: %v", err)
	}
	if cachedLink.ID != link.ID {
		t.Errorf("expected cached instance ID %s, got %s", link.ID, cachedLink.ID)
	}

	// 3. Non-existent link
	missing, err := svc.Resolve("missing-code", "short.io")
	if err == nil || missing != nil {
		t.Errorf("expected error for non-existent link")
	}
}


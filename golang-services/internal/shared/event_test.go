package shared

import (
	"testing"
)

func TestParseUserAgent(t *testing.T) {
	tests := []struct {
		name       string
		ua         string
		expBrowser string
		expOS      string
		expDevice  string
	}{
		{
			name:       "Chrome on Windows Desktop",
			ua:         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			expBrowser: "Chrome",
			expOS:      "Windows",
			expDevice:  "Desktop",
		},
		{
			name:       "Safari on iPhone Mobile",
			ua:         "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
			expBrowser: "Safari",
			expOS:      "iOS",
			expDevice:  "Mobile",
		},
		{
			name:       "Firefox on Linux Desktop",
			ua:         "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0",
			expBrowser: "Firefox",
			expOS:      "Linux",
			expDevice:  "Desktop",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b, os, dev := ParseUserAgent(tt.ua)
			if b != tt.expBrowser {
				t.Errorf("expected browser %s, got %s", tt.expBrowser, b)
			}
			if os != tt.expOS {
				t.Errorf("expected OS %s, got %s", tt.expOS, os)
			}
			if dev != tt.expDevice {
				t.Errorf("expected device %s, got %s", tt.expDevice, dev)
			}
		})
	}
}

func TestHashVisitor(t *testing.T) {
	h1 := HashVisitor("192.168.1.1", "Chrome")
	h2 := HashVisitor("192.168.1.1", "Chrome")
	h3 := HashVisitor("10.0.0.1", "Chrome")

	if h1 != h2 {
		t.Errorf("expected identical hashes for same IP/UA on same day")
	}
	if h1 == h3 {
		t.Errorf("expected different hashes for different IPs")
	}
	if len(h1) != 64 {
		t.Errorf("expected 64-char sha256 hex string, got %d", len(h1))
	}
}


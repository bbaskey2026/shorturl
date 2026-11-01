// AuthModal.jsx - Muse.ai-Inspired Authentication Dialog for Customer & Admin
import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { useAuth } from './AuthContext';
import { IconShield, IconLock, IconUsers } from '../../components/common/Icons';

export const AuthModal = ({ isOpen, onClose, initialTab = 'customer-login', onSuccess }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'customer-login', 'register', 'admin-login'

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMsg('');
    }
  }, [isOpen, initialTab]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginCustomer, loginAdmin, registerCustomer } = useAuth();

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      if (activeTab === 'customer-login') {
        await loginCustomer(email, password);
      } else if (activeTab === 'admin-login') {
        await loginAdmin(email, password);
      } else if (activeTab === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await registerCustomer(name, email, password, confirmPassword);
      }

      resetForm();
      if (typeof onSuccess === 'function') {
        onSuccess(activeTab === 'admin-login' ? 'admin' : 'customer');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={
        activeTab === 'admin-login'
          ? 'Administrator Portal'
          : activeTab === 'register'
          ? 'Create Customer Account'
          : 'Log In to ShortSaaS'
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Navigation Tabs styled like Muse.ai pills */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-elevated)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => switchTab('customer-login')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'customer-login' ? 'var(--color-bg-paper)' : 'transparent',
              color: activeTab === 'customer-login' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'customer-login' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => switchTab('register')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'register' ? 'var(--color-bg-paper)' : 'transparent',
              color: activeTab === 'register' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => switchTab('admin-login')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: activeTab === 'admin-login' ? 'var(--color-bg-paper)' : 'transparent',
              color: activeTab === 'admin-login' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fontSize: '12px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              boxShadow: activeTab === 'admin-login' ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              transition: 'all var(--transition-fast)',
            }}
          >
            Staff Admin
          </button>
        </div>

        {/* Security Notification Banner for Admin */}
        {activeTab === 'admin-login' && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(0, 116, 228, 0.08)',
              border: '1px solid rgba(0, 116, 228, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: 'var(--color-primary)',
            }}
          >
            <IconShield size={16} />
            <span>Staff portal requires authorized administrator role and credentials.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(242, 0, 57, 0.1)',
              border: '1px solid rgba(242, 0, 57, 0.25)',
              color: 'var(--color-status-error)',
              fontSize: '12.5px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder={activeTab === 'admin-login' ? 'admin@shorturl.io' : 'alex@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '9px 12px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{
                padding: '9px 12px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          {activeTab === 'register' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                }}
              />
            </div>
          )}

          {activeTab === 'admin-login' && (
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Demo staff account: <code>admin@shorturl.io</code>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              cursor: submitting ? 'wait' : 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
          >
            {submitting
              ? 'Authenticating...'
              : activeTab === 'admin-login'
              ? 'Log In to Admin Portal'
              : activeTab === 'register'
              ? 'Create Customer Account'
              : 'Log In to Customer Account'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default AuthModal;

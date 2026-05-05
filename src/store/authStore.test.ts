import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, useIsAuthenticated } from './authStore';
import type { User } from '@/types';
import { renderHook } from '@testing-library/react';

const fakeUser: User = {
  id: 'u1',
  email: 'test@test.com',
  name: 'Test User',
  avatarUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('authStore', () => {
  beforeEach(() => {
    // Reset to initial state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isLoading: true,
    });
  });

  it('starts with no user, no token, and isLoading=true', () => {
    const { user, accessToken, isLoading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(accessToken).toBeNull();
    expect(isLoading).toBe(true);
  });

  it('setTokens populates user, accessToken, and clears isLoading', () => {
    useAuthStore.getState().setTokens('new-access-token', fakeUser);
    const { user, accessToken, isLoading } = useAuthStore.getState();
    expect(user).toEqual(fakeUser);
    expect(accessToken).toBe('new-access-token');
    expect(isLoading).toBe(false);
  });

  it('clearAuth wipes user and accessToken', () => {
    useAuthStore.getState().setTokens('x', fakeUser);
    useAuthStore.getState().clearAuth();
    const { user, accessToken, isLoading } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(accessToken).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('setAccessToken updates only the access token', () => {
    useAuthStore.getState().setTokens('first', fakeUser);
    useAuthStore.getState().setAccessToken('second');
    const { accessToken, user } = useAuthStore.getState();
    expect(accessToken).toBe('second');
    expect(user).toEqual(fakeUser);
  });

  it('setLoading toggles isLoading', () => {
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });
});

describe('useIsAuthenticated selector', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, isLoading: true });
  });

  it('returns false when accessToken is null', () => {
    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(false);
  });

  it('returns true after setTokens', () => {
    useAuthStore.getState().setTokens('token', fakeUser);
    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(true);
  });

  it('returns false again after clearAuth', () => {
    useAuthStore.getState().setTokens('token', fakeUser);
    useAuthStore.getState().clearAuth();
    const { result } = renderHook(() => useIsAuthenticated());
    expect(result.current).toBe(false);
  });
});

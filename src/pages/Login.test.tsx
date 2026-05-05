import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './Login';
import { useAuthStore } from '@/store/authStore';

// Mock the api module so submit doesn't hit the network
const mockPost = vi.fn();
vi.mock('@/lib/axios', () => ({
  api: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('<Login />', () => {
  beforeEach(() => {
    mockPost.mockReset();
    useAuthStore.setState({ user: null, accessToken: null, isLoading: false });
  });

  it('renders email and password fields with proper labels', () => {
    renderLogin();
    // Label/id pairing means getByLabelText works
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows zod validation errors for empty submit', async () => {
    renderLogin();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThanOrEqual(2);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('on successful submit, stores access token in auth store', async () => {
    mockPost.mockResolvedValueOnce({
      data: {
        data: {
          accessToken: 'jwt-abc',
          user: {
            id: 'u1',
            email: 'a@b.com',
            name: 'A B',
            avatarUrl: null,
            createdAt: '2026-01-01',
            updatedAt: '2026-01-01',
          },
        },
      },
    });

    renderLogin();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('jwt-abc');
    });
    expect(mockPost).toHaveBeenCalledWith('/v1/auth/login', {
      email: 'a@b.com',
      password: 'password123',
    });
  });

  it('on server error, surfaces backend message and does not store token', async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    renderLogin();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'a@b.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpw');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });
});

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/axios';
import { Spinner } from '@/components/ui/Spinner';
import type { ApiResponse, User } from '@/types';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const { setTokens, isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      navigate('/login', { replace: true });
      return;
    }

    // Temporarily set the access token so the /me call can be authorized
    useAuthStore.getState().setAccessToken(accessToken);

    api
      .get<ApiResponse<User>>('/v1/users/me')
      .then((res) => {
        setTokens(accessToken, refreshToken, res.data.data);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

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
    const { setTokens, accessToken: existingToken, setAccessToken } = useAuthStore.getState();

    if (existingToken !== null) {
      navigate('/dashboard', { replace: true });
      return;
    }

    const tokenFromUrl = searchParams.get('accessToken');

    if (!tokenFromUrl) {
      navigate('/login', { replace: true });
      return;
    }

    // Temporarily set the access token so the /me call can be authorized.
    // The refresh cookie was already set by the backend redirect.
    setAccessToken(tokenFromUrl);

    api
      .get<ApiResponse<User>>('/v1/users/me')
      .then((res) => {
        setTokens(tokenFromUrl, res.data.data);
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

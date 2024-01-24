import { useQuery } from '@tanstack/react-query'
import axiosBackInstance from '@/services/axiosInstances/axiosBackInstance'
import { useTypeDispatch } from '@/store/hooks'
import { logout, setActive, setInfo } from '@/store/adminSlice'

const useTokenRefresh = (refreshInterval: number, active: boolean) => {
  const dispatch = useTypeDispatch();

  const refreshToken = async () => {
    try {
      const response = await axiosBackInstance.get('/users/one', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('swafe-admin')}`,
        },
      });
      dispatch(setActive(true));
      localStorage.setItem('swafe-admin', response.data.data.token);
      return response;
    } catch (error) {
      dispatch(logout());
      return await Promise.reject(error);
    }
  };

  return useQuery({
    queryKey: ['refreshToken'],
    queryFn: refreshToken,
    refetchInterval: active ? refreshInterval : false,
    refetchIntervalInBackground: true,
    enabled: active,
    refetchOnWindowFocus: false,
  });
};

export default useTokenRefresh;

import api from '@/config/axios'
import { useQuery } from '@tanstack/vue-query'

interface IDataset {
  label: string
  data: number[]
}

interface IHomeResponse {
  labels: string[]
  datasets: IDataset[]
}

export default function useHome() {
  const getHome = async (): Promise<IHomeResponse> => {
    const { data } = await api.get('/home')
    return data
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['home'],
    queryFn: getHome,
    staleTime: 1000 * 60 * 2,
    retry: 2
  })

  return {
    data,
    isLoading,
    isError,
    error
  }
}

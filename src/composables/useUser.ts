import api from '@/config/axios'
import { useMutation, useQuery } from '@tanstack/vue-query'
import type { IUser } from '@/types'

export interface IUserForm {
  id: string
  role: string
  status: string
}

export default function useUser() {
  const getUsers = async (): Promise<IUser[]> => {
    const { data } = await api.get('/users')
    return data
  }

  const updateUser = async (data: IUserForm): Promise<void> => {
    await api.put(`/users/${data.id}`, data)
  }

  const mutation = useMutation({
    mutationFn: updateUser
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 2,
    retry: 2
  })

  return {
    data,
    isLoading,
    isError,
    error,
    mutation
  }
}

import { useState, useEffect, useCallback } from 'react'
import api, { errMsg } from './api'

// Loads data from the backend: const { data, loading, error, reload } = useFetch('/products')
export function useFetch(url, initial = []) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(url)
      setData(res.data)
    } catch (e) {
      setError(errMsg(e))
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload }
}

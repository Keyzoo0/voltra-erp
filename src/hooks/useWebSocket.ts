'use client'

import { useEffect, useRef, useState } from 'react'

export function useWebSocket(station: string) {
  const [data, setData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const retryRef = useRef(0)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = process.env.NEXT_PUBLIC_API_HOST || window.location.host
      wsRef.current = new WebSocket(`${protocol}//${host}/api/production/ws?station=${station}`)

      wsRef.current.onopen = () => {
        retryRef.current = 0
        setIsConnected(true)
      }

      wsRef.current.onmessage = (event) => {
        setData(JSON.parse(event.data))
      }

      wsRef.current.onclose = () => {
        setIsConnected(false)
        const delay = Math.min(1000 * 2 ** retryRef.current, 30000)
        retryRef.current++
        timeout = setTimeout(connect, delay)
      }
    }

    connect()

    return () => {
      wsRef.current?.close()
      clearTimeout(timeout)
    }
  }, [station])

  return { data, isConnected }
}

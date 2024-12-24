'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw } from 'lucide-react'

export function TaskTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTime(0)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="absolute bottom-2 right-2 w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Task Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-center mb-3">{formatTime(time)}</div>
        <div className="flex justify-center space-x-2">
          <Button onClick={toggleTimer} variant="outline">
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Timer } from 'lucide-react'
import { useTodoStore } from '@/lib/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function TaskTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)
  const todos = useTodoStore(state => state.todos)
  const updateTimeSpent = useTodoStore(state => state.updateTimeSpent)

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning && selectedTodoId) {
      const todo = todos.find(t => t.id === selectedTodoId);
      if (todo && todo.status === 'in-progress') {
        interval = setInterval(() => {
          updateTimeSpent(selectedTodoId, time + 1);
          setTime(prev => prev + 1);
        }, 1000);
      } else {
        setIsRunning(false);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, selectedTodoId, time, todos, updateTimeSpent]);

  const toggleTimer = () => {
    if (!selectedTodoId) return
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

  const inProgressTodos = todos.filter(todo => todo.status === 'in-progress')

  return (
    <Card className="absolute bottom-2 right-2 w-80">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <Timer className="w-5 h-5" />
          Task Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedTodoId || ''}
          onValueChange={(value: string) => {
            setSelectedTodoId(value)
            const todo = todos.find(t => t.id === value)
            if (todo) {
              setTime(todo.timeSpent || 0)
            }
          }}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select an in-progress task to track" />
          </SelectTrigger>
          <SelectContent>
            {inProgressTodos.length === 0 ? (
              <div className="p-2 text-center text-muted-foreground">
                No todo in progress
              </div>
            ) : (
              inProgressTodos.map(todo => (
                <SelectItem key={todo.id} value={todo.id}>
                  {todo.title}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <div className="text-3xl font-bold text-center mb-3">{formatTime(time)}</div>
        <div className="flex justify-center space-x-2">
          <Button 
            onClick={toggleTimer} 
            variant="outline"
            disabled={!selectedTodoId}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={resetTimer} 
            variant="outline"
            disabled={!selectedTodoId}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}


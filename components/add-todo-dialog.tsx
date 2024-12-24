'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useTodoStore } from '@/lib/store'

interface AddTodoDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTodoDialog({ isOpen, onClose }: AddTodoDialogProps) {
  const addTodo = useTodoStore(state => state.addTodo)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof title !== 'string' || typeof description !== 'string') return
    if (title.trim()) {
      addTodo(title, description)
      setTitle('')
      setDescription('')
      handleClose()
    }
  }

  const handleClose = () => {
    onClose()
    router.push('/')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit">Add Todo</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


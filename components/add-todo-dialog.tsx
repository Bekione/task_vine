'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useTodoStore } from '@/lib/store'

interface AddTodoDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTodoDialog({ isOpen, onClose }: AddTodoDialogProps) {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit-todo')
  const addTodo = useTodoStore(state => state.addTodo)
  const editTodo = useTodoStore(state => state.editTodo)
  const todos = useTodoStore(state => state.todos)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (editId) {
      const todoToEdit = todos.find(todo => todo.id === editId)
      if (todoToEdit) {
        setTitle(todoToEdit.title)
        setDescription(todoToEdit.description || '')
      }
    } else {
      setTitle('')
      setDescription('')
    }
  }, [editId, todos])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof title !== 'string' || typeof description !== 'string') return
    if (title.trim()) {
      if (editId) {
        editTodo(editId, title, description)
      } else {
        addTodo(title, description)
      }
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
          <DialogTitle>{editId ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
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
            className='max-h-40'
            rows={2}
            style={{ resize: 'none' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = ''; // Reset height
              target.style.height = Math.min(target.scrollHeight, 160) + 'px'; // 160px matches max-h-40
            }}
          />
          <Button type="submit">
            {editId ? 'Edit Todo' : 'Add Todo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


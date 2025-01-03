'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useTodoStore } from '@/lib/store'
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from './ui/label'
import { PriorityLevel } from "@/types/todo"
import { useToast } from "@/components/ui/use-toast"

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
  const [priority, setPriority] = useState<PriorityLevel>('none')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (editId) {
      const todoToEdit = todos.find(todo => todo.id === editId)
      if (todoToEdit) {
        setTitle(todoToEdit.title)
        setDescription(todoToEdit.description || '')
        setPriority(todoToEdit.priority)
      }
    } else {
      setTitle('')
      setDescription('')
      setPriority('none')
    }
  }, [editId, todos])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your todo",
        variant: "destructive"
      })
      return
    }

    if (editId) {
      const todoToEdit = todos.find(todo => todo.id === editId)
      if (todoToEdit && 
          todoToEdit.title === title.trim() && 
          todoToEdit.description === description.trim() && 
          todoToEdit.priority === priority
      ) {
        handleClose()
        return
      }

      editTodo(editId, title, description, priority)
      toast({
        title: "Todo updated",
        description: "Your todo has been updated successfully"
      })
    } else {
      addTodo({
        title: title.trim(),
        description: description.trim(),
        priority
      })
      toast({
        title: "Todo created",
        description: "Your new todo has been created successfully"
      })
    }

    handleClose()
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
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup
              value={priority}
              onValueChange={(value: PriorityLevel) => setPriority(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none">None</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className='bg-gradient-to-r from-gradient-from to-gradient-to hover:opacity-90 text-white'>
            {editId ? 'Edit Todo' : 'Add Todo'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


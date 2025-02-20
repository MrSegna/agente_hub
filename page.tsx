"use client"

import { useState } from "react"
import { Plus, MoreVertical, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  description: string
  completed: boolean
}

interface Agent {
  id: string
  name: string
  description: string
  tasks: Task[]
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [newAgent, setNewAgent] = useState({ name: "", description: "" })
  const [newTask, setNewTask] = useState<{ [key: string]: string }>({})

  const createAgent = () => {
    if (newAgent.name.trim() === "") return

    const agent: Agent = {
      id: Math.random().toString(36).substring(7),
      name: newAgent.name,
      description: newAgent.description,
      tasks: [],
    }

    setAgents([...agents, agent])
    setNewAgent({ name: "", description: "" })
  }

  const deleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
  }

  const addTask = (agentId: string) => {
    if (!newTask[agentId]?.trim()) return

    const updatedAgents = agents.map((agent) => {
      if (agent.id === agentId) {
        return {
          ...agent,
          tasks: [
            ...agent.tasks,
            {
              id: Math.random().toString(36).substring(7),
              description: newTask[agentId],
              completed: false,
            },
          ],
        }
      }
      return agent
    })

    setAgents(updatedAgents)
    setNewTask({ ...newTask, [agentId]: "" })
  }

  const toggleTask = (agentId: string, taskId: string) => {
    const updatedAgents = agents.map((agent) => {
      if (agent.id === agentId) {
        return {
          ...agent,
          tasks: agent.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
        }
      }
      return agent
    })
    setAgents(updatedAgents)
  }

  const deleteTask = (agentId: string, taskId: string) => {
    const updatedAgents = agents.map((agent) => {
      if (agent.id === agentId) {
        return {
          ...agent,
          tasks: agent.tasks.filter((task) => task.id !== taskId),
        }
      }
      return agent
    })
    setAgents(updatedAgents)
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Agents Manager</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Enter agent name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Enter agent description"
                />
              </div>
              <Button onClick={createAgent}>Create Agent</Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card key={agent.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>{agent.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => deleteAgent(agent.id)} className="text-destructive">
                    Delete Agent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
              <div className="space-y-4">
                {agent.tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(agent.id, task.id)} />
                      <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                        {task.description}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(agent.id, task.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Input
                value={newTask[agent.id] || ""}
                onChange={(e) => setNewTask({ ...newTask, [agent.id]: e.target.value })}
                placeholder="Add a task"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask(agent.id)
                  }
                }}
              />
              <Button onClick={() => addTask(agent.id)}>Add</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}


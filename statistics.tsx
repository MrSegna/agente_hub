"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart } from "recharts"
import { Brain, CheckCircle, Clock, ListTodo } from "lucide-react"

interface Task {
  id: string
  description: string
  completed: boolean
  createdAt: Date
}

interface Agent {
  id: string
  name: string
  tasks: Task[]
}

// Sample data - replace with your actual data
const agents: Agent[] = [
  {
    id: "1",
    name: "Agent 1",
    tasks: [
      { id: "1", description: "Task 1", completed: true, createdAt: new Date("2024-02-01") },
      { id: "2", description: "Task 2", completed: false, createdAt: new Date("2024-02-02") },
    ],
  },
  {
    id: "2",
    name: "Agent 2",
    tasks: [
      { id: "3", description: "Task 3", completed: true, createdAt: new Date("2024-02-03") },
      { id: "4", description: "Task 4", completed: true, createdAt: new Date("2024-02-04") },
    ],
  },
]

export default function StatisticsPage() {
  // Calculate statistics
  const totalAgents = agents.length
  const totalTasks = agents.reduce((acc, agent) => acc + agent.tasks.length, 0)
  const completedTasks = agents.reduce((acc, agent) => acc + agent.tasks.filter((task) => task.completed).length, 0)
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Prepare chart data
  const tasksByAgent = agents.map((agent) => ({
    name: agent.name,
    total: agent.tasks.length,
    completed: agent.tasks.filter((task) => task.completed).length,
  }))

  const pieData = [
    { name: "Completed", value: completedTasks, fill: "hsl(var(--primary))" },
    { name: "Pending", value: totalTasks - completedTasks, fill: "hsl(var(--muted))" },
  ]

  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const tasksOnDay = agents.reduce((acc, agent) => {
      return acc + agent.tasks.filter((task) => task.createdAt.toDateString() === date.toDateString()).length
    }, 0)
    return {
      date: date.toLocaleDateString(),
      tasks: tasksOnDay,
    }
  }).reverse()

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Statistics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agents">By Agent</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "hsl(var(--primary))" },
                  pending: { label: "Pending", color: "hsl(var(--muted))" },
                }}
              >
                <PieChart width={300} height={300}>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  total: { label: "Total Tasks", color: "hsl(var(--primary))" },
                  completed: { label: "Completed Tasks", color: "hsl(var(--muted))" },
                }}
              >
                <BarChart data={tasksByAgent} width={600} height={300}>
                  <Bar dataKey="total" fill="hsl(var(--primary))" />
                  <Bar dataKey="completed" fill="hsl(var(--muted))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Task Creation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  tasks: { label: "Tasks", color: "hsl(var(--primary))" },
                }}
              >
                <LineChart data={timelineData} width={600} height={300}>
                  <Line type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


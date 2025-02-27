export const routes = {
  home: "/",
  agents: {
    index: "/agents",
    new: "/agents/new",
    edit: (id: string) => `/agents/${id}/edit`,
    view: (id: string) => `/agents/${id}`,
    stats: (id: string) => `/agents/${id}/stats`,
  },
  apis: {
    index: "/apis",
    new: "/apis/new",
  },
  marketplace: {
    index: "/marketplace",
    stats: "/marketplace/stats",
  },
  messaging: "/messaging",
  status: "/status",
  settings: "/settings",
  statistics: "/statistics",
} as const;

export type AppRoutes = typeof routes;
export type RoutePath = RouteValues<AppRoutes>;

// Helper type para extrair todos os valores de string das rotas
type RouteValues<T> = T extends string
  ? T
  : T extends object
  ? { [K in keyof T]: RouteValues<T[K]> }[keyof T]
  : never;
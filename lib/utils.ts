import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes CSS com suporte a Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data para exibição
 */
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formata um valor monetário
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Gera um ID único
 */
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

/**
 * Atrasa a execução por um tempo determinado
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Verifica se uma string é um JSON válido
 */
export function isValidJson(str: string) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Cria um slug a partir de uma string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Trunca um texto com ellipsis
 */
export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Combina URLs de forma segura
 */
export function joinUrl(...parts: string[]) {
  return parts
    .map(part => part.replace(/(^\/+|\/+$)/g, ''))
    .filter(Boolean)
    .join('/')
}

/**
 * Sanitiza uma string para uso em HTML
 */
export function sanitizeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Compara duas versões semânticas
 * Retorna: 1 se a > b, -1 se a < b, 0 se a === b
 */
export function compareVersions(a: string, b: string) {
  const pa = a.split('.')
  const pb = b.split('.')
  
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i])
    const nb = Number(pb[i])
    
    if (na > nb) return 1
    if (nb > na) return -1
    if (!isNaN(na) && isNaN(nb)) return 1
    if (isNaN(na) && !isNaN(nb)) return -1
  }
  
  return 0
}

/**
 * Remove itens duplicados de um array baseado em uma chave
 */
export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}

/**
 * Agrupa um array de objetos por uma chave
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((groups, item) => {
    const value = String(item[key])
    return {
      ...groups,
      [value]: [...(groups[value] || []), item],
    }
  }, {} as Record<string, T[]>)
}

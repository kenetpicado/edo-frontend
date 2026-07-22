import type { LocationQueryRaw, LocationQueryValueRaw } from 'vue-router'

export default function cleanQueryParams(params: any) {
  return Object.fromEntries(Object.entries(params).filter(([_, value]) => value))
}

export function cleanQueryParamsTs(
  params: Record<string, LocationQueryValueRaw | LocationQueryValueRaw[]>
): LocationQueryRaw {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== null && value !== ''
    })
  )
}

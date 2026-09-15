import type { IAccount, IPrice } from '../types'

export const defaultPriceForm: IPrice = {
  id: '',
  type: '',
  value: 0
}

export const defaultAccountForm: IAccount = {
  id: '',
  type: '',
  number: '',
  holder: '',
  status: ''
}

export const defaultMeta = {
  totalPages: 1,
  totalDocs: 1,
  page: 1,
  nextPage: 1,
  prevPage: 1,
  limit: 1,
  hasNextPage: false,
  hasPrevPage: false
}

export const CURRENCY_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}

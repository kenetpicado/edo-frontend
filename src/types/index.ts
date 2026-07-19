export interface IInputForm {
  text?: string
  name: string
  required?: boolean
  disabled?: boolean
  autofocus?: boolean
  type?: string
  placeholder?: string
  errors?: any
}

export interface IErrorStatus {
  field: string
  message: string
}

export interface ILoginForm {
  email: string
  password: string
}

export interface IRegisterForm {
  email: string
  name: string
  password: string
}

export interface IUser {
  id: string
  _id: string
  name: string
  email: string
  role: string
  status: string
  passwordUpdatedAt?: Date
  lastActivity?: Date
  createdAt: Date
}

export interface IButton {
  type?: 'submit' | 'button' | 'reset'
  disabled?: boolean
  loading?: boolean
}

export interface IPackage {
  id?: string
  emailId?: string
  tracking?: string
  guide?: string
  description?: string
  pieces?: number
  weight?: number
  grossWeight: number
  client: string
  entryDate?: string
  status?: string
  createdAt?: Date
  type?: string
  billing?: string
}

export interface IMailPackage {
  id?: string
  emailId?: string
  tracking?: string
  guide?: string
  description?: string
  grossWeight: number
  client: string
  createdAt?: Date
  type?: string
}

export interface IMailPackageResponse {
  data: IMailPackage[]
  pages: number
  current: number
}

export interface IPackageResponse {
  data: IPackage[]
  pages: number
  current: number
}

export interface IBatchResponse {
  data: IBatch[]
  pages: number
  current: number
}

export interface IBatch {
  _id?: string
  id?: string
  total: number
  code: string
  type: string
  packages: IPackage[]
  createdAt?: Date
  user?: IUserInfo
}

export interface IItemSidebar {
  item: {
    title: string
    icon: any
    to?: { name?: string }
  }
  active?: boolean
}

export interface IStatCard {
  title: string | number
  value: string | number
  icon?: any
}

export interface ISummary {
  type: string
  weight: number
  price?: number
  count: number
  amount: number
}

export interface IBilling {
  id?: string
  _id?: string
  invoice?: Number
  client: string
  packages?: IPackage[]
  packages_ids?: Array<string>
  total: number
  reference: string
  account: IAccount
  summary?: ISummary[]
  createdAt?: Date
  user?: IUserInfo
  account_key?: string
  subTotal: number
  delivery?: number
  address?: string
  fee?: number
  notes?: string
}

export interface IBillingResponse {
  data: IBilling[]
  pages: number
  current: number
}

export interface IUserInfo {
  id: string
  name: string
  email: string
}

export interface IExpense {
  id?: string
  concept: string
  description?: string
  quantity: number
  cost: number
  total?: number
  createdAt?: Date
  user?: IUserInfo
}

export interface IShipment {
  id?: string
  senderName: string
  senderPhone: string
  destinationDepartment: string
  destinationCountry: string
  receiverName: string
  receiverPhone: string
  fullAddress: string
  tracking?: string
  createdAt?: Date
  guide?: number
}

export interface IShipmentResponse {
  data: IShipment[]
  pages: number
  current: number
}

export interface IExpenseResponse {
  data: IExpense[]
  pages: number
  current: number
}

export interface IArching {
  id?: string
  date: string
  billings?: IBilling[]
  billing_ids?: Array<string>
  total: number
  createdAt?: Date
  user?: IUserInfo
  summary: ISummary[]
  accountSummary: IAccountSummary[]
}

export interface IArchingResponse {
  data: IArching[]
  pages: number
  current: number
}

export interface IAccountSummary {
  account_key: string
  total: number
  references: string[]
}

export interface IPrice {
  id: string
  type: string
  value: number
}

export interface IAccount {
  id: string
  type: string
  number: string
  holder: string
  status: string
}

export interface ICredential {
  id: string
  provider: string
  createdAt: string
  updatedAt: string
  expiresAt: number
  email: string
  from_email?: string
  picture: string
}

export interface IBody {
  data?: string
  size?: number
}

export interface IBasicPart {
  mimeType: string
  body: IBody
}

export interface IPart {
  mimeType: string
  body: IBody
  parts?: IBasicPart[]
}

export interface IPayload {
  mimeType: string
  parts: IPart[]
}

export interface IMessageContent {
  id: string
  payload: IPayload
  internalDate: string
}

export interface IEmail {
  id: string
  isStored?: boolean
  data: IPackage
}

export interface IMessage {
  id: string
  threadId: string
  payload: IPayload
  internalDate?: number
}

export interface IMeta {
  totalPages: number
  totalDocs: number
  page: number
  nextPage: number | null
  prevPage: number | null
  limit: number
  hasPrevPage: boolean
  hasNextPage: boolean
  sumTotal?: number
}

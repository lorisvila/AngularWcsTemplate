// App Types
export type UserType = {
  fullname: string
  username: string
  password: string
  lastConnect?: number
  roles: RoleType[]
  poste: PosteType
  customRoles: boolean
}
export type RoleType = string
export type PosteType = {
  poste: string
  roles: RoleType[]
}

export type ConfigType = {
  auth: {
    mainToken: string,
    expiration: string,
    cookieName: string
  }

  database: DBconfigType,

  data: {
    refreshRate: number
    refreshLimit: number
    allTableResponse: string[]
    tablesNecessaryKeys: TableParams[]
  }

  webserver: {
      port: number,
      host: string
  },

  logging: {
    GLOBAL_LOG_LEVEL: string
    FILE_LOG_LEVEL: string
    CONSOLE_LOG_LEVEL: string
  }

  bucket: {
    host: string
    port: number
    username: string
    password: string
    bucketName: string
  }

  roles: RoleType[]
  postes: PosteType[]
  users: UserType[]
}

export type DBconfigType = {
  user: string
  password: string
  server: string
  database: string
  port: number
  tables: string[]
}

export type TableParams = {
  tableName: TableName
  keys: string[]
  checkKeys: string[]
  idKey: string
  idAutoIncrement: boolean
}
export type TableName = string

// Data Types
export const UP_TO_DATE = true
export const NOT_TO_DATE = false

// Auth Types
export type AuthUsername = string

// Requests Types
export type ResponseType = {
  date: number // Time as the 32 bits value of time
  data: any
  status: {
    code: number,
    message?: string
  }
  token?: string
}

export type RequestType = {
  data: any
  token?: string,
}

export type TableObjectType = {
  tableName: string
  tableData: any
  tableLastRefresh: number
}

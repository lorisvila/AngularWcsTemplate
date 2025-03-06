// App Types
export type ConfigType = {
  webserver: {
      port: number
      host: string
  }
  logging: {
    GLOBAL_LOG_LEVEL: string
    FILE_LOG_LEVEL: string
    CONSOLE_LOG_LEVEL: string
  }
  ldap: {
    url: string
    adminDn: string
    adminPassword: string
    userSearchBase: string
    usernameAttribute: string
    attributes: string[]
  }
  portofolio: {
    UO_Dn: string
  }
  auth: {
    mainToken: string
  }
  db: {
    host: string
    username: string
    password: string
    port: number
  }
}

// Requests Types
export type ResponseType = {
  date: number // Time as the 32 bits value of time
  data: any
  status: {
    code: number,
    message?: string
    cause: any
  }
  schema: any
  token?: string
}

export type RequestType = {
  data: any
  token?: string,
}

// Users type
export type UserType = {
  dn: string
  name: string
  sAMAccountName: string
  userPrincipalName: string
  cn?: string
  sn?: string
  givenName?: string
  whenCreated?: string
  displayName?: string
  memberOf?: string[]
  objectGUID?: string
  badPwdCount?: string
}

export type UserRole = string

export type PeerType = {
  public_key: string
  url_safe_public_key: string
  preshared_key: string
  allowed_ips: string[]
  last_handshake_time: string
  persistent_keepalive_interval: string
  endpoint: string
  receive_bytes: number
  transmit_bytes: number
}

export type LinkType = {
  id: number
  linkName: string
  linkUrl: string
  internalUrl: boolean
}

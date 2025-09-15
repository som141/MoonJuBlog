export const getToken = (): string | null => {
  return localStorage.getItem("moonju_token")
}

export const setToken = (token: string): void => {
  localStorage.setItem("moonju_token", token)
}

export const removeToken = (): void => {
  localStorage.removeItem("moonju_token")
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

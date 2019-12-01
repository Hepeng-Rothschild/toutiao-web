const USER_KEY = 'haha'
export const getUser = () => JSON.parse(window.localStorage.getItem(USER_KEY))
export const saveUser = data => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}
export const deleteUser = data => {
  window.localStorage.removeItem(USER_KEY)
}

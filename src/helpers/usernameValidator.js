export function usernameValidator(username) {
  if (!username) return "Please fill in this field."
  if (username.length < 4) return 'Username should contain at least 8 characters.'
  return ''
}
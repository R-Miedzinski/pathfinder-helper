export default function parseCookie(cookie: string): { [key: string]: string } {
  const cleanedCookie = cookie.split(';').map((item) => item.split('=').map((entry) => entry.trim()))

  const cookieObject = {}

  cleanedCookie.forEach((keyvalue) => Object.assign(cookieObject, { [keyvalue[0]]: keyvalue[1] }))

  return cookieObject
}

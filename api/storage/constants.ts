export const dbURI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/'
export const port = process.env.PORT || 8001
export const secret = process.env.API_KEY || '12345678'
export const cookie_key = process.env.COOKIE_KEY || 'rpg_app_web_token'
export const frontOrigin = process.env.FRONT_ORIGIN || 'http://localhost:8000'
export const webRoot = process.env.WEBROOT || '../web/dist/rpg-app'

export const session = {
  user: {
    role: null,
    user_code: null,
    username: null,
  },
  entitlements: [] as string[],
}

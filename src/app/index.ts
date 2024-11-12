import {app} from './app'
import {SETTINGS} from './settings'
import { runDb } from "./db";

const startApp = async() => {
  try {
    await runDb(SETTINGS.MONGO_URI)
    app.listen(SETTINGS.PORT, () => {
      console.log(`.. server started at port ${SETTINGS.PORT}`)
    })
  } catch (e) {
    console.log("something went wrong, shutting down the backend app service", e)
    process.exit(1)
  }
}

startApp()
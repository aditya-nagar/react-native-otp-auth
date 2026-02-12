import AsyncStorage from "@react-native-async-storage/async-storage"

export const logEvent = async (event: string) => {
  const existing = await AsyncStorage.getItem("logs")
  const logs = existing ? JSON.parse(existing) : []

  logs.push({
    event,
    timestamp: new Date().toISOString(),
  })

  await AsyncStorage.setItem("logs", JSON.stringify(logs))
}
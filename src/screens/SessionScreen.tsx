import React, { useMemo } from "react"
import { View, Text, Button } from "react-native"
import { useSessionTimer } from "../hooks/useSessionTimer"
import { logEvent } from "../services/analytics"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"

type Props = NativeStackScreenProps<RootStackParamList, "Session">

export default function SessionScreen({ navigation }: Props) {
  const seconds = useSessionTimer()

  const startTime = useMemo(() => {
    return new Date().toLocaleTimeString()
  }, [])

  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60

  const handleLogout = async () => {
    await logEvent("Logout")
    navigation.popToTop()
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Session Start Time: {startTime}</Text>

      <Text style={{ marginTop: 10 }}>
        Duration: {minutes}:{remaining.toString().padStart(2, "0")}
      </Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  )
}
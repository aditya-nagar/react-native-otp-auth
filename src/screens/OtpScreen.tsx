import React, { useState, useEffect } from "react"
import { View, Text, TextInput, Button, Alert } from "react-native"
import { validateOtp, generateOtp } from "../services/otpManager"
import { logEvent } from "../services/analytics"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"

type Props = NativeStackScreenProps<RootStackParamList, "Otp">

export default function OtpScreen({ route, navigation }: Props) {
  const { email } = route.params

  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [attemptsLeft, setAttemptsLeft] = useState(3)

  // Countdown timer
  useEffect(() => {
    if (timeLeft === 0) return

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  const handleVerify = async () => {
    if (timeLeft === 0) {
      Alert.alert("OTP Expired")
      return
    }

    if (attemptsLeft === 0) {
      Alert.alert("Maximum attempts exceeded")
      return
    }

    const result = validateOtp(email, otp)

    if (result.success) {
      await logEvent("OTP Validation Success")
      navigation.replace("Session", { email })
    } else {
      await logEvent("OTP Validation Failure")

      setAttemptsLeft(prev => {
        const newValue = prev - 1

        if (newValue <= 0) {
          Alert.alert("Maximum attempts exceeded")
        } else {
          Alert.alert("Error", result.reason)
        }

        return newValue
      })
    }
  }

  const handleResend = async () => {
    const newOtp = generateOtp(email)

    console.log("New Generated OTP:", newOtp)

    await logEvent("OTP Regenerated")

    setTimeLeft(60)
    setAttemptsLeft(3)
    setOtp("")

    Alert.alert("New OTP Generated (Check console)")
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter OTP:</Text>

      <TextInput
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <Text>OTP expires in: {timeLeft}s</Text>
      <Text>Attempts left: {attemptsLeft}</Text>

      <Button
        title="Verify OTP"
        onPress={handleVerify}
        disabled={attemptsLeft === 0 || timeLeft === 0}
      />

      <View style={{ marginTop: 10 }}>
        <Button title="Resend OTP" onPress={handleResend} />
      </View>
    </View>
  )
}
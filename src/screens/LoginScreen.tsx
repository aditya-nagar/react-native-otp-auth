import React, { useState } from "react"
import { View, Text, TextInput, Button, Alert } from "react-native"
import { generateOtp } from "../services/otpManager"
import { logEvent } from "../services/analytics"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../App"

type Props = NativeStackScreenProps<RootStackParamList, "Login">

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert("Enter Email")
      return
    }

    const otp = generateOtp(email)
    await logEvent("OTP Generated")

    console.log("Generated OTP:", otp)

    navigation.navigate("Otp", { email })
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Send OTP" onPress={handleSendOtp} />
    </View>
  )
}

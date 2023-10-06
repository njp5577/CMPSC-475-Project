import React, { useState } from 'react'
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import {useRoute} from "@react-navigation/native";

export default function ResetPasswordScreen({ navigation }) {
    const route = useRoute()

    const list = route.params?.userList || ""

    if(JSON.stringify(list) == "\"\""){
        var userList = ["admin", "admin1234", "admin@admin.com", "admin"]
    }
    else{
        var userList = list
    }
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' })
    var inList = 0

  const sendResetPassword = () => {
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        const confirmPasswordError = passwordValidator(confirmPassword.value)


    if (emailError || passwordError || confirmPasswordError) {
        setEmail({ ...email, error: emailError })
        setPassword({ ...password, error: passwordError })
        setConfirmPassword({ ...confirmPassword, error: confirmPasswordError })
        return
    }

    if (confirmPassword.value != password.value){
        setPassword({ ...password, error: "Does not match"})
        setConfirmPassword({ ...confirmPassword, error: "Does not match" })
        return
    }

      for (let i = 0; i < userList.length; i++){
          if(userList[(4 * i) + 2] == email.value.toString()){
              inList = 1
          }
      }

      if(inList == 0){
          setEmail({ ...email, error: "No account under this email" })
          return
      }
      else{
          for (let i = 0; i < userList.length; i++){
              if(userList[(4 * i) + 2] == email.value.toString()){
                  userList[(4 * i) + 1] = password.value.toString()
              }
          }
      }

    navigation.navigate('LoginScreen', {userList: userList})
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset your password.</Header>
      <TextInput
        label="Email"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Your password will be reset"
      />
        <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
        />
        <TextInput
            label="ConfirmPassword"
            returnKeyType="done"
            value={confirmPassword.value}
            onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
            error={!!confirmPassword.error}
            errorText={confirmPassword.error}
            secureTextEntry
        />
      <Button
        mode="contained"
        onPress={sendResetPassword}
        style={{ marginTop: 16 }}
      >
        Continue
      </Button>
    </Background>
  )
}
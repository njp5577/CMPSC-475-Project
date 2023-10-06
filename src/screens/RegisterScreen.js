import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { usernameValidator } from '../helpers/usernameValidator'
import {useRoute} from "@react-navigation/native";

export default function RegisterScreen({ navigation }) {
    const route = useRoute()

    const list = route.params?.userList || ""

    if(JSON.stringify(list) == "\"\""){
        var userList = ["admin", "admin1234", "admin@admin.com", "admin"]
    }
    else{
        var userList = list
    }

  const [name, setName] = useState({ value: '', error: '' })
  const [username, setUsername] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const usernameError = usernameValidator(username.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    var alreadyIn = 0

    if (emailError || passwordError || nameError || usernameError) {
      setName({ ...name, error: nameError})//JSON.stringify(userList) + "hi" + (typeof userList).toString()
      setUsername({ ...username, error: usernameError})
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }

      for (let i = 0; i < userList.length; i++){
          if(userList[(4 * i) + 2] == email.value.toString()){
              alreadyIn = 1
          }
      }

    if (alreadyIn == 1){
        setEmail({ ...email, error: "Account under this email or username already exists" })
        setUsername({ ...username, error: "Account under this email or username already exists" })
        return
    }
    else{
        userList.push(username.value.toString())
        userList.push(password.value.toString())
        userList.push(email.value.toString())
        userList.push(name.value.toString())
    }
    navigation.navigate("LoginScreen", {userList: userList})
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome.</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Username"
        returnKeyType="next"
        value={username.value}
        onChangeText={(text) => setUsername({ value: text, error: '' })}
        error={!!username.error}
        errorText={username.error}
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
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Next
      </Button>
      <View style={styles.row}>
        <Text>Already have an account?</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen', {userList: userList})}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
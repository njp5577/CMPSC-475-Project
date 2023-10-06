import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
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
import { usernameValidator } from '../helpers/usernameValidator'
import { useRoute } from '@react-navigation/native'

export default function LoginScreen({ navigation }){
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
  const [username, setUsername] = useState({ value: '', error: '' })

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value, userList)
    const passwordError = passwordValidator(password.value, userList)
    const usernameError = usernameValidator(username.value, userList)
    let inList = 0

    if (emailError || passwordError || usernameError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setUsername({ ...username, error: usernameError })
      return
    }

      for (let i = 0; i < userList.length; i++){
          if(userList[(4 * i) + 2] == email.value.toString() && userList[(4 * i) + 1] == password.value.toString() && userList[(4 * i) + 0] == username.value.toString()){
              inList = 1
          }
      }

    if (inList == 0){
        setEmail({ ...email, error: "Incorrect Login Info" })
        setPassword({ ...password, error: "Incorrect Login Info" })
        setUsername({ ...username, error: "Incorrect Login Info" })
        return
    }
    navigation.navigate("Dashboard", {userList: userList})
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Hello.</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen', {userList: userList})}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Log in
      </Button>
      <View style={styles.row}>
        <Text>You do not have an account?</Text>
      </View>
      <View style={styles.row}>
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen', {userList: userList})}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
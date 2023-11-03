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
import { passwordValidator } from '../helpers/passwordValidator'
import { usernameValidator } from '../helpers/usernameValidator'
import { useRoute } from '@react-navigation/native'
import {firebase} from "../firebase/config";

export default function LoginScreen({ navigation }){
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

  const [password, setPassword] = useState({ value: '', error: '' })
  const [username, setUsername] = useState({ value: '', error: '' })

  const onLoginPressed = async () => {
      const passwordError = passwordValidator(password.value)
      const usernameError = usernameValidator(username.value)
      let inList = 0

      const usersRef = firebase.firestore().collection('Users')

      if (passwordError || usernameError) {
          setPassword({...password, error: passwordError})
          setUsername({...username, error: usernameError})
          return
      }

      const accountRef = usersRef.where("username", "==", username.value.toString())
          .where("password", "==", password.value.toString());
      const docOne = await accountRef.get();
      if (docOne.empty) {
          console.log('User does not exist!');
          inList = 0
      }
      else{
          inList = 1
      }

      
      
  
      if (inList == 0) {
          setPassword({...password, error: "Incorrect Login Info"})
          setUsername({...username, error: "Incorrect Login Info"})
          return
      }

      currentUser = username.value.toString()
      
      if (docOne.docs[0].get("isAdmin")){
        navigation.navigate("AdminDashboard", {currentUser: currentUser})
        return
      }

      navigation.navigate("Dashboard", {currentUser: currentUser})
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Login</Header>
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
          onPress={() => navigation.navigate('ResetPasswordScreen', {currentUser: currentUser})}
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
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen', {currentUser: currentUser})}>
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
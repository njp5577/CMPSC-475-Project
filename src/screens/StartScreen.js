import React, {useState} from 'react'
import { useRoute } from '@react-navigation/native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {

  const route = useRoute()

  const list = route.params?.userList || ""

  if(JSON.stringify(list) == "\"\""){
      var userList = ["admin", "admin1234", "admin@admin.com", "admin"]
  }
  else{
      var userList = list
  }

  return (
    <Background>
      <Logo />
      <Header>Login App</Header>
        <Paragraph>
          React Native Expo Login App
        </Paragraph>
      <Button
        mode="contained"

        onPress={() => navigation.navigate('LoginScreen', {userList: userList})}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen', {userList: userList})}
      >
        Create an account
      </Button>
    </Background>
  )
}
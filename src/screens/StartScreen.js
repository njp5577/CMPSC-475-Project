import React, {useState} from 'react'
import { useRoute } from '@react-navigation/native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {

  const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = null
    }
    else{
        var currentUser = current
    }

  return (
    <Background>
      <Logo />
      <Header>Meal Power</Header>
        <Paragraph>
          Join us to help reduce food waste!
        </Paragraph>
      <Button
        mode="contained"

        onPress={() => navigation.navigate('LoginScreen', {currentUser: currentUser})}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen', {currentUser: currentUser})}
      >
        Create an account
      </Button>
    </Background>
  )
}
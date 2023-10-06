import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Paragraph from '../components/Paragraph'
import Button from '../components/Button'
import {useRoute} from "@react-navigation/native";

export default function Dashboard({ navigation }) {
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
      <Header>Hello</Header>
      <Paragraph>
        You are logged in.
      </Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.navigate("LoginScreen", {userList: userList})
        }
      >
        Sign out
      </Button>
    </Background>
  )
}
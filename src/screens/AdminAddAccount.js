import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
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
import { firebase } from '../firebase/config'
import { cityValidator } from '../helpers/cityValidator'
import { stateValidator } from '../helpers/stateValidator'
import { streetValidator } from '../helpers/streetValidator'
import { phoneValidator } from '../helpers/phoneValidator'

const user = {
    username: String,
    password: String,
    email: String,
    name: String,
}

export default function AdminAddAccount({ navigation }) {
    //initialize route and state variables
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const usersRef = firebase.firestore().collection('Users')

  const [name, setName] = useState({ value: '', error: '' })
  const [username, setUsername] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [city, setCity] = useState({ value: '', error: '' })
  const [state, setState] = useState({ value: '', error: '' })
  const [street, setStreet] = useState({ value: '', error: '' })
  const [phone, setPhone] = useState({ value: '', error: '' })

  const onSignUpPressed = async () => {
      const nameError = nameValidator(name.value)
      const usernameError = usernameValidator(username.value)
      const emailError = emailValidator(email.value)
      const passwordError = passwordValidator(password.value)
      const cityError = cityValidator(city.value)
      const stateError = stateValidator(state.value)
      const streetError = streetValidator(street.value)
      const phoneError = phoneValidator(phone.value)
      var alreadyIn = 0

      if (emailError || passwordError || nameError || usernameError) {
          setName({...name, error: nameError})//JSON.stringify(userList) + "hi" + (typeof userList).toString()
          setUsername({...username, error: usernameError})
          setEmail({...email, error: emailError})
          setPassword({...password, error: passwordError})
          setCity({...city, error: cityError})
          setState({...state, error: stateError})
          setStreet({...street, error: streetError})
          setPhone({...phone, error: phoneError})
          return
      }

      const usernameRef = usersRef.where("username", "==", username.value.toString());
      const docOne = await usernameRef.get();
      if (!docOne.empty) {
          console.log('User with this username already exists!');
          alreadyIn = 1
      }

      const emailRef = usersRef.where("email", "==", email.value.toString());
      const docTwo = await emailRef.get();
      //check if user already exists
      if (!docTwo.empty) {
          console.log('User with this email already exists!');
          alreadyIn = 1
      }

      if (alreadyIn == 1) {
          setEmail({...email, error: "Account under this email or username already exists"})
          setUsername({...username, error: "Account under this email or username already exists"})
          return
      //if not, create new user that is an admin
      } else {
          

          usersRef.doc(username.value.toString()).set({username: username.value.toString(), password: password.value.toString(),
              email: email.value.toString(), name: name.value.toString(), state: state.value.toString(),
              city: city.value.toString(), street: street.value.toString(), phone: phone.value.toString(), isAdmin: true}).then()
      }
      navigation.navigate("AdminDashboard", {currentUser: currentUser})
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Register An Admin Account</Header>
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
    </Background>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollview: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
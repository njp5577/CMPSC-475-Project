import React, { useState } from 'react'
import Background from '../components/Background'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import BackButton from '../components/BackButton'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import {useRoute} from "@react-navigation/native";
import {firebase} from "../firebase/config";

export default function OrgResetPassword({ navigation }) {
    const route = useRoute()

    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' })
    var inList = 0

  const sendResetPassword = async () => {
      const emailError = emailValidator(email.value)
      const passwordError = passwordValidator(password.value)
      const confirmPasswordError = passwordValidator(confirmPassword.value)

      const orgRef = firebase.firestore().collection('Orgs')

      if (emailError || passwordError || confirmPasswordError) {
          setEmail({...email, error: emailError})
          setPassword({...password, error: passwordError})
          setConfirmPassword({...confirmPassword, error: confirmPasswordError})
          return
      }

      if (confirmPassword.value != password.value) {
          setPassword({...password, error: "Does not match"})
          setConfirmPassword({...confirmPassword, error: "Does not match"})
          return
      }

      const accountRef = orgRef.where("email", "==", email.value.toString());
      const docOne = await accountRef.get();
      if (docOne.empty) {
          console.log('Org does not exist!');
          inList = 0
      }
      else{
          inList = 1
      }

      if (inList == 0) {
          setEmail({...email, error: "No account under this email"})
          return
      } else {
          const name = await (docOne.docs[0].get("name")).toString()
          await orgRef.doc(name).set({password: password.value.toString()}, {merge: true})
      }

      navigation.navigate('OrgLogin')
  }

  return (
    
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset Organization's Password</Header>
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
            label="New Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: '' })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
        />
        <TextInput
            label="Confirm Password"
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
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
import { cityValidator } from '../helpers/cityValidator'
import { stateValidator } from '../helpers/stateValidator'
import { streetValidator } from '../helpers/streetValidator'
import { phoneValidator } from '../helpers/phoneValidator'
import {useRoute} from "@react-navigation/native";
import { firebase } from '../firebase/config'

export default function OrgRegister({ navigation }) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const orgRef = firebase.firestore().collection('Orgs')

    const [name, setName] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [city, setCity] = useState({ value: '', error: '' })
    const [state, setState] = useState({ value: '', error: '' })
    const [street, setStreet] = useState({ value: '', error: '' })
    const [phone, setPhone] = useState({ value: '', error: '' })

    const onSignUpPressed = async () => {
        const nameError = nameValidator(name.value)
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        const cityError = cityValidator(city.value)
        const stateError = stateValidator(state.value)
        const streetError = streetValidator(street.value)
        const phoneError = phoneValidator(phone.value)

        var alreadyIn = 0

        if (emailError || passwordError || nameError || cityError || stateError || streetError || phoneError) {
            setName({...name, error: nameError})//JSON.stringify(userList) + "hi" + (typeof userList).toString()
            setEmail({...email, error: emailError})
            setPassword({...password, error: passwordError})
            setCity({...city, error: cityError})
            setState({...state, error: stateError})
            setStreet({...street, error: streetError})
            setPhone({...phone, error: phoneError})
            return
        }

        const emailRef = orgRef.where("email", "==", email.value.toString());
        const docOne = await emailRef.get();
        if (!docOne.empty) {
            console.log('Org with this email already exists!');
            alreadyIn = 1
        }

        const addressRef = orgRef.where("city", "==", city.value.toString())
            .where("state", "==", state.value.toString())
            .where("street", "==", street.value.toString());
        const docTwo = await addressRef.get();

        if (!docTwo.empty) {
            console.log('Org with this address already exists!');
            alreadyIn = 1
        }

        if (alreadyIn == 1) {
            setEmail({...email, error: "Organization under this email or address already exists"})
            setCity({...email, error: "Organization under this email or address already exists"})
            setState({...email, error: "Organization under this email or address already exists"})
            setStreet({...email, error: "Organization under this email or address already exists"})
            return
        } else {

            orgRef.doc(name.value.toString()).set({name: name.value.toString(), email: email.value.toString(),
                password: password.value.toString(), state: state.value.toString(),
                city: city.value.toString(), street: street.value.toString(), phone: phone.value.toString()
                }).then()
        }
        navigation.navigate("StartScreen", {currentOrg: currentOrg})
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Organization Registration</Header>
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
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            <TextInput
                label="State"
                returnKeyType="next"
                value={state.value}
                onChangeText={(text) => setState({ value: text, error: '' })}
                error={!!state.error}
                errorText={state.error}
            />
            <TextInput
                label="City"
                returnKeyType="next"
                value={city.value}
                onChangeText={(text) => setCity({ value: text, error: '' })}
                error={!!city.error}
                errorText={city.error}
            />
            <TextInput
                label="Street"
                returnKeyType="next"
                value={street.value}
                onChangeText={(text) => setStreet({ value: text, error: '' })}
                error={!!street.error}
                errorText={street.error}
            />
            <TextInput
                label="Phone"
                returnKeyType="next"
                value={phone.value}
                onChangeText={(text) => setPhone({ value: text, error: '' })}
                error={!!phone.error}
                errorText={phone.error}
            />
            <Button
                mode="contained"
                onPress={onSignUpPressed}
                style={{ marginTop: 24 }}
            >
                Next
            </Button>
            <View style={styles.row}>
                <Text>Already have an organization account?</Text>
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => navigation.navigate('OrgLogin', {currentOrg: currentOrg})}>
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
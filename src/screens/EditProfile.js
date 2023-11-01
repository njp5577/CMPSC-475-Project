import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { useRoute } from '@react-navigation/native'
import {firebase} from "../firebase/config";
import Navbar from '../components/navbar'

export default function EditProfile ({navigation}) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    } else {
        var currentUser = current
    }

    const [email, setEmail] = useState({ value: ''})
    const [name, setName] = useState({ value: ''})

    const usersRef = firebase.firestore().collection('Users')

    const accountRef = usersRef.where("username", "==", currentUser.toString());

    useEffect(() => {
        const getInfo = async () => {
            var emailString

            var nameString

            try {
                const docOne = await accountRef.get();

                nameString = await (docOne.docs[0].get("name")).toString()

                await setName({value: nameString})

                emailString = await (docOne.docs[0].get("email")).toString()

                await setEmail({value: emailString})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()
    }, [])

    return (
        <>
        <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
        <Background>
            
            <Logo/>
            <Header>Your Profile</Header>

            <Text>Name: {name.value}</Text>

            <Text>Username: {currentUser}</Text>

            <Text>Email: {email.value}</Text>

            <Button
                mode="contained"

                onPress={() => navigation.navigate('ResetPasswordScreen', {currentUser: currentUser})}
            >
                Reset Password
            </Button>
        </Background>
        </>
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
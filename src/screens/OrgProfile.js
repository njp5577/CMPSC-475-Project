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
import OrgNavbar from "../components/orgNavbar";


export default function OrgProfile ({navigation}) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [email, setEmail] = useState({ value: ''})
    const [name, setName] = useState({ value: ''})

    const orgRef = firebase.firestore().collection('Orgs')

    const accountRef = orgRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {
            var emailString

            var nameString

            console.log("Profile")

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
            <OrgNavbar title="My App" navigation= {navigation} currentOrg = { currentOrg }></OrgNavbar>
            <Background>
                <Logo/>
                <Header>Organization Profile</Header>

                <Text>Name: {name.value}</Text>

                <Text>Email: {email.value}</Text>

                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('OrgDashboard', {currentOrg: currentOrg})}
                >
                    Home
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
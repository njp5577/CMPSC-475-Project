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
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from "../components/navbar";
import {firebase} from "../firebase/config";

export default function OrgPage({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const [email, setEmail] = useState({ value: ''})
    const [phone, setPhone] = useState({ value: ''})
    const [street, setStreet] = useState({ value: ''})
    const [state, setState] = useState({ value: ''})
    const [city, setCity] = useState({ value: ''})
    const [name, setName] = useState({ value: ''})

    const orgRef = firebase.firestore().collection('Orgs')

    const accountRef = orgRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {
            var emailString

            var nameString

            var cityString

            var stateString

            var streetString

            var phoneString

            try {
                const docOne = await accountRef.get();

                nameString = await (docOne.docs[0].get("name")).toString()

                await setName({value: nameString})

                emailString = await (docOne.docs[0].get("email")).toString()

                await setEmail({value: emailString})

                phoneString = await (docOne.docs[0].get("phone")).toString()

                await setPhone({value: phoneString})

                cityString = await (docOne.docs[0].get("city")).toString()

                await setCity({value: cityString})

                stateString = await (docOne.docs[0].get("state")).toString()

                await setState({value: stateString})

                streetString = await (docOne.docs[0].get("street")).toString()

                await setStreet({value: streetString})

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
            <Logo />
            <Header>{name.value}</Header>

            <Text>Email: {email.value}</Text>

            <Text>Phone Number: {phone.value}</Text>

            <Text>Address: {street.value + ", " + city.value + ", " + state.value}</Text>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('Donate', {currentUser: currentUser, currentOrg: currentOrg})}
            >
                Donate
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('Request', {currentUser: currentUser, currentOrg: currentOrg})}
            >
                Request Assistance
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
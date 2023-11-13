import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
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
    const [city, setCity] = useState({ value: ''})
    const [phone, setPhone] = useState({ value: ''})
    const [state, setState] = useState({ value: ''})
    const [street, setStreet] = useState({ value: ''})

    const orgRef = firebase.firestore().collection('Orgs')

    const accountRef = orgRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {
            var emailString

            var nameString
            var inputString

            console.log("Profile")

            try {
                const docOne = await accountRef.get();

                nameString = await (docOne.docs[0].get("name")).toString()

                setName({value: nameString})

                emailString = await (docOne.docs[0].get("email")).toString()

                setEmail({value: emailString})

                inputString = await (docOne.docs[0].get("city")).toString()

                setCity({value: inputString})

                inputString = await (docOne.docs[0].get("phone")).toString()

                setPhone({value: inputString})

                inputString = await (docOne.docs[0].get("state")).toString()

                setState({value: inputString})

                inputString = await (docOne.docs[0].get("street")).toString()

                setStreet({value: inputString})

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
                <Header style={styles.text}>{name.value}</Header>

                

                <Text style={[styles.text,styles.subText]}>Email: {email.value}</Text>

                <Text style={[styles.text,styles.subText]}>Address: {street.value}, {city.value}, {state.value}</Text>

                <Text style={[styles.text,styles.subText]}>Phone: {phone.value}</Text>

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
    text: {
        fontSize: 30,
        color: theme.colors.secondary,
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subText: {
        fontSize:15,
    }
})
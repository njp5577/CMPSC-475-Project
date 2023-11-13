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
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import OrgNavbar from "../components/orgNavbar";
import {firebase} from "../firebase/config";

export default function OrgDashboard({ navigation }) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const [name, setName] = useState({ value: ''})

    const orgsRef = firebase.firestore().collection('Orgs')

    const accountRef = orgsRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {

            var nameString

            try {
                const docOne = await accountRef.get();

                nameString = await (docOne.docs[0].get("name")).toString()

                await setName({value: nameString})

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
                <Logo />
                <Header>Welcome {name.value.toString()}!</Header>

                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('SetDonationNeeds', {currentOrg: currentOrg})}
                >
                    Manage Incoming Donations
                </Button>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('SetAvailableItems', {currentOrg: currentOrg})}
                >
                    Manage Incoming Requests
                </Button>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('OrgMapPage', {currentOrg: currentOrg})}
                >
                    Open Map
                </Button>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('StartScreen')}
                >
                    Sign Out
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
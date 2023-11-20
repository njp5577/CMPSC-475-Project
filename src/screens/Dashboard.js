import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import {firebase} from "../firebase/config";
import { theme } from '../core/theme'
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from '../components/navbar'

export default function Dashboard({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const [org, setOrg] = useState({ value: '', error: '' })

    const onOrgSearchPressed = async () => {
        const orgError = organizationValidator(org.value)

        if (orgError) {
            setOrg({...org, error: orgError})
            return
        }

        let inList = 0

        const orgRef = firebase.firestore().collection('Orgs')

        const accountRef = orgRef.where("name", "==", org.value.toString());
        const docOne = await accountRef.get();
        if (docOne.empty) {
            console.log('Organization does not exist!');
            setOrg({...org, error: "This organization does not exist"})
            inList = 0
            return
        }
        else{
            inList = 1
        }

        if (inList == 1) {
            var currentOrg = docOne.docs[0].get("email").toString()

            navigation.navigate('OrgPage', {currentUser: currentUser, currentOrg: currentOrg})
        }
    }

    return (
        <>
        <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
        <Background> 
            
            
            <Logo />
            <Header>Welcome {currentUser}!</Header>
            <TextInput
                label="Organization"
                returnKeyType="next"
                value={org.value}
                onChangeText={(text) => setOrg({ value: text, error: '' })}
                error={!!org.error}
                errorText={org.error}
                autoCapitalize="none"
                autoCompleteType="org"
            />
            <Button mode="contained" onPress={onOrgSearchPressed}>
                Search for Organization
            </Button>

            <Button
                mode="contained"

                onPress={() => navigation.navigate('MapPage', {currentUser: currentUser})}
            >
                Open Map
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('SentDonationOffers', {currentUser: currentUser})}
            >
                View Donation Offers
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('SentDonationRequests', {currentUser: currentUser})}
            >
                View Donation Requests
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('StartScreen', {currentUser: currentUser})}
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
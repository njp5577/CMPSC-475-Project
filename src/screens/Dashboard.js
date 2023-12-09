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
    //initialize route and state variables
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    return (
        <>
        <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
        <Background> 
            
            
            <Logo />
            <Header>Welcome {currentUser}!</Header>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('SearchOrg', {currentUser: currentUser})}
            >
                Search For Organization
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
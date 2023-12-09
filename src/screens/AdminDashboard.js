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


export default function AdminDashboard ({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""
    //verify if user is logged in
    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    

    return (
        <>
        
        <Background> 
            <BackButton goBack={navigation.goBack} />
            
            <Logo />
            <Header>Welcome {currentUser}!</Header>
            <Button mode="contained" onPress={() => navigation.navigate('AdminAddAccount', {currentUser: currentUser})}>
                Add Admin Accounts
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('AdminDeleteUser', {currentUser: currentUser})}>
                Delete User Accounts
            </Button>

            <Button
                mode="contained"

                onPress={() => navigation.navigate('AdminDeleteOrg', {currentUser: currentUser})}
            >
                Delete Organization Accounts
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('LoginScreen', {currentUser: currentUser})}
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
import React, { useState } from 'react'
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

export default function MapPage({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = null
    }
    else{
        var currentUser = current
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Local Map</Header>

            <Button
                mode="contained"

                onPress={() => navigation.navigate('Dashboard', {currentUser: currentUser})}
            >
                Home
            </Button>
        </Background>
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
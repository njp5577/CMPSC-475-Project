import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { firebase, firebaseConfig, app, db } from "../firebase/config";
import { theme } from '../core/theme'
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from '../components/navbar'
import { doc, deleteDoc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'


export default function AdminDeleteOrg({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    }
    else {
        var currentUser = current
    }

    const [org, setOrg] = useState({ value: '', error: '' })

    const deleteOrg = async () => {
        
        
        await deleteDoc(doc(db, "Orgs", org.value.toString()));

    }

    return (
        <>
            
            <Background>
                <BackButton goBack={navigation.goBack} />

                <Logo />
                <Header>Delete An Org</Header>
                <TextInput
                    label="org"
                    returnKeyType="next"
                    value={org.value}
                    onChangeText={(text) => setOrg({ value: text, error: '' })}
                    error={!!org.error}
                    errorText={org.error}
                    autoCapitalize="none"
                    autoCompleteType="Organization"
                />
                <Button mode="contained" onPress={deleteOrg}>
                    Delete An Org
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
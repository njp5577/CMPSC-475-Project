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


export default function AdminDeleteUser({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    }
    else {
        var currentUser = current
    }

    const [username, setUsername] = useState({ value: '', error: '' })

    const deleteUser = async () => {
        
        await deleteDoc(doc(db, "Users", username.value.toString()));

    }

    return (
        <>
            

            <Background>
            <BackButton goBack={navigation.goBack} />  

                <Logo />
                <Header>Delete A User</Header>
                <TextInput
                    label="username"
                    returnKeyType="next"
                    value={username.value}
                    onChangeText={(text) => setUsername({ value: text, error: '' })}
                    error={!!username.error}
                    errorText={username.error}
                    autoCapitalize="none"
                    autoCompleteType="User"
                />
                <Button mode="contained" onPress={deleteUser}>
                    Delete A User
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
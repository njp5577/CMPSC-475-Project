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
import Navbar from '../components/navbar'

export default function EditProfile ({navigation}) {
    //initialize route and state variables
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    } else {
        var currentUser = current
    }

    const [email, setEmail] = useState({ value: ''})
    const [name, setName] = useState({ value: ''})
    const [street, setStreet] = useState({ value: ''})
    const [state, setState] = useState({ value: ''})
    const [city, setCity] = useState({ value: ''})
    const [phone, setPhone] = useState({ value: ''})

    const usersRef = firebase.firestore().collection('Users')

    const accountRef = usersRef.where("username", "==", currentUser.toString());
    //get user info from database
    useEffect(() => {
        const getInfo = async () => {
            var emailString

            var nameString

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
        <Navbar title="My App" navigation= {navigation} currentUser = { currentUser } ></Navbar>
        
        <Background>
            
            <Logo/>
            <Header style={styles.text}>{name.value}</Header>

            <Text style={[styles.text,styles.subText]}>Name: {name.value}</Text>

            <Text style={[styles.text,styles.subText]}>Username: {currentUser}</Text>

            <Text style={[styles.text,styles.subText]}>Email: {email.value}</Text>

            <Text style={[styles.text,styles.subText]}>Address: {street.value}, {city.value}, {state.value}</Text>

            <Text style={[styles.text,styles.subText]}>Phone: {phone.value}</Text>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('ResetPasswordScreen')}
                >
                Reset Password
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
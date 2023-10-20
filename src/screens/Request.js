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
import { emailValidator } from '../helpers/emailValidator'
import { nameValidator } from '../helpers/nameValidator'
import { donationValidator } from '../helpers/donationValidator'
import { useRoute } from '@react-navigation/native'

export default function Request({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = null
    }
    else{
        var currentUser = current
    }
//
    const [don, setDon] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })
    const [name, setName] = useState({ value: '', error: '' })

    const onOrgSearchPressed = () => {
        const donError = donationValidator(don.value)
        const emailError = emailValidator(email.value)
        const nameError = nameValidator(name.value)

        if (donError || emailError || nameError) {
            setDon({...don, error: donError})
            setEmail({...email, error: emailError})
            setName({...name, error: nameError})
            return
        }

        navigation.navigate('OrgPage', {currentUser: currentUser})
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Donate to this organization!</Header>
            <TextInput
                label="Name"
                returnKeyType="next"
                value={name.value}
                onChangeText={(text) => setName({ value: text, error: '' })}
                error={!!name.error}
                errorText={name.error}
            />
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                label="Donation"
                returnKeyType="next"
                value={don.value}
                onChangeText={(text) => setDon({ value: text, error: '' })}
                error={!!don.error}
                errorText={don.error}
                autoCapitalize="none"
                autoCompleteType="don"
                textContentType="donation"
                keyboardType="donation"
            />
            <Button mode="contained" onPress={onOrgSearchPressed}>
                Request donation
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('OrgPage', {currentUser: currentUser})}
            >
                Organization Page
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
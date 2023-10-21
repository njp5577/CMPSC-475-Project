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
import { donationValidator } from '../helpers/donationValidator'
import { useRoute } from '@react-navigation/native'

export default function Donate({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const [don, setDon] = useState({ value: '', error: '' })

    const onOrgSearchPressed = () => {
        const donError = donationValidator(don.value)

        if (donError) {
            setDon({...don, error: donError})
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
                label="Donation"
                returnKeyType="next"
                value={don.value}
                onChangeText={(text) => setDon({ value: text, error: '' })}
                error={!!don.error}
                errorText={don.error}
                autoCapitalize="none"
                autoCompleteType="don"
            />
            <Button mode="contained" onPress={onOrgSearchPressed}>
                Submit donation
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
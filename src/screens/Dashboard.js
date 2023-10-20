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

export default function Dashboard({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = null
    }
    else{
        var currentUser = current
    }

    const [org, setOrg] = useState({ value: '', error: '' })

    const onOrgSearchPressed = () => {
        const orgError = organizationValidator(org.value)

        if (orgError) {
            setOrg({...org, error: orgError})
            return
        }

        navigation.navigate('OrgPage', {currentUser: currentUser})
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
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
                textContentType="organization"
                keyboardType="organization"
            />
            <Button mode="contained" onPress={onOrgSearchPressed}>
                Search for Organization
            </Button>

            <p> </p>
            <p> </p>

            <Button
                mode="contained"

                onPress={() => navigation.navigate('MapPage', {currentUser: currentUser})}
            >
                Open Map
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('EditProfile', {currentUser: currentUser})}
            >
                Edit Profile
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('LoginScreen', {currentUser: currentUser})}
            >
                Sign Out
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
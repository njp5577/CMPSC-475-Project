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

    const list = route.params?.userList || ""

    if(JSON.stringify(list) == "\"\""){
        var userList = ["admin", "admin1234", "admin@admin.com", "admin"]
    }
    else{
        var userList = list
    }

    const [org, setOrg] = useState({ value: '', error: '' })

    const onOrgSearchPressed = () => {
        const orgError = organizationValidator(org.value, userList)

        if (orgError) {
            setOrg({...org, error: orgError})
            return
        }

        navigation.navigate('OrgPage', {userList: userList})
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Welcome!</Header>
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
            <Button
                mode="contained"

                onPress={() => navigation.navigate('MapPage', {userList: userList})}
            >
                Open Map
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('EditProfile', {userList: userList})}
            >
                Edit Profile
            </Button>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('LoginScreen', {userList: userList})}
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
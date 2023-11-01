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
import { passwordValidator } from '../helpers/passwordValidator'
import { emailValidator } from '../helpers/emailValidator'
import { useRoute } from '@react-navigation/native'
import {firebase} from "../firebase/config";

export default function OrgLogin({ navigation }){
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const [password, setPassword] = useState({ value: '', error: '' })
    const [email, setEmail] = useState({ value: '', error: '' })

    const onLoginPressed = async () => {
        const passwordError = passwordValidator(password.value)
        const emailError = emailValidator(email.value)
        let inList = 0

        const orgRef = firebase.firestore().collection('Orgs')

        if (passwordError || emailError) {
            setPassword({...password, error: passwordError})
            setEmail({...email, error: emailError})
            return
        }

        const accountRef = orgRef.where("email", "==", email.value.toString())
            .where("password", "==", password.value.toString());
        const docOne = await accountRef.get();
        if (docOne.empty) {
            console.log('Organization does not exist!');
            inList = 0
        }
        else{
            inList = 1
        }

        if (inList == 0) {
            setPassword({...password, error: "Incorrect Login Info"})
            setEmail({...email, error: "Incorrect Login Info"})
            return
        }

        currentOrg = email.value.toString()

        navigation.navigate("OrgDashboard", {currentOrg: currentOrg})
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Login</Header>
            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
            />
            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />
            <View style={styles.forgotPassword}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('OrgResetPassword')}
                >
                    <Text style={styles.forgot}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
            <Button mode="contained" onPress={onLoginPressed}>
                Log in
            </Button>
            <View style={styles.row}>
                <Text>You do not have an organization account?</Text>
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => navigation.navigate('OrgRegister', {currentOrg: currentOrg})}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
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
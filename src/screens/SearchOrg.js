import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import {firebase} from "../firebase/config";
import { theme } from '../core/theme'
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from '../components/navbar'

export default function SearchOrg({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const [org, setOrg] = useState({ value: '', error: '' })
    const [orgs, setOrgs] = useState({ value: []})

    const orgCards = orgs.value.map((item, pos) =>{

        return (
            <View className="OrgCard" style={styles.NeedCard} key={pos}>
                <Text style={styles.item}>Organization: {item.get("name").toString()}</Text>
                <Text style={styles.item}>State: {item.get("state").toString()}</Text>
                <Text style={styles.item}>City: {item.get("city").toString()}</Text>
                <Text style={styles.item}>Street: {item.get("street").toString()}</Text>
                
            </View>
        )
    })

    const onOrgSearchPressed = async () => {
        const orgError = organizationValidator(org.value)

        if (orgError) {
            setOrg({...org, error: orgError})
            return
        }

        let inList = 0

        const orgRef = firebase.firestore().collection('Orgs')

        const accountRef = orgRef.where("name", "==", org.value.toString());
        const docOne = await accountRef.get();
        if (docOne.empty) {
            console.log('Organization does not exist!');
            setOrg({...org, error: "This organization does not exist"})
            inList = 0
            return
        }
        else{
            inList = 1
        }

        if (inList == 1) {
            var currentOrg = docOne.docs[0].get("email").toString()

            navigation.navigate('OrgPage', {currentUser: currentUser, currentOrg: currentOrg})
        }
    }

    useEffect(() => {
        const getInfo = async () => {

            var orgList = []

            try {
                const orgRef = firebase.firestore().collection('Orgs')
                const docTwo = await orgRef.get();

                for(var i = 0; i < docTwo.size; i++){
                    orgList.push(docTwo.docs[i])
                }

                setOrgs({value: orgList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [])

    return (
        
        <>
        <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true} style={{flex: 1}}>
        <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
        <Background> 
            
            <TextInput
                label="Organization"
                returnKeyType="next"
                value={org.value}
                onChangeText={(text) => setOrg({ value: text, error: '' })}
                error={!!org.error}
                errorText={org.error}
                autoCapitalize="none"
                autoCompleteType="org"
            />
            <Button mode="contained" onPress={onOrgSearchPressed}>
                Search for Organization
            </Button>

            <View marginTop="20%">
            
            {orgCards}
            
            </View>
        </Background>
        </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollview: {
        flexGrow: 1,
    },
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
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    NeedCard: {
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'left',
        flexDirection: 'column',
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#FFFAD7',
    },
})
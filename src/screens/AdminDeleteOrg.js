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

    const deleteOrg = async () => {

        const orgsRef = firebase.firestore().collection('Orgs')
        const accountRef = orgsRef.where("name", "==", org.value.toString());
        const docOne = await accountRef.get();

        if (docOne.empty) {
            console.log('Org does not exist!');
        }
        else{
            const offerRef = firebase.firestore().collection('DonationOffers')

            const reqRef = firebase.firestore().collection('DonationRequests')

            const availRef = firebase.firestore().collection('AvailableItems')

            const needsRef = firebase.firestore().collection('DonationNeeds')

            for(var i = 0; i < docOne.size; i++){
                var email = (await docOne.docs[i].get("email")).toString();

                const offersRef = offerRef.where("orgEmail", "==", email);

                const docTwo = await offersRef.get();

                if(docTwo.empty){
                    console.log('Org has no donation offers')
                }
                else{
                    for(var j = 0; j < docTwo.size; j++){
                        await docTwo.docs[j].ref.delete()
                    }
                }

                const reqsRef = reqRef.where("orgEmail", "==", email);

                const docThree = await reqsRef.get();

                if(docThree.empty){
                    console.log('Org has no donation requests')
                }
                else{
                    for(var k = 0; k < docThree.size; k++){
                        await docThree.docs[k].ref.delete()
                    }
                }

                const availableRef = availRef.where("email", "==", email);

                const docFour = await availableRef.get();

                if(docFour.empty){
                    console.log('Org has no available items')
                }
                else{
                    for(var m = 0; m < docFour.size; m ++){
                        await docFour.docs[m].ref.delete()
                    }
                }

                const needRef = needsRef.where("email", "==", email);

                const docFive = await needRef.get();

                if(docFive.empty){
                    console.log('Org has no donation needs')
                }
                else{
                    for(var n = 0; n < docFive.size; n++){
                        await docFive.docs[n].ref.delete()
                    }
                }

                await docOne.docs[i].ref.delete()
                navigation.navigate('AdminDashboard', {currentUser: currentUser})
            }
        }
        //await deleteDoc(doc(db, "Orgs", org.value.toString()));

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
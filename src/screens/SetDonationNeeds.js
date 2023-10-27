import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
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
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";


export default function SetDonationNeeds ({navigation}) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [email, setEmail] = useState({ value: ''})
    const [acceptedNeeds, setAcceptedNeeds] = useState({ value: []})
    const [pendingNeeds, setPendingNeeds] = useState({ value: []})
    const [declinedNeeds, setDeclinedNeeds] = useState({ value: []})

    const needRef = firebase.firestore().collection('DonationNeeds')

    const postingRef = needRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {

            var acceptedNeedList = []
            var pendingNeedList = []
            var declinedNeedList = []

            try {
                const docOne = await postingRef.get();

                console.log(docOne.size)

                for(var i = 0; i < docOne.size; i++){
                    if(docOne.docs[i].get("status").toString() == "accepted"){
                        acceptedNeedList.push(docOne.docs[i])
                    }
                    else if(docOne.docs[i].get("status").toString() == "pending"){
                        pendingNeedList.push(docOne.docs[i])
                    }
                    else{
                        declinedNeedList.push(docOne.docs[i])
                    }
                }

                await setAcceptedNeeds({value: acceptedNeedList})
                await setPendingNeeds({value: pendingNeedList})
                await setDeclinedNeeds({value: declinedNeedList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [])

    const acceptedNeedCards = acceptedNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>{item.get("need").toString()}</Text>
                <Text>{item.get("description").toString()}</Text>
            </View>
        )
    })

    const pendingNeedCards = pendingNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>{item.get("need").toString()}</Text>
                <Text>{item.get("description").toString()}</Text>
            </View>
        )
    })

    const declinedNeedCards = declinedNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>{item.get("need").toString()}</Text>
                <Text>{item.get("description").toString()}</Text>
            </View>
        )
    })

    return (
        <>
            <OrgNavbar title="My App" navigation= {navigation} currentOrg = { currentOrg }></OrgNavbar>
            <Background>
                <Logo/>
                <Header>Your Donation Requests</Header>

                <Text>Donation Offers Accepted</Text>

                {acceptedNeedCards}

                <Text>Donation Offers Still Pending</Text>

                {pendingNeedCards}

                <Text>Donation Offers Declined</Text>

                {declinedNeedCards}

                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('OrgDashboard', {currentOrg: currentOrg})}
                >
                    Home
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
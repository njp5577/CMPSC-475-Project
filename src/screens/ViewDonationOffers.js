import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native'
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


export default function ViewDonationOffers ({navigation}) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [acceptedNeeds, setAcceptedNeeds] = useState({ value: []})
    const [pendingNeeds, setPendingNeeds] = useState({ value: []})
    const [declinedNeeds, setDeclinedNeeds] = useState({ value: []})
    const [change, setChange] = useState({ value: 0})

    const needRef = firebase.firestore().collection('DonationOffers')

    const postingRef = needRef.where("orgEmail", "==", currentOrg.toString());

    const onAcceptRequestPressed = async (sentItem, sentEmail) => {
        
        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await needRef.doc(docName).set({status: "accepted"}, {merge: true})
        setChange({ value: (1)})
    }

    const onPendingRequestPressed = async (sentItem, sentEmail) => {
        
        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await needRef.doc(docName).set({status: "pending"}, {merge: true})
        setChange({ value: (1)})
    }

    const onDeclineRequestPressed = async (sentItem, sentEmail) => {
        
        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await needRef.doc(docName).set({status: "decline"}, {merge: true})
        setChange({ value: (1)})
    }

    const acceptedNeedCards = acceptedNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>Item: {item.get("need").toString()}</Text>
                <Text>Amount: {item.get("amount").toString()}</Text>
                <Text>Email: {item.get("userEmail").toString()}</Text>
                <Text>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <Button mode="contained" onPress={() => onPendingRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Back to Pending
                </Button>
                <Button mode="contained" onPress={() => onDeclineRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Decline
                </Button>
            </View>
        )
    })

    const pendingNeedCards = pendingNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>Item: {item.get("need").toString()}</Text>
                <Text>Amount: {item.get("amount").toString()}</Text>
                <Text>Email: {item.get("userEmail").toString()}</Text>
                <Text>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <Button mode="contained" onPress={() => onAcceptRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Accept
                </Button>
                <Button mode="contained" onPress={() => onDeclineRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Decline
                </Button>
            </View>
        )
    })

    const declinedNeedCards = declinedNeeds.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>Item: {item.get("need").toString()}</Text>
                <Text>Amount: {item.get("amount").toString()}</Text>
                <Text>Email: {item.get("userEmail").toString()}</Text>
                <Text>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <Button mode="contained" onPress={() => onAcceptRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Accept
                </Button>
                <Button mode="contained" onPress={() => onPendingRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Back to Pending
                </Button>
            </View>
        )
    })

    useEffect(() => {
        const getInfo = async () => {

            var acceptedNeedList = []
            var pendingNeedList = []
            var declinedNeedList = []

            try {
                const docOne = await postingRef.get();

                console.log("Offers " + docOne.size)
                console.log("Change : " + change.value)

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

                setAcceptedNeeds({value: acceptedNeedList})
                setPendingNeeds({value: pendingNeedList})
                setDeclinedNeeds({value: declinedNeedList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [change])

    return (
        <>
            <OrgNavbar title="My App" navigation= {navigation} currentOrg = { currentOrg }></OrgNavbar>
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
            <Background>
                <Logo/>
                <Header>Your Donation Requests</Header>

                <Header>Donation Offers Accepted</Header>

                <View>{acceptedNeedCards}</View>

                <Header>Donation Offers Still Pending</Header>

                <View>{pendingNeedCards}</View>

                <Header>Donation Offers Declined</Header>

                <View>{declinedNeedCards}</View>

            </Background>
            </ScrollView>
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
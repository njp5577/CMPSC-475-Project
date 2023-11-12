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
import { firebase } from "../firebase/config";
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";


export default function ViewRequests({ navigation }) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [acceptedNeeds, setAcceptedNeeds] = useState({ value: [] })
    const [pendingNeeds, setPendingNeeds] = useState({ value: [] })
    const [declinedNeeds, setDeclinedNeeds] = useState({ value: [] })
    const [change, setChange] = useState({ value: 0 })

    const requestRef = firebase.firestore().collection('DonationRequests')

    const postingRef = requestRef.where("orgEmail", "==", currentOrg.toString());

    const onAcceptRequestPressed = async (sentItem, sentEmail) => {

        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await requestRef.doc(docName).set({ status: "accepted" }, { merge: true })
        setChange({ value: (1) })
    }

    const onPendingRequestPressed = async (sentItem, sentEmail) => {

        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await requestRef.doc(docName).set({ status: "pending" }, { merge: true })
        setChange({ value: (1) })
    }

    const onDeclineRequestPressed = async (sentItem, sentEmail) => {

        const docName = sentEmail + " : " + sentItem

        console.log(docName)

        await requestRef.doc(docName).set({ status: "decline" }, { merge: true })
        setChange({ value: (1) })
    }

    const acceptedNeedCards = acceptedNeeds.value.map((item, pos) => {

        return (
            <View style={styles.NeedCard} className="NeedCard" key={pos}>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Amount: {item.get("amount").toString()}</Text>
                <Text style={styles.item}>Email: {item.get("userEmail").toString()}</Text>
                <Text style={styles.item}>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <View flexDirection="row" justifyContent="space-between">
                    <Button style={[styles.button]} mode="contained" onPress={() => onPendingRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Back to Pending
                    </Button>
                    <Button style={[styles.button]} mode="contained" onPress={() => onDeclineRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Decline
                    </Button>
                </View>

            </View>
        )
    })

    const pendingNeedCards = pendingNeeds.value.map((item, pos) => {

        return (
            <View style={styles.NeedCard} className="NeedCard" key={pos}>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Amount: {item.get("amount").toString()}</Text>
                <Text style={styles.item}>Email: {item.get("userEmail").toString()}</Text>
                <Text style={styles.item}>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <View flexDirection="row" justifyContent="space-between">
                    <Button style={[styles.button]} mode="contained" onPress={() => onAcceptRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Accept
                    </Button>
                    <Button style={[styles.button]} mode="contained" onPress={() => onDeclineRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Decline
                    </Button>
                </View>
            </View>
        )
    })

    const declinedNeedCards = declinedNeeds.value.map((item, pos) => {

        return (
            <View className="NeedCard" key={pos}>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Amount: {item.get("amount").toString()}</Text>
                <Text style={styles.item}>Email: {item.get("userEmail").toString()}</Text>
                <Text style={styles.item}>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <View flexDirection="row" justifyContent="space-between">
                    <Button style={[styles.button]} mode="contained" onPress={() => onAcceptRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Accept
                    </Button>
                    <Button style={[styles.button]} mode="contained" onPress={() => onPendingRequestPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                        Back to Pending
                    </Button>
                </View>
            </View>
        )
    })

    useEffect(() => {
        const getInfo = async () => {

            var acceptedNeedList = []
            var pendingNeedList = []
            var declinedNeedList = []

            try {
                const docOne = await requestRef.get();

                console.log("Requests " + docOne.size)
                console.log("Change : " + change.value)

                for (var i = 0; i < docOne.size; i++) {
                    if (docOne.docs[i].get("status").toString() == "accepted") {
                        acceptedNeedList.push(docOne.docs[i])
                    }
                    else if (docOne.docs[i].get("status").toString() == "pending") {
                        pendingNeedList.push(docOne.docs[i])
                    }
                    else {
                        declinedNeedList.push(docOne.docs[i])
                    }
                }

                setAcceptedNeeds({ value: acceptedNeedList })
                setPendingNeeds({ value: pendingNeedList })
                setDeclinedNeeds({ value: declinedNeedList })

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [change])

    return (
        <>
            <OrgNavbar title="My App" navigation={navigation} currentOrg={currentOrg}></OrgNavbar>
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
                <Background>
                    <Logo />
                    <Header>Donation Requests From Users</Header>

                    <Header>Donation Requests Accepted</Header>
                    <ScrollView horizontal={true} contentContainerStyle={styles.scrollview} >
                        {acceptedNeedCards}
                    </ScrollView>


                    <Header>Donation Requests Pending</Header>
                    <ScrollView horizontal={true} contentContainerStyle={styles.scrollview} >
                        {pendingNeedCards}
                    </ScrollView>


                    <Header>Donation Requests Declined</Header>
                    <ScrollView horizontal={true} contentContainerStyle={styles.scrollview} >
                        {declinedNeedCards}
                    </ScrollView>


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
    NeedCard: {
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 10,
        marginLeft: 20,
    },
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    scrollview: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 'fit-content',

    },
})
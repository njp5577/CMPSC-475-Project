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
import {db, firebase} from "../firebase/config";
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";
import Navbar from "../components/navbar";
import {deleteDoc, doc} from "firebase/firestore";


export default function SentDonationRequests ({navigation}) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const [requests, setRequests] = useState({ value: []})
    const [change, setChange] = useState({ value: 0})

    const requestRef = firebase.firestore().collection('DonationRequests')

    const onCancelPressed = async (sentRequest, sentEmail) => {

        const docName = sentEmail + " : " + sentRequest

        console.log(docName + " Deleted")

        await deleteDoc(doc(db, "DonationRequests", docName));
        setChange({ value: (1)})
    }

    const RequestCards = requests.value.map((item, pos) =>{

        return (
            <View className="RequestCard" key={pos}>
                <Text>Item: {item.get("need").toString()}</Text>
                <Text>Amount: {item.get("amount").toString()}</Text>
                <Text>Organization Email: {item.get("orgEmail").toString()}</Text>
                <Text>Comment: {item.get("comment").toString()}{"\n"}</Text>
                <Text>Status: {item.get("status").toString()}{"\n"}</Text>
                <Button mode="contained" onPress={() => onCancelPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Cancel Request
                </Button>
            </View>
        )
    })

    useEffect(() => {
        const getInfo = async () => {

            var RequestList = []

            const usersRef = firebase.firestore().collection('Users')

            const accountRef = usersRef.where("username", "==", currentUser.toString());

            const docTwo = await accountRef.get();

            var emailString = await (docTwo.docs[0].get("email")).toString()

            const postingRef = requestRef.where("userEmail", "==", emailString);

            try {
                const docOne = await postingRef.get();

                console.log("Requests " + docOne.size)
                console.log("Change : " + change.value)

                for(var i = 0; i < docOne.size; i++){
                    RequestList.push(docOne.docs[i])
                }

                setRequests({value: RequestList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [change])

    return (
        <>
            <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
            <Background>

                <Header>Your Donation Requests</Header>

                <View>{RequestCards}</View>
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
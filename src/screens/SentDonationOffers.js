import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView} from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import SmallButton from '../components/SmallButton'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { useRoute } from '@react-navigation/native'
import {db, firebase} from "../firebase/config";
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";
import Navbar from "../components/navbar";
import {deleteDoc, doc} from "firebase/firestore";


export default function SentDonationOffers ({navigation}) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const [offers, setOffers] = useState({ value: []})
    const [change, setChange] = useState({ value: 0})

    const offerRef = firebase.firestore().collection('DonationOffers')

    const onCancelPressed = async (sentOffer, sentEmail) => {

        const docName = sentEmail + " : " + sentOffer

        console.log(docName + " Deleted")

        await deleteDoc(doc(db, "DonationOffers", docName));
        setChange({ value: (1)})
    }
    //style={[styles.button]}
    const OfferCards = offers.value.map((item, pos) =>{

        return (
            <View style={styles.NeedCard} className="OfferCard" key={pos}>
                <View>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Quantity: {item.get("amount").toString()}</Text>
                <Text style={styles.item}>Org Email: {item.get("orgEmail").toString()}</Text>
                <Text style={styles.item}>Comment: {item.get("comment").toString()}</Text>
                </View>
                <View flexDirection='row' width='90%'>
                <Text style={styles.item} paddingTop='2%'>Status: {item.get("status").toString()}</Text>
                <SmallButton marginBottom='5%' marginRight='5%' mode="contained" onPress={() => onCancelPressed(item.get("need").toString(), item.get("userEmail").toString())}>
                    Cancel
                </SmallButton>
                </View>
            </View>
        )
    })

    useEffect(() => {
        const getInfo = async () => {

            var OfferList = []

            const usersRef = firebase.firestore().collection('Users')

            const accountRef = usersRef.where("username", "==", currentUser.toString());

            const docTwo = await accountRef.get();

            var emailString = await (docTwo.docs[0].get("email")).toString()

            const postingRef = offerRef.where("userEmail", "==", emailString);

            try {
                const docOne = await postingRef.get();

                console.log("Offers " + docOne.size)
                console.log("Change : " + change.value)

                for(var i = 0; i < docOne.size; i++){
                    OfferList.push(docOne.docs[i])
                }

                setOffers({value: OfferList})

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

                <Header>Your Donation Offers{"\n"}</Header>

                <View>{OfferCards}</View>
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
    scrollview: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginTop: 5,
        marginLeft: 12,
        marginRight: 20,
    },
    NeedCard: {
        width: '70%',
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'left',
        flexDirection: 'column',
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#FFFAD7',
    },
    button: {
        width: 'fit-content',
        
    },
})
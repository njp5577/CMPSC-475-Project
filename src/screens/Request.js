import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { donationValidator } from '../helpers/donationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from "../components/navbar";
import {firebase} from "../firebase/config";
import { itemValidator } from '../helpers/itemValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'
import moment from 'moment'

export default function Request({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const availableRef = firebase.firestore().collection('AvailableItems')

    const [item, setItem] = useState({ value: '', error: '' })
    const [comment, setComment] = useState({ value: '', error: '' })
    const [amount, setAmount] = useState({ value: '', error: '' })

    const onRequestPressed = async () => {
        const itemError = itemValidator(item.value)
        const commentError = descriptionValidator(comment.value)
        const amountError = descriptionValidator(amount.value)

        var inList = 0

        if (itemError || amountError || commentError) {
            setItem({...item, error: itemError})
            setComment({...comment, error: commentError})
            setAmount({...amount, error: amountError})
            return
        }

        const postingRef = availableRef.where("email", "==", currentOrg.toString()).where("item", "==", item.value.toString());

        const docOne = await postingRef.get();

        if (docOne.empty) {
            console.log('Organization is not offering this item!');
            setItem({...item, error: "Organization is not offering this item"})
            inList = 0
            return
        }
        else{
            console.log('Item is in list!');
            inList = 1
        }

        if (inList == 1) {
            const userRequestRef = firebase.firestore().collection('DonationRequests')
            //
            const userRef = firebase.firestore().collection('Users')

            const currentRef = userRef.where("username", "==", currentUser.toString());

            const docThree = await currentRef.get();
            //
            const alreadyRef = userRequestRef.where("userEmail", "==", docThree.docs[0].get("email").toString()).where("need", "==", item.value.toString()).where("orgEmail", "==", currentOrg.toString());

            const docTwo = await alreadyRef.get();

            if (docTwo.empty) {

                const today = new Date()

                const time = moment(today).format("MM-DD-YYYY hh:mm:ss A z");

                const document = docThree.docs[0].get("email").toString() + " : " + item.value.toString() + ' : ' + time.toString()

                await userRequestRef.doc(document).set({userEmail: docThree.docs[0].get("email").toString(), need: item.value.toString(), amount: amount.value.toString(),
                    comment: comment.value.toString(), status: "pending", orgEmail: currentOrg.toString(), time: time.toString()}).then()

                navigation.navigate('OrgPage', {currentUser: currentUser, currentOrg: currentOrg})
            }
            else{
                console.log("You have already put up a request to this organization for this item")

                setItem({...item, error: "You have already put up a request to this organization for this item"})

                return
            }
        }
    }

    return (
        <>
            <Navbar title="My App" navigation= {navigation} currentUser = { currentUser }></Navbar>
            
            <Background>
                <Logo />
                <Header>Request assistance this organization!</Header>
                <TextInput
                    label="Item"
                    returnKeyType="next"
                    value={item.value}
                    onChangeText={(text) => setItem({ value: text, error: '' })}
                    error={!!item.error}
                    errorText={item.error}
                    width= '50%'
                />
                <TextInput
                    label="Comment"
                    returnKeyType="done"
                    value={comment.value}
                    onChangeText={(text) => setComment({ value: text, error: '' })}
                    error={!!comment.error}
                    errorText={comment.error}
                />
                <TextInput
                    label="Amount"
                    returnKeyType="done"
                    value={amount.value}
                    onChangeText={(text) => setAmount({ value: text, error: '' })}
                    error={!!amount.error}
                    errorText={amount.error}
                />
                <Button mode="contained" onPress={onRequestPressed}>
                    Submit Request
                </Button>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('OrgPage', {currentUser: currentUser, currentOrg: currentOrg})}
                >
                    Organization Page
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
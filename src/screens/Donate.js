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
import { donationValidator } from '../helpers/donationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from "../components/navbar";
import { firebase } from "../firebase/config";
import { itemValidator } from '../helpers/itemValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'
import moment from 'moment'

export default function Donate({ navigation }) {




    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    }
    else {
        var currentUser = current
    }

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    }
    else {
        var currentOrg = orgCurrent
    }

    const needRef = firebase.firestore().collection('DonationNeeds')

    const [item, setItem] = useState({ value: '', error: '' })
    const [comment, setComment] = useState({ value: '', error: '' })
    const [amount, setAmount] = useState({ value: '', error: '' })
    const [cost, setCost] = useState({ value: '', error: '' })
    const [needs, setNeeds] = useState({ value: [] })
    const [change, setChange] = useState({ value: 0 })

    const onOfferPressed = async () => {
        const itemError = itemValidator(item.value)
        const commentError = descriptionValidator(comment.value)
        const amountError = descriptionValidator(amount.value)

        var inList = 0

        if (itemError || amountError || commentError ) {
            setItem({ ...item, error: itemError })
            setComment({ ...comment, error: commentError })
            setAmount({ ...amount, error: amountError })
            setCost({ ...cost, error: amountError })
            return
        }

        const postingRef = needRef.where("email", "==", currentOrg.toString()).where("need", "==", item.value.toString());

        const docOne = await postingRef.get();

        if (docOne.empty) {
            console.log('Organization is not requesting this item!');
            setItem({ ...item, error: "Organization is not requesting this item" })
            inList = 0
            return
        }
        else {
            console.log('Item is in list!');
            inList = 1
        }

        if (inList == 1) {
            const userOfferRef = firebase.firestore().collection('DonationOffers')
            //
            const userRef = firebase.firestore().collection('Users')

            const currentRef = userRef.where("username", "==", currentUser.toString());

            const docThree = await currentRef.get();
            //
            const alreadyRef = userOfferRef.where("userEmail", "==", docThree.docs[0].get("email").toString()).where("need", "==", item.value.toString()).where("orgEmail", "==", currentOrg.toString());

            const docTwo = await alreadyRef.get();

            if (docTwo.empty) {

                const today = new Date()

                const time = moment(today).format("MM-DD-YYYY hh:mm:ss A z");

                const document = docThree.docs[0].get("email").toString() + " : " + item.value.toString() + " : " + time.toString()

                await userOfferRef.doc(document).set({userEmail: docThree.docs[0].get("email").toString(), need: item.value.toString(), amount: amount.value.toString(),
                 comment: comment.value.toString(), status: "pending", orgEmail: currentOrg.toString(), time: time.toString(), cost: cost.value}).then()

                navigation.navigate('OrgPage', { currentUser: currentUser, currentOrg: currentOrg })
            }
            else {
                console.log("You have already put up an offer to this organization for this item")

                setItem({ ...item, error: "You have already put up an offer to this organization for this item" })

                return
            }
        }
    }

    useEffect(() => {
        const getInfo = async () => {

            var needList = []

            console.log("Set needs : " + change.value)
            const postingRef = needRef.where("email", "==", currentOrg.toString());
            try {
                const docOne = await postingRef.get();

                for (var i = 0; i < docOne.size; i++) {
                    needList.push(docOne.docs[i])
                }

                setNeeds({ value: needList })

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [change])

    const needCards = needs.value.map((item, pos) => {

        return (
            <View className="NeedCard" style={styles.NeedCard} key={pos}>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Quantity: {item.get("desc").toString()}</Text>
            </View>
        )
    })

    const regex = /^(\$?\d{1,3}(,\d{3})*(\.\d{2})?)$/;

    return (
        <>
            <Navbar title="My App" navigation={navigation} currentUser={currentUser}></Navbar>

            <Background>
                <Logo />
                <Header>Donate to this organization!</Header>
                <TextInput
                    label="Item"
                    returnKeyType="next"
                    value={item.value}
                    onChangeText={(text) => setItem({ value: text, error: '' })}
                    error={!!item.error}
                    errorText={item.error}
                    width='50%'
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
                <TextInput
                    label="Cost of Item"
                    returnKeyType="done"
                    value={cost.value}
                    onChangeText={(text) => {
                        if (regex.test(text)) {
                            setCost({ value: text, error: '' });
                        } else {
                            setCost({ value: text, error: 'Invalid dollar amount' });
                        }
                    }}
                    error={!!cost.error}
                    errorText={cost.error}
                />
                <Button mode="contained" onPress={onOfferPressed}>
                    Submit donation
                </Button>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('OrgPage', { currentUser: currentUser, currentOrg: currentOrg })}
                >
                    Organization Page
                </Button>

                <ScrollView horizontal={true} contentContainerStyle={styles.scrollview} >
                    {needCards}
                </ScrollView>
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
    scrollview: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    NeedCard: {
        flex: 1,
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'left',
        flexDirection: 'column',
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#FFFAD7',
    },
})
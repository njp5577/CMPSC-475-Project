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
import { db, firebase } from "../firebase/config";
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";
import { itemValidator } from '../helpers/itemValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'
import { deleteDoc, doc } from "firebase/firestore";


export default function SetDonationNeeds({ navigation }) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [email, setEmail] = useState({ value: '' })
    const [needs, setNeeds] = useState({ value: [] })
    const [item, setItem] = useState({ value: '', error: '' })
    const [desc, setDesc] = useState({ value: '', error: '' })
    const [change, setChange] = useState({ value: 0 })

    const needRef = firebase.firestore().collection('DonationNeeds')

    const postingRef = needRef.where("email", "==", currentOrg.toString());

    const onDeletePressed = async (sentItem) => {

        const docName = sentItem + " : " + currentOrg.toString()

        console.log(docName + " Deleted")

        await deleteDoc(doc(db, "DonationNeeds", docName));
        setChange({ value: (1) })
    }

    const needCards = needs.value.map((item, pos) => {

        return (
            <View className="NeedCard" style={styles.NeedCard} key={pos}>
                <Text style={styles.item}>Item: {item.get("need").toString()}</Text>
                <Text style={styles.item}>Quantity: {item.get("desc").toString()}</Text>
                <Button style={[styles.item,styles.button]} mode="contained" onPress={() => onDeletePressed(item.get("need").toString())}>
                    Delete
                </Button>
            </View>
        )
    })

    const onAddRequestPressed = async () => {
        const itemError = itemValidator(item.value)
        const descError = descriptionValidator(desc.value)
        let inList = 0

        if (itemError || descError) {
            setItem({ ...item, error: itemError })
            setDesc({ ...desc, error: descError })
            return
        }

        const itemPostingRef = needRef.where("email", "==", currentOrg.toString()).where("need", "==", item.value.toString());

        const docOne = await itemPostingRef.get();
        if (docOne.empty) {
            inList = 0
        }
        else {
            console.log('Item already requested!');
            inList = 1
        }

        if (inList == 1) {
            setItem({ ...item, error: "Item already requested" })
            return
        }
        else {
            const docName = item.value.toString() + " : " + currentOrg.toString()

            needRef.doc(docName).set({ email: currentOrg.toString(), need: item.value.toString(), desc: desc.value.toString() }).then()

            setItem({ value: '', error: '' })
            setDesc({ value: '', error: '' })
        }

        setChange({ value: (1) })

        console.log("Item added: " + item.value.toString())

        //navigation.navigate("OrgDashboard", {currentOrg: currentOrg})
    }

    useEffect(() => {
        const getInfo = async () => {

            var needList = []

            console.log("Set needs : " + change.value)

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

    return (
        <>
            <OrgNavbar title="My App" navigation={navigation} currentOrg={currentOrg}></OrgNavbar>
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
                <Background>
                    <Header>Add New Request</Header>

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
                        label="Desc"
                        returnKeyType="done"
                        value={desc.value}
                        onChangeText={(text) => setDesc({ value: text, error: '' })}
                        error={!!desc.error}
                        errorText={desc.error}
                    />
                    <Button mode="contained" onPress={onAddRequestPressed}>
                        Add
                    </Button>
                    <Header>Your Donation Requests</Header>

                    <View height='35%'>
                    <ScrollView horizontal={true} contentContainerStyle={styles.scrollview} >
                        {needCards}
                    </ScrollView>
                    </View>
                    <Button
                        mode="contained"

                        onPress={() => navigation.navigate('ViewDonationOffers', { currentOrg: currentOrg })}
                    >
                        See Offers
                    </Button>
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
    button: {
        width: 'fit-content',
    },
})
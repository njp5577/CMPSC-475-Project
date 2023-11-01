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
import {firebase} from "../firebase/config";
import Paragraph from '../components/Paragraph'
import OrgNavbar from "../components/orgNavbar";
import { itemValidator } from '../helpers/itemValidator'
import { descriptionValidator } from '../helpers/descriptionValidator'


export default function SetDonationNeeds ({navigation}) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if (JSON.stringify(orgCurrent) == "\"\"") {
        var currentOrg = "No Org"
    } else {
        var currentOrg = orgCurrent
    }

    const [email, setEmail] = useState({ value: ''})
    const [needs, setNeeds] = useState({ value: []})
    const [item, setItem] = useState({ value: '', error: '' })
    const [desc, setDesc] = useState({ value: '', error: '' })

    const needRef = firebase.firestore().collection('DonationNeeds')

    const postingRef = needRef.where("email", "==", currentOrg.toString());

    useEffect(() => {
        const getInfo = async () => {

            var needList = []

            try {
                const docOne = await postingRef.get();

                console.log(docOne.size)

                for(var i = 0; i < docOne.size; i++){
                    needList.push(docOne.docs[i])
                }

                await setNeeds({value: needList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [])

    const needCards = needs.value.map((item, pos) =>{

        return (
            <View className="NeedCard" key={pos}>
                <Text>{item.get("need").toString()}</Text>
                <Text>{item.get("desc").toString()}{"\n"}</Text>
            </View>
        )
    })

    const onAddRequestPressed = async () => {
        const itemError = itemValidator(item.value)
        const descError = descriptionValidator(desc.value)
        let inList = 0

        if (itemError || descError) {
            setItem({...item, error: itemError})
            setDesc({...desc, error: descError})
            return
        }
        
        const itemPostingRef = needRef.where("email", "==", currentOrg.toString()).where("need", "==", item.value.toString());

        const docOne = await itemPostingRef.get();
        if (docOne.empty) {
            inList = 0
        }
        else{
            console.log('Item already requested!');
            inList = 1
        }

        if (inList == 1) {
            setItem({...item, error: "Item already requested"})
            return
        }
        else{
            needRef.doc(item.value.toString()).set({email: currentOrg.toString(), need: item.value.toString(), desc: desc.value.toString()}).then()
        }

        navigation.navigate("OrgDashboard", {currentOrg: currentOrg})
    }

    return (
        <>
            <OrgNavbar title="My App" navigation= {navigation} currentOrg = { currentOrg }></OrgNavbar>
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true}>
            <Background>
                <Button
                    mode="contained"

                    onPress={() => navigation.navigate('ViewDonationOffers', {currentOrg: currentOrg})}
                >
                    See Offers
                </Button>
                <Header>Your Donation Requests</Header>
                <View>
                {needCards}
                <Text>{"\n"}</Text>
                </View>
                
                <Header>Add New Request</Header>

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
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
import moment from 'moment'


export default function OrgNotification ({navigation}) {
    //initialize route and state variables
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const [notifications, setNotifications] = useState({ value: []})
    const [change, setChange] = useState({ value: 0})

    const notificationsRef = firebase.firestore().collection('Notifications')

    //notification cards
    const NotificationCards = notifications.value.map((item, pos) =>{

        return (
            <View style={styles.NeedCard} className="NotificationCard" key={pos}>
                <View>
                <Text style={styles.item}>Date Received: {item.get("time").toString()}</Text>
                <Text style={styles.item}>To: {item.get("to").toString()}</Text>
                <Text style={styles.item}>From: {item.get("from").toString()}</Text>
                <Text style={styles.item}>Message: {"\n"}{item.get("message").toString()}{"\n"}</Text>
                </View>
            </View>
        )
    })
    //get notifications from database when change is updated
    useEffect(() => {
        const getInfo = async () => {

            var NotificationList = []

            var SortedList = []

            var emailString = currentOrg

            const postingRef = notificationsRef.where("to", "==", emailString);

            try {
                const docOne = await postingRef.get();

                console.log("Notifications " + docOne.size)
                console.log("Change : " + change.value)

                for(var i = 0; i < docOne.size; i++){
                    var date = moment(docOne.docs[i].get("time"), "MM-DD-YYYY hh:mm:ss A z")
                    SortedList.push(date.toDate().getTime() / 1000)
                }

                var CompareList = SortedList.sort().reverse()

                for(var i = 0; i < CompareList.length; i++){
                    for(var j = 0; j < docOne.size; j++){
                        var date = moment(docOne.docs[j].get("time"), "MM-DD-YYYY hh:mm:ss A z")
                        var seconds = date.toDate().getTime() / 1000
                        if(seconds == CompareList[i]){
                            NotificationList.push(docOne.docs[j])
                            docOne.docs[j].ref.set({active: "false"}, {merge: true})
                        }
                    }
                }

                setNotifications({value: NotificationList})

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

                <Header>Notifications{"\n"}</Header>

                <View>{NotificationCards}</View>
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
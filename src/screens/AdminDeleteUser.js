import React, { useState, useEffect } from 'react'
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { firebase, firebaseConfig, app, db } from "../firebase/config";
import { theme } from '../core/theme'
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import Navbar from '../components/navbar'
import { doc, deleteDoc, getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'


export default function AdminDeleteUser({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    if (JSON.stringify(current) == "\"\"") {
        var currentUser = "No User"
    }
    else {
        var currentUser = current
    }

    const [username, setUsername] = useState({ value: '', error: '' })
    const [users, setUsers] = useState({ value: []})

    const userCards = users.value.map((item, pos) =>{

        return (
            <View className="UserCard" style={styles.NeedCard} key={pos}>
                <Text style={styles.item}>Username: {item.get("username").toString()}</Text>
                <Text style={styles.item}>Name: {item.get("name").toString()}</Text>
                <Text style={styles.item}>Email: {item.get("email").toString()}</Text>
                <Text style={styles.item}>Admin: {item.get("isAdmin").toString()}</Text>
            </View>
        )
    })

    const deleteUser = async () => {
        const usersRef = firebase.firestore().collection('Users')
        const accountRef = usersRef.where("username", "==", username.value.toString());
        const docOne = await accountRef.get();

        if (docOne.empty) {
            console.log('User does not exist!');
        }
        else{

            const offerRef = firebase.firestore().collection('DonationOffers')

            const reqRef = firebase.firestore().collection('DonationRequests')

            for(var i = 0; i < docOne.size; i++){
                var email = (await docOne.docs[i].get("email")).toString();

                const offersRef = offerRef.where("userEmail", "==", email);

                const docTwo = await offersRef.get();

                if(docTwo.empty){
                    console.log('User has no donation offers')
                }
                else{
                    for(var j = 0; j < docTwo.size; j++){
                        await docTwo.docs[j].ref.delete()
                    }
                }

                const reqsRef = reqRef.where("userEmail", "==", email);

                const docThree = await reqsRef.get();

                if(docThree.empty){
                    console.log('User has no donation requests')
                }
                else{
                    for(var k = 0; k < docThree.size; k++){
                        await docThree.docs[k].ref.delete()
                    }
                }

                await docOne.docs[i].ref.delete()
                navigation.navigate('AdminDashboard', {currentUser: currentUser})
            }
        }
        //await deleteDoc(doc(db, "Users", username.value.toString()));

    }

    useEffect(() => {
        const getInfo = async () => {

            var userList = []

            try {
                const userRef = firebase.firestore().collection('Users')
                const docTwo = await userRef.get();

                for(var i = 0; i < docTwo.size; i++){
                    userList.push(docTwo.docs[i])
                }

                setUsers({value: userList})

            } catch (err) {
                console.log(err)
            }
        }

        getInfo().then()

    }, [])

    return (
        <>
            
            <ScrollView contentContainerStyle={styles.scrollview} scrollEnabled={true} style={{flex: 1}}>
            <Background>
            <BackButton goBack={navigation.goBack} />  

                <Logo />
                <Header>Delete A User</Header>
                <TextInput
                    label="username"
                    returnKeyType="next"
                    value={username.value}
                    onChangeText={(text) => setUsername({ value: text, error: '' })}
                    error={!!username.error}
                    errorText={username.error}
                    autoCapitalize="none"
                    autoCompleteType="User"
                />
                <Button mode="contained" onPress={deleteUser}>
                    Delete A User
                </Button>

                <View marginTop="20%">
            
                {userCards}
                    
                </View>

            </Background>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollview: {
        flexGrow: 1,
    },
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
    item: {
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
    },
    NeedCard: {
        borderRadius: 25,
        borderWidth: 2,
        alignItems: 'left',
        flexDirection: 'column',
        marginBottom: 10,
        marginLeft: 10,
        backgroundColor: '#FFFAD7',
    },
})
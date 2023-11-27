import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import { theme } from '../core/theme'
import BackButton from './BackButton';
import Homebutton from './HomeButton';
import ProfileButton from './ProfileButton';
import NotiButton from './NotiButton';
import {db, firebase} from "../firebase/config";

export default function Navbar({ currentUser, navigation }) {
    const [active, setActive] = useState({ value: false})
    const [change, setChange] = useState({ value: 0})

    /*useEffect(() => {
      const getInfo = async () => {

          const notificationsRef = firebase.firestore().collection('Notifications')

          const usersRef = firebase.firestore().collection('Users')

          const accountRef = usersRef.where("username", "==", currentUser.toString());

          const docTwo = await accountRef.get();

          var emailString = await (docTwo.docs[0].get("email")).toString()

          const postingRef = notificationsRef.where("to", "==", emailString);

          try {
              const docOne = await postingRef.get();


              if(!docOne.empty){
                for(var i = 0; i < docOne.size; i++){
                    if(docOne.docs[i].get("active") == "true"){
                      setActive({value: true})
                    }
                }
              }

          } catch (err) {
              console.log(err)
          }
      }

      getInfo().then()

      console.log(active.value)

    }, [change])*/
    return (
        
            <View style={styles.navbar}>
                 <View style = {{ width: '20%'}}>
                    <BackButton goBack={navigation.goBack}/>
                </View>

                <View style = {{ width: '20%'}}>
                  <Homebutton currentUser={currentUser} navigation={navigation}/> 
                </View>

                <View style = {{ width: '20%'}}>
                  <NotiButton currentUser={currentUser} navigation={navigation} active={active.value}/>
                </View>
                
                <View style = {{ width: '20%'}}>
                  <ProfileButton currentUser={currentUser} navigation={navigation}/>
                </View>
                

                
            
            
            
            </View>
      
    );
  };


const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '10%',
    width: '100%',
    
    backgroundColor: '#f0700e',
    
    
  },
  title: {
    color: '#FFFFFFF',
    fontSize: 30,
  },
  navButton: {
    width: 100,
    padding: 100,
    marginleft: 0,
    flex: 1,
    alignSelf: 'stretch',
  }
});
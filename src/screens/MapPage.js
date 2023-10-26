import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { organizationValidator } from '../helpers/organizationValidator'
import { useRoute } from '@react-navigation/native'
import { GoogleMap, useLoadScript, useJsApiLoader } from "@react-google-maps/api";

export default function MapPage({ navigation }) {
    const route = useRoute()

    const current = route.params?.currentUser || ""

    const apiKey = "AIzaSyD3_KKgTmO_-L1jpj5Z_XL6an7ym_qF2jE";
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: apiKey,
    })

    
  
    if (!isLoaded) {
      return <div>Loading Google Maps...</div>;
    }

    if(JSON.stringify(current) == "\"\""){
        var currentUser = "No User"
    }
    else{
        var currentUser = current
    }
    const City = "Hershey"
    var mapSourceOne = "https://www.google.com/maps/embed/v1/search?q=Show%20food%20banks%20near%20"
    var mapSourceTwo = "%20pa&key=AIzaSyD3_KKgTmO_-L1jpj5Z_XL6an7ym_qF2jE"
    var totalMap = mapSourceOne + City + mapSourceTwo
    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header></Header>
            <div> <iframe src= { totalMap } 
                width="600" 
                height="450" 
                style= {{ border:0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
            </iframe></div>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('Dashboard', {currentUser: currentUser})}
            >
            
                Home
            </Button>
            
        </Background>
        // <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1761.705055112449!2d-80.26037584435541!3d42.04697717393282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88327a10c2b6b201%3A0xd6f7e235306071bd!2sAvonia%20Tavern!5e0!3m2!1sen!2sus!4v1698280894476!5m2!1sen!2sus" 
        //     width="600" 
        //     height="450" 
        //     style= {{ border:0 }} 
        //     allowfullscreen="" 
        //     loading="lazy" 
        //     referrerpolicy="no-referrer-when-downgrade">
        // </iframe>
        
    )
}

function Map(){
    return <GoogleMap zoom={10} center= {{lat: 44, lng: -80}} mapContainerClassName='mapSheet' ></GoogleMap>
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
    mapSheet: {
        width: '100%',
        height: "100%"
    }

})
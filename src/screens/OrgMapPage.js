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
import OrgNavbar from "../components/orgNavbar";
import {WebView} from "react-native-webview";

export default function OrgMapPage({ navigation }) {
    const route = useRoute()

    const orgCurrent = route.params?.currentOrg || ""

    const apiKey = "AIzaSyD3_KKgTmO_-L1jpj5Z_XL6an7ym_qF2jE";

    if(JSON.stringify(orgCurrent) == "\"\""){
        var currentOrg = "No Org"
    }
    else{
        var currentOrg = orgCurrent
    }

    const City = "Hershey"
    var mapSourceOne = "https://www.google.com/maps/embed/v1/search?q=Show%20food%20banks%20near%20"
    var mapSourceTwo = "%20pa&key=AIzaSyD3_KKgTmO_-L1jpj5Z_XL6an7ym_qF2jE"
    var totalMap = mapSourceOne + City + mapSourceTwo
    var realMap = <iframe src= { totalMap }
                          width="600"
                          height="450"
                          style= {{ border:0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade">

    </iframe>
//https://www.google.com/maps/embed/v1/search?q=Show%20food%20banks%20near%20Erie%20pa&key=AIzaSyD3_KKgTmO_-L1jpj5Z_XL6an7ym_qF2jE
    //            <WebView source = {{ html: '<iframe src= "" width="600" height="450" style= {{ border:0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">' }}>

    return (





        <>

            <OrgNavbar title="My App" navigation= {navigation} currentOrg = { currentOrg }></OrgNavbar>
            <View style={{ flex: 1, margin: 20 }}>
                <WebView
                    style={{ flex: 1, marginTop: 20, zIndex: 3 }}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    source={{
                        html: `<iframe
            width="100%"
            height="100%"
            style="border:0"
            loading="lazy"
            allowfullscreen = 
            referrerpolicy="no-referrer-when-downgrade"
            src="${totalMap}">
            </iframe>`
                    }} />
            </View>
            <Button
                mode="contained"

                onPress={() => navigation.navigate('OrgDashboard', { currentOrg: currentOrg })}>

                Home
            </Button>
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
    mapSheet: {
        width: '100%',
        height: "100%"
    },
    map: {
        width: '100%',
        height: '100%',
    },

})
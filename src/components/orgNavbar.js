import React, { Component } from 'react';
import { View, Text, StyleSheet, Button} from 'react-native';
import { theme } from '../core/theme'
import BackButton from './BackButton';



class OrgNavbar extends Component {
    render() {
        const { title } = this.props;
        const { navigation } = this.props;
        const { currentOrg } =  this.props;
        return (

            <View style={styles.navbar}>
                <View style = {{ width: '20%'}}>
                    <BackButton goBack={navigation.goBack} />
                </View>
                <View style = {{ width: '20%'}}>
                    <Button title= "Home" style={ styles.navButton } onPress={() => navigation.navigate('OrgDashboard', {currentOrg: currentOrg})}></Button>
                </View>

                <View style = {{ width: '20%'}}>
                    <Button title= "Profile" style={ styles.navButton } onPress={() => navigation.navigate('OrgProfile', {currentOrg: currentOrg})}></Button>
                </View>



            </View>

        );
    }
}

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

export default OrgNavbar;
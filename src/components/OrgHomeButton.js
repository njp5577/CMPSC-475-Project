import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function HomeButton({ currentOrg, navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate( 'OrgDashboard' , {currentOrg: currentOrg})} style={styles.container}>
      <Image
        style={styles.image}
        source={require('../assets/home.png')}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 26,
  },
})

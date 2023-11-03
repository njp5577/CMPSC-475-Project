import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function ProfileButton({ currentUser, navigation, destination }) {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('OrgProfile', {currentOrg: currentUser})} style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/profile.png')}
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
    marginLeft: 30,
  },
})

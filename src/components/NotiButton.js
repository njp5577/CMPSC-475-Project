import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function ProfileButton({ currentUser, navigation, active }) {
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile', {currentUser: currentUser})} style={styles.container}>
        {active ? (
            <Image
            style={styles.image}
            source={require('../assets/notifications_active.png')}
          />
        ) : (
          <Image
            style={styles.image}
            source={require('../assets/notification.png')}
          />
        )}
        
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

import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function OrgNotiButton({ currentOrg, navigation, active }) {
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('OrgNotification', {currentOrg: currentOrg})} style={styles.container}>
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
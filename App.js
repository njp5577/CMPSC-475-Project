import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
//import * as R from '@realm/react'

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  MapPage,
  OrgPage,
  Donate,
  Request,
  EditProfile,
  SentDonationOffers,
  SentDonationRequests,
  OrgRegister,
  OrgDashboard,
  OrgLogin,
  OrgMapPage,
  OrgProfile,
  SetDonationNeeds,
  ViewDonationOffers,
  OrgResetPassword,
  SetAvailableItems,
  ViewRequests,
  AdminDashboard,
  AdminAddAccount,
  AdminDeleteUser,
  AdminDeleteOrg,
  Notification,
  OrgNotification,
} from './src/screens'

const Stack = createStackNavigator()

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="MapPage" component={MapPage} />
          <Stack.Screen name="OrgPage" component={OrgPage} />
          <Stack.Screen name="Donate" component={Donate} />
          <Stack.Screen name="Request" component={Request} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Notification" component={Notification}/>
          <Stack.Screen name="SentDonationOffers" component={SentDonationOffers} />
          <Stack.Screen name="SentDonationRequests" component={SentDonationRequests} />
          <Stack.Screen name="OrgLogin" component={OrgLogin} />
          <Stack.Screen name="OrgRegister" component={OrgRegister} />
          <Stack.Screen name="OrgDashboard" component={OrgDashboard} />
          <Stack.Screen name="OrgMapPage" component={OrgMapPage} />
          <Stack.Screen name="OrgProfile" component={OrgProfile} />
          <Stack.Screen name="OrgNotification" component={OrgNotification}/>
          <Stack.Screen name="SetDonationNeeds" component={SetDonationNeeds} />
          <Stack.Screen name="ViewDonationOffers" component={ViewDonationOffers} />
          <Stack.Screen name="OrgResetPassword" component={OrgResetPassword} />
          <Stack.Screen name="SetAvailableItems" component={SetAvailableItems} />
          <Stack.Screen name="ViewRequests" component={ViewRequests} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/>
          <Stack.Screen name="AdminDashboard" component={AdminDashboard}/>
          <Stack.Screen name="AdminAddAccount" component={AdminAddAccount}/>
          <Stack.Screen name="AdminDeleteUser" component={AdminDeleteUser}/>
          <Stack.Screen name="AdminDeleteOrg" component={AdminDeleteOrg}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}


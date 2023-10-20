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
                <Stack.Screen
                    name="ResetPasswordScreen"
                    component={ResetPasswordScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </Provider>
  )
}


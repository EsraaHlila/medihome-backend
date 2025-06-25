import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import BookLabScreen from './screens/BookLabScreen';
import LabCategoriesScreen from './screens/LabCategoriesScreen';
import CategoryTestsScreen from './screens/CategoryTestsScreen';
import ProfileScreen from './screens/ProfileScreen';
import BookTestScreen from './screens/BookTestScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadFlags() {
      try {
        const onboarded = await AsyncStorage.getItem('hasOnboarded');
        const loggedIn = await AsyncStorage.getItem('isLoggedIn');
        setHasOnboarded(onboarded === 'true');
        setIsLoggedIn(loggedIn === 'true');
      } catch (e) {
        console.error('Failed to load flags', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFlags();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27c46c" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {}
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen
              {...props}
              onFinish={() => {
                if (!hasOnboarded) {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Onboarding' }],
                    })
                  );
                } else if (isLoggedIn) {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Home' }],
                    })
                  );
                } else {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Welcome' }],
                    })
                  );
                }
              }}
            />
          )}
        </Stack.Screen>

        {}
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              onDone={async () => {
                await AsyncStorage.setItem('hasOnboarded', 'true');
                setHasOnboarded(true);
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                  })
                );
              }}
            />
          )}
        </Stack.Screen>

        {}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />

        {}
        <Stack.Screen name="Login">
          {(props) => (
            <LoginScreen
              {...props}
              onLoginSuccess={async () => {
                await AsyncStorage.setItem('isLoggedIn', 'true');
                setIsLoggedIn(true);
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  })
                );
              }}
            />
          )}
        </Stack.Screen>

        {}
        <Stack.Screen name="Signup" component={SignupScreen} />

        {}
        <Stack.Screen name="Home" component={HomeScreen} />

        {}
       <Stack.Screen name="BookLab" component={BookLabScreen} />
<Stack.Screen name="LabCategories" component={LabCategoriesScreen} />
<Stack.Screen name="CategoryTests" component={CategoryTestsScreen} />
<Stack.Screen name="Profile" component={ProfileScreen} />
<Stack.Screen name="BookTest" component={BookTestScreen} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace';
import Map from './screens/Map';
import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors';
import { init } from './util/database';
import * as SplashScreen from 'expo-splash-screen';
import PlaceDetails from './screens/PlaceDetails';
import { deletePlace } from './util/database';

const Stack = createNativeStackNavigator();

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init()
    .then(() => {
      setDbInitialized(true);
    })
    .catch(err => {
      console.log(err);
      setDbInitialized(false);
    });
  }, []);

  // Hide splash screen after fetching resources
  const onLayoutRootView = useCallback(async () => {
    if (dbInitialized) {
      await SplashScreen.hideAsync();
    }
  }, [dbInitialized]);

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer
        onReady={() => onLayoutRootView()}
      >
        <Stack.Navigator 
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen 
            name="AllPlaces" 
            component={AllPlaces} 
            options = {({navigation}) =>({
              title: 'Your favorite places',
              headerRight: ({tintColor}) => (
                <IconButton 
                  icon="add" 
                  color={tintColor} 
                  onPress={() => navigation.navigate('AddPlace')}
                />
              )
            })}
          />
          <Stack.Screen 
            name="AddPlace" 
            component={AddPlace} 
            options = {{
              title: 'Add a new place'
            }}
          />
          <Stack.Screen name="Map" component={Map} />
          <Stack.Screen 
            name="PlaceDetails" 
            component={PlaceDetails} 
            options = {{
              title: 'Loading Place Details...',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
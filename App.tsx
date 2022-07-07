
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';


import {View, Image, Platform, ToastAndroid, Alert } from 'react-native';
import {useState, useEffect, useRef} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "./styles";

import Login from "./screens/Login";
import LoginPilar from "./screens/LoginPilar";

import Labs from "./screens/Labs";
import Home from "./screens/Home";
import Medicos from "./screens/Medicos";
import Directorio from "./screens/Directorio";
import Medicamentos from "./screens/Medicamentos";
import Registro from "./screens/Registro";
import Ordenes from "./screens/Ordenes";
import Configuracion from "./screens/Configuracion";
import Perfil from "./screens/Perfil";


import MedicosDetalle from "./screens/MedicosDetalle";
import MedicosConfirmarCompra from "./screens/MedicosConfirmarCompra";

import MedicamentosDetalle from "./screens/MedicamentosDetalle";
import MedicamentoDetalle from "./screens/MedicamentoDetalle";

import DirectoriosDetalle from "./screens/DirectoriosDetalle";
import DirectorioDetalle from "./screens/DirectorioDetalle";

import LabsDetalle from "./screens/LabsDetalle";
import LabsConfirmarCompra from "./screens/LabsConfirmarCompra";

import OrdenDetalle from "./screens/OrdenDetalle";

import ControlCalidad from "./screens/ControlCalidad";


/*
Dirección del servicio (API)
*/
global.UBYMED_WS_BASE = "http://api.ubymed.com/public/";
//global.UBYMED_WS_BASE = "http://192.168.1.19/ubymed_api/public/";


import { AuthContext } from './components/context';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {

  const [isLoading, setIsLoading] = useState(true);

  const notificationListener = useRef();
  const responseListener = useRef();
  
  const initialLoginState = {
    isLogged: false,
    userData: {}, 
  };

  const loadData = async () => {
    let estado = initialLoginState;
    //Cargando la información del usuario autenticado...
    try {
      const value = await AsyncStorage.getItem('auth_user')
      if(value !== null) {
        let dataArray = JSON.parse(value);
        if (dataArray.isLogged === true){
          initialLoginState.isLogged = dataArray.isLogged;
          initialLoginState.userData = dataArray.userData;
          estado = initialLoginState;
        }
      }
    } catch(e) {
      // error reading value
    }
    //Ocultar el icono de carga...
    return estado;
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        ToastAndroid.show("Ha ocurrido un error al intentar obtener el token para las notificaciones.", ToastAndroid.SHORT);
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      //ToastAndroid.show("Las notificaciones únicamente funcionan con dispositivos físicos.", ToastAndroid.SHORT);
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('Ubymed', {
        name: 'Ubymed',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const storeDataToken = async (key, value) => {
    try {
        if(value) await AsyncStorage.setItem(key, value)
    } catch (e) {
        ToastAndroid.show("Error al guardar la información en el sistema de archivos", ToastAndroid.SHORT);
    }
  }

  const alterarServerToken = async(action, usuario, token) => {
    fetch(global.UBYMED_WS_BASE + 'api/usuario', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: action,
            usuario: usuario,
            token: token,
        })
    }).then((response) => response.json())
    .then((responseJson) => {
        if(responseJson["error"] === true) {
          ToastAndroid.show(responseJson["data"], ToastAndroid.SHORT);
        } else {
          //registro correcto
        } 
    }).catch((error) => {
        ToastAndroid.show("Error crítico al registrar el token de notificaciones", ToastAndroid.SHORT);
    }); 
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
        //no hacer nada con el token...
        loadData().then(estado => {
          storeDataToken("push_token", token); 
          try {
            if(estado.isLogged === true) {
              alterarServerToken("registrarPushToken", estado.userData.usuario, token);
            } else {
              alterarServerToken("removerPushToken", "", token);
            }  
          } catch (error) {
            console.log(JSON.stringify(estado));
          }
          setIsLoading(false);
        });
    });
    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      //setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  //definición de navergación 
  const Stack = createStackNavigator();

  if (isLoading) {
    return (
      <View style={styles.containerSplash}>
          <View style={styles.logoSplash}>
              <Image source={require('./assets/logo_splash.png')} style={styles.logoSplash} resizeMode="contain" />
          </View> 
      </View>
      );
  } else {
    return (
      <AuthContext.Provider value={initialLoginState}>
        <NavigationContainer> 
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} options={{ title: 'Inicio', animationEnabled: false  }} />
            <Stack.Screen name="LoginPilar" component={LoginPilar} options={{ title: 'Inicio de sesión' }}  />
            <Stack.Screen name="Login" component={Login} options={{ title: 'Inicio de sesión' }}  />
            <Stack.Screen name="Labs" component={Labs} options={{ title: 'Laboratorios'}} />
            <Stack.Screen name="LabsDetalle" component={LabsDetalle} options={{ title: 'Laboratorios Detalle'}} />
            <Stack.Screen name="LabsConfirmarCompra" component={LabsConfirmarCompra} options={{ title: 'LabsConfirmarCompra Detalle'}} />
            <Stack.Screen name="Medicos" component={Medicos} options={{ title: 'Médicos a domicilio' }} />
            <Stack.Screen name="MedicosDetalle" component={MedicosDetalle} options={{ title: 'Servicios médicos - Detalle' }} />
            <Stack.Screen name="Directorio" component={Directorio} options={{ title: 'Directorio médico' }} />
            <Stack.Screen name="DirectoriosDetalle" component={DirectoriosDetalle} options={{ title: 'Directorios Detalle' }} />
            <Stack.Screen name="DirectorioDetalle" component={DirectorioDetalle} options={{ title: 'Directorio Detalle' }} /> 
            <Stack.Screen name="Medicamentos" component={Medicamentos} options={{ title: 'Medicamentos' }} />
            <Stack.Screen name="MedicosConfirmarCompra" component={MedicosConfirmarCompra} options={{ title: 'MedicosConfirmarCompra' }} />
            <Stack.Screen name="MedicamentosDetalle" component={MedicamentosDetalle} options={{ title: 'MedicamentosDetalle' }} />
            <Stack.Screen name="MedicamentoDetalle" component={MedicamentoDetalle} options={{ title: 'MedicamentoDetalle' }} />
            <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro' }} />
            <Stack.Screen name="Ordenes" component={Ordenes} options={{ title: 'Ordenes', animationEnabled: false }} />
            <Stack.Screen name="OrdenDetalle" component={OrdenDetalle} options={{ title: 'OrdenDetalle' }} />
            <Stack.Screen name="ControlCalidad" component={ControlCalidad} options={{ title: 'ControlCalidad' }} />
            <Stack.Screen name="Configuracion" component={Configuracion} options={{ title: 'Configuracion', animationEnabled: false }} />
            <Stack.Screen name="Perfil" component={Perfil} options={{ title: 'Perfil' }} />

          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}

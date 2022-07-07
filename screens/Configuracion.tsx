
import * as React from 'react';

import {Component, useState} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Linking, Alert, ScrollView } from 'react-native';

import styles from "../styles";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIsFocused } from '@react-navigation/core';


import { AuthContext } from '../components/context.js';

export default Configuracion = ({ navigation, route }) => {

    const isFocused = useIsFocused();
    const [dataMostrar, setDataMostrar] = useState([]);

    const removeData = async () => {
        let result = true;
        try {
            await AsyncStorage.removeItem('auth_user')
        } catch (e) {
            Alert.alert("Error al guardar la información de la sesión.");
        }
        return result;
    }

    const loadPushToken = async () => {
        let token = "";
        //Cargando la información del usuario autenticado...
        try {
            const value = await AsyncStorage.getItem('push_token');
            if(value !== null) {
                token = value;
            }
        } catch(e) {
            // error reading value
        }
        //Ocultar el icono de carga...
        return token;
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
                Alert.alert(responseJson["data"]);
            } else {
                //registro correcto
            } 
        }).catch((error) => {
            Alert.alert("Error crítico al registrar el token de notificaciones");
        }); 
    }

    const cerrarSession = () => {
        //eliminar el token de este dispositivo...
        loadPushToken().then(token => {
            console.log(loginContext.userData.usuario, token);
            alterarServerToken("removerPushToken", loginContext.userData.usuario, token);
            //limpiar la session local...
            loginContext.isLogged = false;
            loginContext.userData = {};
            removeData().then(result => {
                navigation.navigate('Home');
            });
        });
    }

    const loginContext = React.useContext(AuthContext);
    if (loginContext.isLogged !== true){
        navigation.navigate('Login');
        return (<View></View>);
    }


    React.useEffect(() => {
        if (loginContext.isLogged !== true){
            navigation.navigate('Login');
        }
    }, [isFocused]);

        return ( 
            <React.Fragment>
                <ScrollView> 
                    <Text style={styles.homeBienvenido}></Text>

                    <View style={styles.containerHome}>
                        
                        <Text style={styles.inicioLabelTextAbs}>Configuración</Text>

                        <View style={styles.espaceadorHeaderSinImagen}></View>
                        

                        <View style={styles.servicioMainContainerConfig} >
                            <View style={styles.servicioMainContainerCol} >
                                <View style={styles.servicioMainContainerRow} >
                                    <View style={styles.servicioMainContainerLeftMedDetalle}>
                                        <View style={styles.servicioImgContainerDetalleMed}>
                                            <Image source={require('../assets/default_med_profile.png')} style={styles.servicioImgSMDetMed} resizeMode="contain" />
                                        </View>
                                    </View>
                                    <View style={styles.servicioMainContainerRightMed}>
                                        <Text style={styles.textoServicioTitulo}>{loginContext.userData.nombres + " " + loginContext.userData.apellidos}</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate('Perfil', { })} >
                                            <Text style={styles.TextoMiPerfil}>
                                                    Ver perfil
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>


                        

                       
                        

                        <View style={styles.formularioContainer}>
                            <View style={styles.formularioInputContainer}>
                                    <View style={styles.FormularioRow}>
                                        <TouchableOpacity onPress={() => {
                                                Linking.canOpenURL('https://ubymed.com/app/ayuda')
                                                .then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                    } else {
                                                        return Linking.openURL('https://ubymed.com/app/ayuda');
                                                    }
                                                })
                                                .catch(err => console.error('An error occurred', err));
                                        }} >
                                            <Text style={styles.FormTextLabel}>Ayuda</Text>
                                        </TouchableOpacity>
                                    </View>
                            </View>
                        </View>

                        


                       

                        <View style={styles.formularioContainer}>
                            <View style={styles.formularioInputContainer}>
                                <View style={styles.FormularioRow}>
                                    <TouchableOpacity onPress={() => {
                                                Linking.canOpenURL('http://ubymed.com/app/acerca_de')
                                                .then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                    } else {
                                                        return Linking.openURL('http://ubymed.com/app/acerca_de');
                                                    }
                                                })
                                                .catch(err => console.error('An error occurred', err));
                                        }} >
                                            <Text style={styles.FormTextLabel}>Acerca de</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.formularioInputContainerLineSup}>
                                <View style={styles.FormularioRow}>
                                    <TouchableOpacity onPress={() => {
                                                Linking.canOpenURL('https://ubymed.com/terminos-y-condiciones/')
                                                .then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                    } else {
                                                        return Linking.openURL('https://ubymed.com/terminos-y-condiciones/');
                                                    }
                                                })
                                                .catch(err => console.error('An error occurred', err));
                                        }} >
                                            <Text style={styles.FormTextLabel}>Términos y condiciones</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.formularioInputContainerLineSup}>
                                <View style={styles.FormularioRow}>
                                <TouchableOpacity onPress={() => {
                                                Linking.canOpenURL('https://ubymed.com/politica-de-privacidad/')
                                                .then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                    } else {
                                                        return Linking.openURL('https://ubymed.com/politica-de-privacidad/');
                                                    }
                                                })
                                                .catch(err => console.error('An error occurred', err));
                                        }} >
                                            <Text style={styles.FormTextLabel}>Políticas de privacidad</Text>
                                        </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.formularioInputContainerLineSup}>
                                <View style={styles.FormularioRow}>
                                    <TouchableOpacity onPress={() => {
                                                Linking.canOpenURL('https://ubymed.com/app/licencias')
                                                .then(supported => {
                                                    if (!supported) {
                                                        Alert.alert('No hemos encontrado un aplicación para abrir el link.');
                                                    } else {
                                                        return Linking.openURL('https://ubymed.com/app/licencias');
                                                    }
                                                })
                                                .catch(err => console.error('An error occurred', err));
                                        }} >
                                            <Text style={styles.FormTextLabel}>Licencias</Text>
                                        </TouchableOpacity>
                                   
                                </View>
                            </View>
                        </View>



                        <TouchableOpacity style={styles.CerrarSessionBtn} onPress={cerrarSession} >
                            <Text style={styles.CerrarSessionBtnText} >Cerrar Sessión</Text>
                        </TouchableOpacity>


                        <Text style={styles.labelPrincipalBodySpaced}></Text>
                        <Text style={styles.labelPrincipalBodySpaced}></Text>
                    </View>
                </ScrollView>
                <View style={styles.BarraInferiorContainer}>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Home')} >
                        <Image source={require('../assets/icon_home.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Ordenes')} >
                        <Image source={require('../assets/icon_bolsa.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Configuracion')} >
                        <Image source={require('../assets/icon_configuraciona.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
        </React.Fragment>
        );
}

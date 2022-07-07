
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from "../styles";


import { AuthContext } from '../components/context.js';

/*
 APP HOME
 */
export default Login = ({ navigation, route }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginContext = React.useContext(AuthContext);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');


    const [showModalContrasenia, setShowModalContrasenia] = useState(false);

    const storeData = async (value) => {
        try {
            if (value) await AsyncStorage.setItem('auth_user', value);
            AsyncStorage.removeItem("ya_utilizada");
        } catch (e) {
            Alert.alert("Error al guardar la información de la sesión.");
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

    const getData = async () => {
        if (loginContext.isLogged === false) {
            try {
                const value = await AsyncStorage.getItem('auth_user')
                if(value !== null) {
                    let dataArray = JSON.parse(value); 
                    if (dataArray.isLogged === true){
                        loginContext.isLogged = dataArray.isLogged;
                        loginContext.userData = dataArray.userData;
                        navigation.navigate('Home');
                    }
                }
            } catch(e) {
            }
        } else {
            navigation.navigate('Home');
        }
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

    getData();
    
    //servicio de autenticación al API, apuntar al ambiente adecuado...
    const UserLoginFunction = () => {
        //request tipo POST hacia el API RestFul, request y response en formato JSON
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "auth",
                email: email,
                passwd: password
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                setShowModal(true);
                setModalTitle("¡Error!");
                setModalText(responseJson["data"]);
            } else if(responseJson["auth"] === false) {
                //error de autenticación
                setShowModal(true);
                setModalTitle("¡Error!");
                setModalText(responseJson["data"]);
            } else {
                //autenticación correcta
                loginContext.isLogged = true;
                loginContext.userData = responseJson["data"];
                storeData(JSON.stringify(loginContext));
                loadPushToken().then(token => {
                    alterarServerToken("registrarPushToken", loginContext.userData.usuario, token);
                    //limpiar la session local...
                    navigation.goBack();
                });
            }
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Hubo un error crítico, por favor, intentelo de nuevo más tarde.");
        });
    }


    const recuperarConstrasenia = (emailRec) => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "recuperarPasswd",
                email: emailRec
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                setShowModal(true);
                setModalTitle("¡Error!");
                setModalText(responseJson["data"]);
            } else {
                //autenticación correcta
                setShowModal(true);
                setModalTitle("¡Correcto!");
                setModalText(responseJson["data"]);
                setShowModalContrasenia(false);
            }
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            setShowModal(true);
            setModalTitle("¡Error!");
            setModalText("Hubo un error crítico, por favor, intentelo de nuevo más tarde.");
        });
    }
    

    useEffect(() => {
        if (loginContext.showModal) {
            setShowModal(true);
            setModalTitle(loginContext.modalTitle);
            setModalText(loginContext.modalText);
            loginContext.showModal = false;
            loginContext.modalTitle = '';
            loginContext.modalText = '';
        }
    });

    
    return (

        <React.Fragment>
            <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => {
            setShowModal(!showModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>{modalTitle}</Text>
              <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setShowModal(!showModal)}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>









        <Modal
          animationType="slide"
          transparent={true}
          visible={showModalContrasenia}
          onRequestClose={() => {
            setShowModalContrasenia(!showModalContrasenia);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>¡Recupera tu contraseña!</Text>
              <Text style={styles.modalText}>Por favor, ingresa tu correo electrónico:</Text>
              <TextInput
                        style={styles.formularioTextInputRec}
                        placeholder="Usuario"
                        placeholderTextColor="#BDBDBD"
                        autoCapitalize='none'
                        onChangeText={(email) => setEmail(email)}
                    />
            <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => recuperarConstrasenia(email)} >
                <Text style={styles.textStyle}>Recuperar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancelar]}
                onPress={() => setShowModalContrasenia(!showModalContrasenia)} >
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.containerLogin}>
        
            <View style={styles.logoLogin}>
                <Image source={require('../assets/logo-login.png')} style={styles.logoLogin} resizeMode="contain" />
            </View>
            <View style={styles.CardBox}>
                <View style={styles.formularioInputContainer}>
                    <TextInput
                        style={styles.formularioTextInput}
                        placeholder="Usuario"
                        placeholderTextColor="#BDBDBD"
                        autoCapitalize='none'
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>
                <View style={styles.formularioInputContainerLineSup}>
                    <TextInput
                        style={styles.formularioTextInput}
                        placeholder="Contraseña"
                        placeholderTextColor="#BDBDBD"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>
            </View>
            
            <TouchableOpacity style={styles.loginBtn} onPress={UserLoginFunction}>
                <Text style={styles.loginText} >Ingresar</Text>
            </TouchableOpacity>

            <View style={styles.containerRegistrate}>
                <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                    <Text style={styles.TextNoTienesCuenta}  >¿No tienes una cuenta? 
                            <Text style={styles.TextRegistrate} > Regístrate</Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.containerRecuperarContrasenia}>
                <TouchableOpacity onPress={() => setShowModalContrasenia(true)}>
                    <Text style={styles.TextRegistrate}> Recuperar tu contraseña </Text>
                </TouchableOpacity>
            </View>

        </View>
        </React.Fragment>

        
        
    );
}

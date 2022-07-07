
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, Modal, ScrollView } from 'react-native';

import { useIsFocused } from '@react-navigation/core';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default Home = ({ navigation, route }) => {
    const isFocused = useIsFocused();

    const loginContext = React.useContext(AuthContext);

    const [nombre, setNombre] = useState("!");

    const [checked, setChecked] = useState(true);

    const [mostrarMedicos, setMostrarMedicos] = useState(false);
    const [mostrarLabs, setMostrarLabs] = useState(false);
    const [mostrarMedicamentos, setMostrarMedicamentos] = useState(false);
    const [mostrarDirectorio, setMostrarDirectorio] = useState(false);

    const [mostrarEnfermero, setMostrarEnfermero] = useState(false);
    const [mostrarUltrasonido, setMostrarUltrasonido] = useState(false);
    const [mostrarFisioterapia, setMostrarFisioterapia] = useState(false);
    const [mostrarAmbulancia, setMostrarAmbulancia] = useState(false);

    const removeData = async () => {
        let result = true;
        try {
            await AsyncStorage.removeItem('auth_user')
        } catch (e) {
            Alert.alert("Error al guardar la información de la sesión.");
        }
        return result;
    }

    const getData = async () => {
    
    	//verificar si debe de realizar un review pendiente...
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "mostrarServicios",
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //si ha ocurrido un error, no hacer nada...
            } else {
                //console.log(JSON.stringify(responseJson["data"]));
                if (responseJson["data"]["SHOW_SMEDICOS"] === "0") setMostrarMedicos(false); else setMostrarMedicos(true);
                if (responseJson["data"]["SHOW_LABS"] === "0") setMostrarLabs(false); else setMostrarLabs(true);
                if (responseJson["data"]["SHOW_MEDICAMENTOS"] === "0") setMostrarMedicamentos(false); else setMostrarMedicamentos(true);
                if (responseJson["data"]["SHOW_DIRECTORIO"] === "0") setMostrarDirectorio(false); else setMostrarDirectorio(true);

                if (responseJson["data"]["SHOW_ENFERMERO"] === "0") setMostrarEnfermero(false); else setMostrarEnfermero(true);
                if (responseJson["data"]["SHOW_ULTRASONIDO"] === "0") setMostrarUltrasonido(false); else setMostrarUltrasonido(true);
                if (responseJson["data"]["SHOW_FISIOTERAPIA"] === "0") setMostrarFisioterapia(false); else setMostrarFisioterapia(true);
                if (responseJson["data"]["SHOW_AMBULANCIA"] === "0") setMostrarAmbulancia(false); else setMostrarAmbulancia(true);
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
        }); 
    
    
        if (loginContext.isLogged === false) {
            try {
                const value = await AsyncStorage.getItem('auth_user')
                if(value !== null) {
                    let dataArray = JSON.parse(value); 
                    if (dataArray.isLogged === true){
                        loginContext.isLogged = dataArray.isLogged;
                        loginContext.userData = dataArray.userData;
                        setNombre(" " + loginContext.userData.nombres.toUpperCase() + "!");
                    } else {
                        setNombre("!");
                    }
                } else {
                    setNombre("!");
                }
            } catch(e) {
            }
        } else {
            setNombre(" " + loginContext.userData.nombres.toUpperCase() + "!");
        }
        
        if (loginContext.isLogged === true) {
            //verificar si debe de realizar un review pendiente...
            fetch(global.UBYMED_WS_BASE + 'api/usuario', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: "verificarReviewPendiente",
                    id: loginContext.userData.usuario,
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson["error"] === true) {
                    //si ha ocurrido un error, no hacer nada...
                } else {
                    if (responseJson["data"].length > 0) {
                        navigation.navigate('ControlCalidad', { idDetalle: responseJson["data"], es_lab: responseJson["es_lab"] })
                    }
                } 
            }).catch((error) => {
                //escribir los errores serveros en la consola e informar al usuario
                console.error(error);
                Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
            }); 
        }
        
    }

    
    useEffect(() => {
        if (isFocused) {
            getData();
        }
    }, [isFocused]);

    return ( 
        <React.Fragment>

            <ScrollView>
                <View style={styles.containerHome}>
                    <Text style={styles.homeBienvenido}>BIENVENIDO{nombre} </Text>

                    <Text style={styles.inicioLabelTextAbs}>Inicio</Text>

                    <TouchableOpacity style={styles.perfilImgContainerAbs} onPress={() => loginContext.isLogged === true ? navigation.navigate('Perfil') : navigation.navigate('Login') }>
                        <Image source={require('../assets/perfil_icon.png')} style={styles.perfilImg} resizeMode="contain" />
                    </TouchableOpacity>

                    <View style={styles.espaceadorHomeHeader}></View>
                
                    {
                        (mostrarMedicos || mostrarLabs) ?
                        <React.Fragment>
                            <Text style={styles.labelPrincipalBody}>SERVICIOS</Text>
                        </React.Fragment>
                        : <></>
                    }
                    
                    {
                        (mostrarMedicos) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicos', { categoria: "1" }) }>
                            <Image source={require('../assets/home_medicos.png')} style={[styles.homeImg, styles.homeImgBgMedicos]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Médicos</Text>
                            <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                        </TouchableOpacity>
                        : <></>
                    }

                    {
                        (mostrarEnfermero) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicos', { categoria: "2" }) }>
                            <Image source={require('../assets/home_enfermero.png')} style={[styles.homeImg, styles.homeImgBgEnf]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Enfermería</Text>
                            <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                        </TouchableOpacity>
                        : <></>
                    }


                    {
                        (mostrarUltrasonido) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicos', { categoria: "3" }) }>
                            <Image source={require('../assets/home_ultrasonido.png')} style={[styles.homeImg, styles.homeImgBgUlt]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Ultrasonidos</Text>
                            <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                        </TouchableOpacity>
                        : <></>
                    }


                    {
                        (mostrarFisioterapia) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicos', { categoria: "4" }) }>
                            <Image source={require('../assets/home_fisioterapia.png')} style={[styles.homeImg, styles.homeImgBgFis]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Fisioterapia</Text>
                            <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                        </TouchableOpacity>
                        : <></>
                    }


                    {
                        (mostrarAmbulancia) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicos', { categoria: "5" }) }>
                            <Image source={require('../assets/home_ambulancia.png')} style={[styles.homeImg, styles.homeImgBgAmb]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Ambulancias</Text>
                            <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                        </TouchableOpacity>
                        : <></>
                    }

                    {
                        (mostrarLabs) ?
                    <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Labs', {  }) }>
                        <Image source={require('../assets/home_laboratorios.png')} style={[styles.homeImg, styles.homeImgBgLab]} resizeMode="cover" />
                        <Text style={styles.homeServiceTitulo} >Laboratorios</Text>
                        <Text style={styles.homeServiceDesc}>A DOMICILIO</Text>
                    </TouchableOpacity>
                        : <></>
                    }
                    

                    {
                        (mostrarMedicamentos || mostrarDirectorio) ?
                        <React.Fragment>
                            <View style={styles.homeServicePadding}></View>
                            <Text style={styles.labelPrincipalBody}>DIRECTORIOS</Text>
                        </React.Fragment>
                        : <></>
                    }
                    
                    {
                        (mostrarMedicamentos) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Medicamentos', {  }) }>
                            <Image source={require('../assets/home_medicamentos.png')} style={[styles.homeImg, styles.homeImgBgMed]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Medicamentos</Text>
                            <Text style={styles.homeServiceDesc}>ASOCIADOS</Text>
                        </TouchableOpacity> 
                        : <></>
                    }

                    {
                        (mostrarDirectorio) ?
                        <TouchableOpacity style={styles.homeService} onPress={() => navigation.navigate('Directorio', {  }) }>
                            <Image source={require('../assets/home_directorio.png')} style={[styles.homeImg, styles.homeImgBgDir]} resizeMode="cover" />
                            <Text style={styles.homeServiceTitulo} >Directorio Médico</Text>
                            <Text style={styles.homeServiceDesc}>ASOCIADOS</Text>
                        </TouchableOpacity>
                        : <></>
                    }

                    

                        
                </View>
                    <Text style={styles.labelPrincipalBodySpaced}></Text>
                    <Text style={styles.labelPrincipalBodySpaced}></Text>
            </ScrollView>
            <View style={styles.BarraInferiorContainer}>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Home', {  })} >
                        <Image source={require('../assets/icon_homea.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => loginContext.isLogged === true ? navigation.navigate('Ordenes') : navigation.navigate('Login')} >
                        <Image source={require('../assets/icon_bolsa.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => loginContext.isLogged === true ? navigation.navigate('Configuracion') : navigation.navigate('Login')} >
                        <Image source={require('../assets/icon_configuracion.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
        </React.Fragment>
    );
}


import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

import { useIsFocused } from '@react-navigation/core';

export default Ordenes = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const [dataMostrar, setDataMostrar] = useState([]);

    const loginContext = React.useContext(AuthContext);
    if (loginContext.isLogged !== true){
        navigation.navigate('Login');
        return (<View></View>);
    }

    useEffect(() => {
        isFocused && fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getOrdenesUsuario",
                usuario: loginContext.userData.usuario
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                Alert.alert(responseJson["data"]);
            } else if(responseJson["auth"] === false) {
                //error de autenticación
                Alert.alert(responseJson["data"]);
            } else {
                //autenticación correcta
                setDataMostrar(responseJson["data"]);
            } 
        }).catch((error) => {
            //escribir los errores severos en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, [isFocused]);


      return (
        <React.Fragment>
            <ScrollView>
                <Text style={styles.homeBienvenido}></Text>

                <View style={styles.containerHome}>
                    
                    <Text style={styles.inicioLabelTextAbs}>Órdenes</Text>

                    <View style={styles.espaceadorHeaderSinImagen}></View>

                    <Text style={styles.labelPrincipalBodySpaced}>HISTORIAL</Text>

                    {
                        dataMostrar.map((item) => {
                            return (
                                <React.Fragment key={item["compra_medica"] + "-" + item["laboratorio"]}>

                                    <View style={styles.servicioMainContainer} >
                                        <TouchableOpacity onPress={() => navigation.navigate('OrdenDetalle', { idDetalle: item["compra_medica"], es_lab: item["laboratorio"] })}>
                                            <View style={styles.servicioMainContainerCol} >
                                                <View style={styles.servicioMainContainerRow} >
                                                    <View style={styles.servicioMainContainerLeftMedDetalle}>
                                                        <View style={styles.servicioImgContainerDetalleMed}>
                                                            <Image source={{uri: UBYMED_WS_BASE + "img/" + item["detalle"][0]["img"]}} style={styles.servicioImgSMDetMed} resizeMode="contain" />
                                                        </View>
                                                    </View>
                                                    <View style={styles.servicioMainContainerRightMed}>
                                                        <Text style={styles.textoServicioTitulo}>{item["detalle"][0]["nombre_servicio"]}</Text>
                                                        <Text style={styles.textoServicioDescripcion}>{item["estado_nombre"]}</Text>
                                                        <Text style={styles.textoServicioDescripcion}>{item["fecha_compra"].substring(8,10) + "/" + item["fecha_compra"].substring(5,7) + "/" + item["fecha_compra"].substring(0,4)} - {item["costo_total"]}</Text>
                                                        <View style={{ position: "absolute", right: 32, top: "40%", height: 16, width: 16, borderRadius: 8, backgroundColor: item["estado_color"],}}></View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </React.Fragment>
                            );
                        })
                    }

                    


                    <Text style={styles.labelPrincipalBodySpaced}></Text>
                    <Text style={styles.labelPrincipalBodySpaced}></Text>
                </View>
            </ScrollView>
            <View style={styles.BarraInferiorContainer}>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Home', {  })} >
                        <Image source={require('../assets/icon_home.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Ordenes', {  })} >
                        <Image source={require('../assets/icon_bolsaa.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
                <View style={styles.BarraInferiorColumna}>
                    <TouchableOpacity style={styles.barraInferiorTouchable} onPress={() => navigation.navigate('Configuracion', {  })} >
                        <Image source={require('../assets/icon_configuracion.png')} style={styles.MenuIconImg} resizeMode="contain" />
                    </TouchableOpacity>
                </View>
            </View>
        </React.Fragment>
    );
}

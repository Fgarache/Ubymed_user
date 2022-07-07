
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default MedicamentosDetalle = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const [catNombre, setCatNombre] = useState("");
    const {idDetalle} = route.params;

    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getMedicamentosCategoriaDetalle",
                id: idDetalle,
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
                try { setCatNombre(responseJson["data"][0].categoria_nombre);} catch (error) {}
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, []);

    return (
        <View style={styles.containerServicios}>
            <View style={styles.containerServiciosHeader}>
                <Image source={require('../assets/home_medicamentos.png')} style={[styles.serviciosHeaderImg, styles.homeImgBgMed]} resizeMode="stretch" />
            </View> 
            <Text style={styles.TituloSeccion}>{catNombre}</Text>

            <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

            {
                dataMostrar.map((item) => {
                    return (
                        <React.Fragment key={item["medicamento"]}>

                            <View style={styles.servicioMainContainer} >
                                <TouchableOpacity onPress={() => navigation.navigate('MedicamentoDetalle', { idDetalle: item["medicamento"] })}>
                                    <View style={styles.servicioMainContainerCol} >
                                        <View style={styles.servicioMainContainerRow} >
                                            <View style={styles.servicioMainContainerLeftMedDetalle}>
                                                <View style={styles.servicioImgContainerDetalleMed}>
                                                    <Image source={{uri: UBYMED_WS_BASE + "img/" + item["img"]}} style={styles.servicioImgSMDetMed} resizeMode="contain" />
                                                </View>
                                            </View>
                                            <View style={styles.servicioMainContainerRightMed}>
                                                <Text style={styles.textoServicioTitulo}>{item["nombre"]}</Text>
                                                <Text style={styles.textoServicioDescripcion}>{item["categoria_nombre"]}</Text>
                                                <Text style={styles.textoServicioDescripcionFar}>{item["farmaceutica"]}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                                
                        </React.Fragment>
                    );
                })
            }

        </View>
    );
}

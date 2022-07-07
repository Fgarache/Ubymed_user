
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, Image, Button, Alert, ScrollView } from 'react-native';

import styles from "../styles";

import UCheckbox from '../components/UCheckbox';


/*
 APP HOME
 */
 import { AuthContext } from '../components/context.js';

export default LabsDetalle = ({ navigation, route, screenProps }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [laboratorios, setLaboratorios] = useState([]);
    const {idDetalle} = route.params;
    const [catNombre, setCatNombre] = useState("");

    const [checked, setChecked] = React.useState({});

    const loginContext = React.useContext(AuthContext);

    const verificarSolicitarServicioLabs = () => {
        if (loginContext.isLogged !== true){
            return navigation.navigate('Login');
        }
        let arrayFinal = [];
        for(var key in checked) {
            if(checked[key] === true){
                arrayFinal.push(key);
            }
        }
        if (arrayFinal.length > 0) {
            navigation.navigate('LabsConfirmarCompra', { idDetalle: idDetalle, servicios: arrayFinal});
        } else {
            Alert.alert("Debe de elegir al menos un servicio.");
        }
    }
    
    const renderLaboratorios = () =>{
        var data = laboratorios;
        //Alert.alert(JSON.stringify(data));
        return data.map((item) => {
            return (
                <React.Fragment key={item["lcc_nombre"]}>
                    <Text style={styles.labelPrincipalBodySpaced}>
                        {item["lcc_nombre"]}
                    </Text>
                    {
                        item["data"].map((detalle) => {
                            return (
                                <React.Fragment  key={detalle["laboratorio_clinico"]}>

                                    <View style={styles.servicioMainContainer} >
                                            <View style={styles.servicioMainContainerCol} >
                                                <View style={styles.servicioMainContainerRow} >
                                                    <View style={styles.servicioMainContainerLeft}>
                                                        <Text style={styles.textoServicioTitulo}>{detalle["lc_nombre"]} (Q{detalle["costo"]})</Text>
                                                        <Text style={styles.textoServicioDescripcion}>{detalle["lc_descripcion"]}</Text>
                                                    </View>
                                                    <View style={styles.servicioMainContainerRight}>
                                                        <View style={styles.servicioImgContainerLabs}>
                                                            <UCheckbox 
                                                                style={styles.StyleUCheckBox} 
                                                                value={checked[detalle["laboratorio_clinico"]]}
                                                                onChange={(newValue) => { setChecked({...checked, [detalle["laboratorio_clinico"]]: newValue}) }}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                    </View>

                                </React.Fragment>
                            );
                        })
                    }
                </React.Fragment>
            );
        });
    }


    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "laboratorioDetalle",
                id: idDetalle,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                Alert.alert(responseJson["data"]);
            } else if(responseJson["auth"] === false) {
                Alert.alert(responseJson["data"]);
            } else {
                setLaboratorios(responseJson["data"]);
                try {
                    setCatNombre(responseJson["data"][0]["data"][0].nombre + " " + responseJson["data"][0]["data"][0].nombre_detalle) 
                } catch (error) {
                    
                }
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, []);
    
    return (
        <React.Fragment>
            <ScrollView>
                <View style={styles.containerServicios}>
                    <View style={styles.containerServiciosHeaderLabs}>
                        <Image source={require('../assets/home_laboratorios.png')} style={[styles.serviciosHeaderImg, styles.homeImgBgLab]} resizeMode="stretch" />
                    </View>
                    <Text style={styles.TituloSeccion}>{catNombre}</Text>

                    <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                    </TouchableOpacity>

                    { renderLaboratorios() }

                    <View style={styles.espaceador_inferior}>

                    </View>

                </View>
                
            </ScrollView>
            <TouchableOpacity style={styles.confirmarBtnLaboratorios} onPress={verificarSolicitarServicioLabs} >
                <Text style={styles.confirmarBtnText} >Solicitar</Text>
            </TouchableOpacity>
        </React.Fragment>
    );
}

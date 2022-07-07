
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default MedicamentoDetalle = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const [tituloSeccion, setTituloSeccion] = useState("");
    const {idDetalle} = route.params;

    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getMedicamento",
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
                setTituloSeccion(responseJson["data"][0].nombre);
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, []);

    return (
        <ScrollView>
            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/medicamentos_header_nt_nimg.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                </View>

                <Text style={styles.TituloSeccion}>{tituloSeccion}</Text>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                {
                    dataMostrar.map((item) => {
                        return (
                            <React.Fragment key={item["nombre"]}>

                                <View style={styles.servicioMainContainerMedFirst} >
                                        <View style={styles.servicioMainContainerCol} >
                                            <View style={styles.servicioImgContainerDetalleServicio}>
                                                <Image source={{uri: UBYMED_WS_BASE + "img/" + item["img"]}} style={styles.servicioImgDetalleServicio} resizeMode="center" />
                                            </View>
                                            <View style={styles.servicioMainContainerRowMedDesc} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Nombre</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["nombre"]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.servicioMainContainerRowMedDesc} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Farmacéutica</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["farmaceutica"]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.servicioMainContainerRowMedDescNOB} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Categoría</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["categoria_nombre"]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                </View>


                                <Text style={styles.labelPrincipalBodySpaced}>
                                    DATOS DE FABRICANTE
                                </Text>

                                <View style={styles.servicioMainContainerMed} >
                                        <View style={styles.servicioMainContainerCol} >
                                            <View style={styles.servicioMainContainerRowMedDesc} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Composición</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["composicion"]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.servicioMainContainerRowMedDesc} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Concentración</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["concentracion"]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.servicioMainContainerRowMedDescNOB} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Presentación</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["presentacion"]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                </View>

                                <Text style={styles.labelPrincipalBodySpaced}>
                                    DESCRIPCIÓN
                                </Text>

                                <View style={styles.servicioMainContainer} >
                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["descripcion"]}</Text>
                                </View>
                                    
                            </React.Fragment>
                        );
                    })
                }

            </View>
        </ScrollView>
    );
}

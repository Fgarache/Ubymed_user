
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, Platform, TouchableOpacity, Image, Linking, Alert, ScrollView } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default DirectorioDetalle = ({ navigation, route }) => {
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
                action: "getDirectorio",
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

    const openLocationLink = (geolocation, direccionLabel) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = geolocation.replace(" ", "");
        const label = direccionLabel;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        }); 
        Linking.openURL(url);
    }

    return (
        <ScrollView>
            <View style={styles.containerServicios}>
                <View style={styles.containerServiciosHeader}>
                    <Image source={require('../assets/directorio_header_nt_nimg.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
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
                                            <View style={styles.servicioMainContainerRowMedDescNOB} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Especialidades</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["especialidades"]}</Text>
                                                </View>
                                            </View>
                                        </View>
                                </View>


                                <Text style={styles.labelPrincipalBodySpaced}>
                                    INFORMACIÓN DE CONTACTO
                                </Text>

                                <View style={styles.servicioMainContainerMed} >
                                        <View style={styles.servicioMainContainerCol} >
                                            <View style={styles.servicioMainContainerRowMedDescNOB} >
                                                <View style={styles.servicioMainContainerLeftMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedTitulo}>Teléfono</Text>
                                                </View>
                                                <View style={styles.servicioMainContainerRightMedDesc}>
                                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["telefono"]}</Text>
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

                                <Text style={styles.labelPrincipalBodySpaced}>
                                    DIRECCIÓN
                                </Text>

                                <View style={styles.servicioMainContainer} >
                                    <Text style={styles.textoServicioDescripcionMedDesc}>{item["direccion"]}</Text>
                                </View>
                                <View style={styles.servicioMainContainer} >
                                    <TouchableOpacity onPress={() => openLocationLink(item["geolocalizacion"], "Oficina Doctor " + item["nombre"])}>
                                        <Text style={styles.textoServicioDescripcionMedDesc}>Abrir ubicación</Text>
                                    </TouchableOpacity>
                                </View>

                                    
                            </React.Fragment>
                        );
                    })
                }

            </View>
        </ScrollView>
    );
}


import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Button, Alert, ScrollView, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default MedicosDetalle = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const [descripcion, setDescripcion] = useState("");
    const [nombre, setNombre] = useState("");

    const {idDetalle} = route.params;
    const {categoria} = route.params;

    const loginContext = React.useContext(AuthContext);

    const [headerImg, setHeaderImg] = useState(require('../assets/home_medicos.png'));
    const [headerColor, setHeaderColor] = useState({});
    const [headerTitulo, setHeaderTitulo] = useState('');

    useEffect(() => {
        switch (categoria) {
            case "1":
                setHeaderImg(require('../assets/home_medicos.png'));
                setHeaderTitulo('Médicos a domicilio');    
                setHeaderColor(styles.homeImgBgMedicos);
                break;
            case "2":
                setHeaderImg(require('../assets/home_enfermero.png'));
                setHeaderTitulo('Enfermería a domicilio');    
                setHeaderColor(styles.homeImgBgEnf);
                break;
            case "3":
                setHeaderImg(require('../assets/home_ultrasonido.png'));
                setHeaderTitulo('Ultrasonidos a domicilio');    
                setHeaderColor(styles.homeImgBgUlt);
                break;
            case "4":
                setHeaderImg(require('../assets/home_fisioterapia.png'));
                setHeaderTitulo('Fisioterapia a domicilio');    
                setHeaderColor(styles.homeImgBgFis);
                break;
            case "5":
                setHeaderImg(require('../assets/home_ambulancia.png'));
                setHeaderTitulo('Ambulancias a domicilio');    
                setHeaderColor(styles.homeImgBgAmb);
                break;
            default:
                setHeaderImg(require('../assets/home_medicos.png'));
                setHeaderTitulo('Médicos a domicilio');
                setHeaderColor(styles.homeImgBgMedicos);
                break;
        }

        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getMedicosCategoriaDetalle",
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
                try {
                    setNombre(responseJson["data"][0].nombre)
                } catch (error) {
                    
                }
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            Alert.alert("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde");
        });
    }, []);

    const verificarSolicitarServicioMedico = () => {
        if (loginContext.isLogged !== true){
            return navigation.navigate('Login');
        }
        if (!descripcion){
            Alert.alert("Por favor, llenar todos los espacios obligatorios (*)");
        } else {
            navigation.navigate('MedicosConfirmarCompra', { idDetalle: idDetalle, descripcion: descripcion});
        }
    }

    return (


<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >


        <ScrollView>
            <View style={styles.containerServicios}>
                <View style={[styles.containerServiciosHeader, headerColor]}>
                    <Image source={headerImg} style={[styles.serviciosHeaderImg, headerColor]} resizeMode="stretch" />
                </View>

                <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={styles.TituloSeccion}>{nombre}</Text>

                {
                    dataMostrar.map((item) => {
                        return (
                            <React.Fragment  key={item["medicos_categoria"]} >
                                    <Text style={styles.medicosDescripcionDetalles}>
                                        {item["descripcion_larga"]}
                                    </Text>

                                    <Text style={styles.detallesDescriptor}>
                                        *DETALLES
                                    </Text>

                                    <TextInput style={styles.textAreaMedicos}
                                        multiline={true}
                                        numberOfLines={8}
                                        placeholder="Cuentanos ¿Que necesitas?"
                                        onChangeText={(descripcion) => setDescripcion(descripcion)}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        blurOnSubmit={true}
                                        />
                                
                                <TouchableOpacity style={styles.confirmarBtn} onPress={verificarSolicitarServicioMedico} >
                                    <Text style={styles.confirmarBtnText} >Solicitar</Text>
                                </TouchableOpacity>
                            </React.Fragment>
                        );
                    })
                }

            </View>
        </ScrollView>

    </KeyboardAvoidingView>


    );
}

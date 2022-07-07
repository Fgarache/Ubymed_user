
import * as React from 'react';

import {Component, useState, useEffect} from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, Modal, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

import styles from "../styles";

import { AuthContext } from '../components/context.js';

export default ControlCalidad = ({ navigation, route }) => {
    //request tipo POST hacia el API RestFul, request y response en formato JSON
    const [dataMostrar, setDataMostrar] = useState([]);
    const {idDetalle} = route.params;
    const {es_lab} = route.params;
    const [descripcion, setDescripcion] = useState("");
    const [puntuacion, setPuntuacion] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalText, setModalText] = useState('');
    const [registroExitoso, setRegistroExitoso] = useState(0);


    useEffect(() => {
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "getInfoQA",
                id: idDetalle,
                es_lab: es_lab,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                setShowModal(true);
                setModalTitle('¡Error!');
                setModalText(responseJson["data"]);
            } else {
                //autenticación correcta
                setDataMostrar(responseJson["data"]);
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde.");
        });
    }, []);

    const realizarReview = () => {
        if (puntuacion < 1) {
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Por favor, califica cómo te atendimos.");
        }
        fetch(global.UBYMED_WS_BASE + 'api/usuario', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: "setReview",
                id: idDetalle,
                es_lab: es_lab,
                puntuacion: puntuacion,
                comentario: descripcion,
            })
        }).then((response) => response.json())
        .then((responseJson) => {
            if(responseJson["error"] === true) {
                //error en las variables del request
                setShowModal(true);
                setModalTitle('¡Error!');
                setModalText(responseJson["data"]);
            } else {
                setRegistroExitoso(1);
                setShowModal(true);
                setModalTitle('¡Gracias por tus comentarios!');
                setModalText('Tus comentarios nos ayudan a mejorar cada vez más nuestro servicio');
            } 
        }).catch((error) => {
            //escribir los errores serveros en la consola e informar al usuario
            console.error(error);
            setShowModal(true);
            setModalTitle('¡Error!');
            setModalText("Ha ocurrido un error crítico, por favor, intentelo de nuevo más tarde.");
        });
    }

    return (

<KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


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
                onPress={() => {
                    if (registroExitoso === 1) {
                        navigation.navigate('Home');
                        setShowModal(!showModal);
                    } else {
                        setShowModal(!showModal);
                    }
                }}
            >
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



            <ScrollView>
                <View style={styles.containerServicios}>
                    <View style={styles.containerServiciosHeader}>
                        <Image source={require('../assets/qa_header_bg.png')} style={styles.serviciosHeaderImg} resizeMode="stretch" />
                    </View>

                    <Text style={styles.TituloSeccion}>Control de Calidad</Text>

                    <TouchableOpacity style={styles.TituloSeccionFlechaBack}
                        onPress={() => navigation.goBack()}
                    >
                        <Image source={require('../assets/arrow-left.png')} style={styles.TituloSeccionFlechaBackImg} resizeMode="stretch" />
                    </TouchableOpacity>

                    {
                        dataMostrar.map((item) => {
                            return (
                                <React.Fragment>
                                    <Image source={{uri: UBYMED_WS_BASE + "img/" + item["img"]}} style={styles.qaImgDetalle} resizeMode="center" />
                                    
                                    <Text style={styles.labelPrincipalBody}>PROFESIONAL</Text>
                                    <View style={styles.CardBoxSpaced}>
                                        <Text style={styles.formularioTextInput}>{item["medico_nombre"]}</Text>
                                    </View>

                                    <View style={styles.espaceador_inferior_md}></View>

                                    <Text style={styles.labelPrincipalBody}>¿CÓMO TE ATENDIMOS?</Text>
                                    <View style={styles.CardBoxSpacedStarts}>
                                        <TouchableOpacity style={styles.qaImgStarTouchable} onPress={() => setPuntuacion(1)} >
                                            <Image source={{uri: (puntuacion > 0) ? UBYMED_WS_BASE + "img/" + "star-f.png" : UBYMED_WS_BASE + "img/" + "star-o.png"}} style={styles.qaImgStar} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.qaImgStarTouchable} onPress={() => setPuntuacion(2)} >
                                            <Image source={{uri: (puntuacion > 1) ? UBYMED_WS_BASE + "img/" + "star-f.png" : UBYMED_WS_BASE + "img/" + "star-o.png"}} style={styles.qaImgStar} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.qaImgStarTouchable} onPress={() => setPuntuacion(3)} >
                                            <Image source={{uri: (puntuacion > 2) ? UBYMED_WS_BASE + "img/" + "star-f.png" : UBYMED_WS_BASE + "img/" + "star-o.png"}} style={styles.qaImgStar} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.qaImgStarTouchable} onPress={() => setPuntuacion(4)} >
                                            <Image source={{uri: (puntuacion > 3) ? UBYMED_WS_BASE + "img/" + "star-f.png" : UBYMED_WS_BASE + "img/" + "star-o.png"}} style={styles.qaImgStar} resizeMode="contain" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.qaImgStarTouchable} onPress={() => setPuntuacion(5)} >
                                            <Image source={{uri: (puntuacion > 4) ? UBYMED_WS_BASE + "img/" + "star-f.png" : UBYMED_WS_BASE + "img/" + "star-o.png"}} style={styles.qaImgStar} resizeMode="contain" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.espaceador_inferior_md}></View>

                                    <TextInput style={styles.textAreaMedicos}
                                            multiline={true}
                                            numberOfLines={6}
                                            placeholder="Déjanos un comentario (opcional)"
                                            onChangeText={(descripcion) => setDescripcion(descripcion)}
                                            />

                                    <TouchableOpacity
                                                    style={[styles.button, styles.buttonReviewEnviar]}
                                                    onPress={() => realizarReview()} >
                                                    <Text style={styles.textStyle}>Enviar</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[styles.button, styles.buttonReviewCancelar]}
                                                    onPress={() => navigation.navigate('Home')} >
                                                    <Text style={styles.textStyle}>Cancelar</Text>
                                                </TouchableOpacity>

                                </React.Fragment>
                            );
                        })
                    }

                </View>
            </ScrollView>
        </React.Fragment>


        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>


    );
}

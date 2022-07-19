import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Dimensions } from 'react-native';

import { NativeModules } from 'react-native';
const { StatusBarManager } = NativeModules;

const {width: windowWidth} = Dimensions.get('window');


export default StyleSheet.create({
    //splash section
    containerSplash: {
        flex: 1,
        backgroundColor: '#00aeef',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "column",
    },
    logoSplash: {
        width: 300,
    },





    //home style...
    containerHome: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#f2f2f2',
        ...Platform.select({
            ios: { paddingTop: 20 },
            android: { paddingTop: StatusBarManager.HEIGHT }
        }),
    },


    
    homeService: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
    },

    homeServiceDetalle: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 0,
    },

    homeImg: {
        alignSelf: 'center',
        width: Dimensions.get("window").width - 40,
        height: (Dimensions.get("window").width - 40) * 0.440,
        borderRadius: 20,
        overflow: "hidden",
    },

    homeImgBgMedicos: {
        backgroundColor: "#00AEEF",
    },

    homeImgBgLab: {
        backgroundColor: "#F07C00",
    },

    homeImgBgMed: {
        backgroundColor: "#F04918",
    },

    homeImgBgDir: {
        backgroundColor: "#6942F5",
    },

    homeImgBgEnf: {
        backgroundColor: "#FFA6CA",
    },

    homeImgBgUlt: {
        backgroundColor: "#262626",
    },

    homeImgBgFis: {
        backgroundColor: "#8050D8",
    },

    homeImgBgAmb: {
        backgroundColor: "#A7203A",
    },

    homeServiceTitulo: {
        position: "absolute",
        top: 20,
        left: 40,
        color: "#F2F2F2",
        fontSize: 27,
        fontWeight: 'bold',
        letterSpacing: -1,
    },

    homeServiceDesc: {
        position: "absolute",
        top: 55,
        left: 40,
        color: "rgba(242, 242, 242, 0.54)",
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: -1,
        
    },




    homeServiceExtraPadding: {
        marginTop: 5,
        width: '100%',
        borderColor: "black",
    },

    homeServicePadding: {
        marginTop: 30,
        width: '100%',
    },

    

    homeBienvenido: {
        color: '#828282',
        fontWeight: 'bold',
        alignSelf: 'stretch',
        fontSize: 17,
        letterSpacing: -0.5,
        position: "absolute",
        left: 20,
        ...Platform.select({
            ios: { top: 20 + 15 },
            android: { paddingTop: StatusBarManager.HEIGHT + 15 }
        }),
    },

    inicioPerfil: {
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 45,
    },
    inicioLabel: {
        width: '50%',
        alignItems: 'flex-start',
    },

    inicioLabel100: {
        width: '100%',
        alignItems: 'flex-start',
    },

    inicioLabelText: {
        fontSize: 34,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 25,
        letterSpacing: -1,
    },

    inicioPerfilBtn: {
        width: '50%',
        alignItems: 'flex-end',
        paddingRight: 30,
        paddingTop: 22,
        justifyContent: 'center',
    },
    perfilImgContainer: {
        height: 35,
        width: 35,
    },
    perfilImg: {
        width: 35,
        height: 35,
    },


    





    //seccion de servicios...
    containerServicios: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#f2f2f2',
        marginBottom: 30,
    },

    containerServiciosHeader:{
        width: '100%',
        paddingTop: 20,
        marginBottom: 32,
    },

    containerServiciosHeaderLabs:{
        width: '100%',
    },

    serviciosHeaderImg: {
        width: '100%',
        height: Dimensions.get("window").width * 0.42,
    },

    labelPrincipalBody: {
        color: '#767676',
        fontWeight: 'bold',
        paddingLeft: 47,
        paddingTop: 0,
        paddingBottom: 10,
        fontSize: 17,
        letterSpacing: -1,
    },

    labelPrincipalBodySpaced: {
        color: '#767676',
        fontWeight: 'bold',
        paddingLeft: 47,
        paddingTop: 30,
        paddingBottom: 0,
        fontSize: 17,
        letterSpacing: -1,
    },

    servicioMainContainer: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
    },

    servicioMainContainerConfig: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: '85%',
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
    },

    MapsContainer: {
        alignSelf: 'center',
        backgroundColor: 'gray',
        width: '85%',
        height: 250,
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        }, 
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
    },

    MapStyle: {
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
    },

    servicioMainContainerRow: {
        flexDirection: 'row',
    },

    servicioMainContainerCol: {
        flexDirection: 'column',
    },

    servicioMainContainerColLabs1: {
        flexDirection: 'row',
        width: "80%",
    },
    servicioMainContainerColLabs2: {
        flexDirection: 'row',
        width: "20%",
    },

    servicioMainContainerLeft: {
        width: "70%",
    },

    servicioMainContainerRight: {
        width: "30%",
    },

    textoServicioTitulo:{
        fontSize: 17,
        letterSpacing: -1,
        fontWeight: 'bold',
    },

    textoServicioDescripcion: {
        fontSize: 13,
        color: '#767676',
        //textAlign: 'justify',
        letterSpacing: -1,
    },

    TextoMiPerfil: {
        fontSize: 13,
        color: '#00AEEF',
        //textAlign: 'justify',
        letterSpacing: -1,
        fontWeight: "bold",
    },

    textoServicioDescripcionFar: {
        fontSize: 11,
        color: '#767676',
        //textAlign: 'justify',
        paddingTop: 5,
        fontWeight: "bold",
        letterSpacing: -1,
    },

    textoServicioDescripcionL: {
        fontSize: 13,
        color: '#767676',
        textAlign: 'left',
        letterSpacing: -1,
    },

    textoServicioNotaL: {
        fontSize: 13,
        color: '#bdbdbd',
        //textAlign: 'justify',
        alignSelf: 'flex-start',
        paddingTop: 10,
        letterSpacing: -1,
    },

    textoServicioNotaR: {
        fontSize: 13,
        color: '#bdbdbd',
        //textAlign: 'justify',
        alignSelf: 'flex-end',
        paddingTop: 10,
        paddingRight: 10,
    },

    servicioImgContainer:{
        width: 96,
    },

    servicioImg: {
        height: 55,
        width: 55,
        alignSelf: 'flex-end',
    },


    servicioImgContainerDetalleMed: {
        
    },
    
    servicioImgSM: {
        height: 45,
        width: 45,
        alignSelf: 'flex-end',
    },

    servicioImgSMDetMed: {
        height: 64,
        width: 64,
        alignSelf: 'flex-end',
    },

    detallesDescriptor: {
        color: '#767676',
        fontWeight: 'bold',
        paddingLeft: 48,
        paddingTop: 15,
        paddingBottom: 10,
        fontSize: 17,
        letterSpacing: -1,
    },


    //sección de médicos, detalle...
    medicosDescripcionDetalles: {
        color: '#767676',
        //textAlign: 'justify',
        width: '85%',
        paddingTop: 40,
        fontSize: 17,
        alignSelf: 'center',
    },

    textAreaMedicos: {
        alignSelf: "center",
        textAlignVertical: 'top',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 15,
        width: '85%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        minHeight: 150,
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        flexWrap: "nowrap",
    },

    //medicamentos

    servicioMainContainerLeftMed: {
        width: "30%",
    },

    servicioMainContainerLeftMedDetalle: {
        width: 90,
        paddingRight: 20,
    },

    servicioMainContainerRightMed: {
        flex: 1,
    },

    servicioMainContainerRightMedDetalle: {
        width: "100%",
    },

    servicioMainContainerLeftMedDesc: {
        width: "38%",
    },

    servicioMainContainerRightMedDesc: {
        width: "62%",
    },

    textoServicioDescripcionMedTitulo: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#828282",
        letterSpacing: -1,
    },

    textoServicioDescripcionMedDesc: {
        fontSize: 17,
        color: "#333333",
        letterSpacing: -1,
    },

    servicioMainContainerRowMedDesc: {
        flexDirection: 'row',
        borderBottomWidth: 0.25,
        borderBottomColor: "#E0E0E0",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },

    servicioMainContainerRowMedDescNOB: {
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },

    servicioMainContainerMed: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 15,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
    },

    servicioMainContainerMedFirst: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: '90%',
        borderRadius: 15,
        marginTop: -50,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
    },


    servicioImgContainerDetalleServicio: {
        alignSelf: "center",
        width: 120,
        height: 120,
        maxHeight: 120,
        maxWidth: 120,
        minHeight: 120,
        minWidth: 120,
        borderRadius: 60,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginTop: -60,
    },

    servicioImgDetalleServicio: {
        width: 120,
        height: 120,
        maxHeight: 120,
        maxWidth: 120,
        minHeight: 120,
        minWidth: 120,
        alignSelf: "center",
        borderRadius: 60,
    },


    qaImgDetalle: {
        alignSelf: "center",
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: -96,
    },

    qaImgStar: {
        width: 28,
        height: 29,
    },

    qaImgStarTouchable: {
        width: 28,
        height: 29,
        marginTop: 10,
        marginBottom: 10,
        flex: 1,
    },
    
    


    //formularios...
    formularioContainer: {
        backgroundColor: '#FFFFFF',
        width: '85%',
        alignSelf: 'center',
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        borderRadius: 20,
    },

    formularioInputContainerLineSup: {
        borderTopColor: '#BDBDBD',
        borderTopWidth: 0.5,
        maxHeight: 48,
        height: 48,
    },

    formularioInputContainerLineSupLibre: {
        borderTopColor: '#BDBDBD',
        borderTopWidth: 0.5,
        height: 48,
    },

    formularioInputContainerLineSupLibreSexo: {
        borderTopColor: '#BDBDBD',
        borderTopWidth: 0.5,
        ...Platform.select({
            android: { height: 48, }
        }),
    },

    formularioTextInput: {
        color: '#BDBDBD',
        padding: 13,
        paddingLeft: 20,
        fontSize: 17,
        
    },

    formularioTextInputRec: {
        color: '#BDBDBD',
        padding: 13,
        paddingLeft: 20,
        fontSize: 17,
        borderWidth: 1,
        width: "100%",
        borderRadius: 20,
        borderColor: "#E0E0E0",
    },

    formularioTextInputDark: {
        color: 'black',
        padding: 13,
        paddingLeft: 20,
        fontSize: 17,
    },

    formularioInputLabel: {
        width: '50%',
    },

    formularioInputContainer: {
        maxHeight: 48,
        height: 48,
    },

    formularioInputContainerCompra: {
    },

    FormularioRow: {
        flexDirection: 'row',
    },

    FormTextLabel: {
        textAlign: 'left',
        padding: 10,
        marginLeft: 15,
        color: "#4F4F4F",
        fontSize: 17,
        letterSpacing: -1,
    },

    FormTextLabelCompra: {
        textAlign: 'left',
        padding: 10,
        marginLeft: 15,
        color: "#4F4F4F",
        fontSize: 17,
        letterSpacing: -1,
    },

    FormTextLabelBold: {
        textAlign: 'left',
        padding: 10,
        marginLeft: 15,
        //width: '50%',
        flex: 1,
        color: "#4F4F4F",
        fontSize: 17,
        letterSpacing: -1,
        fontWeight: "bold",
    },

    FormTextLabelLight: {
        textAlign: 'right',
        padding: 10,
        paddingRight: 25,
        //width: '50%',
        width: 110,
        fontSize: 17,
        letterSpacing: -1,
        color: "#828282",
        flex: 1,
    },

    FormTextInput: {
        flex: 1,
        textAlign: 'right',
        padding: 10,
        paddingRight: 25,
        fontSize: 17,
        letterSpacing: -1,
    },


    registroBtn: {
        backgroundColor: '#00AEEF',
        width: '85%',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 35,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    CerrarSessionBtn: {
        backgroundColor: '#F04918',
        width: '85%',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 35,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },

    registroBtnText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 24,
        height: 60,
        fontWeight: 'bold',
	paddingTop: 13,
    },

    CerrarSessionBtnText: {
        color: '#F2F2F2',
        alignSelf: 'center',
        fontSize: 17,
        height: 50,
        fontWeight: 'bold',
	paddingTop: 13,
    },

    confirmarBtn: {
        backgroundColor: '#00AEEF',
        width: '85%',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 20,
        marginBottom: 25,
    },


    confirmarBtnLaboratorios: {
        backgroundColor: '#00AEEF',
        width: '85%',
        alignSelf: 'center',
        borderRadius: 20,
        position: "absolute",
        bottom: 10,
    },

    confirmarBtnText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 17,
        height: 48,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
	paddingTop: 12,
    },

    espaceador_inferior: {
        marginTop: 60,
    },

    espaceador_inferior_md: {
        marginTop: 30,
    },


    //login e input en general...
    containerLogin: {
        flex: 1,
        backgroundColor: '#00aeef',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoLogin: {
        width: '80%',
        maxHeight: 117,
        alignSelf: 'center',
        marginBottom: 30,
    },

    logoLoginPilar: {
        width: '100%',
        maxHeight: 117,
        alignSelf: 'center',
        marginBottom: 30,
    },
    
    loginBtn: {
        alignItems:"center",
        justifyContent:"center",
        marginTop:30,
        width: 177,
    },

    loginText: {
        fontSize: 24,
        color: '#F2F2F2',
        fontWeight: 'bold',
    },

    containerRegistrate: {
        position: 'absolute',
        bottom: 40,
    },

    containerRecuperarContrasenia: {
        position: 'absolute',
        bottom: 18,
    },
    
    TextNoTienesCuenta: {
        fontSize: 17,
        color: '#75D3F6',
    },

    TextRegistrate: {
        color: '#F2F2F2',
        fontSize: 17,
        fontWeight: 'bold',
    },


    TituloSeccion: {
        color: "#F2F2F2",
        letterSpacing: -1,
        fontWeight: "bold",
        fontSize: 26,
        position: "absolute",
        left: 24,
        ...Platform.select({
            ios: { top: 20 + 40 },
            android: { top: StatusBarManager.HEIGHT + 40}
        }),
    },

    TituloSeccionFlechaBack: {
        position: "absolute",
        left: 13,
        width: 26,
        height: 26,
        ...Platform.select({
            ios: { top: 20 + 15 },
            android: { top: StatusBarManager.HEIGHT + 15}
        }),
    },

    TituloSeccionFlechaBackImg: {
        width: 26,
        height: 26,
    },


    CardBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        borderRadius: 20,
        width: '85%',
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
    },

    CardBoxSpaced: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        borderRadius: 20,
        width: '85%',
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        marginTop: 10,
    },

    CardBoxSpacedStarts: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        borderRadius: 20,
        width: '85%',
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
        marginTop: 10,
        flex: 1,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        paddingLeft: "12%",
        paddingRight: "12%",
    },

    TextLoginForm: {
        fontSize: 17,
        fontWeight: "normal",
        fontStyle: "normal",
    },


    IconoTarjeta: {
        height: 24,
        width: 36,
    },


    BarraInferiorContainer: {
        height: 83,
        width: "100%",
        backgroundColor: "#F2F2F2",
        position: "absolute",
        bottom: 0,
        flex: 1,
        flexDirection: "row",
        alignItems: 'flex-start',
        borderTopColor: "#E0E0E0",
        borderTopWidth: 1
    },

    BarraInferiorColumna: {
        width: "33%",
        alignSelf: "center",
        alignContent: "center",
        textAlignVertical: "center",
        alignItems: "center",
    },

    MenuIconImg: {
        height: 32,
        width: 32,
    },


    servicioMainContainerLabs: {
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        overflow: "hidden",
        minHeight: 145,
        
    },

    LabsMainInnerContainer: {
        width: "100%",
        flex: 1,
        flexDirection: "row",
        height: "100%",
        
    },

    labsSeccionImagen: {
        width: 96,
        //height: 128,
        height: '100%',
        marginLeft: 20,
        flexWrap: "wrap",
        alignSelf: "flex-end",
    },

    labsSeccionDescripcion: {
        //height: 128,
        width: Dimensions.get("window").width - 156,
        flex: 1,
    },

    servicioImgLab: {
        width: 96,
        height: '100%',
    },

    textoServicioTituloLabs:{
        marginTop: 15,
        marginLeft: 20,
        fontSize: 17,
        letterSpacing: -1,
        fontWeight: 'bold',
    },

    textoServicioDescripcionLabs: {
        fontSize: 13,
        color: '#767676',
        textAlign: 'left',
        letterSpacing: -1,
        marginLeft: 20,
        marginTop: 12,
        marginBottom: 40,
        
    },

    textoServicioNotaLabs: {
        fontSize: 13,
        color: '#bdbdbd',
        //textAlign: 'justify',
        alignSelf: 'flex-start',
        letterSpacing: -1,
        marginLeft: 20,
        bottom: 15,
        position: "absolute",
    },

    LabsCheckBox: {
        alignSelf: "flex-end",
        alignContent: "center",
        alignItems: "center",
    },

    servicioImgContainerLabs:{
        alignSelf: "flex-end",
        alignContent: "center",
        alignItems: "center",
    },

    CirculoEstadoOrden: {
        position: "absolute",
        right: 10,
        top: "40%",
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: "black",
    },



    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "80%",
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonClose: {
        backgroundColor: "#00aeef",
        width: "100%",
        marginTop: 15,
      },
      buttonCancelar: {
        backgroundColor: "#F04918",
        width: "100%",
        marginTop: 15,
      },

      buttonReviewEnviar: {
        backgroundColor: '#00aeef',
        width: '85%',
        alignSelf: 'center',
        marginTop: 30,
        borderRadius: 30,
    },
    buttonReviewCancelar: {
        backgroundColor: '#F04918',
        width: '85%',
        alignSelf: 'center',
        borderRadius: 20,
        marginBottom: 25,
        marginTop: 20,
    },

      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 17,
      },
      modalText: {
        marginBottom: 15,
        fontSize: 17,
        textAlign: "center"
      },
      modalTitleText: {
         fontSize: 34,
         marginBottom: 15,
         textAlign: "center"
      },

      barraInferiorTouchable: {
        padding: 14,
      },

      mapMarker: {
        width: 25,
        height: 39,
        marginTop: -165,
        alignSelf: "center",
      },

      FormTextInputSexo: {
        flex: 1,
        fontSize: 17,
        letterSpacing: -1,
        alignItems: "flex-end",
    },

    FormTextInputSexoPicker: {
        maxWidth: 80,
        width: 80,
        //borderWidth: 1,
        //borderColor: "black",
        ...Platform.select({
            ios: { height: 100, },
            android: { height: 48, maxHeight: 48, }
        }),
    },

    FormTextInputSexoItem: {
        ...Platform.select({
            ios: { height: 110, },
            android: { height: 48, }
        }),
    },

    inicioLabelTextAbs: {
        fontSize: 34,
        fontWeight: 'bold',
        letterSpacing: -1,
        position: "absolute",
        left: 20,
        ...Platform.select({
            ios: { top: 20 + 35 },
            android: { top: StatusBarManager.HEIGHT + 35 }
        }),
    },

    perfilImgContainerAbs: {
        height: 40,
        width: 40,
        position: "absolute",
        right: 20,
        ...Platform.select({
            ios: { top: 20 + 35 },
            android: { top: StatusBarManager.HEIGHT + 35 }
        }),
        //borderWidth: 1,
        //borderColor: "red",
    },

    espaceadorHomeHeader: {
        marginTop: 100,
    },

    espaceadorHeaderSinImagen: {
        marginTop: 100,
    },

    containerServiciosHeaderAbs: {
        width: '100%',
        height: Dimensions.get("window").width * 0.5688,
        position: "absolute",
        top: 0,
        left: 0,
    },

    espaceadorServicioHeader: {
        marginTop: (Dimensions.get("window").width * 0.5688) + 25,
    },

    servicioMainContainerLabsSup: {
        paddingLeft: 32,
        marginBottom: 10,
        flex: 1,
    },

    FormTextLabelFlex: {
        textAlign: 'right',
        padding: 10,
        paddingRight: 25,
        fontSize: 17,
        letterSpacing: -1,
        color: "#828282",
        flex: 1,
    },

    formularioInputContainerLibre: {
        //height: 48,
    },

    labsSeccionImagenLabs: {
        width: 96,
        //height: 128,
        height: '100%',
        marginLeft: 20,
        flexWrap: "wrap",
        alignSelf: "flex-end",
        
    },

    servicioImgContainerLabsDet:{
        height: '100%',
    },

    servicioImgLabLabs: {
        width: 96,
        height: '100%',
    },

    labsContainerIndividual: {
        alignSelf: 'center',
        width: "85%",
        paddingLeft: 0,
        paddingRight: "8%",
        flex: 1,

    },

    loadingGifContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 0.5,
        borderWidth: 1,
        backgroundColor: "black",
    },

    loadingGifContainerImg: {
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        textAlignVertical: "center",
        alignSelf: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },

    loadingGif: {
        width: 80,
        height: 80,
        
    },



    StyleUCheckBox: {
        width: 25,
        height: 25,
    },


    //home style...
    espacioCompraIOS: {
        ...Platform.select({
            ios: { paddingTop: 200 },
            android: { paddingTop: 0 }
        }),
    },

    StyleCheckTP: {
        width: 30,
        height: 30,
    },

    StyleCheckTPView: {
        marginLeft: 20,
        marginTop: 8,
    },

    StyleTextTP : {
        color: "#4F4F4F",
        fontSize: 17,
        letterSpacing: -1,
        padding: 10,
    },

    StyleTextTPInterno : {
        color: "#4F4F4F",
        fontSize: 17,
        letterSpacing: -1,
    },

    StyleTextTPTouch: {
        paddingLeft: 3,
        paddingRight: 3,
        marginTop: 10,
    },

    StyleTextTPView : {
        flex: 1,
        textAlignVertical: "top",
        marginLeft: 0,
    },
    
    
    centeredViewLocation: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
    },

    modalViewLocation: {
        backgroundColor: "white",
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "100%",
      },

      modalTextLoc: {
        marginBottom: 10,
        fontSize: 17,
        textAlign: "center"
      },

      buttonCloseLoc: {
        backgroundColor: "#00aeef",
        width: "100%",
        marginTop: 5,
      },

      locImageContainer: {
          alignItems: "center",
      },

      locImage: {
          width: 200,
          height: 200,
      },
      CarboxLab: {
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: "#f68b12",
        

      },

      labCarboxText:{
        backgroundColor: "#f68b12",
        color: '#F2F2F2',
        width: windowWidth,
        textAlign: 'center'
        

      },
      input: {
        width: "100%",
        textAlign: 'justify',
        height: 40,
        margin: 12,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "#fff",
        marginHorizontal: 25,
        marginVertical: 0,
        

      },
      formularioInputContainer2: {
        maxHeight: 48,
        height: 48,
        marginStart: 0
    },
    CardBox2: {
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        elevation: 12,
        borderRadius: 20,
        width: '90%',
        alignSelf: "center",
        backgroundColor: "#FFFFFF",
    },
    veneficiencia2:{
        textAlign: 'center', 


      },
});

import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Button
} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import {
  createStackNavigator,
  TabNavigator,
  TabBarBottom,
} from 'react-navigation';
import t from 'tcomb-form-native';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBaDFN9ive_WcDv22fZi8ZS_XFxhVTigyI",
  authDomain: "icare-a350b.firebaseapp.com",
  databaseURL: "https://icare-a350b.firebaseio.com",
  projectId: "icare-a350b",
  storageBucket: "icare-a350b.appspot.com",
  messagingSenderId: "696032112369"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

var database = firebase.database();

class HomeScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  state = {
    hasCameraPermission: null,
    lastScannedUrl: null,
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = result => {
    const { navigate } = this.props.navigation;
    var lectura = JSON.parse(result.data);
    firebase
      .database()
      .ref('/json')
      .once('value')
      .then(function (snapshot) {
        var snap = snapshot.val();
        if (lectura.id === snap.id) {
          console.log(snap);
          navigate('Usuario', { datos: snap });
        }
      });
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>

        {this.state.hasCameraPermission === null
          ? <Text>Requesting for camera permission</Text>
          : this.state.hasCameraPermission === false
            ? <Text style={{ color: '#fff' }}>
              Camera permission is not granted
                </Text>
            : <BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
              }}
            />}

        {}

        <StatusBar hidden />
      </View>
    );
  }
}
class LoginScreen extends Component {
  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Button title="Agregar Usuario" onPress={() => navigate('AgregarUsuario')}>

        </Button>
        <Button title="Cámara" onPress={() => navigate('Home')}>
        </Button>
      </View>
    );
  }
}

class AgregarUsuarioScreen extends Component {
  render() {
    const { navigation } = this.props;
    const Form = t.form.Form;

    const User = t.struct({
      Nombre: t.String,
      Edad: t.String,
      Tratamiento: t.String,
      Medicamentos: t.String,
      Examenes: t.Boolean
    });

    _handleSubmit = result =>{

    }
    return (
      <View style={styles.container}>
        <Form type={User} /> {/* Notice the addition of the Form component */}
        <Button
          title="Agregar Paciente"
          onPress={() => this._handleSubmit}
        />
      </View>
    );
    
  }
}
class EditarUsuarioScreen extends Component {
  render() {
    const { navigation } = this.props;
    const Form = t.form.Form;
    const datos = navigation.getParam('datoss');
    console.log(datos.nombre)
    var Vinicial = {
      Nombre: datos.nombre,
      Edad: 41,
      
    };
    const User = t.struct({
      Nombre: t.String,
      Edad: t.Number,
      Tratamiento: t.String,
      Medicamentos: t.String,
      Examenes: t.Boolean
    });

    _handleSubmit = result =>{

    }
    return (
      <View style={styles.container}>
        <Form type={User} value={Vinicial} /> {/* Notice the addition of the Form component */}
        <Button
          title="Editar Paciente"
          onPress={() => this._handleSubmit}
        />
      </View>
    );
    
  }
}
class UsuarioScreen extends Component {
  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Details Screen</Text>
        <Text>Id: {JSON.stringify(datos.id)}</Text>
        <Text>Nombre: {JSON.stringify(datos.nombre)}</Text>
        <Button title="Editar Paciente" onPress={() => navigate('EditarUsuario' , {datoss : datos})}></Button>
      </View>
    );
  }
}

const Pantallas = createStackNavigator(
  {
    Home: HomeScreen,
    Usuario: UsuarioScreen,
    Login: LoginScreen,
    AgregarUsuario: AgregarUsuarioScreen,
    EditarUsuario: EditarUsuarioScreen
  },
  {
    initialRouteName: 'Login',
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    flexDirection: 'row',
  },
  url: {
    flex: 1,
  },
  urlText: {
    color: '#fff',
    fontSize: 20,
  },
  cancelButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
  },
});
export default Pantallas;

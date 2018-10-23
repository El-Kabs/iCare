import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Dimensions,
  LayoutAnimation,
  FlatList,
  Text,
  View,
  StatusBar,
  StyleSheet,
  ToolbarAndroid,
  TouchableOpacity,
  Button,
  TextInput,
  ScrollView
} from 'react-native';
import { BarCodeScanner, Camera, Permissions } from 'expo';
import {
  StackNavigator,
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
        var found = {}
        var encontrado = false;
        for (var i = 0; i < snap.length; i++) {
          if (snap[i].id === lectura.id) {
            found = snap[i];
            encontrado = true;
          }
        }
        if (encontrado) {
          navigate('Usuario', { datos: found });
        }
      });
  };

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
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
    const datos = navigation.getParam('datos', '{"id": 0}');
    return (
      <View>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
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
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const Form = t.form.Form;

    const User = t.struct({
      Nombre: t.String,
      Edad: t.Number,
      EPS: t.String,
      Cedula: t.String,
      Especialidad: t.String,
      Medicamentos: t.String,
      Examenes: t.String,
      Ordenes: t.String
    });

    _handleSubmit = result => {

    }
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <ScrollView>
          <Form type={User} />
          <Button
            title="Agregar Paciente"
            onPress={() => this._handleSubmit}
          />
        </ScrollView>
      </View>
    );

  }
}
class EditarUsuarioScreen extends Component {

  render() {
    
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const Form = t.form.Form;
    var Vinicial = {
      Nombre: datos.Nombre,
      Edad: datos.edad,
      Cedula: datos.cedula,
      EPS: datos.eps,
    };
    const User = t.struct({
      Nombre: t.String,
      Edad: t.Number,
      EPS: t.String,
      Cedula: t.String,
      Especialidad: t.String,
      Medicamentos: t.String,
      Examenes: t.String,
      Ordenes: t.String
    });

    _handleSubmit = result => {

    }
    console.log(datos);
    return (
      <View style={styles.container}>
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text>Nombre: {JSON.stringify(datos.Nombre)}</Text>
        <Text>Edad: {JSON.stringify(datos.edad)}</Text>
        <Text>EPS: {JSON.stringify(datos.eps)}</Text>
        <Text>Cedula: {JSON.stringify(datos.cedula)}</Text>
        
        <FlatList
          data={datos.especialidades}
          renderItem={({item}) => <TouchableOpacity onPress={() => navigate('Formato', { datos: datos })}><Text>{item.nombre}</Text></TouchableOpacity>}
          keyExtractor={({id}, index) => id}
        />
        <TouchableOpacity onPress={() => navigate('Medicamentos', { datos: datos })}>
          <Text> Medicamentos </Text>
        </TouchableOpacity>

        <Button
          title="Guardar"
          onPress={() => this._handleSubmit}
        />
      </View>
    );

  }
}

class NotasScreen extends Component {
  static navigationOptions = {
    title: "Notas"
  }

  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');


    return (
      <View>
        <TextInput style={{ borderColor: 'gray', borderWidth: 1 }} editable={true} onChangeText={(text) => this.setState({ text })}
          value={datos.notas} />
      </View>
    )
  }
}

class ExamenesScreen extends Component {

  static navigationOptions = {
    title: "Examenes"
  }

  constructor(props) {
    super(props);
    this.state = { text: 'Useless Placeholder' };
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');


    return (
      <View>
        <Button title="Camara" onPress={() => navigate('Camara', { datos: datos })}/>
      </View>
    )
  }

}

class CamaraScreen extends Component {
  static navigationOptions = {
    title: "Camara"
  }

  constructor(props) {
    super(props);
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

class MedicamentosScreen extends Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  static navigationOptions = {
    title: "Medicamentos"
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;
    const { navigate } = this.props.navigation;
    const datos = navigation.getParam('datos', '{"id": 0}');


    return (
      <View>
        <FlatList
          data={datos.medicamentos}
          renderItem={({item}) => <Text>{item.nombre}, {item.dosis},  {item.informacion}</Text>}
          keyExtractor={({id}, index) => id}
        />
      </View>
    )
  }

}

class UsuarioScreen extends Component {

  static navigationOptions = {
    title: "Usuario"
  }

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
        <ToolbarAndroid style={{
          height: StatusBar.currentHeight,
          backgroundColor: '#00701a',
          elevation: 4
        }} />
        <Text>Paciente</Text>
        <Text>Nombre: {JSON.stringify(datos.Nombre)}</Text>
        <Text>Edad: {JSON.stringify(datos.edad)}</Text>
        <Text>EPS: {JSON.stringify(datos.eps)}</Text>
        <Text>Cedula: {JSON.stringify(datos.cedula)}</Text>
        <Button title="Editar Paciente" onPress={() => navigate('EditarUsuario', { datos: datos })}></Button>
      </View>
    );
  }
}

const Pantallas = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Usuario: {
      screen: UsuarioScreen
    },
    Login: {
      screen: LoginScreen
    },
    AgregarUsuario: {
      screen: AgregarUsuarioScreen
    },
    EditarUsuario: {
      screen: EditarUsuarioScreen
    },
    Medicamentos: {
      screen: MedicamentosScreen
    },
    Camara:{
      screen: CamaraScreen
    },
    Formato: {
      screen: TabNavigator({
        Notas: {
          screen: NotasScreen,
          activeTintColor: '#e91e63'
        },
        Examenes: {
          screen: ExamenesScreen,
          activeTintColor: '#e91e63'
        }
      }, {
          tabBarPosition: 'bottom',
          tabBarOptions: {
            activeTintColor: '#10f43b',
            backgroundColor: '#058222',
            style: {
              backgroundColor: '#058222'
            }
          }
        })
    }
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

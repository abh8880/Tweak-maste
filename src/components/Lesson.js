import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  BackHandler
} from 'react-native';

import EZSwiper from 'react-native-ezswiper';
import Select from './Select';
import axios from 'axios';
import {Actions} from 'react-native-router-flux';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'final.db', createFromLocation:'~final.db'});

//let origindata = [{ key: '1', word: 'Prepositions' }]
let currentDeck = 1;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var chapter;
var test_status = 0;
var name = null;

export default class Lesson extends Component {

  async get(){
    name = await AsyncStorage.getItem('username'); 
    // alert(name);
  }

static navigationOptions = {
    title: '?  Lessons',
    headerStyle: {
      backgroundColor: '#00232d',
    },
    headerTitleStyle: {
      color: '#88bfff',
      fontSize: 20,
      fontWeight: '300'
    }
  };
  constructor(props) {
    super(props)
    this.state = { noOfCards: ['', '', '', ''],topic:1,status:0 }
    chapter = this.props.navigation.state.params.Chapter;
    // console.log(chapter);

    //this.setState({topic:1});

    this.get();

    axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/get_test_status.php', {
            params: {
              name: name,
              chapter: chapter
            },
            dataType: 'json'
          })
          .then(function (response) {
            // console.log("\n\n SUCCESS \n\n");
            // console.log("response.data[0].test: "+ response.data[0].test);
            test_status = response.data[0].test;
          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
  }
        

    renderRow = (obj, index) => {

      let comp;
      let finalcomp;

      finalcomp =
        <View key={index} style={[styles.deckCard, { backgroundColor: "#ffffff", borderRadius: 15, position: 'relative' }]}>
          <Text style={styles.deckTitle}>Lesson {index+1}</Text>
          <Text style={styles.deckSubTitle}>Content:</Text>
          <View>
            <Text style={styles.deckInfo}>
              Something here...
            </Text>
          </View>
          <View style={styles.deckButtonView}>
            <TouchableOpacity style={styles.deckButton} onPress={() => this._onPressDeckButton()}>
              <Text style={styles.deckButtonText}>Start </Text>
            </TouchableOpacity>
          </View>

             
        </View>

      return (finalcomp)

  }

  _onPressDeckButton = () => {
    // console.log("current deck ="+currentDeck);
    this.setState({topic:currentDeck});
    this.reset_db(chapter,this.state.topic);
    this.setState({status:1});
    Actions.select({topic:currentDeck, chapter:chapter, count:0});
  }

  onDidChange = (obj, index) => {
    // console.log('onDidChange=>obj:' + obj + ' ,index:' + index);

    currentDeck = index+1;
    // console.log("current deck ="+currentDeck);
  }

  _handleButtonPress = () =>{
    // console.log("\n\nTEST BUTTON PRESSED\n\n")
    if(test_status == 0){
      Alert.alert(
        'Hey There !',
        'If you score below the cutoff, the test will be disabled and will only be enabled after you complete all the lessons.',
        [
          {text: 'Continue', onPress: () => this.setState({status:-1})},
          {text: 'Go Back', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        ],
        { cancelable: true }
      )
    }

    else if(test_status == 2){
      alert("Test Disabled. Please complete all the lessons first !");
    }

    else
    {
      // this.setState({status:-1});
      status = -1;
      this.reset_test_db(chapter);
      // alert("starting test!");
      Actions.select({topic:status, chapter:chapter, count:0}); 
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    Actions.first();
  }
  
  reset_test_db = (chapter) =>{
    db.transaction((tx) => {
      tx.executeSql('UPDATE tact1 SET status=0 WHERE chapter=?', [chapter], (tx, results) => {
       console.log("tact1 updated");
       });  
     });
    db.transaction((tx) => {
      tx.executeSql('UPDATE tact2 SET status=0 WHERE chapter=?', [chapter], (tx, results) => {
       console.log("tact2 updated");
       });  
     });
    db.transaction((tx) => {
      tx.executeSql('UPDATE tact3 SET status=0 WHERE chapter=?', [chapter], (tx, results) => {
       console.log("tact3 updated");
       });  
     });
  }

  reset_db = (chapter,topic) =>{
    db.transaction((tx) => {
      tx.executeSql('UPDATE act1 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act1 updated");
       });  
     });
   
     db.transaction((tx) => {
      tx.executeSql('UPDATE act2 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act2 updated");
       });  
     });
   
     db.transaction((tx) => {
       tx.executeSql('UPDATE act3 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
      console.log("act3 updated");
      });  
     });
   
       db.transaction((tx) => {
       tx.executeSql('UPDATE act4 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act4 updated");
       });  
     });
   
       db.transaction((tx) => {
       tx.executeSql('UPDATE act5 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act5 updated");
       });  
     });
   
       db.transaction((tx) => {
       tx.executeSql('UPDATE act6 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act6 updated");
       });  
     });
   
     db.transaction((tx) => {
       tx.executeSql('UPDATE act7 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
       console.log("act7 updated");
     });  
     });

  };

  render() {
    console.log("topic="+this.state.topic);
    
    // if (this.state.status==0) 
    // {
        return (
          <View style={styles.container}>
            <EZSwiper style={[styles.swiper, { width: width, height: height/2,}]}
              dataSource={this.state.noOfCards}
              width={width}
              height={height/2.3}
              renderRow={this.renderRow}
              onDidChange={this.onDidChange}
              ratio={0.7}
              index={0}
              horizontal={true}
              loop={false} />
              <TouchableOpacity onPress={() => this._handleButtonPress()}>
              <View style={styles.testBtn}>
              <Text style={styles.testTxt}>TEST</Text>
              </View>
              </TouchableOpacity>
          </View>
        );
    // }
    // else if(this.state.status == -1){
    //   Actions.select({topic:this.state.status, chapter:chapter})
    //   return(
    //     <Select topic={this.state.status} chapter={chapter} />
    //   );
    // }
    // else
    // {
    //   console.log("passing: "+this.state.topic+chapter)
    //   this.reset_db(chapter,this.state.topic);
    //   Actions.select({topic:this.state.status, chapter:chapter})
    //     return(
    //         <Select topic={this.state.topic} chapter={chapter} />
    //     );
    // }
    
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#034569'
  },
  swiper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#034569',
  },
  deckCard: {
    flex: 1,
    alignItems: 'center',
   
  },
  deckTitle:{
    fontFamily: 'Museo 700',
    fontSize: 35,
    margin: 25,
    color: '#000000'
  },
  deckSubTitle:{
    fontFamily: 'Museo Sans_500',
    fontSize: 25,
    color: '#1c313a'
  },
  originList:{
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 18,
    margin: 3,
    color: '#000000'
  },
  deckButtonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 50
  },
  deckButton:{
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#1c313a',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 3,

  },
  deckButtonText:{
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 18,
    color: '#ffffff',
  },
 deckInfo:{
color:'#e5e5e5'
},
testBtn:{
  margin:'10%',
  width:Dimensions.get('window').width/3,
  height:Dimensions.get('window').height/15,
  backgroundColor:'#1c313a',
  alignItems:'center',
  borderRadius:10,
   justifyContent:'center'
},
testTxt:{
  color:'white',
  fontFamily:'Museo 500',
  fontSize:20,
  justifyContent:'center'
}
});

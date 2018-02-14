import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import EZSwiper from 'react-native-ezswiper';
import Select from './Select';
import axios from 'axios';

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase({name:'activity.db', createFromLocation:'~activity.db'});

let origindata = [{ key: '1', word: 'Prepositions' }]
let currentDeck = 0;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
var chapter;
export default class Lesson extends Component {

  constructor(props) {
    super(props)
    this.state = { noOfCards: ['', '', '', ''],topic:1,status:0,isDisabled: false }
    chapter = this.props.navigation.state.params.Chapter;
    console.log(chapter);

    //this.setState({topic:1});
  }
        
  renderOriginw() {
    return origindata.map(ogdata => (<Text key={ogdata.key} style={styles.originList}>{ogdata.word}</Text>));
  }

    renderRow = (obj, index) => {

      let comp;
      let finalcomp;
      originWordsList = this.renderOriginw();

      finalcomp =
        <View style={[styles.deckCard, { backgroundColor: "#ffffff", borderRadius: 15, position: 'relative' }]}>
          <Text style={styles.deckTitle}>Lesson {index+1}</Text>
          <Text style={styles.deckSubTitle}>Content:</Text>
          <View>
            <Text>
              Something here...
            </Text>
          </View>
          <View style={styles.deckButtonView}>
            <TouchableOpacity style={styles.deckButton} onPress={() => this._onPressDeckButton()}>
              <Text style={styles.deckButtonText}>Start 📝</Text>
            </TouchableOpacity>
          </View>
        </View>

      return (finalcomp)

  }

  _onPressDeckButton = () => {
    console.log("deck no ="+currentDeck);
    this.setState({topic:currentDeck+1});
    this.setState({status:1});
  }

  onDidChange = (obj, index) => {
    console.log('onDidChange=>obj:' + obj + ' ,index:' + index);
    this.setState({topic:index+1});
    currentDeck = index;
  }

  _handleButtonPress = () =>{
    this.setState({status:-1});
  }

  static navigationOptions = {
    title: 'Lessons',
    headerStyle: {
      backgroundColor: '#00232d',
    },
    headerTitleStyle: {
      color: '#88bfff',
      fontSize: 20,
      fontWeight: '200',
    },
    headerTintColor: '#88bfff',
  };

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
   
		 db.transaction((tx) => {
		   tx.executeSql('UPDATE act8 SET status=0 WHERE chapter=? AND topic=?', [chapter,topic], (tx, results) => {
		   console.log("act8 updated");
		 });  
		 });
	};

  render() {
    console.log("topic="+this.state.topic);
    axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/get_test_status.php', {
            params: {
              name: 'akash',
              chapter: chapter
            },
            dataType: 'json'
          })
          .then(function (response) {
            console.log("\n\n SUCCESS \n\n");
            console.log("response.data[0].test: "+ response.data[0].test);
            if (response.data[0].test==0||response.data[0].test==1) 
            {
              if (this.state.isDisabled==true) 
              {
                console.log("buton enabled");
                this.setState({isDisabled:false});
              }
            }
            else if (response.data[0].test==2)
            {
              if (this.state.isDisabled==false) 
              {
                console.log("buton disabled");
                this.setState({isDisabled:true});
              }
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
    if (this.state.status==0) 
    {
        return (
          <View style={styles.container}>
            <EZSwiper style={[styles.swiper, { width: width, height: height/2 }]}
              dataSource={this.state.noOfCards}
              width={width}
              height={height/2.3}
              renderRow={this.renderRow}
              onDidChange={this.onDidChange}
              ratio={0.7}
              index={0}
              horizontal={true}
              loop={false} />

              <TouchableOpacity style={styles.button} onPress={() => this._handleButtonPress()} disabled={this.state.isDisabled}>
                  <View>
                      <Text style={{ fontSize: 15 }} >Attempt Test</Text>
                  </View>
              </TouchableOpacity>

          </View>
        );
    }

    else if(this.state.status == -1){
      return(
        <Select topic={this.state.status} chapter={chapter} />
      );
    }
    else
    {
      console.log("passing: "+this.state.topic+chapter)
      this.reset_db(chapter,this.state.topic);
        return(
            <Select topic={this.state.topic} chapter={chapter} />
        );
    }
    
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a8fe7'
  },
  swiper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a8fe7',
  },
  deckCard: {
    flex: 1,
    alignItems: 'center',
    borderBottomColor: '#003665',
    borderBottomWidth: 3,
  },
  deckTitle:{
    fontFamily: 'Museo 700',
    fontSize: 35,
    margin: 25,
    color: '#00336c'
  },
  deckSubTitle:{
    fontFamily: 'Museo Sans_500',
    fontSize: 25,
    color: '#00336c'
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
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#2a8fe7',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 3,

  },
  deckButtonText:{
    fontFamily: 'Museo Sans Rounded_500',
    fontSize: 18,
    color: '#ffffff',
  }
});

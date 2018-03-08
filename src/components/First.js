import React, { Component } from 'react';
import {
   StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  AsyncStorage,
  BackHandler
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Card } from 'react-native-elements'; // 0.18.5
import Icon from 'react-native-vector-icons/Foundation';
import IconEn from 'react-native-vector-icons/Entypo';

import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;
import axios from 'axios';

var box_count = 3;
var box_height = height / box_count;
var progress_val = [0,0,0,0,0,0,0,0,0,0,0,0]; //To be retrieved from database
var chap_info = [];
var chap_name = ['Basic I','Classic I','Crux Link','Classic II','Self Mode','Ace Ally','Crackerjack','Sum Poll'];
var chap_image = ['../../icons/1.png','../../icons/2.png','../../icons/3.png','../../icons/4.png','../../icons/5.png','../../icons/6.png','../../icons/7.png','../../icons/8.png'];
var chap_status = [1,1,0,0,0,0,0,0,0,0,0,0]; //To be retrieved from database
// var username = null;

export default class First extends Component {


async get(){
  username = await AsyncStorage.getItem('username');
  console.log("in courses.js , name: "+username)
  // alert(username);
  this.setState({username:username});
  console.log("state: "+this.state.username)
}

  constructor(props) {
        super(props);
        this.state = {
          status: 0,
          progress_val: progress_val,
          prev_chap:'',
          username:'',
      };
  };

  componentDidMount() {
    this.get();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () =>{
    Actions.courses();
    return true;
  }

  open_chapter = (i) =>{

    var found = 0;

    if(i==1||i==2){
      Actions.lesson({Chapter:i});
    }

    else{
      for(var j in chap_info){
      
        if(chap_info[j].chapter == i-1){
          found = 1;
          if(chap_info[j].test == 0 || chap_info[j].test == 2){
            alert("Please complete previous chapter(s)");
          }
  
          else{
            Actions.lesson({Chapter:i});
          }
        }
  
      }

      if(found==0){
        alert("Please complete previous chapter(s)");
      }
    }
  }

  render() {

    axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/get_progress.php', {
            params: {
              name: this.state.username
            },
            dataType: 'json'
          })
          .then(function (response) {
            // console.log("\n\n SUCCESS \n\n");
            // console.log(response.data);
            // console.log(response.data[0].chapter);
            
            for(var i=0;i<response.data.length;i++){
              obj = {
                chapter:response.data[i].chapter,
                test:response.data[i].test
              }

              chap_info.push(obj);
            }

            for(var i=0;i<response.data.length;i++){
            if (response.data[i].test == 1) 
            {
              chap_status[i] = 2;
              chap_status[i+1] = 1;
            }
            else
            {
              if (i==0||i==1) 
              {
                chap_status[i] = 1
              }
              else
              {
                if (response.data[i-1].test==1) 
                {
                  chap_status[i] = 1
                }
                else
                {
                  chap_status[i] = 0
                }
              }
            }
          }
          console.log("chap status: "+chap_status);

            var index;
            var sum = 0;
            var sum1 = 0;
            for (var i = 0; i < 12; i++) {
              sum = sum + progress_val[i];
            }
            // console.log("Response length: " + response.data.length);
            for (var i = 0; i < response.data.length; i++) {
              index = response.data[i].chapter-1;
              // console.log("index:" + index);
              // console.log(response.data[i].topic.length/4);
              progress_val[index] = response.data[i].topic.length/4;
              sum1 = sum1 + progress_val[index];
            }
            // console.log(progress_val);
            // console.log("sum "+sum);
            // console.log("sum1 "+sum1);
            if (sum!=sum1) 
            {
              this.setState({progress_val:progress_val});
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });


  var Images = [
      require('../../icons/1.png'),
      require('../../icons/2.png'),
      require('../../icons/3.png'),
      require('../../icons/4.png'),
      require('../../icons/5.png'),
      require('../../icons/6.png'),
      require('../../icons/7.png'),
      require('../../icons/8.png'),
  ];

    console.log("rendered");

    var chapters = [];

    for(let i=1;i<=8;i++){
      chapters.push(
        <View key={i} style={styles.card}>
        <Card>
          <TouchableOpacity  onPress={() => this.open_chapter(i) }>
         <View style={[styles.box,styles.box1]}>
             <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Image
<<<<<<< HEAD
                  source={require('../../icons/1.png')}
=======
                  source={Images[i-1]}  
>>>>>>> 201d465d1b09c97c1975b0b7779a8e56840036bd
                  style={{width: 70, height: 70}}
                />
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
            <Text style={styles.welcome}>
              {chap_name[i-1]}
            </Text>
           </View>
           <View style={{margin:15}}>
             <Progress.Bar progress={this.state.progress_val[i-1]} width={110} height={8} unfilledColor={'rgba(223,220,220,1)'} color={'rgba(133,6,63,0.8)'}/>
           </View>
            
           
            </View>
            {chap_status[i-1]==2 && <View>
             <Icon name="checkbox" size={30} color="#F0C71B" />
            </View>}

            {chap_status[i-1]==1 && <View>
             <IconEn name="lock-open" size={22} color="#17b046" />
            </View>}

            {chap_status[i-1]==0 && <View>
             <IconEn name="lock" size={22} color="#85063f" />
            </View>}
        
        </View>
        
            <Text style={{fontSize:18,color:'#1c313a',  fontFamily: 'Museo 700',}}>TAP TO START</Text>
   
            </View>
             </TouchableOpacity>
        </Card>
      </View>
      );
    }
    
    var x = 0.5;
    return (
        
        <View style={styles.Layout}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {chapters}
          </ScrollView>
        </View>
   
      
    );
  }
}


const styles = StyleSheet.create({
  
  
  Layout: {
    flex:1,
    flexDirection: 'column',
  
    
  },
  box: {
   
    height: box_height
  },
  box1: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
     height: 128,
    width: 280,
  },
  box2: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
   box3: {
  
    borderRadius:10,
    margin:10,
     alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
     box4: {
     borderRadius:10,
    margin:10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 128,
    width: 280,
  },
  welcome: {
    fontSize: 24,
    textAlign: 'center',
    justifyContent:'center',
    color:'#002266',
    fontFamily: 'Museo 700',
  },
   card: {
   
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
       
    
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
 innerBox: {
    height: box_height
  },
  innerBox1: {
    margin:5
    
  },
 innerBox2: {
    margin:20,
    flexDirection:'column'
  },
  button: {
    margin: 10,
    height: Dimensions.get('window').height / 20,
    width: Dimensions.get('window').width / 4,
    alignItems: 'center',
    borderRadius:10
  },
    start:{
        marginTop:20,
        alignItems: 'center',
    }
});
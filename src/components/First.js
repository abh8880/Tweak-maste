import React, { Component } from 'react';
import {
   StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  AsyncStorage
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Card } from 'react-native-elements'; // 0.18.5

import {Actions} from 'react-native-router-flux';

const width = Dimensions.get('window').width;

const height = Dimensions.get('window').height;
import axios from 'axios';

var box_count = 3;
var box_height = height / box_count;
var progress_val = [0,0,0,0,0,0,0,0,0,0,0,0]; //To be retrieved from database
var chap_info = [];

export default class First extends Component {

  // async local_store(){
  //   try {
  //     const value = await AsyncStorage.getItem('username');
  //     if (value !== null){
  //       console.log(value);
  //     }
  //   } catch (error) {
  //     console.log("Error getting data");
  //   }
  // }
  
 static navigationOptions = {
    title: '⌘  Chapters',
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
        super(props);
        this.state = {
          status: 0,
          progress_val: progress_val,
          prev_chap:''
      };

      axios.get('http://ec2-13-127-75-64.ap-south-1.compute.amazonaws.com/get_progress.php', {
            params: {
              name: 'anto'
            },
            dataType: 'json'
          })
          .then(function (response) {
            console.log("\n\n SUCCESS \n\n");
            console.log(response.data);
            console.log(response.data[0].chapter);
            
            for(var i=0;i<response.data.length;i++){
              obj = {
                chapter:response.data[i].chapter,
                test:response.data[i].test
              }

              chap_info.push(obj);
            }

            var index;
            var sum = 0;
            var sum1 = 0;
            for (var i = 0; i < 12; i++) {
              sum = sum + progress_val[i];
            }
            console.log("Response length: " + response.data.length);
            for (var i = 0; i < response.data.length; i++) {
              index = response.data[i].chapter-1;
              console.log("index:" + index);
              console.log(response.data[i].topic.length/4);
              progress_val[index] = response.data[i].topic.length/4;
              sum1 = sum1 + progress_val[index];
            }
            console.log(progress_val);
            console.log("sum "+sum);
            console.log("sum1 "+sum1);
            if (sum!=sum1) 
            {
              this.setState({progress_val:progress_val});
            }
          }.bind(this))
          .catch(function (error) {
            console.log(error);
        });
  };

  open_chapter = (i) =>{

    console.log(this.state.prev_chap);
    console.log(i);

    //if(i<=this.state.prev_chap){
      Actions.lesson({Chapter:i});
    //}

    //else{
      //alert("Please complete previous chapter(s)");
    //}

    // var found = 0;

    // if(i==1){
    //   Actions.lesson({Chapter:i});
    // }

    // else{
    //   for(var j in chap_info){
      
    //     if(chap_info[j].chapter == i-1){
    //       found = 1;
    //       if(chap_info[j].test == 0 || chap_info[j].test == 2){
    //         alert("Please complete previous chapter(s)");
    //       }
  
    //       else{
    //         Actions.lesson({Chapter:i});
    //       }
    //     }
  
    //   }

    //   if(found==0){
    //     alert("Please complete previous chapter(s)");
    //   }
    // }
  }


  render() {
    console.log("rendered");

    var chapters = [];

    for(let i=1;i<=12;i++){
      chapters.push(
        <View style={styles.card}>
      
        <Card>
          <TouchableOpacity  onPress={() => this.open_chapter(i) }>
         <View style={[styles.box,styles.box1]}>
             <View style={styles.innerContainer}>
            <View style={[styles.innerBox, styles.innerBox1]}>
             <Image
                  source={require('../../assets/2.png')}  
                  style={{width: 70, height: 70}}
                />
            </View>
            <View style={[styles.innerBox, styles.innerBox2]}>
            <View>
            <Text style={styles.welcome}>
              {"Chapter "+i}
            </Text>
           </View>
           <View style={{margin:15}}>
             <Progress.Bar progress={this.state.progress_val[i-1]} width={110} height={8} color={'rgba(133,6,63,0.8)'}/>
           </View>
            
           
            </View>
            
            
        </View>
        
            <Text style={{fontWeight:'bold',fontSize:15}}>TAP TO START</Text>
   
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
    fontSize: 22,
    textAlign: 'center',
    justifyContent:'center',
    fontWeight: 'bold',
    color:'#002266',
   
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
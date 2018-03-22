import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Activity1 from './Activity1';
import Activity2 from './Activity2';
import Activity3 from './Activity3';
import Activity4 from './Activity4';
import Activity5 from './Activity5';
import Activity6 from './Activity6';
import Activity7 from './Activity7';
import Complete from './Complete';
//import Activity8 from './Activity8';
//import Activity10 from './Activity10';
import Test_result from './Test_result';

var count;
var over = [];
var repeat = [];
var correct;

export default class Select extends Component {

	constructor(props) {

	super(props);

	if(this.props.count == 0){
		count=0;
		over = [1,2,3,4,5,6,7];
		repeat = [];
		correct = 0;
	}

	count++;
	console.log("\n\ncount="+count+"\n\n");

	};
	
	load_activity = (i,chapter,topic,mode) =>{
		if (topic==-1) 
		{
			i = Math.floor(Math.random() * 3) + 3
			console.log("|||||||||||||||||||||||||||||||||||||||test"+i)
		}
		if(i==1){
			return(
				<View style={styles.container}>
					<Activity1 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		else if(i==2){
			return(
				<View style={styles.container}>
					<Activity2 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}


		else if(i==3){
			return(
				<View style={styles.container}>
					<Activity3 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		else if(i==4){
			return(
				<View style={styles.container}>
					<Activity4 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		else if(i==5){
			return(
				<View style={styles.container}>
					<Activity5 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		else if(i==6){
			return(
				<View style={styles.container}>
					<Activity6 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		else if(i==7){
			return(
				<View style={styles.container}>
					<Activity7 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
				</View>
			);
		}

		// else if(i==8){
		// 	return(
		// 		<View style={styles.container}>
		// 			<Activity8 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
		// 		</View>
		// 	);
		// }
		// else if(i==9){
		// 	return(
		// 		<View style={styles.container}>
		// 			<Activity10 topic={topic} chapter={chapter} wrong={mode} count={correct}/>
		// 		</View>
		// 	);
		// }
	};

	render(){

		if (count==1) 
		{
			correct = 0;
		}
		else
		{
			correct = correct + this.props.score;
		}
		
		console.log("..............................correct: "+correct);

		if(this.props.end != 0){
			var rem = this.props.end;
	
			var index = over.indexOf(rem);
	
			if (index > -1) {
				over.splice(index, 1);
			}
		}

		var m = repeat.indexOf(undefined);
	
		if ( m > -1) {
			repeat.splice(m, 1);
		}

		if(this.props.rem_rep != 0){
			var r = this.props.rem_rep;
	
			var ind = repeat.indexOf(r);
	
			if (ind > -1) {
				repeat.splice(ind, 1);
			}
		}

		if(this.props.repeat != 0){

			var found = repeat.indexOf(this.props.repeat);
			// console.log("found="+found);

			if(found == -1)
			repeat.push(this.props.repeat);
		}

		var len = over.length;
		// console.log("array_len="+len);
		var i = Math.floor(Math.random()*(len));
		// console.log("i="+i);

		// console.log("over[i]="+over[i]);
		
		var topic = this.props.topic;
		var chapter = this.props.chapter;

		// console.log("over="+over);
		// console.log("repeat="+repeat);
		var l = repeat.length;
		// console.log("array_len="+l);
		// console.log("\n\ntopic"+topic+"\n\n");
		// console.log("\n\count"+count+"\n\n");
		
		if (count == 2 && topic == -1) 
		{
			count=0;
			// console.log("\n\nfirst\n\n")
			return(
				<Test_result correct={correct} chapter={this.props.chapter}/>
			);
		}
		if(count<=12){
			// console.log("\n\nsecond\n\n")
			// console.log("over[i]="+over[i]);
			var element = this.load_activity(over[i], chapter, topic, 0);	
			return element;		
		}
		else if(repeat.length > 0){
			// console.log("\n\nthird\n\n")

			var j = Math.floor(Math.random()*(l));

			var el = this.load_activity(repeat[j], chapter, topic, 2);	
			return el;			
		}
		else{
			// console.log("\n\nfourth\n\n")
			count=0;

			return(
				<Complete topic={this.props.topic} chapter={this.props.chapter}/>
			);
		}
	}
}

const styles = StyleSheet.create({
  container: {
  	flex: 1
  }
});
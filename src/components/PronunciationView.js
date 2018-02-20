import React, { Component } from 'react';
import { View, Text, StyleSheet,ScrollView } from 'react-native';

const styles = StyleSheet.create({
    pronunciationView: {
        padding: 20,
		flex: 1, 
		flexDirection: 'column'
    },
	wordView: {
		flex: 2, 
		flexDirection: 'row',
        justifyContent: 'center',
	},
	element: {
		height: 25,
		alignItems: 'stretch',
		backgroundColor: '#72ccf9',
		color: 'white',
		padding: 4,
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5
	},
	score: {
		height: 25,
		alignItems: 'stretch',
		backgroundColor: '#72ccf9',
		color: 'white',
		padding: 4,
		borderTopRightRadius: 5,
		borderBottomRightRadius: 5
		
	}
	
});

export default class PronunciationView extends Component {
	constructor(props){

		super(props);
		this.state = {
			answer: this.props.answer
		}
	}

	getData() {
		return this.props.getPronunciationData();
	}

	getWordArray() {
		return this.props.getWords();
	}

	render() {
		let data = this.getData();
		let wordArray = this.getWordArray();
		/*
		wordArray = [
			["afdsfs", 21312],
			["affdgdgfdgdsfs", 21312],
			["afdsfs", 21312],
			["afdsfs", 21312],

		]*/
		console.log(wordArray);
		console.log("Rendering accuracy for "+ wordArray.length + " words");

		var wordListRendered = wordArray.map(function(name){
			dynamicStyle = name[1] < 0.5? {backgroundColor: 'red'} : {backgroundColor: 'green'};
			return (
			<View style={styles.wordView} key={name+Math.random()}>
				<Text style={[styles.element]}>{name[0]}</Text>
				<Text style={[styles.score, dynamicStyle]}>{(parseFloat(name[1])*100)+"%"}</Text>
			</View>
			);
        })


		let renderDiv = <Text>Your pronunciation accuracy will appear here as you speak. Press and hold the mic button to begin.</Text>;
		if(wordArray.length <= 1) {
			wordListRendered = renderDiv;
		}
		return (
            <ScrollView>
			<View style={styles.pronunciationView}>
				{wordListRendered}
			</View>
            </ScrollView>
		);
	}
}
import React, { Component } from 'react';
import { View, Text, StyleSheet  } from 'react-native';

const styles = StyleSheet.create({
    grammarView: {
        padding: 20
    },
	sentenceTextView: {
		backgroundColor: '#72ccf9',
		color: 'white',
		margin: 2,
		padding: 4,
		borderRadius:5
	}
});

export default class GrammarView extends Component {
	constructor(props){

		super(props);
		this.state = {
			grammar: this.props.grammar
		}
	}

	getData() {
		return this.props.getGrammarData();
	}
	getSentenceArray() {
		return this.props.getSentencesSpoken();
	}


	render() {
		let data = this.getData();
		let sentences = this.getSentenceArray();
		console.log(sentences);
		var sentenceListRendered = sentences.map(function(name){
			return <Text style={styles.sentenceTextView} key={name+Math.random()}>{name}.</Text>;
        })


		let renderDiv = <Text>Your grammar will be corrected here, if applicable, as you speak. Press and hold the mic button to begin.</Text>;
		if(sentences.length <= 1) {
			sentenceListRendered = renderDiv;
		}
		return (
			<View style={styles.grammarView}>
				{sentenceListRendered}
			</View>
		);
	}
}
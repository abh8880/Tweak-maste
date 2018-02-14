import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text,Dimensions, Button} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'

export default class File extends Component {

    // _download = () => {
    //     RNFetchBlob
    //     .config({
    //     // add this option that makes response data to be stored as a file,
    //     // this is much more performant.
    //     fileCache : true,
    //   })
    //   .fetch('GET', 'http://52.66.111.102/Transfer/image.png', {
    //     //some headers ..
    //   })
    //   .then((res) => {
    //     // the temp file path
    //     console.log('The file saved to ', res.path())
    //   })
    // };

    _download = () => {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
        .config({
        // response data will be saved to this path if it has access right.
        fileCache : true,
        appendExt : 'pdf',
        path : dirs.DownloadDir + '/cert.pdf'
        })
        .fetch('GET', 'http://bling-test.000webhostapp.com/upload/1515148910-Git & Github.pdf', {
        //some headers ..
        })
        .then((res) => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('The file saved to ', res.path())
        })
    };

    render(){

        return(
            <View style={styles.container}>

                <Button onPress={() => this._download()} title="Download">
                </Button>

            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical:200,
    }
});
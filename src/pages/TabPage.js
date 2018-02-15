import React, { Component } from 'react';
import {Scene} from 'react-native-router-flux';
import {Actions} from 'react-native-router-flux';
import Courses from './Courses';
import Speaking from './Speaking';


export default class TabPage extends Component<{}> {
  render() {
    return(
                const Scenes = Actions.create(
                  <Scene key='root' tabs={true}>
                    <Scene key='Courses' title='Courses' component={Courses} />
                    <Scene key='Speaking' title='Speaking' component={Speaking} />
                  </Scene>
                );
      )
  }
}

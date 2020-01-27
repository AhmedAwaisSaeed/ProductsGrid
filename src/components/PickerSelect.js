import React from 'react';
import {
  Button,
  Text,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Chevron } from 'react-native-shapes';

import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';



const sports = [
  {
    label: 'Sort By Price',
    value: 'price',
  },
  {
    label: 'Sort By Size',
    value: 'size',
  },
  {
    label: 'Sort By Id',
    value: 'id',
  },
  
 
  
];

export default class PickerSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
      
      favSport3: "Select Sort By",
      
    };

      
  }

 

  changeValue = async (val,index)=>{

    

    
    await this.setState({favSport3: val});

    var answer=this.state.favSport3;
    console.log("dropdwon value is=",answer);
    this.props.callback(val);
    

  }

  render() {
    const placeholder = {
        label: 'Sort By',
      // value: null,
        color: '#9A9A9A',
      // fontSize:15
    };

    return (
      
        <View>

        <RNPickerSelect
           placeholder={placeholder}
          items={sports}
          onValueChange={(value,index) => {this.changeValue(value,index) }}
          style={{
              ...pickerSelectStyles,
            iconContainer: {
              top: 20,
              right: 15,
              
            },
          }}
          value={this.state.favSport3}
          useNativeAndroidPickerStyle={true}
          Icon={() => {
            return <Chevron size={1.5} color="#FFFF" />;
          }}
        />

       
</View>
       
    );
  }
}



const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    color: '#FFFF',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 15,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    borderWidth: 0.5,
     borderColor: 'white',
    borderRadius: 8,
     color: '#FFFF',
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingLeft:12
  },
});

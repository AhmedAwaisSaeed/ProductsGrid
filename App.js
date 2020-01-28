import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
} from 'react-native';

import MyTopBar from './src/components/MyTopBar';
import {base_url} from './src/components/AllVariables';
import PickerSelect from './src/components/PickerSelect';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      page: 1,
      isloading: false,
      dataFecthed: false,
      currentDate: undefined,
      currentMonth: undefined,
      currentyear: undefined,
      sorting: '',
      endOfProducts: false,
    };
  }

  componentDidMount() {
    console.log('in did mount......');

    this.setState({isloading: true}, this.get_data_from_api);
  }

  get_data_from_api = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    console.log(date + '-' + month + '-' + year);

    this.setState({
      currentDate: date,
      currentMonth: month,
      currentyear: year,
    });

    console.log('In get data');

    //  fetch(base_url+'products', {
    if (!this.state.sorting) {
      fetch(base_url + 'products?_page=' + this.state.page + '&_limit=15', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(async responseJson => {
          if (responseJson.length != 0) {
            console.log('Response is=', responseJson);
            await this.setState({
              allProducts: this.state.allProducts.concat(responseJson),
              dataFecthed: true,
              isloading: false,
            });

            this.checking_date();

            console.log('All Products is=', this.state.allProducts);
          } else {
            this.setState({
              isloading: false,
              endOfProducts: true,
            });

            console.log('end of products=', this.state.endOfProducts);
          }
        })
        .catch(error => {
          console.log('error is', error);
          console.error(error);
        });
    } else {
      console.log('...in else');

      fetch(
        base_url +
          'products?_sort=' +
          this.state.sorting +
          '&_page=' +
          this.state.page +
          '&_limit=15',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )
        .then(response => response.json())
        .then(async responseJson => {
          if (responseJson.length != 0) {
            console.log('Response is=', responseJson);
            await this.setState({
              allProducts: this.state.allProducts.concat(responseJson),
              dataFecthed: true,
              isloading: false,
            });

            this.checking_date();

            console.log('All Products is=', this.state.allProducts);
          } else {
            this.setState({
              isloading: false,
              endOfProducts: true,
            });
          }
        })
        .catch(error => {
          console.log('error is', error);
          console.error(error);
        });
    }
  };

  checking_date = () => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    for (let i = 0; i < this.state.allProducts.length; i++) {
      date = this.state.allProducts[i].date;

      let currentDate = this.state.currentDate;

      console.log('checking... date', date);

      let getMonth = date.slice(4, 7);
      let getDate = date.slice(8, 10);
      let getYear = date.slice(11, 15);
      let getTime = date.slice(16, 24);

      console.log('Month is=', getMonth);
      console.log('Date is=', getDate);
      console.log('Year is=', getYear);

      monthNames.find((monthName, index) => {
        if (monthName == getMonth) {
          console.log('index is=', index);
          getMonth = index + 1;
        }
      });

      if (getYear == this.state.currentyear) {
        if (getMonth == this.state.currentMonth) {
          if (currentDate - getDate < 7) {
            let ago = this.state.currentDate - getDate;
            console.log('days Ago:', ago);
            if (currentDate - getDate == 0) {
              this.setState(prevState => {
                let product = Object.assign({}, prevState.allProducts);
                product[i].date = ' Today ' + getTime;
                return {product};
              });
            } else {
              this.setState(prevState => {
                let product = Object.assign({}, prevState.allProducts);
                product[i].date = ago + ' Days Ago ' + getTime;
                return {product};
              });
            }
          }
        }
      }
    }

    console.log('final array is=', this.state.allProducts);
  };

  on_end_load_more = () => {
    console.log('end reached');

    this.setState({
      page: this.state.page + 1,
      isloading: true,
    });
    this.get_data_from_api();
  };

  renderFooter = () => {
    return (
      <View>
        {this.state.isloading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#0000ff"></ActivityIndicator>
          </View>
        ) : null}
        {this.state.endOfProducts && this.state.isloading == false && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2%',
            }}>
            <Text style={{fontSize: 18, color: '#FFFF'}}>
              ~ end of catalogue ~
            </Text>
          </View>
        )}
      </View>
    );
  };

  picker_selected_value = value => {
    console.log('picker selected value is=', value);
    this.setState({
      sorting: value,
    });
    this.setState({
      page: 1,
      allProducts: [],
    });
    this.get_data_from_api();
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="orange" barStyle="dark-content" />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.topBarView}>
            <MyTopBar
              screenText="All Products"
              // showLeftIcon={true}
              idComponent={this.props.componentId}></MyTopBar>
          </View>
          <View style={styles.topBarLine}></View>

          <View style={styles.body}>
            <View style={styles.pcikerContainer}>
              <PickerSelect
                callback={this.picker_selected_value}></PickerSelect>
            </View>

            {this.state.dataFecthed == true && (
              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.allProducts}
                  ItemSeparatorComponent={this.FlatListItemSeparator}
                  numColumns={2}
                  renderItem={({item, index}) => (
                    <View style={styles.rowDataContainer}>
                      <TouchableOpacity style={styles.cardView}>
                        <View style={styles.contentView}>
                          <Text style={{fontSize: item.size}}>{item.face}</Text>
                        </View>
                        <View style={styles.DescriptionView}>
                          <Text style={{textAlign: 'center', color: '#FFFF'}}>
                            ${item.price / 100}
                          </Text>
                        </View>

                        <View style={styles.DescriptionView}>
                          <Text style={{textAlign: 'center', color: '#FFFF'}}>
                            {item.date}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                  // extraData={this.state}
                  onEndReached={this.on_end_load_more}
                  onEndReachedThreshold={0}
                  ListFooterComponent={this.renderFooter}
                  keyExtractor={(item, index) => String(index)}></FlatList>
              </View>
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  topBarView: {
    height: '5%',
    width: '100%',
  },
  topBarLine: {
    // flex:1,
    borderWidth: 0.5,
    borderColor: '#AAB0BC',
    // marginTop:10
  },
  body: {
    height: '95%',
    backgroundColor: '#135CC5',
  },
  cardView: {
    shadowColor: '#3E5884',
    shadowOffset: {width: 1, height: 1},
    // height ho ge to top or bottom me bhi ho ga. Width right or left
    shadowOpacity: 0.8,
    //  kitni opacity rakhni ha
    elevation: 1,
    shadowRadius: 2,

    // borderWidth:1,
    flex: 1,
    height: 300,
    // width:"100%",
    margin: 20,
    // backgroundColor:"#3E5884",
    backgroundColor: '#061993',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowDataContainer: {
    flex: 1,
    // height:200,
    flexDirection: 'row',
    backgroundColor: '#135CC5',

    justifyContent: 'space-between',
    //  margin:10
  },

  contentView: {
    backgroundColor: '#FFFF',
    // flex:1,
    //  width:"70%%",
    //  height:"70%",
    //  borderWidth:1,
    // borderRadius:hp('35%'),
    //  flex:0.5,
    // width:50,
    // height:50,
    // borderRadius:50,
    // flex:0.5,
    // height:"100%",
    // width:"100%",
    // justifyContent:"center",
    // alignItems:"center"
  },
  DescriptionView: {
    //  flex:0.5,
    margin: 5,
    // alignItems:"center",
    // justifyContent:"center"
  },
  loading: {
    marginTop: 10,
    alignItems: 'center',
  },
  pcikerContainer: {
    height: '10%',
    backgroundColor: '#061993',
    justifyContent: 'center',
    paddingLeft: '5%',
    paddingRight: '5%',
    //  marginLeft:"5%",
    //  marginRight:"5%"
    // alignItems:"center"
  },
});

export default App;

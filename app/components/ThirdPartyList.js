import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  ListView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

export default class ThirdPartyList extends Component {

  constructor(props) {
    super(props);

    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[sectionID + ':' + rowID];

    this.state = {
      loaded: false,
      dataSource: new ListView.DataSource({
        getSectionData: getSectionData,
        getRowData: getRowData,
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };
    this.fetchData = this.fetchData.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  fetchData() {
    fetch(this.props.apiUrl).then((response) => response.json()).then((responseData) => {

      let organizations = responseData.results;
      let length = organizations.length;
      let dataBlob = {};
      let sectionIDs = [];
      let rowIDs = [];
      let organization, services, service;

      for (let i = 0; i < length; i++) {
        organization = organizations[i];

        sectionIDs.push(organization.university);
        dataBlob[organization.university] = organization.university;

        services = organization.services;
        rowIDs[i] = [];

        for (let j = 0; j < services.length; j++) {
          service = services[j].service;
          rowIDs[i].push(service.name);
          dataBlob[organization.university + ':' + service.name] = service;
        }
      }

      this.setState({
        dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
        loaded     : true
      });

    }).done();
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={() => { this.props.onPressRow(rowData, sectionID); }}>
        <View style={styles.rowStyle}>
          <Text style={styles.rowText}>{rowData.name}</Text>
          <Text style={styles.rowTextDesc}>{rowData.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>{sectionData}</Text>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={!this.state.loaded}
          style={[styles.activityIndicator, { height: 70 }]}
          size="small"
        />
      </View>
    );
  }

  renderListView() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource ={this.state.dataSource}
          style      ={styles.listview}
          renderRow  ={this.renderRow}
          renderSectionHeader ={this.renderSectionHeader}
        />
      </View>
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return this.renderListView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5',
    flexDirection: 'column',
    paddingTop: 25
  },
  text: {
    color: '#6C7581',
    paddingHorizontal: 8,
    fontSize: 14,
  },
  rowStyle: {
    height: 95,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#E0E0E0',
    borderWidth: 1
  },
  rowText: {
    color: '#212121',
    fontSize: 18,
    fontWeight: '500',
  },
  rowTextDesc: {
    marginTop: 4,
    color: '#666666',
    fontSize: 14,
    lineHeight: 18,
  },
  subText: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#edeef0',
  },
});
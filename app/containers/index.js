import { Navigation } from 'react-native-navigation';

import StoredTimeTable from './StoredTimeTable';
import AddCourseContainer from './AddCourseContainer';
import ImporterContainer from './ImporterContainer';
import WebviewContainer from './WebviewContainer';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('StoredTimeTable', () => StoredTimeTable, store, Provider);
  Navigation.registerComponent('AddCourseContainer', () => AddCourseContainer, store, Provider);
  Navigation.registerComponent('ImporterContainer', () => ImporterContainer, store, Provider);
  Navigation.registerComponent('WebviewContainer', () => WebviewContainer, store, Provider);
}

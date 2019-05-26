import { AppStoreState } from '@src/store/store';
import { Store } from 'redux';

declare module 'react-redux' {
  import 'react-redux';

  const shallowEqual = any;
  const useDispatch = () => (action: AnyAction) => any;

  // type useSelector = (extractor: (state: AppStoreState) => any) => any;
  const useSelector: <T>(extractor: (state: AppStoreState) => T, any?) => T;
  const useStore = () => Store;
}

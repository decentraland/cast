import { connect } from 'react-redux'
import { getAddress, isConnecting } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { isLoggingIn } from '../../../modules/identity/selector'
import { RootState } from '../../../modules/reducer'
import withRouter from '../../../utils/WithRouter'
import MainPage from './Connect'
import { MapStateProps } from './Connect.types'

const mapStateToProps = (state: RootState): MapStateProps => {
  return {
    isLoading: false && (isLoggingIn(state) || isConnecting(state)),
    loggedInAddress: getAddress(state)?.toLowerCase() || '0xdde050DF78150f103AdE05Fab55CDE2372C5b7Db'
  }
}

export default withRouter(connect(mapStateToProps)(MainPage))

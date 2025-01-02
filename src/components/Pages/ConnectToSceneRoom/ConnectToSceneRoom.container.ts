import { connect } from 'react-redux'
import { setServer, setToken, setSceneRelatedInformation } from '../../../modules/conference/action'
import { config } from '../../../modules/config'
import { getCurrentIdentity } from '../../../modules/identity/selector'
import { RootState } from '../../../modules/reducer'
import { getPreviouslyLoadedScenes } from '../../../utils/scenes'
import withRouter from '../../../utils/WithRouter'
import MainPage from './ConnectToSceneRoom'
import { MapDispatch, MapDispatchProps, MapStateProps, OwnProps } from './ConnectToSceneRoom.types'

const mapStateToProps = (state: RootState, ownProps: OwnProps): MapStateProps => {
  const identity = getCurrentIdentity(state)
  return {
    previouslyLoadedScenes: getPreviouslyLoadedScenes(),
    catalystServerUrl: new URLSearchParams(ownProps.router.location.search).get('catalyst-server-url') || config.get('CATALYST_SERVER_URL'),
    placesApiUrl: new URLSearchParams(ownProps.router.location.search).get('places-api-url') || config.get('PLACES_API_URL'),
    commsGatekeeperUrl:
      new URLSearchParams(ownProps.router.location.search).get('comms-gatekeeper-url') || config.get('COMMS_GATEKEEPER_URL'),
    identity
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onSubmitConnectForm: (
    server: string,
    token: string,
    catalystServerUrl: string,
    selectedScene: string,
    sceneBasePosition: { x: number; y: number },
    entityId: string
  ) => {
    dispatch(setServer({ server }))
    dispatch(setToken({ token }))
    dispatch(setSceneRelatedInformation({ basePosition: sceneBasePosition, name: selectedScene, entityId, catalystServerUrl }))
  }
})

export default withRouter(connect(mapStateToProps, mapDispatch)(MainPage))

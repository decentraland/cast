import { Dispatch } from 'redux'
import { AuthIdentity } from '@dcl/crypto'
import { RouterProps } from '../../../utils/WithRouter'

export type Props = {
  previouslyLoadedScenes: string[] | null
  identity: AuthIdentity | null
  placesApiUrl: string
  catalystServerUrl: string
  commsGatekeeperUrl: string
  onSubmitConnectForm: (
    server: string,
    token: string,
    catalystServerUrl: string,
    selectedScene: string,
    sceneBasePosition: { x: number; y: number },
    entityId: string
  ) => void
}

export type MapStateProps = Pick<Props, 'previouslyLoadedScenes' | 'identity' | 'catalystServerUrl' | 'placesApiUrl' | 'commsGatekeeperUrl'>
export type MapDispatchProps = Pick<Props, 'onSubmitConnectForm'>
export type MapDispatch = Dispatch

type Params = Record<string, never>
export type OwnProps = {
  router: RouterProps<Params>
}

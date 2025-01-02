import { Dispatch } from 'redux'

export type Props = {
  loggedInAddress?: string
  isLoading: boolean
  server?: string
  token?: string
  worldContentServerUrl: string
  worldName: string
  sceneName: string
  sceneBasePosition: { x: number; y: number }
}

export type MapStateProps = Pick<
  Props,
  'loggedInAddress' | 'isLoading' | 'server' | 'token' | 'worldName' | 'worldContentServerUrl' | 'sceneName' | 'sceneBasePosition'
>
export type MapDispatch = Dispatch

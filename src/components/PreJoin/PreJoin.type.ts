import { PreJoinProps as BasePreJoinProps } from '@livekit/components-react'

/** @public */
export type LocalUserChoices = {
  username: string
  videoEnabled: boolean
  audioEnabled: boolean
  videoDeviceId: string
  audioDeviceId: string
}

export const DEFAULT_USER_CHOICES = {
  username: '',
  videoEnabled: false,
  audioEnabled: false,
  videoDeviceId: 'default',
  audioDeviceId: 'default'
}

/** @public */
export type PreJoinProps = BasePreJoinProps & {
  hideUsername?: boolean
}

import React, { useCallback, useEffect } from 'react'
import { LiveKitRoom } from '@livekit/components-react'
import '@livekit/components-styles'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Events } from '../../../modules/analytics/types'
import { VideoConference } from '../../VideoConference/'
import { Props } from './Conference.types'
import './Conference.css'

export default function Conference(props: Props) {
  const { token, server, worldName, worldContentServerUrl } = props
  const analytics = getAnalytics()

  const handleConnect = useCallback(() => {
    analytics.track(Events.CONNECT_MEETING, {
      server,
      token,
      worldName,
      worldContentServerUrl
    })
  }, [])

  const handleDisconnect = useCallback(() => {
    analytics.track(Events.DISCONNECT_MEETING, {
      server,
      token,
      worldName,
      worldContentServerUrl
    })
  }, [server, token])

  useEffect(() => {
    window.onbeforeunload = () => {
      handleDisconnect()
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [])

  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={server}
        connect={true}
        data-lk-theme="default"
        onConnected={handleConnect}
        onDisconnected={handleDisconnect}
      >
        <VideoConference />
      </LiveKitRoom>
    </>
  )
}

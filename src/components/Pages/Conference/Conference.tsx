import React, { useCallback, useEffect } from 'react'
import { LiveKitRoom } from '@livekit/components-react'
import '@livekit/components-styles'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { Events } from '../../../modules/analytics/types'
import { VideoConference } from '../../VideoConference/'
import { Props } from './Conference.types'
import './Conference.css'

const msToMinutes = (ms: number) => Math.round(ms / (60 * 1000))

export default function Conference(props: Props) {
  const { token, server, loggedInAddress, worldName, worldContentServerUrl } = props
  const [connectedTime, setConnectedTime] = React.useState<Date>(new Date())

  const handleUserLeavingMeeting = useCallback(() => {
    const disconnectedTime = new Date()

    const analytics = getAnalytics()
    analytics.track(Events.USER_LEAVES_MEETING, {
      connectedTime,
      disconnectedTime,
      server,
      token,
      worldName,
      worldContentServerUrl,
      loggedInAddress,
      minutesInMeeting: msToMinutes(disconnectedTime.getTime() - connectedTime.getTime()) // Seems redundant, we already have the connected and disconnected time
    })
  }, [connectedTime, server, token, loggedInAddress])

  const handleConnect = useCallback(() => {
    setConnectedTime(new Date())
  }, [])

  useEffect(() => {
    window.onbeforeunload = () => {
      handleUserLeavingMeeting()
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
        onDisconnected={handleUserLeavingMeeting}
      >
        <VideoConference />
      </LiveKitRoom>
    </>
  )
}

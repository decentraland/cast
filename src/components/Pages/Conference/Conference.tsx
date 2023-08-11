import React, { useMemo, useState } from 'react'
import { LiveKitRoom, LocalUserChoices } from '@livekit/components-react'
import '@livekit/components-styles'
import { RoomOptions } from 'livekit-client'
import { PageLayout } from '../../PageLayout'
import { PreJoin } from '../../PreJoin'
import { VideoConference } from '../../VideoConference/'
import { Props } from './Conference.types'
import './Conference.css'
import styles from './Conference.module.css'

export default function Conference(props: Props) {
  const { token, server } = props
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | undefined>(undefined)

  const roomOptions = useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: preJoinChoices?.videoDeviceId ?? undefined
      },
      audioCaptureDefaults: {
        deviceId: preJoinChoices?.audioDeviceId ?? undefined
      }
    }
  }, [preJoinChoices])

  return (
    <>
      {!preJoinChoices ? (
        <PageLayout>
          <main data-lk-theme="default">
            <div className={styles.preJoinContainer}>
              <PreJoin
                onError={err => console.error('Error while setting up the pre-join configurations', err)}
                defaults={{
                  videoEnabled: false,
                  audioEnabled: false
                }}
                onValidate={() => true}
                onSubmit={values => {
                  setPreJoinChoices(values)
                }}
                hideUsername
              />
            </div>
          </main>
        </PageLayout>
      ) : (
        <LiveKitRoom
          token={token}
          serverUrl={server}
          connect={true}
          options={roomOptions}
          video={preJoinChoices?.videoEnabled}
          audio={preJoinChoices?.audioEnabled}
          data-lk-theme="default"
        >
          <VideoConference />
        </LiveKitRoom>
      )}
    </>
  )
}

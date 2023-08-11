import React, { useEffect, useMemo, useRef, useCallback, useState, FormEvent } from 'react'
import { log } from '@livekit/components-core'
import { LocalUserChoices, MediaDeviceMenu, TrackToggle } from '@livekit/components-react'
import classNames from 'classnames'
import { facingModeFromLocalTrack, Track } from 'livekit-client'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button } from 'decentraland-ui'
import { usePreviewTracks } from '../../hooks/usePreviewTracks'
import { DEFAULT_USER_CHOICES, PreJoinProps } from './PreJoin.type'
import styles from './PreJoin.module.css'
import type { LocalAudioTrack, LocalVideoTrack } from 'livekit-client'

/**
 * The PreJoin prefab component is normally presented to the user before he enters a room.
 * This component allows the user to check and select the preferred media device (camera und microphone).
 * On submit the user decisions are returned, which can then be passed on to the LiveKitRoom so that the user enters the room with the correct media devices.
 *
 * @remarks
 * This component is independent from the LiveKitRoom component and don't has to be nested inside it.
 * Because it only access the local media tracks this component is self contained and works without connection to the LiveKit server.
 *
 * @example
 * ```tsx
 * <PreJoin />
 * ```
 * @public
 */
export function PreJoin({
  defaults = {},
  onValidate,
  onSubmit,
  onError,
  debug,
  hideUsername,
  joinLabel = t('conference.pre_join.join_room'),
  micLabel = t('conference.pre_join.microphone_label'),
  camLabel = t('conference.pre_join.camera_label'),
  userLabel = t('conference.pre_join.username_label'),
  ...htmlProps
}: PreJoinProps) {
  const [userChoices, setUserChoices] = useState(DEFAULT_USER_CHOICES)
  const [username, setUsername] = useState(defaults.username ?? DEFAULT_USER_CHOICES.username)
  const [videoEnabled, setVideoEnabled] = useState<boolean>(defaults.videoEnabled ?? DEFAULT_USER_CHOICES.videoEnabled)
  const initialVideoDeviceId = defaults.videoDeviceId ?? DEFAULT_USER_CHOICES.videoDeviceId
  const [videoDeviceId, setVideoDeviceId] = useState<string>(initialVideoDeviceId)
  const initialAudioDeviceId = defaults.audioDeviceId ?? DEFAULT_USER_CHOICES.audioDeviceId
  const [audioEnabled, setAudioEnabled] = useState<boolean>(defaults.audioEnabled ?? DEFAULT_USER_CHOICES.audioEnabled)
  const [audioDeviceId, setAudioDeviceId] = useState<string>(initialAudioDeviceId)

  const tracks = usePreviewTracks(
    {
      audio: audioEnabled ? { deviceId: initialAudioDeviceId } : false,
      video: videoEnabled ? { deviceId: initialVideoDeviceId } : false
    },
    onError
  )

  const videoEl = useRef(null)

  const videoTrack = useMemo(() => tracks?.filter(track => track.kind === Track.Kind.Video)[0] as LocalVideoTrack, [tracks])

  const facingMode = useMemo(() => {
    if (videoTrack) {
      const { facingMode } = facingModeFromLocalTrack(videoTrack)
      return facingMode
    } else {
      return 'undefined'
    }
  }, [videoTrack])

  const audioTrack = useMemo(() => tracks?.filter(track => track.kind === Track.Kind.Audio)[0] as LocalAudioTrack, [tracks])

  useEffect(() => {
    if (videoEl.current && videoTrack) {
      videoTrack.unmute()
      videoTrack.attach(videoEl.current)
    }

    return () => {
      videoTrack?.detach()
    }
  }, [videoTrack])

  const [isValid, setIsValid] = useState<boolean>()

  const handleValidation = useCallback(
    (values: LocalUserChoices) => {
      if (typeof onValidate === 'function') {
        return onValidate(values)
      } else {
        return values.username !== ''
      }
    },
    [onValidate]
  )

  useEffect(() => {
    const newUserChoices = {
      username: username,
      videoEnabled: videoEnabled,
      videoDeviceId: videoDeviceId,
      audioEnabled: audioEnabled,
      audioDeviceId: audioDeviceId
    }
    setUserChoices(newUserChoices)
    setIsValid(handleValidation(newUserChoices))
  }, [username, videoEnabled, handleValidation, audioEnabled, audioDeviceId, videoDeviceId])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (handleValidation(userChoices)) {
      if (typeof onSubmit === 'function') {
        onSubmit(userChoices)
      }
    } else {
      log.warn('Validation failed with: ', userChoices)
    }
  }

  return (
    <div className={classNames(styles.PreJoin, 'lk-prejoin')} {...htmlProps}>
      <div className="lk-video-container">
        {videoTrack && <video ref={videoEl} width="1280" height="720" data-lk-facing-mode={facingMode} />}
        {!videoTrack && !videoEnabled && <div className="lk-camera-off-note">{t('conference.pre_join.camera_off')}</div>}
        {!videoTrack && videoEnabled && <div className="lk-camera-off-note">{t('conference.pre_join.camera_starting')}</div>}
      </div>
      <div className={classNames(styles.buttonGroupContainer, 'lk-button-group-container')}>
        <div className="lk-button-group audio">
          <TrackToggle initialState={audioEnabled} source={Track.Source.Microphone} onChange={enabled => setAudioEnabled(enabled)}>
            {micLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={audioDeviceId}
              kind="audioinput"
              disabled={!audioTrack}
              tracks={{ audioinput: audioTrack }}
              onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
            />
          </div>
        </div>
        <div className="lk-button-group video">
          <TrackToggle initialState={videoEnabled} source={Track.Source.Camera} onChange={enabled => setVideoEnabled(enabled)}>
            {camLabel}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              initialSelection={videoDeviceId}
              kind="videoinput"
              disabled={!videoTrack}
              tracks={{ videoinput: videoTrack }}
              onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
            />
          </div>
        </div>
      </div>

      <form className="lk-username-container">
        {!hideUsername && (
          <input
            className="lk-form-control"
            id="username"
            name="username"
            type="text"
            defaultValue={username}
            placeholder={userLabel}
            onChange={inputEl => setUsername(inputEl.target.value)}
            autoComplete="off"
          />
        )}
        <Button className="lk-button lk-join-button" primary onClick={handleSubmit} disabled={!isValid}>
          {joinLabel}
        </Button>
      </form>

      {debug && (
        <>
          <strong>User Choices:</strong>
          <ul className="lk-list" style={{ overflow: 'hidden', maxWidth: '15rem' }}>
            <li>Username: {`${userChoices.username}`}</li>
            <li>Video Enabled: {`${userChoices.videoEnabled}`}</li>
            <li>Audio Enabled: {`${userChoices.audioEnabled}`}</li>
            <li>Video Device: {`${userChoices.videoDeviceId}`}</li>
            <li>Audio Device: {`${userChoices.audioDeviceId}`}</li>
          </ul>
        </>
      )}
    </div>
  )
}

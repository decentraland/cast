import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthIdentity } from '@dcl/crypto'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, SelectField, Field, DropdownProps, Form } from 'decentraland-ui'
import meetOnDecentralandImg from '../../../assets/images/meet-on-decentraland.png'
import { signedFetch } from '../../../utils/auth'
import { DOCS_URL } from '../../../utils/constants'
import { isErrorMessage } from '../../../utils/errors'
import { flatFetch } from '../../../utils/flat-fetch'
import { addSceneToPreviouslyLoaded } from '../../../utils/scenes'
import { Props } from './ConnectToSceneRoom.types'
import styles from './ConnectToSceneRoom.module.css'

function ConnectToSceneRoom(props: Props) {
  const [selectedScene, setSelectedScene] = useState('')
  const [error, setError] = useState<string>('')
  const [availableScenes, setAvailableScenes] = useState<string[]>([])
  const [isConnectingToScene, setIsConnectingToScene] = useState(false)

  const { identity, previouslyLoadedScenes, catalystServerUrl, placesApiUrl, commsGatekeeperUrl, onSubmitConnectForm } = props

  const navigate = useNavigate()

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError('')
      setSelectedScene(e.target.value)
    },
    [setSelectedScene]
  )

  const handleSelectChange = useCallback(
    (_event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps) => {
      setError('')
      const newOption = value as string
      if (!availableScenes.includes(newOption)) setAvailableScenes([...availableScenes, newOption])
      setSelectedScene(newOption)
    },
    [availableScenes, setAvailableScenes, setSelectedScene]
  )

  async function getScene(sceneName: string) {
    const response = await flatFetch(`${placesApiUrl}/places?search=${sceneName}`, { responseBodyType: 'json' })
    console.log('getScene response', response)
    if (response.status === 200) {
      return response.json.data[response.json.data.length - 1]
    } else if (response.status === 404) {
      throw Error(`Scene ${sceneName} not found`)
    }
    throw Error('An error has occurred')
  }

  async function getSceneEntityId(scene: any) {
    const response = await flatFetch(`${catalystServerUrl}/content/entities/active`, {
      method: 'POST',
      body: JSON.stringify({ pointers: [scene.base_position] }),
      responseBodyType: 'json'
    })
    console.log('getSceneEntityId response', response)

    if (response.status === 200) {
      return response.json[0].id
    } else if (response.status === 404) {
      throw Error(`Entity with pointer ${scene.base_position} not found`)
    }

    throw Error('An error has occurred')
  }

  async function livekitConnect(identity: AuthIdentity, sceneEntityId: string) {
    const response = await signedFetch(
      `${commsGatekeeperUrl}/get-scene-adapter`,
      identity,
      {
        method: 'POST',
        responseBodyType: 'json'
      },
      {
        sceneId: sceneEntityId,
        realmName: 'decentraland'
      }
    )

    console.log('livekitConnect response', response)

    if (response.status === 200) {
      const { adapter } = response.json
      const sceneAdapterUrl = new URL(adapter)

      return {
        url: sceneAdapterUrl.pathname,
        token: sceneAdapterUrl.searchParams.get('access_token') || ''
      }
    } else {
      let message = ''
      try {
        message = JSON.parse(response.text || '')?.message
      } catch (e) {
        message = response.text || ''
      }
      throw Error(message)
    }

    // throw Error(`Failed to connect to LiveKit: ${JSON.stringify(response.text || response.json?.message)}`)
  }

  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setError('')
      setIsConnectingToScene(true)

      try {
        if (!identity) return

        const scene = await getScene(selectedScene)
        const sceneEntityId = await getSceneEntityId(scene)
        const response: { url: string; token: string } = await livekitConnect(identity, sceneEntityId)

        onSubmitConnectForm(response.url, response.token, catalystServerUrl, selectedScene, scene.base_position, sceneEntityId)
        addSceneToPreviouslyLoaded(selectedScene)
        navigate(`/meet/${encodeURIComponent(response.url)}?token=${encodeURIComponent(response.token)}`)
      } catch (error) {
        console.error('ERROR livekit connect', error)
        if (isErrorMessage(error)) setError(error.message)
      } finally {
        setIsConnectingToScene(false)
      }
    },
    [identity, selectedScene, onSubmitConnectForm]
  )

  const handleLearnMore = useCallback(() => {
    window.open(DOCS_URL, '_blank', 'noopener noreferrer')
  }, [])

  useEffect(() => {
    if (previouslyLoadedScenes) {
      setAvailableScenes(previouslyLoadedScenes)
      setSelectedScene(previouslyLoadedScenes[0])
    }
  }, [previouslyLoadedScenes, setAvailableScenes])

  return (
    <div className={styles.ConnectToSceneRoom}>
      <div className={styles.content}>
        <h4 className={styles.title}>{t('connect_to_scene_room.title')}</h4>
        <p className={styles.description}>{t('connect_to_scene_room.description')}</p>
        <img
          className={styles.img}
          src={meetOnDecentralandImg}
          alt={t('connect_to_scene_room.image_alt')}
          aria-label={t('connect_to_scene_room.image_alt')}
        />
        <Form className={styles.form}>
          <div className={styles.inputContainer}>
            <label className={styles.label} htmlFor="server">
              {t('connect_to_scene_room.input_label')}
            </label>
            {availableScenes.length > 0 ? (
              <SelectField
                value={selectedScene}
                options={availableScenes.map(server => ({
                  value: server,
                  text: server
                }))}
                onAddItem={handleSelectChange}
                onChange={handleSelectChange}
                allowAdditions
                error={!!error}
                message={error}
              />
            ) : (
              <Field
                name="server"
                value={selectedScene}
                onChange={handleChange}
                placeholder={t('connect_to_scene_room.input_placeholder')}
                error={!!error}
                message={error}
                onEnter={handleClick}
              />
            )}
          </div>
          <div className={styles.actions}>
            <Button
              primary
              onClick={handleClick}
              fluid
              disabled={!selectedScene || isConnectingToScene}
              type="submit"
              loading={isConnectingToScene}
            >
              {t('connect_to_scene_room.cta')}
            </Button>
            <Button inverted fluid onClick={handleLearnMore}>
              {t('global.learn_more')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default ConnectToSceneRoom

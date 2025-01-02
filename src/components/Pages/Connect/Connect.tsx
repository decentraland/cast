import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from 'decentraland-ui'
import { locations } from '../../../modules/routing/locations'
import { PageLayout } from '../../PageLayout'
import ConnectToSceneRoom from '../ConnectToSceneRoom'
import ConnectToWorld from '../ConnectToWorld'
import { Props } from './Connect.types'
import styles from './Connect.module.css'

function Connect(props: Props) {
  const { isLoading, loggedInAddress } = props

  const navigate = useNavigate()

  useEffect(() => {
    if (!loggedInAddress && !isLoading) {
      navigate(locations.signIn(locations.root()))
    }
  }, [isLoading, loggedInAddress])

  return (
    <PageLayout>
      {isLoading ? (
        <Loader active />
      ) : (
        <div className={styles.Connect}>
          <ConnectToWorld />
          <ConnectToSceneRoom />
        </div>
      )}
    </PageLayout>
  )
}

export default Connect

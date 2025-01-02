import { createReducer } from '@reduxjs/toolkit'
import { setServer, setToken, setWorldRelatedInformation, setSceneRelatedInformation } from './action'

export type ConferenceState = {
  token: string
  server: string
  worlds: {
    contentServerUrl: string
    name: string
  }
  scenes: {
    name: string
    basePosition: { x: number; y: number }
    entityId: string
    catalystServerUrl: string
  }
}

export const INITIAL_STATE: ConferenceState = {
  token: '',
  server: '',
  worlds: {
    contentServerUrl: '',
    name: ''
  },
  scenes: {
    name: '',
    basePosition: { x: 0, y: 0 },
    entityId: '',
    catalystServerUrl: ''
  }
}

export const conferenceReducer = createReducer<ConferenceState>(INITIAL_STATE, builder =>
  builder
    .addCase(setServer, (state, action) => {
      state.server = action.payload.server
    })
    .addCase(setToken, (state, action) => {
      state.token = action.payload.token
    })
    .addCase(setWorldRelatedInformation, (state, action) => {
      const { contentServerUrl, name } = action.payload

      state.worlds = {
        contentServerUrl,
        name
      }
    })
    .addCase(setSceneRelatedInformation, (state, action) => {
      const { basePosition, name, entityId, catalystServerUrl } = action.payload

      state.scenes = {
        basePosition,
        name,
        entityId,
        catalystServerUrl
      }
    })
)

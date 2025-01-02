import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../reducer'

const getState = (state: RootState) => state.conference

export const getToken = (state: RootState) => getState(state).token
export const getServer = (state: RootState) => getState(state).server

const getWorlds = (state: RootState) => getState(state).worlds
export const getWorldName = (state: RootState) => getWorlds(state).name
export const getWorldContentServerUrl = (state: RootState) => getWorlds(state).contentServerUrl

const getScenes = (state: RootState) => getState(state).scenes
export const getSceneName = (state: RootState) => getScenes(state).name
export const getSceneBasePosition = (state: RootState) => getScenes(state).basePosition
export const getSceneEntityId = (state: RootState) => getScenes(state).entityId
export const getCatalystServerUrl = (state: RootState) => getScenes(state).catalystServerUrl

export const isLoading = createSelector([getToken], token => !!token)

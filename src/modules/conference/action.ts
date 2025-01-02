import { createAction } from '@reduxjs/toolkit'

export const setServer = createAction<{ server: string }>('Set Server')
export type SetServerAction = ReturnType<typeof setServer>

export const setToken = createAction<{ token: string }>('Set Token')
export type SetTokenAction = ReturnType<typeof setToken>

export const setWorldRelatedInformation = createAction<{ contentServerUrl: string; name: string }>('Set World Related Information')
export type SetWorldRelatedInformationAction = ReturnType<typeof setWorldRelatedInformation>

export const setSceneRelatedInformation = createAction<{
  basePosition: { x: number; y: number }
  name: string
  entityId: string
  catalystServerUrl: string
}>('Set Scene Related Information')
export type SetSceneRelatedInformationAction = ReturnType<typeof setSceneRelatedInformation>

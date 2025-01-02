export const PREVIOUSLY_LOADED_SCENES_KEY = 'previously-loaded-scenes'

export const getPreviouslyLoadedScenes = () =>
  Array.from(new Set(localStorage.getItem(PREVIOUSLY_LOADED_SCENES_KEY)?.split(',').filter(Boolean)))

export const addSceneToPreviouslyLoaded = (server: string) => {
  const previouslyLoadedScenes = getPreviouslyLoadedScenes() || []

  if (previouslyLoadedScenes.includes(server)) return

  previouslyLoadedScenes.push(server)
  localStorage.setItem(PREVIOUSLY_LOADED_SCENES_KEY, previouslyLoadedScenes.join(','))
}

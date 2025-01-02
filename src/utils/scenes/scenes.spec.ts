import { PREVIOUSLY_LOADED_SCENES_KEY, addSceneToPreviouslyLoaded, getPreviouslyLoadedScenes } from './scenes'

describe('when getting the previously loaded scenes from the local storage', () => {
  describe('and the key is not yet set', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null)
    })

    it('should return an empty array', () => {
      expect(getPreviouslyLoadedScenes()).toStrictEqual([])
    })
  })

  describe('and the value is empty', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce('')
    })

    it('should return an empty array', () => {
      expect(getPreviouslyLoadedScenes()).toStrictEqual([])
    })
  })

  describe('and the value has one previously loaded scene', () => {
    let previouslyLoadedScene: string

    beforeEach(() => {
      previouslyLoadedScene = 'previous-scene'
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(previouslyLoadedScene)
    })

    it('should return an array with the previously loaded scene', () => {
      expect(getPreviouslyLoadedScenes()).toStrictEqual([previouslyLoadedScene])
    })
  })

  describe('and the value has multiple previously loaded scene', () => {
    let previouslyLoadedScenes: string[]

    describe('and all the scenes are different', () => {
      beforeEach(() => {
        previouslyLoadedScenes = ['previous-scene', 'another-scene', 'and-another-scene']
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(previouslyLoadedScenes.join(','))
      })

      it('should return an array with all those different scenes', () => {
        expect(getPreviouslyLoadedScenes()).toStrictEqual(previouslyLoadedScenes)
      })
    })

    describe('and there are some duplicates in the local storage value', () => {
      beforeEach(() => {
        previouslyLoadedScenes = [
          'previous-scene',
          'another-scene',
          'another-scene',
          'and-another-scene',
          'and-another-scene',
          'and-another-scene'
        ]
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(previouslyLoadedScenes.join(','))
      })

      it('should return an array with only one occurrence of each scene', () => {
        expect(getPreviouslyLoadedScenes()).toStrictEqual(['previous-scene', 'another-scene', 'and-another-scene'])
      })
    })
  })
})

describe('when adding a new scene to the same key in the local storage', () => {
  let newScene: string

  beforeEach(() => {
    newScene = 'new-scene'
    jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(jest.fn())
  })

  describe('and the new scene is already in the array of previously loaded scenes', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce([newScene].join(','))
      addSceneToPreviouslyLoaded(newScene)
    })

    it('should not call the local storage set method to add the new scene', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(localStorage.setItem).not.toBeCalled()
    })
  })

  describe('and there was not previous loaded scenes in the local storage', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null)
      addSceneToPreviouslyLoaded(newScene)
    })

    it('should set in the local storage only the new scene', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(localStorage.setItem).toBeCalledWith(PREVIOUSLY_LOADED_SCENES_KEY, newScene)
    })
  })

  describe('and there were some previous loaded scenes in the local storage', () => {
    const previouslyLoadedScenes = ['previous-scene', 'another-scene', 'and-another-scene']

    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(previouslyLoadedScenes.join(','))
      addSceneToPreviouslyLoaded(newScene)
    })

    it('should set in the local storage only the new scene', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(localStorage.setItem).toBeCalledWith(PREVIOUSLY_LOADED_SCENES_KEY, [...previouslyLoadedScenes, newScene].join(','))
    })
  })
})

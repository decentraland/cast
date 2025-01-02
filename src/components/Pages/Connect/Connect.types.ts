export type Props = {
  loggedInAddress?: string
  isLoading: boolean
}

export type MapStateProps = Pick<Props, 'loggedInAddress' | 'isLoading'>

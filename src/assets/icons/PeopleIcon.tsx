import * as React from 'react'
import type { SVGProps } from 'react'

const PeopleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="25" viewBox="0 0 28 25" fill="none" {...props}>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.0003 11.1667C12.9417 11.1667 15.3337 8.77467 15.3337 5.83333C15.3337 2.892 12.9417 0.5 10.0003 0.5C7.05899 0.5 4.66699 2.892 4.66699 5.83333C4.66699 8.77467 7.05899 11.1667 10.0003 11.1667ZM20.667 13.8333C22.8723 13.8333 24.667 12.0387 24.667 9.83333C24.667 7.628 22.8723 5.83333 20.667 5.83333C18.4617 5.83333 16.667 7.628 16.667 9.83333C16.667 12.0387 18.4617 13.8333 20.667 13.8333ZM27.3337 21.8333C27.3337 22.5693 26.7377 23.1667 26.0003 23.1667H19.3337C19.3337 23.9027 18.7377 24.5 18.0003 24.5H2.00033C1.26299 24.5 0.666992 23.9027 0.666992 23.1667C0.666992 18.02 4.85499 13.8333 10.0003 13.8333C12.5697 13.8333 14.8977 14.8773 16.587 16.5613C17.7457 15.6653 19.1723 15.1667 20.667 15.1667C24.343 15.1667 27.3337 18.1573 27.3337 21.8333Z"
      fill={props.fill ?? 'white'}
    />
  </svg>
)

export default PeopleIcon

import React from 'react'
import { VFlex } from './Shared'

export default class LoadingIndicator extends React.Component {
  render() {
    return (
      <VFlex style={{ margin: 8, fontSize: 25, justifyContent: 'center' }}>
        <img src={require('../../static/bikeLoading.svg')} height="75" />
      </VFlex>
    )
  }
}

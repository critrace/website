import React from 'react'
import Colors from '../Colors'
import { inject, observer } from 'mobx-react'
import { VFlex, HFlex } from './Shared'

@inject()
@observer
export default class TabSelector extends React.Component<{
  tabs: { title: string; render: () => any }[]
  onIndexChange?: (activeIndex: number) => void
  style?: any
}> {
  state = {
    activeIndex: 0,
  }

  render() {
    return (
      <VFlex>
        <HFlex
          style={{
            borderTopRightRadius: 5,
            borderTopLeftRadius: 5,
            overflow: 'hidden',
            ...(this.props.style || {}),
          }}
        >
          {this.props.tabs.map((tab: { title: string }, index: number) => (
            <VFlex
              key={index}
              onClick={() => {
                this.setState({ activeIndex: index })
              }}
              style={{
                backgroundColor:
                  this.state.activeIndex === index ? Colors.white : Colors.blue,
                color:
                  this.state.activeIndex === index
                    ? Colors.black
                    : Colors.white,
                minWidth: 100,
                flex: 1,
                padding: 10,
                cursor: 'pointer',
              }}
            >
              {tab.title}
            </VFlex>
          ))}
        </HFlex>
        <HFlex>{this.props.tabs[this.state.activeIndex].render()}</HFlex>
      </VFlex>
    )
  }
}

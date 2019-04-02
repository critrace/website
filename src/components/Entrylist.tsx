import React from 'react'
import { inject, observer } from 'mobx-react'
import EventStore from '../stores/event'
import RaceStore, { Entry } from '../stores/race'
import styled from 'styled-components'
import { HFlex, VFlex, LargeText } from './Shared'
import Button from './Button'
import Colors from '../Colors'
import Popup from './Popup'
import RiderCreate from './RiderCreate'
import TabSelector from './TabSelector'
import EntryCreate from './EntryCreate'
import { TiTimes } from 'react-icons/ti'

const EntryCell = styled(HFlex)`
  min-height: 40px;
  border-bottom: solid 1px ${Colors.black};
  flex-wrap: nowrap;
  flex: 1;
  justify-content: space-between;
  min-width: 600px;
`

@inject('event', 'race')
@observer
class Entrylist extends React.Component<{
  seriesId: string
  raceId: string
  editable?: boolean
  event?: EventStore
  race?: RaceStore
}> {
  state = {
    createEntryVisible: false,
    exportingCSV: false,
  }
  componentDidMount() {
    this.props.race.loadEntries(this.props.raceId)
  }

  exportCSV = () => {
    this.setState({ exportingCSV: true })
    this.props.race
      .loadEntries(this.props.raceId)
      .then(() => {
        const entries = this.props.race.entriesByRaceId[this.props.raceId] || []
        const rows = entries.map((entry: Entry) =>
          [
            entry.rider.license,
            'ANN',
            entry.bib,
            entry.rider.transponder,
            entry.rider.firstname,
            entry.rider.lastname,
            entry.rider.team,
          ].join(', ')
        )
        const csvContent = `data:text/csv;charset=utf-8,${rows.join('\r\n')}`
        const link = document.createElement('a')
        link.setAttribute('href', csvContent)
        link.setAttribute('download', 'race_data.csv')
        document.body.appendChild(link) // Required for FF
        link.click()
        this.setState({ exportingCSV: false })
      })
      .catch(() => this.setState({ exportingCSV: false }))
  }

  render() {
    const race = this.props.race.racesById[this.props.raceId] || {}
    const entries = this.props.race.entriesByRaceId[this.props.raceId] || []
    const tabs = [
      {
        title: 'Find Rider',
        render: () => (
          <EntryCreate
            raceId={this.props.raceId}
            onFinished={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
      {
        title: 'Create Rider',
        render: () => (
          <RiderCreate
            seriesId={this.props.seriesId}
            raceId={this.props.raceId}
            onCreated={() => this.setState({ createEntryVisible: false })}
            onCancelled={() => this.setState({ createEntryVisible: false })}
          />
        ),
      },
    ]
    return (
      <>
        <Popup visible={this.state.createEntryVisible}>
          <TabSelector tabs={tabs} />
        </Popup>
        <EntryCell style={{ justifyContent: 'center' }}>
          <LargeText>
            {race.name} - {`${entries.length} entries`}
          </LargeText>
        </EntryCell>
        <EntryCell>
          <VFlex style={{ minWidth: '5%' }}>Bib #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>First Name</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Last Name</VFlex>
          <VFlex style={{ minWidth: '15%' }}>License #</VFlex>
          <VFlex style={{ minWidth: '15%' }}>Transponder</VFlex>
          {this.props.editable === false ? null : <VFlex style={{ flex: 1 }} />}
        </EntryCell>
        {entries.map((entry: Entry) =>
          !entry.rider ? null : (
            <EntryCell key={entry._id}>
              <VFlex style={{ minWidth: '5%' }}>
                {(entry.bib || {}).bibNumber}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>{entry.rider.firstname}</VFlex>
              <VFlex style={{ minWidth: '15%' }}>{entry.rider.lastname}</VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {entry.rider.license || 'One Day'}
              </VFlex>
              <VFlex style={{ minWidth: '15%' }}>
                {entry.rider.transponder || 'none'}
              </VFlex>
              {this.props.editable === false ? null : (
                <VFlex style={{ flex: 1 }}>
                  <Button
                    style={{ minWidth: 0, backgroundColor: Colors.pink }}
                    onClick={() => {
                      if (!confirm('Remove this entry?')) return
                      return this.props.race
                        .removeEntry(this.props.raceId, entry.riderId)
                        .then(() =>
                          this.props.race.loadEntries(this.props.raceId)
                        )
                    }}
                  >
                    <TiTimes size={25} color={Colors.white} />
                  </Button>
                </VFlex>
              )}
            </EntryCell>
          )
        )}
        <HFlex>
          <HFlex>
            <Button
              animating={this.state.exportingCSV}
              title="Export CSV"
              onClick={this.exportCSV}
            />
            <Button
              title="Delete Race"
              style={{ backgroundColor: Colors.pink }}
              onClick={() => {
                if (!confirm('Delete this race?')) return
                return this.props.race
                  .delete(this.props.raceId)
                  .then(() =>
                    Promise.all([
                      this.props.race.loadByEventId(race.eventId),
                      this.props.event.load(race.eventId),
                    ])
                  )
              }}
            />
          </HFlex>
          <Button
            title="Add Entry"
            style={{ backgroundColor: Colors.green }}
            onClick={() => {
              this.setState({ createEntryVisible: true })
            }}
          />
        </HFlex>
      </>
    )
  }
}

export default Entrylist

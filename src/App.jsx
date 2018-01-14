// @flow

import type { Feature } from './types';

import React, { Component } from 'react';

import Checklist from './Checklist';
import Requirements from './Requirements';
import Suggestions from './Suggestions';

type State = {
  browsers: Object,
  checklist: Array<Feature>,
  data: Array<Feature>,
  query: string,
};

class App extends Component<void, State> {
  state = {
    browsers: {},
    checklist: [],
    data: [],
    query: '',
  };

  async componentDidMount() {
    const resp = await fetch(
      'https://raw.githubusercontent.com/Fyrd/caniuse/master/data.json'
    );
    const caniuse = await resp.json();

    const data = Object.keys(caniuse.data).map(k => caniuse.data[k]);

    const browsers = caniuse.agents;

    this.setState({
      browsers,
      data,
    });
  }

  addFeatureToChecklist = (feature: Feature) => {
    if (this.state.checklist.includes(feature)) {
      alert('Already added');

      return;
    }

    this.setState({
      ...this.state,

      checklist: [...this.state.checklist, feature],
      query: '',
    });
  };

  removeFeatureFromChecklist = (feature: Feature) => {
    const idx = this.state.checklist.findIndex(x => x === feature);

    this.setState({
      ...this.state,

      checklist: [
        ...this.state.checklist.slice(0, idx),
        ...this.state.checklist.slice(idx + 1),
      ],
    });
  };

  updateQuery = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, query: e.currentTarget.value });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <input
            onInput={this.updateQuery}
            placeholder="Add features"
            type="text"
            value={this.state.query}
          />
        </div>

        <Suggestions
          addFeatureToChecklist={this.addFeatureToChecklist}
          data={this.state.data}
          query={this.state.query}
        />

        <Checklist
          checklist={this.state.checklist}
          removeFeatureFromChecklist={this.removeFeatureFromChecklist}
        />

        <hr />

        <Requirements
          browsers={this.state.browsers}
          checklist={this.state.checklist}
        />
      </div>
    );
  }
}

export default App;

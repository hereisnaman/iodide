/* global it describe expect */
import _ from 'lodash'
import { stringifyStateToJsmd } from './../src/jsmd-tools'

import { newNotebook, newCell } from '../src/state-prototypes'


// this can be defined once for all test cases
const lastExport = new Date().toISOString()

describe('jsmd stringifier test case 1', () => {
  const state = newNotebook()
  state.cells[0].content = 'foo'
  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "lastExport": "${lastExport}"
}

%% js
foo`
  it('simple state with default global setting should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 2', () => {
  const state = newNotebook()
  state.cells[0].content = 'foo'
  state.title = 'foo notebook'
  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "lastExport": "${lastExport}"
}

%% js
foo`
  it('simple state should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 3', () => {
  const state = newNotebook()
  state.title = 'foo notebook'
  state.viewMode = 'presentation'

  state.cells[0].content = 'foo'
  _.set(state, 'cells[0].rowSettings.REPORT.input', 'SCROLL')

  state.cells.push(newCell(state.cells, 'markdown'))
  state.cells[1].content = 'foo'

  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "viewMode": "presentation",
  "lastExport": "${lastExport}"
}

%% js {"rowSettings.REPORT.input":"SCROLL"}
foo

%% md
foo`
  it('cell settings should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})


describe('jsmd stringifier test case 4', () => {
  const state = newNotebook()
  state.title = 'foo notebook'

  state.cells[0].content = 'foo'
  _.set(state, 'cells[0].rowSettings.REPORT.output', 'VISIBLE')

  const cellTypes = ['markdown', 'external dependencies', 'raw']
  cellTypes.forEach((cellType, i) => {
    state.cells.push(newCell(state.cells, cellType))
    state.cells[i + 1].content = 'foo'
  })

  const jsmd = stringifyStateToJsmd(state, lastExport)
  const jsmdExpected = `%% meta
{
  "title": "foo notebook",
  "lastExport": "${lastExport}"
}

%% js {"rowSettings.REPORT.output":"VISIBLE"}
foo

%% md
foo

%% resource
foo

%% raw
foo`
  it('all cell types should serialize to jsmd correctly', () => {
    expect(jsmd).toEqual(jsmdExpected)
  })
})

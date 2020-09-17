import React from 'react'
import TestRenderer from 'react-test-renderer'
// import { render, cleanup } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

// The component AND the query need to be exported
import { GET_DOG_QUERY, Dog } from './dog'

const mocks = [
  {
    request: {
      query: GET_DOG_QUERY,
      variables: {
        name: 'Buck',
      },
    },
    result: () => {
      // do something, such as recording that this function has been called
      console.log('executed')
      return {
        data: {
          dog: { id: '1', name: 'John', breed: 'bulldog' },
        },
      }
    },
  },
]

it('renders without error', () => {
  TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>
  )
})

it('should render loading state initially', () => {
  const component = TestRenderer.create(
    <MockedProvider mocks={[]}>
      <Dog />
    </MockedProvider>
  )
  const tree = component.toJSON()
  expect(tree.children).toContain('Loading...')
})

it('should render dog', async () => {
  const dogMock = {
    request: {
      query: GET_DOG_QUERY,
      variables: { name: 'Buck' },
    },
    result: {
      data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
    },
  }

  const component = TestRenderer.create(
    <MockedProvider mocks={[dogMock]} addTypename={false}>
      <Dog name="Buck" />
    </MockedProvider>
  )

  await new Promise((resolve) => setTimeout(resolve, 0)) // wait for response

  const p = component.root.findByType('p')
  expect(p.children).toContain('Buck is a poodle')
})

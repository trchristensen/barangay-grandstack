import React from 'react'
import TestRenderer from 'react-test-renderer'
import { MockedProvider } from '@apollo/client/testing'

// The component AND the query need to be exported
import Feed, { GET_POSTS } from './Feed'

const mocks = [
  {
    request: {
      query: GET_POSTS,
      variables: {},
    },
    result: (res) => {
      // do something, such as recording that this function has been called
      console.log('result has been called', res)

      return {
        data: {
          posts: [
            {
              postId: '1',
              author: { name: 'Ashton Christensen' },
              content: 'This is a mock post',
              published: { formatted: '2020-09-17T05:12:38.947Z' },
            },
          ],
        },
      }
    },
  },
]

it('renders without error', () => {
  TestRenderer.create(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Feed />
    </MockedProvider>
  )
})

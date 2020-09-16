import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Paper, TextField, Button } from '@material-ui/core'
import moment from 'moment'

import { useQuery, gql, useMutation } from '@apollo/client'

import Title from './Title'

const styles = (theme) => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    margin: 'auto',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 700,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 300,
  },
})

const GET_POSTS = gql`
  query {
    Post {
      postId
      content
      published {
        formatted
      }
      author {
        name
        userId
      }
      comments {
        content
        commentId
        published {
          formatted
        }
      }
    }
  }
`

const CREATE_POST = gql`
  mutation createPost($content: String!, $published: _Neo4jDateTimeInput) {
    CreatePost(content: $content, published: $published) {
      postId
      content
      published {
        formatted
      }
    }
  }
`

const CREATE_POST_AUTHOR_REL = gql`
  mutation addPostAuthor($userId: ID!, $postId: ID!) {
    AddPostAuthor(to: { userId: $userId }, from: { postId: $postId }) {
      to {
        userId
        name
      }
      from {
        postId
        author {
          userId
          name
        }
      }
    }
  }
`

const Feed = (props) => {
  const { classes } = props

  const { loading, data, error } = useQuery(GET_POSTS)
  const [createPostAuthor] = useMutation(CREATE_POST_AUTHOR_REL, {
    onCompleted: () => {
      console.log('completed post->author relationship!')
    },
  })

  function CreatePostAuthorRel(payload) {
    console.log(payload)

    createPostAuthor({
      variables: payload,
    })
  }

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: (res) => {
      console.log('completed post creation!', res)

      const payload = {
        postId: res.CreatePost.postId,
        userId: '82c5c6da-6fa1-4432-a371-6b60cb2d52a7',
      }

      CreatePostAuthorRel(payload)
    },
  })

  const [postContent, setPostContent] = React.useState(null)

  return (
    <Paper style={{ padding: '2em' }}>
      <Title>Create Post</Title>

      <form
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault()
          const currentDateTime = new Date().toISOString()

          createPost({
            variables: {
              content: postContent,
              published: {
                formatted: currentDateTime,
              },
            },
          })

          setPostContent('')
        }}
      >
        <TextField
          id="publishPost"
          label="What is on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          margin="normal"
          variant="outlined"
          type="text"
        />
        <Button variant="contained" color="primary" type="submit">
          Publish
        </Button>
      </form>
      <Title>Feed</Title>
      {loading && !error && <p>Loading...</p>}
      {error && !loading && <p>Error</p>}
      {data &&
        !loading &&
        !error &&
        data.Post.map((p) => {
          return (
            <ul
              style={{
                listStyleType: 'none',
                padding: '20px',
                borderBottom: '1px solid #efefef',
              }}
              key={p.postId}
            >
              <li>postId: {p.postId}</li>
              <li>posted by {p.author.name}</li>
              <li>{moment(p.published.formatted).fromNow()}</li>
              <li>{p.content}</li>
            </ul>
          )
        })}
    </Paper>
  )
}

export default withStyles(styles)(Feed)

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Paper, TextField, Button } from '@material-ui/core'

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

const Feed = (props) => {
  const { classes } = props

  const { loading, data, error } = useQuery(GET_POSTS)
  const [createPost] = useMutation(CREATE_POST)
  const [postContent, setPostContent] = React.useState(null)

  return (
    <Paper style={{ padding: '2em' }}>
      <Title>Create Post</Title>

      <form
        className={classes.form}
        onSubmit={(e) => {
          e.preventDefault()
          const currentDateTime = new Date().toISOString()
          console.log(currentDateTime)

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
              <li>{p.postId}</li>
              <li>{p.published.formatted}</li>
              <li>{p.content}</li>
            </ul>
          )
        })}
    </Paper>
  )
}

export default withStyles(styles)(Feed)

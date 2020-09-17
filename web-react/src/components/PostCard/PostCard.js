import React from 'react'
import moment from 'moment'
import { Box, Paper, Button } from '@material-ui/core'

import BadgeAvatar from '../BadgeAvatar/BadgeAvatar'

const PostCard = ({ post, handleDeletePost }) => {
  return (
    <Paper className="post mb-4 py-5 px-4" rounded>
      <Box className="post__header">
        <Box className="flex items-center">
          <BadgeAvatar />
          <Box className="post__info flex flex-col">
            <span className="text-base">{post.author.name}</span>
            <span>{moment(post.published.formatted).fromNow()}</span>
          </Box>
        </Box>
      </Box>
      <Box className="post__content px-3 py-4 text-base">{post.content}</Box>
      <Box className="post__actions border-t border-b border-gray-300">
        <Box className="post__actions-inner w-full flex justify-evenly">
          <Button className="w-1/2">Like</Button>
          <Button className="w-1/2">Comment</Button>
        </Box>
      </Box>
      <Box className="mt-3 flex justify-end">
        <Button value={post.postId} onClick={(e) => handleDeletePost(e)}>
          Delete Post
        </Button>
      </Box>
    </Paper>
  )
}

export default PostCard

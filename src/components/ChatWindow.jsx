import { CHAT_DATA } from '@/data/data'
import React from 'react'

const ChatWindow = () => {
  return (
    <div>
      {CHAT_DATA.map((message) => (
        <div key={message.key} style={{display: 'flex', width: '100%'}}>
          <div>
            {message.prompt}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatWindow
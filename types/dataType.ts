type statistics = {
  allMessages: number
  allTexts: number
  allImages: number
  allVideos: number
  allStanps: number
  allCalls: number
  Mentioned: number
}

type user = {
  name: string
  joined: Date
  statistics: statistics
}

type message = {
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'stanp' | 'call'
  text?: string
  user: user
  date: Date
}

type day = {
  date: string
  allMessages: number
  allTexts: number
  allImages: number
  allVideos: number
  allStanps: number
  allCalls: number
}

type dataType = {
  users: user[]
  messages: message[]
  days: day[]
}

export default dataType

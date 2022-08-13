import dataType from '../types/dataType'

const analysis = (text: string): dataType => {
  let data: dataType = {
    users: [],
    messages: [],
    days: [],
  }
  const lines = text.split('\n')
  const dayList = text.match(/\d{4}[/]\d{1,2}[/]\d{1,2}\(.\)/g) || []
  const days: string[] = []
  dayList.forEach((day) => {
    const startLine = lines.indexOf(day)
    let endLine = lines.indexOf(dayList[dayList.indexOf(day) + 1])
    if (endLine === -1) endLine = lines.length
    const dayData = lines.slice(startLine, endLine)
    days.push(dayData.join('\n'))
  })
  console.log(days)
  if (days)
    days.forEach((dayMessageData) => {
      const day = dayMessageData.split('\n')[0]
      data.days.push({
        date: day,
        allMessages: 0,
        allTexts: 0,
        allImages: 0,
        allVideos: 0,
        allStanps: 0,
        allCalls: 0,
      })
      const dayData = data.days.find((d) => d.date === day)
      const messages = dayMessageData.match(/(\d{2}:\d{2})\t(.*)\t(.*)/g)
      if (messages)
        messages.forEach((message) => {
          const [time, user, text] = message.split('\t')
          const date = new Date(day.split('\n')[0].slice(0, -3) + ' ' + time)
          let messageType: dataType['messages'][0]['type']

          /**ユーザー */
          let userData = data.users.find((_user) => _user.name === user)
          if (!userData) {
            data.users.push({
              name: user,
              joined: date,
              statistics: {
                allMessages: 0,
                allTexts: 0,
                allImages: 0,
                allVideos: 0,
                allStanps: 0,
                allCalls: 0,
                Mentioned: 0,
              },
            })
            userData = data.users.find((_user) => _user.name === user)
          }
          if (!userData) return
          userData.statistics.allMessages++
          switch (text) {
            case '[写真]':
              userData.statistics.allImages++
              messageType = 'image'
              break
            case '[動画]':
              userData.statistics.allVideos++
              messageType = 'video'
              break
            case '[スタンプ]':
              userData.statistics.allStanps++
              messageType = 'stanp'
              break
            case 'グループ音声通話が開始されました。':
              userData.statistics.allCalls++
              messageType = 'call'
              break
            default:
              userData.statistics.allTexts++
              messageType = 'text'
          }

          /**メッセージ */
          data.messages.push({
            type: messageType,
            text: text,
            user: userData,
            date: date,
          })

          /**日付 */
          dayData!.allMessages++
          switch (messageType) {
            case 'image':
              dayData!.allImages++
            case 'video':
              dayData!.allVideos++
            case 'stanp':
              dayData!.allStanps++
            case 'call':
              dayData!.allCalls++
            default:
              dayData!.allTexts++
          }
        })
    })
  console.log(data)
  return data
}

export default analysis

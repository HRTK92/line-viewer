import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import analysis from '../lib/analysis'
import dataType from '../types/dataType'

const Home: NextPage = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    Title,
    LineElement,
    Legend,
    Tooltip
  )

  const [text, setText] = useState('')
  const [result, setResult] = useState<dataType>()
  const [dateList, setDateList] = useState<string[]>([])
  const [loding, setLoding] = useState(false)

  const showFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setText(text)
    }
    if (e.target.files) {
      reader.readAsText(e.target.files[0])
    }
  }

  const createDateList = (data: dataType) => {
    const dateList: string[] = []
    data.days.forEach((day) => {
      dateList.push(day.date)
    })
    return dateList
  }
  const createDataList = (data: dataType) => {
    const dataList: number[] = []
    data.days.forEach((day) => {
      dataList.push(day.allMessages)
    })
    return dataList
  }
  return (
    <>
      <Head>
        <title>line viewer</title>
        <meta name='description' content='line viewer' />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </Head>

      <main>
        {result ? (
          <>
            <div className='w-full px-4 py-4'>
              <div className='container items-center border rounded-lg'>
                <table className='table-auto w-full'>
                  <thead>
                    <tr>
                      <th className='px-4 py-2'>名前</th>
                      <th className='px-4 py-2'>メッセージ数</th>
                      <th className='px-4 py-2'>テキスト</th>
                      <th className='px-4 py-2'>画像数</th>
                      <th className='px-4 py-2'>動画</th>
                      <th className='px-4 py-2'>スタンプ</th>
                      <th className='px-4 py-2'>メンション</th>
                      <th className='px-4 py-2'>通話を開いた回数</th>
                      <th className='px-4 py-2'>最大連続発言数</th>
                      <th className='px-4 py-2'>初発言日</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.users.map((user) => (
                      <tr
                        className={result.users.indexOf(user) % 2 === 0 ? 'bg-gray-100' : ''}
                        key={user.name}
                      >
                        <td className='border px-4 py-2'>{user.name}</td>
                        <td className='border px-4 py-2'>{user.statistics.allMessages}</td>
                        <td className='border px-4 py-2'>{user.statistics.allTexts}</td>
                        <td className='border px-4 py-2'>{user.statistics.allImages}</td>
                        <td className='border px-4 py-2'>{user.statistics.allVideos}</td>
                        <td className='border px-4 py-2'>{user.statistics.allStanps}</td>
                        <td className='border px-4 py-2'>{user.statistics.Mentioned}</td>
                        <td className='border px-4 py-2'>{user.statistics.allCalls}</td>
                        <td className='border px-4 py-2'>{null}</td>
                        <td className='border px-4 py-2'>{user.joined.toISOString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='container items-center border rounded-lg'>
                <Line
                  data={{
                    labels: createDateList(result),
                    datasets: [
                      {
                        label: 'メッセージ数',
                        data: createDataList(result),
                        borderWidth: 1,
                        backgroundColor: 'blue',
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {text ? (
              <>
                <button
                  className='rounded bg-blue-500 text-white px-2 py-2'
                  onClick={() => setResult(analysis(text))}
                >
                  解析を始める
                </button>
              </>
            ) : (
              <input type='file' onChange={showFile} />
            )}
          </>
        )}
      </main>
    </>
  )
}

export default Home
